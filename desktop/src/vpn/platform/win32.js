// Module de plateforme Windows — même interface que platform/linux.js
// (socketPath/ensurePrivileges/startTunnelProcess/bringUp/tearDown), mais
// une stratégie de privilèges complètement différente : Windows n'a pas
// d'équivalent aux capacités Linux (setcap une seule fois), donc CHAQUE
// connexion élève via @vscode/sudo-prompt (invite UAC). Conséquence directe
// sur la forme du code : on ne peut pas juste spawn() + garder un handle de
// process comme sur Linux — le processus wireguard-go doit être lancé par
// la commande élevée elle-même (détaché, Start-Process), donc sans handle
// direct côté Node ; l'arrêt passe par une seconde commande élevée
// (taskkill par nom d'image), pas par un simple .kill().
//
// ⚠️ Codé à partir de la documentation officielle WireGuard/Wintun (voir le
// plan) mais jamais exécuté sur une vraie machine Windows — ce bac à sable
// de développement est un conteneur Linux. À valider sur une vraie machine
// avant de considérer cette plateforme comme fiable.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const elevate = require('../elevate');

function socketPath(iface) { return '\\\\.\\pipe\\WireGuard\\' + iface; }

// Rien à faire une seule fois côté Windows — contrairement à Linux, il n'y
// a pas de mécanisme "pose une capacité sur le disque, plus jamais besoin
// d'élévation ensuite" : chaque connexion élève séparément dans
// startTunnelProcess()/bringUp().
async function ensurePrivileges() {}

function writeTempScript(contents, suffix) {
  const file = path.join(os.tmpdir(), 'ixin-vpn-' + Date.now() + '-' + Math.random().toString(36).slice(2) + suffix);
  fs.writeFileSync(file, contents, 'utf8');
  return file;
}

function cleanupTempFile(file) {
  try { fs.unlinkSync(file); } catch (e) {}
}

async function runElevatedPowerShell(script) {
  const scriptPath = writeTempScript(script, '.ps1');
  try {
    await elevate.runElevated('powershell -NoProfile -ExecutionPolicy Bypass -File ' + JSON.stringify(scriptPath));
  } finally {
    cleanupTempFile(scriptPath);
  }
}

// Lance wireguard-go.exe en arrière-plan, élevé (Wintun exige
// Administrateur pour créer un adaptateur — voir la doc Wintun citée dans
// le plan). Start-Process détache le processus : on n'obtient aucun handle
// Node dessus, donc stop() doit passer par une commande élevée séparée
// (taskkill) plutôt qu'un .kill() classique.
async function startTunnelProcess(wgPath, iface) {
  const launchScript = 'Start-Process -FilePath ' + JSON.stringify(wgPath)
    + ' -ArgumentList \'-f\',\'' + iface + '\' -WindowStyle Hidden\r\n';
  await runElevatedPowerShell(launchScript);
  return {
    stop: function () {
      // Nom d'image générique (pas de PID connu) : acceptable tant qu'une
      // seule instance de wireguard-go tourne jamais en parallèle sur cette
      // machine, ce que ce manager garantit déjà (un seul VpnManager par
      // appli, une seule appli desktop IXin par utilisateur).
      return runElevatedPowerShell('taskkill /F /IM wireguard-go.exe\r\n').catch(function () {});
    },
    onExit: function () {
      // Pas de handle de process détaché — la détection "wireguard-go est
      // mort de façon inattendue" repose entièrement sur le polling de
      // statut (manager.js), pas sur un évènement 'exit' ici.
    }
  };
}

// À appeler APRÈS setInterface() (uapiClient, communication directe avec le
// named pipe — n'a PAS besoin d'élévation côté appelant, seul le process
// wireguard-go qui répond de l'autre côté du pipe est élevé). PowerShell
// (New-NetIPAddress/New-NetRoute) plutôt que netsh/route.exe : accepte
// directement le nom de l'adaptateur (-InterfaceAlias), évite d'avoir à
// résoudre son ifIndex numérique séparément.
async function bringUp(iface, socketPathIgnored, opts) {
  const lines = [];
  lines.push('New-NetIPAddress -InterfaceAlias ' + JSON.stringify(iface) + ' -IPAddress ' + JSON.stringify(opts.addressIp) + ' -PrefixLength 32 -ErrorAction SilentlyContinue | Out-Null');
  if (opts.dns) {
    lines.push('Set-DnsClientServerAddress -InterfaceAlias ' + JSON.stringify(iface) + ' -ServerAddresses ' + JSON.stringify(opts.dns) + ' -ErrorAction SilentlyContinue | Out-Null');
  }
  // Répartition en deux routes /1 plutôt qu'une 0.0.0.0/0 littérale — même
  // raison que Linux/macOS : éviter que le trafic UDP de wireguard-go vers
  // le serveur ne reboucle dans le tunnel qu'il vient d'ouvrir. Correspond
  // au mode "sans kill-switch" de wireguard-windows (docs/netquirk.md).
  lines.push('New-NetRoute -InterfaceAlias ' + JSON.stringify(iface) + ' -DestinationPrefix "0.0.0.0/1" -NextHop "0.0.0.0" -ErrorAction SilentlyContinue | Out-Null');
  lines.push('New-NetRoute -InterfaceAlias ' + JSON.stringify(iface) + ' -DestinationPrefix "128.0.0.0/1" -NextHop "0.0.0.0" -ErrorAction SilentlyContinue | Out-Null');
  await runElevatedPowerShell(lines.join('\r\n') + '\r\n');
}

// Rien à défaire explicitement : tuer wireguard-go.exe (voir stop() dans
// startTunnelProcess) détruit l'adaptateur Wintun qu'il possédait, ce qui
// emporte avec lui l'adresse IP et les routes posées par bringUp() — même
// raisonnement que Linux ("pas de ip link del nécessaire").
async function tearDown() {}

module.exports = { socketPath, ensurePrivileges, startTunnelProcess, bringUp, tearDown };
