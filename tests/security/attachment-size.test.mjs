// Régression : taille des pièces jointes de salon non vérifiée côté
// serveur (corrigé en v4.55.33). La limite (10 Mo gratuit / 500 Mo X1+)
// n'était appliquée que côté client avant l'upload — un fichier envoyé en
// contournant ce check (upload direct via l'API Appwrite, puis appel de
// /api/servers/channels/messages/send) passait sans problème. Le correctif
// revérifie la taille RÉELLE (sizeOriginal) du fichier déjà téléversé avant
// d'accepter le message, et supprime le fichier s'il dépasse la limite.
import { awAdmin, makeUser, uploadFile, fileExists, DB, SITE, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], server: null, files: [] };

async function main() {
  const freeUser = await makeUser('attach', 'free');
  cleanup.users.push(freeUser.userId);

  const server = await awAdmin('/databases/' + DB + '/collections/servers/documents', {
    method: 'POST', body: JSON.stringify({ documentId: 'unique()', data: { ownerId: freeUser.userId, name: 'Attach size test server', boostedByJson: '[]', inviteCode: 'ttattach' + Date.now().toString(36) } })
  });
  cleanup.server = server.body.$id;
  const channel = await awAdmin('/databases/' + DB + '/collections/server_channels/documents', {
    method: 'POST', body: JSON.stringify({ documentId: 'unique()', data: { serverId: server.body.$id, name: 'general', type: 'text', position: 0 } })
  });

  console.log('=== 1. Small attachment (1MB, under the 10MB free limit) is accepted ===');
  const smallFile = await uploadFile(freeUser.jwt, 'ultravoc_media', 1 * 1024 * 1024);
  cleanup.files.push(smallFile.id);
  const r1 = await fetch(SITE + '/api/servers/channels/messages/send', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + freeUser.jwt },
    body: JSON.stringify({ serverId: server.body.$id, channelId: channel.body.$id, type: 'file', mediaUrl: smallFile.url, mime: 'application/octet-stream' })
  });
  const r1Body = await r1.json();
  console.log('small file message result:', r1.status, r1Body.ok);
  check('1MB attachment message accepted', r1.status === 200 && r1Body.ok === true);

  console.log('\n=== 2. Oversized attachment (11MB, over the 10MB free limit) is rejected ===');
  const bigFile = await uploadFile(freeUser.jwt, 'ultravoc_media', 11 * 1024 * 1024);
  cleanup.files.push(bigFile.id);
  const r2 = await fetch(SITE + '/api/servers/channels/messages/send', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + freeUser.jwt },
    body: JSON.stringify({ serverId: server.body.$id, channelId: channel.body.$id, type: 'file', mediaUrl: bigFile.url, mime: 'application/octet-stream' })
  });
  const r2Body = await r2.json();
  console.log('11MB file message result:', r2.status, r2Body);
  check('11MB attachment on a free account is rejected even though the client-side check was bypassed (direct upload)', r2.status === 500 && r2Body.ok === false && /volumineuse/.test(r2Body.error || ''));

  console.log('\n=== 3. The rejected oversized file was deleted server-side (not left orphaned) ===');
  const stillExists = await fileExists('ultravoc_media', bigFile.id);
  console.log('file still exists?', stillExists);
  check('the oversized file was cleaned up after rejection', !stillExists);
  if (stillExists) cleanup.files.push(bigFile.id); // safety net if the assertion above failed

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  if (cleanup.server) {
    const msgsQ = await awAdmin('/databases/' + DB + '/collections/server_channel_messages/documents?' + 'queries[]=' + encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'serverId', values: [cleanup.server] })));
    for (const m of (msgsQ.body.documents || [])) await awAdmin('/databases/' + DB + '/collections/server_channel_messages/documents/' + m.$id, { method: 'DELETE' }).catch(() => {});
    const chansQ = await awAdmin('/databases/' + DB + '/collections/server_channels/documents?' + 'queries[]=' + encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'serverId', values: [cleanup.server] })));
    for (const c of (chansQ.body.documents || [])) await awAdmin('/databases/' + DB + '/collections/server_channels/documents/' + c.$id, { method: 'DELETE' }).catch(() => {});
    await awAdmin('/databases/' + DB + '/collections/servers/documents/' + cleanup.server, { method: 'DELETE' }).catch(() => {});
  }
  for (const fid of cleanup.files) await awAdmin('/storage/buckets/ultravoc_media/files/' + fid, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
