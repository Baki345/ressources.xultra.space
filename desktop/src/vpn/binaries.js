// Résolution des chemins des binaires embarqués (wireguard-go, wstunnel) —
// packagé (process.resourcesPath, via les entrées extraResources de
// desktop/package.json) ou en dev (repo-relative). Un seul point de vérité
// pour cette branche, sinon chaque appelant réinvente le if(app.isPackaged).
'use strict';
const path = require('path');
const fs = require('fs');

function platformArchDir() {
  return process.platform + '-' + process.arch;
}

function resourceDir(app, name) {
  if (app && app.isPackaged) {
    return path.join(process.resourcesPath, name);
  }
  return path.join(__dirname, '..', '..', 'resources', name, platformArchDir());
}

function wireguardGoDir(app) { return resourceDir(app, 'wireguard-go'); }

function wireguardGoPath(app) {
  const dir = wireguardGoDir(app);
  const name = process.platform === 'win32' ? 'wireguard-go.exe' : 'wireguard-go';
  return path.join(dir, name);
}

function wireguardGoExists(app) {
  try { return fs.existsSync(wireguardGoPath(app)); } catch (e) { return false; }
}

function wstunnelDir(app) { return resourceDir(app, 'wstunnel'); }

function wstunnelPath(app) {
  const dir = wstunnelDir(app);
  const name = process.platform === 'win32' ? 'wstunnel.exe' : 'wstunnel';
  return path.join(dir, name);
}

function wstunnelExists(app) {
  try { return fs.existsSync(wstunnelPath(app)); } catch (e) { return false; }
}

module.exports = {
  wireguardGoDir, wireguardGoPath, wireguardGoExists,
  wstunnelDir, wstunnelPath, wstunnelExists,
  platformArchDir
};
