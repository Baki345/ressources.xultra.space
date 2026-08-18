/**
 * Crée les collections Ressources dans Appwrite (DB xultra).
 *
 * Usage:
 *   1. Dans Appwrite Console → Project Settings → API Keys
 *      → Create → scopes: databases.read, databases.write
 *   2. export APPWRITE_API_KEY="ta_cle"
 *   3. node setup-appwrite-ressources.mjs
 *
 * Ou:
 *   APPWRITE_API_KEY=xxx node setup-appwrite-ressources.mjs
 */

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const PROJECT = process.env.APPWRITE_PROJECT || "6a73b975002f14dc6b91";
const API_KEY = process.env.APPWRITE_API_KEY || "";
const DB_ID = process.env.APPWRITE_DB || "xultra";

if (!API_KEY) {
  console.error("Manque APPWRITE_API_KEY. Crée une clé API dans la console Appwrite (scopes databases).");
  process.exit(1);
}

async function aw(method, path, body) {
  const res = await fetch(ENDPOINT + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": PROJECT,
      "X-Appwrite-Key": API_KEY
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.message || data?.raw || res.statusText;
    const err = new Error(res.status + " " + msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function ensureCollection(id, name) {
  try {
    await aw("GET", `/databases/${DB_ID}/collections/${id}`);
    console.log("OK collection existe déjà:", id);
    return false;
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  await aw("POST", `/databases/${DB_ID}/collections`, {
    collectionId: id,
    name,
    permissions: [
      'read("any")',
      'create("users")',
      'update("users")',
      'delete("users")'
    ],
    documentSecurity: false,
    enabled: true
  });
  console.log("Créée collection:", id);
  return true;
}

async function ensureStringAttr(col, key, size, required = false) {
  try {
    await aw("POST", `/databases/${DB_ID}/collections/${col}/attributes/string`, {
      key,
      size,
      required,
      array: false
    });
    console.log("  + string", key);
  } catch (e) {
    if (String(e.message || "").includes("already exists") || e.status === 409) {
      console.log("  = string existe", key);
      return;
    }
    throw e;
  }
}

async function ensureIntAttr(col, key, required = false, defaultVal = 0) {
  try {
    await aw("POST", `/databases/${DB_ID}/collections/${col}/attributes/integer`, {
      key,
      required,
      min: 0,
      max: 2147483647,
      default: required ? undefined : defaultVal
    });
    console.log("  + integer", key);
  } catch (e) {
    if (String(e.message || "").includes("already exists") || e.status === 409) {
      console.log("  = integer existe", key);
      return;
    }
    throw e;
  }
}

async function ensureIndex(col, keyId, attrs) {
  try {
    await aw("POST", `/databases/${DB_ID}/collections/${col}/indexes`, {
      key: keyId,
      type: "key",
      attributes: attrs
    });
    console.log("  + index", keyId);
  } catch (e) {
    if (String(e.message || "").includes("already") || e.status === 409) {
      console.log("  = index existe", keyId);
      return;
    }
    // certains projets refusent si attr pas encore disponible
    console.warn("  ! index", keyId, e.message);
  }
}

async function setCommentsPublicCreate() {
  // Create: any pour commentaires anonymes
  try {
    await aw("PUT", `/databases/${DB_ID}/collections/ressource_comments`, {
      name: "ressource_comments",
      permissions: [
        'read("any")',
        'create("any")',
        'update("users")',
        'delete("users")'
      ],
      documentSecurity: false,
      enabled: true
    });
    console.log("Permissions ressource_comments: read/create any");
  } catch (e) {
    console.warn("Permissions comments:", e.message);
  }
}

async function main() {
  console.log("Endpoint:", ENDPOINT);
  console.log("Project:", PROJECT);
  console.log("Database:", DB_ID);

  await ensureCollection("ressources", "ressources");
  await ensureStringAttr("ressources", "title", 120, true);
  await ensureStringAttr("ressources", "slug", 80, true);
  await ensureStringAttr("ressources", "category", 60, false);
  await ensureStringAttr("ressources", "description", 2000, false);
  await ensureStringAttr("ressources", "videoUrl", 2000, true);
  await ensureStringAttr("ressources", "thumbUrl", 2000, false);
  await ensureIntAttr("ressources", "likes", false, 0);
  await ensureIntAttr("ressources", "dislikes", false, 0);

  // attendre un peu que les attributs soient disponibles avant index
  await new Promise((r) => setTimeout(r, 2500));
  await ensureIndex("ressources", "slug_idx", ["slug"]);

  await ensureCollection("ressource_comments", "ressource_comments");
  await ensureStringAttr("ressource_comments", "ressourceId", 64, true);
  await ensureStringAttr("ressource_comments", "name", 40, true);
  await ensureStringAttr("ressource_comments", "text", 500, true);
  await new Promise((r) => setTimeout(r, 2500));
  await ensureIndex("ressource_comments", "ressourceId_idx", ["ressourceId"]);
  await setCommentsPublicCreate();

  console.log("\nTerminé. Tu peux créer un document test dans ressources avec slug + videoUrl.");
}

main().catch((e) => {
  console.error("Échec:", e.message);
  if (e.data) console.error(JSON.stringify(e.data, null, 2));
  process.exit(1);
});
