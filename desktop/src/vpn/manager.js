// Orchestrateur du tunnel WireGuard côté process principal Electron :
// connect(confText)/disconnect()/getStatus(), émet des évènements 'status'
// que main.js relaie au renderer via webContents.send. Combine
// confParser + uapiClient + binaries + elevate + platform/<os>.
'use strict';
const { spawn, execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const EventEmitter = require('events');

const confParser = require('./confParser');
const uapi = require('./uapiClient');
const binaries = require('./binaries');
const elevate = require('./elevate');

// Nom d'interface dédié (pas "wg0") pour ne jamais entrer en conflit avec
// une éventuelle installation WireGuard manuelle déjà présente chez
// l'utilisateur.
const IFACE = 'ixin0';
const SOCKET_DIR = '/var/run/wireguard';
const STATUS_POLL_MS = 2000;
const SOCKET_WAIT_TIMEOUT_MS = 5000;

function sleep(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

function which(bin) {
  return new Promise(function (resolve) {
    execFile('which', [bin], function (err, stdout) { resolve(err ? null : String(stdout).trim()); });
  });
}

function dirWritable(dir) {
  try { fs.accessSync(dir, fs.constants.W_OK); return true; } catch (e) { return false; }
}

class VpnManager extends EventEmitter {
  constructor(app) {
    super();
    this.app = app;
    this.child = null;
    this.pollTimer = null;
    this.currentOpts = null;
    this.status = { state: 'disconnected' };
  }

  socketPath() { return path.join(SOCKET_DIR, IFACE + '.sock'); }

  setStatus(patch) {
    this.status = Object.assign({}, this.status, patch);
    this.emit('status', this.status);
  }

  // Un seul prompt d'élévation couvrant TOUT ce qui manque (capacités +
  // dossier d'exécution) plutôt qu'un par étape — /var/run étant
  // typiquement un tmpfs, ce dossier peut redevenir manquant après un
  // redémarrage même si les capacités, elles, restent posées sur le
  // fichier binaire (persistant sur le disque).
  async ensureLinuxPrivileges() {
    const wgPath = binaries.wireguardGoPath(this.app);
    const ipPath = (await which('ip')) || '/usr/sbin/ip';
    const needsDir = !dirWritable(SOCKET_DIR);

    const missing = [];
    if (!(await elevate.hasLinuxCapabilities(wgPath))) missing.push(wgPath);
    if (!(await elevate.hasLinuxCapabilities(ipPath))) missing.push(ipPath);

    if (missing.length === 0 && !needsDir) return;

    const parts = [];
    if (missing.length) {
      parts.push(missing.map(function (p) { return 'setcap cap_net_admin,cap_net_raw+eip ' + JSON.stringify(p); }).join(' && '));
    }
    if (needsDir) {
      const user = os.userInfo().username;
      parts.push('mkdir -p ' + SOCKET_DIR + ' && chown ' + user + ':' + user + ' ' + SOCKET_DIR + ' && chmod 0700 ' + SOCKET_DIR);
    }
    await elevate.runElevated(parts.join(' && '));
  }

  async waitForSocket() {
    const deadline = Date.now() + SOCKET_WAIT_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (fs.existsSync(this.socketPath())) return;
      await sleep(100);
    }
    throw new Error("wireguard-go n'a pas créé son socket UAPI à temps");
  }

  async cleanupChild() {
    this.stopPolling();
    if (this.child) {
      try { this.child.kill('SIGTERM'); } catch (e) {}
      this.child = null;
    }
  }

  startPolling() {
    const self = this;
    this.stopPolling();
    this.pollTimer = setInterval(function () {
      uapi.getStatus(self.socketPath()).then(function (res) {
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
        // suffit, sauf motif de fond réel (process mort, détecté par le
        // handler 'exit' du child, pas ici).
      });
    }, STATUS_POLL_MS);
  }

  stopPolling() {
    if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null; }
  }

  async connect(confText) {
    if (this.status.state === 'connected' || this.status.state === 'connecting') {
      throw new Error('Déjà connecté ou connexion en cours.');
    }
    this.setStatus({ state: 'connecting', error: null });
    try {
      const parsed = confParser.parseConf(confText);
      if (!binaries.wireguardGoExists(this.app)) {
        throw new Error("wireguard-go n'est pas embarqué pour cette plateforme (" + process.platform + '/' + process.arch + ').');
      }
      if (process.platform !== 'linux') {
        throw new Error('Plateforme non prise en charge pour le moment : ' + process.platform);
      }

      await this.ensureLinuxPrivileges();

      const wgPath = binaries.wireguardGoPath(this.app);
      const self = this;
      this.child = spawn(wgPath, ['-f', IFACE], { stdio: 'ignore' });
      this.child.on('exit', function (code) {
        self.child = null;
        if (self.status.state !== 'disconnected') {
          self.setStatus({ state: 'error', error: 'wireguard-go s’est arrêté de façon inattendue (code ' + code + ').' });
        }
      });

      await this.waitForSocket();

      await uapi.setInterface(this.socketPath(), {
        privateKeyHex: parsed.privateKeyHex,
        peerPublicKeyHex: parsed.peerPublicKeyHex,
        endpoint: parsed.endpoint,
        allowedIps: parsed.allowedIps,
        persistentKeepalive: parsed.persistentKeepalive
      });

      const linuxPlatform = require('./platform/linux');
      await linuxPlatform.bringUp(IFACE, this.socketPath(), parsed);

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
      this.startPolling();
    } catch (e) {
      await this.cleanupChild();
      this.setStatus({ state: 'error', error: e.message });
      throw e;
    }
  }

  async disconnect() {
    this.stopPolling();
    try {
      if (process.platform === 'linux' && this.currentOpts) {
        const linuxPlatform = require('./platform/linux');
        await linuxPlatform.tearDown(IFACE, this.currentOpts).catch(function () {});
      }
    } finally {
      await this.cleanupChild();
      this.currentOpts = null;
      this.setStatus({ state: 'disconnected', rxBytes: 0, txBytes: 0, lastHandshakeSec: 0 });
    }
  }

  getStatus() {
    return this.status;
  }
}

module.exports = { VpnManager, IFACE };
