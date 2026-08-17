'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'app.db'));

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    username              TEXT NOT NULL UNIQUE,
    password_hash         TEXT NOT NULL,
    password_salt         TEXT NOT NULL,
    kdf_salt              TEXT NOT NULL,
    public_key            TEXT NOT NULL,
    encrypted_private_key TEXT NOT NULL,
    private_key_nonce     TEXT NOT NULL,
    created_at            INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Message 1:1 : ciphertext/nonce chiffres avec crypto_box(destinataire_pub, expediteur_priv).
  -- Message de groupe : recipient_id est NULL, group_id est renseigne ; ciphertext/nonce
  -- sont chiffres avec une cle symetrique aleatoire propre au message (crypto_secretbox),
  -- elle-meme distribuee a chaque membre via group_message_keys (voir plus bas).
  CREATE TABLE IF NOT EXISTS messages (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id    INTEGER NOT NULL,
    recipient_id INTEGER,
    group_id     INTEGER,
    ciphertext   TEXT NOT NULL,
    nonce        TEXT NOT NULL,
    created_at   INTEGER NOT NULL,
    delivered    INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    CHECK ((recipient_id IS NULL) != (group_id IS NULL))
  );

  CREATE INDEX IF NOT EXISTS idx_messages_pair
    ON messages (sender_id, recipient_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_messages_group
    ON messages (group_id, created_at);

  CREATE TABLE IF NOT EXISTS groups (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER NOT NULL,
    user_id  INTEGER NOT NULL,
    joined_at INTEGER NOT NULL,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Pour chaque message de groupe, la cle symetrique du message est chiffree
  -- individuellement pour chaque membre (crypto_box(membre_pub, expediteur_priv)).
  -- Un nouveau membre n'a pas ces lignes pour l'historique : il ne peut pas
  -- dechiffrer les messages anterieurs a son ajout (comportement volontaire).
  CREATE TABLE IF NOT EXISTS group_message_keys (
    message_id INTEGER NOT NULL,
    member_id  INTEGER NOT NULL,
    ciphertext TEXT NOT NULL,
    nonce      TEXT NOT NULL,
    PRIMARY KEY (message_id, member_id),
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (member_id) REFERENCES users(id)
  );

  -- Les fichiers (photos, videos, vocaux, documents) sont chiffres cote client
  -- avant l'upload ; le serveur ne stocke/relaie que des octets opaques, que ce
  -- soit sur disque local (dev) ou chez Bunny (prod). object_key est un UUID
  -- imprevisible ; aucune donnee sensible n'est deductible du nom de fichier.
  CREATE TABLE IF NOT EXISTS attachments (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    object_key   TEXT NOT NULL UNIQUE,
    size_bytes   INTEGER NOT NULL,
    uploaded_by  INTEGER NOT NULL,
    created_at   INTEGER NOT NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
  );
`);

module.exports = db;
