'use strict';
// Lecture audio YouTube dans un salon vocal LiveKit : yt-dlp extrait le
// meilleur flux audio, ffmpeg le transcode en PCM brut (48kHz stéréo, le
// format attendu par AudioSource), et on pousse ce PCM frame par frame dans
// la piste locale déjà publiée par voice.js. Rien de tout ça n'est fourni
// par IXin — c'est exactement pour cette raison que ce bot doit tourner comme
// process externe (voir le portail développeur).
const { spawn, execFile } = require('child_process');
const { AudioFrame } = require('@livekit/rtc-node');
const { YTDLP_PATH, FFMPEG_PATH } = require('./env');
const { SAMPLE_RATE, CHANNELS } = require('./voice');

const FRAME_MS = 20;
const SAMPLES_PER_CHANNEL = (SAMPLE_RATE * FRAME_MS) / 1000; // 960
const FRAME_BYTES = SAMPLES_PER_CHANNEL * CHANNELS * 2; // 2 octets par échantillon int16

function isUrl(s) { return /^https?:\/\//i.test(s); }

function execCapture(bin, args) {
  return new Promise(function (resolve, reject) {
    execFile(bin, args, { maxBuffer: 10 * 1024 * 1024 }, function (err, stdout) {
      if (err) reject(err); else resolve(stdout);
    });
  });
}

// Résout une URL YouTube (ou une recherche texte libre) en { url, title,
// duration } sans encore streamer l'audio, pour pouvoir répondre tout de
// suite au /play avec le vrai titre de la vidéo.
async function resolveTrack(query) {
  const target = isUrl(query) ? query : 'ytsearch1:' + query;
  let out;
  try {
    out = await execCapture(YTDLP_PATH, ['-j', '--no-playlist', target]);
  } catch (e) {
    throw new Error('yt-dlp a échoué (vidéo introuvable/privée, ou yt-dlp pas installé ?) : ' + (e && e.message || e));
  }
  const line = out.trim().split('\n')[0];
  let info;
  try { info = JSON.parse(line); } catch (e) { throw new Error('Réponse yt-dlp illisible pour : ' + query); }
  return { url: info.webpage_url || target, title: info.title || query, duration: info.duration || 0 };
}

function bufToInt16Array(buf) {
  const arr = new Int16Array(buf.length / 2);
  for (let i = 0; i < arr.length; i++) arr[i] = buf.readInt16LE(i * 2);
  return arr;
}

// Streame l'audio de `url` vers `source` (AudioSource LiveKit déjà publiée)
// jusqu'à la fin de la piste OU jusqu'à ce que `signal` s'annule (skip/stop).
// Résout avec 'ended' ou 'aborted' — ne rejette que sur une vraie erreur
// (binaire manquant, flux illisible).
function streamToSource(source, url, signal) {
  return new Promise(function (resolve, reject) {
    const yt = spawn(YTDLP_PATH, ['-f', 'bestaudio/best', '--no-playlist', '-o', '-', url]);
    const ff = spawn(FFMPEG_PATH, ['-hide_banner', '-loglevel', 'error', '-i', 'pipe:0', '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', String(CHANNELS), 'pipe:1']);
    yt.stdout.pipe(ff.stdin);

    let stopped = false;
    let bytesReceived = 0;
    let settled = false;
    function finish(result) { if (!settled) { settled = true; resolve(result); } }
    function cleanup() {
      stopped = true;
      try { yt.kill('SIGKILL'); } catch (e) {}
      try { ff.kill('SIGKILL'); } catch (e) {}
    }
    if (signal) signal.addEventListener('abort', function () { cleanup(); finish('aborted'); });

    let leftover = Buffer.alloc(0);
    ff.stdout.on('data', function (chunk) {
      bytesReceived += chunk.length;
      ff.stdout.pause();
      leftover = Buffer.concat([leftover, chunk]);
      (async function () {
        while (leftover.length >= FRAME_BYTES && !stopped) {
          const frameBuf = leftover.subarray(0, FRAME_BYTES);
          leftover = leftover.subarray(FRAME_BYTES);
          const frame = new AudioFrame(bufToInt16Array(frameBuf), SAMPLE_RATE, CHANNELS, SAMPLES_PER_CHANNEL);
          try { await source.captureFrame(frame); } catch (e) { stopped = true; break; }
        }
        if (!stopped) ff.stdout.resume();
      })();
    });

    ff.stdout.on('end', async function () {
      if (stopped) return;
      if (bytesReceived === 0) { cleanup(); reject(new Error('Aucun audio reçu (ffmpeg/yt-dlp) pour ' + url)); return; }
      try { await source.waitForPlayout(); } catch (e) {}
      finish('ended');
    });

    ff.on('error', function (e) { cleanup(); reject(new Error('ffmpeg introuvable ou a planté : ' + e.message)); });
    yt.on('error', function (e) { cleanup(); reject(new Error('yt-dlp introuvable ou a planté : ' + e.message)); });
    ff.stderr.on('data', function (d) { console.error('[ffmpeg]', d.toString().trim()); });
  });
}

module.exports = { resolveTrack, streamToSource, isUrl };
