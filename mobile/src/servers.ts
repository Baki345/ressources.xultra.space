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
 * Salons FORUM (§30 côté worker.js) : un post de forum EST un fil
 * (collection `server_threads`) — pas de collection dédiée. Créer un post
 * crée le fil puis son premier message (qui porte le corps du post) et les
 * relie via `originMessageId`/`threadId` ; répondre à un post est un message
 * normal avec ce même `threadId`. On réutilise donc entièrement
 * loadChannelMessages()/sendChannelText() (déjà écrites pour les salons
 * texte) en leur passant un `threadId`, plutôt que d'inventer un chemin
 * séparé pour les réponses à un post.
 *
 * Salons VOCAUX : la connexion réelle (jeton LiveKit, audio, présence) vit
 * dans src/voice.ts + src/screens/ServerVoiceScreen.tsx, pas ici — ce
 * fichier ne fait que les lister comme n'importe quel autre salon.
 *
 * Portée volontairement limitée à cette première version : salons TEXTE,
 * ANNONCES, FORUM (texte simple, pas de pièces jointes) et VOCAUX (audio
 * seul). Scène (LiveKit, avec demandes de parole et modération des
 * orateurs) reste hors scope — voir mobile/README.md, "Ce qu'il reste".
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
  threadId?: string;
  $createdAt: string;
}

/** Un post de forum — voir la note en tête de fichier : c'est un fil
 * (`server_threads`), pas une collection dédiée. */
export interface ServerThread {
  $id: string;
  serverId: string;
  channelId: string;
  name: string;
  creatorUid: string;
  private: boolean;
  archived: boolean;
  originMessageId: string;
  memberUids?: string[];
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

const VISIBLE_TYPES: ChannelType[] = ['text', 'announcement', 'forum', 'voice'];

/** Salons TEXTE/ANNONCES/FORUM/VOCAUX que je peux VOIR sur ce serveur, triés
 * par position — le Worker filtre déjà par visibilité (voir
 * /api/servers/channels/list côté worker.js), donc tout salon renvoyé ici
 * est légitimement affichable. Scène (`stage`) est exclue (hors scope, voir
 * l'en-tête de ce fichier — c'est une fonctionnalité à part entière côté web,
 * avec demandes de parole et modération des orateurs). */
export async function loadServerChannels(serverId: string): Promise<ServerChannel[]> {
  const r = await apiPost<{ channels: ServerChannel[] }>('/api/servers/channels/list', { serverId });
  return r.channels
    .filter((c) => VISIBLE_TYPES.includes(c.type))
    .sort((a, b) => (a.position || 0) - (b.position || 0));
}

/** Les 60 derniers messages d'un salon texte/annonces (`threadId` omis), ou
 * d'UN post de forum précis (`threadId` = l'identifiant du fil/post, voir
 * loadForumPosts) — plus récents en premier, même convention que
 * loadThreadMessages() dans src/dms.ts, consommée telle quelle par un
 * <FlatList inverted>. La route Worker (même /api/servers/channels/messages/list
 * que le web) renvoie déjà les messages du PLUS ANCIEN au plus récent (elle
 * fait elle-même .reverse() sur sa requête $createdAt desc, pour un rendu
 * web classique de haut en bas) — on l'inverse donc ici pour retrouver
 * l'ordre "plus récent en premier" qu'attend l'écran mobile. */
export async function loadChannelMessages(serverId: string, channelId: string, threadId?: string): Promise<ServerChannelMessage[]> {
  const r = await apiPost<{ messages: ServerChannelMessage[] }>('/api/servers/channels/messages/list', {
    serverId,
    channelId,
    threadId: threadId || '',
  });
  return r.messages.slice().reverse();
}

/** Poste un message texte simple dans un salon texte/annonces, ou une
 * RÉPONSE à un post de forum existant (`threadId`) — jamais d'écriture
 * directe dans server_channel_messages (voir le commentaire en tête de
 * fichier : la validation des permissions/timeout/mode lent/auto-mod vit
 * uniquement côté Worker). Un salon forum n'accepte pas de message sans
 * `threadId` (voir §30 côté worker.js) : créer un nouveau post passe par
 * createForumPost(), pas par cette fonction. */
export async function sendChannelText(serverId: string, channelId: string, text: string, threadId?: string): Promise<void> {
  await apiPost('/api/servers/channels/messages/send', { serverId, channelId, text, threadId: threadId || '' });
}

/** Les posts (fils) d'un salon forum, plus récents en premier — le Worker
 * filtre déjà les fils privés auxquels je n'ai pas accès (voir
 * /api/servers/threads/list côté worker.js). */
export async function loadForumPosts(serverId: string, channelId: string): Promise<ServerThread[]> {
  const r = await apiPost<{ threads: ServerThread[] }>('/api/servers/threads/list', { serverId, channelId });
  return r.threads;
}

/** Crée un nouveau post de forum (titre + corps) — le Worker crée le fil ET
 * son premier message ensemble (voir /api/servers/forum/post/create côté
 * worker.js) ; il n'existe aucun autre moyen valide de créer un post. */
export async function createForumPost(
  serverId: string,
  channelId: string,
  title: string,
  text: string
): Promise<{ thread: ServerThread; message: ServerChannelMessage }> {
  return apiPost<{ thread: ServerThread; message: ServerChannelMessage }>('/api/servers/forum/post/create', {
    serverId,
    channelId,
    title,
    text,
  });
}
