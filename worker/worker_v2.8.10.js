addEventListener("fetch", e => e.respondWith(handle(e.request)));

/* ===== Server brain (no VPS) — secrets stay on Worker only ===== */
const AW_EP = "https://fra.cloud.appwrite.io/v1";
const AW_PID = "6a73b975002f14dc6b91";
const AW_DB = "xultra";
// API key: Worker-only (never sent to browser). Prefer Cloudflare Secret later.
const AW_KEY = "standard_dbd86d5c813301a5cb4fb65415361244856cd53019bf52cdac23e405c1fee6a89de9302dc8dd652190e0e823ae2ef7329f33d59a5ae922a3d09ad7607ecbb0e006fd6942b18033bc694c115032e78f0cf3f0bd5cf1eb8a358f09f5df60aac51debe6c92d60a8703c9adec5ad1f25ac846fe07621113577c93b7a75eb3e218491";
const SHAMAN_UIDS = new Set(["6a7895fc00364d72996f"]);
const MAINTENANCE_MODE = true;
const MAINT_GATE = "xu_gate_Z-5olSXEZ3Gw3rgQPqhR_Y-o";
const MAINT_HTML = "<!DOCTYPE html>\n<html lang=\"fr\"><head>\n<meta charset=\"utf-8\"/>\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/>\n<meta name=\"robots\" content=\"noindex,nofollow\"/>\n<title>XULTRA \u2014 Maintenance</title>\n<style>\n:root{--bg:#0b0614;--accent:#a78bfa;--muted:#9ca3af;--line:#2a1f3d;--ok:#22c55e;--bad:#ef4444;--warn:#f59e0b}\n*{box-sizing:border-box;margin:0;padding:0}\nbody{min-height:100dvh;display:grid;place-items:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:radial-gradient(1200px 600px at 50% -10%,rgba(124,58,237,.35),transparent 60%),radial-gradient(800px 400px at 100% 100%,rgba(88,28,135,.25),transparent 50%),var(--bg);color:#f3e8ff;padding:24px}\n.card{width:min(420px,100%);background:linear-gradient(180deg,rgba(30,16,50,.95),rgba(15,8,28,.98));border:1px solid var(--line);border-radius:20px;padding:32px 26px;box-shadow:0 24px 80px rgba(0,0,0,.55);text-align:center;position:relative}\n.logo{font-size:2rem;font-weight:900;letter-spacing:.12em;background:linear-gradient(135deg,#e9d5ff,#a78bfa,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:8px}\n.badge{display:inline-block;margin:12px 0 18px;padding:6px 12px;border-radius:999px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.28);color:var(--accent);font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}\nh1{font-size:1.2rem;margin-bottom:8px;font-weight:800}\np{color:var(--muted);font-size:.92rem;line-height:1.55;margin-bottom:8px}\n.pulse{width:10px;height:10px;border-radius:50%;background:#a78bfa;display:inline-block;margin-right:8px;box-shadow:0 0 0 0 rgba(167,139,250,.6);animation:p 1.6s infinite}\n@keyframes p{0%{box-shadow:0 0 0 0 rgba(167,139,250,.55)}70%{box-shadow:0 0 0 12px rgba(167,139,250,0)}100%{box-shadow:0 0 0 0 rgba(167,139,250,0)}}\n.foot{margin-top:18px;font-size:.72rem;color:#6b7280}\n.dev-box{margin-top:22px;padding-top:18px;border-top:1px solid var(--line);text-align:left}\n.dev-box h2{font-size:.78rem;color:#a78bfa;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;font-weight:700}\nlabel{display:block;font-size:.72rem;color:#9ca3af;margin:0 0 6px;font-weight:600}\ninput{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:#0d0818;color:#f3e8ff;font-size:.95rem;margin-bottom:12px;outline:none}\ninput:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.2)}\n.btn-main{width:100%;padding:13px;border:0;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:800;font-size:.95rem;cursor:pointer}\n.btn-main:disabled{opacity:.6;cursor:wait}\n.btn-status{margin-top:14px;width:100%;padding:11px 14px;border-radius:12px;border:1px solid rgba(167,139,250,.35);background:rgba(124,58,237,.12);color:#e9d5ff;font-weight:700;font-size:.88rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}\n.btn-status:hover{background:rgba(124,58,237,.22);border-color:rgba(167,139,250,.55)}\n.err{color:#f87171;font-size:.82rem;min-height:1.2em;margin-top:8px;text-align:center}\n.ov{position:fixed;inset:0;background:rgba(5,2,12,.72);backdrop-filter:blur(10px);display:none;place-items:center;z-index:100;padding:20px}\n.ov.on{display:grid}\n.modal{width:min(440px,100%);background:linear-gradient(165deg,#1a1030 0%,#10081c 100%);border:1px solid rgba(167,139,250,.35);border-radius:22px;padding:0;overflow:hidden;box-shadow:0 30px 100px rgba(0,0,0,.65),0 0 0 1px rgba(124,58,237,.15),0 0 60px rgba(124,58,237,.12);animation:pop .28s ease}\n@keyframes pop{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}\n.modal-head{padding:22px 22px 14px;border-bottom:1px solid rgba(42,31,61,.9);position:relative}\n.modal-head h3{font-size:1.05rem;font-weight:800;letter-spacing:.02em}\n.modal-head .sub{font-size:.78rem;color:var(--muted);margin-top:4px}\n.modal-x{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.04);color:#e9d5ff;font-size:1.1rem;cursor:pointer;display:grid;place-items:center}\n.modal-x:hover{background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.4)}\n.modal-body{padding:12px 16px 20px;max-height:min(60vh,420px);overflow:auto}\n.svc{display:flex;align-items:center;gap:12px;padding:12px 12px;border-radius:14px;margin-bottom:8px;background:rgba(255,255,255,.03);border:1px solid rgba(42,31,61,.8)}\n.svc-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;box-shadow:0 0 10px currentColor}\n.svc-dot.ok{background:var(--ok);color:rgba(34,197,94,.5)}\n.svc-dot.bad{background:var(--bad);color:rgba(239,68,68,.45)}\n.svc-dot.warn{background:var(--warn);color:rgba(245,158,11,.45)}\n.svc-dot.load{background:#a78bfa;animation:blink 1s infinite}\n@keyframes blink{50%{opacity:.35}}\n.svc-name{font-weight:700;font-size:.9rem}\n.svc-desc{font-size:.72rem;color:var(--muted);margin-top:2px}\n.svc-state{margin-left:auto;font-size:.72rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase}\n.svc-state.ok{color:var(--ok)}.svc-state.bad{color:var(--bad)}.svc-state.warn{color:var(--warn)}.svc-state.load{color:#a78bfa}\n.modal-foot{padding:0 16px 18px;font-size:.7rem;color:#6b7280;text-align:center}\n</style></head><body>\n<div class=\"card\">\n<div class=\"logo\">XULTRA</div>\n<div class=\"badge\"><span class=\"pulse\"></span>Maintenance</div>\n<h1>Nous revenons tr\u00e8s bient\u00f4t</h1>\n<p>Des am\u00e9liorations de s\u00e9curit\u00e9 et de stabilit\u00e9 sont en cours.</p>\n<p>Le service est temporairement inaccessible pour tout le monde.</p>\n<button type=\"button\" class=\"btn-status\" id=\"btn-status\">\ud83d\udce1 Statut des services</button>\n<div class=\"dev-box\">\n<h2>Acc\u00e8s d\u00e9veloppeur</h2>\n<label for=\"dev-email\">Email</label>\n<input id=\"dev-email\" type=\"email\" autocomplete=\"username\" placeholder=\"email@exemple.com\"/>\n<label for=\"dev-pass\">Mot de passe</label>\n<input id=\"dev-pass\" type=\"password\" autocomplete=\"current-password\" placeholder=\"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\"/>\n<button type=\"button\" class=\"btn-main\" id=\"dev-btn\">Entrer (dev)</button>\n<div class=\"err\" id=\"dev-err\"></div>\n</div>\n<div class=\"foot\">xultra.space</div>\n</div>\n<div class=\"ov\" id=\"status-ov\" role=\"dialog\" aria-modal=\"true\">\n  <div class=\"modal\">\n    <div class=\"modal-head\">\n      <h3>\ud83d\udce1 Statut des services</h3>\n      <div class=\"sub\">Infrastructure XULTRA en temps r\u00e9el</div>\n      <button type=\"button\" class=\"modal-x\" id=\"status-x\" aria-label=\"Fermer\">\u2715</button>\n    </div>\n    <div class=\"modal-body\" id=\"status-body\"></div>\n    <div class=\"modal-foot\">Mis \u00e0 jour \u00e0 l\u2019ouverture \u00b7 \u03b22.8.8</div>\n  </div>\n</div>\n<script>\n(function(){\n  var btn=document.getElementById('dev-btn');\n  var err=document.getElementById('dev-err');\n  function show(m){err.textContent=m||'';}\n  async function go(){\n    show('');\n    var email=(document.getElementById('dev-email').value||'').trim();\n    var pass=document.getElementById('dev-pass').value||'';\n    if(!email||!pass){show('Email et mot de passe requis');return;}\n    btn.disabled=true;btn.textContent='V\u00e9rification\u2026';\n    try{\n      var r=await fetch('/api/maint/dev-login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email:email,password:pass})});\n      var j=await r.json().catch(function(){return {};});\n      if(!r.ok||!j.ok){show((j&&j.error)||('Acc\u00e8s refus\u00e9 ('+r.status+')'));btn.disabled=false;btn.textContent='Entrer (dev)';return;}\n      btn.textContent='OK \u2014 redirection\u2026';location.href='/?dev=1';\n    }catch(e){show('Erreur r\u00e9seau');btn.disabled=false;btn.textContent='Entrer (dev)';}\n  }\n  btn.onclick=go;\n  document.getElementById('dev-pass').addEventListener('keydown',function(e){if(e.key==='Enter')go();});\n  document.getElementById('dev-email').addEventListener('keydown',function(e){if(e.key==='Enter')go();});\n  var ov=document.getElementById('status-ov');\n  var body=document.getElementById('status-body');\n  document.getElementById('btn-status').onclick=function(){ov.classList.add('on');loadStatus();};\n  document.getElementById('status-x').onclick=function(){ov.classList.remove('on');};\n  ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.remove('on');});\n  function row(name,desc,state,label){\n    return '<div class=\"svc\"><div class=\"svc-dot '+state+'\"></div><div><div class=\"svc-name\">'+name+'</div><div class=\"svc-desc\">'+desc+'</div></div><div class=\"svc-state '+state+'\">'+label+'</div></div>';\n  }\n  async function loadStatus(){\n    body.innerHTML=row('Chargement','V\u00e9rification des services','load','\u2026');\n    try{\n      var r=await fetch('/api/maint/status',{cache:'no-store'});\n      var j=await r.json();\n      if(j&&j.services&&j.services.length){\n        body.innerHTML=j.services.map(function(s){return row(s.name,s.desc||'',s.state||'warn',s.label||'?');}).join('');\n        return;\n      }\n    }catch(e){}\n    body.innerHTML=row('Cloudflare Worker','Edge xultra.space','ok','OK')+row('Mode maintenance','Acc\u00e8s public bloqu\u00e9','ok','ACTIF')+row('Appwrite API','Statut indisponible','warn','N/A');\n  }\n})();\n</script>\n</body></html>";;;


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
      "queries[]=" + encodeURIComponent('equal("authUserId",' + JSON.stringify([String(authUserId)]) + ')') +
      "&queries[]=" + encodeURIComponent('limit(1)');
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
  const url = "/databases/" + AW_DB + "/collections/dm_call_rooms/documents?" +
    "queries[]=" + encodeURIComponent("limit(80)");
  const data = await awFetch(url, { asAdmin: true });
  const docs = ((data && data.documents) || []).filter(function (d) {
    return (d.status || "") === "active";
  });
  // attach simple user names
  let users = [];
  try {
    const u = await awFetch("/databases/" + AW_DB + "/collections/users/documents?queries[]=" + encodeURIComponent("limit(200)"), { asAdmin: true });
    users = (u && u.documents) || [];
  } catch (e) {}
  function nameOf(id) {
    const p = users.find(function (x) { return String(x.authUserId || x.$id) === String(id); });
    return p ? (p.displayName || p.username || id) : String(id).slice(0, 8);
  }
  return docs.map(function (room) {
    var parts = [];
    try {
      var p = JSON.parse(room.participants || "[]");
      parts = Array.isArray(p) ? p : [];
    } catch (e) {}
    return {
      id: room.$id,
      threadId: room.threadId || "",
      hostUid: room.hostUid || "",
      hostName: nameOf(room.hostUid || ""),
      participants: parts,
      participantNames: parts.map(nameOf),
      startedAt: room.startedAt || null,
      status: room.status || "active"
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
  <div id="dash" class="dash hidden">
    <div class="av" id="dash-av">?</div>
    <h2 id="dash-name">—</h2>
    <div class="tag" id="dash-tag">@—</div>
    <div class="bio" id="dash-bio"></div>
    <div class="ok-badge">✅ Connecté et profil chargé avec succès</div>
    <button type="button" class="btn-out" id="btn-logout">Se déconnecter</button>
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

async function showDash(){
  xlog('show_dash_start',{});
  let acc=null;
  try{acc=await account.get();}catch(e){xlog('dash_account_fail',{msg:(e&&e.message)||String(e)});throw e}
  let profile=null;
  try{
    const r=await db.listDocuments(DB,'users',[Appwrite.Query.equal('authUserId',acc.\$id),Appwrite.Query.limit(1)]);
    profile=(r.documents&&r.documents[0])||null;
  }catch(e){xlog('dash_profile_fail',{msg:(e&&e.message)||String(e)});}
  const name=(profile&&(profile.displayName||profile.username))||acc.name||acc.email||'Compte';
  const tag=profile?('@'+(profile.username||slugUsername(name))+(profile.tag?('#'+profile.tag):'')):('@'+slugUsername(name));
  \$('dash-name').textContent=name;
  \$('dash-tag').textContent=tag;
  \$('dash-bio').textContent=(profile&&profile.bio)||'';
  const av=\$('dash-av');
  if(profile&&profile.avatar&&/^https?:/i.test(profile.avatar)){
    av.innerHTML='<img src="'+esc(profile.avatar)+'" alt=""/>';
  }else{
    av.textContent=ini(name);
  }
  \$('auth').classList.add('hidden');
  \$('dash').classList.remove('hidden');
  xlog('show_dash_ok',{uid:acc.\$id,hasProfile:!!profile});
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
    await showDash();
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
    await showDash();
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

function boot(){
  xlog('boot_start',{hasStored:!!readSession()});
  waitSdk(async function(){
    xlog('sdk_ready',{});
    const s=readSession();
    if(!s){xlog('boot_no_session',{});return}
    try{
      applySession(s);
      await showDash();
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
  if (typeof MAINTENANCE_MODE !== "undefined" && MAINTENANCE_MODE) {
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
      return new Response(MAINT_HTML, {
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
    services.push({ name: "Mode maintenance", desc: "Accès public bloqué", state: "ok", label: "ACTIF" });
    services.push({ name: "Auth / Sessions", desc: "Appwrite Account", state: "ok", label: "OK" });
    services.push({ name: "CDN jsDelivr", desc: "Appwrite SDK", state: "ok", label: "OK" });
    return new Response(JSON.stringify({ ok: true, maintenance: true, services: services, version: "β2.8.10" }), {
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
