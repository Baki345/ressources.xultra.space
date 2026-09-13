# XULTRA Mobile — app native (iOS/Android)

**Statut : auth de bout en bout, DM 1:1 et de groupe chiffrés de bout en
bout (E2E, texte ET pièces jointes), fiche de profil, gestion des amis
(dont bloquer/débloquer), notifications et serveurs (salons
texte/annonces/forum) — premières fonctionnalités X1 portées. Salons
vocaux, appels, notifications push... à venir.**

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
  `src/screens/DmConversationScreen.tsx` : **DM 1:1 ET de groupe, chiffrés
  de bout en bout** — liste des conversations (aperçu déchiffré, nom du
  contact résolu via `users`), fil de discussion, envoi de texte. Un
  message de groupe utilise une clé éphémère enveloppée pour chaque membre
  (voir `generateGroupMessageKey`/`wrapGroupMessageKeyForMember` dans
  `src/e2e.ts`, même schéma que `e2eGetMessageKeyContext` dans
  `worker.js`) — jamais une clé de groupe statique partagée en clair. Le
  nom de l'expéditeur s'affiche au-dessus des messages reçus dans un
  groupe.
  - **Pièces jointes chiffrées (photos/fichiers)** : bouton 📎 dans le
    composeur, choix "Photo" (`expo-image-picker`, avec la légende tapée
    dans le composeur comme texte du message) ou "Fichier" (sélecteur
    natif intégré à `expo-file-system` — `File.pickFileAsync()`, aucune
    dépendance supplémentaire). Les octets sont chiffrés AES-GCM avec
    EXACTEMENT la même clé de message que le texte qui les accompagne
    (`sendDmAttachment`/`resolveOutgoingMessageKey` dans `src/dms.ts` —
    une seule clé par envoi, jamais une pour le texte et une autre pour le
    fichier), écrits dans un fichier temporaire (le SDK Appwrite React
    Native lit les fichiers par URI, jamais par Blob comme le SDK web),
    puis uploadés dans le bucket `ultravoc_media` (même bucket que le
    site) en lecture publique — la confidentialité vient du chiffrement,
    jamais d'une permission Appwrite restreinte. À la réception, une image
    est déchiffrée en mémoire et affichée directement (data URI, voir
    `decryptDmMessageForDisplay`) ; un fichier générique est déchiffré
    dans le cache local puis proposé via la feuille de partage système
    (`expo-sharing`) pour l'ouvrir ou l'enregistrer. Palier de taille
    actuel : 10 Mo (X1+ n'est pas encore branché côté mobile, contrairement
    au site).
- `src/profile.ts` + `src/screens/ProfileScreen.tsx` : fiche de profil
  (bannière, avatar, présence réelle, bio, badges, membre depuis) avec un
  vrai bouton "Ami" (➕ Ajouter / 📨 En attente / ✅ Accepter sa demande /
  ✅ Ami, selon la relation), accessible en tapant le nom du contact dans
  l'en-tête d'une conversation 1:1.
- `src/friends.ts` + `src/screens/FriendsScreen.tsx` : demandes d'ami
  (envoyer, accepter, refuser), liste d'amis (retirer), recherche par
  pseudo — port de `ultravoc_friends` (voir `sendFriendRequest`/
  `acceptFriendRequest`/... dans `worker.js`). Simplification assumée :
  les cas de double-demande simultanée (A et B s'envoient une demande au
  même instant) ne sont pas dédupliqués aussi agressivement que côté web ;
  le pire résultat possible reste deux documents "accepted" redondants,
  jamais une relation cassée.
  - **Bloquer/débloquer un membre** : bouton ⛔ Bloquer / ✅ Débloquer sur
    la fiche de profil (`ProfileScreen`, masqué sur son propre profil),
    avec confirmation avant blocage ("Tu ne recevras plus ses messages.")
    mais déblocage immédiat — même dissymétrie que côté web
    (`confirmBlockUser`/`unblockUser` dans `worker.js`). Une section
    "Utilisateurs bloqués" dans l'onglet Amis liste les comptes bloqués
    avec un bouton Débloquer, équivalent mobile de `renderSetBlocked()`
    côté web. Aucune logique d'application du blocage à porter ici : les
    routes Worker déjà utilisées par l'envoi de DM (`isBlockedPair` dans
    `worker.js`) refusent déjà les messages entre comptes bloqués, dans
    les deux sens.
- `src/notifications.ts` + `src/screens/NotificationsScreen.tsx` : flux de
  notifications génériques (ami accepté/retiré, badge obtenu, commentaire
  XBin, palier musique...) — port de la collection `notifications` (voir
  `loadNotifications`/`renderNotifications`/`openNotificationsPanel` dans
  `worker.js`). Les demandes d'ami en sont exclues : elles ont déjà leur
  propre section dans l'onglet Amis, exactement comme côté web (sinon la
  même demande apparaîtrait deux fois). Tout est marqué lu à l'ouverture de
  l'écran ; taper une entrée avec un `fromUid` ouvre le profil concerné —
  les autres (badge, XBin, musique...) restent lisibles mais pas encore
  cliquables vers un écran dédié, ces fonctionnalités n'étant pas encore
  portées sur mobile. Nouvel onglet "🔔 Notifs" à côté de "Messages"/"Amis".
- `src/servers.ts` + `src/screens/ServersScreen.tsx` /
  `ServerChannelsScreen.tsx` / `ServerChannelScreen.tsx` : **serveurs,
  salons texte/annonces** — liste de mes serveurs (lecture directe
  `server_members`/`servers`, comme `loadMyServers()` côté web), liste des
  salons visibles d'un serveur et fil de discussion d'un salon, envoi de
  texte simple. Contrairement aux DM, les salons de serveur ne sont **pas**
  chiffrés de bout en bout (voir `/api/servers/channels/messages/send`
  côté `worker.js`), donc aucune couche E2E ici. Toute la logique de
  permissions (qui a le droit de VOIR un salon — rôles, overwrites,
  timeout...) reste calculée côté Worker via les routes
  `/api/servers/channels/*`, jamais dupliquée côté mobile. Portée
  volontairement limitée à cette première version : salons TEXTE,
  ANNONCES et FORUM (texte simple, pas de pièces jointes) — vocal/scène
  (LiveKit) restent hors scope. Nouvel onglet "🗂️ Serveurs" à côté de
  "Messages".
  - **Salons forum** (`ServerForumScreen.tsx`) : liste des posts d'un
    salon 📋 (les plus récents en premier), bouton "+ Post" pour en publier
    un nouveau (titre + corps). Un post de forum EST un fil côté worker.js
    (§30, collection `server_threads`, pas de collection dédiée) — ouvrir
    un post réutilise donc entièrement `ServerChannelScreen` (même
    composant que pour un salon texte) en lui passant le fil concerné via
    sa prop `thread`, plutôt que d'écrire un écran de fil séparé :
    `loadChannelMessages`/`sendChannelText` (dans `src/servers.ts`)
    acceptent un `threadId` optionnel qui les scope à CE post précis pour
    la lecture des réponses et la publication d'une réponse. Simplification
    assumée : le corps du post s'affiche comme un message normal dans le
    fil (premier de la liste) plutôt que dans un bandeau séparé façon
    Discord — suffisant pour une première version.
- Deux "Platforms" Appwrite dédiées (`space.xultra.mobile`, une par OS)
  déclarées côté projet Appwrite — nécessaires pour que le SDK React
  Native soit accepté par l'API.

## Stratégie de portage (même principe que `app/`)

Une section à la fois, jamais tout reconstruit d'un coup : DM 1:1 d'abord
(la fonctionnalité la plus utilisée), puis DM de groupe, fiche de profil,
amis et notifications, puis serveurs (fait, y compris forum), puis
appels... Chaque section vérifiée (tests + `expo export` propre) avant de
passer à la suivante.

## Ce qu'il reste avant un vrai lancement

1. **Fonctionnalités** : salons vocaux/scène de serveur (LiveKit — nécessite
   un client natif WebRTC, donc un build de développement personnalisé via
   EAS, incompatible avec le flux 100% Expo Go suivi jusqu'ici), appels,
   notifications push.
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
