'use strict';
// Stockage local par serveur (X1 ne fournit aucune base de données au bot —
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
    welcome: { enabled: false, channelId: '', template: 'Bienvenue {membre} !' }
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
  // si ce n'est pas un vrai membre, la route X1 appelée ensuite le dira.
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

module.exports = { load, learnMember, resolveMember, addSanction, getSanctions, setAutomod, addBannedWord, removeBannedWord, setModlogsChannel, setWelcome };
