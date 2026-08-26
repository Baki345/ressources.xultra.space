// Pont minimal et isolé entre le processus principal et la page xultra.space.
// N'expose que ce qui est nécessaire : aucune API Node/Electron n'est
// accessible depuis le contenu web (contextIsolation reste actif).
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('xultraDesktop', {
  platform: process.platform,
  isDesktop: true,
});
