# Bot vocal X1 — musique YouTube + enregistrement

Étend le [kit de démarrage officiel](https://xultra.space) (`bot-x1.js`) avec
une vraie connexion vocale [LiveKit](https://livekit.io) (`@livekit/rtc-node`) :
le bot peut rejoindre un salon vocal de serveur ou un appel de groupe en DM,
y jouer de l'audio YouTube, et enregistrer les personnes qui parlent (un
fichier `.wav` par personne).

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
   dans "URL d'interactions".
2. **✏️ Modifier les commandes** → déclare exactement ces commandes (le code
   dans `bot.js` répond précisément à ces noms/options) :

   | Commande | Options | Rôle |
   |---|---|---|
   | `join` | — | Rejoint le vocal du salon/DM où la commande est tapée |
   | `leave` | — | Quitte le vocal (arrête aussi un enregistrement en cours) |
   | `play` | `requete` (texte, requis) | URL YouTube ou recherche libre |
   | `skip` | — | Passe au morceau suivant de la file |
   | `stop` | — | Vide la file et arrête la lecture |
   | `queue` | — | Liste les morceaux en attente |
   | `record` | `action` (texte, requis, choix : `start` / `stop`) | Démarre/arrête l'enregistrement |

3. Le bot doit déjà être installé sur le serveur voulu avec **🎙️ Rejoindre
   les salons vocaux** coché (ou invité dans un DM de groupe existant).
4. Tape `/join` **dans le salon vocal lui-même** (chaque salon vocal a son
   propre fil de discussion — c'est de là que le bot sait où se connecter,
   pas d'ID à saisir à la main).

## Commandes disponibles

- `/join` — connexion silencieuse (utile avant `/record start` si tu veux
  enregistrer sans jouer de musique).
- `/play requete:<url ou recherche>` — ajoute à la file ; démarre tout de
  suite si rien ne joue.
- `/skip`, `/stop`, `/queue`
- `/record action:start` — poste d'abord une annonce visible **🔴
  Enregistrement démarré** dans le salon/DM (consentement : tout le monde
  voit que ça enregistre), puis écrit un `.wav` par personne qui parle dans
  `RECORDINGS_DIR` (par défaut `./recordings/<horodatage>/<nom>.wav`).
- `/record action:stop` — finalise les fichiers et poste le chemin de
  chacun. Pas d'upload automatique : les fichiers restent sur ton VPS, à toi
  de les récupérer (`scp`, etc.) — le bot n'a pas d'API d'envoi de fichier.

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

## Structure

```
bot-voice/
  bot.js              serveur HTTP (/interactions, /events) + dispatch des commandes
  lib/env.js          chargement .env + config
  lib/signature.js     vérification HMAC (identique au kit de démarrage)
  lib/api.js           appels aux routes /api/bot/v1/* de X1
  lib/voice.js         connexion/déconnexion LiveKit + piste audio publiée
  lib/player.js        yt-dlp + ffmpeg → PCM → AudioSource (lecture)
  lib/recorder.js       abonnement aux pistes distantes → fichiers .wav (enregistrement)
  lib/session.js       état en mémoire par salon/DM (file, connexion, enregistreur)
```

`handleCommand()` dans `bot.js` reste le point d'entrée à modifier pour
ajouter/changer des commandes — même esprit que le kit de démarrage.
