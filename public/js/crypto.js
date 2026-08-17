// Enveloppe autour de libsodium : toutes les operations cryptographiques
// (generation de cles, chiffrement/dechiffrement) se font ici, cote client.
// Le serveur ne voit jamais de cle privee ni de message en clair.

const ready = window.sodium.ready;

const B64 = () => window.sodium.base64_variants.ORIGINAL;

async function init() {
  await ready;
  return window.sodium;
}

// Paire de cles X25519 pour l'echange de cles / chiffrement authentifie (crypto_box).
async function generateKeyPair() {
  const sodium = await init();
  const kp = sodium.crypto_box_keypair();
  return {
    publicKey: kp.publicKey,
    privateKey: kp.privateKey,
    publicKeyB64: sodium.to_base64(kp.publicKey, B64()),
  };
}

// Derive une cle symetrique a partir du mot de passe (Argon2id). Ce n'est PAS
// le mot de passe de connexion : le serveur ne connait ni ce sel ni cette cle
// sous une forme qui lui permettrait de dechiffrer quoi que ce soit.
async function deriveKeyFromPassword(password, saltB64) {
  const sodium = await init();
  const salt = saltB64
    ? sodium.from_base64(saltB64, B64())
    : sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

  const key = sodium.crypto_pwhash(
    sodium.crypto_secretbox_KEYBYTES,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );

  return { key, saltB64: sodium.to_base64(salt, B64()) };
}

async function wrapPrivateKey(privateKey, passwordKey) {
  const sodium = await init();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(privateKey, nonce, passwordKey);
  return {
    encryptedPrivateKeyB64: sodium.to_base64(ciphertext, B64()),
    nonceB64: sodium.to_base64(nonce, B64()),
  };
}

async function unwrapPrivateKey(encryptedPrivateKeyB64, nonceB64, passwordKey) {
  const sodium = await init();
  const ciphertext = sodium.from_base64(encryptedPrivateKeyB64, B64());
  const nonce = sodium.from_base64(nonceB64, B64());
  try {
    return sodium.crypto_secretbox_open_easy(ciphertext, nonce, passwordKey);
  } catch {
    throw new Error('Mot de passe incorrect ou donnees corrompues.');
  }
}

// crypto_box = X25519 (echange de cles) + XSalsa20-Poly1305 (chiffrement authentifie).
async function encryptMessage(plaintext, recipientPublicKeyB64, senderPrivateKey) {
  const sodium = await init();
  const recipientPublicKey = sodium.from_base64(recipientPublicKeyB64, B64());
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const messageBytes = sodium.from_string(plaintext);
  const ciphertext = sodium.crypto_box_easy(messageBytes, nonce, recipientPublicKey, senderPrivateKey);
  return {
    ciphertext: sodium.to_base64(ciphertext, B64()),
    nonce: sodium.to_base64(nonce, B64()),
  };
}

async function decryptMessage(ciphertextB64, nonceB64, senderPublicKeyB64, recipientPrivateKey) {
  const sodium = await init();
  const senderPublicKey = sodium.from_base64(senderPublicKeyB64, B64());
  const ciphertext = sodium.from_base64(ciphertextB64, B64());
  const nonce = sodium.from_base64(nonceB64, B64());
  try {
    const plainBytes = sodium.crypto_box_open_easy(ciphertext, nonce, senderPublicKey, recipientPrivateKey);
    return sodium.to_string(plainBytes);
  } catch {
    return '⚠️ [message illisible : cle incorrecte ou donnees alterees]';
  }
}

// ---- chiffrement de groupe : une cle symetrique aleatoire par message,
// emballee individuellement pour chaque membre avec crypto_box. ----

async function encryptGroupMessage(plaintext, members, senderPrivateKey) {
  // members: [{ id, publicKey (base64) }, ...] (tous les membres du groupe)
  const sodium = await init();
  const messageKey = sodium.crypto_secretbox_keygen();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(sodium.from_string(plaintext), nonce, messageKey);

  const wrappedKeys = members.map((member) => {
    const memberPublicKey = sodium.from_base64(member.publicKey, B64());
    const boxNonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const wrapped = sodium.crypto_box_easy(messageKey, boxNonce, memberPublicKey, senderPrivateKey);
    return {
      memberId: member.id,
      ciphertext: sodium.to_base64(wrapped, B64()),
      nonce: sodium.to_base64(boxNonce, B64()),
    };
  });

  return {
    ciphertext: sodium.to_base64(ciphertext, B64()),
    nonce: sodium.to_base64(nonce, B64()),
    wrappedKeys,
  };
}

async function decryptGroupMessage(ciphertextB64, nonceB64, keyCiphertextB64, keyNonceB64, senderPublicKeyB64, myPrivateKey) {
  const sodium = await init();
  try {
    const senderPublicKey = sodium.from_base64(senderPublicKeyB64, B64());
    const wrappedKey = sodium.from_base64(keyCiphertextB64, B64());
    const keyNonce = sodium.from_base64(keyNonceB64, B64());
    const messageKey = sodium.crypto_box_open_easy(wrappedKey, keyNonce, senderPublicKey, myPrivateKey);

    const ciphertext = sodium.from_base64(ciphertextB64, B64());
    const nonce = sodium.from_base64(nonceB64, B64());
    const plainBytes = sodium.crypto_secretbox_open_easy(ciphertext, nonce, messageKey);
    return sodium.to_string(plainBytes);
  } catch {
    return '⚠️ [message illisible : cle incorrecte ou donnees alterees]';
  }
}

// ---- chiffrement de fichiers (photos, videos, vocaux, documents) ----
// Chaque fichier a sa propre cle aleatoire ; cette cle est ensuite transmise au
// destinataire en la placant dans le texte du message (lui-meme chiffre par les
// mecanismes ci-dessus). Le serveur ne stocke que des octets chiffres opaques.

async function encryptFile(fileBytes) {
  const sodium = await init();
  const key = sodium.crypto_secretbox_keygen();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(fileBytes, nonce, key);
  return {
    ciphertextBytes: ciphertext,
    keyB64: sodium.to_base64(key, B64()),
    nonceB64: sodium.to_base64(nonce, B64()),
  };
}

async function decryptFile(ciphertextBytes, keyB64, nonceB64) {
  const sodium = await init();
  const key = sodium.from_base64(keyB64, B64());
  const nonce = sodium.from_base64(nonceB64, B64());
  return sodium.crypto_secretbox_open_easy(new Uint8Array(ciphertextBytes), nonce, key);
}

window.E2E = {
  init,
  generateKeyPair,
  deriveKeyFromPassword,
  wrapPrivateKey,
  unwrapPrivateKey,
  encryptMessage,
  decryptMessage,
  encryptGroupMessage,
  decryptGroupMessage,
  encryptFile,
  decryptFile,
};
