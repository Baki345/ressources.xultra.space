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
  // VPN IXin — le vrai tunnel WireGuard tourne dans le process principal
  // (voir src/vpn/manager.js), jamais accessible directement depuis la page
  // sandboxée. connect() persiste aussi la config localement (chiffrée) pour
  // que reconnectStored() puisse la réutiliser sans repasser par un claim
  // serveur, qui ne renvoie jamais deux fois la même clé.
  vpn: {
    // opts: {stealth: true/false} — enveloppe le tunnel dans wstunnel
    // (WebSocket-sur-TLS) au lieu de s'y connecter en direct, voir
    // src/vpn/stealth.js.
    connect: (confText, opts) => ipcRenderer.invoke('xultra:vpn-connect', confText, opts),
    // stealthOverride (booléen optionnel) : remplace le mode enregistré pour
    // cette reconnexion (et le re-persiste) — omis, rejoue tel quel le
    // dernier choix connu.
    reconnectStored: (stealthOverride) => ipcRenderer.invoke('xultra:vpn-reconnect-stored', stealthOverride),
    disconnect: () => ipcRenderer.invoke('xultra:vpn-disconnect'),
    getStatus: () => ipcRenderer.invoke('xultra:vpn-status'),
    hasStoredConfig: () => ipcRenderer.invoke('xultra:vpn-has-stored-config'),
    forget: () => ipcRenderer.invoke('xultra:vpn-forget'),
    onStatusChange: (cb) => {
      const listener = (_e, status) => cb(status);
      ipcRenderer.on('xultra:vpn-status-changed', listener);
      return () => ipcRenderer.removeListener('xultra:vpn-status-changed', listener);
    },
  },
});
