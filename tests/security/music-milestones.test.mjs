// Régression : X1 Music — notifications de palier d'écoutes/likes (ajoutées
// en v4.55.73). Vérifie que /api/music/tracks/play et /api/music/tracks/like
// notifient bien l'ARTISTE (jamais la personne qui écoute/like) au premier
// franchissement d'un palier, jamais une seconde fois pour le même palier,
// et que la notification reste correctement scopée (lisible seulement par
// l'artiste).
import { awAdmin, makeUser, api, DB, makeTally, runTest } from '../lib/live-helpers.mjs';

const { check, report } = makeTally();
const cleanup = { users: [], tracks: [], notifications: [] };

async function main() {
  const artist = await makeUser('musicmilestone', 'artist');
  cleanup.users.push(artist.userId);
  const listener = await makeUser('musicmilestone', 'listener');
  cleanup.users.push(listener.userId);

  console.log('=== 1. A track starts with 0 plays/likes and no milestones ===');
  const create = await api(artist.jwt, '/api/music/tracks/create', { title: 'Milestone Test Track', artistName: 'artist', audioUrl: 'https://x/ms.mp3', durationSec: 120 });
  check('track created', create.status === 200 && create.body.ok === true);
  const trackId = create.body.track.$id;
  cleanup.tracks.push(trackId);
  check('starts with an empty milestonesJson', create.body.track.milestonesJson === '[]' || create.body.track.milestonesJson === undefined || JSON.parse(create.body.track.milestonesJson || '[]').length === 0);

  console.log('\n=== 2. Directly setting playsCount to 100 (simulating many plays) then one more play triggers the milestone notification ===');
  await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + trackId, { method: 'PATCH', body: JSON.stringify({ data: { playsCount: 99 } }) });
  const playRes = await api(listener.jwt, '/api/music/tracks/play', { trackId: trackId });
  console.log('play result:', playRes.status, playRes.body);
  check('play succeeds, playsCount is now 100', playRes.status === 200 && playRes.body.playsCount === 100);

  const trackAfterPlay = await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + trackId);
  const milestonesAfterPlay = JSON.parse(trackAfterPlay.body.milestonesJson || '[]');
  check('milestonesJson now records "plays:100"', milestonesAfterPlay.indexOf('plays:100') >= 0);

  const notifQ = await awAdmin('/databases/' + DB + '/collections/notifications/documents?' + 'queries[]=' + encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'refId', values: [trackId] })));
  const milestoneNotif = (notifQ.body.documents || []).find(function (n) { return n.type === 'music_milestone'; });
  check('a music_milestone notification was created', !!milestoneNotif);
  if (milestoneNotif) cleanup.notifications.push(milestoneNotif.$id);
  check('the notification is addressed to the ARTIST, never the listener who triggered it', !!milestoneNotif && milestoneNotif.uid === artist.userId);
  check('the notification text mentions the track title and the milestone', !!milestoneNotif && milestoneNotif.text.indexOf('Milestone Test Track') >= 0 && milestoneNotif.text.indexOf('100') >= 0);
  check('the notification is only readable/deletable by the artist (scoped permissions)', !!milestoneNotif && (milestoneNotif.$permissions || []).every(function (p) { return p.indexOf('user:' + artist.userId) >= 0; }));

  console.log('\n=== 3. A second play (101) does NOT re-trigger the same 100-plays milestone ===');
  const notifCountBefore = (notifQ.body.documents || []).filter(function (n) { return n.type === 'music_milestone'; }).length;
  const playRes2 = await api(listener.jwt, '/api/music/tracks/play', { trackId: trackId });
  check('second play succeeds, playsCount is 101', playRes2.status === 200 && playRes2.body.playsCount === 101);
  const notifQ2 = await awAdmin('/databases/' + DB + '/collections/notifications/documents?' + 'queries[]=' + encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'refId', values: [trackId] })));
  const milestoneNotifsAfter2 = (notifQ2.body.documents || []).filter(function (n) { return n.type === 'music_milestone'; });
  milestoneNotifsAfter2.forEach(function (n) { if (cleanup.notifications.indexOf(n.$id) < 0) cleanup.notifications.push(n.$id); });
  check('still exactly one music_milestone notification (no duplicate for the same threshold)', milestoneNotifsAfter2.length === notifCountBefore);

  console.log('\n=== 4. Liking the track up to a like-milestone (10) notifies the artist too, unliking never does ===');
  await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + trackId, { method: 'PATCH', body: JSON.stringify({ data: { likesCount: 9 } }) });
  const likeRes = await api(listener.jwt, '/api/music/tracks/like', { trackId: trackId });
  check('like succeeds, likesCount is now 10', likeRes.status === 200 && likeRes.body.liked === true && likeRes.body.likesCount === 10);
  const notifQ3 = await awAdmin('/databases/' + DB + '/collections/notifications/documents?' + 'queries[]=' + encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'refId', values: [trackId] })));
  const likeMilestoneNotif = (notifQ3.body.documents || []).find(function (n) { return n.type === 'music_milestone' && n.text.indexOf("mentions j'aime") >= 0; });
  check('a likes-milestone notification was created for the artist', !!likeMilestoneNotif && likeMilestoneNotif.uid === artist.userId);
  if (likeMilestoneNotif) cleanup.notifications.push(likeMilestoneNotif.$id);

  const unlikeRes = await api(listener.jwt, '/api/music/tracks/like', { trackId: trackId });
  check('unliking succeeds, likesCount back to 9', unlikeRes.status === 200 && unlikeRes.body.liked === false && unlikeRes.body.likesCount === 9);
  const relikeRes = await api(listener.jwt, '/api/music/tracks/like', { trackId: trackId });
  check('re-liking back to 10 does NOT create a second likes-milestone notification', relikeRes.status === 200 && relikeRes.body.likesCount === 10);
  const notifQ4 = await awAdmin('/databases/' + DB + '/collections/notifications/documents?' + 'queries[]=' + encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'refId', values: [trackId] })));
  const likeMilestonesAfter = (notifQ4.body.documents || []).filter(function (n) { return n.type === 'music_milestone' && n.text.indexOf("mentions j'aime") >= 0; });
  likeMilestonesAfter.forEach(function (n) { if (cleanup.notifications.indexOf(n.$id) < 0) cleanup.notifications.push(n.$id); });
  check('still exactly one likes-milestone notification total', likeMilestonesAfter.length === 1);

  return report();
}

async function doCleanup() {
  console.log('\n--- Cleaning up ---');
  for (const id of cleanup.notifications) await awAdmin('/databases/' + DB + '/collections/notifications/documents/' + id, { method: 'DELETE' }).catch(() => {});
  for (const id of cleanup.tracks) await awAdmin('/databases/' + DB + '/collections/xm_tracks/documents/' + id, { method: 'DELETE' }).catch(() => {});
  for (const uid of cleanup.users) await awAdmin('/users/' + uid, { method: 'DELETE' }).catch(() => {});
  console.log('Cleanup done.');
}

runTest(main, doCleanup);
