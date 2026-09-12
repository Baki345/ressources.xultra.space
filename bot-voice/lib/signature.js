'use strict';
const crypto = require('crypto');

// Identique au kit de démarrage bot-x1.js : HMAC-SHA256 du corps brut avec
// le token du bot comme clé, comparaison en temps constant.
function verifySignature(rawBody, signatureHeader, botToken) {
  if (!signatureHeader) return false;
  const expected = crypto.createHmac('sha256', botToken).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signatureHeader), 'utf8');
  if (a.length !== b.length) return false;
  try { return crypto.timingSafeEqual(a, b); } catch (e) { return false; }
}

module.exports = { verifySignature };
