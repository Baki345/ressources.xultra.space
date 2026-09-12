/* ===== Chiffrement de bout en bout (E2E) — port mobile de worker.js =====
 *
 * Portage bit-à-bit compatible du schéma E2E du site (voir worker/worker.js,
 * section "Chiffrement de bout en bout (E2E)" ~ligne 6917) : ECDH P-256 +
 * HKDF-SHA256 (dérivation de la clé de session par paire) + AES-256-GCM,
 * avec sauvegarde de la clé privée chiffrée par mot de passe (PBKDF2 100k
 * itérations) côté serveur (collection `e2e_keys`, champs
 * encPrivB64/saltB64/ivB64) pour permettre la restauration multi-appareil.
 *
 * React Native ne fournit pas window.crypto.subtle : ce module réimplémente
 * les mêmes primitives en JS pur (@noble/curves, @noble/hashes,
 * @noble/ciphers) plutôt que d'utiliser un module natif, pour rester
 * testable sans Xcode/Android Studio. La compatibilité bit-à-bit avec
 * l'implémentation Web Crypto du site (mêmes clés, mêmes messages
 * déchiffrables dans les deux sens) a été validée avant l'écriture de ce
 * fichier via des vecteurs de référence générés par le vrai Web Crypto API
 * de Node (voir mobile/src/__tests__/e2e.test.ts).
 *
 * INVARIANT DE SÉCURITÉ (ne jamais violer) : la clé privée ECDH ne quitte
 * jamais cet appareil en clair. Elle vit uniquement dans expo-secure-store
 * (Keychain iOS / Keystore Android). Seule une sauvegarde chiffrée par mot
 * de passe (jamais le mot de passe lui-même, jamais la clé en clair) est
 * envoyée au serveur, exactement comme sur le site.
 *
 * Portée actuelle : texte, en 1:1 comme en groupe (clé de message éphémère
 * enveloppée par membre, voir generateGroupMessageKey/wrapGroupMessageKeyForMember
 * plus bas — même schéma que e2eGetMessageKeyContext côté worker.js). Les
 * pièces jointes binaires ont leurs primitives (encryptBytesWithKey/
 * decryptBytesWithKey) mais pas encore d'UI côté mobile.
 */
import { gcm } from '@noble/ciphers/aes.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { p256 } from '@noble/curves/nist.js';
import * as SecureStore from 'expo-secure-store';
import { ID, Permission, Query, Role } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';

const E2E_KEYS_COLLECTION = 'e2e_keys';
const SECURE_STORE_PRIV_KEY = 'xultra_e2e_priv';
const SECURE_STORE_PUB_KEY = 'xultra_e2e_pub';

/** JWK EC tel qu'exporté par crypto.subtle.exportKey('jwk', ...) côté web —
 * même forme exacte pour qu'une sauvegarde créée ici reste restaurable par
 * le site (et vice versa). */
export interface E2EPrivateJwk {
  kty: 'EC';
  crv: 'P-256';
  d: string;
  x: string;
  y: string;
  key_ops?: string[];
  ext?: boolean;
}

export interface E2EKeyDoc {
  $id?: string;
  uid: string;
  pubKey?: string;
  encPrivB64?: string;
  saltB64?: string;
  ivB64?: string;
}

export interface EnsureE2EKeysResult {
  hasKey: boolean;
  backedUp: boolean;
  needsRestore: boolean;
  restored: boolean;
  backupExists: boolean;
}

// ---- base64 (standard) / base64url (JWK) — pas de Buffer en React Native,
// on passe par btoa/atob (disponibles nativement dans Hermes/JSC modernes). ----
function bytesToB64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlToBytes(b64url: string): Uint8Array {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return b64ToBytes(b64);
}
function bytesToB64url(bytes: Uint8Array): string {
  return bytesToB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomBytes(len: number): Uint8Array {
  const out = new Uint8Array(len);
  // Polyfillé globalement par 'react-native-get-random-values' (voir index.ts).
  crypto.getRandomValues(out);
  return out;
}

// ---- Primitives de bas niveau (clé AES = Uint8Array brut, jamais de CryptoKey
// puisqu'il n'y a pas de Web Crypto natif ici) ----

function jwkToSecretKey(jwk: E2EPrivateJwk): Uint8Array {
  return b64urlToBytes(jwk.d);
}

function secretKeyToJwk(secretKey: Uint8Array): E2EPrivateJwk {
  const pubUncompressed = p256.getPublicKey(secretKey, false); // 0x04 || X(32) || Y(32)
  return {
    kty: 'EC',
    crv: 'P-256',
    d: bytesToB64url(secretKey),
    x: bytesToB64url(pubUncompressed.slice(1, 33)),
    y: bytesToB64url(pubUncompressed.slice(33, 65)),
    key_ops: ['deriveBits'],
    ext: true,
  };
}

/** Génère une nouvelle paire de clés ECDH P-256. Renvoie la clé privée au
 * même format JWK que le site (pour rester restaurable depuis un navigateur)
 * et la clé publique brute non compressée en base64 (même format que
 * `pubKey` dans la collection e2e_keys). */
export function generateKeyPair(): { jwk: E2EPrivateJwk; pubKeyB64: string } {
  const secretKey = p256.utils.randomSecretKey();
  const jwk = secretKeyToJwk(secretKey);
  const pubUncompressed = p256.getPublicKey(secretKey, false);
  return { jwk, pubKeyB64: bytesToB64(pubUncompressed) };
}

/** Dérive la clé de session AES-256 partagée pour une paire (uidA, uidB),
 * bit-à-bit identique à e2eThreadKey() dans worker.js. */
export function deriveThreadKey(
  myJwk: E2EPrivateJwk,
  peerPubKeyB64: string,
  myUid: string,
  peerUid: string
): Uint8Array {
  const mySecretKey = jwkToSecretKey(myJwk);
  const peerPubRaw = b64ToBytes(peerPubKeyB64);
  const sharedWithPrefix = p256.getSharedSecret(mySecretKey, peerPubRaw);
  const sharedX = sharedWithPrefix.slice(1); // enlève l'octet de format 0x02/0x03 -> X brut 32 octets, identique à crypto.subtle.deriveBits(ECDH)
  const info = new TextEncoder().encode([String(myUid), String(peerUid)].sort().join(':'));
  const salt = new TextEncoder().encode('xultra-e2e-v1');
  return hkdf(sha256, sharedX, salt, info, 32);
}

/** Chiffre du texte avec une clé de session déjà dérivée. Format identique à
 * e2eEncryptTextWithKey() : base64(iv) + '.' + base64(ciphertext). */
export function encryptTextWithKey(keyBytes: Uint8Array, text: string): string {
  const iv = randomBytes(12);
  const ct = gcm(keyBytes, iv).encrypt(new TextEncoder().encode(text));
  return bytesToB64(iv) + '.' + bytesToB64(ct);
}

/** Déchiffre un payload produit par encryptTextWithKey / e2eEncryptTextWithKey. */
export function decryptTextWithKey(keyBytes: Uint8Array, payload: string): string {
  const parts = String(payload).split('.');
  const iv = b64ToBytes(parts[0]);
  const ct = b64ToBytes(parts[1]);
  const pt = gcm(keyBytes, iv).decrypt(ct);
  return new TextDecoder().decode(pt);
}

/** Chiffre des octets bruts (pièce jointe) : iv (12 octets) préfixé au
 * ciphertext, identique à e2eEncryptBlobWithKey(). */
export function encryptBytesWithKey(keyBytes: Uint8Array, data: Uint8Array): Uint8Array {
  const iv = randomBytes(12);
  const ct = gcm(keyBytes, iv).encrypt(data);
  const out = new Uint8Array(iv.length + ct.length);
  out.set(iv, 0);
  out.set(ct, iv.length);
  return out;
}

/** Déchiffre des octets produits par encryptBytesWithKey / e2eEncryptBlobWithKey. */
export function decryptBytesWithKey(keyBytes: Uint8Array, data: Uint8Array): Uint8Array {
  const iv = data.slice(0, 12);
  const ct = data.slice(12);
  return gcm(keyBytes, iv).decrypt(ct);
}

// ---- Sauvegarde / restauration de la clé privée (PBKDF2 + AES-GCM),
// identique à deriveE2EBackupKey / restoreE2EPrivateKeyFromBackup. ----

function deriveBackupKey(password: string, saltBytes: Uint8Array): Uint8Array {
  return pbkdf2(sha256, new TextEncoder().encode(password), saltBytes, { c: 100000, dkLen: 32 });
}

export function backupPrivateKey(
  password: string,
  jwk: E2EPrivateJwk
): { encPrivB64: string; saltB64: string; ivB64: string } {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const aesKey = deriveBackupKey(password, salt);
  const plain = new TextEncoder().encode(JSON.stringify(jwk));
  const cipher = gcm(aesKey, iv).encrypt(plain);
  return { encPrivB64: bytesToB64(cipher), saltB64: bytesToB64(salt), ivB64: bytesToB64(iv) };
}

export function restorePrivateKeyFromBackup(password: string, doc: E2EKeyDoc | null): E2EPrivateJwk | null {
  try {
    if (!password || !doc || !doc.encPrivB64 || !doc.saltB64 || !doc.ivB64) return null;
    const salt = b64ToBytes(doc.saltB64);
    const iv = b64ToBytes(doc.ivB64);
    const cipher = b64ToBytes(doc.encPrivB64);
    const aesKey = deriveBackupKey(password, salt);
    const plain = gcm(aesKey, iv).decrypt(cipher);
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    return null;
  }
}

// ---- Stockage local sécurisé (Keychain/Keystore via expo-secure-store —
// équivalent mobile du localStorage utilisé par le site, jamais en clair
// sur disque non protégé). ----

/** Relit la clé privée locale (SecureStore) déjà garantie par ensureE2EKeys().
 * Exposée pour que l'appelant (AuthContext) puisse la garder en mémoire pour
 * la durée de la session plutôt que de retourner au Keychain à chaque
 * message. */
export async function getLocalPrivateJwk(): Promise<E2EPrivateJwk | null> {
  try {
    const raw = await SecureStore.getItemAsync(SECURE_STORE_PRIV_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function setLocalPrivateJwk(jwk: E2EPrivateJwk): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_PRIV_KEY, JSON.stringify(jwk));
}
async function getLocalPubKeyB64(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SECURE_STORE_PUB_KEY);
  } catch {
    return null;
  }
}
async function setLocalPubKeyB64(pub: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_PUB_KEY, pub);
}

async function fetchOwnKeyDoc(uid: string): Promise<E2EKeyDoc | null> {
  try {
    const r = await databases.listDocuments(APPWRITE_DATABASE_ID, E2E_KEYS_COLLECTION, [
      Query.equal('uid', uid),
      Query.limit(1),
    ]);
    return (r.documents[0] as unknown as E2EKeyDoc) || null;
  } catch {
    return null;
  }
}

/** Équivalent mobile de ensureE2EKeys() : garantit qu'une clé locale existe,
 * la restaure depuis la sauvegarde serveur si un mot de passe est fourni et
 * qu'elle diverge de l'identité canonique du compte, publie la clé publique,
 * et crée/complète la sauvegarde chiffrée si besoin. `password` est optionnel
 * (ex. reconnexion via session déjà persistée sans ressaisie du mot de
 * passe) — dans ce cas une clé locale est quand même garantie utilisable,
 * mais needsRestore signale qu'une vraie restauration reste souhaitable. */
export async function ensureE2EKeys(uid: string, password?: string): Promise<EnsureE2EKeysResult> {
  try {
    let jwk = await getLocalPrivateJwk();
    let pub = await getLocalPubKeyB64();
    const existing = await fetchOwnKeyDoc(uid);

    let needsRestore = false;
    let justRestored = false;
    const mismatched = !!(existing && existing.pubKey && pub && existing.pubKey !== pub);
    const backupAvailable = !!(existing && existing.encPrivB64);

    if (!jwk || !pub || (mismatched && backupAvailable) || (password && backupAvailable)) {
      const restored = password ? restorePrivateKeyFromBackup(password, existing) : null;
      if (restored) {
        jwk = restored;
        const secretKey = jwkToSecretKey(jwk);
        pub = bytesToB64(p256.getPublicKey(secretKey, false));
        justRestored = true;
      } else if (!jwk || !pub) {
        if (existing && existing.encPrivB64) needsRestore = true;
        const generated = generateKeyPair();
        jwk = generated.jwk;
        pub = generated.pubKeyB64;
      } else {
        needsRestore = true;
      }
      await setLocalPrivateJwk(jwk);
      await setLocalPubKeyB64(pub);
    }

    let keyDoc = existing;
    if (!keyDoc) {
      try {
        keyDoc = (await databases.createDocument(
          APPWRITE_DATABASE_ID,
          E2E_KEYS_COLLECTION,
          ID.unique(),
          { uid, pubKey: pub },
          [Permission.read(Role.any()), Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        )) as unknown as E2EKeyDoc;
      } catch {
        // best-effort, comme côté web
      }
    } else if (keyDoc.pubKey !== pub && (justRestored || !keyDoc.encPrivB64)) {
      try {
        await databases.updateDocument(APPWRITE_DATABASE_ID, E2E_KEYS_COLLECTION, keyDoc.$id!, { pubKey: pub });
      } catch {
        // best-effort
      }
    }

    let backedUp = false;
    if (keyDoc) {
      if (keyDoc.encPrivB64) {
        backedUp = true;
      } else if (password) {
        try {
          const backup = backupPrivateKey(password, jwk);
          await databases.updateDocument(APPWRITE_DATABASE_ID, E2E_KEYS_COLLECTION, keyDoc.$id!, backup);
          backedUp = true;
        } catch {
          backedUp = false;
        }
      }
    }

    return { hasKey: !!jwk, backedUp, needsRestore, restored: justRestored, backupExists: backupAvailable };
  } catch {
    return { hasKey: false, backedUp: false, needsRestore: false, restored: false, backupExists: false };
  }
}

// ---- Wrappers pairwise haut niveau (DM 1:1), avec cache mémoire — mêmes
// caches et même piège documenté que côté web : si l'interlocuteur régénère
// sa clé sur un autre appareil pendant que cette session reste active, ses
// messages restent illisibles ici jusqu'au prochain lancement de l'appli
// (invalidateE2EPeerCache() permet de forcer une relecture ciblée). ----

const peerPubKeyCache: Record<string, string | null> = {};
const threadKeyCache: Record<string, Uint8Array | null> = {};

async function peerPubKey(peerUid: string): Promise<string | null> {
  if (peerPubKeyCache[peerUid] !== undefined) return peerPubKeyCache[peerUid];
  try {
    const r = await databases.listDocuments(APPWRITE_DATABASE_ID, E2E_KEYS_COLLECTION, [
      Query.equal('uid', peerUid),
      Query.limit(1),
    ]);
    const doc = (r.documents[0] as unknown as E2EKeyDoc) || null;
    const pub = doc && doc.pubKey ? doc.pubKey : null;
    peerPubKeyCache[peerUid] = pub;
    return pub;
  } catch {
    peerPubKeyCache[peerUid] = null;
    return null;
  }
}

export async function e2eThreadKey(myUid: string, myJwk: E2EPrivateJwk, peerUid: string): Promise<Uint8Array | null> {
  if (!peerUid || !myUid) return null;
  // Contrairement au site (où `me` est une variable globale fixe pour toute
  // la durée de la page), myUid est ici un paramètre : un changement de
  // compte sans redémarrage complet de l'app doit voir sa propre clé de
  // session, jamais celle mise en cache pour le compte précédent — d'où la
  // clé composite plutôt qu'un simple peerUid.
  const cacheKey = myUid + '|' + peerUid;
  if (threadKeyCache[cacheKey] !== undefined) return threadKeyCache[cacheKey];
  const peerPub = await peerPubKey(peerUid);
  if (!peerPub) {
    threadKeyCache[cacheKey] = null;
    return null;
  }
  try {
    const key = deriveThreadKey(myJwk, peerPub, myUid, peerUid);
    threadKeyCache[cacheKey] = key;
    return key;
  } catch {
    threadKeyCache[cacheKey] = null;
    return null;
  }
}

export async function e2eEncryptText(
  myUid: string,
  myJwk: E2EPrivateJwk,
  peerUid: string,
  text: string
): Promise<string | null> {
  const key = await e2eThreadKey(myUid, myJwk, peerUid);
  if (!key) return null;
  return encryptTextWithKey(key, text);
}

export async function e2eDecryptText(
  myUid: string,
  myJwk: E2EPrivateJwk,
  peerUid: string,
  payload: string
): Promise<string> {
  const key = await e2eThreadKey(myUid, myJwk, peerUid);
  if (!key) throw new Error('Pas de clé de session');
  return decryptTextWithKey(key, payload);
}

export function invalidateE2EPeerCache(peerUid: string): void {
  delete peerPubKeyCache[peerUid];
  Object.keys(threadKeyCache)
    .filter((k) => k.endsWith('|' + peerUid))
    .forEach((k) => delete threadKeyCache[k]);
}

// ---- Groupe (>2 membres) — même schéma que e2eGetMessageKeyContext() /
// e2eResolveIncomingKey() côté worker.js : une clé AES éphémère par message,
// enveloppée pour chaque membre via sa clé de session pairwise avec
// l'expéditeur (jamais une clé de groupe statique/partagée en clair). ----

/** Génère une clé AES-256 éphémère pour UN message de groupe. */
export function generateGroupMessageKey(): Uint8Array {
  return randomBytes(32);
}

/** Enveloppe la clé de message éphémère pour un membre donné : chiffrée avec
 * la clé de session pairwise expéditeur↔membre, identique à
 * e2eEncryptText(uid, rawKeyB64) côté web. */
export async function wrapGroupMessageKeyForMember(
  myUid: string,
  myJwk: E2EPrivateJwk,
  memberUid: string,
  groupKey: Uint8Array
): Promise<string | null> {
  return e2eEncryptText(myUid, myJwk, memberUid, bytesToB64(groupKey));
}

/** Déchiffre l'enveloppe reçue (ma part de keysJson) pour retrouver la clé de
 * message éphémère de CE message précis. */
export async function unwrapGroupMessageKeyFromSender(
  myUid: string,
  myJwk: E2EPrivateJwk,
  senderUid: string,
  wrapped: string
): Promise<Uint8Array> {
  const rawKeyB64 = await e2eDecryptText(myUid, myJwk, senderUid, wrapped);
  return b64ToBytes(rawKeyB64);
}
