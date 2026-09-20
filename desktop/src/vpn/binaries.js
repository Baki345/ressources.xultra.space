// Résolution du chemin du binaire wireguard-go embarqué — packagé
// (process.resourcesPath, via l'entrée extraResources de
// desktop/package.json) ou en dev (repo-relative). Un seul point de vérité
// pour cette branche, sinon chaque appelant réinvente le if(app.isPackaged).
'use strict';
const path = require('path');
const fs = require('fs');

function platformArchDir() {
  return process.platform + '-' + process.arch;
}

function wireguardGoDir(app) {
  if (app && app.isPackaged) {
    return path.join(process.resourcesPath, 'wireguard-go');
  }
  return path.join(__dirname, '..', '..', 'resources', 'wireguard-go', platformArchDir());
}

function wireguardGoPath(app) {
  const dir = wireguardGoDir(app);
  const name = process.platform === 'win32' ? 'wireguard-go.exe' : 'wireguard-go';
  return path.join(dir, name);
}

function wireguardGoExists(app) {
  try { return fs.existsSync(wireguardGoPath(app)); } catch (e) { return false; }
}

module.exports = { wireguardGoDir, wireguardGoPath, wireguardGoExists, platformArchDir };
