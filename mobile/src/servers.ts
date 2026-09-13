/* Couche de données Serveurs — même principe que src/dms.ts : la liste "mes
 * serveurs" se lit directement via Appwrite (comme loadMyServers() côté
 * web), mais les salons et leurs messages passent par les routes Worker
 * dédiées (/api/servers/channels/*) plutôt qu'une lecture Appwrite directe,
 * car elles seules savent calculer qui a le droit de VOIR un salon (rôles,
 * overwrites par salon, timeout...) — voir computeChannelAccess() dans
 * worker.js. Dupliquer cette logique de permissions côté mobile serait à la
 * fois risqué (un bug y exposerait un salon privé) et vite désynchronisé du
 * web à chaque évolution des permissions.
 *
 * Contrairement aux DM, les salons de serveur ne sont PAS chiffrés de bout
 * en bout (voir /api/servers/channels/messages/send côté worker.js : le
 * document créé n'a ni `enc` ni `keysJson`) — aucune couche de
 * chiffrement/déchiffrement nécessaire ici.
 *
 * Portée volontairement limitée à cette première version : salons TEXTE et
 * ANNONCES uniquement (lecture + envoi de texte simple). Vocal (LiveKit),
 * forum (fils de discussion) et pièces jointes restent hors scope — voir
 * mobile/README.md, "Ce qu'il reste".
 */
import { Query } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';
import { apiPost } from './api';

export interface Server {
  $id: string;
  name: string;
  description?: string;
  icon?: string;
  ownerId: string;
}

export type ChannelType = 'text' | 'voice' | 'stage' | 'forum' | 'announcement';

export interface ServerChannel {
  $id: string;
  serverId: string;
  categoryId?: string;
  name: string;
  type: ChannelType;
  position?: number;
  locked?: boolean;
}

export interface ServerCategory {
  $id: string;
  serverId: string;
  name: string;
  position?: number;
}

export interface ServerChannelMessage {
  $id: string;
  channelId: string;
  serverId: string;
  uid: string;
  username: string;
  text: string;
  type?: string;
  mediaUrl?: string;
  replyToId?: string;
  $createdAt: string;
}

/** Identique à loadMyServers() côté web : lecture directe de server_members
 * (mes memberships) puis des documents servers correspondants — chaque
 * échec individuel (serveur supprimé entre-temps, etc.) est ignoré plutôt
 * que de faire échouer toute la liste. */
export async function loadMyServers(myUid: string): Promise<Server[]> {
  const memList = await databases.listDocuments(APPWRITE_DATABASE_ID, 'server_members', [
    Query.equal('uid', myUid),
    Query.limit(100),
  ]);
  const servers: Server[] = [];
  for (const m of memList.documents as unknown as { serverId: string }[]) {
    try {
      const s = await databases.getDocument(APPWRITE_DATABASE_ID, 'servers', m.serverId);
      servers.push(s as unknown as Server);
    } catch {
      // Serveur supprimé ou inaccessible depuis — on continue avec les autres.
    }
  }
  return servers;
}

const TEXT_LIKE_TYPES: ChannelType[] = ['text', 'announcement'];

/** Salons TEXTE/ANNONCES que je peux VOIR sur ce serveur, triés par
 * position — le Worker filtre déjà par visibilité (voir
 * /api/servers/channels/list côté worker.js), donc tout salon renvoyé ici
 * est légitimement affichable. Vocal/forum/stage sont exclus (hors scope,
 * voir l'en-tête de ce fichier). */
export async function loadServerTextChannels(serverId: string): Promise<ServerChannel[]> {
  const r = await apiPost<{ channels: ServerChannel[] }>('/api/servers/channels/list', { serverId });
  return r.channels
    .filter((c) => TEXT_LIKE_TYPES.includes(c.type))
    .sort((a, b) => (a.position || 0) - (b.position || 0));
}

/** Les 60 derniers messages "racine" d'un salon (hors fils, voir
 * worker.js), plus récents en premier — même convention que
 * loadThreadMessages() dans src/dms.ts, consommée telle quelle par un
 * <FlatList inverted>. La route Worker (même /api/servers/channels/messages/list
 * que le web) renvoie déjà les messages du PLUS ANCIEN au plus récent (elle
 * fait elle-même .reverse() sur sa requête $createdAt desc, pour un rendu
 * web classique de haut en bas) — on l'inverse donc ici pour retrouver
 * l'ordre "plus récent en premier" qu'attend l'écran mobile. */
export async function loadChannelMessages(serverId: string, channelId: string): Promise<ServerChannelMessage[]> {
  const r = await apiPost<{ messages: ServerChannelMessage[] }>('/api/servers/channels/messages/list', {
    serverId,
    channelId,
  });
  return r.messages.slice().reverse();
}

/** Poste un message texte simple dans un salon — jamais d'écriture directe
 * dans server_channel_messages (voir le commentaire en tête de fichier :
 * la validation des permissions/timeout/mode lent/auto-mod vit uniquement
 * côté Worker). */
export async function sendChannelText(serverId: string, channelId: string, text: string): Promise<void> {
  await apiPost('/api/servers/channels/messages/send', { serverId, channelId, text });
}
