'use strict';
// Un salon vocal de serveur (channelId) ou un appel de groupe en DM
// (dmThreadId) = une session = une connexion LiveKit + une file d'attente +
// un enregistreur. Tout est en mémoire : un redémarrage du process (pm2
// plante, VPS redémarre) vide les sessions, le bot doit juste être réinvité
// avec /join après coup.
const sessions = new Map();

function keyFor(target) {
  return target.dmThreadId ? 'dm:' + target.dmThreadId : 'ch:' + target.channelId;
}

function get(target) { return sessions.get(keyFor(target)); }
function set(target, session) { sessions.set(keyFor(target), session); return session; }
function remove(target) { sessions.delete(keyFor(target)); }
function all() { return sessions.values(); }

module.exports = { keyFor, get, set, remove, all };
