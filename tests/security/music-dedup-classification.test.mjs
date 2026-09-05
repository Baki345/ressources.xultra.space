// Régression : X1 Music — anti-doublons + classification officiel/indépendant
// (ajouté en v4.55.68). L'envoi est bloqué AVANT création dès qu'un même
// fichier audio (empreinte SHA-256 identique) ou un même (titre, artiste,
// durée) existe déjà — jamais une suppression après coup, qui pourrait
// effacer un vrai titre sur une simple heuristique. contentType (officiel vs
// indépendant) ne doit JAMAIS être accepté tel quel depuis le client :
// toujours recalculé côté serveur, comme channel:'streaming' l'est déjà.
import crypto from 'crypto';
import { awAdmin, makeUser, api, uploadFile, DB, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], tracks: [], files: [] };

async function createTrack(jwt, overrides) {
  return api(jwt, '/api/music/tracks/create', Object.assign({
    title: 'Untitled', artistName: 'Nobody', audioUrl: 'https://x/none.mp3', durationSec: 180
  }, overrides));
}

async function main() {
  const alice = await makeUser('musicdedup', 'alice');
  cleanup.users.push(alice.userId);
  const bob = await makeUser('musicdedup', 'bob');
  cleanup.users.push(bob.userId);

  console.log('=== 1. Exact-hash duplicate is rejected, even from a different account ===');
  const fileA = await uploadFile(alice.jwt, 'xultra_music', 2048);
  cleanup.files.push({ bucket: 'xultra_music', id: fileA.id });
  const hashA = crypto.createHash('sha256').update(Buffer.alloc(2048, 1)).digest('hex');

  const firstCreate = await createTrack(alice.jwt, { title: 'Original Track', artistName: 'Alice', audioUrl: fileA.url, durationSec: 200, audioHash: hashA });
  console.log('first create:', firstCreate.status, firstCreate.body.ok);
  check('first upload of this audio succeeds', firstCreate.status === 200 && firstCreate.body.ok === true);
  if (firstCreate.body.track) cleanup.tracks.push(firstCreate.body.track.$id);

  const dupCreate = await createTrack(bob.jwt, { title: 'Reuploaded Under Another Name', artistName: 'Bob', audioUrl: fileA.url, durationSec: 200, audioHash: hashA });
  console.log('duplicate create (same hash, different account):', dupCreate.status, dupCreate.body);
  check('exact-hash duplicate rejected (HTTP 500 + ok:false)', dupCreate.status === 500 && dupCreate.body.ok === false);
  check('rejection message names the original track', typeof dupCreate.body.error === 'string' && dupCreate.body.error.indexOf('Original Track') >= 0);

  console.log('\n=== 2. Near-duplicate: same normalized (title, artist) + duration within 3s is rejected ===');
  const nearDup = await createTrack(bob.jwt, { title: '  ORIGINAL-Track!!  ', artistName: 'alice', durationSec: 202, audioUrl: 'https://x/reencoded.mp3' });
  console.log('near-duplicate create (accents/casse/ponctuation ignorés, durée ±3s):', nearDup.status, nearDup.body);
  check('near-duplicate rejected despite different casing/punctuation/audio file', nearDup.status === 500 && nearDup.body.ok === false);
  check('near-duplicate rejection also names the original track', typeof nearDup.body.error === 'string' && nearDup.body.error.indexOf('Original Track') >= 0);

  console.log('\n=== 3. Same title/artist but duration far outside tolerance is NOT flagged as a duplicate ===');
  const notDup = await createTrack(bob.jwt, { title: 'Original Track', artistName: 'Alice', durationSec: 400, audioUrl: 'https://x/different-song.mp3' });
  console.log('same title/artist, very different duration:', notDup.status, notDup.body.ok);
  check('a genuinely different track with the same title/artist is NOT rejected', notDup.status === 200 && notDup.body.ok === true);
  if (notDup.body.track) cleanup.tracks.push(notDup.body.track.$id);

  console.log('\n=== 4. contentType is never trusted from client input — always recomputed server-side ===');
  const forgedOfficial = await createTrack(alice.jwt, { title: 'Zzqvux Wobblefrob Nonexistent Song', artistName: 'Zzqvux Wobblefrob Fake Artist Xyz123', durationSec: 123, audioUrl: 'https://x/indie1.mp3', contentType: 'official' });
  console.log('forged contentType:', forgedOfficial.status, forgedOfficial.body);
  check('create succeeds', forgedOfficial.status === 200 && forgedOfficial.body.ok === true);
  if (forgedOfficial.body.track) cleanup.tracks.push(forgedOfficial.body.track.$id);
  const storedForged = await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + (forgedOfficial.body.track && forgedOfficial.body.track.$id));
  check('server ignored the client-forged contentType:"official" (nonsense title/artist has no real commercial match, so it stays independent)', storedForged.status === 200 && storedForged.body.contentType === 'independent');

  console.log('\n=== 5. wantStreaming (channel:"streaming") without eligibility does NOT grant contentType "official" either ===');
  const forgedStreaming = await createTrack(bob.jwt, { title: 'Another Made Up Title Zzqvux', artistName: 'Another Fake Artist Zzqvux', durationSec: 111, audioUrl: 'https://x/indie2.mp3', wantStreaming: true });
  check('create succeeds', forgedStreaming.status === 200 && forgedStreaming.body.ok === true);
  if (forgedStreaming.body.track) cleanup.tracks.push(forgedStreaming.body.track.$id);
  check('channel stays "member" (bob has no streaming-eligible badge)', forgedStreaming.body.track && forgedStreaming.body.track.channel === 'member');
  const storedStreaming = await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + (forgedStreaming.body.track && forgedStreaming.body.track.$id));
  check('contentType stays "independent" (wantStreaming alone never grants "official")', storedStreaming.status === 200 && storedStreaming.body.contentType === 'independent');

  console.log('\n=== 6. audioHash is only accepted as a 64-char hex string — a garbage value is silently ignored, not stored raw or crashing the route ===');
  const garbageHash = await createTrack(alice.jwt, { title: 'Garbage Hash Track Zzqvux', artistName: 'Zzqvux', durationSec: 90, audioUrl: 'https://x/indie3.mp3', audioHash: '<script>not-a-hash</script>' });
  check('create still succeeds with a malformed audioHash', garbageHash.status === 200 && garbageHash.body.ok === true);
  if (garbageHash.body.track) cleanup.tracks.push(garbageHash.body.track.$id);
  const storedGarbage = await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + (garbageHash.body.track && garbageHash.body.track.$id));
  check('malformed audioHash was NOT stored as-is (only real 64-hex-char hashes are kept for comparison)', storedGarbage.status === 200 && storedGarbage.body.audioHash !== '<script>not-a-hash</script>');

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  for (const id of cleanup.tracks) await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + id, { method: 'DELETE' }).catch(() => {});
  for (const f of cleanup.files) await awAdmin('/storage/buckets/' + f.bucket + '/files/' + f.id, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
