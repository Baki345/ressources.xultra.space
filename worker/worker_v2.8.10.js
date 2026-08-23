addEventListener("fetch", e => e.respondWith(handle(e.request)));

/* ===== Server brain (no VPS) — secrets stay on Worker only ===== */
const AW_EP = "https://fra.cloud.appwrite.io/v1";
const AW_PID = "6a73b975002f14dc6b91";
const AW_DB = "xultra";
// API key: Worker-only (never sent to browser). Prefer Cloudflare Secret later.
const AW_KEY = "standard_dbd86d5c813301a5cb4fb65415361244856cd53019bf52cdac23e405c1fee6a89de9302dc8dd652190e0e823ae2ef7329f33d59a5ae922a3d09ad7607ecbb0e006fd6942b18033bc694c115032e78f0cf3f0bd5cf1eb8a358f09f5df60aac51debe6c92d60a8703c9adec5ad1f25ac846fe07621113577c93b7a75eb3e218491";
const SHAMAN_UIDS = new Set(["6a7895fc00364d72996f"]);
const MAINT_GATE = "xu_gate_Z-5olSXEZ3Gw3rgQPqhR_Y-o";
const MAINT_HTML = "<!DOCTYPE html>\n<html lang=\"fr\"><head>\n<meta charset=\"utf-8\"/>\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/>\n<meta name=\"robots\" content=\"noindex,nofollow\"/>\n<title>XULTRA \u2014 Maintenance</title>\n<style>\n:root{--bg:#0b0614;--accent:#a78bfa;--muted:#9ca3af;--line:#2a1f3d;--ok:#22c55e;--bad:#ef4444;--warn:#f59e0b}\n*{box-sizing:border-box;margin:0;padding:0}\nbody{min-height:100dvh;display:grid;place-items:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:radial-gradient(1200px 600px at 50% -10%,rgba(124,58,237,.35),transparent 60%),radial-gradient(800px 400px at 100% 100%,rgba(88,28,135,.25),transparent 50%),var(--bg);color:#f3e8ff;padding:24px}\n.card{width:min(420px,100%);background:linear-gradient(180deg,rgba(30,16,50,.95),rgba(15,8,28,.98));border:1px solid var(--line);border-radius:20px;padding:32px 26px;box-shadow:0 24px 80px rgba(0,0,0,.55);text-align:center;position:relative}\n.logo{font-size:2rem;font-weight:900;letter-spacing:.12em;background:linear-gradient(135deg,#e9d5ff,#a78bfa,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:8px}\n.badge{display:inline-block;margin:12px 0 18px;padding:6px 12px;border-radius:999px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.28);color:var(--accent);font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}\nh1{font-size:1.2rem;margin-bottom:8px;font-weight:800}\np{color:var(--muted);font-size:.92rem;line-height:1.55;margin-bottom:8px}\n.pulse{width:10px;height:10px;border-radius:50%;background:#a78bfa;display:inline-block;margin-right:8px;box-shadow:0 0 0 0 rgba(167,139,250,.6);animation:p 1.6s infinite}\n@keyframes p{0%{box-shadow:0 0 0 0 rgba(167,139,250,.55)}70%{box-shadow:0 0 0 12px rgba(167,139,250,0)}100%{box-shadow:0 0 0 0 rgba(167,139,250,0)}}\n.foot{margin-top:18px;font-size:.72rem;color:#6b7280}\n.dev-box{margin-top:22px;padding-top:18px;border-top:1px solid var(--line);text-align:left}\n.dev-box h2{font-size:.78rem;color:#a78bfa;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;font-weight:700}\nlabel{display:block;font-size:.72rem;color:#9ca3af;margin:0 0 6px;font-weight:600}\ninput{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:#0d0818;color:#f3e8ff;font-size:.95rem;margin-bottom:12px;outline:none}\ninput:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.2)}\n.btn-main{width:100%;padding:13px;border:0;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:800;font-size:.95rem;cursor:pointer}\n.btn-main:disabled{opacity:.6;cursor:wait}\n.btn-status{margin-top:14px;width:100%;padding:11px 14px;border-radius:12px;border:1px solid rgba(167,139,250,.35);background:rgba(124,58,237,.12);color:#e9d5ff;font-weight:700;font-size:.88rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}\n.btn-status:hover{background:rgba(124,58,237,.22);border-color:rgba(167,139,250,.55)}\n.err{color:#f87171;font-size:.82rem;min-height:1.2em;margin-top:8px;text-align:center}\n.ov{position:fixed;inset:0;background:rgba(5,2,12,.72);backdrop-filter:blur(10px);display:none;place-items:center;z-index:100;padding:20px}\n.ov.on{display:grid}\n.modal{width:min(440px,100%);background:linear-gradient(165deg,#1a1030 0%,#10081c 100%);border:1px solid rgba(167,139,250,.35);border-radius:22px;padding:0;overflow:hidden;box-shadow:0 30px 100px rgba(0,0,0,.65),0 0 0 1px rgba(124,58,237,.15),0 0 60px rgba(124,58,237,.12);animation:pop .28s ease}\n@keyframes pop{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}\n.modal-head{padding:22px 22px 14px;border-bottom:1px solid rgba(42,31,61,.9);position:relative}\n.modal-head h3{font-size:1.05rem;font-weight:800;letter-spacing:.02em}\n.modal-head .sub{font-size:.78rem;color:var(--muted);margin-top:4px}\n.modal-x{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.04);color:#e9d5ff;font-size:1.1rem;cursor:pointer;display:grid;place-items:center}\n.modal-x:hover{background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.4)}\n.modal-body{padding:12px 16px 20px;max-height:min(60vh,420px);overflow:auto}\n.svc{display:flex;align-items:center;gap:12px;padding:12px 12px;border-radius:14px;margin-bottom:8px;background:rgba(255,255,255,.03);border:1px solid rgba(42,31,61,.8)}\n.svc-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;box-shadow:0 0 10px currentColor}\n.svc-dot.ok{background:var(--ok);color:rgba(34,197,94,.5)}\n.svc-dot.bad{background:var(--bad);color:rgba(239,68,68,.45)}\n.svc-dot.warn{background:var(--warn);color:rgba(245,158,11,.45)}\n.svc-dot.load{background:#a78bfa;animation:blink 1s infinite}\n@keyframes blink{50%{opacity:.35}}\n.svc-name{font-weight:700;font-size:.9rem}\n.svc-desc{font-size:.72rem;color:var(--muted);margin-top:2px}\n.svc-state{margin-left:auto;font-size:.72rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase}\n.svc-state.ok{color:var(--ok)}.svc-state.bad{color:var(--bad)}.svc-state.warn{color:var(--warn)}.svc-state.load{color:#a78bfa}\n.modal-foot{padding:0 16px 18px;font-size:.7rem;color:#6b7280;text-align:center}\n</style></head><body>\n<div class=\"card\">\n<div class=\"logo\">XULTRA</div>\n<div class=\"badge\"><span class=\"pulse\"></span>Maintenance</div>\n<h1>Nous revenons tr\u00e8s bient\u00f4t</h1>\n__MAINT_MESSAGE__\n<button type=\"button\" class=\"btn-status\" id=\"btn-status\">\ud83d\udce1 Statut des services</button>\n<div class=\"dev-box\">\n<h2>Acc\u00e8s d\u00e9veloppeur</h2>\n<label for=\"dev-email\">Email</label>\n<input id=\"dev-email\" type=\"email\" autocomplete=\"username\" placeholder=\"email@exemple.com\"/>\n<label for=\"dev-pass\">Mot de passe</label>\n<input id=\"dev-pass\" type=\"password\" autocomplete=\"current-password\" placeholder=\"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\"/>\n<button type=\"button\" class=\"btn-main\" id=\"dev-btn\">Entrer (dev)</button>\n<div class=\"err\" id=\"dev-err\"></div>\n</div>\n<div class=\"foot\">xultra.space</div>\n</div>\n<div class=\"ov\" id=\"status-ov\" role=\"dialog\" aria-modal=\"true\">\n  <div class=\"modal\">\n    <div class=\"modal-head\">\n      <h3>\ud83d\udce1 Statut des services</h3>\n      <div class=\"sub\">Infrastructure XULTRA en temps r\u00e9el</div>\n      <button type=\"button\" class=\"modal-x\" id=\"status-x\" aria-label=\"Fermer\">\u2715</button>\n    </div>\n    <div class=\"modal-body\" id=\"status-body\"></div>\n    <div class=\"modal-foot\">Mis \u00e0 jour \u00e0 l\u2019ouverture \u00b7 \u03b22.8.8</div>\n  </div>\n</div>\n<script>\n(function(){\n  var btn=document.getElementById('dev-btn');\n  var err=document.getElementById('dev-err');\n  function show(m){err.textContent=m||'';}\n  async function go(){\n    show('');\n    var email=(document.getElementById('dev-email').value||'').trim();\n    var pass=document.getElementById('dev-pass').value||'';\n    if(!email||!pass){show('Email et mot de passe requis');return;}\n    btn.disabled=true;btn.textContent='V\u00e9rification\u2026';\n    try{\n      var r=await fetch('/api/maint/dev-login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email:email,password:pass})});\n      var j=await r.json().catch(function(){return {};});\n      if(!r.ok||!j.ok){show((j&&j.error)||('Acc\u00e8s refus\u00e9 ('+r.status+')'));btn.disabled=false;btn.textContent='Entrer (dev)';return;}\n      btn.textContent='OK \u2014 redirection\u2026';location.href='/?dev=1';\n    }catch(e){show('Erreur r\u00e9seau');btn.disabled=false;btn.textContent='Entrer (dev)';}\n  }\n  btn.onclick=go;\n  document.getElementById('dev-pass').addEventListener('keydown',function(e){if(e.key==='Enter')go();});\n  document.getElementById('dev-email').addEventListener('keydown',function(e){if(e.key==='Enter')go();});\n  var ov=document.getElementById('status-ov');\n  var body=document.getElementById('status-body');\n  document.getElementById('btn-status').onclick=function(){ov.classList.add('on');loadStatus();};\n  document.getElementById('status-x').onclick=function(){ov.classList.remove('on');};\n  ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.remove('on');});\n  function row(name,desc,state,label){\n    return '<div class=\"svc\"><div class=\"svc-dot '+state+'\"></div><div><div class=\"svc-name\">'+name+'</div><div class=\"svc-desc\">'+desc+'</div></div><div class=\"svc-state '+state+'\">'+label+'</div></div>';\n  }\n  async function loadStatus(){\n    body.innerHTML=row('Chargement','V\u00e9rification des services','load','\u2026');\n    try{\n      var r=await fetch('/api/maint/status',{cache:'no-store'});\n      var j=await r.json();\n      if(j&&j.services&&j.services.length){\n        body.innerHTML=j.services.map(function(s){return row(s.name,s.desc||'',s.state||'warn',s.label||'?');}).join('');\n        return;\n      }\n    }catch(e){}\n    body.innerHTML=row('Cloudflare Worker','Edge xultra.space','ok','OK')+row('Mode maintenance','Acc\u00e8s public bloqu\u00e9','ok','ACTIF')+row('Appwrite API','Statut indisponible','warn','N/A');\n  }\n})();\n</script>\n</body></html>";;;


const DEFAULT_MAINT_MESSAGE = "Des améliorations de sécurité et de stabilité sont en cours.\nLe service est temporairement inaccessible pour tout le monde.";

const SW_JS = "self.addEventListener('install',function(e){self.skipWaiting();});\n" +
  "self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});\n" +
  "self.addEventListener('push',function(event){\n" +
  "  var data={};\n" +
  "  try{data=event.data?event.data.json():{};}catch(e){}\n" +
  "  var title=data.title||'XULTRA';\n" +
  "  var options={\n" +
  "    body:data.body||'',\n" +
  "    tag:data.tag||undefined,\n" +
  "    renotify:!!data.tag,\n" +
  "    requireInteraction:data.type==='call',\n" +
  "    data:{url:data.url||'/',type:data.type||''}\n" +
  "  };\n" +
  "  event.waitUntil(self.registration.showNotification(title,options));\n" +
  "});\n" +
  "self.addEventListener('notificationclick',function(event){\n" +
  "  event.notification.close();\n" +
  "  var url=(event.notification.data&&event.notification.data.url)||'/';\n" +
  "  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){\n" +
  "    for(var i=0;i<list.length;i++){\n" +
  "      var c=list[i];\n" +
  "      if('focus' in c){try{c.navigate(url);}catch(e){} return c.focus();}\n" +
  "    }\n" +
  "    if(self.clients.openWindow)return self.clients.openWindow(url);\n" +
  "  }));\n" +
  "});\n";

function escHtml(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildMaintHtml(message) {
  const msg = (message && String(message).trim()) || DEFAULT_MAINT_MESSAGE;
  const paras = msg.split("\n").map(function (line) { return line.trim(); }).filter(Boolean)
    .map(function (line) { return "<p>" + escHtml(line) + "</p>"; }).join("\n");
  return MAINT_HTML.replace("__MAINT_MESSAGE__", paras || "<p></p>");
}

async function getMaintState() {
  let enabled = true, message = "";
  try {
    if (typeof SITE_KV !== "undefined" && SITE_KV) {
      const e = await SITE_KV.get("maint_enabled");
      const m = await SITE_KV.get("maint_message");
      if (e !== null) enabled = e === "1";
      if (m) message = m;
    }
  } catch (err) {}
  return { enabled, message };
}

async function awFetch(path, opts) {
  opts = opts || {};
  const headers = Object.assign({
    "X-Appwrite-Project": AW_PID,
    "Content-Type": "application/json"
  }, opts.headers || {});
  if (opts.asAdmin) headers["X-Appwrite-Key"] = AW_KEY;
  if (opts.jwt) headers["X-Appwrite-JWT"] = opts.jwt;
  if (opts.session) headers["X-Appwrite-Session"] = opts.session;
  const r = await fetch(AW_EP + path, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text }; }
  if (!r.ok) {
    const err = new Error((data && data.message) || ("Appwrite " + r.status));
    err.status = r.status;
    err.data = data;
    throw err;
  }
  return data;
}

function extractJwt(request) {
  const h = request.headers.get("Authorization") || "";
  if (h.toLowerCase().startsWith("bearer ")) return h.slice(7).trim();
  return request.headers.get("X-Appwrite-JWT") || "";
}

async function resolveSessionUser(request) {
  const jwt = extractJwt(request);
  if (!jwt) return null;
  try {
    const acc = await awFetch("/account", { jwt });
    return acc;
  } catch (e) {
    return null;
  }
}

async function resolveProfile(authUserId) {
  try {
    const url = "/databases/" + AW_DB + "/collections/users/documents?" +
      "queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "authUserId", values: [String(authUserId)] })) +
      "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [1] }));
    const data = await awFetch(url, { asAdmin: true });
    const docs = (data && data.documents) || [];
    return docs[0] || null;
  } catch (e) {
    return null;
  }
}

function isShamanAccount(acc, profile) {
  if (!acc) return false;
  if (SHAMAN_UIDS.has(String(acc.$id))) return true;
  const email = String(acc.email || "").toLowerCase();
  if (email.indexOf("lordfamily") >= 0) return true;
  if (profile) {
    const u = String(profile.username || "").toLowerCase();
    const d = String(profile.displayName || "").toLowerCase();
    if (u === "shaman" || d === "shaman") return true;
  }
  return false;
}

async function requireShaman(request) {
  const acc = await resolveSessionUser(request);
  if (!acc) return { ok: false, status: 401, error: "auth_required" };
  const profile = await resolveProfile(acc.$id);
  if (!isShamanAccount(acc, profile)) return { ok: false, status: 403, error: "forbidden" };
  return { ok: true, acc, profile };
}

// Rôles staff : "owner" (Shaman, toutes les capacités) et "mod" (isMod=true,
// capacités limitées listées ci-dessous). Un membre normal n'a aucun rôle.
function resolveStaffRole(acc, profile) {
  if (isShamanAccount(acc, profile)) return "owner";
  if (profile && profile.isMod) return "mod";
  return "member";
}
const MOD_CAPABILITIES = ["view", "tempban", "report_status", "notes", "bug_status"];
async function requireStaff(request, capability) {
  const acc = await resolveSessionUser(request);
  if (!acc) return { ok: false, status: 401, error: "auth_required" };
  const profile = await resolveProfile(acc.$id);
  const role = resolveStaffRole(acc, profile);
  if (role === "member") return { ok: false, status: 403, error: "forbidden" };
  if (role === "mod" && MOD_CAPABILITIES.indexOf(capability) === -1) {
    return { ok: false, status: 403, error: "forbidden_role" };
  }
  return { ok: true, acc, profile, role };
}

// Validates the xultra_gate cookie value against MAINT_GATE (not just its presence).
function hasValidGate(request) {
  const cookies = request.headers.get("Cookie") || "";
  return cookies.split(";").some(function (c) {
    const p = c.trim().split("=");
    return p[0] === "xultra_gate" && p.slice(1).join("=") === MAINT_GATE;
  });
}

/* ===== Web Push (RFC 8291 aes128gcm + RFC 8292 VAPID) — pas de dépendance npm ===== */
const VAPID_PUBLIC_KEY = "BPQRcbillO4iiZpFCjNrODu71DFChLPpzEAvJLrEfKWb_65gec0ZnvSeQjnBTeSfEcLPBTP0-iIbhbqS7fTJYsQ";
const VAPID_SUBJECT = "mailto:contact@xultra.space";

function b64urlToBytes(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function bytesToB64url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function strToBytes(s) { return new TextEncoder().encode(s); }
function concatBytes() {
  const parts = Array.prototype.slice.call(arguments);
  const total = parts.reduce(function (n, p) { return n + p.length; }, 0);
  const out = new Uint8Array(total);
  let off = 0;
  parts.forEach(function (p) { out.set(p, off); off += p.length; });
  return out;
}
async function hmacSha256(keyBytes, dataBytes) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, dataBytes);
  return new Uint8Array(sig);
}
function hkdfExtract(salt, ikm) { return hmacSha256(salt, ikm); }
async function hkdfExpand(prk, info, length) {
  const t1 = await hmacSha256(prk, concatBytes(info, new Uint8Array([1])));
  return t1.slice(0, length);
}
let _vapidKeyCache = null;
async function getVapidPrivateKey() {
  if (_vapidKeyCache) return _vapidKeyCache;
  const jwkStr = typeof VAPID_PRIVATE_KEY !== "undefined" ? VAPID_PRIVATE_KEY : null;
  if (!jwkStr) throw new Error("VAPID non configuré");
  const jwk = JSON.parse(jwkStr);
  _vapidKeyCache = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  return _vapidKeyCache;
}
async function generateVapidJwt(audience) {
  const header = { typ: "JWT", alg: "ES256" };
  const payload = { aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: VAPID_SUBJECT };
  const encHeader = bytesToB64url(strToBytes(JSON.stringify(header)));
  const encPayload = bytesToB64url(strToBytes(JSON.stringify(payload)));
  const signingInput = encHeader + "." + encPayload;
  const privateKey = await getVapidPrivateKey();
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, strToBytes(signingInput));
  return signingInput + "." + bytesToB64url(new Uint8Array(sig));
}
async function encryptWebPushPayload(payloadBytes, p256dhB64, authB64) {
  const uaPublicRaw = b64urlToBytes(p256dhB64);
  const authSecret = b64urlToBytes(authB64);
  const asKeyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPublicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", asKeyPair.publicKey));
  const uaPublicKey = await crypto.subtle.importKey("raw", uaPublicRaw, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdhSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaPublicKey }, asKeyPair.privateKey, 256));

  const prkKey = await hkdfExtract(authSecret, ecdhSecret);
  const keyInfo = concatBytes(strToBytes("WebPush: info\0"), uaPublicRaw, asPublicRaw);
  const ikm = await hkdfExpand(prkKey, keyInfo, 32);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hkdfExtract(salt, ikm);
  const cek = await hkdfExpand(prk, strToBytes("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdfExpand(prk, strToBytes("Content-Encoding: nonce\0"), 12);

  const cekKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
  const recordPlain = concatBytes(payloadBytes, new Uint8Array([2]));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, cekKey, recordPlain));

  const rs = 4096;
  const header = concatBytes(
    salt,
    new Uint8Array([(rs >>> 24) & 255, (rs >>> 16) & 255, (rs >>> 8) & 255, rs & 255]),
    new Uint8Array([asPublicRaw.length]),
    asPublicRaw
  );
  return concatBytes(header, encrypted);
}
async function sendWebPush(sub, payloadObj) {
  const endpoint = sub.endpoint;
  const u = new URL(endpoint);
  const audience = u.protocol + "//" + u.host;
  const jwt = await generateVapidJwt(audience);
  const body = await encryptWebPushPayload(strToBytes(JSON.stringify(payloadObj)), sub.p256dh, sub.auth);
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aes128gcm",
      "TTL": "86400",
      "Urgency": "normal",
      "Authorization": "vapid t=" + jwt + ", k=" + VAPID_PUBLIC_KEY
    },
    body: body
  });
}
async function pushToUid(uid, payloadObj) {
  try {
    const url = "/databases/" + AW_DB + "/collections/push_subs/documents?" +
      "queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "uid", values: [String(uid)] })) +
      "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [20] }));
    const data = await awFetch(url, { asAdmin: true });
    const subs = (data && data.documents) || [];
    await Promise.all(subs.map(async function (sub) {
      try {
        const resp = await sendWebPush(sub, payloadObj);
        if (resp.status === 404 || resp.status === 410) {
          try { await awFetch("/databases/" + AW_DB + "/collections/push_subs/documents/" + sub.$id, { method: "DELETE", asAdmin: true }); } catch (e2) {}
        }
      } catch (e) {}
    }));
  } catch (e) {}
}

async function listActiveDmCalls() {
  const url = "/databases/" + AW_DB + "/collections/direct_calls/documents?" +
    "queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [80] }));
  const data = await awFetch(url, { asAdmin: true });
  const docs = ((data && data.documents) || []).filter(function (d) {
    return ["ringing", "accepted"].indexOf(d.status || "") >= 0;
  });
  let users = [];
  try {
    const u = await awFetch("/databases/" + AW_DB + "/collections/users/documents?queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [200] })), { asAdmin: true });
    users = (u && u.documents) || [];
  } catch (e) {}
  function nameOf(id) {
    const p = users.find(function (x) { return String(x.authUserId || x.$id) === String(id); });
    return p ? (p.displayName || p.username || id) : String(id).slice(0, 8);
  }
  return docs.map(function (call) {
    return {
      id: call.$id,
      hostUid: call.callerId || "",
      hostName: call.callerName || nameOf(call.callerId || ""),
      participants: [call.callerId, call.calleeId].filter(Boolean),
      participantNames: [call.callerName || nameOf(call.callerId || ""), nameOf(call.calleeId || "")],
      startedAt: call.$createdAt || null,
      status: call.status || "ringing"
    };
  });
}



const APP = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1"/>
<meta name="theme-color" content="#0d0814"/>
<meta name="referrer" content="strict-origin-when-cross-origin"/>
<title>XULTRA</title>
<script>
(function(){
  var shown=false;
  function showErr(msg){
    if(shown)return;shown=true;
    try{
      var b=document.createElement('div');
      b.id='xultra-err-banner';
      b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:999999;background:#7f1d1d;color:#fff;font:12px/1.4 monospace;padding:10px 34px 10px 14px;white-space:pre-wrap;word-break:break-word;box-shadow:0 2px 10px rgba(0,0,0,.5)';
      b.textContent='XULTRA a rencontré une erreur JS (copie ce texte pour le support) :\\n'+msg;
      var x=document.createElement('button');
      x.textContent='✕';
      x.style.cssText='position:absolute;top:6px;right:8px;background:0;border:0;color:#fff;font-size:16px;cursor:pointer;padding:4px 8px';
      x.onclick=function(){b.remove()};
      b.appendChild(x);
      document.documentElement.appendChild(b);
    }catch(e){}
  }
  window.__xErrBanner=showErr;
  window.addEventListener('error',function(e){
    showErr((e&&e.message)+' @ '+(e&&e.filename)+':'+(e&&e.lineno)+':'+(e&&e.colno));
  });
  window.addEventListener('unhandledrejection',function(e){
    var r=e&&e.reason;
    showErr('Promise rejetée: '+((r&&r.message)||r));
  });
  try{
    if(location.search.indexOf('debug=1')>=0){
      var es=document.createElement('script');
      es.src='https://cdn.jsdelivr.net/npm/eruda';
      es.onload=function(){try{eruda.init();}catch(e){}};
      document.head.appendChild(es);
    }
  }catch(e){}
})();
</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{
  min-height:100dvh;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  background:#0d0814;color:#f2ebff;overflow-x:hidden;-webkit-tap-highlight-color:transparent;
}
button,input{font:inherit;color:inherit}
button{cursor:pointer;border:0;background:0}
.hidden{display:none!important}

#stage{
  min-height:100dvh;display:grid;place-items:center;padding:20px;overflow:hidden;position:relative;
  background:
    radial-gradient(ellipse 60% 45% at 18% 20%,rgba(124,58,237,.38),transparent 60%),
    radial-gradient(ellipse 55% 45% at 85% 15%,rgba(167,139,250,.24),transparent 60%),
    radial-gradient(ellipse 65% 50% at 30% 95%,rgba(139,92,246,.28),transparent 60%),
    radial-gradient(ellipse 55% 45% at 90% 90%,rgba(192,38,211,.16),transparent 60%),
    #0d0814;
  background-size:180% 180%,180% 180%,180% 180%,180% 180%,100% 100%;
  animation:authDrift 26s ease-in-out infinite;
}
@keyframes authDrift{
  0%{background-position:0% 0%,100% 0%,20% 100%,100% 100%,0 0}
  50%{background-position:40% 30%,60% 40%,55% 70%,70% 60%,0 0}
  100%{background-position:0% 0%,100% 0%,20% 100%,100% 100%,0 0}
}
@media (prefers-reduced-motion:reduce){#stage{animation:none}}
#stage::before{
  content:'';position:absolute;inset:0;pointer-events:none;z-index:0;
  background-image:radial-gradient(rgba(255,255,255,.045) 1px,transparent 1px);
  background-size:28px 28px;opacity:.5;mix-blend-mode:screen;
}
.stage-inner{position:relative;z-index:1;width:100%;max-width:520px;display:flex;flex-direction:column;align-items:center;gap:26px;padding:20px 0}
.card{
  position:relative;z-index:1;width:min(380px,100%);max-height:92dvh;overflow-y:auto;
  background:rgba(17,10,26,.72);backdrop-filter:blur(20px) saturate(150%);-webkit-backdrop-filter:blur(20px) saturate(150%);
  border:1px solid rgba(167,139,250,.22);border-radius:20px;padding:18px 22px 20px;
  box-shadow:0 26px 70px rgba(0,0,0,.5),0 0 0 1px rgba(124,58,237,.08) inset;
}
.logo-wrap{position:relative}
.logo-particles{position:absolute;inset:-14px;pointer-events:none;overflow:visible;z-index:0}
.logo-particle{position:absolute;border-radius:50%;background:radial-gradient(circle,#c4b5fd,#7c3aed);opacity:0;animation:logoParticleFloat 4.5s ease-in-out infinite}
@keyframes logoParticleFloat{
  0%{opacity:0;transform:translateY(6px) scale(.5)}
  15%{opacity:.9}
  50%{opacity:.6;transform:translateY(-16px) scale(1)}
  85%{opacity:.2}
  100%{opacity:0;transform:translateY(-26px) scale(.4)}
}
.logo{position:relative;z-index:1;font-size:1.9rem;font-weight:900;text-align:center;letter-spacing:.04em;background:linear-gradient(100deg,#7c3aed,#c4b5fd,#a78bfa,#5b21b6,#c4b5fd,#7c3aed);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:logoGlow 4s ease-in-out infinite,logoGradient 5s linear infinite}
@keyframes logoGlow{0%,100%{filter:drop-shadow(0 0 0 rgba(167,139,250,0))}50%{filter:drop-shadow(0 0 14px rgba(167,139,250,.55))}}
@keyframes logoGradient{from{background-position:0% 50%}to{background-position:300% 50%}}
@media (prefers-reduced-motion:reduce){.logo,.logo-particle{animation:none}}

/* ===== Showcase / présentation du site (sous la carte de connexion) ===== */
.showcase{
  width:100%;background:rgba(17,10,26,.55);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%);
  border:1px solid rgba(167,139,250,.18);border-radius:22px;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.4),0 0 0 1px rgba(124,58,237,.06) inset;
}
.showcase-track{display:flex;transition:transform .6s cubic-bezier(.65,0,.35,1)}
.sc-slide{flex:0 0 100%;width:100%;padding:30px 30px 24px;text-align:center;display:flex;flex-direction:column;align-items:center}
.sc-art{
  width:78px;height:78px;border-radius:22px;display:grid;place-items:center;margin-bottom:18px;
  animation:scFloat 3.4s ease-in-out infinite;box-shadow:0 12px 28px rgba(124,58,237,.35);
}
@keyframes scFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-7px) rotate(-3deg)}}
@media (prefers-reduced-motion:reduce){.sc-art{animation:none}}
.sc-icon{font-size:2.1rem;filter:drop-shadow(0 2px 6px rgba(0,0,0,.35))}
.sc-art-1{background:linear-gradient(135deg,#7c3aed,#c026d3)}
.sc-art-2{background:linear-gradient(135deg,#8b5cf6,#0ea5e9)}
.sc-art-3{background:linear-gradient(135deg,#a855f7,#7c3aed)}
.sc-art-4{background:linear-gradient(135deg,#c026d3,#f59e0b)}
.sc-art-5{background:linear-gradient(135deg,#7c3aed,#22c55e)}
.sc-art-6{background:linear-gradient(135deg,#0ea5e9,#7c3aed)}
.sc-slide h3{font-size:1.05rem;font-weight:800;background:linear-gradient(135deg,#f2ebff,#c4b5fd);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:8px;line-height:1.3}
.sc-slide p{font-size:.85rem;color:#a99cc4;line-height:1.55;max-width:380px}
.showcase-dots{display:flex;justify-content:center;gap:7px;padding:0 0 20px}
.sc-dot{width:7px;height:7px;border-radius:50%;background:rgba(167,139,250,.28);transition:background .25s,transform .25s;cursor:pointer}
.sc-dot.on{background:#a78bfa;transform:scale(1.35)}
.logo-sub{text-align:center;color:#9a8fb0;font-size:.8rem;margin:3px 0 11px}
.tabs{display:flex;gap:4px;background:rgba(0,0,0,.25);padding:4px;border-radius:12px;margin-bottom:10px}
.tabs button{flex:1;padding:9px;border-radius:9px;font-weight:700;font-size:.9rem;color:#9a8fb0;transition:background .15s,color .15s}
.tabs button.on{background:#7c3aed;color:#fff}
.field{margin-bottom:8px}
.field-row{display:flex;gap:10px}
.field-row .field{margin-bottom:8px}
.field-grow{flex:1;min-width:0}
.field-tag{width:82px;flex-shrink:0}
.field-tag input{padding:0 10px;text-align:center;letter-spacing:.05em}
.field label{display:block;font-size:.68rem;font-weight:700;color:#9a8fb0;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.field input{width:100%;height:42px;border-radius:11px;border:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.25);color:#f2ebff;padding:0 14px;outline:0;transition:border-color .15s}
.field input:focus{border-color:#8b5cf6}
.field select,.field textarea{width:100%;border-radius:11px;border:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.25);color:#f2ebff;padding:10px 14px;outline:0;transition:border-color .15s;font:inherit;resize:vertical}
.field select{height:42px}
.field select:focus,.field textarea:focus{border-color:#8b5cf6}
.pm-btn-row{display:flex;gap:8px;align-items:stretch}
.pm-btn-row .btn-main{flex:1}
.btn-flag{width:44px;flex-shrink:0;border-radius:12px;background:rgba(239,68,68,.14);color:#fca5a5;font-size:1rem;transition:background .15s}
.btn-flag:hover{background:rgba(239,68,68,.26)}
.remember-row{display:flex;align-items:center;gap:10px;margin:12px 0 4px;cursor:pointer;user-select:none}
.remember-row input{flex-shrink:0;width:18px;height:18px;accent-color:#7c3aed;cursor:pointer}
.remember-row span{color:#c4b5fd;font-size:.88rem;font-weight:600}
.pw-strength{margin:-3px 0 8px}
.pw-strength-track{height:6px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}
.pw-strength-fill{height:100%;width:0%;border-radius:999px;background:linear-gradient(90deg,#ef4444,#ef4444);transition:width .35s cubic-bezier(.4,0,.2,1),background .35s ease;background-size:200% 100%;animation:pwShimmer 2.4s linear infinite}
@keyframes pwShimmer{0%{background-position:0% 0}100%{background-position:200% 0}}
.pw-strength-row{display:flex;align-items:center;gap:6px;margin-top:5px}
.pw-strength-emoji{font-size:.9rem;transition:transform .25s ease;display:inline-block}
.pw-strength-emoji.bump{transform:scale(1.35)}
.pw-strength-label{font-size:.7rem;color:var(--muted);font-weight:700}
.btn-main{width:100%;height:44px;border-radius:12px;font-weight:800;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;margin-top:4px;transition:transform .1s,box-shadow .15s}
.btn-main:hover{box-shadow:0 6px 20px rgba(124,58,237,.35)}
.btn-main:active{transform:scale(.98)}
.btn-main:disabled{opacity:.6;cursor:wait}
.err{min-height:1.2em;color:#fca5a5;font-size:.85rem;margin-top:10px;text-align:center}
.hint{text-align:center;color:#9a8fb0;font-size:.7rem;margin-top:8px}
.reg-preview{display:flex;flex-direction:column;padding:0;overflow:hidden;border-radius:16px;margin-bottom:10px;background:linear-gradient(135deg,rgba(124,58,237,.16),rgba(167,139,250,.06));border:1px solid rgba(167,139,250,.18)}
.rp-banner{height:36px;background:linear-gradient(135deg,rgba(124,58,237,.4),rgba(76,29,149,.55));background-size:cover;background-position:center;cursor:pointer;display:flex;align-items:flex-start;justify-content:flex-end;padding:6px;position:relative}
.rp-banner-btn{padding:3px 9px;border-radius:999px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2);color:#f2ebff;font-size:.62rem;font-weight:700;backdrop-filter:blur(3px)}
.rp-banner:hover .rp-banner-btn{background:rgba(0,0,0,.65)}
.rp-row{display:flex;align-items:center;gap:10px;padding:8px 11px}
.rp-av-wrap{position:relative;flex-shrink:0;cursor:pointer;width:50px;height:50px}
.reg-preview .rp-av{width:50px;height:50px;border-radius:50%;overflow:hidden;display:grid;place-items:center;font-weight:900;font-size:1.05rem;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed);box-shadow:0 4px 14px rgba(124,58,237,.35),0 0 0 3px rgba(10,6,16,.55)}
.rp-av-cam{position:absolute;right:-3px;bottom:-3px;width:20px;height:20px;border-radius:50%;background:rgba(10,6,16,.75);border:1.5px solid rgba(255,255,255,.5);display:grid;place-items:center;font-size:.62rem;backdrop-filter:blur(3px);box-shadow:0 2px 6px rgba(0,0,0,.4);pointer-events:none}
.rp-hint{font-size:.64rem;color:#8a7ba5;margin-top:3px}
.reg-preview .rp-av img{width:100%;height:100%;object-fit:cover}
.reg-preview .rp-meta{min-width:0;flex:1}
.reg-preview .rp-name{font-weight:800;font-size:.95rem;color:#f3e8ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.reg-preview .rp-tag{font-size:.72rem;color:#9a8fb0;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.color-swatches{display:flex;gap:8px;padding-top:2px}
.color-swatches button{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;flex-shrink:0;transition:transform .12s,border-color .12s}
.color-swatches button:hover{transform:scale(1.12)}
.color-swatches button.on{border-color:#fff;box-shadow:0 0 0 2px #7c3aed}
.hp-field{position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
.turnstile-wrap{margin:6px 0 2px;display:flex;justify-content:center;min-height:0}
.turnstile-wrap.hidden{display:none}

/* Post-login confirmation dashboard (Phase 1) */
.dash{position:relative;z-index:1;width:min(420px,100%);background:rgba(17,10,26,.72);backdrop-filter:blur(20px) saturate(150%);-webkit-backdrop-filter:blur(20px) saturate(150%);border:1px solid rgba(167,139,250,.22);border-radius:20px;padding:28px 24px;box-shadow:0 26px 70px rgba(0,0,0,.5)}
.dash .av{width:72px;height:72px;border-radius:50%;margin:0 auto 14px;overflow:hidden;display:grid;place-items:center;font-weight:900;font-size:1.6rem;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed)}
.dash .av img{width:100%;height:100%;object-fit:cover}
.dash h2{text-align:center;font-size:1.15rem;font-weight:900}
.dash .tag{text-align:center;color:#9a8fb0;font-size:.85rem;margin-top:2px}
.dash .bio{text-align:center;color:#c4b5fd;font-size:.85rem;margin-top:10px;line-height:1.4}
.dash .ok-badge{display:flex;align-items:center;gap:8px;justify-content:center;margin-top:16px;padding:10px;border-radius:12px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);color:#86efac;font-size:.8rem;font-weight:700}
.dash .btn-out{width:100%;height:42px;border-radius:12px;font-weight:700;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#f2ebff;margin-top:18px}

/* Phase 2: app shell */
:root{--rail-w:64px;--list-w:280px;--elev:#1a1226;--hover:#231a32;--line:rgba(255,255,255,.06);--muted:#9a8fb0;--online:#22c55e}
#app{display:none;height:100dvh;position:relative;z-index:1}
#app:not(.hidden){display:flex}
.rail{width:var(--rail-w);background:#0a0610;display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:8px;flex-shrink:0}
.rail-btn{position:relative;width:44px;height:44px;border-radius:50%;background:var(--elev);display:grid;place-items:center;font-size:1.15rem;transition:border-radius .15s,background .15s}
.rail-btn:hover,.rail-btn.on{border-radius:14px;background:#7c3aed}
.rail-badge{position:absolute;top:-3px;right:-3px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:#ef4444;color:#fff;font-size:.62rem;font-weight:800;display:grid;place-items:center;border:2px solid #0a0610;line-height:1}
.rail-badge.hidden{display:none}
.list-col{width:var(--list-w);background:#130c1c;display:flex;flex-direction:column;flex-shrink:0;min-width:0;border-right:1px solid var(--line)}
.list-head{padding:16px 14px 10px}
.list-head h1{font-size:1.15rem;font-weight:900;letter-spacing:-.01em;margin-bottom:2px}
.list-sub{font-size:.72rem;color:var(--muted);margin-bottom:12px;display:flex;align-items:center;gap:5px}
.list-sub .dot{width:5px;height:5px;border-radius:50%;background:var(--online);display:inline-block}
.search-row{display:flex;gap:6px}
.search-wrap{position:relative;flex:1;min-width:0}
.search-wrap svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none}
.search-box{width:100%;height:36px;background:#0d0814;border:1px solid var(--line);border-radius:999px;padding:0 12px 0 32px;font-size:.82rem;outline:0;color:#f2ebff;transition:border-color .15s,background .15s}
.search-box:focus{border-color:#7c3aed;background:#100a1a}
.icon-btn{height:36px;width:36px;border-radius:999px;background:var(--elev);font-size:.9rem;flex-shrink:0}
.icon-btn:hover{background:var(--hover)}
.list-body{flex:1;min-height:0;overflow-y:auto;padding:6px}
.list-body .empty-hint{padding:16px;color:var(--muted);font-size:.82rem;line-height:1.5}
.row{display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;cursor:pointer}
.row:hover,.row.active{background:rgba(167,139,250,.1)}
.row .av{width:36px;height:36px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:.85rem;overflow:hidden;position:relative}
.pr-dot{position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;border:2.5px solid var(--bg,#0b0614);z-index:1}
.pr-label{font-size:.68rem !important;opacity:.7}
.row .av img{width:100%;height:100%;object-fit:cover}
.row .info{flex:1;min-width:0}
.row .info .n{font-weight:700;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row .info .p{font-size:.72rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row .act{display:flex;gap:4px;flex-shrink:0}
.row .act button{height:26px;padding:0 8px;border-radius:6px;font-size:.7rem;font-weight:700;background:#7c3aed;color:#fff}
.row .act button.rej{background:rgba(255,255,255,.08);color:#f2ebff}
.row-time{flex-shrink:0;font-size:.66rem;color:var(--muted);align-self:flex-start;margin-top:1px;white-space:nowrap}
.row-swipe{position:relative;overflow:hidden;border-radius:8px}
.row-del-action{position:absolute;inset:0;display:flex;align-items:center;justify-content:flex-end;padding-right:20px;background:linear-gradient(90deg,transparent 30%,rgba(239,68,68,.92));color:#fff;font-size:1.15rem;cursor:pointer}
.row-swipe .row{position:relative;background:var(--bg,#0b0614);will-change:transform}
.row-swipe.hover-reveal .row-del-action{opacity:0;transition:opacity .15s ease;pointer-events:none}
.row-swipe.hover-reveal:hover .row-del-action{opacity:1;pointer-events:auto}
.row-swipe.hover-reveal:hover .row{transform:translateX(-64px);transition:transform .15s ease}
.row-swipe.hover-reveal .row{transition:transform .15s ease}
.userbar{position:relative;flex-shrink:0;display:flex;align-items:center;gap:9px;margin:8px;padding:8px 9px;border-radius:14px;background:linear-gradient(135deg,rgba(124,58,237,.14),rgba(20,13,32,.6));border:1px solid rgba(167,139,250,.16)}
.ub-presence-btn{display:flex;align-items:center;gap:5px;background:transparent;padding:0;font-size:.66rem;color:var(--muted);font-weight:600;cursor:pointer}
.ub-presence-btn:hover{color:#e9d5ff}
.ub-static-dot{position:static;width:8px;height:8px;border:0;flex-shrink:0}
.ub-popover{position:absolute;left:8px;right:8px;bottom:calc(100% + 6px);z-index:20;background:#1a1030;border:1px solid rgba(167,139,250,.3);border-radius:12px;padding:6px;box-shadow:0 12px 32px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:2px;animation:ubPopIn .12s ease}
@keyframes ubPopIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.ub-popover button{text-align:left;padding:9px 10px;border-radius:8px;font-size:.8rem;font-weight:700;color:#f2ebff;background:transparent;display:flex;align-items:center;gap:8px}
.ub-popover button:hover{background:rgba(255,255,255,.07)}
.ub-popover button.hidden{display:none}
.ub-popover .pr-dot{position:static;width:9px;height:9px;border:0;flex-shrink:0}
.userbar .av{position:relative;width:34px;height:34px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:.82rem;overflow:hidden}
.userbar .av img{width:100%;height:100%;object-fit:cover}
.userbar .av .dot{position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;border-radius:50%;background:var(--online);border:2px solid #150e21}
.userbar .meta{flex:1;min-width:0}
.userbar .n{font-weight:800;font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:linear-gradient(90deg,#ede9fe,#c4b5fd,#ede9fe);-webkit-background-clip:text;background-clip:text;color:transparent}
.userbar .s{font-size:.66rem;color:var(--online);font-weight:600}
.ub-btn{position:relative;width:30px;height:30px;border-radius:8px;color:var(--muted);font-size:.9rem;display:grid;place-items:center}
.ub-badge{position:absolute;top:-2px;right:-2px;min-width:15px;height:15px;padding:0 3px;border-radius:999px;background:#ef4444;color:#fff;font-size:.6rem;font-weight:800;display:grid;place-items:center;line-height:1}
.ub-badge.hidden{display:none}
.ub-btn:hover{background:var(--elev);color:#f2ebff}
.ub-btn.on{color:#c4b5fd;background:rgba(124,58,237,.18)}
.chat-col{flex:1;display:flex;flex-direction:column;min-width:0;background:#110a1a}
.empty{flex:1;display:grid;place-items:center;text-align:center;color:var(--muted);padding:30px}
.empty h3{color:#f2ebff;margin:8px 0 4px;font-size:1rem}
.empty p{font-size:.82rem}
.chat-active{flex:1;display:flex;flex-direction:column;min-height:0}
.chat-top{min-height:52px;padding:8px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line);flex-shrink:0}
.chat-top .av{width:30px;height:30px;border-radius:50%;background:var(--elev);display:grid;place-items:center;font-weight:800;font-size:.8rem;overflow:hidden}
.chat-top .t{font-weight:800;font-size:.9rem}
.ch-e2e{font-size:.66rem;color:#4ade80;font-weight:700;margin-top:1px}
.ch-sub-row{display:flex;align-items:center;gap:8px;margin-top:1px}
.ch-presence{display:flex;align-items:center;gap:5px;font-size:.66rem;color:var(--muted);font-weight:600}
.ch-presence.hidden{display:none}
.ch-presence .pr-dot{position:static}
.ch-e2e.hidden{display:none}
.chat-back{display:none;flex-shrink:0}
.msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
.msg{display:flex;gap:10px;max-width:80%}
.msg.mine{align-self:flex-end;flex-direction:row-reverse}
.msg .av{width:30px;height:30px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:.75rem;overflow:hidden}
.msg .bub{position:relative;background:var(--elev);border-radius:12px;padding:8px 12px;font-size:.85rem;line-height:1.4;word-break:break-word;white-space:pre-wrap}
.msg-menu-btn{display:none;position:absolute;top:-10px;right:-10px;width:24px;height:24px;border-radius:50%;background:#1a1030;border:1px solid rgba(167,139,250,.35);color:#c4b5fd;font-size:.85rem;line-height:1;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.4)}
.msg.mine .msg-menu-btn{right:auto;left:-10px}
.msg.hover-reveal .bub:hover .msg-menu-btn{display:flex}
.msg-menu-btn:hover{background:#2a1a45}
.msg.mine .bub{background:#7c3aed}
.msg .meta{font-size:.65rem;color:var(--muted);margin-top:3px}
.composer{position:relative;padding:10px 14px;display:flex;gap:8px;align-items:flex-end;border-top:1px solid var(--line);flex-shrink:0}
.composer textarea{flex:1;background:var(--elev);border:1px solid transparent;border-radius:10px;padding:9px 12px;outline:0;resize:none;max-height:100px;font-size:.85rem;color:#f2ebff}
.composer textarea:focus{border-color:#8b5cf6}
.send-btn{width:38px;height:38px;border-radius:10px;background:#7c3aed;color:#fff;font-size:1rem;flex-shrink:0}
.send-btn.hidden{display:none}
.composer-btn{width:38px;height:38px;border-radius:10px;background:var(--elev);color:#c4b5fd;font-size:1.05rem;flex-shrink:0}
.composer-btn:hover{background:var(--hover)}
.composer-btn.hidden{display:none}
#btn-voice{touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}
.attach-menu{position:absolute;bottom:56px;left:14px;background:#15101f;border:1px solid rgba(167,139,250,.25);border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:2px;box-shadow:0 12px 32px rgba(0,0,0,.5);z-index:50;min-width:190px}
.attach-menu.hidden{display:none}
.attach-menu button{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:9px;font-size:.85rem;font-weight:700;color:#f2ebff;text-align:left}
.attach-menu button:hover{background:var(--elev)}
.hidden-input{display:none}
.composer.recording textarea,.composer.recording #btn-attach,.composer.recording #btn-send{visibility:hidden}
.voice-record{display:none;position:absolute;inset:0 0 0 0;align-items:center;gap:10px;padding:0 14px;background:#110a1a;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.composer.recording .voice-record{display:flex}
.vr-cancel-hint{font-size:.72rem;color:var(--muted);white-space:nowrap;flex-shrink:0;transition:color .15s}
.voice-record.will-cancel .vr-cancel-hint{color:#fca5a5;font-weight:800}
.voice-record.will-cancel .vr-timer{color:#ef4444}
.vr-live-wave{flex:1;display:flex;align-items:center;gap:2px;height:30px;overflow:hidden}
.vr-live-wave span{width:3px;min-height:3px;border-radius:2px;background:#a78bfa;flex-shrink:0}
.vr-timer{font-size:.8rem;font-weight:800;color:#fca5a5;flex-shrink:0;font-variant-numeric:tabular-nums}
.vr-mic{font-size:1.15rem;flex-shrink:0;animation:cbPulse 1s ease-in-out infinite}
.msg-media img,.msg-media video{max-width:220px;max-height:260px;border-radius:10px;display:block;cursor:pointer;object-fit:cover}
.msg-caption{margin-top:4px;font-size:.85rem}
.msg-file{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.06);border-radius:12px;padding:9px 12px;text-decoration:none;color:#f2ebff;min-width:160px}
.msg.mine .msg-file{background:rgba(255,255,255,.16)}
.mf-info{min-width:0}
.mf-name{font-size:.82rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px}
.mf-size{font-size:.68rem;color:var(--muted)}
.msg-location{display:flex;flex-direction:column;gap:2px;background:rgba(255,255,255,.06);border-radius:12px;padding:10px 14px;text-decoration:none;color:#f2ebff;font-size:.85rem;font-weight:700}
.msg.mine .msg-location{background:rgba(255,255,255,.16)}
.msg-location span{font-size:.7rem;color:var(--muted);font-weight:600}
.msg.mine .msg-location span{color:rgba(255,255,255,.7)}
.voice-msg{display:flex;align-items:center;gap:8px;min-width:180px}
.voice-msg-loading{display:flex;align-items:center;gap:8px;min-width:180px}
.toast-wrap{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:5000;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;width:100%;padding:0 16px}
.toast{background:#1a1030;border:1px solid rgba(167,139,250,.35);color:#f2ebff;padding:11px 18px;border-radius:12px;font-size:.85rem;font-weight:600;box-shadow:0 12px 32px rgba(0,0,0,.5);opacity:0;transform:translateY(10px);transition:opacity .25s ease,transform .25s ease;max-width:min(380px,100%);text-align:center}
.toast.show{opacity:1;transform:translateY(0)}
.toast-error{border-color:rgba(239,68,68,.5);background:#2a1015}
.slide-confirm-overlay{position:fixed;inset:0;z-index:5500;background:rgba(5,3,10,.7);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;padding:0 14px 24px;animation:scFade .15s ease}
@keyframes scFade{from{opacity:0}to{opacity:1}}
.slide-confirm-card{width:100%;max-width:400px;background:#1a1030;border:1px solid rgba(239,68,68,.35);border-radius:16px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.sc-label{font-size:.88rem;font-weight:700;color:#f2ebff;margin-bottom:14px;text-align:center;line-height:1.4}
.sc-track{position:relative;height:48px;border-radius:24px;background:rgba(239,68,68,.14);border:1px solid rgba(239,68,68,.35);overflow:hidden;display:flex;align-items:center}
.sc-fill{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,rgba(239,68,68,.5),rgba(239,68,68,.85));transition:width .05s linear}
.sc-hint{position:relative;flex:1;text-align:center;font-size:.74rem;font-weight:700;color:#fca5a5;pointer-events:none;z-index:1}
.sc-handle{position:absolute;left:3px;top:3px;width:42px;height:42px;border-radius:50%;background:#ef4444;color:#fff;display:grid;place-items:center;font-size:1rem;cursor:grab;touch-action:none;transition:background .15s ease;z-index:2}
.sc-handle.done{background:#22c55e}
.sc-handle:active{cursor:grabbing}
.sc-cancel{width:100%;margin-top:12px;height:38px;border-radius:10px;background:rgba(255,255,255,.06);color:#f2ebff;font-weight:700;font-size:.82rem}
.sc-cancel:hover{background:rgba(255,255,255,.12)}
.action-sheet-overlay{position:fixed;inset:0;z-index:5400;background:rgba(5,3,10,.6);display:flex;align-items:flex-end;justify-content:center;padding:0 12px 12px;opacity:0;transition:opacity .16s ease}
.action-sheet-overlay.show{opacity:1}
.action-sheet-card{width:100%;max-width:400px;background:#1a1030;border:1px solid rgba(167,139,250,.25);border-radius:16px;padding:8px;display:flex;flex-direction:column;gap:2px;transform:translateY(12px);transition:transform .16s ease;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.action-sheet-overlay.show .action-sheet-card{transform:translateY(0)}
.action-sheet-card button{text-align:left;padding:13px 14px;border-radius:10px;font-size:.85rem;font-weight:700;color:#f2ebff;background:transparent}
.action-sheet-card button:hover{background:rgba(255,255,255,.06)}
.action-sheet-card button[data-act="delall"]{color:#fca5a5}
.action-sheet-card button.as-cancel{margin-top:4px;text-align:center;color:var(--muted);border-top:1px solid rgba(255,255,255,.08);padding-top:12px;border-radius:0}
.vm-play{width:30px;height:30px;border-radius:50%;background:rgba(167,139,250,.25);color:#c4b5fd;font-size:.75rem;flex-shrink:0;display:grid;place-items:center}
.msg.mine .vm-play{background:rgba(255,255,255,.18);color:#fff}
.vm-wave{flex:1;display:flex;align-items:center;gap:2px;height:24px}
.vm-bar{flex:1;min-width:2px;max-width:3px;border-radius:2px;background:rgba(167,139,250,.35)}
.msg.mine .vm-bar{background:rgba(255,255,255,.35)}
.vm-bar.played{background:#a78bfa}
.msg.mine .vm-bar.played{background:#fff}
.vm-dur{font-size:.68rem;color:var(--muted);flex-shrink:0}
.msg.mine .vm-dur{color:rgba(255,255,255,.7)}
.enc-loading{display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:.85rem;font-style:italic}
.enc-loading-media{width:180px;height:130px;border-radius:10px;background:rgba(167,139,250,.08);display:grid;place-items:center}
.enc-spin{display:inline-block;animation:encPulse 1.2s ease-in-out infinite}
@keyframes encPulse{0%,100%{opacity:.45;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
.msg-file.enc-loading{background:rgba(255,255,255,.06);border-radius:12px;padding:9px 12px}
.gif-picker{width:min(420px,100%);max-height:80dvh;display:flex;flex-direction:column}
.gif-grid{margin-top:10px;display:grid;grid-template-columns:repeat(2,1fr);gap:8px;overflow-y:auto;max-height:60dvh}
.gif-grid img{width:100%;border-radius:10px;cursor:pointer;display:block;background:var(--elev)}
.overlay{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;padding:16px}
.overlay:not(.hidden){display:flex}
.modal-box{width:min(360px,100%);background:#15101f;border:1px solid rgba(167,139,250,.2);border-radius:16px;padding:20px;position:relative}
.modal-box h3{font-size:1rem;margin-bottom:12px}
.modal-close{position:absolute;top:12px;right:12px;width:28px;height:28px;border-radius:8px;background:var(--elev)}
.field-input{width:100%;height:38px;border-radius:8px;border:1px solid var(--line);background:#0d0814;color:#f2ebff;padding:0 12px;outline:0;margin-bottom:10px}
.fr-results{max-height:220px;overflow-y:auto}
.mg-hint{font-size:.72rem;color:var(--muted);margin-bottom:8px}
.mg-friend-list{max-height:240px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
.mg-friend-row{display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;cursor:pointer}
.mg-friend-row:hover{background:var(--elev)}
.mg-friend-row input{width:18px;height:18px;accent-color:#7c3aed;cursor:pointer;flex-shrink:0}
.mg-friend-row .av{width:32px;height:32px;border-radius:50%;background:var(--elev);display:grid;place-items:center;font-weight:800;font-size:.75rem;flex-shrink:0}
.mg-friend-row .n{font-size:.85rem;font-weight:700}
.admin-subtabs{display:flex;gap:4px;padding:10px 14px;border-bottom:1px solid var(--line);overflow-x:auto;flex-shrink:0}
.admin-subtab{flex-shrink:0;padding:7px 12px;border-radius:8px;font-size:.78rem;font-weight:700;color:var(--muted);background:var(--elev)}
.admin-subtab.on{background:#7c3aed;color:#fff}
.admin-body{flex:1;overflow-y:auto;padding:10px 14px}
.admin-body .empty-hint{padding:16px;color:var(--muted);font-size:.82rem;line-height:1.5}
.admin-row{display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:8px;border-bottom:1px solid var(--line)}
.admin-row .av{width:34px;height:34px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:.8rem;overflow:hidden}
.admin-row .av img{width:100%;height:100%;object-fit:cover}
.admin-row .info{flex:1;min-width:0}
.admin-row .info .n{font-weight:700;font-size:.85rem;display:flex;align-items:center;gap:6px}
.admin-row .info .n .tag-mod{font-size:.62rem;font-weight:800;padding:1px 6px;border-radius:5px;background:rgba(124,58,237,.25);color:#c4b5fd}
.admin-row .info .p{font-size:.72rem;color:var(--muted);margin-top:2px}
.admin-row .acts{display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0}
.admin-row .acts button{height:28px;padding:0 10px;border-radius:6px;font-size:.7rem;font-weight:700;background:var(--elev);color:#f2ebff}
.admin-row .acts button.danger{background:rgba(239,68,68,.22);color:#fca5a5}
.admin-row .acts button.ok{background:rgba(34,197,94,.2);color:#86efac}
.log-line{padding:9px 4px;border-bottom:1px solid var(--line);font-size:.8rem;line-height:1.4}
.log-line b{color:#c4b5fd}
.log-line .when{color:var(--muted);font-size:.68rem;margin-top:2px}
.dash-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:20px}
.dash-card{background:var(--elev);border:1px solid var(--line);border-radius:14px;padding:14px}
.dash-card-icon{font-size:1.1rem;margin-bottom:6px}
.dash-card-value{font-size:1.5rem;font-weight:900;color:#f2ebff;line-height:1.1}
.dash-card-label{font-size:.7rem;color:var(--muted);font-weight:700;margin-top:4px}
.dash-section{margin-bottom:22px}
.dash-section-title{font-size:.72rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.dash-chart{display:flex;align-items:flex-end;gap:8px;height:120px;background:var(--elev);border:1px solid var(--line);border-radius:14px;padding:12px}
.dash-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:6px}
.dash-bar{width:100%;max-width:28px;border-radius:5px 5px 0 0;background:linear-gradient(180deg,#a78bfa,#7c3aed);min-height:3px;transition:height .3s ease}
.dash-bar-label{font-size:.62rem;color:var(--muted);font-weight:700;flex-shrink:0}
.maint-panel{max-width:420px}
.maint-toggle-row{display:flex;align-items:flex-start;gap:10px;font-size:.85rem;font-weight:600;line-height:1.4;margin-bottom:16px;cursor:pointer}
.maint-toggle-row input{width:18px;height:18px;flex-shrink:0;margin-top:2px;accent-color:#7c3aed;cursor:pointer}
.maint-label{display:block;font-size:.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
.member-group-label{padding:14px 10px 6px;font-size:.68rem;font-weight:800;letter-spacing:.06em;color:var(--muted);text-transform:uppercase}
.member-row{align-items:flex-start}
.member-row .info{padding-top:1px}
.member-badges{display:flex;gap:4px;margin-top:5px}
@keyframes badgeShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes badgePulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.15)}}
.badge-chip{
  width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;
  font-size:.85rem;line-height:1;border:1px solid transparent;isolation:isolate;
  background-size:220% 220%;transition:transform .15s;
  animation:badgeShift 7s ease infinite,badgePulse 3.2s ease-in-out infinite;
}
.badge-chip:hover{transform:scale(1.18)}
.badge-chip.sm{width:20px;height:20px;font-size:.7rem}
.badge-base{background-image:linear-gradient(125deg,#6d28d9,#a78bfa,#7c3aed,#c084fc,#6d28d9);color:#fff;border-color:rgba(167,139,250,.5);box-shadow:0 0 10px rgba(124,58,237,.45)}
.badge-dev{background-image:linear-gradient(125deg,#7f1d1d,#ef4444,#991b1b,#f87171,#7f1d1d);color:#fff;border-color:rgba(239,68,68,.55);box-shadow:0 0 10px rgba(220,38,38,.5)}
.badge-hunter{background-image:linear-gradient(125deg,#78350f,#fbbf24,#a16207,#fde68a,#78350f);color:#1a1005;border-color:rgba(251,191,36,.65);box-shadow:0 0 12px rgba(245,158,11,.55)}
.badge-early{background-image:linear-gradient(125deg,#cbd5e1,#ffffff,#e2e8f0,#f8fafc,#cbd5e1);color:#0f172a;border-color:rgba(255,255,255,.75);box-shadow:0 0 10px rgba(255,255,255,.45)}
.profile-card{width:min(360px,100%);padding:0;overflow:hidden}
.pm-banner{height:110px;background:linear-gradient(135deg,#5b21b6,#7c3aed);background-size:cover;background-position:center}
.pm-av{width:78px;height:78px;border-radius:50%;margin:-42px auto 0;position:relative;z-index:1;display:grid;place-items:center;font-weight:900;font-size:1.7rem;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border:4px solid #15101f;overflow:hidden}
.pm-av img{width:100%;height:100%;object-fit:cover}
.pm-body{padding:10px 22px 22px;text-align:center}
.pm-body h3{font-size:1.15rem;font-weight:900;margin-top:6px}
.pm-tag{color:var(--muted);font-size:.78rem;margin-top:2px}
.pm-grade{display:inline-block;margin:8px auto 0;padding:3px 12px;border-radius:999px;background:rgba(255,255,255,.06);font-size:.7rem;font-weight:700;letter-spacing:.03em}
.pm-badges{display:flex;justify-content:center;gap:8px;margin:14px 0}
.pm-badges .badge-chip{width:38px;height:38px;font-size:1.15rem}
#pm-message{margin-top:4px}
#pm-message.hidden{display:none}
.pm-section{text-align:left;margin-top:14px;padding:12px;border-radius:12px;background:rgba(255,255,255,.03)}
.pm-section-label{font-size:.66rem;font-weight:800;letter-spacing:.06em;color:var(--muted);text-transform:uppercase;margin-bottom:4px}
.pm-section-body{font-size:.85rem;line-height:1.4}
.pc-card{position:relative;transition:transform .1s ease;will-change:transform}
.pc-banner{height:120px;position:relative;overflow:hidden}
.pc-particles{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.pc-avwrap{display:flex;justify-content:center}
.pc-av-frame{width:78px;height:78px;margin-top:-42px;position:relative;z-index:1;border-radius:50%}
.pc-av{width:100%;height:100%;border-radius:50%;position:relative;display:grid;place-items:center;font-weight:900;font-size:1.7rem;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border:4px solid #15101f;overflow:hidden}
.pc-av img.pc-av-img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;opacity:0;transition:opacity .5s ease}
.pc-av img.pc-av-img.on{opacity:1}
.pc-presence-dot{position:absolute;right:1px;bottom:1px;width:18px;height:18px;border-radius:50%;border:3px solid #15101f;z-index:2}
.pc-edit-btn{position:absolute;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:.78rem;display:grid;place-items:center;opacity:0;transition:opacity .15s ease,transform .15s ease;z-index:3;backdrop-filter:blur(3px)}
.pc-edit-btn:hover{transform:scale(1.1);background:rgba(0,0,0,.75)}
.pc-banner:hover .pc-edit-banner-btn,.pc-av-frame:hover .pc-edit-avatar-btn{opacity:1}
@media (hover:none){.pc-edit-btn{opacity:.85}}
.pc-edit-banner-btn{top:8px;right:8px}
.pc-edit-avatar-btn{right:-2px;bottom:-2px;width:24px;height:24px}
.pe-hint{font-size:.72rem;color:var(--muted);margin-bottom:2px;line-height:1.4}
.pc-card.pc-centered .pc-banner{height:74px}
.pc-card.pc-centered .pc-av-frame{width:86px;height:86px;margin-top:-50px}
.pc-av-frame.frame-fire::before,.pc-av-frame.frame-frost::before,.pc-av-frame.frame-gold::before,.pc-av-frame.frame-rainbow::before,.pc-av-frame.frame-neon::before{
  content:'';position:absolute;inset:-5px;border-radius:50%;z-index:-1;
}
.pc-av-frame.frame-fire::before{background:conic-gradient(from 0deg,#f59e0b,#ef4444,#f59e0b,#fbbf24,#f59e0b);animation:frameSpin 3s linear infinite;filter:blur(1px)}
.pc-av-frame.frame-frost::before{background:conic-gradient(from 0deg,#38bdf8,#a5f3fc,#0ea5e9,#e0f2fe,#38bdf8);animation:frameSpin 4s linear infinite;filter:blur(1px)}
.pc-av-frame.frame-gold::before{background:conic-gradient(from 0deg,#fbbf24,#fde68a,#f59e0b,#fff7cc,#fbbf24);animation:frameSpin 3.5s linear infinite}
.pc-av-frame.frame-rainbow::before{background:conic-gradient(from 0deg,#ef4444,#f59e0b,#eab308,#22c55e,#38bdf8,#7c3aed,#ec4899,#ef4444);animation:frameSpin 2.5s linear infinite}
.pc-av-frame.frame-neon::before{background:radial-gradient(circle,transparent 60%,#a78bfa 90%);animation:framePulse 1.6s ease-in-out infinite}
@keyframes frameSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes framePulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
.pc-custom-status{display:inline-block;margin-top:8px;padding:4px 12px;border-radius:999px;background:rgba(255,255,255,.08);font-size:.74rem;font-weight:700}
.pc-body{padding:10px 22px 22px;text-align:center}
.pc-name{font-weight:900;margin-top:6px}
.pc-tag{opacity:.65;font-size:.78rem;margin-top:2px}
.pc-badges{display:flex;justify-content:center;gap:8px;margin:14px 0}
.pc-badges .badge-chip{width:36px;height:36px;font-size:1.1rem}
.pc-bio{font-size:.85rem;line-height:1.45;margin-top:10px;opacity:.92;white-space:pre-wrap}
.pc-socials{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:14px}
.pc-social-btn{width:38px;height:38px;display:grid;place-items:center;font-size:1rem;text-decoration:none;transition:transform .12s ease}
.pc-social-btn:hover{transform:translateY(-2px) scale(1.06)}
.pc-spotify{display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:7px 14px;border-radius:999px;background:rgba(30,215,96,.16);border:1px solid rgba(30,215,96,.4);color:#6ee7a0;font-size:.76rem;font-weight:800;text-decoration:none}
.pc-since{margin-top:16px;font-size:.68rem;opacity:.55}
.pc-mutual{margin-top:10px;font-size:.72rem;opacity:.75;font-weight:700}
.pc-card.border-glow{box-shadow:0 0 0 1px var(--pc-glow,#7c3aed),0 0 28px 2px color-mix(in srgb,var(--pc-glow,#7c3aed) 55%,transparent)}
.pc-card.border-gradient{position:relative;isolation:isolate}
.pc-card.border-gradient::after{content:'';position:absolute;inset:0;border-radius:inherit;padding:2px;background:linear-gradient(135deg,var(--pc-grad-a,#7c3aed),var(--pc-grad-b,#22c55e));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:2}
.pcp{position:absolute;pointer-events:none}
.pcp-stars{width:3px;height:3px;border-radius:50%;background:#fff;animation:pcpTwinkle linear infinite}
@keyframes pcpTwinkle{0%,100%{opacity:.15}50%{opacity:1}}
.pcp-snow{top:-10px;width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.85);animation:pcpFall linear infinite}
@keyframes pcpFall{from{transform:translateY(-10px)}to{transform:translateY(140px)}}
.pcp-confetti{top:-10px;width:6px;height:10px;animation:pcpConfetti linear infinite}
@keyframes pcpConfetti{from{transform:translateY(-10px) rotate(0deg)}to{transform:translateY(140px) rotate(360deg)}}
.profile-edit-panel{width:min(900px,96vw);max-height:92dvh;padding:0;overflow:hidden}
.pe-layout{display:flex;max-height:92dvh}
.pe-preview-col{width:320px;flex-shrink:0;background:#0d0814;padding:20px;overflow-y:auto;border-right:1px solid rgba(255,255,255,.06)}
.pe-preview-label{font-size:.68rem;font-weight:800;letter-spacing:.06em;color:var(--muted);text-transform:uppercase;margin-bottom:10px;text-align:center}
.pe-preview-col .pc-card{border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.08);animation:peFadeIn .2s ease}
@keyframes peFadeIn{from{opacity:.4;transform:scale(.98)}to{opacity:1;transform:scale(1)}}
.pe-form-col{flex:1;min-width:0;display:flex;flex-direction:column;padding:20px 22px;overflow-y:auto}
.pe-tabs{display:flex;gap:6px;margin-bottom:16px;flex-shrink:0}
.pe-tab{padding:8px 16px;border-radius:999px;background:rgba(255,255,255,.05);font-size:.8rem;font-weight:700;color:var(--muted)}
.pe-tab.on{background:#7c3aed;color:#fff}
.pe-pane{display:flex;flex-direction:column;gap:14px}
.pe-pane.hidden{display:none}
.pe-field{display:flex;flex-direction:column;gap:6px;font-size:.76rem;font-weight:700;color:var(--muted)}
.pe-field .field-input{width:100%}
.pe-mini-btn{margin-left:6px;background:rgba(255,255,255,.08);border-radius:6px;padding:1px 7px;font-size:.85rem;cursor:pointer}
.pe-color-input{width:100%;height:38px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:transparent;cursor:pointer;padding:2px}
.pe-swatches{display:flex;gap:8px;flex-wrap:wrap}
.pe-swatch{width:32px;height:32px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:transform .12s ease}
.pe-swatch:hover{transform:scale(1.1)}
.pe-swatch.on{border-color:#fff;box-shadow:0 0 0 2px rgba(167,139,250,.6)}
.pe-actions{margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0}
.pe-gallery{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}
.pe-gallery-thumb{position:relative;width:56px;height:56px;border-radius:10px;overflow:hidden;flex-shrink:0}
.pe-gallery-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.pe-gallery-rm{position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.7);color:#fff;font-size:.6rem;display:grid;place-items:center}
.pe-mini-upload{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;background:rgba(255,255,255,.06);font-size:.76rem;font-weight:700;color:#f2ebff;cursor:pointer;width:fit-content}
.pe-mini-upload:hover{background:rgba(255,255,255,.12)}
.pe-frame-swatch{position:relative;width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border:0;cursor:pointer}
.pe-frame-inner{position:absolute;inset:4px;border-radius:50%;background:#15101f;box-sizing:border-box}
.pe-frame-inner.on{background:#a78bfa}
.pe-presence-row{display:flex;flex-wrap:wrap;gap:8px}
.pe-presence-btn{display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,.05);font-size:.76rem;font-weight:700;color:var(--muted)}
.pe-presence-btn.on{background:rgba(124,58,237,.28);color:#e9d5ff}
.pe-presence-swatch{width:10px;height:10px;border-radius:50%;flex-shrink:0}
@media (max-width:720px){.pe-layout{flex-direction:column;overflow-y:auto}.pe-preview-col{width:auto;border-right:0;border-bottom:1px solid rgba(255,255,255,.06)}}
.au-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left;margin-top:14px}
.au-label{font-size:.62rem;font-weight:800;letter-spacing:.05em;color:var(--muted);text-transform:uppercase;margin-bottom:3px}
.au-value{font-size:.82rem;word-break:break-all}
#au-notes{width:100%;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.25);color:#f2ebff;padding:10px 12px;font:inherit;resize:vertical;outline:0}
#au-notes:focus{border-color:#8b5cf6}
.au-notes-meta{font-size:.68rem;color:var(--muted);margin-top:6px}
.admin-search-row{margin-bottom:12px}
.admin-search-row input{width:100%;height:40px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.25);color:#f2ebff;padding:0 14px;outline:0;font:inherit}
.admin-search-row input:focus{border-color:#8b5cf6}
.badge-info-card{width:min(340px,100%);position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.12)}
.badge-info-card::before{content:'';position:absolute;inset:0;opacity:.25;pointer-events:none}
.badge-info-card.badge-base{background:linear-gradient(160deg,#10081c,#2a1548 40%,#10081c);border-color:rgba(167,139,250,.4)}
.badge-info-card.badge-base::before{background:radial-gradient(circle at 30% 20%,#a78bfa,transparent 55%)}
.badge-info-card.badge-dev{background:linear-gradient(160deg,#1a0505,#3f0a0a 40%,#1a0505);border-color:rgba(239,68,68,.4)}
.badge-info-card.badge-dev::before{background:radial-gradient(circle at 30% 20%,#ef4444,transparent 55%)}
.badge-info-card.badge-hunter{background:linear-gradient(160deg,#1a1205,#3d2e0a 40%,#1a1205);border-color:rgba(251,191,36,.45)}
.badge-info-card.badge-hunter::before{background:radial-gradient(circle at 30% 20%,#fbbf24,transparent 55%)}
.badge-info-card.badge-early{background:linear-gradient(160deg,#0f1218,#1e293b 40%,#0f1218);border-color:rgba(255,255,255,.35)}
.badge-info-card.badge-early::before{background:radial-gradient(circle at 30% 20%,#fff,transparent 55%)}
.bi-head{font-size:1.15rem;font-weight:900;display:flex;align-items:center;gap:10px;margin-bottom:12px;position:relative}
.badge-info-card.badge-base .bi-head{color:#e9d5ff}
.badge-info-card.badge-dev .bi-head{color:#fca5a5}
.badge-info-card.badge-hunter .bi-head{color:#fde68a}
.badge-info-card.badge-early .bi-head{color:#fff}
.bi-desc{font-size:.86rem;line-height:1.55;color:rgba(255,255,255,.82);position:relative}
.hunter-panel{width:min(420px,100%);max-height:88dvh;overflow-y:auto}
.hunter-stats{font-size:.8rem;color:var(--muted);font-weight:700;margin-top:6px}
.bug-item{background:var(--elev);border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:10px;text-align:left}
.bug-item .bt{font-weight:800;font-size:.9rem;margin-bottom:4px}
.bug-item .bd{font-size:.82rem;color:var(--muted);white-space:pre-wrap;margin-bottom:8px}
.bug-item .meta{font-size:.7rem;color:var(--muted);display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.bug-item .st{padding:2px 8px;border-radius:999px;font-weight:800;font-size:.65rem;text-transform:uppercase}
.st-pending{background:rgba(148,163,184,.2);color:#cbd5e1}
.st-approved{background:rgba(59,130,246,.2);color:#93c5fd}
.st-resolved{background:rgba(34,197,94,.2);color:#86efac}
.bug-item .actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.bug-item .actions button{padding:6px 10px;border-radius:8px;font-size:.72rem;font-weight:700;background:var(--elev);border:1px solid var(--line);color:#f2ebff}
.bug-item .actions button.ok{background:rgba(59,130,246,.25);border-color:rgba(59,130,246,.4)}
.bug-item .actions button.done{background:rgba(34,197,94,.25);border-color:rgba(34,197,94,.4)}
.bug-item .actions button.del{color:#fca5a5}
.call-btn{margin-left:auto}
.call-modal{text-align:center;width:min(320px,100%)}
.call-ring-av{width:76px;height:76px;border-radius:50%;margin:0 auto 14px;display:grid;place-items:center;font-weight:900;font-size:1.7rem;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed);overflow:hidden;box-shadow:0 0 0 0 rgba(124,58,237,.5);animation:callPulse 1.6s ease-out infinite}
.call-ring-av img{width:100%;height:100%;object-fit:cover}
.call-ring-av.settled{animation:none;box-shadow:none}
@keyframes callPulse{0%{box-shadow:0 0 0 0 rgba(124,58,237,.5)}70%{box-shadow:0 0 0 18px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}
.call-modal h3{font-size:1.1rem;font-weight:800}
.call-sub{color:var(--muted);font-size:.82rem;margin-top:4px}
.call-modal-acts{display:flex;justify-content:center;gap:22px;margin-top:22px}
.call-act{width:52px;height:52px;border-radius:50%;font-size:1.2rem;display:grid;place-items:center}
.call-act.accept{background:#22c55e;color:#052e16}
.call-act.decline{background:#ef4444;color:#450a0a}
.call-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:3000;padding:12px 14px;border-radius:16px;background:linear-gradient(160deg,rgba(30,18,48,.97),rgba(15,9,25,.98));backdrop-filter:blur(14px);border:1px solid rgba(167,139,250,.25);box-shadow:0 12px 40px rgba(0,0,0,.5);max-width:420px;margin:0 auto;background-size:300% 300%;transition:border-color .4s ease}
.call-bar.mood-ringing{background-image:linear-gradient(120deg,rgba(46,16,101,.97),rgba(124,58,237,.85),rgba(76,29,149,.95),rgba(15,9,25,.98));animation:moodShift 7s ease infinite;border-color:rgba(167,139,250,.4)}
.call-bar.mood-live{background-image:linear-gradient(120deg,rgba(20,83,45,.9),rgba(34,197,94,.55),rgba(76,29,149,.9),rgba(15,9,25,.98));animation:moodShift 9s ease infinite;border-color:rgba(134,239,172,.4)}
@keyframes moodShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.call-bar.embedded{position:static;max-width:none;margin:10px 14px 0;box-shadow:none}
.cb-top{display:flex;align-items:center;gap:10px}
.call-bar .av{width:38px;height:38px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;overflow:hidden;cursor:pointer}
.call-bar .av img{width:100%;height:100%;object-fit:cover}
.cb-info{flex:1;min-width:0}
.cb-name{font-weight:800;font-size:.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.cb-status{font-size:.76rem;color:var(--muted);display:flex;align-items:center;gap:5px;margin-top:2px}
.cb-dot{width:7px;height:7px;border-radius:50%;background:#7c3aed;flex-shrink:0;animation:cbPulse 1.6s ease-in-out infinite}
.cb-status.live .cb-dot{background:var(--online)}
@keyframes cbPulse{0%,100%{opacity:1}50%{opacity:.35}}
.cb-gear{width:32px;height:32px;border-radius:9px;background:rgba(255,255,255,.06);color:#c4b5fd;font-size:.95rem;display:grid;place-items:center;flex-shrink:0;align-self:flex-start}
.cb-gear:hover{background:rgba(255,255,255,.14)}
.cb-peer-badges{display:inline-flex;gap:3px;margin-left:6px;vertical-align:middle}
.cb-badge{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:50%;background:rgba(239,68,68,.25);font-size:.6rem;vertical-align:middle}
.cb-controls{display:flex;gap:9px;margin-top:14px;justify-content:center}
.cb-ctl{flex:0 0 auto;width:46px;height:46px;border-radius:50%;background:var(--elev);color:#f2ebff;font-size:1.05rem;display:grid;place-items:center;transition:background .15s ease,transform .1s ease,color .15s ease}
.cb-ctl .cb-ico{pointer-events:none}
.cb-ctl:hover{background:var(--hover)}
.cb-ctl:active{transform:scale(.92)}
.cb-ctl.on{background:rgba(34,197,94,.22);color:#86efac}
#cb-mute.on,#cb-deafen.on{background:rgba(239,68,68,.25);color:#fca5a5}
.cb-ctl.hangup{width:56px;background:linear-gradient(160deg,#ef4444,#b91c1c);color:#fff;font-size:1.1rem}
.cb-ctl.hangup:hover{background:linear-gradient(160deg,#f87171,#dc2626)}
.cb-ctl:disabled{opacity:.35;pointer-events:none}
.cb-video{margin-top:12px;border-radius:12px;overflow:hidden;background:#0d0814;border:1px solid rgba(167,139,250,.15)}
.cb-video.hidden{display:none}
.cbv-top{display:flex;align-items:center;gap:6px;padding:6px 8px;background:rgba(255,255,255,.03)}
.cbv-label{flex:1;font-size:.68rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
.vstage-btn{width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.06);color:#f2ebff;font-size:.85rem;display:grid;place-items:center;flex-shrink:0;border:0}
.vstage-btn:hover{background:rgba(255,255,255,.16)}
.vstage-btn.on{background:rgba(124,58,237,.5)}
.vstage-btn:disabled{opacity:.35;pointer-events:none}
.vgrid{display:grid;gap:6px;padding:6px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));grid-auto-rows:140px}
.vgrid.n1{grid-template-columns:1fr;grid-auto-rows:220px}
.vgrid.cinema{flex:1;min-height:0;padding:0 14px 14px;grid-auto-rows:1fr}
.vtile{position:relative;border-radius:12px;overflow:hidden;background:#000;cursor:pointer;min-height:0;animation:vtileIn .18s ease;border:1px solid rgba(167,139,250,.12)}
@keyframes vtileIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
.vtile video{width:100%;height:100%;object-fit:cover;display:block}
.vtile .vlabel{position:absolute;left:6px;bottom:6px;padding:3px 8px;border-radius:999px;background:rgba(0,0,0,.6);font-size:.66rem;font-weight:700;color:#f2ebff}
.vtile.enlarged{grid-column:1/-1;grid-row:span 2}
.video-stage{position:fixed;inset:0;z-index:3200;background:#050308;display:flex;flex-direction:column}
.video-stage.hidden{display:none}
.vstage-top-bar{display:flex;align-items:center;justify-content:flex-end;padding:12px 14px;flex-shrink:0}
.vstage-top-bar .vstage-btn{width:auto;padding:0 14px;font-size:.8rem;font-weight:700}
.live-pill{display:none;align-items:center;gap:7px;margin-top:10px;padding:8px 12px;border-radius:10px;background:rgba(239,68,68,.14);border:1px solid rgba(239,68,68,.4);color:#fca5a5;font-size:.76rem;font-weight:800;cursor:pointer}
.live-pill.show{display:flex}
.live-pill .lp-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;flex-shrink:0;animation:cbPulse 1.2s ease-in-out infinite}
.live-pill.screen-pill{display:flex;background:rgba(124,58,237,.16);border-color:rgba(167,139,250,.4);color:#e9d5ff}
.live-pill.screen-pill.hidden{display:none}
.live-pill.screen-pill .lp-dot{background:#a78bfa}
.dm-call-badge{display:none;align-items:center;gap:6px;margin-left:auto;padding:5px 11px;border-radius:999px;background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.4);color:#86efac;font-size:.72rem;font-weight:800;cursor:pointer;flex-shrink:0;white-space:nowrap}
.dm-call-badge:not(.hidden){display:inline-flex}
.dm-call-badge:hover{background:rgba(34,197,94,.24)}
.dcb-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;flex-shrink:0;animation:cbPulse 1.4s ease-in-out infinite}
.settings-modal{width:min(400px,100%);max-height:88dvh;overflow-y:auto;text-align:left}
.notif-panel{width:min(440px,100%);max-height:85dvh;display:flex;flex-direction:column}
.notif-panel h3{margin-bottom:10px}
.notif-bulk-row{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;flex-shrink:0}
.ntf-bulk-btn{padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.06);color:#f2ebff;font-size:.74rem;font-weight:700}
.ntf-bulk-btn:hover{background:rgba(255,255,255,.12)}
#ntf-clear-all{margin-left:auto;color:#fca5a5}
.notif-list{overflow-y:auto;display:flex;flex-direction:column;gap:6px;margin:0 -8px;padding:0 8px}
.notif-list .empty-hint{padding:24px 8px;text-align:center;color:var(--muted);font-size:.82rem}
.notif-row{align-items:flex-start;cursor:default}
.notif-row.clickable{cursor:pointer}
.ntf-icon{font-size:1.15rem;flex-shrink:0;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.06);display:grid;place-items:center}
.ntf-body{flex:1;min-width:0}
.ntf-text{font-size:.82rem;line-height:1.4}
.ntf-time{font-size:.66rem;color:var(--muted);margin-top:3px}
.ntf-actions{display:flex;gap:6px;margin-top:8px}
.ntf-actions button{padding:6px 12px;border-radius:8px;font-size:.72rem;font-weight:700;background:#7c3aed;color:#fff}
.ntf-actions button.rej{background:rgba(255,255,255,.08);color:#f2ebff}
.ntf-actions button:hover{filter:brightness(1.1)}
.changelog-panel{width:min(480px,100%);max-height:85dvh;display:flex;flex-direction:column}
.changelog-panel h3{margin-bottom:4px}
.cl-sub{font-size:.78rem;color:var(--muted);margin-bottom:16px;flex-shrink:0}
.cl-list{overflow-y:auto;position:relative;padding-left:22px}
.cl-list::before{content:'';position:absolute;left:6px;top:6px;bottom:6px;width:2px;background:linear-gradient(180deg,#a78bfa,rgba(167,139,250,.08))}
.cl-entry{position:relative;margin-bottom:20px;opacity:0;animation:clFadeIn .4s ease forwards}
.cl-entry:last-child{margin-bottom:4px}
@keyframes clFadeIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
.cl-dot{position:absolute;left:-22px;top:4px;width:12px;height:12px;border-radius:50%;background:#4c1d95;border:2px solid #1a1030;z-index:1}
.cl-dot.cl-dot-new{background:#a78bfa;box-shadow:0 0 0 4px rgba(167,139,250,.25);animation:cbPulse 1.8s ease-in-out infinite}
.cl-card{background:rgba(255,255,255,.03);border:1px solid rgba(167,139,250,.14);border-radius:14px;padding:13px 15px;transition:background .15s ease,border-color .15s ease}
.cl-card:hover{background:rgba(255,255,255,.05);border-color:rgba(167,139,250,.3)}
.cl-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.cl-version{font-size:.68rem;font-weight:800;color:#c4b5fd;background:rgba(124,58,237,.2);padding:2px 8px;border-radius:999px;font-family:monospace}
.cl-new-badge{font-size:.62rem;font-weight:800;color:#4ade80;background:rgba(34,197,94,.14);padding:2px 8px;border-radius:999px}
.cl-date{font-size:.66rem;color:var(--muted);margin-left:auto}
.cl-title{font-size:.9rem;font-weight:800;margin-bottom:5px;color:#f2ebff}
.cl-body{font-size:.8rem;line-height:1.5;color:rgba(242,235,255,.75)}
.status-panel{width:min(460px,100%);max-height:88dvh;padding:0;overflow:hidden;position:relative;background:#050308;border:1px solid rgba(167,139,250,.3)}
.status-rain{position:absolute;inset:0;filter:blur(2px) brightness(.7);opacity:.55}
.status-panel-inner{position:relative;z-index:1;padding:22px;max-height:88dvh;overflow-y:auto;background:linear-gradient(180deg,rgba(5,3,10,.4),rgba(5,3,10,.88) 30%)}
.status-panel-inner h3{display:flex;align-items:center;gap:8px;font-size:1.05rem}
.status-live-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:cbPulse 1.4s ease-in-out infinite}
.status-sub{font-size:.72rem;color:var(--muted);margin:4px 0 16px;font-family:monospace}
.status-rows{display:flex;flex-direction:column;gap:8px}
.status-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(20,12,35,.75);border:1px solid rgba(167,139,250,.15);font-family:monospace;font-size:.78rem}
.status-row .sr-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;background:#6b7280}
.status-row.ok .sr-dot{background:#22c55e;box-shadow:0 0 6px #22c55e}
.status-row.fail .sr-dot{background:#ef4444;box-shadow:0 0 6px #ef4444}
.status-row.warn .sr-dot{background:#f59e0b;box-shadow:0 0 6px #f59e0b}
.status-row .sr-name{flex:1;color:#e9e2ff;letter-spacing:.02em}
.status-row .sr-state{font-weight:800;letter-spacing:.05em}
.status-row.ok .sr-state{color:#86efac}
.status-row.fail .sr-state{color:#fca5a5}
.status-row.warn .sr-state{color:#fcd34d}
.status-row .sr-ms{color:var(--muted);font-size:.68rem;flex-shrink:0}
.settings-modal h3{margin-bottom:14px}
.set-section{margin-bottom:18px}
.set-section-label{font-size:.68rem;font-weight:800;letter-spacing:.06em;color:var(--muted);text-transform:uppercase;margin-bottom:8px}
.set-row{margin-bottom:12px}
.set-row label{display:flex;justify-content:space-between;align-items:center;font-size:.82rem;font-weight:700;margin-bottom:5px}
.set-row label span.val{color:var(--muted);font-weight:600;font-size:.76rem}
.set-row select{width:100%;height:38px;border-radius:8px;border:1px solid var(--line);background:#0d0814;color:#f2ebff;padding:0 10px}
.set-row input[type=range]{width:100%;-webkit-appearance:none;height:5px;border-radius:999px;background:var(--elev);outline:0}
.set-row input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#a78bfa;cursor:pointer;box-shadow:0 0 0 3px rgba(167,139,250,.2)}
.set-row input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#a78bfa;border:0;cursor:pointer}
.set-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;font-size:.82rem;font-weight:700}
.set-switch{width:40px;height:22px;border-radius:999px;background:var(--elev);position:relative;flex-shrink:0;cursor:pointer;border:1px solid var(--line)}
.set-switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#9ca3af;transition:transform .15s,background .15s}
.set-switch.on{background:rgba(124,58,237,.4);border-color:rgba(167,139,250,.5)}
.set-switch.on::after{transform:translateX(18px);background:#e9d5ff}
.mic-meter{height:8px;border-radius:999px;background:var(--elev);overflow:hidden;margin-top:8px}
.mic-meter-fill{height:100%;width:0%;background:linear-gradient(90deg,#7c3aed,#22c55e);transition:width .08s linear}
.mic-test-row{display:flex;gap:8px;align-items:center;margin-top:8px}
.mic-test-row button{flex:1;height:36px;border-radius:8px;background:var(--elev);color:#f2ebff;font-size:.78rem;font-weight:700;border:1px solid var(--line)}
.seg-group{display:flex;gap:6px;margin-top:4px}
.seg-btn{flex:1;height:34px;border-radius:8px;background:var(--elev);border:1px solid var(--line);color:var(--muted);font-size:.72rem;font-weight:700}
.seg-btn.on{background:rgba(124,58,237,.35);border-color:rgba(167,139,250,.5);color:#e9d5ff}
.tabbar{display:none}
@media (max-width:640px){
  .stage-inner{gap:18px;padding:14px 0}
  .sc-slide{padding:24px 20px 18px}
  .sc-art{width:64px;height:64px;border-radius:18px;margin-bottom:14px}
  .sc-icon{font-size:1.7rem}
  .sc-slide h3{font-size:.95rem}
  .sc-slide p{font-size:.8rem}
  #app{flex-direction:column}
  .list-col{width:100%;flex:1;min-height:0}
  #app.chat-open .list-col{display:none}
  #app:not(.chat-open) .chat-col{display:none}
  .rail{display:none}
  #app.chat-open .rail{display:none}
  .tabbar{display:flex;order:3;height:56px;flex-shrink:0;background:#0a0610;border-top:1px solid var(--line)}
  #app.chat-open .tabbar{display:none}
  .tabbar .rail-btn{flex:1;width:auto;height:100%;border-radius:0;background:transparent}
  .tabbar .rail-btn.on{border-radius:0;background:rgba(124,58,237,.18)}
  .chat-back{display:grid;place-items:center}
}
</style>
</head>
<body>
<div id="stage">
 <div class="stage-inner">
  <div id="auth" class="card">
    <div class="logo-wrap">
      <div class="logo-particles" id="logo-particles"></div>
      <div class="logo">XULTRA</div>
    </div>
    <div class="logo-sub">Messages · Amis · Profils</div>
    <div class="tabs">
      <button type="button" class="on" data-tab="login">Connexion</button>
      <button type="button" data-tab="register">Inscription</button>
    </div>
    <form id="pane-login" autocomplete="on">
      <div class="field"><label>Email</label><input id="in-email" type="email" name="email" autocomplete="username"/></div>
      <div class="field"><label>Mot de passe</label><input id="in-pass" type="password" name="password" autocomplete="current-password"/></div>
      <label class="remember-row" for="in-remember">
        <input type="checkbox" id="in-remember" checked/>
        <span>Rester connecté</span>
      </label>
      <div class="turnstile-wrap" id="turnstile-wrap-login"></div>
      <button type="submit" class="btn-main" id="btn-login">Entrer</button>
    </form>
    <form id="pane-register" class="hidden" autocomplete="on">
      <div class="reg-preview">
        <div class="rp-banner" id="rp-banner" title="Ajouter une bannière (optionnel)">
          <span class="rp-banner-btn">📷 Bannière</span>
        </div>
        <div class="rp-row">
          <div class="rp-av-wrap" id="rp-av-wrap" title="Choisir un avatar (optionnel)">
            <div class="rp-av" id="rp-av">?</div>
            <span class="rp-av-cam">📷</span>
          </div>
          <div class="rp-meta">
            <div class="rp-name" id="rp-name">Nouveau membre</div>
            <div class="rp-tag" id="rp-tag">@pseudo#····</div>
            <div class="rp-hint">Photo et bannière optionnelles</div>
          </div>
        </div>
      </div>
      <input type="file" id="reg-file-av" accept="image/*" class="hidden"/>
      <input type="file" id="reg-file-banner" accept="image/*" class="hidden"/>
      <div class="field-row">
        <div class="field field-grow"><label>Pseudo</label><input id="in-user" maxlength="24" autocomplete="username"/></div>
        <div class="field field-tag"><label>Tag <button type="button" class="pe-mini-btn" id="reg-tag-random" title="Randomiser">🎲</button></label><input id="in-tag" maxlength="4" inputmode="numeric" autocomplete="off" placeholder="0000"/></div>
      </div>
      <div class="field"><label>Email</label><input id="in-email2" type="email" name="email" autocomplete="username"/></div>
      <div class="field"><label>Mot de passe</label><input id="in-pass2" type="password" name="new-password" minlength="8" autocomplete="new-password"/></div>
      <div class="pw-strength" id="pw-strength">
        <div class="pw-strength-track"><div class="pw-strength-fill" id="pw-strength-fill"></div></div>
        <div class="pw-strength-row"><span class="pw-strength-emoji" id="pw-strength-emoji">😐</span><span class="pw-strength-label" id="pw-strength-label">Mot de passe</span></div>
      </div>
      <input type="text" id="in-hp" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true"/>
      <div class="turnstile-wrap" id="turnstile-wrap-register"></div>
      <button type="submit" class="btn-main" id="btn-register">Créer mon compte</button>
    </form>
    <div class="err" id="auth-err"></div>
    <p class="hint">β3.0 — étape 1 : connexion</p>
  </div>
  <div class="showcase" id="showcase">
    <div class="showcase-track" id="showcase-track">
      <div class="sc-slide">
        <div class="sc-art sc-art-1"><span class="sc-icon">🔒</span></div>
        <h3>Vos conversations n'appartiennent qu'à vous</h3>
        <p>Chiffrement de bout en bout sur tous les messages et médias échangés. Les clés restent sur vos appareils : même nous, on ne peut pas les lire.</p>
      </div>
      <div class="sc-slide">
        <div class="sc-art sc-art-2"><span class="sc-icon">💬</span></div>
        <h3>Une messagerie pensée pour aller vite</h3>
        <p>Interface fluide et intuitive, conçue pour discuter sans friction — sur mobile comme sur ordinateur.</p>
      </div>
      <div class="sc-slide">
        <div class="sc-art sc-art-3"><span class="sc-icon">📞</span></div>
        <h3>Appels et partage d'écran en un clic</h3>
        <p>Lancez un appel vocal ou partagez votre écran instantanément, directement depuis votre conversation.</p>
      </div>
      <div class="sc-slide">
        <div class="sc-art sc-art-4"><span class="sc-icon">🎨</span></div>
        <h3>Ton profil, à ton image</h3>
        <p>Couleurs, thèmes, avatars, effets de nom — personnalisez votre profil pour qu'il vous ressemble vraiment.</p>
      </div>
      <div class="sc-slide">
        <div class="sc-art sc-art-5"><span class="sc-icon">🛡️</span></div>
        <h3>Ton compte, bien gardé</h3>
        <p>Vérification anti-robot et recommandations de mot de passe robuste en temps réel : votre accès est protégé dès l'inscription.</p>
      </div>
      <div class="sc-slide">
        <div class="sc-art sc-art-6"><span class="sc-icon">🔔</span></div>
        <h3>Jamais un message manqué</h3>
        <p>Notifications instantanées, même quand l'application est fermée. Restez connecté à ce qui compte.</p>
      </div>
    </div>
    <div class="showcase-dots" id="showcase-dots"></div>
  </div>
 </div>
</div>

<div id="app" class="hidden">
  <nav class="rail">
    <button type="button" class="rail-btn on" id="nav-dms" data-view="dms" title="Messages">💬</button>
    <button type="button" class="rail-btn" id="nav-friends" data-view="friends" title="Amis">👥<span class="rail-badge hidden rail-friends-badge">0</span></button>
    <button type="button" class="rail-btn" id="nav-members" data-view="members" title="Membres">🌐</button>
    <button type="button" class="rail-btn hidden admin-nav-btn" id="nav-admin" data-view="admin" title="Admin">🛡️</button>
    <button type="button" class="rail-btn" id="nav-status" title="État du système">🖥️</button>
    <button type="button" class="rail-btn" id="nav-changelog" title="Nouveautés">📋</button>
  </nav>
  <nav class="tabbar">
    <button type="button" class="rail-btn on" data-view="dms" title="Messages">💬</button>
    <button type="button" class="rail-btn" data-view="friends" title="Amis">👥<span class="rail-badge hidden rail-friends-badge">0</span></button>
    <button type="button" class="rail-btn" data-view="members" title="Membres">🌐</button>
    <button type="button" class="rail-btn hidden admin-nav-btn" data-view="admin" title="Admin">🛡️</button>
  </nav>
  <aside class="list-col">
    <div class="list-head">
      <h1 id="list-title">Messages</h1>
      <div class="list-sub" id="list-sub"><span class="dot"></span><span id="list-sub-txt">XULTRA</span></div>
      <div class="search-row">
        <div class="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="search" class="search-box" placeholder="Rechercher" autocomplete="off"/>
        </div>
        <button type="button" class="icon-btn hidden" id="btn-new-group" title="Créer un groupe">👥+</button>
        <button type="button" class="icon-btn" id="btn-add-friend">👤+</button>
      </div>
    </div>
    <div class="list-body" id="list-body"></div>
    <div class="userbar">
      <div class="av" id="ub-av">?</div>
      <div class="meta">
        <div class="n" id="ub-name">—</div>
        <button type="button" class="ub-presence-btn" id="ub-presence-btn"><span class="pr-dot ub-static-dot" id="ub-presence-dot"></span><span id="ub-status">En ligne</span></button>
      </div>
      <button type="button" class="ub-btn" id="ub-bell" title="Notifications">🔔<span class="ub-badge hidden" id="ub-bell-badge">0</span></button>
      <button type="button" class="ub-btn" id="ub-more" title="Plus d'options">⋯</button>
      <div class="ub-popover hidden" id="ub-presence-popover"></div>
      <div class="ub-popover ub-more-menu hidden" id="ub-more-menu">
        <button type="button" id="ub-push">🔕 Activer les notifications</button>
        <button type="button" id="ub-hunter" class="hidden">🐛 Panneau Bug Hunter</button>
        <button type="button" id="btn-report-bug">🐞 Signaler un bug</button>
        <button type="button" id="btn-logout">🚪 Déconnexion</button>
      </div>
    </div>
  </aside>
  <section class="chat-col" id="chat-col">
    <div class="empty" id="chat-empty">
      <div style="font-size:2rem">💬</div>
      <h3>Sélectionne une conversation</h3>
      <p>Ou ouvre l'onglet Amis pour en démarrer une.</p>
    </div>
    <div class="chat-active hidden" id="chat-active">
      <div class="chat-top">
        <button type="button" class="ub-btn chat-back" id="btn-chat-back" title="Retour">←</button>
        <div class="av" id="ch-av">?</div>
        <div class="titles"><div class="t" id="ch-title">—</div><div class="ch-sub-row"><span class="ch-e2e hidden" id="ch-e2e">🔒 Chiffré de bout en bout</span><span class="ch-presence hidden" id="ch-presence"></span></div></div>
        <button type="button" class="dm-call-badge hidden" id="dm-call-badge"><span class="dcb-dot"></span>Salon vocal actif — Rejoindre</button>
        <button type="button" class="ub-btn call-btn" id="btn-call-start" title="Appel vocal">📞</button>
      </div>
      <div id="call-panel-anchor"></div>
      <div class="msgs" id="msgs"></div>
      <div class="composer" id="composer">
        <button type="button" class="composer-btn" id="btn-attach" title="Joindre">➕</button>
        <textarea id="msg-input" placeholder="Écrire un message…" rows="1"></textarea>
        <button type="button" class="composer-btn" id="btn-voice" title="Message vocal">🎤</button>
        <button type="button" class="send-btn hidden" id="btn-send">➤</button>
        <div class="attach-menu hidden" id="attach-menu">
          <button type="button" data-attach="image">🖼️<span>Photo / Vidéo</span></button>
          <button type="button" data-attach="file">📄<span>Fichier</span></button>
          <button type="button" data-attach="gif">🎞️<span>GIF</span></button>
          <button type="button" data-attach="location">📍<span>Position</span></button>
        </div>
        <div class="voice-record" id="voice-record">
          <span class="vr-mic">🎤</span>
          <div class="vr-live-wave" id="vr-live-wave"></div>
          <div class="vr-timer" id="vr-timer">0:00</div>
          <div class="vr-cancel-hint">◀ Glisser pour annuler</div>
        </div>
      </div>
      <input type="file" id="file-image" class="hidden-input" accept="image/*,video/*"/>
      <input type="file" id="file-generic" class="hidden-input"/>
    </div>
    <div class="chat-active hidden" id="admin-active">
      <div class="chat-top">
        <button type="button" class="ub-btn chat-back" id="btn-admin-back" title="Retour">←</button>
        <div class="titles"><div class="t">🛡️ Panneau admin</div></div>
      </div>
      <div class="admin-subtabs">
        <button type="button" class="admin-subtab on" data-atab="dashboard">Dashboard</button>
        <button type="button" class="admin-subtab" data-atab="members">Membres</button>
        <button type="button" class="admin-subtab" data-atab="reports">Signalements</button>
        <button type="button" class="admin-subtab" data-atab="bans">Bannis</button>
        <button type="button" class="admin-subtab" data-atab="bugs">Bugs</button>
        <button type="button" class="admin-subtab" data-atab="calls">Appels</button>
        <button type="button" class="admin-subtab" data-atab="logs">Logs</button>
        <button type="button" class="admin-subtab owner-only hidden" data-atab="maintenance">Maintenance</button>
      </div>
      <div class="admin-body" id="admin-body"></div>
    </div>
  </section>
</div>

<div class="overlay hidden" id="modal-friend">
  <div class="modal-box">
    <button type="button" class="modal-close" id="mf-close">✕</button>
    <h3>Ajouter un ami</h3>
    <input id="fq" class="field-input" placeholder="Nom d'utilisateur" autocomplete="off"/>
    <div id="fr" class="fr-results"></div>
  </div>
</div>

<div class="overlay hidden" id="modal-group">
  <div class="modal-box">
    <button type="button" class="modal-close" id="mg-close">✕</button>
    <h3>👥 Nouveau groupe</h3>
    <input id="mg-name" class="field-input" placeholder="Nom du groupe" autocomplete="off" maxlength="64"/>
    <div class="mg-hint">Choisis au moins 2 amis (6 max)</div>
    <div id="mg-friends" class="mg-friend-list"></div>
    <div class="err" id="mg-err"></div>
    <button type="button" class="btn-main" id="mg-create" style="margin-top:12px">Créer le groupe</button>
  </div>
</div>

<div class="overlay hidden" id="modal-gif">
  <div class="modal-box gif-picker">
    <button type="button" class="modal-close" id="gif-close">✕</button>
    <h3>🎞️ Choisir un GIF</h3>
    <input id="gif-search" class="field-input" placeholder="Rechercher un GIF…" autocomplete="off"/>
    <div class="gif-grid" id="gif-grid"></div>
  </div>
</div>

<div class="overlay hidden" id="modal-bug">
  <div class="modal-box">
    <button type="button" class="modal-close" id="mb-close">✕</button>
    <h3 id="bug-modal-title">🐞 Signaler un bug</h3>
    <input id="bug-title" class="field-input" placeholder="Titre court" autocomplete="off" maxlength="120"/>
    <textarea id="bug-desc" class="field-input" style="height:110px;padding-top:9px;resize:vertical" placeholder="Décris le bug : ce que tu as fait, ce qui aurait dû se passer, ce qui s'est passé…" maxlength="2000"></textarea>
    <button type="button" class="btn-main" id="bug-submit" style="margin-top:4px">Envoyer le rapport</button>
    <div class="err" id="bug-err"></div>
  </div>
</div>

<div class="overlay hidden" id="modal-hunter">
  <div class="modal-box hunter-panel">
    <button type="button" class="modal-close" id="hp-close">✕</button>
    <h3>🐛 Panneau Bug Hunter</h3>
    <div class="hunter-stats" id="hunter-stats">0/10 résolus</div>
    <button type="button" class="btn-main" id="hp-new" style="margin:10px 0">+ Nouveau rapport</button>
    <div id="hunter-bug-list"></div>
  </div>
</div>

<div class="overlay hidden" id="modal-profile">
  <div class="modal-box profile-card">
    <button type="button" class="modal-close" id="pm-close">✕</button>
    <div id="pm-render"></div>
    <div class="pm-btn-row">
      <button type="button" class="btn-main" id="pm-message">Message</button>
      <button type="button" class="btn-main hidden" id="pm-edit">✏️ Modifier le profil</button>
      <button type="button" class="btn-flag" id="pm-share" title="Copier le lien du profil">🔗</button>
      <button type="button" class="btn-flag" id="pm-block" title="Bloquer ce membre">⛔</button>
      <button type="button" class="btn-flag" id="pm-report" title="Signaler ce membre">🚩</button>
    </div>
  </div>
</div>

<div class="overlay hidden" id="modal-profile-edit">
  <div class="modal-box profile-edit-panel">
    <button type="button" class="modal-close" id="pe-close">✕</button>
    <div class="pe-layout">
      <div class="pe-preview-col">
        <div class="pe-preview-label">Aperçu en direct</div>
        <div id="pe-preview"></div>
      </div>
      <div class="pe-form-col">
        <div class="pe-tabs" id="pe-tabs">
          <button type="button" class="pe-tab on" data-tab="general">Général</button>
          <button type="button" class="pe-tab" data-tab="style">Style</button>
          <button type="button" class="pe-tab" data-tab="social">Réseaux</button>
        </div>
        <div class="pe-pane" data-pane="general">
          <input type="file" id="pe-avatar-file" accept="image/*" hidden/>
          <input type="file" id="pe-banner-file" accept="image/*" hidden/>
          <div class="pe-hint">📷 Survole ta photo ou ta bannière dans l'aperçu pour les changer</div>
          <div class="pe-field"><span>Galerie de photos (façon Telegram, défilement auto)</span>
            <div class="pe-gallery" id="pe-gallery"></div>
            <label class="pe-mini-upload"><input type="file" id="pe-gallery-file" accept="image/*" hidden/>➕ Ajouter une photo</label>
          </div>
          <label class="pe-field"><span>Nom affiché</span><input type="text" id="pe-name" maxlength="64" class="field-input"/></label>
          <label class="pe-field"><span>Tag <button type="button" class="pe-mini-btn" id="pe-tag-random" title="Randomiser">🎲</button></span><input type="text" id="pe-tag" maxlength="4" class="field-input" placeholder="0000"/></label>
          <label class="pe-field"><span>Pronoms</span><input type="text" id="pe-pronouns" maxlength="24" class="field-input" placeholder="il/lui, elle/elle, iel…"/></label>
          <label class="pe-field"><span>Statut personnalisé</span><input type="text" id="pe-custom-status" maxlength="60" class="field-input" placeholder="🎮 En train de coder…"/></label>
          <label class="pe-field"><span>Bio</span><textarea id="pe-bio" maxlength="500" class="field-input" style="height:80px;padding-top:9px;resize:vertical"></textarea></label>
          <label class="pe-field"><span>Alignement de la bio</span>
            <select id="pe-bio-pos" class="field-input"><option value="center">Centré</option><option value="left">Gauche</option></select>
          </label>
        </div>
        <div class="pe-pane hidden" data-pane="style">
          <div class="pe-field"><span>Thème</span><div class="pe-swatches" id="pe-theme-swatches"></div></div>
          <label class="pe-field"><span>Type de fond</span>
            <select id="pe-bgtype" class="field-input"><option value="gradient">Dégradé</option><option value="color">Couleur unie</option><option value="image">Image (bannière)</option></select>
          </label>
          <label class="pe-field"><span>Couleur principale</span><input type="color" id="pe-bgcolor" class="pe-color-input"/></label>
          <label class="pe-field"><span>Couleur des boutons</span><input type="color" id="pe-btncolor" class="pe-color-input"/></label>
          <label class="pe-field"><span>Couleur du texte</span><input type="color" id="pe-textcolor" class="pe-color-input"/></label>
          <label class="pe-field"><span>Style des boutons</span>
            <select id="pe-btnstyle" class="field-input"><option value="solid">Plein</option><option value="outline">Contour</option><option value="glass">Verre</option></select>
          </label>
          <label class="pe-field"><span>Forme des boutons</span>
            <select id="pe-btnshape" class="field-input"><option value="rounded">Arrondi</option><option value="pill">Pilule</option><option value="square">Carré</option></select>
          </label>
          <label class="pe-field"><span>Disposition de l'en-tête</span>
            <select id="pe-layout" class="field-input"><option value="overlap">Avatar superposé</option><option value="centered">Centré</option></select>
          </label>
          <label class="pe-field"><span>Taille du nom</span>
            <select id="pe-titlesize" class="field-input"><option value="md">Normale</option><option value="sm">Petite</option><option value="lg">Grande</option></select>
          </label>
          <label class="pe-field"><span>Effet de particules</span>
            <select id="pe-particles" class="field-input"><option value="none">Aucun</option><option value="stars">Étoiles</option><option value="snow">Neige</option><option value="matrix">Code (matrix)</option><option value="confetti">Confettis</option></select>
          </label>
          <div class="pe-field"><span>Contour d'avatar</span><div class="pe-swatches" id="pe-frame-swatches"></div></div>
          <label class="pe-field"><span>Bordure de la carte</span>
            <select id="pe-card-border" class="field-input"><option value="none">Aucune</option><option value="glow">Halo lumineux</option><option value="gradient">Dégradé animé</option></select>
          </label>
          <label class="pe-field"><span>Police</span>
            <select id="pe-font" class="field-input"><option value="system">Système</option><option value="serif">Élégante (serif)</option><option value="mono">Mono (technique)</option><option value="rounded">Arrondie</option><option value="elegant">Raffinée</option></select>
          </label>
          <div class="pe-field"><span>Statut de présence</span><div class="pe-presence-row" id="pe-presence-row"></div></div>
          <button type="button" class="btn-main" id="pe-randomize-style" style="margin-top:4px">🎲 Style aléatoire</button>
        </div>
        <div class="pe-pane hidden" data-pane="social">
          <label class="pe-field"><span>📸 Instagram</span><input type="text" id="pe-social-instagram" class="field-input" placeholder="pseudo ou lien complet"/></label>
          <label class="pe-field"><span>𝕏 Twitter / X</span><input type="text" id="pe-social-twitter" class="field-input" placeholder="pseudo ou lien complet"/></label>
          <label class="pe-field"><span>🎵 TikTok</span><input type="text" id="pe-social-tiktok" class="field-input" placeholder="pseudo ou lien complet"/></label>
          <label class="pe-field"><span>▶️ YouTube</span><input type="text" id="pe-social-youtube" class="field-input" placeholder="pseudo ou lien complet"/></label>
          <label class="pe-field"><span>🎮 Twitch</span><input type="text" id="pe-social-twitch" class="field-input" placeholder="pseudo ou lien complet"/></label>
          <label class="pe-field"><span>💬 Discord</span><input type="text" id="pe-social-discord" class="field-input" placeholder="lien d'invitation"/></label>
          <label class="pe-field"><span>🔗 Site web</span><input type="text" id="pe-social-website" class="field-input" placeholder="https://…"/></label>
          <label class="pe-field"><span>🎧 Spotify</span><input type="text" id="pe-spotify" class="field-input" placeholder="lien vers un titre/playlist"/></label>
        </div>
        <div class="pe-actions">
          <button type="button" class="btn-main" id="pe-save">Enregistrer</button>
          <div class="err" id="pe-err"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="overlay hidden" id="modal-report">
  <div class="modal-box" style="width:min(380px,100%)">
    <button type="button" class="modal-close" id="rp-close">✕</button>
    <h3 style="margin-bottom:4px">🚩 Signaler <span id="rp-target-name"></span></h3>
    <p style="font-size:.78rem;color:var(--muted);margin-bottom:14px">Ton signalement est envoyé à l'équipe de modération. Elle seule peut le consulter.</p>
    <div class="field">
      <label>Raison</label>
      <select id="rp-reason">
        <option value="harcelement">Harcèlement</option>
        <option value="contenu_inapproprie">Contenu inapproprié</option>
        <option value="spam">Spam</option>
        <option value="usurpation">Usurpation d'identité</option>
        <option value="autre">Autre</option>
      </select>
    </div>
    <div class="field">
      <label>Détails (optionnel)</label>
      <textarea id="rp-details" rows="4" placeholder="Explique ce qui s'est passé…"></textarea>
    </div>
    <div class="err" id="rp-err"></div>
    <button type="button" class="btn-main" id="rp-submit">Envoyer le signalement</button>
  </div>
</div>

<div class="overlay hidden" id="modal-admin-user">
  <div class="modal-box profile-card">
    <button type="button" class="modal-close" id="au-close">✕</button>
    <div class="pm-av" id="au-av">?</div>
    <div class="pm-body">
      <h3 id="au-name">—</h3>
      <div class="pm-tag" id="au-tag">#0000</div>
      <div class="au-grid">
        <div><div class="au-label">Email</div><div class="au-value" id="au-email">—</div></div>
        <div><div class="au-label">UID</div><div class="au-value" id="au-uid">—</div></div>
        <div><div class="au-label">Membre depuis</div><div class="au-value" id="au-since">—</div></div>
        <div><div class="au-label">Vu pour la dernière fois</div><div class="au-value" id="au-lastseen">—</div></div>
      </div>
      <div class="pm-section">
        <div class="pm-section-label">Bio</div>
        <div class="pm-section-body" id="au-bio">—</div>
      </div>
      <div class="pm-section">
        <div class="pm-section-label">Notes internes (staff uniquement)</div>
        <textarea id="au-notes" rows="4" placeholder="Notes visibles uniquement par le staff…"></textarea>
        <button type="button" class="btn-main" id="au-notes-save" style="margin-top:8px">Enregistrer la note</button>
        <div class="au-notes-meta" id="au-notes-meta"></div>
      </div>
    </div>
  </div>
</div>

<div class="overlay hidden" id="modal-badge-info">
  <div class="modal-box badge-info-card" id="bi-card">
    <button type="button" class="modal-close" id="bi-close">✕</button>
    <div class="bi-head"><span id="bi-icon">💜</span> <span id="bi-label">MEMBRE</span></div>
    <div class="bi-desc" id="bi-desc"></div>
  </div>
</div>

<div class="overlay hidden" id="modal-incoming-call">
  <div class="modal-box call-modal">
    <div class="call-ring-av" id="ic-av">?</div>
    <h3 id="ic-name">—</h3>
    <div class="call-sub" id="ic-sub">Appel vocal entrant…</div>
    <div class="call-modal-acts">
      <button type="button" class="call-act decline" id="ic-decline" title="Refuser">✕</button>
      <button type="button" class="call-act accept" id="ic-accept" title="Répondre">📞</button>
    </div>
  </div>
</div>

<div class="overlay hidden" id="modal-call-settings">
  <div class="modal-box settings-modal">
    <button type="button" class="modal-close" id="cs-close">✕</button>
    <h3>🎛️ Paramètres audio &amp; vidéo</h3>
    <div class="set-section">
      <div class="set-section-label">Micro</div>
      <div class="set-row">
        <label>Source</label>
        <select id="cs-mic-device"></select>
      </div>
      <div class="set-row">
        <label>Volume micro <span class="val" id="cs-mic-vol-val">100%</span></label>
        <input type="range" id="cs-mic-vol" min="0" max="200" value="100"/>
      </div>
      <div class="set-row">
        <label>Canal audio</label>
        <div class="seg-group">
          <button type="button" class="seg-btn on" data-chan="mono">Mono</button>
          <button type="button" class="seg-btn" data-chan="stereo">Stéréo</button>
          <button type="button" class="seg-btn" data-chan="spatial">Spatial (sim. 7.1)</button>
        </div>
      </div>
      <div class="set-toggle-row"><span>Réduction de bruit</span><div class="set-switch on" id="cs-noise" data-on="1"></div></div>
      <div class="set-toggle-row"><span>Annulation d'écho</span><div class="set-switch on" id="cs-echo" data-on="1"></div></div>
      <div class="set-toggle-row"><span>Gain automatique</span><div class="set-switch on" id="cs-agc" data-on="1"></div></div>
      <div class="set-row">
        <label>Test micro</label>
        <div class="mic-meter"><div class="mic-meter-fill" id="cs-mic-meter"></div></div>
        <div class="mic-test-row"><button type="button" id="cs-mic-record">🔴 Écouter ma voix (3s)</button></div>
      </div>
    </div>
    <div class="set-section">
      <div class="set-section-label">Sortie audio</div>
      <div class="set-row">
        <label>Volume sortie <span class="val" id="cs-out-vol-val">100%</span></label>
        <input type="range" id="cs-out-vol" min="0" max="200" value="100"/>
      </div>
    </div>
    <div class="set-section">
      <div class="set-section-label">Caméra</div>
      <div class="set-row">
        <label>Qualité</label>
        <select id="cs-cam-quality">
          <option value="480p30">480p · 30 fps</option>
          <option value="720p30" selected>720p · 30 fps</option>
          <option value="720p60">720p · 60 fps</option>
          <option value="1080p30">1080p · 30 fps</option>
          <option value="1080p60">1080p · 60 fps</option>
          <option value="1440p60">1440p · 60 fps</option>
          <option value="2160p30">4K · 30 fps</option>
          <option value="2160p60">4K · 60 fps</option>
        </select>
      </div>
    </div>
    <div class="set-section">
      <div class="set-section-label">Partage d'écran</div>
      <div class="set-row">
        <label>Qualité</label>
        <select id="cs-screen-quality">
          <option value="720p30">720p · 30 fps</option>
          <option value="1080p30">1080p · 30 fps</option>
          <option value="1080p60" selected>1080p · 60 fps</option>
          <option value="1440p60">1440p · 60 fps</option>
          <option value="2160p30">4K · 30 fps</option>
          <option value="2160p60">4K · 60 fps</option>
        </select>
      </div>
    </div>
  </div>
</div>

<div class="video-stage hidden" id="call-video-stage">
  <div class="vstage-top-bar">
    <button type="button" class="vstage-btn" id="vstage-exit">▾ Réduire</button>
  </div>
</div>
<div class="call-bar hidden" id="call-bar">
  <div class="cb-top">
    <div class="av" id="cb-av" data-profile="">?</div>
    <div class="cb-info">
      <div class="cb-name" id="cb-name">En appel · 1 participant<span class="cb-peer-badges" id="cb-peer-badges"></span></div>
      <div class="cb-status"><span class="cb-dot"></span><span id="cb-status">00:00</span> · <span id="cb-sub">Sonne…</span></div>
    </div>
    <button type="button" class="cb-gear" id="cb-settings" title="Paramètres audio/vidéo">⚙️</button>
  </div>
  <div class="cb-controls">
    <button type="button" class="cb-ctl" id="cb-mute" title="Muet"><span class="cb-ico">🎤</span></button>
    <button type="button" class="cb-ctl" id="cb-deafen" title="Assourdir"><span class="cb-ico">🎧</span></button>
    <button type="button" class="cb-ctl" id="cb-cam" title="Caméra"><span class="cb-ico">📷</span></button>
    <button type="button" class="cb-ctl" id="cb-screen" title="Partager l'écran"><span class="cb-ico">🖥️</span></button>
    <button type="button" class="cb-ctl hangup" id="cb-hangup" title="Raccrocher"><span class="cb-ico">✕</span></button>
  </div>
  <div class="cb-video hidden" id="cb-video">
    <div class="cbv-top">
      <span class="cbv-label" id="cbv-label">Vidéo</span>
      <button type="button" class="vstage-btn" id="cb-cinema" title="Mode cinéma">⛶</button>
      <button type="button" class="vstage-btn" id="cb-mask" title="Masquer">▾</button>
    </div>
  </div>
  <div class="live-pill" id="live-pill">
    <span class="lp-dot"></span><span id="lp-label">Webcam active</span>
  </div>
  <div class="live-pill screen-pill hidden" id="screen-reveal-pill">
    <span class="lp-dot"></span><span id="screen-reveal-label">Voir la diffusion</span>
  </div>
  <audio id="call-remote-audio" autoplay playsinline></audio>
</div>

<div class="overlay hidden" id="modal-notifications">
  <div class="modal-box notif-panel">
    <button type="button" class="modal-close" id="ntf-close">✕</button>
    <h3>🔔 Notifications</h3>
    <div class="notif-bulk-row" id="ntf-bulk-row">
      <button type="button" class="ntf-bulk-btn hidden" id="ntf-accept-all">✅ Tout accepter</button>
      <button type="button" class="ntf-bulk-btn hidden" id="ntf-decline-all">✕ Tout refuser</button>
      <button type="button" class="ntf-bulk-btn hidden" id="ntf-clear-all">🗑 Tout supprimer</button>
    </div>
    <div class="notif-list" id="ntf-list"></div>
  </div>
</div>

<div class="overlay hidden" id="modal-changelog">
  <div class="modal-box changelog-panel">
    <button type="button" class="modal-close" id="cl-close">✕</button>
    <h3>📋 Nouveautés</h3>
    <div class="cl-sub">Tout ce qui a changé récemment sur XULTRA</div>
    <div class="cl-list" id="cl-list"></div>
  </div>
</div>

<div class="overlay hidden" id="modal-status">
  <div class="modal-box status-panel">
    <button type="button" class="modal-close" id="stp-close">✕</button>
    <div class="status-rain" id="status-rain"></div>
    <div class="status-panel-inner">
      <h3>🖥️ État du système <span class="status-live-dot" id="stp-live-dot"></span></h3>
      <div class="status-sub" id="stp-updated">Vérification en cours…</div>
      <div class="status-rows" id="stp-rows"></div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/appwrite@15.0.0"></script>
<script>
window.__awReady=false;
(function poll(){
  if(window.Appwrite){window.__awReady=true;return}
  setTimeout(poll,50);
})();
</script>
<script>
function \$(id){return document.getElementById(id)}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function ini(n){return String(n||'?').trim().charAt(0).toUpperCase()||'?'}
function slugUsername(name){
  let s=String(name||'');
  try{s=s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'')}catch(e){}
  s=s.toLowerCase().replace(/[^a-z0-9_]+/g,'').slice(0,24);
  return s||'user';
}
const EP='https://fra.cloud.appwrite.io/v1', PID='6a73b975002f14dc6b91', DB='xultra', BUCKET='ultravoc_media';
const PROXY_EP=location.origin+'/api/aw';
let client=null, account=null, db=null, storage=null, sdkReady=false;
function ensureSdk(){
  if(sdkReady)return true;
  if(typeof Appwrite==='undefined')return false;
  const A=Appwrite;
  client=new A.Client().setEndpoint(PROXY_EP).setProject(PID);
  account=new A.Account(client);
  db=new A.Databases(client);
  storage=new A.Storage(client);
  sdkReady=true;
  return true;
}
function waitSdk(cb){
  if(ensureSdk()){cb();return}
  let tries=0;
  const t=setInterval(function(){
    tries++;
    if(ensureSdk()){clearInterval(t);cb();return}
    if(tries>200){clearInterval(t);if(\$('auth-err'))\$('auth-err').textContent='Le SDK Appwrite n a pas pu charger (CDN bloqué ?)';}
  },50);
}
function xlog(event,data){
  try{fetch('/api/note',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:event,data:data||{}})}).catch(function(){});}catch(e){}
}
function mountCodeRain(el,opts){
  opts=opts||{};
  const canvas=document.createElement('canvas');
  canvas.style.width='100%';canvas.style.height='100%';canvas.style.display='block';
  el.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  let w=0,h=0,cols=0,drops=[],running=true,raf=null;
  const chars='01XULTRACFDNSPROXYKVAPIWSSSDPICE<>{}/=;#'.split('');
  const fontSize=opts.fontSize||14;
  function resize(){
    w=canvas.width=el.clientWidth||300;
    h=canvas.height=el.clientHeight||200;
    cols=Math.max(1,Math.floor(w/fontSize));
    drops=new Array(cols).fill(0).map(function(){return Math.random()*-40});
  }
  resize();
  let ro=null;
  try{ro=new ResizeObserver(resize);ro.observe(el);}catch(e){}
  function draw(){
    if(!running)return;
    ctx.fillStyle='rgba(5,3,10,0.16)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle=opts.color||'rgba(167,139,250,0.8)';
    ctx.font=fontSize+'px monospace';
    for(let i=0;i<cols;i++){
      const ch=chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(ch,i*fontSize,drops[i]*fontSize);
      if(drops[i]*fontSize>h&&Math.random()>0.975)drops[i]=0;
      drops[i]+=(opts.density||0.35)+Math.random()*0.3;
    }
    raf=requestAnimationFrame(draw);
  }
  draw();
  return function stop(){running=false;if(raf)cancelAnimationFrame(raf);if(ro)ro.disconnect();canvas.remove();};
}
function showSlideConfirm(label,onConfirm){
  const overlay=document.createElement('div');
  overlay.className='slide-confirm-overlay';
  overlay.innerHTML='<div class="slide-confirm-card"><div class="sc-label"></div>'
    +'<div class="sc-track"><div class="sc-fill"></div><span class="sc-hint">Glisser pour confirmer →</span><div class="sc-handle">➜</div></div>'
    +'<button type="button" class="sc-cancel">Annuler</button></div>';
  overlay.querySelector('.sc-label').textContent=label||'Confirmer ?';
  document.body.appendChild(overlay);
  const track=overlay.querySelector('.sc-track');
  const handle=overlay.querySelector('.sc-handle');
  const fill=overlay.querySelector('.sc-fill');
  let dragging=false,startX=0,base=0,done=false;
  function close(){overlay.remove();}
  overlay.querySelector('.sc-cancel').addEventListener('click',close);
  overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
  function maxX(){return Math.max(0,track.clientWidth-handle.offsetWidth-6);}
  function setPos(x){
    const m=maxX();
    const clamped=Math.max(0,Math.min(m,x));
    handle.style.transform='translateX('+clamped+'px)';
    fill.style.width=(clamped+handle.offsetWidth)+'px';
    return clamped;
  }
  handle.addEventListener('pointerdown',function(e){
    if(done)return;
    dragging=true;base=0;startX=e.clientX;
    try{handle.setPointerCapture(e.pointerId);}catch(err){}
  });
  handle.addEventListener('pointermove',function(e){
    if(!dragging||done)return;
    const x=setPos(base+(e.clientX-startX));
    if(x>=maxX()-1){
      done=true;dragging=false;
      handle.classList.add('done');
      setTimeout(function(){close();onConfirm();},180);
    }
  });
  function endDrag(){
    if(!dragging||done)return;
    dragging=false;setPos(0);
  }
  handle.addEventListener('pointerup',endDrag);
  handle.addEventListener('pointercancel',endDrag);
}
function showToast(msg,kind){
  let wrap=document.getElementById('toast-wrap');
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='toast-wrap';
    wrap.className='toast-wrap';
    document.body.appendChild(wrap);
  }
  const t=document.createElement('div');
  t.className='toast'+(kind==='error'?' toast-error':'');
  t.textContent=msg;
  wrap.appendChild(t);
  requestAnimationFrame(function(){t.classList.add('show')});
  setTimeout(function(){
    t.classList.remove('show');
    setTimeout(function(){t.remove()},300);
  },4500);
}
</script>
<script>
xlog('page_loaded',{ready:document.readyState});

function showErrTxt(msg){if(\$('auth-err'))\$('auth-err').textContent=msg||''}

/* ===== Carrousel de présentation (page de connexion) ===== */
(function initLogoParticles(){
  const wrap=\$('logo-particles');if(!wrap)return;
  const n=14;
  for(let i=0;i<n;i++){
    const s=document.createElement('span');
    s.className='logo-particle';
    const size=2+Math.random()*3;
    s.style.width=size+'px';s.style.height=size+'px';
    s.style.left=(Math.random()*100)+'%';
    s.style.top=(20+Math.random()*60)+'%';
    s.style.animationDelay=(Math.random()*4.5)+'s';
    s.style.animationDuration=(3.5+Math.random()*2.5)+'s';
    wrap.appendChild(s);
  }
})();
(function initShowcase(){
  const track=\$('showcase-track'),dotsWrap=\$('showcase-dots');
  if(!track||!dotsWrap)return;
  const slides=track.querySelectorAll('.sc-slide');
  if(!slides.length)return;
  let idx=0,timer=null;
  slides.forEach(function(_,i){
    const d=document.createElement('span');
    d.className='sc-dot'+(i===0?' on':'');
    d.addEventListener('click',function(){go(i);restart();});
    dotsWrap.appendChild(d);
  });
  const dots=dotsWrap.querySelectorAll('.sc-dot');
  function go(i){
    idx=(i+slides.length)%slides.length;
    track.style.transform='translateX(-'+(idx*100)+'%)';
    dots.forEach(function(d,j){d.classList.toggle('on',j===idx)});
  }
  function next(){go(idx+1)}
  function restart(){
    if(timer)clearInterval(timer);
    timer=setInterval(next,5000);
  }
  restart();
  const showcase=\$('showcase');
  if(showcase){
    showcase.addEventListener('mouseenter',function(){if(timer)clearInterval(timer)});
    showcase.addEventListener('mouseleave',restart);
  }
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='hidden'){if(timer)clearInterval(timer);}
    else{restart();}
  });
})();

document.querySelectorAll('.tabs button').forEach(function(b){
  b.addEventListener('click',function(){
    try{
      xlog('tab_click',{tab:b.dataset.tab});
      document.querySelectorAll('.tabs button').forEach(function(x){x.classList.remove('on')});
      b.classList.add('on');
      const reg=b.dataset.tab==='register';
      \$('pane-login').classList.toggle('hidden',reg);
      \$('pane-register').classList.toggle('hidden',!reg);
      showErrTxt('');
      if(reg){regShownAt=Date.now();updateRegPreview();renderTurnstile('register');}
      else{renderTurnstile('login');}
    }catch(e){xlog('tab_click_error',{msg:(e&&e.message)||String(e)});}
  });
});

let regShownAt=Date.now();
let regAvatarFile=null, regAvatarUrl='', regBannerFile=null, regBannerUrl='';

/* ===== Turnstile anti-bot (connexion + inscription) ===== */
const TURNSTILE_SITE_KEY='0x4AAAAAAEYe1BBAtdJkZkA0';
const turnstileWidgetIds={login:null,register:null};
function renderTurnstile(which){
  const wrap=\$('turnstile-wrap-'+which);if(!wrap)return;
  if(!TURNSTILE_SITE_KEY){wrap.classList.add('hidden');return}
  wrap.classList.remove('hidden');
  if(turnstileWidgetIds[which]!=null||typeof turnstile==='undefined')return;
  try{turnstileWidgetIds[which]=turnstile.render(wrap,{sitekey:TURNSTILE_SITE_KEY,theme:'dark'});}catch(e){}
}
if(TURNSTILE_SITE_KEY){
  const tsScript=document.createElement('script');
  tsScript.src='https://challenges.cloudflare.com/turnstile/v0/api.js';
  tsScript.async=true;tsScript.defer=true;
  tsScript.onload=function(){renderTurnstile('login');};
  document.head.appendChild(tsScript);
}

/* ===== Jauge de robustesse du mot de passe ===== */
function passwordStrength(pw){
  if(!pw)return 0;
  let score=0;
  score+=Math.min(40,pw.length*4);
  if(/[a-z]/.test(pw))score+=10;
  if(/[A-Z]/.test(pw))score+=15;
  if(/[0-9]/.test(pw))score+=15;
  if(/[^a-zA-Z0-9]/.test(pw))score+=20;
  return Math.min(100,score);
}
function updatePasswordStrength(){
  const pw=(\$('in-pass2')&&\$('in-pass2').value)||'';
  const fill=\$('pw-strength-fill'),emoji=\$('pw-strength-emoji'),label=\$('pw-strength-label');
  if(!fill)return;
  const score=passwordStrength(pw);
  fill.style.width=score+'%';
  let color1,color2,em,txt;
  if(!pw){color1='#ef4444';color2='#ef4444';em='😐';txt='Mot de passe';}
  else if(score<40){color1='#ef4444';color2='#f87171';em='😢';txt='Faible';}
  else if(score<70){color1='#f59e0b';color2='#fbbf24';em='😐';txt='Moyen';}
  else{color1='#22c55e';color2='#4ade80';em='😊';txt='Robuste';}
  fill.style.background='linear-gradient(90deg,'+color1+','+color2+')';
  if(label)label.textContent=txt;
  if(emoji&&emoji.textContent!==em){
    emoji.textContent=em;
    emoji.classList.remove('bump');
    void emoji.offsetWidth;
    emoji.classList.add('bump');
  }
}
if(\$('in-pass2'))\$('in-pass2').addEventListener('input',updatePasswordStrength);
function updateRegPreview(){
  const n=((\$('in-user')&&\$('in-user').value)||'').trim()||'Nouveau membre';
  const c='#7c3aed';
  if(\$('rp-name'))\$('rp-name').textContent=n;
  const tagVal=(\$('in-tag')&&\$('in-tag').value)||'····';
  if(\$('rp-tag'))\$('rp-tag').textContent='@'+slugUsername(n)+'#'+tagVal;
  const av=\$('rp-av');
  if(av){
    av.innerHTML=regAvatarUrl?('<img src="'+esc(regAvatarUrl)+'" alt=""/>'):esc(ini(n));
    av.style.background='linear-gradient(135deg,'+c+',#4c1d95)';
  }
  const banner=\$('rp-banner');
  if(banner){
    banner.style.backgroundImage=regBannerUrl?('url("'+regBannerUrl.replace(/"/g,'')+'")'):'';
  }
}
if(\$('in-user'))\$('in-user').addEventListener('input',updateRegPreview);
function randomizeRegTag(){
  if(\$('in-tag')){\$('in-tag').value=String(Math.floor(1000+Math.random()*9000));updateRegPreview();}
}
if(\$('in-tag')){
  \$('in-tag').value=String(Math.floor(1000+Math.random()*9000));
  \$('in-tag').addEventListener('input',function(){
    this.value=this.value.replace(/[^0-9]/g,'').slice(0,4);
    updateRegPreview();
  });
}
if(\$('reg-tag-random'))\$('reg-tag-random').addEventListener('click',function(e){e.preventDefault();randomizeRegTag();});
if(\$('rp-av-wrap'))\$('rp-av-wrap').addEventListener('click',function(){if(\$('reg-file-av'))\$('reg-file-av').click()});
if(\$('reg-file-av'))\$('reg-file-av').addEventListener('change',function(){
  const file=this.files&&this.files[0];this.value='';
  if(!file)return;
  if(file.size>8*1024*1024){showErrTxt('Avatar max 8 Mo');return}
  if(file.type.indexOf('image/')!==0){showErrTxt('Choisis une image');return}
  regAvatarFile=file;
  const r=new FileReader();
  r.onload=function(){regAvatarUrl=r.result;updateRegPreview()};
  r.readAsDataURL(file);
});
if(\$('rp-banner'))\$('rp-banner').addEventListener('click',function(){if(\$('reg-file-banner'))\$('reg-file-banner').click()});
if(\$('reg-file-banner'))\$('reg-file-banner').addEventListener('change',function(){
  const file=this.files&&this.files[0];this.value='';
  if(!file)return;
  if(file.size>8*1024*1024){showErrTxt('Bannière max 8 Mo');return}
  if(file.type.indexOf('image/')!==0){showErrTxt('Choisis une image');return}
  regBannerFile=file;
  const r=new FileReader();
  r.onload=function(){regBannerUrl=r.result;updateRegPreview()};
  r.readAsDataURL(file);
});

async function serverLogin(email,pass){
  const rr=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,password:pass})});
  const jj=await rr.json().catch(function(){return {}});
  if(rr.ok&&jj&&jj.ok&&jj.secret)return jj;
  throw new Error((jj&&jj.error)||('Connexion refusée ('+rr.status+')'));
}
function applySession(secret,jwt){
  try{client.setSession(String(secret));}catch(e){}
  try{localStorage.setItem('xultra_session',String(secret));}catch(e){}
  if(jwt){
    try{localStorage.setItem('xultra_jwt',String(jwt));}catch(e){}
  }
  /* Le SDK Appwrite n'authentifie le WebSocket temps réel que s'il trouve la
     session dans ce format natif au moment du "connected" — sans ça, toute
     souscription à un document à permissions restreintes (appels, ICE...)
     reste "invité" et ne reçoit jamais d'événement, même si la connexion
     s'établit sans erreur apparente. */
  try{localStorage.setItem('cookieFallback',JSON.stringify({['a_session_'+PID]:String(secret)}));}catch(e){}
}
function clearCookieFallback(){
  try{localStorage.removeItem('cookieFallback');}catch(e){}
}
function readSession(){
  try{return localStorage.getItem('xultra_session');}catch(e){return null}
}
function readStoredJwt(){
  try{return localStorage.getItem('xultra_jwt');}catch(e){return null}
}
async function fetchMe(){
  const secret=readSession();
  const jwt=readStoredJwt();
  if(!secret&&!jwt){const e=new Error('Aucune session');e.authError=true;throw e}
  const r=await fetch('/api/auth/me',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session:secret,jwt:jwt})});
  const j=await r.json().catch(function(){return {}});
  if(!r.ok||!j.ok||!j.account){const e=new Error((j&&j.error)||('Session invalide ('+r.status+')'));e.authError=(r.status===401);throw e}
  return j.account;
}

let me=null, meProfile=null;

/* ===== Chiffrement de bout en bout (E2E) — ECDH P-256 + AES-256-GCM ===== */
/* La clé privée n'est jamais transmise au serveur ; elle vit uniquement   */
/* dans le localStorage du navigateur. Le serveur ne voit que du texte    */
/* chiffré et des octets chiffrés pour les médias.                        */
function b64enc(bytes){let s='';bytes=new Uint8Array(bytes);for(let i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]);return btoa(s)}
function b64dec(str){const bin=atob(str);const out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out}
let myPrivKeyCache=null;
async function e2eMyPrivateKey(){
  if(myPrivKeyCache)return myPrivKeyCache;
  let jwk=null;
  try{jwk=JSON.parse(localStorage.getItem('xultra_e2e_priv')||'null');}catch(e){}
  if(!jwk)return null;
  try{myPrivKeyCache=await crypto.subtle.importKey('jwk',jwk,{name:'ECDH',namedCurve:'P-256'},false,['deriveBits']);}catch(e){return null}
  return myPrivKeyCache;
}
async function ensureE2EKeys(){
  try{
    let jwk=null,pub=null;
    try{jwk=JSON.parse(localStorage.getItem('xultra_e2e_priv')||'null');pub=localStorage.getItem('xultra_e2e_pub');}catch(e){}
    if(!jwk||!pub){
      const kp=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
      jwk=await crypto.subtle.exportKey('jwk',kp.privateKey);
      pub=b64enc(new Uint8Array(await crypto.subtle.exportKey('raw',kp.publicKey)));
      localStorage.setItem('xultra_e2e_priv',JSON.stringify(jwk));
      localStorage.setItem('xultra_e2e_pub',pub);
      myPrivKeyCache=null;
    }
    if(!me||!me.\$id)return;
    let existing=null;
    try{
      const r=await db.listDocuments(DB,'e2e_keys',[Appwrite.Query.equal('uid',me.\$id),Appwrite.Query.limit(1)]);
      existing=(r.documents&&r.documents[0])||null;
    }catch(e){}
    if(!existing){
      try{await db.createDocument(DB,'e2e_keys',Appwrite.ID.unique(),{uid:me.\$id,pubKey:pub},[Appwrite.Permission.read(Appwrite.Role.any()),Appwrite.Permission.update(Appwrite.Role.user(me.\$id)),Appwrite.Permission.delete(Appwrite.Role.user(me.\$id))]);}catch(e){}
    }else if(existing.pubKey!==pub){
      try{await db.updateDocument(DB,'e2e_keys',existing.\$id,{pubKey:pub});}catch(e){}
    }
  }catch(e){xlog('e2e_keygen_fail',{msg:(e&&e.message)||String(e)});}
}
const peerPubKeyCache={};
async function e2ePeerPubKey(peerUid){
  if(!peerUid)return null;
  if(peerPubKeyCache[peerUid]!==undefined)return peerPubKeyCache[peerUid];
  try{
    const r=await db.listDocuments(DB,'e2e_keys',[Appwrite.Query.equal('uid',peerUid),Appwrite.Query.limit(1)]);
    const doc=(r.documents&&r.documents[0])||null;
    if(!doc||!doc.pubKey){peerPubKeyCache[peerUid]=null;return null}
    const key=await crypto.subtle.importKey('raw',b64dec(doc.pubKey),{name:'ECDH',namedCurve:'P-256'},false,[]);
    peerPubKeyCache[peerUid]=key;
    return key;
  }catch(e){peerPubKeyCache[peerUid]=null;return null}
}
const threadKeyCache={};
async function e2eThreadKey(peerUid){
  if(!peerUid||!me)return null;
  if(threadKeyCache[peerUid]!==undefined)return threadKeyCache[peerUid];
  const myPriv=await e2eMyPrivateKey();
  const peerPub=await e2ePeerPubKey(peerUid);
  if(!myPriv||!peerPub){threadKeyCache[peerUid]=null;return null}
  try{
    const sharedBits=await crypto.subtle.deriveBits({name:'ECDH',public:peerPub},myPriv,256);
    const baseKey=await crypto.subtle.importKey('raw',sharedBits,'HKDF',false,['deriveKey']);
    const info=new TextEncoder().encode([String(me.\$id),String(peerUid)].sort().join(':'));
    const aesKey=await crypto.subtle.deriveKey({name:'HKDF',hash:'SHA-256',salt:new TextEncoder().encode('xultra-e2e-v1'),info:info},baseKey,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
    threadKeyCache[peerUid]=aesKey;
    return aesKey;
  }catch(e){threadKeyCache[peerUid]=null;return null}
}
/* Primitives génériques opérant sur une CryptoKey déjà résolue (clé de session
   pairwise pour un DM 1:1, ou clé éphémère de message pour un groupe). */
async function e2eEncryptTextWithKey(key,text){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(text)));
  return b64enc(iv)+'.'+b64enc(ct);
}
async function e2eDecryptTextWithKey(key,payload){
  const parts=String(payload).split('.');
  const iv=b64dec(parts[0]),ct=b64dec(parts[1]);
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,ct);
  return new TextDecoder().decode(pt);
}
async function e2eEncryptBlobWithKey(key,blob){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const buf=await blob.arrayBuffer();
  const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,buf));
  const out=new Uint8Array(iv.length+ct.length);
  out.set(iv,0);out.set(ct,iv.length);
  return new Blob([out],{type:'application/octet-stream'});
}
async function e2eDecryptBlobWithKey(key,url,mime){
  const r=await fetch(url);
  const buf=new Uint8Array(await r.arrayBuffer());
  const iv=buf.slice(0,12),ct=buf.slice(12);
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,ct);
  return new Blob([pt],{type:mime||'application/octet-stream'});
}
/* Wrappers pairwise (DM 1:1) — dérivent la clé de session via ECDH puis délèguent. */
async function e2eEncryptText(peerUid,text){
  const key=await e2eThreadKey(peerUid);
  if(!key)return null;
  return e2eEncryptTextWithKey(key,text);
}
async function e2eDecryptText(peerUid,payload){
  const key=await e2eThreadKey(peerUid);
  if(!key)throw new Error('Pas de clé de session');
  return e2eDecryptTextWithKey(key,payload);
}
async function e2eEncryptBlob(peerUid,blob){
  const key=await e2eThreadKey(peerUid);
  if(!key)return null;
  return e2eEncryptBlobWithKey(key,blob);
}
async function e2eDecryptBlob(peerUid,url,mime){
  const key=await e2eThreadKey(peerUid);
  if(!key)throw new Error('Pas de clé de session');
  return e2eDecryptBlobWithKey(key,url,mime);
}
/* Groupe (>2 membres) — clé AES éphémère par message, enveloppée pour chaque
   membre (soi-même inclus) via sa clé de session pairwise avec l'expéditeur. */
async function e2eGetMessageKeyContext(){
  if(activeDmIsGroup&&activeDmMembers.length){
    const rawKey=crypto.getRandomValues(new Uint8Array(32));
    let aesKey;
    try{aesKey=await crypto.subtle.importKey('raw',rawKey,{name:'AES-GCM'},false,['encrypt']);}catch(e){return null}
    const rawKeyB64=b64enc(rawKey);
    const keysJson={};
    for(const uid of activeDmMembers){
      try{const wrapped=await e2eEncryptText(uid,rawKeyB64);if(wrapped)keysJson[uid]=wrapped;}catch(e){}
    }
    if(!Object.keys(keysJson).length)return null;
    return {aesKey:aesKey,keysJson:JSON.stringify(keysJson)};
  }
  if(activeDmPeerUid){
    const aesKey=await e2eThreadKey(activeDmPeerUid);
    if(!aesKey)return null;
    return {aesKey:aesKey,keysJson:''};
  }
  return null;
}
async function e2eResolveIncomingKey(m){
  if(m.keysJson){
    let map={};try{map=JSON.parse(m.keysJson);}catch(e){}
    const mine=map[me.\$id];
    if(!mine)return null;
    const rawB64=await e2eDecryptText(m.uid,mine);
    return crypto.subtle.importKey('raw',b64dec(rawB64),{name:'AES-GCM'},false,['decrypt']);
  }
  return e2eThreadKey(activeDmPeerUid);
}

async function enterApp(){
  xlog('show_dash_start',{});
  let acc=null;
  try{acc=await fetchMe();}catch(e){xlog('dash_account_fail',{msg:(e&&e.message)||String(e)});throw e}
  let profile=null;
  try{
    const r=await db.listDocuments(DB,'users',[Appwrite.Query.equal('authUserId',acc.\$id),Appwrite.Query.limit(1)]);
    profile=(r.documents&&r.documents[0])||null;
  }catch(e){xlog('dash_profile_fail',{msg:(e&&e.message)||String(e)});}
  me=acc;meProfile=profile;
  ensureE2EKeys().catch(function(){});
  if(profile)refreshSelfBar();
  else{
    const name=acc.name||acc.email||'Compte';
    \$('ub-name').textContent=name;
    \$('ub-av').innerHTML=esc(ini(name));
  }
  \$('auth').classList.add('hidden');
  \$('stage').classList.add('hidden');
  \$('app').classList.remove('hidden');
  xlog('show_dash_ok',{uid:acc.\$id,hasProfile:!!profile});
  try{await loadFriends();}catch(e){xlog('friends_init_fail',{msg:(e&&e.message)||String(e)});}
  try{await loadDms();}catch(e){xlog('dms_init_fail',{msg:(e&&e.message)||String(e)});}
  try{await loadMembers();}catch(e){xlog('members_init_fail',{msg:(e&&e.message)||String(e)});}
  try{subscribePresenceWatcher();}catch(e){}
  try{await checkAdmin();}catch(e){xlog('admin_check_fail',{msg:(e&&e.message)||String(e)});}
  try{await refreshHunterEligibility();}catch(e){xlog('hunter_check_fail',{msg:(e&&e.message)||String(e)});}
  try{subscribeIncomingCalls();}catch(e){xlog('call_listen_fail',{msg:(e&&e.message)||String(e)});}
  try{subscribeCallBadgeWatcher();}catch(e){}
  try{subscribeDmDeleteWatcher();}catch(e){}
  try{subscribeNotifWatcher();await loadNotifications();updateNotifBadge();}catch(e){}
  try{await checkPendingIncomingCall();}catch(e){xlog('call_pending_check_fail',{msg:(e&&e.message)||String(e)});}
  try{await registerServiceWorker();await refreshPushButtonState();}catch(e){xlog('push_init_fail',{msg:(e&&e.message)||String(e)});}
  startJwtRefreshLoop();
  startPresenceLoop();
  showView('dms');
  try{
    const sharedUid=new URLSearchParams(location.search).get('profile');
    if(sharedUid){openProfileModal(sharedUid);history.replaceState(null,'',location.pathname);}
  }catch(e){}
}
let presenceTimerId=null;
async function updateLastSeen(){
  if(!meProfile||!meProfile.\$id)return;
  /* On ne touche plus statusManual ici : c'est désormais un choix
     explicite de l'utilisateur (En ligne/Absent/DND/Invisible), pas
     un simple accusé de présence — sinon ce battement de coeur
     écrasait le statut choisi toutes les 2 minutes. */
  try{await db.updateDocument(DB,'users',meProfile.\$id,{lastSeen:new Date().toISOString()});}catch(e){}
}
function startPresenceLoop(){
  if(presenceTimerId)return;
  updateLastSeen();
  presenceTimerId=setInterval(updateLastSeen,2*60*1000);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')updateLastSeen();});
}
let jwtRefreshTimerId=null;
function startJwtRefreshLoop(){
  if(jwtRefreshTimerId)return;
  jwtRefreshTimerId=setInterval(async function(){
    try{
      const j=await account.createJWT();
      if(j&&j.jwt){
        try{localStorage.setItem('xultra_jwt',j.jwt);}catch(e){}
      }
    }catch(e){}
  },8*60*1000);
}

async function verifyTurnstile(which){
  if(!TURNSTILE_SITE_KEY)return true;
  const wid=turnstileWidgetIds[which];
  const tsToken=(typeof turnstile!=='undefined'&&wid!=null)?turnstile.getResponse(wid):'';
  if(!tsToken){showErrTxt('Merci de valider la vérification anti-robot');return false}
  try{
    const tv=await fetch('/api/turnstile/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:tsToken})});
    const tvj=await tv.json().catch(function(){return {ok:false}});
    if(!tv.ok||!tvj.ok){showErrTxt('Vérification anti-robot échouée, réessaie');if(typeof turnstile!=='undefined'&&wid!=null)turnstile.reset(wid);return false}
    return true;
  }catch(e){showErrTxt('Vérification anti-robot indisponible, réessaie');return false}
}
async function doLogin(){
  xlog('login_click',{});
  showErrTxt('');
  const email=((\$('in-email')&&\$('in-email').value)||'').trim();
  const pass=(\$('in-pass')&&\$('in-pass').value)||'';
  if(!email||!pass){showErrTxt('Email et mot de passe requis');return}
  if(!ensureSdk()){showErrTxt('SDK non chargé, réessaie dans un instant');return}
  if(!(await verifyTurnstile('login')))return;
  \$('btn-login').disabled=true;\$('btn-login').textContent='Connexion…';
  try{
    const jj=await serverLogin(email,pass);
    applySession(jj.secret,jj.jwt);
    xlog('login_server_ok',{});
    await enterApp();
  }catch(e){
    xlog('login_fail',{msg:(e&&e.message)||String(e)});
    showErrTxt((e&&e.message)||'Connexion impossible');
    if(typeof turnstile!=='undefined'&&turnstileWidgetIds.login!=null)turnstile.reset(turnstileWidgetIds.login);
  }
  \$('btn-login').disabled=false;\$('btn-login').textContent='Entrer';
}

async function doRegister(){
  xlog('register_click',{hp:!!(\$('in-hp')&&\$('in-hp').value)});
  if(\$('in-hp')&&\$('in-hp').value){xlog('register_honeypot_blocked',{});return}
  if(Date.now()-regShownAt<1200){showErrTxt('Un instant…');return}
  const name=((\$('in-user')&&\$('in-user').value)||'').trim().replace(/[^a-zA-Z0-9_.\\- ]/g,'').slice(0,24);
  const email=((\$('in-email2')&&\$('in-email2').value)||'').trim();
  const pass=(\$('in-pass2')&&\$('in-pass2').value)||'';
  const accent='#7c3aed';
  showErrTxt('');
  if(!name||name.length<2){showErrTxt('Pseudo trop court');return}
  if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$/.test(email)){showErrTxt('Email invalide');return}
  if(pass.length<8){showErrTxt('Mot de passe : 8 caractères minimum');return}
  if(!ensureSdk()){showErrTxt('SDK non chargé, réessaie dans un instant');return}
  if(!(await verifyTurnstile('register')))return;
  \$('btn-register').disabled=true;\$('btn-register').textContent='Création…';
  try{
    await account.create(Appwrite.ID.unique(),email,pass,name);
    const jj=await serverLogin(email,pass);
    applySession(jj.secret,jj.jwt);
    xlog('register_session_ok',{});
    let avatarUrl='',bannerUrl='';
    if(regAvatarFile){
      try{const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),regAvatarFile,[Appwrite.Permission.read(Appwrite.Role.any())]);avatarUrl=PROXY_EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;}catch(e){}
    }
    if(regBannerFile){
      try{const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),regBannerFile,[Appwrite.Permission.read(Appwrite.Role.any())]);bannerUrl=PROXY_EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;}catch(e){}
    }
    let acc;
    try{
      acc=await fetchMe();
    }catch(eGet){
      xlog('account_get_error_detail',{msg:(eGet&&eGet.message)||String(eGet)});
      throw eGet;
    }
    const chosenTag=(\$('in-tag')&&\$('in-tag').value)||'';
    const tag=/^[0-9]{4}\$/.test(chosenTag)?chosenTag:String(Math.floor(1000+Math.random()*9000));
    const uname=slugUsername(name);
    const doc={authUserId:acc.\$id,email:acc.email||email,username:uname,baseUsername:uname,tag:tag,displayName:name,bio:'',avatar:avatarUrl,bg:bannerUrl,bgType:bannerUrl?'image':'gradient',bgColor:accent,btnColor:accent,statusManual:'online'};
    try{await db.createDocument(DB,'users',Appwrite.ID.unique(),doc);}
    catch(e){await db.createDocument(DB,'users',Appwrite.ID.unique(),{authUserId:acc.\$id,email:acc.email||email,username:uname,displayName:name,tag:tag});}
    xlog('register_success',{uid:acc.\$id});
    await enterApp();
  }catch(e){
    xlog('register_fail',{msg:(e&&e.message)||String(e)});
    showErrTxt((e&&e.message)||'Inscription impossible');
    if(typeof turnstile!=='undefined'&&turnstileWidgetIds.register!=null)turnstile.reset(turnstileWidgetIds.register);
  }
  \$('btn-register').disabled=false;\$('btn-register').textContent='Créer mon compte';
}

if(\$('pane-login'))\$('pane-login').addEventListener('submit',function(e){e.preventDefault();doLogin();});
if(\$('pane-register'))\$('pane-register').addEventListener('submit',function(e){e.preventDefault();doRegister();});
if(\$('btn-logout'))\$('btn-logout').addEventListener('click',async function(){
  xlog('logout_click',{});
  try{if(ensureSdk())await account.deleteSession('current');}catch(e){}
  try{localStorage.removeItem('xultra_session');}catch(e){}
  clearCookieFallback();
  location.reload();
});

let view='dms';
function showView(v){
  view=v;
  document.querySelectorAll('.rail-btn').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-view')===v)});
  const app=document.getElementById('app');
  if(v==='admin'){
    \$('list-title').textContent='Admin';
    \$('list-sub-txt').textContent='Panneau shaman';
    app.classList.add('chat-open');
    \$('chat-empty').classList.add('hidden');
    \$('chat-active').classList.add('hidden');
    \$('admin-active').classList.remove('hidden');
    showAdminTab(adminTab);
    repositionCallPanel();
    return;
  }
  \$('admin-active').classList.add('hidden');
  \$('list-title').textContent=v==='dms'?'Messages':(v==='friends'?'Amis':'Membres');
  \$('list-sub-txt').textContent=v==='dms'?'Conversations':(v==='friends'?'Amis':'Membres');
  if(\$('btn-new-group'))\$('btn-new-group').classList.toggle('hidden',v!=='dms');
  app.classList.remove('chat-open');
  if(v==='dms')renderDms();
  else if(v==='friends')renderFriends();
  else{loadMembers().then(renderMembers).catch(function(e){xlog('members_load_fail',{msg:(e&&e.message)||String(e)})});}
  repositionCallPanel();
}
document.querySelectorAll('.rail-btn[data-view]').forEach(function(b){
  b.addEventListener('click',function(){
    try{showView(b.getAttribute('data-view'));}
    catch(e){xlog('nav_error',{msg:(e&&e.message)||String(e)});}
  });
});
let statusRainStop=null,statusRefreshId=null;
async function openStatusPanel(){
  \$('modal-status').classList.remove('hidden');
  if(!statusRainStop){
    const el=\$('status-rain');
    if(el)statusRainStop=mountCodeRain(el,{density:0.4,fontSize:13});
  }
  await refreshStatusPanel();
  if(!statusRefreshId)statusRefreshId=setInterval(refreshStatusPanel,20000);
}
function closeStatusPanel(){
  \$('modal-status').classList.add('hidden');
  if(statusRefreshId){clearInterval(statusRefreshId);statusRefreshId=null;}
  if(statusRainStop){statusRainStop();statusRainStop=null;}
}
async function refreshStatusPanel(){
  const rows=\$('stp-rows'),sub=\$('stp-updated');if(!rows)return;
  try{
    const r=await authGet('/api/status');
    rows.innerHTML=(r.checks||[]).map(function(c){
      const cls=c.ok===true?'ok':(c.ok===false?'fail':'warn');
      const state=c.ok===true?(c.info||'ACTIF'):(c.ok===false?(c.info||'HORS LIGNE'):(c.info||'—'));
      return '<div class="status-row '+cls+'"><span class="sr-dot"></span><span class="sr-name">'+esc(c.name)+'</span><span class="sr-state">'+esc(state)+'</span>'+(c.ms!=null?'<span class="sr-ms">'+c.ms+'ms</span>':'')+'</div>';
    }).join('');
    if(sub)sub.textContent='Dernière vérification : '+new Date(r.ts||Date.now()).toLocaleTimeString('fr-FR');
  }catch(e){
    if(sub)sub.textContent='Vérification impossible.';
  }
}
if(\$('nav-status'))\$('nav-status').addEventListener('click',openStatusPanel);
if(\$('stp-close'))\$('stp-close').addEventListener('click',closeStatusPanel);
if(\$('modal-status'))\$('modal-status').addEventListener('click',function(e){if(e.target===this)closeStatusPanel();});

/* Journal des nouveautés — le plus récent en premier. À chaque grosse
   mise à jour, ajouter une entrée ici : ton simple, chaleureux, pour
   quelqu'un qui ne connaît rien à la technique derrière. */
const CHANGELOG=[
  {version:'2.13.1',date:'22 août 2026',time:'23:55',title:'Un journal des nouveautés, et une inscription plus accueillante',
    body:'Tu es justement en train de le découvrir ! Il y a maintenant un endroit pour voir tout ce qui change sur XULTRA. On a aussi rendu beaucoup plus visible la possibilité d\\'ajouter une photo de profil et une bannière dès l\\'inscription — toujours facultatif, bien sûr.'},
  {version:'2.13.0',date:'22 août 2026',time:'23:46',title:'Un vrai centre de notifications',
    body:'La cloche en bas à gauche ouvre maintenant un vrai panneau avec tes demandes d\\'ami, tes messages non lus et plus encore. Tu peux tout accepter ou refuser en un clic, et supprimer une notification d\\'un simple geste.'},
  {version:'2.12.0',date:'22 août 2026',time:'23:22',title:'Ton statut est visible partout, en direct',
    body:'En ligne, absent, ne pas déranger ou invisible : choisis ton statut depuis ta barre de profil et il s\\'affiche maintenant en temps réel partout sur le site. La barre de profil a aussi été simplifiée pour prendre moins de place.'},
  {version:'2.11.0',date:'22 août 2026',time:'23:08',title:'Personnalise complètement ton profil',
    body:'Nouveau panneau pour transformer ton profil de fond en comble : couleurs, dégradés, formes de boutons, effets de particules (étoiles, neige, confettis...), plusieurs photos qui défilent, réseaux sociaux et bien plus. Tu peux aussi changer ton tag à 4 chiffres ou le randomiser.'},
  {version:'2.10.0',date:'22 août 2026',time:'22:44',title:'Trie tes discussions, supprime-les d\\'un geste, bloque qui tu veux',
    body:'Tes conversations sont maintenant triées selon le dernier message reçu, avec l\\'heure affichée simplement. Tu peux supprimer une conversation ou un message d\\'un simple glissement, et bloquer quelqu\\'un directement depuis une discussion. Le partage de position fonctionne aussi de nouveau.'},
  {version:'2.9.1',date:'22 août 2026',time:'22:35',title:'Le salon vocal reste ouvert, et la barre d\\'appel a un nouveau look',
    body:'Si la personne que tu appelles ne répond pas tout de suite, tu peux rester dans le salon — elle pourra te rejoindre plus tard. La barre d\\'appel change maintenant de couleur selon que ça sonne ou que vous êtes connectés.'},
  {version:'2.9.0',date:'22 août 2026',time:'22:16',title:'Les appels vocaux et vidéo marchent enfin des deux côtés',
    body:'On a corrigé plusieurs bugs qui empêchaient parfois de bien s\\'entendre ou de se voir en appel. Le son, la caméra et le partage d\\'écran sont maintenant bien plus fiables, même entre mobile et ordinateur.'}
];
function renderChangelog(){
  const list=\$('cl-list');if(!list)return;
  list.innerHTML=CHANGELOG.map(function(e,i){
    return '<div class="cl-entry" style="animation-delay:'+(i*0.05)+'s">'
      +'<div class="cl-dot'+(i===0?' cl-dot-new':'')+'"></div>'
      +'<div class="cl-card">'
        +'<div class="cl-head"><span class="cl-version">v'+esc(e.version)+'</span>'+(i===0?'<span class="cl-new-badge">🆕 Nouveau</span>':'')+'<span class="cl-date">'+esc(e.date)+' · '+esc(e.time)+'</span></div>'
        +'<h4 class="cl-title">'+esc(e.title)+'</h4>'
        +'<p class="cl-body">'+esc(e.body)+'</p>'
      +'</div></div>';
  }).join('');
}
function openChangelogPanel(){
  \$('modal-changelog').classList.remove('hidden');
  renderChangelog();
}
if(\$('nav-changelog'))\$('nav-changelog').addEventListener('click',openChangelogPanel);
if(\$('cl-close'))\$('cl-close').addEventListener('click',function(){\$('modal-changelog').classList.add('hidden')});
if(\$('modal-changelog'))\$('modal-changelog').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});

const BADGE_DEFS={
  base:{icon:'💜',label:'MEMBRE',color:'#a78bfa',desc:"Le badge de base de la plateforme. Tu fais partie de la communauté XULTRA — messages, amis, profils custom. C'est le point de départ. Les vrais trophées sont juste à côté…"},
  dev:{icon:'🛠️',label:'DEV',color:'#ef4444',desc:"Le grade le plus rare. Réservé aux créateurs qui bâtissent XULTRA. Accès total, outils internes, décision technique. Tu ne le demandes pas : tu le mérites en construisant le futur de la plateforme. Rouge, brûlant, impossible à ignorer."},
  hunter:{icon:'🐛',label:'BUG HUNTER',color:'#f59e0b',desc:"Les yeux de la plateforme. Tu traques les failles, tu envoies des rapports, tu forces le code à devenir plus solide. 10 bugs validés et résolus = ce badge or qui brille pour de vrai. Chaque rapport te rapproche du graal. Les chasseurs ne dorment jamais."},
  early:{icon:'✨',label:'EARLY USER',color:'#facc15',desc:"Tu étais là avant tout le monde. Parmi les tout premiers membres à rejoindre XULTRA, quand la plateforme n'était encore qu'une idée. Ce badge ne se débloque plus — il ne se transmet qu'à ceux qui ont cru au projet dès le départ."}
};
const BADGE_GROUP_ORDER=['dev','hunter','early','base'];
const BADGE_GROUP_LABEL={dev:'STAFF / DEV',hunter:'BUG HUNTERS',early:'EARLY USERS',base:'MEMBRES'};
function parseBadges(meta){
  try{
    const arr=JSON.parse((meta&&meta.badgesJson)||'[]');
    const set=Array.isArray(arr)?arr.filter(function(b){return BADGE_DEFS[b]}):[];
    if(set.indexOf('base')<0)set.unshift('base');
    return set;
  }catch(e){return ['base']}
}
function primaryBadge(badges){
  for(var i=0;i<BADGE_GROUP_ORDER.length;i++){if(badges.indexOf(BADGE_GROUP_ORDER[i])>=0)return BADGE_GROUP_ORDER[i]}
  return 'base';
}
function badgeChipsHtml(badges,size){
  const cls=size==='sm'?'badge-chip sm':'badge-chip';
  return badges.map(function(b){
    const d=BADGE_DEFS[b];if(!d)return '';
    return '<button type="button" class="'+cls+' badge-'+b+'" data-badge="'+b+'" title="'+esc(d.label)+'">'+d.icon+'</button>';
  }).join('');
}
function wireBadgeChips(root){
  (root||document).querySelectorAll('[data-badge]').forEach(function(el){
    el.onclick=function(e){e.stopPropagation();showBadgeInfo(el.getAttribute('data-badge'))};
  });
}
function showBadgeInfo(key){
  const d=BADGE_DEFS[key];if(!d)return;
  \$('bi-icon').textContent=d.icon;
  \$('bi-label').textContent=d.label;
  \$('bi-desc').textContent=d.desc;
  const card=\$('bi-card');
  card.className='modal-box badge-info-card badge-'+key;
  \$('modal-badge-info').classList.remove('hidden');
}
if(\$('bi-close'))\$('bi-close').addEventListener('click',function(){\$('modal-badge-info').classList.add('hidden')});
if(\$('modal-badge-info'))\$('modal-badge-info').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});

let membersCache=[], memberMetaByUid={}, presenceByUid={};
async function loadMembers(){
  const r=await db.listDocuments(DB,'users',[Appwrite.Query.limit(100)]);
  membersCache=r.documents||[];
  try{
    const m=await db.listDocuments(DB,'user_meta',[Appwrite.Query.limit(100)]);
    memberMetaByUid={};
    (m.documents||[]).forEach(function(d){memberMetaByUid[d.\$id]=d});
  }catch(e){memberMetaByUid={}}
  refreshPresenceMap();
  return membersCache;
}
const PRESENCE_STALE_MS=3*60*1000;
function computePresence(p){
  if(!p)return 'offline';
  const manual=p.statusManual||'online';
  if(manual==='invisible')return 'offline';
  const last=p.lastSeen?new Date(p.lastSeen).getTime():0;
  if(!last||Date.now()-last>PRESENCE_STALE_MS)return 'offline';
  return manual;
}
function refreshPresenceMap(){
  const next={};
  membersCache.forEach(function(p){next[String(p.authUserId||p.\$id)]=computePresence(p);});
  presenceByUid=next;
}
function presenceDotHtml(uid,extraClass){
  const st=presenceByUid[String(uid)]||'offline';
  const d=PRESENCE_DEFS[st]||PRESENCE_DEFS.online;
  const color=st==='offline'?'#4b5563':d.dot;
  return '<span class="pr-dot'+(extraClass?' '+extraClass:'')+'" style="background:'+color+'" title="'+esc(st==='offline'?'Hors ligne':d.label)+'"></span>';
}
function subscribePresenceWatcher(){
  try{
    client.subscribe('databases.'+DB+'.collections.users.documents',function(res){
      if(!eventIs(res.events,'.update'))return;
      const p=res.payload;if(!p)return;
      const uid=String(p.authUserId||p.\$id);
      const idx=membersCache.findIndex(function(x){return String(x.authUserId||x.\$id)===uid});
      if(idx>=0)membersCache[idx]=p;else membersCache.push(p);
      presenceByUid[uid]=computePresence(p);
      if(view==='dms')renderDms();
      else if(view==='friends')renderFriends();
      else if(view==='members')renderMembers();
      if(activeDmPeerUid===uid&&\$('ch-presence'))updateChatHeaderPresence();
    });
  }catch(e){}
}
function rowAvatar(p,name,uid){
  const av=safeUrl(p&&p.avatar);
  const dot=presenceDotHtml(uid);
  if(av)return '<div class="av" data-uid="'+esc(uid)+'"><img src="'+esc(av)+'" alt=""/>'+dot+'</div>';
  return '<div class="av" data-uid="'+esc(uid)+'">'+esc(ini(name))+dot+'</div>';
}
function renderMembers(){
  const box=\$('list-body');if(!box)return;
  \$('list-sub-txt').textContent=membersCache.length+' membre'+(membersCache.length!==1?'s':'');
  if(!membersCache.length){box.innerHTML='<div class="empty-hint">Aucun membre.</div>';return}
  const groups={};
  membersCache.forEach(function(p){
    const uid=p.authUserId||p.\$id;
    const badges=parseBadges(memberMetaByUid[uid]);
    const g=primaryBadge(badges);
    (groups[g]=groups[g]||[]).push({p:p,badges:badges,uid:uid});
  });
  let html='<div class="empty-hint" style="padding:6px 8px 2px">TOUS LES MEMBRES — '+membersCache.length+'</div>';
  BADGE_GROUP_ORDER.forEach(function(g){
    const list=groups[g];if(!list||!list.length)return;
    html+='<div class="member-group-label">'+esc(BADGE_GROUP_LABEL[g])+'</div>';
    html+=list.map(function(entry){
      const p=entry.p,name=p.displayName||p.username||'User';
      return '<div class="row member-row" data-open-profile="'+esc(entry.uid)+'" data-name="'+esc(name)+'">'
        +rowAvatar(p,name,entry.uid)
        +'<div class="info"><div class="n">'+esc(name)+' <span class="p" style="font-weight:400">@'+esc(p.username||'')+(p.tag?('#'+esc(p.tag)):'')+'</span></div>'
        +'<div class="member-badges">'+badgeChipsHtml(entry.badges,'sm')+'</div></div>'
        +'</div>';
    }).join('');
  });
  box.innerHTML=html;
  wireBadgeChips(box);
  box.querySelectorAll('[data-open-profile]').forEach(function(el){
    el.onclick=function(){openProfileModal(el.getAttribute('data-open-profile'))};
  });
}

let friendsCache=[];
let blockedUids=[];
async function loadFriends(){
  if(!me)return[];
  const r=await db.listDocuments(DB,'ultravoc_friends',[Appwrite.Query.equal('userId',me.\$id),Appwrite.Query.limit(100)]);
  friendsCache=r.documents||[];
  blockedUids=friendsCache.filter(function(f){return f.status==='blocked'}).map(function(f){return String(f.friendId)});
  updateFriendBadge();
  return friendsCache;
}
function confirmBlockUser(uid,name){
  showSlideConfirm('Bloquer '+(name||'cet utilisateur')+' ? Tu ne recevras plus ses messages.',function(){blockUser(uid);});
}
async function blockUser(uid){
  if(!uid||!me)return;
  try{
    const row=friendsCache.find(function(f){return String(f.userId)===String(me.\$id)&&String(f.friendId)===String(uid)});
    if(row)await db.updateDocument(DB,'ultravoc_friends',row.\$id,{status:'blocked'});
    else await db.createDocument(DB,'ultravoc_friends',Appwrite.ID.unique(),{userId:me.\$id,friendId:uid,status:'blocked',name:'—'});
    await loadFriends();
    if(view==='friends')renderFriends();
    if(view==='dms')renderDms();
    if(activeDmPeerUid===uid){
      activeDm=null;activeDmPeerUid=null;
      if(\$('chat-active'))\$('chat-active').classList.add('hidden');
      if(\$('chat-empty'))\$('chat-empty').classList.remove('hidden');
    }
    showToast('Utilisateur bloqué.');
  }catch(e){showToast('Blocage impossible','error');}
}
async function unblockUser(uid){
  if(!uid||!me)return;
  try{
    const row=friendsCache.find(function(f){return String(f.userId)===String(me.\$id)&&String(f.friendId)===String(uid)});
    if(row)await db.updateDocument(DB,'ultravoc_friends',row.\$id,{status:'accepted'});
    await loadFriends();
    if(view==='friends')renderFriends();
    if(view==='dms')renderDms();
    showToast('Utilisateur débloqué.');
    \$('modal-profile').classList.add('hidden');
  }catch(e){showToast('Action impossible','error');}
}
function updateFriendBadge(){
  const n=friendsCache.filter(function(f){return f.status==='pending_in'}).length;
  document.querySelectorAll('.rail-friends-badge').forEach(function(el){
    el.textContent=n>9?'9+':String(n);
    el.classList.toggle('hidden',n===0);
  });
  updateNotifBadge();
}
function renderFriends(){
  const box=\$('list-body');if(!box)return;
  const accepted=friendsCache.filter(function(f){return f.status==='accepted'});
  const incoming=friendsCache.filter(function(f){return f.status==='pending_in'});
  \$('list-sub-txt').textContent=accepted.length+' ami'+(accepted.length!==1?'s':'');
  updateFriendBadge();
  if(!accepted.length&&!incoming.length){box.innerHTML='<div class="empty-hint">Aucun ami pour l\\'instant. Utilise le bouton 👤+ pour en ajouter.</div>';return}
  let h='';
  if(incoming.length){
    h+='<div class="empty-hint" style="padding:8px 8px 2px">Demandes reçues</div>';
    h+=incoming.map(function(f){
      return '<div class="row"><div class="av" data-profile="'+esc(f.friendId)+'">'+esc(ini(f.name||'?'))+'</div>'
        +'<div class="info" data-profile="'+esc(f.friendId)+'"><div class="n">'+esc(f.name||'Ami')+'</div></div>'
        +'<div class="act"><button type="button" data-accept="'+esc(f.\$id)+'" data-from="'+esc(f.friendId)+'" data-fname="'+esc(f.name||'')+'">Accepter</button>'
        +'<button type="button" class="rej" data-reject="'+esc(f.\$id)+'">✕</button></div></div>';
    }).join('');
  }
  if(accepted.length){
    h+='<div class="empty-hint" style="padding:8px 8px 2px">Amis</div>';
    h+=accepted.map(function(f){
      return '<div class="row-swipe" data-friend-wrap="'+esc(f.friendId)+'">'
        +'<div class="row-del-action" data-del-friend="'+esc(f.friendId)+'" data-del-name="'+esc(f.name||'')+'"><span>🗑</span></div>'
        +'<div class="row" data-profile="'+esc(f.friendId)+'">'
        +'<div class="av">'+esc(ini(f.name||'?'))+presenceDotHtml(f.friendId)+'</div>'
        +'<div class="info"><div class="n">'+esc(f.name||'Ami')+'</div><div class="p pr-label">'+esc((PRESENCE_DEFS[presenceByUid[String(f.friendId)]]||{}).label||'Hors ligne')+'</div></div></div></div>';
    }).join('');
  }
  box.innerHTML=h;
  box.querySelectorAll('[data-profile]').forEach(function(el){
    el.style.cursor='pointer';
    el.onclick=function(e){e.stopPropagation();openProfileModal(el.getAttribute('data-profile'))};
  });
  box.querySelectorAll('[data-accept]').forEach(function(el){
    el.onclick=function(){acceptFriendRequest(el.getAttribute('data-accept'),el.getAttribute('data-from'));};
  });
  box.querySelectorAll('[data-reject]').forEach(function(el){
    el.onclick=function(){rejectFriendRequest(el.getAttribute('data-reject'));};
  });
  box.querySelectorAll('[data-friend-wrap]').forEach(function(wrap){attachRowSwipe(wrap);});
  box.querySelectorAll('[data-del-friend]').forEach(function(el){
    el.addEventListener('click',function(e){
      e.stopPropagation();
      const uid=el.getAttribute('data-del-friend'),name=el.getAttribute('data-del-name');
      showSlideConfirm('Retirer '+(name||'cet ami')+' de tes amis ?',function(){removeFriend(uid,name);});
    });
  });
}
async function acceptFriendRequest(reqDocId,fromUid){
  try{
    await db.updateDocument(DB,'ultravoc_friends',reqDocId,{status:'accepted'});
    const mine=friendsCache.find(function(f){return f.friendId===fromUid&&f.status==='pending_out'});
    const myName=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'Quelqu\\'un';
    if(mine){await db.updateDocument(DB,'ultravoc_friends',mine.\$id,{status:'accepted'});}
    else{await db.createDocument(DB,'ultravoc_friends',Appwrite.ID.unique(),{userId:fromUid,friendId:me.\$id,status:'accepted',name:myName});}
    sendNotification(fromUid,'friend_accepted',me.\$id,myName,myName+' a accepté ta demande d\\'ami');
    await loadFriends();if(view==='friends')renderFriends();
  }catch(e){xlog('friend_accept_fail',{msg:(e&&e.message)||String(e)});}
}
async function rejectFriendRequest(reqDocId){
  try{await db.deleteDocument(DB,'ultravoc_friends',reqDocId);await loadFriends();if(view==='friends')renderFriends();}
  catch(e){xlog('friend_reject_fail',{msg:(e&&e.message)||String(e)});}
}
async function removeFriend(uid,name){
  try{
    const mine=friendsCache.find(function(f){return String(f.friendId)===String(uid)&&f.status==='accepted'});
    if(mine)await db.deleteDocument(DB,'ultravoc_friends',mine.\$id);
    try{
      const theirs=await db.listDocuments(DB,'ultravoc_friends',[Appwrite.Query.equal('userId',uid),Appwrite.Query.equal('friendId',me.\$id),Appwrite.Query.limit(5)]);
      for(const d of (theirs.documents||[]))await db.deleteDocument(DB,'ultravoc_friends',d.\$id);
    }catch(e){}
    const myName=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'Quelqu\\'un';
    sendNotification(uid,'friend_removed',me.\$id,myName,myName+' t\\'a retiré de ses amis');
    await loadFriends();if(view==='friends')renderFriends();
    showToast('Ami retiré.');
  }catch(e){showToast('Action impossible','error');}
}
async function sendFriendRequest(targetUid,targetName){
  if(!me||!targetUid||targetUid===me.\$id)return;
  const myName=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'Quelqu\\'un';
  try{
    await db.createDocument(DB,'ultravoc_friends',Appwrite.ID.unique(),{userId:me.\$id,friendId:targetUid,status:'pending_out',name:targetName||'Ami'});
    try{await db.createDocument(DB,'ultravoc_friends',Appwrite.ID.unique(),{userId:targetUid,friendId:me.\$id,status:'pending_in',name:myName});}catch(e){}
    sendNotification(targetUid,'friend_request',me.\$id,myName,myName+' t\\'a envoyé une demande d\\'ami');
    authPost('/api/push/notify',{type:'friend_request',toUid:targetUid}).catch(function(){});
    xlog('friend_request_sent',{to:targetUid});
    return true;
  }catch(e){xlog('friend_request_fail',{msg:(e&&e.message)||String(e)});throw e}
}

const NOTIF_ICONS={friend_request:'👋',friend_accepted:'✅',friend_removed:'💔',announcement:'📢',message:'💬',dm:'💬'};
let notifCache=[];
async function loadNotifications(){
  if(!me)return [];
  try{
    const r=await db.listDocuments(DB,'notifications',[Appwrite.Query.equal('uid',me.\$id),Appwrite.Query.orderDesc('\$createdAt'),Appwrite.Query.limit(60)]);
    notifCache=r.documents||[];
  }catch(e){notifCache=[];}
  return notifCache;
}
function computeUnreadDmEntries(){
  if(!me)return [];
  return dmsCache.map(function(d){
    const unread=parseJsonSafe(d.unreadJson,{});
    const n=unread[me.\$id]||0;
    if(!n)return null;
    return {kind:'dm',dmId:d.\$id,peerUid:dmIsGroup(d)?null:dmPeerId(d),count:n,title:d.displayName||'Conversation',ts:d.\$updatedAt||d.\$createdAt};
  }).filter(Boolean);
}
function updateNotifBadge(){
  const pendingCount=friendsCache.filter(function(f){return f.status==='pending_in'}).length;
  const unreadNotif=notifCache.filter(function(n){return !n.read}).length;
  const unreadDm=computeUnreadDmEntries().reduce(function(s,e){return s+e.count},0);
  const total=pendingCount+unreadNotif+unreadDm;
  const badge=\$('ub-bell-badge');
  if(badge){badge.textContent=total>9?'9+':String(total);badge.classList.toggle('hidden',total===0);}
}
async function openNotificationsPanel(){
  \$('modal-notifications').classList.remove('hidden');
  await loadNotifications();
  renderNotifications();
  const unread=notifCache.filter(function(n){return !n.read});
  if(unread.length){
    unread.forEach(function(n){db.updateDocument(DB,'notifications',n.\$id,{read:true}).catch(function(){});n.read=true;});
    updateNotifBadge();
  }
}
function renderNotifications(){
  const list=\$('ntf-list');if(!list)return;
  const pendingReqs=friendsCache.filter(function(f){return f.status==='pending_in'});
  const dmEntries=computeUnreadDmEntries();
  const entries=[];
  pendingReqs.forEach(function(f){entries.push({kind:'friend_request',id:f.\$id,fromUid:f.friendId,name:f.name,ts:f.\$createdAt});});
  dmEntries.forEach(function(e){entries.push(e);});
  notifCache.forEach(function(n){entries.push({kind:n.type,id:n.\$id,fromUid:n.fromUid,name:n.fromName,text:n.text,ts:n.\$createdAt});});
  entries.sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
  \$('ntf-accept-all').classList.toggle('hidden',!pendingReqs.length);
  \$('ntf-decline-all').classList.toggle('hidden',!pendingReqs.length);
  \$('ntf-clear-all').classList.toggle('hidden',!entries.length);
  if(!entries.length){list.innerHTML='<div class="empty-hint">Aucune notification pour l\\'instant.</div>';return}
  list.innerHTML=entries.map(function(e){
    let body='',clickable=false;
    if(e.kind==='friend_request'){
      body='<div class="ntf-text"><b>'+esc(e.name||'Quelqu\\'un')+'</b> t\\'a envoyé une demande d\\'ami</div>'
        +'<div class="ntf-actions"><button type="button" data-ntf-accept="'+esc(e.id)+'" data-ntf-from="'+esc(e.fromUid)+'">Accepter</button>'
        +'<button type="button" class="rej" data-ntf-decline="'+esc(e.id)+'">Refuser</button>'
        +'<button type="button" class="rej" data-ntf-block="'+esc(e.fromUid)+'" data-ntf-blockname="'+esc(e.name||'')+'">Bloquer</button></div>';
    } else if(e.kind==='dm'){
      clickable=true;
      body='<div class="ntf-text">'+e.count+' nouveau'+(e.count>1?'x':'')+' message'+(e.count>1?'s':'')+' de <b>'+esc(e.title)+'</b></div>';
    } else {
      body='<div class="ntf-text">'+esc(e.text||'')+'</div>';
      clickable=!!e.fromUid;
    }
    return '<div class="row-swipe" data-notif-wrap>'
      +'<div class="row-del-action" data-ntf-del="'+esc(e.kind==='dm'?e.dmId:e.id||'')+'" data-ntf-del-kind="'+esc(e.kind)+'"><span>🗑</span></div>'
      +'<div class="row notif-row'+(clickable?' clickable':'')+'" data-notif-kind="'+esc(e.kind)+'" data-notif-dm="'+esc(e.dmId||'')+'" data-notif-uid="'+esc(e.fromUid||'')+'">'
      +'<span class="ntf-icon">'+(NOTIF_ICONS[e.kind]||'🔔')+'</span>'
      +'<div class="ntf-body">'+body+'<div class="ntf-time">'+esc(fmtRelTime(e.ts))+'</div></div>'
      +'</div></div>';
  }).join('');
  list.querySelectorAll('[data-notif-wrap]').forEach(function(wrap){attachRowSwipe(wrap);});
  list.querySelectorAll('.notif-row.clickable').forEach(function(el){
    el.addEventListener('click',function(){
      const dmId=el.getAttribute('data-notif-dm');
      const uid=el.getAttribute('data-notif-uid');
      \$('modal-notifications').classList.add('hidden');
      if(dmId){
        const dm=dmsCache.find(function(d){return d.\$id===dmId});
        showView('dms');openDm(dmId,dm?dm.displayName:'Conversation',dm?dmPeerId(dm):null);
      } else if(uid){openProfileModal(uid);}
    });
  });
  list.querySelectorAll('[data-ntf-accept]').forEach(function(el){
    el.addEventListener('click',function(e){e.stopPropagation();acceptFriendRequest(el.getAttribute('data-ntf-accept'),el.getAttribute('data-ntf-from')).then(renderNotifications);});
  });
  list.querySelectorAll('[data-ntf-decline]').forEach(function(el){
    el.addEventListener('click',function(e){e.stopPropagation();rejectFriendRequest(el.getAttribute('data-ntf-decline')).then(renderNotifications);});
  });
  list.querySelectorAll('[data-ntf-block]').forEach(function(el){
    el.addEventListener('click',function(e){e.stopPropagation();confirmBlockUser(el.getAttribute('data-ntf-block'),el.getAttribute('data-ntf-blockname'));});
  });
  list.querySelectorAll('[data-ntf-del]').forEach(function(el){
    el.addEventListener('click',async function(e){
      e.stopPropagation();
      const kind=el.getAttribute('data-ntf-del-kind');
      const id=el.getAttribute('data-ntf-del');
      if(kind==='friend_request'){await rejectFriendRequest(id);}
      else if(kind==='dm'){await markDmRead(id);}
      else if(id){try{await db.deleteDocument(DB,'notifications',id);notifCache=notifCache.filter(function(n){return n.\$id!==id});}catch(err){}}
      renderNotifications();updateNotifBadge();
    });
  });
}
if(\$('ntf-accept-all'))\$('ntf-accept-all').addEventListener('click',async function(){
  const pend=friendsCache.filter(function(f){return f.status==='pending_in'});
  for(const f of pend)await acceptFriendRequest(f.\$id,f.friendId);
  renderNotifications();
});
if(\$('ntf-decline-all'))\$('ntf-decline-all').addEventListener('click',async function(){
  const pend=friendsCache.filter(function(f){return f.status==='pending_in'});
  for(const f of pend)await rejectFriendRequest(f.\$id);
  renderNotifications();
});
if(\$('ntf-clear-all'))\$('ntf-clear-all').addEventListener('click',function(){
  showSlideConfirm('Supprimer toutes les notifications ? (les demandes d\\'ami en attente resteront actives)',async function(){
    for(const n of notifCache.slice())try{await db.deleteDocument(DB,'notifications',n.\$id);}catch(e){}
    notifCache=[];
    for(const e of computeUnreadDmEntries())await markDmRead(e.dmId);
    renderNotifications();updateNotifBadge();
  });
});
if(\$('ntf-close'))\$('ntf-close').addEventListener('click',function(){\$('modal-notifications').classList.add('hidden')});
if(\$('modal-notifications'))\$('modal-notifications').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});
if(\$('ub-bell'))\$('ub-bell').addEventListener('click',openNotificationsPanel);
function subscribeNotifWatcher(){
  try{
    client.subscribe('databases.'+DB+'.collections.notifications.documents',function(res){
      const p=res.payload;if(!p||!me||String(p.uid)!==String(me.\$id))return;
      if(eventIs(res.events,'.create')){
        if(!notifCache.find(function(n){return n.\$id===p.\$id}))notifCache.unshift(p);
        updateNotifBadge();
        if(!\$('modal-notifications').classList.contains('hidden'))renderNotifications();
      }
    });
  }catch(e){}
}

let dmsCache=[];
function dmPeerId(dm){
  const members=(dm.members||[]).map(String);
  return members.find(function(m){return m!==me.\$id})||'';
}
function dmIsGroup(dm){
  return (dm.members||[]).length>2;
}
async function loadDms(){
  if(!me)return[];
  const r=await db.listDocuments(DB,'dms',[Appwrite.Query.orderDesc('\$updatedAt'),Appwrite.Query.limit(100)]);
  dmsCache=(r.documents||[]).filter(function(d){return (d.members||[]).map(String).indexOf(me.\$id)>=0});
  return dmsCache;
}
function fmtRelTime(dateStr){
  if(!dateStr)return '';
  const diff=Math.max(0,(Date.now()-new Date(dateStr).getTime())/1000);
  if(diff<60)return Math.floor(diff)+'s';
  if(diff<3600)return Math.floor(diff/60)+'min';
  if(diff<86400)return Math.floor(diff/3600)+'h';
  if(diff<604800)return Math.floor(diff/86400)+'j';
  if(diff<2629800)return Math.floor(diff/604800)+'sem';
  if(diff<31557600)return Math.floor(diff/2629800)+'mois';
  return Math.floor(diff/31557600)+'an';
}
let dmTimeRefreshId=null;
function startDmTimeRefresh(){
  if(dmTimeRefreshId)return;
  dmTimeRefreshId=setInterval(function(){
    document.querySelectorAll('.row-time[data-ts]').forEach(function(el){
      el.textContent=fmtRelTime(el.getAttribute('data-ts'));
    });
  },30000);
}
function renderDms(){
  const box=\$('list-body');if(!box)return;
  const visible=dmsCache.filter(function(d){return dmIsGroup(d)||blockedUids.indexOf(dmPeerId(d))<0});
  \$('list-sub-txt').textContent=visible.length+' conversation'+(visible.length!==1?'s':'');
  if(!visible.length){box.innerHTML='<div class="empty-hint">Aucune conversation. Ouvre l\\'onglet Amis pour en démarrer une.</div>';return}
  box.innerHTML=visible.map(function(d){
    const title=d.displayName||'Conversation';
    const group=dmIsGroup(d);
    const avInner=group?'👥':esc(ini(title));
    const av=group?'<div class="av">'+avInner+'</div>':'<div class="av" data-profile="'+esc(dmPeerId(d))+'">'+avInner+presenceDotHtml(dmPeerId(d))+'</div>';
    const sub=group?((d.members||[]).length+' membres'+(d.lastMessage?' · '+d.lastMessage:'')):(d.lastMessage||'');
    const ts=d.\$updatedAt||d.\$createdAt;
    return '<div class="row-swipe" data-dm-wrap="'+esc(d.\$id)+'">'
      +'<div class="row-del-action" data-del="'+esc(d.\$id)+'"><span>🗑</span></div>'
      +'<div class="row" data-dm="'+esc(d.\$id)+'" data-title="'+esc(title)+'">'
      +av
      +'<div class="info"><div class="n">'+esc(title)+(group?' <span class="tag-mod">GROUPE</span>':'')+'</div><div class="p">'+esc(sub)+'</div></div>'
      +'<div class="row-time" data-ts="'+esc(ts||'')+'">'+esc(fmtRelTime(ts))+'</div>'
      +'</div></div>';
  }).join('');
  box.querySelectorAll('[data-profile]').forEach(function(el){
    el.style.cursor='pointer';
    el.onclick=function(e){e.stopPropagation();openProfileModal(el.getAttribute('data-profile'))};
  });
  box.querySelectorAll('[data-dm]').forEach(function(el){
    el.onclick=function(){
      const id=el.getAttribute('data-dm');
      const dm=dmsCache.find(function(d){return d.\$id===id});
      openDm(id,el.getAttribute('data-title'),dm?dmPeerId(dm):null);
    };
  });
  box.querySelectorAll('[data-dm-wrap]').forEach(function(wrap){
    attachRowSwipe(wrap);
  });
  box.querySelectorAll('[data-del]').forEach(function(el){
    el.addEventListener('click',function(e){
      e.stopPropagation();
      const id=el.getAttribute('data-del');
      const dm=dmsCache.find(function(d){return d.\$id===id});
      showSlideConfirm('Supprimer définitivement cette conversation pour tout le monde ? Tous les messages seront effacés.',function(){deleteConversationConfirmed(id);});
    });
  });
  startDmTimeRefresh();
}
const IS_HOVER_DEVICE=(function(){try{return window.matchMedia('(hover:hover) and (pointer:fine)').matches;}catch(e){return false;}})();
function attachRowSwipe(wrap){
  if(IS_HOVER_DEVICE){wrap.classList.add('hover-reveal');return;}
  const row=wrap.querySelector('.row');if(!row)return;
  const MAXSWIPE=64;
  let startX=0,dragging=false,base=0,open=false;
  row.style.touchAction='pan-y';
  function setX(x){row.style.transform=x?'translateX('+x+'px)':'';}
  row.addEventListener('pointerdown',function(e){
    dragging=true;base=open?-MAXSWIPE:0;startX=e.clientX;
    row.style.transition='none';
    try{row.setPointerCapture(e.pointerId);}catch(err){}
  });
  row.addEventListener('pointermove',function(e){
    if(!dragging)return;
    const dx=e.clientX-startX;
    const x=Math.max(-MAXSWIPE,Math.min(0,base+dx));
    setX(x);
  });
  function endDrag(e){
    if(!dragging)return;
    dragging=false;
    row.style.transition='transform .18s ease';
    const dx=e.clientX-startX;
    const finalX=Math.max(-MAXSWIPE,Math.min(0,base+dx));
    open=finalX<=-MAXSWIPE/2;
    setX(open?-MAXSWIPE:0);
  }
  row.addEventListener('pointerup',endDrag);
  row.addEventListener('pointercancel',endDrag);
  row.addEventListener('click',function(e){
    if(open){e.stopPropagation();e.preventDefault();open=false;row.style.transition='transform .18s ease';setX(0);}
  },true);
}
async function startDmWith(peerUid,peerName){
  if(!me||!peerUid)return;
  try{
    await loadDms();
    let dm=dmsCache.find(function(d){return dmPeerId(d)===peerUid});
    if(!dm){
      dm=await db.createDocument(DB,'dms',Appwrite.ID.unique(),{members:[String(me.\$id),String(peerUid)],displayName:peerName||'Conversation',lastMessage:''});
      dmsCache.unshift(dm);
    }
    showView('dms');
    await openDm(dm.\$id,dm.displayName||peerName||'Conversation',peerUid);
  }catch(e){xlog('start_dm_fail',{msg:(e&&e.message)||String(e)});}
}
async function deleteConversationConfirmed(dmId){
  try{
    await authPost('/api/dm/delete',{threadId:dmId});
    dmsCache=dmsCache.filter(function(d){return d.\$id!==dmId});
    if(activeDm===dmId){
      activeDm=null;activeDmPeerUid=null;
      if(\$('chat-active'))\$('chat-active').classList.add('hidden');
      if(\$('chat-empty'))\$('chat-empty').classList.remove('hidden');
    }
    renderDms();
    showToast('Conversation supprimée.');
  }catch(e){showToast('Suppression impossible : '+((e&&e.message)||e),'error');}
}
function subscribeDmDeleteWatcher(){
  try{
    client.subscribe('databases.'+DB+'.collections.dms.documents',function(res){
      if(!eventIs(res.events,'.delete'))return;
      const p=res.payload;if(!p)return;
      dmsCache=dmsCache.filter(function(d){return d.\$id!==p.\$id});
      if(activeDm===p.\$id){
        activeDm=null;activeDmPeerUid=null;
        if(\$('chat-active'))\$('chat-active').classList.add('hidden');
        if(\$('chat-empty'))\$('chat-empty').classList.remove('hidden');
        showToast('Cette conversation a été supprimée.');
      }
      if(view==='dms')renderDms();
    });
  }catch(e){}
}

const THEME_PRESETS={
  violet:'#7c3aed',bleu:'#2563eb',rose:'#ec4899',vert:'#22c55e',or:'#f59e0b',rouge:'#ef4444',cyan:'#06b6d4'
};
const SOCIAL_DEFS=[
  {key:'instagram',label:'Instagram',icon:'📸',base:'https://instagram.com/'},
  {key:'twitter',label:'X / Twitter',icon:'𝕏',base:'https://x.com/'},
  {key:'tiktok',label:'TikTok',icon:'🎵',base:'https://tiktok.com/@'},
  {key:'youtube',label:'YouTube',icon:'▶️',base:'https://youtube.com/@'},
  {key:'twitch',label:'Twitch',icon:'🎮',base:'https://twitch.tv/'},
  {key:'discord',label:'Discord',icon:'💬',base:''},
  {key:'website',label:'Site web',icon:'🔗',base:''}
];
function parseSocialLinks(json){
  try{const o=JSON.parse(json||'{}');return (o&&typeof o==='object')?o:{};}catch(e){return {};}
}
function parseJsonSafe(str,fallback){
  try{const o=JSON.parse(str||'');return (o&&typeof o==='object')?o:fallback;}catch(e){return fallback;}
}
async function sendNotification(uid,type,fromUid,fromName,text,refId){
  if(!uid||!me)return;
  try{
    await db.createDocument(DB,'notifications',Appwrite.ID.unique(),{
      uid:String(uid),type:type,fromUid:fromUid?String(fromUid):'',fromName:fromName||'',
      text:(text||'').slice(0,200),refId:refId||'',read:false
    });
  }catch(e){}
}
function normalizeSocialUrl(def,val){
  val=String(val||'').trim();
  if(!val)return '';
  if(/^https?:\\/\\//i.test(val))return val;
  if(!def.base)return '';
  return def.base+val.replace(/^@/,'');
}
function mountParticles(el,kind){
  if(!el)return;
  el.innerHTML='';
  if(!kind||kind==='none')return;
  if(kind==='matrix'){mountCodeRain(el,{density:0.3,fontSize:11,color:'rgba(255,255,255,.5)'});return;}
  const n=kind==='confetti'?26:(kind==='stars'?34:22);
  const colors=['#a78bfa','#22c55e','#f59e0b','#ef4444','#38bdf8'];
  for(let i=0;i<n;i++){
    const s=document.createElement('span');
    s.className='pcp pcp-'+kind;
    s.style.left=(Math.random()*100)+'%';
    s.style.animationDelay=(Math.random()*5)+'s';
    if(kind==='stars'){s.style.top=(Math.random()*100)+'%';s.style.animationDuration=(1.5+Math.random()*2.5)+'s';}
    else if(kind==='snow'){s.style.animationDuration=(4+Math.random()*5)+'s';}
    else{s.style.animationDuration=(2+Math.random()*2)+'s';s.style.background=colors[i%colors.length];}
    el.appendChild(s);
  }
}
const FONT_STACKS={
  system:'inherit',
  serif:'Georgia,\\'Times New Roman\\',serif',
  mono:'\\'Courier New\\',ui-monospace,monospace',
  rounded:'Verdana,\\'Trebuchet MS\\',sans-serif',
  elegant:'\\'Palatino Linotype\\',\\'Book Antiqua\\',Palatino,serif'
};
const PRESENCE_DEFS={
  online:{dot:'#22c55e',label:'En ligne'},
  idle:{dot:'#f59e0b',label:'Absent'},
  dnd:{dot:'#ef4444',label:'Ne pas déranger'},
  invisible:{dot:'#6b7280',label:'Invisible'}
};
const AVATAR_FRAMES=['none','fire','frost','gold','rainbow','neon'];
function parseProfileExtra(json){
  try{const o=JSON.parse(json||'{}');return (o&&typeof o==='object')?o:{};}catch(e){return {};}
}
function buildProfileCardHtml(p,meta,badges,opts){
  p=p||{};meta=meta||{};opts=opts||{};
  const extra=parseProfileExtra(meta.profileExtraJson);
  const themeColor=THEME_PRESETS[p.theme]||THEME_PRESETS.violet;
  const bgType=p.bgType||'gradient';
  const bgColor=p.bgColor||themeColor;
  const bannerImg=safeUrl(p.bg);
  let bannerStyle;
  if(bgType==='image'&&bannerImg)bannerStyle='background-image:url(\\''+bannerImg.replace(/'/g,'%27')+'\\');background-size:cover;background-position:center';
  else if(bgType==='color')bannerStyle='background:'+esc(bgColor);
  else bannerStyle='background:linear-gradient(135deg,'+esc(bgColor)+',#0b0614)';
  const btnColor=p.btnColor||bgColor;
  const btnTextColor=p.btnTextColor||'#ffffff';
  const textColor=p.textColor||'#f2ebff';
  const btnShapeR=p.btnShape==='square'?'6px':(p.btnShape==='pill'?'999px':'12px');
  let btnBase;
  if(p.btnStyle==='outline')btnBase='background:transparent;border:1.5px solid '+esc(btnColor)+';color:'+esc(btnColor);
  else if(p.btnStyle==='glass')btnBase='background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:'+esc(textColor)+';backdrop-filter:blur(6px)';
  else btnBase='background:'+esc(btnColor)+';color:'+esc(btnTextColor)+';border:0';
  const titleSize=p.titleSize==='lg'?'1.55rem':(p.titleSize==='sm'?'1.05rem':'1.28rem');
  const bioAlign=p.bioPos==='left'?'left':'center';
  const layout=p.headerLayout==='centered'?'pc-centered':'pc-overlap';
  const links=parseSocialLinks(meta.socialLinksJson);
  const linksHtml=SOCIAL_DEFS.map(function(def){
    const url=normalizeSocialUrl(def,links[def.key]);
    if(!url)return '';
    return '<a class="pc-social-btn" href="'+esc(url)+'" target="_blank" rel="noopener" style="'+btnBase+';border-radius:'+btnShapeR+'" title="'+esc(def.label)+'"><span>'+def.icon+'</span></a>';
  }).join('');
  const since=p.createdAt||p['\$createdAt'];
  const sinceTxt=since?new Date(since).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'—';
  const spUrl=safeUrl(p.spotify);
  const name=p.displayName||p.username||'User';
  const fontFamily=FONT_STACKS[p.font]||FONT_STACKS.system;
  const presence=PRESENCE_DEFS[p.statusManual]||PRESENCE_DEFS.online;
  const frame=AVATAR_FRAMES.indexOf(extra.avatarFrame)>=0?extra.avatarFrame:'none';
  const gallery=(Array.isArray(extra.avatarGallery)?extra.avatarGallery:[]).map(safeUrl).filter(Boolean);
  const avatarUrls=gallery.length?gallery:(safeUrl(p.avatar)?[safeUrl(p.avatar)]:[]);
  const avatarInner=avatarUrls.length
    ? avatarUrls.map(function(u,i){return '<img src="'+esc(u)+'" alt="" class="pc-av-img'+(i===0?' on':'')+'"/>';}).join('')
    : esc(ini(name));
  const border=['none','glow','gradient'].indexOf(extra.cardBorder)>=0?extra.cardBorder:'none';
  let lastSeenTxt='';
  if(p.lastSeen){
    const stale=Date.now()-new Date(p.lastSeen).getTime()>PRESENCE_STALE_MS;
    if(stale||p.statusManual==='invisible')lastSeenTxt='Vu il y a '+fmtRelTime(p.lastSeen);
  }
  return '<div class="pc-card border-'+border+' '+layout+'" data-avatar-count="'+avatarUrls.length+'" style="'+(border==='glow'?('--pc-glow:'+esc(btnColor)):(border==='gradient'?('--pc-grad-a:'+esc(btnColor)+';--pc-grad-b:'+esc(bgColor)):''))+'">'
    +'<div class="pc-banner" style="'+bannerStyle+'"><div class="pc-particles" data-particles="'+esc(p.particles||'none')+'"></div>'
      +(opts.editable?'<button type="button" class="pc-edit-btn pc-edit-banner-btn" data-edit="banner" title="Changer la bannière">📷</button>':'')
    +'</div>'
    +'<div class="pc-avwrap"><div class="pc-av-frame frame-'+frame+'"><div class="pc-av">'+avatarInner+'</div>'
      +(opts.editable?'<button type="button" class="pc-edit-btn pc-edit-avatar-btn" data-edit="avatar" title="Changer la photo">📷</button>':'')
      +(p.statusManual&&p.statusManual!=='invisible'?'<span class="pc-presence-dot" style="background:'+presence.dot+'" title="'+esc(presence.label)+'"></span>':'')
    +'</div></div>'
    +'<div class="pc-body" style="color:'+esc(textColor)+';font-family:'+fontFamily+'">'
      +'<h3 class="pc-name" style="font-size:'+titleSize+'">'+esc(name)+'</h3>'
      +'<div class="pc-tag">#'+esc(p.tag||'0000')+(extra.pronouns?' · '+esc(extra.pronouns):'')+'</div>'
      +(extra.customStatus?'<div class="pc-custom-status">'+esc(extra.customStatus)+'</div>':'')
      +(badges?'<div class="pc-badges">'+badgeChipsHtml(badges)+'</div>':'')
      +(p.bio?'<div class="pc-bio" style="text-align:'+bioAlign+'">'+esc(p.bio)+'</div>':'')
      +(linksHtml?'<div class="pc-socials">'+linksHtml+'</div>':'')
      +(spUrl?'<a class="pc-spotify" href="'+esc(spUrl)+'" target="_blank" rel="noopener">🎧 Écouter sur Spotify</a>':'')
      +(opts.mutualCount!=null&&opts.mutualCount>0?'<div class="pc-mutual">👥 '+opts.mutualCount+' ami'+(opts.mutualCount>1?'s':'')+' en commun</div>':'')
      +(opts.hideSince?'':'<div class="pc-since">Membre depuis '+esc(sinceTxt)+(opts.showLastSeen&&lastSeenTxt?' · '+esc(lastSeenTxt):'')+'</div>')
    +'</div>'
  +'</div>';
}
function mountProfileCardExtras(container){
  if(!container)return;
  const pel=container.querySelector('.pc-particles');
  if(pel)mountParticles(pel,pel.getAttribute('data-particles'));
  const card=container.querySelector('.pc-card');
  if(card){
    const n=parseInt(card.getAttribute('data-avatar-count')||'0',10);
    if(n>1){
      let idx=0;
      const imgs=container.querySelectorAll('.pc-av-img');
      const iv=setInterval(function(){
        if(!container.isConnected){clearInterval(iv);return}
        imgs[idx].classList.remove('on');
        idx=(idx+1)%imgs.length;
        imgs[idx].classList.add('on');
      },3000);
    }
    if(typeof IS_HOVER_DEVICE!=='undefined'&&IS_HOVER_DEVICE){
      card.addEventListener('mousemove',function(e){
        const r=card.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-0.5,py=(e.clientY-r.top)/r.height-0.5;
        card.style.transform='perspective(700px) rotateY('+(px*6)+'deg) rotateX('+(py*-6)+'deg)';
      });
      card.addEventListener('mouseleave',function(){card.style.transform='';});
    }
  }
}
async function openProfileModal(uid){
  let p=membersCache.find(function(x){return (x.authUserId||x.\$id)===uid});
  if(!p){
    try{
      const r=await db.listDocuments(DB,'users',[Appwrite.Query.equal('authUserId',uid),Appwrite.Query.limit(1)]);
      p=(r.documents||[])[0];
    }catch(e){}
  }
  if(!p){alert('Profil introuvable');return}
  let meta=memberMetaByUid[uid];
  if(!meta){
    try{meta=await db.getDocument(DB,'user_meta',uid);}catch(e){meta=null}
  }
  const badges=parseBadges(meta);
  const name=p.displayName||p.username||'User';
  const isSelf=me&&uid===me.\$id;
  let mutualCount=null;
  if(!isSelf&&me){
    try{
      const theirs=await db.listDocuments(DB,'ultravoc_friends',[Appwrite.Query.equal('userId',uid),Appwrite.Query.equal('status','accepted'),Appwrite.Query.limit(100)]);
      const theirIds=(theirs.documents||[]).map(function(f){return String(f.friendId)});
      const mineIds=friendsCache.filter(function(f){return f.status==='accepted'}).map(function(f){return String(f.friendId)});
      mutualCount=mineIds.filter(function(id){return theirIds.indexOf(id)>=0}).length;
    }catch(e){mutualCount=null;}
  }
  const renderEl=\$('pm-render');
  if(renderEl){
    renderEl.innerHTML=buildProfileCardHtml(p,meta,badges,{mutualCount:mutualCount,showLastSeen:!isSelf});
    wireBadgeChips(renderEl.querySelector('.pc-badges'));
    mountProfileCardExtras(renderEl);
  }
  const shareBtn=\$('pm-share');
  if(shareBtn){
    shareBtn.onclick=function(){
      const url=location.origin+'/?profile='+encodeURIComponent(uid);
      (navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(url):Promise.reject())
        .then(function(){showToast('Lien du profil copié !');})
        .catch(function(){showToast(url,'error');});
    };
  }
  const msgBtn=\$('pm-message');
  msgBtn.classList.toggle('hidden',!!isSelf);
  msgBtn.onclick=function(){\$('modal-profile').classList.add('hidden');startDmWith(uid,name);};
  const reportBtn=\$('pm-report');
  reportBtn.classList.toggle('hidden',!!isSelf);
  reportBtn.onclick=function(){\$('modal-profile').classList.add('hidden');openReportModal(uid,name);};
  const blockBtn=\$('pm-block');
  if(blockBtn){
    blockBtn.classList.toggle('hidden',!!isSelf);
    const isBlocked=blockedUids.indexOf(String(uid))>=0;
    blockBtn.textContent=isBlocked?'✅':'⛔';
    blockBtn.title=isBlocked?'Débloquer ce membre':'Bloquer ce membre';
    blockBtn.onclick=function(){
      if(isBlocked)unblockUser(uid);
      else confirmBlockUser(uid,name);
    };
  }
  const editBtn=\$('pm-edit');
  if(editBtn){
    editBtn.classList.toggle('hidden',!isSelf);
    editBtn.onclick=function(){\$('modal-profile').classList.add('hidden');openProfileEditPanel(p,meta);};
  }
  \$('modal-profile').classList.remove('hidden');
}
if(\$('pm-close'))\$('pm-close').addEventListener('click',function(){\$('modal-profile').classList.add('hidden')});
if(\$('ub-av'))\$('ub-av').addEventListener('click',function(){if(me)openProfileModal(me.\$id)});
if(\$('ub-name'))\$('ub-name').addEventListener('click',function(){if(me)openProfileModal(me.\$id)});
(function(){const av=\$('ub-av'),nm=\$('ub-name');if(av)av.style.cursor='pointer';if(nm)nm.style.cursor='pointer';})();
function refreshSelfBar(){
  if(!meProfile)return;
  const name=meProfile.displayName||meProfile.username||(me&&me.name)||'Compte';
  \$('ub-name').textContent=name;
  const av=\$('ub-av');
  const myStatus=meProfile.statusManual||'online';
  const myDef=PRESENCE_DEFS[myStatus]||PRESENCE_DEFS.online;
  if(safeUrl(meProfile.avatar))av.innerHTML='<img src="'+esc(safeUrl(meProfile.avatar))+'" alt=""/><span class="dot" style="background:'+myDef.dot+'"></span>';
  else av.innerHTML=esc(ini(name))+'<span class="dot" style="background:'+myDef.dot+'"></span>';
  const dotEl=\$('ub-presence-dot');if(dotEl)dotEl.style.background=myDef.dot;
  const statusEl=\$('ub-status');if(statusEl)statusEl.textContent=myDef.label;
  if(me)presenceByUid[String(me.\$id)]=myStatus==='invisible'?'offline':myStatus;
}
function closeUbPopovers(){
  \$('ub-presence-popover').classList.add('hidden');
  \$('ub-more-menu').classList.add('hidden');
}
function toggleUbPresencePopover(){
  const pop=\$('ub-presence-popover');
  const wasHidden=pop.classList.contains('hidden');
  closeUbPopovers();
  if(!wasHidden)return;
  pop.innerHTML=Object.keys(PRESENCE_DEFS).map(function(k){
    const d=PRESENCE_DEFS[k];
    return '<button type="button" data-set-presence="'+k+'"><span class="pr-dot" style="background:'+d.dot+'"></span>'+esc(d.label)+'</button>';
  }).join('');
  pop.querySelectorAll('[data-set-presence]').forEach(function(b){
    b.addEventListener('click',async function(){
      const st=b.getAttribute('data-set-presence');
      closeUbPopovers();
      if(!meProfile)return;
      try{
        await db.updateDocument(DB,'users',meProfile.\$id,{statusManual:st});
        meProfile.statusManual=st;
        refreshSelfBar();
        showToast('Statut : '+(PRESENCE_DEFS[st]&&PRESENCE_DEFS[st].label));
      }catch(e){showToast('Changement de statut impossible','error');}
    });
  });
  pop.classList.remove('hidden');
}
if(\$('ub-presence-btn'))\$('ub-presence-btn').addEventListener('click',function(e){e.stopPropagation();toggleUbPresencePopover();});
if(\$('ub-more'))\$('ub-more').addEventListener('click',function(e){
  e.stopPropagation();
  const menu=\$('ub-more-menu');
  const wasHidden=menu.classList.contains('hidden');
  closeUbPopovers();
  if(wasHidden)menu.classList.remove('hidden');
});
document.addEventListener('click',function(e){
  if(!e.target.closest('.ub-popover')&&!e.target.closest('#ub-presence-btn')&&!e.target.closest('#ub-more'))closeUbPopovers();
});
if(\$('ub-more-menu'))\$('ub-more-menu').addEventListener('click',function(e){
  if(e.target.closest('button'))closeUbPopovers();
});

let peDraft=null,peOriginalMeta=null;
function openProfileEditPanel(p,meta){
  const theme=p.theme||'violet';
  peOriginalMeta=meta||{};
  const extra=parseProfileExtra(meta&&meta.profileExtraJson);
  peDraft={
    displayName:p.displayName||p.username||'',
    tag:p.tag||String(Math.floor(1000+Math.random()*9000)),
    bio:p.bio||'',
    bioPos:p.bioPos||'center',
    avatar:p.avatar||'',
    bg:p.bg||'',
    theme:theme,
    bgType:p.bgType||'gradient',
    bgColor:p.bgColor||THEME_PRESETS[theme]||THEME_PRESETS.violet,
    btnColor:p.btnColor||THEME_PRESETS[theme]||THEME_PRESETS.violet,
    btnTextColor:p.btnTextColor||'#ffffff',
    textColor:p.textColor||'#f2ebff',
    btnStyle:p.btnStyle||'solid',
    btnShape:p.btnShape||'rounded',
    headerLayout:p.headerLayout||'overlap',
    titleSize:p.titleSize||'md',
    particles:p.particles||'none',
    font:p.font||'system',
    statusManual:p.statusManual||'online',
    spotify:p.spotify||'',
    createdAt:p.createdAt||p.\$createdAt,
    socialLinks:parseSocialLinks(meta&&meta.socialLinksJson),
    pronouns:extra.pronouns||'',
    customStatus:extra.customStatus||'',
    avatarFrame:AVATAR_FRAMES.indexOf(extra.avatarFrame)>=0?extra.avatarFrame:'none',
    avatarGallery:Array.isArray(extra.avatarGallery)?extra.avatarGallery.slice(0,6):[],
    cardBorder:['none','glow','gradient'].indexOf(extra.cardBorder)>=0?extra.cardBorder:'none'
  };
  \$('pe-name').value=peDraft.displayName;
  \$('pe-tag').value=peDraft.tag;
  \$('pe-bio').value=peDraft.bio;
  \$('pe-bio-pos').value=peDraft.bioPos;
  \$('pe-pronouns').value=peDraft.pronouns;
  \$('pe-custom-status').value=peDraft.customStatus;
  \$('pe-bgtype').value=peDraft.bgType;
  \$('pe-bgcolor').value=peDraft.bgColor;
  \$('pe-btncolor').value=peDraft.btnColor;
  \$('pe-textcolor').value=peDraft.textColor;
  \$('pe-btnstyle').value=peDraft.btnStyle;
  \$('pe-btnshape').value=peDraft.btnShape;
  \$('pe-layout').value=peDraft.headerLayout;
  \$('pe-titlesize').value=peDraft.titleSize;
  \$('pe-particles').value=peDraft.particles;
  \$('pe-font').value=peDraft.font;
  \$('pe-card-border').value=peDraft.cardBorder;
  \$('pe-spotify').value=peDraft.spotify;
  SOCIAL_DEFS.forEach(function(def){
    const el=\$('pe-social-'+def.key);
    if(el)el.value=peDraft.socialLinks[def.key]||'';
  });
  \$('pe-avatar-file').value='';
  \$('pe-banner-file').value='';
  \$('pe-gallery-file').value='';
  \$('pe-err').textContent='';
  renderThemeSwatches();
  renderFrameSwatches();
  renderPresenceRow();
  renderGalleryThumbs();
  updatePePreview();
  document.querySelectorAll('.pe-tab').forEach(function(b,i){b.classList.toggle('on',i===0)});
  document.querySelectorAll('.pe-pane').forEach(function(p2,i){p2.classList.toggle('hidden',i!==0)});
  \$('modal-profile-edit').classList.remove('hidden');
}
function renderThemeSwatches(){
  const wrap=\$('pe-theme-swatches');if(!wrap||!peDraft)return;
  wrap.innerHTML=Object.keys(THEME_PRESETS).map(function(k){
    return '<button type="button" class="pe-swatch'+(peDraft.theme===k?' on':'')+'" data-theme="'+k+'" style="background:'+THEME_PRESETS[k]+'" title="'+k+'"></button>';
  }).join('');
  wrap.querySelectorAll('[data-theme]').forEach(function(b){
    b.addEventListener('click',function(){
      const k=b.getAttribute('data-theme');
      peDraft.theme=k;peDraft.bgColor=THEME_PRESETS[k];peDraft.btnColor=THEME_PRESETS[k];
      \$('pe-bgcolor').value=THEME_PRESETS[k];\$('pe-btncolor').value=THEME_PRESETS[k];
      renderThemeSwatches();updatePePreview();
    });
  });
}
const FRAME_LABELS={none:'Aucun',fire:'🔥 Feu',frost:'❄️ Givre',gold:'✨ Or',rainbow:'🌈 Arc-en-ciel',neon:'💜 Néon'};
function renderFrameSwatches(){
  const wrap=\$('pe-frame-swatches');if(!wrap||!peDraft)return;
  wrap.innerHTML=AVATAR_FRAMES.map(function(k){
    return '<button type="button" class="pe-frame-swatch pc-av-frame frame-'+k+'" data-frame="'+k+'" title="'+esc(FRAME_LABELS[k])+'">'
      +'<span class="pe-frame-inner'+(peDraft.avatarFrame===k?' on':'')+'"></span></button>';
  }).join('');
  wrap.querySelectorAll('[data-frame]').forEach(function(b){
    b.addEventListener('click',function(){
      peDraft.avatarFrame=b.getAttribute('data-frame');
      renderFrameSwatches();updatePePreview();
    });
  });
}
function renderPresenceRow(){
  const wrap=\$('pe-presence-row');if(!wrap||!peDraft)return;
  wrap.innerHTML=Object.keys(PRESENCE_DEFS).map(function(k){
    const d=PRESENCE_DEFS[k];
    return '<button type="button" class="pe-presence-btn'+(peDraft.statusManual===k?' on':'')+'" data-presence="'+k+'">'
      +'<span class="pe-presence-swatch" style="background:'+(k==='invisible'?'#4b5563':d.dot)+'"></span>'+esc(d.label)+'</button>';
  }).join('');
  wrap.querySelectorAll('[data-presence]').forEach(function(b){
    b.addEventListener('click',function(){
      peDraft.statusManual=b.getAttribute('data-presence');
      renderPresenceRow();updatePePreview();
    });
  });
}
function renderGalleryThumbs(){
  const wrap=\$('pe-gallery');if(!wrap||!peDraft)return;
  wrap.innerHTML=peDraft.avatarGallery.map(function(url,i){
    return '<div class="pe-gallery-thumb"><img src="'+esc(url)+'" alt=""/><button type="button" class="pe-gallery-rm" data-rm="'+i+'">✕</button></div>';
  }).join('');
  wrap.querySelectorAll('[data-rm]').forEach(function(b){
    b.addEventListener('click',function(){
      peDraft.avatarGallery.splice(parseInt(b.getAttribute('data-rm'),10),1);
      renderGalleryThumbs();updatePePreview();
    });
  });
}
function updatePePreview(){
  const el=\$('pe-preview');if(!el||!peDraft)return;
  const previewMeta=Object.assign({},peOriginalMeta,{
    socialLinksJson:JSON.stringify(peDraft.socialLinks),
    profileExtraJson:JSON.stringify({pronouns:peDraft.pronouns,customStatus:peDraft.customStatus,avatarFrame:peDraft.avatarFrame,avatarGallery:peDraft.avatarGallery,cardBorder:peDraft.cardBorder})
  });
  const badges=parseBadges(peOriginalMeta);
  el.innerHTML=buildProfileCardHtml(peDraft,previewMeta,badges,{editable:true});
  mountProfileCardExtras(el);
  el.querySelectorAll('[data-edit]').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      const which=b.getAttribute('data-edit');
      const input=\$(which==='avatar'?'pe-avatar-file':'pe-banner-file');
      if(input)input.click();
    });
  });
}
function wirePeInputs(){
  function bindInput(id,field,transform){
    const el=\$(id);if(!el)return;
    el.addEventListener('input',function(){
      peDraft[field]=transform?transform(this.value):this.value;
      if(transform)this.value=peDraft[field];
      updatePePreview();
    });
  }
  function bindChange(id,field){
    const el=\$(id);if(!el)return;
    el.addEventListener('change',function(){peDraft[field]=this.value;updatePePreview();});
  }
  bindInput('pe-name','displayName');
  bindInput('pe-tag','tag',function(v){return v.replace(/[^0-9]/g,'').slice(0,4);});
  bindInput('pe-bio','bio');
  bindChange('pe-bio-pos','bioPos');
  bindChange('pe-bgtype','bgType');
  bindInput('pe-bgcolor','bgColor');
  bindInput('pe-btncolor','btnColor');
  bindInput('pe-textcolor','textColor');
  bindChange('pe-btnstyle','btnStyle');
  bindChange('pe-btnshape','btnShape');
  bindChange('pe-layout','headerLayout');
  bindChange('pe-titlesize','titleSize');
  bindChange('pe-particles','particles');
  bindChange('pe-font','font');
  bindChange('pe-card-border','cardBorder');
  bindInput('pe-spotify','spotify');
  bindInput('pe-pronouns','pronouns');
  bindInput('pe-custom-status','customStatus');
  SOCIAL_DEFS.forEach(function(def){
    const el=\$('pe-social-'+def.key);
    if(el)el.addEventListener('input',function(){peDraft.socialLinks[def.key]=this.value;updatePePreview();});
  });
  if(\$('pe-tag-random'))\$('pe-tag-random').addEventListener('click',function(){
    peDraft.tag=String(Math.floor(1000+Math.random()*9000));\$('pe-tag').value=peDraft.tag;updatePePreview();
  });
  if(\$('pe-randomize-style'))\$('pe-randomize-style').addEventListener('click',function(){
    const themes=Object.keys(THEME_PRESETS);
    peDraft.theme=themes[Math.floor(Math.random()*themes.length)];
    peDraft.bgColor=THEME_PRESETS[peDraft.theme];peDraft.btnColor=THEME_PRESETS[peDraft.theme];
    peDraft.bgType=['gradient','color'][Math.floor(Math.random()*2)];
    peDraft.btnStyle=['solid','outline','glass'][Math.floor(Math.random()*3)];
    peDraft.btnShape=['rounded','pill','square'][Math.floor(Math.random()*3)];
    peDraft.headerLayout=['overlap','centered'][Math.floor(Math.random()*2)];
    peDraft.particles=['none','stars','snow','matrix','confetti'][Math.floor(Math.random()*5)];
    peDraft.avatarFrame=AVATAR_FRAMES[Math.floor(Math.random()*AVATAR_FRAMES.length)];
    peDraft.cardBorder=['none','glow','gradient'][Math.floor(Math.random()*3)];
    \$('pe-bgcolor').value=peDraft.bgColor;\$('pe-btncolor').value=peDraft.btnColor;
    \$('pe-bgtype').value=peDraft.bgType;\$('pe-btnstyle').value=peDraft.btnStyle;
    \$('pe-btnshape').value=peDraft.btnShape;\$('pe-layout').value=peDraft.headerLayout;
    \$('pe-particles').value=peDraft.particles;\$('pe-card-border').value=peDraft.cardBorder;
    renderThemeSwatches();renderFrameSwatches();updatePePreview();
  });
  if(\$('pe-gallery-file'))\$('pe-gallery-file').addEventListener('change',async function(){
    const f=this.files&&this.files[0];if(!f)return;
    if(peDraft.avatarGallery.length>=6){\$('pe-err').textContent='Maximum 6 photos dans la galerie.';this.value='';return}
    try{
      const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),f,[Appwrite.Permission.read(Appwrite.Role.any())]);
      peDraft.avatarGallery.push(PROXY_EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID);
      renderGalleryThumbs();updatePePreview();
    }catch(e){\$('pe-err').textContent='Envoi de la photo impossible.';}
    this.value='';
  });
  if(\$('pe-avatar-file'))\$('pe-avatar-file').addEventListener('change',async function(){
    const f=this.files&&this.files[0];if(!f)return;
    try{
      const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),f,[Appwrite.Permission.read(Appwrite.Role.any())]);
      peDraft.avatar=PROXY_EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;
      updatePePreview();
    }catch(e){\$('pe-err').textContent='Envoi de la photo impossible.';}
  });
  if(\$('pe-banner-file'))\$('pe-banner-file').addEventListener('change',async function(){
    const f=this.files&&this.files[0];if(!f)return;
    try{
      const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),f,[Appwrite.Permission.read(Appwrite.Role.any())]);
      peDraft.bg=PROXY_EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;
      peDraft.bgType='image';\$('pe-bgtype').value='image';
      updatePePreview();
    }catch(e){\$('pe-err').textContent='Envoi de la bannière impossible.';}
  });
}
wirePeInputs();
document.querySelectorAll('.pe-tab').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.pe-tab').forEach(function(b){b.classList.toggle('on',b===btn)});
    const tab=btn.getAttribute('data-tab');
    document.querySelectorAll('.pe-pane').forEach(function(p2){p2.classList.toggle('hidden',p2.getAttribute('data-pane')!==tab)});
  });
});
if(\$('pe-close'))\$('pe-close').addEventListener('click',function(){\$('modal-profile-edit').classList.add('hidden')});
if(\$('modal-profile-edit'))\$('modal-profile-edit').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});
if(\$('pe-save'))\$('pe-save').addEventListener('click',async function(){
  if(!peDraft||!me||!meProfile)return;
  if(!/^[0-9]{4}\$/.test(peDraft.tag)){\$('pe-err').textContent='Le tag doit être 4 chiffres.';return}
  const btn=this;btn.disabled=true;btn.textContent='Enregistrement…';\$('pe-err').textContent='';
  try{
    await db.updateDocument(DB,'users',meProfile.\$id,{
      displayName:(peDraft.displayName||'').slice(0,64)||meProfile.displayName,
      tag:peDraft.tag,
      bio:(peDraft.bio||'').slice(0,500),
      bioPos:peDraft.bioPos,
      avatar:peDraft.avatar,
      bg:peDraft.bg,
      theme:peDraft.theme,
      bgType:peDraft.bgType,
      bgColor:peDraft.bgColor,
      btnColor:peDraft.btnColor,
      btnTextColor:peDraft.btnTextColor,
      textColor:peDraft.textColor,
      btnStyle:peDraft.btnStyle,
      btnShape:peDraft.btnShape,
      headerLayout:peDraft.headerLayout,
      titleSize:peDraft.titleSize,
      particles:peDraft.particles,
      font:peDraft.font,
      statusManual:peDraft.statusManual,
      spotify:(peDraft.spotify||'').slice(0,300)
    });
    Object.assign(meProfile,{
      displayName:peDraft.displayName,tag:peDraft.tag,bio:peDraft.bio,bioPos:peDraft.bioPos,
      avatar:peDraft.avatar,bg:peDraft.bg,theme:peDraft.theme,bgType:peDraft.bgType,
      bgColor:peDraft.bgColor,btnColor:peDraft.btnColor,btnTextColor:peDraft.btnTextColor,
      textColor:peDraft.textColor,btnStyle:peDraft.btnStyle,btnShape:peDraft.btnShape,
      headerLayout:peDraft.headerLayout,titleSize:peDraft.titleSize,particles:peDraft.particles,
      font:peDraft.font,statusManual:peDraft.statusManual,spotify:peDraft.spotify
    });
    try{
      await db.updateDocument(DB,'user_meta',me.\$id,{
        socialLinksJson:JSON.stringify(peDraft.socialLinks),
        profileExtraJson:JSON.stringify({pronouns:peDraft.pronouns,customStatus:peDraft.customStatus,avatarFrame:peDraft.avatarFrame,avatarGallery:peDraft.avatarGallery,cardBorder:peDraft.cardBorder})
      });
    }catch(e){}
    refreshSelfBar();
    showToast('Profil mis à jour !');
    \$('modal-profile-edit').classList.add('hidden');
  }catch(e){\$('pe-err').textContent='Enregistrement impossible : '+((e&&e.message)||e);}
  finally{btn.disabled=false;btn.textContent='Enregistrer';}
});

let reportTargetUid=null;
function openReportModal(uid,name){
  reportTargetUid=uid;
  \$('rp-target-name').textContent=name||'';
  \$('rp-reason').value='harcelement';
  \$('rp-details').value='';
  \$('rp-err').textContent='';
  \$('modal-report').classList.remove('hidden');
}
if(\$('rp-close'))\$('rp-close').addEventListener('click',function(){\$('modal-report').classList.add('hidden')});
if(\$('modal-report'))\$('modal-report').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});
if(\$('rp-submit'))\$('rp-submit').addEventListener('click',async function(){
  const btn=this;
  if(!reportTargetUid)return;
  \$('rp-err').textContent='';
  btn.disabled=true;btn.textContent='Envoi…';
  try{
    const targetP=membersCache.find(function(x){return (x.authUserId||x.\$id)===reportTargetUid});
    const targetName=(targetP&&(targetP.displayName||targetP.username))||'';
    await authPost('/api/report',{targetUid:reportTargetUid,targetName:targetName,reason:\$('rp-reason').value,details:\$('rp-details').value.slice(0,1000)});
    \$('modal-report').classList.add('hidden');
    alert('Signalement envoyé. Merci, l\\'équipe de modération va l\\'examiner.');
  }catch(e){\$('rp-err').textContent=(e&&e.message)||'Erreur lors de l\\'envoi';}
  btn.disabled=false;btn.textContent='Envoyer le signalement';
});
if(\$('modal-profile'))\$('modal-profile').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});

async function openAdminUserModal(uid){
  let p=membersCache.find(function(x){return (x.authUserId||x.\$id)===uid});
  if(!p){
    try{await loadAdminMembers();}catch(e){}
    p=membersCache.find(function(x){return (x.authUserId||x.\$id)===uid});
  }
  if(!p){alert('Profil introuvable');return}
  const name=p.displayName||p.username||'User';
  \$('au-name').textContent=name;
  \$('au-tag').textContent='#'+esc(p.tag||'');
  const av=\$('au-av');
  if(safeUrl(p.avatar))av.innerHTML='<img src="'+esc(safeUrl(p.avatar))+'" alt=""/>';
  else av.textContent=ini(name);
  \$('au-email').textContent=p.email||'—';
  \$('au-uid').textContent=uid;
  const since=p.createdAt||p.\$createdAt;
  \$('au-since').textContent=since?new Date(since).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'—';
  \$('au-lastseen').textContent=p.lastSeen?new Date(p.lastSeen).toLocaleString('fr-FR'):'—';
  \$('au-bio').textContent=p.bio||'Aucune bio';
  \$('au-notes').value='Chargement…';
  \$('au-notes').disabled=true;
  \$('au-notes-meta').textContent='';
  \$('modal-admin-user').classList.remove('hidden');
  try{
    const r=await authGet('/api/admin/notes?uid='+encodeURIComponent(uid));
    \$('au-notes').value=(r.note&&r.note.note)||'';
    \$('au-notes-meta').textContent=r.note?('Dernière modif par '+esc(r.note.updatedBy||'?')+' — '+new Date(r.note.updatedAt).toLocaleString('fr-FR')):'';
  }catch(e){\$('au-notes').value='';}
  \$('au-notes').disabled=false;
  \$('au-notes-save').onclick=async function(){
    const btn=this;
    btn.disabled=true;btn.textContent='Enregistrement…';
    try{
      await authPost('/api/admin/notes',{uid:uid,note:\$('au-notes').value,targetName:name});
      \$('au-notes-meta').textContent='Enregistré à l\\'instant.';
    }catch(e){alert('Erreur : '+((e&&e.message)||e));}
    btn.disabled=false;btn.textContent='Enregistrer la note';
  };
}
if(\$('au-close'))\$('au-close').addEventListener('click',function(){\$('modal-admin-user').classList.add('hidden')});
if(\$('modal-admin-user'))\$('modal-admin-user').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});

let activeDm=null, activeDmPeerUid=null, activeDmMembers=[], activeDmIsGroup=false, msgsCache=[];
async function openDm(threadId,title,peerUid){
  activeDm=threadId;
  const dm=dmsCache.find(function(d){return d.\$id===threadId});
  const members=(dm&&dm.members)?dm.members.map(String):(peerUid?[String(me.\$id),String(peerUid)]:[]);
  activeDmMembers=members;
  activeDmIsGroup=members.length>2;
  activeDmPeerUid=activeDmIsGroup?null:(peerUid||members.find(function(m){return m!==(me&&me.\$id)})||null);
  \$('chat-empty').classList.add('hidden');
  \$('chat-active').classList.remove('hidden');
  \$('ch-title').textContent=title||'Conversation';
  \$('ch-av').textContent=ini(title||'?');
  const openPeerProfile=(!activeDmIsGroup&&activeDmPeerUid)?function(){openProfileModal(activeDmPeerUid)}:null;
  \$('ch-av').style.cursor=openPeerProfile?'pointer':'';
  \$('ch-av').onclick=openPeerProfile;
  \$('ch-title').style.cursor=openPeerProfile?'pointer':'';
  \$('ch-title').onclick=openPeerProfile;
  document.getElementById('app').classList.add('chat-open');
  repositionCallPanel();
  const e2eEl=\$('ch-e2e');
  if(e2eEl){
    e2eEl.classList.toggle('hidden',!activeDmIsGroup);
    if(!activeDmIsGroup&&activeDmPeerUid){
      const forPeer=activeDmPeerUid;
      e2eThreadKey(forPeer).then(function(k){if(activeDmPeerUid===forPeer&&k)e2eEl.classList.remove('hidden');}).catch(function(){});
    }
  }
  await loadMessages(threadId);
  refreshCallBadge(activeDmPeerUid);
  updateChatHeaderPresence();
  markDmRead(threadId);
}
async function markDmRead(threadId){
  const dm=dmsCache.find(function(d){return d.\$id===threadId});
  if(!dm||!me)return;
  const unread=parseJsonSafe(dm.unreadJson,{});
  if(!unread[me.\$id])return;
  unread[me.\$id]=0;
  dm.unreadJson=JSON.stringify(unread);
  try{await db.updateDocument(DB,'dms',threadId,{unreadJson:dm.unreadJson});}catch(e){}
  updateNotifBadge();
}
function updateChatHeaderPresence(){
  const el=\$('ch-presence');if(!el)return;
  if(activeDmIsGroup||!activeDmPeerUid){el.classList.add('hidden');return}
  const st=presenceByUid[String(activeDmPeerUid)]||'offline';
  const d=PRESENCE_DEFS[st]||PRESENCE_DEFS.online;
  const color=st==='offline'?'#4b5563':d.dot;
  let label=st==='offline'?'Hors ligne':d.label;
  if(st==='offline'){
    const p=membersCache.find(function(x){return String(x.authUserId||x.\$id)===String(activeDmPeerUid)});
    if(p&&p.lastSeen)label='Vu il y a '+fmtRelTime(p.lastSeen);
  }
  el.innerHTML='<span class="pr-dot" style="background:'+color+'"></span>'+esc(label);
  el.classList.remove('hidden');
}
async function refreshCallBadge(peerUid){
  const badge=\$('dm-call-badge');if(!badge)return;
  const forDm=activeDm;
  if(!peerUid||activeDmIsGroup){badge.classList.add('hidden');return}
  if(activeCallDoc&&String(callPeerUid)===String(peerUid)){badge.classList.add('hidden');return}
  try{
    const r=await db.listDocuments(DB,'direct_calls',[Appwrite.Query.limit(25),Appwrite.Query.orderDesc('\$createdAt')]);
    if(activeDm!==forDm)return;
    const doc=(r.documents||[]).find(function(d){
      const involves=(String(d.callerId)===String(me.\$id)&&String(d.calleeId)===String(peerUid))||(String(d.calleeId)===String(me.\$id)&&String(d.callerId)===String(peerUid));
      return involves&&['ringing','accepted'].indexOf(d.status)>=0;
    });
    if(doc){
      badge.classList.remove('hidden');
      badge.onclick=function(){
        if(activeCallDoc||incomingCallDoc){showToast('Un appel est déjà en cours.','error');return}
        if(String(doc.calleeId)===String(me.\$id))showIncomingCall(doc);
      };
    } else {
      badge.classList.add('hidden');
    }
  }catch(e){badge.classList.add('hidden');}
}
function subscribeCallBadgeWatcher(){
  try{
    client.subscribe('databases.'+DB+'.collections.direct_calls.documents',function(res){
      const p=res.payload;if(!p||!me)return;
      const involvesMe=(String(p.callerId)===String(me.\$id)||String(p.calleeId)===String(me.\$id));
      if(!involvesMe)return;
      const otherUid=String(p.callerId)===String(me.\$id)?p.calleeId:p.callerId;
      if(activeDmPeerUid&&!activeDmIsGroup&&String(otherUid)===String(activeDmPeerUid))refreshCallBadge(activeDmPeerUid);
    });
  }catch(e){}
}
function repositionCallPanel(){
  const bar=\$('call-bar');if(!bar||bar.classList.contains('hidden'))return;
  const anchor=\$('call-panel-anchor');
  const app=document.getElementById('app');
  const chatVisible=window.innerWidth>640||app.classList.contains('chat-open');
  const viewingCallDm=chatVisible&&view==='dms'&&activeDm&&callPeerUid&&activeDmPeerUid===callPeerUid;
  if(viewingCallDm&&anchor){
    anchor.appendChild(bar);
    bar.classList.add('embedded');
  } else {
    document.body.appendChild(bar);
    bar.classList.remove('embedded');
  }
}
async function loadMessages(threadId){
  try{
    const r=await db.listDocuments(DB,'dms_messages',[Appwrite.Query.equal('threadId',threadId),Appwrite.Query.orderDesc('\$createdAt'),Appwrite.Query.limit(60)]);
    msgsCache=(r.documents||[]).slice().reverse().filter(function(m){
      const hidden=(m.hiddenFor||[]).map(String);
      if(hidden.indexOf(me.\$id)>=0)return false;
      if(blockedUids.indexOf(String(m.uid))>=0)return false;
      return true;
    });
  }catch(e){xlog('load_msgs_fail',{msg:(e&&e.message)||String(e)});msgsCache=[];}
  renderMessages();
}
function safeUrl(u){
  u=String(u||'');
  /* Une URL blob: locale (créée par URL.createObjectURL après déchiffrement
     d'un média) est déjà sûre par construction — jamais fournie par le
     serveur, générée uniquement par le navigateur lui-même. */
  if(/^blob:/i.test(u))return u;
  if(!/^https?:\\/\\//i.test(u))return '';
  if(u.indexOf(EP)===0)u=PROXY_EP+u.slice(EP.length);
  return u;
}
function linkify(escapedText){
  return escapedText.replace(/(https?:\\/\\/[^\\s<]+)/g,function(u){return '<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+u+'</a>'});
}
function fmtSize(bytes){
  bytes=Number(bytes)||0;
  if(bytes<1024)return bytes+' o';
  if(bytes<1024*1024)return (bytes/1024).toFixed(1)+' Ko';
  return (bytes/1024/1024).toFixed(1)+' Mo';
}
function fmtDur(sec){
  sec=Math.max(0,Math.round(Number(sec)||0));
  return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');
}
function renderMsgBody(m,text,mediaUrl){
  const t=m.type||'text';
  const url=safeUrl(mediaUrl);
  if(t==='image'&&url)return '<div class="msg-media"><img src="'+esc(url)+'" loading="lazy"/></div>'+(text?'<div class="msg-caption">'+linkify(esc(text))+'</div>':'');
  if(t==='video'&&url)return '<div class="msg-media"><video src="'+esc(url)+'" controls playsinline></video></div>';
  if(t==='gif'&&url)return '<div class="msg-media"><img src="'+esc(url)+'" loading="lazy"/></div>';
  if(t==='file'&&url){
    let meta={};try{meta=JSON.parse(text||'{}');}catch(e){}
    return '<a class="msg-file" href="'+esc(url)+'" target="_blank" rel="noopener"><span>📄</span><div class="mf-info"><div class="mf-name">'+esc(meta.name||'Fichier')+'</div><div class="mf-size">'+esc(fmtSize(meta.size))+'</div></div></a>';
  }
  if(t==='audio'&&url){
    let meta={};try{meta=JSON.parse(text||'{}');}catch(e){}
    return '<div class="voice-msg" data-src="'+esc(url)+'" data-mid="'+esc(m.\$id||'')+'"><button type="button" class="vm-play">▶</button><div class="vm-wave"></div><div class="vm-dur">'+esc(fmtDur(meta.duration))+'</div></div>';
  }
  if(t==='location'){
    let meta={};try{meta=JSON.parse(text||'{}');}catch(e){}
    if(meta.lat!=null&&meta.lng!=null){
      const mapUrl='https://www.google.com/maps?q='+encodeURIComponent(meta.lat+','+meta.lng);
      return '<a class="msg-location" href="'+esc(mapUrl)+'" target="_blank" rel="noopener">📍 Position partagée<span>Ouvrir dans Maps</span></a>';
    }
  }
  return linkify(esc(text||''));
}
function renderEncPlaceholder(m){
  const t=m.type||'text';
  if(t==='image'||t==='video')return '<div class="msg-media enc-loading-media"><div class="enc-spin">🔒</div></div>';
  if(t==='audio')return '<div class="voice-msg-loading enc-loading"><span class="enc-spin">🔒</span><span>Déchiffrement…</span></div>';
  if(t==='file')return '<div class="msg-file enc-loading"><span class="enc-spin">🔒</span><span>Déchiffrement…</span></div>';
  return '<span class="enc-loading"><span class="enc-spin">🔒</span> Déchiffrement…</span>';
}
async function hydrateEncryptedMessages(){
  const forDm=activeDm;
  if(!forDm)return;
  const targets=msgsCache.filter(function(m){return m.enc});
  for(const m of targets){
    if(activeDm!==forDm)return;
    let text=m.text||'',ok=true,key=null;
    try{key=await e2eResolveIncomingKey(m);}catch(e){key=null}
    if(!key)ok=false;
    if(ok&&text){
      try{text=await e2eDecryptTextWithKey(key,text);}catch(e){ok=false;text='';}
    }
    let mediaUrl='';
    const srcUrl=safeUrl(m.mediaUrl);
    if(ok&&srcUrl){
      try{
        const blob=await e2eDecryptBlobWithKey(key,srcUrl,m.mime||'application/octet-stream');
        mediaUrl=URL.createObjectURL(blob);
      }catch(e){ok=false;}
    }
    if(activeDm!==forDm)return;
    const box=\$('msgs');if(!box)return;
    const wrap=box.querySelector('.msg[data-mid="'+m.\$id+'"] .bub');
    if(!wrap)continue;
    if(!ok){wrap.innerHTML='<span class="enc-loading">🔒 Message illisible sur cet appareil</span>';continue}
    wrap.innerHTML=renderMsgBody(m,text,mediaUrl);
    wrap.querySelectorAll('.msg-media img').forEach(function(el){el.addEventListener('click',function(){window.open(el.src,'_blank')})});
    wrap.querySelectorAll('.voice-msg').forEach(initVoiceMsgPlayer);
  }
}
function initVoiceMsgPlayer(el){
  if(el.dataset.wired)return;
  const src=el.getAttribute('data-src');
  const mid=el.getAttribute('data-mid')||'x';
  const playBtn=el.querySelector('.vm-play');
  const waveEl=el.querySelector('.vm-wave');
  const durEl=el.querySelector('.vm-dur');
  if(!playBtn||!waveEl||!durEl)return;
  el.dataset.wired='1';
  const origDur=durEl.textContent;
  let seed=0;for(let i=0;i<mid.length;i++)seed=(seed*31+mid.charCodeAt(i))>>>0;
  function rnd(){seed=(seed*1103515245+12345)>>>0;return (seed>>>8)/16777216}
  const N=28;
  for(let i=0;i<N;i++){
    const b=document.createElement('span');
    b.className='vm-bar';
    b.style.height=(25+Math.floor(rnd()*65))+'%';
    waveEl.appendChild(b);
  }
  let audio=null,playing=false;
  playBtn.addEventListener('click',function(){
    if(!audio){
      audio=new Audio(src);
      audio.addEventListener('timeupdate',function(){
        if(!audio.duration)return;
        const pct=audio.currentTime/audio.duration;
        const bars=waveEl.querySelectorAll('.vm-bar');
        const active=Math.floor(pct*bars.length);
        bars.forEach(function(b,i){b.classList.toggle('played',i<=active)});
        durEl.textContent=fmtDur(audio.duration-audio.currentTime);
      });
      audio.addEventListener('ended',function(){
        playing=false;playBtn.textContent='▶';durEl.textContent=origDur;
        waveEl.querySelectorAll('.vm-bar').forEach(function(b){b.classList.remove('played')});
      });
    }
    if(playing){audio.pause();playing=false;playBtn.textContent='▶';return}
    document.querySelectorAll('.voice-msg .vm-play').forEach(function(b){if(b!==playBtn)b.textContent='▶'});
    audio.play();playing=true;playBtn.textContent='⏸';
  });
}
function renderMessages(){
  const box=\$('msgs');if(!box)return;
  if(!msgsCache.length){box.innerHTML='<div class="empty-hint" style="text-align:center">Aucun message. Dis bonjour !</div>';return}
  box.innerHTML=msgsCache.map(function(m){
    const mine=m.uid===(me&&me.\$id);
    const name=m.displayName||'User';
    const body=m.enc?renderEncPlaceholder(m):renderMsgBody(m,m.text,m.mediaUrl);
    return '<div class="msg'+(mine?' mine':'')+'" data-mid="'+esc(m.\$id||'')+'"><div class="av" data-profile="'+esc(m.uid||'')+'">'+esc(ini(name))+'</div>'
      +'<div><div class="bub">'+body+'<button type="button" class="msg-menu-btn" data-menu="'+esc(m.\$id||'')+'" title="Actions">⋯</button></div><div class="meta">'+esc(mine?'':name)+(m.enc?' 🔒':'')+'</div></div></div>';
  }).join('');
  box.querySelectorAll('[data-profile]').forEach(function(el){
    el.style.cursor='pointer';
    el.onclick=function(e){e.stopPropagation();openProfileModal(el.getAttribute('data-profile'))};
  });
  box.querySelectorAll('.msg-media img').forEach(function(el){
    el.addEventListener('click',function(){window.open(el.src,'_blank')});
  });
  hydrateEncryptedMessages();
  box.querySelectorAll('.voice-msg').forEach(initVoiceMsgPlayer);
  box.querySelectorAll('.msg[data-mid]').forEach(function(el){
    const m=msgsCache.find(function(x){return x.\$id===el.getAttribute('data-mid')});
    if(!m)return;
    if(IS_HOVER_DEVICE){
      el.classList.add('hover-reveal');
      const btn=el.querySelector('.msg-menu-btn');
      if(btn)btn.addEventListener('click',function(e){e.stopPropagation();openMessageActionSheet(m);});
    } else {
      attachMsgSwipe(el,m);
    }
  });
  box.scrollTop=box.scrollHeight;
}
function attachMsgSwipe(el,m){
  const bub=el.querySelector('.bub');if(!bub)return;
  let startX=0,dragging=false,triggered=false;
  bub.style.touchAction='pan-y';
  el.addEventListener('pointerdown',function(e){
    if(e.target.closest('a,button,.voice-msg,.msg-media img'))return;
    dragging=true;triggered=false;startX=e.clientX;
    bub.style.transition='none';
    try{el.setPointerCapture(e.pointerId);}catch(err){}
  });
  el.addEventListener('pointermove',function(e){
    if(!dragging)return;
    const dx=e.clientX-startX;
    const clamped=Math.max(-64,Math.min(64,dx));
    bub.style.transform='translateX('+clamped+'px)';
    if(!triggered&&Math.abs(dx)>56){
      triggered=true;
      openMessageActionSheet(m);
    }
  });
  function reset(){
    if(!dragging)return;
    dragging=false;
    bub.style.transition='transform .16s ease';
    bub.style.transform='';
  }
  el.addEventListener('pointerup',reset);
  el.addEventListener('pointercancel',reset);
}
function openMessageActionSheet(m){
  const mine=String(m.uid)===(me&&String(me.\$id));
  const name=esc(m.displayName||'cet utilisateur');
  const sheet=document.createElement('div');
  sheet.className='action-sheet-overlay';
  let items='<button type="button" data-act="delme">🗑 Supprimer pour moi</button>';
  if(mine)items+='<button type="button" data-act="delall">🗑 Supprimer pour tout le monde</button>';
  if(!mine){
    items+='<button type="button" data-act="report">🚩 Signaler '+name+'</button>';
    items+='<button type="button" data-act="block">⛔ Bloquer '+name+'</button>';
  }
  items+='<button type="button" data-act="cancel" class="as-cancel">Annuler</button>';
  sheet.innerHTML='<div class="action-sheet-card">'+items+'</div>';
  document.body.appendChild(sheet);
  requestAnimationFrame(function(){sheet.classList.add('show')});
  function close(){sheet.classList.remove('show');setTimeout(function(){sheet.remove()},160);}
  sheet.addEventListener('click',function(e){
    if(e.target===sheet){close();return}
    const act=e.target.closest('[data-act]');if(!act)return;
    const kind=act.getAttribute('data-act');
    close();
    if(kind==='delme')deleteMessageForMe(m);
    else if(kind==='delall')confirmDeleteMessageForAll(m);
    else if(kind==='report')openReportModal(m.uid,m.displayName||'User');
    else if(kind==='block')confirmBlockUser(m.uid,m.displayName||'User');
  });
}
async function deleteMessageForMe(m){
  try{
    const hidden=(m.hiddenFor||[]).map(String);
    if(hidden.indexOf(me.\$id)<0)hidden.push(me.\$id);
    await db.updateDocument(DB,'dms_messages',m.\$id,{hiddenFor:hidden});
    msgsCache=msgsCache.filter(function(x){return x.\$id!==m.\$id});
    renderMessages();
  }catch(e){showToast('Action impossible','error');}
}
function confirmDeleteMessageForAll(m){
  showSlideConfirm('Supprimer ce message pour tout le monde ? Action irréversible.',async function(){
    try{
      await db.deleteDocument(DB,'dms_messages',m.\$id);
      msgsCache=msgsCache.filter(function(x){return x.\$id!==m.\$id});
      renderMessages();
    }catch(e){showToast('Suppression impossible','error');}
  });
}
async function postMessage(data,lastMessagePreview,keyCtx){
  if(!activeDm||!me)return;
  const name=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'User';
  let enc=!!data.enc;
  let text=data.text||'';
  let keysJson=(keyCtx&&keyCtx.keysJson)||'';
  if(keyCtx&&keyCtx.aesKey&&text){
    try{text=await e2eEncryptTextWithKey(keyCtx.aesKey,text);enc=true;}catch(e){}
  }
  const payload=Object.assign({threadId:activeDm,uid:me.\$id,displayName:name,type:'text',mediaUrl:''},data,{text:text,enc:enc,keysJson:keysJson});
  await db.createDocument(DB,'dms_messages',Appwrite.ID.unique(),payload);
  const previewPub=enc?'🔒 Message chiffré':lastMessagePreview;
  const recipients=activeDmIsGroup?activeDmMembers.filter(function(u){return u!==me.\$id}):(activeDmPeerUid?[activeDmPeerUid]:[]);
  try{
    const dmDoc=dmsCache.find(function(d){return d.\$id===activeDm});
    const unread=parseJsonSafe(dmDoc&&dmDoc.unreadJson,{});
    recipients.forEach(function(uid){unread[uid]=(unread[uid]||0)+1;});
    await db.updateDocument(DB,'dms',activeDm,{lastMessage:previewPub.slice(0,100),unreadJson:JSON.stringify(unread)});
  }catch(e){}
  recipients.forEach(function(uid){
    authPost('/api/push/notify',{type:'message',toUid:uid,threadId:activeDm,preview:previewPub.slice(0,140)}).catch(function(){});
  });
  await loadMessages(activeDm);
  await loadDms();if(view==='dms')renderDms();
}
async function sendMessage(){
  const input=\$('msg-input');
  const text=(input.value||'').trim();
  if(!text||!activeDm||!me)return;
  input.value='';
  \$('btn-send').classList.add('hidden');\$('btn-voice').classList.remove('hidden');
  try{
    const keyCtx=await e2eGetMessageKeyContext();
    await postMessage({text:text.slice(0,2000),type:'text'},text,keyCtx);
  }catch(e){xlog('send_msg_fail',{msg:(e&&e.message)||String(e)});}
}
if(\$('btn-send'))\$('btn-send').addEventListener('click',sendMessage);
if(\$('msg-input'))\$('msg-input').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
if(\$('msg-input'))\$('msg-input').addEventListener('input',function(){
  const has=this.value.trim().length>0;
  \$('btn-send').classList.toggle('hidden',!has);
  \$('btn-voice').classList.toggle('hidden',has);
});
if(\$('btn-chat-back'))\$('btn-chat-back').addEventListener('click',function(){document.getElementById('app').classList.remove('chat-open');repositionCallPanel();});

/* ===== Pièces jointes ===== */
if(\$('btn-attach'))\$('btn-attach').addEventListener('click',function(e){e.stopPropagation();\$('attach-menu').classList.toggle('hidden')});
document.addEventListener('click',function(e){
  const menu=\$('attach-menu');
  if(menu&&!menu.classList.contains('hidden')&&!menu.contains(e.target)&&e.target!==\$('btn-attach'))menu.classList.add('hidden');
});
document.querySelectorAll('#attach-menu [data-attach]').forEach(function(btn){
  btn.addEventListener('click',function(){
    const kind=btn.getAttribute('data-attach');
    \$('attach-menu').classList.add('hidden');
    if(kind==='image')\$('file-image').click();
    else if(kind==='file')\$('file-generic').click();
    else if(kind==='gif')openGifPicker();
    else if(kind==='location')shareLocation();
  });
});
const MAX_ATTACH_BYTES=25*1024*1024;
async function handleFileAttach(file,kindHint){
  if(!file||!activeDm)return;
  if(file.size>MAX_ATTACH_BYTES){alert('Fichier trop volumineux (25 Mo max).');return}
  let type=kindHint;
  if(kindHint==='auto'){
    if(file.type.indexOf('image/')===0)type='image';
    else if(file.type.indexOf('video/')===0)type='video';
    else type='file';
  }
  try{
    const keyCtx=await e2eGetMessageKeyContext();
    let uploadBlob=file,enc=false;
    if(keyCtx&&keyCtx.aesKey){
      const encBlob=await e2eEncryptBlobWithKey(keyCtx.aesKey,file);
      uploadBlob=new File([encBlob],file.name,{type:'application/octet-stream'});enc=true;
    }
    const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),uploadBlob,[Appwrite.Permission.read(Appwrite.Role.any())]);
    const fileUrl=PROXY_EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;
    const data={type:type,mediaUrl:fileUrl,enc:enc,mime:file.type};
    let preview='📎 Pièce jointe';
    if(type==='image'){preview='📷 Photo';}
    else if(type==='video'){preview='🎬 Vidéo';}
    else{data.text=JSON.stringify({name:file.name,size:file.size,mime:file.type});preview='📄 '+file.name;}
    await postMessage(data,preview,keyCtx);
  }catch(e){alert('Envoi impossible : '+((e&&e.message)||e));xlog('attach_fail',{msg:(e&&e.message)||String(e)});}
}
if(\$('file-image'))\$('file-image').addEventListener('change',function(){handleFileAttach(this.files[0],'auto');this.value='';});
if(\$('file-generic'))\$('file-generic').addEventListener('change',function(){handleFileAttach(this.files[0],'file');this.value='';});

let gifSearchTimeout=null;
function openGifPicker(){
  if(!activeDm){alert('Ouvre une conversation directe.');return}
  \$('gif-search').value='';
  \$('modal-gif').classList.remove('hidden');
  loadGifs('drôle');
}
async function loadGifs(q){
  \$('gif-grid').innerHTML='<div class="empty-hint">Chargement…</div>';
  try{
    const r=await fetch('/api/gifs?q='+encodeURIComponent(q)+'&limit=24');
    const j=await r.json();
    const results=j.results||[];
    \$('gif-grid').innerHTML=results.map(function(g){return '<img src="'+esc(g.url)+'" data-gif="'+esc(g.url)+'" loading="lazy"/>'}).join('')||'<div class="empty-hint">Aucun résultat</div>';
    \$('gif-grid').querySelectorAll('[data-gif]').forEach(function(el){
      el.addEventListener('click',function(){sendGif(el.getAttribute('data-gif'))});
    });
  }catch(e){\$('gif-grid').innerHTML='<div class="empty-hint">Erreur de chargement</div>';}
}
if(\$('gif-search'))\$('gif-search').addEventListener('input',function(){
  clearTimeout(gifSearchTimeout);
  const q=this.value.trim()||'drôle';
  gifSearchTimeout=setTimeout(function(){loadGifs(q)},400);
});
if(\$('gif-close'))\$('gif-close').addEventListener('click',function(){\$('modal-gif').classList.add('hidden')});
if(\$('modal-gif'))\$('modal-gif').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});
async function sendGif(gifUrl){
  \$('modal-gif').classList.add('hidden');
  try{await postMessage({type:'gif',mediaUrl:gifUrl},'🎞️ GIF');}
  catch(e){xlog('gif_send_fail',{msg:(e&&e.message)||String(e)});}
}

function shareLocation(){
  if(!activeDm){alert('Ouvre une conversation directe.');return}
  if(!navigator.geolocation){alert('Géolocalisation non supportée sur cet appareil.');return}
  navigator.geolocation.getCurrentPosition(async function(pos){
    try{
      await postMessage({type:'location',text:JSON.stringify({lat:pos.coords.latitude,lng:pos.coords.longitude})},'📍 Position');
    }catch(e){xlog('location_send_fail',{msg:(e&&e.message)||String(e)});}
  },function(){alert('Impossible d\\'obtenir ta position.');},{enableHighAccuracy:false,timeout:8000});
}

/* ===== Messages vocaux (maintenir pour enregistrer) ===== */
let vrState=null,vrTimerId=null,vrRafId=null,vrAudioCtx=null,vrAnalyser=null;
let vrPending=false,vrStopRequested=false;
function vrBuildLiveWave(){
  const el=\$('vr-live-wave');if(!el)return;
  el.innerHTML='';
  for(let i=0;i<40;i++){const b=document.createElement('span');b.style.height='10%';el.appendChild(b);}
}
let vrLastTickAt=0;
function vrTick(){
  if(!vrState||!vrAnalyser){vrRafId=null;return}
  const now=Date.now();
  if(now-vrLastTickAt<90){vrRafId=requestAnimationFrame(vrTick);return}
  vrLastTickAt=now;
  const data=new Uint8Array(vrAnalyser.frequencyBinCount);
  vrAnalyser.getByteFrequencyData(data);
  let sum=0;for(let i=0;i<data.length;i++)sum+=data[i];
  const level=Math.min(100,Math.max(8,Math.round((sum/data.length/140)*100)));
  const wave=\$('vr-live-wave');
  if(wave){
    const first=wave.firstElementChild;
    if(first)wave.appendChild(first);
    if(wave.lastElementChild)wave.lastElementChild.style.height=level+'%';
  }
  vrRafId=requestAnimationFrame(vrTick);
}
function vrUpdateTimer(){
  if(!vrState)return;
  const el=\$('vr-timer');if(el)el.textContent=fmtDur((Date.now()-vrState.startTime)/1000);
}
function startVoiceRecording(clientX){
  if(vrState||!activeDm){vrPending=false;\$('composer').classList.remove('recording');return}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    vrPending=false;
    if(vrStopRequested){
      stream.getTracks().forEach(function(t){t.stop()});
      \$('composer').classList.remove('recording');
      return;
    }
    vrState={stream:stream,chunks:[],startX:clientX,startTime:Date.now(),canceled:false,dragDx:0};
    let rec;
    try{rec=new MediaRecorder(stream);}catch(e){stream.getTracks().forEach(function(t){t.stop()});vrState=null;\$('composer').classList.remove('recording');alert('Enregistrement vocal indisponible sur ce navigateur');return}
    vrState.recorder=rec;
    rec.ondataavailable=function(e){if(e.data&&e.data.size&&vrState)vrState.chunks.push(e.data)};
    rec.onstop=function(){
      stream.getTracks().forEach(function(t){t.stop()});
      const st=vrState;vrState=null;
      \$('composer').classList.remove('recording');
      if(vrTimerId){clearInterval(vrTimerId);vrTimerId=null;}
      if(vrRafId){cancelAnimationFrame(vrRafId);vrRafId=null;}
      if(vrAnalyser){try{vrAnalyser.disconnect();}catch(e2){}vrAnalyser=null;}
      const durationMs=Date.now()-st.startTime;
      if(st.canceled)return;
      if(durationMs>=400&&st.chunks.length){
        finishVoiceRecording(st.chunks,rec.mimeType||'audio/webm',durationMs);
      } else {
        alert('Message trop court — maintiens le bouton plus longtemps.');
      }
    };
    rec.start();
    \$('composer').classList.add('recording');
    \$('voice-record').style.transform='';
    \$('voice-record').classList.remove('will-cancel');
    vrBuildLiveWave();
    vrUpdateTimer();
    vrTimerId=setInterval(vrUpdateTimer,200);
    try{
      const ctx=vrAudioCtx;
      if(ctx){
        const src=ctx.createMediaStreamSource(stream);
        vrAnalyser=ctx.createAnalyser();vrAnalyser.fftSize=256;
        src.connect(vrAnalyser);
        if(!vrRafId)vrRafId=requestAnimationFrame(vrTick);
      }
    }catch(e){}
    if(vrStopRequested)stopVoiceRecording();
  }).catch(function(){vrPending=false;\$('composer').classList.remove('recording');alert('Micro refusé ou indisponible');});
}
function cancelVoiceRecording(){
  if(!vrState)return;
  vrState.canceled=true;
  if(vrState.recorder&&vrState.recorder.state!=='inactive')vrState.recorder.stop();
}
function stopVoiceRecording(){
  if(!vrState)return;
  if(vrState.recorder&&vrState.recorder.state!=='inactive')vrState.recorder.stop();
}
async function finishVoiceRecording(chunks,mimeType,durationMs){
  try{
    const blob=new Blob(chunks,{type:mimeType});
    const ext=mimeType.indexOf('ogg')>=0?'ogg':(mimeType.indexOf('mp4')>=0?'m4a':'webm');
    const keyCtx=await e2eGetMessageKeyContext();
    let uploadBlob=blob,enc=false;
    if(keyCtx&&keyCtx.aesKey){
      const encBlob=await e2eEncryptBlobWithKey(keyCtx.aesKey,blob);
      uploadBlob=encBlob;enc=true;
    }
    const file=new File([uploadBlob],'voice-'+Date.now()+'.'+(enc?'bin':ext),{type:enc?'application/octet-stream':mimeType});
    const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),file,[Appwrite.Permission.read(Appwrite.Role.any())]);
    const fileUrl=PROXY_EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;
    await postMessage({type:'audio',mediaUrl:fileUrl,enc:enc,mime:mimeType,text:JSON.stringify({duration:durationMs/1000})},'🎤 Message vocal',keyCtx);
  }catch(e){showToast('Envoi du message vocal impossible : '+((e&&e.message)||e),'error');xlog('voice_send_fail',{msg:(e&&e.message)||String(e)});}
}
(function wireVoiceButton(){
  const btn=\$('btn-voice');if(!btn)return;
  btn.style.touchAction='none';
  let pid=null;
  btn.addEventListener('pointerdown',function(e){
    e.preventDefault();
    if(vrPending||vrState)return;
    pid=e.pointerId;
    try{btn.setPointerCapture(e.pointerId);}catch(err){}
    vrPending=true;vrStopRequested=false;
    try{
      vrAudioCtx=vrAudioCtx||new (window.AudioContext||window.webkitAudioContext)();
      if(vrAudioCtx.state==='suspended')vrAudioCtx.resume().catch(function(){});
    }catch(e2){vrAudioCtx=null;}
    \$('composer').classList.add('recording');
    startVoiceRecording(e.clientX);
  });
  btn.addEventListener('pointermove',function(e){
    if(!vrState||e.pointerId!==pid)return;
    const dx=Math.min(0,e.clientX-vrState.startX);
    vrState.dragDx=dx;
    \$('voice-record').style.transform='translateX('+(Math.max(dx,-140))+'px)';
    \$('voice-record').classList.toggle('will-cancel',dx<-100);
  });
  btn.addEventListener('pointerup',function(e){
    if(e.pointerId!==pid)return;
    pid=null;
    vrStopRequested=true;
    if(vrState){
      if(vrState.dragDx<-100)cancelVoiceRecording();
      else stopVoiceRecording();
    }
  });
  btn.addEventListener('pointercancel',function(e){
    if(e.pointerId!==pid)return;
    pid=null;
    vrStopRequested=true;
    if(vrState)cancelVoiceRecording();
  });
})();

if(\$('btn-add-friend'))\$('btn-add-friend').addEventListener('click',function(){
  \$('fq').value='';\$('fr').innerHTML='';\$('modal-friend').classList.remove('hidden');
});
const MAX_GROUP_MEMBERS=6;
if(\$('btn-new-group'))\$('btn-new-group').addEventListener('click',function(){
  \$('mg-name').value='';\$('mg-err').textContent='';
  const accepted=friendsCache.filter(function(f){return f.status==='accepted'});
  const box=\$('mg-friends');
  if(!accepted.length){
    box.innerHTML='<div class="empty-hint">Ajoute des amis avant de créer un groupe.</div>';
  }else{
    box.innerHTML=accepted.map(function(f){
      return '<label class="mg-friend-row"><input type="checkbox" value="'+esc(f.friendId)+'" data-name="'+esc(f.name||'Ami')+'"/><div class="av">'+esc(ini(f.name||'?'))+'</div><div class="n">'+esc(f.name||'Ami')+'</div></label>';
    }).join('');
  }
  \$('modal-group').classList.remove('hidden');
});
if(\$('mg-close'))\$('mg-close').addEventListener('click',function(){\$('modal-group').classList.add('hidden')});
if(\$('modal-group'))\$('modal-group').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});
if(\$('mg-create'))\$('mg-create').addEventListener('click',async function(){
  const btn=this;
  \$('mg-err').textContent='';
  const name=\$('mg-name').value.trim();
  const checked=Array.from(\$('mg-friends').querySelectorAll('input[type="checkbox"]:checked'));
  if(!name){\$('mg-err').textContent='Donne un nom au groupe';return}
  if(checked.length<2){\$('mg-err').textContent='Choisis au moins 2 amis';return}
  if(checked.length>MAX_GROUP_MEMBERS-1){\$('mg-err').textContent='Maximum '+MAX_GROUP_MEMBERS+' membres (toi compris)';return}
  btn.disabled=true;btn.textContent='Création…';
  try{
    const members=[String(me.\$id)].concat(checked.map(function(c){return c.value}));
    const dm=await db.createDocument(DB,'dms',Appwrite.ID.unique(),{members:members,displayName:name,lastMessage:'Groupe créé'});
    dmsCache.unshift(dm);
    \$('modal-group').classList.add('hidden');
    showView('dms');
    await openDm(dm.\$id,name,null);
  }catch(e){\$('mg-err').textContent=(e&&e.message)||'Erreur lors de la création';}
  btn.disabled=false;btn.textContent='Créer le groupe';
});
if(\$('mf-close'))\$('mf-close').addEventListener('click',function(){\$('modal-friend').classList.add('hidden')});
if(\$('fq'))\$('fq').addEventListener('input',async function(){
  const q=this.value.trim().toLowerCase();
  if(q.length<2){\$('fr').innerHTML='';return}
  try{
    if(!membersCache.length)await loadMembers();
    const matches=membersCache.filter(function(p){
      return (p.username||'').toLowerCase().indexOf(q)>=0||(p.displayName||'').toLowerCase().indexOf(q)>=0;
    }).slice(0,10);
    \$('fr').innerHTML=matches.map(function(p){
      const name=p.displayName||p.username||'User';
      const uid=p.authUserId||p.\$id;
      return '<div class="row" data-add="'+esc(uid)+'" data-name="'+esc(name)+'">'
        +'<div class="av">'+esc(ini(name))+'</div>'
        +'<div class="info"><div class="n">'+esc(name)+'</div></div>'
        +'<div class="act"><button type="button">Ajouter</button></div></div>';
    }).join('')||'<div class="empty-hint">Aucun résultat</div>';
    \$('fr').querySelectorAll('[data-add]').forEach(function(el){
      el.querySelector('button').onclick=async function(){
        try{
          await sendFriendRequest(el.getAttribute('data-add'),el.getAttribute('data-name'));
          this.textContent='Envoyé';this.disabled=true;
        }catch(e){this.textContent='Erreur';}
      };
    });
  }catch(e){xlog('friend_search_fail',{msg:(e&&e.message)||String(e)});}
});

let isAdmin=false, staffRole='member', adminTab='dashboard';
async function authJwt(){
  const j=await account.createJWT();
  return j&&j.jwt;
}
async function authPost(path,body){
  const jwt=await authJwt();
  const r=await fetch(path,{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+jwt},
    body:JSON.stringify(body||{})
  });
  const j=await r.json().catch(function(){return {ok:false,error:'Réponse invalide'}});
  if(!r.ok||!j.ok)throw new Error((j&&j.error)||('Erreur '+r.status));
  return j;
}
async function authGet(path){
  const jwt=await authJwt();
  const r=await fetch(path,{headers:{'Authorization':'Bearer '+jwt}});
  const j=await r.json().catch(function(){return {ok:false,error:'Réponse invalide'}});
  if(!r.ok||!j.ok)throw new Error((j&&j.error)||('Erreur '+r.status));
  return j;
}

/* ===== Notifications push (Web Push) ===== */
let pushSubscribed=false;
async function registerServiceWorker(){
  if(!('serviceWorker' in navigator))return null;
  try{return await navigator.serviceWorker.register('/sw.js');}catch(e){xlog('sw_register_fail',{msg:(e&&e.message)||String(e)});return null}
}
function urlBase64ToUint8Array(base64String){
  const padding='='.repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
  const raw=atob(base64);
  const arr=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)arr[i]=raw.charCodeAt(i);
  return arr;
}
function pushSupported(){
  return ('Notification' in window)&&('serviceWorker' in navigator)&&('PushManager' in window);
}
async function refreshPushButtonState(){
  const btn=\$('ub-push');if(!btn)return;
  if(!pushSupported()){btn.classList.add('hidden');return}
  let subscribed=false;
  try{
    const reg=await navigator.serviceWorker.getRegistration('/sw.js');
    if(reg){const sub=await reg.pushManager.getSubscription();subscribed=!!sub;}
  }catch(e){}
  pushSubscribed=subscribed;
  btn.classList.toggle('on',subscribed);
  btn.textContent=subscribed?'🔔':'🔕';
  btn.title=subscribed?'Notifications activées':'Activer les notifications';
}
async function enablePushNotifications(){
  if(!pushSupported()){alert('Les notifications ne sont pas supportées sur ce navigateur.');return}
  try{
    const perm=await Notification.requestPermission();
    if(perm!=='granted'){alert('Notifications refusées. Tu peux les réactiver dans les réglages du navigateur.');return}
    const reg=await registerServiceWorker();
    if(!reg)throw new Error('Service worker indisponible');
    await navigator.serviceWorker.ready;
    const keyRes=await fetch('/api/push/vapid-key');
    const keyJson=await keyRes.json();
    const appKey=urlBase64ToUint8Array(keyJson.key);
    let sub=await reg.pushManager.getSubscription();
    if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:appKey});
    await authPost('/api/push/subscribe',{subscription:sub.toJSON()});
    xlog('push_subscribed',{});
  }catch(e){xlog('push_subscribe_fail',{msg:(e&&e.message)||String(e)});alert('Impossible d\\'activer les notifications : '+((e&&e.message)||e));}
  await refreshPushButtonState();
}
async function disablePushNotifications(){
  try{
    const reg=await navigator.serviceWorker.getRegistration('/sw.js');
    if(reg){
      const sub=await reg.pushManager.getSubscription();
      if(sub){
        await authPost('/api/push/unsubscribe',{endpoint:sub.endpoint}).catch(function(){});
        await sub.unsubscribe();
      }
    }
  }catch(e){}
  await refreshPushButtonState();
}
if(\$('ub-push'))\$('ub-push').addEventListener('click',async function(){
  if(pushSubscribed)await disablePushNotifications();else await enablePushNotifications();
});
async function checkAdmin(){
  try{
    const jwt=await authJwt();
    const r=await fetch('/api/admin/access',{headers:{'Authorization':'Bearer '+jwt}});
    const j=await r.json().catch(function(){return {ok:false}});
    isAdmin=!!(j&&j.ok);
    staffRole=isAdmin?(j.role||'mod'):'member';
  }catch(e){isAdmin=false;staffRole='member'}
  document.querySelectorAll('.admin-nav-btn').forEach(function(b){b.classList.toggle('hidden',!isAdmin)});
  document.querySelectorAll('.owner-only').forEach(function(b){b.classList.toggle('hidden',staffRole!=='owner')});
  xlog('admin_check',{isAdmin:isAdmin,role:staffRole});
}
if(\$('btn-admin-back'))\$('btn-admin-back').addEventListener('click',function(){document.getElementById('app').classList.remove('chat-open');});
document.querySelectorAll('.admin-subtab').forEach(function(b){
  b.addEventListener('click',function(){showAdminTab(b.getAttribute('data-atab'))});
});
function showAdminTab(tab){
  adminTab=tab;
  document.querySelectorAll('.admin-subtab').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-atab')===tab)});
  const box=\$('admin-body');if(!box)return;
  box.innerHTML='<div class="empty-hint">Chargement…</div>';
  if(tab==='dashboard')loadAdminDashboard().then(renderAdminDashboard).catch(adminErr);
  else if(tab==='members')loadAdminMembers().then(renderAdminMembers).catch(adminErr);
  else if(tab==='reports')loadAdminReports().then(renderAdminReports).catch(adminErr);
  else if(tab==='bans')loadAdminBans().then(renderAdminBans).catch(adminErr);
  else if(tab==='bugs')loadAdminBugs().then(renderAdminBugs).catch(adminErr);
  else if(tab==='calls')loadAdminCalls().then(renderAdminCalls).catch(adminErr);
  else if(tab==='logs')loadAdminLogs().then(renderAdminLogs).catch(adminErr);
  else if(tab==='maintenance')loadAdminMaintenance().then(renderAdminMaintenance).catch(adminErr);
}
function adminErr(e){
  const box=\$('admin-body');if(box)box.innerHTML='<div class="empty-hint">Erreur : '+esc((e&&e.message)||String(e))+'</div>';
  xlog('admin_tab_error',{tab:adminTab,msg:(e&&e.message)||String(e)});
}

async function loadAdminDashboard(){
  const now=Date.now();
  const dayMs=86400000;
  const todayStart=new Date();todayStart.setHours(0,0,0,0);

  const usersRes=await db.listDocuments(DB,'users',[Appwrite.Query.limit(100),Appwrite.Query.orderDesc('\$createdAt')]);
  const allUsers=usersRes.documents||[];
  const totalUsers=usersRes.total!=null?usersRes.total:allUsers.length;
  const newToday=allUsers.filter(function(u){return new Date(u.\$createdAt)>=todayStart}).length;
  const onlineNow=allUsers.filter(function(u){return u.lastSeen&&(now-new Date(u.lastSeen).getTime())<3*60*1000}).length;

  let msgs=[];
  try{
    const msgsRes=await db.listDocuments(DB,'dms_messages',[Appwrite.Query.limit(200),Appwrite.Query.orderDesc('\$createdAt')]);
    msgs=msgsRes.documents||[];
  }catch(e){}
  const msgs24h=msgs.filter(function(m){return now-new Date(m.\$createdAt).getTime()<dayMs}).length;
  const msgs7d=msgs.filter(function(m){return now-new Date(m.\$createdAt).getTime()<7*dayMs}).length;

  const days=[];
  for(let i=6;i>=0;i--){
    const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);
    const next=new Date(d);next.setDate(d.getDate()+1);
    const label=d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'});
    const msgCount=msgs.filter(function(m){const t=new Date(m.\$createdAt);return t>=d&&t<next}).length;
    const userCount=allUsers.filter(function(u){const t=new Date(u.\$createdAt);return t>=d&&t<next}).length;
    days.push({label:label,msgCount:msgCount,userCount:userCount});
  }

  let activeCalls=0;
  try{const calls=await loadAdminCalls();activeCalls=calls.length;}catch(e){}

  let pendingBugs=0;
  try{
    const bugsRes=await db.listDocuments(DB,'bug_reports',[Appwrite.Query.equal('status','pending'),Appwrite.Query.limit(1)]);
    pendingBugs=bugsRes.total!=null?bugsRes.total:0;
  }catch(e){}

  let pendingReports=0;
  try{
    const reports=await loadAdminReports();
    pendingReports=reports.filter(function(r){return r.status==='pending'}).length;
  }catch(e){}

  let recentLogs=[];
  try{recentLogs=(await loadAdminLogs()).slice(0,6);}catch(e){}

  return {totalUsers,newToday,onlineNow,msgs24h,msgs7d,days,activeCalls,pendingBugs,pendingReports,recentLogs};
}
function renderAdminDashboard(d){
  const box=\$('admin-body');if(!box)return;
  const maxMsg=Math.max(1,Math.max.apply(null,d.days.map(function(x){return x.msgCount})));
  const chartBars=d.days.map(function(x){
    const h=Math.round((x.msgCount/maxMsg)*100);
    return '<div class="dash-bar-col"><div class="dash-bar" style="height:'+Math.max(3,h)+'%" title="'+x.msgCount+' message(s)"></div><div class="dash-bar-label">'+esc(x.label)+'</div></div>';
  }).join('');
  const logsHtml=d.recentLogs.length?d.recentLogs.map(function(l){
    const when=l.at?new Date(l.at).toLocaleString('fr-FR'):'';
    return '<div class="log-line"><b>'+esc(l.by||'?')+'</b> — '+esc(l.action||'')+' — '+esc(l.detail||'')+'<div class="when">'+esc(when)+'</div></div>';
  }).join(''):'<div class="empty-hint">Aucune activité récente.</div>';
  box.innerHTML=
    '<div class="dash-grid">'
    +dashCard('🟢','En ligne',d.onlineNow)
    +dashCard('👥','Utilisateurs',d.totalUsers)
    +dashCard('✨','Nouveaux aujourd\\'hui',d.newToday)
    +dashCard('💬','Messages 24h',d.msgs24h)
    +dashCard('📈','Messages 7j',d.msgs7d)
    +dashCard('📞','Appels actifs',d.activeCalls)
    +dashCard('🐞','Bugs en attente',d.pendingBugs)
    +dashCard('🚩','Signalements en attente',d.pendingReports)
    +'</div>'
    +'<div class="dash-section"><div class="dash-section-title">Messages — 7 derniers jours</div><div class="dash-chart">'+chartBars+'</div></div>'
    +'<div class="dash-section"><div class="dash-section-title">Activité récente</div>'+logsHtml+'</div>';
}
function dashCard(icon,label,value){
  return '<div class="dash-card"><div class="dash-card-icon">'+icon+'</div><div class="dash-card-value">'+esc(String(value))+'</div><div class="dash-card-label">'+esc(label)+'</div></div>';
}

async function loadAdminMembers(){
  if(!membersCache.length)await loadMembers();
  return membersCache;
}
const TOGGLEABLE_BADGES=['dev','hunter','early'];
let adminMembersQuery='';
function renderAdminMembers(list,focusSearch){
  const box=\$('admin-body');if(!box)return;
  const q=adminMembersQuery.trim().toLowerCase();
  const filtered=q?list.filter(function(p){
    const uid=p.authUserId||p.\$id;
    return [p.displayName,p.username,p.email,p.tag,uid].some(function(v){return v&&String(v).toLowerCase().indexOf(q)>=0});
  }):list;
  const searchHtml='<div class="admin-search-row"><input type="text" id="admin-members-search" placeholder="Rechercher par pseudo, email, UID…" value="'+esc(adminMembersQuery)+'"/></div>';
  if(!filtered.length){
    box.innerHTML=searchHtml+'<div class="empty-hint">Aucun membre'+(q?' pour cette recherche':'')+'.</div>';
    wireAdminMembersSearch(list,focusSearch);
    return;
  }
  box.innerHTML=searchHtml+filtered.map(function(p){
    const name=p.displayName||p.username||'User';
    const uid=p.authUserId||p.\$id;
    const self=uid===(me&&me.\$id);
    const modTag=p.isMod?'<span class="tag-mod">MOD</span>':'';
    const badges=parseBadges(memberMetaByUid[uid]);
    const isOwner=staffRole==='owner';
    const badgeBtns=isOwner?TOGGLEABLE_BADGES.map(function(b){
      const on=badges.indexOf(b)>=0;
      return '<button type="button" data-badgetoggle="'+b+'" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'" class="'+(on?'ok':'')+'" title="'+esc(BADGE_DEFS[b].label)+'">'+BADGE_DEFS[b].icon+(on?' ✓':'')+'</button>';
    }).join(''):'';
    return '<div class="admin-row" style="align-items:flex-start;flex-wrap:wrap">'
      +'<span data-profile="'+esc(uid)+'" style="display:contents;cursor:pointer">'+rowAvatar(p,name,uid)+'</span>'
      +'<div class="info"><div class="n" data-profile="'+esc(uid)+'" style="cursor:pointer">'+esc(name)+modTag+'</div><div class="p">@'+esc(p.username||'')+(p.tag?('#'+esc(p.tag)):'')+'</div>'
      +'<div class="acts" style="margin-top:6px">'+badgeBtns+'<button type="button" data-adminfiche="'+esc(uid)+'">📋 Fiche</button></div></div>'
      +(self?'':'<div class="acts">'
        +(isOwner?'<button type="button" data-modtoggle="'+esc(p.\$id)+'" data-mod="'+(p.isMod?'1':'0')+'" data-name="'+esc(name)+'" class="ok">'+(p.isMod?'Retirer modo':'Rendre modo')+'</button>':'')
        +'<button type="button" data-tban="'+esc(uid)+'" data-name="'+esc(name)+'">Temp ban 24h</button>'
        +(isOwner?'<button type="button" data-ban="'+esc(uid)+'" data-name="'+esc(name)+'" class="danger">Ban</button>':'')
        +'</div>')
      +'</div>';
  }).join('');
  wireAdminMembersSearch(list,focusSearch);
  box.querySelectorAll('[data-profile]').forEach(function(el){
    el.onclick=function(e){e.stopPropagation();openProfileModal(el.getAttribute('data-profile'))};
  });
  box.querySelectorAll('[data-adminfiche]').forEach(function(el){
    el.onclick=function(e){e.stopPropagation();openAdminUserModal(el.getAttribute('data-adminfiche'))};
  });
  box.querySelectorAll('[data-badgetoggle]').forEach(function(el){
    el.onclick=async function(){
      this.disabled=true;
      try{
        const uid=el.getAttribute('data-uid'),badge=el.getAttribute('data-badgetoggle');
        const current=parseBadges(memberMetaByUid[uid]);
        const has=current.indexOf(badge)>=0;
        const next=has?current.filter(function(b){return b!==badge}):current.concat([badge]);
        await authPost('/api/admin/badges',{authUserId:uid,badges:next,targetName:el.getAttribute('data-name')});
        memberMetaByUid[uid]=Object.assign({},memberMetaByUid[uid],{badgesJson:JSON.stringify(next)});
        renderAdminMembers(list);
      }catch(e){adminErr(e)}
    };
  });
  box.querySelectorAll('[data-modtoggle]').forEach(function(el){
    el.onclick=async function(){
      this.disabled=true;
      try{
        await authPost('/api/admin/mod',{profileId:el.getAttribute('data-modtoggle'),isMod:el.getAttribute('data-mod')!=='1',targetName:el.getAttribute('data-name')});
        membersCache=[];await loadAdminMembers().then(function(l){renderAdminMembers(l)});
      }catch(e){adminErr(e)}
    };
  });
  box.querySelectorAll('[data-ban]').forEach(function(el){
    el.onclick=async function(){
      const reason=prompt('Raison du ban :','')||'Ban staff';
      this.disabled=true;
      try{
        await authPost('/api/admin/ban',{uid:el.getAttribute('data-ban'),username:el.getAttribute('data-name'),reason:reason,type:'ban'});
        alert('Utilisateur banni.');
      }catch(e){adminErr(e)}
      this.disabled=false;
    };
  });
  box.querySelectorAll('[data-tban]').forEach(function(el){
    el.onclick=async function(){
      this.disabled=true;
      try{
        await authPost('/api/admin/ban',{uid:el.getAttribute('data-tban'),username:el.getAttribute('data-name'),reason:'Temp ban 24h',type:'tempban'});
        alert('Ban temporaire de 24h appliqué.');
      }catch(e){adminErr(e)}
      this.disabled=false;
    };
  });
}
function wireAdminMembersSearch(list,focusSearch){
  const input=\$('admin-members-search');
  if(!input)return;
  if(focusSearch){
    input.focus();
    const v=input.value;input.setSelectionRange(v.length,v.length);
  }
  input.oninput=function(){adminMembersQuery=this.value;renderAdminMembers(list,true);};
}

async function loadAdminBans(){
  const r=await authGet('/api/admin/bans');
  return r.bans||[];
}
function renderAdminBans(list){
  const box=\$('admin-body');if(!box)return;
  if(!list.length){box.innerHTML='<div class="empty-hint">Aucune sanction active.</div>';return}
  box.innerHTML=list.map(function(b){
    const untilTxt=b.until==='permanent'?'Permanent':('Jusqu\\'au '+new Date(Number(b.until)).toLocaleString('fr-FR'));
    return '<div class="admin-row">'
      +'<div class="av">'+esc(ini(b.username||b.uid))+'</div>'
      +'<div class="info"><div class="n">'+esc(b.username||b.uid)+' · '+esc(b.type||'ban')+'</div><div class="p">'+esc(b.reason||'')+' — '+esc(untilTxt)+' — par '+esc(b.by||'?')+'</div></div>'
      +'<div class="acts"><button type="button" data-unban="'+esc(b.\$id)+'" class="ok">Lever</button></div>'
      +'</div>';
  }).join('');
  box.querySelectorAll('[data-unban]').forEach(function(el){
    el.onclick=async function(){
      this.disabled=true;
      try{
        await authPost('/api/admin/unban',{banId:el.getAttribute('data-unban')});
        await loadAdminBans().then(renderAdminBans);
      }catch(e){adminErr(e)}
    };
  });
}

const REPORT_REASON_LABELS={harcelement:'Harcèlement',contenu_inapproprie:'Contenu inapproprié',spam:'Spam',usurpation:'Usurpation d\\'identité',autre:'Autre'};
const REPORT_STATUS_LABELS={pending:'En attente',reviewed:'Traité',dismissed:'Rejeté'};
async function loadAdminReports(){
  const r=await authGet('/api/admin/reports');
  return r.reports||[];
}
function renderAdminReports(list){
  const box=\$('admin-body');if(!box)return;
  if(!list.length){box.innerHTML='<div class="empty-hint">Aucun signalement.</div>';return}
  const sorted=list.slice().sort(function(a,b){
    if(a.status==='pending'&&b.status!=='pending')return -1;
    if(a.status!=='pending'&&b.status==='pending')return 1;
    return 0;
  });
  box.innerHTML=sorted.map(function(r){
    const when=r.at?new Date(r.at).toLocaleString('fr-FR'):(r.\$createdAt?new Date(r.\$createdAt).toLocaleString('fr-FR'):'');
    const statusCls=r.status==='pending'?'':(r.status==='dismissed'?'danger':'ok');
    return '<div class="admin-row" style="align-items:flex-start;flex-wrap:wrap">'
      +'<div class="av">🚩</div>'
      +'<div class="info">'
        +'<div class="n">'+esc(REPORT_REASON_LABELS[r.reason]||r.reason)+' — <span class="'+(r.status==='pending'?'tag-mod':'')+'">'+esc(REPORT_STATUS_LABELS[r.status]||r.status)+'</span></div>'
        +'<div class="p">Visé : '+esc(r.targetName||r.targetUid)+' · Par : '+esc(r.reporterName||r.reporterUid)+' · '+esc(when)+'</div>'
        +(r.details?'<div class="p" style="margin-top:4px">'+esc(r.details)+'</div>':'')
      +'</div>'
      +'<div class="acts">'
        +'<button type="button" data-reportfiche="'+esc(r.targetUid)+'">📋 Fiche</button>'
        +(r.status!=='reviewed'?'<button type="button" data-reportstatus="'+esc(r.\$id)+'" data-status="reviewed" class="ok">Marquer traité</button>':'')
        +(r.status!=='dismissed'?'<button type="button" data-reportstatus="'+esc(r.\$id)+'" data-status="dismissed" class="danger">Rejeter</button>':'')
      +'</div>'
      +'</div>';
  }).join('');
  box.querySelectorAll('[data-reportfiche]').forEach(function(el){
    el.onclick=function(){openAdminUserModal(el.getAttribute('data-reportfiche'))};
  });
  box.querySelectorAll('[data-reportstatus]').forEach(function(el){
    el.onclick=async function(){
      this.disabled=true;
      try{
        await authPost('/api/admin/reports/status',{reportId:el.getAttribute('data-reportstatus'),status:el.getAttribute('data-status')});
        await loadAdminReports().then(renderAdminReports);
      }catch(e){adminErr(e)}
    };
  });
}

async function loadAdminBugs(){
  const r=await db.listDocuments(DB,'bug_reports',[Appwrite.Query.orderDesc('\$createdAt'),Appwrite.Query.limit(100)]);
  return r.documents||[];
}
function renderAdminBugs(list){
  const box=\$('admin-body');if(!box)return;
  if(!list.length){box.innerHTML='<div class="empty-hint">Aucun rapport de bug.</div>';return}
  box.innerHTML=list.map(function(b){
    const st=(b.status==='open'?'pending':b.status)||'pending';
    return '<div class="admin-row" style="align-items:flex-start">'
      +'<div class="av">'+esc(ini(b.username||'?'))+'</div>'
      +'<div class="info"><div class="n">'+esc(b.title||'Sans titre')+'</div>'
      +'<div class="p">'+esc(b.description||'')+'</div>'
      +'<div class="p">par '+esc(b.username||'?')+' — '+esc(BUG_STATUS_LABEL[st]||st)+' · 👍 '+(b.upvotes||0)+'</div></div>'
      +'<div class="acts">'
      +(st!=='approved'?'<button type="button" data-bugstatus="'+esc(b.\$id)+'" data-status="approved" class="ok">En cours</button>':'')
      +(st!=='resolved'?'<button type="button" data-bugstatus="'+esc(b.\$id)+'" data-status="resolved" class="ok">Résolu</button>':'')
      +(st!=='pending'?'<button type="button" data-bugstatus="'+esc(b.\$id)+'" data-status="pending">Attente</button>':'')
      +'</div></div>';
  }).join('');
  box.querySelectorAll('[data-bugstatus]').forEach(function(el){
    el.onclick=async function(){
      this.disabled=true;
      try{
        await authPost('/api/admin/bugstatus',{reportId:el.getAttribute('data-bugstatus'),status:el.getAttribute('data-status')});
        await loadAdminBugs().then(renderAdminBugs);
      }catch(e){adminErr(e)}
    };
  });
}

async function loadAdminCalls(){
  const jwt=await authJwt();
  const r=await fetch('/api/admin/calls',{headers:{'Authorization':'Bearer '+jwt}});
  const j=await r.json().catch(function(){return {ok:false}});
  if(!r.ok||!j.ok)throw new Error((j&&j.error)||('Erreur '+r.status));
  return j.calls||[];
}
function renderAdminCalls(list){
  const box=\$('admin-body');if(!box)return;
  if(!list.length){box.innerHTML='<div class="empty-hint">Aucun appel actif.</div>';return}
  const statusLabel={ringing:'Sonne…',accepted:'En cours'};
  box.innerHTML=list.map(function(c){
    return '<div class="admin-row"><div class="av">📞</div>'
      +'<div class="info"><div class="n">Appel : '+esc((c.participantNames||[]).join(' ↔ ')||'—')+'</div>'
      +'<div class="p">'+esc(statusLabel[c.status]||c.status||'')+' — démarré '+esc(c.startedAt?new Date(c.startedAt).toLocaleString('fr-FR'):'?')+'</div></div></div>';
  }).join('');
}

async function loadAdminLogs(){
  const r=await authGet('/api/admin/logs');
  return r.logs||[];
}
function renderAdminLogs(list){
  const box=\$('admin-body');if(!box)return;
  if(!list.length){box.innerHTML='<div class="empty-hint">Aucun log. Les actions admin (ban, grades…) apparaîtront ici.</div>';return}
  box.innerHTML=list.map(function(l){
    const when=l.at?new Date(l.at).toLocaleString('fr-FR'):'';
    return '<div class="log-line"><b>'+esc(l.by||'?')+'</b> — '+esc(l.action||'')+' — '+esc(l.detail||'')+'<div class="when">'+esc(when)+'</div></div>';
  }).join('');
}

async function loadAdminMaintenance(){
  const jwt=await authJwt();
  const r=await fetch('/api/admin/maintenance',{headers:{'Authorization':'Bearer '+jwt}});
  const j=await r.json().catch(function(){return {ok:false}});
  if(!r.ok||!j.ok)throw new Error((j&&j.error)||('Erreur '+r.status));
  return j;
}
function renderAdminMaintenance(state){
  const box=\$('admin-body');if(!box)return;
  box.innerHTML=''
    +'<div class="maint-panel">'
    +'<label class="maint-toggle-row"><input type="checkbox" id="maint-enabled"'+(state.enabled?' checked':'')+'/> Mode maintenance activé (bloque tout le site sauf le cookie de secours)</label>'
    +'<label class="maint-label">Message affiché sur la page de maintenance</label>'
    +'<textarea id="maint-message" class="field-input" style="height:120px;padding-top:9px;resize:vertical">'+esc(state.message||'')+'</textarea>'
    +'<button type="button" class="btn-main" id="maint-save" style="margin-top:10px">Enregistrer</button>'
    +'<div class="err" id="maint-err"></div>'
    +'</div>';
  \$('maint-save').onclick=async function(){
    this.disabled=true;\$('maint-err').textContent='';
    try{
      await authPost('/api/admin/maintenance',{enabled:\$('maint-enabled').checked,message:\$('maint-message').value});
      \$('maint-err').textContent='Enregistré.';\$('maint-err').style.color='#86efac';
    }catch(e){\$('maint-err').textContent=(e&&e.message)||'Erreur';\$('maint-err').style.color='';}
    this.disabled=false;
  };
}

let editBugId=null;
function openBugModal(doc){
  editBugId=doc?doc.\$id:null;
  \$('bug-title').value=doc?(doc.title||''):'';
  \$('bug-desc').value=doc?(doc.description||''):'';
  \$('bug-err').textContent='';
  \$('bug-modal-title').textContent=doc?'✏️ Éditer mon rapport':'🐞 Signaler un bug';
  /* modal-hunter partage le même z-index que tous les .overlay : s'il
     est déjà ouvert (on vient de son bouton "+ Nouveau rapport"), il
     passe devant modal-bug puisqu'il est plus loin dans le DOM. On le
     masque le temps du formulaire, il sera rouvert en fermant celui-ci. */
  const hunterWasOpen=\$('modal-hunter')&&!\$('modal-hunter').classList.contains('hidden');
  if(hunterWasOpen)\$('modal-hunter').classList.add('hidden');
  \$('modal-bug').dataset.reopenHunter=hunterWasOpen?'1':'';
  \$('modal-bug').classList.remove('hidden');
}
function closeBugModal(){
  const reopenHunter=\$('modal-bug').dataset.reopenHunter==='1';
  \$('modal-bug').classList.add('hidden');
  \$('modal-bug').dataset.reopenHunter='';
  if(reopenHunter)\$('modal-hunter').classList.remove('hidden');
}
if(\$('btn-report-bug'))\$('btn-report-bug').addEventListener('click',function(){openBugModal(null)});
if(\$('mb-close'))\$('mb-close').addEventListener('click',closeBugModal);
if(\$('bug-submit'))\$('bug-submit').addEventListener('click',async function(){
  const title=(\$('bug-title').value||'').trim();
  const desc=(\$('bug-desc').value||'').trim();
  if(!title||!desc){\$('bug-err').textContent='Titre et description requis';return}
  this.disabled=true;this.textContent=editBugId?'Mise à jour…':'Envoi…';
  try{
    if(editBugId){
      await db.updateDocument(DB,'bug_reports',editBugId,{title:title.slice(0,120),description:desc.slice(0,2000)});
      xlog('bug_report_edited',{});
    } else {
      const name=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'User';
      await db.createDocument(DB,'bug_reports',Appwrite.ID.unique(),{
        uid:me.\$id,username:name,title:title.slice(0,120),description:desc.slice(0,2000),status:'pending',upvotes:0
      },[
        Appwrite.Permission.read(Appwrite.Role.any()),
        Appwrite.Permission.update(Appwrite.Role.user(me.\$id)),
        Appwrite.Permission.delete(Appwrite.Role.user(me.\$id))
      ]);
      xlog('bug_report_sent',{});
      showToast('Merci ! Ton rapport a été envoyé à l\\'équipe.');
    }
    editBugId=null;
    closeBugModal();
    try{await refreshHunterEligibility();}catch(e){}
    if(!\$('modal-hunter').classList.contains('hidden'))await loadMyBugs();
  }catch(e){\$('bug-err').textContent=(e&&e.message)||'Erreur';xlog('bug_report_fail',{msg:(e&&e.message)||String(e)});}
  this.disabled=false;this.textContent='Envoyer le rapport';
});

let resolvedBugCount=0;
async function countResolvedBugs(){
  if(!me)return 0;
  try{
    const r=await db.listDocuments(DB,'bug_reports',[Appwrite.Query.equal('uid',me.\$id),Appwrite.Query.equal('status','resolved'),Appwrite.Query.limit(100)]);
    return (r.documents||[]).length;
  }catch(e){return 0}
}
async function refreshHunterEligibility(){
  if(!me)return;
  resolvedBugCount=await countResolvedBugs();
  let meta=memberMetaByUid[me.\$id];
  if(!meta){
    try{meta=await db.getDocument(DB,'user_meta',me.\$id);memberMetaByUid[me.\$id]=meta;}catch(e){}
  }
  const badges=parseBadges(meta);
  const eligible=badges.indexOf('hunter')>=0||badges.indexOf('dev')>=0||resolvedBugCount>=10;
  const btn=\$('ub-hunter');
  if(btn)btn.classList.toggle('hidden',!eligible);
}

let myBugsCache=[];
async function loadMyBugs(){
  if(!me)return;
  try{
    const r=await db.listDocuments(DB,'bug_reports',[Appwrite.Query.equal('uid',me.\$id),Appwrite.Query.orderDesc('\$createdAt'),Appwrite.Query.limit(50)]);
    myBugsCache=r.documents||[];
  }catch(e){myBugsCache=[]}
  const resolved=myBugsCache.filter(function(b){return b.status==='resolved'}).length;
  \$('hunter-stats').textContent=resolved+'/10 résolus';
  renderMyBugs();
}
const BUG_STATUS_LABEL={pending:'En attente',approved:'En cours',resolved:'Résolu'};
function renderMyBugs(){
  const box=\$('hunter-bug-list');if(!box)return;
  if(!myBugsCache.length){box.innerHTML='<p style="color:var(--muted);font-size:.85rem">Aucun rapport pour l\\'instant.</p>';return}
  box.innerHTML=myBugsCache.map(function(b){
    const st=b.status||'pending';
    return '<div class="bug-item"><div class="bt">'+esc(b.title||'Sans titre')+'</div>'
      +'<div class="bd">'+esc(b.description||'')+'</div>'
      +'<div class="meta"><span class="st st-'+esc(st)+'">'+esc(BUG_STATUS_LABEL[st]||st)+'</span>'
      +'<span>👍 '+(b.upvotes||0)+'</span>'
      +'<span>'+esc((b.\$createdAt||'').toString().slice(0,10))+'</span></div>'
      +'<div class="actions">'
      +(st==='pending'?'<button type="button" data-bedit="'+esc(b.\$id)+'">✏️ Éditer</button>':'')
      +'<button type="button" data-bup="'+esc(b.\$id)+'">👍 Up</button>'
      +'<button type="button" class="del" data-bdel="'+esc(b.\$id)+'">🗑️</button>'
      +'</div></div>';
  }).join('');
  box.querySelectorAll('[data-bedit]').forEach(function(el){
    el.onclick=function(){
      const doc=myBugsCache.find(function(x){return x.\$id===el.getAttribute('data-bedit')});
      if(doc)openBugModal(doc);
    };
  });
  box.querySelectorAll('[data-bup]').forEach(function(el){
    el.onclick=async function(){
      this.disabled=true;
      try{
        const jwt=await authJwt();
        const r=await fetch('/api/bugs/upvote',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+jwt},body:JSON.stringify({reportId:el.getAttribute('data-bup')})});
        const j=await r.json().catch(function(){return {ok:false}});
        if(!r.ok||!j.ok)throw new Error((j&&j.error)||'Erreur');
        await loadMyBugs();
      }catch(e){this.disabled=false;xlog('bug_upvote_fail',{msg:(e&&e.message)||String(e)});}
    };
  });
  box.querySelectorAll('[data-bdel]').forEach(function(el){
    el.onclick=async function(){
      if(!confirm('Supprimer ce rapport ?'))return;
      this.disabled=true;
      try{
        await db.deleteDocument(DB,'bug_reports',el.getAttribute('data-bdel'));
        await loadMyBugs();await refreshHunterEligibility();
      }catch(e){this.disabled=false;xlog('bug_delete_fail',{msg:(e&&e.message)||String(e)});}
    };
  });
}
if(\$('ub-hunter'))\$('ub-hunter').addEventListener('click',function(){
  \$('modal-hunter').classList.remove('hidden');
  loadMyBugs();
});
if(\$('ub-bell'))\$('ub-bell').addEventListener('click',function(){showView('friends')});
if(\$('hp-close'))\$('hp-close').addEventListener('click',function(){\$('modal-hunter').classList.add('hidden')});
if(\$('hp-new'))\$('hp-new').addEventListener('click',function(){openBugModal(null)});

/* ===== Appels vocaux (WebRTC) ===== */
const ICE_SERVERS={iceServers:[
  {urls:'stun:stun.l.google.com:19302'},
  {urls:'stun:stun1.l.google.com:19302'},
  {urls:'stun:openrelay.metered.ca:80'},
  {urls:'turn:openrelay.metered.ca:80',username:'openrelayproject',credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443?transport=tcp',username:'openrelayproject',credential:'openrelayproject'}
]};
const AV_QUALITY={
  '480p30':{w:854,h:480,fps:30,bitrate:700000},
  '720p30':{w:1280,h:720,fps:30,bitrate:1500000},
  '720p60':{w:1280,h:720,fps:60,bitrate:2200000},
  '1080p30':{w:1920,h:1080,fps:30,bitrate:3000000},
  '1080p60':{w:1920,h:1080,fps:60,bitrate:4500000},
  '1440p60':{w:2560,h:1440,fps:60,bitrate:8000000},
  '2160p30':{w:3840,h:2160,fps:30,bitrate:10000000},
  '2160p60':{w:3840,h:2160,fps:60,bitrate:15000000}
};

let callPc=null, localStream=null, activeCallDoc=null, incomingCallDoc=null;
let callPeerUid=null, callPeerName=null, callIsCaller=false;
let callTimerId=null, callTimeoutId=null, callStartedAt=null, currentCallLabel='';
let callUnsubs=[];
let pendingLocalIce=[];
let camStream=null, screenStream=null, camSender=null, screenSender=null;
let makingOffer=false, ignoreOffer=false, callLive=false;
let remoteTiles={cam:null,screen:null};
let remoteMetaByMid={}, pendingRemoteTracksByMid={}, localMetaQueue=[];
let remoteMicMuted=false, remoteDeafened=false, screenShareRevealed=false;
let videoMasked=false, cinemaMode=false, enlargedTileKey=null, videoEls={};
let camQualityKey='720p30', screenQualityKey='1080p60';
let micVolumePct=100, outVolumePct=100;
let noiseSuppressionOn=true, echoCancellationOn=true, agcOn=true, channelMode='mono';
let audioCtx=null;
let micSourceNode=null, micGainNode=null, micDestNode=null, micAnalyser=null, micMeterRaf=null;
let outSourceNode=null, outGainNode=null, outPanner=null, outLfo=null, outLfoGain=null, outConnected=false;
function isPolite(){return !callIsCaller}

function ensureAudioCtx(){
  if(!audioCtx){
    try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){audioCtx=null;}
  }
  /* Sur mobile, l'AudioContext démarre souvent "suspended" tant qu'aucun
     geste utilisateur direct ne le débloque — une fois qu'on route
     l'élément <audio> à travers ce contexte (ensureOutputAudioGraph), son
     chemin de sortie natif est coupé : s'il reste suspendu, aucun son ne
     sort, sans la moindre erreur JS. On tente de le relancer à chaque
     appel, et un tap n'importe où sur la barre d'appel (voir plus bas)
     redonne une nouvelle chance si la première tentative a été refusée. */
  if(audioCtx&&audioCtx.state==='suspended'){
    audioCtx.resume().then(function(){xlog('audio_ctx_resume',{state:audioCtx&&audioCtx.state});}).catch(function(){});
  }
  return audioCtx;
}
if(\$('call-bar'))\$('call-bar').addEventListener('click',function(){
  if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume().catch(function(){});
},true);
function ensureOutputAudioGraph(){
  const el=\$('call-remote-audio');if(!el)return;
  const ctx=ensureAudioCtx();if(!ctx)return;
  if(outConnected)return;
  try{
    outSourceNode=ctx.createMediaElementSource(el);
    outPanner=ctx.createStereoPanner();
    outGainNode=ctx.createGain();
    outGainNode.gain.value=outVolumePct/100;
    outSourceNode.connect(outPanner).connect(outGainNode).connect(ctx.destination);
    outConnected=true;
    xlog('out_chain_ready',{ctxState:ctx.state});
    applyChannelMode();
  }catch(e){xlog('out_chain_fail',{msg:(e&&e.message)||String(e)});}
}
function rebuildMicChain(){
  if(!localStream||!callPc)return;
  const ctx=ensureAudioCtx();if(!ctx)return;
  try{
    if(micAnalyser){try{micAnalyser.disconnect();}catch(e){}micAnalyser=null;}
    if(micSourceNode){try{micSourceNode.disconnect();}catch(e){}}
    if(micGainNode){try{micGainNode.disconnect();}catch(e){}}
    micSourceNode=ctx.createMediaStreamSource(localStream);
    micGainNode=ctx.createGain();
    micGainNode.gain.value=micVolumePct/100;
    micDestNode=ctx.createMediaStreamDestination();
    micSourceNode.connect(micGainNode).connect(micDestNode);
    const newTrack=micDestNode.stream.getAudioTracks()[0];
    const sender=callPc.getSenders().find(function(s){return s.track&&s.track.kind==='audio'});
    if(sender&&newTrack)sender.replaceTrack(newTrack);
  }catch(e){xlog('mic_chain_fail',{msg:(e&&e.message)||String(e)});}
}
async function applyChannelMode(){
  if(localStream){
    const t=localStream.getAudioTracks()[0];
    if(t){try{await t.applyConstraints({channelCount:channelMode==='mono'?1:2});}catch(e){}}
  }
  if(outPanner){
    if(channelMode==='spatial'){
      if(!outLfo&&audioCtx){
        outLfo=audioCtx.createOscillator();
        outLfo.frequency.value=0.12;
        outLfoGain=audioCtx.createGain();
        outLfoGain.gain.value=0.35;
        outLfo.connect(outLfoGain).connect(outPanner.pan);
        outLfo.start();
      }
    } else if(outLfo){
      try{outLfo.stop();outLfo.disconnect();}catch(e){}
      outLfo=null;
      try{outPanner.pan.value=0;}catch(e){}
    }
  }
}
function startMicMeter(){
  if(!localStream)return;
  if(!micSourceNode)rebuildMicChain();
  const ctx=audioCtx;if(!ctx||!micSourceNode)return;
  if(!micAnalyser){
    micAnalyser=ctx.createAnalyser();
    micAnalyser.fftSize=256;
    micSourceNode.connect(micAnalyser);
  }
  const data=new Uint8Array(micAnalyser.frequencyBinCount);
  function loop(){
    const modal=\$('modal-call-settings');
    if(!modal||modal.classList.contains('hidden')||!micAnalyser){micMeterRaf=null;return}
    micAnalyser.getByteFrequencyData(data);
    let sum=0;for(let i=0;i<data.length;i++)sum+=data[i];
    const avg=sum/data.length;
    const pct=Math.min(100,Math.round((avg/140)*100));
    const fill=\$('cs-mic-meter');if(fill)fill.style.width=pct+'%';
    micMeterRaf=requestAnimationFrame(loop);
  }
  loop();
}
function stopMicMeter(){
  if(micMeterRaf){cancelAnimationFrame(micMeterRaf);micMeterRaf=null;}
}
async function applyEncodingBitrate(sender,bitrate){
  if(!sender)return;
  try{
    const params=sender.getParameters();
    if(!params.encodings||!params.encodings.length)params.encodings=[{}];
    params.encodings[0].maxBitrate=bitrate;
    await sender.setParameters(params);
  }catch(e){}
}
async function applyCamQualityLive(){
  if(!camStream||!camSender)return;
  const q=AV_QUALITY[camQualityKey];if(!q)return;
  const track=camStream.getVideoTracks()[0];
  if(track){try{await track.applyConstraints({width:{ideal:q.w},height:{ideal:q.h},frameRate:{ideal:q.fps}});}catch(e){}}
  applyEncodingBitrate(camSender,q.bitrate);
}
async function applyScreenQualityLive(){
  if(!screenStream||!screenSender)return;
  const q=AV_QUALITY[screenQualityKey];if(!q)return;
  const track=screenStream.getVideoTracks()[0];
  if(track){try{await track.applyConstraints({width:{ideal:q.w},height:{ideal:q.h},frameRate:{ideal:q.fps}});}catch(e){}}
  applyEncodingBitrate(screenSender,q.bitrate);
}
function getMidForSender(sender){
  if(!callPc||!sender)return null;
  const tr=callPc.getTransceivers().find(function(t){return t.sender===sender});
  return tr?tr.mid:null;
}
function flushLocalMetaQueue(){
  if(!localMetaQueue.length||!activeCallDoc)return;
  const q=localMetaQueue;localMetaQueue=[];
  q.forEach(function(entry){
    const mid=getMidForSender(entry.sender);
    if(mid==null){localMetaQueue.push(entry);return}
    sendSignal(activeCallDoc.\$id,'video-meta',{mid:mid,type:entry.type});
  });
}

function computeActiveTiles(){
  const tiles=[];
  const micIcon=remoteMicMuted?' 🔇':'';
  if(camStream)tiles.push({key:'local-cam',stream:camStream,label:'Toi · Caméra',isLocal:true});
  if(screenStream)tiles.push({key:'local-screen',stream:screenStream,label:'Toi · Écran',isLocal:true});
  if(remoteTiles.cam)tiles.push({key:'remote-cam',stream:remoteTiles.cam.stream,label:(callPeerName||'Correspondant')+' · Caméra'+micIcon,isLocal:false});
  /* Le partage d'écran distant ne s'affiche pas automatiquement : par
     défaut on montre juste un bandeau "Voir la diffusion", pour éviter
     qu'un écran partagé s'impose brusquement à l'écran de l'autre. */
  if(remoteTiles.screen&&screenShareRevealed)tiles.push({key:'remote-screen',stream:remoteTiles.screen.stream,label:(callPeerName||'Correspondant')+' · Écran'+micIcon,isLocal:false});
  return tiles;
}
function renderVideoGrid(){
  const grid=\$('vgrid');if(!grid)return;
  const tiles=computeActiveTiles();
  const hasVideo=tiles.length>0;
  if(!hasVideo){
    videoMasked=false;
    enlargedTileKey=null;
    if(cinemaMode)exitCinema();
  }
  if(enlargedTileKey&&!tiles.some(function(t){return t.key===enlargedTileKey}))enlargedTileKey=null;
  const seen={};
  tiles.forEach(function(t){
    seen[t.key]=true;
    let wrap=videoEls[t.key];
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='vtile';
      const video=document.createElement('video');
      video.autoplay=true;video.playsInline=true;
      if(t.isLocal)video.muted=true;
      wrap.appendChild(video);
      const lbl=document.createElement('div');
      lbl.className='vlabel';
      wrap.appendChild(lbl);
      wrap.addEventListener('click',function(){
        enlargedTileKey=(enlargedTileKey===t.key)?null:t.key;
        renderVideoGrid();
      });
      videoEls[t.key]=wrap;
    }
    const video=wrap.querySelector('video');
    if(video.srcObject!==t.stream)video.srcObject=t.stream;
    wrap.querySelector('.vlabel').textContent=t.label;
    wrap.classList.toggle('enlarged',enlargedTileKey===t.key);
    if(grid!==wrap.parentElement)grid.appendChild(wrap);
  });
  Object.keys(videoEls).forEach(function(k){
    if(!seen[k]){
      const el=videoEls[k];
      if(el.parentElement)el.parentElement.removeChild(el);
      const v=el.querySelector('video');if(v)v.srcObject=null;
      delete videoEls[k];
    }
  });
  grid.classList.toggle('n1',tiles.length===1);
  const revealPill=\$('screen-reveal-pill');
  if(revealPill){
    const pending=!!remoteTiles.screen&&!screenShareRevealed;
    revealPill.classList.toggle('hidden',!pending);
    if(pending){
      \$('screen-reveal-label').textContent='Voir la diffusion de '+(callPeerName||'Correspondant');
      revealPill.onclick=function(){screenShareRevealed=true;renderVideoGrid();};
    }
  }
  const cbv=\$('cb-video');if(cbv)cbv.classList.toggle('hidden',!hasVideo||videoMasked);
  const camActive=!!camStream||!!remoteTiles.cam;
  const screenActive=!!screenStream||(!!remoteTiles.screen&&screenShareRevealed);
  let pillLabel='';
  if(camActive&&screenActive)pillLabel='Webcam & écran actifs';
  else if(screenActive)pillLabel='Partage d\\'écran actif';
  else if(camActive)pillLabel='Webcam active';
  const lp=\$('lp-label');if(lp)lp.textContent=pillLabel;
  const pill=\$('live-pill');if(pill)pill.classList.toggle('show',hasVideo&&videoMasked);
  const cin=\$('cb-cinema');if(cin)cin.disabled=!hasVideo;
}
function enterCinema(){
  if(cinemaMode)return;
  cinemaMode=true;videoMasked=false;
  const stage=\$('call-video-stage'),grid=\$('vgrid');
  if(stage&&grid){stage.appendChild(grid);grid.classList.add('cinema');stage.classList.remove('hidden');}
  const btn=\$('cb-cinema');if(btn)btn.classList.add('on');
  try{if(stage&&stage.requestFullscreen)stage.requestFullscreen().catch(function(){});}catch(e){}
  renderVideoGrid();
}
function exitCinema(){
  if(!cinemaMode)return;
  cinemaMode=false;
  const cbv=\$('cb-video'),grid=\$('vgrid');
  if(cbv&&grid){
    const top=cbv.querySelector('.cbv-top');
    if(top)top.insertAdjacentElement('afterend',grid);else cbv.appendChild(grid);
    grid.classList.remove('cinema');
  }
  const stage=\$('call-video-stage');if(stage)stage.classList.add('hidden');
  const btn=\$('cb-cinema');if(btn)btn.classList.remove('on');
  if(document.fullscreenElement){try{document.exitFullscreen();}catch(e){}}
  renderVideoGrid();
}
document.addEventListener('fullscreenchange',function(){
  if(!document.fullscreenElement&&cinemaMode)exitCinema();
});
(function initVideoGrid(){
  const grid=document.createElement('div');
  grid.className='vgrid';grid.id='vgrid';
  const cbv=\$('cb-video');
  if(cbv)cbv.appendChild(grid);
})();

function onRemoteTrack(e){
  if(e.track.kind==='video'){
    const mid=e.transceiver?e.transceiver.mid:null;
    const stream=(e.streams&&e.streams[0])||new MediaStream([e.track]);
    let type=(mid!=null)?remoteMetaByMid[mid]:null;
    if(!type){
      type=remoteTiles.cam?'screen':'cam';
      if(mid!=null)pendingRemoteTracksByMid[mid]={stream:stream,track:e.track};
    }
    xlog('remote_video_track',{mid:mid,type:type,readyState:e.track.readyState});
    remoteTiles[type]={stream:stream,track:e.track,mid:mid};
    e.track.onended=function(){
      if(remoteTiles[type]&&remoteTiles[type].track===e.track){remoteTiles[type]=null;renderVideoGrid();}
    };
    renderVideoGrid();
  } else {
    const a=\$('call-remote-audio');
    if(a)a.srcObject=e.streams[0]||new MediaStream([e.track]);
    ensureOutputAudioGraph();
  }
}
async function onNegotiationNeeded(){
  if(!callLive||!activeCallDoc||!callPc){
    xlog('reneg_skipped',{callLive:callLive,hasDoc:!!activeCallDoc,hasPc:!!callPc});
    return;
  }
  try{
    makingOffer=true;
    await callPc.setLocalDescription();
    xlog('reneg_offer_sent',{state:callPc.signalingState,senders:callPc.getSenders().map(function(s){return s.track&&s.track.kind}).filter(Boolean)});
    sendSignal(activeCallDoc.\$id,'reneg-offer',callPc.localDescription);
    flushLocalMetaQueue();
  }catch(e){xlog('call_reneg_fail',{msg:(e&&e.message)||String(e)});}
  finally{makingOffer=false;}
}
function stopLocalCam(){
  if(!camSender&&!camStream)return;
  try{if(camSender)callPc.removeTrack(camSender);}catch(e){}
  camSender=null;
  if(camStream){camStream.getTracks().forEach(function(t){t.stop()});camStream=null;}
  \$('cb-cam').classList.remove('on');
  if(enlargedTileKey==='local-cam')enlargedTileKey=null;
  renderVideoGrid();
  /* Signal explicite plutôt que de compter sur track.onended côté distant :
     après un removeTrack(), le récepteur ne reçoit pas forcément un onended
     natif (Unified Plan renégocie juste le m-line en inactif) — sans ce
     signal, la vidéo de l'autre reste figée sur la dernière image au lieu
     de disparaître. */
  if(activeCallDoc)sendSignal(activeCallDoc.\$id,'video-off',{type:'cam'});
}
let camToggleBusy=false;
async function toggleCamera(){
  if(!callPc||camToggleBusy)return;
  if(camSender){stopLocalCam();return;}
  camToggleBusy=true;
  try{
    const q=AV_QUALITY[camQualityKey]||AV_QUALITY['720p30'];
    camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:q.w},height:{ideal:q.h},frameRate:{ideal:q.fps}}});
    const track=camStream.getVideoTracks()[0];
    if(!callPc){camStream.getTracks().forEach(function(t){t.stop()});camStream=null;return}
    camSender=callPc.addTrack(track,camStream);
    localMetaQueue.push({sender:camSender,type:'cam'});
    applyEncodingBitrate(camSender,q.bitrate);
    track.onended=function(){if(camStream&&camStream.getVideoTracks()[0]===track)stopLocalCam();};
    \$('cb-cam').classList.add('on');
    renderVideoGrid();
    xlog('cam_toggled_on',{callLive:callLive,signalingState:callPc.signalingState,trackState:track.readyState});
  }catch(e){showToast('Caméra refusée ou indisponible','error');xlog('cam_toggle_fail',{msg:(e&&e.message)||String(e)});}
  finally{camToggleBusy=false;}
}
function stopScreenShare(){
  if(!screenSender&&!screenStream)return;
  if(screenStream){screenStream.getTracks().forEach(function(t){t.stop()});screenStream=null;}
  if(screenSender){try{callPc.removeTrack(screenSender);}catch(e){}screenSender=null;}
  \$('cb-screen').classList.remove('on');
  if(enlargedTileKey==='local-screen')enlargedTileKey=null;
  renderVideoGrid();
  if(activeCallDoc)sendSignal(activeCallDoc.\$id,'video-off',{type:'screen'});
}
let screenToggleBusy=false;
async function toggleScreenShare(){
  if(!callPc||screenToggleBusy)return;
  if(screenSender){stopScreenShare();return;}
  screenToggleBusy=true;
  try{
    const q=AV_QUALITY[screenQualityKey]||AV_QUALITY['1080p60'];
    screenStream=await navigator.mediaDevices.getDisplayMedia({video:{width:{ideal:q.w},height:{ideal:q.h},frameRate:{ideal:q.fps}},audio:false});
    const track=screenStream.getVideoTracks()[0];
    if(!callPc){screenStream.getTracks().forEach(function(t){t.stop()});screenStream=null;return}
    screenSender=callPc.addTrack(track,screenStream);
    localMetaQueue.push({sender:screenSender,type:'screen'});
    applyEncodingBitrate(screenSender,q.bitrate);
    \$('cb-screen').classList.add('on');
    renderVideoGrid();
    track.onended=function(){stopScreenShare();};
  }catch(e){
    if(e&&e.name!=='NotAllowedError')showToast('Partage d\\'écran indisponible','error');
  }
  finally{screenToggleBusy=false;}
}

function callUnsubAll(){
  callUnsubs.forEach(function(u){try{u()}catch(e){}});
  callUnsubs=[];
}
function eventIs(events,suffix){
  return (events||[]).some(function(e){return e.indexOf(suffix)>=0});
}

function subscribeIncomingCalls(){
  try{
    const unsub=client.subscribe('databases.'+DB+'.collections.direct_calls.documents',function(res){
      if(!eventIs(res.events,'.create'))return;
      const doc=res.payload;
      if(!doc||String(doc.calleeId)!==String(me.\$id))return;
      if(doc.status!=='ringing')return;
      if(activeCallDoc||incomingCallDoc)return; // already busy
      showIncomingCall(doc);
    });
    callUnsubs.push(unsub);
  }catch(e){xlog('call_sub_fail',{msg:(e&&e.message)||String(e)});}
}
async function checkPendingIncomingCall(){
  if(!me||activeCallDoc||incomingCallDoc)return;
  try{
    const r=await db.listDocuments(DB,'direct_calls',[Appwrite.Query.limit(20)]);
    const docs=(r.documents||[]).filter(function(d){return String(d.calleeId)===String(me.\$id)&&d.status==='ringing'});
    if(!docs.length)return;
    docs.sort(function(a,b){return new Date(b.\$createdAt)-new Date(a.\$createdAt)});
    showIncomingCall(docs[0]);
  }catch(e){xlog('call_pending_check_fail',{msg:(e&&e.message)||String(e)});}
}

let ringSubtitleTimeoutId=null;
function showIncomingCall(doc){
  incomingCallDoc=doc;
  \$('ic-name').textContent=doc.callerName||'Appel inconnu';
  const av=\$('ic-av');
  if(safeUrl(doc.callerAvatar))av.innerHTML='<img src="'+esc(safeUrl(doc.callerAvatar))+'" alt=""/>';
  else av.textContent=ini(doc.callerName||'?');
  av.classList.remove('settled');
  av.style.cursor='pointer';
  av.onclick=function(){openProfileModal(doc.callerId)};
  \$('ic-name').style.cursor='pointer';
  \$('ic-name').onclick=function(){openProfileModal(doc.callerId)};
  \$('modal-incoming-call').classList.remove('hidden');
  const ringElapsed=Date.now()-new Date(doc.\$createdAt).getTime();
  const ringRemaining=Math.max(0,60000-ringElapsed);
  function settle(){
    \$('ic-sub').textContent='Appel en cours — rejoins quand tu veux';
    av.classList.add('settled');
  }
  if(ringRemaining<=0)settle();
  else ringSubtitleTimeoutId=setTimeout(settle,ringRemaining);
  const unsub=client.subscribe('databases.'+DB+'.collections.direct_calls.documents.'+doc.\$id,function(res){
    if(eventIs(res.events,'.delete')||(res.payload&&['declined','ended','missed'].indexOf(res.payload.status)>=0)){
      if(incomingCallDoc&&incomingCallDoc.\$id===doc.\$id)dismissIncomingCall();
    }
  });
  callUnsubs.push(unsub);
}
function dismissIncomingCall(){
  incomingCallDoc=null;
  \$('modal-incoming-call').classList.add('hidden');
  \$('ic-sub').textContent='Appel vocal entrant…';
  if(ringSubtitleTimeoutId){clearTimeout(ringSubtitleTimeoutId);ringSubtitleTimeoutId=null;}
}

async function acceptIncomingCall(){
  const doc=incomingCallDoc;
  if(!doc)return;
  dismissIncomingCall();
  callPeerUid=doc.callerId;callPeerName=doc.callerName||'Appel';callIsCaller=false;
  try{
    localStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:echoCancellationOn,noiseSuppression:noiseSuppressionOn,autoGainControl:agcOn,channelCount:channelMode==='mono'?1:2}});
  }catch(e){alert('Micro refusé ou indisponible');try{await db.updateDocument(DB,'direct_calls',doc.\$id,{status:'declined'});}catch(e2){}return}
  try{
    const pc=new RTCPeerConnection(ICE_SERVERS);
    callPc=pc;
    localStream.getTracks().forEach(function(t){pc.addTrack(t,localStream)});
    pc.ontrack=onRemoteTrack;
    pc.onicecandidate=function(e){if(e.candidate)sendSignal(doc.\$id,'ice',e.candidate)};
    pc.onnegotiationneeded=onNegotiationNeeded;
    await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(doc.offer)));
    const answer=await pc.createAnswer();
    await pc.setLocalDescription(answer);
    activeCallDoc=await db.updateDocument(DB,'direct_calls',doc.\$id,{status:'accepted',answer:JSON.stringify(answer)});
    subscribeIceForCall(doc.\$id);
    subscribeCallDocLifecycle(doc.\$id);
    callLive=true;
    rebuildMicChain();
    showCallBar(callPeerName,'En appel…',new Date(doc.\$createdAt).getTime());
    broadcastCallState();
  }catch(e){
    xlog('call_accept_fail',{msg:(e&&e.message)||String(e)});
    endCall('ended');
  }
}
async function declineIncomingCall(){
  const doc=incomingCallDoc;
  dismissIncomingCall();
  if(!doc)return;
  try{await db.updateDocument(DB,'direct_calls',doc.\$id,{status:'declined'});}catch(e){}
}

async function startCall(peerUid,peerName){
  if(!me||!peerUid||peerUid===me.\$id)return;
  if(activeCallDoc||incomingCallDoc){alert('Un appel est déjà en cours.');return}
  callPeerUid=peerUid;callPeerName=peerName||'Appel';callIsCaller=true;
  pendingLocalIce=[];
  try{
    localStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:echoCancellationOn,noiseSuppression:noiseSuppressionOn,autoGainControl:agcOn,channelCount:channelMode==='mono'?1:2}});
  }catch(e){alert('Micro refusé ou indisponible sur cet appareil');return}
  try{
    const pc=new RTCPeerConnection(ICE_SERVERS);
    callPc=pc;
    localStream.getTracks().forEach(function(t){pc.addTrack(t,localStream)});
    pc.ontrack=onRemoteTrack;
    pc.onicecandidate=function(e){
      if(!e.candidate)return;
      if(activeCallDoc)sendSignal(activeCallDoc.\$id,'ice',e.candidate);
      else pendingLocalIce.push(e.candidate);
    };
    pc.onnegotiationneeded=onNegotiationNeeded;
    const offer=await pc.createOffer();
    await pc.setLocalDescription(offer);
    const name=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'User';
    const avatar=(meProfile&&meProfile.avatar)||'';
    const started=await authPost('/api/calls/start',{calleeId:peerUid,offer:JSON.stringify(offer),callerName:name,callerAvatar:avatar});
    const doc=started.doc;
    activeCallDoc=doc;
    pendingLocalIce.forEach(function(c){sendSignal(doc.\$id,'ice',c)});
    pendingLocalIce=[];
    rebuildMicChain();
    showCallBar(peerName,'Sonne…',new Date(doc.\$createdAt).getTime());
    subscribeCallAnswer(doc.\$id);
    subscribeIceForCall(doc.\$id);
    callTimeoutId=setTimeout(function(){
      // Personne n'a décroché après 1 min : on ne raccroche pas, l'appelant
      // reste seul dans le salon jusqu'à ce que l'autre rejoigne.
      if(activeCallDoc&&activeCallDoc.\$id===doc.\$id){callTimeoutId=null;setCallStatusLabel('En attente…');}
    },60000);
    xlog('call_start',{to:peerUid});
  }catch(e){
    xlog('call_start_fail',{msg:(e&&e.message)||String(e)});
    alert('Impossible de démarrer l\\'appel : '+((e&&e.message)||e));
    cleanupCallLocal();
  }
}

function subscribeCallAnswer(callId){
  const unsub=client.subscribe('databases.'+DB+'.collections.direct_calls.documents.'+callId,async function(res){
    const payload=res.payload;
    if(!payload)return;
    if(eventIs(res.events,'.update')&&payload.status==='accepted'&&payload.answer&&callPc&&!callPc.currentRemoteDescription){
      try{
        await callPc.setRemoteDescription(new RTCSessionDescription(JSON.parse(payload.answer)));
        if(callTimeoutId){clearTimeout(callTimeoutId);callTimeoutId=null;}
        callLive=true;
        setCallStatusLabel('En appel…');
        /* Caméra/partage activés pendant la sonnerie (avant que l'appel soit
           "live") n'ont pas pu être renégociés à ce moment-là (callPc n'avait
           pas encore de description distante) : on rattrape maintenant. */
        if(camSender||screenSender)onNegotiationNeeded();
        broadcastCallState();
      }catch(e){xlog('call_setremote_fail',{msg:(e&&e.message)||String(e)});}
    } else if(['declined','ended','missed'].indexOf(payload.status)>=0||eventIs(res.events,'.delete')){
      endCall('ended',true);
    }
  });
  callUnsubs.push(unsub);
}
function subscribeCallDocLifecycle(callId){
  const unsub=client.subscribe('databases.'+DB+'.collections.direct_calls.documents.'+callId,function(res){
    const payload=res.payload;
    if(eventIs(res.events,'.delete')||(payload&&payload.status==='ended')){
      endCall('ended',true);
    }
  });
  callUnsubs.push(unsub);
}
function subscribeIceForCall(callId){
  const unsub=client.subscribe('databases.'+DB+'.collections.direct_call_ice.documents',async function(res){
    if(!eventIs(res.events,'.create'))return;
    const payload=res.payload;
    if(!payload||String(payload.callId)!==String(callId))return;
    if(String(payload.fromUid)===String(me.\$id))return;
    if(!callPc)return;
    let msg=null;
    try{msg=JSON.parse(payload.candidate);}catch(e){return}
    if(!msg||!msg.kind)return;
    try{
      if(msg.kind==='ice'){
        try{await callPc.addIceCandidate(new RTCIceCandidate(msg.data));}catch(e){if(!ignoreOffer)throw e}
      } else if(msg.kind==='reneg-offer'){
        const offerCollision=(callPc.signalingState!=='stable')||makingOffer;
        ignoreOffer=!isPolite()&&offerCollision;
        xlog('reneg_offer_received',{signalingState:callPc.signalingState,offerCollision:offerCollision,ignored:ignoreOffer});
        if(ignoreOffer)return;
        if(offerCollision){
          await Promise.all([
            callPc.setLocalDescription({type:'rollback'}),
            callPc.setRemoteDescription(new RTCSessionDescription(msg.data))
          ]);
        } else {
          await callPc.setRemoteDescription(new RTCSessionDescription(msg.data));
        }
        const answer=await callPc.createAnswer();
        await callPc.setLocalDescription(answer);
        sendSignal(callId,'reneg-answer',answer);
        xlog('reneg_answer_sent',{});
      } else if(msg.kind==='reneg-answer'){
        xlog('reneg_answer_received',{signalingState:callPc.signalingState});
        if(callPc.signalingState==='have-local-offer'){
          await callPc.setRemoteDescription(new RTCSessionDescription(msg.data));
        }
        flushLocalMetaQueue();
      } else if(msg.kind==='video-meta'){
        const mid=msg.data&&msg.data.mid,type=msg.data&&msg.data.type;
        if(mid==null||!type)return;
        remoteMetaByMid[mid]=type;
        const pend=pendingRemoteTracksByMid[mid];
        if(pend){
          Object.keys(remoteTiles).forEach(function(k){if(remoteTiles[k]&&remoteTiles[k].track===pend.track)remoteTiles[k]=null;});
          remoteTiles[type]={stream:pend.stream,track:pend.track,mid:mid};
          delete pendingRemoteTracksByMid[mid];
          renderVideoGrid();
        }
      } else if(msg.kind==='video-off'){
        const type=msg.data&&msg.data.type;
        if(type&&remoteTiles[type]){
          remoteTiles[type]=null;
          if(type==='screen')screenShareRevealed=false;
          renderVideoGrid();
        }
      } else if(msg.kind==='call-state'){
        remoteMicMuted=!!(msg.data&&msg.data.muted);
        remoteDeafened=!!(msg.data&&msg.data.deafened);
        renderPeerCallState();
      }
    }catch(e){xlog('call_signal_fail',{kind:msg.kind,msg:(e&&e.message)||String(e)});}
  });
  callUnsubs.push(unsub);
}
async function sendSignal(callId,kind,data){
  if(!callPeerUid||!me)return;
  try{
    await authPost('/api/calls/ice',{callId:callId,candidate:JSON.stringify({kind:kind,data:data})});
  }catch(e){xlog('send_signal_fail',{kind:kind,msg:(e&&e.message)||String(e)});}
}
function broadcastCallState(){
  if(!activeCallDoc)return;
  const muted=\$('cb-mute')&&\$('cb-mute').classList.contains('on');
  const deafened=\$('cb-deafen')&&\$('cb-deafen').classList.contains('on');
  sendSignal(activeCallDoc.\$id,'call-state',{muted:!!muted,deafened:!!deafened});
}
function renderPeerCallState(){
  const badges=\$('cb-peer-badges');
  if(badges){
    let html='';
    if(remoteMicMuted)html+='<span class="cb-badge" title="Micro coupé chez '+esc(callPeerName||'')+'">🔇</span>';
    if(remoteDeafened)html+='<span class="cb-badge" title="Casque coupé chez '+esc(callPeerName||'')+'">🎧</span>';
    badges.innerHTML=html;
  }
  renderVideoGrid();
}

function showCallBar(name,label,startedAtMs){
  \$('cb-av').textContent=ini(name||'?');
  \$('cb-av').onclick=function(){if(callPeerUid)openProfileModal(callPeerUid)};
  \$('call-bar').classList.remove('hidden');
  if(startedAtMs)callStartedAt=startedAtMs;
  setCallStatusLabel(label);
  repositionCallPanel();
  renderVideoGrid();
  if(!callTimerId){
    callTimerId=setInterval(function(){renderCallStatus()},1000);
  }
}
function setCallStatusLabel(label){
  currentCallLabel=label||'';
  renderCallStatus();
}
function renderCallStatus(){
  const timeEl=\$('cb-status'),subEl=\$('cb-sub'),nameEl=\$('cb-name');if(!timeEl)return;
  const elapsed=callStartedAt?Math.max(0,Math.floor((Date.now()-callStartedAt)/1000)):0;
  const m=String(Math.floor(elapsed/60)).padStart(2,'0');
  const s=String(elapsed%60).padStart(2,'0');
  timeEl.textContent=m+':'+s;
  subEl.textContent=currentCallLabel;
  const n=callLive?2:1;
  nameEl.textContent='En appel · '+n+' participant'+(n>1?'s':'');
  timeEl.parentElement.classList.toggle('live',currentCallLabel==='En appel…');
  const bar=\$('call-bar');
  if(bar){
    bar.classList.toggle('mood-live',callLive);
    bar.classList.toggle('mood-ringing',!callLive);
  }
}
function cleanupCallLocal(){
  if(callPc){try{callPc.close();}catch(e){}callPc=null;}
  if(localStream){localStream.getTracks().forEach(function(t){t.stop()});localStream=null;}
  if(camStream){camStream.getTracks().forEach(function(t){t.stop()});camStream=null;}
  if(screenStream){screenStream.getTracks().forEach(function(t){t.stop()});screenStream=null;}
  camSender=null;screenSender=null;
  callLive=false;makingOffer=false;ignoreOffer=false;
  callStartedAt=null;currentCallLabel='';
  if(callTimerId){clearInterval(callTimerId);callTimerId=null;}
  if(callTimeoutId){clearTimeout(callTimeoutId);callTimeoutId=null;}
  if(ringSubtitleTimeoutId){clearTimeout(ringSubtitleTimeoutId);ringSubtitleTimeoutId=null;}
  callUnsubAll();
  activeCallDoc=null;incomingCallDoc=null;callPeerUid=null;callPeerName=null;callIsCaller=false;
  remoteTiles={cam:null,screen:null};
  pendingRemoteTracksByMid={};remoteMetaByMid={};localMetaQueue=[];
  remoteMicMuted=false;remoteDeafened=false;screenShareRevealed=false;
  camToggleBusy=false;screenToggleBusy=false;
  if(\$('cb-peer-badges'))\$('cb-peer-badges').innerHTML='';
  if(\$('screen-reveal-pill'))\$('screen-reveal-pill').classList.add('hidden');
  if(cinemaMode)exitCinema();
  videoMasked=false;enlargedTileKey=null;
  Object.keys(videoEls).forEach(function(k){
    const el=videoEls[k];
    if(el.parentElement)el.parentElement.removeChild(el);
    const v=el.querySelector('video');if(v)v.srcObject=null;
  });
  videoEls={};
  \$('call-bar').classList.add('hidden');
  \$('cb-video').classList.add('hidden');
  \$('live-pill').classList.remove('show');
  \$('modal-incoming-call').classList.add('hidden');
  \$('modal-call-settings').classList.add('hidden');
  stopMicMeter();
  if(micAnalyser){try{micAnalyser.disconnect();}catch(e){}micAnalyser=null;}
  if(micSourceNode){try{micSourceNode.disconnect();}catch(e){}micSourceNode=null;}
  if(micGainNode){try{micGainNode.disconnect();}catch(e){}micGainNode=null;}
  micDestNode=null;
  if(outGainNode)outGainNode.gain.value=outVolumePct/100;
  const audioEl=\$('call-remote-audio');if(audioEl){audioEl.srcObject=null;audioEl.muted=false;}
  \$('cb-mute').classList.remove('on');
  \$('cb-cam').classList.remove('on');
  \$('cb-screen').classList.remove('on');
  \$('cb-deafen').classList.remove('on');
  subscribeIncomingCalls();
}
async function endCall(finalStatus,skipRemoteUpdate){
  const doc=activeCallDoc;
  cleanupCallLocal();
  if(doc&&!skipRemoteUpdate){
    try{await db.updateDocument(DB,'direct_calls',doc.\$id,{status:finalStatus||'ended'});}catch(e){}
  }
}

if(\$('btn-call-start'))\$('btn-call-start').addEventListener('click',function(){
  if(activeDmIsGroup){alert('Les appels de groupe arrivent bientôt.');return}
  if(!activeDmPeerUid){alert('Ouvre une conversation directe pour lancer un appel.');return}
  const title=\$('ch-title')?\$('ch-title').textContent:'Appel';
  startCall(activeDmPeerUid,title);
});
if(\$('ic-accept'))\$('ic-accept').addEventListener('click',acceptIncomingCall);
if(\$('ic-decline'))\$('ic-decline').addEventListener('click',declineIncomingCall);
if(\$('cb-hangup'))\$('cb-hangup').addEventListener('click',function(){endCall('ended')});
if(\$('cb-mute'))\$('cb-mute').addEventListener('click',function(){
  if(!localStream)return;
  const tracks=localStream.getAudioTracks();
  if(!tracks.length)return;
  const willMute=tracks[0].enabled;
  tracks.forEach(function(t){t.enabled=!willMute;});
  /* Le sender WebRTC peut porter une piste différente de localStream (voir
     rebuildMicChain, qui la remplace par la sortie du graphe Web Audio) :
     on coupe directement la piste réellement envoyée, pour ne pas dépendre
     de la propagation du silence à travers le graphe. */
  if(callPc){
    callPc.getSenders().forEach(function(s){if(s.track&&s.track.kind==='audio')s.track.enabled=!willMute;});
  }
  this.classList.toggle('on',willMute);
  broadcastCallState();
});
if(\$('cb-cam'))\$('cb-cam').addEventListener('click',toggleCamera);
if(\$('cb-screen'))\$('cb-screen').addEventListener('click',toggleScreenShare);
if(\$('cb-deafen'))\$('cb-deafen').addEventListener('click',function(){
  const deafened=!this.classList.contains('on');
  this.classList.toggle('on',deafened);
  if(outGainNode)outGainNode.gain.value=deafened?0:(outVolumePct/100);
  const a=\$('call-remote-audio');
  if(a)a.muted=deafened;
  broadcastCallState();
});
if(\$('cb-cinema'))\$('cb-cinema').addEventListener('click',function(){
  if(cinemaMode)exitCinema();else enterCinema();
});
if(\$('vstage-exit'))\$('vstage-exit').addEventListener('click',function(){exitCinema();});
if(\$('cb-mask'))\$('cb-mask').addEventListener('click',function(){videoMasked=true;renderVideoGrid();});
if(\$('live-pill'))\$('live-pill').addEventListener('click',function(){videoMasked=false;renderVideoGrid();});

if(\$('cb-settings'))\$('cb-settings').addEventListener('click',function(){
  \$('modal-call-settings').classList.remove('hidden');
  populateMicDevices();
  startMicMeter();
});
if(\$('cs-close'))\$('cs-close').addEventListener('click',function(){
  \$('modal-call-settings').classList.add('hidden');
  stopMicMeter();
});
async function populateMicDevices(){
  const sel=\$('cs-mic-device');if(!sel)return;
  try{
    const devices=await navigator.mediaDevices.enumerateDevices();
    const mics=devices.filter(function(d){return d.kind==='audioinput'});
    sel.innerHTML=mics.map(function(d,i){return '<option value="'+esc(d.deviceId)+'">'+esc(d.label||('Micro '+(i+1)))+'</option>'}).join('');
  }catch(e){}
}
if(\$('cs-mic-device'))\$('cs-mic-device').addEventListener('change',async function(){
  if(!callPc||!localStream)return;
  const deviceId=this.value;if(!deviceId)return;
  try{
    const newStream=await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact:deviceId},echoCancellation:echoCancellationOn,noiseSuppression:noiseSuppressionOn,autoGainControl:agcOn,channelCount:channelMode==='mono'?1:2}});
    const newTrack=newStream.getAudioTracks()[0];
    const oldTrack=localStream.getAudioTracks()[0];
    if(oldTrack){localStream.removeTrack(oldTrack);try{oldTrack.stop();}catch(e){}}
    localStream.addTrack(newTrack);
    rebuildMicChain();
  }catch(e){alert('Changement de micro impossible');}
});
if(\$('cs-mic-vol'))\$('cs-mic-vol').addEventListener('input',function(){
  micVolumePct=parseInt(this.value,10)||0;
  \$('cs-mic-vol-val').textContent=micVolumePct+'%';
  if(micGainNode)micGainNode.gain.value=micVolumePct/100;
});
if(\$('cs-out-vol'))\$('cs-out-vol').addEventListener('input',function(){
  outVolumePct=parseInt(this.value,10)||0;
  \$('cs-out-vol-val').textContent=outVolumePct+'%';
  if(outGainNode&&!\$('cb-deafen').classList.contains('on'))outGainNode.gain.value=outVolumePct/100;
});
document.querySelectorAll('[data-chan]').forEach(function(btn){
  btn.addEventListener('click',function(){
    channelMode=btn.getAttribute('data-chan');
    document.querySelectorAll('[data-chan]').forEach(function(b){b.classList.toggle('on',b===btn)});
    applyChannelMode();
  });
});
function wireSetSwitch(id,setter){
  const el=\$(id);if(!el)return;
  el.addEventListener('click',function(){
    const on=el.getAttribute('data-on')!=='1';
    el.setAttribute('data-on',on?'1':'0');
    el.classList.toggle('on',on);
    setter(on);
  });
}
wireSetSwitch('cs-noise',function(on){
  noiseSuppressionOn=on;
  if(localStream){const t=localStream.getAudioTracks()[0];if(t)t.applyConstraints({noiseSuppression:on}).catch(function(){});}
});
wireSetSwitch('cs-echo',function(on){
  echoCancellationOn=on;
  if(localStream){const t=localStream.getAudioTracks()[0];if(t)t.applyConstraints({echoCancellation:on}).catch(function(){});}
});
wireSetSwitch('cs-agc',function(on){
  agcOn=on;
  if(localStream){const t=localStream.getAudioTracks()[0];if(t)t.applyConstraints({autoGainControl:on}).catch(function(){});}
});
if(\$('cs-mic-record'))\$('cs-mic-record').addEventListener('click',function(){
  if(!localStream){alert('Rejoins un appel pour tester ton micro.');return}
  const btn=this;
  if(btn.disabled)return;
  try{
    const rec=new MediaRecorder(localStream);
    const chunks=[];
    rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
    rec.onstop=function(){
      const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});
      const url=URL.createObjectURL(blob);
      const player=new Audio(url);
      player.play().catch(function(){});
      player.onended=function(){URL.revokeObjectURL(url)};
      btn.disabled=false;btn.textContent='🔴 Écouter ma voix (3s)';
    };
    rec.start();
    btn.disabled=true;btn.textContent='🎙️ Enregistrement…';
    setTimeout(function(){try{rec.stop();}catch(e){}},3000);
  }catch(e){alert('Enregistrement indisponible sur ce navigateur');}
});
if(\$('cs-cam-quality'))\$('cs-cam-quality').addEventListener('change',function(){
  camQualityKey=this.value;
  applyCamQualityLive();
});
if(\$('cs-screen-quality'))\$('cs-screen-quality').addEventListener('change',function(){
  screenQualityKey=this.value;
  applyScreenQualityLive();
});

function boot(){
  xlog('boot_start',{hasStored:!!readSession()});
  waitSdk(async function(){
    xlog('sdk_ready',{});
    const s=readSession();
    if(!s){xlog('boot_no_session',{});return}
    try{
      applySession(s,readStoredJwt());
      await enterApp();
      xlog('boot_restore_ok',{});
    }catch(e){
      xlog('boot_restore_fail',{msg:(e&&e.message)||String(e),authError:!!(e&&e.authError)});
      if(e&&e.authError){try{localStorage.removeItem('xultra_session');}catch(e2){}}
      else{try{\$('auth-err')&&(\$('auth-err').textContent='Connexion au serveur impossible, vérifie ta connexion et réessaie.');}catch(e3){}}
    }
  });
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',boot);
}else{
  boot();
}
</script>
</body>
</html>`;


async function handle(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Appwrite-JWT"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  // === GLOBAL MAINTENANCE (everyone except shaman bypass cookie) ===
  const maintState = await getMaintState();
  if (maintState.enabled) {
    const cookies = request.headers.get("Cookie") || "";
    const hasGate = cookies.split(";").some(function(c) {
      const p = c.trim().split("=");
      return p[0] === "xultra_gate" && p.slice(1).join("=") === MAINT_GATE;
    });
    const gateParam = url.searchParams.get("gate");
    if (gateParam && gateParam === MAINT_GATE) {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": "xultra_gate=" + MAINT_GATE + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000",
          "Cache-Control": "no-store"
        }
      });
    }
    // Allow only the dev-login endpoint during maintenance (no other API)
    if (!hasGate && path === "/api/maint/dev-login" && request.method === "POST") {
      // fall through to handler below
    } else if (!hasGate && path === "/api/maint/status") {
      // public status
    } else if (!hasGate && path === "/api/note" && request.method === "POST") {
      // temporary client diagnostics, allowed even without the gate
    } else if (!hasGate) {
      // Block ALL paths including /api/*
      return new Response(buildMaintHtml(maintState.message), {
        status: 503,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Retry-After": "3600",
          "X-Xultra-Maintenance": "1"
        }
      });
    }
  }


  // === Reverse proxy transparent vers Appwrite Cloud (contourne les réseaux qui ===
  // === bloquent les appels directs du navigateur vers fra.cloud.appwrite.io)   ===
  if (path === "/api/aw" || path.startsWith("/api/aw/")) {
    const sub = path.slice("/api/aw".length) || "/";
    const targetUrl = AW_EP + sub + url.search;
    if ((request.headers.get("Upgrade") || "").toLowerCase() === "websocket") {
      return fetch(targetUrl, request);
    }
    const fwdHeaders = new Headers();
    ["x-appwrite-project", "x-appwrite-session", "x-appwrite-jwt", "content-type", "x-sdk-version", "x-appwrite-response-format", "x-appwrite-id", "content-range"].forEach(function(h) {
      const v = request.headers.get(h);
      if (v) fwdHeaders.set(h, v);
    });
    const init = { method: request.method, headers: fwdHeaders };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
      init.duplex = "half";
    }
    let awRes;
    try {
      awRes = await fetch(targetUrl, init);
    } catch (e) {
      return new Response(JSON.stringify({ message: "Proxy Appwrite indisponible", code: 502 }), {
        status: 502, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    const respHeaders = new Headers();
    ["content-type", "content-length", "cache-control", "content-disposition"].forEach(function(h) {
      const v = awRes.headers.get(h);
      if (v) respHeaders.set(h, v);
    });
    Object.keys(cors).forEach(function(k) { respHeaders.set(k, cors[k]); });
    return new Response(awRes.body, { status: awRes.status, headers: respHeaders });
  }


  // --- Dev login during maintenance (shaman only) ---
  
  if (path === "/api/maint/status") {
    const services = [];
    services.push({ name: "Cloudflare Worker", desc: "Edge xultra.space", state: "ok", label: "OK" });
    try {
      const t0 = Date.now();
      const r = await fetch(AW_EP + "/health", { headers: { "X-Appwrite-Project": AW_PID } });
      const ms = Date.now() - t0;
      const ok = r.status === 200 || r.status === 401;
      services.push({ name: "Appwrite API", desc: "fra.cloud.appwrite.io · " + ms + " ms", state: ok ? "ok" : "bad", label: ok ? "OK" : "DOWN" });
    } catch (e) {
      services.push({ name: "Appwrite API", desc: "fra.cloud.appwrite.io", state: "bad", label: "DOWN" });
    }
    try {
      const t0 = Date.now();
      const r = await fetch(AW_EP + "/databases/" + AW_DB + "/collections/users", {
        headers: { "X-Appwrite-Project": AW_PID, "X-Appwrite-Key": AW_KEY }
      });
      const ms = Date.now() - t0;
      services.push({ name: "Appwrite DB", desc: "Collection users · " + ms + " ms", state: r.ok ? "ok" : "bad", label: r.ok ? "OK" : "DOWN" });
    } catch (e) {
      services.push({ name: "Appwrite DB", desc: "Collection users", state: "bad", label: "DOWN" });
    }
    const maintNow = await getMaintState();
    services.push({ name: "Mode maintenance", desc: "Accès public bloqué", state: "ok", label: maintNow.enabled ? "ACTIF" : "INACTIF" });
    services.push({ name: "Auth / Sessions", desc: "Appwrite Account", state: "ok", label: "OK" });
    services.push({ name: "CDN jsDelivr", desc: "Appwrite SDK", state: "ok", label: "OK" });
    return new Response(JSON.stringify({ ok: true, maintenance: maintNow.enabled, services: services, version: "β2.8.10" }), {
      headers: Object.assign({ "Content-Type": "application/json", "Cache-Control": "no-store" }, cors)
    });
  }

  // Temporary client-side diagnostics: lets the browser report what's actually
  // happening (auth restore failures, click handlers firing, etc.) without the
  // user needing devtools access. Writes are admin-key-authenticated server-side
  // so this works even for a logged-out visitor. Remove once auth is confirmed stable.
  if (path === "/api/note" && request.method === "POST") {
    try {
      const body = await request.json().catch(function(){ return {}; });
      const event = String((body && body.event) || "unknown").slice(0, 64);
      const data = JSON.stringify((body && body.data) || {}).slice(0, 2000);
      const ua = (request.headers.get("User-Agent") || "").slice(0, 300);
      await awFetch("/databases/" + AW_DB + "/collections/6a888afbce317cc9e408/documents", {
        method: "POST",
        body: { documentId: "unique()", data: { event: event, data: data, ua: ua } },
        asAdmin: true
      });
    } catch (e) {}
    return new Response(JSON.stringify({ ok: true }), {
      headers: Object.assign({ "Content-Type": "application/json" }, cors)
    });
  }

  if (path === "/api/maint/dev-login" && request.method === "POST") {
    try {
      const body = await request.json().catch(function(){ return {}; });
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!email || !password) {
        return new Response(JSON.stringify({ ok: false, error: "Email et mot de passe requis" }), {
          status: 400,
          headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      const sessRes = await fetch(AW_EP + "/account/sessions/email", {
        method: "POST",
        headers: {
          "X-Appwrite-Project": AW_PID,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
      });
      const sess = await sessRes.json().catch(function(){ return {}; });
      if (!sessRes.ok) {
        return new Response(JSON.stringify({ ok: false, error: (sess && sess.message) || "Identifiants invalides" }), {
          status: 401,
          headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      const uid = String(sess.userId || sess.user_id || "");
      const allowedEmails = new Set(["lordfamily1@proton.me"]);
      if (!SHAMAN_UIDS.has(uid) && !allowedEmails.has(email)) {
        return new Response(JSON.stringify({ ok: false, error: "Compte non autorisé en maintenance" }), {
          status: 403,
          headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      return new Response(JSON.stringify({ ok: true, uid: uid }), {
        status: 200,
        headers: Object.assign({
          "Content-Type": "application/json",
          "Set-Cookie": "xultra_gate=" + MAINT_GATE + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000"
        }, cors)
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: String(e && e.message || e) }), {
        status: 500,
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }

  
  // --- Friends list (auth or maint gate) ---
  if (path === "/api/friends") {
    try {
      const hasGate = hasValidGate(request);
      const auth = request.headers.get("Authorization") || "";
      const jwt = (auth.match(/Bearer\s+(.+)/i) || [])[1] || request.headers.get("X-Appwrite-JWT") || "";
      const sess = request.headers.get("X-Appwrite-Session") || "";
      let uid = null;
      if (jwt) {
        try {
          const me = await awFetch("/account", { method: "GET", jwt: jwt });
          if (me && me.$id) uid = me.$id;
        } catch (e) {}
      }
      if (!uid && sess) {
        try {
          const me = await awFetch("/account", { method: "GET", session: sess });
          if (me && me.$id) uid = me.$id;
        } catch (e) {}
      }
      // During maintenance, an unauthenticated dev-gate request only ever sees the shaman's own friends list.
      // (No client-supplied uid override here: that would let anyone with the gate cookie read any user's friends.)
      if (!uid && hasGate) uid = "6a7895fc00364d72996f"; // shaman default for dev gate
      if (!uid) {
        return new Response(JSON.stringify({ ok: false, error: "Auth required" }), {
          status: 401,
          headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      const docs = await awFetch("/databases/" + AW_DB + "/collections/ultravoc_friends/documents?limit=100", { asAdmin: true });
      let list = (docs.documents || []).filter(function(d) {
        return String(d.userId) === String(uid);
      });
      // Enrich with user profiles
      const users = await awFetch("/databases/" + AW_DB + "/collections/users/documents?limit=100", { asAdmin: true });
      const byAuth = {};
      (users.documents || []).forEach(function(u) {
        byAuth[String(u.authUserId || u.$id)] = u;
        byAuth[String(u.$id)] = u;
      });
      list = list.map(function(f) {
        const p = byAuth[String(f.friendId)] || {};
        return {
          $id: f.$id,
          userId: f.userId,
          friendId: f.friendId,
          status: f.status || "accepted",
          name: f.name || p.displayName || p.username || "User",
          displayName: p.displayName || f.displayName || f.name || p.username || "User",
          username: p.username || f.username || "",
          avatar: p.avatar || f.avatar || "",
          tag: p.tag || ""
        };
      });
      // Dedupe by friendId
      const seenF = {};
      list = list.filter(function(f) {
        const k = String(f.friendId || "");
        if (!k || seenF[k]) return false;
        seenF[k] = 1;
        return true;
      });
      return new Response(JSON.stringify({ ok: true, friends: list, uid: uid }), {
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: String(e && e.message || e) }), {
        status: 500,
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }

  // --- Members list (auth required, uses API key server-side) ---
  if (path === "/api/members") {
    try {
      // Prefer Authorization JWT or session
      const auth = request.headers.get("Authorization") || "";
      const jwt = (auth.match(/Bearer\s+(.+)/i) || [])[1] || request.headers.get("X-Appwrite-JWT") || "";
      let okUser = false;
      if (jwt) {
        try {
          const me = await awFetch("/account", { method: "GET", jwt: jwt });
          if (me && me.$id) okUser = true;
        } catch (e) {}
      }
      // Also allow maintenance gate cookie (shaman access during maint)
      const hasGate = hasValidGate(request);
      if (!okUser && !hasGate) {
        // try session secret header
        const sess = request.headers.get("X-Appwrite-Session") || "";
        if (sess) {
          try {
            const me = await awFetch("/account", { method: "GET", session: sess });
            if (me && me.$id) okUser = true;
          } catch (e) {}
        }
      }
      if (!okUser && !hasGate) {
        return new Response(JSON.stringify({ ok: false, error: "Auth required" }), {
          status: 401,
          headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      const docs = await awFetch("/databases/" + AW_DB + "/collections/users/documents?limit=100", { asAdmin: true });
      const list = (docs.documents || []).map(function(d) {
        return {
          $id: d.$id,
          authUserId: d.authUserId || d.$id,
          username: d.username || "",
          displayName: d.displayName || d.username || "User",
          avatar: d.avatar || "",
          tag: d.tag || "",
          statusManual: d.statusManual || "offline",
          bio: d.bio || "",
          lastSeen: d.lastSeen || null
        };
      });
      return new Response(JSON.stringify({ ok: true, members: list }), {
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: String(e && e.message || e) }), {
        status: 500,
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }

  // --- Secure admin API (Worker-side, no VPS) ---
  if (path === "/api/admin/access") {
    const gate = await requireStaff(request, "view");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status,
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    return new Response(JSON.stringify({
      ok: true,
      role: gate.role,
      uid: gate.acc.$id,
      name: (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "Staff"
    }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
  }
  if (path === "/api/admin/calls") {
    const gate = await requireStaff(request, "view");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status,
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const calls = await listActiveDmCalls();
      return new Response(JSON.stringify({ ok: true, calls }), {
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500,
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/ban" && request.method === "POST") {
    const gate = await requireStaff(request, "tempban");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const uid = String((body && body.uid) || "");
      const username = String((body && body.username) || "");
      const reason = String((body && body.reason) || "Ban staff").slice(0, 300);
      const type = (body && body.type) === "tempban" ? "tempban" : "ban";
      if (type === "ban" && gate.role !== "owner") {
        return new Response(JSON.stringify({ ok: false, error: "Seul le propriétaire peut bannir définitivement" }), {
          status: 403, headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      if (!uid) throw new Error("uid requis");
      const until = type === "tempban" ? String(Date.now() + 86400000) : "permanent";
      const by = (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "admin";
      const doc = await awFetch("/databases/" + AW_DB + "/collections/bans/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { uid, username, reason, type, by, until } }
      });
      await awFetch("/databases/" + AW_DB + "/collections/admin_logs/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { action: type, detail: username || uid, by, byId: gate.acc.$id, at: new Date().toISOString() } }
      }).catch(function () {});
      return new Response(JSON.stringify({ ok: true, doc }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/bans" && request.method === "GET") {
    const gate = await requireStaff(request, "view");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const q = "/databases/" + AW_DB + "/collections/bans/documents?" +
        "queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [100] }));
      const data = await awFetch(q, { asAdmin: true });
      return new Response(JSON.stringify({ ok: true, bans: data.documents || [] }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/logs" && request.method === "GET") {
    const gate = await requireStaff(request, "view");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const q = "/databases/" + AW_DB + "/collections/admin_logs/documents?" +
        "queries[]=" + encodeURIComponent(JSON.stringify({ method: "orderDesc", attribute: "$createdAt" })) +
        "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [100] }));
      const data = await awFetch(q, { asAdmin: true });
      return new Response(JSON.stringify({ ok: true, logs: data.documents || [] }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/unban" && request.method === "POST") {
    const gate = await requireShaman(request);
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const banId = String((body && body.banId) || "");
      if (!banId) throw new Error("banId requis");
      await awFetch("/databases/" + AW_DB + "/collections/bans/documents/" + banId, { method: "DELETE", asAdmin: true });
      const by = (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "admin";
      await awFetch("/databases/" + AW_DB + "/collections/admin_logs/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { action: "unban", detail: banId, by, byId: gate.acc.$id, at: new Date().toISOString() } }
      }).catch(function () {});
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/mod" && request.method === "POST") {
    const gate = await requireShaman(request);
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const profileId = String((body && body.profileId) || "");
      const isMod = !!(body && body.isMod);
      const targetName = String((body && body.targetName) || "");
      if (!profileId) throw new Error("profileId requis");
      await awFetch("/databases/" + AW_DB + "/collections/users/documents/" + profileId, {
        method: "PATCH", asAdmin: true, body: { data: { isMod } }
      });
      const by = (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "admin";
      await awFetch("/databases/" + AW_DB + "/collections/admin_logs/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { action: isMod ? "grant_mod" : "revoke_mod", detail: targetName || profileId, by, byId: gate.acc.$id, at: new Date().toISOString() } }
      }).catch(function () {});
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/bugstatus" && request.method === "POST") {
    const gate = await requireStaff(request, "bug_status");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const reportId = String((body && body.reportId) || "");
      const status = String((body && body.status) || "");
      if (!reportId || ["pending", "approved", "resolved"].indexOf(status) === -1) throw new Error("paramètres invalides");
      await awFetch("/databases/" + AW_DB + "/collections/bug_reports/documents/" + reportId, {
        method: "PATCH", asAdmin: true, body: { data: { status } }
      });
      const by = (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "admin";
      await awFetch("/databases/" + AW_DB + "/collections/admin_logs/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { action: "bug_status", detail: reportId + " -> " + status, by, byId: gate.acc.$id, at: new Date().toISOString() } }
      }).catch(function () {});
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/report" && request.method === "POST") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const targetUid = String((body && body.targetUid) || "");
      const targetName = String((body && body.targetName) || "").slice(0, 64);
      const reason = String((body && body.reason) || "").slice(0, 32);
      const details = String((body && body.details) || "").slice(0, 1000);
      const validReasons = ["harcelement", "contenu_inapproprie", "spam", "usurpation", "autre"];
      if (!targetUid) throw new Error("targetUid requis");
      if (validReasons.indexOf(reason) === -1) throw new Error("raison invalide");
      if (targetUid === acc.$id) throw new Error("Impossible de se signaler soi-même");
      const profile = await resolveProfile(acc.$id);
      const reporterName = (profile && (profile.displayName || profile.username)) || acc.name || "Anonyme";
      await awFetch("/databases/" + AW_DB + "/collections/reports/documents", {
        method: "POST", asAdmin: true,
        body: {
          documentId: "unique()",
          data: { reporterUid: acc.$id, reporterName, targetUid, targetName, reason, details, status: "pending", at: new Date().toISOString() }
        }
      });
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/reports" && request.method === "GET") {
    const gate = await requireStaff(request, "view");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const q = "/databases/" + AW_DB + "/collections/reports/documents?" +
        "queries[]=" + encodeURIComponent(JSON.stringify({ method: "orderDesc", attribute: "$createdAt" })) +
        "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [100] }));
      const data = await awFetch(q, { asAdmin: true });
      return new Response(JSON.stringify({ ok: true, reports: data.documents || [] }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/reports/status" && request.method === "POST") {
    const gate = await requireStaff(request, "report_status");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const reportId = String((body && body.reportId) || "");
      const status = String((body && body.status) || "");
      if (!reportId || ["pending", "reviewed", "dismissed"].indexOf(status) === -1) throw new Error("paramètres invalides");
      await awFetch("/databases/" + AW_DB + "/collections/reports/documents/" + reportId, {
        method: "PATCH", asAdmin: true, body: { data: { status } }
      });
      const by = (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "admin";
      await awFetch("/databases/" + AW_DB + "/collections/admin_logs/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { action: "report_status", detail: reportId + " -> " + status, by, byId: gate.acc.$id, at: new Date().toISOString() } }
      }).catch(function () {});
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/bugs/upvote" && request.method === "POST") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const reportId = String((body && body.reportId) || "");
      if (!reportId) throw new Error("reportId requis");
      const report = await awFetch("/databases/" + AW_DB + "/collections/bug_reports/documents/" + reportId, { asAdmin: true });
      const doc = await awFetch("/databases/" + AW_DB + "/collections/bug_reports/documents/" + reportId, {
        method: "PATCH", asAdmin: true, body: { data: { upvotes: (Number(report.upvotes) || 0) + 1 } }
      });
      return new Response(JSON.stringify({ ok: true, upvotes: doc.upvotes }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/badges" && request.method === "POST") {
    const gate = await requireShaman(request);
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const authUserId = String((body && body.authUserId) || "");
      const badges = Array.isArray(body && body.badges) ? body.badges.filter(function (b) { return ["base", "dev", "hunter", "early"].indexOf(b) >= 0; }) : [];
      const targetName = String((body && body.targetName) || "");
      if (!authUserId) throw new Error("authUserId requis");
      const badgesJson = JSON.stringify(badges);
      // Locked to admin-key writes only: user_meta documents were created with a
      // self-update permission that would otherwise let anyone grant themselves
      // a badge directly via the client SDK. Every write through this route
      // re-pins the document to read-only-for-everyone-but-admin.
      const lockedPerms = ["read(\"any\")"];
      try {
        await awFetch("/databases/" + AW_DB + "/collections/user_meta/documents/" + authUserId, {
          method: "PATCH", asAdmin: true, body: { data: { badgesJson }, permissions: lockedPerms }
        });
      } catch (e) {
        if (e && e.status === 404) {
          await awFetch("/databases/" + AW_DB + "/collections/user_meta/documents", {
            method: "POST", asAdmin: true,
            body: { documentId: authUserId, data: { badgesJson }, permissions: lockedPerms }
          });
        } else throw e;
      }
      const by = (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "admin";
      await awFetch("/databases/" + AW_DB + "/collections/admin_logs/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { action: "set_badges", detail: (targetName || authUserId) + " -> " + badges.join(","), by, byId: gate.acc.$id, at: new Date().toISOString() } }
      }).catch(function () {});
      return new Response(JSON.stringify({ ok: true, badges }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/notes" && request.method === "GET") {
    const gate = await requireStaff(request, "notes");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const uid = String(url.searchParams.get("uid") || "");
      if (!uid) throw new Error("uid requis");
      const q = "/databases/" + AW_DB + "/collections/admin_notes/documents?" +
        "queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "uid", values: [uid] })) +
        "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [1] }));
      const data = await awFetch(q, { asAdmin: true });
      const note = (data.documents && data.documents[0]) || null;
      return new Response(JSON.stringify({ ok: true, note }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/notes" && request.method === "POST") {
    const gate = await requireStaff(request, "notes");
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const uid = String((body && body.uid) || "");
      const note = String((body && body.note) || "").slice(0, 2000);
      const targetName = String((body && body.targetName) || "");
      if (!uid) throw new Error("uid requis");
      const by = (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "admin";
      const nowIso = new Date().toISOString();
      const q = "/databases/" + AW_DB + "/collections/admin_notes/documents?" +
        "queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "uid", values: [uid] })) +
        "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [1] }));
      const existing = await awFetch(q, { asAdmin: true });
      const doc = (existing.documents && existing.documents[0]) || null;
      if (doc) {
        await awFetch("/databases/" + AW_DB + "/collections/admin_notes/documents/" + doc.$id, {
          method: "PATCH", asAdmin: true, body: { data: { note, updatedBy: by, updatedAt: nowIso } }
        });
      } else {
        await awFetch("/databases/" + AW_DB + "/collections/admin_notes/documents", {
          method: "POST", asAdmin: true,
          body: { documentId: "unique()", data: { uid, note, updatedBy: by, updatedAt: nowIso } }
        });
      }
      await awFetch("/databases/" + AW_DB + "/collections/admin_logs/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { action: "note", detail: targetName || uid, by, byId: gate.acc.$id, at: nowIso } }
      }).catch(function () {});
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/admin/maintenance" && request.method === "GET") {
    const gate = await requireShaman(request);
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    const state = await getMaintState();
    return new Response(JSON.stringify({ ok: true, enabled: state.enabled, message: state.message || DEFAULT_MAINT_MESSAGE }), {
      headers: Object.assign({ "Content-Type": "application/json" }, cors)
    });
  }
  if (path === "/api/admin/maintenance" && request.method === "POST") {
    const gate = await requireShaman(request);
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      if (typeof SITE_KV === "undefined" || !SITE_KV) throw new Error("Stockage de configuration indisponible");
      const body = await request.json();
      const enabled = !!(body && body.enabled);
      const message = String((body && body.message) || "").slice(0, 2000);
      await SITE_KV.put("maint_enabled", enabled ? "1" : "0");
      await SITE_KV.put("maint_message", message);
      const by = (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "admin";
      await awFetch("/databases/" + AW_DB + "/collections/admin_logs/documents", {
        method: "POST", asAdmin: true,
        body: { documentId: "unique()", data: { action: enabled ? "maintenance_on" : "maintenance_off", detail: message.slice(0, 100), by, byId: gate.acc.$id, at: new Date().toISOString() } }
      }).catch(function () {});
      return new Response(JSON.stringify({ ok: true, enabled, message }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }

  // --- Voice call signaling (any authenticated user) ---
  // A plain client session cannot grant document permissions to another user's
  // role (Appwrite blocks that as an anti-privilege-escalation guard), so the
  // very first document of each call/ICE exchange has to be created here with
  // the admin key, scoped to exactly the two participants. Every later update
  // (accept, decline, hangup) is a normal client SDK call on a document the
  // caller already holds update rights on, so it doesn't need a route.
  if (path === "/api/calls/start" && request.method === "POST") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const calleeId = String((body && body.calleeId) || "");
      const offer = String((body && body.offer) || "");
      const callerName = String((body && body.callerName) || acc.name || "User").slice(0, 120);
      const callerAvatar = String((body && body.callerAvatar) || "");
      if (!calleeId || !offer || calleeId === acc.$id) throw new Error("paramètres invalides");
      const perms = [
        "read(\"user:" + acc.$id + "\")", "read(\"user:" + calleeId + "\")",
        "update(\"user:" + acc.$id + "\")", "update(\"user:" + calleeId + "\")",
        "delete(\"user:" + acc.$id + "\")", "delete(\"user:" + calleeId + "\")"
      ];
      const doc = await awFetch("/databases/" + AW_DB + "/collections/direct_calls/documents", {
        method: "POST", asAdmin: true,
        body: {
          documentId: "unique()",
          data: { callerId: acc.$id, calleeId, callerName, callerAvatar, status: "ringing", offer, answer: "" },
          permissions: perms
        }
      });
      try {
        await pushToUid(calleeId, {
          type: "call", title: callerName, body: "Appel vocal entrant…",
          tag: "call-" + doc.$id, url: "/", callId: doc.$id
        });
      } catch (e2) {}
      return new Response(JSON.stringify({ ok: true, doc }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/calls/ice" && request.method === "POST") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const callId = String((body && body.callId) || "");
      const candidate = String((body && body.candidate) || "");
      if (!callId || !candidate) throw new Error("paramètres invalides");
      const call = await awFetch("/databases/" + AW_DB + "/collections/direct_calls/documents/" + callId, { asAdmin: true });
      const callerId = String(call.callerId || "");
      const calleeId = String(call.calleeId || "");
      if (acc.$id !== callerId && acc.$id !== calleeId) {
        return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
          status: 403, headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      const perms = [
        "read(\"user:" + callerId + "\")", "read(\"user:" + calleeId + "\")",
        "update(\"user:" + callerId + "\")", "update(\"user:" + calleeId + "\")",
        "delete(\"user:" + callerId + "\")", "delete(\"user:" + calleeId + "\")"
      ];
      const doc = await awFetch("/databases/" + AW_DB + "/collections/direct_call_ice/documents", {
        method: "POST", asAdmin: true,
        body: {
          documentId: "unique()",
          data: { callId, fromUid: acc.$id, candidate },
          permissions: perms
        }
      });
      return new Response(JSON.stringify({ ok: true, doc }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }

  if (path === "/api/dm/delete" && request.method === "POST") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const threadId = String((body && body.threadId) || "");
      if (!threadId) throw new Error("threadId manquant");
      const dm = await awFetch("/databases/" + AW_DB + "/collections/dms/documents/" + threadId, { asAdmin: true });
      const members = (dm.members || []).map(String);
      if (members.indexOf(acc.$id) < 0) {
        return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
          status: 403, headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      let cursor = null;
      for (let page = 0; page < 200; page++) {
        const queries = [
          JSON.stringify({ method: "equal", attribute: "threadId", values: [threadId] }),
          JSON.stringify({ method: "limit", values: [100] })
        ];
        if (cursor) queries.push(JSON.stringify({ method: "cursorAfter", values: [cursor] }));
        const qs = queries.map(function(q) { return "queries[]=" + encodeURIComponent(q); }).join("&");
        const listed = await awFetch("/databases/" + AW_DB + "/collections/dms_messages/documents?" + qs, { asAdmin: true });
        const docs = listed.documents || [];
        if (!docs.length) break;
        for (const d of docs) {
          await awFetch("/databases/" + AW_DB + "/collections/dms_messages/documents/" + d.$id, { method: "DELETE", asAdmin: true }).catch(function(){});
        }
        cursor = docs[docs.length - 1].$id;
        if (docs.length < 100) break;
      }
      await awFetch("/databases/" + AW_DB + "/collections/dms/documents/" + threadId, { method: "DELETE", asAdmin: true });
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }

  if (path === "/api/status" && request.method === "GET") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    const checks = [];
    async function timeIt(name, fn) {
      const t0 = Date.now();
      try { const info = await fn(); checks.push({ name, ok: true, ms: Date.now() - t0, info: info || undefined }); }
      catch (e) { checks.push({ name, ok: false, ms: Date.now() - t0, info: (e && e.message) || "erreur" }); }
    }
    checks.push({ name: "Worker Cloudflare (API)", ok: true, ms: 0 });
    await timeIt("Base de données Appwrite", async function () { await awFetch("/databases/" + AW_DB, { asAdmin: true }); });
    await timeIt("Stockage fichiers (bucket)", async function () { await awFetch("/storage/buckets/ultravoc_media", { asAdmin: true }); });
    await timeIt("Authentification (comptes)", async function () {
      const q = "queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [1] }));
      await awFetch("/users?" + q, { asAdmin: true });
    });
    await timeIt("Réseau Appwrite Cloud (DNS + TLS)", async function () { await awFetch("/health", { asAdmin: true }); });
    let kvOk = true, kvInfo;
    try {
      if (typeof SITE_KV === "undefined" || !SITE_KV) throw new Error("non lié");
      await SITE_KV.get("maint_enabled");
    } catch (e) { kvOk = false; kvInfo = (e && e.message) || "erreur"; }
    checks.push({ name: "Stockage clé-valeur (KV config)", ok: kvOk, info: kvInfo, ms: undefined });
    let maintOk = true, maintInfo = "désactivé";
    try { const m = await getMaintState(); maintInfo = m.enabled ? "ACTIVÉ" : "désactivé"; }
    catch (e) { maintOk = null; maintInfo = "inconnu"; }
    checks.push({ name: "Mode maintenance", ok: maintInfo === "désactivé" ? true : null, info: maintInfo });
    checks.push({ name: "Notifications push (VAPID)", ok: !!VAPID_PUBLIC_KEY });
    checks.push({ name: "Anti-bot (Turnstile)", ok: typeof TURNSTILE_SECRET_KEY !== "undefined" && !!TURNSTILE_SECRET_KEY });
    checks.push({ name: "Proxy realtime + REST (/api/aw)", ok: true, info: "route active" });
    return new Response(JSON.stringify({ ok: true, checks, ts: new Date().toISOString() }), {
      headers: Object.assign({ "Content-Type": "application/json", "Cache-Control": "no-store" }, cors)
    });
  }

  if (path === "/api/push/vapid-key") {
    return new Response(JSON.stringify({ ok: true, key: VAPID_PUBLIC_KEY }), {
      headers: Object.assign({ "Content-Type": "application/json", "Cache-Control": "no-store" }, cors)
    });
  }
  if (path === "/api/turnstile/verify" && request.method === "POST") {
    try {
      const secretKey = typeof TURNSTILE_SECRET_KEY !== "undefined" ? TURNSTILE_SECRET_KEY : null;
      if (!secretKey) throw new Error("Turnstile non configuré");
      const body = await request.json();
      const token = String((body && body.token) || "");
      if (!token) throw new Error("token requis");
      const ip = request.headers.get("CF-Connecting-IP") || "";
      const form = new URLSearchParams();
      form.set("secret", secretKey);
      form.set("response", token);
      if (ip) form.set("remoteip", ip);
      const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
      const d = await r.json();
      return new Response(JSON.stringify({ ok: !!d.success }), {
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/push/subscribe" && request.method === "POST") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const sub = (body && body.subscription) || {};
      const endpoint = String(sub.endpoint || "");
      const keys = sub.keys || {};
      const p256dh = String(keys.p256dh || "");
      const authKey = String(keys.auth || "");
      const ua = (request.headers.get("User-Agent") || "").slice(0, 300);
      if (!endpoint || !p256dh || !authKey) throw new Error("abonnement invalide");
      const existingUrl = "/databases/" + AW_DB + "/collections/push_subs/documents?" +
        "queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "uid", values: [acc.$id] })) +
        "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [20] }));
      const existing = await awFetch(existingUrl, { asAdmin: true });
      const dup = ((existing && existing.documents) || []).find(function (d) { return d.endpoint === endpoint; });
      const perms = ["read(\"user:" + acc.$id + "\")", "update(\"user:" + acc.$id + "\")", "delete(\"user:" + acc.$id + "\")"];
      if (dup) {
        await awFetch("/databases/" + AW_DB + "/collections/push_subs/documents/" + dup.$id, {
          method: "PATCH", asAdmin: true, body: { data: { p256dh: p256dh, auth: authKey, ua: ua } }
        });
      } else {
        await awFetch("/databases/" + AW_DB + "/collections/push_subs/documents", {
          method: "POST", asAdmin: true,
          body: { documentId: "unique()", data: { uid: acc.$id, endpoint: endpoint, p256dh: p256dh, auth: authKey, ua: ua }, permissions: perms }
        });
      }
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/push/unsubscribe" && request.method === "POST") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const endpoint = String((body && body.endpoint) || "");
      const url = "/databases/" + AW_DB + "/collections/push_subs/documents?" +
        "queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "uid", values: [acc.$id] })) +
        "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [20] }));
      const existing = await awFetch(url, { asAdmin: true });
      const docs = ((existing && existing.documents) || []).filter(function (d) { return !endpoint || d.endpoint === endpoint; });
      await Promise.all(docs.map(function (d) {
        return awFetch("/databases/" + AW_DB + "/collections/push_subs/documents/" + d.$id, { method: "DELETE", asAdmin: true }).catch(function () {});
      }));
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/api/push/notify" && request.method === "POST") {
    const acc = await resolveSessionUser(request);
    if (!acc) {
      return new Response(JSON.stringify({ ok: false, error: "auth_required" }), {
        status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    try {
      const body = await request.json();
      const type = String((body && body.type) || "");
      const toUid = String((body && body.toUid) || "");
      if (!toUid || toUid === acc.$id) throw new Error("paramètres invalides");
      const senderName = (await resolveProfile(acc.$id) || {}).displayName || acc.name || "Quelqu'un";
      if (type === "message") {
        const threadId = String((body && body.threadId) || "");
        if (!threadId) throw new Error("paramètres invalides");
        let thread = null;
        try { thread = await awFetch("/databases/" + AW_DB + "/collections/dms/documents/" + threadId, { asAdmin: true }); } catch (e3) {}
        const members = ((thread && thread.members) || []).map(String);
        if (members.indexOf(acc.$id) < 0 || members.indexOf(toUid) < 0) {
          return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
            status: 403, headers: Object.assign({ "Content-Type": "application/json" }, cors)
          });
        }
        const preview = String((body && body.preview) || "").slice(0, 140);
        await pushToUid(toUid, { type: "message", title: senderName, body: preview || "Nouveau message", tag: "dm-" + threadId, url: "/", threadId: threadId });
      } else if (type === "friend_request") {
        const fUrl = "/databases/" + AW_DB + "/collections/ultravoc_friends/documents?" +
          "queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "userId", values: [toUid] })) +
          "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "friendId", values: [acc.$id] })) +
          "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "equal", attribute: "status", values: ["pending_in"] })) +
          "&queries[]=" + encodeURIComponent(JSON.stringify({ method: "limit", values: [1] }));
        const fReq = await awFetch(fUrl, { asAdmin: true });
        if (!((fReq && fReq.documents) || []).length) {
          return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
            status: 403, headers: Object.assign({ "Content-Type": "application/json" }, cors)
          });
        }
        await pushToUid(toUid, { type: "friend_request", title: senderName, body: "T'a envoyé une demande d'ami", tag: "friend-" + acc.$id, url: "/" });
      } else {
        throw new Error("type inconnu");
      }
      return new Response(JSON.stringify({ ok: true }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: (e && e.message) || "error" }), {
        status: 500, headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
  }
  if (path === "/sw.js") {
    return new Response(SW_JS, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-cache", "Service-Worker-Allowed": "/" } });
  }

  if (path === "/api/auth/login" && request.method === "POST") {
    try {
      const body = await request.json();
      const email = String((body && body.email) || "").trim();
      const password = String((body && body.password) || "");
      if (!email || !password) {
        return new Response(JSON.stringify({ ok: false, error: "Email et mot de passe requis" }), {
          status: 400, headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      const data = await awFetch("/account/sessions/email", {
        method: "POST",
        body: { email: email, password: password },
        asAdmin: true
      });
      const secret = data.secret || null;
      const sessionId = data.$id || null;
      const userId = data.userId || null;
      let jwt = null;
      // Create JWT bound to this session for client use
      if (secret) {
        try {
          const jwtRes = await awFetch("/account/jwts", {
            method: "POST",
            body: {},
            headers: { "X-Appwrite-Session": secret }
          });
          jwt = (jwtRes && (jwtRes.jwt || jwtRes.$id)) || null;
        } catch (eJwt) {
          try {
            // alternate: JWT with session header via asAdmin + userId is not valid; ignore
          } catch (e2) {}
        }
      }
      const cookieHeaders = Object.assign({ "Content-Type": "application/json" }, cors);
      if (secret) {
        cookieHeaders["Set-Cookie"] = "xultra_aw_session=" + encodeURIComponent(secret) + "; Path=/; Max-Age=31536000; SameSite=Lax; Secure";
      }
      return new Response(JSON.stringify({
        ok: true,
        secret: secret,
        jwt: jwt,
        sessionId: sessionId,
        userId: userId,
        expire: data.expire || null
      }), { headers: cookieHeaders });
    } catch (e) {
      return new Response(JSON.stringify({
        ok: false,
        error: (e && e.message) || "Identifiants invalides"
      }), { status: 401, headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    }
  }

  if (path === "/api/auth/me" && request.method === "POST") {
    try {
      const body = await request.json();
      const secret = (body && body.session) ? String(body.session) : null;
      const jwt = (body && body.jwt) ? String(body.jwt) : null;
      if (!secret && !jwt) {
        return new Response(JSON.stringify({ ok: false, error: "Session manquante" }), {
          status: 400, headers: Object.assign({ "Content-Type": "application/json" }, cors)
        });
      }
      const acc = await awFetch("/account", {
        headers: secret ? { "X-Appwrite-Session": secret } : { "X-Appwrite-JWT": jwt }
      });
      return new Response(JSON.stringify({ ok: true, account: acc }), {
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    } catch (e) {
      return new Response(JSON.stringify({
        ok: false,
        error: (e && e.message) || "Session invalide",
        status: (e && e.status) || 401
      }), { status: (e && e.status) || 401, headers: Object.assign({ "Content-Type": "application/json" }, cors) });
    }
  }


  if (path === "/api/health") {
    const cf = request.cf || {};
    return new Response(JSON.stringify({
      ok: true,
      ver: "β2.8.10",
      ts: Date.now(),
      services: {
        worker: "ok",
        edge: "cloudflare",
        colo: cf.colo || null,
        country: cf.country || null,
        city: cf.city || null,
        asOrganization: cf.asOrganization || null,
        httpProtocol: cf.httpProtocol || null,
        tlsVersion: cf.tlsVersion || null,
        region: cf.region || cf.colo || "auto"
      }
    }), {
      headers: Object.assign({ "Content-Type": "application/json" }, cors)
    });
  }
  if (path === "/api/ip") {
    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
    const country = (request.cf && request.cf.country) || "";
    const city = (request.cf && request.cf.city) || "";
    return new Response(JSON.stringify({ ip, country, city }), {
      headers: Object.assign({ "Content-Type": "application/json" }, cors)
    });
  }
  if (path === "/api/gifs") {
    const q = (url.searchParams.get("q") || "funny").slice(0, 64);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10) || 20, 30);
    let results = [];
    try {
      const tenorUrl = "https://g.tenor.com/v1/search?q=" + encodeURIComponent(q) + "&key=LIVDSRZULELA&limit=" + limit + "&media_filter=minimal";
      const r = await fetch(tenorUrl, { headers: { "Accept": "application/json" } });
      if (r.ok) {
        const d = await r.json();
        results = (d.results || []).map(function(g) {
          try {
            const m = g.media && g.media[0];
            const u = (m && m.tinygif && m.tinygif.url) || (m && m.gif && m.gif.url) || null;
            return u ? { url: u, id: String(g.id || "") } : null;
          } catch (e) { return null; }
        }).filter(Boolean);
      }
    } catch (e) {}
    if (!results.length) {
      try {
        const giphyUrl = "https://api.giphy.com/v1/gifs/search?api_key=hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My&q=" + encodeURIComponent(q) + "&limit=" + limit + "&rating=pg-13";
        const r = await fetch(giphyUrl);
        if (r.ok) {
          const d = await r.json();
          results = (d.data || []).map(function(g) {
            const u = g.images && ((g.images.fixed_height && g.images.fixed_height.url) || (g.images.original && g.images.original.url));
            return u ? { url: u, id: String(g.id || "") } : null;
          }).filter(Boolean);
        }
      } catch (e) {}
    }
    return new Response(JSON.stringify({ results: results, q: q }), {
      headers: Object.assign({ "Content-Type": "application/json", "Cache-Control": "public, max-age=300" }, cors)
    });
  }
  return new Response(APP, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(self), microphone=(self), geolocation=(self), payment=()",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "X-DNS-Prefetch-Control": "off",
      "X-Xultra-Version": "β2.8.10"
    }
  });
}
