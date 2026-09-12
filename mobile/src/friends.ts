/* Amis — port mobile de la collection `ultravoc_friends` (voir loadFriends/
 * sendFriendRequest/acceptFriendRequest/rejectFriendRequest/removeFriend/
 * blockUser/unblockUser dans worker.js). Lectures et écritures directes via
 * le SDK Appwrite (comme le site — la collection est déjà pensée pour ça :
 * chaque relation n'est visible que par son propriétaire), sauf l'envoi de
 * notifications qui passe par le Worker (voir sendNotification côté web :
 * impossible d'accorder au DESTINATAIRE l'accès à sa propre notification en
 * la créant en direct depuis un client).
 *
 * Simplification assumée par rapport au site : les cas de double-demande
 * simultanée (A et B s'envoient une demande au même instant) ne sont pas
 * dédupliqués aussi agressivement ici — le pire résultat possible est deux
 * documents "accepted" redondants au lieu d'un, jamais une relation cassée
 * ou un blocage contourné. Le nettoyage complet (voir les commentaires dans
 * worker.js autour d'acceptFriendRequest) pourra être porté plus tard si un
 * vrai cas remonte sur mobile.
 */
import { ID, Query } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';
import { apiPost } from './api';
import type { UserProfile } from './dms';

export interface FriendRelation {
  $id: string;
  userId: string;
  friendId: string;
  status: 'accepted' | 'pending_in' | 'pending_out' | 'blocked';
  name?: string;
}

async function sendNotification(uid: string, type: string, fromUid: string, fromName: string, text: string): Promise<void> {
  try {
    await apiPost('/api/notifications/send', { uid, type, fromUid, fromName, text: text.slice(0, 200) });
  } catch {
    // best-effort, comme côté web
  }
}

/** Toutes mes relations (amis acceptés, demandes reçues/envoyées, blocages). */
export async function loadFriends(myUid: string): Promise<FriendRelation[]> {
  const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'ultravoc_friends', [
    Query.equal('userId', myUid),
    Query.limit(100),
  ]);
  return r.documents as unknown as FriendRelation[];
}

/** Recherche parmi les membres (username/displayName) pour "Ajouter un ami"
 * — même approche que côté web (filtre client sur un lot de profils, pas de
 * recherche plein-texte serveur). */
export async function searchUsers(query: string, excludeUid: string): Promise<UserProfile[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'users', [Query.limit(100)]);
  const docs = r.documents as unknown as UserProfile[];
  return docs
    .filter((p) => String(p.authUserId) !== excludeUid)
    .filter((p) => (p.username || '').toLowerCase().includes(q) || (p.displayName || '').toLowerCase().includes(q))
    .slice(0, 10);
}

export async function sendFriendRequest(
  myUid: string,
  myName: string,
  targetUid: string,
  targetName: string
): Promise<'sent' | 'already_friends' | 'already_pending' | 'accepted'> {
  const mine = await loadFriends(myUid);
  const existing = mine.find((f) => String(f.friendId) === String(targetUid));
  if (existing?.status === 'accepted') return 'already_friends';
  if (existing?.status === 'pending_out') return 'already_pending';
  if (existing?.status === 'pending_in') {
    await acceptFriendRequest(myUid, myName, existing.$id, targetUid);
    return 'accepted';
  }
  await databases.createDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', ID.unique(), {
    userId: myUid,
    friendId: targetUid,
    status: 'pending_out',
    name: targetName || 'Ami',
  });
  try {
    await databases.createDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', ID.unique(), {
      userId: targetUid,
      friendId: myUid,
      status: 'pending_in',
      name: myName,
    });
  } catch {
    // best-effort, comme côté web — la relation de MON côté existe déjà même
    // si l'autre moitié échoue (permissions par document manquantes...)
  }
  await sendNotification(targetUid, 'friend_request', myUid, myName, myName + " t'a envoyé une demande d'ami");
  return 'sent';
}

export async function acceptFriendRequest(myUid: string, myName: string, reqDocId: string, fromUid: string): Promise<void> {
  await databases.updateDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', reqDocId, { status: 'accepted' });
  try {
    const theirs = await databases.listDocuments(APPWRITE_DATABASE_ID, 'ultravoc_friends', [
      Query.equal('userId', fromUid),
      Query.equal('friendId', myUid),
      Query.limit(10),
    ]);
    const theirDocs = theirs.documents as unknown as FriendRelation[];
    if (theirDocs.length) {
      const keep = theirDocs.find((d) => d.status === 'accepted') || theirDocs[0];
      for (const d of theirDocs) {
        if (d.$id === keep.$id) {
          if (d.status !== 'accepted') await databases.updateDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', d.$id, { status: 'accepted' }).catch(() => {});
        } else {
          await databases.deleteDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', d.$id).catch(() => {});
        }
      }
    } else {
      await databases.createDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', ID.unique(), {
        userId: fromUid,
        friendId: myUid,
        status: 'accepted',
        name: myName,
      });
    }
  } catch {
    // best-effort
  }
  await sendNotification(fromUid, 'friend_accepted', myUid, myName, myName + ' a accepté ta demande d\'ami');
}

export async function rejectFriendRequest(myUid: string, reqDocId: string, fromUid: string): Promise<void> {
  await databases.deleteDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', reqDocId);
  if (fromUid) {
    try {
      const theirs = await databases.listDocuments(APPWRITE_DATABASE_ID, 'ultravoc_friends', [
        Query.equal('userId', fromUid),
        Query.equal('friendId', myUid),
        Query.equal('status', 'pending_out'),
        Query.limit(10),
      ]);
      for (const d of theirs.documents) {
        await databases.deleteDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', d.$id).catch(() => {});
      }
    } catch {
      // best-effort
    }
  }
}

export async function removeFriend(myUid: string, myName: string, uid: string): Promise<void> {
  const mine = await loadFriends(myUid);
  const mineDoc = mine.find((f) => String(f.friendId) === String(uid) && f.status === 'accepted');
  if (mineDoc) await databases.deleteDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', mineDoc.$id);
  try {
    const theirs = await databases.listDocuments(APPWRITE_DATABASE_ID, 'ultravoc_friends', [
      Query.equal('userId', uid),
      Query.equal('friendId', myUid),
      Query.limit(5),
    ]);
    for (const d of theirs.documents) {
      await databases.deleteDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', d.$id).catch(() => {});
    }
  } catch {
    // best-effort
  }
  await sendNotification(uid, 'friend_removed', myUid, myName, myName + " t'a retiré de ses amis");
}

export async function blockUser(myUid: string, uid: string): Promise<void> {
  const mine = await loadFriends(myUid);
  const row = mine.find((f) => String(f.friendId) === String(uid));
  if (row) await databases.updateDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', row.$id, { status: 'blocked' });
  else {
    await databases.createDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', ID.unique(), {
      userId: myUid,
      friendId: uid,
      status: 'blocked',
      name: '—',
    });
  }
}

export async function unblockUser(myUid: string, uid: string): Promise<void> {
  const mine = await loadFriends(myUid);
  const row = mine.find((f) => String(f.friendId) === String(uid));
  if (row) await databases.deleteDocument(APPWRITE_DATABASE_ID, 'ultravoc_friends', row.$id);
}
