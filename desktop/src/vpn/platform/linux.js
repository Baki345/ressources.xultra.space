// Module de plateforme Linux — implémente l'interface commune attendue par
// manager.js (socketPath/ensurePrivileges/startTunnelProcess/bringUp/
// tearDown) ; voir platform/win32.js pour la même interface avec une
// stratégie de privilèges totalement différente (setcap une fois ici,
// élévation à chaque connexion là-bas — Windows n'a pas d'équivalent aux
// capacités Linux). bringUp/tearDown reproduisent les commandes de
// wg-quick (linux.bash) pour ne pas dépendre de wireguard-tools installé
// chez l'utilisateur.
'use strict';
const { execFile, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { sendUapiCommand } = require('../uapiClient');
const elevate = require('../elevate');

const FWMARK = 51820;
const RT_TABLE = 51820;
const RESOLV_BACKUP = '/etc/resolv.conf.ixin-backup';
const SOCKET_DIR = '/var/run/wireguard';

function socketPath(iface) { return path.join(SOCKET_DIR, iface + '.sock'); }

function which(binName) {
  return new Promise(function (resolve) {
    execFile('which', [binName], function (err, stdout) { resolve(err ? null : String(stdout).trim()); });
  });
}

function dirWritable(dir) {
  try { fs.accessSync(dir, fs.constants.W_OK); return true; } catch (e) { return false; }
}

// Un seul prompt d'élévation couvrant TOUT ce qui manque (capacités +
// dossier d'exécution) plutôt qu'un par étape — /var/run étant typiquement
// un tmpfs, ce dossier peut redevenir manquant après un redémarrage même
// si les capacités, elles, restent posées sur le fichier binaire
// (persistant sur le disque, donc en général un prompt UNIQUE de toute la
// vie de la machine, pas juste de l'appli).
async function ensurePrivileges(app, wgPath) {
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

// Les capacités posées par ensurePrivileges suffisent à lancer wireguard-go
// SANS élévation à chaque connexion (contrairement à Windows/macOS) — un
// spawn() normal, avec un vrai handle de process qu'on peut simplement tuer
// à la déconnexion (SIGTERM suffit, wireguard-go détruit alors lui-même
// l'interface TUN qu'il possédait).
function startTunnelProcess(wgPath, iface) {
  return new Promise(function (resolve, reject) {
    const child = spawn(wgPath, ['-f', iface], { stdio: 'ignore' });
    let settled = false;
    child.once('error', function (e) { if (!settled) { settled = true; reject(e); } });
    // spawn() est synchrone du point de vue de l'appelant (le process existe
    // dès le retour de spawn()) — le seul cas d'erreur async possible ici
    // est un ENOENT/EACCES immédiat, capturé par le handler ci-dessus.
    setImmediate(function () {
      if (settled) return;
      settled = true;
      resolve({
        stop: function () {
          return new Promise(function (res) {
            try { child.kill('SIGTERM'); } catch (e) {}
            res();
          });
        },
        onExit: function (cb) { child.on('exit', cb); }
      });
    });
  });
}

function run(cmd, args) {
  return new Promise(function (resolve, reject) {
    execFile(cmd, args, function (err, stdout, stderr) {
      if (err) { reject(new Error(cmd + ' ' + args.join(' ') + ' a échoué : ' + (stderr || err.message))); return; }
      resolve(String(stdout || ''));
    });
  });
}

function which(bin) {
  return new Promise(function (resolve) {
    execFile('which', [bin], function (err) { resolve(!err); });
  });
}

async function detectDnsBackend() {
  if (await which('resolvectl')) return 'resolvectl';
  if (await which('resolvconf')) return 'resolvconf';
  return 'resolv.conf';
}

function resolvconfAdd(iface, dns) {
  return new Promise(function (resolve, reject) {
    const p = spawn('resolvconf', ['-a', iface, '-m', '0', '-x']);
    p.stdin.write('nameserver ' + dns + '\n');
    p.stdin.end();
    p.on('exit', function (code) { code === 0 ? resolve() : reject(new Error('resolvconf a échoué (code ' + code + ')')); });
    p.on('error', reject);
  });
}

async function setDns(iface, dns) {
  if (!dns) return;
  const backend = await detectDnsBackend();
  if (backend === 'resolvectl') {
    await run('resolvectl', ['dns', iface, dns]);
    await run('resolvectl', ['domain', iface, '~.']);
    return;
  }
  if (backend === 'resolvconf') {
    await resolvconfAdd(iface, dns);
    return;
  }
  // Dernier recours seulement (ni resolvectl ni resolvconf présents) :
  // réécriture directe avec sauvegarde pour pouvoir restaurer à la
  // déconnexion.
  try { fs.writeFileSync(RESOLV_BACKUP, fs.readFileSync('/etc/resolv.conf', 'utf8')); } catch (e) {}
  fs.writeFileSync('/etc/resolv.conf', 'nameserver ' + dns + '\n');
}

async function restoreDns(iface) {
  const backend = await detectDnsBackend();
  if (backend === 'resolvectl') { await run('resolvectl', ['revert', iface]).catch(function () {}); return; }
  if (backend === 'resolvconf') { await run('resolvconf', ['-d', iface, '-f']).catch(function () {}); return; }
  try {
    if (fs.existsSync(RESOLV_BACKUP)) {
      fs.copyFileSync(RESOLV_BACKUP, '/etc/resolv.conf');
      fs.unlinkSync(RESOLV_BACKUP);
    }
  } catch (e) {}
}

// À appeler APRÈS setInterface() (uapiClient) — clé/pair déjà configurés,
// il ne reste que l'adresse, le routage par policy (pas une route par
// défaut littérale, pour ne pas reboucler le trafic UDP de wireguard-go
// lui-même dans le tunnel qu'il vient d'ouvrir — voir wg-quick linux.bash),
// et le DNS.
async function bringUp(iface, socketPath, opts) {
  await run('ip', ['-4', 'address', 'add', opts.addressCidr, 'dev', iface]);
  await run('ip', ['link', 'set', 'up', 'dev', iface]);

  await sendUapiCommand(socketPath, ['set=1', 'fwmark=' + FWMARK]);
  await run('ip', ['-4', 'route', 'add', '0.0.0.0/0', 'dev', iface, 'table', String(RT_TABLE)]);
  await run('ip', ['-4', 'rule', 'add', 'not', 'fwmark', String(FWMARK), 'table', String(RT_TABLE)]);
  await run('ip', ['-4', 'rule', 'add', 'table', 'main', 'suppress_prefixlength', '0']);

  if (opts.dns) await setDns(iface, opts.dns).catch(function () {});
}

async function tearDown(iface, opts) {
  await run('ip', ['-4', 'rule', 'del', 'table', 'main', 'suppress_prefixlength', '0']).catch(function () {});
  await run('ip', ['-4', 'rule', 'del', 'not', 'fwmark', String(FWMARK), 'table', String(RT_TABLE)]).catch(function () {});
  await run('ip', ['-4', 'route', 'del', '0.0.0.0/0', 'dev', iface, 'table', String(RT_TABLE)]).catch(function () {});
  if (opts && opts.dns) await restoreDns(iface).catch(function () {});
  // Pas de "ip link del" : tuer le process wireguard-go détruit déjà
  // l'interface TUN qu'il possède.
}

module.exports = { socketPath, ensurePrivileges, startTunnelProcess, bringUp, tearDown, setDns, restoreDns, FWMARK, RT_TABLE };
