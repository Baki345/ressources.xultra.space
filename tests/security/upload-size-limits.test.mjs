// Régression : taille des imports musique/story/post créateur non
// vérifiée côté serveur (corrigé en v4.55.36, même schéma que
// attachment-size.test.mjs pour les pièces jointes de messages).
//
// Note : un upload > 50MB en un seul POST multipart échoue systématiquement
// côté infrastructure Appwrite Cloud (503 "backend write error" côté
// Varnish, reproduit aussi en curl brut, indépendant de cet environnement)
// — le SDK client réel fait de l'upload "chunké" que ce test ne reproduit
// pas. On ne peut donc pas déclencher ici un vrai rejet >50MB en live ; le
// chemin de rejet réutilise le pattern déjà testé en conditions réelles
// dans attachment-size.test.mjs (11MB > 10MB, awFetch + sizeOriginal +
// suppression). Ici on vérifie : (a) le plafond du bucket musique lui-même,
// et (b) qu'un import normal (sous la limite) est bien accepté pour les
// trois routes.
import { awAdmin, makeUser, api, uploadFile, DB, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], stories: [], tracks: [], posts: [], files: [] };

async function main() {
  const bob = await makeUser('upsize', 'bob');
  cleanup.users.push(bob.userId);

  console.log('=== 1. Music: the xultra_music bucket itself hard-caps at 100MB, matching our 100MB server-side check (defense in depth) ===');
  const bucketInfo = await awAdmin('/storage/buckets/xultra_music');
  check('xultra_music bucket maximumFileSize <= 100MB', bucketInfo.body.maximumFileSize <= 100 * 1024 * 1024);

  console.log('\n=== 2. Music: small audio upload (1MB) accepted ===');
  const smallMusic = await uploadFile(bob.jwt, 'xultra_music', 1 * 1024 * 1024);
  const smallMusicRes = await api(bob.jwt, '/api/music/tracks/create', { title: 'Small track', audioUrl: smallMusic.url, mime: 'audio/mpeg' });
  check('1MB music track accepted', smallMusicRes.status === 200 && smallMusicRes.body.ok === true);
  if (smallMusicRes.body.track) cleanup.tracks.push(smallMusicRes.body.track.$id);
  else cleanup.files.push(['xultra_music', smallMusic.id]);

  console.log('\n=== 3. Stories: small media (1MB) accepted ===');
  const smallStory = await uploadFile(bob.jwt, 'ultravoc_media', 1 * 1024 * 1024);
  const smallStoryRes = await api(bob.jwt, '/api/stories/create', { mediaUrl: smallStory.url, mediaType: 'image' });
  check('1MB story accepted', smallStoryRes.status === 200 && smallStoryRes.body.ok === true);
  if (smallStoryRes.body.story) cleanup.stories.push(smallStoryRes.body.story.$id);
  else cleanup.files.push(['ultravoc_media', smallStory.id]);

  console.log('\n=== 4. Creator posts: small media (1MB) accepted, for a badged creator ===');
  const badgePatch = await awAdmin('/databases/' + DB + '/collections/user_meta/documents/' + bob.userId, {
    method: 'PATCH', body: JSON.stringify({ data: { badgesJson: JSON.stringify(['creator']) } })
  });
  if (badgePatch.status !== 200) {
    await awAdmin('/databases/' + DB + '/collections/user_meta/documents', {
      method: 'POST', body: JSON.stringify({ documentId: bob.userId, data: { badgesJson: JSON.stringify(['creator']) }, permissions: ['read("any")'] })
    });
  }
  const smallPost = await uploadFile(bob.jwt, 'ultravoc_media', 1 * 1024 * 1024);
  const smallPostRes = await api(bob.jwt, '/api/creators/posts/create', { title: 'Small post', mediaUrl: smallPost.url, mediaType: 'image' });
  check('1MB creator post accepted', smallPostRes.status === 200 && smallPostRes.body.ok === true);
  if (smallPostRes.body.post) cleanup.posts.push(smallPostRes.body.post.$id);
  else cleanup.files.push(['ultravoc_media', smallPost.id]);

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  for (const id of cleanup.tracks) await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + id, { method: 'DELETE' }).catch(() => {});
  for (const id of cleanup.stories) await awAdmin('/databases/' + DB + '/collections/stories/documents/' + id, { method: 'DELETE' }).catch(() => {});
  for (const id of cleanup.posts) await awAdmin('/databases/' + DB + '/collections/creator_posts/documents/' + id, { method: 'DELETE' }).catch(() => {});
  for (const [bucket, id] of cleanup.files) await awAdmin('/storage/buckets/' + bucket + '/files/' + id, { method: 'DELETE' }).catch(() => {});
  if (cleanup.users[0]) await awAdmin('/databases/' + DB + '/collections/user_meta/documents/' + cleanup.users[0], { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
