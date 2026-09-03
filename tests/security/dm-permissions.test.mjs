// Régression : permissions des messages privés (corrigé en v4.55.34). Les
// threads/messages `dms`/`dms_messages` étaient créés sans permissions
// explicites par document sur une collection en documentSecurity — un
// verrouillage de la collection (nécessaire pour de vraies permissions par
// participant) aurait donc rendu tout NOUVEAU message illisible pour tout
// le monde sauf l'admin. Le correctif fait passer la création de threads/
// messages par des routes Worker admin-médiées (/api/dms/thread/create,
// /api/dms/messages/send) qui posent les bonnes permissions multi-membres
// à la création — la seule façon d'accorder plusieurs utilisateurs
// spécifiques avec un JWT client étant impossible côté Appwrite.
import { awAdmin, asUserDirect, makeUser, api, uploadFile, fileExists, DB, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], thread: null, messages: [], bigFile: null };

async function main() {
  const alice = await makeUser('dmroute', 'alice');
  cleanup.users.push(alice.userId);
  const bob = await makeUser('dmroute', 'bob');
  cleanup.users.push(bob.userId);
  const eve = await makeUser('dmroute', 'eve');
  cleanup.users.push(eve.userId);

  console.log('=== 1. Alice creates a 1:1 thread with Bob via /api/dms/thread/create ===');
  const createRes = await api(alice.jwt, '/api/dms/thread/create', { peerUid: bob.userId, displayName: 'bob' });
  console.log('create thread:', createRes.status, createRes.body.ok);
  check('thread created successfully via the route', createRes.status === 200 && createRes.body.ok === true);
  const threadId = createRes.body.thread && createRes.body.thread.$id;
  cleanup.thread = threadId;
  check('thread has both members in its permissions already', (createRes.body.thread.$permissions || []).length === 6);

  console.log('\n=== 2. Cannot start a thread with yourself ===');
  const selfRes = await api(alice.jwt, '/api/dms/thread/create', { peerUid: alice.userId });
  check('self-DM rejected', selfRes.status === 400 && selfRes.body.ok === false);

  console.log('\n=== 3. Alice sends a text message via /api/dms/messages/send ===');
  const sendRes = await api(alice.jwt, '/api/dms/messages/send', { threadId: threadId, text: 'hey bob', type: 'text', displayName: 'alice' });
  console.log('send message:', sendRes.status, sendRes.body.ok);
  check('message sent successfully', sendRes.status === 200 && sendRes.body.ok === true);
  const msgId = sendRes.body.message && sendRes.body.message.$id;
  cleanup.messages.push(msgId);

  console.log('\n=== 4. Bob (real recipient) can read the message directly via Appwrite, and react to it ===');
  const bobRead = await asUserDirect(bob.jwt, '/databases/' + DB + '/collections/dms_messages/documents/' + msgId);
  check('bob can read the message', bobRead.status === 200 && bobRead.body.text === 'hey bob');
  const bobReact = await asUserDirect(bob.jwt, '/databases/' + DB + '/collections/dms_messages/documents/' + msgId, { method: 'PATCH', body: JSON.stringify({ data: { reactionsJson: JSON.stringify({ '👍': [bob.userId] }) } }) });
  check('bob can react (update) the message', bobReact.status === 200);

  console.log('\n=== 5. Bob cannot delete Alice\'s message (sender-only delete) ===');
  const bobDelete = await asUserDirect(bob.jwt, '/databases/' + DB + '/collections/dms_messages/documents/' + msgId, { method: 'DELETE' });
  check('bob cannot delete', bobDelete.status === 401 || bobDelete.status === 403);

  console.log('\n=== 6. Eve (stranger) cannot send into this thread, and cannot read/tamper directly ===');
  const eveSend = await api(eve.jwt, '/api/dms/messages/send', { threadId: threadId, text: 'intrusion', type: 'text' });
  check('eve cannot send into a thread she is not part of', eveSend.status === 400 && eveSend.body.ok === false);
  const eveRead = await asUserDirect(eve.jwt, '/databases/' + DB + '/collections/dms_messages/documents/' + msgId);
  check('eve cannot read the message directly', eveRead.status === 401 || eveRead.status === 404);
  const eveDeleteThread = await asUserDirect(eve.jwt, '/databases/' + DB + '/collections/dms/documents/' + threadId, { method: 'DELETE' });
  check('eve cannot delete the thread directly', eveDeleteThread.status === 401 || eveDeleteThread.status === 403 || eveDeleteThread.status === 404);

  console.log('\n=== 7. Group DM creation with 3 members works, all get permissions ===');
  const carol = await makeUser('dmroute', 'carol');
  cleanup.users.push(carol.userId);
  const groupRes = await api(alice.jwt, '/api/dms/thread/create', { members: [bob.userId, carol.userId], displayName: 'Group chat' });
  check('group thread created', groupRes.status === 200 && groupRes.body.ok === true);
  const groupThreadId = groupRes.body.thread && groupRes.body.thread.$id;
  check('group thread has all 3 members in permissions (9 entries)', (groupRes.body.thread.$permissions || []).length === 9);
  await awAdmin('/databases/' + DB + '/collections/dms/documents/' + groupThreadId, { method: 'DELETE' }).catch(() => {});

  console.log('\n=== 8. Oversized attachment on a DM message is rejected server-side (same protection as channels) ===');
  const bigFile = await uploadFile(alice.jwt, 'ultravoc_media', 11 * 1024 * 1024);
  const bigSendRes = await api(alice.jwt, '/api/dms/messages/send', { threadId: threadId, type: 'file', mediaUrl: bigFile.url, mime: 'application/octet-stream' });
  console.log('big attachment send result:', bigSendRes.status, bigSendRes.body);
  check('11MB DM attachment on a free account is rejected', bigSendRes.status === 400 && /volumineuse/.test(bigSendRes.body.error || ''));
  const stillExists = await fileExists('ultravoc_media', bigFile.id);
  check('the oversized DM attachment was deleted server-side', !stillExists);
  if (stillExists) cleanup.bigFile = bigFile.id;

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  for (const mid of cleanup.messages) await awAdmin('/databases/' + DB + '/collections/dms_messages/documents/' + mid, { method: 'DELETE' }).catch(() => {});
  if (cleanup.thread) await awAdmin('/databases/' + DB + '/collections/dms/documents/' + cleanup.thread, { method: 'DELETE' }).catch(() => {});
  if (cleanup.bigFile) await awAdmin('/storage/buckets/ultravoc_media/files/' + cleanup.bigFile, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
