'use strict';
// Stockage local par serveur (IXin ne fournit aucune base de données au bot —
// tout vit dans un fichier JSON par serveur sur le disque du VPS). Couvre :
// config auto-mod, salon de logs, casier de sanctions, et un cache
// pseudo→uid (voir README : pas de route bot pour chercher un membre par
// nom, donc on l'apprend nous-mêmes au fil des messages reçus).
const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('./env');

const cache = new Map();

function filePath(serverId) {
  return path.join(DATA_DIR, 'servers', serverId + '.json');
}

function defaults() {
  return {
    automod: { enabled: false, words: [], antiLinks: false, linkAllowlist: [] },
    modlogsChannelId: '',
    sanctions: {},
    members: {},
    welcome: { enabled: false, channelId: '', template: 'Bienvenue {membre} !' },
    profiles: {},
    tickets: { staffRoleId: '', nextNumber: 1, open: {} },
    autorole: { roleId: '' },
    customCommands: {},
    levelRoles: {}
  };
}

function load(serverId) {
  if (cache.has(serverId)) return cache.get(serverId);
  let data = defaults();
  try {
    const raw = fs.readFileSync(filePath(serverId), 'utf8');
    data = Object.assign(defaults(), JSON.parse(raw));
  } catch (e) { /* pas encore de fichier pour ce serveur, valeurs par défaut */ }
  cache.set(serverId, data);
  return data;
}

function save(serverId) {
  const data = cache.get(serverId);
  if (!data) return;
  const dir = path.join(DATA_DIR, 'servers');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath(serverId), JSON.stringify(data, null, 2));
}

function learnMember(serverId, uid, username) {
  if (!username) return;
  const store = load(serverId);
  const key = String(username).toLowerCase();
  if (store.members[key] === uid) return; // déjà à jour, pas besoin d'écrire sur disque
  store.members[key] = uid;
  save(serverId);
}

function resolveMember(serverId, nameOrUid) {
  const raw = String(nameOrUid || '').trim();
  if (!raw) return null;
  const store = load(serverId);
  const byName = store.members[raw.toLowerCase()];
  if (byName) return byName;
  // Pas trouvé par pseudo (le bot ne l'a jamais vu poster depuis son
  // démarrage) — on tente le texte tel quel comme uid direct (usage avancé) ;
  // si ce n'est pas un vrai membre, la route IXin appelée ensuite le dira.
  return raw;
}

function addSanction(serverId, uid, entry) {
  const store = load(serverId);
  if (!store.sanctions[uid]) store.sanctions[uid] = [];
  store.sanctions[uid].push(Object.assign({ ts: Date.now() }, entry));
  save(serverId);
  return store.sanctions[uid];
}

function getSanctions(serverId, uid) {
  return load(serverId).sanctions[uid] || [];
}

function setAutomod(serverId, patch) {
  const store = load(serverId);
  store.automod = Object.assign({}, store.automod, patch);
  save(serverId);
  return store.automod;
}

function addBannedWord(serverId, word) {
  const store = load(serverId);
  const w = word.toLowerCase();
  if (store.automod.words.indexOf(w) < 0) store.automod.words.push(w);
  save(serverId);
  return store.automod.words;
}

function removeBannedWord(serverId, word) {
  const store = load(serverId);
  store.automod.words = store.automod.words.filter(function (w) { return w !== word.toLowerCase(); });
  save(serverId);
  return store.automod.words;
}

function setModlogsChannel(serverId, channelId) {
  const store = load(serverId);
  store.modlogsChannelId = channelId;
  save(serverId);
}

function setWelcome(serverId, patch) {
  const store = load(serverId);
  store.welcome = Object.assign({}, store.welcome, patch);
  save(serverId);
  return store.welcome;
}

// ===== Niveaux XP + économie =====
// Courbe simple façon "MEE6" allégée : niveau = floor(sqrt(xp / 50)) — 50xp
// pour le niveau 1, 200 pour le 2, 450 pour le 3, etc. Amplement suffisant
// pour un premier système ; à remplacer par une vraie courbe si besoin.
function xpToLevel(xp) { return Math.floor(Math.sqrt(xp / 50)); }

function ensureProfile(serverId, uid, username) {
  const store = load(serverId);
  if (!store.profiles[uid]) store.profiles[uid] = { xp: 0, level: 0, balance: 0, lastDaily: 0, lastXpAt: 0, username: username || uid };
  else if (username) store.profiles[uid].username = username;
  return store.profiles[uid];
}

function getProfile(serverId, uid) {
  return load(serverId).profiles[uid];
}

function canEarnXp(serverId, uid) {
  const p = load(serverId).profiles[uid];
  if (!p) return true;
  return Date.now() - p.lastXpAt > 60000; // 60s entre deux gains d'XP par personne
}

function markXpTimestamp(serverId, uid, username) {
  const p = ensureProfile(serverId, uid, username);
  p.lastXpAt = Date.now();
  save(serverId);
}

function addXp(serverId, uid, username, amount) {
  const p = ensureProfile(serverId, uid, username);
  p.xp += amount;
  const newLevel = xpToLevel(p.xp);
  const leveledUp = newLevel > p.level;
  p.level = newLevel;
  save(serverId);
  return { profile: p, leveledUp: leveledUp };
}

function claimDaily(serverId, uid, username) {
  const p = ensureProfile(serverId, uid, username);
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  if (now - p.lastDaily < DAY_MS) return { ok: false, remainingMs: DAY_MS - (now - p.lastDaily) };
  const amount = 100 + Math.floor(Math.random() * 101); // 100-200
  p.balance += amount;
  p.lastDaily = now;
  save(serverId);
  return { ok: true, amount: amount, balance: p.balance };
}

function leaderboard(serverId, type, limit) {
  const profiles = load(serverId).profiles;
  const arr = Object.keys(profiles).map(function (uid) { return Object.assign({ uid: uid }, profiles[uid]); });
  arr.sort(function (a, b) { return type === 'argent' ? b.balance - a.balance : b.xp - a.xp; });
  return arr.slice(0, limit || 10);
}

// ===== Tickets de support (un salon privé par ticket, voir README) =====
function setTicketStaffRole(serverId, roleId) {
  const store = load(serverId);
  store.tickets.staffRoleId = roleId;
  save(serverId);
}

function nextTicketNumber(serverId) {
  const store = load(serverId);
  const n = store.tickets.nextNumber;
  store.tickets.nextNumber = n + 1;
  save(serverId);
  return n;
}

function addOpenTicket(serverId, channelId, entry) {
  const store = load(serverId);
  store.tickets.open[channelId] = entry;
  save(serverId);
}

function getOpenTicket(serverId, channelId) {
  return load(serverId).tickets.open[channelId];
}

function removeOpenTicket(serverId, channelId) {
  const store = load(serverId);
  delete store.tickets.open[channelId];
  save(serverId);
}

// ===== Rôle automatique à l'arrivée (façon Dyno "autorole") =====
function setAutorole(serverId, roleId) {
  const store = load(serverId);
  store.autorole.roleId = roleId;
  save(serverId);
}

// ===== Commandes personnalisées (façon MEE6 "custom commands") — pas des
// vraies commandes /slash de IXin (ça consommerait vite le quota déclaré par
// bot), mais du texte préfixé par "!" détecté dans les messages reçus, voir
// bot.js/handleMessageCreate. =====
function addCustomCommand(serverId, trigger, response) {
  const store = load(serverId);
  store.customCommands[trigger.toLowerCase()] = response;
  save(serverId);
}

function removeCustomCommand(serverId, trigger) {
  const store = load(serverId);
  const existed = trigger.toLowerCase() in store.customCommands;
  delete store.customCommands[trigger.toLowerCase()];
  save(serverId);
  return existed;
}

function getCustomCommand(serverId, trigger) {
  return load(serverId).customCommands[trigger.toLowerCase()];
}

function listCustomCommands(serverId) {
  return load(serverId).customCommands;
}

// ===== Rôles de récompense par niveau (façon MEE6 "level rewards") =====
function setLevelRole(serverId, level, roleId) {
  const store = load(serverId);
  store.levelRoles[String(level)] = roleId;
  save(serverId);
}

function removeLevelRole(serverId, level) {
  const store = load(serverId);
  const existed = String(level) in store.levelRoles;
  delete store.levelRoles[String(level)];
  save(serverId);
  return existed;
}

function listLevelRoles(serverId) {
  return load(serverId).levelRoles;
}

module.exports = {
  load, learnMember, resolveMember, addSanction, getSanctions, setAutomod, addBannedWord, removeBannedWord, setModlogsChannel, setWelcome,
  getProfile, canEarnXp, markXpTimestamp, addXp, claimDaily, leaderboard,
  setTicketStaffRole, nextTicketNumber, addOpenTicket, getOpenTicket, removeOpenTicket,
  setAutorole, addCustomCommand, removeCustomCommand, getCustomCommand, listCustomCommands,
  setLevelRole, removeLevelRole, listLevelRoles
};
