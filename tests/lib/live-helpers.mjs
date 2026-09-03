// Helpers partagés par les tests de sécurité E2E (tests/security/*.mjs).
//
// Ces tests s'exécutent contre le site RÉEL (xultra.space) et la base
// Appwrite RÉELLE — pas d'environnement de test séparé. Ils créent des
// comptes jetables (préfixés x1test.*) via la clé API admin, exercent les
// routes/collections avec de vrais JWT, puis nettoient tout ce qu'ils ont
// créé dans un bloc finally-style. Ne JAMAIS committer la clé elle-même :
// elle est lue depuis la variable d'environnement AW_ADMIN_KEY (voir
// tests/README.md).

export const AW_EP = 'https://fra.cloud.appwrite.io/v1';
export const PID = '6a73b975002f14dc6b91';
export const DB = 'xultra';
export const SITE = 'https://xultra.space';

const AW_KEY = process.env.AW_ADMIN_KEY;
if (!AW_KEY) {
  console.error('AW_ADMIN_KEY non défini — voir tests/README.md pour lancer ces tests.');
  process.exit(1);
}

export function makeTally() {
  let pass = 0, fail = 0;
  function check(label, cond) {
    console.log((cond ? 'PASS' : 'FAIL') + ' — ' + label);
    if (cond) pass++; else fail++;
  }
  function report() {
    console.log('\n=== ' + pass + ' passed, ' + fail + ' failed ===');
    return fail === 0;
  }
  return { check, report, get pass() { return pass; }, get fail() { return fail; } };
}

export async function awAdmin(path, opts = {}) {
  const headers = { 'X-Appwrite-Project': PID, 'X-Appwrite-Key': AW_KEY, 'Content-Type': 'application/json' };
  const r = await fetch(AW_EP + path, { method: opts.method || 'GET', headers, body: opts.body });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

// Monte un JWT utilisateur via une session admin (jamais le mot de passe réel).
export async function jwtFor(userId) {
  const session = await awAdmin('/users/' + userId + '/sessions', { method: 'POST' });
  const jwtRes = await fetch(AW_EP + '/account/jwts', {
    method: 'POST',
    headers: { 'X-Appwrite-Project': PID, 'X-Appwrite-Session': session.body.secret, 'Content-Type': 'application/json' },
    body: '{}'
  });
  return (await jwtRes.json()).jwt;
}

// Crée un compte Appwrite jetable (userId + email uniques) et son JWT.
export async function makeUser(testTag, label) {
  const userId = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  await awAdmin('/users', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      email: 'x1test.' + testTag + '.' + label + '.' + Date.now() + Math.random().toString(36).slice(2, 5) + '@example.com',
      password: 'TestPass123!xyz',
      name: label
    })
  });
  const jwt = await jwtFor(userId);
  return { userId, jwt };
}

// Appelle une route POST /api/* du Worker avec un JWT en Bearer.
export async function api(jwt, path, body) {
  const r = await fetch(SITE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + jwt },
    body: JSON.stringify(body || {})
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

// Appelle directement l'API REST Appwrite avec un JWT (contourne le Worker —
// sert à vérifier ce qu'un utilisateur peut faire au niveau base, pas
// seulement au niveau des routes applicatives).
export async function asUserDirect(jwt, path, opts = {}) {
  const headers = { 'X-Appwrite-Project': PID, 'X-Appwrite-JWT': jwt, 'Content-Type': 'application/json' };
  const r = await fetch(AW_EP + path, { method: opts.method || 'GET', headers, body: opts.body });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

// Téléverse un fichier factice de taille donnée dans un bucket Appwrite Storage.
export async function uploadFile(jwt, bucket, sizeBytes) {
  const buf = Buffer.alloc(sizeBytes, 1);
  const form = new FormData();
  const fileId = 'tst' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  form.append('fileId', fileId);
  form.append('file', new Blob([buf]), 'test.bin');
  form.append('permissions[]', 'read("any")');
  const r = await fetch(AW_EP + '/storage/buckets/' + bucket + '/files', {
    method: 'POST',
    headers: { 'X-Appwrite-Project': PID, 'X-Appwrite-JWT': jwt },
    body: form
  });
  const body = await r.json();
  const url = 'https://fra.cloud.appwrite.io/v1/storage/buckets/' + bucket + '/files/' + body.$id + '/view?project=' + PID;
  return { id: body.$id, url };
}

export async function fileExists(bucket, id) {
  const r = await awAdmin('/storage/buckets/' + bucket + '/files/' + id);
  return r.status === 200;
}

// Exécute main(), garantit doCleanup() dans tous les cas, sort avec le bon code.
export function runTest(main, doCleanup) {
  main()
    .then(async (ok) => { await doCleanup(); process.exit(ok === false ? 1 : 0); })
    .catch(async (e) => { console.error('CRASH', e); await doCleanup(); process.exit(1); });
}
