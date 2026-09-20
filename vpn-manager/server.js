#!/usr/bin/env node
'use strict';
// ===== vpn-manager : petit service compagnon qui gère le VRAI serveur
// WireGuard sur ce VPS, pour le compte de IXin (worker/worker.js).
//
// Pourquoi un service séparé plutôt qu'une route de plus dans le Worker :
// worker.js tourne sur le réseau Cloudflare (edge), sans aucun accès
// shell/filesystem — impossible d'y exécuter `wg`, d'y garder une interface
// réseau ouverte, ni d'y lire /etc/wireguard. Ce service tourne ici, sur le
// VPS qui héberge déjà Appwrite (voir appwrite/self-host/README.md), et
// c'est lui qui exécute réellement les commandes `wg`.
//
// Dépendances système à installer AVANT de lancer ce service (voir
// README.md pour le détail complet) :
//   - Node.js 18+ (fetch global requis)
//   - wireguard-tools (`wg`, `wg-quick`)
//   - une interface WireGuard déjà montée (wg-quick up wg0) — ce service ne
//     l'installe pas, voir README.md § Installation WireGuard
const http = require('http');
const env = require('./lib/env');
const { verify } = require('./lib/signature');
const { reconcile } = require('./lib/reconcile');

function readBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    req.on('data', function (c) { chunks.push(c); });
    req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

let reconciling = false;
async function runReconcileSafely() {
  if (reconciling) return { ok: false, error: 'déjà en cours' };
  reconciling = true;
  try {
    const result = await reconcile();
    return { ok: true, result: result };
  } catch (e) {
    console.error('[vpn-manager] échec de la réconciliation :', e.message);
    return { ok: false, error: e.message };
  } finally {
    reconciling = false;
  }
}

const server = http.createServer(function (req, res) {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('vpn-manager en ligne. Endpoint : POST /sync');
    return;
  }

  // Seul endpoint exposé, et seulement à IXin (signature obligatoire) —
  // jamais de route publique non authentifiée ici, ce service peut exécuter
  // de vraies commandes wg.
  if (req.method === 'POST' && req.url === '/sync') {
    readBody(req).then(async function (raw) {
      const signature = req.headers['x-ixin-signature'];
      if (!verify(raw, signature, env.VPN_MANAGER_SECRET)) { sendJson(res, 401, { ok: false, error: 'signature invalide' }); return; }
      const outcome = await runReconcileSafely();
      sendJson(res, outcome.ok ? 200 : 500, outcome);
    }).catch(function () { sendJson(res, 400, { ok: false, error: 'lecture du corps échouée' }); });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(env.PORT, '0.0.0.0', function () {
  console.log('[vpn-manager] à l\'écoute sur le port ' + env.PORT + ' (interface WireGuard : ' + env.WG_INTERFACE + ')');
});

// Ronde de réconciliation périodique, en plus du "maintenant" déclenché par
// POST /sync — filet de sécurité si ce dernier échoue ou n'arrive jamais
// (Worker redémarré, appel réseau perdu...), et seul mécanisme qui retire
// un pair dont l'abonnement a expiré (rien ne pousse activement cette
// information, elle est découverte au prochain passage).
setInterval(function () {
  runReconcileSafely().catch(function () {});
}, env.RECONCILE_INTERVAL_MS);

// Une passe immédiate au démarrage, pour ne pas attendre le premier
// intervalle si le service redémarre (mise à jour, crash, reboot du VPS).
runReconcileSafely().catch(function () {});
