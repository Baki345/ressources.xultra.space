#!/usr/bin/env node
'use strict';
// ===== Bot X1 : voix (musique YouTube + enregistrement) + auto-mod =====
// Basé sur le kit de démarrage bot-x1.js (mêmes principes : HTTP minimal,
// signature HMAC, aucune dépendance à un compte X1), étendu avec une vraie
// connexion LiveKit (@livekit/rtc-node) pour la voix — la seule partie que
// X1 ne peut pas fournir depuis un Worker Cloudflare (pas de connexion
// persistante possible côté serveur X1, voir le portail développeur) — et
// un auto-mod + sanctions + logs qui tourne sur la "gateway" événementielle
// de X1 (POST /events à chaque message, voir le portail développeur).
//
// Dépendances système à installer sur le VPS AVANT de lancer ce bot :
//   - Node.js 18+
//   - ffmpeg          (apt install ffmpeg)
//   - yt-dlp          (binaire officiel, voir README.md)
// Voir README.md pour le détail complet du déploiement.
const http = require('http');
const env = require('./lib/env');
const { verifySignature } = require('./lib/signature');
const api = require('./lib/api');
const { joinVoice, leaveVoice } = require('./lib/voice');
const { resolveTrack, streamToSource } = require('./lib/player');
const { Recorder } = require('./lib/recorder');
const sessions = require('./lib/session');
const store = require('./lib/serverStore');
const automod = require('./lib/automod');

const VOICE_COMMANDS = ['join', 'leave', 'play', 'skip', 'stop', 'queue', 'record'];
const spamTracker = new automod.SpamTracker(5, 5000); // 5 messages / 5s par personne, tous serveurs confondus (clé "serverId:uid")

// ---- Contexte cible (salon de serveur OU DM de groupe) pour les commandes de VOIX ----
// Un salon vocal n'a pas de zone de saisie (voir README) : toute commande
// arrive donc depuis un salon TEXTE du même serveur, jamais depuis le salon
// vocal visé lui-même. Sur un serveur, on résout le salon voulu via l'option
// `salon` (nom tapé par l'utilisateur, résolu en ID via l'API), ou — si elle
// est omise — via la session déjà active sur ce serveur quand il n'y en a
// qu'une seule.
async function resolveTarget(payload, args) {
  if (payload.channel && payload.channel.isDm) return { dmThreadId: payload.channel.id };
  const serverId = payload.server && payload.server.id;
  if (!serverId) throw new Error('Contexte invalide (pas de serveur identifié).');
  const salon = String(args.salon || '').trim();
  if (salon) {
    const channels = await api.listVoiceChannels(serverId);
    const match = channels.find(function (c) { return c.name.toLowerCase() === salon.toLowerCase(); });
    if (!match) {
      const names = channels.map(function (c) { return c.name; }).join(', ') || '(aucun salon vocal sur ce serveur)';
      throw new Error('Salon vocal "' + salon + '" introuvable. Disponibles : ' + names);
    }
    return { serverId: serverId, channelId: match.id };
  }
  const active = sessions.forServer(serverId);
  if (active.length === 1) return active[0].target;
  if (active.length === 0) throw new Error('Précise le salon vocal avec `salon:` (ex. `salon:Lounge 1`).');
  throw new Error('Plusieurs salons vocaux actifs sur ce serveur — précise lequel avec `salon:`.');
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
// dès qu'elle est vide (redémarrée par /play au prochain ajout).
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

// ===== Commandes de voix (musique/enregistrement) =====
async function handleVoiceCommand(name, target, args, payload) {
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

  return { content: 'Commande inconnue : /' + name, ephemeral: true };
}

// ===== Auto-mod / sanctions / logs =====
const SANCTION_LABELS = { warn: '⚠️ Avertissement', mute: '🔇 Mute', kick: '👢 Expulsion', ban: '🔨 Bannissement', unban: '🔓 Débannissement', automod: '🧹 Auto-mod' };
const SANCTION_COLORS = { warn: 'eab308', mute: 'f97316', kick: 'f97316', ban: 'ef4444', unban: '22c55e', automod: '7c3aed' };

function postModLog(serverId, info) {
  const cfg = store.load(serverId);
  if (!cfg.modlogsChannelId) return;
  api.sendMessage({ serverId: serverId, channelId: cfg.modlogsChannelId }, '', {
    title: SANCTION_LABELS[info.type] || info.type,
    description: (info.username || info.uid) + (info.reason ? (' — ' + info.reason) : ''),
    color: SANCTION_COLORS[info.type] || '7c3aed',
    footer: 'Par ' + (info.moderator || 'Bot')
  }).catch(function () {});
}

async function handleModCommand(name, serverId, channelId, args, payload) {
  const modName = (payload.user && payload.user.username) || 'un modérateur';

  if (name === 'sanction') {
    const type = String(args.type || '').toLowerCase();
    if (['warn', 'mute', 'kick', 'ban', 'unban'].indexOf(type) < 0) return { content: 'Type inconnu — utilise `type:warn`, `mute`, `kick`, `ban` ou `unban`.', ephemeral: true };
    const membreRaw = String(args.membre || '').trim();
    if (!membreRaw) return { content: 'Précise `membre:` (pseudo déjà vu par le bot, ou uid).', ephemeral: true };
    const raison = String(args.raison || 'Aucune raison précisée').trim();
    const uid = store.resolveMember(serverId, membreRaw);
    (async function () {
      try {
        if (type === 'mute') await api.timeout(serverId, uid, Math.max(1, Number(args.minutes) || 10));
        else if (type === 'kick') await api.kick(serverId, uid);
        else if (type === 'ban') await api.ban(serverId, uid, false);
        else if (type === 'unban') await api.ban(serverId, uid, true);
        // "warn" n'a pas d'équivalent côté X1 (aucun concept natif) — uniquement suivi par ce bot.
        store.addSanction(serverId, uid, { type: type, reason: raison, moderator: modName });
        postModLog(serverId, { type: type, uid: uid, username: membreRaw, reason: raison, moderator: modName });
        api.sendMessage({ serverId: serverId, channelId: channelId }, '✅ ' + SANCTION_LABELS[type] + ' appliqué à **' + membreRaw + '** — ' + raison).catch(function () {});
      } catch (e) {
        api.sendMessage({ serverId: serverId, channelId: channelId }, '❌ ' + e.message).catch(function () {});
      }
    })();
    return { content: '⏳ Application en cours…', ephemeral: true };
  }

  if (name === 'casier') {
    const membreRaw = String(args.membre || '').trim();
    if (!membreRaw) return { content: 'Précise `membre:`.', ephemeral: true };
    const uid = store.resolveMember(serverId, membreRaw);
    const list = store.getSanctions(serverId, uid);
    if (!list.length) return { content: 'Casier vide pour ' + membreRaw + '.', ephemeral: true };
    const lines = list.map(function (s, i) { return (i + 1) + '. [' + new Date(s.ts).toLocaleString('fr-FR') + '] ' + (SANCTION_LABELS[s.type] || s.type) + ' par ' + s.moderator + ' — ' + s.reason; });
    return { content: '📋 Casier de ' + membreRaw + ' (' + list.length + ') :\n' + lines.join('\n'), ephemeral: true };
  }

  if (name === 'automod') {
    const action = String(args.action || '').toLowerCase();
    if (action === 'on') { store.setAutomod(serverId, { enabled: true }); return { content: '✅ Auto-mod activé.', ephemeral: true }; }
    if (action === 'off') { store.setAutomod(serverId, { enabled: false }); return { content: '⏸️ Auto-mod désactivé.', ephemeral: true }; }
    if (action === 'liens-on') { store.setAutomod(serverId, { antiLinks: true }); return { content: '✅ Anti-liens activé.', ephemeral: true }; }
    if (action === 'liens-off') { store.setAutomod(serverId, { antiLinks: false }); return { content: '⏸️ Anti-liens désactivé.', ephemeral: true }; }
    const cfg = store.load(serverId);
    return {
      content: 'Auto-mod : ' + (cfg.automod.enabled ? '✅ activé' : '⏸️ désactivé')
        + '\nAnti-liens : ' + (cfg.automod.antiLinks ? '✅ activé' : '⏸️ désactivé')
        + '\nMots filtrés : ' + cfg.automod.words.length
        + '\nSalon de logs : ' + (cfg.modlogsChannelId ? 'défini' : '(non défini, voir `/modlogs`)'),
      ephemeral: true
    };
  }

  if (name === 'automod-word') {
    const action = String(args.action || '').toLowerCase();
    const mot = String(args.mot || '').trim();
    if (!mot) return { content: 'Précise `mot:`.', ephemeral: true };
    if (action === 'add') { const words = store.addBannedWord(serverId, mot); return { content: '✅ "' + mot + '" ajouté (' + words.length + ' mot(s) filtrés).', ephemeral: true }; }
    if (action === 'remove') { const words = store.removeBannedWord(serverId, mot); return { content: '🗑️ "' + mot + '" retiré (' + words.length + ' mot(s) filtrés).', ephemeral: true }; }
    return { content: 'Utilise `action:add` ou `action:remove`.', ephemeral: true };
  }

  if (name === 'modlogs') {
    const action = String(args.action || 'set').toLowerCase();
    if (action === 'disable') { store.setModlogsChannel(serverId, ''); return { content: '🔕 Logs de modération désactivés.', ephemeral: true }; }
    store.setModlogsChannel(serverId, channelId);
    return { content: '✅ Les logs de modération seront postés dans ce salon.', ephemeral: true };
  }

  return { content: 'Commande inconnue : /' + name, ephemeral: true };
}

// ===== Dispatch des interactions (commandes slash) =====
async function handleCommand(payload) {
  const name = payload.command && payload.command.name;
  const args = (payload.command && payload.command.args) || {};

  if (VOICE_COMMANDS.indexOf(name) >= 0) {
    let target;
    try { target = await resolveTarget(payload, args); }
    catch (e) { return { content: '❌ ' + e.message, ephemeral: true }; }
    return handleVoiceCommand(name, target, args, payload);
  }

  const serverId = payload.server && payload.server.id;
  if (!serverId) return { content: 'Cette commande n\'est utilisable que sur un serveur.', ephemeral: true };
  return handleModCommand(name, serverId, payload.channel && payload.channel.id, args, payload);
}

// ===== Événements (auto-mod) =====
async function handleEvent(payload) {
  if (payload.event !== 'message_create') return;
  const serverId = payload.server && payload.server.id;
  const channelId = payload.data && payload.data.channel && payload.data.channel.id;
  const message = payload.data && payload.data.message;
  if (!serverId || !message || !message.author) return;
  store.learnMember(serverId, message.author.id, message.author.username);

  const cfg = store.load(serverId).automod;
  if (!cfg.enabled) return;
  const text = String(message.content || '');
  let violation = automod.checkWordFilter(cfg, text) || automod.checkLinks(cfg, text);
  if (!violation && spamTracker.hit(serverId + ':' + message.author.id)) violation = { rule: 'spam' };
  if (!violation) return;

  const reasonLabel = violation.rule === 'word' ? 'mot interdit (' + violation.detail + ')' : violation.rule === 'link' ? 'lien non autorisé (' + violation.detail + ')' : 'spam';
  try {
    await api.deleteMessage(serverId, message.id);
    api.sendMessage({ serverId: serverId, channelId: channelId }, '🧹 Message de **' + message.author.username + '** supprimé (' + reasonLabel + ').').catch(function () {});
    store.addSanction(serverId, message.author.id, { type: 'automod', reason: reasonLabel, moderator: 'Auto-mod' });
    postModLog(serverId, { type: 'automod', uid: message.author.id, username: message.author.username, reason: reasonLabel, moderator: 'Auto-mod' });
  } catch (e) {
    console.error('[automod] échec de suppression:', e.message);
  }
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
    res.end('Bot X1 en ligne. Endpoints : POST /interactions, POST /events');
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
      res.writeHead(200); res.end(); // X1 n'attend aucune réponse (fire-and-forget) — on traite après coup.
      let payload;
      try { payload = JSON.parse(raw); } catch (e) { return; }
      handleEvent(payload).catch(function (e) { console.error('[bot-voice] erreur événement:', e); });
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
