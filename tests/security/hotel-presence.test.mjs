// Régression : X1 Hotel — présence de salle (ajouté en v4.55.66). Bouger ou
// écrire dans une salle du Lobby ne doit être possible qu'APRÈS l'avoir
// rejointe via /api/hotel/room/join (jamais fait confiance à un roomId
// envoyé seul par le client) — sinon n'importe quel compte pourrait
// "apparaître" en train de bouger/parler dans une salle qu'il n'a jamais
// rejointe. La position envoyée est aussi bornée aux dimensions réelles de
// la salle côté serveur, jamais la valeur brute envoyée par le client.
import { awAdmin, makeUser, api, DB, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], presence: [], chat: [], avatar: [] };

async function main() {
  const alice = await makeUser('hotelpres', 'alice');
  cleanup.users.push(alice.userId);
  const bob = await makeUser('hotelpres', 'bob');
  cleanup.users.push(bob.userId);

  console.log('=== 1. Bob (never joined) cannot move in the Lobby ===');
  const bobMove = await api(bob.jwt, '/api/hotel/room/move', { roomId: 'lobby', x: 1, y: 1 });
  console.log('bob move (no join):', bobMove.status, bobMove.body);
  check('bob rejected (no presence doc yet)', bobMove.status === 500 && bobMove.body.ok === false);

  console.log('\n=== 2. Bob (never joined) cannot chat in the Lobby ===');
  const bobChat = await api(bob.jwt, '/api/hotel/chat/send', { roomId: 'lobby', text: 'intrusion' });
  check('bob rejected on chat (not in the room)', bobChat.status === 500 && bobChat.body.ok === false);

  console.log('\n=== 3. Alice can join the Lobby ===');
  const aliceJoin = await api(alice.jwt, '/api/hotel/room/join', { roomId: 'lobby' });
  console.log('alice join:', aliceJoin.status, aliceJoin.body);
  check('alice joins successfully', aliceJoin.status === 200 && aliceJoin.body.ok === true);
  check('join returns a spawn position within the room', typeof aliceJoin.body.x === 'number' && typeof aliceJoin.body.y === 'number');
  cleanup.presence.push(alice.userId);

  const presenceDoc = await awAdmin('/databases/' + DB + '/collections/hotel_room_presence/documents/' + alice.userId);
  check('presence document created with the right roomId and displayName', presenceDoc.status === 200 && presenceDoc.body.roomId === 'lobby' && presenceDoc.body.displayName === 'alice');

  console.log('\n=== 4. Alice can move after joining ===');
  const aliceMove = await api(alice.jwt, '/api/hotel/room/move', { roomId: 'lobby', x: 3, y: 2, facing: 'n' });
  check('alice can move', aliceMove.status === 200 && aliceMove.body.ok === true);
  const afterMove = await awAdmin('/databases/' + DB + '/collections/hotel_room_presence/documents/' + alice.userId);
  check('position actually updated', afterMove.body.x === 3 && afterMove.body.y === 2 && afterMove.body.facing === 'n');

  console.log('\n=== 5. Moving out of the room bounds gets clamped server-side, not trusted as-is ===');
  const aliceOOB = await api(alice.jwt, '/api/hotel/room/move', { roomId: 'lobby', x: 9999, y: -50, facing: 's' });
  check('out-of-bounds move still succeeds (clamped, not rejected)', aliceOOB.status === 200 && aliceOOB.body.ok === true);
  const afterOOB = await awAdmin('/databases/' + DB + '/collections/hotel_room_presence/documents/' + alice.userId);
  check('x clamped to within the Lobby width (never the raw 9999 sent)', afterOOB.body.x >= 0 && afterOOB.body.x < 20 && afterOOB.body.x !== 9999);
  check('y clamped to within the Lobby height (never the raw -50 sent)', afterOOB.body.y >= 0 && afterOOB.body.y !== -50);

  console.log('\n=== 6. Alice can chat after joining, with her real displayName attached server-side ===');
  const aliceChat = await api(alice.jwt, '/api/hotel/chat/send', { roomId: 'lobby', text: 'Salut le Lobby !' });
  check('alice can chat', aliceChat.status === 200 && aliceChat.body.ok === true);
  const chatList = await awAdmin('/databases/' + DB + '/collections/hotel_room_chat/documents?queries[]=' + encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'uid', values: [alice.userId] })));
  const msg = (chatList.body.documents || [])[0];
  check('chat message stored with the real text and server-resolved displayName', !!msg && msg.text === 'Salut le Lobby !' && msg.displayName === 'alice');
  if (msg) cleanup.chat.push(msg.$id);

  console.log('\n=== 7. A message trying to claim someone else\'s name is ignored (server uses the joined presence displayName) ===');
  const aliceChatSpoof = await api(alice.jwt, '/api/hotel/chat/send', { roomId: 'lobby', text: 'hi', displayName: 'TotallyNotAlice' });
  check('spoofed displayName field has no effect', aliceChatSpoof.status === 200 && aliceChatSpoof.body.ok === true);
  const chatList2 = await awAdmin('/databases/' + DB + '/collections/hotel_room_chat/documents?queries[]=' + encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'uid', values: [alice.userId] })) + '&queries[]=' + encodeURIComponent(JSON.stringify({ method: 'orderDesc', attribute: '$createdAt' })));
  const lastMsg = (chatList2.body.documents || [])[0];
  check('the new message still carries the real (server-resolved) displayName', !!lastMsg && lastMsg.displayName === 'alice');
  if (lastMsg) cleanup.chat.push(lastMsg.$id);

  console.log('\n=== 8. Avatar look save persists and is readable ===');
  const look = { body: '#123456', hair: '#abcdef', skin: '#f2c9a0' };
  const saveRes = await api(alice.jwt, '/api/hotel/avatar/save', { lookJson: JSON.stringify(look) });
  check('avatar save succeeds', saveRes.status === 200 && saveRes.body.ok === true);
  const avatarDoc = await awAdmin('/databases/' + DB + '/collections/hotel_avatars/documents/' + alice.userId);
  check('avatar look persisted correctly', avatarDoc.status === 200 && JSON.parse(avatarDoc.body.lookJson).body === '#123456');
  check('new avatar got starter credits on first creation', avatarDoc.body.credits === 1000);
  cleanup.avatar.push(alice.userId);

  console.log('\n=== 9. Bob still cannot move/chat in a room he never joined, even though Alice has ===');
  const bobMove2 = await api(bob.jwt, '/api/hotel/room/move', { roomId: 'lobby', x: 0, y: 0 });
  check('bob still rejected on move', bobMove2.status === 500 && bobMove2.body.ok === false);

  console.log('\n=== 10. Alice leaves — her presence document is actually deleted ===');
  const leaveRes = await api(alice.jwt, '/api/hotel/room/leave', {});
  check('leave succeeds', leaveRes.status === 200 && leaveRes.body.ok === true);
  const afterLeave = await awAdmin('/databases/' + DB + '/collections/hotel_room_presence/documents/' + alice.userId);
  check('presence document actually deleted', afterLeave.status === 404);
  cleanup.presence = [];

  console.log('\n=== 11. After leaving, alice cannot move in the room anymore without rejoining ===');
  const aliceMoveAfterLeave = await api(alice.jwt, '/api/hotel/room/move', { roomId: 'lobby', x: 1, y: 1 });
  check('alice rejected after leaving (no presence doc anymore)', aliceMoveAfterLeave.status === 500 && aliceMoveAfterLeave.body.ok === false);

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  for (const id of cleanup.chat) await awAdmin('/databases/' + DB + '/collections/hotel_room_chat/documents/' + id, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.presence) await awAdmin('/databases/' + DB + '/collections/hotel_room_presence/documents/' + uid, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.avatar) await awAdmin('/databases/' + DB + '/collections/hotel_avatars/documents/' + uid, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
