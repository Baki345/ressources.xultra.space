// Régression : permissions des notifications (corrigé en v4.55.35). Comme
// pour les DM, la plupart des notifications existantes avaient des
// permissions accordées à leur CRÉATEUR plutôt qu'à leur DESTINATAIRE
// réel. Le correctif fait passer la création par /api/notifications/send
// (route admin-médiée), qui pose read/update/delete uniquement pour
// `uid` (le vrai destinataire).
import { awAdmin, asUserDirect, makeUser, DB, SITE, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], notif: null };

async function main() {
  const alice = await makeUser('notif', 'alice');
  cleanup.users.push(alice.userId);
  const bob = await makeUser('notif', 'bob');
  cleanup.users.push(bob.userId);
  const eve = await makeUser('notif', 'eve');
  cleanup.users.push(eve.userId);

  console.log('=== 1. Alice sends bob a notification via /api/notifications/send ===');
  const r = await fetch(SITE + '/api/notifications/send', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + alice.jwt },
    body: JSON.stringify({ uid: bob.userId, type: 'like', fromUid: alice.userId, fromName: 'alice', text: 'alice liked your post', refId: 'post123' })
  });
  const body = await r.json();
  console.log('send result:', r.status, body.ok);
  check('notification created successfully', r.status === 200 && body.ok === true);
  const notifId = body.notification && body.notification.$id;
  cleanup.notif = notifId;

  console.log('\n=== 2. Bob (real recipient) can read and mark it read directly via Appwrite ===');
  const bobRead = await asUserDirect(bob.jwt, '/databases/' + DB + '/collections/notifications/documents/' + notifId);
  check('bob can read his notification', bobRead.status === 200 && bobRead.body.text === 'alice liked your post');
  const bobMarkRead = await asUserDirect(bob.jwt, '/databases/' + DB + '/collections/notifications/documents/' + notifId, { method: 'PATCH', body: JSON.stringify({ data: { read: true } }) });
  check('bob can mark his own notification as read', bobMarkRead.status === 200);

  console.log('\n=== 3. Eve (stranger) cannot read, update, or delete this notification ===');
  const eveRead = await asUserDirect(eve.jwt, '/databases/' + DB + '/collections/notifications/documents/' + notifId);
  check('eve cannot read', eveRead.status === 401 || eveRead.status === 404);
  const eveUpdate = await asUserDirect(eve.jwt, '/databases/' + DB + '/collections/notifications/documents/' + notifId, { method: 'PATCH', body: JSON.stringify({ data: { read: true } }) });
  check('eve cannot update', eveUpdate.status === 401 || eveUpdate.status === 403 || eveUpdate.status === 404);
  const eveDelete = await asUserDirect(eve.jwt, '/databases/' + DB + '/collections/notifications/documents/' + notifId, { method: 'DELETE' });
  check('eve cannot delete', eveDelete.status === 401 || eveDelete.status === 403 || eveDelete.status === 404);

  console.log('\n=== 4. Bob can delete his own notification (dismiss) ===');
  const bobDelete = await asUserDirect(bob.jwt, '/databases/' + DB + '/collections/notifications/documents/' + notifId, { method: 'DELETE' });
  check('bob can delete his own notification', bobDelete.status === 204 || bobDelete.status === 200);
  cleanup.notif = null;

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  if (cleanup.notif) await awAdmin('/databases/' + DB + '/collections/notifications/documents/' + cleanup.notif, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
