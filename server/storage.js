'use strict';

// Stockage des fichiers chiffres (photos, videos, vocaux, documents).
// Le contenu qui transite ici est TOUJOURS deja chiffre par le client :
// ni ce module ni Bunny ne voient jamais un fichier en clair.
//
// En production, configurez ces variables d'environnement pour utiliser
// Bunny Storage + CDN :
//   BUNNY_STORAGE_ZONE         nom de la storage zone
//   BUNNY_STORAGE_ACCESS_KEY   cle d'acces de la storage zone (secret)
//   BUNNY_STORAGE_HOST         ex: storage.bunnycdn.com (ou ny.storage.bunnycdn.com selon la region)
//   BUNNY_PULL_ZONE_URL        ex: https://votre-zone.b-cdn.net
//
// Sans ces variables, les fichiers sont stockes localement sur le VPS dans
// data/attachments/ et servis par le serveur Node lui-meme (pratique pour le
// developpement, fonctionne aussi en petite prod si vous ne voulez pas
// utiliser Bunny tout de suite).

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const MAX_SIZE_BYTES = 75 * 1024 * 1024; // 75 Mo, chiffre (donc taille reelle transferee)

const bunnyConfigured = Boolean(
  process.env.BUNNY_STORAGE_ZONE &&
  process.env.BUNNY_STORAGE_ACCESS_KEY &&
  process.env.BUNNY_STORAGE_HOST &&
  process.env.BUNNY_PULL_ZONE_URL
);

const localDir = path.join(__dirname, '..', 'data', 'attachments');
if (!bunnyConfigured && !fs.existsSync(localDir)) {
  fs.mkdirSync(localDir, { recursive: true });
}

function newObjectKey() {
  return crypto.randomUUID();
}

async function putBunny(objectKey, buffer) {
  const host = process.env.BUNNY_STORAGE_HOST;
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const url = `https://${host}/${zone}/${objectKey}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      AccessKey: process.env.BUNNY_STORAGE_ACCESS_KEY,
      'Content-Type': 'application/octet-stream',
    },
    body: buffer,
  });
  if (!res.ok) {
    throw new Error(`Echec upload Bunny (${res.status})`);
  }
  return `${process.env.BUNNY_PULL_ZONE_URL.replace(/\/$/, '')}/${objectKey}`;
}

async function putLocal(objectKey, buffer) {
  const filePath = path.join(localDir, objectKey);
  await fs.promises.writeFile(filePath, buffer);
  return `/attachments/${objectKey}`;
}

// Stocke un buffer deja chiffre, retourne { objectKey, url }.
async function store(buffer) {
  if (buffer.length > MAX_SIZE_BYTES) {
    throw new Error(`Fichier trop volumineux (max ${Math.floor(MAX_SIZE_BYTES / 1024 / 1024)} Mo).`);
  }
  const objectKey = newObjectKey();
  const url = bunnyConfigured ? await putBunny(objectKey, buffer) : await putLocal(objectKey, buffer);
  return { objectKey, url };
}

function localFilePath(objectKey) {
  if (!/^[a-f0-9-]{36}$/.test(objectKey)) return null;
  return path.join(localDir, objectKey);
}

module.exports = { store, localFilePath, bunnyConfigured, MAX_SIZE_BYTES, localDir };
