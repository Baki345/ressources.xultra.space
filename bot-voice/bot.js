#!/usr/bin/env node
'use strict';
// ===== Bot vocal X1 : musique YouTube en appel + enregistrement =====
// Basé sur le kit de démarrage bot-x1.js (mêmes principes : HTTP minimal,
// signature HMAC, aucune dépendance à un compte X1), étendu avec une vraie
// connexion LiveKit (@livekit/rtc-node) pour la voix — la seule partie que
// X1 ne peut pas fournir depuis un Worker Cloudflare (pas de connexion
// persistante possible côté serveur X1, voir le portail développeur).
//
// Dépendances système à installer sur le VPS AVANT de lancer ce bot :
//   - Node.js 18+
//   - ffmpeg          (apt install ffmpeg)
//   - yt-dlp          (pip install -U yt-dlp, ou binaire officiel)
// Voir README.md pour le détail complet du déploiement.
const http = require('http');
const env = require('./lib/env');
const { verifySignature } = require('./lib/signature');
const api = require('./lib/api');
const { joinVoice, leaveVoice } = require('./lib/voice');
const { resolveTrack, streamToSource } = require('./lib/player');
const { Recorder } = require('./lib/recorder');
const sessions = require('./lib/session');

// ---- Contexte cible (salon de serveur OU DM de groupe) à partir du payload d'interaction ----
function targetFromPayload(payload) {
  if (payload.channel && payload.channel.isDm) return { dmThreadId: payload.channel.id };
  return { serverId: payload.server && payload.server.id, channelId: payload.channel && payload.channel.id };
}

async function ensureSession(target) {
  let session = sessions.get(target);
  if (session) return session;
  const voiceRes = await api.getVoiceToken(target);
  const { room, source } = await joinVoice(voiceRes.token);
  api.presenceJoin(target).catch(function (e) { console.error('[bot-voice] présence:', e.message); });
  session = {
    target: target,
    room: room,
    source: source,
    queue: [],
    playing: false,
    currentAbort: null,
    recorder: new Recorder(room, env.RECORDINGS_DIR)
  };
  sessions.set(target, session);
  return session;
}

async function teardownSession(target) {
  const session = sessions.get(target);
  if (!session) return;
  if (session.recorder.active) session.recorder.stop();
  if (session.currentAbort) session.currentAbort.abort();
  await leaveVoice(session.room);
  api.presenceLeave(target).catch(function () {});
  sessions.remove(target);
}

// Boucle de lecture : consomme la file tant qu'il y a des morceaux, s'arrête
// dès qu'elle est vide (redémarrée par playNext() au prochain /play).
async function playLoop(session) {
  if (session.playing) return;
  session.playing = true;
  while (session.queue.length) {
    const track = session.queue.shift();
    session.currentAbort = new AbortController();
    api.sendMessage(session.target, '▶️ Lecture : **' + track.title + '**').catch(function () {});
    try {
      await streamToSource(session.source, track.url, session.currentAbort.signal);
    } catch (e) {
      api.sendMessage(session.target, '⚠️ Erreur pendant la lecture de « ' + track.title + ' » : ' + e.message).catch(function () {});
    }
    session.currentAbort = null;
  }
  session.playing = false;
}

// ===== Commandes =====
async function handleCommand(payload) {
  const target = targetFromPayload(payload);
  const name = payload.command && payload.command.name;
  const args = (payload.command && payload.command.args) || {};

  if (!target.dmThreadId && !target.channelId) {
    return { content: 'Contexte invalide (pas de salon/DM identifié).', ephemeral: true };
  }

  if (name === 'join') {
    ensureSession(target)
      .then(function () { api.sendMessage(target, '🔊 Connecté et prêt (`/play`, `/record start`).'); })
      .catch(function (e) { api.sendMessage(target, '❌ Impossible de rejoindre le vocal : ' + e.message).catch(function () {}); });
    return { content: '🔄 Connexion au vocal…', ephemeral: true };
  }

  if (name === 'leave') {
    teardownSession(target).catch(function () {});
    return { content: '👋 Déconnexion en cours…', ephemeral: true };
  }

  if (name === 'play') {
    const requete = String(args.requete || args.url || '').trim();
    if (!requete) return { content: 'Indique une URL YouTube ou une recherche : `/play requete:...`', ephemeral: true };
    (async function () {
      try {
        const session = await ensureSession(target);
        const track = await resolveTrack(requete);
        session.queue.push(track);
        if (!session.playing) {
          playLoop(session);
        } else {
          api.sendMessage(target, '➕ Ajouté à la file (position ' + session.queue.length + ') : **' + track.title + '**').catch(function () {});
        }
      } catch (e) {
        api.sendMessage(target, '❌ ' + e.message).catch(function () {});
      }
    })();
    return { content: '🔎 Recherche : ' + requete + '…', ephemeral: true };
  }

  if (name === 'skip') {
    const session = sessions.get(target);
    if (!session || !session.currentAbort) return { content: 'Rien à passer.', ephemeral: true };
    session.currentAbort.abort();
    return { content: '⏭️ Morceau suivant.', ephemeral: false };
  }

  if (name === 'stop') {
    const session = sessions.get(target);
    if (!session) return { content: 'Le bot n\'est pas en vocal ici.', ephemeral: true };
    session.queue.length = 0;
    if (session.currentAbort) session.currentAbort.abort();
    return { content: '⏹️ File vidée, lecture arrêtée.', ephemeral: false };
  }

  if (name === 'queue') {
    const session = sessions.get(target);
    if (!session || (!session.playing && !session.queue.length)) return { content: 'File d\'attente vide.', ephemeral: true };
    const lines = session.queue.map(function (t, i) { return (i + 1) + '. ' + t.title; });
    return { content: (session.playing ? '▶️ En cours + ' : '') + lines.length + ' morceau(x) en file :\n' + lines.join('\n'), ephemeral: true };
  }

  if (name === 'record') {
    const action = String(args.action || '').toLowerCase();
    const session = sessions.get(target);
    if (!session) return { content: 'Le bot doit être en vocal ici avant d\'enregistrer (`/join` d\'abord).', ephemeral: true };
    if (action === 'start') {
      if (session.recorder.active) return { content: 'Déjà en train d\'enregistrer.', ephemeral: true };
      const dir = session.recorder.start();
      api.sendMessage(target, '🔴 **Enregistrement démarré** par ' + ((payload.user && payload.user.username) || 'un membre') + ' — les personnes qui parlent dans ce vocal sont enregistrées (un fichier par personne, stocké sur le serveur de l\'hébergeur du bot).').catch(function () {});
      return { content: '🔴 Enregistrement démarré (' + dir + ').', ephemeral: true };
    }
    if (action === 'stop') {
      if (!session.recorder.active) return { content: 'Aucun enregistrement en cours.', ephemeral: true };
      const result = session.recorder.stop();
      api.sendMessage(target, '⏹️ Enregistrement arrêté (' + result.files.length + ' fichier(s)).').catch(function () {});
      return { content: '⏹️ Arrêté. Fichiers :\n' + result.files.join('\n'), ephemeral: true };
    }
    return { content: 'Action inconnue, utilise `/record action:start` ou `/record action:stop`.', ephemeral: true };
  }

  return { content: 'Commande inconnue : /' + (name || '?'), ephemeral: true };
}

// ===== Serveur HTTP (identique dans l'esprit au kit de démarrage) =====
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}
function readBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    req.on('data', function (c) { chunks.push(c); });
    req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', reject);
  });
}

const server = http.createServer(function (req, res) {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bot vocal X1 en ligne. Endpoints : POST /interactions, POST /events');
    return;
  }

  if (req.method === 'POST' && req.url === '/interactions') {
    readBody(req).then(async function (raw) {
      const signature = req.headers['x-x1-signature'];
      if (!verifySignature(raw, signature, env.BOT_TOKEN)) { sendJson(res, 401, { error: 'signature invalide' }); return; }
      let payload;
      try { payload = JSON.parse(raw); } catch (e) { sendJson(res, 400, { error: 'JSON invalide' }); return; }
      let reply;
      try {
        if (payload.type === 'command') reply = await handleCommand(payload);
        else reply = { content: 'Type d\'interaction non géré.', ephemeral: true };
      } catch (e) {
        console.error('[bot-voice] erreur handler:', e);
        reply = { content: 'Erreur interne du bot : ' + e.message, ephemeral: true };
      }
      sendJson(res, 200, reply);
    }).catch(function () { sendJson(res, 400, { error: 'lecture du corps échouée' }); });
    return;
  }

  if (req.method === 'POST' && req.url === '/events') {
    readBody(req).then(function (raw) {
      const signature = req.headers['x-x1-signature'];
      if (!verifySignature(raw, signature, env.BOT_TOKEN)) { res.writeHead(401); res.end(); return; }
      res.writeHead(200); res.end();
    }).catch(function () { res.writeHead(400); res.end(); });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(env.PORT, function () {
  console.log('[bot-voice] en écoute sur le port ' + env.PORT + ' — configure ton URL d\'interactions vers <ton-url-publique>/interactions');
});

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
function shutdown() {
  console.log('[bot-voice] arrêt, déconnexion de tous les salons…');
  const pending = [];
  for (const session of sessions.all()) {
    if (session.recorder.active) session.recorder.stop();
    pending.push(leaveVoice(session.room));
  }
  Promise.all(pending).finally(function () { process.exit(0); });
}
