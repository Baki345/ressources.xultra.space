// Montée/descente du tunnel sur Linux, une fois l'interface WireGuard déjà
// créée et configurée via UAPI (clé, pair, endpoint, allowed-ips — voir
// manager.js) : il ne reste que l'adresse, le routage, et le DNS. Mêmes
// commandes que wg-quick (linux.bash), reproduites ici pour ne pas dépendre
// de wireguard-tools étant installé chez l'utilisateur.
'use strict';
const { execFile, spawn } = require('child_process');
const fs = require('fs');
const { sendUapiCommand } = require('../uapiClient');

const FWMARK = 51820;
const RT_TABLE = 51820;
const RESOLV_BACKUP = '/etc/resolv.conf.ixin-backup';

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

module.exports = { bringUp, tearDown, setDns, restoreDns, FWMARK, RT_TABLE };
