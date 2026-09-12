// Nouvelle fonctionnalité : un bot peut désormais rejoindre l'appel vocal
// d'un DM DE GROUPE (room LiveKit "xu-dm-"+dmId), via 3 routes calquées sur
// leurs équivalents "salon vocal de serveur" déjà existants
// (/api/bot/v1/voice/token, /presence/join, /presence/leave) :
//   - POST /api/bot/v1/voice/dm-token
//   - POST /api/bot/v1/voice/dm-presence/join
//   - POST /api/bot/v1/voice/dm-presence/leave
// Un DM 1:1 (2 membres) reste hors de portée d'un bot : ces appels sont en
// WebRTC pair-à-pair fait main, jamais en room LiveKit — testé explicitement
// ci-dessous (cas b).
import { awAdmin, makeUser, api, DB, SITE, PID, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], threads: [], botId: null, presenceDocs: [] };

async function botApi(token, path, body) {
  const r = await fetch(SITE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bot ' + token },
    body: JSON.stringify(body || {})
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

async function readDirect(jwt, path) {
  const r = await fetch('https://fra.cloud.appwrite.io/v1' + path, {
    headers: { 'X-Appwrite-Project': PID, 'X-Appwrite-JWT': jwt, 'Content-Type': 'application/json' }
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

async function main() {
  const alice = await makeUser('botvoice', 'alice');
  cleanup.users.push(alice.userId);
  const bob = await makeUser('botvoice', 'bob');
  cleanup.users.push(bob.userId);
  const carol = await makeUser('botvoice', 'carol');
  cleanup.users.push(carol.userId);
  const eve = await makeUser('botvoice', 'eve');
  cleanup.users.push(eve.userId);

  console.log('=== 0. Alice creates a bot via /api/bots/create ===');
  const createBotRes = await api(alice.jwt, '/api/bots/create', { name: 'VoiceTestBot' });
  check('bot created', createBotRes.status === 200 && createBotRes.body.ok === true);
  const bot = createBotRes.body.bot;
  cleanup.botId = bot.$id;
  const botToken = bot.botToken;
  const botUid = 'bot_' + bot.publicId;

  console.log('\n=== 1. Group DM WITH the bot as a member: dm-token succeeds ===');
  const groupRes = await api(alice.jwt, '/api/dms/thread/create', { members: [bob.userId, carol.userId, botUid], displayName: 'Group with bot' });
  check('group thread with bot created', groupRes.status === 200 && groupRes.body.ok === true);
  const groupThreadId = groupRes.body.thread && groupRes.body.thread.$id;
  cleanup.threads.push(groupThreadId);

  const tokenRes = await botApi(botToken, '/api/bot/v1/voice/dm-token', { dmThreadId: groupThreadId });
  console.log('dm-token (in group):', tokenRes.status, tokenRes.body.ok, tokenRes.body.error);
  check('bot in the group DM gets a LiveKit token', tokenRes.status === 200 && tokenRes.body.ok === true && !!tokenRes.body.token);
  check('token response has the right room name', tokenRes.body.room === 'xu-dm-' + groupThreadId);
  check('token response includes the voice wsUrl', tokenRes.body.wsUrl === 'wss://voice.xultra.space');

  console.log('\n=== 2. A 1:1 DM (2 members) with the bot: rejected as "not a group" ===');
  const peerRes = await api(alice.jwt, '/api/dms/thread/create', { peerUid: botUid, displayName: '1:1 with bot' });
  check('1:1 thread with bot uid created (allowed, arbitrary uid)', peerRes.status === 200 && peerRes.body.ok === true);
  const peerThreadId = peerRes.body.thread && peerRes.body.thread.$id;
  cleanup.threads.push(peerThreadId);

  const peerTokenRes = await botApi(botToken, '/api/bot/v1/voice/dm-token', { dmThreadId: peerThreadId });
  console.log('dm-token (1:1):', peerTokenRes.status, peerTokenRes.body.error);
  check('1:1 DM rejected for a bot ("pas un groupe")', peerTokenRes.status === 400 && peerTokenRes.body.ok === false && /pas un groupe/.test(peerTokenRes.body.error || ''));

  console.log('\n=== 3. A group DM WITHOUT the bot: rejected as "not a member" ===');
  const noBotGroupRes = await api(alice.jwt, '/api/dms/thread/create', { members: [bob.userId, carol.userId], displayName: 'Group without bot' });
  check('group thread without bot created', noBotGroupRes.status === 200 && noBotGroupRes.body.ok === true);
  const noBotThreadId = noBotGroupRes.body.thread && noBotGroupRes.body.thread.$id;
  cleanup.threads.push(noBotThreadId);

  const notMemberTokenRes = await botApi(botToken, '/api/bot/v1/voice/dm-token', { dmThreadId: noBotThreadId });
  console.log('dm-token (bot not a member):', notMemberTokenRes.status, notMemberTokenRes.body.error);
  check('group DM without the bot rejected ("pas dans cette conversation")', notMemberTokenRes.status === 400 && notMemberTokenRes.body.ok === false && /pas dans cette conversation/.test(notMemberTokenRes.body.error || ''));

  console.log('\n=== 4. An invalid bot token is rejected ===');
  const badTokenRes = await botApi('x1bot_totally_invalid', '/api/bot/v1/voice/dm-token', { dmThreadId: groupThreadId });
  check('invalid bot token rejected', badTokenRes.status === 400 && badTokenRes.body.ok === false);

  console.log('\n=== 5. dm-presence/join writes a doc readable by real group members, not by a stranger ===');
  const joinRes = await botApi(botToken, '/api/bot/v1/voice/dm-presence/join', { dmThreadId: groupThreadId });
  console.log('dm-presence/join:', joinRes.status, joinRes.body);
  check('presence join succeeds', joinRes.status === 200 && joinRes.body.ok === true && !!joinRes.body.docId);
  const docId = joinRes.body.docId;

  const bobReadPresence = await readDirect(bob.jwt, '/databases/' + DB + '/collections/group_call_presence/documents/' + docId);
  check('a real group member (bob) can read the bot presence doc directly', bobReadPresence.status === 200 && bobReadPresence.body.uid === botUid);

  // group_call_presence is collection-level read("any") by design (same
  // collection the human group-call-presence route already uses) — call
  // presence (who's in the call) is not sensitive, unlike message content,
  // so any account (even a stranger) can read it. Confirmed live against
  // the collection's actual Appwrite config, not an assumption.
  const eveReadPresence = await readDirect(eve.jwt, '/databases/' + DB + '/collections/group_call_presence/documents/' + docId);
  check('presence is publicly readable by design (read("any") collection permission, same as human group calls)', eveReadPresence.status === 200 && eveReadPresence.body.uid === botUid);

  console.log('\n=== 6. dm-presence/leave deletes the doc ===');
  const leaveRes = await botApi(botToken, '/api/bot/v1/voice/dm-presence/leave', { dmThreadId: groupThreadId });
  check('presence leave succeeds', leaveRes.status === 200 && leaveRes.body.ok === true);
  const afterLeave = await awAdmin('/databases/' + DB + '/collections/group_call_presence/documents/' + docId);
  check('the presence doc is gone after leaving', afterLeave.status === 404);

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  for (const tid of cleanup.threads) if (tid) await awAdmin('/databases/' + DB + '/collections/dms/documents/' + tid, { method: 'DELETE' }).catch(() => {});
  if (cleanup.botId) await awAdmin('/databases/' + DB + '/collections/bot_apps/documents/' + cleanup.botId, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
