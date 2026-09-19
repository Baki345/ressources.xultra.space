# Bot IXin — voix (musique YouTube + enregistrement) + auto-mod

Étend le [kit de démarrage officiel](https://xultra.space) (`bot-x1.js`) avec
une vraie connexion vocale [LiveKit](https://livekit.io) (`@livekit/rtc-node`) :
le bot peut rejoindre un salon vocal de serveur ou un appel de groupe en DM,
y jouer de l'audio YouTube, et enregistrer les personnes qui parlent (un
fichier `.wav` par personne) — plus un socle de modération (filtre de mots,
anti-liens, anti-spam, sanctions, casier, logs).

C'est un **process externe** — IXin (Cloudflare Worker) ne peut pas tenir une
connexion vocale persistante lui-même, voir le portail développeur (Mes bots
→ docs). Ce dossier tourne sur **ton propre VPS**, jamais sur l'infra IXin.

## Pourquoi ça ne peut pas tourner "dans IXin"

- IXin fournit uniquement l'**accès** au salon vocal (un jeton LiveKit via
  `/api/bot/v1/voice/token` ou `/dm-token`) — jamais de traitement audio
  (lecture, mixage, enregistrement, reconnaissance vocale). C'est le bot
  (ce projet) qui héberge toute cette logique, avec le SDK serveur LiveKit.
- La lecture YouTube (extraction audio) et l'enregistrement (écriture des
  pistes sur disque) n'existent nulle part côté IXin — ce projet les implémente
  lui-même avec `yt-dlp` + `ffmpeg` + `@livekit/rtc-node`.

## Prérequis sur le VPS

- **Node.js 18+** (`node -v`)
- **ffmpeg** — `apt install ffmpeg` (Debian/Ubuntu)
- **yt-dlp** — `pip install -U yt-dlp`, ou le binaire officiel
  (`sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod +x /usr/local/bin/yt-dlp`)
- Une URL HTTPS publique vers ce process (tunnel type `cloudflared`/`ngrok`
  pour tester, ou VPS + reverse proxy comme dans le portail dev)

`@livekit/rtc-node` embarque un binaire natif (FFI) téléchargé à
l'installation (`npm install`) — nécessite une sortie réseau normale sur le
VPS, ce qui n'a rien à voir avec les restrictions du bac à sable où ce code
a été écrit.

## Installation

```bash
# sur le VPS, dans le dossier où tu as copié bot-voice/
npm install
cp .env.example .env
```

Édite `.env` :

```
BOT_TOKEN=x1bot_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   # "Bot Vocal" → Mes bots → copier le token
PORT=3000
```

(`X1_BASE_URL`, `LIVEKIT_WS_URL`, `RECORDINGS_DIR`, `YTDLP_PATH`,
`FFMPEG_PATH` ont déjà de bonnes valeurs par défaut — à ne changer que si
besoin.)

## Lancer avec pm2 (24/7)

```bash
npm i -g pm2
pm2 start bot.js --name bot-voice
pm2 save && pm2 startup
```

Puis un reverse proxy HTTPS (Caddy s'occupe seul du certificat) :

```
mon-bot.exemple.com {
  reverse_proxy localhost:3000
}
```

## Configurer le bot sur IXin

1. **Mes bots** → "Bot Vocal" → colle `https://mon-bot.exemple.com/interactions`
   dans "URL d'interactions" **et** dans "URL d'événements" (coche
   `message_create` pour l'auto-mod et `member_join` pour le message de
   bienvenue, voir plus bas).
2. **✏️ Modifier les commandes** → déclare exactement ces commandes (le code
   dans `bot.js` répond précisément à ces noms/options) :

   | Commande | Options | Rôle |
   |---|---|---|
   | `join` | `salon` (texte) | Rejoint un salon vocal du serveur |
   | `leave` | `salon` (texte) | Quitte le vocal (arrête aussi un enregistrement en cours) |
   | `play` | `requete` (texte, requis), `salon` (texte) | URL YouTube ou recherche libre |
   | `skip` | `salon` (texte) | Passe au morceau suivant de la file |
   | `stop` | `salon` (texte) | Vide la file et arrête la lecture |
   | `queue` | `salon` (texte) | Liste les morceaux en attente |
   | `record` | `action` (texte, requis, choix : `start` / `stop`), `salon` (texte) | Démarre/arrête l'enregistrement |
   | `sanction` | `type` (texte, requis, choix : `warn`/`mute`/`kick`/`ban`/`unban`), `membre` (texte, requis), `raison` (texte), `minutes` (texte, pour `mute`) | Applique une sanction |
   | `casier` | `membre` (texte, requis) | Historique des sanctions d'un membre |
   | `automod` | `action` (texte, choix : `on`/`off`/`liens-on`/`liens-off`/`status`) | Active/désactive l'auto-mod, ou affiche son état |
   | `automod-word` | `action` (texte, requis, choix : `add`/`remove`), `mot` (texte, requis) | Ajoute/retire un mot filtré |
   | `modlogs` | `action` (texte, choix : `set`/`disable`) | Fait de CE salon la destination des logs de modération (ou coupe les logs) |
   | `reaction-role` | `role` (texte, requis), `label` (texte) | Poste un message avec un bouton "obtenir ce rôle" |
   | `bienvenue` | `action` (texte, choix : `set`/`off`), `texte` (texte, avec `{membre}`) | Message automatique posté dans CE salon à chaque arrivée |
   | `economie` | `action` (texte, requis, choix : `profil`/`classement`/`daily`), `membre` (texte, pour `profil`), `type` (texte, choix : `xp`/`argent`, pour `classement`) | Niveaux XP + monnaie virtuelle |
   | `ticket-config` | `role` (texte, requis) | Rôle staff qui verra tous les tickets ouverts |
   | `ticket` | `sujet` (texte) | Ouvre un salon de ticket privé (toi + le staff) |
   | `ticket-close` | — (se tape dans le salon du ticket) | Ferme et supprime le ticket courant |
   | `autorole` | `action` (texte, choix : `off`), `role` (texte) | Rôle attribué automatiquement à chaque arrivée |
   | `customcmd-add` | `nom` (texte, requis), `reponse` (texte, requis) | Ajoute une commande personnalisée `!nom` |
   | `customcmd-remove` | `nom` (texte, requis) | Retire une commande personnalisée |
   | `customcmd-list` | — | Liste les commandes personnalisées du serveur |
   | `niveau-role` | `action` (texte, requis, choix : `set`/`remove`/`list`), `niveau` (texte), `role` (texte) | Rôle attribué automatiquement à un niveau XP donné |
   | `giveaway-start` | `prix` (texte, requis), `duree` (texte, requis, en minutes), `gagnants` (texte) | Lance un giveaway avec bouton "Participer" |
   | `giveaway-end` | — (se tape dans le salon du giveaway) | Termine le giveaway et tire les gagnants immédiatement |

   25 commandes sur 50 possibles. Au-delà, il faut soit en retirer une, soit
   en fusionner (comme `economie` fusionne déjà 3 actions en une seule
   commande) — les commandes personnalisées (`!nom`, voir plus bas) ne
   comptent elles jamais dans ce total puisqu'elles ne sont pas déclarées
   comme de vraies commandes /slash.

   **Important** : un salon vocal n'a pas sa propre zone de saisie sur IXin —
   toute commande se tape depuis un salon **texte** du serveur, jamais depuis
   le salon vocal lui-même. C'est pour ça que `salon` existe sur les
   commandes de voix : c'est ainsi que le bot sait quel salon vocal tu vises
   (voir "Commandes disponibles" ci-dessous pour quand `salon` peut être
   omis). Les commandes de modération, elles, n'en ont pas besoin — elles
   s'appliquent toujours au serveur entier.

3. Pour la voix : le bot doit être installé sur le serveur voulu avec
   **🎙️ Rejoindre les salons vocaux** coché (ou invité dans un DM de groupe
   existant). Pour la modération : coche les permissions correspondantes à
   l'installation (`moderate_members` pour mute/auto-mod, `kick_members`,
   `ban_members`) — le bot ne peut jamais recevoir plus que ce que la
   personne qui l'installe détient elle-même.
4. Depuis n'importe quel salon **texte** du serveur, tape `/join salon:Lounge 1`
   (remplace par le nom réel du salon vocal).

## Commandes disponibles

Sur un **serveur**, `salon` (le nom du salon vocal, ex. `Lounge 1`) est requis
sur `/join` — le tout premier appel, puisqu'aucune session n'existe encore —
et optionnel sur les autres commandes : s'il n'y a qu'un seul salon vocal
actif sur ce serveur, elles s'appliquent à celui-là automatiquement. Dans un
**DM de groupe**, `salon` est ignoré : il n'y a qu'une seule conversation
possible, pas d'ambiguïté.

- `/join salon:<nom>` — connexion silencieuse (utile avant `/record start`
  si tu veux enregistrer sans jouer de musique).
- `/play requete:<url ou recherche> salon:<nom>` — ajoute à la file ; démarre
  tout de suite si rien ne joue.
- `/skip`, `/stop`, `/queue` (+ `salon:<nom>` si plusieurs salons actifs)
- `/record action:start` — poste d'abord une annonce visible **🔴
  Enregistrement démarré** dans le salon/DM (consentement : tout le monde
  voit que ça enregistre), puis écrit un `.wav` par personne qui parle dans
  `RECORDINGS_DIR` (par défaut `./recordings/<horodatage>/<nom>.wav`).
- `/record action:stop` — finalise les fichiers et poste le chemin de
  chacun. Pas d'upload automatique : les fichiers restent sur ton VPS, à toi
  de les récupérer (`scp`, etc.) — le bot n'a pas d'API d'envoi de fichier.

**Rejoindre un DM avec un ami, juste toi/lui/le bot** : un DM strict à 2
personnes reste un mur technique dur — c'est du WebRTC pair-à-pair direct
entre deux navigateurs, aucune "room" serveur qu'un bot pourrait rejoindre.
La solution : crée un **groupe** (bouton "Groupe+" dans Messages) avec ton
ami **et** ton bot comme 3ᵉ membre — la modale liste maintenant aussi tes
bots aux côtés de tes amis. Un groupe (3+ membres) tourne déjà sur LiveKit
comme un vrai salon de serveur, donc `/join` y fonctionne normalement.

## Modération

Tout est stocké dans un fichier JSON par serveur (`data/servers/<id>.json` —
aucune base de données, IXin n'en fournit pas au bot) : config auto-mod,
casier de sanctions, et un annuaire pseudo→uid appris au fil des messages
reçus (IXin n'a pas de route bot pour chercher un membre par pseudo — le bot
apprend donc lui-même "qui est qui" à partir des événements `message_create`
qu'il reçoit).

- `/automod action:on` / `action:off` — active/désactive tout l'auto-mod.
- `/automod-word action:add mot:<mot>` / `action:remove mot:<mot>` — gère la
  liste de mots filtrés (recherche en mot entier, insensible à la casse).
- `/automod action:liens-on` / `action:liens-off` — bloque tout lien
  `http(s)://` non listé dans `linkAllowlist` (à éditer directement dans le
  fichier JSON du serveur pour l'instant, pas encore de commande dédiée).
- **Anti-spam** : intégré, pas de commande — 5 messages en 5 secondes par
  personne déclenche l'action, sans configuration.
- Une violation détectée = le message est supprimé
  (`/api/bot/v1/moderation/delete-message`) + une note est postée dans le
  salon + une entrée "automod" est ajoutée au casier de l'auteur.
- `/sanction type:warn membre:<pseudo> raison:<texte>` — un avertissement
  n'a pas d'équivalent côté IXin (aucun concept natif) : uniquement suivi par
  ce bot, dans le casier.
- `/sanction type:mute membre:<pseudo> minutes:10 raison:<texte>` — timeout
  réel côté IXin (nécessite la permission `moderate_members` accordée au bot).
- `/sanction type:kick|ban|unban membre:<pseudo> raison:<texte>` — nécessite
  `kick_members`/`ban_members`.
- `/casier membre:<pseudo>` — historique complet (avertissements + sanctions
  réelles + auto-mod) pour cette personne sur ce serveur.
- `/modlogs` (tapée dans le salon voulu) — chaque sanction (manuelle ou
  auto-mod) est ensuite postée là sous forme d'embed. `/modlogs action:disable`
  coupe les logs.
- `membre:` accepte un pseudo **seulement si le bot l'a déjà vu écrire** au
  moins un message depuis son démarrage (c'est comme ça qu'il apprend
  pseudo→uid) — sinon, donne directement l'uid IXin de la personne.

## Rôles & bienvenue

- `/reaction-role role:Membre label:"Je veux ce rôle"` — poste la réponse de
  la commande elle-même (visible par tout le monde) avec un bouton. Cliquer
  dessus attribue le rôle nommé au clic. Nécessite la permission
  `manage_roles` accordée au bot à l'installation. **Le bouton ajoute
  seulement le rôle** — pour le retirer, un modérateur doit encore le faire
  à la main (pas de bascule automatique pour l'instant).
- `/bienvenue action:set texte:"Bienvenue {membre} !"` (tapée dans le salon
  voulu) — à chaque arrivée sur le serveur (`member_join`), poste ce message
  dans ce salon, `{membre}` remplacé par le pseudo. `/bienvenue action:off`
  désactive.
- `/autorole role:Membre` — attribue automatiquement ce rôle à chaque
  nouvelle arrivée (façon Dyno "autorole"), en plus du message de bienvenue
  s'il est configuré. `/autorole action:off` désactive. Nécessite
  `manage_roles`.

## Commandes personnalisées

Façon MEE6 : réponses automatiques déclenchées par un texte préfixé `!`,
jamais de vraies commandes `/slash` — ça ne coûte donc rien sur le quota de
50 commandes déclarées par bot, et une commande personnalisée est active
immédiatement, sans repasser par "✏️ Modifier les commandes".

- `/customcmd-add nom:regles reponse:"Lis le salon #règles avant de poster !"`
  — quiconque tape `!regles` dans un salon reçoit cette réponse.
  `{membre}` dans la réponse est remplacé par le pseudo de qui a tapé la
  commande.
- `/customcmd-remove nom:regles` — la retire.
- `/customcmd-list` — liste toutes les commandes personnalisées du serveur.
- Le nom ne doit contenir que des minuscules, chiffres, `-` et `_` (mêmes
  règles qu'une vraie commande /slash), sans le `!`.

## Tickets de support

Un **vrai salon privé par ticket** (comme sur Discord), pas un salon partagé
numéroté — visible seulement par son auteur et le rôle staff. Nécessite les
permissions `manage_channels` **et** `manage_roles` accordées au bot à
l'installation.

- `/ticket-config role:Modérateur` — à faire une fois : quel rôle voit tous
  les tickets.
- `/ticket sujet:"Mon jeu plante au lancement"` — crée un salon
  `ticket-<numéro>`, poste le sujet dedans, et prévient dans le salon où la
  commande a été tapée.
- `/ticket-close` — tapée **dans le salon du ticket lui-même** (il a une
  zone de saisie normale, c'est un salon texte comme un autre) : ferme et
  supprime définitivement le salon.

**Comment la confidentialité est obtenue** — IXin ne connaît la visibilité
d'un salon *que* par rôle, jamais par utilisateur individuel. Ouvrir un
ticket crée donc un **rôle jetable** (`ticket-<numéro>`, sans aucune
permission, jamais mentionnable), l'attribue à l'auteur, puis crée le salon
avec `visibleRoleIds: [rôleStaff, rôleJetable]`. Fermer le ticket supprime
le salon puis ce rôle jetable — rien ne traîne. Exception : le
**propriétaire du serveur** ne peut jamais recevoir de rôle d'un bot (IXin le
protège spécifiquement) — sans conséquence puisqu'il voit de toute façon
tous les salons, avec ou sans rôle.

**Limites** : pas de transcription archivée à la fermeture (IXin n'a pas de
route bot pour lire l'historique d'un salon) — les messages sont juste
perdus avec le salon. Pas de formulaire de candidature/recrutement ni de
suggestions avec vote pour l'instant (IXin n'a pas de fenêtre modale pour un
bot, contrairement à Discord).

## Niveaux XP & économie

- **XP texte uniquement** — un message qui passe l'auto-mod (ou l'auto-mod
  désactivé) rapporte 5 à 15 XP, avec 60 secondes de délai entre deux gains
  par personne (pour ne pas juste récompenser le débit de messages). Niveau
  = `floor(sqrt(xp / 50))` — 50 XP pour le niveau 1, 200 pour le niveau 2,
  450 pour le niveau 3, etc. Un passage de niveau est annoncé dans le salon
  où le message a été envoyé.
- **Pas d'XP vocal** : suivre qui parle dans un salon vocal demanderait au
  bot de rester connecté en permanence à TOUS les salons vocaux du serveur
  pour observer les participants (LiveKit ne remonte cette info qu'aux
  participants effectivement connectés à la room) — une architecture bien
  plus lourde que "le bot rejoint sur demande" comme aujourd'hui. Pas fait
  pour l'instant.
- `/economie action:profil` — ton propre niveau/XP/solde ; `membre:<pseudo>`
  pour voir celui de quelqu'un d'autre.
- `/economie action:classement` — top 10 par XP ; `type:argent` pour trier
  par solde à la place.
- `/economie action:daily` — 100 à 200 pièces, une fois par 24h.
- `/niveau-role action:set niveau:5 role:VIP` — attribue automatiquement le
  rôle **VIP** à qui atteint le niveau 5 (façon MEE6 "level rewards").
  `action:remove niveau:5` retire la récompense, `action:list` les liste
  toutes. Nécessite `manage_roles`. Ne rattrape pas les niveaux déjà
  dépassés au moment où la récompense est configurée — seul un futur
  passage de niveau la déclenche.
- Pas de boutique/inventaire/jeux/métiers pour l'instant — socle XP +
  monnaie seulement, le reste de la catégorie "Engagement" reste à faire.

## Giveaways

Façon MEE6/Dyno : un message avec un bouton "🎉 Participer", un tirage
aléatoire à l'expiration du délai.

- `/giveaway-start prix:"1 mois de Nitro" duree:60 gagnants:1` — poste le
  giveaway dans le salon (durée en minutes, 1 à 10080 soit une semaine
  maximum ; `gagnants` par défaut 1). Un seul giveaway actif à la fois par
  salon.
- `/giveaway-end` — tapée **dans le salon du giveaway** : le termine
  immédiatement et tire les gagnants sans attendre l'expiration.
- À l'expiration (ou à `/giveaway-end`), un nouveau message annonce le ou
  les gagnants tirés au sort parmi les participants, ou "Personne n'a
  participé" si personne n'a cliqué.
- **État en mémoire uniquement** (même limite que les sessions vocales,
  voir plus bas) : un redémarrage du bot pendant un giveaway en cours le
  perd — les participants déjà inscrits ne sont pas sauvegardés sur disque.

## Dashboard web (facultatif)

Une page `/dashboard?serverId=<id>` pour configurer l'auto-mod et le message
de bienvenue sans passer par des commandes — connexion via **"Se connecter
avec IXin"** (OAuth2 officiel, voir le portail développeur), jamais de mot de
passe géré par ce bot. Entièrement facultatif : si les variables ci-dessous
sont vides, `/dashboard` répond juste "non configuré" et tout le reste du
bot (commandes, voix, auto-mod...) continue de fonctionner normalement.

**Mise en place :**

1. **Paramètres → 👨‍💻 Se connecter avec IXin → + Créer une application** sur
   ton compte IXin (celui qui possède le bot). URL de redirection à renseigner :
   `https://mon-bot.exemple.com/oauth/callback` (remplace par ton vrai domaine).
2. Complète `.env` :
   ```
   PUBLIC_URL=https://mon-bot.exemple.com
   OAUTH_CLIENT_ID=...       # depuis l'application créée à l'étape 1
   OAUTH_CLIENT_SECRET=...   # idem — jamais exposé au navigateur, reste sur le VPS
   DASHBOARD_SECRET=...      # une valeur aléatoire à toi (ex. openssl rand -hex 32)
   ```
3. `pm2 restart bot-voice`, puis ouvre `https://mon-bot.exemple.com/dashboard?serverId=<id du serveur>`.

**Comment ça vérifie les droits** : après la connexion IXin, le bot appelle
`/api/bot/v1/servers/member-permissions` (routes publiques de l'API bot) pour
savoir si CE visiteur a `manage_server` sur CE serveur précis — impossible de
configurer un serveur qui n'est pas le sien, quel que soit son compte IXin.

**Limites** : pas de sélecteur de salon pour le message de bienvenue ou les
logs de modération (IXin n'a pas de route bot pour lister les salons texte,
contrairement aux salons vocaux) — ces deux-là restent à définir via
`/bienvenue` et `/modlogs`, tapées dans le salon voulu ; le dashboard ne fait
qu'afficher s'ils sont déjà définis. Session en cookie signé (12h), pas de
stockage de session côté serveur — un redémarrage du bot sans
`DASHBOARD_SECRET` fixé dans `.env` déconnecte tout le monde.

## Limites connues / pistes d'amélioration

- **Pas de mixage** : un `.wav` séparé par personne, jamais un fichier unique
  multi-voix — plus simple et plus fiable, au prix d'un montage manuel si tu
  veux un seul fichier.
- **Pas de pause/reprise** de la musique, seulement lecture/skip/stop —
  simple à ajouter dans `lib/player.js` si besoin (couper l'écriture vers
  `AudioSource` puis la reprendre).
- **Sessions en mémoire uniquement** : un redémarrage du process (crash,
  redéploiement) oublie les salons connectés — retape `/join`. Même limite
  pour les giveaways en cours (voir plus haut).
- **Recherche YouTube** via `ytsearch1:` (yt-dlp) — prend le premier résultat,
  pas de choix parmi plusieurs.
- yt-dlp doit rester à jour (`pip install -U yt-dlp` régulièrement) —
  YouTube change son site plus vite que certaines versions figées.
- **Casier/config par serveur non sauvegardés ailleurs que sur ce VPS** :
  pense à sauvegarder `data/` si tu tiens à cet historique.
- **`membre:` par pseudo dépend de la mémoire du bot** (voir plus haut) —
  après un redémarrage, un pseudo jamais revu depuis ne se résout plus tant
  que la personne n'a pas reposté (le fichier `data/servers/<id>.json`
  garde l'ancien annuaire, donc en pratique ça ne se réinitialise pas, sauf
  suppression manuelle du fichier).
- **Anti-liens** : liste blanche modifiable seulement en éditant le JSON
  pour l'instant (pas de commande dédiée) ; l'auto-mod ne connaît que la
  détection par mot entier / URL brute, pas de filtre "intelligent"
  (contournable par des variantes orthographiques volontaires).

## Structure

```
bot-voice/
  bot.js               serveur HTTP (/interactions, /events) + dispatch des commandes
  lib/env.js           chargement .env + config
  lib/signature.js      vérification HMAC (identique au kit de démarrage)
  lib/api.js            appels aux routes /api/bot/v1/* de IXin
  lib/voice.js          connexion/déconnexion LiveKit + piste audio publiée
  lib/player.js         yt-dlp + ffmpeg → PCM → AudioSource (lecture)
  lib/recorder.js        abonnement aux pistes distantes → fichiers .wav (enregistrement)
  lib/session.js        état en mémoire par salon/DM (file, connexion, enregistreur)
  lib/serverStore.js     config auto-mod + casier + annuaire pseudo→uid, persistés en JSON
  lib/automod.js         détection (filtre de mots, liens, anti-spam)
  lib/dashboard.js       dashboard web facultatif ("Se connecter avec IXin" + pages HTML)
```

`handleCommand()` (commandes) et `handleEvent()` (auto-mod, sur les
événements `message_create`) dans `bot.js` restent les points d'entrée à
modifier pour ajouter/changer des fonctionnalités — même esprit que le kit
de démarrage.
