/**
 * Vecteurs de référence générés par le VRAI Web Crypto API (crypto.webcrypto
 * de Node — la même implémentation que les navigateurs, pas un mock) en
 * exécutant une réplique exacte des fonctions e2e* de worker.js. Ces
 * vecteurs sont figés en dur ici (plutôt que régénérés à chaque run) pour
 * que ce test prouve une chose précise et stable : que le portage
 * @noble/curves + @noble/hashes + @noble/ciphers de src/e2e.ts est
 * bit-à-bit compatible avec ce que produit/attend le site, dans les deux
 * sens.
 */
import {
  backupPrivateKey,
  decryptTextWithKey,
  deriveThreadKey,
  encryptTextWithKey,
  generateKeyPair,
  restorePrivateKeyFromBackup,
  type E2EPrivateJwk,
} from '../e2e';

const VECTORS = {
  alicePubKeyB64:
    'BPoU03BmQMRaaG+6OHNSW2RoxVGQ6Z7NIbki4wXmLvDIEe/rm+z3uUJCh5XZxQOoAL68ojT3IurH51hxa7AorCE=',
  alicePrivJwk: {
    key_ops: ['deriveBits'],
    ext: true,
    kty: 'EC',
    x: '-hTTcGZAxFpob7o4c1JbZGjFUZDpns0huSLjBeYu8Mg',
    y: 'Ee_rm-z3uUJCh5XZxQOoAL68ojT3IurH51hxa7AorCE',
    crv: 'P-256',
    d: 'yoXQMZJwiAV7l_dDAw-tq0Y7ycL1PpvZl0uhczOpumg',
  } as E2EPrivateJwk,
  bobPubKeyB64:
    'BE8+kJegM9TeoNqwPD5uRNt6JS5lq4GKDaxW2Xdvar4leV95WCMb+uUX5/L1cr6bLxkxmMfE6jM09TUb/o/0PmI=',
  bobPrivJwk: {
    key_ops: ['deriveBits'],
    ext: true,
    kty: 'EC',
    x: 'Tz6Ql6Az1N6g2rA8Pm5E23olLmWrgYoNrFbZd29qviU',
    y: 'eV95WCMb-uUX5_L1cr6bLxkxmMfE6jM09TUb_o_0PmI',
    crv: 'P-256',
    d: 'RdH3cMa2NaXG4ScLfcjYd4yJjsT606N8JiknepWGCXw',
  } as E2EPrivateJwk,
  uidA: 'alice',
  uidB: 'bob',
  plaintext: 'Salut Bob, ceci est un message de test 🔒 é à ü',
  encryptedByAlice:
    'NBu3BA2RGrQ8QpSo.qK2Mn4cdS6nGjl/Ode9zhsaguMHhuJdW310zZ1GvJt26EfevzYGzB6Uuyd4KDA0KDOiGZzhd7NgCWEJ0w6ARzCE5VWo=',
  password: 'correct horse battery staple 42!',
  backup: {
    encPrivB64:
      'YMO1AocYnU6P9Sw6vG7OHA2+awjW+++jsxFnL0+7gPGbZVpRpU14dj/8w39y/KoEyzBtE2f4QHa81iv2mo52CMlhtpHDe1J27xg0AqPmZvakWVs4NGYSgh1cNksSnaCkQafaVD+K0nDFYSFSs8I2gOj1qHJE77CmeZO9jn9tbmuvAB1L3Q736LQf1DsdCr0+8AD2bgrDmHswKqpsuLV5fobu03dC+tBph9kFypJmGsV1oF465yArYsuHX4Cae7XClKVkNtZ17vJSfaPfFsvTqSiLtCBZ9vZJRPWuSPdM/7n/IZsq',
    saltB64: '/M4xZbz35gkSzL2tDGjgow==',
    ivB64: 'EHCGYBxvyVJQJoPs',
  },
};

describe('e2e — compatibilité bit-à-bit avec le Web Crypto du site', () => {
  test('déchiffre un message chiffré côté web (WebCrypto) avec la clé dérivée côté mobile (noble)', () => {
    const bobKey = deriveThreadKey(VECTORS.bobPrivJwk, VECTORS.alicePubKeyB64, VECTORS.uidA, VECTORS.uidB);
    const decrypted = decryptTextWithKey(bobKey, VECTORS.encryptedByAlice);
    expect(decrypted).toBe(VECTORS.plaintext);
  });

  test('les clés de session dérivées côté Alice et côté Bob sont identiques', () => {
    const aliceKey = deriveThreadKey(VECTORS.alicePrivJwk, VECTORS.bobPubKeyB64, VECTORS.uidA, VECTORS.uidB);
    const bobKey = deriveThreadKey(VECTORS.bobPrivJwk, VECTORS.alicePubKeyB64, VECTORS.uidA, VECTORS.uidB);
    expect(Array.from(aliceKey)).toEqual(Array.from(bobKey));
  });

  test('restaure la clé privée depuis une sauvegarde chiffrée créée côté web (PBKDF2 + AES-GCM)', () => {
    const restored = restorePrivateKeyFromBackup(VECTORS.password, VECTORS.backup as any);
    expect(restored).not.toBeNull();
    expect(restored!.d).toBe(VECTORS.alicePrivJwk.d);
  });

  test('un mauvais mot de passe échoue proprement (pas d\'exception, retourne null)', () => {
    const restored = restorePrivateKeyFromBackup('mauvais mot de passe', VECTORS.backup as any);
    expect(restored).toBeNull();
  });

  test('round-trip : un message chiffré côté mobile (noble) est déchiffrable par la clé dérivée côté web', () => {
    // On ne peut pas ici ré-exécuter le vrai Web Crypto de Node (ce test tourne
    // dans l'environnement RN/jest-expo), mais la clé de session est
    // symétrique et déjà prouvée identique des deux côtés (test précédent) —
    // on vérifie donc le chiffrement/déchiffrement round-trip avec cette même
    // clé, ce qui couvre le format exact "b64(iv).b64(ciphertext)" attendu
    // par e2eDecryptTextWithKey() côté web.
    const aliceKey = deriveThreadKey(VECTORS.alicePrivJwk, VECTORS.bobPubKeyB64, VECTORS.uidA, VECTORS.uidB);
    const message = 'Réponse depuis le mobile — accents/emoji: 🚀é';
    const encrypted = encryptTextWithKey(aliceKey, message);
    expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+$/);
    expect(decryptTextWithKey(aliceKey, encrypted)).toBe(message);
  });
});

describe('e2e — génération de clés et sauvegarde locales', () => {
  test('generateKeyPair produit une paire ECDH P-256 utilisable immédiatement', () => {
    const alice = generateKeyPair();
    const bob = generateKeyPair();
    expect(alice.jwk.kty).toBe('EC');
    expect(alice.jwk.crv).toBe('P-256');
    expect(alice.pubKeyB64.length).toBeGreaterThan(0);

    const aliceKey = deriveThreadKey(alice.jwk, bob.pubKeyB64, 'u1', 'u2');
    const bobKey = deriveThreadKey(bob.jwk, alice.pubKeyB64, 'u1', 'u2');
    expect(Array.from(aliceKey)).toEqual(Array.from(bobKey));

    const message = 'ping';
    const encrypted = encryptTextWithKey(aliceKey, message);
    expect(decryptTextWithKey(bobKey, encrypted)).toBe(message);
  });

  test('backupPrivateKey produit une sauvegarde que restorePrivateKeyFromBackup peut relire', () => {
    const { jwk } = generateKeyPair();
    const password = 'un mot de passe assez long';
    const backup = backupPrivateKey(password, jwk);
    const restored = restorePrivateKeyFromBackup(password, { uid: 'u1', ...backup });
    expect(restored).toEqual(jwk);
  });
});
