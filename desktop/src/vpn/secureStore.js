// Persistance chiffrée (OS-native via safeStorage — DPAPI/Keychain/
// libsecret) du .conf WireGuard claim une seule fois côté serveur
// (/api/vpn/config/claim ne le renvoie jamais deux fois) — sans ça,
// l'appli devrait redemander une nouvelle clé à chaque redémarrage.
// Suit la même convention "petit fichier dans userData" que
// app-settings.js, chiffré au lieu de JSON en clair.
'use strict';
const { safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');

function storeFilePath(app) {
  return path.join(app.getPath('userData'), 'vpn-config.enc');
}

function isAvailable() {
  try { return safeStorage.isEncryptionAvailable(); } catch (e) { return false; }
}

// Sur Linux sans daemon de trousseau actif, le "chiffrement" tombe en
// repli texte clair (getSelectedStorageBackend()==='basic_text') — on
// refuse alors de stocker plutôt que d'écrire une clé privée en clair sous
// couvert d'être "sécurisée" : l'utilisateur devra juste réclamer une
// nouvelle config au prochain lancement, comme si rien n'avait été stocké.
function isReallyEncrypted() {
  if (!isAvailable()) return false;
  try { return safeStorage.getSelectedStorageBackend() !== 'basic_text'; } catch (e) { return true; }
}

function save(app, plainText) {
  if (!isReallyEncrypted()) return false;
  try {
    const encrypted = safeStorage.encryptString(String(plainText || ''));
    fs.writeFileSync(storeFilePath(app), encrypted);
    return true;
  } catch (e) { return false; }
}

function load(app) {
  if (!isAvailable()) return null;
  try {
    const encrypted = fs.readFileSync(storeFilePath(app));
    return safeStorage.decryptString(encrypted);
  } catch (e) { return null; }
}

function has(app) {
  try { return fs.existsSync(storeFilePath(app)); } catch (e) { return false; }
}

function clear(app) {
  try { fs.unlinkSync(storeFilePath(app)); } catch (e) {}
}

module.exports = { isAvailable, isReallyEncrypted, save, load, has, clear };
