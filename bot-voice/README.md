# Bot X1 — voix (musique YouTube + enregistrement) + auto-mod

Étend le [kit de démarrage officiel](https://xultra.space) (`bot-x1.js`) avec
une vraie connexion vocale [LiveKit](https://livekit.io) (`@livekit/rtc-node`) :
le bot peut rejoindre un salon vocal de serveur ou un appel de groupe en DM,
y jouer de l'audio YouTube, et enregistrer les personnes qui parlent (un
fichier `.wav` par personne) — plus un socle de modération (filtre de mots,
anti-liens, anti-spam, sanctions, casier, logs).

C'est un **process externe** — X1 (Cloudflare Worker) ne peut pas tenir une
connexion vocale persistante lui-même, voir le portail développeur (Mes bots
→ docs). Ce dossier tourne sur **ton propre VPS**, jamais sur l'infra X1.

## Pourquoi ça ne peut pas tourner "dans X1"

- X1 fournit uniquement l'**accès** au salon vocal (un jeton LiveKit via
  `/api/bot/v1/voice/token` ou `/dm-token`) — jamais de traitement audio
  (lecture, mixage, enregistrement, reconnaissance vocale). C'est le bot
  (ce projet) qui héberge toute cette logique, avec le SDK serveur LiveKit.
- La lecture YouTube (extraction audio) et l'enregistrement (écriture des
  pistes sur disque) n'existent nulle part côté X1 — ce projet les implémente
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

## Configurer le bot sur X1

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

   Exactement 15 commandes — la limite du bot. Pour en ajouter une nouvelle,
   il faut soit en retirer une, soit en fusionner deux (comme `economie`
   fusionne déjà 3 actions en une seule commande pour cette raison).

   **Important** : un salon vocal n'a pas sa propre zone de saisie sur X1 —
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

## Modération

Tout est stocké dans un fichier JSON par serveur (`data/servers/<id>.json` —
aucune base de données, X1 n'en fournit pas au bot) : config auto-mod,
casier de sanctions, et un annuaire pseudo→uid appris au fil des messages
reçus (X1 n'a pas de route bot pour chercher un membre par pseudo — le bot
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
  n'a pas d'équivalent côté X1 (aucun concept natif) : uniquement suivi par
  ce bot, dans le casier.
- `/sanction type:mute membre:<pseudo> minutes:10 raison:<texte>` — timeout
  réel côté X1 (nécessite la permission `moderate_members` accordée au bot).
- `/sanction type:kick|ban|unban membre:<pseudo> raison:<texte>` — nécessite
  `kick_members`/`ban_members`.
- `/casier membre:<pseudo>` — historique complet (avertissements + sanctions
  réelles + auto-mod) pour cette personne sur ce serveur.
- `/modlogs` (tapée dans le salon voulu) — chaque sanction (manuelle ou
  auto-mod) est ensuite postée là sous forme d'embed. `/modlogs action:disable`
  coupe les logs.
- `membre:` accepte un pseudo **seulement si le bot l'a déjà vu écrire** au
  moins un message depuis son démarrage (c'est comme ça qu'il apprend
  pseudo→uid) — sinon, donne directement l'uid X1 de la personne.

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
- Pas de boutique/inventaire/jeux/métiers pour l'instant — socle XP +
  monnaie seulement, le reste de la catégorie "Engagement" reste à faire.

## Limites connues / pistes d'amélioration

- **Pas de mixage** : un `.wav` séparé par personne, jamais un fichier unique
  multi-voix — plus simple et plus fiable, au prix d'un montage manuel si tu
  veux un seul fichier.
- **Pas de pause/reprise** de la musique, seulement lecture/skip/stop —
  simple à ajouter dans `lib/player.js` si besoin (couper l'écriture vers
  `AudioSource` puis la reprendre).
- **Sessions en mémoire uniquement** : un redémarrage du process (crash,
  redéploiement) oublie les salons connectés — retape `/join`.
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
  lib/api.js            appels aux routes /api/bot/v1/* de X1
  lib/voice.js          connexion/déconnexion LiveKit + piste audio publiée
  lib/player.js         yt-dlp + ffmpeg → PCM → AudioSource (lecture)
  lib/recorder.js        abonnement aux pistes distantes → fichiers .wav (enregistrement)
  lib/session.js        état en mémoire par salon/DM (file, connexion, enregistreur)
  lib/serverStore.js     config auto-mod + casier + annuaire pseudo→uid, persistés en JSON
  lib/automod.js         détection (filtre de mots, liens, anti-spam)
```

`handleCommand()` (commandes) et `handleEvent()` (auto-mod, sur les
événements `message_create`) dans `bot.js` restent les points d'entrée à
modifier pour ajouter/changer des fonctionnalités — même esprit que le kit
de démarrage.
