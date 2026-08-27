// Pont minimal et isolé entre le processus principal et la page xultra.space.
// N'expose que ce qui est nécessaire : aucune API Node/Electron n'est
// accessible depuis le contenu web (contextIsolation reste actif). Les
// réglages OS (démarrage, minimisation) passent par ipcRenderer.invoke vers
// des handlers dédiés dans main.js — jamais d'accès direct à `app` ici.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('xultraDesktop', {
  platform: process.platform,
  isDesktop: true,
  getOsSettings: () => ipcRenderer.invoke('xultra:get-os-settings'),
  setOpenAtLogin: (value) => ipcRenderer.invoke('xultra:set-open-at-login', value),
  setStartMinimized: (value) => ipcRenderer.invoke('xultra:set-start-minimized', value),
  setMinimizeToTray: (value) => ipcRenderer.invoke('xultra:set-minimize-to-tray', value),
  setBadgeCount: (count) => ipcRenderer.invoke('xultra:set-badge-count', count),
  showWindow: () => ipcRenderer.invoke('xultra:show-window'),
});
