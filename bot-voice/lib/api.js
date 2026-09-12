'use strict';
// Fine couche au-dessus des routes publiques /api/bot/v1/* de X1 — voir le
// portail développeur ("Mes bots" → docs) pour le contrat complet. Rien ici
// n'est un accès privé/interne : ce sont exactement les mêmes routes que
// n'importe quel développeur tiers peut appeler avec le token de son bot.
const { X1_BASE_URL, BOT_TOKEN } = require('./env');

async function botFetch(urlPath, body) {
  const res = await fetch(X1_BASE_URL + urlPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bot ' + BOT_TOKEN },
    body: JSON.stringify(body || {})
  });
  const json = await res.json().catch(function () { return {}; });
  if (!res.ok || json.ok === false) throw new Error(json.error || ('HTTP ' + res.status));
  return json;
}

// `target` est soit { serverId, channelId } (salon vocal de serveur), soit
// { dmThreadId } (appel de groupe en DM) — jamais les deux à la fois.
function sendMessage(target, content, embed) {
  const body = Object.assign({ content: content }, target.dmThreadId ? { dmThreadId: target.dmThreadId } : { channelId: target.channelId }, embed ? { embed: embed } : {});
  return botFetch('/api/bot/v1/messages/send', body);
}

function getVoiceToken(target) {
  return botFetch(target.dmThreadId ? '/api/bot/v1/voice/dm-token' : '/api/bot/v1/voice/token', target);
}

function presenceJoin(target) {
  return botFetch(target.dmThreadId ? '/api/bot/v1/voice/dm-presence/join' : '/api/bot/v1/voice/presence/join', target);
}

function presenceLeave(target) {
  const body = target.dmThreadId ? { dmThreadId: target.dmThreadId } : { channelId: target.channelId };
  return botFetch(target.dmThreadId ? '/api/bot/v1/voice/dm-presence/leave' : '/api/bot/v1/voice/presence/leave', body);
}

// Un salon vocal n'a pas de zone de saisie (voir README) — pour résoudre le
// nom de salon tapé par l'utilisateur dans un salon TEXTE en ID réel.
function listVoiceChannels(serverId) {
  return botFetch('/api/bot/v1/voice/channels', { serverId: serverId }).then(function (r) { return r.channels || []; });
}

module.exports = { sendMessage, getVoiceToken, presenceJoin, presenceLeave, listVoiceChannels };
