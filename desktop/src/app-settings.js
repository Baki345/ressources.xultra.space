// Préférences utilisateur pour le comportement de l'appli (indépendant de la
// taille/position de fenêtre gérée par window-state.js) : un simple fichier
// JSON dans le dossier userData, sans dépendance externe.
const fs = require('fs');
const path = require('path');

const DEFAULTS = { startMinimized: false, minimizeToTray: true };

function settingsFilePath(app) {
  return path.join(app.getPath('userData'), 'app-settings.json');
}

function loadSettings(app) {
  try {
    const raw = fs.readFileSync(settingsFilePath(app), 'utf8');
    const s = JSON.parse(raw);
    return { ...DEFAULTS, ...s };
  } catch (e) {
    return { ...DEFAULTS };
  }
}

function saveSettings(app, settings) {
  try {
    fs.writeFileSync(settingsFilePath(app), JSON.stringify(settings));
  } catch (e) {}
}

module.exports = { loadSettings, saveSettings, DEFAULTS };
