# IXin VPN — appli Android dédiée

Appli Expo séparée de `mobile/` (l'appli chat IXin) : un tunnel WireGuard
réel intégré directement (Android `VpnService`, via la bibliothèque
officielle `com.wireguard.android:tunnel` — même logique que l'appli
desktop, qui enveloppe le binaire officiel `wireguard-go` plutôt que
réimplémenter WireGuard soi-même), avec le même compte IXin que
xultra.space/l'appli mobile principale (même projet Appwrite, juste une
Platform différente).

Distribuée **hors Play Store** — un `.apk` sideloadable direct (profil
`preview`/`production` de `eas.json`, tous deux en `buildType: "apk"`,
sans bloc `submit`), à côté du choix déjà existant (.conf WireGuard brut
à importer dans l'appli officielle).

## Avant le premier build

1. **Nouvel EAS project** : `npx eas init` (avec le compte Expo
   `ciscodev7`, propriétaire de l'appli mobile existante) puis reporter
   l'id généré dans `app.json` → `expo.extra.eas.projectId` (contient
   actuellement un placeholder `REPLACE_WITH_NEW_EAS_PROJECT_ID`).
2. **Nouvelle Platform Appwrite** : dans le projet Appwrite existant
   (`6aab2f4a00243807fa77`, project settings → Platforms), déclarer une
   plateforme Android avec le package `space.xultra.vpn` — sans ça,
   toutes les requêtes de cette appli sont rejetées (même mécanisme que
   `space.xultra.mobile` pour `mobile/`).
3. **Icônes** : `assets/*.png` sont pour l'instant une COPIE des icônes
   de l'appli IXin principale (placeholder) — à remplacer par une
   identité visuelle dédiée si voulu, aucune obligation technique.

## Développement

```bash
npm install
npm run typecheck    # tsc --noEmit — vérifié dans cette session, propre
npx expo prebuild --platform android   # génère android/ (jamais commité, voir .gitignore)
```

**Contrainte importante** : le module natif (`modules/ixin-vpn/`)
embarque du code Kotlin réel — Expo Go ne peut pas le charger. Un build
de développement (`eas build --profile development`) ou un
`expo run:android` avec un SDK Android installé sont nécessaires pour
tester quoi que ce soit d'interactif.

## Build .apk

```bash
eas build --platform android --profile preview
```

## État de la vérification (fait dans un environnement sans SDK/émulateur Android)

- ✅ `tsc --noEmit` : propre sur tout le code TS/TSX.
- ✅ `expo prebuild` : réussit réellement, génère un `android/` valide.
- ✅ Injection manifeste : le config plugin (`modules/ixin-vpn/plugin/withIxinVpn.js`)
  a été vérifié pour de vrai — il ajoute correctement la déclaration du
  `<service>` `GoBackend.VpnService` dans l'`AndroidManifest.xml` généré.
- ✅ Autolinking Expo : `npx expo-modules-autolinking resolve --platform android`
  détecte réellement le module local `ixin-vpn` et sa classe Kotlin
  `space.xultra.vpn.IxinVpnModule` (nécessite le `package.json` local +
  l'entrée `"ixin-vpn": "./modules/ixin-vpn"` dans les dépendances,
  pour que le lien symbolique dans `node_modules/` existe).
- ⚠️ **Le fichier Kotlin lui-même (`IxinVpnModule.kt`) n'a JAMAIS été
  compilé** dans cet environnement (pas de SDK Android/accès Gradle à
  Maven Central ici) — écrit au mieux de la documentation publique de
  `com.wireguard.android`/de l'Expo Modules API, mais à valider par un
  vrai `./gradlew assembleDebug` (ou directement `eas build`) avant de
  lui faire confiance en production. Même réserve que
  `desktop/src/vpn/platform/win32.js`, jamais testé sur vraie machine
  Windows.
- ⚠️ Aucun test interactif (login, connexion réelle, vérification du
  tunnel sur un vrai téléphone) n'a pu être fait ici — nécessite un
  appareil Android réel, comme pour Windows côté desktop.

## Kill switch

Android n'autorise pas une appli tierce à activer silencieusement le
vrai kill switch système ("Bloquer les connexions sans VPN") sans être
"device owner" — l'écran de connexion propose donc un raccourci vers
`Réglages → VPN`, jamais un faux "activé" côté appli. Voir
`src/screens/ConnectScreen.tsx`.
