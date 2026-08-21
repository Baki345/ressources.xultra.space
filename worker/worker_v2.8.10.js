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
.rail-btn{width:44px;height:44px;border-radius:50%;background:var(--elev);display:grid;place-items:center;font-size:1.15rem;transition:border-radius .15s,background .15s}
.rail-btn:hover,.rail-btn.on{border-radius:14px;background:#7c3aed}
.list-col{width:var(--list-w);background:#130c1c;display:flex;flex-direction:column;flex-shrink:0;min-width:0;border-right:1px solid var(--line)}
.list-head{padding:14px 14px 8px}
.list-head h1{font-size:.95rem;font-weight:800;margin-bottom:10px}
.search-row{display:flex;gap:6px}
.search-box{flex:1;min-width:0;height:34px;background:#0d0814;border:1px solid var(--line);border-radius:8px;padding:0 10px;font-size:.82rem;outline:0;color:#f2ebff}
.icon-btn{height:34px;width:34px;border-radius:8px;background:var(--elev);font-size:.9rem;flex-shrink:0}
.icon-btn:hover{background:var(--hover)}
.list-body{flex:1;overflow-y:auto;padding:6px}
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
.userbar{height:56px;flex-shrink:0;display:flex;align-items:center;gap:8px;padding:0 10px;border-top:1px solid var(--line);background:#0f0917}
.userbar .av{width:32px;height:32px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;font-size:.8rem;overflow:hidden}
.userbar .av img{width:100%;height:100%;object-fit:cover}
.userbar .meta{flex:1;min-width:0}
.userbar .n{font-weight:700;font-size:.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.userbar .s{font-size:.68rem;color:var(--online)}
.ub-btn{width:30px;height:30px;border-radius:8px;color:var(--muted);font-size:.9rem;display:grid;place-items:center}
.ub-btn:hover{background:var(--elev);color:#f2ebff}
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
.composer{padding:10px 14px;display:flex;gap:8px;align-items:flex-end;border-top:1px solid var(--line);flex-shrink:0}
.composer textarea{flex:1;background:var(--elev);border:1px solid transparent;border-radius:10px;padding:9px 12px;outline:0;resize:none;max-height:100px;font-size:.85rem;color:#f2ebff}
.composer textarea:focus{border-color:#8b5cf6}
.send-btn{width:38px;height:38px;border-radius:10px;background:#7c3aed;color:#fff;font-size:1rem;flex-shrink:0}
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
.call-btn{margin-left:auto}
.call-modal{text-align:center;width:min(320px,100%)}
.call-ring-av{width:76px;height:76px;border-radius:50%;margin:0 auto 14px;display:grid;place-items:center;font-weight:900;font-size:1.7rem;color:#fff;background:linear-gradient(135deg,#8b5cf6,#7c3aed);overflow:hidden;box-shadow:0 0 0 0 rgba(124,58,237,.5);animation:callPulse 1.6s ease-out infinite}
.call-ring-av img{width:100%;height:100%;object-fit:cover}
@keyframes callPulse{0%{box-shadow:0 0 0 0 rgba(124,58,237,.5)}70%{box-shadow:0 0 0 18px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}
.call-modal h3{font-size:1.1rem;font-weight:800}
.call-sub{color:var(--muted);font-size:.82rem;margin-top:4px}
.call-modal-acts{display:flex;justify-content:center;gap:22px;margin-top:22px}
.call-act{width:52px;height:52px;border-radius:50%;font-size:1.2rem;display:grid;place-items:center}
.call-act.accept{background:#22c55e;color:#052e16}
.call-act.decline{background:#ef4444;color:#450a0a}
.call-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:3000;display:flex;align-items:center;gap:6px;padding:10px 10px;border-radius:14px;background:rgba(21,16,31,.96);backdrop-filter:blur(14px);border:1px solid rgba(167,139,250,.25);box-shadow:0 12px 40px rgba(0,0,0,.5);max-width:420px;margin:0 auto}
.call-bar .av{width:34px;height:34px;border-radius:50%;background:var(--elev);flex-shrink:0;display:grid;place-items:center;font-weight:800;overflow:hidden}
.call-bar .av img{width:100%;height:100%;object-fit:cover}
.call-bar .ub-btn{width:28px;height:28px;font-size:.85rem;flex-shrink:0}
.cb-info{flex:1;min-width:0}
.cb-name{font-weight:700;font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cb-status{font-size:.7rem;color:var(--muted)}
.cb-status.live{color:var(--online)}
#cb-mute.on,#cb-cam.on,#cb-screen.on{background:rgba(124,58,237,.35);color:#e9d5ff}
.call-bar .call-act{width:28px;height:28px;font-size:.85rem}
.call-video-stage{position:fixed;inset:0;z-index:2900;background:#050308;display:flex}
.call-video-stage.hidden{display:none}
#call-remote-video{width:100%;height:100%;object-fit:contain;background:#050308}
#call-local-video{position:absolute;bottom:96px;right:14px;width:110px;height:150px;border-radius:14px;object-fit:cover;background:#0d0814;border:1px solid rgba(167,139,250,.3);box-shadow:0 8px 24px rgba(0,0,0,.5)}
.tabbar{display:none}
@media (max-width:640px){
  #app{flex-direction:column}
  .list-col{width:100%}
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
    <div id="pane-login">
      <div class="field"><label>Email</label><input id="in-email" type="email" autocomplete="email"/></div>
      <div class="field"><label>Mot de passe</label><input id="in-pass" type="password" autocomplete="current-password"/></div>
      <label class="remember-row" for="in-remember">
        <input type="checkbox" id="in-remember" checked/>
        <span>Rester connecté</span>
      </label>
      <button type="button" class="btn-main" id="btn-login">Entrer</button>
    </div>
    <div id="pane-register" class="hidden">
      <div class="reg-preview">
        <div class="rp-av" id="rp-av" title="Choisir un avatar">?</div>
        <div class="rp-meta">
          <div class="rp-name" id="rp-name">Nouveau membre</div>
          <div class="rp-tag" id="rp-tag">@pseudo#····</div>
        </div>
      </div>
      <input type="file" id="reg-file-av" accept="image/*" class="hidden"/>
      <div class="field"><label>Pseudo</label><input id="in-user" maxlength="24" autocomplete="username"/></div>
      <div class="field"><label>Email</label><input id="in-email2" type="email" autocomplete="email"/></div>
      <div class="field"><label>Mot de passe</label><input id="in-pass2" type="password" minlength="8" autocomplete="new-password"/></div>
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
      <button type="button" class="btn-main" id="btn-register">Créer mon compte</button>
    </div>
    <div class="err" id="auth-err"></div>
    <p class="hint">β3.0 — étape 1 : connexion</p>
  </div>
</div>

<div id="app" class="hidden">
  <nav class="rail">
    <button type="button" class="rail-btn on" id="nav-dms" data-view="dms" title="Messages">💬</button>
    <button type="button" class="rail-btn" id="nav-friends" data-view="friends" title="Amis">👥</button>
    <button type="button" class="rail-btn" id="nav-members" data-view="members" title="Membres">🌐</button>
    <button type="button" class="rail-btn hidden admin-nav-btn" id="nav-admin" data-view="admin" title="Admin">🛡️</button>
  </nav>
  <nav class="tabbar">
    <button type="button" class="rail-btn on" data-view="dms" title="Messages">💬</button>
    <button type="button" class="rail-btn" data-view="friends" title="Amis">👥</button>
    <button type="button" class="rail-btn" data-view="members" title="Membres">🌐</button>
    <button type="button" class="rail-btn hidden admin-nav-btn" data-view="admin" title="Admin">🛡️</button>
  </nav>
  <aside class="list-col">
    <div class="list-head">
      <h1 id="list-title">Messages</h1>
      <div class="search-row">
        <input id="search" class="search-box" placeholder="Rechercher" autocomplete="off"/>
        <button type="button" class="icon-btn" id="btn-add-friend">👤+</button>
      </div>
    </div>
    <div class="list-body" id="list-body"></div>
    <div class="userbar">
      <div class="av" id="ub-av">?</div>
      <div class="meta"><div class="n" id="ub-name">—</div><div class="s" id="ub-status">En ligne</div></div>
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
      <div class="msgs" id="msgs"></div>
      <div class="composer">
        <textarea id="msg-input" placeholder="Écrire un message…" rows="1"></textarea>
        <button type="button" class="send-btn" id="btn-send">➤</button>
      </div>
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

<div class="overlay hidden" id="modal-bug">
  <div class="modal-box">
    <button type="button" class="modal-close" id="mb-close">✕</button>
    <h3>🐞 Signaler un bug</h3>
    <input id="bug-title" class="field-input" placeholder="Titre court" autocomplete="off" maxlength="120"/>
    <textarea id="bug-desc" class="field-input" style="height:110px;padding-top:9px;resize:vertical" placeholder="Décris le bug : ce que tu as fait, ce qui aurait dû se passer, ce qui s'est passé…" maxlength="2000"></textarea>
    <button type="button" class="btn-main" id="bug-submit" style="margin-top:4px">Envoyer le rapport</button>
    <div class="err" id="bug-err"></div>
  </div>
</div>

<div class="overlay hidden" id="modal-incoming-call">
  <div class="modal-box call-modal">
    <div class="call-ring-av" id="ic-av">?</div>
    <h3 id="ic-name">—</h3>
    <div class="call-sub">Appel vocal entrant…</div>
    <div class="call-modal-acts">
      <button type="button" class="call-act decline" id="ic-decline" title="Refuser">✕</button>
      <button type="button" class="call-act accept" id="ic-accept" title="Répondre">📞</button>
    </div>
  </div>
</div>

<div class="call-video-stage hidden" id="call-video-stage">
  <video id="call-remote-video" autoplay playsinline></video>
  <video id="call-local-video" autoplay playsinline muted></video>
</div>
<div class="call-bar hidden" id="call-bar">
  <div class="av" id="cb-av">?</div>
  <div class="cb-info">
    <div class="cb-name" id="cb-name">—</div>
    <div class="cb-status" id="cb-status">Appel…</div>
  </div>
  <button type="button" class="ub-btn" id="cb-mute" title="Muet">🎤</button>
  <button type="button" class="ub-btn" id="cb-cam" title="Caméra">🎥</button>
  <button type="button" class="ub-btn" id="cb-screen" title="Partager l'écran">🖥️</button>
  <button type="button" class="ub-btn call-act decline" id="cb-hangup" title="Raccrocher">✕</button>
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
      if(reg){regShownAt=Date.now();updateRegPreview();}
    }catch(e){xlog('tab_click_error',{msg:(e&&e.message)||String(e)});}
  });
});

let regShownAt=Date.now();
let regAvatarFile=null, regAvatarUrl='';
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
  if(profile&&profile.avatar&&/^https?:/i.test(profile.avatar)){av.innerHTML='<img src="'+esc(profile.avatar)+'" alt=""/>';}
  else{av.textContent=ini(name);}
  \$('auth').classList.add('hidden');
  \$('stage').classList.add('hidden');
  \$('app').classList.remove('hidden');
  xlog('show_dash_ok',{uid:acc.\$id,hasProfile:!!profile});
  try{await loadFriends();}catch(e){xlog('friends_init_fail',{msg:(e&&e.message)||String(e)});}
  try{await loadDms();}catch(e){xlog('dms_init_fail',{msg:(e&&e.message)||String(e)});}
  try{await checkAdmin();}catch(e){xlog('admin_check_fail',{msg:(e&&e.message)||String(e)});}
  try{subscribeIncomingCalls();}catch(e){xlog('call_listen_fail',{msg:(e&&e.message)||String(e)});}
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
  const swOn=document.querySelector('#reg-swatches button.on');
  const accent=(swOn&&swOn.dataset.c)||'#7c3aed';
  showErrTxt('');
  if(!name||name.length<2){showErrTxt('Pseudo trop court');return}
  if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$/.test(email)){showErrTxt('Email invalide');return}
  if(pass.length<8){showErrTxt('Mot de passe : 8 caractères minimum');return}
  if(!ensureSdk()){showErrTxt('SDK non chargé, réessaie dans un instant');return}
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

if(\$('btn-login'))\$('btn-login').addEventListener('click',doLogin);
if(\$('btn-register'))\$('btn-register').addEventListener('click',doRegister);
['in-email','in-pass'].forEach(function(id){
  const el=\$(id);
  if(el)el.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();doLogin();}});
});
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
    \$('list-title').textContent='Membres';
    app.classList.add('chat-open');
    \$('chat-empty').classList.add('hidden');
    \$('chat-active').classList.add('hidden');
    \$('admin-active').classList.remove('hidden');
    showAdminTab(adminTab);
    return;
  }
  \$('admin-active').classList.add('hidden');
  \$('list-title').textContent=v==='dms'?'Messages':(v==='friends'?'Amis':'Membres');
  app.classList.remove('chat-open');
  if(v==='dms')renderDms();
  else if(v==='friends')renderFriends();
  else{loadMembers().then(renderMembers).catch(function(e){xlog('members_load_fail',{msg:(e&&e.message)||String(e)})});}
}
document.querySelectorAll('.rail-btn').forEach(function(b){
  b.addEventListener('click',function(){
    try{showView(b.getAttribute('data-view'));}
    catch(e){xlog('nav_error',{msg:(e&&e.message)||String(e)});}
  });
});

let membersCache=[];
async function loadMembers(){
  const r=await db.listDocuments(DB,'users',[Appwrite.Query.limit(100)]);
  membersCache=r.documents||[];
  return membersCache;
}
function rowAvatar(p,name,uid){
  const av=p&&p.avatar;
  if(av&&/^https?:/i.test(av))return '<div class="av" data-uid="'+esc(uid)+'"><img src="'+esc(av)+'" alt=""/></div>';
  return '<div class="av" data-uid="'+esc(uid)+'">'+esc(ini(name))+'</div>';
}
function renderMembers(){
  const box=\$('list-body');if(!box)return;
  if(!membersCache.length){box.innerHTML='<div class="empty-hint">Aucun membre.</div>';return}
  box.innerHTML=membersCache.map(function(p){
    const name=p.displayName||p.username||'User';
    const uid=p.authUserId||p.\$id;
    return '<div class="row" data-open-profile="'+esc(uid)+'" data-name="'+esc(name)+'">'
      +rowAvatar(p,name,uid)
      +'<div class="info"><div class="n">'+esc(name)+'</div><div class="p">@'+esc(p.username||'')+(p.tag?('#'+esc(p.tag)):'')+'</div></div>'
      +'</div>';
  }).join('');
  box.querySelectorAll('[data-open-profile]').forEach(function(el){
    el.onclick=function(){startDmWith(el.getAttribute('data-open-profile'),el.getAttribute('data-name'))};
  });
}

let friendsCache=[];
async function loadFriends(){
  if(!me)return[];
  const r=await db.listDocuments(DB,'ultravoc_friends',[Appwrite.Query.equal('userId',me.\$id),Appwrite.Query.limit(100)]);
  friendsCache=r.documents||[];
  return friendsCache;
}
function renderFriends(){
  const box=\$('list-body');if(!box)return;
  const accepted=friendsCache.filter(function(f){return f.status==='accepted'});
  const incoming=friendsCache.filter(function(f){return f.status==='pending_in'});
  if(!accepted.length&&!incoming.length){box.innerHTML='<div class="empty-hint">Aucun ami pour l\\'instant. Utilise le bouton 👤+ pour en ajouter.</div>';return}
  let h='';
  if(incoming.length){
    h+='<div class="empty-hint" style="padding:8px 8px 2px">Demandes reçues</div>';
    h+=incoming.map(function(f){
      return '<div class="row"><div class="av">'+esc(ini(f.name||'?'))+'</div>'
        +'<div class="info"><div class="n">'+esc(f.name||'Ami')+'</div></div>'
        +'<div class="act"><button type="button" data-accept="'+esc(f.\$id)+'" data-from="'+esc(f.friendId)+'" data-fname="'+esc(f.name||'')+'">Accepter</button>'
        +'<button type="button" class="rej" data-reject="'+esc(f.\$id)+'">✕</button></div></div>';
    }).join('');
  }
  if(accepted.length){
    h+='<div class="empty-hint" style="padding:8px 8px 2px">Amis</div>';
    h+=accepted.map(function(f){
      return '<div class="row" data-open-dm="'+esc(f.friendId)+'" data-name="'+esc(f.name||'Ami')+'">'
        +'<div class="av">'+esc(ini(f.name||'?'))+'</div>'
        +'<div class="info"><div class="n">'+esc(f.name||'Ami')+'</div></div></div>';
    }).join('');
  }
  box.innerHTML=h;
  box.querySelectorAll('[data-open-dm]').forEach(function(el){
    el.onclick=function(){startDmWith(el.getAttribute('data-open-dm'),el.getAttribute('data-name'))};
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
  if(!dmsCache.length){box.innerHTML='<div class="empty-hint">Aucune conversation. Ouvre l\\'onglet Amis pour en démarrer une.</div>';return}
  box.innerHTML=dmsCache.map(function(d){
    const title=d.displayName||'Conversation';
    return '<div class="row" data-dm="'+esc(d.\$id)+'" data-title="'+esc(title)+'">'
      +'<div class="av">'+esc(ini(title))+'</div>'
      +'<div class="info"><div class="n">'+esc(title)+'</div><div class="p">'+esc(d.lastMessage||'')+'</div></div></div>';
  }).join('');
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

let activeDm=null, activeDmPeerUid=null, msgsCache=[];
async function openDm(threadId,title,peerUid){
  activeDm=threadId;
  activeDmPeerUid=peerUid||null;
  \$('chat-empty').classList.add('hidden');
  \$('chat-active').classList.remove('hidden');
  \$('ch-title').textContent=title||'Conversation';
  \$('ch-av').textContent=ini(title||'?');
  document.getElementById('app').classList.add('chat-open');
  await loadMessages(threadId);
}
async function loadMessages(threadId){
  try{
    const r=await db.listDocuments(DB,'dms_messages',[Appwrite.Query.equal('threadId',threadId),Appwrite.Query.orderDesc('\$createdAt'),Appwrite.Query.limit(60)]);
    msgsCache=(r.documents||[]).slice().reverse();
  }catch(e){xlog('load_msgs_fail',{msg:(e&&e.message)||String(e)});msgsCache=[];}
  renderMessages();
}
function renderMessages(){
  const box=\$('msgs');if(!box)return;
  if(!msgsCache.length){box.innerHTML='<div class="empty-hint" style="text-align:center">Aucun message. Dis bonjour !</div>';return}
  box.innerHTML=msgsCache.map(function(m){
    const mine=m.uid===(me&&me.\$id);
    const name=m.displayName||'User';
    return '<div class="msg'+(mine?' mine':'')+'"><div class="av">'+esc(ini(name))+'</div>'
      +'<div><div class="bub">'+esc(m.text||'')+'</div><div class="meta">'+esc(mine?'':name)+'</div></div></div>';
  }).join('');
  box.scrollTop=box.scrollHeight;
}
async function sendMessage(){
  const input=\$('msg-input');
  const text=(input.value||'').trim();
  if(!text||!activeDm||!me)return;
  input.value='';
  try{
    const name=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'User';
    await db.createDocument(DB,'dms_messages',Appwrite.ID.unique(),{threadId:activeDm,uid:me.\$id,text:text.slice(0,2000),displayName:name,type:'text'});
    try{await db.updateDocument(DB,'dms',activeDm,{lastMessage:text.slice(0,100)});}catch(e){}
    await loadMessages(activeDm);
    await loadDms();if(view==='dms')renderDms();
  }catch(e){xlog('send_msg_fail',{msg:(e&&e.message)||String(e)});}
}
if(\$('btn-send'))\$('btn-send').addEventListener('click',sendMessage);
if(\$('msg-input'))\$('msg-input').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
if(\$('btn-chat-back'))\$('btn-chat-back').addEventListener('click',function(){document.getElementById('app').classList.remove('chat-open');});

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
function renderAdminMembers(list){
  const box=\$('admin-body');if(!box)return;
  if(!list.length){box.innerHTML='<div class="empty-hint">Aucun membre.</div>';return}
  box.innerHTML=list.map(function(p){
    const name=p.displayName||p.username||'User';
    const uid=p.authUserId||p.\$id;
    const self=uid===(me&&me.\$id);
    const modTag=p.isMod?'<span class="tag-mod">MOD</span>':'';
    return '<div class="admin-row">'
      +rowAvatar(p,name,uid)
      +'<div class="info"><div class="n">'+esc(name)+modTag+'</div><div class="p">@'+esc(p.username||'')+(p.tag?('#'+esc(p.tag)):'')+'</div></div>'
      +(self?'':'<div class="acts">'
        +'<button type="button" data-modtoggle="'+esc(p.\$id)+'" data-mod="'+(p.isMod?'1':'0')+'" data-name="'+esc(name)+'" class="ok">'+(p.isMod?'Retirer modo':'Rendre modo')+'</button>'
        +'<button type="button" data-tban="'+esc(uid)+'" data-name="'+esc(name)+'">Temp ban 24h</button>'
        +'<button type="button" data-ban="'+esc(uid)+'" data-name="'+esc(name)+'" class="danger">Ban</button>'
        +'</div>')
      +'</div>';
  }).join('');
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
  const statusLabel={open:'Ouvert',resolved:'Résolu',wontfix:"Ne sera pas corrigé"};
  box.innerHTML=list.map(function(b){
    const st=b.status||'open';
    return '<div class="admin-row" style="align-items:flex-start">'
      +'<div class="av">'+esc(ini(b.username||'?'))+'</div>'
      +'<div class="info"><div class="n">'+esc(b.title||'Sans titre')+'</div>'
      +'<div class="p">'+esc(b.description||'')+'</div>'
      +'<div class="p">par '+esc(b.username||'?')+' — '+esc(statusLabel[st]||st)+'</div></div>'
      +'<div class="acts">'
      +(st!=='resolved'?'<button type="button" data-bugstatus="'+esc(b.\$id)+'" data-status="resolved" class="ok">Résolu</button>':'')
      +(st!=='wontfix'?'<button type="button" data-bugstatus="'+esc(b.\$id)+'" data-status="wontfix">Won\\'t fix</button>':'')
      +(st!=='open'?'<button type="button" data-bugstatus="'+esc(b.\$id)+'" data-status="open">Rouvrir</button>':'')
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

if(\$('btn-report-bug'))\$('btn-report-bug').addEventListener('click',function(){
  \$('bug-title').value='';\$('bug-desc').value='';\$('bug-err').textContent='';
  \$('modal-bug').classList.remove('hidden');
});
if(\$('mb-close'))\$('mb-close').addEventListener('click',function(){\$('modal-bug').classList.add('hidden')});
if(\$('bug-submit'))\$('bug-submit').addEventListener('click',async function(){
  const title=(\$('bug-title').value||'').trim();
  const desc=(\$('bug-desc').value||'').trim();
  if(!title||!desc){\$('bug-err').textContent='Titre et description requis';return}
  this.disabled=true;this.textContent='Envoi…';
  try{
    const name=(meProfile&&(meProfile.displayName||meProfile.username))||me.name||'User';
    await db.createDocument(DB,'bug_reports',Appwrite.ID.unique(),{uid:me.\$id,username:name,title:title.slice(0,120),description:desc.slice(0,2000),status:'open',upvotes:0});
    xlog('bug_report_sent',{});
    \$('modal-bug').classList.add('hidden');
    alert('Merci ! Ton rapport a été envoyé à l\\'équipe.');
  }catch(e){\$('bug-err').textContent=(e&&e.message)||'Erreur';xlog('bug_report_fail',{msg:(e&&e.message)||String(e)});}
  this.disabled=false;this.textContent='Envoyer le rapport';
});

/* ===== Appels vocaux (WebRTC) ===== */
const ICE_SERVERS={iceServers:[
  {urls:'stun:stun.l.google.com:19302'},
  {urls:'stun:stun1.l.google.com:19302'},
  {urls:'stun:openrelay.metered.ca:80'},
  {urls:'turn:openrelay.metered.ca:80',username:'openrelayproject',credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443?transport=tcp',username:'openrelayproject',credential:'openrelayproject'}
]};

let callPc=null, localStream=null, activeCallDoc=null, incomingCallDoc=null;
let callPeerUid=null, callPeerName=null, callIsCaller=false;
let callSeconds=0, callTimerId=null, callTimeoutId=null;
let callUnsubs=[];
let pendingLocalIce=[];
let camStream=null, screenStream=null, videoSender=null;
let makingOffer=false, ignoreOffer=false, callLive=false, remoteVideoActive=false;
function isPolite(){return !callIsCaller}

function onRemoteTrack(e){
  if(e.track.kind==='video'){
    const v=\$('call-remote-video');
    if(v)v.srcObject=e.streams[0];
    remoteVideoActive=true;
    updateVideoStage();
    e.track.onended=function(){remoteVideoActive=false;updateVideoStage();};
  } else {
    const a=\$('call-remote-audio');
    if(a)a.srcObject=e.streams[0];
  }
}
async function onNegotiationNeeded(){
  if(!callLive||!activeCallDoc||!callPc)return;
  try{
    makingOffer=true;
    await callPc.setLocalDescription();
    sendSignal(activeCallDoc.\$id,'reneg-offer',callPc.localDescription);
  }catch(e){xlog('call_reneg_fail',{msg:(e&&e.message)||String(e)});}
  finally{makingOffer=false;}
}
function updateVideoStage(){
  const stage=\$('call-video-stage');if(!stage)return;
  stage.classList.toggle('hidden',!(remoteVideoActive||!!videoSender));
  const lv=\$('call-local-video');if(lv)lv.classList.toggle('hidden',!videoSender);
}
async function toggleCamera(){
  if(!callPc||!callLive)return;
  if(videoSender){
    try{callPc.removeTrack(videoSender);}catch(e){}
    videoSender=null;
    if(camStream){camStream.getTracks().forEach(function(t){t.stop()});camStream=null;}
    const lv=\$('call-local-video');if(lv)lv.srcObject=null;
    \$('cb-cam').classList.remove('on');
    updateVideoStage();
    return;
  }
  if(screenStream)await toggleScreenShare();
  try{
    camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});
    const track=camStream.getVideoTracks()[0];
    videoSender=callPc.addTrack(track,camStream);
    const lv=\$('call-local-video');if(lv)lv.srcObject=camStream;
    \$('cb-cam').classList.add('on');
    updateVideoStage();
  }catch(e){alert('Caméra refusée ou indisponible');}
}
async function toggleScreenShare(){
  if(!callPc||!callLive)return;
  if(screenStream){
    screenStream.getTracks().forEach(function(t){t.stop()});
    screenStream=null;
    if(videoSender){try{callPc.removeTrack(videoSender);}catch(e){}videoSender=null;}
    const lv=\$('call-local-video');if(lv)lv.srcObject=null;
    \$('cb-screen').classList.remove('on');
    updateVideoStage();
    return;
  }
  if(camStream)await toggleCamera();
  try{
    screenStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});
    const track=screenStream.getVideoTracks()[0];
    videoSender=callPc.addTrack(track,screenStream);
    const lv=\$('call-local-video');if(lv)lv.srcObject=screenStream;
    \$('cb-screen').classList.add('on');
    updateVideoStage();
    track.onended=function(){toggleScreenShare();};
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

function showIncomingCall(doc){
  incomingCallDoc=doc;
  \$('ic-name').textContent=doc.callerName||'Appel inconnu';
  const av=\$('ic-av');
  if(doc.callerAvatar&&/^https?:/i.test(doc.callerAvatar))av.innerHTML='<img src="'+esc(doc.callerAvatar)+'" alt=""/>';
  else av.textContent=ini(doc.callerName||'?');
  \$('modal-incoming-call').classList.remove('hidden');
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
}

async function acceptIncomingCall(){
  const doc=incomingCallDoc;
  if(!doc)return;
  dismissIncomingCall();
  callPeerUid=doc.callerId;callPeerName=doc.callerName||'Appel';callIsCaller=false;
  try{
    localStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
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
    showCallBar(callPeerName,'En appel…',true);
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
    localStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
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
    showCallBar(peerName,'Sonne…',false);
    subscribeCallAnswer(doc.\$id);
    subscribeIceForCall(doc.\$id);
    callTimeoutId=setTimeout(function(){
      if(activeCallDoc&&activeCallDoc.\$id===doc.\$id)endCall('missed');
    },45000);
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
        showCallBar(callPeerName,'En appel…',true);
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

function showCallBar(name,status,live){
  \$('cb-name').textContent=name||'Appel';
  \$('cb-status').textContent=status||'';
  \$('cb-status').classList.toggle('live',!!live);
  \$('cb-av').textContent=ini(name||'?');
  \$('call-bar').classList.remove('hidden');
  if(live&&!callTimerId){
    callSeconds=0;
    callTimerId=setInterval(function(){
      callSeconds++;
      const m=String(Math.floor(callSeconds/60)).padStart(2,'0');
      const s=String(callSeconds%60).padStart(2,'0');
      \$('cb-status').textContent=m+':'+s;
    },1000);
  }
}
function cleanupCallLocal(){
  if(callPc){try{callPc.close();}catch(e){}callPc=null;}
  if(localStream){localStream.getTracks().forEach(function(t){t.stop()});localStream=null;}
  if(camStream){camStream.getTracks().forEach(function(t){t.stop()});camStream=null;}
  if(screenStream){screenStream.getTracks().forEach(function(t){t.stop()});screenStream=null;}
  videoSender=null;callLive=false;remoteVideoActive=false;makingOffer=false;ignoreOffer=false;
  if(callTimerId){clearInterval(callTimerId);callTimerId=null;}
  if(callTimeoutId){clearTimeout(callTimeoutId);callTimeoutId=null;}
  callUnsubAll();
  activeCallDoc=null;incomingCallDoc=null;callPeerUid=null;callPeerName=null;callIsCaller=false;
  \$('call-bar').classList.add('hidden');
  \$('call-video-stage').classList.add('hidden');
  const audioEl=\$('call-remote-audio');if(audioEl)audioEl.srcObject=null;
  const rv=\$('call-remote-video');if(rv)rv.srcObject=null;
  const lv=\$('call-local-video');if(lv)lv.srcObject=null;
  \$('cb-mute').classList.remove('on');
  \$('cb-cam').classList.remove('on');
  \$('cb-screen').classList.remove('on');
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
      if (!reportId || ["open", "resolved", "wontfix"].indexOf(status) === -1) throw new Error("paramètres invalides");
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
