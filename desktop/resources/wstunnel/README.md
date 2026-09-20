# wstunnel — binaires par plateforme (non commités)

Comme `../wireguard-go/`, ce dossier reçoit un binaire `wstunnel` par
plateforme/architecture ciblée, dans `<platform>-<arch>/` (valeurs
Node.js : `process.platform`/`process.arch`). Résolu au runtime par
`../src/vpn/binaries.js` et embarqué au packaging via l'entrée
`extraResources` de `desktop/package.json`. Utilisé par le mode
"Stealth" (`../src/vpn/stealth.js`) — voir le plan pour l'architecture
complète (WireGuard enveloppé dans une connexion WebSocket-sur-TLS).

Plus simple que `wireguard-go` : wstunnel publie des binaires statiques
prêts à l'emploi, pas besoin d'un toolchain Go pour les reconstruire.

## Installer pour Linux (x64)

```bash
curl -sSL https://github.com/erebe/wstunnel/releases/download/v11.0.0/wstunnel_11.0.0_linux_amd64.tar.gz \
  | tar xz -C /chemin/vers/desktop/resources/wstunnel/linux-x64/
```

## Installer pour Windows (x64)

```bash
curl -sSL -o wstunnel_win.tar.gz https://github.com/erebe/wstunnel/releases/download/v11.0.0/wstunnel_11.0.0_windows_amd64.tar.gz
tar xzf wstunnel_win.tar.gz -C /chemin/vers/desktop/resources/wstunnel/win32-x64/
# -> produit wstunnel.exe
```

## Installer pour macOS

Phase 3 du plan VPN desktop — bloquée tant qu'un compte Apple Developer
n'existe pas pour signer/notariser `desktop/` (voir le plan).

```bash
curl -sSL https://github.com/erebe/wstunnel/releases/download/v11.0.0/wstunnel_11.0.0_darwin_amd64.tar.gz | tar xz -C .../darwin-x64/
curl -sSL https://github.com/erebe/wstunnel/releases/download/v11.0.0/wstunnel_11.0.0_darwin_arm64.tar.gz | tar xz -C .../darwin-arm64/
```
