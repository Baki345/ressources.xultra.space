'use strict';
const env = require('./env');
const { sign } = require('./signature');

// Les deux seules routes IXin que ce service appelle — toutes deux signées
// X-IXin-Signature (même mécanisme que dispatchBotEvents/bot.eventsUrl côté
// worker.js, réutilisé ici dans l'autre sens). Jamais de session utilisateur
// ici : ce service n'est PAS un compte IXin, juste un secret partagé.

async function getEntitlements() {
  const rawBody = ''; // GET sans corps — le Worker signe/vérifie sur cette même chaîne vide
  const sig = sign(env.VPN_MANAGER_SECRET, rawBody);
  const res = await fetch(env.IXIN_BASE_URL.replace(/\/$/, '') + '/api/internal/vpn/entitlements?serverId=' + encodeURIComponent(env.VPN_SERVER_ID), {
    method: 'GET',
    headers: { 'X-IXin-Signature': sig }
  });
  const json = await res.json().catch(function () { return {}; });
  if (!res.ok || !json.ok) throw new Error((json && json.error) || ('Erreur ' + res.status));
  return json.entitlements || [];
}

async function postProvisionResult(payload) {
  const rawBody = JSON.stringify(payload);
  const sig = sign(env.VPN_MANAGER_SECRET, rawBody);
  const res = await fetch(env.IXIN_BASE_URL.replace(/\/$/, '') + '/api/internal/vpn/provision-result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-IXin-Signature': sig },
    body: rawBody
  });
  const json = await res.json().catch(function () { return {}; });
  if (!res.ok || !json.ok) {
    console.error('[vpn-manager] postProvisionResult failed:', res.status, json.error || 'unknown error');
    throw new Error((json && json.error) || ('Erreur ' + res.status));
  }
  console.log('[vpn-manager] postProvisionResult succeeded for uid:', payload.uid);
  return json;
}

module.exports = { getEntitlements, postProvisionResult };
