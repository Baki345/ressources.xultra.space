# XULTRA Mobile — app native (iOS/Android)

**Statut : socle technique validé (auth de bout en bout), aucune fonctionnalité
X1 portée pour l'instant.**

Base React Native (Expo, TypeScript) pour la vraie application native
iOS/Android de X1 — même philosophie que `desktop/` (Electron) : un seul
socle technique par plateforme, connecté aux **mêmes** Appwrite + routes
`/api/*` du Worker que le site, sans dupliquer la logique métier ni
réécrire le backend.

## Stack

| Couche | Techno | Pourquoi |
|---|---|---|
| Framework | React Native + Expo (TypeScript) | Une seule base de code pour iOS et Android, cohérent avec le choix React déjà fait pour `app/` (web) |
| Backend | Le même Appwrite + Cloudflare Worker que le site — aucun changement | Les routes `/api/*` sont déjà des routes JSON découplées, consommables telles quelles par un client mobile |
| Auth | `react-native-appwrite` (SDK officiel Appwrite pour React Native) | Gestion de session identique au web (email/mot de passe pour l'instant) |
| Tests | Jest (`jest-expo`) + `@testing-library/react-native` | Composants et logique d'auth vérifiés avant tout envoi — même exigence que pour `worker.js` |

## Démarrer

```bash
cd mobile
npm install
npm run typecheck   # tsc --noEmit
npm test            # Jest
npx expo export --platform android   # vérifie que Metro bundle sans erreur (pas besoin d'émulateur)
npx expo export --platform ios       # idem pour iOS
npm start           # serveur de dev Expo (scanner le QR code avec l'app Expo Go pour tester sur un vrai téléphone)
```

Aucun outil natif (Xcode, Android Studio) n'est nécessaire pour développer,
typer, tester ou bundler — seulement pour produire un vrai binaire iOS/APK
installable (voir "Ce qu'il reste" plus bas).

## Ce qui existe déjà

- `src/appwrite.ts` : client Appwrite partagé (même endpoint/projet que
  `worker.js` — ce sont des identifiants publics, pas des secrets).
- `src/AuthContext.tsx` : état d'authentification (session restaurée
  automatiquement au lancement si elle existe déjà, connexion, déconnexion
  qui ne bloque jamais même si la session serveur est déjà expirée).
- `src/screens/LoginScreen.tsx` : écran de connexion email/mot de passe.
- `src/screens/HomeScreen.tsx` : écran minimal une fois connecté — preuve
  que le flux fonctionne de bout en bout, pas encore de vraies
  fonctionnalités X1 (DM, serveurs, appels...).
- Deux "Platforms" Appwrite dédiées (`space.xultra.mobile`, une par OS)
  déclarées côté projet Appwrite — nécessaires pour que le SDK React
  Native soit accepté par l'API.

## Stratégie de portage (même principe que `app/`)

Une section à la fois, jamais tout reconstruit d'un coup : DM/messagerie
d'abord (la fonctionnalité la plus utilisée), puis amis/notifications,
serveurs, appels... Chaque section vérifiée (tests + `expo export` propre)
avant de passer à la suivante.

## Ce qu'il reste avant un vrai lancement

1. **Fonctionnalités** : toute la logique X1 au-delà de la connexion (DM,
   serveurs, appels, notifications push...).
2. **Comptes développeur** : Apple Developer Program (99 $ US/an) pour
   l'App Store, compte Google Play Console (25 $ US une fois) pour le
   Play Store — aucun des deux n'existe encore pour X1.
3. **Build de production** : ni Xcode ni le SDK Android complet ne sont
   disponibles dans cet environnement — un vrai `.ipa`/`.apk` installable
   nécessite soit un Mac + Android Studio en local, soit le service
   [EAS Build](https://docs.expo.dev/build/introduction/) d'Expo (cloud,
   gère les deux plateformes sans matériel local, y compris la signature).
4. **Notifications push** : nécessite les identifiants Apple Push
   Notification service (APNs) et Firebase Cloud Messaging (Android),
   aucun des deux configuré pour l'instant.
5. **Icône/splash screen** : les icônes par défaut d'Expo sont encore en
   place (`assets/`), à remplacer par celles de X1.
