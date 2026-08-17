'use strict';

const crypto = require('node:crypto');
const db = require('./db');

const SESSION_COOKIE = 'session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1 };

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS).toString('hex');
  return { hash, salt };
}

function verifyPassword(password, salt, expectedHash) {
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
  const expected = Buffer.from(expectedHash, 'hex');
  if (hash.length !== expected.length) return false;
  return crypto.timingSafeEqual(hash, expected);
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
    .run(token, userId, expiresAt);
  return { token, expiresAt };
}

function destroySession(token) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

function purgeExpiredSessions() {
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
}

function getUserBySession(token) {
  if (!token) return null;
  const row = db.prepare(
    `SELECT u.* FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > ?`
  ).get(token, Date.now());
  return row || null;
}

// ---- rate limiting basique des tentatives de connexion (memoire, usage perso) ----
const attempts = new Map(); // key -> { count, resetAt }
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(key) {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(key) {
  const entry = attempts.get(key);
  if (!entry || Date.now() > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearAttempts(key) {
  attempts.delete(key);
}

// ---- cookies (pas de dependance externe) ----
function parseCookies(req, res, next) {
  const header = req.headers.cookie;
  req.cookies = {};
  if (header) {
    for (const part of header.split(';')) {
      const idx = part.indexOf('=');
      if (idx === -1) continue;
      const name = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      if (name) req.cookies[name] = decodeURIComponent(value);
    }
  }
  next();
}

function setSessionCookie(res, token, expiresAt) {
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    `Expires=${new Date(expiresAt).toUTCString()}`,
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function requireAuth(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  const user = getUserBySession(token);
  if (!user) {
    res.status(401).json({ error: 'Non authentifie' });
    return;
  }
  req.user = user;
  req.sessionToken = token;
  next();
}

// Defense CSRF simple : les requetes qui modifient l'etat doivent porter cet en-tete.
// Un site tiers ne peut pas l'ajouter a une requete cross-origin sans passer par CORS,
// qu'on n'active pas ; conjugue a SameSite=Strict sur le cookie de session.
function requireFetchHeader(req, res, next) {
  if (req.headers['x-requested-with'] !== 'xultra-messaging') {
    res.status(403).json({ error: 'Requete refusee' });
    return;
  }
  next();
}

setInterval(purgeExpiredSessions, 60 * 60 * 1000).unref();

module.exports = {
  SESSION_COOKIE,
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getUserBySession,
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  requireFetchHeader,
};
