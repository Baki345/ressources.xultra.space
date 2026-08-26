# XULTRA Desktop

Application de bureau native pour XULTRA (comme le client Discord), construite
avec [Electron](https://www.electronjs.org/). C'est une enveloppe autour de
`https://xultra.space` — aucune logique métier n'est dupliquée ici, tout le
site (chat, DM, snaps, appels, serveurs…) continue de tourner exactement
comme dans un navigateur. Le desktop ajoute seulement des attentions natives :

- Fenêtre dédiée avec sa propre icône, sans barre d'adresse ni onglets.
- Réduction dans la zone de notification (system tray) à la fermeture, comme
  Discord — l'appli continue de tourner en arrière-plan, "Quitter" depuis le
  tray l'arrête vraiment.
- Position/taille de fenêtre mémorisées d'un lancement à l'autre.
- Les liens externes (hors xultra.space) s'ouvrent dans le navigateur système
  au lieu d'une fenêtre Electron sans restriction ; les aperçus d'images/liens
  internes s'ouvrent dans une vraie fenêtre native.
- Permissions caméra/micro/notifications accordées uniquement à xultra.space
  (nécessaires pour les appels et le studio de snap).
- Une seule instance à la fois (relancer l'appli redonne le focus à la
  fenêtre existante au lieu d'en ouvrir une deuxième).

## Développement

```bash
cd desktop
npm install
npm start
```

## Construire les installeurs

```bash
npm run dist:win     # .exe (NSIS + portable)
npm run dist:mac     # .dmg + .zip
npm run dist:linux   # AppImage + .deb
npm run dist         # les trois plateformes (nécessite les outils natifs de chacune)
```

Les binaires sortent dans `desktop/dist/`. L'icône (`build/icon.png`, 1024×1024)
est celle du favicon/logo web — `electron-builder` en dérive automatiquement
les `.icns`/`.ico` nécessaires à chaque plateforme, aucune conversion manuelle
n'est nécessaire.

## Notes

- `src/main.js` : processus principal (fenêtre, tray, menu, permissions).
- `src/preload.js` : pont isolé (`contextIsolation`) qui expose
  `window.xultraDesktop = { isDesktop: true, platform }` au site — permet un
  jour de l'utiliser côté web pour adapter l'UI au contexte desktop, sans rien
  exposer de Node/Electron à la page.
- `src/window-state.js` : persistance position/taille de fenêtre (fichier JSON
  dans le dossier `userData`, aucune dépendance externe).
- Build vérifié dans ce dépôt via un lancement headless (`xvfb-run`) : le
  processus principal démarre sans erreur JS (création de fenêtre, tray, menu,
  permissions). Le chargement réel de xultra.space et les fonctions caméra/
  appels n'ont pas pu être testés visuellement depuis cet environnement
  (pas de navigateur graphique ni de caméra ici) — à vérifier après le premier
  lancement sur une vraie machine.
