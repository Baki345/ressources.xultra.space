# XULTRA Mobile — app native (iOS/Android)

**Statut : auth de bout en bout + DM 1:1 chiffrés de bout en bout (E2E) —
première fonctionnalité X1 portée. Groupes, appels, serveurs... à venir.**

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

- `src/appwrite.ts` : client Appwrite partagé (même endpoint/projet/base que
  `worker.js` — ce sont des identifiants publics, pas des secrets).
- `src/AuthContext.tsx` : état d'authentification (session restaurée
  automatiquement au lancement si elle existe déjà, connexion, déconnexion
  qui ne bloque jamais même si la session serveur est déjà expirée) — et
  garantit une clé E2E locale (génération/restauration) dès qu'un utilisateur
  est authentifié.
- `src/screens/LoginScreen.tsx` : écran de connexion email/mot de passe.
- `src/e2e.ts` : portage pur JS (`@noble/curves` + `@noble/hashes` +
  `@noble/ciphers`, sans module natif) du schéma E2E du site — ECDH P-256 +
  HKDF-SHA256 + AES-256-GCM, sauvegarde de la clé privée chiffrée par mot de
  passe (PBKDF2 100k itérations) dans `e2e_keys`. Compatibilité bit-à-bit
  avec l'implémentation Web Crypto du site validée dans les deux sens (voir
  `src/__tests__/e2e.test.ts`, vecteurs générés par le vrai Web Crypto API de
  Node). La clé privée ne quitte jamais l'appareil : stockée uniquement dans
  `expo-secure-store` (Keychain/Keystore), jamais envoyée en clair au
  serveur — même invariant que le `localStorage` du site.
- `src/api.ts` : appels authentifiés (JWT Appwrite) aux routes `/api/*` du
  Worker — l'envoi d'un message DM passe toujours par
  `/api/dms/messages/send` (validation serveur : appartenance au thread,
  permissions, notifications), jamais une écriture directe dans
  `dms_messages`.
- `src/dms.ts` + `src/screens/DmListScreen.tsx` /
  `src/screens/DmConversationScreen.tsx` : **DM 1:1 chiffrés de bout en
  bout**, premier vrai morceau de X1 porté — liste des conversations
  (aperçu déchiffré, nom du contact résolu via `users`), fil de discussion,
  envoi de texte. Les DM de groupe (déchiffrement par clé de message
  enveloppée par membre, voir `e2eGetMessageKeyContext` dans `worker.js`) ne
  sont pas encore portés : un fil de groupe s'affiche dans la liste mais son
  contenu reste marqué illisible plutôt que de planter.
- Deux "Platforms" Appwrite dédiées (`space.xultra.mobile`, une par OS)
  déclarées côté projet Appwrite — nécessaires pour que le SDK React
  Native soit accepté par l'API.

## Stratégie de portage (même principe que `app/`)

Une section à la fois, jamais tout reconstruit d'un coup : DM/messagerie
d'abord (la fonctionnalité la plus utilisée, fait), puis DM de groupe,
amis/notifications, serveurs, appels... Chaque section vérifiée (tests +
`expo export` propre) avant de passer à la suivante.

## Ce qu'il reste avant un vrai lancement

1. **Fonctionnalités** : DM de groupe, pièces jointes chiffrées (images/
   fichiers — les primitives `encryptBytesWithKey`/`decryptBytesWithKey`
   existent déjà dans `src/e2e.ts`, pas encore branchées à une UI), amis/
   notifications, serveurs, appels, notifications push.
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
