// Régression : écoute synchronisée en vocal (ajouté en v4.55.62). Les routes
// /api/music/listen/start|update|stop laissent un compte devenir "hôte" d'une
// session partagée uniquement s'il a une présence RÉELLE dans le salon vocal
// visé (group_call_presence pour un appel DM, server_voice_presence pour un
// salon de serveur) — jamais fait confiance au contexte envoyé tel quel par
// le client — et seul l'hôte EN COURS peut ensuite pousser une mise à jour ou
// arrêter la session, pour empêcher n'importe qui présent dans le salon de
// détourner la lecture de tout le monde.
import { awAdmin, makeUser, api, DB, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], presence: [], track: null, session: null };

async function main() {
  const alice = await makeUser('listentog', 'alice');
  cleanup.users.push(alice.userId);
  const bob = await makeUser('listentog', 'bob');
  cleanup.users.push(bob.userId);
  const eve = await makeUser('listentog', 'eve');
  cleanup.users.push(eve.userId);

  const dmId = 'dmtest' + Date.now().toString(36);

  console.log('=== Setup: alice and bob are present in the same DM voice call (presence docs), eve is not ===');
  const aliceP = await awAdmin('/databases/' + DB + '/collections/group_call_presence/documents', {
    method: 'POST',
    body: JSON.stringify({ documentId: 'unique()', data: { dmId: dmId, uid: alice.userId, username: 'alice' }, permissions: ['read("any")'] })
  });
  check('alice presence doc created', aliceP.status === 201);
  cleanup.presence.push(aliceP.body.$id);
  const bobP = await awAdmin('/databases/' + DB + '/collections/group_call_presence/documents', {
    method: 'POST',
    body: JSON.stringify({ documentId: 'unique()', data: { dmId: dmId, uid: bob.userId, username: 'bob' }, permissions: ['read("any")'] })
  });
  check('bob presence doc created', bobP.status === 201);
  cleanup.presence.push(bobP.body.$id);

  const track = await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents', {
    method: 'POST',
    body: JSON.stringify({ documentId: 'unique()', data: { uid: alice.userId, title: 'Test Track', artistName: 'Alice', audioUrl: 'https://x/test.mp3' }, permissions: ['read("any")'] })
  });
  check('test track created', track.status === 201);
  const trackId = track.body.$id;
  cleanup.track = trackId;

  console.log('\n=== 1. Eve (NOT present in the voice call) cannot start a listen session for it ===');
  const eveStart = await api(eve.jwt, '/api/music/listen/start', { contextType: 'dm', contextId: dmId, trackId: trackId, positionSec: 0 });
  console.log('eve start:', eveStart.status, eveStart.body);
  check('eve rejected (not present in the call)', eveStart.status === 500 && eveStart.body.ok === false);

  console.log('\n=== 2. Alice (genuinely present) can start a listen session ===');
  const aliceStart = await api(alice.jwt, '/api/music/listen/start', { contextType: 'dm', contextId: dmId, trackId: trackId, positionSec: 12.5 });
  console.log('alice start:', aliceStart.status, aliceStart.body);
  check('alice can start the session', aliceStart.status === 200 && aliceStart.body.ok === true);
  const sessionId = aliceStart.body.sessionId;
  cleanup.session = sessionId;
  check('sessionId looks deterministic (ls_ prefix)', typeof sessionId === 'string' && sessionId.indexOf('ls_') === 0);

  const sessionDoc = await awAdmin('/databases/' + DB + '/collections/xm_listen_sessions/documents/' + sessionId);
  check('session document exists with alice as host', sessionDoc.status === 200 && sessionDoc.body.hostUid === alice.userId);
  check('session document has the right track and position', sessionDoc.body.trackId === trackId && sessionDoc.body.positionSec === 12.5);

  console.log('\n=== 3. Restarting from the same voice context reuses the SAME session id (no duplicate) ===');
  const aliceRestart = await api(alice.jwt, '/api/music/listen/start', { contextType: 'dm', contextId: dmId, trackId: trackId, positionSec: 30 });
  check('restart succeeds', aliceRestart.status === 200 && aliceRestart.body.ok === true);
  check('restart reuses the same sessionId', aliceRestart.body.sessionId === sessionId);

  console.log('\n=== 4. Bob (present, but not the host) cannot update the session ===');
  const bobUpdate = await api(bob.jwt, '/api/music/listen/update', { sessionId: sessionId, positionSec: 99 });
  console.log('bob update:', bobUpdate.status, bobUpdate.body);
  check('bob rejected (not the host)', bobUpdate.status === 500 && bobUpdate.body.ok === false);
  const afterBobUpdate = await awAdmin('/databases/' + DB + '/collections/xm_listen_sessions/documents/' + sessionId);
  check('position unchanged after bob\'s rejected update attempt', afterBobUpdate.body.positionSec !== 99);

  console.log('\n=== 5. Alice (the real host) can update the session ===');
  const aliceUpdate = await api(alice.jwt, '/api/music/listen/update', { sessionId: sessionId, positionSec: 45.2, isPlaying: false });
  check('alice can update', aliceUpdate.status === 200 && aliceUpdate.body.ok === true);
  const afterAliceUpdate = await awAdmin('/databases/' + DB + '/collections/xm_listen_sessions/documents/' + sessionId);
  check('position actually updated to alice\'s value', afterAliceUpdate.body.positionSec === 45.2);
  check('isPlaying actually updated', afterAliceUpdate.body.isPlaying === false);

  console.log('\n=== 6. Eve (not present, not host) cannot update or stop the session either ===');
  const eveUpdate = await api(eve.jwt, '/api/music/listen/update', { sessionId: sessionId, positionSec: 1 });
  check('eve rejected on update', eveUpdate.status === 500 && eveUpdate.body.ok === false);
  const eveStop = await api(eve.jwt, '/api/music/listen/stop', { sessionId: sessionId });
  check('eve rejected on stop', eveStop.status === 500 && eveStop.body.ok === false);
  const stillThere = await awAdmin('/databases/' + DB + '/collections/xm_listen_sessions/documents/' + sessionId);
  check('session document still exists after eve\'s rejected stop attempt', stillThere.status === 200);

  console.log('\n=== 7. Bob (present, not host) cannot stop the session ===');
  const bobStop = await api(bob.jwt, '/api/music/listen/stop', { sessionId: sessionId });
  check('bob rejected on stop', bobStop.status === 500 && bobStop.body.ok === false);

  console.log('\n=== 8. Alice (the real host) can stop the session, deleting it ===');
  const aliceStop = await api(alice.jwt, '/api/music/listen/stop', { sessionId: sessionId });
  check('alice can stop', aliceStop.status === 200 && aliceStop.body.ok === true);
  const afterStop = await awAdmin('/databases/' + DB + '/collections/xm_listen_sessions/documents/' + sessionId);
  check('session document actually deleted', afterStop.status === 404);
  cleanup.session = null;

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  if (cleanup.session) await awAdmin('/databases/' + DB + '/collections/xm_listen_sessions/documents/' + cleanup.session, { method: 'DELETE' }).catch(() => {});
  for (const pid of cleanup.presence) await awAdmin('/databases/' + DB + '/collections/group_call_presence/documents/' + pid, { method: 'DELETE' }).catch(() => {});
  if (cleanup.track) await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + cleanup.track, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
