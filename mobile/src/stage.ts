/* Salons de SCÈNE de serveur — voir worker.js, "Salons de scène (§ stage
 * channels)" (server_stage_state, /api/servers/stage/*). Une scène a deux
 * rôles : orateur (micro publié) et public (écoute seule) ; qui est orateur
 * est décidé UNIQUEMENT côté Worker (jamais localement), ce module n'en est
 * qu'un miroir. Modération : qui peut gérer le vocal du serveur peut
 * approuver/refuser une demande de parole et retirer un orateur ; n'importe
 * quel orateur peut aussi descendre de scène lui-même.
 *
 * Détail important (voir wireStageBody()/loadStageChannel() côté worker.js) :
 * le droit de publier son micro est figé dans le jeton LiveKit au moment de
 * la connexion (voir src/voice.ts, VoiceToken.canPublish) — être approuvé
 * comme orateur PENDANT que je suis déjà connecté ne me donne donc PAS le
 * droit de parler tant que je n'ai pas reconnecté avec un jeton frais. C'est
 * pour ça que ServerVoiceScreen.tsx surveille amSpeaker et reconnecte
 * entièrement (nouveau jeton, donc nouveau canPublish) dès qu'il change,
 * exactement comme le fait le site (leaveGroupCall() puis joinVoiceRoom()).
 */
import { apiPost } from './api';

export interface StageSpeaker {
  uid: string;
  name: string;
}

export interface StageRequest {
  uid: string;
  name: string;
  at: string;
}

export interface StageState {
  topic: string;
  speakers: StageSpeaker[];
  /** Toujours vide si je ne suis pas modérateur — le Worker ne renvoie les
   * demandes qu'à qui peut les traiter (voir /api/servers/stage/state). */
  requests: StageRequest[];
  isMod: boolean;
  amSpeaker: boolean;
  myRequestPending: boolean;
}

export async function fetchStageState(serverId: string, channelId: string): Promise<StageState> {
  return apiPost<StageState>('/api/servers/stage/state', { serverId, channelId });
}

/** Lève la main — met ma demande en file d'attente, ne me rend PAS orateur
 * tant qu'un modérateur ne l'a pas approuvée (voir addStageSpeaker). */
export async function requestToSpeak(serverId: string, channelId: string): Promise<void> {
  await apiPost('/api/servers/stage/request-speak', { serverId, channelId });
}

export async function cancelSpeakRequest(serverId: string, channelId: string): Promise<void> {
  await apiPost('/api/servers/stage/cancel-request', { serverId, channelId });
}

/** Modération : refuse la demande d'un membre précis. */
export async function declineSpeakRequest(serverId: string, channelId: string, uid: string): Promise<void> {
  await apiPost('/api/servers/stage/decline-request', { serverId, channelId, uid });
}

/** Modération : approuve une demande en attente (ou ajoute directement
 * quelqu'un comme orateur, même sans demande préalable). */
export async function addStageSpeaker(serverId: string, channelId: string, uid: string): Promise<void> {
  await apiPost('/api/servers/stage/add-speaker', { serverId, channelId, uid });
}

/** Retire un orateur — `uid` omis retire l'appelant lui-même ("descendre de
 * scène"), toujours permis ; retirer quelqu'un d'autre est réservé à la
 * modération (voir /api/servers/stage/remove-speaker côté worker.js). */
export async function removeStageSpeaker(serverId: string, channelId: string, uid?: string): Promise<void> {
  await apiPost('/api/servers/stage/remove-speaker', { serverId, channelId, uid: uid || '' });
}

/** Modération : change le sujet affiché en haut de la scène. */
export async function setStageTopic(serverId: string, channelId: string, topic: string): Promise<string> {
  const r = await apiPost<{ topic: string }>('/api/servers/stage/set-topic', { serverId, channelId, topic });
  return r.topic;
}
