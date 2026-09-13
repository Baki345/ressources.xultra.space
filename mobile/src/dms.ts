/* Couche de données DM — lecture directe Appwrite (comme worker.js
 * loadDms()/appendNewMessages()), envoi via le Worker (voir src/api.ts).
 *
 * DM 1:1 ET DM de groupe : un message de groupe chiffré porte un `keysJson`
 * (clé de message éphémère enveloppée par membre, voir
 * e2eGetMessageKeyContext/e2eResolveIncomingKey dans worker.js) ; un message
 * 1:1 utilise directement la clé de session pairwise, sans keysJson — même
 * distinction que côté web.
 *
 * Pièces jointes (images/fichiers) : chiffrées AES-GCM avec EXACTEMENT la
 * même clé de message que le texte qui les accompagne (une seule clé de
 * message par envoi, voir resolveOutgoingMessageKey ci-dessous — identique
 * à e2eGetMessageKeyContext() côté worker.js), puis uploadées telles quelles
 * (octets chiffrés opaques) dans le bucket Appwrite `ultravoc_media` en
 * lecture publique — la confidentialité vient du chiffrement, jamais d'une
 * permission Appwrite restreinte, exactement comme côté web.
 */
import { ID, Permission, Query, Role } from 'react-native-appwrite';
import { File, Paths } from 'expo-file-system';

import { APPWRITE_BUCKET_ID, APPWRITE_DATABASE_ID, databases, storage } from './appwrite';
import { apiPost } from './api';
import {
  bytesToB64,
  decryptBytesWithKey,
  decryptTextWithKey,
  e2eThreadKey,
  encryptBytesWithKey,
  encryptTextWithKey,
  generateGroupMessageKey,
  unwrapGroupMessageKeyFromSender,
  wrapGroupMessageKeyForMember,
  type E2EPrivateJwk,
} from './e2e';

const UNREADABLE_TEXT = '🔒 Message illisible sur cet appareil';

/** Identique à fmtSize() côté worker.js — même échelle, pour afficher le
 * poids d'une pièce jointe fichier de façon cohérente avec le site. */
export function fmtFileSize(bytes: number): string {
  const n = Number(bytes) || 0;
  if (n < 1024) return n + ' o';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' Ko';
  return (n / 1024 / 1024).toFixed(1) + ' Mo';
}

export interface DmThread {
  $id: string;
  members: string[];
  displayName?: string;
  lastMessage?: string;
  unreadJson?: string;
  $updatedAt: string;
}

export interface DmMessage {
  $id: string;
  threadId: string;
  uid: string;
  displayName: string;
  type: string;
  text: string;
  mediaUrl: string;
  mime?: string;
  enc: boolean;
  keysJson?: string;
  replyToId?: string;
  $createdAt: string;
}

/** Métadonnées d'un fichier générique (type='file') — le `text` du message
 * porte ce JSON (chiffré comme n'importe quel texte), jamais le nom/poids en
 * clair dans un champ dédié : même convention que sendMessage()/
 * attemptDecryptMessage() côté worker.js. */
export interface DmFileMeta {
  name: string;
  size: number;
  mime: string;
}

/** Un message prêt à afficher : texte déchiffré (légende pour une image,
 * vide pour un fichier générique), et pour une pièce jointe soit une data
 * URI directement utilisable par <Image>, soit les métadonnées d'un fichier
 * générique. mediaFailed distingue « pas de média sur ce message » d'un
 * déchiffrement de média qui a échoué (clé absente, blob corrompu...). */
export interface DecryptedDmMessage extends DmMessage {
  plainText: string;
  mediaUri?: string;
  fileMeta?: DmFileMeta;
  mediaFailed?: boolean;
}

export interface UserProfile {
  authUserId: string;
  username?: string;
  displayName?: string;
  avatar?: string;
}

const profileCache: Record<string, UserProfile | null> = {};

/** Profil public (pseudo/avatar) d'un uid, en cache mémoire pour la session
 * — même collection `users` que resolveProfile() côté worker.js. Utilisé
 * pour afficher un nom lisible plutôt que le uid brut dans la liste des DM. */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (profileCache[uid] !== undefined) return profileCache[uid];
  try {
    const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'users', [
      Query.equal('authUserId', uid),
      Query.limit(1),
    ]);
    const profile = (r.documents[0] as unknown as UserProfile) || null;
    profileCache[uid] = profile;
    return profile;
  } catch {
    profileCache[uid] = null;
    return null;
  }
}

export function dmIsGroup(dm: DmThread): boolean {
  return (dm.members || []).length > 2;
}

export function dmPeerId(dm: DmThread, myUid: string): string {
  return (dm.members || []).map(String).find((m) => m !== myUid) || '';
}

/** Identique à loadDms() côté web : toutes les conversations dont je suis
 * membre, les plus récemment actives en premier. */
export async function loadDms(myUid: string): Promise<DmThread[]> {
  const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'dms', [
    Query.orderDesc('$updatedAt'),
    Query.limit(100),
  ]);
  return (r.documents as unknown as DmThread[]).filter((d) => (d.members || []).map(String).includes(myUid));
}

/** Les 60 derniers messages d'un thread (plus récents en premier), comme
 * loadDmMessages() côté web. */
export async function loadThreadMessages(threadId: string): Promise<DmMessage[]> {
  const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'dms_messages', [
    Query.equal('threadId', threadId),
    Query.orderDesc('$createdAt'),
    Query.limit(60),
  ]);
  return r.documents as unknown as DmMessage[];
}

/** Résout la clé AES applicable à CE message précis : sa propre enveloppe
 * dans keysJson pour un message de groupe, ou la clé de session pairwise
 * pour un 1:1 — identique à e2eResolveIncomingKey() côté web. */
async function resolveIncomingKeyBytes(
  myUid: string,
  myJwk: E2EPrivateJwk,
  m: DmMessage
): Promise<Uint8Array | null> {
  if (m.keysJson) {
    let map: Record<string, string> = {};
    try {
      map = JSON.parse(m.keysJson);
    } catch {
      return null;
    }
    const mine = map[myUid];
    if (!mine) return null;
    try {
      return await unwrapGroupMessageKeyFromSender(myUid, myJwk, m.uid, mine);
    } catch {
      return null;
    }
  }
  return e2eThreadKey(myUid, myJwk, m.uid);
}

/** Déchiffre le texte d'un message (1:1 ou groupe), avec le même texte de
 * repli que côté web quand la clé locale ne correspond pas (ex. clé
 * régénérée sur un autre appareil sans restauration par mot de passe). Un
 * message non chiffré (`enc:false`, ex. reçu avant l'activation de l'E2E, ou
 * message système) est renvoyé tel quel. */
export async function decryptDmMessageText(
  myUid: string,
  myJwk: E2EPrivateJwk | null,
  m: DmMessage
): Promise<string> {
  if (!m.enc) return m.text || '';
  if (!myJwk) return UNREADABLE_TEXT;
  try {
    const key = await resolveIncomingKeyBytes(myUid, myJwk, m);
    if (!key) return UNREADABLE_TEXT;
    return decryptTextWithKey(key, m.text);
  } catch {
    return UNREADABLE_TEXT;
  }
}

/** Résout LA clé de message à utiliser pour UN envoi (texte et/ou pièce
 * jointe — toujours la même clé pour les deux, comme e2eGetMessageKeyContext()
 * côté worker.js) : clé de session pairwise pour un 1:1, ou clé éphémère
 * fraîche enveloppée pour chaque membre pour un groupe. Renvoie `null` si
 * aucune clé n'a pu être établie (pas de clé locale, pic clé publique de
 * l'unique destinataire introuvable) — l'appelant envoie alors en clair
 * (`enc:false`), même repli que côté web plutôt qu'un échec bloquant. */
async function resolveOutgoingMessageKey(
  myUid: string,
  myJwk: E2EPrivateJwk | null,
  dm: DmThread
): Promise<{ key: Uint8Array; keysJson: string } | null> {
  if (!myJwk) return null;
  if (dmIsGroup(dm)) {
    const members = (dm.members || []).map(String).filter((u) => u !== myUid);
    const groupKey = generateGroupMessageKey();
    const keysObj: Record<string, string> = {};
    for (const uid of members) {
      const wrapped = await wrapGroupMessageKeyForMember(myUid, myJwk, uid, groupKey);
      if (wrapped) keysObj[uid] = wrapped;
    }
    if (!Object.keys(keysObj).length) return null;
    return { key: groupKey, keysJson: JSON.stringify(keysObj) };
  }
  const peerUid = dmPeerId(dm, myUid);
  if (!peerUid) return null;
  const key = await e2eThreadKey(myUid, myJwk, peerUid);
  return key ? { key, keysJson: '' } : null;
}

/** Chiffre et envoie un message texte vers un DM 1:1 ou de groupe, via la
 * même route Worker que le site (/api/dms/messages/send) — jamais une
 * écriture directe dans dms_messages, qui contournerait la validation
 * serveur (appartenance au thread, notifications, taille des pièces
 * jointes...). Un groupe utilise une clé de message éphémère enveloppée pour
 * chaque membre (voir e2eGetMessageKeyContext côté worker.js) ; un 1:1 utilise
 * directement la clé de session pairwise. */
export async function sendDmText(
  myUid: string,
  myJwk: E2EPrivateJwk | null,
  displayName: string,
  dm: DmThread,
  text: string
): Promise<void> {
  const keyCtx = await resolveOutgoingMessageKey(myUid, myJwk, dm);
  const outText = keyCtx ? encryptTextWithKey(keyCtx.key, text) : text;
  await apiPost('/api/dms/messages/send', {
    threadId: dm.$id,
    displayName,
    type: 'text',
    text: outText,
    mediaUrl: '',
    replyToId: '',
    enc: !!keyCtx,
    keysJson: keyCtx ? keyCtx.keysJson : '',
    contentFlag: '',
  });
}

const ATTACHMENT_BUCKET_FOLDER = 'xultra-dm-attach';

/** Chiffre et téléverse une pièce jointe (image ou fichier générique) vers un
 * DM 1:1 ou de groupe, puis envoie le message qui la référence — même schéma
 * de chiffrement que le texte (voir resolveOutgoingMessageKey), une seule
 * clé de message pour le blob ET la légende/les métadonnées. `bytes` doit
 * déjà être en mémoire (lu depuis le fichier local choisi par l'utilisateur,
 * voir les écrans) : cette fonction ne connaît que le contenu binaire, pas
 * la provenance (galerie photo, sélecteur de fichier générique...). Un
 * fichier chiffré temporaire est écrit dans le cache de l'app le temps de
 * l'upload (le SDK Appwrite React Native lit les fichiers par URI, jamais
 * par Blob comme le SDK web) puis supprimé, que l'upload réussisse ou non. */
export async function sendDmAttachment(
  myUid: string,
  myJwk: E2EPrivateJwk | null,
  displayName: string,
  dm: DmThread,
  opts: {
    kind: 'image' | 'file';
    bytes: Uint8Array;
    mime: string;
    fileName?: string;
    fileSize?: number;
    caption?: string;
  }
): Promise<void> {
  const keyCtx = await resolveOutgoingMessageKey(myUid, myJwk, dm);
  const uploadBytes = keyCtx ? encryptBytesWithKey(keyCtx.key, opts.bytes) : opts.bytes;

  const fileId = ID.unique();
  const tmpFile = new File(Paths.cache, ATTACHMENT_BUCKET_FOLDER + '-' + fileId + '.bin');
  tmpFile.write(uploadBytes);
  try {
    await storage.createFile({
      bucketId: APPWRITE_BUCKET_ID,
      fileId,
      file: {
        name: opts.fileName || fileId,
        type: 'application/octet-stream',
        size: uploadBytes.byteLength,
        uri: tmpFile.uri,
      },
      permissions: [Permission.read(Role.any())],
    });
  } finally {
    try {
      tmpFile.delete();
    } catch {
      // Best-effort — un fichier de cache orphelin n'est pas grave (le
      // système peut le récupérer à tout moment, voir Paths.cache).
    }
  }
  const mediaUrl = storage.getFileViewURL(APPWRITE_BUCKET_ID, fileId).toString();

  let plainMeta = '';
  if (opts.kind === 'file') {
    const meta: DmFileMeta = { name: opts.fileName || 'fichier', size: opts.fileSize ?? opts.bytes.byteLength, mime: opts.mime };
    plainMeta = JSON.stringify(meta);
  } else if (opts.caption) {
    plainMeta = opts.caption;
  }
  const outText = plainMeta && keyCtx ? encryptTextWithKey(keyCtx.key, plainMeta) : plainMeta;

  await apiPost('/api/dms/messages/send', {
    threadId: dm.$id,
    displayName,
    type: opts.kind,
    text: outText,
    mediaUrl,
    mime: opts.mime,
    replyToId: '',
    enc: !!keyCtx,
    keysJson: keyCtx ? keyCtx.keysJson : '',
    contentFlag: '',
  });
}

/** Télécharge et déchiffre le média d'un message (image ou fichier) — clé
 * résolue exactement comme pour le texte du même message (même enveloppe
 * keysJson pour un groupe). Renvoie `null` en cas d'échec (pas de clé,
 * réseau, blob corrompu) plutôt que de lever, pour laisser l'appelant
 * afficher un état "illisible" sans planter le rendu des autres messages. */
async function decryptDmMessageMedia(myUid: string, myJwk: E2EPrivateJwk | null, m: DmMessage): Promise<Uint8Array | null> {
  if (!m.mediaUrl) return null;
  try {
    const r = await fetch(m.mediaUrl);
    const buf = new Uint8Array(await r.arrayBuffer());
    if (!m.enc) return buf;
    if (!myJwk) return null;
    const key = await resolveIncomingKeyBytes(myUid, myJwk, m);
    if (!key) return null;
    return decryptBytesWithKey(key, buf);
  } catch {
    return null;
  }
}

/** Prépare un message pour l'affichage, quel que soit son type : texte
 * déchiffré pour 'text', légende + data URI déchiffrée pour 'image',
 * métadonnées déchiffrées pour 'file'. Centralise ici (plutôt que dans
 * chaque écran) toute la logique "quelle partie du message déchiffrer et
 * comment l'interpréter", testable sans dépendance React Native. */
export async function decryptDmMessageForDisplay(
  myUid: string,
  myJwk: E2EPrivateJwk | null,
  m: DmMessage
): Promise<DecryptedDmMessage> {
  if (m.type === 'image') {
    const plainText = m.text ? await decryptDmMessageText(myUid, myJwk, m) : '';
    const bytes = await decryptDmMessageMedia(myUid, myJwk, m);
    if (!bytes) return { ...m, plainText, mediaFailed: true };
    return { ...m, plainText, mediaUri: 'data:' + (m.mime || 'image/jpeg') + ';base64,' + bytesToB64(bytes) };
  }
  if (m.type === 'file') {
    const metaText = await decryptDmMessageText(myUid, myJwk, m);
    try {
      const fileMeta = JSON.parse(metaText) as DmFileMeta;
      return { ...m, plainText: '', fileMeta };
    } catch {
      return { ...m, plainText: '', mediaFailed: true };
    }
  }
  return { ...m, plainText: await decryptDmMessageText(myUid, myJwk, m) };
}

/** Déchiffre puis écrit le média d'un message dans le cache local et renvoie
 * son URI — utilisé pour "ouvrir/partager" un fichier générique (voir
 * ServerChannelScreen/DmConversationScreen + expo-sharing), qui a besoin
 * d'un vrai fichier sur disque, contrairement à une image affichée en data
 * URI. Renvoie `null` en cas d'échec. */
export async function decryptDmAttachmentToFile(
  myUid: string,
  myJwk: E2EPrivateJwk | null,
  m: DmMessage,
  fileName: string
): Promise<string | null> {
  const bytes = await decryptDmMessageMedia(myUid, myJwk, m);
  if (!bytes) return null;
  try {
    const out = new File(Paths.cache, fileName);
    out.write(bytes);
    return out.uri;
  } catch {
    return null;
  }
}
