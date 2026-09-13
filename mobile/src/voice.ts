/* Salons vocaux de serveur — voir worker.js, section "Vocal LiveKit"
 * (mintLiveKitParticipantToken, /api/servers/voice-token,
 * /api/servers/channels/voice-presence/join). Connexion réelle au SFU
 * LiveKit gérée par src/screens/ServerVoiceScreen.tsx (@livekit/react-native,
 * du code natif WebRTC — nécessite une vraie build de développement EAS,
 * Expo Go ne peut pas le charger, voir mobile/README.md) ; ce module ne
 * couvre QUE la partie Appwrite/Worker (jeton, présence), pour rester
 * testable en Jest sans dépendre de LiveKit.
 *
 * Portée volontairement limitée à cette première version : salons VOCAUX
 * uniquement, audio seul (pas de caméra/partage d'écran). Les salons de
 * SCÈNE (server_stage_state, demandes de parole, modération des orateurs)
 * restent hors scope — une fonctionnalité à part entière côté web.
 */
import { Query } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';
import { apiPost } from './api';

export interface VoiceToken {
  token: string;
  wsUrl: string;
  room: string;
  canPublish: boolean;
  audioQualityKey: string;
}

export interface VoicePresence {
  $id: string;
  serverId: string;
  channelId: string;
  uid: string;
  username: string;
  cameraOn: boolean;
  speaking: boolean;
  handRaised: boolean;
  $updatedAt: string;
}

/** Jeton d'accès LiveKit pour rejoindre CE salon vocal précis — voir
 * /api/servers/voice-token côté worker.js. `canPublish` n'est jamais faux
 * pour un salon vocal classique (seule une scène restreint qui peut publier
 * son micro), gardé ici pour rester fidèle à la forme de la réponse. */
export async function fetchVoiceToken(serverId: string, channelId: string): Promise<VoiceToken> {
  return apiPost<VoiceToken>('/api/servers/voice-token', { serverId, channelId });
}

/** Crée/mets à jour mon document de présence dans ce salon — id
 * déterministe (channelId+uid) côté Worker, qui calcule aussi les
 * permissions de lecture (seuls les membres qui voient déjà ce salon
 * peuvent voir qui y est connecté) — voir
 * /api/servers/channels/voice-presence/join. Jamais d'écriture directe. */
export async function joinVoicePresence(serverId: string, channelId: string): Promise<{ docId: string }> {
  return apiPost<{ docId: string }>('/api/servers/channels/voice-presence/join', { serverId, channelId });
}

// Identique au filet de sécurité de loadServerVoicePresence() côté
// worker.js : une présence non rafraîchie depuis plus de 2 minutes
// (heartbeat coupé sans nettoyage propre — crash, perte réseau) est traitée
// comme abandonnée plutôt que montrée indéfiniment.
const STALE_PRESENCE_MS = 120000;

/** Qui est connecté à ce salon vocal précis, présences abandonnées
 * ignorées — lecture directe Appwrite (permissions déjà posées par
 * joinVoicePresence), comme loadServerVoicePresence() côté web. */
export async function loadVoicePresence(channelId: string): Promise<VoicePresence[]> {
  const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'server_voice_presence', [
    Query.equal('channelId', channelId),
    Query.limit(200),
  ]);
  const cutoff = Date.now() - STALE_PRESENCE_MS;
  return (r.documents as unknown as VoicePresence[]).filter((d) => new Date(d.$updatedAt).getTime() > cutoff);
}

/** Rafraîchit mon document de présence (toutes les 60s pendant que je suis
 * connecté, comme startGroupHeartbeat() côté web) pour ne jamais passer
 * sous le seuil d'abandon ci-dessus tant que je suis réellement là. */
export async function sendVoiceHeartbeat(docId: string, username: string): Promise<void> {
  await databases.updateDocument(APPWRITE_DATABASE_ID, 'server_voice_presence', docId, { username });
}

/** Quitte le salon : supprime mon document de présence — jamais laissé
 * traîner après un départ volontaire (voir cleanupGroupCall() côté web). */
export async function leaveVoicePresence(docId: string): Promise<void> {
  await databases.deleteDocument(APPWRITE_DATABASE_ID, 'server_voice_presence', docId);
}
