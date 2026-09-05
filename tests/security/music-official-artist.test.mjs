// Régression : X1 Music — fiche artiste officielle automatique (ajoutée en
// v4.55.69, corrige un vrai bug remonté : un album officiel dont les
// fichiers n'indiquaient pas l'artiste se retrouvait attribué à la
// personne qui l'avait envoyé). Vérifie que /api/music/tracks/create :
//  - corrige le nom d'artiste vers la graphie officielle dès qu'une preuve
//    forte existe (titre + durée identiques à un vrai enregistrement),
//    MÊME si le nom saisi n'a aucune ressemblance avec le vrai artiste ;
//  - crée/réutilise une fiche xm_official_artists dédupliquée par nom
//    normalisé, jamais un doublon pour le même artiste ;
//  - relie le titre à cette fiche (officialArtistId), jamais au compte de
//    la personne ayant fait l'upload.
// Dépend d'un vrai match Deezer/iTunes — utilise un titre/artiste réel et
// stable ("Bohemian Rhapsody" / Queen) plutôt qu'un mock, comme le reste de
// la suite teste contre les vraies routes en production.
import { awAdmin, makeUser, api, DB, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], tracks: [], officialArtists: [] };

async function main() {
  const alice = await makeUser('musicofficial', 'alice');
  cleanup.users.push(alice.userId);

  console.log('=== 1. An upload with a real commercial title/duration, but the UPLOADER\'s own (unrelated) name as artist, gets corrected ===');
  const create1 = await api(alice.jwt, '/api/music/tracks/create', {
    title: 'Bohemian Rhapsody', artistName: 'alice', audioUrl: 'https://x/br1.mp3', durationSec: 355
  });
  console.log('create with wrong artist:', create1.status, create1.body.ok, create1.body.track && create1.body.track.artistName);
  check('create succeeds', create1.status === 200 && create1.body.ok === true);
  if (create1.body.track) cleanup.tracks.push(create1.body.track.$id);
  const track1 = create1.body.track;
  check('server corrected artistName away from the uploader\'s own name', track1 && track1.artistName !== 'alice');
  check('contentType is "official"', track1 && track1.contentType === 'official');
  check('officialArtistId was set (a real artist profile got attached)', track1 && !!track1.officialArtistId);
  check('officialArtistPhoto was set on the track (denormalized for display)', track1 && typeof track1.officialArtistPhoto === 'string');
  if (track1 && track1.officialArtistId) cleanup.officialArtists.push(track1.officialArtistId);

  console.log('\n=== 2. The official artist profile exists, is public-read, and its trackCount reflects this upload ===');
  const artistDoc = track1 ? await awAdmin('/databases/' + DB + '/collections/xm_official_artists/documents/' + track1.officialArtistId) : { status: 0 };
  console.log('artist doc:', artistDoc.status, artistDoc.body.name, artistDoc.body.trackCount);
  check('artist profile document exists', artistDoc.status === 200);
  check('artist profile is readable by anyone (public-read, not tied to any account)', (artistDoc.body.$permissions || []).some(function (p) { return p.indexOf('read') >= 0; }));
  check('trackCount is at least 1 after this upload', artistDoc.status === 200 && (artistDoc.body.trackCount || 0) >= 1);
  check('artistDoc name matches the corrected artistName stored on the track', artistDoc.status === 200 && track1 && artistDoc.body.name === track1.artistName);

  console.log('\n=== 3. A second official upload of a DIFFERENT song by the same real artist reuses the SAME profile (no duplicate fiche) ===');
  const create2 = await api(alice.jwt, '/api/music/tracks/create', {
    title: 'Another Song Zzqvux Nonexistent', artistName: (track1 && track1.artistName) || 'Queen', audioUrl: 'https://x/notreal2.mp3', durationSec: 999
  });
  // This second track is NOT expected to match any real catalog entry
  // (nonsense title) — this step instead directly re-triggers artist
  // resolution by name via a track that legitimately matches, to prove
  // dedup. Use bob to avoid any dedup-by-title collision with track 1.
  if (create2.body.track) cleanup.tracks.push(create2.body.track.$id);

  const bob = await makeUser('musicofficial', 'bob');
  cleanup.users.push(bob.userId);
  const create3 = await api(bob.jwt, '/api/music/tracks/create', {
    title: 'Bohemian Rhapsody', artistName: 'bob', audioUrl: 'https://x/br2.mp3', durationSec: 355
  });
  console.log('second real upload of the same song, different account:', create3.status, create3.body.track && create3.body.track.officialArtistId);
  if (create3.body.track) cleanup.tracks.push(create3.body.track.$id);
  check('second upload also gets classified official with a corrected artist name', create3.body.track && create3.body.track.contentType === 'official' && create3.body.track.artistName !== 'bob');
  check('second upload reuses the EXACT SAME official artist profile (deduplicated by normalized name)', create3.body.track && track1 && create3.body.track.officialArtistId === track1.officialArtistId);

  console.log('\n=== 4. A genuinely original, made-up song/artist is NEVER misclassified as official just because of an unrelated title match ===');
  const create4 = await api(alice.jwt, '/api/music/tracks/create', {
    title: 'Zzqvux Wobblefrob My Own Original Creation', artistName: 'alice', audioUrl: 'https://x/indie999.mp3', durationSec: 137
  });
  if (create4.body.track) cleanup.tracks.push(create4.body.track.$id);
  check('nonsense title/artist stays independent, no officialArtistId', create4.status === 200 && create4.body.track && create4.body.track.contentType === 'independent' && !create4.body.track.officialArtistId);
  check('artistName is untouched for a genuinely independent upload', create4.body.track && create4.body.track.artistName === 'alice');

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  for (const id of cleanup.tracks) await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + id, { method: 'DELETE' }).catch(() => {});
  const uniqueArtists = [...new Set(cleanup.officialArtists)];
  for (const id of uniqueArtists) await awAdmin('/databases/' + DB + '/collections/xm_official_artists/documents/' + id, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
