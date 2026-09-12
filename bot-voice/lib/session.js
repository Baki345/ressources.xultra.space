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

// Un serveur peut avoir plusieurs salons vocaux actifs à la fois (un bot par
// salon) — sert à deviner "le" salon visé quand l'utilisateur ne précise pas
// `salon:` sur une commande qui n'est pas /join (skip, stop, queue, record).
function forServer(serverId) {
  const out = [];
  for (const session of sessions.values()) {
    if (session.target.serverId === serverId) out.push(session);
  }
  return out;
}

module.exports = { keyFor, get, set, remove, all, forServer };
