#!/usr/bin/env node
'use strict';
// Régénère le bloc BOT_VOICE_KIT_FILES de worker.js à partir du contenu réel
// de bot-voice/ — à relancer après CHAQUE ajout de fonctionnalité au bot
// (voir aussi bot-voice/README.md, qui doit rester la doc de référence pour
// les commandes disponibles). Le kit "avancé" servi par
// /api/bot/starter-kit-advanced dans worker.js sert directement ce contenu
// sous forme de .zip, jamais un lien vers GitHub.
//
// Usage : node worker/sync_bot_voice_kit.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BOT_VOICE_DIR = path.join(ROOT, 'bot-voice');
const WORKER_FILE = path.join(__dirname, 'worker.js');

// Fichiers inclus dans le kit — jamais node_modules/package-lock.json (à
// régénérer par npm install côté utilisateur, évite un lockfile figé qui
// dérive des versions réellement publiées) ni .gitignore (sans intérêt hors
// du dépôt git).
const INCLUDE = ['bot.js', 'package.json', '.env.example', 'README.md'];

function collect() {
  const files = {};
  for (const name of INCLUDE) {
    const p = path.join(BOT_VOICE_DIR, name);
    if (fs.existsSync(p)) files['bot-voice/' + name] = fs.readFileSync(p, 'utf8');
  }
  const libDir = path.join(BOT_VOICE_DIR, 'lib');
  for (const name of fs.readdirSync(libDir).sort()) {
    if (!name.endsWith('.js')) continue;
    files['bot-voice/lib/' + name] = fs.readFileSync(path.join(libDir, name), 'utf8');
  }
  return files;
}

function buildBlock(files) {
  const entries = Object.keys(files).sort().map(function (name) {
    return '  ' + JSON.stringify(name) + ': ' + JSON.stringify(files[name]);
  });
  return 'const BOT_VOICE_KIT_FILES = {\n' + entries.join(',\n') + '\n};';
}

function main() {
  const files = collect();
  const count = Object.keys(files).length;
  const block = buildBlock(files);
  const src = fs.readFileSync(WORKER_FILE, 'utf8');
  const beginMarker = '// BOT_VOICE_KIT_FILES:BEGIN (généré par worker/sync_bot_voice_kit.mjs — ne pas éditer à la main)';
  const endMarker = '// BOT_VOICE_KIT_FILES:END';
  const beginIdx = src.indexOf(beginMarker);
  const endIdx = src.indexOf(endMarker);
  if (beginIdx < 0 || endIdx < 0 || endIdx < beginIdx) {
    console.error('Marqueurs BOT_VOICE_KIT_FILES introuvables dans worker.js — voir sync_bot_voice_kit.mjs');
    process.exit(1);
  }
  const before = src.slice(0, beginIdx + beginMarker.length);
  const after = src.slice(endIdx);
  const next = before + '\n' + block + '\n' + after;
  fs.writeFileSync(WORKER_FILE, next);
  console.log('BOT_VOICE_KIT_FILES régénéré : ' + count + ' fichiers, ' + Object.values(files).reduce(function (a, c) { return a + Buffer.byteLength(c, 'utf8'); }, 0) + ' octets au total.');
}

main();
