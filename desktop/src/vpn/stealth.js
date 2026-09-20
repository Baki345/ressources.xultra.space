// Mode "Stealth" : enveloppe le trafic WireGuard dans une connexion
// WebSocket-sur-TLS (wstunnel, github.com/erebe/wstunnel) pour qu'il
// ressemble à du HTTPS ordinaire aux yeux d'un pare-feu qui bloque les VPN
// par port/signature. Honnêteté : ça déjoue le blocage par port/protocole,
// PAS le fingerprinting TLS (JA3/JA4) ni l'analyse de trafic par ML d'un
// censeur étatique avancé — voir le plan pour le détail. Ce module est
// volontairement indépendant de l'OS (contrairement à platform/linux.js et
// platform/win32.js) : la ligne de commande wstunnel est identique partout,
// et ni le client wstunnel ni la connexion TLS qu'il ouvre n'ont besoin
// d'élévation — seule la création de l'adaptateur WireGuard lui-même en a
// besoin, gérée ailleurs (platform/*.js).
//
// Validé de bout en bout dans le bac à sable de développement de cette
// session : un vrai wireguard-go, pointé sur le port local ouvert ici,
// a complété une vraie poignée de main à travers wss://vpn.xultra.space/
// jusqu'au vrai serveur WireGuard du VPS.
'use strict';
const { spawn } = require('child_process');
const dgram = require('dgram');

// Le préfixe de chemin n'est PAS un vrai secret — juste un frein au scan
// occasionnel de vpn.xultra.space (voir le plan : ce dépôt publie déjà son
// code source complet, donc cette valeur est de toute façon lisible par
// quiconque l'inspecte). Doit correspondre exactement à
// --restrict-http-upgrade-path-prefix côté serveur (vpn-manager/VPS).
const STEALTH_PATH_PREFIX = 'ca123485a555adf0c50df061f0e346cbc02b99d6606ead5e6c1fc3968154eb33';
const STEALTH_WSS_URL = 'wss://vpn.xultra.space/';
const REMOTE_WG_TARGET = '127.0.0.1:51820';
const READY_TIMEOUT_MS = 5000;

function pickFreePort() {
  return new Promise(function (resolve, reject) {
    const sock = dgram.createSocket('udp4');
    sock.once('error', reject);
    sock.bind(0, '127.0.0.1', function () {
      const port = sock.address().port;
      sock.close(function () { resolve(port); });
    });
  });
}

// opts: {app, wgPath non nécessaire ici} — wstunnelPath vient de binaries.js
// côté appelant (manager.js), ce module ne connaît que la commande wstunnel
// elle-même.
async function start(wstunnelPath) {
  const localPort = await pickFreePort();
  const args = [
    'client',
    '-L', 'udp://127.0.0.1:' + localPort + ':' + REMOTE_WG_TARGET + '?timeout_sec=0',
    '--http-upgrade-path-prefix', STEALTH_PATH_PREFIX,
    STEALTH_WSS_URL
  ];

  return new Promise(function (resolve, reject) {
    const child = spawn(wstunnelPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let settled = false;
    let buf = '';

    const timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      try { child.kill('SIGTERM'); } catch (e) {}
      reject(new Error("wstunnel n'a pas démarré à temps."));
    }, READY_TIMEOUT_MS);

    function onData(chunk) {
      buf += chunk.toString('utf8');
      // Ligne de log émise dès que le port UDP local est prêt (confirmée
      // empiriquement contre le binaire réellement embarqué) — c'est le
      // seul signal de disponibilité dont on dispose, wstunnel n'a pas de
      // vraie notion de "ready" séparée (la connexion WSS elle-même ne
      // s'ouvre qu'à la première trame UDP reçue, donc plus tard).
      if (!settled && buf.indexOf('Starting UDP server listening cnx on 127.0.0.1:' + localPort) !== -1) {
        settled = true;
        clearTimeout(timer);
        resolve({
          localPort: localPort,
          stop: function () {
            return new Promise(function (res) {
              try { child.kill('SIGTERM'); } catch (e) {}
              res();
            });
          },
          onExit: function (cb) { child.on('exit', cb); }
        });
      }
    }
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.once('error', function (e) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(e);
    });
  });
}

module.exports = { start, STEALTH_PATH_PREFIX, STEALTH_WSS_URL, REMOTE_WG_TARGET };
