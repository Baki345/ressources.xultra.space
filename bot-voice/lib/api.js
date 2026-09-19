'use strict';
// Fine couche au-dessus des routes publiques /api/bot/v1/* de IXin — voir le
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

// ===== Modération (nécessite les permissions accordées à l'installation) =====
function kick(serverId, uid) {
  return botFetch('/api/bot/v1/moderation/kick', { serverId: serverId, uid: uid });
}
function ban(serverId, uid, unban) {
  return botFetch('/api/bot/v1/moderation/ban', { serverId: serverId, uid: uid, unban: !!unban });
}
function timeout(serverId, uid, minutes) {
  return botFetch('/api/bot/v1/moderation/timeout', { serverId: serverId, uid: uid, minutes: minutes });
}
function deleteMessage(serverId, messageId) {
  return botFetch('/api/bot/v1/moderation/delete-message', { serverId: serverId, messageId: messageId });
}

// ===== Rôles (nécessite "manage_roles" accordée à l'installation) =====
function listRoles(serverId) {
  return botFetch('/api/bot/v1/roles/list', { serverId: serverId }).then(function (r) { return r.roles || []; });
}
function addRole(serverId, uid, roleId) {
  return botFetch('/api/bot/v1/roles/add', { serverId: serverId, uid: uid, roleId: roleId });
}
function removeRole(serverId, uid, roleId) {
  return botFetch('/api/bot/v1/roles/remove', { serverId: serverId, uid: uid, roleId: roleId });
}
function createRole(serverId, name) {
  return botFetch('/api/bot/v1/roles/create', { serverId: serverId, name: name }).then(function (r) { return r.role; });
}
function deleteRole(serverId, roleId) {
  return botFetch('/api/bot/v1/roles/delete', { serverId: serverId, roleId: roleId });
}

// ===== Salons (nécessite "manage_channels" accordée à l'installation) =====
function createChannel(serverId, name, visibleRoleIds) {
  return botFetch('/api/bot/v1/channels/create', { serverId: serverId, name: name, visibleRoleIds: visibleRoleIds || [] }).then(function (r) { return r.channel; });
}
function deleteChannel(serverId, channelId) {
  return botFetch('/api/bot/v1/channels/delete', { serverId: serverId, channelId: channelId });
}

// Pour le dashboard web : vérifie qu'un visiteur (identifié via "Se
// connecter avec IXin") a bien le droit d'administrer ce serveur avant de le
// laisser toucher à la config du bot.
function memberPermissions(serverId, uid) {
  return botFetch('/api/bot/v1/servers/member-permissions', { serverId: serverId, uid: uid }).then(function (r) { return r.permissions || []; });
}

module.exports = { sendMessage, getVoiceToken, presenceJoin, presenceLeave, listVoiceChannels, kick, ban, timeout, deleteMessage, listRoles, addRole, removeRole, createRole, deleteRole, createChannel, deleteChannel, memberPermissions };
