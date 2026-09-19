#!/usr/bin/env node
'use strict';
// ===== Bot IXin : voix (musique YouTube + enregistrement) + auto-mod =====
// Basé sur le kit de démarrage bot-x1.js (mêmes principes : HTTP minimal,
// signature HMAC, aucune dépendance à un compte IXin), étendu avec une vraie
// connexion LiveKit (@livekit/rtc-node) pour la voix — la seule partie que
// IXin ne peut pas fournir depuis un Worker Cloudflare (pas de connexion
// persistante possible côté serveur IXin, voir le portail développeur) — et
// un auto-mod + sanctions + logs qui tourne sur la "gateway" événementielle
// de IXin (POST /events à chaque message, voir le portail développeur).
//
// Dépendances système à installer sur le VPS AVANT de lancer ce bot :
//   - Node.js 18+
//   - ffmpeg          (apt install ffmpeg)
//   - yt-dlp          (binaire officiel, voir README.md)
// Voir README.md pour le détail complet du déploiement.
const http = require('http');
const { URL } = require('url');
const env = require('./lib/env');
const { verifySignature } = require('./lib/signature');
const api = require('./lib/api');
const { joinVoice, leaveVoice } = require('./lib/voice');
const { resolveTrack, streamToSource } = require('./lib/player');
const { Recorder } = require('./lib/recorder');
const sessions = require('./lib/session');
const store = require('./lib/serverStore');
const automod = require('./lib/automod');
const dashboard = require('./lib/dashboard');

const VOICE_COMMANDS = ['join', 'leave', 'play', 'skip', 'stop', 'queue', 'record'];
const spamTracker = new automod.SpamTracker(5, 5000); // 5 messages / 5s par personne, tous serveurs confondus (clé "serverId:uid")

// ===== Giveaways (façon MEE6/Dyno) — état en mémoire uniquement, comme les
// sessions vocales : un redémarrage du bot oublie les giveaways en cours
// (même limite déjà acceptée pour les sessions de vocal, voir README).
// giveawayId -> { serverId, channelId, prize, winnersCount, participants:Set<uid>, names:Map<uid,pseudo>, timer }
const giveaways = new Map();
const giveawayByChannel = new Map(); // channelId -> giveawayId, pour /giveaway-end et empêcher les doublons dans un même salon
let giveawaySeq = 0;

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

function endGiveaway(giveawayId) {
  const g = giveaways.get(giveawayId);
  if (!g) return;
  clearTimeout(g.timer);
  giveaways.delete(giveawayId);
  giveawayByChannel.delete(g.channelId);
  const pool = Array.from(g.participants);
  if (!pool.length) {
    api.sendMessage({ serverId: g.serverId, channelId: g.channelId }, '🎉 Giveaway terminé — **' + g.prize + '**\nPersonne n\'a participé.').catch(function () {});
    return;
  }
  const winners = [];
  const pick = pool.slice();
  for (let i = 0; i < g.winnersCount && pick.length; i++) {
    const idx = Math.floor(Math.random() * pick.length);
    winners.push(pick.splice(idx, 1)[0]);
  }
  const names = winners.map(function (uid) { return g.names.get(uid) || uid; });
  api.sendMessage({ serverId: g.serverId, channelId: g.channelId },
    '🎉 Giveaway terminé — **' + g.prize + '**\n' + (names.length > 1 ? 'Gagnants' : 'Gagnant') + ' : ' + names.map(function (n) { return '**' + n + '**'; }).join(', ')
  ).catch(function () {});
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
        // "warn" n'a pas d'équivalent côté IXin (aucun concept natif) — uniquement suivi par ce bot.
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

  // Reaction role : le bouton ne fait qu'AJOUTER le rôle (pas de bascule
  // retrait) — pour retirer un rôle attribué ainsi, un modérateur doit
  // encore le faire à la main. Volontairement simple pour une première
  // version ; voir README pour l'idée d'un second bouton "retirer" plus tard.
  if (name === 'reaction-role') {
    const roleName = String(args.role || '').trim();
    const label = String(args.label || 'Obtenir ce rôle').trim().slice(0, 32);
    if (!roleName) return { content: 'Précise `role:` (nom exact du rôle).', ephemeral: true };
    let roles;
    try { roles = await api.listRoles(serverId); }
    catch (e) { return { content: '❌ ' + e.message, ephemeral: true }; }
    const match = roles.find(function (r) { return r.name.toLowerCase() === roleName.toLowerCase(); });
    if (!match) {
      const names = roles.map(function (r) { return r.name; }).join(', ') || '(aucun rôle sur ce serveur)';
      return { content: 'Rôle "' + roleName + '" introuvable. Disponibles : ' + names, ephemeral: true };
    }
    if (!match.assignable) return { content: 'Ce rôle a des permissions administrateur — un bot ne peut jamais l\'attribuer.', ephemeral: true };
    return {
      content: '🎭 Clique pour obtenir le rôle **' + match.name + '**.',
      components: [{ label: label, style: 'primary', customId: 'rr_' + match.id }]
    };
  }

  if (name === 'bienvenue') {
    const action = String(args.action || 'set').toLowerCase();
    if (action === 'off') { store.setWelcome(serverId, { enabled: false }); return { content: '🔕 Message de bienvenue désactivé.', ephemeral: true }; }
    const texte = String(args.texte || '').trim();
    if (!texte) return { content: 'Précise `texte:` (utilise {membre} pour le pseudo).', ephemeral: true };
    store.setWelcome(serverId, { enabled: true, channelId: channelId, template: texte });
    return { content: '✅ Message de bienvenue activé dans ce salon : "' + texte + '"', ephemeral: true };
  }

  // Niveaux XP (texte uniquement — le vocal demanderait au bot de rester
  // connecté en permanence à tous les salons vocaux pour observer qui y
  // parle, une architecture bien plus lourde que "rejoindre sur demande"
  // comme aujourd'hui) + économie virtuelle basique. Une seule commande à 3
  // actions plutôt que 3 commandes séparées, pour rester sous la limite de
  // 15 commandes par bot.
  if (name === 'economie') {
    const action = String(args.action || '').toLowerCase();
    if (action === 'profil') {
      const membreRaw = String(args.membre || '').trim();
      const uid = membreRaw ? store.resolveMember(serverId, membreRaw) : (payload.user && payload.user.id);
      const label = membreRaw || (payload.user && payload.user.username) || 'toi';
      const p = store.getProfile(serverId, uid) || { xp: 0, level: 0, balance: 0 };
      return { content: '📊 Profil de ' + label + '\nNiveau ' + p.level + ' (' + p.xp + ' XP)\n💰 ' + p.balance + ' pièces', ephemeral: true };
    }
    if (action === 'classement') {
      const type = String(args.type || 'xp').toLowerCase() === 'argent' ? 'argent' : 'xp';
      const top = store.leaderboard(serverId, type, 10);
      if (!top.length) return { content: 'Aucune donnée pour l\'instant — les membres gagnent de l\'XP en écrivant.', ephemeral: true };
      const lines = top.map(function (p, i) { return (i + 1) + '. ' + (p.username || p.uid) + ' — ' + (type === 'argent' ? p.balance + ' pièces' : 'niveau ' + p.level + ' (' + p.xp + ' XP)'); });
      return { content: '🏆 Classement (' + (type === 'argent' ? 'économie' : 'XP') + ') :\n' + lines.join('\n'), ephemeral: false };
    }
    if (action === 'daily') {
      const uid = payload.user && payload.user.id;
      const username = payload.user && payload.user.username;
      const result = store.claimDaily(serverId, uid, username);
      if (!result.ok) {
        const hrs = Math.ceil(result.remainingMs / 3600000);
        return { content: '⏳ Déjà réclamé — reviens dans environ ' + hrs + 'h.', ephemeral: true };
      }
      return { content: '💰 +' + result.amount + ' pièces ! Solde : ' + result.balance, ephemeral: true };
    }
    return { content: 'Utilise `action:profil`, `action:classement` ou `action:daily`.', ephemeral: true };
  }

  // Tickets de support : IXin ne connaît la visibilité d'un salon QUE par rôle
  // (jamais par utilisateur individuel — voir /api/bot/v1/channels/create),
  // donc un salon privé pour une seule personne + le staff passe par un
  // rôle jetable créé et attribué à la volée, supprimé à la fermeture.
  if (name === 'ticket-config') {
    const roleName = String(args.role || '').trim();
    if (!roleName) return { content: 'Précise `role:` (le rôle qui doit voir tous les tickets).', ephemeral: true };
    let roles;
    try { roles = await api.listRoles(serverId); }
    catch (e) { return { content: '❌ ' + e.message, ephemeral: true }; }
    const match = roles.find(function (r) { return r.name.toLowerCase() === roleName.toLowerCase(); });
    if (!match) {
      const names = roles.map(function (r) { return r.name; }).join(', ') || '(aucun rôle sur ce serveur)';
      return { content: 'Rôle "' + roleName + '" introuvable. Disponibles : ' + names, ephemeral: true };
    }
    store.setTicketStaffRole(serverId, match.id);
    return { content: '✅ Le rôle **' + match.name + '** verra désormais tous les tickets ouverts.', ephemeral: true };
  }

  if (name === 'ticket') {
    const cfg = store.load(serverId).tickets;
    if (!cfg.staffRoleId) return { content: 'Configure d\'abord un rôle staff avec `/ticket-config role:<nom>`.', ephemeral: true };
    const sujet = String(args.sujet || 'Sans sujet').trim().slice(0, 200);
    const authorUid = payload.user && payload.user.id;
    const authorName = (payload.user && payload.user.username) || 'membre';
    (async function () {
      let ticketRole, channel;
      try {
        const number = store.nextTicketNumber(serverId);
        const chanName = 'ticket-' + number;
        ticketRole = await api.createRole(serverId, chanName);
        try {
          await api.addRole(serverId, authorUid, ticketRole.$id);
        } catch (e) {
          // Le propriétaire du serveur ne peut jamais recevoir de rôle par
          // un bot (protection générale, voir /api/bot/v1/roles/add) — sans
          // conséquence ici puisqu'il voit de toute façon TOUS les salons,
          // rôle ou pas (bypass total des restrictions de visibilité).
          if (!/propriétaire/.test(e.message)) throw e;
        }
        channel = await api.createChannel(serverId, chanName, [cfg.staffRoleId, ticketRole.$id]);
        store.addOpenTicket(serverId, channel.$id, { number: number, authorUid: authorUid, roleId: ticketRole.$id });
        await api.sendMessage({ serverId: serverId, channelId: channel.$id },
          '🎫 **Ticket #' + number + '** ouvert par ' + authorName + '\nSujet : ' + sujet + '\n\nUn membre du staff va te répondre ici. Tape `/ticket-close` dans ce salon une fois réglé.');
        await api.sendMessage({ serverId: serverId, channelId: channelId }, '🎫 Ticket ouvert pour ' + authorName + ' : **' + chanName + '**');
      } catch (e) {
        // Nettoyage best-effort si une étape échoue en cours de route (ex.
        // le rôle a été créé mais la création du salon échoue derrière).
        if (ticketRole && !channel) api.deleteRole(serverId, ticketRole.$id).catch(function () {});
        api.sendMessage({ serverId: serverId, channelId: channelId }, '❌ Échec de l\'ouverture du ticket : ' + e.message).catch(function () {});
      }
    })();
    return { content: '⏳ Ouverture du ticket…', ephemeral: true };
  }

  if (name === 'ticket-close') {
    const ticket = store.getOpenTicket(serverId, channelId);
    if (!ticket) return { content: 'Cette commande se tape dans le salon du ticket lui-même.', ephemeral: true };
    (async function () {
      try {
        await api.sendMessage({ serverId: serverId, channelId: channelId }, '🔒 Ticket #' + ticket.number + ' fermé par ' + ((payload.user && payload.user.username) || 'un membre') + '.');
        await api.deleteChannel(serverId, channelId);
        await api.deleteRole(serverId, ticket.roleId);
        store.removeOpenTicket(serverId, channelId);
      } catch (e) {
        api.sendMessage({ serverId: serverId, channelId: channelId }, '❌ Échec de la fermeture : ' + e.message).catch(function () {});
      }
    })();
    return { content: '⏳ Fermeture du ticket…', ephemeral: true };
  }

  // Rôle automatique à l'arrivée (façon Dyno "autorole") — voir handleMemberJoin.
  if (name === 'autorole') {
    const action = String(args.action || '').toLowerCase();
    if (action === 'off') { store.setAutorole(serverId, ''); return { content: '🔕 Rôle automatique désactivé.', ephemeral: true }; }
    const roleName = String(args.role || '').trim();
    if (!roleName) return { content: 'Précise `role:` (nom exact du rôle), ou `action:off` pour désactiver.', ephemeral: true };
    let roles;
    try { roles = await api.listRoles(serverId); }
    catch (e) { return { content: '❌ ' + e.message, ephemeral: true }; }
    const match = roles.find(function (r) { return r.name.toLowerCase() === roleName.toLowerCase(); });
    if (!match) {
      const names = roles.map(function (r) { return r.name; }).join(', ') || '(aucun rôle sur ce serveur)';
      return { content: 'Rôle "' + roleName + '" introuvable. Disponibles : ' + names, ephemeral: true };
    }
    if (!match.assignable) return { content: 'Ce rôle a des permissions administrateur — un bot ne peut jamais l\'attribuer.', ephemeral: true };
    store.setAutorole(serverId, match.id);
    return { content: '✅ Le rôle **' + match.name + '** sera attribué automatiquement à chaque nouvelle arrivée.', ephemeral: true };
  }

  // Commandes personnalisées (façon MEE6) — déclenchées par un préfixe "!"
  // dans le texte des messages plutôt que par une vraie commande /slash
  // (voir handleMessageCreate) : une seule commande /slash suffit pour en
  // gérer un nombre illimité, sans jamais toucher au quota de 50 commandes
  // déclarées par bot.
  if (name === 'customcmd-add') {
    const nom = String(args.nom || '').trim().toLowerCase();
    const reponse = String(args.reponse || '').trim();
    if (!nom || !/^[a-z0-9_-]{1,32}$/.test(nom)) return { content: 'Précise `nom:` (minuscules, chiffres, - et _ uniquement, sans espace).', ephemeral: true };
    if (!reponse) return { content: 'Précise `reponse:` (utilise {membre} pour le pseudo de qui déclenche la commande).', ephemeral: true };
    store.addCustomCommand(serverId, nom, reponse);
    return { content: '✅ Commande **!' + nom + '** enregistrée.', ephemeral: true };
  }

  if (name === 'customcmd-remove') {
    const nom = String(args.nom || '').trim().toLowerCase();
    if (!nom) return { content: 'Précise `nom:`.', ephemeral: true };
    const existed = store.removeCustomCommand(serverId, nom);
    return { content: existed ? ('🗑️ Commande **!' + nom + '** retirée.') : 'Cette commande n\'existe pas.', ephemeral: true };
  }

  if (name === 'customcmd-list') {
    const cmds = store.listCustomCommands(serverId);
    const names = Object.keys(cmds);
    if (!names.length) return { content: 'Aucune commande personnalisée pour l\'instant — voir `/customcmd-add`.', ephemeral: true };
    return { content: '📜 Commandes personnalisées (' + names.length + ') :\n' + names.map(function (n) { return '!' + n; }).join(', '), ephemeral: true };
  }

  // Rôles de récompense par niveau (façon MEE6 "level rewards") — voir
  // handleMessageCreate pour l'attribution automatique au passage de niveau.
  if (name === 'niveau-role') {
    const action = String(args.action || '').toLowerCase();
    if (action === 'list') {
      const map = store.listLevelRoles(serverId);
      const levels = Object.keys(map);
      if (!levels.length) return { content: 'Aucune récompense de niveau configurée.', ephemeral: true };
      let roles = [];
      try { roles = await api.listRoles(serverId); } catch (e) {}
      const lines = levels.sort(function (a, b) { return Number(a) - Number(b); }).map(function (lvl) {
        const role = roles.find(function (r) { return r.id === map[lvl]; });
        return 'Niveau ' + lvl + ' → ' + (role ? role.name : map[lvl]);
      });
      return { content: '🏅 Récompenses de niveau :\n' + lines.join('\n'), ephemeral: true };
    }
    const niveau = parseInt(args.niveau, 10);
    if (!niveau || niveau < 1) return { content: 'Précise `niveau:` (un nombre entier ≥ 1).', ephemeral: true };
    if (action === 'remove') {
      const existed = store.removeLevelRole(serverId, niveau);
      return { content: existed ? ('🗑️ Récompense du niveau ' + niveau + ' retirée.') : 'Aucune récompense configurée pour ce niveau.', ephemeral: true };
    }
    const roleName = String(args.role || '').trim();
    if (!roleName) return { content: 'Précise `role:` (nom exact du rôle à donner à ce niveau).', ephemeral: true };
    let roles;
    try { roles = await api.listRoles(serverId); }
    catch (e) { return { content: '❌ ' + e.message, ephemeral: true }; }
    const match = roles.find(function (r) { return r.name.toLowerCase() === roleName.toLowerCase(); });
    if (!match) {
      const names = roles.map(function (r) { return r.name; }).join(', ') || '(aucun rôle sur ce serveur)';
      return { content: 'Rôle "' + roleName + '" introuvable. Disponibles : ' + names, ephemeral: true };
    }
    if (!match.assignable) return { content: 'Ce rôle a des permissions administrateur — un bot ne peut jamais l\'attribuer.', ephemeral: true };
    store.setLevelRole(serverId, niveau, match.id);
    return { content: '✅ Le rôle **' + match.name + '** sera attribué automatiquement au niveau ' + niveau + '.', ephemeral: true };
  }

  // Giveaways (façon MEE6/Dyno) : le message posté EN RÉPONSE à cette
  // commande (content + components) porte lui-même le bouton "Participer" —
  // aucun besoin de connaître son messageId ensuite, le customId du bouton
  // (ga_<id>) suffit à retrouver le bon giveaway.
  if (name === 'giveaway-start') {
    const prix = String(args.prix || '').trim().slice(0, 200);
    if (!prix) return { content: 'Précise `prix:` (ce que la personne gagne).', ephemeral: true };
    const duree = Math.min(10080, Math.max(1, parseInt(args.duree, 10) || 0));
    if (!duree) return { content: 'Précise `duree:` (en minutes, entre 1 et 10080).', ephemeral: true };
    const gagnants = Math.min(20, Math.max(1, parseInt(args.gagnants, 10) || 1));
    if (giveawayByChannel.has(channelId)) return { content: 'Il y a déjà un giveaway en cours dans ce salon — termine-le d\'abord avec `/giveaway-end`.', ephemeral: true };
    const giveawayId = 'g' + (Date.now().toString(36)) + (giveawaySeq++).toString(36);
    const endsAt = Date.now() + duree * 60000;
    const timer = setTimeout(function () { endGiveaway(giveawayId); }, duree * 60000);
    giveaways.set(giveawayId, { serverId: serverId, channelId: channelId, prize: prix, winnersCount: gagnants, participants: new Set(), names: new Map(), timer: timer });
    giveawayByChannel.set(channelId, giveawayId);
    const endsTxt = new Date(endsAt).toLocaleString('fr-FR');
    return {
      content: '🎉 **Giveaway !**\nÀ gagner : **' + prix + '**\n' + gagnants + ' gagnant' + (gagnants > 1 ? 's' : '') + ' · se termine le ' + endsTxt,
      components: [{ label: '🎉 Participer', style: 'primary', customId: 'ga_' + giveawayId }]
    };
  }

  if (name === 'giveaway-end') {
    const giveawayId = giveawayByChannel.get(channelId);
    if (!giveawayId) return { content: 'Aucun giveaway en cours dans ce salon.', ephemeral: true };
    endGiveaway(giveawayId);
    return { content: '⏹️ Giveaway terminé.', ephemeral: true };
  }

  return { content: 'Commande inconnue : /' + name, ephemeral: true };
}

// ===== Clics de bouton (reaction-roles, etc.) =====
async function handleComponent(payload) {
  const customId = (payload.component && payload.component.customId) || '';
  if (customId.indexOf('rr_') === 0) {
    const roleId = customId.slice(3);
    const serverId = payload.server && payload.server.id;
    const uid = payload.user && payload.user.id;
    if (!serverId || !uid) return { content: 'Contexte invalide.', ephemeral: true };
    try {
      await api.addRole(serverId, uid, roleId);
      return { content: '✅ Rôle attribué !', ephemeral: true };
    } catch (e) {
      return { content: '❌ ' + e.message, ephemeral: true };
    }
  }
  if (customId.indexOf('ga_') === 0) {
    const giveawayId = customId.slice(3);
    const g = giveaways.get(giveawayId);
    const uid = payload.user && payload.user.id;
    if (!g || !uid) return { content: 'Ce giveaway est terminé.', ephemeral: true };
    if (g.participants.has(uid)) return { content: 'Tu participes déjà !', ephemeral: true };
    g.participants.add(uid);
    g.names.set(uid, (payload.user && payload.user.username) || uid);
    return { content: '✅ Tu participes ! (' + g.participants.size + ' participant' + (g.participants.size > 1 ? 's' : '') + ')', ephemeral: true };
  }
  return { content: 'Bouton inconnu.', ephemeral: true };
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

// ===== Événements (auto-mod, bienvenue, XP) =====
async function handleMessageCreate(payload) {
  const serverId = payload.server && payload.server.id;
  const channelId = payload.data && payload.data.channel && payload.data.channel.id;
  const message = payload.data && payload.data.message;
  if (!serverId || !message || !message.author) return;
  store.learnMember(serverId, message.author.id, message.author.username);

  const cfg = store.load(serverId).automod;
  if (cfg.enabled) {
    const text = String(message.content || '');
    let violation = automod.checkWordFilter(cfg, text) || automod.checkLinks(cfg, text);
    if (!violation && spamTracker.hit(serverId + ':' + message.author.id)) violation = { rule: 'spam' };
    if (violation) {
      const reasonLabel = violation.rule === 'word' ? 'mot interdit (' + violation.detail + ')' : violation.rule === 'link' ? 'lien non autorisé (' + violation.detail + ')' : 'spam';
      try {
        await api.deleteMessage(serverId, message.id);
        api.sendMessage({ serverId: serverId, channelId: channelId }, '🧹 Message de **' + message.author.username + '** supprimé (' + reasonLabel + ').').catch(function () {});
        store.addSanction(serverId, message.author.id, { type: 'automod', reason: reasonLabel, moderator: 'Auto-mod' });
        postModLog(serverId, { type: 'automod', uid: message.author.id, username: message.author.username, reason: reasonLabel, moderator: 'Auto-mod' });
      } catch (e) {
        console.error('[automod] échec de suppression:', e.message);
      }
      return; // pas d'XP pour un message supprimé
    }
  }

  // Commandes personnalisées (façon MEE6) — un texte préfixé par "!" plutôt
  // qu'une vraie commande /slash (voir /customcmd-add) : détecté ici comme
  // n'importe quel autre message reçu, jamais déclaré au quota de commandes.
  const trimmed = String(message.content || '').trim();
  if (trimmed.charAt(0) === '!') {
    const trigger = trimmed.slice(1).split(/\s+/)[0].toLowerCase();
    const response = trigger && store.getCustomCommand(serverId, trigger);
    if (response) {
      api.sendMessage({ serverId: serverId, channelId: channelId }, response.replace(/\{membre\}/g, message.author.username || 'membre')).catch(function () {});
    }
  }

  // XP texte : un gain aléatoire par message, avec un délai (60s) entre deux
  // gains par personne pour ne pas récompenser le simple débit de messages.
  if (store.canEarnXp(serverId, message.author.id)) {
    store.markXpTimestamp(serverId, message.author.id, message.author.username);
    const gained = 5 + Math.floor(Math.random() * 11);
    const result = store.addXp(serverId, message.author.id, message.author.username, gained);
    if (result.leveledUp) {
      api.sendMessage({ serverId: serverId, channelId: channelId }, '🎉 **' + message.author.username + '** passe niveau **' + result.profile.level + '** !').catch(function () {});
      // Rôle de récompense (façon MEE6 "level rewards") : uniquement si CE
      // niveau précis a une récompense configurée — voir /niveau-role.
      const roleId = store.listLevelRoles(serverId)[String(result.profile.level)];
      if (roleId) {
        api.addRole(serverId, message.author.id, roleId).catch(function (e) {
          console.error('[niveau-role] échec d\'attribution:', e.message);
        });
      }
    }
  }
}

async function handleMemberJoin(payload) {
  const serverId = payload.server && payload.server.id;
  const user = payload.data && payload.data.user;
  if (!serverId || !user) return;
  store.learnMember(serverId, user.id, user.username);
  const cfg = store.load(serverId);
  if (cfg.autorole.roleId) {
    api.addRole(serverId, user.id, cfg.autorole.roleId).catch(function (e) {
      console.error('[autorole] échec d\'attribution:', e.message);
    });
  }
  const welcome = cfg.welcome;
  if (!welcome.enabled || !welcome.channelId) return;
  const text = welcome.template.replace(/\{membre\}/g, user.username || 'nouveau membre');
  api.sendMessage({ serverId: serverId, channelId: welcome.channelId }, text).catch(function (e) {
    console.error('[bienvenue] échec d\'envoi:', e.message);
  });
}

async function handleEvent(payload) {
  if (payload.event === 'message_create') return handleMessageCreate(payload);
  if (payload.event === 'member_join') return handleMemberJoin(payload);
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
    res.end('Bot IXin en ligne. Endpoints : POST /interactions, POST /events');
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
        else if (payload.type === 'component') reply = await handleComponent(payload);
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
      res.writeHead(200); res.end(); // IXin n'attend aucune réponse (fire-and-forget) — on traite après coup.
      let payload;
      try { payload = JSON.parse(raw); } catch (e) { return; }
      handleEvent(payload).catch(function (e) { console.error('[bot-voice] erreur événement:', e); });
    }).catch(function () { res.writeHead(400); res.end(); });
    return;
  }

  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/dashboard') {
    dashboard.handleDashboard(req, res, Object.fromEntries(url.searchParams)).catch(function (e) {
      console.error('[dashboard] erreur:', e);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Erreur interne');
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/oauth/callback') {
    dashboard.handleOauthCallback(req, res, Object.fromEntries(url.searchParams)).catch(function (e) {
      console.error('[dashboard] erreur callback:', e);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Erreur interne');
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/dashboard/save') {
    readBody(req).then(function (raw) {
      return dashboard.handleSave(req, res, raw);
    }).catch(function (e) {
      console.error('[dashboard] erreur save:', e);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Erreur interne');
    });
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
