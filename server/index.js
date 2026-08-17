'use strict';

const path = require('node:path');
const http = require('node:http');
const express = require('express');

const db = require('./db');
const {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  requireFetchHeader,
} = require('./auth');
const { attach: attachWs } = require('./ws');

const PORT = process.env.PORT || 3000;
const USERNAME_RE = /^[a-zA-Z0-9_-]{3,32}$/;
const MIN_PASSWORD_LEN = 10;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));
app.use(parseCookies);
app.use(express.static(path.join(__dirname, '..', 'public')));

function publicUser(row) {
  return { id: row.id, username: row.username, publicKey: row.public_key };
}

// ---- inscription ----
// Le client genere sa paire de cles X25519 et chiffre la cle privee avec une cle
// derivee du mot de passe (Argon2id, cote navigateur, via libsodium). Le serveur ne
// recoit jamais le mot de passe en clair sous une forme exploitable pour dechiffrer
// quoi que ce soit : il ne stocke qu'un hash scrypt d'auth (distinct de la cle de
// chiffrement) et un blob de cle privee deja chiffre.
app.post('/api/register', (req, res) => {
  const { username, password, publicKey, encryptedPrivateKey, privateKeyNonce, kdfSalt } = req.body || {};

  if (typeof username !== 'string' || !USERNAME_RE.test(username)) {
    return res.status(400).json({ error: 'Nom d\'utilisateur invalide (3-32 caracteres, lettres/chiffres/_/-).' });
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LEN) {
    return res.status(400).json({ error: `Mot de passe trop court (min ${MIN_PASSWORD_LEN} caracteres).` });
  }
  if ([publicKey, encryptedPrivateKey, privateKeyNonce, kdfSalt].some((v) => typeof v !== 'string' || v.length === 0)) {
    return res.status(400).json({ error: 'Materiel cryptographique manquant.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: 'Ce nom d\'utilisateur est deja pris.' });
  }

  const { hash, salt } = hashPassword(password);
  const now = Date.now();
  const info = db.prepare(
    `INSERT INTO users
      (username, password_hash, password_salt, kdf_salt, public_key, encrypted_private_key, private_key_nonce, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(username, hash, salt, kdfSalt, publicKey, encryptedPrivateKey, privateKeyNonce, now);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  const { token, expiresAt } = createSession(user.id);
  setSessionCookie(res, token, expiresAt);
  res.status(201).json({ user: publicUser(user) });
});

// ---- connexion ----
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Identifiants invalides.' });
  }

  const ip = req.ip || 'unknown';
  const rlKey = `${ip}:${username}`;
  if (isRateLimited(rlKey)) {
    return res.status(429).json({ error: 'Trop de tentatives. Reessayez plus tard.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
    recordFailedAttempt(rlKey);
    return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
  }
  clearAttempts(rlKey);

  const { token, expiresAt } = createSession(user.id);
  setSessionCookie(res, token, expiresAt);
  res.json({
    user: publicUser(user),
    kdfSalt: user.kdf_salt,
    encryptedPrivateKey: user.encrypted_private_key,
    privateKeyNonce: user.private_key_nonce,
  });
});

app.post('/api/logout', requireAuth, requireFetchHeader, (req, res) => {
  destroySession(req.sessionToken);
  clearSessionCookie(res);
  res.status(204).end();
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({
    user: publicUser(req.user),
    kdfSalt: req.user.kdf_salt,
    encryptedPrivateKey: req.user.encrypted_private_key,
    privateKeyNonce: req.user.private_key_nonce,
  });
});

app.get('/api/users', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM users WHERE id != ? ORDER BY username').all(req.user.id);
  res.json({ users: rows.map(publicUser) });
});

app.get('/api/messages/:peerId', requireAuth, (req, res) => {
  const peerId = Number.parseInt(req.params.peerId, 10);
  if (!Number.isInteger(peerId)) return res.status(400).json({ error: 'peerId invalide.' });

  const rows = db.prepare(
    `SELECT id, sender_id AS senderId, recipient_id AS recipientId, ciphertext, nonce, created_at AS createdAt
     FROM messages
     WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
     ORDER BY created_at ASC`
  ).all(req.user.id, peerId, peerId, req.user.id);

  db.prepare('UPDATE messages SET delivered = 1 WHERE recipient_id = ? AND sender_id = ?')
    .run(req.user.id, peerId);

  res.json({ messages: rows });
});

// Le serveur relaie et stocke uniquement ciphertext + nonce : il n'a jamais la cle
// privee d'un destinataire et ne peut donc pas lire le contenu des messages.
app.post('/api/messages', requireAuth, requireFetchHeader, (req, res) => {
  const { recipientId, ciphertext, nonce } = req.body || {};
  const recipient = Number.parseInt(recipientId, 10);
  if (!Number.isInteger(recipient)) return res.status(400).json({ error: 'recipientId invalide.' });
  if (typeof ciphertext !== 'string' || typeof nonce !== 'string' || !ciphertext || !nonce) {
    return res.status(400).json({ error: 'Message chiffre invalide.' });
  }
  const recipientRow = db.prepare('SELECT id FROM users WHERE id = ?').get(recipient);
  if (!recipientRow) return res.status(404).json({ error: 'Destinataire introuvable.' });

  const now = Date.now();
  const info = db.prepare(
    'INSERT INTO messages (sender_id, recipient_id, ciphertext, nonce, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, recipient, ciphertext, nonce, now);

  const payload = {
    type: 'message',
    id: info.lastInsertRowid,
    senderId: req.user.id,
    recipientId: recipient,
    ciphertext,
    nonce,
    createdAt: now,
  };
  const delivered = ws.pushToUser(recipient, payload);
  if (delivered) {
    db.prepare('UPDATE messages SET delivered = 1 WHERE id = ?').run(info.lastInsertRowid);
  }

  res.status(201).json({ message: payload });
});

const server = http.createServer(app);
const ws = attachWs(server);

server.listen(PORT, () => {
  console.log(`Messagerie chiffree demarree sur http://localhost:${PORT}`);
});
