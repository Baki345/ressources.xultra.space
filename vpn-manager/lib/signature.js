'use strict';
const crypto = require('crypto');

// Identique au principe déjà utilisé par bot-voice/lib/signature.js et par
// IXin elle-même (dispatchBotEvents/verifyStripeSignature côté worker.js) :
// HMAC-SHA256 du corps brut avec un secret partagé comme clé, comparaison en
// temps constant — jamais un simple "===" sur une signature.
function sign(secret, rawBody) {
  return crypto.createHmac('sha256', secret).update(rawBody || '').digest('hex');
}

function verify(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) {
    console.log('[signature] Missing signatureHeader or secret:', { hasHeader: !!signatureHeader, hasSecret: !!secret });
    return false;
  }
  const expected = sign(secret, rawBody);
  console.log('[signature] Verifying - expected:', expected, 'received:', signatureHeader, 'body length:', rawBody.length, 'body:', rawBody.substring(0, 100));
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signatureHeader), 'utf8');
  if (a.length !== b.length) {
    console.log('[signature] Length mismatch:', a.length, 'vs', b.length);
    return false;
  }
  try { return crypto.timingSafeEqual(a, b); } catch (e) { console.log('[signature] timingSafeEqual error:', e.message); return false; }
}

module.exports = { sign, verify };
