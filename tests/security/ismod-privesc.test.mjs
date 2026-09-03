// Régression : élévation de privilèges via le champ `isMod` (corrigé en
// v4.55.32). `isMod` vivait dans la collection `users`, directement
// modifiable par son propriétaire (documentSecurity + update() large) —
// n'importe quel compte pouvait donc s'auto-promouvoir modérateur en
// écrivant isMod:true sur son propre document, sans jamais passer par le
// Worker. Le correctif déplace `isMod` vers `user_meta`, verrouillée en
// écriture (admin uniquement), et resolveStaffRole() lit désormais cette
// collection au lieu de `users`.
import { awAdmin, asUserDirect, makeUser, jwtFor, DB, SITE, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [] };

async function main() {
  const attacker = await makeUser('ismod', 'attacker');
  cleanup.users.push(attacker.userId);

  // Reproduit le flux d'inscription de l'app : crée le doc de profil
  // directement, JWT seul (comme le ferait un attaquant appelant l'API
  // Appwrite en direct, sans jamais passer par le Worker).
  await asUserDirect(attacker.jwt, '/databases/' + DB + '/collections/users/documents', {
    method: 'POST',
    body: JSON.stringify({
      documentId: attacker.userId,
      data: { authUserId: attacker.userId, username: 'attacker', isMod: false },
      permissions: ['read("user:' + attacker.userId + '")', 'update("user:' + attacker.userId + '")', 'delete("user:' + attacker.userId + '")']
    })
  });

  console.log('=== 1. The original exploit: writing isMod:true directly on own users document ===');
  const exploitAttempt = await asUserDirect(attacker.jwt, '/databases/' + DB + '/collections/users/documents/' + attacker.userId, {
    method: 'PATCH', body: JSON.stringify({ data: { isMod: true } })
  });
  console.log('write to users.isMod result:', exploitAttempt.status, exploitAttempt.body.isMod !== undefined ? ('isMod=' + exploitAttempt.body.isMod) : exploitAttempt.body.message);
  check('writing users.isMod directly still "succeeds" at the DB layer (field left in schema, harmless)', true);

  console.log('\n=== 2. But it grants NOTHING: /api/admin/access still reports role:member for this account ===');
  const accessRes = await fetch(SITE + '/api/admin/access', { headers: { Authorization: 'Bearer ' + attacker.jwt } });
  const accessBody = await accessRes.json();
  console.log('/api/admin/access:', accessRes.status, JSON.stringify(accessBody));
  check('the self-promoted account has NO admin access despite users.isMod=true', accessBody.ok === false || accessBody.role === 'member');

  console.log('\n=== 3. And a staff-gated route (report status change) rejects them too ===');
  const staffRouteRes = await fetch(SITE + '/api/admin/reports/status', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + attacker.jwt },
    body: JSON.stringify({ reportId: 'doesnotmatter', status: 'reviewed' })
  });
  const staffRouteBody = await staffRouteRes.json().catch(() => ({}));
  console.log('staff-gated route response:', staffRouteRes.status, staffRouteBody.error);
  check('a staff-only route rejects the self-promoted account (403/401)', staffRouteRes.status === 403 || staffRouteRes.status === 401);

  console.log('\n=== 4. Legitimate path still works end-to-end: a real owner-tier account grants mod via /api/admin/mod, lands in user_meta, and resolveStaffRole picks it up ===');
  const target = await makeUser('ismod', 'modtarget');
  cleanup.users.push(target.userId);
  const targetProfileRes = await asUserDirect(target.jwt, '/databases/' + DB + '/collections/users/documents', {
    method: 'POST',
    body: JSON.stringify({
      documentId: target.userId,
      data: { authUserId: target.userId, username: 'modtarget', isMod: false },
      permissions: ['read("user:' + target.userId + '")', 'update("user:' + target.userId + '")', 'delete("user:' + target.userId + '")']
    })
  });

  // 1leeway (6a98b09b003e78fa65d4) : compte owner-tier réel, déjà cité en
  // clair dans worker.js (voir isShamanAccount()) — pas un secret.
  const ownerJwt = await jwtFor('6a98b09b003e78fa65d4');

  const grantRes = await fetch(SITE + '/api/admin/mod', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + ownerJwt },
    body: JSON.stringify({ profileId: targetProfileRes.body.$id, isMod: true, targetName: 'modtarget' })
  });
  const grantBody = await grantRes.json();
  console.log('grant result:', grantRes.status, JSON.stringify(grantBody));
  check('a real owner-tier account CAN grant mod via the proper route', grantRes.status === 200 && grantBody.ok === true);

  const metaAfterGrant = await awAdmin('/databases/' + DB + '/collections/user_meta/documents/' + target.userId);
  console.log('user_meta.isMod after grant:', metaAfterGrant.body.isMod);
  check('isMod landed in user_meta (not users)', metaAfterGrant.status === 200 && metaAfterGrant.body.isMod === true);

  const targetAccessRes = await fetch(SITE + '/api/admin/access', { headers: { Authorization: 'Bearer ' + target.jwt } });
  const targetAccessBody = await targetAccessRes.json();
  console.log('freshly-granted mod /api/admin/access:', JSON.stringify(targetAccessBody));
  check('the legitimately-granted mod now resolves to role:mod', targetAccessBody.ok === true && targetAccessBody.role === 'mod');

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  for (const uid of cleanup.users) {
    await awAdmin('/databases/' + DB + '/collections/users/documents/' + uid, { method: 'DELETE' }).catch(() => {});
    await awAdmin('/databases/' + DB + '/collections/user_meta/documents/' + uid, { method: 'DELETE' }).catch(() => {});
    await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  }
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
