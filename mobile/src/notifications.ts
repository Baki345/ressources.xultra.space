/* Notifications génériques — port mobile de la collection `notifications`
 * (voir loadNotifications/renderNotifications/openNotificationsPanel dans
 * worker.js). Les demandes d'ami reçues ont déjà leur propre section dédiée
 * dans FriendsScreen (avec les vrais boutons Accepter/Refuser, dérivés de
 * ultravoc_friends) — exactement comme côté web, ce flux exclut donc les
 * notifications de type 'friend_request' pour ne jamais les afficher en
 * double. Les autres types (friend_accepted, friend_removed, badges,
 * commentaires XBin, paliers musique, tickets support...) restent listés
 * ici même si l'écran correspondant n'est pas encore porté sur mobile — le
 * texte reste lisible, seul le clic pour "aller voir" n'est pas encore
 * branché pour ces cas-là (seul le clic vers un profil, quand fromUid est
 * présent, l'est déjà). */
import { Query } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';

export interface NotificationDoc {
  $id: string;
  uid: string;
  type: string;
  fromUid: string;
  fromName: string;
  text: string;
  refId?: string;
  read: boolean;
  $createdAt: string;
}

export const NOTIF_ICONS: Record<string, string> = {
  friend_accepted: '✅',
  friend_removed: '💔',
  announcement: '📢',
  message: '💬',
  dm: '💬',
  music_new_track: '🎵',
  music_milestone: '🎉',
  support_ticket_reply: '🎧',
  support_ticket_escalated: '🚨',
  report_resolved: '🚩',
  team_application_status: '📨',
  badge_granted: '🏅',
  bug_status_changed: '🐞',
  xdrive_folder_invite: '📁',
  xdrive_file_removed: '🚩',
  xdrive_suspended: '⛔',
  xbin_comment: '💬',
};

/** Toutes mes notifications, hors demandes d'ami (déjà gérées par
 * FriendsScreen à partir de ultravoc_friends). */
export async function loadNotifications(myUid: string): Promise<NotificationDoc[]> {
  const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'notifications', [
    Query.equal('uid', myUid),
    Query.orderDesc('$createdAt'),
    Query.limit(60),
  ]);
  return (r.documents as unknown as NotificationDoc[]).filter((n) => n.type !== 'friend_request');
}

/** Marque comme lues toutes les notifications encore non lues — appelé à
 * l'ouverture de l'écran, comme openNotificationsPanel() côté web. */
export async function markAllRead(notifs: NotificationDoc[]): Promise<void> {
  const unread = notifs.filter((n) => !n.read);
  await Promise.all(
    unread.map((n) => databases.updateDocument(APPWRITE_DATABASE_ID, 'notifications', n.$id, { read: true }).catch(() => {})),
  );
}

export async function deleteNotification(id: string): Promise<void> {
  await databases.deleteDocument(APPWRITE_DATABASE_ID, 'notifications', id);
}

export async function clearAllNotifications(notifs: NotificationDoc[]): Promise<void> {
  await Promise.all(notifs.map((n) => databases.deleteDocument(APPWRITE_DATABASE_ID, 'notifications', n.$id).catch(() => {})));
}
