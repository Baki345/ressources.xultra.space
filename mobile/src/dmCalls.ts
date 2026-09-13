/* Appels vocaux de groupe en DM — voir worker.js, "Appels de groupe (salons
 * vocaux) via LiveKit" (/api/call/group-token, /api/call/group-presence/join).
 * Architecturalement identique aux salons vocaux de serveur (src/voice.ts) :
 * même jeton LiveKit, même schéma de présence (heartbeat 60s, abandon après
 * 2 min sans rafraîchissement) — seules la room LiveKit ("xu-dm-"+dmId au
 * lieu de "xu-channel-"+channelId) et la collection de présence
 * (`group_call_presence` au lieu de `server_voice_presence`) changent.
 *
 * Réservé aux DM de GROUPE (3+ membres, voir dmIsGroup() dans src/dms.ts) —
 * un DM 1:1 utilise une architecture entièrement différente côté web (WebRTC
 * brut pair-à-pair avec sonnerie/accepter/refuser via `direct_calls`, jamais
 * LiveKit) et reste hors scope ici, voir mobile/README.md.
 */
import { Query } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';
import { apiPost } from './api';

export interface GroupCallToken {
  token: string;
  wsUrl: string;
  room: string;
}

export interface GroupCallPresence {
  $id: string;
  dmId: string;
  uid: string;
  username: string;
  $updatedAt: string;
}

/** Jeton d'accès LiveKit pour rejoindre le salon vocal de CE groupe précis
 * — voir /api/call/group-token côté worker.js (vérifie que je suis bien
 * membre du groupe avant de signer le jeton). */
export async function fetchGroupCallToken(dmId: string): Promise<GroupCallToken> {
  return apiPost<GroupCallToken>('/api/call/group-token', { dmId });
}

/** Crée/met à jour mon document de présence dans l'appel — voir
 * /api/call/group-presence/join côté worker.js, qui donne aussi la lecture
 * à TOUS les membres du groupe (jamais moi seul) et notifie les autres
 * membres du groupe si je suis la première personne à rejoindre. */
export async function joinGroupCallPresence(dmId: string): Promise<{ docId: string }> {
  return apiPost<{ docId: string }>('/api/call/group-presence/join', { dmId });
}

// Identique au filet de sécurité utilisé côté worker.js pour
// group_call_presence (voir /api/call/group-presence/join, isFirstJoiner) et
// à STALE_PRESENCE_MS dans src/voice.ts : une présence non rafraîchie depuis
// plus de 2 minutes est traitée comme abandonnée.
const STALE_PRESENCE_MS = 120000;

/** Qui est connecté à l'appel de groupe de ce DM, présences abandonnées
 * ignorées — lecture directe Appwrite (permissions déjà posées par
 * joinGroupCallPresence). */
export async function loadGroupCallPresence(dmId: string): Promise<GroupCallPresence[]> {
  const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'group_call_presence', [
    Query.equal('dmId', dmId),
    Query.limit(50),
  ]);
  const cutoff = Date.now() - STALE_PRESENCE_MS;
  return (r.documents as unknown as GroupCallPresence[]).filter((d) => new Date(d.$updatedAt).getTime() > cutoff);
}

/** Rafraîchit mon document de présence (toutes les 60s pendant l'appel). */
export async function sendGroupCallHeartbeat(docId: string, username: string): Promise<void> {
  await databases.updateDocument(APPWRITE_DATABASE_ID, 'group_call_presence', docId, { username });
}

/** Quitte l'appel : supprime mon document de présence. */
export async function leaveGroupCallPresence(docId: string): Promise<void> {
  await databases.deleteDocument(APPWRITE_DATABASE_ID, 'group_call_presence', docId);
}
