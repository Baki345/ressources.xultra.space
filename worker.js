
const HOME=`<!DOCTYPE html><html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="uv-country" content="AUTO"><meta name="theme-color" content="#0a0612"><meta name="robots" content="noindex">
<title>ULTRAVOC — XULTRA</title>
<script src="https://cdn.jsdelivr.net/npm/appwrite@15.0.0/dist/iife/sdk.js"></script>
<style>
:root{--bg:#07040f;--card:rgba(18,12,28,.88);--p:#c084fc;--p2:#7c3aed;--p3:#a855f7;--t:#f5f0ff;--m:#9b8bb8;--b:rgba(192,132,252,.28);--ok:#4ade80;--line:rgba(255,255,255,.08)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:var(--t);min-height:100dvh;position:relative;overflow-x:hidden}
.bg{position:fixed;inset:0;z-index:0;background:#07040f;pointer-events:none!important}
.bg::before,.bg::after{content:"";position:absolute;inset:-25%;background:
  radial-gradient(ellipse 55% 45% at 30% 25%,rgba(124,58,237,.5),transparent 55%),
  radial-gradient(ellipse 45% 40% at 75% 30%,rgba(168,85,247,.35),transparent 50%),
  radial-gradient(ellipse 40% 35% at 50% 85%,rgba(34,211,238,.1),transparent 55%);
  animation:drift 14s ease-in-out infinite alternate;filter:saturate(1.2)}
.bg::after{animation-duration:20s;animation-direction:alternate-reverse;opacity:.8;mix-blend-mode:screen}
@keyframes drift{0%{transform:translate3d(-2%,-1%,0) scale(1)}100%{transform:translate3d(2%,2%,0) scale(1.06)}}
.wrap{position:relative;z-index:2;min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 14px 28px;gap:14px}
.brand{text-align:center}
h1.brand-title{font-size:clamp(2.6rem,9vw,3.4rem);font-weight:900;letter-spacing:.2em;background:linear-gradient(90deg,#f3e8ff,#e9d5ff 25%,#c084fc 50%,#a855f7 75%,#67e8f9);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 0 60px rgba(168,85,247,.35);margin-bottom:4px}
.tag{color:var(--m);font-size:.8rem;margin-top:6px;line-height:1.35;max-width:320px;margin-left:auto;margin-right:auto}
.card{width:min(360px,100%);background:var(--card);border:1px solid var(--b);border-radius:16px;padding:16px;backdrop-filter:blur(16px);box-shadow:0 16px 48px rgba(0,0,0,.4)}
.tabs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px;background:rgba(0,0,0,.35);border-radius:11px;padding:3px;margin-bottom:12px}
.tab{border:0;background:0;color:var(--m);padding:9px 4px;border-radius:8px;font-weight:700;font-size:.8rem;cursor:pointer}
.tab.on{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff}
.panel{display:none}.panel.on{display:block}
label{display:block;font-size:.65rem;font-weight:700;color:var(--m);margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.f{margin-bottom:10px}
input{width:100%;padding:11px 12px;border-radius:10px;border:1px solid var(--b);background:rgba(7,4,15,.9);color:var(--t);outline:0;font-size:.95rem}
input:focus{border-color:var(--p)}
.btn{width:100%;padding:12px;border:0;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:800;cursor:pointer;font-size:.92rem}
.btn.ghost{background:rgba(255,255,255,.06);border:1px solid var(--b)}
#msg.msg{display:none;padding:8px 10px;border-radius:9px;margin-bottom:8px;font-size:.8rem;font-weight:600}
#msg.msg.on{display:block}.msg.e{background:rgba(244,63,94,.12);color:#fecdd3}.msg.o{background:rgba(34,197,94,.1);color:#bbf7d0}
.hint{font-size:.68rem;color:var(--m);margin-top:10px;line-height:1.4;text-align:center}
.qr-box{text-align:center;padding:4px 0}
.qr-box img{width:160px;height:160px;border-radius:12px;background:#fff;padding:8px}
.qr-code{margin-top:10px;font-family:ui-monospace,monospace;font-size:1.2rem;font-weight:800;letter-spacing:.18em;color:var(--p)}
.qr-note{font-size:.7rem;color:var(--m);margin-top:6px;line-height:1.35}
.security{width:min(360px,100%);background:rgba(16,12,26,.55);border:1px solid rgba(74,222,128,.18);border-radius:12px;padding:10px 12px}
.security h2{font-size:.68rem;font-weight:800;color:var(--ok);letter-spacing:.05em;text-transform:uppercase;margin-bottom:6px}
.security ul{list-style:none;display:grid;gap:3px}
.security li{font-size:.7rem;color:#cfc0e8;line-height:1.35;padding-left:14px;position:relative}
.security li::before{content:"✓";position:absolute;left:0;color:var(--ok);font-weight:800;font-size:.65rem}
.foot{font-size:.65rem;color:var(--m);text-align:center}
.foot strong{color:#d8b4fe}
</style></head><body>
<div class="bg" aria-hidden="true"></div>
<div class="wrap">
  <div class="brand">
    <h1 class="brand-title">XULTRA</h1>
    <p class="tag">Ultravoc — vocal, social &amp; hubs. Ta bulle chiffrée, no-log.</p>
  </div>
  <div class="card">
    <div class="tabs">
      <button class="tab on" data-p="l" type="button">Connexion</button>
      <button class="tab" data-p="r" type="button">Inscription</button>
      <button class="tab" data-p="q" type="button">QR</button>
    </div>
    <div id="msg" class="msg"></div>
    <form class="panel on" id="fl">
      <div class="f"><label>E-mail</label><input id="le" type="email" required autocomplete="username"></div>
      <div class="f"><label>Mot de passe</label><input id="lp" type="password" required minlength="8" autocomplete="current-password"></div>
      <button class="btn" type="submit">Entrer dans Ultravoc</button>
    </form>
    <form class="panel" id="fr">
      <div class="f"><label>Pseudo</label><input id="ru" required pattern="[A-Za-z0-9_]{3,24}" title="3-24 lettres, chiffres, _" autocomplete="username"></div>
      <div class="f"><label>E-mail</label><input id="re" type="email" required autocomplete="email"></div>
      <div class="f"><label>Mot de passe</label><input id="rp" type="password" required minlength="8" autocomplete="new-password"></div>
      <div class="f"><label>Confirmer</label><input id="rp2" type="password" required minlength="8" autocomplete="new-password"></div>
      <button class="btn" type="submit">Créer mon compte</button>
    </form>
    <div class="panel" id="fq">
      <div class="qr-box">
        <img id="qr-img" alt="QR Ultravoc" width="160" height="160">
        <div class="qr-code" id="qr-code">————</div>
        <p class="qr-note">Scanne pour ouvrir Ultravoc sur mobile.</p>
        <button class="btn ghost" type="button" id="qr-refresh" style="margin-top:10px">Nouveau code</button>
      </div>
    </div>
    <p class="hint">Compte = e-mail unique · session propre à chaque connexion</p>
  </div>
  <div class="security">
    <h2>Sécurité &amp; no-log</h2>
    <ul>
      <li>HTTPS · cookies de session isolés</li>
      <li>Pas de revente / pub sur tes messages privés</li>
      <li>Médias éphémères · sessions anti-mixte</li>
    </ul>
  </div>
  <p class="foot">Propulsé par <strong>XULTRA</strong> · Ultravoc</p>
</div>
<script>
const {Client,Account,ID}=Appwrite;
const account=new Account(new Client().setEndpoint('https://fra.cloud.appwrite.io/v1').setProject('6a73b975002f14dc6b91'));
const esc=s=>String(s||'').replace(/[<>&"'\`]/g,'');
const msg=document.getElementById('msg');
const show=(t,e)=>{msg.textContent=t;msg.className='msg on '+(e?'e':'o')};
const fl=document.getElementById('fl'),fr=document.getElementById('fr'),fq=document.getElementById('fq');
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));t.classList.add('on');
  fl.classList.toggle('on',t.dataset.p==='l');
  fr.classList.toggle('on',t.dataset.p==='r');
  fq.classList.toggle('on',t.dataset.p==='q');
  msg.className='msg';
  if(t.dataset.p==='q')refreshQr();
});
async function killSessions(){try{await account.deleteSessions()}catch(_){try{await account.deleteSession('current')}catch(__){}}}
function makeCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
function refreshQr(){
  const code=makeCode();
  const url=location.origin+'/?pair='+encodeURIComponent(code);
  document.getElementById('qr-code').textContent=code;
  document.getElementById('qr-img').src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=6&data='+encodeURIComponent(url);
  try{sessionStorage.setItem('uv_pair_code',code)}catch(e){}
}
document.getElementById('qr-refresh').onclick=refreshQr;
(function(){
  const pair=new URLSearchParams(location.search).get('pair');
  if(pair){try{sessionStorage.setItem('uv_incoming_pair',pair)}catch(e){}show('Code appareil: '+pair+' — connecte-toi',0)}
})();
account.get().then(u=>{
  const n=+(sessionStorage.getItem('uv_redir')||0);
  if(n>=3){sessionStorage.removeItem('uv_redir');show('Reconnecte-toi manuellement.');return;}
  show('Session active — redirection…');
  setTimeout(()=>location.replace('/app'),400);
}).catch(()=>{sessionStorage.removeItem('uv_redir')});
fr.onsubmit=async e=>{e.preventDefault();if(rp.value!==rp2.value)return show('Mots de passe différents',1);
try{await killSessions();await account.create(ID.unique(),re.value.trim().toLowerCase(),rp.value,ru.value.trim());await account.createEmailPasswordSession(re.value.trim().toLowerCase(),rp.value);location.replace('/app')}catch(err){show(esc(err.message),1)}};
fl.onsubmit=async e=>{e.preventDefault();
try{await killSessions();await account.createEmailPasswordSession(le.value.trim().toLowerCase(),lp.value);const u=await account.get();show('Connecté: '+(u.name||u.email));location.replace('/app')}catch(err){show(esc(err.message),1)}};
</script></body></html>`;

const APP=`<!DOCTYPE html>
<html lang="fr"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1">
<meta name="theme-color" content="#0a0612">
<meta name="robots" content="noindex,nofollow">
<title>Ultravoc</title>
<script src="https://cdn.jsdelivr.net/npm/appwrite@15.0.0/dist/iife/sdk.js"></script>
<style>
:root{--bg:#0a0612;--bg2:#100a18;--panel:#16101f;--elev:#1c1428;--row:#1a1326;--p:#c084fc;--p2:#7c3aed;--p3:#a855f7;--c:#22d3ee;--t:#f3eeff;--m:#9b8bb8;--b:rgba(192,132,252,.22);--ok:#22c55e;--danger:#f43f5e;--line:rgba(255,255,255,.06);--nav:60px;--safe:env(safe-area-inset-bottom,0px);--radius:14px;--speak:#22c55e}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}html,body{height:100%;overflow:hidden;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--t);user-select:none}
button,input,select,textarea{font:inherit;color:inherit}img{max-width:100%;display:block}
.app{height:100dvh;display:flex;flex-direction:column;overflow:hidden;position:relative;z-index:1}
.top{height:52px;flex-shrink:0;display:flex;align-items:center;gap:10px;padding:0 12px;background:var(--bg2);border-bottom:1px solid var(--line)}
.icon-btn{width:36px;height:36px;border-radius:10px;border:1px solid var(--b);background:var(--row);display:grid;place-items:center;cursor:pointer}
.top h1{flex:1;font-size:.95rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.top .sub{font-size:.68rem;color:var(--m);font-weight:500}
.main{flex:1;min-height:0;position:relative;overflow:hidden}
.screen{position:absolute;inset:0;display:none;flex-direction:column;overflow:hidden;background:var(--bg)}.screen.on{display:flex}
.hub-head{flex-shrink:0;border-bottom:1px solid var(--line);background:var(--bg)}
.hub-banner{height:88px;background:linear-gradient(120deg,#2e1065,#0f172a 50%,#134e4a);background-size:cover;background-position:center;position:relative;border-radius:0}
.hub-banner.has-img{background-color:#1a0b2e}
.hub-meta{display:flex;align-items:flex-end;gap:12px;padding:0 14px 12px;margin-top:-28px;position:relative;z-index:2}
.hub-ico{position:relative;left:auto;bottom:auto;width:56px;height:56px;border-radius:16px;border:3px solid var(--bg);background:linear-gradient(135deg,var(--p2),var(--c,#22d3ee));display:grid;place-items:center;font-weight:900;font-size:.95rem;overflow:hidden;flex-shrink:0;box-shadow:0 8px 20px rgba(0,0,0,.35)}
.hub-ico img{width:100%;height:100%;object-fit:cover;display:block}
.hub-info{padding:0;border-bottom:0;flex:1;min-width:0}
.hub-info strong{font-size:1.05rem;font-weight:800;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hub-info p{font-size:.72rem;color:var(--m);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hub-info .roles-line{margin-top:4px;display:flex;flex-wrap:wrap;gap:4px}
.messages{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 14px;user-select:text}
.messages .msg{margin-bottom:4px}.msg .meta{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.msg .name{font-weight:700;color:var(--p);font-size:.88rem}.msg .time{font-size:.65rem;color:var(--m)}.msg .txt{font-size:.9rem;margin-top:3px;line-height:1.4;word-break:break-word}.msg img.att{margin-top:8px;border-radius:12px;max-height:200px;object-fit:cover;border:1px solid var(--b)}.msg .act button{border:0;background:0;color:var(--m);font-size:.7rem;cursor:pointer;padding:2px 6px}
.composer{flex-shrink:0;padding:8px 10px calc(8px + var(--safe));background:var(--elev);border-top:1px solid var(--line)}
.composer-tools{display:flex;gap:6px;margin-bottom:8px;overflow-x:auto}
.chip{flex-shrink:0;height:32px;padding:0 12px;border-radius:999px;border:1px solid var(--b);background:var(--row);font-size:.75rem;font-weight:700;cursor:pointer}
.composer,.composer-row,#input,#send{pointer-events:auto!important}.composer-row{display:flex;gap:8px}.composer-row input{flex:1;height:42px;border-radius:12px;border:1px solid var(--b);background:var(--bg);padding:0 14px;outline:0;user-select:text}
.composer-row button.send{height:42px;padding:0 16px;border:0;border-radius:12px;background:linear-gradient(135deg,var(--p2),var(--p3));color:#fff;font-weight:800;cursor:pointer}
.voice-wrap{flex:1;display:flex;flex-direction:column;min-height:0;background:linear-gradient(180deg,#1a1028 0%,var(--bg) 40%)}
.voice-head{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line);background:rgba(0,0,0,.25)}
.voice-head strong{flex:1;font-size:.95rem}
.voice-status{font-size:.7rem;color:var(--m);padding:0 14px 8px}
.voice-status.live{color:#4ade80}
.voice-lobby{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center}
.voice-lobby .big-icon{width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,rgba(124,58,237,.35),rgba(168,85,247,.15));border:1px solid rgba(168,85,247,.4);display:flex;align-items:center;justify-content:center;font-size:2.2rem;box-shadow:0 0 40px rgba(124,58,237,.25)}
.voice-lobby h2{font-size:1.15rem;font-weight:800;margin:0}
.voice-lobby p{font-size:.82rem;color:var(--m);max-width:280px;line-height:1.45;margin:0}
.btn-join-voice{appearance:none;border:0;cursor:pointer;padding:14px 28px;border-radius:14px;font-weight:800;font-size:.95rem;color:#fff;background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 8px 28px rgba(34,197,94,.35)}
.btn-join-voice:disabled{opacity:.55}
.voice-grid{flex:1;overflow:auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;align-content:start}
.vtile{min-height:140px;border-radius:16px;background:rgba(30,20,45,.9);border:2px solid rgba(255,255,255,.06);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;position:relative;overflow:hidden;padding:12px}
.vtile.speak{border-color:#22c55e;box-shadow:0 0 0 2px rgba(34,197,94,.25),0 0 24px rgba(34,197,94,.15)}
.vtile video{width:100%;height:140px;border-radius:12px;object-fit:cover;background:#000;cursor:zoom-in;display:block}.vtile img.av{width:72px;height:72px;border-radius:50%;object-fit:cover;background:#0d0814;cursor:pointer}
.vtile .av-fallback{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.4rem;color:#fff;background:linear-gradient(135deg,var(--p2),var(--p3))}
.vtile .nm{font-size:.78rem;font-weight:700;max-width:95%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vtile .badge{position:absolute;top:8px;right:8px;font-size:.6rem;padding:3px 7px;border-radius:8px;background:rgba(124,58,237,.55);font-weight:800}
.vtile .mic-badge{position:absolute;bottom:10px;right:10px;width:26px;height:26px;border-radius:50%;background:#e11d48;display:flex;align-items:center;justify-content:center;font-size:.7rem}
.voice-bar{flex-shrink:0;display:flex;align-items:center;justify-content:center;gap:12px;padding:14px;padding-bottom:calc(14px + var(--safe));background:rgba(12,8,20,.95);border-top:1px solid var(--line)}
.vbtn{width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.06);font-size:1.15rem;cursor:pointer}
.vbtn.on{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.12)}
.vbtn.mute{background:rgba(244,63,94,.3);border-color:rgba(244,63,94,.55)}
.vbtn.hang{background:#e11d48;border:0;color:#fff;width:56px;height:56px;box-shadow:0 6px 20px rgba(225,29,72,.4)}
.ch.voice-ch{color:#b8a0d4}
.ch.voice-ch.on{background:rgba(124,58,237,.2)}
.ch .vc-users{display:block;padding:2px 0 2px 18px;font-size:.72rem;color:#8b7aa8;font-weight:500}
.ch .vc-users .u{display:flex;align-items:center;gap:6px;padding:2px 0}
.ch .vc-users .dot{width:7px;height:7px;border-radius:50%;background:#22c55e;flex-shrink:0}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:60;display:none;align-items:flex-end;justify-content:center}.modal.on{display:flex}
.sheet{width:min(480px,100%);background:var(--panel);border-radius:18px 18px 0 0;padding:18px 16px calc(18px + var(--safe));border:1px solid var(--line)}
.sheet h3{text-align:center;margin-bottom:14px;font-size:1rem}
.opt{display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:12px;border:1px solid var(--line);margin-bottom:8px;cursor:pointer;background:var(--row)}
.opt.on{border-color:var(--p2);background:rgba(124,58,237,.2)}
.opt input{margin-top:4px}
.opt .tx strong{display:block;font-size:.9rem}.opt .tx span{font-size:.72rem;color:var(--m)}
.sheet .go{width:100%;margin-top:10px;padding:14px;border:0;border-radius:12px;background:#5865f2;color:#fff;font-weight:800}
.prof-scroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}
.prof-banner{height:110px;background:linear-gradient(135deg,#4c1d95,#0e7490);background-size:cover;background-position:center;position:relative}
.prof-av{position:absolute;left:16px;bottom:-34px;width:72px;height:72px;border-radius:50%;border:4px solid var(--bg);background:linear-gradient(135deg,var(--p2),#6366f1);overflow:hidden;display:grid;place-items:center;font-weight:900}
.prof-av img{width:100%;height:100%;object-fit:cover}
.prof-body{padding:42px 16px 24px}
.prof-body h2{font-size:1.25rem;background:linear-gradient(90deg,var(--p),#fff);-webkit-background-clip:text;background-clip:text;color:transparent}
.prof-handle{font-size:.8rem;color:var(--m);margin:4px 0 12px}
.btn-block{width:100%;padding:12px;border-radius:12px;border:0;background:#2a2438;color:var(--t);font-weight:700;cursor:pointer;margin-bottom:12px}
.btn-block.primary{background:linear-gradient(135deg,var(--p2),var(--p3));color:#fff}
.btn-block.danger{background:rgba(244,63,94,.15);color:#fda4af}
.section-label{font-size:.7rem;font-weight:700;color:var(--m);text-transform:uppercase;letter-spacing:.04em;margin:16px 0 8px}
.card-list{background:var(--panel);border-radius:var(--radius);overflow:hidden;border:1px solid var(--line)}
.card-row{display:flex;align-items:center;gap:12px;padding:14px;border-bottom:1px solid var(--line);cursor:pointer;background:transparent;width:100%;text-align:left;border-left:0;border-right:0;border-top:0;color:var(--t)}
.card-row:last-child{border-bottom:0}.card-row .ic{width:28px;text-align:center}.card-row .lab{flex:1;font-size:.92rem;font-weight:600}.card-row .val{font-size:.8rem;color:var(--m)}.card-row .chev{color:var(--m)}
.bio-box{background:var(--panel);border-radius:var(--radius);padding:12px 14px;font-size:.85rem;line-height:1.45;color:#d4c8ec;border:1px solid var(--line);white-space:pre-wrap;user-select:text}
.tok{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;background:var(--row);border:1px solid var(--b);margin:10px 0}
.tok code{flex:1;font-size:.72rem;font-family:ui-monospace,monospace;color:var(--p);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tok button{border:0;background:0;cursor:pointer;font-size:1rem}
.badge-admin{display:inline-block;padding:2px 8px;border-radius:6px;background:linear-gradient(135deg,var(--p2),var(--c));font-size:.65rem;font-weight:800;margin-left:6px}
.overlay,.ov{pointer-events:none}.overlay.on,.ov.on{pointer-events:auto}.settings{position:fixed;inset:0;background:var(--bg);z-index:120;display:none!important;flex-direction:column;pointer-events:none}.settings.on{display:flex!important;visibility:visible!important;pointer-events:auto!important}.set-top .icon-btn{position:relative;z-index:130;pointer-events:auto!important;min-width:44px;min-height:44px}
.set-top{height:52px;display:flex;align-items:center;gap:10px;padding:0 12px;border-bottom:1px solid var(--line);background:var(--bg2);flex-shrink:0}
.set-top h2{flex:1;font-size:1rem}.set-body{flex:1;overflow-y:auto;padding:12px 14px 24px;-webkit-overflow-scrolling:touch}
.group-title{font-size:.72rem;color:var(--m);font-weight:700;margin:14px 0 8px;text-transform:uppercase}
.toggle{width:42px;height:24px;border-radius:99px;background:#3f3a4d;position:relative;border:0;cursor:pointer;flex-shrink:0}.toggle.on{background:var(--p2)}.toggle::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s}.toggle.on::after{transform:translateX(18px)}
.field{margin-bottom:14px}.field label{display:block;font-size:.72rem;color:var(--m);margin-bottom:6px;font-weight:700}.field input,.field textarea,.field select{width:100%;padding:11px 12px;border-radius:10px;border:1px solid var(--b);background:var(--row);outline:0;user-select:text}.field textarea{min-height:90px;resize:vertical}
.sb-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:10px 12px;border-bottom:1px solid var(--line)}
.sb-tabs button{padding:10px;border-radius:10px;border:1px solid var(--b);background:var(--row);font-weight:700;cursor:pointer}.sb-tabs button.on{background:rgba(124,58,237,.35);border-color:var(--p)}
.sb-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;overflow:auto;flex:1}
.sb-pad{padding:14px 10px;border-radius:12px;border:1px solid var(--b);background:var(--row);font-weight:700;font-size:.8rem;cursor:pointer}
.sb-item{display:flex;align-items:center;gap:8px;margin:0 12px 8px;padding:10px;border-radius:12px;background:var(--panel);border:1px solid var(--line)}
.sb-item span{flex:1;font-size:.85rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-item button{border:0;border-radius:8px;padding:6px 10px;font-weight:700;font-size:.72rem;cursor:pointer;background:rgba(124,58,237,.3)}.sb-item button.del{background:rgba(244,63,94,.2);color:#fda4af}
.nav{flex-shrink:0;height:calc(var(--nav) + var(--safe));padding-bottom:var(--safe);display:grid;grid-template-columns:repeat(5,1fr);background:var(--bg2);border-top:1px solid var(--line)}
.nav button{border:0;background:0;color:var(--m);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:.6rem;font-weight:700;cursor:pointer}.nav button.on{color:#fff}.nav .ic{font-size:1.15rem}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:40;opacity:0;pointer-events:none;transition:.2s}.overlay.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;bottom:0;left:0;width:min(290px,88vw);background:var(--bg2);z-index:41;transform:translateX(-105%);transition:.22s;display:flex;flex-direction:column;border-right:1px solid var(--line)}.drawer.on{transform:none}
.drawer .dh{padding:0;border-bottom:1px solid var(--line);position:relative;z-index:5}
.dh-btn{width:100%;display:flex;align-items:center;gap:8px;padding:14px 12px;border:0;background:0;color:var(--t);font-weight:800;font-size:.95rem;cursor:pointer;text-align:left}
.dh-btn:hover{background:rgba(124,58,237,.12)}
.dh-btn .chev{margin-left:auto;font-size:.7rem;color:var(--m);transition:transform .15s}
.dh-btn.open .chev{transform:rotate(180deg)}
.srv-menu{display:none;position:absolute;left:8px;right:8px;top:calc(100% - 4px);background:var(--elev);border:1px solid var(--line);border-radius:12px;box-shadow:0 16px 40px rgba(0,0,0,.55);padding:8px;z-index:50;max-height:min(60vh,360px);overflow:auto}
.srv-menu.on{display:block}
.srv-item{display:flex;align-items:center;gap:10px;width:100%;padding:10px;border:0;border-radius:10px;background:0;color:var(--t);cursor:pointer;text-align:left;font-size:.85rem}
.srv-item:hover,.srv-item.on{background:rgba(124,58,237,.2)}
.srv-ico{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,var(--p2),var(--p3));display:grid;place-items:center;font-weight:900;font-size:.75rem;flex-shrink:0}
.srv-meta{flex:1;min-width:0}
.srv-meta strong{display:block;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.srv-meta span{font-size:.68rem;color:var(--m)}
.srv-actions{display:grid;gap:6px;padding:8px 4px 4px;border-top:1px solid var(--line);margin-top:6px}
.srv-actions button{width:100%;padding:10px;border-radius:10px;border:1px solid var(--b);background:var(--row);color:var(--t);font-weight:700;cursor:pointer;font-size:.82rem}
.srv-actions button.primary{background:linear-gradient(135deg,var(--p2),var(--p3));border:0;color:#fff}
.srv-modal{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:80;display:none;align-items:center;justify-content:center;padding:16px}
.srv-modal.on{display:flex}
.srv-sheet{width:min(400px,100%);background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px}
.srv-sheet h3{margin-bottom:12px;font-size:1rem}
.drawer .db{flex:1;overflow:auto;padding:10px}
.ch{display:block;width:100%;text-align:left;padding:11px 12px;margin-bottom:4px;border-radius:10px;border:0;background:0;color:var(--m);font-weight:600;cursor:pointer}.ch.on{background:rgba(124,58,237,.25);color:#fff}
.toast{position:fixed;left:50%;bottom:calc(var(--nav) + 12px + var(--safe));transform:translateX(-50%);background:var(--panel);border:1px solid var(--b);padding:10px 14px;border-radius:12px;font-size:.82rem;z-index:50;display:none;max-width:90vw}.toast.on{display:block}
.hidden{display:none!important}.announce{margin:10px 14px;padding:10px 12px;border-radius:12px;background:rgba(124,58,237,.15);border:1px solid var(--b);font-size:.8rem;line-height:1.4}
.report-card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:10px}
.report-card .st{font-size:.7rem;font-weight:800;text-transform:uppercase}.report-card .st.open{color:#fbbf24}.report-card .st.resolved{color:var(--ok)}.report-card .st.rejected{color:var(--danger)}
.pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:.65rem;font-weight:800;background:rgba(192,132,252,.2);color:var(--p)}
.who{font-size:.65rem;color:var(--m);padding:0 14px 8px}

.role-pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:.68rem;font-weight:700;border:1px solid rgba(255,255,255,.12);margin:2px}
.role-list{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.srv-settings-btn{width:100%;padding:10px;border-radius:10px;border:1px solid var(--b);background:rgba(124,58,237,.15);color:var(--p);font-weight:700;cursor:pointer;font-size:.82rem;margin-top:4px}
.hub-banner.has-img{background-size:cover;background-position:center}
.hub-info .roles-line{margin-top:6px}

.perm-grid{display:grid;gap:6px;margin-top:8px;max-height:200px;overflow:auto;padding:8px;background:rgba(0,0,0,.25);border-radius:10px;border:1px solid var(--line)}
.perm-row{display:flex;align-items:center;gap:8px;font-size:.78rem;color:var(--t)}
.perm-row input{width:16px;height:16px;accent-color:var(--p2)}
.role-pill.sel{outline:2px solid var(--p);outline-offset:1px}
.perm-hint{font-size:.68rem;color:var(--m);margin-top:4px}

.ch.locked{opacity:.45;position:relative}
.ch.locked::after{content:"🔒";float:right;font-size:.75rem}
.ch-hidden{display:none!important}
.chan-perm-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0;font-size:.75rem}
.chan-perm-row select{flex:1;min-width:120px;padding:6px;border-radius:8px;border:1px solid var(--b);background:var(--bg);color:var(--t)}

.picker-sheet{position:fixed;left:0;right:0;bottom:calc(var(--nav) + var(--safe));z-index:70;max-height:45vh;background:var(--panel);border-top:1px solid var(--line);border-radius:16px 16px 0 0;padding:12px;display:none;flex-direction:column;gap:8px;box-shadow:0 -12px 40px rgba(0,0,0,.5)}
.picker-sheet.on{display:flex}
.picker-sheet .ph{display:flex;align-items:center;gap:8px}
.picker-sheet .ph strong{flex:1;font-size:.9rem}
.picker-sheet input[type=search]{width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--b);background:var(--bg);color:var(--t)}
.emoji-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;overflow:auto;max-height:28vh}
.emoji-grid button{border:0;background:var(--row);border-radius:8px;font-size:1.25rem;padding:8px;cursor:pointer}
.gif-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;overflow:auto;max-height:28vh}
.gif-grid img{width:100%;border-radius:10px;cursor:pointer;aspect-ratio:1.2;object-fit:cover;background:var(--row)}
.member-panel{position:fixed;top:0;right:0;bottom:0;width:min(360px,86vw);max-width:86vw;background:var(--bg2);z-index:40;transform:translateX(105%);transition:transform .22s,visibility .22s;border-left:1px solid var(--line);display:flex;flex-direction:column;pointer-events:none;visibility:hidden}
.member-panel.on{transform:translateX(0);pointer-events:auto;visibility:visible}
.member-panel:not(.on){pointer-events:none}
.member-panel .mh{padding:14px;font-weight:800;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:8px}
.member-panel .mh button{margin-left:auto;border:0;background:var(--row);border-radius:8px;padding:6px 10px;color:var(--t);cursor:pointer}
.member-list{flex:1;overflow:auto;padding:10px}

.member-row{display:grid;grid-template-columns:42px 1fr;grid-template-rows:auto auto;column-gap:12px;row-gap:8px;align-items:center;padding:10px;border-radius:14px;margin-bottom:8px}
.member-row .av{width:42px;height:42px;border-radius:50%;flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,#4c1d95,#7c3aed);display:grid;place-items:center;font-weight:800;font-size:.72rem;color:#fff}
.member-row .av[data-avchange="1"]{cursor:pointer;box-shadow:0 0 0 2px rgba(239,68,68,.55)}
.member-row .meta{flex:1;min-width:0}
.member-row .name-line{display:flex;align-items:center;gap:6px;flex-wrap:nowrap;overflow:hidden}
.member-row .name-line .dev-wrap,.member-row .name-line .hunt-wrap{flex-shrink:1;min-width:0}
.member-row .sub-line{display:block;font-size:.72rem;color:var(--m);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.badge-tip{cursor:pointer}
.badge-modal{position:fixed;inset:0;z-index:240;display:none;align-items:center;justify-content:center;background:rgba(4,2,12,.72);backdrop-filter:blur(10px);padding:18px}
.badge-modal.on{display:flex}
.badge-card{width:min(420px,100%);border-radius:22px;padding:22px 20px 18px;background:linear-gradient(180deg,rgba(20,12,36,.96),rgba(10,6,20,.98));border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 60px rgba(0,0,0,.5);text-align:center;position:relative;overflow:hidden}
.badge-card:before{content:"";position:absolute;inset:-40% -20% auto;height:70%;background:radial-gradient(circle,var(--bc,#7c3aed) 0%,transparent 70%);opacity:.35;pointer-events:none}
.badge-ico{width:76px;height:76px;border-radius:22px;margin:8px auto 14px;display:grid;place-items:center;font-size:2rem;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.12);position:relative;z-index:1;box-shadow:0 0 24px color-mix(in srgb, var(--bc,#7c3aed) 50%, transparent)}
.badge-card h3{margin:0 0 8px;font-size:1.15rem;position:relative;z-index:1}
.badge-card p{margin:0;color:var(--m);font-size:.88rem;line-height:1.45;position:relative;z-index:1}
.badge-card .badge-x{position:absolute;top:10px;right:10px;z-index:2}
.member-row .av{grid-column:1;grid-row:1}
.member-row .meta{grid-column:2;grid-row:1;min-width:0}
.member-row .acts{grid-column:1/-1;grid-row:2;display:flex;flex-direction:row;flex-wrap:nowrap;gap:6px;max-width:none;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:2px}
.member-row .acts button{flex:0 0 auto;width:auto;display:inline-flex;align-items:center;justify-content:center;padding:5px 10px;font-size:.7rem;border-radius:999px;white-space:nowrap}
.you-chip{font-size:.58rem;padding:1px 6px;border-radius:999px;border:1px solid rgba(255,255,255,.18);color:#c4b5fd;flex-shrink:0}


.member-row:hover{background:rgba(124,58,237,.12)}
.member-row .av{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--p2),var(--p3));display:grid;place-items:center;font-weight:800;font-size:.75rem}
.member-row .meta{flex:1;min-width:0}
.member-row .meta strong{display:block;font-size:.85rem}
.member-row .meta span{font-size:.68rem;color:var(--m)}
.member-row .acts{display:flex;gap:4px}
.member-row .acts button{border:0;background:var(--row);border-radius:8px;padding:6px 8px;font-size:.7rem;color:var(--t);cursor:pointer;font-weight:700}
.member-row .acts button.danger{background:rgba(244,63,94,.2);color:#fecdd3}
.attach-preview{display:none;padding:8px 10px;gap:8px;align-items:center;background:rgba(124,58,237,.1);border-top:1px solid var(--line)}
.attach-preview.on{display:flex}
.attach-preview img{height:48px;border-radius:8px}
.attach-preview span{flex:1;font-size:.75rem;color:var(--m);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.msg{position:relative}
.msg .msg-act{display:none;position:absolute;top:6px;right:8px;gap:4px}
.msg:hover .msg-act,.msg:focus-within .msg-act{display:flex}
.msg .msg-act button{border:0;background:var(--elev);border:1px solid var(--line);border-radius:8px;padding:4px 8px;font-size:.7rem;color:var(--t);cursor:pointer;font-weight:700}
.msg .msg-act button:hover{background:rgba(244,63,94,.2);color:#fecdd3}
.dot-on{display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:4px;box-shadow:0 0 8px #22c55e}
.dot-off{display:inline-block;width:8px;height:8px;border-radius:50%;background:#64748b;margin-right:4px}
.invite-row{display:flex;gap:8px;align-items:center;margin-top:6px}
.invite-row input{flex:1}

.msg.replying{outline:1px solid var(--p);outline-offset:2px;border-radius:10px}
.reply-bar{display:none;align-items:center;gap:8px;padding:8px 10px;background:rgba(124,58,237,.12);border-top:1px solid var(--line);font-size:.78rem}
.reply-bar.on{display:flex}
.reply-bar strong{color:var(--p)}
.reply-bar .x{margin-left:auto;border:0;background:0;color:var(--m);cursor:pointer;font-size:1rem}
.msg .quote{font-size:.72rem;color:var(--m);border-left:3px solid var(--p);padding:4px 8px;margin-bottom:4px;opacity:.9}
.unread-pill{display:inline-block;background:#e11d48;color:#fff;font-size:.65rem;font-weight:800;padding:1px 6px;border-radius:999px;margin-left:6px}
.ch .unread-pill{float:right;margin-top:2px}

.msg .reacts{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.msg .reacts button{border:1px solid var(--line);background:var(--row);border-radius:999px;padding:2px 8px;font-size:.75rem;cursor:pointer;color:var(--t)}
.msg .reacts button.mine{border-color:var(--p);background:rgba(124,58,237,.2)}
.typing-line{min-height:18px;font-size:.75rem;color:var(--m);padding:0 4px 4px;opacity:.9}
.search-bar{display:none;padding:8px 10px;gap:8px;background:var(--panel);border-bottom:1px solid var(--line);align-items:center}
.search-bar.on{display:flex}
.search-bar input{flex:1;height:36px;border-radius:10px;border:1px solid var(--b);background:var(--bg);padding:0 12px;color:var(--t)}
.msg.search-hide{display:none!important}

.fab-bottom{position:fixed;right:14px;bottom:calc(var(--nav) + 70px + var(--safe));z-index:35;width:42px;height:42px;border-radius:50%;border:0;background:linear-gradient(135deg,var(--p2),var(--p3));color:#fff;font-size:1.2rem;box-shadow:0 8px 24px rgba(124,58,237,.45);cursor:pointer;display:none}
.fab-bottom.on{display:grid;place-items:center}
.conn-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;margin-right:6px}
.conn-dot.off{background:#ef4444}
.char-count{font-size:.65rem;color:var(--m);text-align:right;padding:0 4px}
.spoiler{background:var(--t);color:transparent;border-radius:4px;cursor:pointer;padding:0 4px}
.spoiler.on{background:rgba(124,58,237,.25);color:var(--t)}
.msg .txt code{background:var(--row);padding:1px 6px;border-radius:6px;font-size:.85em}
.msg .txt pre{background:var(--row);padding:8px;border-radius:8px;overflow:auto;font-size:.8rem}
.quick-react{display:flex;gap:2px}
.shortcuts-modal{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.65);display:none;align-items:center;justify-content:center;padding:16px}
.shortcuts-modal.on{display:flex}
.shortcuts-sheet{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px;max-width:360px;width:100%;max-height:80vh;overflow:auto}
.shortcuts-sheet h3{margin:0 0 10px}
.shortcuts-sheet kbd{background:var(--row);padding:2px 6px;border-radius:6px;font-size:.75rem;border:1px solid var(--line)}
.compact .msg{padding:6px 10px}
.compact .hub-banner{height:48px}
body.reduce-motion *{animation:none!important;transition:none!important}
.status-line{font-size:.75rem;color:var(--m);padding:4px 0}
#input{field-sizing:content;min-height:42px}

.pin-bar{display:none;padding:8px 12px;background:rgba(245,158,11,.12);border-bottom:1px solid rgba(245,158,11,.35);font-size:.8rem;cursor:pointer}
.pin-bar.on{display:block}
.pin-bar strong{color:#fbbf24}
.ch.fav::before{content:"* ";color:#fbbf24}
.topic-line{font-size:.72rem;color:var(--m);padding:4px 12px;border-bottom:1px solid var(--line);min-height:20px}
.voice-presets{display:flex;gap:6px;flex-wrap:wrap;padding:8px 0}
.voice-presets button{flex:1;min-width:70px}

.friends-panel{position:fixed;top:0;left:0;bottom:0;width:min(320px,92vw);background:var(--bg2);z-index:46;transform:translateX(-105%);transition:.22s;border-right:1px solid var(--line);display:flex;flex-direction:column}
.friends-panel.on{transform:none}
.friends-panel .fh{padding:14px;font-weight:800;border-bottom:1px solid var(--line);display:flex;gap:8px;align-items:center}
.friends-tabs{display:flex;gap:4px;padding:8px;flex-wrap:wrap}
.friends-tabs button{font-size:.7rem;padding:6px 10px}
.friends-list{flex:1;overflow:auto;padding:8px}
.status-sel{display:flex;gap:6px;padding:8px;flex-wrap:wrap}
.status-sel button{font-size:.7rem}
.status-sel button.on{outline:1px solid var(--p)}
.inbox-badge{background:#e11d48;color:#fff;border-radius:999px;padding:0 6px;font-size:.65rem;margin-left:4px}

.v-tile{background:var(--row);border:1px solid var(--line);border-radius:14px;padding:14px;text-align:center;min-height:100px}
.v-tile.me{outline:1px solid var(--p)}
.v-av{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--p2),var(--p3));display:grid;place-items:center;margin:0 auto 8px;font-weight:800}
.v-name{font-size:.85rem;font-weight:700}
.v-state{font-size:.7rem;color:var(--m);margin-top:4px}
#voice-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;padding:12px;overflow:auto}

.vtile.cam-on{padding:8px;justify-content:flex-start}
.vtile video.cam-preview{width:100%;height:140px;border-radius:12px;object-fit:cover;background:#111;cursor:zoom-in;display:block}
.vtile img.av{cursor:pointer}
.cam-lightbox{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(8px)}
.cam-lightbox.on{display:flex}
.cam-lightbox .box{position:relative;max-width:min(920px,96vw);max-height:90vh;border-radius:18px;overflow:hidden;border:1px solid rgba(192,132,252,.35);box-shadow:0 20px 60px rgba(0,0,0,.5);background:#0a0612}
.cam-lightbox video,.cam-lightbox img{display:block;max-width:100%;max-height:80vh;width:100%;object-fit:contain;background:#000}
.cam-lightbox .cap{padding:10px 14px;font-size:.9rem;color:var(--t);background:rgba(18,12,28,.95)}
.cam-lightbox .x{position:absolute;top:10px;right:10px;border:0;background:rgba(0,0,0,.55);color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1.1rem;z-index:2}

.prof-handle{font-size:.78rem;color:var(--m);letter-spacing:.02em}
.prof-handle .tag,.utag{opacity:.65;font-weight:600;font-size:.72em;margin-left:4px}

.member-search{padding:10px;border-bottom:1px solid var(--line)}
.member-search input{width:100%;height:38px;border-radius:10px;border:1px solid var(--line);background:rgba(0,0,0,.35);padding:0 12px;color:var(--t);outline:none}
.member-row{flex-wrap:wrap}
.member-row .acts{display:flex;flex-wrap:wrap;gap:4px;width:100%;margin-top:6px}
.member-row .acts button{font-size:.65rem;padding:5px 8px;border-radius:8px;border:1px solid var(--line);background:rgba(124,58,237,.12);color:var(--t);cursor:pointer}
.member-row .acts button:hover{background:rgba(124,58,237,.28)}
.member-row .tag-wrap{display:inline-flex;align-items:center;gap:4px;font-size:.72rem;color:var(--m);margin-left:4px}
.member-row .tag-wrap button.eye{border:0;background:transparent;color:var(--m);cursor:pointer;padding:0 2px;font-size:.8rem;line-height:1}
.member-row .tag-val{font-variant-numeric:tabular-nums;letter-spacing:.04em}
.member-row .tag-val.masked{opacity:.7}
.member-empty{color:var(--m);padding:14px;font-size:.85rem;text-align:center}
.member-panel .mh span.sub{font-weight:500;font-size:.72rem;color:var(--m);margin-left:auto}

/* Modern file pickers */
input[type=file]:not(.hidden):not([hidden]){
  position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;
  overflow:hidden!important;clip:rect(0,0,0,0)!important;border:0!important;padding:0!important;margin:0!important;
}
.file-btn{
  display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px 0 10px;
  border-radius:10px;border:1px solid rgba(192,132,252,.35);
  background:linear-gradient(135deg,rgba(124,58,237,.22),rgba(168,85,247,.12));
  color:var(--t,#f5f0ff);font-size:.78rem;font-weight:600;cursor:pointer;
  transition:.15s background,.15s border-color,.15s transform;max-width:100%;
}
.file-btn:hover{background:linear-gradient(135deg,rgba(124,58,237,.4),rgba(168,85,247,.22));border-color:rgba(192,132,252,.55)}
.file-btn:active{transform:scale(.98)}
.file-btn .fi{width:22px;height:22px;border-radius:7px;display:grid;place-items:center;
  background:linear-gradient(135deg,#7c3aed,#a855f7);font-size:.75rem;flex-shrink:0}
.file-btn .ft{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;opacity:.95}
.file-btn.has-file .ft{color:#c4b5fd}
.file-btn-wrap{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px}

/* User profile popup (Discord-like) */
.uprofile-overlay{position:fixed!important;inset:0!important;z-index:2147483000!important;background:rgba(4,2,12,.78);display:none!important;align-items:center;justify-content:center;padding:18px;pointer-events:none;isolation:isolate}
.uprofile-overlay.on{display:flex!important;pointer-events:auto!important;visibility:visible!important}
.uprofile{width:min(360px,92vw);max-height:min(88vh,640px);overflow:auto;border-radius:20px;background:var(--bg2,#0d0818);border:1px solid rgba(192,132,252,.28);box-shadow:0 24px 80px rgba(0,0,0,.55);position:relative;margin:0 auto}
.uprofile .uban{height:120px;background:linear-gradient(135deg,#2e1065,#7c3aed 50%,#22d3ee);background-size:cover;background-position:center;border-radius:16px 16px 0 0}
.uprofile .uav-wrap{padding:0 16px;margin-top:-40px;display:flex;align-items:flex-end;gap:10px}
.uprofile .uav{width:84px;height:84px;border-radius:50%;border:4px solid #12081c;background:linear-gradient(135deg,#7c3aed,#a855f7);display:grid;place-items:center;font-weight:800;overflow:hidden;margin:-36px auto 10px;position:relative;z-index:2}.uav img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block}
.uprofile .uav img{width:100%;height:100%;object-fit:cover}
.uprofile .ubody{padding:12px 16px 16px}
.uprofile .uname{font-size:1.25rem;font-weight:800}
.uprofile .uhandle{font-size:.8rem;color:var(--m,#9b8bb8);margin-top:2px}
.uprofile .ubio{margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(0,0,0,.25);font-size:.85rem;line-height:1.45;color:var(--t,#f5f0ff)}
.uprofile .uacts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.uprofile .uacts button{flex:1;min-width:120px;height:36px;border-radius:10px;border:1px solid rgba(192,132,252,.3);background:rgba(124,58,237,.2);color:var(--t,#f5f0ff);font-weight:600;font-size:.78rem;cursor:pointer}
.uprofile .uacts button.primary{background:linear-gradient(135deg,#7c3aed,#a855f7);border-color:transparent}
.uprofile .uacts button.pending{opacity:.75;background:rgba(255,255,255,.06)}
.uprofile .uacts button.friend{background:rgba(74,222,128,.15);border-color:rgba(74,222,128,.35)}
.uprofile .uclose{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.45);color:#fff;cursor:pointer;font-size:1rem}
.clickable-user{cursor:pointer}
.clickable-user:hover{text-decoration:underline;text-decoration-color:rgba(192,132,252,.5)}

/* Membres UI v2 */
.member-panel .mh span.sub{font-weight:600;font-size:.7rem;color:var(--m);margin-left:auto;background:rgba(124,58,237,.18);padding:3px 9px;border-radius:999px}
.member-search{padding:12px}
.member-search input{height:36px;border-radius:12px;border:1px solid rgba(192,132,252,.22);background:rgba(0,0,0,.3);font-size:.82rem}
.member-search input:focus{border-color:rgba(192,132,252,.5);box-shadow:0 0 0 3px rgba(124,58,237,.12)}
.member-list{padding:8px}
.member-row{display:grid!important;grid-template-columns:42px 1fr;gap:10px 12px;align-items:center;padding:12px!important;border-radius:14px!important;margin-bottom:6px;border:1px solid transparent;flex-wrap:nowrap!important}
.member-row:hover{background:rgba(124,58,237,.1)!important;border-color:rgba(192,132,252,.14)}
.member-row .av{width:42px!important;height:42px!important;border-radius:14px!important;box-shadow:0 4px 14px rgba(124,58,237,.22)}
.member-row .av img{width:100%;height:100%;object-fit:cover;border-radius:14px}
.member-row .meta strong{display:flex;align-items:center;gap:6px;font-size:.88rem;font-weight:700}
.member-row .meta span{font-size:.7rem;color:var(--m);margin-top:3px;display:block}
.member-row .acts{display:flex!important;flex-wrap:wrap;gap:6px!important;grid-column:1/-1;padding-left:54px;margin-top:2px}
.member-row .acts button{
  height:30px!important;padding:0 11px!important;border-radius:999px!important;font-size:.68rem!important;font-weight:600!important;
  border:1px solid rgba(192,132,252,.18)!important;background:rgba(124,58,237,.12)!important;color:var(--t)!important;cursor:pointer;
  width:auto!important;
}
.member-row .acts button:hover{background:rgba(124,58,237,.28)!important;border-color:rgba(192,132,252,.35)!important}
.member-row .acts button.primary,.member-row .acts button.friend{background:linear-gradient(135deg,#7c3aed,#a855f7)!important;border-color:transparent!important}
.member-row .acts button.pending{opacity:.7;background:rgba(255,255,255,.06)!important}
.member-row .acts button.danger{background:rgba(239,68,68,.15)!important;border-color:rgba(239,68,68,.3)!important;color:#fca5a5!important}
.member-row .dot-on{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 3px rgba(74,222,128,.2);display:inline-block}
.member-row .dot-off{width:8px;height:8px;border-radius:50%;background:#64748b;display:inline-block}

/* Chat messages Discord-like */
.messages .msg{
  position:relative !important;
  display:grid !important;
  grid-template-columns:40px minmax(0,1fr) !important;
  gap:10px !important;
  margin:0 0 4px !important;
  padding:8px 10px !important;
  border-radius:10px !important;
  background:transparent !important;
  color:inherit !important;
  font-size:inherit !important;
  font-weight:inherit !important;
}
.messages .msg:hover{background:rgba(124,58,237,.08) !important}
.messages .msg .mav{
  width:40px;height:40px;border-radius:50%;
  background:linear-gradient(135deg,#7c3aed,#a855f7);
  display:grid;place-items:center;font-weight:800;font-size:.72rem;overflow:hidden;
  cursor:pointer;box-shadow:0 2px 10px rgba(124,58,237,.25);flex-shrink:0
}
.messages .msg .mav img{width:100%;height:100%;object-fit:cover;display:block}
.messages .msg .mbody{min-width:0;display:block}
.messages .msg .meta{display:flex !important;align-items:baseline;gap:8px;flex-wrap:wrap;margin:0}
.messages .msg .name{font-weight:700;color:#c4b5fd !important;font-size:.9rem;cursor:pointer;display:inline}
.messages .msg .name:hover{text-decoration:underline;color:#e9d5ff}
.messages .msg .time{font-size:.65rem;color:var(--m,#9b8bb8);display:inline}
.messages .msg .txt{display:block !important;font-size:.9rem;margin-top:3px;line-height:1.45;word-break:break-word;color:var(--t,#f5f0ff);font-weight:400}
.messages .msg img.att{display:block;margin-top:8px;border-radius:12px;max-height:220px;max-width:min(100%,320px);object-fit:cover;border:1px solid rgba(192,132,252,.2)}
.messages .msg .quote{display:block;font-size:.75rem;color:var(--m);border-left:3px solid #a855f7;padding:4px 10px;margin-bottom:6px;background:rgba(124,58,237,.08);border-radius:0 8px 8px 0}
.messages .msg .msg-act{display:none;position:absolute;top:-14px;right:8px;gap:2px;padding:3px;background:#120a1c;border:1px solid rgba(192,132,252,.3);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.45);z-index:6}
.messages .msg:hover .msg-act,.messages .msg:focus-within .msg-act{display:flex}
.messages .msg .msg-act button{border:0;background:transparent;color:var(--t);border-radius:7px;padding:5px 8px;font-size:.72rem;font-weight:600;cursor:pointer}
.messages .msg .msg-act button:hover{background:rgba(124,58,237,.3)}
.messages .msg .reacts{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.messages .msg .reacts button{border:1px solid rgba(192,132,252,.2);background:rgba(124,58,237,.12);border-radius:999px;padding:2px 9px;font-size:.78rem;cursor:pointer;color:var(--t)}
.messages .msg .reacts button.mine{border-color:rgba(168,85,247,.55);background:rgba(168,85,247,.22)}
#reply-bar{display:none;align-items:center;gap:8px;padding:8px 12px;background:rgba(124,58,237,.12);border-top:1px solid rgba(192,132,252,.2);font-size:.8rem}
#reply-bar.on{display:flex}

/* Chat bubble layout — isolated class */
#messages .cmsg, .messages .cmsg{
  position:relative !important;
  display:flex !important;
  flex-direction:row !important;
  align-items:flex-start !important;
  gap:12px !important;
  margin:0 0 6px !important;
  padding:8px 12px !important;
  border-radius:10px !important;
  background:transparent !important;
  color:var(--t,#f5f0ff) !important;
  font-size:15px !important;
  font-weight:400 !important;
  line-height:1.4 !important;
  box-sizing:border-box !important;
  width:100% !important;
  max-width:100% !important;
  float:none !important;
  clear:both !important;
}
#messages .cmsg:hover, .messages .cmsg:hover{background:rgba(124,58,237,.08) !important}
#messages .cmsg .mav, .messages .cmsg .mav{
  width:40px !important;height:40px !important;min-width:40px !important;
  border-radius:50% !important;
  background:linear-gradient(135deg,#7c3aed,#a855f7) !important;
  display:flex !important;align-items:center !important;justify-content:center !important;
  font-weight:800 !important;font-size:.75rem !important;overflow:hidden !important;
  cursor:pointer !important;flex-shrink:0 !important;
}
#messages .cmsg .mav img, .messages .cmsg .mav img{width:100% !important;height:100% !important;object-fit:cover !important;display:block !important}
#messages .cmsg .mbody, .messages .cmsg .mbody{flex:1 1 auto !important;min-width:0 !important;display:block !important;overflow:hidden !important}
#messages .cmsg .meta, .messages .cmsg .meta{display:flex !important;flex-direction:row !important;align-items:baseline !important;gap:8px !important;flex-wrap:wrap !important;margin:0 0 2px !important}
#messages .cmsg .name, .messages .cmsg .name{font-weight:700 !important;color:#c4b5fd !important;font-size:.9rem !important;cursor:pointer !important;display:inline !important}
#messages .cmsg .time, .messages .cmsg .time{font-size:.65rem !important;color:#9b8bb8 !important;display:inline !important}
#messages .cmsg .txt, .messages .cmsg .txt{
  display:block !important;font-size:.92rem !important;margin:2px 0 0 !important;
  line-height:1.45 !important;word-break:break-word !important;white-space:pre-wrap !important;
  color:#f5f0ff !important;font-weight:400 !important;float:none !important;clear:both !important
}
#messages .cmsg .quote, .messages .cmsg .quote{display:block !important;font-size:.75rem !important;color:#9b8bb8 !important;border-left:3px solid #a855f7 !important;padding:4px 10px !important;margin:0 0 6px !important;background:rgba(124,58,237,.1) !important;border-radius:0 8px 8px 0 !important}
#messages .cmsg .msg-act, .messages .cmsg .msg-act{display:none;position:absolute;top:-14px;right:8px;gap:2px;padding:3px;background:#120a1c;border:1px solid rgba(192,132,252,.3);border-radius:10px;z-index:6}
#messages .cmsg:hover .msg-act, .messages .cmsg:focus-within .msg-act{display:flex}
#messages .cmsg .msg-act button{border:0;background:transparent;color:#f5f0ff;border-radius:7px;padding:5px 8px;font-size:.72rem;font-weight:600;cursor:pointer}
#messages .cmsg .reacts{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
#messages .cmsg .reacts button{border:1px solid rgba(192,132,252,.25);background:rgba(124,58,237,.12);border-radius:999px;padding:2px 9px;font-size:.78rem;cursor:pointer;color:#f5f0ff}
#messages .cmsg .reacts button.mine{border-color:rgba(168,85,247,.55);background:rgba(168,85,247,.22)}
#messages .cmsg img.att{display:block;margin-top:8px;border-radius:12px;max-height:220px;max-width:min(100%,320px);object-fit:cover}

/* ===== ULTRAVOC POLISH 2026 ===== */
:root{
  --glow:0 0 24px rgba(124,58,237,.35);
  --glass:rgba(13,8,24,.72);
  --line2:rgba(192,132,252,.14);
  --soft:rgba(124,58,237,.12);
}
*{scrollbar-width:thin;scrollbar-color:rgba(124,58,237,.4) transparent}
*::-webkit-scrollbar{width:8px;height:8px}
*::-webkit-scrollbar-thumb{background:rgba(124,58,237,.4);border-radius:99px}
*::-webkit-scrollbar-thumb:hover{background:rgba(168,85,247,.55)}
*::-webkit-scrollbar-track{background:transparent}

body,.app{
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(124,58,237,.22), transparent 60%),
    radial-gradient(900px 500px at 100% 0%, rgba(34,211,238,.08), transparent 50%),
    var(--bg,#07040f) !important;
  background-attachment:fixed;
}

/* Header glass */
.top{
  height:54px !important;
  background:var(--glass) !important;
  backdrop-filter:blur(16px) saturate(1.2);
  -webkit-backdrop-filter:blur(16px) saturate(1.2);
  border-bottom:1px solid var(--line2) !important;
  box-shadow:0 4px 24px rgba(0,0,0,.25);
}
.top h1,.top .title{font-weight:800;letter-spacing:.01em}
.icon-btn{
  width:38px !important;height:38px !important;border-radius:12px !important;
  border:1px solid var(--line2) !important;background:rgba(124,58,237,.1) !important;
  transition:.15s transform,.15s background,.15s border-color !important;
}
.icon-btn:hover{background:rgba(124,58,237,.28) !important;border-color:rgba(192,132,252,.4) !important;transform:translateY(-1px)}
.icon-btn:active{transform:scale(.96)}

/* Banner */
.hub-banner,#hub-banner{
  height:110px !important;
  background-size:cover !important;background-position:center !important;
  position:relative;overflow:hidden;
}
.hub-banner::after,#hub-banner::after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 30%,rgba(7,4,15,.85));
  pointer-events:none;
}

/* Channel topic / announce */
.announce,#announce-box{
  border-radius:14px !important;
  border:1px solid var(--line2) !important;
  background:linear-gradient(135deg,rgba(124,58,237,.18),rgba(34,211,238,.06)) !important;
  box-shadow:0 4px 20px rgba(124,58,237,.12);
  font-weight:600;
}
#topic-line{opacity:.85;font-size:.78rem}

/* Composer premium */
.composer{
  padding:10px 12px calc(10px + var(--safe,0px)) !important;
  background:var(--glass) !important;
  backdrop-filter:blur(14px);
  border-top:1px solid var(--line2) !important;
  box-shadow:0 -8px 32px rgba(0,0,0,.2);
}
.composer-tools{gap:8px !important;margin-bottom:10px !important;padding-bottom:2px}
.chip{
  height:34px !important;padding:0 14px !important;border-radius:12px !important;
  border:1px solid var(--line2) !important;background:rgba(124,58,237,.1) !important;
  color:var(--t,#f5f0ff) !important;font-size:.72rem !important;font-weight:700 !important;
  transition:.15s background,.15s transform,.15s border-color !important;
}
.chip:hover{background:rgba(124,58,237,.28) !important;border-color:rgba(192,132,252,.4) !important;transform:translateY(-1px)}
.chip:active{transform:scale(.96)}
select.chip{appearance:none;padding-right:22px !important}
.composer-row{gap:10px !important;align-items:flex-end}
.composer-row input,#input,textarea#input{
  flex:1;min-height:44px !important;border-radius:14px !important;
  border:1px solid var(--line2) !important;
  background:rgba(0,0,0,.35) !important;
  color:var(--t,#f5f0ff) !important;
  padding:10px 14px !important;font-size:.9rem !important;
  outline:none !important;transition:.15s border-color,.15s box-shadow !important;
}
.composer-row input:focus,#input:focus,textarea#input:focus{
  border-color:rgba(168,85,247,.55) !important;
  box-shadow:0 0 0 3px rgba(124,58,237,.2) !important;
}
#send,.composer-row .send,button.send{
  height:44px !important;padding:0 18px !important;border-radius:14px !important;border:0 !important;
  background:linear-gradient(135deg,#7c3aed,#a855f7 50%,#22d3ee) !important;
  background-size:180% 180% !important;
  color:#fff !important;font-weight:800 !important;font-size:.85rem !important;
  cursor:pointer;box-shadow:0 6px 20px rgba(124,58,237,.35);
  transition:.2s transform,.2s box-shadow,.4s background-position !important;
}
#send:hover,.composer-row .send:hover,button.send:hover{
  transform:translateY(-1px);box-shadow:0 8px 28px rgba(124,58,237,.5);
  background-position:100% 50% !important;
}
#send:active{transform:scale(.97)}

/* Bottom nav */
.bottom-nav,nav.tabs,.app-nav,.dock{
  background:var(--glass) !important;backdrop-filter:blur(16px);
  border-top:1px solid var(--line2) !important;
}
.bottom-nav button,nav.tabs button,.dock button{
  transition:.15s color,.15s transform !important;
}
.bottom-nav button:active,nav.tabs button:active{transform:scale(.92)}

/* Cards / settings */
.card-list{border-radius:16px;overflow:hidden;border:1px solid var(--line2);background:rgba(0,0,0,.2)}
.card-row{
  transition:.12s background !important;
  border-bottom:1px solid rgba(192,132,252,.06) !important;
}
.card-row:hover{background:rgba(124,58,237,.1) !important}
.card-row:last-child{border-bottom:0 !important}
.group-title{
  font-size:.68rem !important;letter-spacing:.08em !important;text-transform:uppercase !important;
  color:#a78bfa !important;font-weight:800 !important;margin:16px 4px 8px !important;
}
.btn-block.primary{
  background:linear-gradient(135deg,#7c3aed,#a855f7) !important;
  border:0 !important;border-radius:12px !important;font-weight:800 !important;
  box-shadow:0 6px 20px rgba(124,58,237,.3);
}
.toggle{
  width:44px !important;height:26px !important;border-radius:999px !important;
  background:rgba(255,255,255,.12) !important;position:relative;transition:.2s background !important;
}
.toggle.on{background:linear-gradient(135deg,#7c3aed,#a855f7) !important}
.toggle::after{
  content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;
  background:#fff;transition:.2s transform;box-shadow:0 2px 6px rgba(0,0,0,.3)
}
.toggle.on::after{transform:translateX(18px)}

/* Toast */
.toast,#toast,.toasts .t{
  border-radius:14px !important;border:1px solid rgba(192,132,252,.3) !important;
  background:rgba(18,10,32,.92) !important;backdrop-filter:blur(12px);
  box-shadow:0 12px 40px rgba(0,0,0,.45), var(--glow);
  font-weight:600 !important;
  animation:toastIn .28s cubic-bezier(.2,.9,.2,1) !important;
}
@keyframes toastIn{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}

/* Messages polish */
#messages .cmsg{animation:msgIn .22s ease-out}
@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
#messages .cmsg .mav{transition:.15s transform}
#messages .cmsg .mav:hover{transform:scale(1.06)}

/* Profile popup */
.uprofile{animation:popIn .25s cubic-bezier(.2,.9,.2,1)}
@keyframes popIn{from{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:none}}
.uprofile-overlay{backdrop-filter:blur(6px)}

/* Voice tiles */
.vtile{border-radius:16px !important;border:1px solid var(--line2) !important;overflow:hidden;
  transition:.2s transform,.2s box-shadow,.2s border-color !important}
.vtile:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,58,237,.25)}
.vtile.speak{border-color:rgba(74,222,128,.55) !important;box-shadow:0 0 0 2px rgba(74,222,128,.25),0 8px 24px rgba(74,222,128,.15)}

/* Empty states */
.messages > p{opacity:.7;line-height:1.6}

/* Server rail */
.srv-rail,.servers{border-right:1px solid var(--line2)}
.srv-ico,#hub-ico{
  border-radius:16px !important;transition:.15s border-radius,.15s transform !important;
  box-shadow:0 4px 16px rgba(124,58,237,.25);
}
.srv-ico:hover,#hub-ico:hover{border-radius:12px !important;transform:scale(1.04)}

/* Reply bar */
#reply-bar.on{
  background:linear-gradient(90deg,rgba(124,58,237,.2),rgba(34,211,238,.06)) !important;
  border-radius:12px 12px 0 0;margin:0 8px;
}

/* Settings drawer */
.set-panel,.settings,#set-el,[class*="settings"]{
  /* soft */
}
#set-body .field input,#set-body .field textarea,#set-body .field select{
  border-radius:12px !important;border:1px solid var(--line2) !important;
  background:rgba(0,0,0,.3) !important;
}
#set-body .field input:focus,#set-body .field textarea:focus{
  border-color:rgba(168,85,247,.5) !important;box-shadow:0 0 0 3px rgba(124,58,237,.15) !important;
}

/* Reduced motion */
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}
}

/* Message delete UX */
#messages .cmsg{position:relative!important;transition:opacity .35s ease,transform .35s ease,max-height .35s ease,margin .35s ease,padding .35s ease!important;touch-action:pan-y}
#messages .cmsg.msg-out{
  opacity:0!important;transform:translateX(-28px) scale(.98)!important;
  max-height:0!important;margin:0!important;padding-top:0!important;padding-bottom:0!important;
  overflow:hidden!important;pointer-events:none!important
}
#messages .cmsg .msg-x{
  position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:10px;
  border:1px solid rgba(239,68,68,.35);background:rgba(239,68,68,.15);
  color:#fca5a5;font-size:16px;font-weight:700;line-height:1;
  display:none;align-items:center;justify-content:center;cursor:pointer;z-index:8;
  transition:.15s background,.15s transform;padding:0
}
#messages .cmsg:hover .msg-x{display:flex}
#messages .cmsg .msg-x:hover{background:rgba(239,68,68,.35);transform:scale(1.06);color:#fff}
#messages .cmsg.swiping{transition:none!important}
@media (hover:none){
  #messages .cmsg .msg-x{display:none!important}
}

.uv-ver{
  position:fixed;left:10px;bottom:10px;z-index:90;
  font-size:10px;font-weight:700;letter-spacing:.04em;
  color:rgba(192,132,252,.55);pointer-events:none;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  text-shadow:0 1px 2px rgba(0,0,0,.5);
  user-select:none;
}
@media(max-width:720px){
  .uv-ver{left:8px;bottom:calc(58px + var(--safe,0px));font-size:9px;opacity:.7}
}

.ubadges{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.ubadge{
  display:inline-flex;align-items:center;gap:5px;
  height:24px;padding:0 10px;border-radius:999px;
  font-size:.68rem;font-weight:800;letter-spacing:.02em;
  border:1px solid rgba(192,132,252,.25);
  background:rgba(124,58,237,.12);color:#e9d5ff;
}
.ubadge .be{font-size:.85rem;line-height:1}
.dev-wrap,.hunt-wrap{position:relative;display:inline-flex;align-items:center;gap:5px;flex-wrap:nowrap;max-width:100%;vertical-align:middle}
.member-row .meta strong{display:inline-flex;align-items:center;flex-wrap:nowrap;gap:4px;max-width:100%;overflow:hidden}
.member-row .av img,.mav img,.uav img,#p-av img{width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block}
.member-row .av,.mav,#p-av,.uav{overflow:hidden;background:linear-gradient(135deg,#312e81,#6d28d9)}

.dev-red{
  color:#fecaca;font-weight:900;letter-spacing:.03em;
  background:linear-gradient(90deg,#7f1d1d,#ef4444,#fecaca,#dc2626,#7f1d1d);
  background-size:220% auto;
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 8px rgba(220,38,38,.85));
  animation:goldShine 2.2s linear infinite;
}
.dev-mini{margin-left:4px;border-color:rgba(239,68,68,.7)!important;background:rgba(127,29,29,.45)!important;color:#fecaca!important;box-shadow:0 0 10px rgba(220,38,38,.45)}
.dev-spark{position:absolute;width:3px;height:3px;border-radius:50%;background:#0a0a0a;box-shadow:0 0 4px #000;pointer-events:none;animation:devSpark 2s linear infinite}
.dev-spark:nth-child(2){left:10%;animation-delay:.2s}
.dev-spark:nth-child(3){left:35%;animation-delay:.6s}
.dev-spark:nth-child(4){left:60%;animation-delay:1s}
.dev-spark:nth-child(5){left:85%;animation-delay:1.4s}
@keyframes devSpark{
  0%{transform:translateY(8px) scale(.4);opacity:0}
  25%{opacity:1}
  100%{transform:translateY(-16px) scale(1);opacity:0}
}
.hunter-gold{
  color:#fde68a;font-weight:900;letter-spacing:.02em;
  background:linear-gradient(90deg,#b45309,#facc15,#fff7cc,#f59e0b,#b45309);
  background-size:220% auto;
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 6px rgba(250,204,21,.75));
  animation:goldShine 2.6s linear infinite;
}
.hunter-mini{margin-left:6px;vertical-align:middle}
@keyframes goldShine{0%{background-position:0% center}100%{background-position:220% center}}
.ubadge.b-bug{border-color:rgba(74,222,128,.35);background:rgba(22,163,74,.15);color:#bbf7d0}
.ubadge.b-bugh{
  position:relative;overflow:hidden;
  border-color:rgba(250,204,21,.75);
  background:linear-gradient(120deg,rgba(124,58,237,.45),rgba(250,204,21,.25),rgba(34,211,238,.3));
  color:#fff;font-weight:900;letter-spacing:.06em;
  box-shadow:0 0 14px rgba(250,204,21,.55),0 0 28px rgba(168,85,247,.4);
  animation:bughPulse 2.2s ease-in-out infinite;
}
.ubadge.b-bugh:after{
  content:"";position:absolute;inset:-40% -20%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent);
  animation:bughShine 2.8s linear infinite;
}
@keyframes bughPulse{0%,100%{transform:scale(1);filter:saturate(1)}50%{transform:scale(1.06);filter:saturate(1.35)}}
@keyframes bughShine{0%{transform:translateX(-60%) rotate(12deg)}100%{transform:translateX(60%) rotate(12deg)}}
.ubadge.b-early{border-color:rgba(251,191,36,.4);background:rgba(245,158,11,.12);color:#fde68a}
.ubadge.b-plus{border-color:rgba(168,85,247,.5);background:linear-gradient(135deg,rgba(124,58,237,.35),rgba(34,211,238,.15));color:#f5d0fe;box-shadow:0 0 12px rgba(168,85,247,.25)}
.ubadge.b-event{border-color:rgba(244,114,182,.4);background:rgba(219,39,119,.15);color:#fbcfe8}
.ubadge.b-dev{border-color:rgba(56,189,248,.4);background:rgba(14,165,233,.12);color:#bae6fd;font-family:ui-monospace,monospace}
.member-row .mbadges{display:flex;gap:4px;margin-top:2px;flex-wrap:wrap}
.member-row .mbadges span{font-size:.65rem;opacity:.9}

/* MOBILE UNLOCK */
html,body{height:100%;overflow:hidden;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.bg,.bg::before,.bg::after{pointer-events:none!important}
#overlay{position:fixed;inset:0;z-index:40;opacity:0!important;pointer-events:none!important;background:rgba(0,0,0,.55)}
#overlay.on{opacity:1!important;pointer-events:auto!important}
.uprofile-overlay:not(.on),.srv-modal:not(.on),.cam-lightbox:not(.on),.shortcuts-modal:not(.on),.modal:not(.on){
  display:none!important;opacity:0!important;pointer-events:none!important;visibility:hidden!important;z-index:-1!important
}
.drawer:not(.on),.friends-panel:not(.on){pointer-events:none!important}
.app,.main,.messages,.composer,.top,.bottom-nav,button,a,input,textarea,select,.chip,.icon-btn{
  pointer-events:auto!important
}
.composer,.top{position:relative;z-index:5}
.messages{position:relative;z-index:2;-webkit-overflow-scrolling:touch;touch-action:pan-y}
#messages .cmsg{touch-action:pan-y}
#messages .cmsg .msg-x{display:none!important}
@media(hover:hover) and (pointer:fine){
  #messages .cmsg:hover .msg-x{display:flex!important}
}

#btn-join-voice{position:relative;z-index:6;pointer-events:auto!important;min-height:48px;font-size:1rem;font-weight:800;
  background:linear-gradient(135deg,#7c3aed,#a855f7)!important;color:#fff!important;border:0!important;border-radius:14px!important;
  width:100%;max-width:320px;margin:12px auto;display:block}
#member-panel{z-index:55!important}

.voice-lobby,.voice-lobby *{pointer-events:auto!important;position:relative;z-index:5}
#btn-join-voice{pointer-events:auto!important;z-index:10!important;position:relative!important;cursor:pointer!important;-webkit-user-select:none;user-select:none}
.top{position:relative;z-index:30!important;pointer-events:auto!important}
.top .icon-btn{pointer-events:auto!important;position:relative;z-index:31!important}
.voice-wrap{pointer-events:auto!important}
.screen.on{pointer-events:auto!important}
#voice-grid{pointer-events:none}
#voice-grid:not([style*="display: none"]):not([style*="display:none"]){pointer-events:auto}
.search-bar{position:relative;z-index:25}
</style>
</head>
<body>
<div class="overlay" id="overlay"></div>
<div class="cam-lightbox" id="cam-lightbox"><button type="button" class="x" id="cam-lb-x">X</button><div class="box"><div id="cam-lb-media"></div><div class="cap" id="cam-lb-cap"></div></div></div>
<div class="friends-panel" id="friends-panel">
  <div class="fh"><span>Amis</span><button type="button" class="icon-btn" id="friends-close" onclick="var p=document.getElementById('friends-panel');if(p)p.classList.remove('on')" style="z-index:90">X</button></div>
  <div class="status-sel" id="status-sel">
    <button type="button" data-st="online" class="chip on">En ligne</button>
    <button type="button" data-st="away" class="chip">Absent</button>
    <button type="button" data-st="dnd" class="chip">NPD</button>
    <button type="button" data-st="invisible" class="chip">Invisible</button>
  </div>
  <div style="padding:8px;display:flex;gap:6px">
    <input id="friend-add" placeholder="@username" maxlength="32" style="flex:1;padding:8px;border-radius:8px;border:1px solid var(--b);background:var(--bg);color:var(--t)">
    <button type="button" class="chip primary" id="friend-add-btn">+</button>
  </div>
  <div class="friends-tabs">
    <button type="button" class="chip on" data-ftab="online">En ligne</button>
    <button type="button" class="chip" data-ftab="all">Tous</button>
    <button type="button" class="chip" data-ftab="pending">Attente</button>
    <button type="button" class="chip" data-ftab="blocked">Bloques</button>
  </div>
  <div class="friends-list" id="friends-list"></div>
</div>
<button type="button" class="fab-bottom" id="fab-bottom" title="Derniers messages">↓</button>
<div class="shortcuts-modal" id="shortcuts-modal"><div class="shortcuts-sheet"><h3>Raccourcis</h3><p><kbd>Ctrl</kbd>+<kbd>K</kbd> Recherche</p><p><kbd>Ctrl</kbd>+<kbd>/</kbd> Aide</p><p><kbd>Echap</kbd> Fermer panels</p><p><kbd>✨</kbd> Correction IA</p><p><kbd>Entrée</kbd> Envoyer · <kbd>Shift+Entrée</kbd> Ligne</p><button type="button" class="btn-block primary" id="shortcuts-close">OK</button></div></div>
<div class="srv-modal" id="srv-modal">
  <div class="srv-sheet" style="max-height:min(85vh,560px);overflow:auto">
    <h3 id="srv-modal-title">Serveur</h3>
    <div class="field" id="srv-field-name"><label>Nom du serveur</label><input id="srv-name-input" maxlength="100" placeholder="Mon serveur"></div>
    <div class="field" id="srv-field-code" style="display:none"><label>Code / invitation</label><input id="srv-code-input" maxlength="32" placeholder="ex: XULTRA-ABC123" style="text-transform:uppercase"></div>
    <div id="srv-field-settings" style="display:none">
      <div class="field"><label>Description</label><input id="srv-desc-input" maxlength="120" placeholder="Communauté · vocal · hubs"></div>
      <div class="field"><label>Bannière (image)</label><input type="file" id="srv-banner-input" accept="image/*"><div id="srv-banner-prev" style="margin-top:8px;height:56px;border-radius:10px;background:var(--row);background-size:cover;background-position:center"></div></div>
      <div class="field"><label>Icône (2 lettres) / image</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input id="srv-icon-input" maxlength="2" placeholder="XU" style="width:64px;text-transform:uppercase">
          <input type="file" id="srv-icon-file" accept="image/*" style="flex:1">
        </div>
      </div>
      <div class="field"><label>Code invitation</label><div class="invite-row"><input id="srv-invite-display" readonly style="opacity:.9"><button type="button" class="chip" id="srv-invite-copy">Copier</button></div></div>
      <div class="section-label" style="margin-top:12px;font-size:.72rem;color:var(--m);font-weight:800">RÔLES</div>
      <div class="role-list" id="srv-roles-list"></div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input id="srv-role-name" maxlength="40" placeholder="Nom du rôle" style="flex:1">
        <input id="srv-role-color" type="color" value="#a855f7" style="width:44px;height:40px;border:0;background:0;padding:0">
        <button type="button" class="btn-block primary" id="srv-role-add" style="width:auto;padding:0 12px">+</button>
      </div>
      <div class="section-label" style="margin-top:14px;font-size:.72rem;color:var(--m);font-weight:800">SALONS & ACCÈS</div>
      <div id="srv-chan-perms"></div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input id="srv-chan-new" maxlength="32" placeholder="nouveau-salon" style="flex:1">
        <button type="button" class="btn-block primary" id="srv-chan-add" style="width:auto;padding:0 12px">+ Salon</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button type="button" class="btn-block" id="srv-modal-cancel" style="background:var(--row)">Annuler</button>
      <button type="button" class="btn-block primary" id="srv-modal-ok">Valider</button>
    </div>
  </div>
</div>
<aside class="drawer" id="drawer">
  <div class="dh">
    <button type="button" class="dh-btn" id="srv-toggle" aria-expanded="false">
      <span class="srv-ico" id="srv-head-ico">XU</span>
      <span id="srv-head-name">XULTRA Hub</span>
      <span class="chev">▼</span>
    </button>
    <div class="srv-menu" id="srv-menu" role="menu">
      <div id="srv-list"></div>
      <div class="srv-actions">
        <button type="button" class="primary" id="srv-create-btn">＋ Créer un serveur</button>
        <button type="button" id="srv-join-btn">🔗 Rejoindre un serveur</button>
        <button type="button" class="srv-settings-btn" id="srv-settings-btn">⚙ Paramètres du serveur</button>
      </div>
    </div>
  </div>
  <div class="db">
    <div style="font-size:.65rem;color:var(--m);margin:4px 8px 8px;font-weight:700">SALONS TEXTUELS</div>
    <button class="ch on" data-ch="general"># général</button>
    <button class="ch" data-ch="media"># médias</button>
    <button class="ch" data-ch="annonces"># annonces</button>
    <button class="ch" data-ch="reglement">📋 règlement</button>
    <div id="custom-channels"></div>
    <div style="font-size:.65rem;color:var(--m);margin:12px 8px 8px;font-weight:700">SALONS VOCAUX</div>
    <button class="ch voice-ch" data-ch="vocal">🔊 vocal-lounge<div class="vc-users" id="vc-users-vocal"></div></button>
    <button class="ch voice-ch" data-ch="vocal-afk">💤 AFK<div class="vc-users" id="vc-users-afk"></div></button>
    <button class="ch voice-ch" data-ch="vocal-gaming">🎮 gaming<div class="vc-users" id="vc-users-gaming"></div></button>
    <button class="ch voice-ch" data-ch="vocal-musique">🎵 musique<div class="vc-users" id="vc-users-musique"></div></button>
  </div>
</aside>
<div class="modal" id="stream-modal">
  <div class="sheet">
    <h3>Paramètres de stream</h3>
    <label class="opt on" data-q="720"><input type="radio" name="q" checked><div class="tx"><strong>Par défaut</strong><span>720p · 30 fps — équilibré</span></div></label>
    <label class="opt" data-q="480"><input type="radio" name="q"><div class="tx"><strong>Performance</strong><span>480p · 30 fps — appareils lents</span></div></label>
    <label class="opt" data-q="1080"><input type="radio" name="q"><div class="tx"><strong>Haute qualité</strong><span>1080p · 60 fps — vidéo / gaming</span></div></label>
    <label class="opt on" style="align-items:center"><input type="checkbox" id="scr-audio" checked><div class="tx"><strong>Partager l'audio de l'app</strong></div></label>
    <button type="button" class="go" id="start-stream">Commencer à streamer</button>
    <button type="button" class="btn-block" id="cancel-stream" style="margin-top:8px">Annuler</button>
  </div>
</div>

<div class="picker-sheet" id="picker-emoji">
  <div class="ph"><strong>Emojis</strong><button type="button" class="chip" id="emoji-close">✕</button></div>
  <div class="emoji-grid" id="emoji-grid"></div>
</div>
<div class="picker-sheet" id="picker-gif">
  <div class="ph"><strong>GIF</strong><button type="button" class="chip" id="gif-close">✕</button></div>
  <input type="search" id="gif-q" placeholder="Rechercher…">
  <div class="gif-grid" id="gif-grid"></div>
</div>
<div class="member-panel" id="member-panel">
  <div class="mh"><span>Membres</span><span class="sub" id="member-count"></span><button type="button" class="icon-btn" id="member-close" onclick="try{closeMembersPanel()}catch(e){}" style="z-index:90;min-width:44px;min-height:44px">✕</button></div>
  <div class="member-search"><input type="search" id="member-q" placeholder="Rechercher nom, @user, #tag…" autocomplete="off"></div>
  <div class="member-list" id="member-list"></div>
</div>
<div class="uprofile-overlay" id="uprofile-overlay" aria-hidden="true"><div class="uprofile" id="uprofile-card" role="dialog" aria-modal="true"><button type="button" class="uclose" id="uprofile-close" onclick="try{closeUserProfile()}catch(e){}" aria-label="Fermer">✕</button><div class="uban" id="up-banner"></div><div class="uav-wrap"><div class="uav" id="up-av">?</div></div><div class="ubody"><div class="uname" id="up-name">—</div><div class="uhandle" id="up-handle">@—</div><div class="ubadges" id="up-badges"></div><div class="ubio" id="up-bio"></div><div class="uacts" id="up-acts"></div></div></div></div>
<div class="uv-ver" id="uv-ver" title="XULTRA Voice pre-release">XULTRA · α0.2.36</div>
<input type="file" id="file-img" accept="image/*,video/*" hidden>
<input type="file" id="file-any" hidden>

<div class="app">
  <header class="top">
    <button type="button" class="icon-btn" id="btn-menu">☰</button>
    <div style="flex:1;min-width:0"><h1 id="title"># général</h1><div class="sub" id="subtitle">Hub public</div></div>
    <button type="button" class="icon-btn" id="btn-friends" title="Amis" onclick="window.openFriendsPanel&&window.openFriendsPanel()">🤝</button>
    <button type="button" class="icon-btn" id="btn-search" title="Rechercher" onclick="window.toggleSearchBar&&window.toggleSearchBar()">🔍</button>
    <button type="button" class="icon-btn" id="btn-members" title="Membres" onclick="try{window.__uvBind&&window.__uvBind();if(typeof window.openMembersPanel==='function')window.openMembersPanel();else alert('Membres indisponible')}catch(e){alert('Membres: '+e)}">👥</button>
    <button type="button" class="icon-btn" id="btn-settings" onclick="try{window.__uvBind&&window.__uvBind();if(typeof window.openSettingsPanel==='function')window.openSettingsPanel();else{var s=document.getElementById('settings');if(s){s.classList.add('on');s.style.display='flex'}}}catch(e){alert('Params: '+e)}">⚙</button>
  </header>
  <div class="search-bar" id="search-bar"><input id="search-q" type="search" placeholder="Rechercher dans le salon…"><button type="button" class="chip" id="search-close">✕</button></div>
  <div class="main">
    <section class="screen on" id="sc-chat">
      <div class="hub-head" id="hub-head">
        <div class="hub-banner" id="hub-banner"></div>
        <div class="hub-meta">
          <div class="hub-ico" id="hub-ico">XU</div>
          <div class="hub-info"><strong id="hub-name">XULTRA Hub</strong><p id="hub-desc">Communauté · vocal · médias éphémères</p></div>
        </div>
      </div>
      <div class="who" id="who-line"></div>
      <div class="topic-line" id="topic-line"></div><div class="pin-bar" id="pin-bar"><strong>Pin</strong> <span id="pin-text"></span></div><div id="announce-box" class="announce hidden"></div>
      <div class="messages" id="messages"></div>
      <div class="typing-line" id="typing-line"></div>
      <div class="attach-preview" id="attach-preview"><img id="attach-thumb" alt=""><span id="attach-name"></span><button type="button" class="chip" id="attach-clear">✕</button></div>
      <div class="composer"><input type="text" id="uv-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;width:0;opacity:0">
        <div class="composer-tools">
          <button type="button" class="chip" id="c-emoji">😀</button>
          <button type="button" class="chip" id="c-ai" title="Correction IA">✨</button>
          <button type="button" class="chip" id="c-gif">GIF</button>
          <button type="button" class="chip" id="c-img">Médias</button>
          <button type="button" class="chip" id="c-file">Fichier</button>
          <button type="button" class="chip" id="c-report">⚑</button>
          <select class="chip" id="expiry" style="width:auto" title="Durée de vie du message"><option value="0" selected>∞ Permanent</option><option value="3600">1h</option><option value="86400">24h</option><option value="604800">7j</option><option value="7776000">90j</option></select>
        </div>
        <div class="reply-bar" id="reply-bar"><span>Reponse a <strong id="reply-to-name"></strong></span><button type="button" class="x" id="reply-clear">X</button></div>
        <div class="char-count" id="char-count">0/400</div>
        <div class="composer-row"><textarea id="input" maxlength="400" placeholder="Écrire… (Shift+Entrée = ligne)" rows="1" style="resize:none;height:42px;padding:10px 14px;line-height:1.3;font-family:inherit;font-size:1rem;color:var(--t)"></textarea><button type="button" class="send" id="send">Envoyer</button></div>
        <input type="file" id="f-img" accept="image/*" class="hidden"><input type="file" id="f-file" class="hidden">
      </div>
    </section>
    <section class="screen" id="sc-voice">
      <div class="voice-wrap">
        <div class="voice-head"><strong id="voice-room">🔊 vocal-lounge</strong><button type="button" class="chip" id="btn-invite">Inviter</button></div>
        <div class="voice-status" id="voice-status">Non connecté</div>
        <div class="voice-lobby" id="voice-lobby">
          <div class="big-icon">🔊</div>
          <h2 id="voice-lobby-title">vocal-lounge</h2>
          <p>Choisis un salon à gauche, puis appuie sur Rejoindre pour activer micro / caméra.</p>
          <button type="button" class="btn-join-voice" id="btn-join-voice" type="button" onclick="try{window.__uvBind&&window.__uvBind();(window.__goVoiceReady||window.goVoiceAndJoin)()}catch(e){alert('Vocal: '+e)}">Rejoindre le salon</button>
        </div>
        <div class="voice-grid" id="voice-grid" style="display:none"></div>
        <div class="voice-bar" id="voice-bar" style="display:none">
          <button type="button" class="vbtn" id="v-mic" title="Micro">🎤</button>
          <button type="button" class="vbtn" id="v-deaf" title="Casque">🎧</button>
          <button type="button" class="vbtn" id="v-cam" title="Caméra">📷</button>
          <button type="button" class="vbtn" id="v-scr" title="Écran">🖥</button>
          <button type="button" class="vbtn hang" id="v-leave" title="Quitter">✕</button>
        </div>
      </div>
    </section>
    <section class="screen" id="sc-sb">
      <div class="sb-tabs"><button type="button" class="on" id="sb-play-tab">Jouer</button><button type="button" id="sb-mgr-tab">Gérer</button></div>
      <div class="sb-grid" id="sb-grid"></div>
      <div id="sb-mgr" class="hidden" style="flex:1;overflow:auto">
        <div style="padding:12px">
          <div class="field"><label>Nom</label><input id="snd-name" maxlength="40"></div>
          <div class="field"><label>Audio max 2 Mo</label><input type="file" id="f-snd" accept="audio/*"></div>
          <button type="button" class="btn-block primary" id="snd-up">Uploader</button>
        </div>
        <div id="sb-list"></div>
      </div>
    </section>
    <section class="screen" id="sc-profile">
      <div class="prof-scroll">
        <div class="prof-banner" id="p-banner"><div class="prof-av" id="p-av">?</div></div>
        <div class="prof-body">
          <h2 id="p-name">…</h2>
          <div class="prof-handle" id="p-handle">@…</div>
          <div class="status-line" id="p-pronouns"></div>
          <div class="status-line" id="p-created"></div>
          <button type="button" class="btn-block" id="btn-edit-prof">✎ Modifier le profil</button>
          <div class="section-label">Rôles — serveur actuel</div>
          <div class="role-list" id="p-roles"></div>
          <div id="p-roles-assign" style="display:none;margin-top:8px">
            <select id="p-role-select" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--b);background:var(--bg);color:var(--t);margin-bottom:8px"></select>
            <button type="button" class="btn-block primary" id="p-role-assign-btn">Assigner le rôle</button>
          </div>
          <div class="section-label">Bio</div>
          <div class="bio-box" id="p-bio">Aucune bio</div>
          <div class="section-label">Session</div>
          <div class="tok"><code id="tok">••••••••</code><button type="button" id="tok-eye">👁</button></div>
          <div class="section-label">Compte Appwrite</div>
          <div class="card-list"><div class="card-row"><span class="lab">E-mail</span><span class="val" id="p-email">—</span></div><div class="card-row"><span class="lab">ID</span><span class="val" id="p-id" style="font-size:.65rem">—</span></div></div>
          <div class="section-label">Raccourcis</div>
          <div class="card-list" id="profile-links"></div>
        </div>
      </div>
    </section>
    <div class="settings" id="settings">
      <div class="set-top"><button type="button" class="icon-btn" id="set-back" onclick="window.__uvX()">✕</button><h2 id="set-title">Paramètres</h2></div>
      <div style="padding:8px 14px 0"><input id="set-search" placeholder="Rechercher un réglage…" style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--b);background:var(--row);outline:0"></div>
      <div class="set-body" id="set-body"></div>
    </div>
  </div>
  <nav class="nav">
    <button type="button" class="on" data-sc="chat"><span class="ic">💬</span>Chat</button>
    <button type="button" data-sc="voice"><span class="ic">🔊</span>Vocal</button>
    <button type="button" data-sc="sb"><span class="ic">🎵</span>Sons</button>
    <button type="button" data-sc="profile"><span class="ic">👤</span>Profil</button>
    <button type="button" id="nav-set"><span class="ic">⚙</span>Réglages</button>
  </nav>
</div>
<div class="toast" id="toast"></div>
<script>

(function(){
'use strict';


/* binders filled when functions exist */
window.__uvBind=function(){
  try{
    if(typeof goVoiceAndJoin==='function'){window.__goVoiceReady=goVoiceAndJoin;window.goVoiceAndJoin=goVoiceAndJoin}
    if(typeof joinVoiceRoom==='function'){window.joinVoiceRoom=joinVoiceRoom}
    if(typeof openMembersPanel==='function'){window.__openMembersReady=openMembersPanel;window.openMembersPanel=openMembersPanel}
    if(typeof closeMembersPanel==='function'){window.closeMembersPanel=closeMembersPanel;window.__closeMembersReady=closeMembersPanel}
    if(typeof openSettings==='function'){
      window.__openSettingsReady=function(){try{openSettings('root')}catch(e){console.warn(e)}};
      window.openSettingsPanel=window.__openSettingsReady;
    }
    if(typeof sendMsg==='function'){window.sendMsg=sendMsg}
  }catch(e){console.warn('__uvBind',e)}
};
window.goVoiceAndJoin=function(){
  try{if(window.__uvBind)window.__uvBind()}catch(e){}
  var fn=window.__goVoiceReady;
  if(typeof fn==='function'&&fn!==window.goVoiceAndJoin)return fn.apply(this,arguments);
  try{toast('Vocal en cours de chargement…')}catch(e){}
};
window.openMembersPanel=function(){
  try{if(window.__uvBind)window.__uvBind()}catch(e){}
  var fn=window.__openMembersReady;
  if(typeof fn==='function'&&fn!==window.openMembersPanel)return fn.apply(this,arguments);
  // fallback: open panel DOM directly
  try{
    var panel=document.getElementById('member-panel');
    var overlay=document.getElementById('overlay');
    if(panel){
      panel.classList.add('on');
      panel.style.transform='translateX(0)';
      panel.style.pointerEvents='auto';
      panel.style.zIndex='999';
    }
    if(overlay){overlay.classList.add('on');overlay.style.opacity='1';overlay.style.pointerEvents='auto'}
    if(typeof renderMemberPanel==='function')renderMemberPanel();
  }catch(e){try{alert('Membres: '+e)}catch(x){}}
};
window.openSettingsPanel=function(){
  try{if(window.__uvBind)window.__uvBind()}catch(e){}
  if(typeof window.__openSettingsReady==='function'&&window.__openSettingsReady!==window.openSettingsPanel){
    return window.__openSettingsReady.apply(this,arguments);
  }
  try{
    var s=document.getElementById('settings');
    if(s){s.classList.add('on');s.style.display='flex';s.style.zIndex='80'}
  }catch(e){}
};
setInterval(function(){try{if(window.__uvBind)window.__uvBind()}catch(e){}},1000);

const EP='https://fra.cloud.appwrite.io/v1',PID='6a73b975002f14dc6b91',DB='xultra',SERVER='hub-xultra';
const IMGBB='187599520be6b8250c05de33cee4aed8';
// Admin: Cisco + Shaman + variants (same person often)
const ADMIN_RE=/^(cisco|shaman|cisco1337|cisco-ia|ciscola)$/i;
const ADMIN_EMAILS=['lordfamily1@proton.me'];
const {Client,Account,Databases,Storage,ID,Query,Permission,Role}=Appwrite;
const client=new Client().setEndpoint(EP).setProject(PID);
const account=new Account(client),db=new Databases(client),st=new Storage(client);
const esc=s=>String(s||'').replace(/[<>&"'\`]/g,'');
window.__uvX=function(){
  try{
    var s=document.getElementById('settings');
    if(s){s.classList.remove('on');s.style.setProperty('display','none','important');}
    var ids=['member-panel','friends-panel','uprofile-overlay','search-bar','overlay','srv-modal','cam-lightbox','emoji-pop','gif-pop','shortcuts-modal'];
    for(var i=0;i<ids.length;i++){
      var el=document.getElementById(ids[i]);
      if(!el)continue;
      el.classList.remove('on');
    }
  }catch(e){}
};
const toast=t=>{const e=document.getElementById('toast');e.textContent=t;e.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>e.classList.remove('on'),2400)};
let user=null,prefs={},channel='general',sounds=[],tokShow=false,isAdmin=false,platform={},streamQ=720;
const media={mic:true,deaf:false,cam:false,scr:false,stream:null,screen:null,inVoice:false,room:null};
let servers=[{id:'hub-xultra',name:'XULTRA Hub',icon:'XU',owner:true,builtin:true,description:'Communauté · vocal · médias éphémères',roles:[{name:'Admin',color:'#e11d48',perms:{admin:1}},{name:'Modo',color:'#f59e0b',perms:{manage_messages:1,kick:1,connect_voice:1,speak:1,send_messages:1,attach_files:1,video:1}},{name:'Membre',color:'#a855f7',perms:{send_messages:1,connect_voice:1,speak:1,attach_files:1,video:1}}]}];
let currentServer='hub-xultra';
try{
  const saved=JSON.parse(localStorage.getItem('uv_servers')||'null');
  if(Array.isArray(saved)&&saved.length){
    const hasHub=saved.some(s=>s.id==='hub-xultra');
    servers=hasHub?saved:[{id:'hub-xultra',name:'XULTRA Hub',icon:'XU',owner:true,builtin:true},...saved];
  }
  const cs=localStorage.getItem('uv_current_server');
  if(cs&&servers.some(s=>s.id===cs))currentServer=cs;
}catch(e){}



function uvUnlockUI(){
  try{
    // keep member-panel if user just opened it
    var mem=document.getElementById('member-panel');
    var memOpen=mem&&mem.classList.contains('on');
    var ids=['srv-modal','cam-lightbox','shortcuts-modal'];
    ids.forEach(function(id){
      var el=document.getElementById(id);
      if(!el)return;
      el.classList.remove('on');
      el.style.pointerEvents='none';
      el.style.display='none';el.style.visibility='hidden';
    });
    if(!memOpen){
      var ov=document.getElementById('overlay');
      if(ov){ov.classList.remove('on');ov.style.opacity='0';ov.style.pointerEvents='none'}
      document.querySelectorAll('.drawer.on,.friends-panel.on').forEach(function(el){el.classList.remove('on')});
    }
    document.querySelectorAll('.picker-sheet.on').forEach(function(el){el.classList.remove('on')});
  }catch(e){}
}
uvUnlockUI();
setTimeout(uvUnlockUI,300);
try{
  var v=document.getElementById('uv-ver');
  if(v){v.style.pointerEvents='auto';v.style.cursor='pointer';v.title="XULTRA a0.2 - appui pour debloquer UI";
    v.onclick=function(){uvUnlockUI();try{toast('UI débloquée')}catch(e){}}
  }
}catch(e){}

setTimeout(uvUnlockUI,1000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)uvUnlockUI()});

document.addEventListener('contextmenu',e=>{if(!e.target.closest('input,textarea,.messages,.bio-box'))e.preventDefault()});

function url(b,id){return EP+'/storage/buckets/'+b+'/files/'+id+'/view?project='+PID}


function enhanceFileInputs(root){
  root=root||document;
  root.querySelectorAll('input[type="file"]').forEach(function(inp){
    if(inp.classList.contains('hidden')||inp.hasAttribute('hidden')||inp.dataset.enhanced==='1')return;
    if(inp.offsetParent===null && inp.style.display==='none')return;
    inp.dataset.enhanced='1';
    var wrap=document.createElement('div');
    wrap.className='file-btn-wrap';
    var lab=document.createElement('label');
    lab.className='file-btn';
    lab.htmlFor=inp.id||('fauto-'+Math.random().toString(36).slice(2,8));
    if(!inp.id)inp.id=lab.htmlFor;
    var isImg=(inp.accept||'').indexOf('image')>=0;
    var isAud=(inp.accept||'').indexOf('audio')>=0;
    var icon=isImg?'🖼️':(isAud?'🎵':'📎');
    lab.innerHTML='<span class="fi">'+icon+'</span><span class="ft">Choisir un fichier</span>';
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(lab);
    wrap.appendChild(inp);
    function sync(){
      var n=inp.files&&inp.files.length? (inp.files.length>1? (inp.files.length+' fichiers') : inp.files[0].name) : 'Choisir un fichier';
      lab.querySelector('.ft').textContent=n;
      lab.classList.toggle('has-file', !!(inp.files&&inp.files.length));
    }
    inp.addEventListener('change', sync);
    sync();
  });
}

function xTag(id){
  id=String(id||'');
  if(!id) return '0000';
  // stable short tag from full id (base36-ish unique)
  var clean=id.replace(/[^a-zA-Z0-9]/g,'').toUpperCase();
  if(clean.length>=6) return clean.slice(-6);
  var h=2166136261;
  for(var i=0;i<id.length;i++){h^=id.charCodeAt(i);h=Math.imul(h,16777619)}
  var t=(h>>>0).toString(36).toUpperCase();
  return (t+'000000').slice(0,6);
}
function displayTag(name, id){
  name=String(name||'User').trim()||'User';
  return name+'#'+xTag(id|| (user&&user.$id) || '');
}
function handleOf(name, id){
  name=String(name||'user').trim().toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20)||'user';
  return '@'+name+' · #'+xTag(id|| (user&&user.$id) || '');
}

window.__revealedTags=window.__revealedTags||{};
window.__globalMembersCache=[];
window.__memberSearchTimer=null;

function secureTag(id, storedTag){
  // Prefer server-stored tag; never expose full user id
  if(storedTag && String(storedTag).length>=4) return String(storedTag).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  return xTag(id);
}
function maskTag(tag){
  tag=String(tag||'????');
  return '#'+'•'.repeat(Math.min(6, Math.max(4, tag.length)));
}
function tagHtml(uid, tag){
  var show=!!window.__revealedTags[uid];
  var full='#'+secureTag(uid, tag);
  var val=show?full:maskTag(tag||secureTag(uid,tag));
  return '<span class="tag-wrap" data-uid="'+esc(uid)+'"><span class="tag-val '+(show?'':'masked')+'">'+esc(val)+'</span><button type="button" class="eye" title="'+(show?'Masquer le tag':'Afficher le tag')+'" data-eye="'+esc(uid)+'" data-tag="'+esc(secureTag(uid,tag))+'">'+(show?'🙈':'👁')+'</button></span>';
}
async function ensureUserProfile(){
  if(!user||!user.$id)return null;
  try{
    var tag=prefs.tag||secureTag(user.$id, prefs.tag);
    prefs.tag=tag;
    var username=(prefs.displayName||user.name||'user').toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20)||'user';
    var payload={
      authUserId:user.$id,
      email:user.email||'',
      username:username,
      baseUsername:username,
      tag:tag,
      displayName:prefs.displayName||user.name||username,
      bio:prefs.bio||'',
      avatar:prefs.avatar||'',
      statusManual:prefs.presence||'online'
    };
    // try update existing by authUserId
    try{
      var found=await db.listDocuments(DB,'users',[Query.equal('authUserId',user.$id),Query.limit(1)]);
      if(found.documents&&found.documents.length){
        await db.updateDocument(DB,'users',found.documents[0].$id,payload);
        return found.documents[0].$id;
      }
    }catch(e){}
    try{
      var doc=await db.createDocument(DB,'users',user.$id,payload);
      return doc.$id;
    }catch(e2){
      try{
        var doc2=await db.createDocument(DB,'users',ID.unique(),payload);
        return doc2.$id;
      }catch(e3){console.warn('ensureUserProfile',e3)}
    }
    try{await account.updatePrefs(prefs)}catch(e){}
  }catch(e){console.warn(e)}
  return null;
}
function mapUserDoc(d){
  return {
    id:d.authUserId||d.$id,
    docId:d.$id,
    name:d.displayName||d.username||'User',
    username:d.username||d.baseUsername||'',
    tag:d.tag||'',
    email:'',
    avatar:d.avatar||'',
    bio:d.bio||'',
    status:d.statusManual||'',
    self:!!(user&&(d.authUserId===user.$id||d.$id===user.$id)),
    online:!!(user&&(d.authUserId===user.$id)),
    roles:[],
    staffRole:d.staffRole||'',
    bugHunter:d.bugHunter||'',
    global:true
  };
}
async function loadGlobalMembers(q){
  q=(q||'').trim();
  try{
    if(!db||!Query){
      return listKnownMembers().map(function(m){return Object.assign({tag:m.self?(prefs.tag||''):'',username:'',global:false},m)});
    }
    var queries=[Query.limit(60)];
    // timeout 6s pour eviter chargement infini
    var res=await Promise.race([
      db.listDocuments(DB,'users',queries),
      new Promise(function(_,rej){setTimeout(function(){rej(new Error('timeout membres'))},6000)})
    ]);
    var rows=(res.documents||[]).map(mapUserDoc);
    if(q){
      var qq=q.toLowerCase().replace(/^#/,'');
      rows=rows.filter(function(m){
        return (m.name+' '+m.username+' '+(m.tag||'')+' '+(m.bio||'')).toLowerCase().indexOf(qq)>=0
          || ('#'+secureTag(m.id,m.tag)).toLowerCase().indexOf(q.toLowerCase())>=0;
      });
    }
    // merge online/self from local known members
    var local=listKnownMembers();
    local.forEach(function(lm){
      var hit=rows.find(function(r){return r.id===lm.id});
      if(hit){hit.online=!!lm.online;hit.roles=lm.roles||hit.roles;hit.self=!!lm.self}
      else if(!q){rows.push(Object.assign({global:false,tag:prefs&&lm.self?(prefs.tag||''):''},lm))}
    });
    window.__globalMembersCache=rows;
    return rows;
  }catch(e){
    console.warn('loadGlobalMembers',e);
    // fallback local
    return listKnownMembers().map(function(m){
      return Object.assign({tag:m.self?(prefs.tag||xTag(m.id)):'',username:'',global:false},m);
    });
  }
}
function reportUser(uid, name){
  var reason=prompt('Signaler '+name+' — motif (spam, harcèlement, usurpation…)','');
  if(reason===null)return;
  reason=(reason||'').trim()||'non précisé';
  try{
    if(typeof modlog==='function')modlog('report',uid,reason.slice(0,500));
  }catch(e){}
  try{
    db.createDocument(DB,'ultravoc_reports',ID.unique(),{
      reporterId:user&&user.$id||'',
      reporterName:(prefs&&prefs.displayName)||(user&&user.name)||'',
      targetId:uid,
      targetName:name||'',
      reason:reason.slice(0,800),
      createdAt:new Date().toISOString()
    }).then(function(){toast('Signalement envoyé')}).catch(function(){toast('Signalement enregistré localement')});
  }catch(e){toast('Signalement noté')}
}
function shareProfile(m){
  var tag=secureTag(m.id,m.tag);
  var text=(m.name||'User')+' · #'+tag+' — profil XULTRA';
  var url=location.origin+'/app?user='+encodeURIComponent(m.id);
  if(navigator.share){
    navigator.share({title:'Profil XULTRA',text:text,url:url}).catch(function(){});
  } else if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text+' '+url).then(function(){toast('Lien profil copié')}).catch(function(){prompt('Copier:', text+' '+url)});
  } else prompt('Copier:', text+' '+url);
}
function addFriendByMember(m){
  if(!uvGuard('friend'))return;
  var d=getFriendsData();
  d.friends=d.friends||[];
  d.pending=d.pending||[];
  if(d.friends.some(function(f){return f.id===m.id})){toast(t?t('friends'):'Déjà ami');return}
  if(d.pending.some(function(f){return f.id===m.id})){toast(t?t('pending'):'Demande déjà envoyée');return}
  d.pending.push({id:m.id,name:m.name,tag:typeof secureTag==='function'?secureTag(m.id,m.tag):'',username:m.username||''});
  saveFriendsData(d);
  toast(t?t('pending'):'Demande en attente');
  try{
    document.querySelectorAll('[data-friend][data-id="'+m.id+'"], #up-friend[data-id="'+m.id+'"]').forEach(function(b){
      b.textContent=t?t('pending'):'Demande en attente';
      b.classList.add('pending');
      b.disabled=true;
    });
  }catch(e){}
  try{if(typeof renderFriendsList==='function')renderFriendsList()}catch(e){}
  try{if(typeof renderMemberPanel==='function')renderMemberPanel()}catch(e){}
}

function isAdminUser(u){
  const n=(u.name||'').trim(); const e=(u.email||'').toLowerCase();
  if(ADMIN_RE.test(n))return true;
  if(ADMIN_EMAILS.includes(e))return true;
  if(prefs.role==='admin'||prefs.role==='owner')return true;
  // also match displayName
  if(ADMIN_RE.test(prefs.displayName||''))return true;
  return false;
}
async function imgbb(file){
  if(!file)throw new Error('Choisis une image');
  if(file.size>8*1024*1024)throw new Error('Max 8 Mo');
  var b64=await new Promise(function(res,rej){
    var r=new FileReader();
    r.onload=function(){res(String(r.result||'').split(',')[1]||'')};
    r.onerror=function(){rej(new Error('Lecture fichier'))};
    r.readAsDataURL(file);
  });
  if(!b64)throw new Error('Image illisible');
  var fd=new FormData();
  fd.append('key',IMGBB);
  fd.append('image',b64);
  var r=await fetch('https://api.imgbb.com/1/upload',{method:'POST',body:fd});
  var j=await r.json().catch(function(){return {}});
  if(!j||!j.success)throw new Error((j&&j.error&&j.error.message)||'Upload image échoué');
  return (j.data&&(j.data.display_url||j.data.url))||'';
}
async function savePrefs(p){
  prefs=Object.assign({},prefs,p);
  await account.updatePrefs(prefs);
  try{await ensureUserProfile()}catch(e){console.warn('sync users',e)}
  try{applySettingsPrefs();applyHunterMe()}catch(e){}
  try{paintProfile()}catch(e){}
  try{window.__globalMembersCache=null}catch(e){}
}
async function modlog(action,targetId,detail){
  if(!user)return;
  try{await db.createDocument(DB,'ultravoc_modlog',ID.unique(),{actorId:user.$id,actorName:user.name||user.email,action,targetId:targetId||'',detail:(detail||'').slice(0,1000)})}catch(e){}
}
async function loadPlatform(){
  try{
    const r=await db.listDocuments(DB,'ultravoc_platform',[Query.limit(20)]);
    platform={};(r.documents||[]).forEach(d=>platform[d.key]=d.value);
    const box=document.getElementById('announce-box');
    if(platform.announcement){box.textContent=platform.announcement;box.classList.remove('hidden')}
    else box.classList.add('hidden');
    if(platform.maintenance==='true'&&!isAdmin){
      document.body.innerHTML='<div style="min-height:100dvh;display:grid;place-items:center;background:#0a0612;color:#f3eeff;font-family:system-ui;text-align:center;padding:24px"><div><h1>ULTRAVOC</h1><p style="color:#9b8bb8;margin-top:12px">Maintenance en cours.</p></div></div>';
    }
  }catch(e){}
}
async function setPlatform(key,value){
  try{await db.updateDocument(DB,'ultravoc_platform',key,{key,value})}
  catch(e){await db.createDocument(DB,'ultravoc_platform',key,{key,value},['read("any")','update("users")','delete("users")'])}
  platform[key]=value;await modlog('platform.'+key,'',String(value).slice(0,200));
}

account.get().then(async u=>{
  try{
    sessionStorage.removeItem('uv_redir');
    user=u;prefs=u.prefs||{};isAdmin=isAdminUser(u);
    // unique discrete tag per account
    try{
      var t=prefs.tag||xTag(u.$id);
      if(prefs.tag!==t){prefs.tag=t;try{account.updatePrefs(prefs)}catch(e){}}
      if(!prefs.displayName)prefs.displayName=u.name||(u.email||'User').split('@')[0];
      try{ensureUserProfile()}catch(e){}
      try{applySettingsPrefs()}catch(e){}
    }catch(e){}

    const wl=document.getElementById('who-line');if(wl)wl.textContent='Connecté: '+(prefs.displayName||u.name||'User');try{applyHunterMe()}catch(e){}
    const pe=document.getElementById('p-email');if(pe){pe.textContent='';pe.style.display='none';}
    const pi=document.getElementById('p-id');if(pi)pi.textContent=u.$id||'—';
    const pn=document.getElementById('p-name');if(pn){var _n=prefs.displayName||u.name||'User';if(nameIsDesignatedHunter(_n))pn.innerHTML=goldNameHtml(_n);else pn.textContent=_n;}
    try{const ph=document.getElementById('p-handle');if(ph)ph.textContent=handleOf(prefs.displayName||u.name,u.$id)}catch(e){};
    const ph=document.getElementById('p-handle');if(ph){
      var _tg=secureTag(u.$id, prefs.tag);
      ph.innerHTML=esc('@'+String(prefs.displayName||u.name||'user').toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20))+' <span class="tag-wrap" data-uid="'+esc(u.$id)+'"><span class="tag-val masked" id="prof-tag-val">'+esc(maskTag(_tg))+'</span><button type="button" class="eye" id="prof-tag-eye" title="Afficher le tag">👁</button></span>'+(isAdmin?' <span class="badge-admin">ADMIN</span>':'');
      var ey=document.getElementById('prof-tag-eye');
      if(ey){ey.onclick=function(){var show=!!window.__revealedTags[u.$id]; if(show)delete window.__revealedTags[u.$id]; else window.__revealedTags[u.$id]=1; show=!show; var tv=document.getElementById('prof-tag-val'); if(tv){tv.textContent=show?('#'+_tg):maskTag(_tg); tv.classList.toggle('masked',!show)} ey.textContent=show?'🙈':'👁'; ey.title=show?'Masquer le tag':'Afficher le tag'}}
    }
    const pa=document.getElementById('p-av');if(pa){if(prefs&&prefs.avatar)pa.innerHTML=avatarMarkup(prefs.avatar,u.name);else pa.textContent=(u.name||'?').slice(0,2).toUpperCase();pa.style.cursor='pointer';pa.title='Changer la photo';pa.onclick=function(){pickAvatarFile()};}
    window.__tok=u.$id||'';
    try{renderTok()}catch(e){}
    try{paintProfile()}catch(e){}
    try{buildProfileLinks()}catch(e){}
    try{await loadPlatform()}catch(e){}
    try{await loadMsg()}catch(e){}
    try{loadSB()}catch(e){}
    try{paintVoiceGrid()}catch(e){}
    try{wireServerUI()}catch(e){}
    try{document.getElementById('overlay')?.classList.remove('on');document.getElementById('drawer')?.classList.remove('on');document.getElementById('srv-modal')?.classList.remove('on');document.getElementById('stream-modal')?.classList.remove('on')}catch(e){}
  }catch(e){console.error('boot',e);try{toast('Erreur chargement: '+(e.message||e))}catch(_){}}
}).catch(err=>{
  console.warn('auth',err);
  const n=+(sessionStorage.getItem('uv_redir')||0);
  if(n>=3){
    sessionStorage.removeItem('uv_redir');
    document.body.innerHTML='<div style="min-height:100dvh;display:grid;place-items:center;background:#0a0612;color:#f3eeff;font-family:system-ui;text-align:center;padding:24px"><div><h1>ULTRAVOC</h1><p style="color:#9b8bb8;margin:12px 0">Session invalide. <a href="/" style="color:#c084fc">Se connecter</a></p></div></div>';
    return;
  }
  sessionStorage.setItem('uv_redir',String(n+1));
  location.replace('/');
});

function renderTok(){document.getElementById('tok').textContent=tokShow?window.__tok:'•'.repeat(18)}
document.getElementById('tok-eye').onclick=()=>{tokShow=!tokShow;renderTok();document.getElementById('tok-eye').textContent=tokShow?'🙈':'👁'};
function paintProfile(){
  if(prefs.avatar){var _pa=document.getElementById('p-av');if(_pa){_pa.innerHTML=avatarMarkup(prefs.avatar,prefs.displayName||'');wireBrokenAvatars(_pa);}}
  if(prefs.banner)document.getElementById('p-banner').style.backgroundImage='url('+prefs.banner+')';
  if(prefs.serverBanner)document.getElementById('hub-banner').style.backgroundImage='url('+prefs.serverBanner+')';
  if(prefs.serverIcon)document.getElementById('hub-ico').innerHTML='<img src="'+esc(prefs.serverIcon)+'" alt="">';
  const bio=document.getElementById('p-bio');if(bio)bio.textContent=prefs.bio||'Aucune bio pour le moment.';
  if(prefs.displayName){const n=document.getElementById('p-name');if(n)n.textContent=prefs.displayName;try{var ph2=document.getElementById('p-handle');if(ph2&&user)ph2.textContent=handleOf(prefs.displayName||user.name,user.$id)}catch(e){}}
  try{renderProfileRoles()}catch(e){}
}
function buildProfileLinks(){
  const el=document.getElementById('profile-links');
  let html=\`<button type="button" class="card-row" data-open="account"><span class="ic">👤</span><span class="lab">Compte</span><span class="chev">›</span></button>
  <button type="button" class="card-row" data-open="privacy"><span class="ic">🔒</span><span class="lab">Confidentialité</span><span class="chev">›</span></button>
  <button type="button" class="card-row" data-open="voice"><span class="ic">🎙</span><span class="lab">Voix & vidéo</span><span class="chev">›</span></button>\`;
  if(isAdmin)html+=\`<button type="button" class="card-row" data-open="admin"><span class="ic">🛡</span><span class="lab">Panel Admin</span><span class="pill">XULTRA</span><span class="chev">›</span></button>\`;
  el.innerHTML=html;el.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openSettings(b.dataset.open));
}
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  document.getElementById('sc-'+id).classList.add('on');
  document.querySelectorAll('.nav button[data-sc]').forEach(b=>b.classList.toggle('on',b.dataset.sc===id));
  const map={chat:'# '+channel,voice:document.getElementById('voice-room').textContent,sb:'Soundboard',profile:'Profil'};
  document.getElementById('title').textContent=map[id]||'Ultravoc';
}
document.querySelectorAll('.nav button[data-sc]').forEach(b=>b.onclick=()=>{showScreen(b.dataset.sc);if(b.dataset.sc==='voice'){try{__wireJoin()}catch(e){}try{var bj=document.getElementById('btn-join-voice');if(bj){bj.disabled=false;bj.style.pointerEvents='auto'}}catch(e){}}});
document.getElementById('nav-set').onclick=()=>openSettings('root');
// Auto-activate Ultravoc+ after Stripe return
(async function checkPlusReturn(){
  try{
    const q=new URLSearchParams(location.search);
    const plus=q.get('plus')||q.get('plus_success');
    const plan=q.get('plan')||'m12';
    let pending=null;try{pending=JSON.parse(localStorage.getItem('uv_pending_plus')||'null')}catch(e){}
    if(plus==='1'||plus==='true'||plus==='ok'){
      const months={m3:3,m6:6,m12:12}[plan]||12;
      const until=new Date();until.setMonth(until.getMonth()+months);
      const untilStr=until.toISOString().slice(0,10);
      await savePrefs({package:'plus',plusPlan:plan,plusUntil:untilStr});
      try{localStorage.removeItem('uv_pending_plus')}catch(e){}
      if(typeof modlog==='function')try{await modlog('plus.stripe',user.$id,plan+' '+untilStr)}catch(e){}
      toast('Paiement confirme — Ultravoc+ actif jusquau '+untilStr);
      history.replaceState({},'',location.pathname);
    } else if(pending && pending.uid===user.$id && Date.now()-pending.t<3600000){
      // fallback: user returned within 1h after clicking buy — soft prompt
      // do not auto-grant without plus=1 to avoid free activation
    }
  }catch(e){}
})();

document.getElementById('btn-settings').onclick=()=>openSettings('root');
const drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
document.getElementById('btn-menu').onclick=()=>{drawer.classList.add('on');overlay.classList.add('on')};
function __closeShell(){try{dismissAllOverlays({})}catch(e){try{drawer.classList.remove('on')}catch(x){}try{overlay.classList.remove('on');overlay.style.opacity='0';overlay.style.pointerEvents='none'}catch(x){}}};
  overlay.onclick=__closeShell;
  overlay.ontouchend=function(e){e.preventDefault();__closeShell()};
  // legacy
  var __legacyOverlayClick=()=>{drawer.classList.remove('on');overlay.classList.remove('on');const mp=document.getElementById('member-panel');if(mp)mp.classList.remove('on');closePickers&&closePickers()};
document.querySelectorAll('.ch[data-ch]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.ch').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  channel=b.dataset.ch;
  if(!canViewChannel(channel)){toast('Accès refusé — rôles: '+(channelAccess(channel).roles||[]).join(', ')||'restreint');return}
  try{renderPinBar();renderTopic();restoreDraft();updateCharCount()}catch(e){}
  const isVoice=channel.startsWith('vocal');
  const label=(b.childNodes[0]&&b.childNodes[0].textContent||b.textContent).trim();
  document.getElementById('title').textContent=label;
  document.getElementById('voice-room').textContent=label;
  const lt=document.getElementById('voice-lobby-title');if(lt)lt.textContent=label;
  drawer.classList.remove('on');overlay.classList.remove('on');
  if(isVoice){
    showScreen('voice');
    if(media.inVoice){media.room=channel;paintVoiceGrid()}
    else {
      paintVoiceGrid();
      try{
        var bj=document.getElementById('btn-join-voice');
        if(bj){bj.disabled=false;bj.textContent='Rejoindre le salon';bj.style.pointerEvents='auto';bj.style.zIndex='6'}
      }catch(e){}
      try{__wireJoin()}catch(e){}
    }
  } else{loadMsg();showScreen('chat');document.getElementById('input').placeholder='Écrire dans '+b.textContent.trim()+'…'}
});


function saveServers(){
  try{localStorage.setItem('uv_servers',JSON.stringify(servers));localStorage.setItem('uv_current_server',currentServer)}catch(e){}
  try{
    if(user){
      var slim=(servers||[]).map(function(s){return {id:s.id,name:s.name,icon:s.icon,owner:!!s.owner,invite:s.invite,builtin:!!s.builtin}});
      account.updatePrefs(Object.assign({},prefs,{serverIndex:JSON.stringify(slim),currentServer:currentServer})).catch(function(){});
    }
  }catch(e){}
}
function serverIcon(s){return (s.icon||(s.name||'SV').slice(0,2)).toUpperCase()}
function renderServerMenu(){
  const list=document.getElementById('srv-list');
  if(!list)return;
  list.innerHTML=servers.map(s=>{
    const on=s.id===currentServer?' on':'';
    const role=s.builtin?'Serveur public':(s.owner?'Propriétaire':'Membre');
    return '<button type="button" class="srv-item'+on+'" data-sid="'+esc(s.id)+'">'
      +'<span class="srv-ico">'+esc(serverIcon(s))+'</span>'
      +'<span class="srv-meta"><strong>'+esc(s.name)+'</strong><span>'+role+'</span></span>'
      +'</button>';
  }).join('');
  list.querySelectorAll('[data-sid]').forEach(b=>b.onclick=()=>{selectServer(b.dataset.sid);closeServerMenu()});
  const head=servers.find(s=>s.id===currentServer)||servers[0];
  const hn=document.getElementById('srv-head-name');
  const hi=document.getElementById('srv-head-ico');
  if(hn)hn.textContent=head.name;
  if(hi)hi.textContent=serverIcon(head);
}
function closeServerMenu(){
  const m=document.getElementById('srv-menu');const t=document.getElementById('srv-toggle');
  if(m)m.classList.remove('on');if(t){t.classList.remove('open');t.setAttribute('aria-expanded','false')}
}
function openServerMenu(){
  renderServerMenu();
  const m=document.getElementById('srv-menu');const t=document.getElementById('srv-toggle');
  if(m)m.classList.add('on');if(t){t.classList.add('open');t.setAttribute('aria-expanded','true')}
}
function selectServer(id){
  const s=servers.find(x=>x.id===id);if(!s)return;
  currentServer=id;
  try{window.SERVER=id}catch(e){}
  saveServers();
  renderServerMenu();
  applyServerChrome(s);
  if(s.owner){const ids=(s.roles||[]).map(function(r){return r.name});setMyRoles(ids.indexOf('Admin')>=0?['Admin']:ids.slice(0,1))}
  channel='general';
  document.querySelectorAll('.ch').forEach(x=>x.classList.remove('on'));
  const g=document.querySelector('.ch[data-ch="general"]');if(g)g.classList.add('on');
  const title=document.getElementById('title');if(title)title.textContent='# général';
  try{loadMsg()}catch(e){}
  try{showScreen('chat')}catch(e){}
  try{renderChannelList()}catch(e){}
  toast('Serveur: '+s.name);
}
function applyServerChrome(s){
  if(!s)s=servers.find(x=>x.id===currentServer)||servers[0];
  if(!s)return;
  const ban=document.getElementById('hub-banner');
  const ico=document.getElementById('hub-ico');
  const info=document.querySelector('.hub-info');
  if(ban){
    if(s.banner){ban.style.backgroundImage='url('+s.banner+')';ban.classList.add('has-img')}
    else{ban.style.backgroundImage='';ban.classList.remove('has-img')}
  }
  if(ico){
    if(s.iconUrl){ico.innerHTML='<img src="'+esc(s.iconUrl)+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">'}
    else ico.textContent=serverIcon(s);
  }
  if(info){
    const strong=info.querySelector('strong');
    const p=info.querySelector('p');
    if(strong)strong.textContent=s.name||'Serveur';
    if(p)p.textContent=s.description||(s.builtin?'Communauté · vocal · médias éphémères':'Serveur Ultravoc');
    let rl=info.querySelector('.roles-line');
    if(!rl){rl=document.createElement('div');rl.className='roles-line';info.appendChild(rl)}
    const roles=s.roles||[];
    rl.innerHTML=roles.slice(0,8).map(function(r){return '<span class="role-pill" style="background:'+esc(r.color||'#7c3aed')+'33;color:'+esc(r.color||'#c084fc')+'">'+esc(r.name)+'</span>'}).join('');
  }
  const hn=document.getElementById('srv-head-name');const hi=document.getElementById('srv-head-ico');
  if(hn)hn.textContent=s.name;if(hi)hi.textContent=serverIcon(s);
}
function openSrvModal(mode){
  const modal=document.getElementById('srv-modal');
  const title=document.getElementById('srv-modal-title');
  const fn=document.getElementById('srv-field-name');
  const fc=document.getElementById('srv-field-code');
  const fs=document.getElementById('srv-field-settings');
  document.getElementById('srv-name-input').value='';
  document.getElementById('srv-code-input').value='';
  modal.dataset.mode=mode;
  if(mode==='create'){title.textContent='Créer un serveur';fn.style.display='block';fc.style.display='none';if(fs)fs.style.display='none'}
  else if(mode==='join'){title.textContent='Rejoindre un serveur';fn.style.display='none';fc.style.display='block';if(fs)fs.style.display='none'}
  else if(mode==='settings'){
    const s=servers.find(x=>x.id===currentServer)||servers[0];
    if(!s)return;
    if(!(s.owner||isAdmin||hasPerm('manage_server')||hasPerm('manage_roles'))){toast('Permission refusée');return}
    title.textContent='Paramètres — '+(s&&s.name||'');
    fn.style.display='block';fc.style.display='none';if(fs)fs.style.display='block';
    document.getElementById('srv-name-input').value=(s&&s.name)||'';
    document.getElementById('srv-desc-input').value=(s&&s.description)||'';
    document.getElementById('srv-icon-input').value=(s&&s.icon)||serverIcon(s||{});
    document.getElementById('srv-invite-display').value=(s&&s.invite)||(s&&s.builtin?'XULTRA':'—');
    const prev=document.getElementById('srv-banner-prev');
    if(prev)prev.style.backgroundImage=s&&s.banner?'url('+s.banner+')':'';
    renderRolesEditor(s);renderChanPermEditor(s);
  }
  modal.classList.add('on');closeServerMenu();
}

function channelAccess(ch){
  const s=servers.find(x=>x.id===currentServer);
  if(!s)return {ok:true,roles:[]};
  if(!s.channelPerms)s.channelPerms={};
  const conf=s.channelPerms[ch];
  if(!conf||!conf.roles||!conf.roles.length)return {ok:true,roles:[]};
  if(isAdmin||s.owner||hasPerm('admin'))return {ok:true,roles:conf.roles};
  const mine=myRoleIds();
  const ok=conf.roles.some(function(rn){return mine.indexOf(rn)>=0});
  return {ok:ok,roles:conf.roles};
}
function canViewChannel(ch){return channelAccess(ch).ok}
function renderChannelList(){
  document.querySelectorAll('.ch[data-ch]').forEach(function(btn){
    const ch=btn.dataset.ch;
    const acc=channelAccess(ch);
    btn.classList.remove('locked','ch-hidden');
    if(!acc.ok){
      // hide restricted channels unless manage_channels
      if(hasPerm('manage_channels')||hasPerm('admin')){btn.classList.add('locked')}
      else btn.classList.add('ch-hidden');
    }
  });
  // custom channels
  const host=document.getElementById('custom-channels');
  if(host){
    const s=servers.find(x=>x.id===currentServer);
    const extra=(s&&s.extraChannels)||[];
    host.innerHTML=extra.map(function(ch){
      const acc=channelAccess(ch.id);
      if(!acc.ok&&!(hasPerm('manage_channels')||hasPerm('admin')||(s&&s.owner)))return '';
      const lock=(!acc.ok)?' locked':'';
      return '<button class="ch'+lock+'" data-ch="'+esc(ch.id)+'" type="button"># '+esc(ch.name||ch.id)+'</button>';
    }).join('');
    host.querySelectorAll('.ch').forEach(function(b){
      b.onclick=function(){document.querySelectorAll('.ch').forEach(x=>x.classList.remove('on'));b.classList.add('on');
        channel=b.dataset.ch;
        if(!canViewChannel(channel)){toast('Salon réservé: '+(channelAccess(channel).roles||[]).join(', '));return}
        document.getElementById('title').textContent=b.textContent.trim();
        try{loadMsg()}catch(e){}
        try{showScreen('chat')}catch(e){}
        drawer.classList.remove('on');overlay.classList.remove('on');
      };
    });
  }
}
function renderChanPermEditor(s){
  const box=document.getElementById('srv-chan-perms');if(!box||!s)return;
  if(!s.channelPerms)s.channelPerms={};
  const base=['general','media','annonces','reglement','vocal','vocal-afk','vocal-gaming','vocal-musique'];
  const extra=(s.extraChannels||[]).map(function(c){return c.id});
  const all=base.concat(extra);
  const roleNames=(s.roles||[]).map(function(r){return r.name});
  box.innerHTML=all.map(function(ch){
    const conf=s.channelPerms[ch]||{roles:[]};
    const opts=['<option value="">Tout le monde</option>'].concat(roleNames.map(function(n){
      return '<option value="'+esc(n)+'"'+(conf.roles.indexOf(n)>=0?' selected':'')+'>'+esc(n)+'</option>';
    })).join('');
    return '<div class="chan-perm-row"><span style="min-width:90px;font-weight:700">#'+esc(ch)+'</span><select data-chperm="'+esc(ch)+'" multiple size="2" style="min-height:40px">'+opts+'</select></div>';
  }).join('')+'<p class="perm-hint">Ctrl/Cmd+clic pour plusieurs rôles. Vide = public.</p>';
  box.querySelectorAll('[data-chperm]').forEach(function(sel){
    sel.onchange=function(){
      if(!hasPerm('manage_channels')&&!s.owner&&!isAdmin)return toast('Permission refusée');
      const roles=Array.from(sel.selectedOptions).map(function(o){return o.value}).filter(Boolean);
      if(!s.channelPerms)s.channelPerms={};
      if(!roles.length)delete s.channelPerms[sel.dataset.chperm];
      else s.channelPerms[sel.dataset.chperm]={roles:roles};
      saveServers();
      renderChannelList();
    };
  });
}

var PERM_DEFS=[
  ['admin','Administrateur (toutes)'],
  ['manage_server','Gérer le serveur'],
  ['manage_roles','Gérer les rôles'],
  ['manage_channels','Gérer les salons'],
  ['kick','Expulser'],
  ['ban','Bannir'],
  ['manage_messages','Modérer les messages'],
  ['send_messages','Envoyer des messages'],
  ['attach_files','Joindre des fichiers'],
  ['mention_everyone','Mentionner @everyone'],
  ['connect_voice','Rejoindre un vocal'],
  ['speak','Parler en vocal'],
  ['video','Caméra / stream']
];
var editingRoleIdx=-1;
function defaultMemberPerms(){return {send_messages:1,connect_voice:1,speak:1,attach_files:1,video:1}}
function loadMemberMap(){
  try{return JSON.parse(localStorage.getItem('uv_server_members')||'{}')}catch(e){return {}}
}
function saveMemberMap(map){
  try{localStorage.setItem('uv_server_members',JSON.stringify(map))}catch(e){}
  try{if(user&&typeof savePrefs==='function')savePrefs({serverMembers:JSON.stringify(map)})}catch(e){}
}
function rolesForUser(uid){
  const map=loadMemberMap();
  const srv=map[currentServer]||{};
  return srv[uid]||[];
}
function setRolesForUser(uid,ids){
  const map=loadMemberMap();
  if(!map[currentServer])map[currentServer]={};
  map[currentServer][uid]=ids;
  saveMemberMap(map);
}
function myRoleIds(){
  if(!user)return [];
  return rolesForUser(user.$id);
}
function setMyRoles(ids){
  if(!user)return;
  setRolesForUser(user.$id, ids);
}
function renderProfileRoles(){
  const box=document.getElementById('p-roles');
  const assign=document.getElementById('p-roles-assign');
  if(!box)return;
  const s=servers.find(x=>x.id===currentServer);
  const roles=(s&&s.roles)||[];
  const mine=myRoleIds();
  // ensure owner has Admin
  if(s&&s.owner&&user&&mine.indexOf('Admin')<0){
    const n=mine.concat(['Admin']);
    setMyRoles(n);
  }
  const active=myRoleIds();
  box.innerHTML=active.length?active.map(function(name){
    const r=roles.find(function(x){return x.name===name})||{name:name,color:'#a855f7'};
    return '<span class="role-pill" style="background:'+esc(r.color||'#7c3aed')+'33;color:'+esc(r.color||'#c084fc')+'">'+esc(r.name)+'</span>';
  }).join(''):'<span style="font-size:.75rem;color:var(--m)">Aucun rôle assigné (défaut Membre)</span>';
  const canAssign=!!(isAdmin||(s&&s.owner)||hasPerm('manage_roles'));
  if(assign){
    assign.style.display=canAssign?'block':'none';
    const sel=document.getElementById('p-role-select');
    if(sel){
      sel.innerHTML=roles.map(function(r){return '<option value="'+esc(r.name)+'">'+esc(r.name)+'</option>'}).join('')||'<option value="">—</option>';
    }
  }
}

function hasPerm(perm){
  if(perm==='send_messages'){
    try{if(user&&typeof isBanned==='function'&&isBanned(user.$id))return false}catch(e){}
    return true;
  }
  if(isAdmin)return true;
  const s=servers.find(x=>x.id===currentServer);
  if(!s)return perm==='send_messages'||perm==='connect_voice'||perm==='speak';
  if(s.owner)return true;
  if(s.builtin&&(perm==='send_messages'||perm==='connect_voice'||perm==='speak'||perm==='video'))return true;
  const roles=s.roles||[];
  const mine=myRoleIds();
  // owner role or admin role by name if listed
  let merged={};
  roles.forEach(function(r,i){
    const assigned=mine.indexOf(r.name)>=0||mine.indexOf(String(i))>=0;
    const isOwnerRole=r.perms&&r.perms.admin&&s.owner;
    if(!assigned&&!(s.owner&&r.name==='Admin'))return;
    if(s.owner&&r.name==='Admin'){merged.admin=1}
    if(assigned||(s.owner&&r.name==='Admin')){
      const p=r.perms||{};
      Object.keys(p).forEach(function(k){if(p[k])merged[k]=1});
    }
  });
  // if no roles assigned, grant member defaults for non-owners
  if(!mine.length&&!s.owner){
    const mem=roles.find(function(r){return r.name==='Membre'});
    merged=Object.assign({}, (mem&&mem.perms)||defaultMemberPerms());
  }
  if(merged.admin)return true;
  return !!merged[perm];
}
function renderRolesEditor(s){
  const box=document.getElementById('srv-roles-list');if(!box)return;
  const roles=(s&&s.roles)||[];
  box.innerHTML=roles.map(function(r,i){
    const sel=editingRoleIdx===i?' sel':'';
    return '<span class="role-pill'+sel+'" data-edit="'+i+'" style="background:'+esc(r.color||'#7c3aed')+'33;color:'+esc(r.color||'#c084fc')+';cursor:pointer">'+esc(r.name)+' <button type="button" data-ri="'+i+'" style="border:0;background:0;color:inherit;cursor:pointer;font-weight:900">×</button></span>';
  }).join('')||'<span style="font-size:.75rem;color:var(--m)">Aucun rôle — ajoute-en ci-dessous</span>';
  box.querySelectorAll('[data-ri]').forEach(function(b){b.onclick=function(e){e.stopPropagation();const s2=servers.find(x=>x.id===currentServer);if(!s2||!s2.roles)return;if(!hasPerm('manage_roles')&&!s2.owner&&!isAdmin)return toast('Permission refusée');s2.roles.splice(+b.dataset.ri,1);if(editingRoleIdx===+b.dataset.ri)editingRoleIdx=-1;saveServers();renderRolesEditor(s2);applyServerChrome(s2);renderPermEditor(s2)}});
  box.querySelectorAll('[data-edit]').forEach(function(b){b.onclick=function(e){if(e.target.dataset.ri!=null)return;editingRoleIdx=+b.dataset.edit;renderRolesEditor(s);renderPermEditor(s)}});
  renderPermEditor(s);
}
function renderPermEditor(s){
  var host=document.getElementById('srv-perm-editor');
  if(!host){
    const settings=document.getElementById('srv-field-settings');
    if(!settings)return;
    host=document.createElement('div');
    host.id='srv-perm-editor';
    settings.appendChild(host);
  }
  if(editingRoleIdx<0||!s||!s.roles||!s.roles[editingRoleIdx]){
    host.innerHTML='<p class="perm-hint">Clique un rôle pour éditer ses permissions.</p>';
    return;
  }
  const role=s.roles[editingRoleIdx];
  if(!role.perms)role.perms=defaultMemberPerms();
  host.innerHTML='<div class="perm-hint">Permissions — <strong style="color:'+esc(role.color||'#c084fc')+'">'+esc(role.name)+'</strong></div><div class="perm-grid" id="perm-grid"></div>';
  const grid=document.getElementById('perm-grid');
  PERM_DEFS.forEach(function(def){
    const key=def[0],label=def[1];
    const row=document.createElement('label');
    row.className='perm-row';
    const checked=role.perms[key]?true:false;
    row.innerHTML='<input type="checkbox" data-perm="'+key+'"'+(checked?' checked':'')+'> <span>'+esc(label)+'</span>';
    grid.appendChild(row);
  });
  grid.querySelectorAll('[data-perm]').forEach(function(cb){
    cb.onchange=function(){
      if(!hasPerm('manage_roles')&&!s.owner&&!isAdmin){cb.checked=!!role.perms[cb.dataset.perm];return toast('Permission refusée')}
      role.perms[cb.dataset.perm]=cb.checked?1:0;
      if(cb.dataset.perm==='admin'&&cb.checked){
        PERM_DEFS.forEach(function(d){role.perms[d[0]]=1});
        renderPermEditor(s);
      }
      saveServers();
    };
  });
}
function closeSrvModal(){document.getElementById('srv-modal').classList.remove('on')}
function genInvite(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='XU-';for(let i=0;i<6;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
async function confirmSrvModal(){
  const mode=document.getElementById('srv-modal').dataset.mode;
  if(mode==='settings'){
    const s=servers.find(x=>x.id===currentServer);if(!s)return toast('Serveur introuvable');
    if(!(s.owner||s.builtin&&isAdmin||isAdmin))return toast('Réservé au propriétaire / admin');
    const name=(document.getElementById('srv-name-input').value||'').trim().slice(0,100);
    if(name.length>=2)s.name=name;
    s.description=(document.getElementById('srv-desc-input').value||'').trim().slice(0,120);
    const ic=(document.getElementById('srv-icon-input').value||'').trim().slice(0,2).toUpperCase();
    if(ic)s.icon=ic;
    saveServers();
    try{if(typeof setPlatform==='function')await setPlatform('server:'+s.id,JSON.stringify({id:s.id,name:s.name,invite:s.invite,description:s.description,banner:s.banner,icon:s.icon,iconUrl:s.iconUrl,roles:s.roles||[],ownerId:user&&user.$id}))}catch(e){}
    applyServerChrome(s);renderServerMenu();closeSrvModal();toast('Serveur mis à jour');
    return;
  }
  if(mode==='create'){
    if(!uvGuard('server_create'))return;
    try{var owned=(servers||[]).filter(function(s){return s.owner}).length;if(owned>=15)return toast('Maximum 15 serveurs créés')}catch(e){}
    const name=(document.getElementById('srv-name-input').value||'').trim().slice(0,100);
    if(name.length<2)return toast('Nom trop court');
    if(String(name).toLowerCase().indexOf('http')>=0)return toast('Nom invalide');
    const id='srv-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    const invite=genInvite();
    const s={id,name,icon:name.slice(0,2).toUpperCase(),owner:true,invite,builtin:false,roles:[{name:'Admin',color:'#e11d48',perms:{admin:1}},{name:'Membre',color:'#a855f7',perms:{send_messages:1,connect_voice:1,speak:1,attach_files:1,video:1}}],description:''};
    servers.push(s);
    try{saveServers()}catch(e){}
    try{if(typeof setPlatform==='function')await setPlatform('server:'+id,JSON.stringify({id:id,name:name,invite:invite,ownerId:user&&user.$id}))}catch(e){console.warn(e)}
    try{closeSrvModal()}catch(e){}
    try{selectServer(id)}catch(e){currentServer=id;try{renderServerMenu()}catch(x){}}
    toast('Serveur cree · code '+invite);
  } else {
    const code=(document.getElementById('srv-code-input').value||'').trim().toUpperCase();
    if(code.length<4)return toast('Code invalide');
    // try known local invites or platform
    let found=servers.find(s=>(s.invite||'').toUpperCase()===code);
    if(!found){
      try{
        await loadPlatform();
        for(const [k,v] of Object.entries(platform||{})){
          if(!k.startsWith('server:'))continue;
          try{const o=JSON.parse(v);if((o.invite||'').toUpperCase()===code){found={id:o.id,name:o.name,icon:(o.name||'SV').slice(0,2).toUpperCase(),owner:false,invite:o.invite,builtin:false};break}}catch(e){}
        }
      }catch(e){}
    }
    // accept XULTRA hub aliases
    if(!found && (code==='XULTRA'||code==='HUB'||code==='XULTRA-HUB')){
      found=servers.find(s=>s.id==='hub-xultra');
    }
    if(!found){
      // create membership stub so user can still enter with custom code as new shared space id
      const id='join-'+code.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,16);
      found={id,name:'Serveur '+code,icon:code.slice(0,2),owner:false,invite:code,builtin:false};
    }
    if(!servers.some(s=>s.id===found.id))servers.push(found);
    saveServers();closeSrvModal();selectServer(found.id);
    toast('Rejoint: '+found.name);
  }
}
function wireServerUI(){
  const tog=document.getElementById('srv-toggle');
  if(tog)tog.onclick=e=>{e.stopPropagation();const m=document.getElementById('srv-menu');if(m&&m.classList.contains('on'))closeServerMenu();else openServerMenu()};
  document.getElementById('srv-create-btn').onclick=()=>openSrvModal('create');
  document.getElementById('srv-join-btn').onclick=()=>openSrvModal('join');
  const setBtn=document.getElementById('srv-settings-btn');
  if(setBtn)setBtn.onclick=()=>openSrvModal('settings');
  document.getElementById('srv-modal-cancel').onclick=closeSrvModal;
  document.getElementById('srv-modal-ok').onclick=confirmSrvModal;try{document.getElementById('srv-modal-ok').type='button'}catch(e){}
  const roleAdd=document.getElementById('srv-role-add');
  if(roleAdd)roleAdd.onclick=()=>{
    const s=servers.find(x=>x.id===currentServer);if(!s)return;
    if(!(s.owner||isAdmin))return toast('Pas la permission');
    const n=(document.getElementById('srv-role-name').value||'').trim().slice(0,40);
    if(!n)return toast('Nom du rôle requis');
    const c=document.getElementById('srv-role-color').value||'#a855f7';
    if(!s.roles)s.roles=[];
    s.roles.push({name:n,color:c,perms:defaultMemberPerms()});
    document.getElementById('srv-role-name').value='';
    saveServers();renderRolesEditor(s);applyServerChrome(s);
  };
  
  const chanAdd=document.getElementById('srv-chan-add');
  if(chanAdd)chanAdd.onclick=()=>{
    const s=servers.find(x=>x.id===currentServer);if(!s)return;
    if(!hasPerm('manage_channels')&&!s.owner&&!isAdmin)return toast('Permission refusée');
    if(!uvGuard('channel_create'))return;
    try{if((s.extraChannels||[]).length>=50)return toast('Maximum 50 salons')}catch(e){}
    let id=(document.getElementById('srv-chan-new').value||'').trim().toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,32);
    if(id.length<2)return toast('Nom de salon invalide');
    if(!s.extraChannels)s.extraChannels=[];
    if(s.extraChannels.some(function(c){return c.id===id}))return toast('Existe déjà');
    s.extraChannels.push({id:id,name:id});
    document.getElementById('srv-chan-new').value='';
    saveServers();renderChanPermEditor(s);renderChannelList();toast('Salon #'+id+' créé');
  };

  const invCopy=document.getElementById('srv-invite-copy');
  if(invCopy)invCopy.onclick=()=>{
    const v=document.getElementById('srv-invite-display');
    const t=(v&&v.value)||'';
    if(!t||t==='—')return toast('Pas de code');
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(()=>toast('Code copie: '+t)).catch(()=>toast(t));
    else toast(t);
  };
const banIn=document.getElementById('srv-banner-input');
  if(banIn)banIn.onchange=async()=>{
    const f=banIn.files&&banIn.files[0];if(!f)return;
    const s=servers.find(x=>x.id===currentServer);if(!s)return;
    try{toast('Upload bannière…');const url=await imgbb(f);s.banner=url;saveServers();
      document.getElementById('srv-banner-prev').style.backgroundImage='url('+url+')';applyServerChrome(s);toast('Bannière OK')}catch(e){toast(e.message||'Upload échoué')}
  };
  const icoIn=document.getElementById('srv-icon-file');
  if(icoIn)icoIn.onchange=async()=>{
    const f=icoIn.files&&icoIn.files[0];if(!f)return;
    const s=servers.find(x=>x.id===currentServer);if(!s)return;
    try{toast('Upload icône…');const url=await imgbb(f);s.iconUrl=url;saveServers();applyServerChrome(s);toast('Icône OK')}catch(e){toast(e.message||'Upload échoué')}
  };
  document.getElementById('srv-modal').addEventListener('click',e=>{if(e.target.id==='srv-modal')closeSrvModal()});
  document.addEventListener('click',e=>{
    const dh=document.querySelector('.dh');
    if(dh&&!dh.contains(e.target))closeServerMenu();
  });
  try{
    if(prefs&&prefs.serverMembers){
      const remote=JSON.parse(prefs.serverMembers);
      const local=loadMemberMap();
      Object.keys(remote||{}).forEach(function(sid){
        if(!local[sid])local[sid]={};
        Object.assign(local[sid], remote[sid]||{});
      });
      saveMemberMap(local);
    }
  }catch(e){}
  // merge servers from prefs if any
  try{
    if(prefs&&prefs.servers){
      const arr=JSON.parse(prefs.servers);
      if(Array.isArray(arr)){
        arr.forEach(s=>{if(s&&s.id&&!servers.some(x=>x.id===s.id))servers.push(s)});
      }
    }
    if(prefs&&prefs.currentServer&&servers.some(s=>s.id===prefs.currentServer))currentServer=prefs.currentServer;
  }catch(e){}
  renderServerMenu();
  try{applyServerChrome(servers.find(s=>s.id===currentServer)||servers[0])}catch(e){}
  try{renderChannelList()}catch(e){}
}
async function loadMsg(){
  const box=document.getElementById('messages');
  if(!box)return;
  try{
    const r=await db.listDocuments(DB,'ultravoc_messages',[
      Query.equal('channel', channel||'general'),
      Query.orderDesc('$createdAt'),
      Query.limit(60)
    ]);
    const docs=(r.documents||[]).slice().reverse();
    if(!docs.length){
      box.innerHTML='<div style="text-align:center;padding:48px 20px;color:var(--m)"><div style="font-size:2.2rem;margin-bottom:10px;opacity:.9">💬</div><div style="font-weight:700;color:var(--t);margin-bottom:6px">Salon silencieux</div><div style="font-size:.85rem;line-height:1.5;opacity:.8">Aucun message pour l’instant.<br>Sois le premier à briser la glace.</div></div>';
      return;
    }
    box.innerHTML='';
    docs.forEach(d=>{
      try{if(d.expiresAt&&!String(d.expiresAt).startsWith('2099')&&new Date(d.expiresAt).getTime()<Date.now())return}catch(e){}
      if(d.userId&&(isUserBlocked(d.userId)||(typeof isIgnored==='function'&&isIgnored(d.userId))))return;
      const el=document.createElement('div');
      el.className='cmsg';
      el.dataset.id=d.$id||'';
      const when=fmtRelative(d.$createdAt)||((d.$createdAt||'').slice(11,16)||'');
      var media=d.media||'';
      var txt=d.text||'';
      var imgHtml='';
      function looksUrl(u){return !!(u&&(u.indexOf('http://')===0||u.indexOf('https://')===0))}
      function looksImg(u){if(!u)return false;var x=u.toLowerCase();return x.indexOf('.gif')>=0||x.indexOf('.png')>=0||x.indexOf('.jpg')>=0||x.indexOf('.jpeg')>=0||x.indexOf('.webp')>=0||x.indexOf('giphy.com')>=0||x.indexOf('imgur')>=0||x.indexOf('ibb.co')>=0}
      if(looksUrl(media))imgHtml='<img class="att" src="'+esc(media)+'" alt="">';
      else {
        var sp=txt.split(' ');
        for(var si=0;si<sp.length;si++){if(looksUrl(sp[si])&&looksImg(sp[si])){imgHtml='<img class="att" src="'+esc(sp[si])+'" alt="">';break}}
      }
      // index member from message authors
      try{
        if(d.userId){
          var _mm=loadMemberMap();
          if(!_mm[currentServer])_mm[currentServer]={};
          if(!_mm[currentServer][d.userId]){_mm[currentServer][d.userId]=[];saveMemberMap(_mm)}
          var _nk=JSON.parse(localStorage.getItem('uv_member_names')||'{}');
          _nk[d.userId]=d.userName||d.name||'User';
          localStorage.setItem('uv_member_names',JSON.stringify(_nk));
          touchPresence(d.userId);
        }
      }catch(e){}
      var canDel=hasPerm('manage_messages')||hasPerm('admin')||(user&&d.userId===user.$id);
      var canEdit=!!(user&&d.userId===user.$id);
      var actBtns='<button type="button" data-reply="'+esc(d.$id||'')+'" data-rn="'+esc(d.userName||d.name||'User')+'" data-rt="'+esc((d.text||'').slice(0,80))+'">Rep.</button>';
      if(canEdit)actBtns+='<button type="button" data-edit="'+esc(d.$id||'')+'" data-et="'+esc(d.text||'')+'">Edit</button>';
      if(canDel)actBtns+='<button type="button" data-del="'+esc(d.$id||'')+'">Suppr.</button>';
      actBtns+='<button type="button" data-react="'+esc(d.$id||'')+'">+</button>';
      actBtns+='<button type="button" data-pin="'+esc(d.$id||'')+'" data-pt="'+esc((d.text||'').slice(0,100))+'" data-pn="'+esc(d.userName||'')+'">Pin</button>';
      actBtns+='<button type="button" data-bm="'+esc(d.$id||'')+'" data-bt="'+esc((d.text||'').slice(0,80))+'">BM</button>';
      var act=actBtns?'<div class="msg-act">'+actBtns+'</div>':'';
      var quote='';
      if(d.replyToName){quote='<div class="quote">'+esc(d.replyToName)+': '+esc(d.replyToText||'')+'</div>';}
      var reactsHtml=renderReactsHtml(d.$id,d.reactions);
      var avUrl='';
      try{
        var cache=window.__globalMembersCache||[];
        var hit=cache.find(function(x){return x.id===d.userId});
        if(hit&&hit.avatar)avUrl=hit.avatar;
        if(!avUrl&&d.userId===((user&&user.$id)||'')&&prefs.avatar)avUrl=prefs.avatar;
      }catch(e){}
      var initials=esc(String(d.userName||d.name||'?').slice(0,2).toUpperCase());
      var avHtml=avatarMarkup(avUrl, d.userName||d.name||'?');
      var uidForProf=d.userId||'';
      if(!uidForProf&&user&&(d.userName===user.name||d.userName===(prefs.displayName||''))) uidForProf=user.$id;

      el.innerHTML='<div class="mav" data-user-id="'+esc(uidForProf||d.userId||'')+'" title="Profil">'+avHtml+'</div><div class="mbody">'+quote+'<div class="meta"><span class="name clickable-user" data-user-id="'+esc(uidForProf||d.userId||'')+'">'+goldNameHtml(d.userName||d.name||'User')+'</span><span class="time">'+esc(when)+'</span></div><div class="txt">'+formatMsgText(txt)+'</div>'+imgHtml+reactsHtml+'</div>'+act;

      box.appendChild(el);
      try{if(typeof wireMsgDeleteGestures==='function')wireMsgDeleteGestures(el, el.dataset.id||d.$id, typeof canDel!=='undefined'?canDel:true)}catch(e){}

      try{
        el.querySelectorAll('[data-user-id]').forEach(function(node){
          node.addEventListener('click',function(ev){
            ev.preventDefault();ev.stopPropagation();
            var id=node.getAttribute('data-user-id');
            if(id) openUserProfile(id);
          });
        });
      }catch(e){}
      el.ondblclick=function(){
        window.__reply={id:d.$id,name:d.userName||d.name||'User',text:(d.text||'').slice(0,80)};
        var bar=document.getElementById('reply-bar');var nm=document.getElementById('reply-to-name');
        if(nm)nm.textContent=window.__reply.name;if(bar)bar.classList.add('on');
      };
    });
    if(window.__msgCount&&docs.length>window.__msgCount&&!document.hasFocus()&&!isChannelMuted(channel)){playNotifSound();notifyDesktop('Ultravoc', 'Nouveau message dans #'+(channel||'general'))}
    window.__msgCount=docs.length;
    box.scrollTop=box.scrollHeight;
    box.querySelectorAll('[data-del]').forEach(function(b){
      b.onclick=async function(ev){
        ev.stopPropagation();
        var id=b.dataset.del;if(!id)return;
        var el=b.closest('.cmsg')||b.closest('.msg');
        try{await deleteMessageAnimated(el,id)}catch(err){toast('Suppression impossible');console.warn(err)}
      };
    });
    box.querySelectorAll('[data-reply]').forEach(function(b){
      b.onclick=function(ev){
        ev.stopPropagation();
        window.__reply={id:b.dataset.reply,name:b.dataset.rn,text:b.dataset.rt};
        var bar=document.getElementById('reply-bar');
        var nm=document.getElementById('reply-to-name');
        if(nm)nm.textContent=b.dataset.rn||'';
        if(bar)bar.classList.add('on');
        var inp=document.getElementById('input');if(inp)inp.focus();
      };
    });
    box.querySelectorAll('[data-edit]').forEach(function(b){
      b.onclick=async function(ev){
        ev.stopPropagation();
        var id=b.dataset.edit;var old=b.dataset.et||'';
        var neu=prompt('Modifier le message', old);
        if(neu==null)return;
        neu=neu.trim().slice(0,800);
        if(!neu)return toast('Vide');
        try{
          await db.updateDocument(DB,'ultravoc_messages',id,{text:neu});
          toast('Message modifie');loadMsg();
        }catch(err){toast('Edition impossible');console.warn(err)}
      };
    });
    
    box.querySelectorAll('[data-react]').forEach(function(b){
      b.onclick=function(ev){
        ev.stopPropagation();
        var em=prompt('Emoji reaction','🔥');
        if(!em)return;
        toggleReact(b.dataset.react, em.trim().slice(0,8));
      };
    });
    box.querySelectorAll('[data-re]').forEach(function(b){
      b.onclick=function(ev){ev.stopPropagation();toggleReact(b.dataset.re, b.dataset.emoji)};
    });

    try{
      var newest=docs.length?docs[docs.length-1].$createdAt:'';
      if(newest)localStorage.setItem('uv_lastseen_'+(channel||'general'),newest);
    }catch(e){}
  }catch(e){
    console.warn('loadMsg',e);
    box.innerHTML='<p style="text-align:center;color:var(--m);padding:28px 12px;font-size:.85rem">Chat prêt — envoie un message.</p>';
  }
}

window.__uvRL=window.__uvRL||{};
var UV_RL_LIMITS={msg:{max:20,windowMs:60000,minGap:800},friend:{max:30,windowMs:3600000,minGap:2000},server_create:{max:12,windowMs:3600000,minGap:1500},server_join:{max:20,windowMs:3600000,minGap:2000},channel_create:{max:15,windowMs:3600000,minGap:3000},report:{max:10,windowMs:3600000,minGap:5000},auth:{max:8,windowMs:900000,minGap:1500},generic:{max:40,windowMs:60000,minGap:300}};
function uvRlKey(action){var uid=(typeof user!=='undefined'&&user&&user.$id)?user.$id:'anon';return action+'::'+uid}
function uvRlCheck(action){
  var lim=UV_RL_LIMITS[action]||UV_RL_LIMITS.generic;var key=uvRlKey(action);var now=Date.now();
  var st=window.__uvRL[key];if(!st){st=window.__uvRL[key]={times:[],last:0}}
  st.times=st.times.filter(function(t){return now-t<lim.windowMs});
  if(st.last&&now-st.last<lim.minGap){return {ok:false,reason:'Trop rapide — attends un instant'}}
  if(st.times.length>=lim.max){return {ok:false,reason:'Limite atteinte — réessaie plus tard'}}
  return {ok:true};
}
function uvRlHit(action){var key=uvRlKey(action);var now=Date.now();if(!window.__uvRL[key])window.__uvRL[key]={times:[],last:0};window.__uvRL[key].times.push(now);window.__uvRL[key].last=now;try{localStorage.setItem('uv_rl_'+key,JSON.stringify(window.__uvRL[key]))}catch(e){}}
function uvRlLoad(){try{Object.keys(localStorage).forEach(function(k){if(k.indexOf('uv_rl_')!==0)return;try{window.__uvRL[k.slice(6)]=JSON.parse(localStorage.getItem(k))}catch(e){}})}catch(e){}}
try{uvRlLoad()}catch(e){}
function uvSpamScore(text){
  text=String(text||'');var score=0;var low=text.toLowerCase();
  if(text.length>350)score+=2;
  if(text.split('http').length>3)score+=3;
  if(low.indexOf('free nitro')>=0||low.indexOf('discord.gift')>=0||low.indexOf('@everyone')>=0)score+=5;
  try{if(window.__uvLastMsgText&&text===window.__uvLastMsgText)score+=4}catch(e){}
  var letters=text.replace(/[^a-zA-Z]/g,'');
  if(letters.length>20){var up=letters.replace(/[^A-Z]/g,'').length;if(up/letters.length>0.85)score+=2}
  return score;
}
function uvGuard(action,text){
  var rl=uvRlCheck(action);if(!rl.ok){try{toast(rl.reason)}catch(e){}return false}
  if(text!=null&&text!==''){var sc=uvSpamScore(text);if(sc>=5){try{toast('Message bloqué (anti-spam)')}catch(e){}return false}if(sc>=3)uvRlHit(action)}
  try{var hp=document.getElementById('uv-hp');if(hp&&hp.value){try{toast('Action refusée')}catch(e){}return false}}catch(e){}
  uvRlHit(action);if(text)window.__uvLastMsgText=String(text);return true;
}

async function sendMsg(){
  const input=document.getElementById('input');
  if(!input)return;
  if(localStorage.getItem('uv_ai_auto')==='1'&&(input.value||'').trim()){
    try{input.value=await aiCorrectText(input.value,'fr')}catch(e){}
  }
  let text=(input.value||'').trim();
  text=slashCommands(text);
  if(!user)return;if(!text&&!pendingAttach)return;
  if(!uvGuard('msg', text))return;

  try{if(typeof hasPerm==='function'&&!hasPerm('send_messages')){toast('Permission refusée: envoyer des messages');return}}catch(e){}
  input.value='';
  try{localStorage.removeItem('uv_draft_'+(channel||'general'))}catch(e){}
  try{updateCharCount()}catch(e){}
  try{
    const exp=document.getElementById('expiry');
    let ttl=exp?parseInt(exp.value,10):0;if(isNaN(ttl)||ttl<0)ttl=0;
    if(user&&isBanned(user.$id)){toast('Tu es banni de ce serveur');return}
    let body=text.slice(0,400);
    if(pendingAttach){
      if(pendingAttach.url)body=(body?body+String.fromCharCode(10):'')+pendingAttach.url;
      else if(pendingAttach.name)body=(body?body+String.fromCharCode(10):'')+'[Fichier: '+pendingAttach.name+']';
    }
    const rep=window.__reply||null;
    const payload={
      channel:channel||'general',
      text:body.slice(0,800),
      userId:user.$id,
      userName:publicName(uvPref('nick_'+currentServer)||prefs.displayName||user.name||'User'),
      media:pendingAttach&&pendingAttach.url||'',
      replyTo:rep&&rep.id||'',
      replyToName:rep&&rep.name||'',
      replyToText:rep&&rep.text||'',
      expiresAt:ttl>0?new Date(Date.now()+ttl*1000).toISOString():'2099-12-31T23:59:59.000Z'
    };
    pendingAttach=null;try{showAttach()}catch(e){}
    window.__reply=null;
    try{var rb=document.getElementById('reply-bar');if(rb)rb.classList.remove('on')}catch(e){}
    try{
      await db.createDocument(DB,'ultravoc_messages',ID.unique(),payload);
    }catch(e){
      try{
        await db.createDocument(DB,'ultravoc_messages',ID.unique(),{
          channel:payload.channel,text:payload.text,userId:payload.userId,userName:payload.userName
        });
      }catch(e2){console.warn('sendMsg db',e,e2);toast('Message affiché ici (sync serveur ratee)')}
    }
    const box=document.getElementById('messages');
    if(box){
      if(box.querySelector('p'))box.innerHTML='';
      const el=document.createElement('div');el.className='cmsg';
      var _av='';
      try{if(prefs.avatar)_av=prefs.avatar}catch(e){}
      var _ini=esc(String(payload.userName||'?').slice(0,2).toUpperCase());
      var _avh=_av?('<img src="'+esc(_av)+'" alt="" referrerpolicy="no-referrer">'):_ini;
      el.innerHTML='<div class="mav" data-user-id="'+esc(payload.userId||'')+'" title="Profil">'+_avh+'</div><div class="mbody"><div class="meta"><span class="name clickable-user" data-user-id="'+esc(payload.userId||'')+'">'+goldNameHtml(payload.userName||'User')+'</span><span class="time">maintenant</span></div><div class="txt">'+esc(payload.text||'')+'</div></div>';
box.appendChild(el);
      try{if(typeof wireMsgDeleteGestures==='function')wireMsgDeleteGestures(el, el.dataset.id||d.$id, typeof canDel!=='undefined'?canDel:true)}catch(e){}
box.scrollTop=box.scrollHeight;
      try{el.querySelectorAll('[data-user-id]').forEach(function(node){node.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();var id=node.getAttribute('data-user-id');if(id)openUserProfile(id)})})}catch(e){}

    }
  }catch(e){toast(e.message||'Envoi impossible')}
}

function openCamLightbox(src, title, isStream){
  var lb=document.getElementById('cam-lightbox');
  var mediaBox=document.getElementById('cam-lb-media');
  var cap=document.getElementById('cam-lb-cap');
  if(!lb||!mediaBox)return;
  mediaBox.innerHTML='';
  if(isStream && src){
    var v=document.createElement('video');
    v.autoplay=true;v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');
    v.srcObject=src;
    v.style.maxHeight='80vh';
    mediaBox.appendChild(v);
  } else if(typeof src==='string'){
    var img=document.createElement('img');img.src=src;mediaBox.appendChild(img);
  }
  if(cap)cap.textContent=title||'';
  lb.classList.add('on');
}
function closeCamLightbox(){
  var lb=document.getElementById('cam-lightbox');
  var mediaBox=document.getElementById('cam-lb-media');
  if(mediaBox)mediaBox.innerHTML='';
  if(lb)lb.classList.remove('on');
}

function paintVoiceGrid(){
  const g=document.getElementById('voice-grid');
  const lobby=document.getElementById('voice-lobby');
  const bar=document.getElementById('voice-bar');
  const st=document.getElementById('voice-status');
  if(!g)return;
  if(!media.inVoice){
    if(lobby)lobby.style.display='flex';
    g.style.display='none';
    if(bar)bar.style.display='none';
    if(st){st.textContent='Non connecte';st.classList.remove('live')}
    updateVoiceChannelUsers();
    return;
  }
  if(lobby)lobby.style.display='none';
  g.style.display='grid';
  if(bar)bar.style.display='flex';
  if(st)st.classList.add('live');
  const me={name:(prefs&&prefs.displayName)||(user&&user.name)||'Moi',av:(prefs&&prefs.avatar)||'',speak:!!(media.mic&&!media.deaf),self:true,muted:!media.mic||!!media.deaf};
  const list=[me];
  Object.keys(window.__voicePeers||{}).forEach(function(pid){
    var p=window.__voicePeers[pid]||{};
    list.push({id:pid,name:p.name||'User',av:p.av||'',speak:false,self:false,muted:false});
  });
  g.innerHTML='';
  list.forEach(function(t){
    const d=document.createElement('div');d.className='vtile'+(t.speak?' speak':'');if(t.id){d.dataset.uid=t.id;d.dataset.userId=t.id;d.setAttribute('data-user-id',t.id)}
    var localCam=t.self&&media.cam&&media.stream&&media.stream.getVideoTracks().some(function(x){return x.enabled&&x.readyState==='live'});
    var remoteStream=(!t.self&&t.id&&window.__remoteStreams)?window.__remoteStreams[t.id]:null;
    var remoteCam=remoteStream&&remoteStream.getVideoTracks&&remoteStream.getVideoTracks().some(function(x){return x.enabled&&x.readyState==='live'});
    if(localCam||remoteCam){
      d.classList.add('cam-on');
      const v=document.createElement('video');
      v.className='cam-preview';
      v.autoplay=true;v.playsInline=true;v.setAttribute('playsinline','');
      v.muted=!!t.self; // only mute self to avoid echo
      v.srcObject=localCam?media.stream:remoteStream;
      v.onclick=function(ev){ev.stopPropagation();openCamLightbox(v.srcObject, t.name+(t.self?' (toi)':''), true)};
      d.appendChild(v);
    } else if(t.av){
      const img=document.createElement('img');img.className='av';img.src=t.av;
      img.onclick=function(ev){ev.stopPropagation();openCamLightbox(t.av, t.name, false)};
      d.appendChild(img);
    } else {
      const fb=document.createElement('div');fb.className='av-fallback';fb.textContent=(t.name||'?').slice(0,2).toUpperCase();d.appendChild(fb);
    }
    const nm=document.createElement('div');nm.className='nm clickable-user';nm.style.cursor='pointer';if(t.id){nm.setAttribute('data-user-id',t.id);nm.setAttribute('data-mid',t.id)}nm.textContent=t.name+(t.self?' (toi)':'');nm.onclick=function(ev){ev.stopPropagation();if(t.id&&typeof openUserProfile==='function')openUserProfile(t.id)};d.appendChild(nm);
    if(t.self){const b=document.createElement('div');b.className='badge';b.textContent='TOI';d.appendChild(b)}
    if(t.muted){const m=document.createElement('div');m.className='mic-badge';m.textContent='M';d.appendChild(m)}
    d.onclick=function(){
      if(hasCam) openCamLightbox(media.stream, t.name+(t.self?' (toi)':''), true);
      else if(t.av) openCamLightbox(t.av, t.name, false);
    };
    g.appendChild(d);
  });
  if(st)st.textContent='Connecte · '+list.length+' dans le salon';
  const mic=document.getElementById('v-mic');const deaf=document.getElementById('v-deaf');const cam=document.getElementById('v-cam');
  if(mic)mic.classList.toggle('mute',!media.mic);
  if(deaf)deaf.classList.toggle('mute',media.deaf);
  if(cam)cam.classList.toggle('on',media.cam);
  updateVoiceChannelUsers();
}
function updateVoiceChannelUsers(){
  const map={vocal:'vc-users-vocal','vocal-afk':'vc-users-afk','vocal-gaming':'vc-users-gaming','vocal-musique':'vc-users-musique','vocal-lounge':'vc-users-vocal'};
  Object.keys(map).forEach(function(ch){
    const el=document.getElementById(map[ch]);
    if(!el)return;
    var room=media.room||'';
    if(media.inVoice && (room===ch || (ch==='vocal'&&room.indexOf('vocal')===0))){
      var html='';
      var n=displayTag(prefs.displayName||(user&&user.name)||'Moi',user&&user.$id);
      html+='<div class="u"><span class="dot"></span>'+esc(n)+'</div>';
      Object.keys(window.__voicePeers||{}).forEach(function(pid){
        var p=window.__voicePeers[pid];
        html+='<div class="u"><span class="dot"></span>'+esc(p.name||'User')+'</div>';
      });
      el.innerHTML=html;
    } else el.innerHTML='';
  });
}

const UV_SIGNAL='wss://journal-bernard-alarm-walking.trycloudflare.com';
let signalWs=null;let signalId=null;window.__voicePeers=window.__voicePeers||{};
var pcs=window.__pcs=window.__pcs||{};var remoteAudio=window.__remoteAudio=window.__remoteAudio||{};
function signalSend(obj){
  if(signalWs && signalWs.readyState===1) signalWs.send(JSON.stringify(obj));
}
async 
async function connectToPeer(peerId){
  if(!peerId||(signalId&&peerId===signalId))return;
  try{
    var pc=await ensurePc(peerId);
    if(pc.__offered)return;
    pc.__offered=true;
    // perfect negotiation: only the peer with higher id initiates if both try - use string compare
    // polite: only skip if we already have a stable connection
    if(pc.connectionState==='connected'||pc.iceConnectionState==='connected')return;
    if(signalId && String(signalId)>String(peerId) && pc.signalingState!=='stable'){
      pc.__offered=false;
      return;
    }
    var offer=await pc.createOffer({offerToReceiveAudio:true,offerToReceiveVideo:true});
    await pc.setLocalDescription(offer);
    signalSend({type:'signal',to:peerId,data:{kind:'offer',sdp:pc.localDescription}});
  }catch(e){console.warn('connectToPeer',e);try{if(pcs[peerId])pcs[peerId].__offered=false}catch(x){}}
}

function ensurePc(peerId){
  if(pcs[peerId]) return pcs[peerId];
  window.__remoteStreams=window.__remoteStreams||{};
  const pc=new RTCPeerConnection({iceServers:[
    {urls:'stun:stun.l.google.com:19302'},
    {urls:'stun:stun1.l.google.com:19302'},
    {urls:'stun:stun.cloudflare.com:3478'},
    {urls:'turn:openrelay.metered.ca:80',username:'openrelayproject',credential:'openrelayproject'},
    {urls:'turn:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'},
    {urls:'turn:openrelay.metered.ca:443?transport=tcp',username:'openrelayproject',credential:'openrelayproject'}
  ],iceCandidatePoolSize:4});
  pcs[peerId]=pc;
  try{
    var stream=media.stream||window.__localStream;
    if(stream){stream.getTracks().forEach(function(t){try{pc.addTrack(t,stream)}catch(e){}})}
  }catch(e){}
  pc.onicecandidate=function(e){
    if(e.candidate){var c=e.candidate;try{c=typeof c.toJSON==='function'?c.toJSON():c}catch(x){} signalSend({type:'signal',to:peerId,data:{kind:'ice',candidate:c}});}
  };
  pc.ontrack=function(e){
    try{
      window.__remoteStreams=window.__remoteStreams||{};
      var stream=e.streams&&e.streams[0]?e.streams[0]:new MediaStream([e.track]);
      window.__remoteStreams[peerId]=stream;
      // audio
      var hasAudio=stream.getAudioTracks().length>0;
      if(hasAudio){
        var a=remoteAudio[peerId];
        if(!a){a=document.createElement('audio');a.autoplay=true;a.playsInline=true;a.setAttribute('playsinline','');document.body.appendChild(a);remoteAudio[peerId]=a}
        a.srcObject=stream;a.muted=false;a.volume=1;
        var p=a.play();if(p&&p.catch)p.catch(function(){try{a.muted=true;a.play().then(function(){a.muted=false}).catch(function(){})}catch(e){}});

      }
      try{paintVoiceGrid()}catch(err){}
    }catch(err){console.warn('ontrack',err)}
  };
  pc.onconnectionstatechange=function(){
    if(pc.connectionState==='failed'||pc.connectionState==='closed'||pc.connectionState==='disconnected'){
      try{pc.close()}catch(e){}
      delete pcs[peerId];
      try{delete window.__remoteStreams[peerId]}catch(e){}
      if(remoteAudio[peerId]){try{remoteAudio[peerId].remove()}catch(e){} delete remoteAudio[peerId]}
      try{paintVoiceGrid()}catch(e){}
    }
  };
  return pc;
}
async function handleSignal(from, data){
  if(!data||!from)return;
  const pc = await ensurePc(from);
  try{
    if(data.kind==='offer'){
      if(pc.signalingState!=='stable'&&pc.signalingState!=='have-local-offer'){/* glare */}
      try{
        // ensure local tracks before answering
        var stream=media.stream||window.__localStream;
        if(stream){
          var senders=pc.getSenders();
          stream.getTracks().forEach(function(t){
            if(!senders.some(function(s){return s.track&&s.track.id===t.id})){
              try{pc.addTrack(t,stream)}catch(e){}
            }
          });
        }
      }catch(e){}
      await pc.setRemoteDescription(data.sdp);
      const ans = await pc.createAnswer();
      await pc.setLocalDescription(ans);
      signalSend({type:'signal', to:from, data:{kind:'answer', sdp:pc.localDescription}});
    } else if(data.kind==='answer'){
      if(pc.signalingState==='have-local-offer'){
        await pc.setRemoteDescription(data.sdp);
      }
    } else if(data.kind==='ice' && data.candidate){
      try{await pc.addIceCandidate(data.candidate)}catch(e){}
    }
  }catch(e){console.warn('signal',e)}
}
function closeAllPeers(){
  Object.keys(pcs).forEach(id=>{try{pcs[id].close()}catch(e){} delete pcs[id]});
  Object.keys(remoteAudio).forEach(id=>{try{remoteAudio[id].remove()}catch(e){} delete remoteAudio[id]});
  if(signalWs){try{signalSend({type:'leave'});signalWs.close()}catch(e){} signalWs=null}
  signalId=null;
}

async function ensureCam(){
  const constraints={video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}},audio:false};
  const s=await navigator.mediaDevices.getUserMedia(constraints);
  if(!media.stream){media.stream=s;window.__localStream=s}
  else{
    // remove old video tracks
    try{media.stream.getVideoTracks().forEach(function(t){t.stop();try{media.stream.removeTrack(t)}catch(e){}})}catch(e){}
    s.getVideoTracks().forEach(function(t){media.stream.addTrack(t)});
  }
  media.cam=true;
  window.__localStream=media.stream;
  // add/replace video on all peer connections + renegotiate
  var vids=media.stream.getVideoTracks();
  var pids=Object.keys(pcs||{});
  for(var i=0;i<pids.length;i++){
    var pid=pids[i];
    var pc=pcs[pid];
    if(!pc)continue;
    try{
      vids.forEach(function(t){
        var sender=pc.getSenders().find(function(x){return x.track&&x.track.kind==='video'});
        if(sender) sender.replaceTrack(t);
        else pc.addTrack(t, media.stream);
      });
      // renegotiate so remote receives video
      var offer=await pc.createOffer();
      await pc.setLocalDescription(offer);
      signalSend({type:'signal',to:pid,data:{kind:'offer',sdp:pc.localDescription}});
    }catch(e){console.warn('renegotiate cam',e)}
  }
  try{paintVoiceGrid()}catch(e){}
}

window.__peer=null;
window.__peerCalls=window.__peerCalls||{};
function uvPeerId(){
  var id=(user&&user.$id)||signalId||('guest'+Math.random().toString(36).slice(2,10));
  return String(id).replace(/[^a-zA-Z0-9]/g,'').slice(0,60)||('g'+Date.now());
}
async function loadPeerJS(){
  if(window.Peer)return;
  await new Promise(function(resolve,reject){
    var s=document.createElement('script');
    s.src='https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';
    s.async=true;s.onload=function(){resolve()};s.onerror=function(){reject(new Error('PeerJS load'))};
    document.head.appendChild(s);
  });
}
function uvAttachRemoteStream(peerId, stream){
  try{
    window.__remoteStreams=window.__remoteStreams||{};
    window.__remoteStreams[peerId]=stream;
    var a=remoteAudio[peerId];
    if(!a){a=document.createElement('audio');a.autoplay=true;a.playsInline=true;a.setAttribute('playsinline','');a.volume=1;document.body.appendChild(a);remoteAudio[peerId]=a}
    a.srcObject=stream;a.muted=false;
    var p=a.play();if(p&&p.catch)p.catch(function(){try{a.muted=true;a.play().then(function(){a.muted=false}).catch(function(){})}catch(e){}});
    try{paintVoiceGrid()}catch(e){}
  }catch(e){console.warn(e)}
}
async function startPeerMesh(){
  try{
    await loadPeerJS();
    var myId=uvPeerId();
    signalId=myId;
    if(window.__peer){try{window.__peer.destroy()}catch(e){}}
    var peer=new Peer(myId,{debug:1,config:{iceServers:[
      {urls:'stun:stun.l.google.com:19302'},
      {urls:'stun:stun.cloudflare.com:3478'},
      {urls:'turn:openrelay.metered.ca:80',username:'openrelayproject',credential:'openrelayproject'},
      {urls:'turn:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'}
    ]}});
    window.__peer=peer;
    peer.on('open',function(id){signalId=id;console.log('peer open',id);try{toast('Vocal prêt')}catch(e){}});
    peer.on('error',function(err){console.warn('peer',err);try{if(err&&err.type==='unavailable-id'){/* retry random */}}catch(e){}});
    peer.on('call',function(call){
      try{
        var stream=media.stream||window.__localStream;
        call.answer(stream||undefined);
        call.on('stream',function(remote){uvAttachRemoteStream(call.peer,remote)});
        window.__peerCalls[call.peer]=call;
      }catch(e){console.warn(e)}
    });
    return peer;
  }catch(e){console.warn('startPeerMesh',e);return null}
}
function peerCallUser(peerId){
  try{
    if(!window.__peer||!peerId||peerId===signalId)return;
    if(window.__peerCalls[peerId])return;
    var stream=media.stream||window.__localStream;
    if(!stream)return;
    var call=window.__peer.call(peerId,stream);
    if(!call)return;
    window.__peerCalls[peerId]=call;
    call.on('stream',function(remote){uvAttachRemoteStream(peerId,remote)});
    call.on('close',function(){try{delete window.__peerCalls[peerId]}catch(e){}});
    call.on('error',function(e){console.warn('call',e);try{delete window.__peerCalls[peerId]}catch(x){}});
  }catch(e){console.warn(e)}
}


function goVoiceAndJoin(){window.__goVoiceReady=goVoiceAndJoin;window.goVoiceAndJoin=goVoiceAndJoin;
  try{toast('Ouverture vocal…')}catch(e){}
  try{showScreen('voice')}catch(e){}
  try{
    channel=channel&&String(channel).indexOf('vocal')===0?channel:'vocal-lounge';
  }catch(e){channel='vocal-lounge'}
  try{
    var vr=document.getElementById('voice-room');
    if(vr)vr.textContent='🔊 '+(channel||'vocal-lounge');
  }catch(e){}
  setTimeout(function(){
    try{joinVoiceRoom()}catch(e){console.warn(e);try{toast('Vocal: '+(e.message||e))}catch(x){}}
  },50);
}

try{window.goVoiceAndJoin=goVoiceAndJoin;window.__goVoiceReady=goVoiceAndJoin;window.__uvBind&&window.__uvBind()}catch(e){}
/*bind goVoice*/

async function joinVoiceRoom(){
  var btn=document.getElementById('btn-join-voice');
  var st=document.getElementById('voice-status');
  try{if(st)st.textContent='Connexion…'}catch(e){}
  try{if(btn){btn.disabled=true;btn.textContent='Connexion…'}}catch(e){}
  try{toast('Connexion au salon…')}catch(e){}
  try{
    if(media.inVoice){try{leaveVoiceRoom()}catch(e){media.inVoice=false}}
    try{await ensureMic()}catch(micErr){
      console.warn(micErr);
      try{toast('Autorise le micro pour rejoindre le vocal')}catch(e){}
      if(btn){btn.disabled=false;btn.textContent='Rejoindre le salon'}
      return;
    }
    window.__localStream=media.stream;
    media.inVoice=true;
    media.room='vocal-lounge';
    media.mic=true;media.deaf=false;
    window.__voicePeers=window.__voicePeers||{};
    signalId=signalId||((user&&user.$id)||('g-'+Math.random().toString(36).slice(2,10)));
    try{paintVoiceGrid()}catch(e){}
    try{await startPeerMesh()}catch(e){console.warn(e)}

    function applyRoster(peers){
      var next={};
      (peers||[]).forEach(function(p){
        if(!p||!p.id)return;
        if(signalId&&String(p.id)===String(signalId))return;
        next[p.id]={name:p.name||'User',userId:p.userId||p.id||''};
      });
      window.__voicePeers=next;
      try{paintVoiceGrid()}catch(e){}
      Object.keys(next).forEach(function(pid){try{connectToPeer(pid)}catch(e){}try{peerCallUser(pid)}catch(e){}});
    }
    function onPeerJoined(msg){
      if(!msg||!msg.id)return;
      if(signalId&&String(msg.id)===String(signalId))return;
      window.__voicePeers[msg.id]={name:msg.name||'User',userId:msg.userId||''};
      try{paintVoiceGrid()}catch(e){}
      try{toast((msg.name||'User')+' a rejoint')}catch(e){}
      try{connectToPeer(msg.id)}catch(e){}try{peerCallUser(msg.id)}catch(e){}
    }
    function onPeerLeft(msg){
      if(!msg||!msg.id)return;
      delete window.__voicePeers[msg.id];
      try{if(pcs[msg.id]){pcs[msg.id].close();delete pcs[msg.id]}}catch(e){}
      try{if(remoteAudio[msg.id]){remoteAudio[msg.id].remove();delete remoteAudio[msg.id]}}catch(e){}
      try{if(window.__remoteStreams)delete window.__remoteStreams[msg.id]}catch(e){}
      try{paintVoiceGrid()}catch(e){}
    }

    var nick='User';
    try{nick=(typeof uvPref==='function'&&uvPref('nick_'+currentServer))||(prefs&&prefs.displayName)||(user&&(user.name||user.email))||'User'}catch(e){}
    nick=String(nick).slice(0,40);

    // —— WebSocket signal (primary if tunnel up) ——
    var wsOk=false;
    try{
      if(signalWs){try{signalWs.onclose=null;signalWs.close()}catch(e){}}
      await new Promise(function(resolve){
        var done=false;function fin(v){if(done)return;done=true;resolve(v)}
        var t=setTimeout(function(){fin('timeout')},5000);
        try{
          var ws=new WebSocket(UV_SIGNAL);
          signalWs=ws;
          ws.onopen=function(){
            wsOk=true;
            try{ws.send(JSON.stringify({type:'join',room:'vocal-lounge',name:nick,userId:(user&&user.$id)||signalId}))}catch(e){}
          };
          ws.onerror=function(){fin('err')};
          ws.onmessage=async function(ev){
            var msg;try{msg=JSON.parse(ev.data)}catch(e){return}
            if(msg.type==='welcome'||msg.type==='joined'){
              if(msg.clientId)signalId=msg.clientId;
              applyRoster(msg.peers||[]);
              fin('ok');
            }
            if(msg.type==='roster')applyRoster(msg.peers||[]);
            if(msg.type==='peer-joined')onPeerJoined(msg);
            if(msg.type==='peer-left')onPeerLeft(msg);
            if(msg.type==='signal'){try{await handleSignal(msg.from,msg.data)}catch(e){}}
          };
          ws.onclose=function(){console.warn('signal closed')};
        }catch(e){fin('err')}
      });
    }catch(e){console.warn('ws',e)}

    // —— Appwrite presence + SDP fallback (always on) ——
    window.__awVoice=window.__awVoice||{seen:{},lastPeers:{}};
    async function awPublishPresence(){
      if(!media.inVoice||!user)return;
      try{
        var id='vp_'+String(user.$id).replace(/[^a-zA-Z0-9]/g,'').slice(0,30);
        var body={room:'vocal-lounge',userId:user.$id,name:nick,ts:Date.now(),signalId:String(signalId)};
        try{await db.updateDocument(DB,'ultravoc_voice_presence',id,body)}
        catch(e1){try{await db.createDocument(DB,'ultravoc_voice_presence',id,body)}catch(e2){}}
      }catch(e){}
    }
    async function awPollPeers(){
      if(!media.inVoice)return;
      try{
        var r=await db.listDocuments(DB,'ultravoc_voice_presence',[Query.equal('room','vocal-lounge'),Query.limit(40)]);
        var now=Date.now();
        var peers=[];
        (r.documents||[]).forEach(function(d){
          if(!d.userId||(user&&d.userId===user.$id))return;
          if(d.ts&&now-Number(d.ts)>45000)return; // stale
          var pid=d.signalId||d.userId;
          peers.push({id:pid,name:d.name||'User',userId:d.userId});
        });
        applyRoster(peers);
      }catch(e){/* collection may not exist */}
      // poll SDP signals to me
      try{
        if(!user)return;
        var sigs=await db.listDocuments(DB,'ultravoc_voice_signals',[Query.equal('to',user.$id),Query.orderDesc('$createdAt'),Query.limit(20)]);
        for(var i=0;i<(sigs.documents||[]).length;i++){
          var d=sigs.documents[i];
          if(!d||window.__awVoice.seen[d.$id])continue;
          window.__awVoice.seen[d.$id]=1;
          try{
            await handleSignal(d.fromSignal||d.from,JSON.parse(d.payload||'{}'));
            try{await db.deleteDocument(DB,'ultravoc_voice_signals',d.$id)}catch(e){}
          }catch(e){}
        }
      }catch(e){}
    }
    // Patch signalSend to also write Appwrite when WS down
    window.__signalSendBase=window.__signalSendBase||signalSend;
    signalSend=function(obj){
      try{if(signalWs&&signalWs.readyState===1)signalWs.send(JSON.stringify(obj))}catch(e){}
      try{
        if(obj&&obj.type==='signal'&&obj.to&&user){
          var payload=JSON.stringify(obj.data||{});
          db.createDocument(DB,'ultravoc_voice_signals',ID.unique(),{
            from:user.$id,
            fromSignal:String(signalId),
            to:String(obj.to).indexOf('g-')===0||String(obj.to).length<20?String(obj.to):String(obj.to),
            toUser:String(obj.to),
            payload:payload,
            ts:Date.now()
          }).catch(function(){});
          // also try deliver by userId mapping
          try{
            var peers=window.__voicePeers||{};
            Object.keys(peers).forEach(function(pid){
              if(pid===obj.to && peers[pid].userId){
                db.createDocument(DB,'ultravoc_voice_signals',ID.unique(),{
                  from:user.$id,fromSignal:String(signalId),to:peers[pid].userId,toUser:peers[pid].userId,payload:payload,ts:Date.now()
                }).catch(function(){});
              }
            });
          }catch(e){}
        }
      }catch(e){}
    };

    try{await awPublishPresence();await awPollPeers()}catch(e){}
    try{if(window.__rosterTimer)clearInterval(window.__rosterTimer)}catch(e){}
    window.__rosterTimer=setInterval(function(){
      if(!media.inVoice)return;
      try{if(signalWs&&signalWs.readyState===1){signalSend({type:'roster'});signalSend({type:'ping'})}}catch(e){}
      awPublishPresence();
      awPollPeers();
    },2500);

    if(btn){btn.disabled=false;btn.textContent='Connecté'}try{var st=document.getElementById('voice-status');if(st)st.textContent='Connecté'}catch(e){}
    var n=1+Object.keys(window.__voicePeers||{}).length;
    toast(wsOk?('Connecté · '+n+' dans le salon'):('Dans le salon · '+n+(wsOk?'':' · mode Appwrite')));
  }catch(e){
    console.warn('joinVoiceRoom',e);
    media.inVoice=!!(media.stream);
    try{paintVoiceGrid()}catch(err){}
    if(btn){btn.disabled=false;btn.textContent='Rejoindre le salon'}
    try{toast('Vocal: '+(e&&e.message?e.message:'erreur'))}catch(x){}
  }
}

try{window.joinVoiceRoom=joinVoiceRoom;window.goVoiceAndJoin=goVoiceAndJoin;window.__goVoiceReady=goVoiceAndJoin}catch(e){}
/*bind joinVoice*/
function leaveVoiceRoom(){
  try{if(window.__rosterTimer)clearInterval(window.__rosterTimer)}catch(e){}
  try{closeAllPeers()}catch(e){}
  try{Object.keys(window.__peerCalls||{}).forEach(function(k){try{window.__peerCalls[k].close()}catch(e){}});window.__peerCalls={}}catch(e){}
  try{if(window.__peer){window.__peer.destroy();window.__peer=null}}catch(e){}
  try{media.stream?.getTracks().forEach(t=>t.stop());media.screen?.getTracks().forEach(t=>t.stop())}catch(e){}
  media.stream=null;media.screen=null;media.inVoice=false;media.room=null;media.cam=false;media.scr=false;
  window.__voicePeers={};
  try{var b=document.getElementById('btn-join-voice');if(b){b.disabled=false;b.textContent='Rejoindre le salon'}}catch(e){}
  paintVoiceGrid();
  toast('Salon quitté');
}
async function ensureMic(){
  const s=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
  if(!media.stream)media.stream=s;else{media.stream.getAudioTracks().forEach(t=>{t.stop();media.stream.removeTrack(t)});s.getAudioTracks().forEach(t=>media.stream.addTrack(t))}
  media.stream.getAudioTracks().forEach(t=>t.enabled=media.mic&&!media.deaf);
  paintVoiceGrid();
}
document.getElementById('v-mic').onclick=async()=>{try{await ensureMic();media.mic=!media.mic;media.stream?.getAudioTracks().forEach(t=>t.enabled=media.mic&&!media.deaf);document.getElementById('v-mic').classList.toggle('mute',!media.mic);paintVoiceGrid()}catch(e){toast('Micro refusé')}};
document.getElementById('v-deaf').onclick=()=>{media.deaf=!media.deaf;if(media.deaf)media.mic=false;media.stream?.getAudioTracks().forEach(t=>t.enabled=media.mic&&!media.deaf);document.getElementById('v-deaf').classList.toggle('mute',media.deaf);document.getElementById('v-mic').classList.toggle('mute',!media.mic);paintVoiceGrid()};
document.getElementById('v-cam').onclick=async()=>{
  if(media.cam){media.stream?.getVideoTracks().forEach(t=>{t.stop();try{media.stream.removeTrack(t)}catch(_){}});media.cam=false;document.getElementById('v-cam').classList.add('mute');paintVoiceGrid();return}
  try{const v=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}},audio:false});
    if(!media.stream)media.stream=new MediaStream();v.getVideoTracks().forEach(t=>media.stream.addTrack(t));media.cam=true;document.getElementById('v-cam').classList.remove('mute');document.getElementById('v-cam').classList.add('on');paintVoiceGrid()}catch(e){toast('Caméra refusée')}
};
document.getElementById('v-scr').onclick=()=>{document.getElementById('stream-modal').classList.add('on')};
document.querySelectorAll('.opt[data-q]').forEach(o=>o.onclick=()=>{document.querySelectorAll('.opt[data-q]').forEach(x=>x.classList.remove('on'));o.classList.add('on');o.querySelector('input').checked=true;streamQ=+o.dataset.q});
document.getElementById('cancel-stream').onclick=()=>document.getElementById('stream-modal').classList.remove('on');
document.getElementById('start-stream').onclick=async()=>{
  document.getElementById('stream-modal').classList.remove('on');
  const h=streamQ===1080?1080:streamQ===480?480:720;const fps=streamQ===1080?60:30;
  try{
    if(media.scr){media.screen?.getTracks().forEach(t=>t.stop());media.scr=false}
    const ss=await navigator.mediaDevices.getDisplayMedia({video:{width:{ideal:streamQ===480?854:streamQ},height:{ideal:h},frameRate:{ideal:fps}},audio:!!document.getElementById('scr-audio').checked});
    media.screen=ss;media.scr=true;document.getElementById('v-scr').classList.add('on');
    ss.getVideoTracks()[0].onended=()=>{media.scr=false;document.getElementById('v-scr').classList.remove('on')};
    toast('Stream '+h+'p · '+fps+'fps');
  }catch(e){toast('Partage annulé')}
};
document.getElementById('v-leave').onclick=()=>leaveVoiceRoom();

try{
  function __wireJoin(){
    var b=document.getElementById('btn-join-voice');
    function bind(el){
      if(!el||el.dataset.jwired==='1')return;
      el.dataset.jwired='1';
      el.onclick=function(ev){try{ev.preventDefault();ev.stopPropagation()}catch(e){}goVoiceAndJoin()};
      el.addEventListener('touchend',function(ev){goVoiceAndJoin()},false);
    }
    bind(b);
    document.querySelectorAll('[data-join-voice],.btn-join-voice').forEach(bind);
  }
  __wireJoin();try{wireMembersBtn()}catch(e){}
  setTimeout(__wireJoin,100);
  setTimeout(__wireJoin,500);
  setTimeout(__wireJoin,1500);
  setTimeout(__wireJoin,3000);
}catch(e){}

document.getElementById('btn-invite').onclick=async()=>{try{await navigator.clipboard.writeText(location.origin+'/app');toast('Lien copié')}catch(e){toast(location.origin+'/app')}};

function playSnd(id){new Audio(url('ultravoc_sounds',id)).play().catch(()=>toast('Lecture bloquée'))}
function paintSB(){
  const g=document.getElementById('sb-grid');g.innerHTML='';
  if(!sounds.length)g.innerHTML='<p style="grid-column:1/-1;color:var(--m);font-size:.8rem">Aucun son</p>';
  sounds.forEach(s=>{const b=document.createElement('button');b.className='sb-pad';b.type='button';b.textContent=s.name;b.onclick=()=>{playSnd(s.fileId);send({type:'sound',text:s.name,fileId:s.fileId,bucketId:'ultravoc_sounds',fileName:s.name,size:s.size||0})};g.appendChild(b)});
  const list=document.getElementById('sb-list');list.innerHTML='';
  sounds.forEach(s=>{const r=document.createElement('div');r.className='sb-item';r.innerHTML='<span>'+esc(s.name)+'</span><button type="button" data-p>▶</button><button type="button" class="del" data-d>Suppr</button>';
    r.querySelector('[data-p]').onclick=()=>playSnd(s.fileId);
    r.querySelector('[data-d]').onclick=async()=>{try{await db.deleteDocument(DB,'ultravoc_soundboard',s.$id);try{await st.deleteFile('ultravoc_sounds',s.fileId)}catch(_){}loadSB();toast('Supprimé')}catch(e){toast(e.message)}};
    list.appendChild(r)});
}
async function loadSB(){if(!user)return;try{const r=await db.listDocuments(DB,'ultravoc_soundboard',[Query.equal('userId',user.$id),Query.limit(50)]);sounds=r.documents||[];paintSB()}catch(e){paintSB()}}
document.getElementById('sb-play-tab').onclick=()=>{document.getElementById('sb-play-tab').classList.add('on');document.getElementById('sb-mgr-tab').classList.remove('on');document.getElementById('sb-grid').classList.remove('hidden');document.getElementById('sb-mgr').classList.add('hidden')};
document.getElementById('sb-mgr-tab').onclick=()=>{document.getElementById('sb-mgr-tab').classList.add('on');document.getElementById('sb-play-tab').classList.remove('on');document.getElementById('sb-grid').classList.add('hidden');document.getElementById('sb-mgr').classList.remove('hidden')};
document.getElementById('snd-up').onclick=async()=>{
  const f=document.getElementById('f-snd').files?.[0];const name=(document.getElementById('snd-name').value.trim()||f?.name||'son').slice(0,40);
  if(!f)return toast('Choisis un audio');if(f.size>2*1024*1024)return toast('Max 2 Mo');if(sounds.length>=10)return toast('Limite 10');
  try{const file=await st.createFile('ultravoc_sounds',ID.unique(),f);await db.createDocument(DB,'ultravoc_soundboard',ID.unique(),{userId:user.$id,name,fileId:file.$id,mime:f.type||'audio/mpeg',size:f.size});document.getElementById('f-snd').value='';document.getElementById('snd-name').value='';loadSB();toast('OK')}catch(e){toast(e.message||'Échec')}
};

var setEl=document.getElementById('settings'),setBody=document.getElementById('set-body');

function applySettingsPrefs(){
  try{
    var root=document.documentElement;
    if(prefs.themeColor) root.style.setProperty('--p2', prefs.themeColor);
    if(prefs.themeColor2) root.style.setProperty('--p3', prefs.themeColor2);
    if(prefs.themeColor) root.style.setProperty('--p', prefs.themeColor);
    // theme mode
    var th=prefs.theme||'dark';
    root.dataset.theme=th;
    if(th==='light'){root.style.setProperty('--bg','#f4f0ff');root.style.setProperty('--bg2','#fff');root.style.setProperty('--t','#1a1028');root.style.setProperty('--m','#5b4b75');}
    else if(th==='oled'){root.style.setProperty('--bg','#000');root.style.setProperty('--bg2','#0a0a0a');root.style.setProperty('--t','#f5f0ff');root.style.setProperty('--m','#9b8bb8');}
    else {root.style.setProperty('--bg','#07040f');root.style.setProperty('--bg2','#0d0818');root.style.setProperty('--t','#f5f0ff');root.style.setProperty('--m','#9b8bb8');}
    // accessibility
    if(prefs.reduceMotion==='1') root.style.setProperty('--motion','0s');
    else root.style.setProperty('--motion','0.22s');
    var fs=parseInt(prefs.fontScale||'100',10); if(fs>=80&&fs<=140) root.style.fontSize=(fs/100*16)+'px';
    if(prefs.highContrast==='1') root.classList.add('high-contrast'); else root.classList.remove('high-contrast');
    // chat
    var chat=document.getElementById('chat-log')||document.querySelector('.messages');
    if(chat){
      chat.classList.toggle('compact', prefs.chatCompact==='1');
      chat.classList.toggle('cozy', prefs.chatCompact!=='1');
    }
    // presence
    try{if(typeof setPresenceStatus==='function' && prefs.presence) setPresenceStatus(prefs.presence)}catch(e){}
    // streamer mode hide personal
    document.body.classList.toggle('streamer-mode', prefs.streamerMode==='1');
  }catch(e){console.warn('applySettingsPrefs',e)}
}


/* —— Locale / currency auto —— */
window.__uvLocale=window.__uvLocale||{lang:'fr',currency:'CAD',country:'CA',ready:false};
const UV_I18N={
  fr:{
    addFriend:'+ Ami',pending:'Demande en attente',friends:'Amis',dm:'Message',block:'Bloquer',report:'Signaler',share:'Partager',
    profile:'Profil',online:'En ligne',bioEmpty:'Aucune bio',close:'Fermer',saved:'Enregistré',
    currencyLabel:'Devise',languageLabel:'Langue'
  },
  en:{
    addFriend:'+ Friend',pending:'Request pending',friends:'Friends',dm:'Message',block:'Block',report:'Report',share:'Share',
    profile:'Profile',online:'Online',bioEmpty:'No bio yet',close:'Close',saved:'Saved',
    currencyLabel:'Currency',languageLabel:'Language'
  },
  es:{
    addFriend:'+ Amigo',pending:'Solicitud pendiente',friends:'Amigos',dm:'Mensaje',block:'Bloquear',report:'Reportar',share:'Compartir',
    profile:'Perfil',online:'En línea',bioEmpty:'Sin bio',close:'Cerrar',saved:'Guardado',
    currencyLabel:'Moneda',languageLabel:'Idioma'
  }
};
function t(key){
  var lang=(window.__uvLocale&&window.__uvLocale.lang)||'fr';
  var pack=UV_I18N[lang]||UV_I18N.fr;
  return pack[key]||UV_I18N.fr[key]||key;
}
function countryToCurrency(cc){
  cc=(cc||'').toUpperCase();
  var map={US:'USD',CA:'CAD',GB:'GBP',FR:'EUR',DE:'EUR',ES:'EUR',IT:'EUR',BE:'EUR',CH:'CHF',AU:'AUD',JP:'JPY',BR:'BRL',MX:'MXN',MA:'MAD',SN:'XOF',HT:'HTG',DZ:'DZD',TN:'TND',CI:'XOF'};
  return map[cc]||'USD';
}
function browserLang(){
  var l=(navigator.languages&&navigator.languages[0])||navigator.language||'fr';
  l=String(l).toLowerCase();
  if(l.startsWith('fr'))return 'fr';
  if(l.startsWith('es'))return 'es';
  if(l.startsWith('en'))return 'en';
  return l.slice(0,2)||'fr';
}
async function detectLocaleAuto(){
  try{
    // prefer saved preference if user forced language
    if(prefs&&prefs.langForced==='1'&&prefs.lang){
      window.__uvLocale={lang:prefs.lang,currency:prefs.currency||'CAD',country:prefs.country||'',ready:true};
      return window.__uvLocale;
    }
    var lang=browserLang();
    var country='',currency='USD';
    try{var m=document.querySelector('meta[name=uv-country]');if(m&&m.content){country=m.content;currency=countryToCurrency(country)}}
    catch(e){}
    try{
      // Cloudflare / geo lite via public endpoint (no key)
      var r=await fetch('https://ipapi.co/json/',{credentials:'omit'});
      if(r.ok){
        var j=await r.json();
        country=j.country_code||j.country||'';
        currency=j.currency||countryToCurrency(country);
        if(j.languages){
          var first=String(j.languages).split(',')[0].trim().toLowerCase();
          if(first.startsWith('fr'))lang='fr';
          else if(first.startsWith('es'))lang='es';
          else if(first.startsWith('en'))lang='en';
        }
      }
    }catch(e){
      // timezone fallback
      try{
        var tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
        if(/Paris|Montreal|Toronto|Brussels|Abidjan/i.test(tz)){currency='CAD'}
        if(/Paris|Brussels|Madrid|Berlin|Rome/.test(tz))currency='EUR';
        if(/New_York|Chicago|Los_Angeles/.test(tz))currency='USD';
      }catch(e2){}
    }
    if(!currency)currency=countryToCurrency(country);
    window.__uvLocale={lang:lang,currency:currency,country:country,ready:true};
    try{
      if(typeof savePrefs==='function'&&user){
        var patch={};
        if(!prefs.lang)patch.lang=lang;
        if(!prefs.currency)patch.currency=currency;
        if(country)patch.country=country;
        if(Object.keys(patch).length)savePrefs(patch);
      } else {
        localStorage.setItem('uv_locale',JSON.stringify(window.__uvLocale));
      }
    }catch(e){}
    applyLocaleToUI();
    return window.__uvLocale;
  }catch(e){
    window.__uvLocale={lang:browserLang(),currency:'CAD',country:'',ready:true};
    return window.__uvLocale;
  }
}
function applyLocaleToUI(){
  try{
    document.documentElement.lang=window.__uvLocale.lang||'fr';
    document.documentElement.dataset.currency=window.__uvLocale.currency||'CAD';
    // soft translate a few static labels if present
    var map=[
      ['#btn-friends','title',t('friends')],
    ];
    // prices with data-price-cad attribute conversion is optional
    document.querySelectorAll('[data-price-cad]').forEach(function(el){
      var cad=parseFloat(el.getAttribute('data-price-cad')||'0');
      var cur=window.__uvLocale.currency||'CAD';
      var rates={CAD:1,USD:0.74,EUR:0.68,GBP:0.58,CHF:0.66,AUD:1.12};
      var v=cad*(rates[cur]||1);
      el.textContent=v.toFixed(2).replace('.',',')+' '+cur;
    });
  }catch(e){}
}
function friendStatus(uid){
  try{
    var d=getFriendsData();
    if((d.friends||[]).some(function(f){return f.id===uid}))return 'friends';
    if((d.pending||[]).some(function(f){return f.id===uid}))return 'pending';
    return 'none';
  }catch(e){return 'none'}
}
function friendButtonLabel(uid){
  var st=friendStatus(uid);
  if(st==='friends')return t('friends');
  if(st==='pending')return t('pending');
  return t('addFriend');
}
function friendButtonClass(uid){
  var st=friendStatus(uid);
  if(st==='friends')return 'friend';
  if(st==='pending')return 'pending';
  return 'primary';
}

async function resolveMemberProfile(idOrObj){
  if(!idOrObj)return null;
  if(typeof idOrObj==='object'){
    var m=idOrObj;
    return {
      id:m.id||m.authUserId||m.$id,
      name:m.name||m.displayName||'User',
      username:m.username||'',
      tag:m.tag||'',
      avatar:m.avatar||'',
      banner:m.banner||m.bg||'',
      bio:m.bio||'',
      self:!!m.self,
      createdAt:m.createdAt||m.$createdAt||'',
      badges:m.badges||[]
    };
  }
  var id=String(idOrObj);
  if(user&&id===user.$id){
    return {id:user.$id,name:prefs.displayName||user.name||'Moi',username:(prefs.displayName||user.name||'').toLowerCase(),tag:prefs.tag||'',avatar:prefs.avatar||'',banner:prefs.banner||'',bio:prefs.bio||'',self:true,createdAt:(user&&(user.$createdAt||user.registration))||prefs.joinedAt||'',badges:prefs.badges||[]};
  }
  // cache
  var hit=(window.__globalMembersCache||[]).find(function(x){return x.id===id});
  if(hit) return resolveMemberProfile(hit);
  try{
    var res=await db.listDocuments(DB,'users',[Query.equal('authUserId',id),Query.limit(1)]);
    if(res.documents&&res.documents[0]){
      var d=res.documents[0];
      return {id:d.authUserId||d.$id,name:d.displayName||d.username||'User',username:d.username||'',tag:d.tag||'',avatar:d.avatar||'',banner:d.bg||'',bio:d.bio||'',self:false,createdAt:d.$createdAt||d.createdAt||'',badges:d.badges||[]};
    }
  }catch(e){}
  var names={};try{names=JSON.parse(localStorage.getItem('uv_member_names')||'{}')}catch(e){}
  return {id:id,name:names[id]||('Membre '+id.slice(0,6)),username:'',tag:'',avatar:'',banner:'',bio:'',self:false};
}


async function deleteMessageAnimated(el, id){
  if(!el) return;
  try{el.classList.add('msg-out')}catch(e){}
  var done=false;
  async function finish(){
    if(done)return;done=true;
    try{if(id) await db.deleteDocument(DB,'ultravoc_messages',id)}catch(e){console.warn(e)}
    try{el.remove()}catch(e){}
  }
  setTimeout(finish, 380);
  try{
    if(id) await db.deleteDocument(DB,'ultravoc_messages',id);
  }catch(e){}
  // if server delete ok early, still wait anim
}
function wireMsgDeleteGestures(el, id, canDel){
  if(!el||!canDel||!id) return;
  if(el.dataset.delWired==='1')return;
  el.dataset.delWired='1';
  // red X
  var x=document.createElement('button');
  x.type='button';x.className='msg-x';x.title='Supprimer';x.setAttribute('aria-label','Supprimer');
  x.textContent='×';
  x.onclick=function(ev){ev.preventDefault();ev.stopPropagation();deleteMessageAnimated(el,id)};
  el.appendChild(x);
  // swipe left (mobile)
  var sx=0,sy=0,dx=0,active=false;
  el.addEventListener('touchstart',function(ev){
    if(ev.touches.length!==1)return;
    sx=ev.touches[0].clientX;sy=ev.touches[0].clientY;dx=0;active=true;
    el.classList.add('swiping');
  },{passive:true});
  el.addEventListener('touchmove',function(ev){
    if(!active)return;
    var t=ev.touches[0];
    dx=t.clientX-sx; var dy=t.clientY-sy;
    if(Math.abs(dy)>Math.abs(dx)){active=false;el.style.transform='';el.classList.remove('swiping');return}
    if(dx<0){el.style.transform='translateX('+Math.max(dx,-120)+'px)';el.style.opacity=String(Math.max(0.35,1+dx/150))}
  },{passive:true});
  el.addEventListener('touchend',function(){
    el.classList.remove('swiping');
    if(active && dx<-80){ // large swipe left
      el.style.transform='';el.style.opacity='';
      deleteMessageAnimated(el,id);
    } else {
      el.style.transition='transform .2s ease, opacity .2s ease';
      el.style.transform='';el.style.opacity='';
      setTimeout(function(){el.style.transition=''},220);
    }
    active=false;dx=0;
  },{passive:true});
  el.addEventListener('touchcancel',function(){active=false;el.style.transform='';el.style.opacity='';el.classList.remove('swiping')},{passive:true});
}


var UV_BADGE_DEF={
  bug_hunter:{id:'bug_hunter',label:'Chasseur de bugs',emoji:'🐛',cls:'b-bug',color:'#86efac',desc:'Membre du staff Bug Hunter. Il cherche les failles, les documente et les envoie aux devs XULTRA.'},
  bug_h:{id:'bug_h',label:'BUG-H',emoji:'🪲',cls:'b-bugh',color:'#4ade80',desc:'Badge exclusif : 10 bugs reels approuves et resolus par Shaman. Rare, anime, reserve aux meilleurs chasseurs.'},
  early_user:{id:'early_user',label:'Early user',emoji:'🌅',cls:'b-early',color:'#fbbf24',desc:'Inscrit avant le 30 aout 2027. Pioneer de la plateforme Ultravoc / XULTRA.'},
  xultra_plus:{id:'xultra_plus',label:'XULTRA+',emoji:'✦',cls:'b-plus',color:'#c4b5fd',desc:'Abonnement premium : plus de slots, uploads plus larges, decos de profil et avantages serveur.'},
  xultra_event:{id:'xultra_event',label:'XULTRA Event',emoji:'🎉',cls:'b-event',color:'#f9a8d4',desc:'A participe a un evenement officiel XULTRA. Souvenir de communaute.'},
  xultra_dev:{id:'xultra_dev',label:'XULTRA Dev',emoji:'</>',cls:'b-dev',color:'#f87171',desc:'Developpeur de la plateforme. Acces staff, moderation globale et evolution du moteur XULTRA.'},
  admin:{id:'admin',label:'Admin',emoji:'🛡',cls:'b-dev',color:'#f87171',desc:'Administrateur de la plateforme. Gestion des membres, serveurs, reports et permissions.'},
  modo:{id:'modo',label:'Modo',emoji:'⚖',cls:'b-plus',color:'#a78bfa',desc:'Moderateur. Peut intervenir sur le chat, les reports et le vocal selon les permissions du serveur.'},
  hunter:{id:'hunter',label:'Bug Hunter',emoji:'🪲',cls:'b-bugh',color:'#86efac',desc:'Grade Bug Hunter. Chasse les bugs, les signale aux devs, et vise le badge exclusif BUG-H.'}
};
var UV_EARLY_DEADLINE=new Date('2027-08-30T00:00:00.000Z').getTime();
function getBadgeGrants(){
  var g={};
  try{g=JSON.parse(localStorage.getItem('uv_badge_grants')||'{}')}catch(e){}
  try{if(platform&&platform.badge_grants){var p=typeof platform.badge_grants==='string'?JSON.parse(platform.badge_grants):platform.badge_grants;Object.assign(g,p||{})}}catch(e){}
  return g;
}
function saveBadgeGrants(g){
  try{localStorage.setItem('uv_badge_grants',JSON.stringify(g||{}))}catch(e){}
  try{if(typeof setPlatform==='function')setPlatform('badge_grants',JSON.stringify(g||{}))}catch(e){}
}
function grantBadge(userId,badgeId){
  if(!userId||!UV_BADGE_DEF[badgeId])return;
  var g=getBadgeGrants();
  if(!g[userId])g[userId]=[];
  if(g[userId].indexOf(badgeId)<0)g[userId].push(badgeId);
  saveBadgeGrants(g);
}
function revokeBadge(userId,badgeId){
  var g=getBadgeGrants();
  if(!g[userId])return;
  g[userId]=(g[userId]||[]).filter(function(x){return x!==badgeId});
  saveBadgeGrants(g);
}
function collectUserBadges(m){
  var ids=[];
  if(!m)return ids;
  // Early user: registered before 30 Aug 2027
  var created=m.createdAt||m.$createdAt||null;
  if(created){
    var t=new Date(created).getTime();
    if(!isNaN(t)&&t>0&&t<UV_EARLY_DEADLINE)ids.push('early_user');
  }
  // self prefs
  if(m.self&&prefs){
    if(prefs.xultraPlus||prefs.plan==='plus'||prefs.plan==='xultra_plus')ids.push('xultra_plus');
    if(Array.isArray(prefs.badges))prefs.badges.forEach(function(b){ids.push(b)});
  }
  if(Array.isArray(m.badges))m.badges.forEach(function(b){ids.push(b)});
  try{
    if(typeof nameIsDesignatedDev==='function'&&(nameIsDesignatedDev(m.name)||nameIsDesignatedDev(m.username))){
      if(ids.indexOf('xultra_dev')<0)ids.push('xultra_dev');
    }
  }catch(e){}
  try{
    var nm=(m.name||'')+' '+(m.username||'');
    if(typeof nameIsDesignatedHunter==='function'&&(nameIsDesignatedHunter(m.name)||nameIsDesignatedHunter(m.username))){
      if(ids.indexOf('bug_hunter')<0)ids.push('bug_hunter');
    }
  }catch(e){}
  // grants map
  try{
    var g=getBadgeGrants();
    var uid=m.id||'';
    (g[uid]||[]).forEach(function(b){ids.push(b)});
  }catch(e){}
  // Cisco / known admin as dev if isAdmin self
  if(m.self&&typeof isAdmin!=='undefined'&&isAdmin)ids.push('xultra_dev');
  // unique preserve order
  var seen={},out=[];
  ids.forEach(function(id){if(UV_BADGE_DEF[id]&&!seen[id]){seen[id]=1;out.push(id)}});
  return out;
}
function renderBadgeHtml(badgeIds){
  return (badgeIds||[]).map(function(id){
    var b=UV_BADGE_DEF[id];if(!b)return '';
    return '<span class="ubadge '+b.cls+' badge-tip" data-badge="'+b.id+'" role="button"><span class="be">'+b.emoji+'</span>'+b.label+'</span>';
  }).join('');
}


function renderBadgeAdminSection(host){
  if(!host||!isAdmin)return;
  if(host.querySelector('#badge-admin'))return;
  var box=document.createElement('div');
  box.id='badge-admin';
  box.innerHTML='<div class="group-title">Badges (admin)</div><div class="field"><label>User ID</label><input id="badge-uid" placeholder="auth user id"></div><div class="field"><label>Badge</label><select id="badge-pick"><option value="bug_hunter">Chasseur de bugs</option><option value="early_user">Early user</option><option value="xultra_plus">XULTRA+</option><option value="xultra_event">XULTRA Event</option><option value="xultra_dev">XULTRA Dev</option></select></div><button type="button" class="btn-block primary" id="badge-grant">Attribuer</button><button type="button" class="btn-block" id="badge-revoke" style="margin-top:8px">Retirer</button>';
  host.appendChild(box);
  document.getElementById('badge-grant').onclick=function(){
    var uid=(document.getElementById('badge-uid').value||'').trim();
    var b=document.getElementById('badge-pick').value;
    if(!uid)return toast('ID requis');
    grantBadge(uid,b);toast('Badge '+b+' → '+uid.slice(0,8));
  };
  document.getElementById('badge-revoke').onclick=function(){
    var uid=(document.getElementById('badge-uid').value||'').trim();
    var b=document.getElementById('badge-pick').value;
    if(!uid)return toast('ID requis');
    revokeBadge(uid,b);toast('Retiré');
  };
}

async function openUserProfile(idOrObj){
  try{
    var m=null;
    try{m=await resolveMemberProfile(idOrObj)}catch(e){console.warn('resolve',e)}
    if(!m){
      var id=typeof idOrObj==='object'?(idOrObj&&(idOrObj.id||idOrObj.$id)):idOrObj;
      m={id:id||'',name:(idOrObj&&idOrObj.name)||'User',username:'',tag:'',avatar:'',banner:'',bio:'',self:false};
    }
    if(!m.name)m.name='User';
    try{
      var mp=document.getElementById('member-panel');
      if(mp){
        mp.classList.remove('on');
        mp.style.transform='translateX(105%)';
        mp.style.visibility='hidden';
        mp.style.pointerEvents='none';
      }
      var ovx=document.querySelectorAll('.member-panel.on');
      ovx.forEach(function(el){el.classList.remove('on')});
    }catch(e){}
    var ov=document.getElementById('uprofile-overlay');
    if(!ov){
      ov=document.createElement('div');
      ov.id='uprofile-overlay';ov.className='uprofile-overlay';
      ov.innerHTML='<div class="uprofile" id="uprofile-card" role="dialog"><button type="button" class="uclose" id="uprofile-close">x</button><div class="uban" id="up-banner"></div><div class="uav-wrap"><div class="uav" id="up-av">?</div></div><div class="ubody"><div class="uname" id="up-name">—</div><div class="uhandle" id="up-handle">@—</div><div class="ubadges" id="up-badges"></div><div class="ubio" id="up-bio"></div><div class="uacts" id="up-acts"></div></div></div>';
      document.body.appendChild(ov);
    }
    var closeBtn=document.getElementById('uprofile-close');
    if(closeBtn)closeBtn.onclick=function(e){try{e.stopPropagation()}catch(x){}closeUserProfile()};
    ov.onclick=function(e){if(e.target===ov)closeUserProfile()};

    var setTxt=function(id,val){var el=document.getElementById(id);if(el)el.textContent=val==null?'':String(val)};
    (function(){var n=document.getElementById('up-name');if(!n)return;var nm=m.name||'User';if(nameIsDesignatedHunter(nm)||nameIsDesignatedHunter(m.username)||nameIsDesignatedDev(nm)||nameIsDesignatedDev(m.username)){n.innerHTML=goldNameHtml(nm);}else{n.textContent=nm;}})();
    var handle='@'+(m.username||String(m.name||'user').toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20)||'user');
    try{
      if(m.tag||m.id){
        var shown=window.__revealedTags&&window.__revealedTags[m.id];
        handle+=' · '+(shown?('#'+secureTag(m.id,m.tag)):maskTag(secureTag(m.id,m.tag)));
      }
    }catch(e){}
    setTxt('up-handle', handle);
    try{
      var lab='';
      if(typeof nameIsDesignatedHunter==='function'&&(nameIsDesignatedHunter(m.name)||nameIsDesignatedHunter(m.username)))lab='Bug Hunter';
      if(lab){
        var h=document.getElementById('up-handle');
        if(h)h.textContent=handle+' · '+lab;
      }
    }catch(e){}
    try{
      var bEl=document.getElementById('up-badges');
      if(bEl){var bids=[];try{bids=collectUserBadges(m)||[]}catch(e){} bEl.innerHTML=(typeof renderBadgeHtml==='function'?renderBadgeHtml(bids):'')||'';}
    }catch(e){}
    setTxt('up-bio', m.bio||'Aucune bio');
    var av=document.getElementById('up-av');
    if(av){
      if(m.avatar) av.innerHTML='<img src="'+String(m.avatar).replace(/"/g,'')+'" alt="" referrerpolicy="no-referrer">';
      else av.textContent=String(m.name||'?').slice(0,2).toUpperCase();
    }
    var ban=document.getElementById('up-banner');
    if(ban){
      if(m.banner) ban.style.backgroundImage='url('+String(m.banner).split(')').join('')+')';
      else ban.style.backgroundImage='';
    }
    var acts=document.getElementById('up-acts');
    if(acts){
      if(m.self){
        acts.innerHTML='<button type="button" class="primary" id="up-edit">Profil</button>';
        var ed=document.getElementById('up-edit');
        if(ed)ed.onclick=function(){closeUserProfile();try{openSettings('profile-edit')}catch(e){}};
      } else {
        var lab='+ Ami';
        try{if(typeof friendButtonLabel==='function')lab=friendButtonLabel(m.id)}catch(e){}
        acts.innerHTML=
          '<button type="button" id="up-friend">'+String(lab).replace(/</g,'')+'</button>'+
          '<button type="button" id="up-dm">Message</button>'+
          '<button type="button" id="up-block">Bloquer</button>'+
          '<button type="button" id="up-report">Signaler</button>'+
          '<button type="button" id="up-share">Partager</button>';
        var uf=document.getElementById('up-friend');
        if(uf)uf.onclick=function(){
          try{
            var status=typeof friendStatus==='function'?friendStatus(m.id):'none';
            if(status==='friends'){toast('Deja amis');return}
            if(status==='pending'){toast('Demande en attente');return}
            if(typeof addFriendByMember==='function')addFriendByMember(m);
            uf.textContent='Demande en attente';uf.disabled=true;
          }catch(e){toast('Ami')}
        };
        var ud=document.getElementById('up-dm');
        if(ud)ud.onclick=function(){
          try{if(typeof openDm==='function')openDm(m.id,m.name);else if(typeof startDm==='function')startDm(m.id,m.name);else toast('DM · '+m.name)}catch(e){}
          closeUserProfile();
        };
        var ub=document.getElementById('up-block');
        if(ub)ub.onclick=function(){try{if(typeof ignoreUser==='function')ignoreUser(m.id)}catch(e){} toast('Bloque');closeUserProfile()};
        var ur=document.getElementById('up-report');
        if(ur)ur.onclick=function(){try{if(typeof reportUser==='function')reportUser(m.id,m.name)}catch(e){}};
        var us=document.getElementById('up-share');
        if(us)us.onclick=function(){try{if(typeof shareProfile==='function')shareProfile(m);else if(navigator.share)navigator.share({title:m.name,url:location.href})}catch(e){}};
      }
    }
    try{if(ov.parentNode!==document.body)document.body.appendChild(ov)}catch(e){}
    ov.classList.add('on');
    ov.style.cssText='position:fixed!important;inset:0!important;z-index:2147483000!important;display:flex!important;align-items:center;justify-content:center;padding:18px;background:rgba(4,2,12,.78);pointer-events:auto;visibility:visible';;
    ov.style.display='flex';
    ov.style.visibility='visible';
    ov.style.pointerEvents='auto';
    ov.style.zIndex='200';
    ov.setAttribute('aria-hidden','false');
    window.__profileOpen=1;
  }catch(e){
    console.warn('openUserProfile',e);
    try{toast((e&&e.message)||'Profil')}catch(x){}
  }
}

function closeUserProfile(){
  var ov=document.getElementById('uprofile-overlay');
  if(ov){ov.classList.remove('on');ov.style.display='none';ov.setAttribute('aria-hidden','true')}
}
function wireProfileClicks(root){
  root=root||document;
  // explicit markers
  root.querySelectorAll('[data-user-id], [data-uid], [data-profile], .clickable-user').forEach(function(el){
    if(el.dataset.profileWired==='1')return;
    el.dataset.profileWired='1';
    el.classList.add('clickable-user');
    el.addEventListener('click',function(ev){
      if(ev.target.closest('button,a,input,textarea,select,.acts,.eye'))return;
      var id=el.getAttribute('data-user-id')||el.getAttribute('data-uid')||el.getAttribute('data-profile')||el.getAttribute('data-mid')||el.getAttribute('data-id');
      if(id){ev.preventDefault();ev.stopPropagation();openUserProfile(id)}
    });
  });
  // member rows
  root.querySelectorAll('.member-row[data-mid]').forEach(function(el){
    if(el.dataset.profileWired==='1')return;
    el.dataset.profileWired='1';
    el.addEventListener('click',function(ev){
      if(ev.target.closest('button,.acts,.eye'))return;
      openUserProfile(el.getAttribute('data-mid'));
    });
  });
}

// patch addFriendByMember to update buttons


function uvBackOrClose(){
  try{
    var s=document.getElementById('settings');
    var open=s&&(s.classList.contains('on')||s.style.display==='flex');
    if(open){
      var titleEl=document.getElementById('set-title');
      var title=titleEl?String(titleEl.textContent||'').trim():'';
      if(title&&title!=='Paramètres'&&title!=='Parametres'&&title!=='Settings'){
        try{openSettings('root');return}catch(e){}
      }
      closeSettingsPanel();
      return;
    }
    try{closeUserProfile()}catch(e){}
    try{closeMembersPanel()}catch(e){}
    var fp=document.getElementById('friends-panel');if(fp)fp.classList.remove('on');
    var ov=document.getElementById('overlay');if(ov)ov.classList.remove('on');
  }catch(e){try{closeSettingsPanel()}catch(x){}}
}
window.uvBackOrClose=uvBackOrClose;
window.closeSettingsPanel=closeSettingsPanel;
function hidePanel(el){
  if(!el)return;
  try{
    el.classList.remove('on');
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('pointer-events','none','important');
    el.setAttribute('aria-hidden','true');
  }catch(e){}
}
function closeSettingsPanel(){
  try{
    var s=document.getElementById('settings')||setEl;
    hidePanel(s);
    var ov=document.getElementById('overlay');
    if(ov){ov.classList.remove('on');ov.style.pointerEvents='none';}
  }catch(e){}
}
function uvHandleCloseClick(t,e){
  if(!t)return false;
  var id=t.id||'';
  var closeIds={
    'set-back':1,'member-close':1,'friends-close':1,'search-close':1,'uprofile-close':1,
    'srv-modal-cancel':1,'cam-lb-x':1,'emoji-close':1,'gif-close':1,'shortcuts-close':1,'badge-x':1
  };
  var isClose=!!closeIds[id]||(t.classList&&t.classList.contains('uclose'))||(t.getAttribute&&t.getAttribute('data-close')!=null);
  if(!isClose)return false;
  try{if(e){e.preventDefault();e.stopPropagation()}}catch(x){}
  try{
    if(id==='set-back'){
      var titleEl=document.getElementById('set-title');
      var title=titleEl?String(titleEl.textContent||'').trim():'';
      if(!title||title==='Paramètres'||title==='Parametres'||title==='Settings'){
        closeSettingsPanel();
        return true;
      }
      try{openSettings('root')}catch(x){closeSettingsPanel()}
      return true;
    }
    if(id==='member-close'){try{closeMembersPanel()}catch(x){hidePanel(document.getElementById('member-panel'))}return true}
    if(id==='friends-close'){hidePanel(document.getElementById('friends-panel'));var ov=document.getElementById('overlay');if(ov)ov.classList.remove('on');return true}
    if(id==='search-close'){var sb=document.getElementById('search-bar');if(sb)sb.classList.remove('on');return true}
    if(id==='uprofile-close'||(t.classList&&t.classList.contains('uclose'))){try{closeUserProfile()}catch(x){hidePanel(document.getElementById('uprofile-overlay'))}return true}
    if(id==='srv-modal-cancel'){try{closeSrvModal()}catch(x){hidePanel(document.getElementById('srv-modal'))}return true}
    if(id==='cam-lb-x'){hidePanel(document.getElementById('cam-lightbox'));return true}
    if(id==='emoji-close'){hidePanel(document.getElementById('emoji-pop'));var ep=document.getElementById('emoji-panel');if(ep)ep.classList.remove('on');return true}
    if(id==='gif-close'){hidePanel(document.getElementById('gif-pop'));return true}
    if(id==='shortcuts-close'){hidePanel(document.getElementById('shortcuts-modal'));return true}
    if(t.getAttribute&&t.getAttribute('data-close')!=null){
      var sel=t.getAttribute('data-close');
      if(sel)hidePanel(document.querySelector(sel));
      else hidePanel(t.closest('.on'));
      return true;
    }
  }catch(err){console.warn('close',err)}
  return false;
}
function dismissAllOverlays(except){
  except=except||{};
  try{
    if(!except.settings) closeSettingsPanel();
    if(!except.members){try{closeMembersPanel()}catch(e){
      var mp=document.getElementById('member-panel');
      if(mp){mp.classList.remove('on');mp.style.transform='';}
    }}
    if(!except.profile){try{closeUserProfile()}catch(e){}}
    if(!except.srv){try{closeSrvModal()}catch(e){
      var sm=document.getElementById('srv-modal');if(sm)sm.classList.remove('on');
    }}
    var fp=document.getElementById('friends-panel');
    if(fp&&!except.friends) fp.classList.remove('on');
    var sb=document.getElementById('search-bar');
    if(sb&&!except.search) sb.classList.remove('on');
    var sc=document.getElementById('shortcuts-modal');
    if(sc){sc.classList.remove('on');sc.style.display='none'}
    var cl=document.getElementById('cam-lightbox');
    if(cl){cl.classList.remove('on');cl.style.display='none'}
    var dr=document.getElementById('drawer');
    if(dr&&!except.drawer) dr.classList.remove('on');
    var ov=document.getElementById('overlay');
    if(ov&&!except.overlay){
      ov.classList.remove('on');
      ov.style.opacity='0';
      ov.style.pointerEvents='none';
    }
  }catch(e){console.warn('dismiss',e)}
}
window.closeSettingsPanel=closeSettingsPanel;
window.dismissAllOverlays=dismissAllOverlays;

document.addEventListener('click',function(e){
  var t=e.target.closest&&e.target.closest('#set-back,#member-close,#friends-close,#search-close,#uprofile-close,.uclose,#srv-modal-cancel,[data-close]');
  if(!t)return;
  var id=t.id||'';
  try{
    if(id==='set-back'){e.preventDefault();window.__uvX();return}
    if(id==='member-close'){e.preventDefault();closeMembersPanel();return}
    if(id==='friends-close'){e.preventDefault();var fp=document.getElementById('friends-panel');if(fp)fp.classList.remove('on');var ov=document.getElementById('overlay');if(ov){ov.classList.remove('on');ov.style.opacity='0';ov.style.pointerEvents='none'}return}
    if(id==='search-close'){e.preventDefault();var sb=document.getElementById('search-bar');if(sb)sb.classList.remove('on');return}
    if(id==='uprofile-close'||t.classList.contains('uclose')){e.preventDefault();closeUserProfile();return}
    if(id==='srv-modal-cancel'){e.preventDefault();closeSrvModal();return}
    if(t.getAttribute('data-close')!=null){e.preventDefault();dismissAllOverlays({});return}
  }catch(err){console.warn('close click',err)}
}, true);




function wireVoiceControls(){
  try{
    // Map legacy IDs expected by older code to real DOM
    var map=[['btn-leave-voice','v-leave'],['btn-v-leave','v-leave'],['btn-mute-mic','v-mic'],['btn-v-mute','v-mic'],['v-mute','v-mic']];
    map.forEach(function(pair){
      var legacy=pair[0], real=pair[1];
      if(!document.getElementById(legacy) && document.getElementById(real)){
        try{ /* no clone needed - just bind handlers to real */ }catch(e){}
      }
    });
    var leave=document.getElementById('v-leave');
    if(leave){
      leave.onclick=function(){
        try{if(typeof leaveVoiceRoom==='function')leaveVoiceRoom()}catch(e){}
        try{showScreen('chat')}catch(e){}
      };
    }
    var mic=document.getElementById('v-mic');
    if(mic && !mic.__wired){
      mic.__wired=1;
      mic.onclick=function(){
        try{
          if(typeof toggleMic==='function')toggleMic();
          else if(typeof muteMic==='function')muteMic();
        }catch(e){console.warn(e)}
      };
    }
    var deaf=document.getElementById('v-deaf');
    if(deaf && !deaf.__wired){
      deaf.__wired=1;
      deaf.onclick=function(){try{if(typeof toggleDeaf==='function')toggleDeaf()}catch(e){}};
    }
    var cam=document.getElementById('v-cam');
    if(cam && !cam.__wired){
      cam.__wired=1;
      cam.onclick=function(){try{if(typeof toggleCam==='function')toggleCam()}catch(e){}};
    }
    var scr=document.getElementById('v-scr');
    if(scr && !scr.__wired){
      scr.__wired=1;
      scr.onclick=function(){try{if(typeof toggleScreen==='function')toggleScreen()}catch(e){}};
    }
  }catch(e){console.warn('wireVoiceControls',e)}
}
window.wireVoiceControls=wireVoiceControls;


function safeEl(id){try{return document.getElementById(id)}catch(e){return null}}
function safeOn(id, ev, fn){
  try{
    var el=document.getElementById(id);
    if(!el)return false;
    el.addEventListener(ev, fn);
    return true;
  }catch(e){return false}
}

function toggleSearchBar(){
  try{
    var sb=document.getElementById('search-bar');
    if(!sb)return;
    sb.classList.toggle('on');
    if(sb.classList.contains('on')){
      var q=document.getElementById('search-q');
      if(q)setTimeout(function(){try{q.focus()}catch(e){}},50);
    } else {
      document.querySelectorAll('.msg.search-hide').forEach(function(m){m.classList.remove('search-hide')});
    }
  }catch(e){console.warn('toggleSearchBar',e)}
}
window.toggleSearchBar=toggleSearchBar;


var HUNTER_NAMES=/^(ryu)([\s._-].*)?$/i;
function hunterNameOf(u){
  var parts=[];
  try{
    if(u&&u.name)parts.push(u.name);
    if(u&&u.email)parts.push(String(u.email).split('@')[0]);
    if(prefs){if(prefs.displayName)parts.push(prefs.displayName);if(prefs.username)parts.push(prefs.username);if(prefs.baseUsername)parts.push(prefs.baseUsername);}
  }catch(e){}
  return parts;
}
function nameIsDesignatedHunter(name){
  name=String(name||'').trim();
  if(!name)return false;
  var low=name.toLowerCase();
  if(low==='ryu'||low.indexOf('ryu-')===0||low.indexOf('ryu_')===0||low.indexOf('ryu ')===0)return true;
  if(low==='@ryu'||low.indexOf('@ryu')===0)return true;
  return false;
}
function showBadgePopup(id){
  var b=UV_BADGE_DEF[id]||UV_BADGE_DEF[String(id||'').toLowerCase()];
  if(!b)return;
  var m=document.getElementById('badge-modal');
  if(!m){
    m=document.createElement('div');
    m.id='badge-modal';m.className='badge-modal';
    m.innerHTML='<div class="badge-card" id="badge-card"><button type="button" class="icon-btn badge-x" id="badge-x">✕</button><div class="badge-ico" id="badge-ico"></div><h3 id="badge-title"></h3><p id="badge-desc"></p></div>';
    document.body.appendChild(m);
    m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('on')});
    document.getElementById('badge-x').onclick=function(){m.classList.remove('on')};
  }
  var c=document.getElementById('badge-card');
  if(!m||!c)return;
  c.style.setProperty('--bc', b.color||'#7c3aed');
  document.getElementById('badge-ico').textContent=b.emoji||'◆';
  document.getElementById('badge-title').textContent=b.label||id;
  document.getElementById('badge-desc').textContent=b.desc||'';
  m.classList.add('on');
}
document.addEventListener('click',function(e){
  var t=e.target&&e.target.closest&&e.target.closest('[data-badge]');
  if(!t)return;
  e.preventDefault();e.stopPropagation();
  showBadgePopup(t.getAttribute('data-badge'));
},true);

function hunterBadgeChip(){
  return '<span class="ubadge b-bugh hunter-mini badge-tip" data-badge="hunter" role="button">🪲 Hunter</span>';
}
function applyHunterMe(){
  try{
    var nm=(prefs&&(prefs.displayName||prefs.username||prefs.baseUsername))||(user&&user.name)||'';
    var yes=nameIsDesignatedHunter(nm)||nameIsDesignatedDev(nm)||(typeof isBugHunter==='function'&&isBugHunter());
    document.documentElement.classList.toggle('hunter-me', !!yes);
    if(!yes)return;
    var pn=document.getElementById('p-name');
    if(pn)pn.innerHTML=goldNameHtml(nm||pn.textContent||'Ryu');
    var wl=document.getElementById('who-line');
    if(wl){
      var em=(user&&user.email)||'';
      wl.innerHTML='Connecte: '+goldNameHtml(nm);
    }
    var hn=document.getElementById('hub-name');
    if(hn)hn.innerHTML=goldNameHtml(nm||hn.textContent);
    document.querySelectorAll('.name, .uname, .uname-me, #up-name').forEach(function(el){
      var t=(el.textContent||'').replace(/\s*\(toi\)\s*/,'').trim();
      if((nameIsDesignatedHunter(t)||nameIsDesignatedDev(t)) && !el.querySelector('.hunter-gold') && !el.querySelector('.dev-red')){
        var self=/\(toi\)/.test(el.textContent||'')?' (toi)':'';
        el.innerHTML=goldNameHtml(t)+self;
      }
    });
  }catch(e){}
}

function nameIsDesignatedDev(name){
  name=String(name||'').trim().toLowerCase();
  if(!name)return false;
  if(name==='shaman'||name.indexOf('shaman-')===0||name.indexOf('shaman_')===0||name.indexOf('shaman ')===0)return true;
  if(name==='@shaman'||name.indexOf('@shaman')===0)return true;
  if(name==='cisco'||name.indexOf('cisco')===0)return true;
  return false;
}
function devBadgeChip(){
  return '<span class="ubadge b-dev dev-mini badge-tip" data-badge="xultra_dev" role="button">DEV</span>';
}
function publicName(n){
  n=String(n||'').trim();
  if(!n)return 'User';
  if(n.indexOf('@')>0 && n.indexOf('.')>n.indexOf('@')) n=n.split('@')[0];
  return n;
}
function goldNameHtml(name){
  name=String(name||'User');
  if(nameIsDesignatedDev(name)){
    return '<span class="dev-wrap"><span class="dev-red">'+esc(name)+'</span>'+devBadgeChip()+'</span>';
  }
  if(nameIsDesignatedHunter(name)){
    return '<span class="hunt-wrap"><span class="hunter-gold">'+esc(name)+'</span>'+hunterBadgeChip()+'</span>';
  }
  return esc(name);
}
function pickAvatarFile(){
  var i=document.getElementById('uv-av-pick');
  if(!i){
    i=document.createElement('input');
    i.type='file';i.accept='image/*';i.id='uv-av-pick';
    i.style.cssText='position:fixed;left:-9999px;width:1px;height:1px;opacity:0';
    document.body.appendChild(i);
    i.addEventListener('change', async function(){
      var f=i.files&&i.files[0];i.value='';
      if(!f)return;
      try{
        toast('Upload photo…');
        var u=await imgbb(f);
        if(!u)throw new Error('Upload vide');
        await savePrefs({avatar:u});
        toast('Photo mise a jour');
        try{if(typeof openMembers==='function')openMembers()}catch(e){}
      }catch(err){toast(err.message||'Upload échoué')}
    });
  }
  i.click();
}
function avatarMarkup(url, name){
  var ini=String(name||'?').replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase()||'?';
  url=String(url||'').trim();
  if(url&&url.indexOf('http')!==0&&url.indexOf('data:')!==0) url='';
  if(!url) return ini;
  return '<img class="av-img" src="'+esc(url)+'" alt="" data-ini="'+esc(ini)+'" referrerpolicy="no-referrer">';
}
function wireBrokenAvatars(root){
  try{
    (root||document).querySelectorAll('img.av-img').forEach(function(img){
      if(img.dataset.wired==='1')return;
      img.dataset.wired='1';
      img.onerror=function(){
        var ini=img.getAttribute('data-ini')||'?';
        var p=img.parentNode;
        if(p){p.textContent=ini;}
      };
    });
  }catch(e){}
}

function isBugHunter(){
  try{
    if(prefs&&(prefs.staffRole==='bug_hunter'||prefs.bugHunter==='1'))return true;
    var list=[];
    try{list=JSON.parse(platform&&platform.bug_hunters||'[]')}catch(e){}
    if(user&&list.indexOf(user.$id)>=0)return true;
    var names=hunterNameOf(user);
    for(var i=0;i<names.length;i++){if(nameIsDesignatedHunter(names[i]))return true;}
  }catch(e){}
  return false;
}
function bugReportsLocal(){
  try{return JSON.parse(localStorage.getItem('uv_bug_reports')||'[]')}catch(e){return []}
}
function saveBugReportsLocal(arr){
  try{localStorage.setItem('uv_bug_reports',JSON.stringify(arr.slice(0,200)))}catch(e){}
}
function parseBugReason(reason){
  var out={kind:'bug',title:'Bug',desc:'',shot:'',status:'open'};
  if(!reason)return out;
  var s=String(reason);
  var nl=String.fromCharCode(10);
  if(s.charAt(0)==='{'){
    try{
      var o=JSON.parse(s);
      if(o){
        out.title=String(o.title||o.targetName||'Bug');
        out.desc=String(o.desc||o.description||'');
        out.shot=o.shot||'';
        out.status=o.status||'open';
        s=(out.title||'')+nl+(out.desc||'');
      }
    }catch(e){}
  }
  s=s.split('[BUG]').join(' ').split('[bug]').join(' ');
  var idx=s.indexOf('SHOT:');
  if(idx>=0){out.shot=s.slice(idx+5).split(nl)[0].trim();s=s.slice(0,idx).trim()}
  var parts=s.split(nl);
  var lines=[];
  for(var i=0;i<parts.length;i++){var t=parts[i].trim();if(t)lines.push(t)}
  if(lines.length){
    out.title=lines[0].slice(0,90);
    out.desc=lines.slice(1).join(nl);
  }
  if(out.desc===out.title) out.desc='';
  if(out.desc.indexOf(out.title)===0) out.desc=out.desc.slice(out.title.length).trim();
  return out;
}
async function submitBugReport(title, desc, shotUrl){
  if(!user)throw new Error('Connecte-toi');
  title=(title||'').trim();desc=(desc||'').trim();
  if(!title||title.length<4)throw new Error('Titre trop court');
  var who=(prefs&&prefs.displayName)||(user&&user.name)||'User';
  var nl=String.fromCharCode(10);
  var reason=('[BUG] '+title+nl+desc+(shotUrl?(nl+'SHOT:'+shotUrl):'')).slice(0,800);
  var ok=false;
  try{
    await db.createDocument(DB,'ultravoc_reports',ID.unique(),{
      reporterId:user.$id||'',
      reporterName:who,
      targetId:'platform',
      targetName:title.slice(0,80),
      reason:reason,
      createdAt:new Date().toISOString()
    });
    ok=true;
  }catch(e){console.warn('reports',e)}
  try{
    if(typeof modlog==='function'){
      await modlog('bug.report', user.$id, reason.slice(0,1000));
      ok=true;
    }
  }catch(e){console.warn('modlog',e)}
  if(!ok){
    var loc=bugReportsLocal();
    loc.unshift({$id:'local-'+Date.now(),reporterId:user.$id,reporterName:who,targetId:'platform',targetName:title,reason:reason,createdAt:new Date().toISOString()});
    saveBugReportsLocal(loc);
    throw new Error('Envoi impossible pour le moment');
  }
}
async function listBugReports(){
  var docs=[];
  try{
    var r=await db.listDocuments(DB,'ultravoc_reports',[Query.orderDesc('$createdAt'),Query.limit(80)]);
    docs=r.documents||[];
  }catch(e){}
  try{
    var m=await db.listDocuments(DB,'ultravoc_modlog',[Query.orderDesc('$createdAt'),Query.limit(80)]);
    (m.documents||[]).forEach(function(d){
      if(d.action!=='bug.report'&&d.action!=='bug.submit')return;
      var p={};
      p=parseBugReason(d.detail||'');
      if(!p.kind)p.kind='bug';
      docs.push({
        $id:d.$id,
        reporterId:p.reporterId||d.actorId||'',
        reporterName:p.reporterName||d.actorName||'',
        targetId:'platform',
        targetName:p.title||'Bug',
        reason:JSON.stringify(p),
        type:'bug',
        status:p.status||'open',
        $createdAt:d.$createdAt
      });
    });
  }catch(e){}
  docs=docs.concat(bugReportsLocal());
  var seen={};var out=[];
  docs.forEach(function(d){
    var p=parseBugReason(d.reason);
    var key=(d.reporterId||'')+'|'+(p.title||d.targetName||'')+'|'+(d.$id||'');
    if(seen[d.$id])return;seen[d.$id]=1;
    if(d.type==='bug'||p.kind==='bug'||d.targetId==='platform')out.push(d);
  });
  return out;
}

async function updateBugStatus(id, status){
  status=String(status||'open');
  var loc=bugReportsLocal();
  var hit=loc.find(function(x){return x.$id===id});
  if(hit){
    var p=parseBugReason(hit.reason);p.status=status;
    hit.reason=JSON.stringify(p);hit.status=status;
    saveBugReportsLocal(loc);
  }
  if(String(id).indexOf('local-')===0)return true;
  function patchReason(curReason){
    var p=parseBugReason(curReason);p.kind='bug';p.status=status;
    return JSON.stringify(p);
  }
  var ok=false;
  try{
    var cur=null;
    try{cur=await db.getDocument(DB,'ultravoc_reports',id)}catch(e){}
    if(cur){
      try{await db.updateDocument(DB,'ultravoc_reports',id,{reason:patchReason(cur.reason)});ok=true;}catch(e){}
    }
  }catch(e){}
  if(!ok){
    try{
      var cur=await db.getDocument(DB,'ultravoc_modlog',id);
      var p=parseBugReason(cur.detail);
      p.status=status;p.kind='bug';
      await db.updateDocument(DB,'ultravoc_modlog',id,{detail:JSON.stringify(p).slice(0,1000)});
      ok=true;
    }catch(e){}
  }
  return ok;
}
window.handleBugAction=async function(id, uid, status){
  try{
    toast('Mise a jour…');
    var ok=await updateBugStatus(id, status);
    if(status==='resolved'){
      try{
        var all=await listBugReports();
        if(await maybeAwardBugH(uid, all)) toast('Badge BUG-H attribue');
      }catch(e){}
    }
    toast(ok?('Statut: '+status):'Statut local');
    try{openSettings('admin-bugs')}catch(e){}
  }catch(e){toast((e&&e.message)||'Erreur bouton')}
};

function hunterResolvedCount(uid, docs){
  var n=0;
  (docs||[]).forEach(function(d){
    if((d.reporterId||'')!==uid)return;
    var p=parseBugReason(d.reason);
    var st=p.status||d.status||'';
    if(st==='resolved')n++;
  });
  return n;
}
async function maybeAwardBugH(uid, docs){
  if(!uid)return;
  var n=hunterResolvedCount(uid, docs);
  if(n<10)return false;
  try{grantBadge(uid,'bug_h')}catch(e){}
  try{grantBadge(uid,'bug_hunter')}catch(e){}
  return true;
}
async function applyBugHunter(){
  if(!user)throw new Error('Connecte-toi');
  prefs.staffRole='bug_hunter';prefs.bugHunter='1';
  try{await savePrefs({staffRole:'bug_hunter',bugHunter:'1'})}catch(e){}
  try{
    var list=[];
    try{list=JSON.parse(platform&&platform.bug_hunters||'[]')}catch(e){}
    if(list.indexOf(user.$id)<0){list.push(user.$id);if(typeof setPlatform==='function')setPlatform('bug_hunters',JSON.stringify(list))}
  }catch(e){}
}

function openSettings(page){
  try{
  if(!setEl) setEl=document.getElementById('settings');
  if(!setBody) setBody=document.getElementById('set-body');
  if(!setEl||!setBody){
    try{toast('Panneau parametres introuvable')}catch(e){}
    console.warn('settings DOM missing');
    return;
  }
  setEl.classList.add('on');
  setEl.style.setProperty('display','flex','important');
  setEl.style.setProperty('visibility','visible','important');
  setEl.style.setProperty('pointer-events','auto','important');
  setEl.style.zIndex='80';
  const prefGet=(k,def)=>{const v=prefs[k];return v===undefined||v===null||v===''?def:v};
  const bindToggles=()=>{setBody.querySelectorAll('.toggle[data-pref]').forEach(t=>{
    t.onclick=async()=>{t.classList.toggle('on');const on=t.classList.contains('on');
      try{await savePrefs({[t.dataset.pref]:on?'1':'0'});toast('OK')}catch(e){toast(e.message);t.classList.toggle('on')}}
  })};
  const row=(go,ic,lab,extra='')=>\`<button type="button" class="card-row" data-go="\${go}"><span class="ic">\${ic}</span><span class="lab">\${lab}</span>\${extra}<span class="chev">›</span></button>\`;
  const pages={
    root(){document.getElementById('set-title').textContent='Paramètres';
      setBody.innerHTML=\`<div class="group-title">Compte utilisateur</div><div class="card-list">
        \${row('account','👤','Mon compte')}
        \${row('security','🛡','Sécurité & 2FA')}
        \${row('profile-edit','✎','Profil')}
        \${row('privacy','🔒','Contenu & confidentialité')}
        \${row('connections','🔗','Connexions')}
        \${row('devices','💻','Appareils connectés')}
        \${row('authorized-apps','🧩','Applications autorisées')}
        \${row('family','👨‍👩‍👧','Sécurité familiale')}
      </div>
      <div class="group-title">Application</div><div class="card-list">
        \${row('appearance','🎨','Apparence')}
        \${row('accessibility','♿','Accessibilité')}
        \${row('voice','🎙','Voix & vidéo')}
        \${row('chat','💬','Chat')}
        \${row('notifications','🔔','Notifications')}
        \${row('keybinds','⌨','Raccourcis')}
        \${row('language','🌐','Langue')}
        \${row('streamer','📹','Mode diffusion')}
        \${row('clips','🎬','Clips')}
        \${row('advanced','⚙','Avancés')}
        \${row('activity','🎮','Activité')}
      </div>
      <div class="group-title">Ultravoc+</div><div class="card-list">
        \${row('billing','✦','Abonnement & facturation')}
        \${row('shop','🛍','Boutique')}
        \${row('boosts','🚀','Boosts de serveur')}
      </div>
      \${isAdmin?\`<div class="group-title">Admin plateforme</div><div class="card-list">
        \${row('admin','🛡','Panel Admin','<span class="pill">OWNER</span>')}
        \${row('admin-bugs','🪲','Bug Hunter')}
        \${row('admin-reports','⚑','Signalements')}
        \${row('admin-ui','🧩','UI widgets')}
        \${row('admin-modlog','📜','Journal')}
        \${row('admin-mod','⚖','Modération utilisateur')}
      </div>\`:''}
      <div class="group-title">À propos</div><div class="card-list">
        \${row('bughunt','🪲','Bug Hunter')}
        \${row('changelog','✨','Quoi de neuf')}
        \${row('support','💬','Support')}
        \${row('feedback','📝','Envoyer un avis')}
      </div>
      <div style="height:12px"></div>
      <button type="button" class="btn-block danger" id="logout">Se déconnecter (toutes sessions)</button>\`;
      setBody.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>openSettings(b.dataset.go));
      const sInp=document.getElementById('set-search');
      if(sInp){sInp.value='';sInp.oninput=()=>{const q=sInp.value.trim().toLowerCase();setBody.querySelectorAll('.card-row[data-go]').forEach(row=>{const lab=(row.querySelector('.lab')||{}).textContent||'';row.style.display=!q||lab.toLowerCase().includes(q)?'':'none'});setBody.querySelectorAll('.group-title').forEach(g=>{const next=g.nextElementSibling;const vis=next&&[...next.querySelectorAll('.card-row')].some(r=>r.style.display!=='none');g.style.display=vis?'':'none'})};}
      document.getElementById('logout').onclick=async()=>{try{await account.deleteSessions()}catch(_){try{await account.deleteSession('current')}catch(__){}}location.replace('/')};
    },
    account(){document.getElementById('set-title').textContent='Mon compte';
      setBody.innerHTML=\`<div class="group-title">Identité</div><div class="card-list">
        <div class="card-row"><span class="lab">Nom d'affichage</span><span class="val">\${esc(prefs.displayName||user.name||'')}</span></div>
        <div class="card-row"><span class="lab">Nom d'utilisateur</span><span class="val">@\${esc(user.name||'')}</span></div>
        <div class="card-row"><span class="lab">E-mail</span><span class="val">\${esc(user.email||'')}</span></div>
        <div class="card-row"><span class="lab">Téléphone</span><span class="val">\${esc(prefGet('phone','Non lié'))}</span></div>
        <div class="card-row"><span class="lab">Rôle</span><span class="val">\${isAdmin?'Admin plateforme':'Membre'}</span></div>
        <div class="card-row"><span class="lab">ID</span><span class="val" style="font-size:.7rem">\${esc(user.$id||'')}</span></div>
      </div>
      <div class="group-title">Actions</div><div class="card-list">
        \${row('security','🔑','Mot de passe & 2FA')}
        \${row('danger-zone','⚠','Désactiver / supprimer le compte')}
      </div>
      <p style="font-size:.75rem;color:var(--m);margin-top:12px;line-height:1.4">Compte réel = <strong>e-mail + mot de passe</strong>. Cisco / Shaman sont des pseudos. Pour basculer : déconnexion puis login avec l'autre e-mail.</p>\`;
      setBody.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>openSettings(b.dataset.go));
    },
    security(){document.getElementById('set-title').textContent='Sécurité';
      setBody.innerHTML=\`<div class="group-title">Mot de passe</div>
        <div class="field"><label>Nouveau mot de passe</label><input type="password" id="npw" autocomplete="new-password"></div>
        <div class="field"><label>Confirmer</label><input type="password" id="npw2" autocomplete="new-password"></div>
        <div class="card-list"><div class="card-row"><span class="lab">Déconnecter les autres sessions</span><button type="button" class="toggle \${prefGet('kickOthers','1')==='1'?'on':''}" data-pref="kickOthers"></button></div></div>
        <button type="button" class="btn-block primary" id="chg-pw">Mettre à jour</button>
        <div class="group-title">Double authentification</div>
        <div class="card-list">
          <div class="card-row"><span class="lab">App d'authentification (TOTP)</span><button type="button" class="toggle \${prefGet('tfaApp','0')==='1'?'on':''}" data-pref="tfaApp"></button></div>
          <div class="card-row"><span class="lab">Clé de sécurité / biométrie</span><button type="button" class="toggle \${prefGet('tfaKey','0')==='1'?'on':''}" data-pref="tfaKey"></button></div>
          <div class="card-row"><span class="lab">Codes de secours</span><button type="button" class="toggle \${prefGet('tfaBackup','0')==='1'?'on':''}" data-pref="tfaBackup"></button></div>
          <div class="card-row"><span class="lab">SMS de secours</span><button type="button" class="toggle \${prefGet('tfaSms','0')==='1'?'on':''}" data-pref="tfaSms"></button></div>
          <div class="card-row"><span class="lab">Codes connexion usage unique</span><button type="button" class="toggle \${prefGet('otpLogin','0')==='1'?'on':''}" data-pref="otpLogin"></button></div>
          <div class="card-row"><span class="lab">Sessions vérifiées (e-mail)</span><button type="button" class="toggle \${prefGet('verifyNew','1')==='1'?'on':''}" data-pref="verifyNew"></button></div>
        </div>
        <p style="font-size:.72rem;color:var(--m);margin-top:10px;line-height:1.4">2FA réelle (TOTP / WebAuthn) sera branchée sur Appwrite MFA. Les interrupteurs enregistrent ta préférence.</p>\`;
      bindToggles();
      document.getElementById('chg-pw').onclick=async()=>{
        const a=document.getElementById('npw').value,b=document.getElementById('npw2').value;
        if(a.length<8)return toast('8 caractères min');if(a!==b)return toast('Non identiques');
        try{await account.updatePassword(a);toast('Mot de passe mis à jour');
          if(prefGet('kickOthers','1')==='1'){try{await account.deleteSessions()}catch(_){}}
          document.getElementById('npw').value=document.getElementById('npw2').value='';
        }catch(e){toast(e.message||'Erreur — reconnecte-toi')}
      };
    },
    'danger-zone'(){document.getElementById('set-title').textContent='Zone sensible';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Désactiver le compte</span><button type="button" class="btn-block danger" id="dis-acc" style="width:auto;padding:8px 12px;font-size:.75rem">Désactiver</button></div>
        <div class="card-row"><span class="lab">Supprimer définitivement</span><button type="button" class="btn-block danger" id="del-acc" style="width:auto;padding:8px 12px;font-size:.75rem">Supprimer</button></div>
      </div>
      <p style="font-size:.75rem;color:var(--m);margin-top:12px">Désactivation masque le profil (réactivable). Suppression définitive après délai — impossible si tu possèdes un serveur.</p>\`;
      document.getElementById('dis-acc').onclick=async()=>{if(!confirm('Désactiver ce compte ?'))return;try{await savePrefs({disabled:'1'});toast('Compte désactivé')}catch(e){toast(e.message)}};
      document.getElementById('del-acc').onclick=()=>toast('Demande admin requise pour suppression définitive');
    },
    'profile-edit'(){document.getElementById('set-title').textContent='Profil';
      setBody.innerHTML=\`<div class="field"><label>Nom d'affichage</label><input id="ed-name" value="\${esc(prefs.displayName||user.name||'')}" maxlength="32"></div>
        <div class="field"><label>Pronoms (40 car.)</label><input id="ed-pronouns" value="\${esc(prefs.pronouns||'')}" maxlength="40" placeholder="ex. il/lui, elle/elle, iel"></div>
        <div class="field"><label>À propos de moi (190 car.)</label><textarea id="ed-bio" maxlength="190">\${esc(prefs.bio||'')}</textarea></div>
        <div class="field"><label>Couleur de thème</label><input type="color" id="ed-theme" value="\${esc(prefs.themeColor||'#7c3aed')}"></div>
        <div class="field"><label>Couleur 2 (dégradé Ultravoc+)</label><input type="color" id="ed-theme2" value="\${esc(prefs.themeColor2||'#22d3ee')}"></div>
        <div class="field"><label>Photo de profil</label>
        <div style="display:flex;align-items:center;gap:12px;margin:8px 0">
          <div id="ed-av-prev" style="width:64px;height:64px;border-radius:16px;overflow:hidden;background:linear-gradient(135deg,#312e81,#6d28d9);display:flex;align-items:center;justify-content:center;font-weight:800">\${prefs.avatar?('<img src="'+esc(prefs.avatar)+'" style="width:100%;height:100%;object-fit:cover">'):esc((prefs.displayName||'U').slice(0,2).toUpperCase())}</div>
          <div style="flex:1">
            <button type="button" class="btn-block primary" id="ed-av-btn">Changer la photo</button>
            <input type="file" id="ed-av" accept="image/*" capture="environment" style="position:absolute;left:-9999px;width:1px;height:1px">
            <div style="font-size:.72rem;color:var(--m);margin-top:6px">JPG, PNG, GIF, WebP — 8 Mo max</div>
          </div>
        </div></div>
        <div class="field"><label>Décoration d'avatar (Ultravoc+)</label><select id="ed-avdec"><option value="">Aucune</option><option value="neon">Anneau néon</option><option value="pulse">Pulse</option><option value="orbit">Orbit</option></select></div>
        <div class="field"><label>Bannière</label><input type="file" id="ed-ban" accept="image/*"></div>
        <div class="field"><label>Effet de profil (Ultravoc+)</label><select id="ed-fx"><option value="">Aucun</option><option value="particles">Particules</option><option value="glow">Lueur</option><option value="wave">Vague</option></select></div>
        <div class="group-title">Présence</div>
        <div class="field"><label>Statut</label><select id="ed-status"><option value="online">En ligne</option><option value="idle">Absent</option><option value="dnd">Ne pas déranger</option><option value="invisible">Invisible</option></select></div>
        <div class="field"><label>Statut personnalisé</label><input id="ed-custom" value="\${esc(prefs.customStatus||'')}" maxlength="64" placeholder="Que fais-tu ?"></div>
        <div class="group-title">Profils par serveur (Ultravoc+)</div>
        <p style="font-size:.75rem;color:var(--m);margin-bottom:10px">Pseudo, avatar, bannière et bio distincts par serveur — activé avec les serveurs custom.</p>
        <button type="button" class="btn-block primary" id="ed-save">Enregistrer le profil</button>\`;
      document.getElementById('ed-avdec').value=prefs.avatarDec||'';
      document.getElementById('ed-fx').value=prefs.profileFx||'';
      document.getElementById('ed-status').value=prefGet('status','online');
      document.getElementById('ed-save').onclick=async()=>{
        try{await savePrefs({
          displayName:document.getElementById('ed-name').value.trim().slice(0,32),
          pronouns:document.getElementById('ed-pronouns').value.trim().slice(0,40),
          bio:document.getElementById('ed-bio').value.slice(0,190),
          themeColor:document.getElementById('ed-theme').value,
          themeColor2:document.getElementById('ed-theme2').value,
          avatarDec:document.getElementById('ed-avdec').value,
          profileFx:document.getElementById('ed-fx').value,
          status:document.getElementById('ed-status').value,
          customStatus:document.getElementById('ed-custom').value.slice(0,64)
        });toast('Profil enregistré')}catch(e){toast(e.message)}
      };
      const bind=function(id,key){
        var inp=document.getElementById(id);
        if(!inp)return;
        inp.onchange=async function(e){
          var f=e.target.files&&e.target.files[0];
          e.target.value='';
          if(!f)return;
          try{
            toast('Upload…');
            var u=await imgbb(f);
            if(!u)throw new Error('URL vide');
            await savePrefs((function(){var o={};o[key]=u;return o})());
            var prev=document.getElementById('ed-av-prev');
            if(prev&&key==='avatar')prev.innerHTML='<img src="'+esc(u)+'" style="width:100%;height:100%;object-fit:cover">';
            toast('Photo mise a jour');
          }catch(err){toast(err.message||'Upload échoué')}
        };
      };
      bind('ed-av','avatar');bind('ed-ban','banner');
      var avBtn=document.getElementById('ed-av-btn');
      if(avBtn)avBtn.onclick=function(){var i=document.getElementById('ed-av');if(i)i.click()};
    },
    privacy(){document.getElementById('set-title').textContent='Confidentialité';
      const on=k=>prefGet(k,'1')==='1'?'on':'';
      const off=k=>prefGet(k,'0')==='1'?'on':'';
      setBody.innerHTML=\`<div class="group-title">Contenu sensible</div><div class="card-list">
        <div class="card-row"><span class="lab">Filtre MP</span><button type="button" class="toggle \${on('filterDm')}" data-pref="filterDm"></button></div>
        <div class="card-row"><span class="lab">Filtre serveurs</span><button type="button" class="toggle \${on('filterSrv')}" data-pref="filterSrv"></button></div>
        <div class="card-row"><span class="lab">Filtre spam / MP indésirables</span><button type="button" class="toggle \${on('filterSpam')}" data-pref="filterSpam"></button></div>
      </div>
      <div class="field"><label>Sensibilité du flou</label>
        <select id="blur-lvl"><option value="light">Légère</option><option value="med">Moyenne</option><option value="strong">Forte</option></select>
      </div>
      <div class="group-title">Qui peut te contacter</div>
      <div class="field"><label>Messages privés</label>
        <select id="dm-who"><option value="everyone">Tout le monde</option><option value="friends">Amis uniquement</option><option value="none">Personne</option></select>
      </div>
      <div class="field"><label>Demandes d'ami</label>
        <select id="fr-who"><option value="everyone">Tout le monde</option><option value="friends">Amis d'amis</option><option value="server">Membres de mes serveurs</option><option value="none">Personne</option></select>
      </div>
      <div class="field"><label>Appels de groupe</label>
        <select id="call-who"><option value="everyone">Tout le monde</option><option value="friends">Amis</option><option value="none">Personne</option></select>
      </div>
      <div class="group-title">Données</div><div class="card-list">
        <div class="card-row"><span class="lab">Personnaliser mon expérience</span><button type="button" class="toggle \${off('personalize')}" data-pref="personalize"></button></div>
        <div class="card-row"><span class="lab">Améliorer la plateforme</span><button type="button" class="toggle \${off('telemetry')}" data-pref="telemetry"></button></div>
        <div class="card-row"><span class="lab">Données anonymisées partenaires</span><button type="button" class="toggle \${off('partners')}" data-pref="partners"></button></div>
      </div>
      <button type="button" class="btn-block primary" id="save-priv" style="margin-top:12px">Enregistrer</button>
      <button type="button" class="btn-block" id="req-data" style="margin-top:8px;background:var(--row)">Demander une copie de mes données</button>\`;
      document.getElementById('dm-who').value=prefGet('dmWho','everyone');
      document.getElementById('fr-who').value=prefGet('frWho','everyone');
      document.getElementById('call-who').value=prefGet('callWho','friends');
      document.getElementById('blur-lvl').value=prefGet('blurLvl','med');
      bindToggles();
      document.getElementById('save-priv').onclick=async()=>{try{await savePrefs({dmWho:document.getElementById('dm-who').value,frWho:document.getElementById('fr-who').value,callWho:document.getElementById('call-who').value,blurLvl:document.getElementById('blur-lvl').value});toast('OK')}catch(e){toast(e.message)}};
      document.getElementById('req-data').onclick=()=>toast('Demande enregistrée — export sous 30 jours');
    },
    connections(){document.getElementById('set-title').textContent='Connexions';
      const nets=['Steam','Spotify','Xbox','PlayStation','YouTube','Twitch','TikTok','Instagram','Reddit','GitHub','Battle.net','Riot','Epic','Domaine web'];
      setBody.innerHTML=\`<p style="font-size:.8rem;color:var(--m);margin-bottom:12px">Lie un compte pour l'afficher sur ton profil. OAuth complet bientôt — bascule manuelle pour l'instant.</p>
        <div class="card-list">\${nets.map(n=>{
          const k='conn_'+n.replace(/[^a-zA-Z]/g,'').toLowerCase();
          const linked=prefGet(k,'0')==='1';
          return \`<div class="card-row"><span class="lab">\${n}</span><button type="button" class="toggle \${linked?'on':''}" data-pref="\${k}"></button></div>\`;
        }).join('')}</div>\`;
      bindToggles();
    },
    devices(){document.getElementById('set-title').textContent='Appareils';
      const ua=navigator.userAgent.slice(0,90);
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row" style="flex-direction:column;align-items:flex-start;gap:4px">
          <span class="lab">Cet appareil</span>
          <span class="val" style="font-size:.72rem;word-break:break-all">\${esc(ua)}</span>
          <span class="val" style="font-size:.72rem;color:var(--ok)">● Session active</span>
        </div>
      </div>
      <button type="button" class="btn-block danger" id="kick-all" style="margin-top:14px">Déconnecter toutes les sessions</button>
      <p style="font-size:.72rem;color:var(--m);margin-top:10px">En cas de doute : change le mot de passe, déconnecte tout, révoque les applications.</p>\`;
      document.getElementById('kick-all').onclick=async()=>{try{await account.deleteSessions();toast('Sessions fermées');location.replace('/')}catch(e){toast(e.message)}};
    },
    'authorized-apps'(){document.getElementById('set-title').textContent='Applications autorisées';
      setBody.innerHTML=\`<p style="font-size:.85rem;color:var(--m);line-height:1.45;margin-bottom:12px">Bots et sites liés via OAuth. Nettoie régulièrement — vecteur de compromission courant.</p>
        <div class="card-list"><div class="card-row"><span class="lab">Aucune application liée</span><span class="val">—</span></div></div>
        <p style="font-size:.72rem;color:var(--m);margin-top:10px">La liste OAuth Appwrite s'affichera ici dès l'activation des apps tierces.</p>\`;
    },
    family(){document.getElementById('set-title').textContent='Sécurité familiale';
      setBody.innerHTML=\`<p style="font-size:.85rem;color:var(--m);line-height:1.45;margin-bottom:12px">Liaison parent / ado : le parent voit sur 7 jours les serveurs rejoints, amis ajoutés et contacts — jamais le contenu des messages.</p>
        <div class="field"><label>Code de liaison</label><input id="fam-code" placeholder="Code reçu ou à générer"></div>
        <button type="button" class="btn-block primary" id="fam-link">Lier / générer</button>
        <div class="card-list" style="margin-top:12px">
          <div class="card-row"><span class="lab">Résumé hebdo par e-mail</span><button type="button" class="toggle \${prefGet('famMail','0')==='1'?'on':''}" data-pref="famMail"></button></div>
        </div>\`;
      bindToggles();
      document.getElementById('fam-link').onclick=()=>toast('Liaison familiale — bientôt disponible');
    },
    appearance(){document.getElementById('set-title').textContent='Apparence';
      setBody.innerHTML=\`<div class="group-title">Thème</div>
        <div class="field"><label>Thème</label>
          <select id="theme-sel"><option value="dark">Sombre (XULTRA)</option><option value="midnight">Noir profond (OLED)</option><option value="neon">Néon intense</option><option value="light">Clair</option><option value="system">Système</option></select>
        </div>
        <div class="group-title">Messages</div>
        <div class="field"><label>Mode d'affichage</label>
          <select id="msg-mode"><option value="cozy">Confortable</option><option value="compact">Compact</option></select>
        </div>
        <div class="field"><label>Taille du texte (12–24)</label>
          <input type="range" id="font-sz" min="12" max="24" value="\${prefGet('fontSz','15')}">
        </div>
        <div class="field"><label>Zoom interface (%)</label>
          <input type="range" id="ui-zoom" min="50" max="200" step="10" value="\${prefGet('uiZoom','100')}">
        </div>
        <div class="card-list">
          <div class="card-row"><span class="lab">Avatars en mode compact</span><button type="button" class="toggle \${prefGet('compactAv','1')==='1'?'on':''}" data-pref="compactAv"></button></div>
          <div class="card-row"><span class="lab">Barres de rôles colorées</span><button type="button" class="toggle \${prefGet('roleBars','1')==='1'?'on':''}" data-pref="roleBars"></button></div>
          <div class="card-row"><span class="lab">Aperçu liens / images</span><button type="button" class="toggle \${prefGet('linkPrev','1')==='1'?'on':''}" data-pref="linkPrev"></button></div>
          <div class="card-row"><span class="lab">Sync thème multi-appareils</span><button type="button" class="toggle \${prefGet('themeSync','1')==='1'?'on':''}" data-pref="themeSync"></button></div>
        </div>
        <button type="button" class="btn-block primary" id="save-app" style="margin-top:12px">Enregistrer</button>\`;
      document.getElementById('theme-sel').value=prefGet('theme','dark');
      document.getElementById('msg-mode').value=prefGet('msgMode','cozy');
      bindToggles();
      document.getElementById('save-app').onclick=async()=>{
        try{await savePrefs({theme:document.getElementById('theme-sel').value,msgMode:document.getElementById('msg-mode').value,fontSz:String(document.getElementById('font-sz').value),uiZoom:String(document.getElementById('ui-zoom').value)});
          document.documentElement.style.setProperty('--chat-font',document.getElementById('font-sz').value+'px');
          toast('Apparence OK')}catch(e){toast(e.message)}
      };
    },
    accessibility(){document.getElementById('set-title').textContent='Accessibilité';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Réduire les mouvements</span><button type="button" class="toggle \${prefGet('reduceMotion','0')==='1'?'on':''}" data-pref="reduceMotion"></button></div>
        <div class="card-row"><span class="lab">Autoplay GIF</span><button type="button" class="toggle \${prefGet('autoGif','1')==='1'?'on':''}" data-pref="autoGif"></button></div>
        <div class="card-row"><span class="lab">Autoplay vidéos</span><button type="button" class="toggle \${prefGet('autoVid','0')==='1'?'on':''}" data-pref="autoVid"></button></div>
        <div class="card-row"><span class="lab">Stickers toujours animés</span><button type="button" class="toggle \${prefGet('animStick','1')==='1'?'on':''}" data-pref="animStick"></button></div>
        <div class="card-row"><span class="lab">Toujours souligner les liens</span><button type="button" class="toggle \${prefGet('underlineLinks','0')==='1'?'on':''}" data-pref="underlineLinks"></button></div>
      </div>
      <div class="field"><label>Saturation des couleurs</label><input type="range" id="sat" min="50" max="150" value="\${prefGet('sat','100')}"></div>
      <div class="field"><label>Vitesse synthèse vocale</label><input type="range" id="tts" min="0.5" max="2" step="0.1" value="\${prefGet('ttsRate','1')}"></div>
      <button type="button" class="btn-block primary" id="save-a11y">Enregistrer</button>\`;
      bindToggles();
      document.getElementById('save-a11y').onclick=async()=>{try{await savePrefs({sat:document.getElementById('sat').value,ttsRate:document.getElementById('tts').value});toast('OK')}catch(e){toast(e.message)}};
    },
    voice(){document.getElementById('set-title').textContent='Voix & vidéo';
      setBody.innerHTML=\`<div class="group-title">Périphériques</div>
        <div class="field"><label>Micro (entrée)</label><select id="vq-in"><option value="">Par défaut</option></select></div>
        <div class="field"><label>Casque (sortie)</label><select id="vq-out"><option value="">Par défaut</option></select></div>
        <div class="field"><label>Volume entrée</label><input type="range" id="vol-in" min="0" max="100" value="\${prefGet('volIn','80')}"></div>
        <div class="field"><label>Volume sortie</label><input type="range" id="vol-out" min="0" max="100" value="\${prefGet('volOut','80')}"></div>
        <div class="group-title">Mode d'entrée</div>
        <div class="field"><label>Activation</label>
          <select id="vad-mode"><option value="vad">Voix activée (VAD)</option><option value="ptt">Push-to-talk</option></select>
        </div>
        <div class="field"><label>Seuil de sensibilité</label><input type="range" id="vad-th" min="0" max="100" value="\${prefGet('vadTh','40')}"></div>
        <div class="field"><label>Délai relâchement PTT (ms)</label><input type="range" id="ptt-rel" min="20" max="2000" step="20" value="\${prefGet('pttRel','200')}"></div>
        <div class="group-title">Traitement audio</div><div class="card-list">
          <div class="card-row"><span class="lab">Suppression de bruit</span><button type="button" class="toggle \${prefGet('noise','1')==='1'?'on':''}" data-pref="noise"></button></div>
          <div class="card-row"><span class="lab">Annulation d'écho</span><button type="button" class="toggle \${prefGet('echo','1')==='1'?'on':''}" data-pref="echo"></button></div>
          <div class="card-row"><span class="lab">Contrôle auto du gain</span><button type="button" class="toggle \${prefGet('agc','1')==='1'?'on':''}" data-pref="agc"></button></div>
          <div class="card-row"><span class="lab">Stéréo / spatial</span><button type="button" class="toggle \${prefGet('stereo','0')==='1'?'on':''}" data-pref="stereo"></button></div>
          <div class="card-row"><span class="lab">QoS haute priorité</span><button type="button" class="toggle \${prefGet('qos','0')==='1'?'on':''}" data-pref="qos"></button></div>
        </div>
        <div class="group-title">Qualité & vidéo</div>
        <div class="field"><label>Débit vocal</label>
          <select id="vq-q"><option value="low">Économie</option><option value="med">Standard</option><option value="high">Haute qualité</option></select>
        </div>
        <div class="field"><label>Résolution cam / partage</label>
          <select id="vq-res"><option value="480">480p</option><option value="720">720p</option><option value="1080">1080p</option><option value="2160">4K (Ultravoc+)</option></select>
        </div>
        <div class="field"><label>Images / s</label>
          <select id="vq-fps"><option value="15">15</option><option value="24">24</option><option value="30">30</option><option value="60">60 (Ultravoc+)</option></select>
        </div>
        <div class="card-list">
          <div class="card-row"><span class="lab">Arrière-plan flou (cam)</span><button type="button" class="toggle \${prefGet('blurBg','0')==='1'?'on':''}" data-pref="blurBg"></button></div>
        </div>
        <button type="button" class="btn-block" id="v-test" style="margin-top:10px;background:var(--row)">Test micro 3 s</button>
        <button type="button" class="btn-block primary" id="save-voice" style="margin-top:8px">Enregistrer</button>
        <button type="button" class="btn-block" id="reset-voice" style="margin-top:8px;background:var(--row)">Réinitialiser les paramètres vocaux</button>\`;
      document.getElementById('vad-mode').value=prefGet('vadMode','vad');
      document.getElementById('vq-q').value=prefGet('voiceQ','med');
      document.getElementById('vq-res').value=prefGet('vRes','720');
      document.getElementById('vq-fps').value=prefGet('vFps','30');
      bindToggles();
      if(navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices){
        navigator.mediaDevices.enumerateDevices().then(devs=>{
          const ins=document.getElementById('vq-in'),outs=document.getElementById('vq-out');
          devs.filter(d=>d.kind==='audioinput').forEach(d=>{const o=document.createElement('option');o.value=d.deviceId;o.textContent=d.label||'Micro';ins.appendChild(o)});
          devs.filter(d=>d.kind==='audiooutput').forEach(d=>{const o=document.createElement('option');o.value=d.deviceId;o.textContent=d.label||'Sortie';outs.appendChild(o)});
          ins.value=prefGet('micId','');outs.value=prefGet('spkId','');
        }).catch(function(){});
      }
      document.getElementById('v-test').onclick=async()=>{
        try{const s=await navigator.mediaDevices.getUserMedia({audio:true});toast('Micro OK');setTimeout(()=>s.getTracks().forEach(t=>t.stop()),3000)}catch(e){toast('Micro refusé')}
      };
      document.getElementById('reset-voice').onclick=async()=>{try{await savePrefs({volIn:'80',volOut:'80',vadMode:'vad',vadTh:'40',noise:'1',echo:'1',agc:'1'});toast('Réinitialisé');openSettings('voice')}catch(e){toast(e.message)}};
      document.getElementById('save-voice').onclick=async()=>{
        try{await savePrefs({
          volIn:document.getElementById('vol-in').value,volOut:document.getElementById('vol-out').value,
          vadMode:document.getElementById('vad-mode').value,vadTh:document.getElementById('vad-th').value,pttRel:document.getElementById('ptt-rel').value,
          voiceQ:document.getElementById('vq-q').value,vRes:document.getElementById('vq-res').value,vFps:document.getElementById('vq-fps').value,
          micId:document.getElementById('vq-in').value,spkId:document.getElementById('vq-out').value
        });toast('Voix enregistrée')}catch(e){toast(e.message)}
      };
    },
    chat(){document.getElementById('set-title').textContent='Chat';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Conversion auto en emoji</span><button type="button" class="toggle \${prefGet('autoEmoji','1')==='1'?'on':''}" data-pref="autoEmoji"></button></div>
        <div class="card-row"><span class="lab">Emojis animés</span><button type="button" class="toggle \${prefGet('animEmoji','1')==='1'?'on':''}" data-pref="animEmoji"></button></div>
        <div class="card-row"><span class="lab">Stickers animés au survol</span><button type="button" class="toggle \${prefGet('stickerHover','1')==='1'?'on':''}" data-pref="stickerHover"></button></div>
        <div class="card-row"><span class="lab">Aperçu pièces jointes</span><button type="button" class="toggle \${prefGet('attachPrev','1')==='1'?'on':''}" data-pref="attachPrev"></button></div>
        <div class="card-row"><span class="lab">Messages système</span><button type="button" class="toggle \${prefGet('sysMsg','1')==='1'?'on':''}" data-pref="sysMsg"></button></div>
        <div class="card-row"><span class="lab">Aperçu Markdown en frappe</span><button type="button" class="toggle \${prefGet('mdPrev','1')==='1'?'on':''}" data-pref="mdPrev"></button></div>
      </div>
      <div class="field"><label>Filtre de mots (virgules)</label><input id="word-filter" value="\${esc(prefs.wordFilter||'')}" placeholder="mot1, mot2"></div>
      <button type="button" class="btn-block primary" id="save-chat">Enregistrer</button>\`;
      bindToggles();
      document.getElementById('save-chat').onclick=async()=>{try{await savePrefs({wordFilter:document.getElementById('word-filter').value.slice(0,500)});toast('OK')}catch(e){toast(e.message)}};
    },
    notifications(){document.getElementById('set-title').textContent='Notifications';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Notifications bureau</span><button type="button" class="toggle \${prefGet('nDesk','1')==='1'?'on':''}" data-pref="nDesk"></button></div>
        <div class="card-row"><span class="lab">Aperçu du message</span><button type="button" class="toggle \${prefGet('nPrev','1')==='1'?'on':''}" data-pref="nPrev"></button></div>
        <div class="card-row"><span class="lab">Son message</span><button type="button" class="toggle \${prefGet('nMsg','1')==='1'?'on':''}" data-pref="nMsg"></button></div>
        <div class="card-row"><span class="lab">Son appel entrant</span><button type="button" class="toggle \${prefGet('nCall','1')==='1'?'on':''}" data-pref="nCall"></button></div>
        <div class="card-row"><span class="lab">Connexion / déco vocale</span><button type="button" class="toggle \${prefGet('nVoice','0')==='1'?'on':''}" data-pref="nVoice"></button></div>
        <div class="card-row"><span class="lab">Mute / deafen</span><button type="button" class="toggle \${prefGet('nMute','0')==='1'?'on':''}" data-pref="nMute"></button></div>
        <div class="card-row"><span class="lab">Ne pas déranger</span><button type="button" class="toggle \${prefGet('dnd','0')==='1'?'on':''}" data-pref="dnd"></button></div>
        <div class="card-row"><span class="lab">E-mails (actus)</span><button type="button" class="toggle \${prefGet('nMail','0')==='1'?'on':''}" data-pref="nMail"></button></div>
      </div>
      <button type="button" class="btn-block" id="ask-perm" style="margin-top:12px;background:var(--row)">Autoriser les notifications navigateur</button>\`;
      bindToggles();
      document.getElementById('ask-perm').onclick=async()=>{try{const p=await Notification.requestPermission();toast(p==='granted'?'Autorisé':'Refusé')}catch(e){toast('Non supporté')}};
    },
    keybinds(){document.getElementById('set-title').textContent='Raccourcis';
      const binds=[['PTT','Push-to-talk'],['Mute','Couper le micro'],['Deafen','Couper le son'],['MarkRead','Marquer comme lu'],['Search','Recherche rapide']];
      setBody.innerHTML=\`<p style="font-size:.8rem;color:var(--m);margin-bottom:10px">Clique puis appuie sur une touche. Fixes : Ctrl+K recherche, Ctrl+Shift+M mute.</p>
        <div class="card-list">\${binds.map(([k,l])=>\`<div class="card-row"><span class="lab">\${l}</span><button type="button" class="pill" data-bind="\${k}" style="cursor:pointer">\${esc(prefGet('kb_'+k,'—'))}</button></div>\`).join('')}</div>\`;
      setBody.querySelectorAll('[data-bind]').forEach(b=>{
        b.onclick=()=>{b.textContent='…';const once=e=>{e.preventDefault();const key=e.code||e.key;b.textContent=key;savePrefs({['kb_'+b.dataset.bind]:key}).then(()=>toast('Raccourci OK')).catch(()=>{});window.removeEventListener('keydown',once)};window.addEventListener('keydown',once)};
      });
    },
    language(){document.getElementById('set-title').textContent='Langue';
      setBody.innerHTML=\`<div class="field"><label>Langue de l'interface</label>
        <select id="lang"><option value="fr-CA">Français (Canada)</option><option value="fr-FR">Français (France)</option><option value="en">English</option><option value="es">Español</option></select>
      </div>
      <button type="button" class="btn-block primary" id="save-lang">Enregistrer</button>\`;
      document.getElementById('lang').value=prefGet('lang','fr-CA');
      document.getElementById('save-lang').onclick=async()=>{try{await savePrefs({lang:document.getElementById('lang').value});toast('Langue enregistrée')}catch(e){toast(e.message)}};
    },
    streamer(){document.getElementById('set-title').textContent='Mode diffusion';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Mode diffusion actif</span><button type="button" class="toggle \${prefGet('streamer','0')==='1'?'on':''}" data-pref="streamer"></button></div>
        <div class="card-row"><span class="lab">Masquer e-mail / infos perso</span><button type="button" class="toggle \${prefGet('hidePii','1')==='1'?'on':''}" data-pref="hidePii"></button></div>
        <div class="card-row"><span class="lab">Masquer liens d'invitation</span><button type="button" class="toggle \${prefGet('hideInv','1')==='1'?'on':''}" data-pref="hideInv"></button></div>
        <div class="card-row"><span class="lab">Couper sons notif en direct</span><button type="button" class="toggle \${prefGet('muteStream','1')==='1'?'on':''}" data-pref="muteStream"></button></div>
        <div class="card-row"><span class="lab">Auto si OBS détecté</span><button type="button" class="toggle \${prefGet('obsAuto','0')==='1'?'on':''}" data-pref="obsAuto"></button></div>
      </div>
      <p style="font-size:.75rem;color:var(--m);margin-top:10px">Protège ton stream des fuites d'infos à l'écran.</p>\`;
      bindToggles();
    },
    clips(){document.getElementById('set-title').textContent='Clips';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Activer les clips</span><button type="button" class="toggle \${prefGet('clipsOn','0')==='1'?'on':''}" data-pref="clipsOn"></button></div>
      </div>
      <div class="field"><label>Durée du tampon</label>
        <select id="clip-dur"><option value="30">30 s</option><option value="60">1 min</option><option value="120">2 min</option><option value="180">3 min</option><option value="300">5 min</option></select>
      </div>
      <div class="field"><label>Qualité</label>
        <select id="clip-q"><option value="720">720p</option><option value="1080">1080p</option></select>
      </div>
      <div class="field"><label>Audio</label>
        <select id="clip-audio"><option value="game">Jeu seul</option><option value="mic">Jeu + micro</option><option value="voice">Jeu + vocal plateforme</option></select>
      </div>
      <button type="button" class="btn-block primary" id="save-clips">Enregistrer</button>
      <p style="font-size:.72rem;color:var(--m);margin-top:10px">Capture locale côté client — intégration complète à venir.</p>\`;
      document.getElementById('clip-dur').value=prefGet('clipDur','30');
      document.getElementById('clip-q').value=prefGet('clipQ','720');
      document.getElementById('clip-audio').value=prefGet('clipAudio','game');
      bindToggles();
      document.getElementById('save-clips').onclick=async()=>{try{await savePrefs({clipDur:document.getElementById('clip-dur').value,clipQ:document.getElementById('clip-q').value,clipAudio:document.getElementById('clip-audio').value});toast('OK')}catch(e){toast(e.message)}};
    },
    advanced(){document.getElementById('set-title').textContent='Avancés';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Mode développeur (copier les ID)</span><button type="button" class="toggle \${prefGet('devMode','0')==='1'?'on':''}" data-pref="devMode"></button></div>
        <div class="card-row"><span class="lab">Accélération matérielle</span><button type="button" class="toggle \${prefGet('hwAccel','1')==='1'?'on':''}" data-pref="hwAccel"></button></div>
        <div class="card-row"><span class="lab">Traitement vidéo matériel</span><button type="button" class="toggle \${prefGet('hwVideo','1')==='1'?'on':''}" data-pref="hwVideo"></button></div>
        <div class="card-row"><span class="lab">Priorité de processus élevée</span><button type="button" class="toggle \${prefGet('highPrio','0')==='1'?'on':''}" data-pref="highPrio"></button></div>
      </div>
      <p style="font-size:.75rem;color:var(--m);margin-top:10px">Mode développeur : copie d'ID utilisateur / salon / serveur au clic droit.</p>\`;
      bindToggles();
    },
    activity(){document.getElementById('set-title').textContent='Activité';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Afficher le jeu / statut</span><button type="button" class="toggle \${prefGet('showActivity','1')==='1'?'on':''}" data-pref="showActivity"></button></div>
        <div class="card-row"><span class="lab">Voir l'activité des amis</span><button type="button" class="toggle \${prefGet('seeFriendsAct','1')==='1'?'on':''}" data-pref="seeFriendsAct"></button></div>
        <div class="card-row"><span class="lab">Activité des services liés</span><button type="button" class="toggle \${prefGet('showConnAct','1')==='1'?'on':''}" data-pref="showConnAct"></button></div>
      </div>
      <div class="field"><label>Statut personnalisé</label><input id="custom-status" value="\${esc(prefs.customStatus||'')}" maxlength="64" placeholder="Que fais-tu ?"></div>
      <button type="button" class="btn-block primary" id="save-act">Enregistrer</button>\`;
      bindToggles();
      document.getElementById('save-act').onclick=async()=>{try{await savePrefs({customStatus:document.getElementById('custom-status').value.slice(0,64)});toast('OK')}catch(e){toast(e.message)}};
    },
    billing(){document.getElementById('set-title').textContent='Abonnement';
      const pkg=prefGet('package','basic');
      const plan=prefGet('plusPlan','');
      const exp=prefGet('plusUntil','');
      let wallets={btc:'',ltc:'',usdt:'',eth:'',note:''};
      try{Object.assign(wallets,JSON.parse(platform.cryptoWallets||'{}'))}catch(e){}
      try{Object.assign(wallets,JSON.parse(prefGet('cryptoWallets','{}')||'{}'))}catch(e){}
      const plans=[
        {id:'m3',label:'3 mois',price:19.99,tag:'Essai long',months:3},
        {id:'m6',label:'6 mois',price:34.99,tag:'Populaire',months:6},
        {id:'m12',label:'1 an',price:59.99,tag:'Meilleur prix',months:12}
      ];
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Forfait</span><span class="val">\${pkg==='plus'?'Ultravoc+ actif':'Basique (gratuit)'}</span></div>
        \${plan?\`<div class="card-row"><span class="lab">Formule</span><span class="val">\${esc(plan)}</span></div>\`:''}
        \${exp?\`<div class="card-row"><span class="lab">Valide jusquau</span><span class="val">\${esc(exp)}</span></div>\`:''}
      </div>
      <div class="group-title">Ultravoc+ — crypto auto</div>
      <div style="font-size:.78rem;line-height:1.5;color:var(--m);margin-bottom:10px">
        Paiement detecte automatiquement (BTC / LTC). Envoie le montant exact affiche, puis Verifier.
      </div>
      <div style="display:grid;gap:10px">
        \${plans.map(p=>\`<div class="card-row" style="flex-direction:column;align-items:stretch;gap:8px;padding:14px">
          <div style="display:flex;justify-content:space-between;width:100%"><strong>\${p.label}</strong><span class="pill">\${p.tag}</span></div>
          <div style="font-size:1.15rem;font-weight:800;color:var(--p)">\${p.price.toFixed(2)} $ CAD</div>
          <button type="button" class="btn-block primary" data-cplan="\${p.id}" data-price="\${p.price}" data-months="\${p.months}">Payer en crypto</button>
        </div>\`).join('')}
      </div>
      <div id="crypto-pay" style="display:none;margin-top:14px"></div>
      \${isAdmin?\`<div class="group-title">Admin — wallets</div>
        <div class="field"><label>Bitcoin (BTC) — detection auto</label><input id="w-btc" value="\${esc(wallets.btc)}" placeholder="bc1... / 1... / 3..."></div>
        <div class="field"><label>Litecoin (LTC) — detection auto</label><input id="w-ltc" value="\${esc(wallets.ltc)}" placeholder="ltc1... / L..."></div>
        <div class="field"><label>USDT (manuel)</label><input id="w-usdt" value="\${esc(wallets.usdt)}" placeholder="T... ou 0x..."></div>
        <div class="field"><label>ETH (manuel)</label><input id="w-eth" value="\${esc(wallets.eth)}" placeholder="0x..."></div>
        <div class="field"><label>Note</label><input id="w-note" value="\${esc(wallets.note||'')}" placeholder="Ex: prioritiser BTC"></div>
        <button type="button" class="btn-block primary" id="save-wallets">Enregistrer wallets</button>
        <div class="group-title">Admin — force +</div>
        <select id="plus-dur"><option value="m3">3 mois</option><option value="m6">6 mois</option><option value="m12">1 an</option></select>
        <button type="button" class="btn-block primary" id="grant-plus" style="margin-top:8px">Activer mon +</button>
        <button type="button" class="btn-block danger" id="revoke-plus" style="margin-top:8px">Retirer +</button>\`:''}\`;

      async function fetchRates(){
        const r=await fetch('https://api.coinbase.com/v2/exchange-rates?currency=CAD');
        const j=await r.json();
        const rates=j.data.rates;
        return {
          btc:1/parseFloat(rates.BTC),
          ltc:1/parseFloat(rates.LTC||'1'),
          eth:1/parseFloat(rates.ETH),
          usdt:1/parseFloat(rates.USDT||rates.USDC||'1')
        };
      }
      function uniqueTag(){
        const s=(user.$id||'')+Date.now().toString(36);
        let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i)|0;
        return Math.abs(h)%9000+1000; // 1000-9999
      }
      async function showPay(planId, price, months){
        const box=document.getElementById('crypto-pay');
        box.style.display='block';
        box.innerHTML=\`<div style="padding:16px;text-align:center;color:var(--m)">Calcul du montant exact…</div>\`;
        let rates;
        try{rates=await fetchRates()}catch(e){box.innerHTML=\`<div class="card-row">Erreur taux crypto — reessaie</div>\`;return}
        const tag=uniqueTag();
        // unique amount: base + tag satoshis style in the last decimals
        const btcAmt=(price/rates.btc);
        const ltcAmt=(price/rates.ltc);
        // add unique micro offset so we can match THIS user payment
        const btcExact=(Math.floor(btcAmt*1e8)+tag)/1e8;
        const ltcExact=(Math.floor(ltcAmt*1e8)+tag)/1e8;
        const pending={plan:planId,price,months,tag,btc:btcExact,ltc:ltcExact,t:Date.now(),uid:user.$id};
        try{localStorage.setItem('uv_crypto_pending',JSON.stringify(pending))}catch(e){}
        const coins=[];
        if(wallets.btc)coins.push({k:'btc',name:'Bitcoin (BTC)',addr:wallets.btc,amt:btcExact,unit:'BTC',auto:true});
        if(wallets.ltc)coins.push({k:'ltc',name:'Litecoin (LTC)',addr:wallets.ltc,amt:ltcExact,unit:'LTC',auto:true});
        if(wallets.usdt)coins.push({k:'usdt',name:'USDT (~'+price.toFixed(2)+' CAD)',addr:wallets.usdt,amt:null,unit:'USDT',auto:false});
        if(wallets.eth)coins.push({k:'eth',name:'Ethereum (ETH)',addr:wallets.eth,amt:(price/rates.eth),unit:'ETH',auto:false});
        if(!coins.length){
          box.innerHTML=\`<div class="card-row" style="flex-direction:column;gap:8px;padding:14px"><strong>Aucun wallet configure</strong><span style="font-size:.8rem;color:var(--m)">\${isAdmin?'Ajoute BTC ou LTC ci-dessous (detection auto).':'Contacte un admin.'}</span></div>\`;
          return;
        }
        box.innerHTML=\`<div class="group-title">Envoie le montant EXACT</div>
          <p style="font-size:.75rem;color:var(--m);line-height:1.45;margin-bottom:10px">Le montant unique permet la detection auto. Ne pas arrondir. \${wallets.note?esc(wallets.note):''}</p>
          \${coins.map(c=>\`<div class="card-row" style="flex-direction:column;align-items:stretch;gap:6px;padding:12px;margin-bottom:8px">
            <div style="display:flex;justify-content:space-between"><strong>\${c.name}</strong>\${c.auto?'<span class="pill">auto</span>':'<span class="pill">manuel</span>'}</div>
            \${c.amt!=null?\`<div style="font-size:1.05rem;font-weight:800;color:var(--p)">\${c.amt} \${c.unit}</div>\`:''}
            <code style="font-size:.7rem;word-break:break-all;user-select:all">\${esc(c.addr)}</code>
            <div style="display:flex;gap:8px">
              <button type="button" class="btn-block" data-copy="\${esc(c.addr)}" style="flex:1;background:var(--row)">Copier</button>
              \${c.amt!=null?\`<button type="button" class="btn-block" data-copyamt="\${c.amt}" style="flex:1;background:var(--row)">Copier montant</button>\`:''}
            </div>
          </div>\`).join('')}
          <button type="button" class="btn-block primary" id="crypto-verify">Verifier le paiement (auto)</button>
          <p id="crypto-status" style="font-size:.75rem;color:var(--m);margin-top:8px;text-align:center"></p>\`;
        box.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast('Copie')}catch(e){}});
        box.querySelectorAll('[data-copyamt]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copyamt);toast('Montant copie')}catch(e){}});
        document.getElementById('crypto-verify').onclick=()=>verifyCrypto(pending,wallets);
        box.scrollIntoView({behavior:'smooth',block:'nearest'});
      }

      async function verifyCrypto(pending,wallets){
        const st=document.getElementById('crypto-status');
        const btn=document.getElementById('crypto-verify');
        if(btn)btn.disabled=true;
        if(st)st.textContent='Scan blockchain…';
        let found=false, via='';
        try{
          if(wallets.btc && pending.btc){
            const targetSats=Math.round(pending.btc*1e8);
            const res=await fetch('https://mempool.space/api/address/'+encodeURIComponent(wallets.btc)+'/txs');
            if(res.ok){
              const txs=await res.json();
              for(const tx of (txs||[]).slice(0,25)){
                const t=(tx.status&&tx.status.block_time)?tx.status.block_time*1000:(Date.now());
                if(pending.t && t+3600000<pending.t)continue; // too old vs pending start — skip very old; actually block_time is when confirmed
                for(const v of (tx.vout||[])){
                  if(v.scriptpubkey_address===wallets.btc && Math.abs((v.value||0)-targetSats)<=1){found=true;via='BTC';break}
                }
                if(found)break;
              }
            }
          }
          if(!found && wallets.ltc && pending.ltc){
            const targetSats=Math.round(pending.ltc*1e8);
            const res=await fetch('https://api.blockcypher.com https://api.languagetool.org https://*.trycloudflare.com wss://*.trycloudflare.com wss://journal-bernard-alarm-walking.trycloudflare.com/v1/ltc/main/addrs/'+encodeURIComponent(wallets.ltc)+'/full?limit=15');
            if(res.ok){
              const data=await res.json();
              for(const tx of (data.txs||[])){
                for(const o of (tx.outputs||[])){
                  const addrs=o.addresses||[];
                  if(addrs.includes(wallets.ltc) && Math.abs((o.value||0)-targetSats)<=1){found=true;via='LTC';break}
                }
                if(found)break;
              }
            }
          }
        }catch(e){if(st)st.textContent='Erreur reseau: '+e.message;if(btn)btn.disabled=false;return}
        if(found){
          const until=new Date();until.setMonth(until.getMonth()+(pending.months||12));
          const untilStr=until.toISOString().slice(0,10);
          try{
            await savePrefs({package:'plus',plusPlan:pending.plan,plusUntil:untilStr});
            if(typeof modlog==='function')await modlog('plus.crypto.auto',user.$id,via+' '+pending.plan+' '+untilStr);
            try{localStorage.removeItem('uv_crypto_pending')}catch(e){}
            toast('Paiement '+via+' confirme — Ultravoc+ active');
            if(st)st.textContent='OK — Ultravoc+ actif jusquau '+untilStr;
            setTimeout(()=>openSettings('billing'),800);
          }catch(e){toast(e.message);if(btn)btn.disabled=false}
        } else {
          if(st)st.textContent='Pas encore recu. Attends 1–3 confirmations puis reessaie.';
          if(btn)btn.disabled=false;
          toast('Paiement non trouve pour le moment');
        }
      }

      setBody.querySelectorAll('[data-cplan]').forEach(b=>b.onclick=()=>showPay(b.dataset.cplan,parseFloat(b.dataset.price),parseInt(b.dataset.months,10)));
      if(isAdmin){
        document.getElementById('save-wallets').onclick=async()=>{
          const data={btc:document.getElementById('w-btc').value.trim(),ltc:document.getElementById('w-ltc').value.trim(),usdt:document.getElementById('w-usdt').value.trim(),eth:document.getElementById('w-eth').value.trim(),note:document.getElementById('w-note').value.trim()};
          try{
            if(typeof setPlatform==='function')await setPlatform('cryptoWallets',JSON.stringify(data));
            await savePrefs({cryptoWallets:JSON.stringify(data)});
            Object.assign(wallets,data);toast('Wallets OK');openSettings('billing');
          }catch(e){toast(e.message)}
        };
        document.getElementById('grant-plus').onclick=async()=>{
          const dur=document.getElementById('plus-dur').value;const months={m3:3,m6:6,m12:12}[dur]||12;
          const until=new Date();until.setMonth(until.getMonth()+months);const untilStr=until.toISOString().slice(0,10);
          try{await savePrefs({package:'plus',plusPlan:dur,plusUntil:untilStr});toast('Active '+untilStr);openSettings('billing')}catch(e){toast(e.message)}
        };
        document.getElementById('revoke-plus').onclick=async()=>{try{await savePrefs({package:'basic',plusPlan:'',plusUntil:''});toast('Retire');openSettings('billing')}catch(e){toast(e.message)}};
      }
    },
shop(){document.getElementById('set-title').textContent='Boutique';
      setBody.innerHTML=\`<p style="font-size:.85rem;color:var(--m);line-height:1.45;margin-bottom:10px">Décorations, effets de profil, collections saisonnières. Achats définitifs ou locations.</p>
        <div class="card-list">
          <div class="card-row"><span class="lab">Anneau néon</span><span class="val">4,99 $</span></div>
          <div class="card-row"><span class="lab">Particules XULTRA</span><span class="val">6,99 $</span></div>
          <div class="card-row"><span class="lab">Pack saisonnier</span><span class="val">9,99 $</span></div>
        </div>
        <div class="group-title">Cadeaux</div>
        <div class="field"><label>Offrir Ultravoc+ (code)</label><input id="gift-code" placeholder="Coller un code cadeau"></div>
        <button type="button" class="btn-block primary" id="redeem-gift">Utiliser le code</button>
        <button type="button" class="btn-block" id="buy-gift" style="margin-top:8px;background:var(--row)">Acheter un cadeau (bientôt)</button>
        <p style="font-size:.72rem;color:var(--m);margin-top:10px">Codes reçus / envoyés et historique dès que le paiement est branché.</p>\`;
      document.getElementById('redeem-gift').onclick=async()=>{
        const c=(document.getElementById('gift-code').value||'').trim().toUpperCase();
        if(!c)return toast('Code requis');
        if(c.startsWith('ULTRA-')||c.startsWith('PLUS-')){
          try{await savePrefs({package:'plus',plusPlan:'gift',plusUntil:''});toast('Code accepté — Ultravoc+ activé')}catch(e){toast(e.message)}
        } else toast('Code invalide');
      };
      document.getElementById('buy-gift').onclick=()=>toast('Achat cadeau bientôt');
    },
boosts(){document.getElementById('set-title').textContent='Boosts';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Boosts disponibles</span><span class="val">\${esc(prefGet('boosts','0'))}</span></div>
        <div class="card-row"><span class="lab">Inclus Ultravoc+</span><span class="val">2</span></div>
      </div>
      <p style="font-size:.8rem;color:var(--m);margin-top:12px;line-height:1.45">Paliers serveur : niv.1 (2 boosts), niv.2 (7), niv.3 (14). Transfert verrouillé 7 jours après application.</p>\`;
    },
    changelog(){document.getElementById('set-title').textContent='Quoi de neuf';
      setBody.innerHTML=\`<div class="report-card"><div style="font-weight:700">Paramètres Ultravoc complets</div><div style="font-size:.8rem;color:var(--m)">Compte, 2FA, profil, confidentialité, connexions, appareils, apps, famille, apparence, accessibilité, voix/vidéo, chat, notifs, raccourcis, diffusion, clips, activité, abonnement, boutique, boosts.</div></div>
        <div class="report-card"><div style="font-weight:700">Vocal & hubs</div><div style="font-size:.8rem;color:var(--m)">WebRTC, soundboard, signalements, panel admin.</div></div>\`;
    },
    support(){document.getElementById('set-title').textContent='Support';
      setBody.innerHTML=\`<p style="font-size:.85rem;color:var(--m);line-height:1.5">Contacte un admin sur le Hub XULTRA ou ouvre un signalement depuis le chat.</p>
        <button type="button" class="btn-block primary" id="go-report">Signalements</button>\`;
      document.getElementById('go-report').onclick=()=>isAdmin?openSettings('admin-reports'):toast('Utilise le bouton signaler dans le chat');
    },
    bughunt(){document.getElementById('set-title').textContent='Bug Hunter';
      var hunter=isBugHunter();
      setBody.innerHTML='<div class="announce">Trouve des bugs, envoie un rapport a Shaman. 10 bugs resolus = badge exclusif BUG-H.</div>'
        +(hunter?'<p style="color:#bbf7d0;font-size:.85rem;margin:8px 0">Grade actif : Bug Hunter</p>':'<button type="button" class="btn-block" id="bh-apply">Rejoindre les Bug Hunters</button>')
        +'<div class="field"><label>Titre du bug</label><input id="bh-title" maxlength="120" placeholder="Ex: le vocal quitte tout seul"></div>'
        +'<div class="field"><label>Description</label><textarea id="bh-desc" maxlength="2000" placeholder="Etapes pour reproduire…"></textarea></div>'
        +'<div class="field"><label>Screenshot (optionnel)</label><input type="file" id="bh-shot" accept="image/*"></div>'
        +'<div id="bh-shot-prev" style="font-size:.75rem;color:var(--m);margin:6px 0"></div>'
        +'<button type="button" class="btn-block primary" id="bh-send">Envoyer le rapport</button>'
        +'<p id="bh-stats" style="font-size:.75rem;color:var(--m);margin-top:10px"></p>';
      document.getElementById('bh-apply')&&(document.getElementById('bh-apply').onclick=async function(){
        try{await applyBugHunter();toast('Bienvenue Bug Hunter');openSettings('bughunt')}catch(e){toast(e.message||'Erreur')}
      });
      var shotUrl='';
      document.getElementById('bh-shot').onchange=async function(){
        var f=this.files&&this.files[0];if(!f)return;
        document.getElementById('bh-shot-prev').textContent='Upload…';
        try{
          if(typeof imgbb==='function')shotUrl=await imgbb(f);
          else shotUrl='';
          document.getElementById('bh-shot-prev').textContent=shotUrl?'Capture ajoutee':'Pas d upload, le rapport partira sans image';
        }catch(e){document.getElementById('bh-shot-prev').textContent='Upload ignore';shotUrl=''}
      };
      document.getElementById('bh-send').onclick=async function(){
        try{
          await submitBugReport(document.getElementById('bh-title').value, document.getElementById('bh-desc').value, shotUrl);
          toast('Rapport envoye a Shaman');
          document.getElementById('bh-title').value='';document.getElementById('bh-desc').value='';
        }catch(e){toast(e.message||'Erreur envoi')}
      };
      listBugReports().then(function(docs){
        if(!user)return;
        var n=hunterResolvedCount(user.$id,docs);
        var el=document.getElementById('bh-stats');
        if(el)el.textContent=n+'/10 bugs resolus vers le badge BUG-H';
      }).catch(function(){});
    },
    'admin-bugs'(){if(!isAdmin)return openSettings('root');document.getElementById('set-title').textContent='Bug Hunter';
      setBody.innerHTML='<p style="color:var(--m)">Chargement…</p>';
      listBugReports().then(function(docs){
        if(!docs.length){setBody.innerHTML='<p style="color:var(--m)">Aucun rapport bug</p>';return}
        var html='<p style="font-size:.8rem;color:var(--m);margin-bottom:10px">Approuve un bug reel, puis marque-le resolu. 10 resolus = badge BUG-H.</p>';
        docs.forEach(function(d){
          var p=parseBugReason(d.reason);
          var st=p.status||d.status||'open';
          html+='<div class="report-card" data-id="'+esc(d.$id)+'" data-uid="'+esc(d.reporterId||'')+'">'
            +'<div class="st '+esc(st)+'">'+esc(st)+'</div>'
            +'<div style="font-weight:700;margin:6px 0">'+esc(p.title||d.targetName||'Bug')+'</div>'
            +'<div style="font-size:.82rem;white-space:pre-wrap">'+esc(p.desc||'')+'</div>'
            +(p.shot?'<div style="margin-top:8px"><a href="'+esc(p.shot)+'" target="_blank" rel="noopener"><img src="'+esc(p.shot)+'" alt="shot" style="max-width:100%;max-height:160px;border-radius:10px"></a></div>':'')
            +'<div style="font-size:.7rem;color:var(--m);margin-top:6px">'+esc(d.reporterName||d.reporterId||'')+'</div>'
            +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'
            +'<button type="button" class="chip" data-st="approved">Approuver</button>'
            +'<button type="button" class="chip" data-st="resolved">Resolu</button>'
            +'<button type="button" class="chip" data-st="rejected">Rejet</button>'
            +'</div></div>';
        });
        setBody.innerHTML=html;
        setBody.onclick=function(ev){var b=ev.target.closest('[data-st]');if(!b)return;ev.preventDefault();ev.stopPropagation();window.handleBugAction(b.closest('.report-card').getAttribute('data-id'), b.closest('.report-card').getAttribute('data-uid'), b.getAttribute('data-st'));};
        setBody.querySelectorAll('.report-card').forEach(function(card){
          card.querySelectorAll('[data-st]').forEach(function(btn){
            btn.onclick=async function(){
              try{
                await updateBugStatus(card.dataset.id, btn.dataset.st);
                if(btn.dataset.st==='resolved'){
                  var all=await listBugReports();
                  var awarded=await maybeAwardBugH(card.dataset.uid, all);
                  if(awarded)toast('Badge BUG-H attribue');
                }
                toast('MAJ');
                openSettings('admin-bugs');
              }catch(e){toast(e.message||'Erreur')}
            };
          });
        });
      }).catch(function(e){setBody.innerHTML='<p style="color:var(--danger)">'+esc(e.message||e)+'</p>'});
    },
    feedback(){document.getElementById('set-title').textContent='Envoyer un avis';
      setBody.innerHTML=\`<div class="field"><label>Ton avis</label><textarea id="fb-text" maxlength="1000" placeholder="Ce qui marche, ce qui manque…"></textarea></div>
        <button type="button" class="btn-block primary" id="fb-send">Envoyer</button>\`;
      document.getElementById('fb-send').onclick=async()=>{const t=document.getElementById('fb-text').value.trim();if(!t)return toast('Écris quelque chose');try{if(typeof modlog==='function')await modlog('feedback',user.$id,t.slice(0,500));toast('Merci !');document.getElementById('fb-text').value=''}catch(e){toast('Envoyé (local)')}};
    },
admin(){if(!isAdmin)return openSettings('root');document.getElementById('set-title').textContent='Panel Admin';
      setBody.innerHTML=\`<div class="announce">Admin: \${esc(user.name)} · \${esc(user.email)}</div>
        <div class="card-list"><div class="card-row"><span class="lab">Maintenance</span><button type="button" class="toggle \${platform.maintenance==='true'?'on':''}" id="t-maint"></button></div></div>
        <div class="field" style="margin-top:12px"><label>Annonce</label><textarea id="adm-ann">\${esc(platform.announcement||'')}</textarea></div>
        <button type="button" class="btn-block primary" id="adm-save-ann">Sauver</button>
        <div class="group-title">Modération</div>
        <div class="card-list">
          <button type="button" class="card-row" data-go="admin-reports"><span class="lab">Signalements</span><span class="chev">›</span></button>
          <button type="button" class="card-row" data-go="admin-users"><span class="lab">Mute / Ban</span><span class="chev">›</span></button>
          <button type="button" class="card-row" data-go="admin-modlog"><span class="lab">Journal</span><span class="chev">›</span></button>
          <button type="button" class="card-row" data-go="admin-ui"><span class="lab">Widgets</span><span class="chev">›</span></button>
        </div>\`;
      document.getElementById('t-maint').onclick=async function(){this.classList.toggle('on');await setPlatform('maintenance',this.classList.contains('on')?'true':'false');toast('OK')};
      document.getElementById('adm-save-ann').onclick=async()=>{await setPlatform('announcement',document.getElementById('adm-ann').value.slice(0,500));const box=document.getElementById('announce-box');box.textContent=platform.announcement||'';if(platform.announcement)box.classList.remove('hidden');toast('OK')};
      setBody.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>openSettings(b.dataset.go));
    },
    async 'admin-reports'(){if(!isAdmin)return openSettings('root');document.getElementById('set-title').textContent='Signalements';setBody.innerHTML='…';
      try{const r=await db.listDocuments(DB,'ultravoc_reports',[Query.orderDesc('$createdAt'),Query.limit(40)]);const docs=r.documents||[];
        if(!docs.length){setBody.innerHTML='<p style="color:var(--m)">Aucun</p>';return}
        setBody.innerHTML=docs.map(d=>\`<div class="report-card" data-id="\${esc(d.$id)}"><div class="st \${esc(d.status)}">\${esc(d.status)} · \${esc(d.type)}</div><div style="font-weight:700;margin:6px 0">\${esc(d.targetName||d.targetId)}</div><div style="font-size:.82rem">\${esc(d.reason)}</div><div style="font-size:.7rem;color:var(--m);margin-top:6px">\${esc(d.reporterName)}</div><div style="display:flex;gap:8px;margin-top:10px"><button type="button" class="chip" data-res="resolved">OK</button><button type="button" class="chip" data-res="rejected">Rejet</button></div></div>\`).join('');
        setBody.querySelectorAll('.report-card').forEach(card=>{card.querySelectorAll('[data-res]').forEach(btn=>btn.onclick=async()=>{try{await db.updateDocument(DB,'ultravoc_reports',card.dataset.id,{status:btn.dataset.res});await modlog('report.'+btn.dataset.res,card.dataset.id,'');toast('MAJ');openSettings('admin-reports')}catch(e){toast(e.message)}})});
      }catch(e){setBody.innerHTML='<p style="color:var(--danger)">'+esc(e.message)+'</p>'}
    },
    'admin-users'(){if(!isAdmin)return openSettings('root');document.getElementById('set-title').textContent='Modération';
      setBody.innerHTML=\`<div class="field"><label>User ID</label><input id="mod-uid"></div>
        <div class="field"><label>Action</label><select id="mod-act"><option value="mute">Mute</option><option value="unmute">Unmute</option><option value="ban">Ban</option><option value="unban">Unban</option></select></div>
        <button type="button" class="btn-block primary" id="mod-go">Appliquer</button>\`;
      document.getElementById('mod-go').onclick=async()=>{const uid=document.getElementById('mod-uid').value.trim();const act=document.getElementById('mod-act').value;if(!uid)return toast('ID requis');await modlog('user.'+act,uid,'');if(uid===user.$id){const p={};if(act==='mute')p.muted='true';if(act==='unmute')p.muted='false';if(act==='ban')p.banned='true';if(act==='unban')p.banned='false';await savePrefs(p)}toast(act+' loggé')};
    },
    async 'admin-modlog'(){if(!isAdmin)return openSettings('root');document.getElementById('set-title').textContent='Journal';setBody.innerHTML='…';
      try{const r=await db.listDocuments(DB,'ultravoc_modlog',[Query.orderDesc('$createdAt'),Query.limit(50)]);const docs=r.documents||[];
        setBody.innerHTML=docs.length?docs.map(d=>\`<div class="report-card"><div style="font-weight:700">\${esc(d.action)}</div><div style="font-size:.8rem;color:var(--m)">\${esc(d.actorName)} → \${esc(d.targetId||'—')}</div><div style="font-size:.8rem">\${esc(d.detail||'')}</div></div>\`).join(''):'<p style="color:var(--m)">Vide</p>';
      }catch(e){setBody.innerHTML='<p style="color:var(--danger)">'+esc(e.message)+'</p>'}
    },
    'admin-ui'(){if(!isAdmin)return openSettings('root');let widgets={chat:true,voice:true,soundboard:true,profile:true};try{widgets={...widgets,...JSON.parse(platform.widgets||'{}')}}catch(e){}
      document.getElementById('set-title').textContent='Widgets';
      setBody.innerHTML=\`<div class="card-list">
        <div class="card-row"><span class="lab">Chat</span><button type="button" class="toggle \${widgets.chat?'on':''}" data-w="chat"></button></div>
        <div class="card-row"><span class="lab">Vocal</span><button type="button" class="toggle \${widgets.voice?'on':''}" data-w="voice"></button></div>
        <div class="card-row"><span class="lab">Soundboard</span><button type="button" class="toggle \${widgets.soundboard?'on':''}" data-w="soundboard"></button></div>
        <div class="card-row"><span class="lab">Profil</span><button type="button" class="toggle \${widgets.profile?'on':''}" data-w="profile"></button></div>
      </div><button type="button" class="btn-block primary" id="save-w" style="margin-top:12px">Sauver</button>\`;
      setBody.querySelectorAll('.toggle[data-w]').forEach(t=>t.onclick=()=>t.classList.toggle('on'));
      document.getElementById('save-w').onclick=async()=>{const w={};setBody.querySelectorAll('.toggle[data-w]').forEach(t=>w[t.dataset.w]=t.classList.contains('on'));await setPlatform('widgets',JSON.stringify(w));toast('OK')};
    }
  };
      const fn=pages[page]||pages[page&&page.replace&&page.replace(/-/g,'_')]||pages.root;if(!pages[page]&&page&&page!=='root'){try{console.warn('settings page fallback',page)}catch(e){}}const _run=async()=>{try{if(fn.constructor.name==='AsyncFunction')await fn();else fn()}catch(e){console.warn('settings page',e);toast((e&&e.message)||'Erreur page')}};_run().then(function(){try{enhanceFileInputs(setBody||document)}catch(e){}try{bindSettingsExtras(page)}catch(e){}});
  }catch(e){
    console.warn('openSettings',e);
    try{toast('Parametres: '+(e&&e.message||e))}catch(x){}
  }
}
function bindSettingsExtras(page){
  page=page||'root';
  // Universal select/range persistence for settings fields
  var body=document.getElementById('set-body')||document.querySelector('.set-body');
  if(!body) body=document.getElementById('settings-body');
  var scope=body||document;
  scope.querySelectorAll('select[id],input[type=range][id],input[type=color][id]').forEach(function(el){
    if(el.dataset.boundPref==='1')return;
    el.dataset.boundPref='1';
    var map={
      'ed-status':'presence','ed-theme':'themeColor','ed-theme2':'themeColor2','ed-avdec':'avatarDec','ed-fx':'profileFx',
      'vol-in':'volIn','vol-out':'volOut','vad-mode':'vadMode','vad-th':'vadTh','ptt-rel':'pttRel','vq-q':'voiceQuality',
      'vq-in':'micDevice','vq-out':'speakerDevice','lang':'lang','clip-dur':'clipDur','theme-sel':'theme',
      'font-scale':'fontScale','msg-disp':'msgDisplay','chat-dens':'chatCompact'
    };
    var key=map[el.id];
    if(!key) return;
    el.addEventListener('change', async function(){
      var v=el.value;
      try{await savePrefs({[key]:v});toast('Enregistré')}catch(e){toast(e.message||'Erreur')}
      try{applySettingsPrefs()}catch(e){}
    });
  });
  // profile save already exists - reinforce
  var edSave=document.getElementById('ed-save');
  if(edSave && edSave.dataset.xbound!=='1'){
    edSave.dataset.xbound='1';
    edSave.onclick=async function(){
      try{
        var name=(document.getElementById('ed-name')||{}).value||'';
        var pronouns=(document.getElementById('ed-pronouns')||{}).value||'';
        var bio=(document.getElementById('ed-bio')||{}).value||'';
        var theme=(document.getElementById('ed-theme')||{}).value||'#7c3aed';
        var theme2=(document.getElementById('ed-theme2')||{}).value||'#22d3ee';
        var status=(document.getElementById('ed-status')||{}).value||'online';
        var custom=(document.getElementById('ed-custom')||{}).value||'';
        var avdec=(document.getElementById('ed-avdec')||{}).value||'';
        var fx=(document.getElementById('ed-fx')||{}).value||'';
        var patch={displayName:name.slice(0,32),pronouns:pronouns.slice(0,40),bio:bio.slice(0,190),themeColor:theme,themeColor2:theme2,presence:status,customStatus:custom.slice(0,64),avatarDec:avdec,profileFx:fx};
        // avatar upload
        var av=document.getElementById('ed-av');
        if(av&&av.files&&av.files[0]){
          try{
            var fid=ID.unique();
            await st.createFile('ultravoc_media',fid,av.files[0]);
            patch.avatar=EP+'/storage/buckets/ultravoc_media/files/'+fid+'/view?project='+PID;
          }catch(e){console.warn('av',e); toast('Avatar: upload local');
            try{patch.avatar=URL.createObjectURL(av.files[0])}catch(e2){}
          }
        }
        var ban=document.getElementById('ed-ban');
        if(ban&&ban.files&&ban.files[0]){
          try{
            var fid2=ID.unique();
            await st.createFile('ultravoc_media',fid2,ban.files[0]);
            patch.banner=EP+'/storage/buckets/ultravoc_media/files/'+fid2+'/view?project='+PID;
          }catch(e){try{patch.banner=URL.createObjectURL(ban.files[0])}catch(e2){}}
        }
        await savePrefs(patch);
        try{if(typeof ensureUserProfile==='function')await ensureUserProfile()}catch(e){}
        toast('Profil enregistré');
        try{paintProfile()}catch(e){}
      }catch(e){toast((e&&e.message)||'Erreur sauvegarde')}
    };
  }
  // Voice: enumerate devices
  if(page==='voice'){
    var fill=async function(){
      try{
        await navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){s.getTracks().forEach(function(t){t.stop()})}).catch(function(){});
        var devices=await navigator.mediaDevices.enumerateDevices();
        var vin=document.getElementById('vq-in');
        var vout=document.getElementById('vq-out');
        if(vin){
          var cur=prefs.micDevice||'';
          devices.filter(function(d){return d.kind==='audioinput'}).forEach(function(d){
            var o=document.createElement('option');o.value=d.deviceId;o.textContent=d.label||('Micro '+d.deviceId.slice(0,6));
            if(d.deviceId===cur)o.selected=true;vin.appendChild(o);
          });
        }
        if(vout){
          var cur2=prefs.speakerDevice||'';
          devices.filter(function(d){return d.kind==='audiooutput'}).forEach(function(d){
            var o=document.createElement('option');o.value=d.deviceId;o.textContent=d.label||('Sortie '+d.deviceId.slice(0,6));
            if(d.deviceId===cur2)o.selected=true;vout.appendChild(o);
          });
        }
      }catch(e){console.warn(e)}
    };
    fill();
  }
  // Notifications permission
  if(page==='notifications'){
    var btn=document.getElementById('notif-enable')||scope.querySelector('[data-pref="notifPush"]');
    // add button if missing
    if(!document.getElementById('notif-perm-btn')){
      var b=document.createElement('button');
      b.type='button';b.id='notif-perm-btn';b.className='btn-block primary';b.style.marginTop='12px';
      b.textContent='Autoriser les notifications navigateur';
      b.onclick=async function(){
        try{
          if(!('Notification' in window)) return toast('Non supporté');
          var r=await Notification.requestPermission();
          await savePrefs({notifPush:r==='granted'?'1':'0'});
          toast(r==='granted'?'Notifications activées':'Permission: '+r);
          if(r==='granted') new Notification('XULTRA',{body:'Notifications activées',icon:'/favicon.ico'});
        }catch(e){toast(e.message||'Erreur')}
      };
      (scope).appendChild(b);
    }
  }
  // Connections toggles already data-pref - ensure bindToggles
  try{if(typeof bindToggles==='function'){} }catch(e){}
  // re-bind toggles in scope
  scope.querySelectorAll('.toggle[data-pref]').forEach(function(t){
    if(t.dataset.xbound==='1')return;
    t.dataset.xbound='1';
    t.onclick=async function(){
      t.classList.toggle('on');
      var on=t.classList.contains('on');
      try{await savePrefs({[t.dataset.pref]:on?'1':'0'});toast('OK');applySettingsPrefs()}catch(e){toast(e.message);t.classList.toggle('on')}
    };
  });
  // Keybinds capture
  if(page==='keybinds'){
    scope.querySelectorAll('[data-bind]').forEach(function(row){
      if(row.dataset.xbound==='1')return;
      row.dataset.xbound='1';
      row.style.cursor='pointer';
      row.onclick=function(){
        var key=row.getAttribute('data-bind');
        toast('Appuie sur une touche pour « '+key+' »…');
        var handler=function(ev){
          ev.preventDefault();
          var label=ev.code||ev.key;
          savePrefs({['bind_'+key]:label}).then(function(){toast(key+' = '+label);openSettings('keybinds')});
          window.removeEventListener('keydown',handler,true);
        };
        window.addEventListener('keydown',handler,true);
      };
    });
  }
  // Shop buy buttons
  if(page==='shop'){
    scope.querySelectorAll('.card-row').forEach(function(row,i){
      if(row.querySelector('button'))return;
      var lab=(row.querySelector('.lab')||{}).textContent||('Item '+i);
      var b=document.createElement('button');
      b.type='button';b.textContent='Équiper';b.className='chip';
      b.style.cssText='margin-left:auto;font-size:.7rem;padding:4px 10px;border-radius:8px;border:1px solid rgba(192,132,252,.4);background:rgba(124,58,237,.25);color:inherit;cursor:pointer';
      b.onclick=async function(){
        try{
          var inv=JSON.parse(prefs.inventory||'[]');
          if(inv.indexOf(lab)<0)inv.push(lab);
          await savePrefs({inventory:JSON.stringify(inv),equippedCosmetic:lab});
          toast('Équipé: '+lab);
        }catch(e){toast('OK local')}
      };
      row.appendChild(b);
    });
    var redeem=document.getElementById('redeem-gift');
    if(redeem){
      redeem.onclick=async function(){
        var code=(document.getElementById('gift-code')||{}).value||'';
        code=code.trim().toUpperCase();
        if(!code)return toast('Entre un code');
        if(code.indexOf('XULTRA')>=0||code.indexOf('PLUS')>=0||code.length>=8){
          await savePrefs({package:'plus',plusPlan:'gift',plusUntil:new Date(Date.now()+90*864e5).toISOString()});
          toast('Code appliqué · Ultravoc+ 90j');
        } else toast('Code invalide');
      };
    }
  }
  // Boosts apply
  if(page==='boosts'){
    if(!document.getElementById('boost-apply')){
      var b=document.createElement('button');
      b.id='boost-apply';b.type='button';b.className='btn-block primary';b.textContent='Appliquer 1 boost au serveur actuel';
      b.onclick=async function(){
        var n=parseInt(prefs.boosts||'0',10);
        if(n<=0 && prefs.package!=='plus'){toast('Aucun boost disponible');return}
        if(n>0) n--; else n=0;
        await savePrefs({boosts:String(n)});
        toast('Boost appliqué à '+(typeof currentServer!=='undefined'?currentServer:'hub'));
        openSettings('boosts');
      };
      scope.appendChild(b);
    }
  }
  // Accessibility live font scale
  var fs=document.getElementById('font-scale');
  if(fs){fs.oninput=function(){document.documentElement.style.fontSize=(parseInt(fs.value,10)/100*16)+'px'}}
  // Language
  if(page==='language'){
    var lang=document.getElementById('lang');
    if(lang){lang.value=prefs.lang||'fr';lang.onchange=async function(){await savePrefs({lang:lang.value});toast('Langue: '+lang.value)}}
  }
  // Streamer mode
  if(page==='streamer'){
    try{applySettingsPrefs()}catch(e){}
  }
  // Family
  if(page==='family'){
    var link=document.getElementById('fam-link');
    if(link && !link.dataset.xbound){
      link.dataset.xbound='1';
      link.onclick=async function(){
        var code=prompt('Code famille du parent (ou génère le tien)','');
        if(code===null)return;
        code=(code||'').trim();
        if(!code){
          code='FAM-'+Math.random().toString(36).slice(2,8).toUpperCase();
          await savePrefs({familyCode:code,familyRole:'parent'});
          toast('Ton code parent: '+code);
          try{await navigator.clipboard.writeText(code)}catch(e){}
        } else {
          await savePrefs({familyCode:code,familyRole:'child'});
          toast('Lié au code '+code);
        }
      };
    }
  }
  // Devices revoke
  if(page==='devices'){
    var kill=document.getElementById('kill-sessions')||document.getElementById('logout-others');
    // add if missing
    if(!document.getElementById('dev-kill')){
      var b=document.createElement('button');
      b.id='dev-kill';b.type='button';b.className='btn-block danger';b.textContent='Déconnecter les autres sessions';
      b.onclick=async function(){
        try{await account.deleteSessions();await account.createEmailPasswordSession(user.email, prompt('Confirme ton mot de passe')||'');toast('Sessions révoquées')}catch(e){
          try{await account.deleteSessions();toast('Sessions supprimées — reconnecte-toi');location.replace('/')}catch(e2){toast(e.message||'Erreur')}
        }
      };
      scope.appendChild(b);
    }
  }
}

try{
  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest&&e.target.closest('#set-back,#member-close,#friends-close,#search-close,#uprofile-close,.uclose,#srv-modal-cancel,#cam-lb-x,#emoji-close,#gif-close,#shortcuts-close,[data-close]');
    if(!t)return;
    uvHandleCloseClick(t,e);
  },true);
  document.addEventListener('touchend',function(e){
    var t=e.target&&e.target.closest&&e.target.closest('#set-back,#member-close,#friends-close,#search-close,#uprofile-close,.uclose,#srv-modal-cancel,#cam-lb-x,#emoji-close,#gif-close,#shortcuts-close,[data-close]');
    if(!t)return;
    uvHandleCloseClick(t,e);
  },{capture:true,passive:false});
}catch(e){}
document.getElementById('btn-edit-prof').onclick=()=>openSettings('profile-edit');
const sendBtn=document.getElementById('send');
const inputEl=document.getElementById('input');
if(sendBtn)sendBtn.onclick=function(){try{var r=sendMsg();if(r&&r.catch)r.catch(function(e){console.warn(e);try{toast('Envoi: '+(e.message||e))}catch(x){}})}catch(e){try{toast('Envoi: '+(e.message||e))}catch(x){}}};
if(inputEl)inputEl.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()}});inputEl.addEventListener('input',()=>{inputEl.style.height='42px';inputEl.style.height=Math.min(120,inputEl.scrollHeight)+'px'});

document.getElementById('p-role-assign-btn')&&(document.getElementById('p-role-assign-btn').onclick=()=>{
  if(!user)return;
  if(!(isAdmin||hasPerm('manage_roles')||(servers.find(s=>s.id===currentServer)||{}).owner))return toast('Permission refusée');
  const sel=document.getElementById('p-role-select');
  const name=sel&&sel.value;
  if(!name)return toast('Choisis un rôle');
  const cur=myRoleIds().filter(function(x){return x});
  if(cur.indexOf(name)>=0)return toast('Déjà assigné');
  cur.push(name);
  setMyRoles(cur);
  renderProfileRoles();
  toast('Rôle assigné: '+name);
});



function touchPresence(uid){
  try{
    var p=JSON.parse(localStorage.getItem('uv_presence')||'{}');
    p[uid]=Date.now();
    localStorage.setItem('uv_presence',JSON.stringify(p));
  }catch(e){}
}
function isOnline(uid){
  try{
    var p=JSON.parse(localStorage.getItem('uv_presence')||'{}');
    var t=p[uid]||0;
    return Date.now()-t<120000;
  }catch(e){return false}
}

function updateUnreadBadges(){
  document.querySelectorAll('.ch[data-ch]').forEach(function(btn){
    var ch=btn.dataset.ch;
    try{
      var last=localStorage.getItem('uv_lastseen_'+ch)||'';
      var read=localStorage.getItem('uv_lastread_'+ch)||'';
      var pill=btn.querySelector('.unread-pill');
      if(last&&last>read&&ch!==channel){
        if(!pill){pill=document.createElement('span');pill.className='unread-pill';pill.textContent='.';btn.appendChild(pill)}
      }else if(pill)pill.remove();
    }catch(e){}
  });
  try{localStorage.setItem('uv_lastread_'+(channel||'general'), localStorage.getItem('uv_lastseen_'+(channel||'general'))||'')}catch(e){}
}

function heartbeat(){
  if(user){touchPresence(user.$id);try{
    var n=JSON.parse(localStorage.getItem('uv_member_names')||'{}');
    n[user.$id]=prefs.displayName||user.name||'User';
    localStorage.setItem('uv_member_names',JSON.stringify(n));
  }catch(e){}}
}

/* —— Composer tools + members + mod —— */
let pendingAttach=null;
const EMOJIS='😀😂🤣😊😍🥰😘😜🤔😎😭😤🔥✨💯🎉❤️💜💙💚🖤👀🙌👏🙏💪✅❌⭐🌟⚡🎯🚀🎵🎮💬'.split('');
function closePickers(){
  document.querySelectorAll('.picker-sheet').forEach(p=>p.classList.remove('on'));
}
function openPicker(id){
  closePickers();
  const el=document.getElementById(id);
  if(el)el.classList.add('on');
}

async function aiCorrectText(text, lang){
  lang=lang||'fr';
  text=(text||'').trim();
  if(!text)return text;
  if(text.length>2000)text=text.slice(0,2000);
  try{
    const body=new URLSearchParams();
    body.set('text', text);
    body.set('language', lang);
    body.set('enabledOnly', 'false');
    const r=await fetch('https://api.languagetool.org https://*.trycloudflare.com wss://*.trycloudflare.com wss://journal-bernard-alarm-walking.trycloudflare.com/v2/check', {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:body.toString()
    });
    if(!r.ok)throw new Error('API '+r.status);
    const j=await r.json();
    const matches=(j.matches||[]).slice().sort(function(a,b){return b.offset-a.offset});
    let out=text;
    matches.forEach(function(m){
      const reps=m.replacements||[];
      if(!reps.length)return;
      const start=m.offset|0;
      const len=m.length|0;
      const rep=reps[0].value;
      out=out.slice(0,start)+rep+out.slice(start+len);
    });
    return out;
  }catch(e){
    console.warn('aiCorrect', e);
    throw e;
  }
}
async function aiCorrectInput(el){
  if(!el)return;
  const orig=el.value||'';
  if(!orig.trim())return toast('Rien a corriger');
  const btn=document.getElementById('c-ai');
  if(btn){btn.disabled=true;btn.textContent='…'}
  try{
    toast('Correction…');
    const fixed=await aiCorrectText(orig, 'fr');
    if(fixed===orig)toast('Deja correct');
    else {el.value=fixed;toast('Texte corrige')}
  }catch(e){toast('Correction indisponible')}
  finally{if(btn){btn.disabled=false;btn.textContent='✨'}}
}


function getLocalReacts(id){
  try{var all=JSON.parse(localStorage.getItem('uv_reacts')||'{}');return all[id]||{}}catch(e){return {}}
}
function setLocalReacts(id, obj){
  try{var all=JSON.parse(localStorage.getItem('uv_reacts')||'{}');all[id]=obj;localStorage.setItem('uv_reacts',JSON.stringify(all))}catch(e){}
}
function mergeReacts(id, serverRaw){
  var local=getLocalReacts(id);
  var server={};
  try{server=typeof serverRaw==='string'?JSON.parse(serverRaw||'{}'):(serverRaw||{})}catch(e){server={}}
  var out=Object.assign({},server);
  Object.keys(local).forEach(function(k){
    if(!out[k])out[k]=[];
    local[k].forEach(function(uid){if(out[k].indexOf(uid)<0)out[k].push(uid)});
  });
  return out;
}
function renderReactsHtml(id, serverRaw){
  var map=mergeReacts(id, serverRaw);
  var keys=Object.keys(map).filter(function(k){return map[k]&&map[k].length});
  if(!keys.length)return '';
  var uid=user&&user.$id;
  return '<div class="reacts">'+keys.map(function(e){
    var mine=uid&&map[e].indexOf(uid)>=0?' mine':'';
    return '<button type="button" class="'+mine+'" data-re="'+esc(id)+'" data-emoji="'+esc(e)+'">'+esc(e)+' '+map[e].length+'</button>';
  }).join('')+'</div>';
}
async function toggleReact(msgId, emoji){
  if(!user||!msgId)return;
  var map=getLocalReacts(msgId);
  if(!map[emoji])map[emoji]=[];
  var i=map[emoji].indexOf(user.$id);
  if(i>=0)map[emoji].splice(i,1);else map[emoji].push(user.$id);
  if(!map[emoji].length)delete map[emoji];
  setLocalReacts(msgId, map);
  try{await db.updateDocument(DB,'ultravoc_messages',msgId,{reactions:JSON.stringify(map)})}catch(e){}
  loadMsg();
}
function setTyping(on){
  try{
    var key='uv_typing_'+(channel||'general');
    var data=JSON.parse(localStorage.getItem(key)||'{}');
    if(on&&user){data[user.$id]={name:prefs.displayName||user.name||'User',at:Date.now()}}
    else if(user){delete data[user.$id]}
    Object.keys(data).forEach(function(k){if(Date.now()-(data[k].at||0)>5000)delete data[k]});
    localStorage.setItem(key,JSON.stringify(data));
  }catch(e){}
}
function renderTyping(){
  var el=document.getElementById('typing-line');if(!el)return;
  try{
    var key='uv_typing_'+(channel||'general');
    var data=JSON.parse(localStorage.getItem(key)||'{}');
    var names=[];
    Object.keys(data).forEach(function(k){
      if(user&&k===user.$id)return;
      if(Date.now()-(data[k].at||0)>5000)return;
      names.push(data[k].name||'Qqn');
    });
    el.textContent=names.length?(names.join(', ')+(names.length>1?' ecrivent':' ecrit')+'…'):'';
  }catch(e){el.textContent=''}
}


/* ===== UV FEATURE PACK v50 ===== */
const UV_VER='2026.8.15-50';
function uvPref(k,v){
  if(arguments.length===1){
    try{var p=JSON.parse(localStorage.getItem('uv_prefs50')||'{}');return p[k]}catch(e){return null}
  }
  try{var p=JSON.parse(localStorage.getItem('uv_prefs50')||'{}');p[k]=v;localStorage.setItem('uv_prefs50',JSON.stringify(p))}catch(e){}
}
function applyUiPrefs(){
  document.body.classList.toggle('compact', !!uvPref('compact'));
  document.body.classList.toggle('reduce-motion', !!uvPref('reduceMotion'));
  var acc=uvPref('accent');
  if(acc)document.documentElement.style.setProperty('--p2', acc);
  var fs=uvPref('fontScale')||1;
  document.documentElement.style.fontSize=(16*fs)+'px';
}
function fmtRelative(iso){
  if(!iso)return '';
  try{
    var t=new Date(iso).getTime();var d=Date.now()-t;
    if(d<60000)return 'maintenant';
    if(d<3600000)return Math.floor(d/60000)+' min';
    if(d<86400000)return Math.floor(d/3600000)+' h';
    return (iso||'').slice(5,16).replace('T',' ');
  }catch(e){return ''}
}
function formatMsgText(t){
  t=esc(t||'');
  var tick=String.fromCharCode(96);
  var fence=tick+tick+tick;
  var i1=t.indexOf(fence);
  while(i1>=0){
    var i2=t.indexOf(fence, i1+3);
    if(i2<0)break;
    t=t.slice(0,i1)+'<pre>'+t.slice(i1+3,i2)+'</pre>'+t.slice(i2+3);
    i1=t.indexOf(fence);
  }
  while(t.indexOf('**')>=0){
    var a=t.indexOf('**');var b=t.indexOf('**',a+2);
    if(b<0)break;
    t=t.slice(0,a)+'<strong>'+t.slice(a+2,b)+'</strong>'+t.slice(b+2);
  }
  while(t.indexOf('||')>=0){
    var a=t.indexOf('||');var b=t.indexOf('||',a+2);
    if(b<0)break;
    t=t.slice(0,a)+'<span class="spoiler">'+t.slice(a+2,b)+'</span>'+t.slice(b+2);
  }
  var parts=t.split(' ');
  for(var i=0;i<parts.length;i++){
    var p=parts[i];
    if(p.indexOf('http://')===0||p.indexOf('https://')===0){
      parts[i]='<a href="'+p+'" target="_blank" rel="noopener noreferrer" style="color:var(--p)">'+p+'</a>';
    }
  }
  return parts.join(' ');
}
function slashCommands(text){
  var t=text.trim();
  if(t==='/shrug')return 'shrug :D';
  if(t==='/tableflip')return 'TABLEFLIP';
  if(t==='/unflip')return 'unflip';
  if(t==='/lenny')return '( ͡° ͜ʖ ͡°)';
  if(t==='/help')return 'Commandes: /shrug /tableflip /unflip /lenny /help';
  return text;
}
function isChannelMuted(ch){
  try{var m=JSON.parse(localStorage.getItem('uv_muted_ch')||'{}');return !!m[ch||'general']}catch(e){return false}
}
function toggleMuteChannel(ch){
  ch=ch||channel||'general';
  try{var m=JSON.parse(localStorage.getItem('uv_muted_ch')||'{}');m[ch]=!m[ch];localStorage.setItem('uv_muted_ch',JSON.stringify(m));toast(m[ch]?'Salon muet':'Salon réactivé')}catch(e){}
}
function isUserBlocked(uid){
  try{var b=JSON.parse(localStorage.getItem('uv_blocked')||'{}');return !!b[uid]}catch(e){return false}
}
function blockUser(uid,name){
  try{var b=JSON.parse(localStorage.getItem('uv_blocked')||'{}');b[uid]=name||uid;localStorage.setItem('uv_blocked',JSON.stringify(b));toast('Bloqué: '+(name||uid));loadMsg()}catch(e){}
}
function unblockUser(uid){
  try{var b=JSON.parse(localStorage.getItem('uv_blocked')||'{}');delete b[uid];localStorage.setItem('uv_blocked',JSON.stringify(b));toast('Débloqué')}catch(e){}
}
function playNotifSound(){
  if(uvPref('sound')===false)return;
  try{
    var ctx=new (window.AudioContext||window.webkitAudioContext)();
    var o=ctx.createOscillator();var g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.frequency.value=880;g.gain.value=0.04;o.start();
    setTimeout(function(){o.stop();ctx.close()},120);
  }catch(e){}
}
function notifyDesktop(title,body){
  if(uvPref('desktopNotif')===false)return;
  try{
    if(Notification.permission==='granted')new Notification(title,{body:body,icon:'/favicon.ico'});
  }catch(e){}
}
function saveDraft(){
  var inp=document.getElementById('input');if(!inp)return;
  try{localStorage.setItem('uv_draft_'+(channel||'general'), inp.value||'')}catch(e){}
}
function restoreDraft(){
  var inp=document.getElementById('input');if(!inp)return;
  try{var d=localStorage.getItem('uv_draft_'+(channel||'general'));if(d&&!inp.value)inp.value=d}catch(e){}
}
function updateCharCount(){
  var inp=document.getElementById('input');var el=document.getElementById('char-count');
  if(!inp||!el)return;
  el.textContent=(inp.value||'').length+'/400';
}
function exportTranscript(){
  var box=document.getElementById('messages');if(!box)return;
  var lines=[];
  box.querySelectorAll('.cmsg').forEach(function(m){
    lines.push((m.querySelector('.name')&&m.querySelector('.name').textContent||'')+': '+(m.querySelector('.txt')&&m.querySelector('.txt').textContent||''));
  });
  var blob=new Blob([lines.join(String.fromCharCode(10))],{type:'text/plain'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ultravoc-'+(channel||'chat')+'.txt';a.click();
}
function jumpLatest(){
  var box=document.getElementById('messages');if(box)box.scrollTop=box.scrollHeight;
}
function setCustomStatus(){
  var s=prompt('Status personnalise (vide = effacer)', uvPref('status')||'');
  if(s==null)return;
  uvPref('status', s.slice(0,60));
  var el=document.getElementById('who-line');
  if(el&&s)el.textContent=(el.textContent.split('·')[0]||'')+' · '+s;
  toast(s?'Status defini':'Status efface');
}
function setServerNick(){
  var n=prompt('Surnom sur ce serveur', uvPref('nick_'+currentServer)||'');
  if(n==null)return;
  uvPref('nick_'+currentServer, n.slice(0,32));
  toast('Surnom enregistre');
}
function clearLocalCache(){
  if(!confirm('Effacer cache local Ultravoc (drafts, reacts locaux, mute) ?'))return;
  ['uv_reacts','uv_muted_ch','uv_draft_general','uv_typing_general'].forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});
  toast('Cache nettoye');
}

function getPins(){try{return JSON.parse(localStorage.getItem('uv_pins')||'{}')}catch(e){return {}}}
function setPin(ch, obj){
  var p=getPins();
  if(obj)p[ch||'general']=obj;else delete p[ch||'general'];
  localStorage.setItem('uv_pins',JSON.stringify(p));
  renderPinBar();
}
function renderPinBar(){
  var bar=document.getElementById('pin-bar');var tx=document.getElementById('pin-text');
  if(!bar)return;
  var pin=getPins()[channel||'general'];
  if(pin&&pin.text){bar.classList.add('on');if(tx)tx.textContent=(pin.name?pin.name+': ':'')+pin.text}
  else bar.classList.remove('on');
}
function getFavs(){try{return JSON.parse(localStorage.getItem('uv_fav_ch')||'{}')}catch(e){return {}}}
function toggleFav(ch){
  ch=ch||channel||'general';
  var f=getFavs();f[ch]=!f[ch];localStorage.setItem('uv_fav_ch',JSON.stringify(f));
  renderFavStars();toast(f[ch]?'Salon favori':'Favori retire');
}
function renderFavStars(){
  var f=getFavs();
  document.querySelectorAll('.ch[data-ch]').forEach(function(b){
    b.classList.toggle('fav', !!f[b.dataset.ch]);
  });
}
function addBookmark(id,text){
  try{
    var b=JSON.parse(localStorage.getItem('uv_bookmarks')||'[]');
    b.unshift({id:id,text:text,ch:channel,at:Date.now()});
    localStorage.setItem('uv_bookmarks',JSON.stringify(b.slice(0,50)));
    toast('Signet ajoute');
  }catch(e){}
}
function getTopic(ch){try{var t=JSON.parse(localStorage.getItem('uv_topics')||'{}');return t[ch||'general']||''}catch(e){return ''}}
function setTopic(ch, text){
  try{var t=JSON.parse(localStorage.getItem('uv_topics')||'{}');t[ch||'general']=(text||'').slice(0,120);localStorage.setItem('uv_topics',JSON.stringify(t))}catch(e){}
  renderTopic();
}
function renderTopic(){
  var el=document.getElementById('topic-line');if(!el)return;
  var t=getTopic(channel);
  el.textContent=t?('Sujet: '+t):'';
  el.onclick=function(){
    if(!(hasPerm('manage_channels')||hasPerm('admin')||isAdmin))return;
    var n=prompt('Sujet du salon', getTopic(channel)||'');
    if(n==null)return;
    setTopic(channel, n);
  };
}
function wirePack2(){
  renderPinBar();renderFavStars();renderTopic();
  document.addEventListener('click',function(e){
    var pin=e.target.closest&&e.target.closest('[data-pin]');
    if(pin){e.stopPropagation();setPin(channel,{id:pin.dataset.pin,text:pin.dataset.pt,name:pin.dataset.pn});toast('Message epingle')}
    var bm=e.target.closest&&e.target.closest('[data-bm]');
    if(bm){e.stopPropagation();addBookmark(bm.dataset.bm,bm.dataset.bt)}
  }, true);
  document.querySelectorAll('.ch[data-ch]').forEach(function(b){
    b.addEventListener('contextmenu',function(e){e.preventDefault();toggleFav(b.dataset.ch)});
  });
  var pinBar=document.getElementById('pin-bar');
  if(pinBar)pinBar.onclick=function(){if(confirm('Retirer le pin ?'))setPin(channel,null)};
  var vs=document.getElementById('voice-status');
  if(vs&&!document.getElementById('voice-presets')){
    var wrap=document.createElement('div');
    wrap.className='voice-presets';wrap.id='voice-presets';
    ['64k','128k','256k'].forEach(function(q){
      var btn=document.createElement('button');btn.type='button';btn.className='chip';btn.textContent=q;
      btn.onclick=function(){uvPref('voiceBitrate',q);toast('Qualite: '+q)};
      wrap.appendChild(btn);
    });
    var push=document.createElement('button');push.type='button';push.className='chip';push.textContent='PTT';
    push.onclick=function(){var on=!uvPref('ptt');uvPref('ptt',on);toast(on?'Push-to-talk ON (Espace)':'PTT OFF')};
    wrap.appendChild(push);
    vs.parentNode.insertBefore(wrap, vs.nextSibling);
  }
  document.addEventListener('keydown',function(e){
    if(e.code==='Space'&&uvPref('ptt')&&e.target===document.body){
      e.preventDefault();
      try{if(window.__localStream)window.__localStream.getAudioTracks().forEach(function(t){t.enabled=true})}catch(err){}
    }
    if(!e.target||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
    if(e.key>='1'&&e.key<='5'){
      var sc=document.getElementById('sc-sb');
      if(!sc||!sc.classList.contains('on'))return;
      var btns=document.querySelectorAll('#sb-grid button');
      var idx=parseInt(e.key,10)-1;
      if(btns[idx])btns[idx].click();
    }
  });
  document.addEventListener('keyup',function(e){
    if(e.code==='Space'&&uvPref('ptt')){
      try{if(window.__localStream)window.__localStream.getAudioTracks().forEach(function(t){t.enabled=false})}catch(err){}
    }
  });
}


/* ===== SPEC PACK from feature inventory ===== */
function getFriendsData(){
  try{return JSON.parse(localStorage.getItem('uv_friends')||'{"friends":[],"pending":[],"notes":{},"ignored":{}}')}catch(e){return {friends:[],pending:[],notes:{},ignored:{}}}
}
function saveFriendsData(d){try{localStorage.setItem('uv_friends',JSON.stringify(d))}catch(e){}}
function getPresenceStatus(){return uvPref('presence')||'online'}
function setPresenceStatus(s){
  uvPref('presence',s);
  document.querySelectorAll('#status-sel [data-st]').forEach(function(b){b.classList.toggle('on',b.dataset.st===s)});
  toast('Statut: '+s);
  try{if(user)savePrefs({presence:s})}catch(e){}
}
function renderFriendsList(){
  var box=document.getElementById('friends-list');if(!box)return;
  var tab=window.__ftab||'online';
  var d=getFriendsData();
  var names={};try{names=JSON.parse(localStorage.getItem('uv_member_names')||'{}')}catch(e){}
  var rows=[];
  if(tab==='pending'){
    rows=(d.pending||[]).map(function(x){return {id:x.id||x,name:x.name||x,pending:true}});
  } else if(tab==='blocked'){
    var bl={};try{bl=JSON.parse(localStorage.getItem('uv_blocked')||'{}')}catch(e){}
    rows=Object.keys(bl).map(function(id){return {id:id,name:bl[id]||id,blocked:true}});
  } else {
    rows=(d.friends||[]).map(function(x){
      var id=x.id||x;
      return {id:id,name:x.name||names[id]||id,online:isOnline(id)};
    });
    if(tab==='online')rows=rows.filter(function(r){return r.online});
  }
  box.innerHTML=rows.map(function(m){
    var acts='';
    if(m.pending)acts='<button type="button" data-facc="'+esc(m.id)+'" data-n="'+esc(m.name)+'">Accepter</button>';
    else if(m.blocked)acts='<button type="button" data-funblock="'+esc(m.id)+'">Debloquer</button>';
    else acts='<button type="button" data-fdm="'+esc(m.id)+'" data-n="'+esc(m.name)+'">DM</button><button type="button" data-fnote="'+esc(m.id)+'">Note</button><button type="button" data-fdel="'+esc(m.id)+'">X</button>';
    var note=(getFriendsData().notes||{})[m.id];
    return '<div class="member-row clickable-user" data-mid="'+esc(m.id)+'" data-user-id="'+esc(m.id)+'" style="cursor:pointer"><div class="av" data-user-id="'+esc(m.id)+'">'+esc((m.name||'?').slice(0,2).toUpperCase())+'</div><div class="meta"><strong class="name clickable-user" data-user-id="'+esc(m.id)+'">'+goldNameHtml(m.name)+'</strong><span>'+(m.online?'en ligne':(note||''))+'</span></div><div class="acts">'+acts+'</div></div>';
  }).join('')||'<p style="color:var(--m);padding:12px;font-size:.85rem">Liste vide</p>';
  box.querySelectorAll('[data-facc]').forEach(function(b){b.onclick=function(){
    var d=getFriendsData();
    d.pending=(d.pending||[]).filter(function(x){(x.id||x)!==b.dataset.facc});
    d.friends=d.friends||[];
    d.friends.push({id:b.dataset.facc,name:b.dataset.n});
    saveFriendsData(d);renderFriendsList();toast('Ami ajoute');
  }});
  box.querySelectorAll('[data-funblock]').forEach(function(b){b.onclick=function(){unblockUser(b.dataset.funblock);renderFriendsList()}});
  box.querySelectorAll('[data-fdm]').forEach(function(b){b.onclick=function(){
    var ids=[user.$id,b.dataset.fdm].sort();
    channel='dm-'+ids.join('_').slice(0,40);
    try{showScreen('chat');loadMsg()}catch(e){}
    document.getElementById('friends-panel').classList.remove('on');
  }});
  box.querySelectorAll('[data-fnote]').forEach(function(b){b.onclick=function(){
    var d=getFriendsData();if(!d.notes)d.notes={};
    var n=prompt('Note privee', d.notes[b.dataset.fnote]||'');
    if(n==null)return;
    d.notes[b.dataset.fnote]=n.slice(0,200);
    saveFriendsData(d);renderFriendsList();
  }});
  box.querySelectorAll('[data-fdel]').forEach(function(b){b.onclick=function(){
    var d=getFriendsData();
    d.friends=(d.friends||[]).filter(function(x){(x.id||x)!==b.dataset.fdel});
    saveFriendsData(d);renderFriendsList();
  }});
}
function addFriendRequest(name){
  name=(name||'').replace(/^@/,'').trim();
  if(name.length<2)return toast('Username invalide');
  var d=getFriendsData();
  d.pending=d.pending||[];
  d.pending.push({id:'u-'+name,name:name});
  saveFriendsData(d);
  window.__ftab='pending';
  renderFriendsList();
  toast('Demande envoyee (locale)');
}
function ignoreUser(uid){
  var d=getFriendsData();if(!d.ignored)d.ignored={};d.ignored[uid]=1;saveFriendsData(d);toast('Ignore');
}
function isIgnored(uid){
  try{return !!(getFriendsData().ignored||{})[uid]}catch(e){return false}
}
function markServerRead(){
  document.querySelectorAll('.ch[data-ch]').forEach(function(b){
    try{
      var ch=b.dataset.ch;
      var last=localStorage.getItem('uv_lastseen_'+ch)||'';
      if(last)localStorage.setItem('uv_lastread_'+ch,last);
    }catch(e){}
  });
  try{updateUnreadBadges()}catch(e){}
  toast('Serveur marque comme lu');
}
function getSessions(){
  try{return JSON.parse(localStorage.getItem('uv_sessions')||'[]')}catch(e){return []}
}
function recordSession(){
  try{
    var s=getSessions();
    var id=(navigator.userAgent||'web').slice(0,40);
    var now={id:id,ua:navigator.userAgent||'',at:Date.now(),label:(/Mobile/.test(navigator.userAgent)?'Mobile':'Desktop')};
    s=s.filter(function(x){return x.id!==id});
    s.unshift(now);
    localStorage.setItem('uv_sessions',JSON.stringify(s.slice(0,8)));
  }catch(e){}
}
function showSessions(){
  var s=getSessions();
  var msg=s.map(function(x){return '- '+(x.label||'Device')+' | '+new Date(x.at).toLocaleString()}).join(' | ')||'Aucune';
  alert('Sessions actives (local): '+msg);
}
function privacyMenu(){
  var c=prompt('Confidentialite: 1 MP serveurs on/off | 2 Filtre sensible on/off | 3 Flou 1-3 | 4 Demandes ami all/friends | 5 Export donnees','');
  if(c==null)return;
  c=c.trim();
  if(c==='1'){uvPref('allowServerDM',uvPref('allowServerDM')===false);toast('MP serveurs: '+(uvPref('allowServerDM')===false?'off':'on'))}
  else if(c==='2'){uvPref('sensitiveFilter',!uvPref('sensitiveFilter'));toast('Filtre sensible: '+(uvPref('sensitiveFilter')?'on':'off'))}
  else if(c==='3'){var n=prompt('Niveau flou 1-3','2');uvPref('blurLevel',parseInt(n,10)||2);toast('Flou: '+uvPref('blurLevel'))}
  else if(c==='4'){uvPref('friendReqFrom', uvPref('friendReqFrom')==='friends'?'all':'friends');toast('Demandes: '+uvPref('friendReqFrom'))}
  else if(c==='5'){
    var data={prefs:prefs,friends:getFriendsData(),servers:servers};
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ultravoc-export.json';a.click();
    toast('Export telecharge');
  }
}
function setPronouns(){
  var p=prompt('Pronoms (ex: il/him)', uvPref('pronouns')||'');
  if(p==null)return;
  uvPref('pronouns',p.slice(0,40));
  var el=document.getElementById('p-pronouns');if(el)el.textContent=p?('Pronoms: '+p):'';
  try{savePrefs({pronouns:p})}catch(e){}
}
function wireSpecPack(){
  recordSession();
  var bf=document.getElementById('btn-friends');
  if(bf)bf.onclick=function(){
    document.getElementById('friends-panel').classList.add('on');
    overlay&&overlay.classList.add('on');
    renderFriendsList();
  };
  document.getElementById('friends-close')&&(document.getElementById('friends-close').onclick=function(){
    try{document.getElementById('friends-panel').classList.remove('on')}catch(e){}
    try{var ov=document.getElementById('overlay');if(ov){ov.classList.remove('on');ov.style.opacity='0';ov.style.pointerEvents='none'}}catch(e){}
  });
  document.querySelectorAll('#status-sel [data-st]').forEach(function(b){
    b.onclick=function(){setPresenceStatus(b.dataset.st)};
  });
  setPresenceStatus(getPresenceStatus());
  document.querySelectorAll('[data-ftab]').forEach(function(b){
    b.onclick=function(){
      window.__ftab=b.dataset.ftab;
      document.querySelectorAll('[data-ftab]').forEach(function(x){x.classList.toggle('on',x===b)});
      renderFriendsList();
    };
  });
  document.getElementById('friend-add-btn')&&(document.getElementById('friend-add-btn').onclick=function(){
    addFriendRequest(document.getElementById('friend-add').value);
  });
  // extend settings menu
  var st=document.getElementById('btn-settings');
  if(st&&!st.dataset.spec){
    st.dataset.spec='1';
    var prev=st.onclick;
    st.onclick=function(ev){
      var c=prompt('Reglages: 0 Quick | 11 Amis | 12 Privacy | 13 Sessions | 14 Pronoms | 15 Marquer lu | 16 Theme dark/black','');
      if(c==='11'){document.getElementById('btn-friends').click();return}
      if(c==='12'){privacyMenu();return}
      if(c==='13'){showSessions();return}
      if(c==='14'){setPronouns();return}
      if(c==='15'){markServerRead();return}
      if(c==='16'){
        var th=uvPref('theme')==='black'?'dark':'black';
        uvPref('theme',th);
        document.body.style.background=th==='black'?'#000':'';
        toast('Theme: '+th);return
      }
      if(prev)try{prev.call(st,ev)}catch(e){}
      else if(c==='0'||c===''){if(prev)try{prev.call(st,ev)}catch(e){}}
    };
  }
  var pr=document.getElementById('p-pronouns');
  if(pr&&uvPref('pronouns'))pr.textContent='Pronoms: '+uvPref('pronouns');
  var pc=document.getElementById('p-created');
  if(pc&&user){
    try{pc.textContent='Compte: '+((user.$createdAt||'').slice(0,10)||'—')}catch(e){}
  }
  // filter ignored in loadMsg already has blocked - extend
}
// also filter ignored

function wireFeaturePack(){
  document.getElementById('messages')&&document.getElementById('messages').addEventListener('click',function(e){
    var s=e.target.closest&&e.target.closest('.spoiler');
    if(s)s.classList.toggle('on');
  });
  applyUiPrefs();
  restoreDraft();
  updateCharCount();
  // version toast once
  if(localStorage.getItem('uv_ver')!==UV_VER){
    localStorage.setItem('uv_ver',UV_VER);
    setTimeout(function(){toast('Ultravoc mis a jour · pack x50')},800);
  }
  var fab=document.getElementById('fab-bottom');
  var box=document.getElementById('messages');
  if(box&&fab){
    box.addEventListener('scroll',function(){
      fab.classList.toggle('on', box.scrollHeight-box.scrollTop-box.clientHeight>120);
    });
    fab.onclick=jumpLatest;
  }
  var inp=document.getElementById('input');
  if(inp){
    inp.addEventListener('input',function(){updateCharCount();saveDraft();});
    // replace enter handler later - mark
  }
  document.getElementById('shortcuts-close')&&(document.getElementById('shortcuts-close').onclick=function(){
    document.getElementById('shortcuts-modal').classList.remove('on');
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      closePickers&&closePickers();
      document.querySelectorAll('.member-panel.on,.shortcuts-modal.on,.search-bar.on,.drawer.on').forEach(function(x){x.classList.remove('on')});
      overlay&&overlay.classList.remove('on');
    }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();
      var sb=document.getElementById('search-bar');if(sb){sb.classList.add('on');document.getElementById('search-q')&&document.getElementById('search-q').focus()}
    }
    if((e.ctrlKey||e.metaKey)&&e.key==='/'){
      e.preventDefault();
      document.getElementById('shortcuts-modal')&&document.getElementById('shortcuts-modal').classList.add('on');
    }
  });
  // settings quick toggles via btn-settings long path - inject panel buttons if settings exists
  var st=document.getElementById('btn-settings');
  if(st&&!st.dataset.pack){
    st.dataset.pack='1';
    var old=st.onclick;
    st.onclick=function(ev){
      if(old)try{old.call(st,ev)}catch(e){}
      // also show quick menu
      var items=[
        ['compact','Mode compact'],
        ['reduceMotion','Réduire animations'],
        ['sound','Sons notif (toggle)'],
        ['desktopNotif','Notif bureau']
      ];
      // open shortcuts-like quick prefs
      var choice=prompt('Quick settings: 1 Compact | 2 Motion | 3 Sons | 4 Notif | 5 Status | 6 Surnom | 7 Mute | 8 Export | 9 Cache | 10 Raccourcis','');
      if(choice==null)return;
      choice=choice.trim();
      if(choice==='1'){uvPref('compact',!uvPref('compact'));applyUiPrefs();toast('Compact OK')}
      else if(choice==='2'){uvPref('reduceMotion',!uvPref('reduceMotion'));applyUiPrefs();toast('Motion OK')}
      else if(choice==='3'){uvPref('sound',uvPref('sound')===false?true:false);toast('Sons: '+(uvPref('sound')===false?'off':'on'))}
      else if(choice==='4'){Notification.requestPermission().then(function(p){uvPref('desktopNotif',p==='granted');toast('Notif: '+p)})}
      else if(choice==='5')setCustomStatus();
      else if(choice==='6')setServerNick();
      else if(choice==='7')toggleMuteChannel(channel);
      else if(choice==='8')exportTranscript();
      else if(choice==='9')clearLocalCache();
      else if(choice==='10')document.getElementById('shortcuts-modal').classList.add('on');
    };
  }
  // online indicator
  window.addEventListener('online',function(){toast('Connexion retablie')});
  window.addEventListener('offline',function(){toast('Hors ligne')});
  // AFK
  var afkT;
  function bumpAfk(){clearTimeout(afkT);uvPref('afk',false);afkT=setTimeout(function(){uvPref('afk',true)},10*60*1000)}
  ['click','keydown','mousemove','touchstart'].forEach(function(ev){document.addEventListener(ev,bumpAfk,{passive:true})});
  bumpAfk();
}

function wireComposer(){
  const grid=document.getElementById('emoji-grid');
  if(grid&&!grid.dataset.ready){
    grid.dataset.ready='1';
    EMOJIS.forEach(e=>{
      const b=document.createElement('button');b.type='button';b.textContent=e;
      b.onclick=()=>{const inp=document.getElementById('input');if(inp){inp.value+=e;inp.focus()}closePickers()};
      grid.appendChild(b);
    });
  }
  const ce=document.getElementById('c-emoji');
  if(ce)ce.onclick=()=>openPicker('picker-emoji');
  const cai=document.getElementById('c-ai');
  if(cai){
    cai.onclick=()=>aiCorrectInput(document.getElementById('input'));
    cai.oncontextmenu=function(e){e.preventDefault();var on=localStorage.getItem('uv_ai_auto')==='1';localStorage.setItem('uv_ai_auto',on?'0':'1');toast(on?'Correction auto OFF':'Correction auto ON (avant envoi)');cai.style.outline=on?'none':'1px solid var(--p)'};
    if(localStorage.getItem('uv_ai_auto')==='1')cai.style.outline='1px solid var(--p)';
  }
  const cg=document.getElementById('c-gif');
  if(cg)cg.onclick=()=>{openPicker('picker-gif');searchGifs('')};
  document.getElementById('emoji-close')&&(document.getElementById('emoji-close').onclick=closePickers);
  document.getElementById('gif-close')&&(document.getElementById('gif-close').onclick=closePickers);
  const gq=document.getElementById('gif-q');
  if(gq&&!gq.dataset.ready){
    gq.dataset.ready='1';
    let t;gq.oninput=()=>{clearTimeout(t);t=setTimeout(()=>searchGifs(gq.value.trim()),350)};
  }
  const fi=document.getElementById('file-img');
  const fa=document.getElementById('file-any');
  const ci=document.getElementById('c-img');
  const cf=document.getElementById('c-file');
  if(ci&&fi)ci.onclick=()=>fi.click();
  if(cf&&fa)cf.onclick=()=>fa.click();
  if(fi&&!fi.dataset.ready){
    fi.dataset.ready='1';
    fi.onchange=async()=>{
      const f=fi.files&&fi.files[0];fi.value='';if(!f)return;
      if(!hasPerm('attach_files')&&!hasPerm('send_messages'))return toast('Permission refusée');
      try{
        toast('Upload…');
        const url=await imgbb(f);
        pendingAttach={url,name:f.name,type:f.type||'image'};
        showAttach();
        toast('Média prêt — envoie le message');
      }catch(e){toast(e.message||'Upload échoué')}
    };
  }
  if(fa&&!fa.dataset.ready){
    fa.dataset.ready='1';
    fa.onchange=async()=>{
      const f=fa.files&&fa.files[0];fa.value='';if(!f)return;
      if(!hasPerm('attach_files'))return toast('Permission refusée');
      if(f.type.startsWith('image/')){
        try{toast('Upload…');const url=await imgbb(f);pendingAttach={url,name:f.name,type:f.type};showAttach();toast('Fichier prêt')}catch(e){toast(e.message||'Échec')}
      } else {
        // non-image: store as data name note (imgbb images only) — send as text link placeholder
        pendingAttach={url:'',name:f.name,type:f.type||'file',local:true,size:f.size};
        showAttach();
        toast('Fichier nommé sera indiqué dans le message (images recommandées)');
      }
    };
  }
  const cr=document.getElementById('c-report');
  if(cr)cr.onclick=()=>reportChannel();
  var _ac=document.getElementById('attach-clear');if(_ac)_ac.onclick=function(){pendingAttach=null;try{showAttach()}catch(e){}};
}
function showAttach(){
  const box=document.getElementById('attach-preview');
  if(!box)return;
  if(!pendingAttach){box.classList.remove('on');return}
  box.classList.add('on');
  const th=document.getElementById('attach-thumb');
  const nm=document.getElementById('attach-name');
  if(th){if(pendingAttach.url&&(pendingAttach.type||'').startsWith('image')){th.src=pendingAttach.url;th.style.display='block'}else{th.removeAttribute('src');th.style.display='none'}}
  if(nm)nm.textContent=pendingAttach.name||pendingAttach.url||'Pièce jointe';
}
async function searchGifs(q){
  const grid=document.getElementById('gif-grid');if(!grid)return;
  grid.innerHTML='<p style="color:var(--m);font-size:.8rem;padding:8px">Chargement…</p>';
  try{
    const endpoint=q
      ? 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=12&q='+encodeURIComponent(q)
      : 'https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=12';
    const r=await fetch(endpoint);
    const j=await r.json();
    const data=j.data||[];
    if(!data.length){grid.innerHTML='<p style="color:var(--m);font-size:.8rem">Aucun GIF</p>';return}
    grid.innerHTML='';
    data.forEach(g=>{
      const url=(g.images&&g.images.fixed_height_small&&g.images.fixed_height_small.url)||(g.images&&g.images.original&&g.images.original.url);
      if(!url)return;
      const img=document.createElement('img');img.src=url;img.alt=g.title||'gif';img.loading='lazy';
      img.onclick=()=>{pendingAttach={url:url,name:'gif',type:'image/gif'};showAttach();closePickers();toast('GIF ajouté — envoie')};
      grid.appendChild(img);
    });
  }catch(e){grid.innerHTML='<p style="color:var(--m);font-size:.8rem">GIF indisponible</p>'}
}
function reportChannel(){
  const reason=prompt('Raison du signalement (salon #'+(channel||'general')+')');
  if(reason==null)return;
  (async()=>{
    try{
      if(typeof modlog==='function')await modlog('report.channel',channel||'general',(reason||'').slice(0,200));
      try{await db.createDocument(DB,'ultravoc_reports',ID.unique(),{type:'channel',target:channel||'general',by:user&&user.$id,reason:(reason||'').slice(0,300),at:new Date().toISOString()})}catch(e){}
      toast('Signalement envoyé');
    }catch(e){toast('Signalement enregistré localement')}
  })();
}
function listKnownMembers(){
  const map=loadMemberMap();
  const srv=map[currentServer]||{};
  const names=(function(){try{return JSON.parse(localStorage.getItem('uv_member_names')||'{}')}catch(e){return {}}})();
  const rows=[];
  if(user){
    rows.push({id:user.$id,name:prefs.displayName||user.name||'Moi',email:user.email||'',roles:myRoleIds(),self:true,online:true});
  }
  Object.keys(srv).forEach(uid=>{
    if(user&&uid===user.$id)return;
    rows.push({id:uid,name:names[uid]||('Membre '+uid.slice(0,6)),email:'',roles:srv[uid]||[],self:false,online:isOnline(uid)});
  });
  // also from bans list keys
  try{
    const bans=JSON.parse(localStorage.getItem('uv_bans')||'{}');
    const b=bans[currentServer]||{};
    Object.keys(b).forEach(uid=>{
      if(!rows.some(r=>r.id===uid))rows.push({id:uid,name:'Banni '+uid.slice(0,6),email:'',roles:[],banned:true});
    });
  }catch(e){}
  return rows;
}
function isBanned(uid){
  try{
    const bans=JSON.parse(localStorage.getItem('uv_bans')||'{}');
    return !!(bans[currentServer]&&bans[currentServer][uid]);
  }catch(e){return false}
}
function setBanned(uid,on,reason){
  try{
    const bans=JSON.parse(localStorage.getItem('uv_bans')||'{}');
    if(!bans[currentServer])bans[currentServer]={};
    if(on)bans[currentServer][uid]={at:Date.now(),reason:reason||''};
    else delete bans[currentServer][uid];
    localStorage.setItem('uv_bans',JSON.stringify(bans));
  }catch(e){}
}
function kickUser(uid,name){
  if(!hasPerm('kick')&&!hasPerm('ban')&&!hasPerm('admin')&&!isAdmin)return toast('Permission refusée');
  if(user&&uid===user.$id)return toast('Tu ne peux pas t\u2019expulser');
  setRolesForUser(uid,[]);
  try{modlog&&modlog('kick',uid,name||'')}catch(e){}
  toast('Expulsé (rôles retirés): '+(name||uid.slice(0,8)));
  renderMemberPanel();
}
function banUser(uid,name){
  if(!hasPerm('ban')&&!hasPerm('admin')&&!isAdmin)return toast('Permission refusée');
  if(user&&uid===user.$id)return toast('Impossible');
  const reason=prompt('Raison du ban (optionnel)')||'';
  setBanned(uid,true,reason);
  setRolesForUser(uid,[]);
  try{modlog&&modlog('ban',uid,(name||'')+' '+reason)}catch(e){}
  toast('Banni: '+(name||uid.slice(0,8)));
  renderMemberPanel();
}
function unbanUser(uid){
  if(!hasPerm('ban')&&!hasPerm('admin')&&!isAdmin)return toast('Permission refusée');
  setBanned(uid,false);
  try{modlog&&modlog('unban',uid,'')}catch(e){}
  toast('Ban levé');
  renderMemberPanel();
}

function openMembersPanel(){window.__openMembersReady=openMembersPanel;window.openMembersPanel=openMembersPanel;
  try{
    window.openMembersPanel=openMembersPanel;
    var panel=document.getElementById('member-panel');
    var overlay=document.getElementById('overlay');
    if(!panel){try{toast('Panel membres introuvable')}catch(e){}return}
    try{toast('Membres…')}catch(e){}
    try{renderMemberPanel()}catch(e){console.warn(e)}
    panel.classList.add('on');
    panel.style.cssText=(panel.style.cssText||'')+';transform:translateX(0)!important;pointer-events:auto!important;z-index:999!important;visibility:visible!important;';
    if(overlay){
      overlay.classList.add('on');
      overlay.style.opacity='1';
      overlay.style.pointerEvents='auto';
      overlay.onclick=function(){closeMembersPanel()};
      overlay.ontouchend=function(e){try{e.preventDefault()}catch(x){}closeMembersPanel()};
    }
  }catch(e){console.warn(e);try{toast('Membres: '+(e.message||e))}catch(x){}}
}
function closeMembersPanel(){window.__closeMembersReady=closeMembersPanel;window.closeMembersPanel=closeMembersPanel;
  try{
    var panel=document.getElementById('member-panel');
    var overlay=document.getElementById('overlay');
    if(panel){panel.classList.remove('on');panel.style.transform='';panel.style.cssText=(panel.getAttribute('style')||'').replace(/transform:[^;]*;?/g,'')}
    if(overlay){overlay.classList.remove('on');overlay.style.opacity='0';overlay.style.pointerEvents='none'}
  }catch(e){}
}
function wireMembersBtn(){
  window.openMembersPanel=openMembersPanel;
  window.closeMembersPanel=closeMembersPanel;
  window.wireMembersBtn=wireMembersBtn;
  window.goVoiceAndJoin=goVoiceAndJoin;
  window.joinVoiceRoom=joinVoiceRoom;

  var btn=document.getElementById('btn-members');
  var close=document.getElementById('member-close');
  if(btn){
    btn.onclick=function(e){try{e.preventDefault();e.stopPropagation()}catch(x){}openMembersPanel()};
    btn.addEventListener('touchend',function(){openMembersPanel()},false);
  }
  if(close){
    close.onclick=function(){closeMembersPanel()};
    close.ontouchend=function(e){try{e.preventDefault()}catch(x){}closeMembersPanel()};
  }
}

function renderMemberPanel(){
  const list=document.getElementById('member-list');if(!list)return;
  var qEl=document.getElementById('member-q');
  var q=qEl?qEl.value:'';
  list.innerHTML='<p class="member-empty">Chargement des membres…</p>';
  function safeEsc(s){try{return String(s==null?'':s).replace(/[<>&"']/g,'')}catch(e){return ''}}
  function memberStaffLabel(m){
    try{
      if(!m)return '';
      if(m.self&&typeof isAdmin!=='undefined'&&isAdmin)return 'Admin';
      if(typeof nameIsDesignatedHunter==='function'&&(nameIsDesignatedHunter(m.name)||nameIsDesignatedHunter(m.username)))return 'Bug Hunter';
      if(m.staffRole==='bug_hunter'||m.bugHunter==='1')return 'Bug Hunter';
      if(typeof isBugHunter==='function'&&m.self&&isBugHunter())return 'Bug Hunter';
    }catch(e){}
    return '';
  }
  function normRoles(m){
    var staff=memberStaffLabel(m);
    if(staff)return staff;
    var r=m&&m.roles;
    if(!r)return 'Membre';
    if(typeof r==='string')return r;
    if(Array.isArray(r))return r.map(function(x){return String(x)}).filter(Boolean).join(', ')||'Membre';
    return 'Membre';
  }
  function paint(rows){
    try{
      if(!rows||!rows.length){list.innerHTML='<p class="member-empty">Aucun membre trouvé</p>';return}
      var cnt=document.getElementById('member-count');
      if(cnt)cnt.textContent=rows.length+' trouvé'+(rows.length>1?'s':'');
      var html='';
      for(var i=0;i<rows.length;i++){
        try{
          var m=rows[i]||{};
          var id=safeEsc(m.id||m.docId||('u'+i));
          var name=safeEsc(m.name||m.username||'User');
          var av=avatarMarkup((m.self&&prefs&&prefs.avatar)||m.avatar, m.name||name);
          var roles=safeEsc(normRoles(m));
          var self=m.self?' (toi)':'';
          var uname=m.username?('@'+safeEsc(m.username)+' '):'';
          var tag='';
          try{if(typeof tagHtml==='function')tag=tagHtml(m.id,m.tag)}catch(e){tag=''}
          var acts='';
          if(!m.self){
            var lab='+ Ami';
            try{if(typeof friendButtonLabel==='function')lab=friendButtonLabel(m.id)}catch(e){}
            acts+='<button type="button" data-friend="1" data-id="'+id+'">'+safeEsc(lab)+'</button>';
            acts+='<button type="button" data-dm="'+id+'" data-n="'+name+'">DM</button>';
            acts+='<button type="button" data-block="'+id+'" data-n="'+name+'">Bloquer</button>';
            acts+='<button type="button" data-report="'+id+'" data-n="'+name+'">Signaler</button>';
          }
          acts+='<button type="button" data-share="1" data-id="'+id+'">Partager</button>';
          html+='<div class="member-row" data-mid="'+id+'"><div class="av" data-avchange="'+(m.self?'1':'')+'" title="'+(m.self?'Changer la photo':'')+'">'+av+'</div><div class="meta"><div class="name-line">'+((nameIsDesignatedHunter(m.name||m.username)||nameIsDesignatedDev(m.name||m.username))?goldNameHtml(m.name||name):('<span>'+name+'</span>'))+(m.self?'<span class="you-chip">toi</span>':'')+tag+'</div><div class="sub-line">'+uname+(roles?(' · '+roles):'')+'</div></div><div class="acts">'+acts+'</div></div>';
        }catch(rowErr){
          console.warn('member row',rowErr);
          html+='<div class="member-row"><div class="meta"><strong>Membre</strong></div></div>';
        }
      }
      list.innerHTML=html||'<p class="member-empty">Aucun membre trouvé</p>';try{wireBrokenAvatars(list)}catch(e){}
      try{
        list.querySelectorAll('.av[data-avchange="1"]').forEach(function(av){
          av.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();pickAvatarFile()});
        });
      }catch(e){}
      try{
        list.querySelectorAll('[data-eye]').forEach(function(b){
          b.onclick=function(ev){
            ev.stopPropagation();
            window.__revealedTags=window.__revealedTags||{};
            var uid=b.getAttribute('data-eye');
            if(window.__revealedTags[uid]) delete window.__revealedTags[uid];
            else window.__revealedTags[uid]=1;
            try{renderMemberPanel()}catch(e){}
          };
        });
        list.querySelectorAll('[data-friend]').forEach(function(b){
          b.onclick=function(){
            var id=b.getAttribute('data-id');
            var m=(window.__globalMembersCache||[]).find(function(x){return x.id===id})||{id:id,name:'User'};
            try{if(typeof addFriendByMember==='function')addFriendByMember(m);else toast('Demande envoyée')}catch(e){toast('Ami')}
          };
        });
        list.querySelectorAll('[data-share]').forEach(function(b){
          b.onclick=function(){
            var id=b.getAttribute('data-id');
            var m=(window.__globalMembersCache||[]).find(function(x){return x.id===id})||{id:id,name:'User'};
            try{if(typeof shareProfile==='function')shareProfile(m);else if(navigator.share)navigator.share({title:m.name,url:location.href})}catch(e){}
          };
        });
        list.querySelectorAll('[data-report]').forEach(function(b){
          b.onclick=function(){try{reportUser(b.getAttribute('data-report'), b.getAttribute('data-n'))}catch(e){toast('Signalement')}};
        });
        list.querySelectorAll('[data-dm]').forEach(function(b){
          b.onclick=function(){
            try{
              if(typeof openDm==='function') openDm(b.dataset.dm, b.dataset.n);
              else if(typeof startDm==='function') startDm(b.dataset.dm, b.dataset.n);
              else toast('DM · '+b.dataset.n);
            }catch(e){toast('DM · '+b.dataset.n)}
          };
        });
        list.querySelectorAll('[data-block]').forEach(function(b){
          b.onclick=function(){try{if(typeof ignoreUser==='function')ignoreUser(b.dataset.block)}catch(e){} toast('Utilisateur bloqué');};
        });
        list.querySelectorAll('[data-mid]').forEach(function(row){
          row.addEventListener('click',function(e){
            if(e.target.closest('button'))return;
            var id=row.getAttribute('data-mid');
            try{if(typeof openUserProfile==='function')openUserProfile(id)}catch(x){}
          });
        });
      }catch(wireErr){console.warn('wire members',wireErr)}
    }catch(err){
      console.warn('paint members',err);
      list.innerHTML='<p class="member-empty">Erreur affichage membres</p>';
    }
  }
  try{
    var quick=listKnownMembers();
    if(quick&&quick.length) paint(quick);
  }catch(e){}
  loadGlobalMembers(q).then(function(rows){
    try{
      if(!rows)rows=[];
      rows=rows.slice().sort(function(a,b){return (b.online?1:0)-(a.online?1:0)||String(a.name||'').localeCompare(String(b.name||''))});
      window.__globalMembersCache=rows;
      paint(rows);
    }catch(e){
      console.warn(e);
      try{paint(listKnownMembers())}catch(x){list.innerHTML='<p class="member-empty">Erreur affichage membres</p>'}
    }
  }).catch(function(err){
    console.warn('members',err);
    try{paint(listKnownMembers())}catch(e){list.innerHTML='<p class="member-empty">Impossible de charger les membres</p>'}
  });
}

function wireMembers(){
  const btn=document.getElementById('btn-members');
  const panel=document.getElementById('member-panel');
  const close=document.getElementById('member-close');
  wireMembersBtn();
}


document.getElementById('reply-clear')&&(document.getElementById('reply-clear').onclick=function(){
  window.__reply=null;
  var bar=document.getElementById('reply-bar');if(bar)bar.classList.remove('on');
});

try{wireComposer()}catch(e){}
try{wireFeaturePack()}catch(e){console.warn(e)}
try{wirePack2()}catch(e){console.warn(e)}
try{wireSpecPack()}catch(e){console.warn(e)}
try{enhanceFileInputs(document)}catch(e){}

try{
  var uov=document.getElementById('uprofile-overlay');
  if(uov&&!uov.dataset.wired){
    uov.dataset.wired='1';
    document.getElementById('uprofile-close')&&(document.getElementById('uprofile-close').onclick=closeUserProfile);
    uov.addEventListener('click',function(e){if(e.target===uov)closeUserProfile()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){try{dismissAllOverlays({})}catch(x){}try{uvUnlockUI()}catch(x){}}});
  }
  
try{
  document.querySelectorAll('.uprofile-overlay,.srv-modal').forEach(function(el){
    el.classList.remove('on');
    el.style.display='none';
    el.setAttribute('aria-hidden','true');
  });
  document.querySelectorAll('.settings').forEach(function(el){
    /* leave as is */
  });
}catch(e){}

  wireProfileClicks(document);


document.addEventListener('click',function(ev){
  try{
    // never block UI chrome
    if(ev.target.closest('button,a,input,textarea,select,label,.acts,.msg-act,.chip,.file-btn,.composer,.top,.bottom-nav,.icon-btn,.toggle,.srv-modal,.settings,.msg-x'))return;
    var t=ev.target.closest('[data-user-id],[data-mid],[data-uid],.clickable-user');
    if(!t) return;
    var id=t.getAttribute('data-user-id')||t.getAttribute('data-mid')||t.getAttribute('data-uid')||'';
    if(!id){
      var host=t.closest('[data-user-id],[data-mid],[data-uid]');
      if(host) id=host.getAttribute('data-user-id')||host.getAttribute('data-mid')||host.getAttribute('data-uid')||'';
    }
    if(!id) return;
    // only stop when we really open a profile
    if(typeof openUserProfile==='function'){
      ev.preventDefault();
      ev.stopPropagation();
      openUserProfile(id);
    }
  }catch(e){console.warn('profile click',e)}
}, true);



  try{new MutationObserver(function(){try{wireProfileClicks(document)}catch(e){}}).observe(document.body,{childList:true,subtree:true})}catch(e){}
  detectLocaleAuto();

try{
  if(user&&user.$createdAt){
    var t0=new Date(user.$createdAt).getTime();
    if(t0&&t0<UV_EARLY_DEADLINE){
      prefs.badges=prefs.badges||[];
      if(prefs.badges.indexOf('early_user')<0){prefs.badges.push('early_user');try{localStorage.setItem('uv_prefs',JSON.stringify(prefs))}catch(e){}}
    }
  }
}catch(e){}

}catch(e){console.warn(e)}

try{new MutationObserver(function(){try{enhanceFileInputs(document)}catch(e){}}).observe(document.body,{childList:true,subtree:true})}catch(e){}

try{
  var mq=document.getElementById('member-q');
  if(mq&&!mq.dataset.wired){
    mq.dataset.wired='1';
    mq.addEventListener('input',function(){
      clearTimeout(window.__memberSearchTimer);
      window.__memberSearchTimer=setTimeout(function(){try{renderMemberPanel()}catch(e){}},220);
    });
  }
}catch(e){}
try{ensureUserProfile()}catch(e){}


try{
  var vc=document.getElementById('v-cam');
  if(vc&&!vc.dataset.camWired){
    vc.dataset.camWired='1';
    vc.onclick=async function(){
      try{
        if(media.cam){
          media.cam=false;
          try{media.stream&&media.stream.getVideoTracks().forEach(function(t){t.stop();media.stream.removeTrack(t)})}catch(e){}
          paintVoiceGrid();
        } else {
          await ensureCam();
          toast('Camera active — clique la tuile pour agrandir');
        }
      }catch(e){toast(e.message||'Camera refusee')}
    };
  }
}catch(e){}


document.getElementById('cam-lb-x')&&(document.getElementById('cam-lb-x').onclick=closeCamLightbox);
document.getElementById('cam-lightbox')&&document.getElementById('cam-lightbox').addEventListener('click',function(e){if(e.target.id==='cam-lightbox')closeCamLightbox()});


try{
  var bm=document.getElementById('btn-v-mute')||document.getElementById('btn-mute-mic')||document.getElementById('v-mute');
  if(bm&&!bm.dataset.wired){
    bm.dataset.wired='1';
    bm.onclick=function(){
      media.mic=!media.mic;
      try{(media.stream||window.__localStream).getAudioTracks().forEach(function(t){t.enabled=!!media.mic})}catch(e){}
      bm.textContent=media.mic?'Mic':'Mute';
      try{paintVoiceGrid()}catch(e){}
    };
  }
  var bl=document.getElementById('btn-leave-voice')||document.getElementById('btn-v-leave');
  if(bl&&!bl.dataset.wired){
    bl.dataset.wired='1';
    bl.onclick=function(){leaveVoiceRoom()};
  }
}catch(e){}


try{
  var _bs=document.getElementById('btn-settings');
  if(_bs){
    _bs.onclick=function(){
      try{
        if(typeof openSettings==='function') openSettings('root');
        else if(typeof showScreen==='function') showScreen('settings');
      }catch(e){console.warn(e);toast('Parametres');}
    };
  }
}catch(e){}


document.getElementById('btn-search')&&(document.getElementById('btn-search').onclick=function(){
  toggleSearchBar();
  return;
  var sb=document.getElementById('search-bar');if(sb)sb.classList.toggle('on');
  var q=document.getElementById('search-q');if(q)q.focus();
});
document.getElementById('search-close')&&(document.getElementById('search-close').onclick=function(){
  var sb=document.getElementById('search-bar');if(sb)sb.classList.remove('on');
  document.querySelectorAll('.msg.search-hide').forEach(function(m){m.classList.remove('search-hide')});
  var q=document.getElementById('search-q');if(q)q.value='';
});
document.getElementById('search-q')&&(document.getElementById('search-q').oninput=function(){
  var q=(document.getElementById('search-q').value||'').toLowerCase().trim();
  document.querySelectorAll('.msg').forEach(function(m){
    var t=(m.textContent||'').toLowerCase();
    if(!q||t.indexOf(q)>=0)m.classList.remove('search-hide');else m.classList.add('search-hide');
  });
});
var _typingTimer;
document.getElementById('input')&&document.getElementById('input').addEventListener('input',function(){
  setTyping(true);
  clearTimeout(_typingTimer);
  _typingTimer=setTimeout(function(){setTyping(false)},2000);
});
setInterval(function(){try{renderTyping()}catch(e){}},1500);

try{wireMembers()}catch(e){}
setInterval(()=>{try{loadMsg()}catch(e){};try{heartbeat()}catch(e){};try{updateUnreadBadges()}catch(e){}},20000);
try{heartbeat()}catch(e){};


try{
  window.__openMembersReady=openMembersPanel;
  window.openMembersPanel=openMembersPanel;
  window.__closeMembersReady=closeMembersPanel;
  window.closeMembersPanel=closeMembersPanel;
  window.__goVoiceReady=goVoiceAndJoin;
  window.goVoiceAndJoin=goVoiceAndJoin;
  window.joinVoiceRoom=joinVoiceRoom;
  window.sendMsg=sendMsg;
  window.openSettingsPanel=function(){
    try{
      if(typeof openSettings==='function')openSettings('root');
      else {
        var s=document.getElementById('settings');
        if(s){s.classList.add('on');s.style.display='flex'}
      }
    }catch(e){console.warn(e);try{toast('Parametres: '+e.message)}catch(x){}}
  };
  window.__openSettingsReady=window.openSettingsPanel;

  window.__openSettingsReady=window.openSettingsPanel;
  window.openFriendsPanel=function(){
    try{
      var panel=document.getElementById('friends-panel');
      var overlay=document.getElementById('overlay');
      if(panel)panel.classList.add('on');
      if(overlay){overlay.classList.add('on');overlay.style.opacity='1';overlay.style.pointerEvents='auto'}
      try{renderFriendsList()}catch(e){}
    }catch(e){console.warn(e)}
  };
  window.__openFriendsReady=window.openFriendsPanel;
  wireMembersBtn();
  __wireJoin();
  [0,100,500,1500,3000].forEach(function(t){
    setTimeout(function(){
      try{
        wireMembersBtn();__wireJoin();
        window.goVoiceAndJoin=goVoiceAndJoin;window.__goVoiceReady=goVoiceAndJoin;
        window.openMembersPanel=openMembersPanel;
      }catch(e){}
    },t);
  });
}catch(e){console.warn('boot bind',e)}

})();
</script></body></html>
`;
addEventListener("fetch",e=>e.respondWith(handle(e.request)));
async function handle(request){
  const path=new URL(request.url).pathname.replace(/\/+$/,"")||"/";
  const html=path==="/app"?APP:HOME;
  return new Response(html,{status:200,headers:{
    "Content-Type":"text/html;charset=utf-8",
    "Cache-Control":"no-store,no-cache,must-revalidate",
    "X-Content-Type-Options":"nosniff",
    "X-Frame-Options":"DENY",
    "Referrer-Policy":"strict-origin-when-cross-origin",
    "Permissions-Policy":"camera=(self),microphone=(self),display-capture=(self)",
    "Strict-Transport-Security":"max-age=31536000;includeSubDomains",
    "Cross-Origin-Opener-Policy":"same-origin",
    "Cross-Origin-Resource-Policy":"same-origin",
    "Content-Security-Policy":"default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; connect-src 'self' https://fra.cloud.appwrite.io https://*.cloud.appwrite.io https://api.giphy.com https://api.imgbb.com https://buy.stripe.com https://*.stripe.com https://api.coinbase.com https://mempool.space https://api.blockcypher.com https://api.languagetool.org https://*.trycloudflare.com wss://*.trycloudflare.com wss://journal-bernard-alarm-walking.trycloudflare.com; img-src 'self' data: blob: https:; media-src 'self' blob: https:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  }});
}
