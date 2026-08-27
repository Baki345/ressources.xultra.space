const { app, BrowserWindow, Menu, Tray, shell, session, nativeImage, ipcMain } = require('electron');
const path = require('path');
const windowState = require('./window-state');
const appSettings = require('./app-settings');

const APP_URL = 'https://xultra.space/';
const ALLOWED_HOST = 'xultra.space';
const ICON_PATH = path.join(__dirname, '..', 'build', 'icon.png');
const TRAY_ICON_PATH = path.join(__dirname, '..', 'build', 'tray.png');
const BADGES_DIR = path.join(__dirname, '..', 'build', 'badges');
// Argument passé par Electron à l'exécutable relancé au démarrage de session
// (voir setOpenAtLogin ci-dessous) : distingue un lancement automatique d'un
// double-clic manuel, pour n'appliquer "démarrer minimisé" que dans ce cas.
const HIDDEN_LAUNCH_ARG = '--xultra-hidden-launch';

let mainWindow = null;
let tray = null;
let settings = appSettings.DEFAULTS;
app.isQuitting = false;

function wasLaunchedHidden() {
  if (process.argv.includes(HIDDEN_LAUNCH_ARG)) return true;
  // macOS ne passe pas l'argument (Login Items relance l'app normalement) ;
  // Electron expose directement l'information dans ce cas.
  try { return !!app.getLoginItemSettings().wasOpenedAsHidden; } catch (e) { return false; }
}

function isAllowedUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.hostname === ALLOWED_HOST || u.hostname.endsWith('.' + ALLOWED_HOST);
  } catch (e) {
    return false;
  }
}

function createMainWindow() {
  const saved = windowState.loadState(app);
  const bounds = windowState.fitsOnDisplay(saved)
    ? { x: saved.x, y: saved.y, width: saved.width, height: saved.height }
    : { width: saved.width, height: saved.height };

  mainWindow = new BrowserWindow({
    ...bounds,
    minWidth: 940,
    minHeight: 600,
    icon: ICON_PATH,
    backgroundColor: '#0b0710',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // Sans ça, Chromium ralentit les timers JS d'une fenêtre cachée (tray)
      // pour économiser des ressources — inoffensif pour un simple onglet
      // en arrière-plan, mais retarderait la sonnerie d'un appel entrant ou
      // le traitement d'une notification tant que la fenêtre reste masquée.
      backgroundThrottling: false,
    },
  });

  if (saved.isMaximized) mainWindow.maximize();
  windowState.track(app, mainWindow);

  // "Démarrer minimisé" ne s'applique qu'à un lancement automatique au
  // démarrage de session — un double-clic manuel sur l'icône doit toujours
  // ouvrir la fenêtre, sinon l'appli semblerait ne pas se lancer du tout.
  const startHidden = settings.startMinimized && wasLaunchedHidden();
  if (!startHidden) mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.loadURL(APP_URL);

  // Liens/images ouverts avec window.open() : s'ils pointent vers xultra.space
  // (ex. aperçu d'image en plein écran), on ouvre une vraie fenêtre native ;
  // tout le reste (liens externes) part vers le navigateur système, jamais
  // dans une fenêtre Electron sans restrictions.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedUrl(url)) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          icon: ICON_PATH,
          autoHideMenuBar: true,
          webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
        },
      };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Empêche la fenêtre principale de naviguer ailleurs que sur xultra.space
  // (une redirection intempestive resterait dans l'appli au lieu du navigateur).
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (!isAllowedUrl(url)) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });

  // Comme Discord par défaut : fermer la fenêtre la réduit dans la zone de
  // notification au lieu de quitter l'appli — désactivable dans les
  // paramètres XULTRA (§ Paramètres du système), sauf si l'utilisateur
  // choisit vraiment "Quitter" depuis le menu ou l'icône de la zone de
  // notification.
  mainWindow.on('close', (e) => {
    if (!app.isQuitting && tray && settings.minimizeToTray) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
  // Sans ce reset, une réouverture depuis la zone de notification après une
  // fermeture réelle (minimizeToTray désactivé) appellerait .show() sur une
  // fenêtre déjà détruite.
  mainWindow.on('closed', () => { mainWindow = null; });
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) { createMainWindow(); return; }
  mainWindow.show();
  mainWindow.focus();
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(TRAY_ICON_PATH);
  tray = new Tray(trayIcon);
  tray.setToolTip('XULTRA');
  const menu = Menu.buildFromTemplate([
    {
      label: 'Ouvrir XULTRA',
      click: showMainWindow,
    },
    { type: 'separator' },
    {
      label: 'Quitter',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(menu);
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible()) mainWindow.focus();
    else showMainWindow();
  });
}

function buildAppMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu', label: 'XULTRA' }] : []),
    {
      label: 'Édition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Rétablir' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' },
        { role: 'selectAll', label: 'Tout sélectionner' },
      ],
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Actualiser' },
        { role: 'forceReload', label: 'Forcer l\'actualisation' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom normal' },
        { role: 'zoomIn', label: 'Zoomer' },
        { role: 'zoomOut', label: 'Dézoomer' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' },
      ],
    },
    {
      label: 'Fenêtre',
      submenu: [
        { role: 'minimize', label: 'Réduire' },
        { role: 'close', label: 'Fermer' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    if (process.platform === 'win32') app.setAppUserModelId('space.xultra.desktop');

    settings = appSettings.loadSettings(app);

    // Micro/caméra nécessaires pour les appels et le studio de snap ; on
    // n'autorise que xultra.space, tout le reste est refusé par défaut.
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      const url = webContents.getURL();
      const allowed = ['media', 'notifications', 'clipboard-sanitized-write', 'fullscreen'];
      callback(isAllowedUrl(url) && allowed.includes(permission));
    });

    // Réglages "Paramètres du système" exposés à la page web via preload.js
    // (window.xultraDesktop) — lus/écrits ici car app.setLoginItemSettings
    // et le fichier de préférences ne sont accessibles que dans ce processus.
    ipcMain.handle('xultra:get-os-settings', () => ({
      openAtLogin: app.getLoginItemSettings().openAtLogin,
      startMinimized: settings.startMinimized,
      minimizeToTray: settings.minimizeToTray,
    }));
    ipcMain.handle('xultra:set-open-at-login', (e, value) => {
      app.setLoginItemSettings({ openAtLogin: !!value, args: [HIDDEN_LAUNCH_ARG] });
      return true;
    });
    ipcMain.handle('xultra:set-start-minimized', (e, value) => {
      settings = { ...settings, startMinimized: !!value };
      appSettings.saveSettings(app, settings);
      return true;
    });
    ipcMain.handle('xultra:set-minimize-to-tray', (e, value) => {
      settings = { ...settings, minimizeToTray: !!value };
      appSettings.saveSettings(app, settings);
      return true;
    });
    // Badge de messages non lus sur l'icône de l'appli : macOS et Linux (dock/
    // launcher qui supporte l'API D-Bus LauncherEntry) ont un vrai compteur
    // natif via app.setBadgeCount ; Windows n'a pas cet équivalent, il faut y
    // superposer une petite icône ronde sur la barre des tâches à la place —
    // d'où les pastilles pré-générées dans build/badges/.
    // Filet de sécurité pour "recevoir un appel/une notification en arrière-
    // plan" : le clic sur une notification système déclenche déjà
    // client.focus() côté Service Worker (voir SW_JS côté serveur), ce qui
    // fonctionne pour un onglet de navigateur normal, mais son effet sur une
    // BrowserWindow qu'on a explicitement cachée (.hide(), pas juste
    // minimisée) n'est pas garanti selon l'OS. La page relaie donc aussi un
    // postMessage du Service Worker vers cet appel IPC, qui rappelle
    // showMainWindow() directement sur la vraie fenêtre — deux chemins pour
    // le même résultat, dont un fiable à coup sûr.
    ipcMain.handle('xultra:show-window', () => { showMainWindow(); return true; });
    ipcMain.handle('xultra:set-badge-count', (e, count) => {
      const n = Math.max(0, Number(count) || 0);
      if (process.platform === 'win32') {
        if (!mainWindow || mainWindow.isDestroyed()) return true;
        if (n === 0) { mainWindow.setOverlayIcon(null, ''); return true; }
        const label = n > 9 ? '9plus' : String(n);
        const img = nativeImage.createFromPath(path.join(BADGES_DIR, label + '.png'));
        mainWindow.setOverlayIcon(img, n > 9 ? '9+ notifications non lues' : n + ' notification(s) non lue(s)');
      } else {
        app.setBadgeCount(n);
      }
      return true;
    });

    buildAppMenu();
    createMainWindow();
    createTray();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
      else mainWindow.show();
    });
  });

  app.on('window-all-closed', () => {
    // "Minimiser dans la barre des tâches" désactivé : une fenêtre fermée
    // est réellement fermée, donc quitter l'application comme n'importe
    // quel logiciel de bureau classique, plutôt que de rester en tâche de
    // fond sans fenêtre ni moyen évident de la rouvrir.
    if (!settings.minimizeToTray) {
      app.isQuitting = true;
      app.quit();
      return;
    }
    // Sinon la fenêtre reste accessible depuis la zone de notification tant
    // que l'utilisateur n'a pas explicitement choisi "Quitter".
  });

  app.on('before-quit', () => {
    app.isQuitting = true;
  });
}
