const { app, BrowserWindow, Menu, Tray, shell, session, nativeImage } = require('electron');
const path = require('path');
const windowState = require('./window-state');

const APP_URL = 'https://xultra.space/';
const ALLOWED_HOST = 'xultra.space';
const ICON_PATH = path.join(__dirname, '..', 'build', 'icon.png');
const TRAY_ICON_PATH = path.join(__dirname, '..', 'build', 'tray.png');

let mainWindow = null;
let tray = null;
app.isQuitting = false;

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
    },
  });

  if (saved.isMaximized) mainWindow.maximize();
  windowState.track(app, mainWindow);

  mainWindow.once('ready-to-show', () => mainWindow.show());
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

  // Comme Discord : fermer la fenêtre la réduit dans la zone de notification
  // au lieu de quitter l'appli, sauf si l'utilisateur choisit vraiment "Quitter".
  mainWindow.on('close', (e) => {
    if (!app.isQuitting && tray) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(TRAY_ICON_PATH);
  tray = new Tray(trayIcon);
  tray.setToolTip('XULTRA');
  const menu = Menu.buildFromTemplate([
    {
      label: 'Ouvrir XULTRA',
      click: () => {
        if (!mainWindow) return;
        mainWindow.show();
        mainWindow.focus();
      },
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
    if (!mainWindow) return;
    if (mainWindow.isVisible()) mainWindow.focus();
    else mainWindow.show();
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

    // Micro/caméra nécessaires pour les appels et le studio de snap ; on
    // n'autorise que xultra.space, tout le reste est refusé par défaut.
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      const url = webContents.getURL();
      const allowed = ['media', 'notifications', 'clipboard-sanitized-write', 'fullscreen'];
      callback(isAllowedUrl(url) && allowed.includes(permission));
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
    if (process.platform !== 'darwin') {
      // La fenêtre reste accessible depuis la zone de notification tant que
      // l'utilisateur n'a pas explicitement choisi "Quitter".
    }
  });

  app.on('before-quit', () => {
    app.isQuitting = true;
  });
}
