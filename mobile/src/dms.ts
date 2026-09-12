/* Couche de données DM — lecture directe Appwrite (comme worker.js
 * loadDms()/appendNewMessages()), envoi via le Worker (voir src/api.ts).
 *
 * Portée actuelle : conversations 1:1 uniquement. Les DM de groupe existent
 * côté site (déchiffrement par clé de message enveloppée par membre, voir
 * e2eGetMessageKeyContext dans worker.js) mais ne sont pas encore portés ici
 * — un thread de groupe s'affichera dans la liste mais l'envoi/déchiffrement
 * de messages y échouera proprement (texte de repli) plutôt que de planter.
 */
import { Query } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';
import { apiPost } from './api';
import { decryptTextWithKey, e2eEncryptText, e2eThreadKey, type E2EPrivateJwk } from './e2e';

const UNREADABLE_TEXT = '🔒 Message illisible sur cet appareil';

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

/** Déchiffre le texte d'un message pour un thread 1:1, avec le même texte de
 * repli que côté web quand la clé locale ne correspond pas (ex. clé
 * régénérée sur un autre appareil sans restauration par mot de passe). Un
 * message non chiffré (`enc:false`, ex. reçu avant l'activation de l'E2E, ou
 * message système) est renvoyé tel quel. */
export async function decryptDmMessageText(
  myUid: string,
  myJwk: E2EPrivateJwk | null,
  dm: DmThread,
  m: DmMessage
): Promise<string> {
  if (!m.enc) return m.text || '';
  if (!myJwk || dmIsGroup(dm)) return UNREADABLE_TEXT;
  const peerUid = dmPeerId(dm, myUid);
  try {
    const key = await e2eThreadKey(myUid, myJwk, peerUid);
    if (!key) return UNREADABLE_TEXT;
    return decryptTextWithKey(key, m.text);
  } catch {
    return UNREADABLE_TEXT;
  }
}

/** Chiffre et envoie un message texte vers un DM 1:1, via la même route
 * Worker que le site (/api/dms/messages/send) — jamais une écriture directe
 * dans dms_messages, qui contournerait la validation serveur (appartenance
 * au thread, notifications, taille des pièces jointes...). */
export async function sendDmText(
  myUid: string,
  myJwk: E2EPrivateJwk | null,
  displayName: string,
  dm: DmThread,
  text: string
): Promise<void> {
  if (dmIsGroup(dm)) throw new Error('Envoi vers un DM de groupe pas encore pris en charge sur mobile.');
  const peerUid = dmPeerId(dm, myUid);
  let outText = text;
  let enc = false;
  if (myJwk && peerUid) {
    const encrypted = await e2eEncryptText(myUid, myJwk, peerUid, text);
    if (encrypted) {
      outText = encrypted;
      enc = true;
    }
  }
  await apiPost('/api/dms/messages/send', {
    threadId: dm.$id,
    displayName,
    type: 'text',
    text: outText,
    mediaUrl: '',
    replyToId: '',
    enc,
    keysJson: '',
    contentFlag: '',
  });
}
