// Régression : contournement de la qualité audio/vidéo X1+ d'un serveur
// (corrigé en v4.55.36). Le propriétaire d'un serveur recevait le droit
// update() direct sur son document Appwrite `servers`. La route
// /api/servers/quality vérifie bien X1+ avant d'accorder la qualité
// "haute", mais rien n'empêchait de contourner cette route et de PATCHer
// directement via l'API Appwrite pour forcer la qualité réservée aux
// abonnés. Le correctif retire update() du document à la création (toutes
// les modifications légitimes passent déjà par des routes /api/servers/*
// admin-médiées) et migre les serveurs existants.
import { awAdmin, asUserDirect, makeUser, api, DB, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], server: null };

async function main() {
  const eve = await makeUser('qbypass', 'eve'); // not Plus
  cleanup.users.push(eve.userId);

  console.log('=== Eve (not Plus) creates a server via the legit route ===');
  const createRes = await api(eve.jwt, '/api/servers/create', { name: 'Eve Test Server' });
  console.log(createRes.status, createRes.body.ok);
  check('server created', createRes.status === 200 && createRes.body.ok === true);
  cleanup.server = createRes.body.server && createRes.body.server.$id;
  console.log('server id:', cleanup.server, 'initial audioQualityKey:', createRes.body.server.audioQualityKey);

  console.log('\n=== Eve tries the legit /api/servers/quality route (expect rejection, not Plus) ===');
  const qRes = await api(eve.jwt, '/api/servers/quality', { serverId: cleanup.server, audioQualityKey: 'high' });
  console.log('via worker route:', qRes.status, JSON.stringify(qRes.body));
  check('the legit route rejects the upgrade for a non-Plus owner', qRes.status !== 200 || qRes.body.ok === false);

  console.log('\n=== Eve tries to bypass the worker and PATCH the servers document DIRECTLY via Appwrite ===');
  const directPatch = await asUserDirect(eve.jwt, '/databases/' + DB + '/collections/servers/documents/' + cleanup.server, {
    method: 'PATCH', body: JSON.stringify({ data: { audioQualityKey: 'high', screenQualityKey: '1080p60' } })
  });
  console.log('direct PATCH status:', directPatch.status);
  check('the owner has no direct update() permission on the servers document (bypass closed)', directPatch.status === 401 || directPatch.status === 403);

  return report();
}

async function doCleanup() {
  if (cleanup.server) await awAdmin('/databases/xultra/collections/servers/documents/' + cleanup.server, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
}

runTest(main, doCleanup);
