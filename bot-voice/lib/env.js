'use strict';
const fs = require('fs');
const path = require('path');

// Mini chargeur de .env (même logique que le kit de démarrage bot-x1.js —
// pas de dépendance dotenv pour rester facile à auditer/héberger).
function loadEnvFile(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    raw.split('\n').forEach(function (line) {
      const trimmed = line.trim();
      if (!trimmed || trimmed[0] === '#') return;
      const eq = trimmed.indexOf('=');
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val[0] === '"' && val[val.length - 1] === '"') || (val[0] === "'" && val[val.length - 1] === "'")) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    });
  } catch (e) { /* pas de .env, tant pis : on retombe sur l'environnement système */ }
}
loadEnvFile(path.join(__dirname, '..', '.env'));

const BOT_TOKEN = process.env.BOT_TOKEN || '';
if (!BOT_TOKEN) {
  console.error('[bot-voice] BOT_TOKEN manquant. Copie .env.example vers .env et renseigne-le.');
  process.exit(1);
}

const crypto = require('crypto');

module.exports = {
  BOT_TOKEN: BOT_TOKEN,
  PORT: parseInt(process.env.PORT || '3000', 10),
  X1_BASE_URL: process.env.X1_BASE_URL || 'https://xultra.space',
  LIVEKIT_WS_URL: process.env.LIVEKIT_WS_URL || 'wss://voice.xultra.space',
  RECORDINGS_DIR: process.env.RECORDINGS_DIR || path.join(__dirname, '..', 'recordings'),
  YTDLP_PATH: process.env.YTDLP_PATH || 'yt-dlp',
  FFMPEG_PATH: process.env.FFMPEG_PATH || 'ffmpeg',
  DATA_DIR: process.env.DATA_DIR || path.join(__dirname, '..', 'data'),
  // Dashboard web ("Se connecter avec X1") — absent = dashboard désactivé,
  // le bot fonctionne très bien sans (commandes uniquement).
  PUBLIC_URL: process.env.PUBLIC_URL || '',
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || '',
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || '',
  // Signe le cookie de session du dashboard — générée une fois toute seule
  // si absente (redémarrer le bot invalide alors les sessions ouvertes,
  // sans plus de conséquence que redemander de se reconnecter).
  DASHBOARD_SECRET: process.env.DASHBOARD_SECRET || crypto.randomBytes(32).toString('hex')
};
