'use strict';
// Détection auto-mod : filtre de mots, anti-liens, anti-spam. Volontairement
// simple (mots entiers insensibles à la casse, une seule regex de lien) —
// le but est un socle qui marche et se comprend en cinq minutes, pas un
// moteur de règles configurable à l'infini.
const URL_RE = /\bhttps?:\/\/[^\s]+/gi;

function extractHosts(text) {
  const hosts = [];
  let m;
  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(text))) {
    try { hosts.push(new URL(m[0]).hostname.toLowerCase().replace(/^www\./, '')); } catch (e) {}
  }
  return hosts;
}

function checkWordFilter(automodConfig, text) {
  if (!automodConfig.words || !automodConfig.words.length) return null;
  const lower = text.toLowerCase();
  for (const word of automodConfig.words) {
    const re = new RegExp('(?:^|[^a-z0-9à-ÿ])' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:$|[^a-z0-9à-ÿ])', 'i');
    if (re.test(lower)) return { rule: 'word', detail: word };
  }
  return null;
}

function checkLinks(automodConfig, text) {
  if (!automodConfig.antiLinks) return null;
  const hosts = extractHosts(text);
  if (!hosts.length) return null;
  const allowlist = automodConfig.linkAllowlist || [];
  const blocked = hosts.find(function (h) { return allowlist.indexOf(h) < 0; });
  return blocked ? { rule: 'link', detail: blocked } : null;
}

// Fenêtre glissante par uid — 5 messages en 5 secondes par défaut. Purement
// en mémoire (pas la peine de persister un compteur de spam sur disque).
class SpamTracker {
  constructor(maxMessages, windowMs) {
    this.maxMessages = maxMessages || 5;
    this.windowMs = windowMs || 5000;
    this.hits = new Map();
  }
  hit(uid) {
    const now = Date.now();
    const arr = (this.hits.get(uid) || []).filter(function (t) { return now - t < this.windowMs; }, this);
    arr.push(now);
    this.hits.set(uid, arr);
    return arr.length > this.maxMessages;
  }
}

module.exports = { checkWordFilter, checkLinks, SpamTracker };
