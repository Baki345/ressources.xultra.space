# XULTRA Mobile — app native (iOS/Android)

**Statut : auth de bout en bout, DM 1:1 et de groupe chiffrés de bout en
bout (E2E, texte ET pièces jointes, + appel vocal pour un groupe),
fiche de profil, gestion des amis (dont bloquer/débloquer), notifications
(en direct dans l'app ET en push mobile) et serveurs (salons
texte/annonces/forum/vocaux/scène) — premières fonctionnalités X1 portées.
Appel 1:1 à venir.**

⚠️ **Depuis les salons vocaux (LiveKit), l'app ne tourne plus sous Expo
Go** — voir "Démarrer" ci-dessous : une vraie build de développement EAS
est requise pour un test sur appareil réel ou simulateur. `typecheck`/
`test`/`expo export` restent inchangés (aucun de ces trois n'exécute de
code natif).

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
| Vocal | `@livekit/react-native` (même SFU LiveKit auto-hébergé que le site) | Salons vocaux de serveur — seule brique du projet nécessitant du code natif (WebRTC), donc une build de développement EAS plutôt qu'Expo Go |
| Tests | Jest (`jest-expo`) + `@testing-library/react-native` | Composants et logique d'auth vérifiés avant tout envoi — même exigence que pour `worker.js` |

## Démarrer

```bash
cd mobile
npm install
npm run typecheck   # tsc --noEmit
npm test            # Jest
npx expo export --platform android   # vérifie que Metro bundle sans erreur (pas besoin d'émulateur)
npx expo export --platform ios       # idem pour iOS
```

Ces quatre commandes ne nécessitent toujours aucun outil natif (Xcode,
Android Studio) — elles n'exécutent jamais le code natif LiveKit, seulement
du JS (bundlé ou typé/testé avec des mocks, voir
`__mocks__/@livekit/react-native.tsx`).

**Tester sur un appareil réel ou un simulateur, en revanche, ne passe plus
par `npm start` + Expo Go** depuis l'ajout des salons vocaux
(`@livekit/react-native` embarque du code natif WebRTC, qu'Expo Go ne peut
pas charger) :

```bash
npx eas build --profile development --platform android   # ou ios
# une fois la build installée sur l'appareil/simulateur :
npx expo start --dev-client
```

Nécessite un compte Expo/EAS (gratuit) — voir
[EAS Build](https://docs.expo.dev/build/introduction/). Une fois la build de
développement installée, elle reste valable pour tout le reste du
développement (Fast Refresh fonctionne normalement) ; seule une build
de PRODUCTION (voir "Ce qu'il reste" plus bas) nécessite de repasser par
EAS.

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
  - **Appel vocal de groupe** (`src/dmCalls.ts` + `DmGroupCallScreen.tsx`,
    bouton 🎙️ dans l'en-tête d'un DM de groupe) : architecture identique
    aux salons vocaux de serveur (`src/voice.ts`, même jeton LiveKit, même
    schéma de présence/heartbeat/abandon après 2 min) — seules la room
    (`xu-dm-<dmId>`) et la collection de présence (`group_call_presence`)
    changent, voir `/api/call/group-token`/`/api/call/group-presence/join`
    côté `worker.js`. Réservé aux DM de groupe : un DM 1:1 utilise côté
    web une architecture entièrement différente (WebRTC brut pair-à-pair
    avec sonnerie/accepter/refuser via `direct_calls`, jamais LiveKit) —
    hors scope pour l'instant, voir "Ce qu'il reste" plus bas.
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
  ANNONCES, FORUM (texte simple, pas de pièces jointes), VOCAUX et de
  SCÈNE (audio seul, pas de caméra/partage d'écran). Nouvel onglet
  "🗂️ Serveurs" à côté de "Messages".
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
  - **Salons vocaux** (`src/voice.ts` + `ServerVoiceScreen.tsx`, 🔊) :
    connexion réelle au SFU LiveKit auto-hébergé de X1 via
    `@livekit/react-native` (audio seul — pas de caméra/partage d'écran).
    Rejoindre un salon 🔊 dans la liste des salons s'y connecte
    immédiatement : jeton LiveKit (`/api/servers/voice-token`), création
    d'un document de présence (`/api/servers/channels/voice-presence/join`,
    lu ensuite en direct via Appwrite pour afficher qui est connecté —
    présences non rafraîchies depuis plus de 2 min traitées comme
    abandonnées, comme côté web), heartbeat toutes les 60s tant qu'on reste
    connecté. Quitter (bouton, ou perte de connexion) supprime le document
    de présence et coupe la session audio (`AudioSession.stopAudioSession`)
    — un seul chemin de sortie (`onDisconnected` de `<LiveKitRoom>`), que
    le départ soit volontaire ou subi. **Nécessite une vraie build de
    développement EAS** (voir "Démarrer" plus haut) : `@livekit/react-native`
    embarque du code natif WebRTC absent d'Expo Go — `registerGlobals()`
    (obligatoire avant tout usage du SDK) est appelé une fois dans
    `index.ts`. Simplification assumée : la liste des participants vient
    des documents de présence Appwrite (comme le fait déjà le web pour
    afficher qui est connecté sans avoir rejoint soi-même), pas des
    participants LiveKit en temps réel — pas d'indicateur "qui parle en ce
    moment" ni de caméra/main levée pour les autres, juste soi-même
    (micro) pour cette première version.
  - **Salons de scène** (`src/stage.ts`, 🎙️, même `ServerVoiceScreen.tsx`
    que les salons vocaux — un salon de scène n'est qu'une variante avec
    deux rôles) : sujet affiché en haut, liste des orateurs, section
    "Demandes de parole" réservée à la modération
    (`/api/servers/stage/*` côté worker.js — qui peut gérer le vocal du
    serveur), bouton "🖐️ Demander la parole"/"✋ Annuler ma demande" pour
    le public, "Descendre"/"Retirer" pour quitter la scène (soi-même
    toujours permis, retirer quelqu'un d'autre réservé à la modération).
    Point important : le droit de publier son micro est figé dans le
    jeton LiveKit au moment de la connexion (`canPublish`, voir
    `src/voice.ts`) — être approuvé comme orateur PENDANT que je suis
    déjà connecté ne me donne donc rien tant que je n'ai pas un jeton
    frais. `ServerVoiceScreen.tsx` sonde `/api/servers/stage/state`
    toutes les 5s et RECONNECTE ENTIÈREMENT (nouveau jeton, donc nouveau
    `canPublish`) dès que mon statut orateur change, exactement comme le
    fait le site (`leaveGroupCall()` puis `joinVoiceRoom()` dans
    `loadStageChannel()`) — un sondage plutôt qu'un abonnement Appwrite
    Realtime (cohérent avec le reste du portage mobile, qui n'utilise le
    temps réel nulle part), avec un garde-fou dédié pour que cette
    reconnexion volontaire ne soit jamais confondue avec un abandon réel
    et ne renvoie jamais par erreur à la liste des salons.
- Deux "Platforms" Appwrite dédiées (`space.xultra.mobile`, une par OS)
  déclarées côté projet Appwrite — nécessaires pour que le SDK React
  Native soit accepté par l'API.
- **Notifications push mobiles** (`src/pushNotifications.ts`) : équivalent
  Expo du Web Push (VAPID) déjà utilisé côté site — mais un jeton par
  installation (`ExponentPushToken[...]`) plutôt qu'un abonnement
  navigateur, relayé par Expo (https://exp.host) plutôt que signé nous-même.
  Enregistrement best-effort juste après connexion (`AuthContext.tsx`,
  jamais bloquant : simulateur, permission refusée, pas de projet EAS
  configuré → simplement pas de push, comme le reste de l'E2E côté auth) ;
  désenregistrement à la déconnexion pour qu'un appareil partagé n'écoute
  pas les push d'un compte dont on vient de sortir. Côté `worker.js`,
  `pushToUidExpo()` tourne en parallèle de `pushToUidWebPush()` dans
  `pushToUid()` — **aucune route appelante n'a besoin de changer** (message,
  mention, demande d'ami, ticket support escaladé... tout ce qui appelait
  déjà `pushToUid()` pousse maintenant aussi vers mobile), stockage dans une
  collection dédiée `expo_push_tokens` (jamais mélangée à `push_subs`, qui
  reste au format abonnement navigateur). Nouvelles routes
  `/api/push/expo/register` et `/api/push/expo/unregister`, mêmes
  permissions par document que `push_subs` (lecture/écriture/suppression
  réservées à l'utilisateur propriétaire). **Ce qui manque encore pour que
  ça marche en vrai : voir "Ce qu'il reste", point 4 — nécessite ta
  participation** (comptes Firebase/Apple + déploiement).

## Stratégie de portage (même principe que `app/`)

Une section à la fois, jamais tout reconstruit d'un coup : DM 1:1 d'abord
(la fonctionnalité la plus utilisée), puis DM de groupe, fiche de profil,
amis et notifications, puis serveurs (fait, y compris forum, vocal et
scène) et l'appel vocal de groupe en DM (fait). Chaque section vérifiée
(tests + `expo export` propre, plus une vraie build de développement EAS
pour tout ce qui touche à LiveKit) avant de passer à la suivante.

## Ce qu'il reste avant un vrai lancement

1. **Fonctionnalités** : appel DM 1:1 — architecture différente et
   nettement plus lourde côté web que tout ce qui a été porté jusqu'ici :
   WebRTC brut pair-à-pair avec sonnerie/accepter/refuser via la
   collection `direct_calls`, jamais LiveKit (contrairement aux salons
   vocaux/scène de serveur et à l'appel de groupe en DM, tous les trois
   déjà en place) — un chantier à part entière, pas une extension de ce
   qui existe déjà.
2. **Comptes développeur** : Apple Developer Program (99 $ US/an) pour
   l'App Store, compte Google Play Console (25 $ US une fois) pour le
   Play Store — aucun des deux n'existe encore pour X1.
3. **Build de production** : ni Xcode ni le SDK Android complet ne sont
   disponibles dans cet environnement — un vrai `.ipa`/`.apk` installable
   nécessite soit un Mac + Android Studio en local, soit le service
   [EAS Build](https://docs.expo.dev/build/introduction/) d'Expo (cloud,
   gère les deux plateformes sans matériel local, y compris la signature).
4. **Notifications push : le code est fait des deux côtés (app +
   `worker.js`), il manque uniquement de la configuration qui ne peut se
   faire qu'avec TES comptes.** Sans ça, `registerForPushNotificationsAsync()`
   échoue silencieusement (best-effort, voir plus haut) et personne ne
   reçoit rien. Dans l'ordre :
   1. **Lier un projet EAS** (nécessaire de toute façon pour la build de
      développement LiveKit, voir "Démarrer") : `npx eas init` depuis
      `mobile/`, avec un compte Expo (gratuit). Ça écrit un `projectId`
      dans `app.json` sous `extra.eas.projectId` — sans lui,
      `getExpoPushTokenAsync()` s'arrête tout de suite (pas de jeton du
      tout, voir `src/pushNotifications.ts`).
   2. **Android : un projet Firebase** (gratuit) — créer un projet sur
      [console.firebase.google.com](https://console.firebase.google.com),
      y ajouter une app Android avec le `package` de `app.json`
      (`space.xultra.mobile`), puis générer une clé de compte de service
      Firebase Cloud Messaging **V1** (Paramètres du projet → Comptes de
      service → Générer une nouvelle clé privée, fichier JSON). Donne ce
      JSON à EAS avec `npx eas credentials` (menu Android → Push
      Notifications: Manage FCM V1) — EAS le stocke pour signer les push
      Android à ta place, rien à coder de plus.
   3. **iOS : un compte Apple Developer Program** (99 $ US/an,
      déjà listé au point 2 ci-dessus pour l'App Store — sert aussi ici).
      Une fois le compte actif, `npx eas credentials` (menu iOS → Push
      Notifications) peut générer et gérer la clé APNs automatiquement ;
      pas besoin de le faire à la main dans le portail Apple.
   4. **Créer la collection Appwrite `expo_push_tokens`** (base `xultra`,
      même projet que le reste) — n'existe pas encore, à créer une fois
      dans la console Appwrite comme `push_subs` : attributs `uid`
      (string, requis), `token` (string, requis), `platform` (string,
      optionnel) ; permissions par document gérées par le Worker (voir
      `/api/push/expo/register` dans `worker.js`), donc pas de permission
      de collection particulière à poser à part la lecture/écriture pour
      la clé API standard (déjà le cas pour toutes les autres collections).
   5. **Déployer le `worker.js` modifié** sur le Worker Cloudflare
      (`ultravoc`) — les routes `/api/push/expo/register`/`unregister` et
      l'extension de `pushToUid()` ne prennent effet qu'après déploiement ;
      je peux le faire dès que tu confirmes (j'ai les identifiants
      nécessaires), ou tu peux le faire toi-même si tu as déjà un pipeline
      de déploiement en place.
   Une fois ces cinq étapes faites, rebuild l'app avec
   `npx eas build --profile development` (le `projectId`/les credentials
   sont repris automatiquement) — aucun changement de code mobile
   supplémentaire n'est nécessaire.
5. **Icône/splash screen** : les icônes par défaut d'Expo sont encore en
   place (`assets/`), à remplacer par celles de X1.
