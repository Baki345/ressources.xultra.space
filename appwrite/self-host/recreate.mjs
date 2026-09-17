// Recrée de zéro, sur une instance Appwrite self-hosted neuve, la base
// "xultra" (81 collections) et les 6 buckets de stockage utilisés par
// worker/worker.js — schema.json/buckets.json ont été reconstitués en
// analysant chaque appel awFetch/db.createDocument/db.updateDocument du
// code (les exports appwrite/collections/*.json du repo sont, eux,
// obsolètes : ils décrivent un schéma antérieur à un gros renommage).
//
// Idempotent : peut être relancé sans risque, les erreurs "existe déjà"
// (409) sont ignorées et l'exécution continue.
//
// Usage :
//   APPWRITE_ENDPOINT=https://appwrite.xultra.space/v1 \
//   APPWRITE_PROJECT_ID=<id du projet créé dans la console> \
//   APPWRITE_API_KEY=<clé API scope databases.write + collections.write + attributes.write + indexes.write + buckets.write> \
//   node recreate.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Client, Databases, Storage, Teams, Permission, Role } from "node-appwrite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ENDPOINT = process.env.APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "xultra";
// Optionnel : ton propre nouvel $id utilisateur sur l'instance self-hosted,
// pour remplacer les permissions "user:<ancien id cloud>" qu'on ne peut pas
// deviner ici (voir README, étape "recrée ton compte admin").
const OWNER_USER_ID = process.env.OWNER_USER_ID || null;

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error("APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID et APPWRITE_API_KEY sont requis.");
  process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);

const schema = JSON.parse(readFileSync(join(__dirname, "schema.json"), "utf8"));
const buckets = JSON.parse(readFileSync(join(__dirname, "buckets.json"), "utf8"));

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function ignore409(promise, label) {
  try {
    return await promise;
  } catch (e) {
    if (e?.code === 409) {
      console.log(`  (déjà présent) ${label}`);
      return null;
    }
    console.error(`  ÉCHEC ${label}:`, e?.message || e);
    throw e;
  }
}

// Appwrite valide la limite de largeur de ligne d'une collection AVANT de
// vérifier si un attribut du même nom existe déjà : sur une collection déjà
// pleine, ré-essayer de créer un attribut existant échoue avec
// attribute_limit_exceeded au lieu d'un 409 propre. On ne peut donc pas se
// fier au catch-409 pour l'idempotence des attributs/index/buckets — il
// faut lister l'existant d'abord et sauter ce qui y est déjà.
async function getOr404(promise) {
  try {
    return await promise;
  } catch (e) {
    if (e?.code === 404) return null;
    throw e;
  }
}

function patchPermissions(perms) {
  if (!OWNER_USER_ID) return perms;
  // schema.json ne contient normalement pas d'ID utilisateur figé (les
  // collections PER-DOC ont des permissions vides, posées document par
  // document par le code) — ce remplacement est une sécurité si jamais
  // une permission "user:xxx" apparaît quand même.
  return perms.map((p) => p.replace(/user:[a-zA-Z0-9]+/g, `user:${OWNER_USER_ID}`));
}

async function waitAttributesReady(collectionId, expectedCount, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await databases.listAttributes(DATABASE_ID, collectionId);
    const notReady = res.attributes.filter((a) => a.status === "processing");
    const failed = res.attributes.filter((a) => a.status === "failed");
    if (failed.length) {
      console.error(`  ATTRIBUTS EN ÉCHEC sur ${collectionId}:`, failed.map((a) => a.key));
    }
    if (notReady.length === 0 && res.attributes.length >= expectedCount) return res.attributes;
    await sleep(1000);
  }
  console.warn(`  Timeout en attendant les attributs de ${collectionId} (continue quand même)`);
  return databases.listAttributes(DATABASE_ID, collectionId).then((r) => r.attributes);
}

async function createAttribute(collectionId, attr, existingKeys) {
  const { key, type, required, array, size, min, max } = attr;
  const label = `${collectionId}.${key} (${type})`;
  if (existingKeys.has(key)) {
    console.log(`  (déjà présent) ${label}`);
    return null;
  }
  if (type === "string") {
    return ignore409(
      databases.createStringAttribute(DATABASE_ID, collectionId, key, size || 255, required, undefined, array || false),
      label,
    );
  }
  if (type === "integer") {
    return ignore409(
      databases.createIntegerAttribute(
        DATABASE_ID,
        collectionId,
        key,
        required,
        min ?? -9007199254740991,
        max ?? 9007199254740991,
        undefined,
        array || false,
      ),
      label,
    );
  }
  if (type === "boolean") {
    return ignore409(databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, undefined, array || false), label);
  }
  if (type === "datetime") {
    return ignore409(databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required, undefined, array || false), label);
  }
  console.warn(`  Type inconnu ignoré: ${label}`);
}

async function resetDatabase() {
  console.log(`== RESET : suppression de "${DATABASE_ID}" avant recréation ==`);
  try {
    await databases.delete(DATABASE_ID);
  } catch (e) {
    if (e?.code !== 404) throw e;
  }
  // La suppression est traitée en arrière-plan (worker-deletes) : on
  // attend que la base ait vraiment disparu avant de la recréer, sinon
  // le create() suivant tombe sur une base "en cours de suppression".
  const start = Date.now();
  while (Date.now() - start < 60000) {
    try {
      await databases.get(DATABASE_ID);
      await sleep(1500);
    } catch (e) {
      if (e?.code === 404) return;
      throw e;
    }
  }
  console.warn("  Timeout en attendant la suppression complète (on continue quand même)");
}

async function main() {
  if (process.env.RESET === "1") {
    await resetDatabase();
  }

  console.log(`== Base de données "${DATABASE_ID}" ==`);
  await ignore409(databases.create(DATABASE_ID, DATABASE_ID, true), DATABASE_ID);

  // Team "admins" : référencée par certaines permissions historiques
  // (team:admins). Créée avec un $id littéral "admins" pour que ces
  // chaînes de permission continuent de désigner la bonne équipe.
  await ignore409(teams.create("admins", "admins", []), "team:admins");

  const collectionIds = Object.keys(schema);
  for (let ci = 0; ci < collectionIds.length; ci++) {
    const cid = collectionIds[ci];
    const def = schema[cid];
    console.log(`\n[${ci + 1}/${collectionIds.length}] Collection "${cid}" (${def.attributes.length} attributs, ${def.indexes.length} index)`);

    const permissions = patchPermissions(def.permissions || []).map((p) => {
      // les chaînes du schéma sont déjà au format Appwrite ("read(\"any\")"...),
      // on les passe telles quelles.
      return p;
    });

    const existingCollection = await getOr404(databases.getCollection(DATABASE_ID, cid));
    if (!existingCollection) {
      await ignore409(
        databases.createCollection(DATABASE_ID, cid, cid, permissions, def.documentSecurity || false, true),
        `createCollection(${cid})`,
      );
    } else {
      console.log(`  (déjà présent) createCollection(${cid})`);
    }

    const existingAttrs = await databases.listAttributes(DATABASE_ID, cid);
    const existingKeys = new Set(existingAttrs.attributes.map((a) => a.key));

    for (const attr of def.attributes) {
      await createAttribute(cid, attr, existingKeys);
      await sleep(150); // évite de saturer la queue de traitement sur une petite instance
    }

    await waitAttributesReady(cid, def.attributes.length);

    const existingIdx = await databases.listIndexes(DATABASE_ID, cid);
    const existingIdxKeys = new Set(existingIdx.indexes.map((i) => i.key));
    for (const idx of def.indexes) {
      if (existingIdxKeys.has(idx.key)) {
        console.log(`  (déjà présent) createIndex(${cid}.${idx.key})`);
        continue;
      }
      await ignore409(
        databases.createIndex(DATABASE_ID, cid, idx.key, idx.type, idx.attributes, idx.orders || []),
        `createIndex(${cid}.${idx.key})`,
      );
      await sleep(150);
    }
  }

  console.log("\n== Buckets de stockage ==");
  for (const [bucketId, def] of Object.entries(buckets)) {
    console.log(`Bucket "${bucketId}" — ${def.note}`);
    const existingBucket = await getOr404(storage.getBucket(bucketId));
    if (existingBucket) {
      console.log(`  (déjà présent) createBucket(${bucketId})`);
      continue;
    }
    await ignore409(
      storage.createBucket(
        bucketId,
        def.name,
        def.permissions,
        def.fileSecurity,
        true,
        def.maximumFileSize,
        [],
        "none",
        false,
        false,
      ),
      `createBucket(${bucketId})`,
    );
  }

  console.log("\nTerminé. Vérifie la console Appwrite (Databases > xultra, Storage) avant de rebrancher l'app.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
