/* Couche de données DM — lecture directe Appwrite (comme worker.js
 * loadDms()/appendNewMessages()), envoi via le Worker (voir src/api.ts).
 *
 * DM 1:1 ET DM de groupe : un message de groupe chiffré porte un `keysJson`
 * (clé de message éphémère enveloppée par membre, voir
 * e2eGetMessageKeyContext/e2eResolveIncomingKey dans worker.js) ; un message
 * 1:1 utilise directement la clé de session pairwise, sans keysJson — même
 * distinction que côté web.
 */
import { Query } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';
import { apiPost } from './api';
import {
  decryptTextWithKey,
  e2eEncryptText,
  e2eThreadKey,
  encryptTextWithKey,
  generateGroupMessageKey,
  unwrapGroupMessageKeyFromSender,
  wrapGroupMessageKeyForMember,
  type E2EPrivateJwk,
} from './e2e';

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
  let outText = text;
  let enc = false;
  let keysJson = '';
  if (myJwk) {
    if (dmIsGroup(dm)) {
      const members = (dm.members || []).map(String).filter((u) => u !== myUid);
      const groupKey = generateGroupMessageKey();
      const keysObj: Record<string, string> = {};
      for (const uid of members) {
        const wrapped = await wrapGroupMessageKeyForMember(myUid, myJwk, uid, groupKey);
        if (wrapped) keysObj[uid] = wrapped;
      }
      if (Object.keys(keysObj).length) {
        outText = encryptTextWithKey(groupKey, text);
        keysJson = JSON.stringify(keysObj);
        enc = true;
      }
    } else {
      const peerUid = dmPeerId(dm, myUid);
      if (peerUid) {
        const encrypted = await e2eEncryptText(myUid, myJwk, peerUid, text);
        if (encrypted) {
          outText = encrypted;
          enc = true;
        }
      }
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
    keysJson,
    contentFlag: '',
  });
}
