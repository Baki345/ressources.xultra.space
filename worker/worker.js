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
.card{
  position:relative;z-index:1;width:min(380px,100%);max-height:92dvh;overflow-y:auto;
  background:rgba(17,10,26,.72);backdrop-filter:blur(20px) saturate(150%);-webkit-backdrop-filter:blur(20px) saturate(150%);
  border:1px solid rgba(167,139,250,.22);border-radius:20px;padding:24px 22px;
  box-shadow:0 26px 70px rgba(0,0,0,.5),0 0 0 1px rgba(124,58,237,.08) inset;
}
.logo{font-size:1.9rem;font-weight:900;text-align:center;letter-spacing:.04em;background:linear-gradient(135deg,#ede9fe,#a78bfa,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent}
.logo-sub{text-align:center;color:#9a8fb0;font-size:.8rem;margin:4px 0 16px}
.tabs{display:flex;gap:4px;background:rgba(0,0,0,.25);padding:4px;border-radius:12px;margin-bottom:14px}
.tabs button{flex:1;padding:9px;border-radius:9px;font-weight:700;font-size:.9rem;color:#9a8fb0;transition:background .15s,color .15s}
.tabs button.on{background:#7c3aed;color:#fff}
.field{margin-bottom:11px}
.field label{display:block;font-size:.68rem;font-weight:700;color:#9a8fb0;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.field input{width:100%;height:42px;border-radius:11px;border:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.25);color:#f2ebff;padding:0 14px;outline:0;transition:border-color .15s}
.field input:focus{border-color:#8b5cf6}
.remember-row{display:flex;align-items:center;gap:10px;margin:12px 0 4px;cursor:pointer;user-select:none}
.remember-row input{flex-shrink:0;width:18px;height:18px;accent-color:#7c3aed;cursor:pointer}
.remember-row span{color:#c4b5fd;font-size:.88rem;font-weight:600}
.pw-strength{margin:-3px 0 11px}
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
.hint{text-align:center;color:#9a8fb0;font-size:.7rem;margin-top:12px}
.reg-preview{display:flex;align-items:center;gap:12px;padding:11px;border-radius:16px;margin-bottom:14px;background:linear-gradient(135deg,rgba(124,58,237,.16),rgba(167,139,250,.06));border:1px solid rgba(167,139,250,.18)}
.reg-preview .rp-av{width:50px;height:50px;border-radius:50%;flex-shrink:0;overflow:hidden;display:grid;place-items:center;font-weight:900;font-size:1.05rem;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed);cursor:pointer;position:relative;box-shadow:0 4px 14px rgba(124,58,237,.35)}
.reg-preview .rp-av img{width:100%;height:100%;object-fit:cover}
.reg-preview .rp-meta{min-width:0;flex:1}
.reg-preview .rp-name{font-weight:800;font-size:.95rem;color:#f3e8ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.reg-preview .rp-tag{font-size:.72rem;color:#9a8fb0;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.color-swatches{display:flex;gap:8px;padding-top:2px}
.color-swatches button{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;flex-shrink:0;transition:transform .12s,border-color .12s}
.color-swatches button:hover{transform:scale(1.12)}
.color-swatches button.on{border-color:#fff;box-shadow:0 0 0 2px #7c3aed}
.hp-field{position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
.turnstile-wrap{margin:10px 0 4px;display:flex;justify-content:center;min-height:0}
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
.row .av{width:36px;height:36px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:.85rem;overflow:hidden}
.row .av img{width:100%;height:100%;object-fit:cover}
.row .info{flex:1;min-width:0}
.row .info .n{font-weight:700;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row .info .p{font-size:.72rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row .act{display:flex;gap:4px;flex-shrink:0}
.row .act button{height:26px;padding:0 8px;border-radius:6px;font-size:.7rem;font-weight:700;background:#7c3aed;color:#fff}
.row .act button.rej{background:rgba(255,255,255,.08);color:#f2ebff}
.userbar{flex-shrink:0;display:flex;align-items:center;gap:9px;margin:8px;padding:8px 9px;border-radius:14px;background:linear-gradient(135deg,rgba(124,58,237,.14),rgba(20,13,32,.6));border:1px solid rgba(167,139,250,.16)}
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
.chat-top{height:52px;padding:0 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line);flex-shrink:0}
.chat-top .av{width:30px;height:30px;border-radius:50%;background:var(--elev);display:grid;place-items:center;font-weight:800;font-size:.8rem;overflow:hidden}
.chat-top .t{font-weight:800;font-size:.9rem}
.chat-back{display:none;flex-shrink:0}
.msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
.msg{display:flex;gap:10px;max-width:80%}
.msg.mine{align-self:flex-end;flex-direction:row-reverse}
.msg .av{width:30px;height:30px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:.75rem;overflow:hidden}
.msg .bub{background:var(--elev);border-radius:12px;padding:8px 12px;font-size:.85rem;line-height:1.4;word-break:break-word;white-space:pre-wrap}
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
.vm-play{width:30px;height:30px;border-radius:50%;background:rgba(167,139,250,.25);color:#c4b5fd;font-size:.75rem;flex-shrink:0;display:grid;place-items:center}
.msg.mine .vm-play{background:rgba(255,255,255,.18);color:#fff}
.vm-wave{flex:1;display:flex;align-items:center;gap:2px;height:24px}
.vm-bar{flex:1;min-width:2px;max-width:3px;border-radius:2px;background:rgba(167,139,250,.35)}
.msg.mine .vm-bar{background:rgba(255,255,255,.35)}
.vm-bar.played{background:#a78bfa}
.msg.mine .vm-bar.played{background:#fff}
.vm-dur{font-size:.68rem;color:var(--muted);flex-shrink:0}
.msg.mine .vm-dur{color:rgba(255,255,255,.7)}
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
.call-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:3000;padding:12px 14px;border-radius:16px;background:linear-gradient(160deg,rgba(30,18,48,.97),rgba(15,9,25,.98));backdrop-filter:blur(14px);border:1px solid rgba(167,139,250,.25);box-shadow:0 12px 40px rgba(0,0,0,.5);max-width:420px;margin:0 auto}
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
.cb-controls{display:flex;gap:6px;margin-top:12px}
.cb-ctl{flex:1;height:38px;border-radius:10px;background:var(--elev);color:#f2ebff;font-size:1rem;display:grid;place-items:center}
.cb-ctl:hover{background:var(--hover)}
.cb-ctl.on{background:rgba(124,58,237,.4);color:#e9d5ff}
.cb-ctl.hangup{flex:1.6;background:rgba(239,68,68,.22);color:#fca5a5;font-size:.8rem;font-weight:800}
.cb-ctl.hangup:hover{background:rgba(239,68,68,.32)}
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
.vtile{position:relative;border-radius:10px;overflow:hidden;background:#000;cursor:pointer;min-height:0}
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
.settings-modal{width:min(400px,100%);max-height:88dvh;overflow-y:auto;text-align:left}
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
  <div id="auth" class="card">
    <div class="logo">XULTRA</div>
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
      <button type="submit" class="btn-main" id="btn-login">Entrer</button>
    </form>
    <form id="pane-register" class="hidden" autocomplete="on">
      <div class="reg-preview">
        <div class="rp-av" id="rp-av" title="Choisir un avatar">?</div>
        <div class="rp-meta">
          <div class="rp-name" id="rp-name">Nouveau membre</div>
          <div class="rp-tag" id="rp-tag">@pseudo#····</div>
        </div>
      </div>
      <input type="file" id="reg-file-av" accept="image/*" class="hidden"/>
      <div class="field"><label>Pseudo</label><input id="in-user" maxlength="24" autocomplete="username"/></div>
      <div class="field"><label>Email</label><input id="in-email2" type="email" name="email" autocomplete="username"/></div>
      <div class="field"><label>Mot de passe</label><input id="in-pass2" type="password" name="new-password" minlength="8" autocomplete="new-password"/></div>
      <div class="pw-strength" id="pw-strength">
        <div class="pw-strength-track"><div class="pw-strength-fill" id="pw-strength-fill"></div></div>
        <div class="pw-strength-row"><span class="pw-strength-emoji" id="pw-strength-emoji">😐</span><span class="pw-strength-label" id="pw-strength-label">Mot de passe</span></div>
      </div>
      <div class="field"><label>Confirmer le mot de passe</label><input id="in-pass2-confirm" type="password" name="confirm-password" autocomplete="new-password"/></div>
      <div class="field">
        <label>Couleur du profil</label>
        <div class="color-swatches" id="reg-swatches">
          <button type="button" data-c="#7c3aed" class="on" style="background:#7c3aed" aria-label="Violet"></button>
          <button type="button" data-c="#a78bfa" style="background:#a78bfa" aria-label="Mauve"></button>
          <button type="button" data-c="#c026d3" style="background:#c026d3" aria-label="Magenta"></button>
          <button type="button" data-c="#0ea5e9" style="background:#0ea5e9" aria-label="Bleu"></button>
          <button type="button" data-c="#22c55e" style="background:#22c55e" aria-label="Vert"></button>
          <button type="button" data-c="#f59e0b" style="background:#f59e0b" aria-label="Ambre"></button>
        </div>
      </div>
      <input type="text" id="in-hp" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true"/>
      <div class="turnstile-wrap" id="turnstile-wrap"></div>
      <button type="submit" class="btn-main" id="btn-register">Créer mon compte</button>
    </form>
    <div class="err" id="auth-err"></div>
    <p class="hint">β3.0 — étape 1 : connexion</p>
  </div>
</div>

<div id="app" class="hidden">
  <nav class="rail">
    <button type="button" class="rail-btn on" id="nav-dms" data-view="dms" title="Messages">💬</button>
    <button type="button" class="rail-btn" id="nav-friends" data-view="friends" title="Amis">👥<span class="rail-badge hidden rail-friends-badge">0</span></button>
    <button type="button" class="rail-btn" id="nav-members" data-view="members" title="Membres">🌐</button>
    <button type="button" class="rail-btn hidden admin-nav-btn" id="nav-admin" data-view="admin" title="Admin">🛡️</button>
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
        <button type="button" class="icon-btn" id="btn-add-friend">👤+</button>
      </div>
    </div>
    <div class="list-body" id="list-body"></div>
    <div class="userbar">
      <div class="av" id="ub-av">?</div>
      <div class="meta"><div class="n" id="ub-name">—</div><div class="s" id="ub-status">En ligne</div></div>
      <button type="button" class="ub-btn" id="ub-bell" title="Demandes d'amis">🔔<span class="ub-badge hidden" id="ub-bell-badge">0</span></button>
      <button type="button" class="ub-btn" id="ub-push" title="Activer les notifications">🔕</button>
      <button type="button" class="ub-btn hidden" id="ub-hunter" title="Panneau Bug Hunter">🐛</button>
      <button type="button" class="ub-btn" id="btn-report-bug" title="Signaler un bug">🐞</button>
      <button type="button" class="ub-btn" id="btn-logout" title="Déconnexion"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg></button>
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
        <div class="titles"><div class="t" id="ch-title">—</div></div>
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
        <button type="button" class="admin-subtab on" data-atab="members">Membres</button>
        <button type="button" class="admin-subtab" data-atab="bans">Bannis</button>
        <button type="button" class="admin-subtab" data-atab="bugs">Bugs</button>
        <button type="button" class="admin-subtab" data-atab="calls">Appels</button>
        <button type="button" class="admin-subtab" data-atab="logs">Logs</button>
        <button type="button" class="admin-subtab" data-atab="maintenance">Maintenance</button>
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
    <div class="pm-banner" id="pm-banner"></div>
    <div class="pm-av" id="pm-av">?</div>
    <div class="pm-body">
      <h3 id="pm-name">—</h3>
      <div class="pm-tag" id="pm-tag">#0000</div>
      <div class="pm-grade" id="pm-grade">membre</div>
      <div class="pm-badges" id="pm-badges"></div>
      <button type="button" class="btn-main" id="pm-message">Message</button>
      <div class="pm-section">
        <div class="pm-section-label">Bio</div>
        <div class="pm-section-body" id="pm-bio">—</div>
      </div>
      <div class="pm-section">
        <div class="pm-section-label">Membre depuis</div>
        <div class="pm-section-body" id="pm-since">—</div>
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
      <div class="cb-name" id="cb-name">En appel · 1 participant</div>
      <div class="cb-status"><span class="cb-dot"></span><span id="cb-status">00:00</span> · <span id="cb-sub">Sonne…</span></div>
    </div>
    <button type="button" class="cb-gear" id="cb-settings" title="Paramètres audio/vidéo">⚙️</button>
  </div>
  <div class="cb-controls">
    <button type="button" class="cb-ctl" id="cb-mute" title="Muet">🎤</button>
    <button type="button" class="cb-ctl" id="cb-deafen" title="Assourdir">🎧</button>
    <button type="button" class="cb-ctl" id="cb-cam" title="Caméra">📷</button>
    <button type="button" class="cb-ctl" id="cb-screen" title="Partager l'écran">🖥️</button>
    <button type="button" class="cb-ctl hangup" id="cb-hangup" title="Raccrocher">Quitter</button>
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
  <audio id="call-remote-audio" autoplay playsinline></audio>
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
let client=null, account=null, db=null, storage=null, sdkReady=false;
function ensureSdk(){
  if(sdkReady)return true;
  if(typeof Appwrite==='undefined')return false;
  const A=Appwrite;
  client=new A.Client().setEndpoint(EP).setProject(PID);
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
</script>
<script>
xlog('page_loaded',{ready:document.readyState});

function showErrTxt(msg){if(\$('auth-err'))\$('auth-err').textContent=msg||''}

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
      if(reg){regShownAt=Date.now();updateRegPreview();renderTurnstile();}
    }catch(e){xlog('tab_click_error',{msg:(e&&e.message)||String(e)});}
  });
});

let regShownAt=Date.now();
let regAvatarFile=null, regAvatarUrl='';

/* ===== Turnstile anti-bot (inscription) ===== */
const TURNSTILE_SITE_KEY='';
let turnstileWidgetId=null;
function renderTurnstile(){
  const wrap=\$('turnstile-wrap');if(!wrap)return;
  if(!TURNSTILE_SITE_KEY){wrap.classList.add('hidden');return}
  wrap.classList.remove('hidden');
  if(turnstileWidgetId!=null||typeof turnstile==='undefined')return;
  try{turnstileWidgetId=turnstile.render(wrap,{sitekey:TURNSTILE_SITE_KEY,theme:'dark'});}catch(e){}
}
if(TURNSTILE_SITE_KEY){
  const tsScript=document.createElement('script');
  tsScript.src='https://challenges.cloudflare.com/turnstile/v0/api.js';
  tsScript.async=true;tsScript.defer=true;
  tsScript.onload=renderTurnstile;
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
  const swOn=document.querySelector('#reg-swatches button.on');
  const c=(swOn&&swOn.dataset.c)||'#7c3aed';
  if(\$('rp-name'))\$('rp-name').textContent=n;
  if(\$('rp-tag'))\$('rp-tag').textContent='@'+slugUsername(n)+'#····';
  const av=\$('rp-av');
  if(av){
    av.innerHTML=regAvatarUrl?('<img src="'+esc(regAvatarUrl)+'" alt=""/>'):esc(ini(n));
    av.style.background='linear-gradient(135deg,'+c+',#4c1d95)';
  }
}
if(\$('in-user'))\$('in-user').addEventListener('input',updateRegPreview);
if(\$('reg-swatches')){
  \$('reg-swatches').querySelectorAll('button').forEach(function(b){
    b.addEventListener('click',function(e){
      e.preventDefault();
      \$('reg-swatches').querySelectorAll('button').forEach(function(x){x.classList.remove('on')});
      b.classList.add('on');
      updateRegPreview();
    });
  });
}
if(\$('rp-av'))\$('rp-av').addEventListener('click',function(){if(\$('reg-file-av'))\$('reg-file-av').click()});
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

async function serverLogin(email,pass){
  const rr=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,password:pass})});
  const jj=await rr.json().catch(function(){return {}});
  if(rr.ok&&jj&&jj.ok&&jj.secret)return jj;
  throw new Error((jj&&jj.error)||('Connexion refusée ('+rr.status+')'));
}
function applySession(secret){
  try{client.setSession(String(secret));}catch(e){}
  try{localStorage.setItem('xultra_session',String(secret));}catch(e){}
}
function readSession(){
  try{return localStorage.getItem('xultra_session');}catch(e){return null}
}

let me=null, meProfile=null;
async function enterApp(){
  xlog('show_dash_start',{});
  let acc=null;
  try{acc=await account.get();}catch(e){xlog('dash_account_fail',{msg:(e&&e.message)||String(e)});throw e}
  let profile=null;
  try{
    const r=await db.listDocuments(DB,'users',[Appwrite.Query.equal('authUserId',acc.\$id),Appwrite.Query.limit(1)]);
    profile=(r.documents&&r.documents[0])||null;
  }catch(e){xlog('dash_profile_fail',{msg:(e&&e.message)||String(e)});}
  me=acc;meProfile=profile;
  const name=(profile&&(profile.displayName||profile.username))||acc.name||acc.email||'Compte';
  \$('ub-name').textContent=name;
  const av=\$('ub-av');
  if(profile&&profile.avatar&&/^https?:/i.test(profile.avatar)){av.innerHTML='<img src="'+esc(profile.avatar)+'" alt=""/><span class="dot"></span>';}
  else{av.innerHTML=esc(ini(name))+'<span class="dot"></span>';}
  \$('auth').classList.add('hidden');
  \$('stage').classList.add('hidden');
  \$('app').classList.remove('hidden');
  xlog('show_dash_ok',{uid:acc.\$id,hasProfile:!!profile});
  try{await loadFriends();}catch(e){xlog('friends_init_fail',{msg:(e&&e.message)||String(e)});}
  try{await loadDms();}catch(e){xlog('dms_init_fail',{msg:(e&&e.message)||String(e)});}
  try{await checkAdmin();}catch(e){xlog('admin_check_fail',{msg:(e&&e.message)||String(e)});}
  try{await refreshHunterEligibility();}catch(e){xlog('hunter_check_fail',{msg:(e&&e.message)||String(e)});}
  try{subscribeIncomingCalls();}catch(e){xlog('call_listen_fail',{msg:(e&&e.message)||String(e)});}
  try{await checkPendingIncomingCall();}catch(e){xlog('call_pending_check_fail',{msg:(e&&e.message)||String(e)});}
  try{await registerServiceWorker();await refreshPushButtonState();}catch(e){xlog('push_init_fail',{msg:(e&&e.message)||String(e)});}
  showView('dms');
}

async function doLogin(){
  xlog('login_click',{});
  showErrTxt('');
  const email=((\$('in-email')&&\$('in-email').value)||'').trim();
  const pass=(\$('in-pass')&&\$('in-pass').value)||'';
  if(!email||!pass){showErrTxt('Email et mot de passe requis');return}
  if(!ensureSdk()){showErrTxt('SDK non chargé, réessaie dans un instant');return}
  \$('btn-login').disabled=true;\$('btn-login').textContent='Connexion…';
  try{
    const jj=await serverLogin(email,pass);
    applySession(jj.secret);
    xlog('login_server_ok',{});
    await enterApp();
  }catch(e){
    xlog('login_fail',{msg:(e&&e.message)||String(e)});
    showErrTxt((e&&e.message)||'Connexion impossible');
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
  const passConfirm=(\$('in-pass2-confirm')&&\$('in-pass2-confirm').value)||'';
  const swOn=document.querySelector('#reg-swatches button.on');
  const accent=(swOn&&swOn.dataset.c)||'#7c3aed';
  showErrTxt('');
  if(!name||name.length<2){showErrTxt('Pseudo trop court');return}
  if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$/.test(email)){showErrTxt('Email invalide');return}
  if(pass.length<8){showErrTxt('Mot de passe : 8 caractères minimum');return}
  if(pass!==passConfirm){showErrTxt('Les mots de passe ne correspondent pas');return}
  if(!ensureSdk()){showErrTxt('SDK non chargé, réessaie dans un instant');return}
  if(TURNSTILE_SITE_KEY){
    const tsToken=(typeof turnstile!=='undefined'&&turnstileWidgetId!=null)?turnstile.getResponse(turnstileWidgetId):'';
    if(!tsToken){showErrTxt('Merci de valider la vérification anti-robot');return}
    try{
      const tv=await fetch('/api/turnstile/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:tsToken})});
      const tvj=await tv.json().catch(function(){return {ok:false}});
      if(!tv.ok||!tvj.ok){showErrTxt('Vérification anti-robot échouée, réessaie');if(typeof turnstile!=='undefined'&&turnstileWidgetId!=null)turnstile.reset(turnstileWidgetId);return}
    }catch(e){showErrTxt('Vérification anti-robot indisponible, réessaie');return}
  }
  \$('btn-register').disabled=true;\$('btn-register').textContent='Création…';
  try{
    await account.create(Appwrite.ID.unique(),email,pass,name);
    const jj=await serverLogin(email,pass);
    applySession(jj.secret);
    xlog('register_session_ok',{});
    let avatarUrl='';
    if(regAvatarFile){
      try{const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),regAvatarFile,[Appwrite.Permission.read(Appwrite.Role.any())]);avatarUrl=EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;}catch(e){}
    }
    const acc=await account.get();
    const tag=String(Math.floor(1000+Math.random()*9000));
    const uname=slugUsername(name);
    const doc={authUserId:acc.\$id,email:acc.email||email,username:uname,baseUsername:uname,tag:tag,displayName:name,bio:'',avatar:avatarUrl,bgColor:accent,btnColor:accent,statusManual:'online'};
    try{await db.createDocument(DB,'users',Appwrite.ID.unique(),doc);}
    catch(e){await db.createDocument(DB,'users',Appwrite.ID.unique(),{authUserId:acc.\$id,email:acc.email||email,username:uname,displayName:name,tag:tag});}
    xlog('register_success',{uid:acc.\$id});
    await enterApp();
  }catch(e){
    xlog('register_fail',{msg:(e&&e.message)||String(e)});
    showErrTxt((e&&e.message)||'Inscription impossible');
  }
  \$('btn-register').disabled=false;\$('btn-register').textContent='Créer mon compte';
}

if(\$('pane-login'))\$('pane-login').addEventListener('submit',function(e){e.preventDefault();doLogin();});
if(\$('pane-register'))\$('pane-register').addEventListener('submit',function(e){e.preventDefault();doRegister();});
if(\$('btn-logout'))\$('btn-logout').addEventListener('click',async function(){
  xlog('logout_click',{});
  try{if(ensureSdk())await account.deleteSession('current');}catch(e){}
  try{localStorage.removeItem('xultra_session');}catch(e){}
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
  app.classList.remove('chat-open');
  if(v==='dms')renderDms();
  else if(v==='friends')renderFriends();
  else{loadMembers().then(renderMembers).catch(function(e){xlog('members_load_fail',{msg:(e&&e.message)||String(e)})});}
  repositionCallPanel();
}
document.querySelectorAll('.rail-btn').forEach(function(b){
  b.addEventListener('click',function(){
    try{showView(b.getAttribute('data-view'));}
    catch(e){xlog('nav_error',{msg:(e&&e.message)||String(e)});}
  });
});

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

let membersCache=[], memberMetaByUid={};
async function loadMembers(){
  const r=await db.listDocuments(DB,'users',[Appwrite.Query.limit(100)]);
  membersCache=r.documents||[];
  try{
    const m=await db.listDocuments(DB,'user_meta',[Appwrite.Query.limit(100)]);
    memberMetaByUid={};
    (m.documents||[]).forEach(function(d){memberMetaByUid[d.\$id]=d});
  }catch(e){memberMetaByUid={}}
  return membersCache;
}
function rowAvatar(p,name,uid){
  const av=p&&p.avatar;
  if(av&&/^https?:/i.test(av))return '<div class="av" data-uid="'+esc(uid)+'"><img src="'+esc(av)+'" alt=""/></div>';
  return '<div class="av" data-uid="'+esc(uid)+'">'+esc(ini(name))+'</div>';
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
async function loadFriends(){
  if(!me)return[];
  const r=await db.listDocuments(DB,'ultravoc_friends',[Appwrite.Query.equal('userId',me.\$id),Appwrite.Query.limit(100)]);
  friendsCache=r.documents||[];
  updateFriendBadge();
  return friendsCache;
}
function updateFriendBadge(){
  const n=friendsCache.filter(function(f){return f.status==='pending_in'}).length;
  document.querySelectorAll('.rail-friends-badge').forEach(function(el){
    el.textContent=n>9?'9+':String(n);
    el.classList.toggle('hidden',n===0);
  });
  const bell=\$('ub-bell-badge');
  if(bell){bell.textContent=n>9?'9+':String(n);bell.classList.toggle('hidden',n===0);}
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
      return '<div class="row" data-profile="'+esc(f.friendId)+'">'
        +'<div class="av">'+esc(ini(f.name||'?'))+'</div>'
        +'<div class="info"><div class="n">'+esc(f.name||'Ami')+'</div></div></div>';
    }).join('');
  }
  box.innerHTML=h;
  box.querySelectorAll('[data-profile]').forEach(function(el){
    el.style.cursor='pointer';
    el.onclick=function(e){e.stopPropagation();openProfileModal(el.getAttribute('data-profile'))};
  });
  box.querySelectorAll('[data-accept]').forEach(function(el){
    el.onclick=async function(){
      try{
        await db.updateDocument(DB,'ultravoc_friends',el.getAttribute('data-accept'),{status:'accepted'});
        const fromUid=el.getAttribute('data-from'),fname=el.getAttribute('data-fname');
        const mine=friendsCache.find(function(f){return f.friendId===fromUid&&f.status==='pending_out'});
        if(mine){await db.updateDocument(DB,'ultravoc_friends',mine.\$id,{status:'accepted'});}
        else{await db.createDocument(DB,'ultravoc_friends',Appwrite.ID.unique(),{userId:fromUid,friendId:me.\$id,status:'accepted',name:(meProfile&&(meProfile.displayName||meProfile.username))||'Ami'});}
        await loadFriends();renderFriends();
      }catch(e){xlog('friend_accept_fail',{msg:(e&&e.message)||String(e)});}
    };
  });
  box.querySelectorAll('[data-reject]').forEach(function(el){
    el.onclick=async function(){
      try{await db.deleteDocument(DB,'ultravoc_friends',el.getAttribute('data-reject'));await loadFriends();renderFriends();}
      catch(e){xlog('friend_reject_fail',{msg:(e&&e.message)||String(e)});}
    };
  });
}
async function sendFriendRequest(targetUid,targetName){
  if(!me||!targetUid||targetUid===me.\$id)return;
  const myName=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'Quelqu\\'un';
  try{
    await db.createDocument(DB,'ultravoc_friends',Appwrite.ID.unique(),{userId:me.\$id,friendId:targetUid,status:'pending_out',name:targetName||'Ami'});
    try{await db.createDocument(DB,'ultravoc_friends',Appwrite.ID.unique(),{userId:targetUid,friendId:me.\$id,status:'pending_in',name:myName});}catch(e){}
    authPost('/api/push/notify',{type:'friend_request',toUid:targetUid}).catch(function(){});
    xlog('friend_request_sent',{to:targetUid});
    return true;
  }catch(e){xlog('friend_request_fail',{msg:(e&&e.message)||String(e)});throw e}
}

let dmsCache=[];
function dmPeerId(dm){
  const members=(dm.members||[]).map(String);
  return members.find(function(m){return m!==me.\$id})||'';
}
async function loadDms(){
  if(!me)return[];
  const r=await db.listDocuments(DB,'dms',[Appwrite.Query.limit(100)]);
  dmsCache=(r.documents||[]).filter(function(d){return (d.members||[]).map(String).indexOf(me.\$id)>=0});
  return dmsCache;
}
function renderDms(){
  const box=\$('list-body');if(!box)return;
  \$('list-sub-txt').textContent=dmsCache.length+' conversation'+(dmsCache.length!==1?'s':'');
  if(!dmsCache.length){box.innerHTML='<div class="empty-hint">Aucune conversation. Ouvre l\\'onglet Amis pour en démarrer une.</div>';return}
  box.innerHTML=dmsCache.map(function(d){
    const title=d.displayName||'Conversation';
    return '<div class="row" data-dm="'+esc(d.\$id)+'" data-title="'+esc(title)+'">'
      +'<div class="av" data-profile="'+esc(dmPeerId(d))+'">'+esc(ini(title))+'</div>'
      +'<div class="info"><div class="n">'+esc(title)+'</div><div class="p">'+esc(d.lastMessage||'')+'</div></div></div>';
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
  \$('pm-name').textContent=name;
  \$('pm-tag').textContent='#'+esc(p.tag||'');
  \$('pm-grade').textContent=BADGE_DEFS[primaryBadge(badges)].label.toLowerCase();
  const banner=\$('pm-banner');
  banner.style.backgroundImage=(p.bg&&/^https?:/i.test(p.bg))?('url("'+p.bg.replace(/"/g,'')+'")'):'';
  banner.classList.toggle('has-img',!!(p.bg&&/^https?:/i.test(p.bg)));
  const av=\$('pm-av');
  if(p.avatar&&/^https?:/i.test(p.avatar))av.innerHTML='<img src="'+esc(p.avatar)+'" alt=""/>';
  else av.textContent=ini(name);
  \$('pm-badges').innerHTML=badgeChipsHtml(badges);
  wireBadgeChips(\$('pm-badges'));
  \$('pm-bio').textContent=p.bio||'Aucune bio';
  const since=p.createdAt||p.\$createdAt;
  \$('pm-since').textContent=since?new Date(since).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'—';
  const msgBtn=\$('pm-message');
  const isSelf=me&&uid===me.\$id;
  msgBtn.classList.toggle('hidden',!!isSelf);
  msgBtn.onclick=function(){\$('modal-profile').classList.add('hidden');startDmWith(uid,name);};
  \$('modal-profile').classList.remove('hidden');
}
if(\$('pm-close'))\$('pm-close').addEventListener('click',function(){\$('modal-profile').classList.add('hidden')});
if(\$('modal-profile'))\$('modal-profile').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden')});

let activeDm=null, activeDmPeerUid=null, msgsCache=[];
async function openDm(threadId,title,peerUid){
  activeDm=threadId;
  activeDmPeerUid=peerUid||null;
  \$('chat-empty').classList.add('hidden');
  \$('chat-active').classList.remove('hidden');
  \$('ch-title').textContent=title||'Conversation';
  \$('ch-av').textContent=ini(title||'?');
  const openPeerProfile=peerUid?function(){openProfileModal(peerUid)}:null;
  \$('ch-av').style.cursor=openPeerProfile?'pointer':'';
  \$('ch-av').onclick=openPeerProfile;
  \$('ch-title').style.cursor=openPeerProfile?'pointer':'';
  \$('ch-title').onclick=openPeerProfile;
  document.getElementById('app').classList.add('chat-open');
  repositionCallPanel();
  await loadMessages(threadId);
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
    msgsCache=(r.documents||[]).slice().reverse();
  }catch(e){xlog('load_msgs_fail',{msg:(e&&e.message)||String(e)});msgsCache=[];}
  renderMessages();
}
function safeUrl(u){return /^https?:\\/\\//i.test(String(u||''))?String(u):''}
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
function renderMsgBody(m){
  const t=m.type||'text';
  const url=safeUrl(m.mediaUrl);
  if(t==='image'&&url)return '<div class="msg-media"><img src="'+esc(url)+'" loading="lazy"/></div>'+(m.text?'<div class="msg-caption">'+linkify(esc(m.text))+'</div>':'');
  if(t==='video'&&url)return '<div class="msg-media"><video src="'+esc(url)+'" controls playsinline></video></div>';
  if(t==='gif'&&url)return '<div class="msg-media"><img src="'+esc(url)+'" loading="lazy"/></div>';
  if(t==='file'&&url){
    let meta={};try{meta=JSON.parse(m.text||'{}');}catch(e){}
    return '<a class="msg-file" href="'+esc(url)+'" target="_blank" rel="noopener"><span>📄</span><div class="mf-info"><div class="mf-name">'+esc(meta.name||'Fichier')+'</div><div class="mf-size">'+esc(fmtSize(meta.size))+'</div></div></a>';
  }
  if(t==='audio'&&url){
    let meta={};try{meta=JSON.parse(m.text||'{}');}catch(e){}
    return '<div class="voice-msg" data-src="'+esc(url)+'" data-mid="'+esc(m.\$id||'')+'"><button type="button" class="vm-play">▶</button><div class="vm-wave"></div><div class="vm-dur">'+esc(fmtDur(meta.duration))+'</div></div>';
  }
  if(t==='location'){
    let meta={};try{meta=JSON.parse(m.text||'{}');}catch(e){}
    if(meta.lat!=null&&meta.lng!=null){
      const mapUrl='https://www.google.com/maps?q='+encodeURIComponent(meta.lat+','+meta.lng);
      return '<a class="msg-location" href="'+esc(mapUrl)+'" target="_blank" rel="noopener">📍 Position partagée<span>Ouvrir dans Maps</span></a>';
    }
  }
  return linkify(esc(m.text||''));
}
function initVoiceMsgPlayer(el){
  if(el.dataset.wired)return;
  el.dataset.wired='1';
  const src=el.getAttribute('data-src');
  const mid=el.getAttribute('data-mid')||'x';
  const playBtn=el.querySelector('.vm-play');
  const waveEl=el.querySelector('.vm-wave');
  const durEl=el.querySelector('.vm-dur');
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
    return '<div class="msg'+(mine?' mine':'')+'"><div class="av" data-profile="'+esc(m.uid||'')+'">'+esc(ini(name))+'</div>'
      +'<div><div class="bub">'+renderMsgBody(m)+'</div><div class="meta">'+esc(mine?'':name)+'</div></div></div>';
  }).join('');
  box.querySelectorAll('[data-profile]').forEach(function(el){
    el.style.cursor='pointer';
    el.onclick=function(e){e.stopPropagation();openProfileModal(el.getAttribute('data-profile'))};
  });
  box.querySelectorAll('.msg-media img').forEach(function(el){
    el.addEventListener('click',function(){window.open(el.src,'_blank')});
  });
  box.querySelectorAll('.voice-msg').forEach(initVoiceMsgPlayer);
  box.scrollTop=box.scrollHeight;
}
async function postMessage(data,lastMessagePreview){
  if(!activeDm||!me)return;
  const name=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'User';
  await db.createDocument(DB,'dms_messages',Appwrite.ID.unique(),Object.assign({threadId:activeDm,uid:me.\$id,displayName:name,text:'',type:'text',mediaUrl:''},data));
  try{await db.updateDocument(DB,'dms',activeDm,{lastMessage:lastMessagePreview.slice(0,100)});}catch(e){}
  if(activeDmPeerUid)authPost('/api/push/notify',{type:'message',toUid:activeDmPeerUid,threadId:activeDm,preview:lastMessagePreview.slice(0,140)}).catch(function(){});
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
    await postMessage({text:text.slice(0,2000),type:'text'},text);
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
    const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),file,[Appwrite.Permission.read(Appwrite.Role.any())]);
    const fileUrl=EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;
    const data={type:type,mediaUrl:fileUrl};
    let preview='📎 Pièce jointe';
    if(type==='image'){preview='📷 Photo';}
    else if(type==='video'){preview='🎬 Vidéo';}
    else{data.text=JSON.stringify({name:file.name,size:file.size,mime:file.type});preview='📄 '+file.name;}
    await postMessage(data,preview);
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
    const file=new File([blob],'voice-'+Date.now()+'.'+ext,{type:mimeType});
    const up=await storage.createFile(BUCKET,Appwrite.ID.unique(),file,[Appwrite.Permission.read(Appwrite.Role.any())]);
    const fileUrl=EP+'/storage/buckets/'+BUCKET+'/files/'+up.\$id+'/view?project='+PID;
    await postMessage({type:'audio',mediaUrl:fileUrl,text:JSON.stringify({duration:durationMs/1000})},'🎤 Message vocal');
  }catch(e){alert('Envoi du message vocal impossible : '+((e&&e.message)||e));xlog('voice_send_fail',{msg:(e&&e.message)||String(e)});}
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

let isAdmin=false, adminTab='members';
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
  }catch(e){isAdmin=false}
  document.querySelectorAll('.admin-nav-btn').forEach(function(b){b.classList.toggle('hidden',!isAdmin)});
  xlog('admin_check',{isAdmin:isAdmin});
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
  if(tab==='members')loadAdminMembers().then(renderAdminMembers).catch(adminErr);
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

async function loadAdminMembers(){
  if(!membersCache.length)await loadMembers();
  return membersCache;
}
const TOGGLEABLE_BADGES=['dev','hunter','early'];
function renderAdminMembers(list){
  const box=\$('admin-body');if(!box)return;
  if(!list.length){box.innerHTML='<div class="empty-hint">Aucun membre.</div>';return}
  box.innerHTML=list.map(function(p){
    const name=p.displayName||p.username||'User';
    const uid=p.authUserId||p.\$id;
    const self=uid===(me&&me.\$id);
    const modTag=p.isMod?'<span class="tag-mod">MOD</span>':'';
    const badges=parseBadges(memberMetaByUid[uid]);
    const badgeBtns=TOGGLEABLE_BADGES.map(function(b){
      const on=badges.indexOf(b)>=0;
      return '<button type="button" data-badgetoggle="'+b+'" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'" class="'+(on?'ok':'')+'" title="'+esc(BADGE_DEFS[b].label)+'">'+BADGE_DEFS[b].icon+(on?' ✓':'')+'</button>';
    }).join('');
    return '<div class="admin-row" style="align-items:flex-start;flex-wrap:wrap">'
      +'<span data-profile="'+esc(uid)+'" style="display:contents;cursor:pointer">'+rowAvatar(p,name,uid)+'</span>'
      +'<div class="info"><div class="n" data-profile="'+esc(uid)+'" style="cursor:pointer">'+esc(name)+modTag+'</div><div class="p">@'+esc(p.username||'')+(p.tag?('#'+esc(p.tag)):'')+'</div>'
      +'<div class="acts" style="margin-top:6px">'+badgeBtns+'</div></div>'
      +(self?'':'<div class="acts">'
        +'<button type="button" data-modtoggle="'+esc(p.\$id)+'" data-mod="'+(p.isMod?'1':'0')+'" data-name="'+esc(name)+'" class="ok">'+(p.isMod?'Retirer modo':'Rendre modo')+'</button>'
        +'<button type="button" data-tban="'+esc(uid)+'" data-name="'+esc(name)+'">Temp ban 24h</button>'
        +'<button type="button" data-ban="'+esc(uid)+'" data-name="'+esc(name)+'" class="danger">Ban</button>'
        +'</div>')
      +'</div>';
  }).join('');
  box.querySelectorAll('[data-profile]').forEach(function(el){
    el.onclick=function(e){e.stopPropagation();openProfileModal(el.getAttribute('data-profile'))};
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
        membersCache=[];await loadAdminMembers().then(renderAdminMembers);
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

async function loadAdminBans(){
  const r=await db.listDocuments(DB,'bans',[Appwrite.Query.limit(100)]);
  return r.documents||[];
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
  const r=await db.listDocuments(DB,'admin_logs',[Appwrite.Query.orderDesc('\$createdAt'),Appwrite.Query.limit(100)]);
  return r.documents||[];
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
  \$('modal-bug').classList.remove('hidden');
}
if(\$('btn-report-bug'))\$('btn-report-bug').addEventListener('click',function(){openBugModal(null)});
if(\$('mb-close'))\$('mb-close').addEventListener('click',function(){\$('modal-bug').classList.add('hidden')});
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
      alert('Merci ! Ton rapport a été envoyé à l\\'équipe.');
    }
    editBugId=null;
    \$('modal-bug').classList.add('hidden');
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
let videoMasked=false, cinemaMode=false, enlargedTileKey=null, videoEls={};
let camQualityKey='720p30', screenQualityKey='1080p60';
let micVolumePct=100, outVolumePct=100;
let noiseSuppressionOn=true, echoCancellationOn=true, agcOn=true, channelMode='mono';
let audioCtx=null;
let micSourceNode=null, micGainNode=null, micDestNode=null, micAnalyser=null, micMeterRaf=null;
let outSourceNode=null, outGainNode=null, outPanner=null, outLfo=null, outLfoGain=null, outConnected=false;
function isPolite(){return !callIsCaller}

function ensureAudioCtx(){
  if(audioCtx)return audioCtx;
  try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){audioCtx=null;}
  return audioCtx;
}
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
  if(camStream)tiles.push({key:'local-cam',stream:camStream,label:'Toi · Caméra',isLocal:true});
  if(screenStream)tiles.push({key:'local-screen',stream:screenStream,label:'Toi · Écran',isLocal:true});
  if(remoteTiles.cam)tiles.push({key:'remote-cam',stream:remoteTiles.cam.stream,label:(callPeerName||'Correspondant')+' · Caméra',isLocal:false});
  if(remoteTiles.screen)tiles.push({key:'remote-screen',stream:remoteTiles.screen.stream,label:(callPeerName||'Correspondant')+' · Écran',isLocal:false});
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
  const cbv=\$('cb-video');if(cbv)cbv.classList.toggle('hidden',!hasVideo||videoMasked);
  const camActive=!!camStream||!!remoteTiles.cam;
  const screenActive=!!screenStream||!!remoteTiles.screen;
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
  if(!callLive||!activeCallDoc||!callPc)return;
  try{
    makingOffer=true;
    await callPc.setLocalDescription();
    sendSignal(activeCallDoc.\$id,'reneg-offer',callPc.localDescription);
    flushLocalMetaQueue();
  }catch(e){xlog('call_reneg_fail',{msg:(e&&e.message)||String(e)});}
  finally{makingOffer=false;}
}
async function toggleCamera(){
  if(!callPc||!callLive)return;
  if(camSender){
    try{callPc.removeTrack(camSender);}catch(e){}
    camSender=null;
    if(camStream){camStream.getTracks().forEach(function(t){t.stop()});camStream=null;}
    \$('cb-cam').classList.remove('on');
    if(enlargedTileKey==='local-cam')enlargedTileKey=null;
    renderVideoGrid();
    return;
  }
  try{
    const q=AV_QUALITY[camQualityKey]||AV_QUALITY['720p30'];
    camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:q.w},height:{ideal:q.h},frameRate:{ideal:q.fps}}});
    const track=camStream.getVideoTracks()[0];
    camSender=callPc.addTrack(track,camStream);
    localMetaQueue.push({sender:camSender,type:'cam'});
    applyEncodingBitrate(camSender,q.bitrate);
    \$('cb-cam').classList.add('on');
    renderVideoGrid();
  }catch(e){alert('Caméra refusée ou indisponible');}
}
function stopScreenShare(){
  if(screenStream){screenStream.getTracks().forEach(function(t){t.stop()});screenStream=null;}
  if(screenSender){try{callPc.removeTrack(screenSender);}catch(e){}screenSender=null;}
  \$('cb-screen').classList.remove('on');
  if(enlargedTileKey==='local-screen')enlargedTileKey=null;
  renderVideoGrid();
}
async function toggleScreenShare(){
  if(!callPc||!callLive)return;
  if(screenSender){stopScreenShare();return;}
  try{
    const q=AV_QUALITY[screenQualityKey]||AV_QUALITY['1080p60'];
    screenStream=await navigator.mediaDevices.getDisplayMedia({video:{width:{ideal:q.w},height:{ideal:q.h},frameRate:{ideal:q.fps}},audio:false});
    const track=screenStream.getVideoTracks()[0];
    screenSender=callPc.addTrack(track,screenStream);
    localMetaQueue.push({sender:screenSender,type:'screen'});
    applyEncodingBitrate(screenSender,q.bitrate);
    \$('cb-screen').classList.add('on');
    renderVideoGrid();
    track.onended=function(){stopScreenShare();};
  }catch(e){
    if(e&&e.name!=='NotAllowedError')alert('Partage d\\'écran indisponible');
  }
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
  if(doc.callerAvatar&&/^https?:/i.test(doc.callerAvatar))av.innerHTML='<img src="'+esc(doc.callerAvatar)+'" alt=""/>';
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
      } else if(msg.kind==='reneg-answer'){
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
      }
    }catch(e){xlog('call_signal_fail',{kind:msg.kind,msg:(e&&e.message)||String(e)});}
  });
  callUnsubs.push(unsub);
}
async function sendSignal(callId,kind,data){
  if(!callPeerUid||!me)return;
  try{
    await authPost('/api/calls/ice',{callId:callId,candidate:JSON.stringify({kind:kind,data:data})});
  }catch(e){}
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
  this.classList.toggle('on',willMute);
});
if(\$('cb-cam'))\$('cb-cam').addEventListener('click',toggleCamera);
if(\$('cb-screen'))\$('cb-screen').addEventListener('click',toggleScreenShare);
if(\$('cb-deafen'))\$('cb-deafen').addEventListener('click',function(){
  const deafened=!this.classList.contains('on');
  this.classList.toggle('on',deafened);
  if(outGainNode)outGainNode.gain.value=deafened?0:(outVolumePct/100);
  const a=\$('call-remote-audio');
  if(a)a.muted=deafened;
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
      applySession(s);
      await enterApp();
      xlog('boot_restore_ok',{});
    }catch(e){
      xlog('boot_restore_fail',{msg:(e&&e.message)||String(e)});
      try{localStorage.removeItem('xultra_session');}catch(e2){}
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
    const gate = await requireShaman(request);
    if (!gate.ok) {
      return new Response(JSON.stringify({ ok: false, error: gate.error }), {
        status: gate.status,
        headers: Object.assign({ "Content-Type": "application/json" }, cors)
      });
    }
    return new Response(JSON.stringify({
      ok: true,
      role: "shaman",
      uid: gate.acc.$id,
      name: (gate.profile && (gate.profile.displayName || gate.profile.username)) || gate.acc.name || "Shaman"
    }), { headers: Object.assign({ "Content-Type": "application/json" }, cors) });
  }
  if (path === "/api/admin/calls") {
    const gate = await requireShaman(request);
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
    const gate = await requireShaman(request);
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
    const gate = await requireShaman(request);
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
      "Permissions-Policy": "camera=(self), microphone=(self), geolocation=(), payment=()",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "X-DNS-Prefetch-Control": "off",
      "X-Xultra-Version": "β2.8.10"
    }
  });
}
