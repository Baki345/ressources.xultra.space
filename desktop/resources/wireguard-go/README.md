# wireguard-go — binaires par plateforme (non commités)

Ce dossier reçoit un binaire `wireguard-go` par plateforme/architecture
ciblée, dans une sous-arborescence `<platform>-<arch>/` (valeurs Node.js :
`process.platform`/`process.arch` — ex. `linux-x64`, `win32-x64`,
`darwin-arm64`). Résolu au runtime par `../src/vpn/binaries.js` et
embarqué au packaging via l'entrée `extraResources` de
`desktop/package.json`.

Ces binaires ne sont **jamais commités** (voir `.gitignore`) : ce sont des
blobs compilés, un par OS/arch, à reconstruire avant chaque `npm run
dist:*` — exactement comme n'importe quel artefact de build.

## Construire pour Linux (x64)

```bash
git clone --depth 1 https://github.com/WireGuard/wireguard-go.git /tmp/wireguard-go
cd /tmp/wireguard-go
GOOS=linux GOARCH=amd64 go build -o /chemin/vers/desktop/resources/wireguard-go/linux-x64/wireguard-go .
```

## Construire pour Windows (x64)

```bash
GOOS=windows GOARCH=amd64 go build -o /chemin/vers/desktop/resources/wireguard-go/win32-x64/wireguard-go.exe .
```

Il faut **aussi** déposer `wintun.dll` (téléchargé tel quel depuis
https://www.wintun.net/ — jamais reconstruit soi-même, ce sont les seuls
binaires signés officiellement supportés pour la redistribution) dans ce
même dossier `win32-x64/`, à côté de `wireguard-go.exe` — c'est sa
convention de chargement documentée (même répertoire que l'exécutable qui
l'utilise). Vérifier le SHA-256 publié avant de l'embarquer.

## Construire pour macOS

Phase 3 du plan VPN desktop — bloquée tant qu'un compte Apple Developer
n'existe pas pour signer/notariser `desktop/` (voir le plan). Pas de
binaire à produire ici avant que ce prérequis soit levé.

```bash
GOOS=darwin GOARCH=amd64 go build -o .../darwin-x64/wireguard-go .
GOOS=darwin GOARCH=arm64 go build -o .../darwin-arm64/wireguard-go .
```
