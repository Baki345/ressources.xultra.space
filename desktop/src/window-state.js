// Persiste la taille/position de la fenêtre entre deux lancements, sans
// dépendance externe : un simple fichier JSON dans le dossier userData.
const fs = require('fs');
const path = require('path');
const { screen } = require('electron');

function stateFilePath(app) {
  return path.join(app.getPath('userData'), 'window-state.json');
}

function loadState(app) {
  try {
    const raw = fs.readFileSync(stateFilePath(app), 'utf8');
    const s = JSON.parse(raw);
    if (s && typeof s.width === 'number' && typeof s.height === 'number') return s;
  } catch (e) {}
  return { width: 1280, height: 820 };
}

function fitsOnDisplay(state) {
  if (typeof state.x !== 'number' || typeof state.y !== 'number') return false;
  return screen.getAllDisplays().some((d) => {
    const a = d.workArea;
    return state.x >= a.x && state.y >= a.y && state.x < a.x + a.width && state.y < a.y + a.height;
  });
}

function track(app, win) {
  let saveTimer = null;
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (win.isDestroyed()) return;
      const bounds = win.getBounds();
      const isMaximized = win.isMaximized();
      try {
        fs.writeFileSync(stateFilePath(app), JSON.stringify({ ...bounds, isMaximized }));
      } catch (e) {}
    }, 400);
  };
  win.on('resize', save);
  win.on('move', save);
  win.on('close', save);
}

module.exports = { loadState, fitsOnDisplay, track };
