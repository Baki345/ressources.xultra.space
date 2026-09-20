// Orchestrateur du tunnel WireGuard côté process principal Electron :
// connect(confText)/disconnect()/getStatus(), émet des évènements 'status'
// que main.js relaie au renderer via webContents.send. Combine
// confParser + uapiClient + binaries + un module platform/<os> qui
// implémente une interface commune (socketPath/ensurePrivileges/
// startTunnelProcess/bringUp/tearDown) — cette classe elle-même ne connaît
// aucune commande spécifique à un OS, seulement l'ordre des étapes.
'use strict';
const fs = require('fs');
const EventEmitter = require('events');

const confParser = require('./confParser');
const uapi = require('./uapiClient');
const binaries = require('./binaries');
const stealth = require('./stealth');

// Nom d'interface dédié (pas "wg0") pour ne jamais entrer en conflit avec
// une éventuelle installation WireGuard manuelle déjà présente chez
// l'utilisateur.
const IFACE = 'ixin0';
const STATUS_POLL_MS = 2000;
const SOCKET_WAIT_TIMEOUT_MS = 5000;

const PLATFORMS = {
  linux: require('./platform/linux'),
  win32: require('./platform/win32')
  // darwin : phase 3, bloquée sur l'obtention d'un compte Apple Developer
  // (voir le plan) — volontairement absent d'ici jusque-là.
};

function sleep(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

class VpnManager extends EventEmitter {
  constructor(app) {
    super();
    this.app = app;
    this.platform = PLATFORMS[process.platform] || null;
    this.tunnelHandle = null;
    this.stealthHandle = null;
    this.pollTimer = null;
    this.currentOpts = null;
    this.status = { state: 'disconnected' };
  }

  setStatus(patch) {
    this.status = Object.assign({}, this.status, patch);
    this.emit('status', this.status);
  }

  async waitForSocket(socketPath) {
    const deadline = Date.now() + SOCKET_WAIT_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (fs.existsSync(socketPath)) return;
      await sleep(100);
    }
    throw new Error("wireguard-go n'a pas créé son socket/pipe UAPI à temps");
  }

  async cleanupTunnel() {
    this.stopPolling();
    // WireGuard d'abord (libère proprement l'adaptateur TUN), wstunnel
    // ensuite (ferme la connexion WSS/TLS) — ordre inverse du démarrage.
    if (this.tunnelHandle) {
      const handle = this.tunnelHandle;
      this.tunnelHandle = null;
      try { await handle.stop(); } catch (e) {}
    }
    if (this.stealthHandle) {
      const handle = this.stealthHandle;
      this.stealthHandle = null;
      try { await handle.stop(); } catch (e) {}
    }
  }

  startPolling(socketPath) {
    const self = this;
    this.stopPolling();
    this.pollTimer = setInterval(function () {
      uapi.getStatus(socketPath).then(function (res) {
        const peer = res.peers && res.peers[0];
        if (peer) {
          self.setStatus({
            state: 'connected',
            rxBytes: parseInt(peer.rx_bytes || '0', 10),
            txBytes: parseInt(peer.tx_bytes || '0', 10),
            lastHandshakeSec: parseInt(peer.last_handshake_time_sec || '0', 10)
          });
        }
      }).catch(function () {
        // Un poll raté ne casse pas la connexion — la prochaine tentative
        // suffit. C'est aussi, sur Windows (pas de handle de process
        // détaché à écouter), le seul signal dont on dispose pour détecter
        // un wireguard-go mort de façon inattendue — voir le TODO plus bas.
      });
    }, STATUS_POLL_MS);
  }

  stopPolling() {
    if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null; }
  }

  async connect(confText, opts) {
    opts = opts || {};
    if (this.status.state === 'connected' || this.status.state === 'connecting') {
      throw new Error('Déjà connecté ou connexion en cours.');
    }
    if (!this.platform) {
      throw new Error('Plateforme non prise en charge pour le moment : ' + process.platform);
    }
    this.setStatus({ state: 'connecting', error: null, stealth: !!opts.stealth });
    try {
      const parsed = confParser.parseConf(confText);

      // Stealth EN PREMIER, avant tout accès privilégié : une panne réseau/
      // wstunnel doit se manifester avant que l'utilisateur ne soit invité
      // à élever ses privilèges pour rien.
      if (opts.stealth) {
        if (!binaries.wstunnelExists(this.app)) {
          throw new Error("wstunnel n'est pas embarqué pour cette plateforme (" + process.platform + '/' + process.arch + ').');
        }
        this.stealthHandle = await stealth.start(binaries.wstunnelPath(this.app));
        // Le pair pointe désormais sur le tunnel local plutôt que l'IP
        // réelle du VPS — c'est tout le principe du mode Stealth.
        parsed.endpoint = '127.0.0.1:' + this.stealthHandle.localPort;
      }

      if (!binaries.wireguardGoExists(this.app)) {
        throw new Error("wireguard-go n'est pas embarqué pour cette plateforme (" + process.platform + '/' + process.arch + ').');
      }

      const wgPath = binaries.wireguardGoPath(this.app);
      await this.platform.ensurePrivileges(this.app, wgPath);

      this.tunnelHandle = await this.platform.startTunnelProcess(wgPath, IFACE);
      const self = this;
      this.tunnelHandle.onExit(function (code) {
        // Ne se déclenche que sur Linux (process handle réel) — sur
        // Windows, wireguard-go est détaché de tout handle Node, une
        // sortie inattendue n'y est détectée qu'au prochain poll de statut.
        if (self.status.state !== 'disconnected') {
          self.tunnelHandle = null;
          self.setStatus({ state: 'error', error: 'wireguard-go s’est arrêté de façon inattendue (code ' + code + ').' });
        }
      });

      const socketPath = this.platform.socketPath(IFACE);
      await this.waitForSocket(socketPath);

      await uapi.setInterface(socketPath, {
        privateKeyHex: parsed.privateKeyHex,
        peerPublicKeyHex: parsed.peerPublicKeyHex,
        endpoint: parsed.endpoint,
        allowedIps: parsed.allowedIps,
        persistentKeepalive: parsed.persistentKeepalive
      });

      await this.platform.bringUp(IFACE, socketPath, parsed);

      this.currentOpts = parsed;
      this.setStatus({
        state: 'connected',
        addressCidr: parsed.addressCidr,
        endpoint: parsed.endpoint,
        connectedAt: Date.now(),
        rxBytes: 0,
        txBytes: 0,
        lastHandshakeSec: 0
      });
      this.startPolling(socketPath);
    } catch (e) {
      await this.cleanupTunnel();
      this.setStatus({ state: 'error', error: e.message });
      throw e;
    }
  }

  async disconnect() {
    this.stopPolling();
    try {
      if (this.platform && this.currentOpts) {
        await this.platform.tearDown(IFACE, this.currentOpts).catch(function () {});
      }
    } finally {
      await this.cleanupTunnel();
      this.currentOpts = null;
      this.setStatus({ state: 'disconnected', stealth: false, rxBytes: 0, txBytes: 0, lastHandshakeSec: 0 });
    }
  }

  getStatus() {
    return this.status;
  }
}

module.exports = { VpnManager, IFACE };
