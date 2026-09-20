// Élévation de privilèges cross-OS pour amener le tunnel WireGuard, via
// @vscode/sudo-prompt (successeur maintenu du "sudo-prompt" original,
// archivé — utilisé en prod par VS Code lui-même). Mécanisme réel par OS :
// pkexec sur Linux, "osascript ... with administrator privileges" sur
// macOS, UAC natif sur Windows. Ne renvoie qu'un callback (pas un handle de
// process vivant) — la supervision du tunnel lui-même se fait ailleurs
// (manager.js), pas ici.
'use strict';
const sudo = require('@vscode/sudo-prompt');
const { execFile } = require('child_process');

const SUDO_OPTS = { name: 'IXin VPN' };

function runElevated(command) {
  return new Promise(function (resolve, reject) {
    sudo.exec(command, SUDO_OPTS, function (error, stdout, stderr) {
      if (error) { reject(error); return; }
      resolve({ stdout: String(stdout || ''), stderr: String(stderr || '') });
    });
  });
}

// Linux uniquement : cap_net_admin,cap_net_raw via getcap — un chemin peut
// perdre sa capacité après une mise à jour du paquet système qui remplace
// l'inode (ex. iproute2 mis à jour) ; on revérifie donc à chaque connexion
// plutôt qu'une seule fois pour de bon, mais le coût est un simple getcap
// (pas une élévation) tant que la capacité est déjà présente.
function hasLinuxCapabilities(binPath) {
  return new Promise(function (resolve) {
    execFile('getcap', [binPath], function (err, stdout) {
      if (err) { resolve(false); return; }
      const out = String(stdout || '');
      resolve(out.indexOf('cap_net_admin') !== -1 && out.indexOf('cap_net_raw') !== -1);
    });
  });
}

// N'élève qu'une seule fois, pour TOUS les binaires manquants d'un coup
// (un seul prompt pkexec plutôt qu'un par binaire).
async function ensureLinuxCapabilities(binPaths) {
  const missing = [];
  for (const p of binPaths) {
    const ok = await hasLinuxCapabilities(p);
    if (!ok) missing.push(p);
  }
  if (missing.length === 0) return { elevated: false };
  const cmd = missing.map(function (p) {
    return 'setcap cap_net_admin,cap_net_raw+eip ' + JSON.stringify(p);
  }).join(' && ');
  await runElevated(cmd);
  return { elevated: true, paths: missing };
}

module.exports = { runElevated, hasLinuxCapabilities, ensureLinuxCapabilities };
