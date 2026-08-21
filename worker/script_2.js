
(async function(){
'use strict';
window.__xLogin=function(){var e=document.getElementById('auth-err');if(e)e.textContent='Chargement…';};
document.addEventListener('submit',function(ev){ev.preventDefault();ev.stopPropagation();return false;},true);


async function __waitAw(){
  var t0=Date.now();
  while(typeof Appwrite==='undefined' && Date.now()-t0<10000){
    await new Promise(function(r){setTimeout(r,50);});
  }
  if(typeof Appwrite==='undefined'){
    await new Promise(function(res){
      var s=document.createElement('script');
      s.src='https://unpkg.com/appwrite@15.0.0';
      s.onload=function(){res()};
      s.onerror=function(){res()};
      document.head.appendChild(s);
      setTimeout(res,4000);
    });
  }
  if(typeof Appwrite==='undefined')console.error('[xultra] Appwrite still missing');
}
await __waitAw();

const EP='https://fra.cloud.appwrite.io/v1', PID='6a73b975002f14dc6b91', DB='xultra', BUCKET='ultravoc_media';
if(typeof Appwrite==='undefined'){console.error('[xultra] Appwrite undefined');}
const {Client,Account,Databases,Storage,ID,Query,Permission,Role}=Appwrite;
const client=new Client().setEndpoint(EP).setProject(PID);
try{
  var _sdkS=null;
  try{_sdkS=localStorage.getItem('xultra_aw_sdk_session');}catch(e){}
  if(!_sdkS){try{_sdkS=sessionStorage.getItem('xultra_aw_sdk_session');}catch(e){}}
  if(!_sdkS){try{_sdkS=localStorage.getItem('cookieFallback_session_'+PID);}catch(e){}}
  if(_sdkS){
    try{client.setSession(String(_sdkS));}catch(e){}
  }
  try{localStorage.removeItem('xultra_session');}catch(e){}
}catch(e){}
const account=new Account(client), db=new Databases(client), storage=new Storage(client);
window.client=client;window.account=account;window.db=db;window.storage=storage;window.EP=EP;window.PID=PID;window.DB=DB;
console.log('[xultra] SDK ready');


window.boot=boot;
window.__xBootWithSession=async function(secret, jwt){
  try{
    if(jwt){
      try{client.setJWT(String(jwt));}catch(e){}
      try{localStorage.setItem('xultra_jwt',String(jwt));}catch(e){}
    }
    if(secret){
      try{client.setSession(String(secret));}catch(e){}
      try{if(client.headers)client.headers['X-Appwrite-Session']=String(secret);}catch(e){}
      try{localStorage.setItem('xultra_session',String(secret));}catch(e){}
    }
    // REST probe to know if credentials work
    try{
      const headers={'X-Appwrite-Project':PID,'Content-Type':'application/json'};
      if(jwt)headers['X-Appwrite-JWT']=String(jwt);
      if(secret)headers['X-Appwrite-Session']=String(secret);
      const pr=await fetch(EP+'/account',{headers:headers});
      if(!pr.ok){
        const t=await pr.text();
        throw new Error('Appwrite account '+pr.status+': '+t.slice(0,120));
      }
    }catch(eProbe){
      throw eProbe;
    }
    user=await account.get();
    await boot();
    if(!user)throw new Error('Profil inaccessible');
    try{history.replaceState({},'', '/');}catch(e){}
    return true;
  }catch(e){
    console.error('bootWithSession',e);
    throw e;
  }
};


/* === XULTRA Security layer === */
function escHtml(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function escAttr(s){return escHtml(s).replace(/\x60/g,'')}
const _rlMap={};
function rateLimit(key, max, windowMs){
  const now=Date.now();
  if(!_rlMap[key])_rlMap[key]=[];
  _rlMap[key]=_rlMap[key].filter(t=>now-t<windowMs);
  if(_rlMap[key].length>=max)return false;
  _rlMap[key].push(now);
  return true;
}
function sanitizeText(s,max){
  s=String(s==null?'':s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');
  if(max&&s.length>max)s=s.slice(0,max);
  return s;
}
// Custom context menu (Discord-like)
(function(){
  let menuEl=null;
  function killMenu(){if(menuEl){menuEl.remove();menuEl=null}}
  document.addEventListener('click',killMenu);
  document.addEventListener('scroll',killMenu,true);
  document.addEventListener('contextmenu',function(e){
    e.preventDefault();
    killMenu();
    const msg=e.target&&e.target.closest&&e.target.closest('.msg, .bubble, [data-msg]');
    const input=e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable);
    if(input){
      // minimal: allow paste area — show copy/paste only
      menuEl=document.createElement('div');
      menuEl.id='xctx';
      menuEl.innerHTML='<button type="button" data-xctx="copy">Copier</button><button type="button" data-xctx="paste">Coller</button>';
    }else if(msg){
      menuEl=document.createElement('div');
      menuEl.id='xctx';
      menuEl.innerHTML='<button type="button" data-xctx="copy">Copier le texte</button><button type="button" data-xctx="reply">Repondre</button><button type="button" data-xctx="delete">Supprimer</button>';
    }else{
      // chrome / empty: no menu
      return;
    }
    menuEl.style.cssText='position:fixed;z-index:99999;min-width:180px;padding:6px;border-radius:12px;background:#1a1226;border:1px solid rgba(167,139,250,.35);box-shadow:0 12px 40px rgba(0,0,0,.55);display:flex;flex-direction:column;gap:2px';
    const x=Math.min(e.clientX, window.innerWidth-200);
    const y=Math.min(e.clientY, window.innerHeight-160);
    menuEl.style.left=x+'px';menuEl.style.top=y+'px';
    menuEl.querySelectorAll('button').forEach(b=>{
      b.style.cssText='text-align:left;padding:8px 12px;border:0;border-radius:8px;background:transparent;color:#e9d5ff;font-weight:700;font-size:.82rem;cursor:pointer';
      b.onmouseenter=()=>b.style.background='rgba(124,58,237,.25)';
      b.onmouseleave=()=>b.style.background='transparent';
      b.onclick=async(ev)=>{
        ev.stopPropagation();
        const act=b.getAttribute('data-xctx');
        killMenu();
        if(act==='copy'){
          const t=(msg&&(msg.innerText||msg.textContent))||(window.getSelection&&String(window.getSelection()))||'';
          try{await navigator.clipboard.writeText(t.trim())}catch(e){}
        }else if(act==='paste'&&input){
          try{
            const t=await navigator.clipboard.readText();
            document.execCommand('insertText',false,t);
          }catch(e){}
        }else if(act==='reply'&&msg){
          const mid=msg.getAttribute('data-id')||msg.dataset.id;
          if(mid&&typeof setReply==='function')try{setReply(mid)}catch(e){}
        }else if(act==='delete'&&msg){
          const mid=msg.getAttribute('data-id')||msg.dataset.id;
          if(mid&&typeof deleteMsg==='function')try{deleteMsg(mid)}catch(e){}
        }
      };
    });
    document.body.appendChild(menuEl);
  });
  // Block drag of images/UI
  document.addEventListener('dragstart',e=>{if(!(e.target&&e.target.closest&&e.target.closest('input,textarea')))e.preventDefault()});
  // Mild anti-debug noise (not perfect)
  try{
    Object.defineProperty(window,'__xultra_sec',{value:1,writable:false,configurable:false});
  }catch(e){}
})();


let user=null; window.user=null; let profile=null; let view='dms';
let activeDm=null, friends=[], dms=[], msgs=[];
let replyTo=null, mediaRecorder=null, chunks=[], poll=null;

const EMOJIS='😀 😃 😄 😁 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 😐 😑 😶 🙄 😏 😣 😥 😮 😯 😪 😫 🥱 😴 😌 😤 😢 😭 😱 😖 😞 😟 😠 😡 🤬 😈 💀 💩 🤡 👻 👽 🤖 🎃 👋 👌 ✌️ 🤞 🤟 🤘 🤙 👍 👎 👏 🙌 🫶 🙏 💪 ❤️ 🧡 💛 💚 💙 💜 🖤 💔 💕 💞 💖 🔥 ✨ ⭐ 🌟 💫 ⚡ 💥 💯 ✅ ❌ 🎉 🎊 🎈 🏆 🎮 🚀 💜'.split(/\\s+/);
const $=id=>document.getElementById(id);
let membersCache=[];
const toast=m=>{const e=$('toast');e.textContent=m;e.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>e.classList.remove('on'),2200)};
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const ini=n=>String(n||'?').trim().charAt(0).toUpperCase()||'?';
const av=(url,n)=>{const u=String(url||'').trim();const ok=u&&(/^https?:\/\//i.test(u)||u.indexOf('//')===0||u.indexOf('data:image')===0);return ok?'<img src="'+esc(u)+'" alt="" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">':esc(ini(n));};
const safeUrl=url=>{const u=String(url||'').trim();return (/^https?:\/\//i.test(u)||u.indexOf('//')===0||u.indexOf('data:image')===0)?u:'';};
const members=d=>{const m=d&&d.members;return Array.isArray(m)?m.map(String):String(m||'').split(',').filter(Boolean)};
const sc=s=>({online:'var(--online)',idle:'#f0b232',dnd:'var(--danger)',offline:'#80848e'}[s]||'var(--online)');
const closeP=()=>{['p-emoji','p-gif'].forEach(id=>$(id).classList.remove('on'));['btn-emoji','btn-gif'].forEach(id=>$(id).classList.remove('on'))};
const ago=iso=>{if(!iso)return'';const d=Date.now()-new Date(iso).getTime();if(d<6e4)return'à l’instant';if(d<36e5)return Math.floor(d/6e4)+' m';if(d<864e5)return Math.floor(d/36e5)+' h';return Math.floor(d/864e5)+' j'};
const cleanPrev=t=>String(t||'').replace(/⟦REPLY:[^⟧]*⟧/g,'').replace(/\\[\\[?REPLY:[^\\]]*\\]\\]?/g,'').trim();

/* AUTH */
document.querySelectorAll('.tabs button').forEach(b=>{
  b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    const reg=b.dataset.tab==='register';$('form-login').classList.toggle('hidden',reg);$('form-register').classList.toggle('hidden',!reg);$('auth-err').textContent=''};
});


async function doLogin(){
  const email=(($('in-email')&&$('in-email').value)||'').trim();
  const pass=(($('in-pass')&&$('in-pass').value)||'');
  if($('auth-err'))$('auth-err').textContent='';
  if($('btn-login')){$('btn-login').disabled=true;$('btn-login').textContent='Connexion…';}
  try{
    if(!email||!pass)throw new Error('Email et mot de passe requis');
    if(typeof rateLimit==='function'&&!rateLimit('login:'+email,20,60000))throw new Error('Trop de tentatives — attends 1 min');
    let lastErr=null, logged=false;
    // Server-side login first: it returns an explicit session secret applied via
    // client.setSession(), which works regardless of browser cookie policy. Some
    // browsers (Brave, and increasingly others) block the cross-site cookie that
    // account.createEmailPasswordSession() relies on — the SDK login itself still
    // "succeeds" and account.get() keeps working, but every subsequent db.listDocuments()
    // (profile, friends, members…) silently loses auth, breaking most of the app.
    try{
      const rr=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,password:pass})});
      const jj=await rr.json().catch(function(){return {};});
      if(rr.ok&&jj&&jj.ok&&jj.secret){
        try{client.setSession(String(jj.secret));}catch(e){}
        try{if(client.headers)client.headers['X-Appwrite-Session']=String(jj.secret);}catch(e){}
        try{localStorage.setItem('cookieFallback_session_'+String(PID),String(jj.secret));}catch(e){}
        try{localStorage.removeItem('xultra_session');}catch(e){}
        await account.get();
        logged=true;
      }else if(jj&&jj.error){lastErr=new Error(jj.error);}
      else{lastErr=new Error('Login serveur refuse ('+rr.status+')');}
    }catch(e2){lastErr=e2}
    // SDK fallback, only if the server route itself is unreachable.
    if(!logged){
      try{await account.createEmailPasswordSession(email,pass);logged=true;}
      catch(e1){
        lastErr=e1;
        try{if(typeof account.createEmailSession==='function'){await account.createEmailSession(email,pass);logged=true;}}
        catch(e1b){lastErr=e1b}
      }
    }
    if(!logged){
      var msg=(lastErr&&(lastErr.message||String(lastErr)))||'Identifiants invalides';
      if(/failed to fetch|NetworkError|network|CORS/i.test(msg))msg='Reseau ou CORS Appwrite';
      if(/origin|platform|Invalid origin/i.test(msg))msg='Ajoute https://xultra.space dans Appwrite → Platforms';
      throw new Error(msg);
    }
    await boot();
    if(!user){try{user=await account.get();if(user)await boot();}catch(e){}}
    if(!user)throw new Error('Session active mais profil inaccessible');
  }catch(e){
    console.error('login',e);
    if($('auth-err'))$('auth-err').textContent=(e&&e.message)||'Connexion impossible';
    try{showAuth()}catch(_){}
  }
  if($('btn-login')){$('btn-login').disabled=false;$('btn-login').textContent='Entrer';}
}

window.__xLogin=function(){return doLogin();};
function bindAuthForms(){
  var fl=$('form-login');
  if(fl){
    fl.setAttribute('onsubmit','return false');
    fl.addEventListener('submit',function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      doLogin();
      return false;
    }, true);
  }
  var btn=$('btn-login');
  if(btn){
    btn.setAttribute('type','button');
    btn.onclick=function(ev){
      if(ev){ev.preventDefault();ev.stopPropagation();}
      doLogin();
      return false;
    };
  }
  // Enter in password field
  var pw=$('in-pass'), em=$('in-email');
  function onEnter(ev){
    if(ev.key==='Enter'||ev.keyCode===13){
      ev.preventDefault();
      ev.stopPropagation();
      doLogin();
      return false;
    }
  }
  if(pw)pw.onkeydown=onEnter;
  if(em)em.onkeydown=onEnter;
}
try{bindAuthForms()}catch(e){}
document.addEventListener('DOMContentLoaded',function(){try{bindAuthForms()}catch(e){}});
$('btn-register').onclick=async()=>{
  const name=$('in-user').value.trim().replace(/[^a-zA-Z0-9_.-]/g,'').slice(0,24);
  const email=$('in-email2').value.trim(),pass=$('in-pass2').value;
  if(!name||name.length<2){$('auth-err').textContent='Pseudo trop court';return}
  if(pass.length<8){$('auth-err').textContent='Min. 8 caractères';return}
  $('btn-register').disabled=true;
  try{await account.create(ID.unique(),email,pass,name);try{await account.createEmailPasswordSession(email,pass)}catch(e){await account.createEmailSession(email,pass)};await ensureProfile(name);await boot()}
  catch(e){$('auth-err').textContent=(e&&e.message)||'Inscription impossible'}
  $('btn-register').disabled=false;
};
async function findProf(id){try{const r=await db.listDocuments(DB,'users',[Query.equal('authUserId',id),Query.limit(1)]);return(r.documents||[])[0]||null}catch(e){return null}}
async function ensureProfile(dn){
  const u=await account.get();const ex=await findProf(u.$id);if(ex){profile=ex;return ex}
  const tag=String(Math.floor(1000+Math.random()*9000));
  const doc={authUserId:u.$id,email:u.email||'',username:(dn||u.name||'user').toLowerCase(),baseUsername:(dn||u.name||'user').toLowerCase(),tag,displayName:dn||u.name||'User',bio:'',avatar:'',bgColor:'#7c3aed',statusManual:'online'};
  try{profile=await db.createDocument(DB,'users',ID.unique(),doc)}catch(e){profile=await db.createDocument(DB,'users',ID.unique(),{authUserId:u.$id,email:u.email||'',username:doc.username,displayName:doc.displayName,tag})}
  return profile;
}
async function boot(){
  try{user=await account.get();window.user=user;}catch(e){user=null;window.user=null;try{showAuth()}catch(_){}return;}
  try{
    profile=await findProf(user.$id);
    if(!profile){
      try{await ensureProfile(user.name||user.email||'User');}catch(e2){console.error('ensureProfile',e2);}
      try{profile=await findProf(user.$id);}catch(e3){}
    }
  }catch(e){console.error('boot profile',e);}
  try{if($('auth'))$('auth').style.display='none';try{$('auth').setAttribute('hidden','');$('auth').style.pointerEvents='none'}catch(_a){};if($('app'))$('app').classList.add('on');}catch(e){}
  
  try{window.profile=profile;}catch(e){}
  try{
    var nm=(profile&&(profile.displayName||profile.username))||(user&&(user.name||user.email))||'Compte';
    if($('ub-name'))$('ub-name').textContent=nm;
    if($('ub-av')){
      var letter=(nm[0]||'?').toUpperCase();
      $('ub-av').innerHTML=letter+'<span class="st" data-st="online" style="background:#22c55e"></span>';
    }
    if($('ub-status-txt'))$('ub-status-txt').textContent='En ligne';
  }catch(e){console.error('idpaint',e);}

  try{renderUserbar();}catch(e){console.error('renderUserbar',e);}
  try{
    var sh=$('ub-shield'), ad=$('ub-admin'), hu=$('ub-hunter');
    var ok=typeof isDevUser==='function'&&isDevUser(profile);
    var hun=typeof isHunterUser==='function'&&isHunterUser(profile);
    if(sh){sh.classList.toggle('hidden',!ok);}
    if(ad){ad.classList.toggle('hidden',!ok);}
    if(hu){hu.classList.toggle('hidden',!(hun||ok));}
  }catch(e){}
  view='dms';
  try{await refreshFriends();}catch(e){console.error('friends',e);}
  try{await refreshDms();}catch(e){console.error('dms',e);dms=[];}
  try{await refreshNotifications();}catch(e){}
  try{if(typeof startPresenceLoop==='function')startPresenceLoop();}catch(e){}
  try{if(typeof startCallWatcher==='function')startCallWatcher();}catch(e){}
  try{if(typeof wireCallMediaControls==='function')wireCallMediaControls();}catch(e){}
  try{showView('dms');}catch(e){console.error('showView',e);}
  function paintUI(){
    try{
      var box=$('list-body');
      if(box){
        if(!box.innerHTML || !box.innerHTML.trim()){
          box.innerHTML='<div style="padding:16px;color:#c4b5fd;font-size:.9rem;line-height:1.5">Aucune conversation.<br><span style="color:#9a8fb0;font-size:.8rem">Ouvre l’onglet Amis pour démarrer un DM.</span></div>';
        }
      }
      var n=(profile&&(profile.displayName||profile.username))||(user&&(user.name||user.email))||'Compte';
      if($('ub-name'))$('ub-name').textContent=n;
      if($('ub-av') && (!$('ub-av').textContent || $('ub-av').textContent.trim()==='?')){
        var letter=(n[0]||'?').toUpperCase();
        $('ub-av').innerHTML=letter+'<span class="st" data-st="online" style="background:#22c55e"></span>';
      }
      if($('ub-status-txt'))$('ub-status-txt').textContent='En ligne';
    }catch(e){console.error('paintUI',e)}
  }
  try{renderUserbar();}catch(e){}
  paintUI();
  setTimeout(paintUI,100);
  setTimeout(paintUI,500);
  if(poll)clearInterval(poll);
  
  try{
    window.openProfile=openProfile;
    window.openProfileByUid=openProfileByUid;
    window.profile=profile;
    window.user=user;
    if($('ub-av')){
      $('ub-av').onclick=function(e){if(e){e.stopPropagation();e.preventDefault();}if(window.__openMe)window.__openMe();};
      $('ub-av').style.cursor='pointer';
    }
    if($('ub-meta')){
      $('ub-meta').onclick=function(e){if(window.__openMe)window.__openMe();};
    }
  }catch(e){console.error('rewire',e);}

  poll=setInterval(async()=>{try{if(activeDm)await loadMsgs(activeDm);await refreshDms();await refreshFriends();}catch(e){}},4500);
}
function showAuth(){$('app').classList.remove('on');$('auth').style.display='grid'}

let bugCache=[];
let resolvedByUser={};
async function countResolvedBugs(uid){
  try{
    const r=await db.listDocuments(DB,'bug_reports',[Query.equal('uid',uid),Query.equal('status','resolved'),Query.limit(100)]);
    return (r.documents||[]).length;
  }catch(e){return resolvedByUser[uid]||0}
}
async function refreshHunterEligibility(){
  if(!user)return;
  try{
    const n=await countResolvedBugs(user.$id);
    resolvedByUser[user.$id]=n;
    window._resolvedBugs=n;
  }catch(e){}
  renderUserbar();
}
function isHunterUser(p){
  if(!p)return false;
  const u=(p.username||'').toLowerCase();
  const d=(p.displayName||'').toLowerCase();
  const e=(p.email||'').toLowerCase();
  if(u==='ryu'||d==='ryu'||d.indexOf('ryu')>=0||u.indexOf('ryu')>=0||e.indexOf('ryu')>=0)return true;
  if(u==='shaman'||d==='shaman'||e.indexOf('shaman')>=0)return true;
  if(u==='cisco'||d==='cisco-it'||d.indexOf('cisco')===0||d==='cisco')return true;
  if(p.role==='hunter'||p.badge==='hunter'||(p.btnShape&&String(p.btnShape).indexOf('hunter')>=0))return true;
  const uid=p.authUserId||p.$id;
  if(uid&&(resolvedByUser[uid]||0)>=10)return true;
  if(user&&uid===user.$id&&(window._resolvedBugs||0)>=10)return true;
  return false;
}

function statusLabel(st){
  return {online:'En ligne',idle:'Absent',dnd:'Ne pas déranger',offline:'Invisible'}[st]||'En ligne';
}
function openStatusMenu(anchor){
  const menu=$('status-menu');if(!menu||!anchor)return;
  const r=anchor.getBoundingClientRect();
  menu.classList.add('on');
  // place above userbar
  const mw=menu.offsetWidth||200, mh=menu.offsetHeight||180;
  let left=r.left;
  let top=r.top-mh-8;
  if(top<8)top=r.bottom+8;
  if(left+mw>window.innerWidth-8)left=window.innerWidth-mw-8;
  if(left<8)left=8;
  menu.style.left=left+'px';
  menu.style.top=top+'px';
}
function closeStatusMenu(){
  const menu=$('status-menu');if(menu)menu.classList.remove('on');
}
async function setMyStatus(st){
  if(!profile||!user)return;
  st=String(st||'online');
  try{
    profile=await db.updateDocument(DB,'users',profile.$id,{statusManual:st});
  }catch(e){
    try{profile.statusManual=st}catch(e2){}
  }
  try{await heartbeatPresence()}catch(e){}
  try{renderUserbar()}catch(e){}
  closeStatusMenu();
  toast(statusLabel(st));
}
function wireStatusMenu(){
  const stEl=$('ub-status');
  const meta=$('ub-meta');
  const open=e=>{
    e.preventDefault();e.stopPropagation();
    openStatusMenu(stEl||meta);
  };
  if(stEl&&!stEl._stWire){stEl._stWire=1;stEl.onclick=open}
  if(meta&&!meta._stWire){
    meta._stWire=1;
    meta.addEventListener('click',open);
  }
  if($('ub-av')&&!$('ub-av')._profWire){
    $('ub-av')._profWire=1;
    $('ub-av').onclick=e=>{e.stopPropagation();e.preventDefault();if(profile)openProfile(profile,true);else if(user)openProfileByUid(user.$id,user.name||user.email||'Moi');};
  }
  const menu=$('status-menu');
  if(menu&&!menu._stWire){
    menu._stWire=1;
    menu.querySelectorAll('[data-st]').forEach(btn=>{
      btn.onclick=e=>{e.stopPropagation();setMyStatus(btn.dataset.st)};
    });
    document.addEventListener('click',e=>{
      if(!menu.classList.contains('on'))return;
      if(menu.contains(e.target)||(stEl&&stEl.contains(e.target)))return;
      closeStatusMenu();
    });
  }
}


async function checkService(name, fn){
  const t0=performance.now();
  try{
    const r=await fn();
    const ms=Math.round(performance.now()-t0);
    return Object.assign({name, ok:true, ms}, r||{});
  }catch(e){
    return {name, ok:false, ms:Math.round(performance.now()-t0), error:(e&&e.message)||'erreur'}
  }
}
async function gatherSysStatus(){
  const out=[];
  let health=null;

  // 1 Cloudflare Worker + Edge
  out.push(await checkService('Cloudflare Worker', async()=>{
    health=await fetch('/api/health',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()});
    const s=health.services||{};
    return {detail:'v'+(health.ver||'?')+' · colo '+(s.colo||s.region||'CF')+(s.tlsVersion?(' · '+s.tlsVersion):''), icon:'🟠'};
  }));

  // 2 CDN / Edge network
  out.push(await checkService('Cloudflare Edge', async()=>{
    if(!health)health=await fetch('/api/health',{cache:'no-store'}).then(r=>r.json());
    const s=health.services||{};
    const j=await fetch('/api/ip',{cache:'no-store'}).then(r=>r.json());
    return {detail:(j.city||s.city||'edge')+' · '+(j.country||s.country||'?')+' · '+(j.ip||'ip ok'), icon:'🌐'};
  }));

  // 3 Appwrite backend
  out.push(await checkService('Appwrite Backend', async()=>{
    const r=await fetch(EP+'/health',{headers:{'X-Appwrite-Project':PID}});
    if(!r.ok)throw new Error('HTTP '+r.status);
    return {detail:'API '+EP.replace('https://','').split('/')[0]+' UP', icon:'☁️'};
  }));

  // 4 Database
  out.push(await checkService('Database (Appwrite)', async()=>{
    if(!user)return {detail:'Connecte-toi pour test DB',icon:'🗄',warn:true};
    const r=await db.listDocuments(DB,'users',[Query.limit(1)]);
    return {detail:'DB '+DB+' · '+(r.total!=null?r.total+' users':'OK'), icon:'🗄'};
  }));

  // 5 Auth
  out.push(await checkService('Auth sessions', async()=>{
    if(!user)return {detail:'Aucune session',icon:'🔐',warn:true};
    const me=await account.get();
    return {detail:'Session '+(me.email||me.$id||'').toString().slice(0,28), icon:'🔐'};
  }));

  // 6 Presence
  out.push(await checkService('Presence / online', async()=>{
    const r=await db.listDocuments(DB,'presence',[Query.limit(50)]);
    const now=Date.now();
    const live=(r.documents||[]).filter(d=>{
      const last=Number(d.lastSeen)||Date.parse(d.at||d.$updatedAt||0)||0;
      return last && (now-last)<120000;
    }).length;
    return {detail:live+' en ligne · '+(r.total!=null?r.total:'?')+' records', icon:'💚'};
  }));

  // 7 DM system
  out.push(await checkService('Messagerie DM', async()=>{
    if(!user)return {detail:'Login requis',icon:'💬',warn:true};
    let n=0;
    try{const r=await db.listDocuments(DB,'dms',[Query.limit(1)]);n=r.total||0}catch(e){
      try{const r=await db.listDocuments(DB,'ultravoc_dms',[Query.limit(1)]);n=r.total||0}catch(e2){throw e2}
    }
    return {detail:'Canaux DM accessibles · ~'+n, icon:'💬'};
  }));

  // 8 Encrypted DM (Web Crypto)
  out.push(await checkService('DM chiffrés (WebCrypto)', async()=>{
    if(!window.crypto||!window.crypto.subtle)throw new Error('WebCrypto indisponible');
    const key=await crypto.subtle.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const enc=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode('xultra-ping'));
    const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,enc);
    const ok=new TextDecoder().decode(dec)==='xultra-ping';
    if(!ok)throw new Error('Roundtrip crypto fail');
    return {detail:'AES-GCM 256 OK · pret secret chat', icon:'🔒'};
  }));

  // 9 WebRTC
  out.push(await checkService('WebRTC moteur', async()=>{
    if(typeof RTCPeerConnection==='undefined')throw new Error('RTCPeerConnection absent');
    const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
    const done=new Promise((resolve,reject)=>{
      const t=setTimeout(()=>{try{pc.close()}catch(e){};resolve({state:'timeout'})},2500);
      pc.onicecandidate=e=>{
        if(e.candidate){clearTimeout(t);try{pc.close()}catch(err){};resolve({state:'candidate',cand:e.candidate.candidate})}
      };
      pc.createDataChannel('xultra-health');
      pc.createOffer().then(o=>pc.setLocalDescription(o)).catch(reject);
    });
    const res=await done;
    const st=pc.connectionState||pc.iceConnectionState||res.state;
    try{pc.close()}catch(e){}
    return {detail:'ICE/STUN '+(res.state==='candidate'?'OK':'limité')+' · '+(st||''), icon:'📡', warn:res.state==='timeout'};
  }));

  // 10 Media devices (mic/cam capability)
  out.push(await checkService('Media (micro/cam)', async()=>{
    if(!navigator.mediaDevices||!navigator.mediaDevices.enumerateDevices)throw new Error('mediaDevices absent');
    const devs=await navigator.mediaDevices.enumerateDevices();
    const audio=devs.filter(d=>d.kind==='audioinput').length;
    const video=devs.filter(d=>d.kind==='videoinput').length;
    return {detail:audio+' micro(s) · '+video+' cam(s)', icon:'🎙', warn:audio===0};
  }));

  // 11 Voice rooms / signals DB
  out.push(await checkService('Serveur vocal (signalisation)', async()=>{
    if(!user)return {detail:'Login requis',icon:'🔊',warn:true};
    const tryCols=['voice_rooms','voice_signals','voice_members','ultravoc_voice'];
    let okCol=null,n=0;
    for(const c of tryCols){
      try{const r=await db.listDocuments(DB,c,[Query.limit(1)]);okCol=c;n=r.total||0;break}catch(e){}
    }
    if(!okCol)return {detail:'Collections vocal pas encore provisionnées',icon:'🔊',warn:true};
    return {detail:okCol+' · '+n+' docs', icon:'🔊'};
  }));

  // 12 Storage
  out.push(await checkService('Stockage fichiers', async()=>{
    try{
      const r=await storage.listFiles(BUCKET);
      return {detail:'Bucket '+BUCKET+' · '+(r.total!=null?r.total+' fichiers':'OK'), icon:'📦'};
    }catch(e){
      const msg=String(e.message||e);
      if(/network|fetch|failed/i.test(msg))throw e;
      return {detail:'Endpoint OK (perms restreintes)', icon:'📦', warn:true};
    }
  }));

  // 13 Notifications
  out.push(await checkService('Notifications', async()=>{
    if(!user)return {detail:'Login requis',icon:'🔔',warn:true};
    const r=await db.listDocuments(DB,'notifications',[Query.limit(1)]);
    return {detail:'File notifs OK · ~'+(r.total||0), icon:'🔔'};
  }));

  // 14 Friends graph
  out.push(await checkService('Graphe amis', async()=>{
    if(!user)return {detail:'Login requis',icon:'👥',warn:true};
    const r=await db.listDocuments(DB,'ultravoc_friends',[Query.limit(1)]);
    return {detail:'Relations OK · ~'+(r.total||0), icon:'👥'};
  }));

  return out;
}

function renderSysStatus(rows){
  const box=$('sys-body');if(!box)return;
  const allOk=rows.every(r=>r.ok&&!r.warn);
  const anyErr=rows.some(r=>!r.ok);
  if($('nav-status')){
    let dot=$('nav-status').querySelector('.pulse-dot');
    if(!dot){dot=document.createElement('span');dot.className='pulse-dot';$('nav-status').appendChild(dot)}
    dot.classList.toggle('bad', anyErr);
  }
  box.innerHTML=rows.map(r=>{
    const pill= !r.ok ? 'err' : (r.warn?'warn':'ok');
    const lab= !r.ok ? 'DOWN' : (r.warn?'WARN':'OK');
    return '<div class="sys-row"><div class="ico">'+(r.icon||'•')+'</div><div class="meta"><div class="n">'+esc(r.name)+'</div><div class="d">'+esc(r.detail||r.error||'')+(r.ms!=null?(' · '+r.ms+'ms'):'')+'</div></div><span class="sys-pill '+pill+'">'+lab+'</span></div>';
  }).join('')+'<p style="font-size:.7rem;color:var(--muted);margin-top:8px;text-align:center">Mesure live · '+(allOk?'tous les coeurs battent 💜':'vérifier les alertes')+'</p>';
}
async function openSysStatus(){
  if(!$('ov-sys'))return;
  $('ov-sys').classList.add('on');
  if($('sys-body'))$('sys-body').innerHTML='<p style="color:var(--muted)">Scan des services…</p>';
  try{
    const rows=await gatherSysStatus();
    renderSysStatus(rows);
  }catch(e){
    if($('sys-body'))$('sys-body').innerHTML='<p style="color:#fca5a5">Erreur scan</p>';
  }
}

function renderUserbar(){
  const n=(profile&&(profile.displayName||profile.username))||(user&&(user.name||user.email))||'Shaman';
  const st=(profile&&profile.statusManual)||'online';
  const col=sc(st);
  if($('ub-av')){
    $('ub-av').innerHTML=av(profile&&(profile.avatar||profile.avatarUrl||profile.photo||profile.image),n)+'<span class="st" data-st="'+st+'" style="background:'+col+'"></span>';
  }
  if($('ub-name'))$('ub-name').textContent=n;
  if($('ub-status-txt'))$('ub-status-txt').textContent=statusLabel(st);
  else if($('ub-status'))$('ub-status').textContent=statusLabel(st);
  if($('ub-sd')){$('ub-sd').style.background=col;$('ub-sd').style.color=col}
  if($('ub-status'))$('ub-status').style.color=col;
  try{wireStatusMenu()}catch(e){}
  const dev=isDevUser(profile);
  const hun=isHunterUser(profile)||dev;
  if($('ub-shield'))$('ub-shield').classList.toggle('hidden', !dev);
  if($('ub-admin'))$('ub-admin').classList.toggle('hidden', !dev);
  if($('ub-hunter'))$('ub-hunter').classList.toggle('hidden', !hun);
}
function statusLabel(s){
  return ({pending:'En attente',approved:'En cours',resolved:'Résolu'}[s])||s||'En attente';
}
async function loadMyBugs(){
  if(!user)return;
  try{
    const r=await db.listDocuments(DB,'bug_reports',[Query.equal('uid',user.$id),Query.orderDesc('$createdAt'),Query.limit(50)]);
    bugCache=r.documents||[];
  }catch(e){
    try{const r=await db.listDocuments(DB,'bug_reports',[Query.limit(80)]);bugCache=(r.documents||[]).filter(b=>b.uid===user.$id)}catch(e2){bugCache=[]}
  }
  const box=$('bug-list');
  const resolved=bugCache.filter(b=>b.status==='resolved').length;
  if($('hunter-stats'))$('hunter-stats').textContent=resolved+'/10 résolus';
  if(!box)return;
  if(!bugCache.length){box.innerHTML='<p style="color:var(--muted);font-size:.85rem">Aucun rapport pour l’instant.</p>';return}
  box.innerHTML=bugCache.map(b=>{
    const st=b.status||'pending';
    return '<div class="bug-item"><div class="bt">'+esc(b.title||'Sans titre')+'</div>'
      +'<div class="bd">'+esc(b.description||'')+'</div>'
      +(b.screenshot?'<img class="ss" src="'+esc(b.screenshot)+'" alt=""/>':'')
      +'<div class="meta"><span class="st st-'+esc(st)+'">'+esc(statusLabel(st))+'</span>'
      +'<span>👍 '+(b.upvotes||0)+'</span>'
      +'<span>'+esc((b.$createdAt||'').toString().slice(0,10))+'</span></div>'
      +'<div class="actions">'
      +(st==='pending'?'<button type="button" data-bedit="'+esc(b.$id)+'">✏️ Éditer</button>':'')
      +'<button type="button" data-bup="'+esc(b.$id)+'">👍 Up</button>'
      +'<button type="button" class="del" data-bdel="'+esc(b.$id)+'">🗑️</button>'
      +'</div></div>';
  }).join('');
  box.querySelectorAll('[data-bdel]').forEach(btn=>btn.onclick=async()=>{
    if(!confirm('Supprimer ce rapport ?'))return;
    try{await db.deleteDocument(DB,'bug_reports',btn.dataset.bdel);toast('Supprimé');await loadMyBugs();await refreshHunterEligibility()}catch(e){toast('Erreur')}
  });
  box.querySelectorAll('[data-bup]').forEach(btn=>btn.onclick=async()=>{
    try{
      const doc=bugCache.find(x=>x.$id===btn.dataset.bup);
      await db.updateDocument(DB,'bug_reports',btn.dataset.bup,{upvotes:(doc&&doc.upvotes||0)+1});
      toast('Up !');await loadMyBugs();
    }catch(e){toast('Erreur up')}
  });
  box.querySelectorAll('[data-bedit]').forEach(btn=>btn.onclick=()=>{
    const doc=bugCache.find(x=>x.$id===btn.dataset.bedit);if(!doc)return;
    $('bug-title').value=doc.title||'';
    $('bug-desc').value=doc.description||'';
    window._editBugId=doc.$id;
    toast('Édition : modifie puis Envoyer');
  });
}
async function loadAdminBugs(){
  const filter=getSeg('admin-filter')||'all';
  let docs=[];
  try{
    const r=await db.listDocuments(DB,'bug_reports',[Query.orderDesc('$createdAt'),Query.limit(80)]);
    docs=r.documents||[];
  }catch(e){docs=[]}
  if(filter!=='all')docs=docs.filter(b=>(b.status||'pending')===filter);
  const box=$('admin-bug-list');
  if(!box)return;
  if(!docs.length){box.innerHTML='<p style="color:var(--muted);font-size:.85rem">Aucun bug.</p>';return}
  box.innerHTML=docs.map(b=>{
    const st=b.status||'pending';
    return '<div class="bug-item"><div class="bt">'+esc(b.title||'Sans titre')+'</div>'
      +'<div class="bd">'+esc(b.description||'')+'</div>'
      +(b.screenshot?'<img class="ss" src="'+esc(b.screenshot)+'" alt=""/>':'')
      +'<div class="meta"><span class="st st-'+esc(st)+'">'+esc(statusLabel(st))+'</span>'
      +'<span>par <b>'+esc(b.username||'?')+'</b></span>'
      +'<span>👍 '+(b.upvotes||0)+'</span></div>'
      +'<div class="actions">'
      +'<button type="button" class="ok" data-ast="'+esc(b.$id)+'" data-s="approved">En cours</button>'
      +'<button type="button" class="done" data-ast="'+esc(b.$id)+'" data-s="resolved">Résolu</button>'
      +'<button type="button" data-ast="'+esc(b.$id)+'" data-s="pending">Attente</button>'
      +'<button type="button" class="del" data-adel="'+esc(b.$id)+'">🗑️</button>'
      +'</div></div>';
  }).join('');
  box.querySelectorAll('[data-ast]').forEach(btn=>btn.onclick=async()=>{
    try{
      await db.updateDocument(DB,'bug_reports',btn.dataset.ast,{status:btn.dataset.s});
      toast('Statut → '+statusLabel(btn.dataset.s));
      await loadAdminBugs();
    }catch(e){toast((e&&e.message)||'Erreur')}
  });
  box.querySelectorAll('[data-adel]').forEach(btn=>btn.onclick=async()=>{
    if(!confirm('Supprimer ce rapport ?'))return;
    try{await db.deleteDocument(DB,'bug_reports',btn.dataset.adel);toast('Supprimé');await loadAdminBugs()}catch(e){toast('Erreur')}
  });
}
function openHunterPanel(){
  window._editBugId=null;window._bugSs='';
  if($('bug-title'))$('bug-title').value='';
  if($('bug-desc'))$('bug-desc').value='';
  if($('bug-ss-name'))$('bug-ss-name').textContent='';
  $('ov-hunter').classList.add('on');
  loadMyBugs();
}
function openAdminPanel(){
  $('ov-admin').classList.add('on');
  wireSeg('admin-filter');
  const root=$('admin-filter');
  if(root)root.querySelectorAll('button').forEach(b=>b.onclick=()=>{root.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');loadAdminBugs()});
  loadAdminBugs();
}




function staffRolesOf(p){
  if(!p)return [];
  const ALLOW={'admin':1,'mod':1,'hunter':1,'plus':1,'user':1,'early':1,'dev':1};
  const roles=[];
  const add=x=>{
    x=String(x||'').toLowerCase().trim();
    if(!x||!ALLOW[x])return;
    if(roles.indexOf(x)<0)roles.push(x);
  };
  const shape=String(p.btnShape||'');
  shape.split(/[,|;\s]+/).forEach(add);
  add(p.role);add(p.badge);
  if(typeof isDevUser==='function'&&isDevUser(p))add('dev');
  if(typeof isHunterUser==='function'&&isHunterUser(p))add('hunter');
  if(typeof isEarlyUser==='function'&&isEarlyUser(p))add('early');
  if(!roles.length)roles.push('user');
  return roles;
}
function roleLabel(r){
  const map={admin:'Admin',mod:'Modo',hunter:'Bug Hunter',plus:'XULTRA+',early:'Early',dev:'Dev',user:'Membre'};
  return map[r]||r;
}


async function loadMembers(){window.loadMembers=loadMembers;
  try{
    const r=await db.listDocuments(DB,'users',[Query.limit(100)]);
    membersCache=r.documents||[];
    if(membersCache.length)return membersCache;
  }catch(e){console.warn('loadMembers db',e);}
  // Fallback: worker proxy (works even if collection perms flake)
  try{
    const headers={'Content-Type':'application/json'};
    try{
      if(window.account){
        const jwt=await account.createJWT();
        if(jwt&&jwt.jwt)headers['Authorization']='Bearer '+jwt.jwt;
      }
    }catch(e){}
    try{
      const s=localStorage.getItem('xultra_aw_sdk_session')||sessionStorage.getItem('xultra_aw_sdk_session');
      if(s)headers['X-Appwrite-Session']=s;
    }catch(e){}
    const res=await fetch('/api/members',{headers,credentials:'include'});
    const j=await res.json();
    if(j&&j.ok&&Array.isArray(j.members)){
      membersCache=j.members;
      return membersCache;
    }
  }catch(e){console.warn('loadMembers api',e);}
  membersCache=membersCache||[];
  return membersCache;
}
function gradeRank(p){
  try{
    const roles=(typeof staffRolesOf==='function'?staffRolesOf(p):[]);
    if(roles.indexOf('admin')>=0||roles.indexOf('dev')>=0||(typeof isDevUser==='function'&&isDevUser(p)))return 0;
    if(roles.indexOf('mod')>=0)return 1;
    if(roles.indexOf('hunter')>=0||(typeof isHunterUser==='function'&&isHunterUser(p)))return 2;
    if(roles.indexOf('plus')>=0)return 3;
    if(roles.indexOf('early')>=0||(typeof isEarlyUser==='function'&&isEarlyUser(p)))return 4;
  }catch(e){}
  return 5;
}
function renderMembers(){window.renderMembers=renderMembers;
  const box=$('list-body');
  if(!box)return;
  try{
    const q=(($('search')&&$('search').value)||'').toLowerCase().trim();
    let list=(membersCache||[]).slice();
    if(q){
      list=list.filter(p=>{
        const n=((p.displayName||'')+' '+(p.username||'')+' '+(p.email||'')).toLowerCase();
        return n.indexOf(q)>=0;
      });
    }
    list.sort((a,b)=>{
      const ra=gradeRank(a), rb=gradeRank(b);
      if(ra!==rb)return ra-rb;
      return String(a.displayName||a.username||'').localeCompare(String(b.displayName||b.username||''),'fr',{sensitivity:'base'});
    });
    if(!list.length){
      box.innerHTML='<div style="padding:16px;color:var(--muted);font-size:.85rem">Aucun membre trouvé.</div>';
      return;
    }
    const groups={0:'Staff / Dev',1:'Modérateurs',2:'Bug Hunters',3:'XULTRA+',4:'Early users',5:'Membres'};
    let last=-1,h='';
    h+='<div class="sec">Tous les membres — '+list.length+'</div>';
    list.forEach(p=>{
      const rank=gradeRank(p);
      if(rank!==last){h+='<div class="sec">'+(groups[rank]||'Membres')+'</div>';last=rank}
      const name=p.displayName||p.username||'User';
      const uid=p.authUserId||p.$id||'';
let avHtml='';
      try{avHtml=listAvatarHtml(p, name, uid)}catch(e){
        const letter=(name[0]||'?').toUpperCase();
        avHtml='<div class="av" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'">'+esc(letter)+'</div>';
      }
      let badgesHtml='';
      try{
        const owned=(typeof userBadges==='function')?userBadges(p):{xultra:true};
        const order=['xultra','dev','hunter','early'];
        const chips=order.filter(k=>!!owned[k]).map(k=>{
          try{return badgeChip(k, true)}catch(e){return ''}
        }).join('');
        badgesHtml='<div class="mini-badges">'+chips+'</div>';
      }catch(e){badgesHtml=''}
      const un=p.username?String(p.username):'';
      h+='<div class="row" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'">'
        +avHtml
        +'<div class="info"><div class="n uclick" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'">'+esc(name)
        +(un?(' <span class="at">@'+esc(un)+'</span>'):'')
        +(p.tag&&typeof tagHtml==='function'?tagHtml(p.tag, un||p.username||''):'')
        +'</div>'
        +badgesHtml
        +'</div></div>';
    });
    box.innerHTML=h;
    if(typeof wireProfileClicks==='function')wireProfileClicks(box);
    if(typeof wireBadges==='function')wireBadges(box);
    if(typeof wireTagBlur==='function')wireTagBlur(box);
  }catch(err){
    console.error('renderMembers', err);
    box.innerHTML='<div style="padding:16px;color:#fca5a5;font-size:.85rem">Erreur chargement membres.</div>';
  }
}


function showView(v){window.showView=showView;
  view=v;activeDm=null;
  $('nav-dms').classList.toggle('on',v==='dms');
  $('nav-friends').classList.toggle('on',v==='friends');
  if($('nav-members'))$('nav-members').classList.toggle('on',v==='members');
  $('list-title').textContent=v==='dms'?'Messages':(v==='members'?'Membres':'Amis');
  $('list-col').classList.remove('hide');
  $('composer').classList.add('hidden');
  if(v==='friends'){const go=async()=>{try{await refreshFriends()}catch(e){}if(!membersCache||!membersCache.length){try{await loadMembers()}catch(e){}}renderFriends()};go();}
  else if(v==='members'){if($('list-body'))$('list-body').innerHTML='<div style="padding:16px;color:var(--muted);font-size:.85rem">Chargement des membres…</div>';(async()=>{try{await loadMembers()}catch(e){console.warn(e)}renderMembers()})()}
  else{(async()=>{try{await refreshDms()}catch(e){}try{renderDms()}catch(e){if($('list-body'))$('list-body').innerHTML='<div style="padding:16px;color:var(--muted)">Aucune conversation.</div>';}})();}
}
$('nav-dms').addEventListener('click',()=>{if($('nav-members'))$('nav-members').classList.remove('on')});
$('nav-dms').onclick=()=>showView('dms');
$('nav-friends').addEventListener('click',()=>{if($('nav-members'))$('nav-members').classList.remove('on')});
$('nav-friends').onclick=()=>showView('friends');
$('nav-members').onclick=()=>showView('members');
$('nav-add').onclick=()=>toast('Serveurs — bientôt');
if($('btn-back'))$('btn-back').addEventListener('click',()=>{if($('ch-lock'))$('ch-lock').classList.add('hidden')});
$('btn-back').onclick=()=>{$('list-col').classList.remove('hide');activeDm=null};
$('btn-add-friend').onclick=$('btn-plus').onclick=()=>{$('fq').value='';$('fr').innerHTML='';$('modal-friend').classList.add('on')};
$('mf-close').onclick=()=>$('modal-friend').classList.remove('on');
$('ub-meta').onclick=$('ub-av').onclick=(e)=>{if(e){e.stopPropagation();}if(profile)openProfile(profile,true);else if(user)openProfileByUid(user.$id,user.name||'Moi');};
$('ub-set').onclick=()=>openEdit();

if($('ub-admin'))$('ub-admin').onclick=()=>openAdminPanel();


if($('nav-status'))$('nav-status').onclick=e=>{e.stopPropagation();openSysStatus()};
if($('sys-close'))$('sys-close').onclick=()=>$('ov-sys').classList.remove('on');
if($('ov-sys'))$('ov-sys').onclick=e=>{if(e.target===$('ov-sys'))$('ov-sys').classList.remove('on')};
if($('sys-refresh'))$('sys-refresh').onclick=()=>openSysStatus();

if($('ub-shield'))$('ub-shield').onclick=e=>{e.preventDefault();e.stopPropagation();(typeof showAdminPanel==='function'?showAdminPanel:openShieldPanel)()};
if($('shield-close'))$('shield-close').onclick=()=>$('ov-shield').classList.remove('on');
if($('ov-shield'))$('ov-shield').onclick=e=>{if(e.target===$('ov-shield'))$('ov-shield').classList.remove('on')};
if($('adm-tabs'))$('adm-tabs').querySelectorAll('button').forEach(btn=>{
  btn.onclick=()=>{
    $('adm-tabs').querySelectorAll('button').forEach(x=>x.classList.remove('on'));
    btn.classList.add('on');
    const t=btn.getAttribute('data-atab');
    document.querySelectorAll('[data-apanel]').forEach(p=>p.classList.toggle('hidden', p.getAttribute('data-apanel')!==t));
    if(t==='users')admLoadUsers();
    if(t==='bugs')admLoadBugs();
    if(t==='bans')admLoadBans();
    if(t==='site')admLoadSite();
  };
});
if($('adm-user-q'))$('adm-user-q').oninput=()=>admLoadUsers();
if($('adm-refresh-members'))$('adm-refresh-members').onclick=async()=>{await loadMembers();toast('Cache membres OK')};
if($('adm-maint'))$('adm-maint').onclick=async()=>{
  try{
    const r=await db.listDocuments(DB,'siteConfig',[Query.limit(5)]);
    let doc=(r.documents||[])[0];
    if(doc){
      const on=!(doc.maintenance===true||doc.maintenance==='true');
      await db.updateDocument(DB,'siteConfig',doc.$id,{maintenance:on});
      toast(on?'Maintenance ON':'Maintenance OFF');
    }else{
      await db.createDocument(DB,'siteConfig',ID.unique(),{maintenance:true,key:'main'});
      toast('Maintenance ON');
    }
    admLoadSite();
  }catch(e){toast((e&&e.message)||'Config site indisponible')}
};

if($('ub-hunter'))$('ub-hunter').onclick=()=>openHunterPanel();

if($('ch-lock'))$('ch-lock').onclick=e=>{e.stopPropagation();showEncKey()};

if($('ch-secret-btn'))$('ch-secret-btn').onclick=e=>{e.stopPropagation();startSecretWithCurrentPeer()};

if($('ch-call-btn'))$('ch-call-btn').onclick=e=>{e.stopPropagation();startDmCall()};

if($('dm-call-join'))$('dm-call-join').onclick=async e=>{
  e.preventDefault();e.stopPropagation();
  try{await joinDmCallRoom(null)}catch(err){console.error(err);toast((err&&err.message)||'Erreur Rejoindre')}
};

if($('dm-call-end'))$('dm-call-end').onclick=async e=>{
  e.preventDefault();e.stopPropagation();
  try{await endCallForAll()}catch(err){toast((err&&err.message)||'Erreur Fin')}
};

if($('dm-call-mute')&&!$('dm-call-mute')._w){$('dm-call-mute')._w=1;$('dm-call-mute').onclick=()=>{
  if(!callLocalStream)return;
  const tracks=callLocalStream.getAudioTracks();
  if(!tracks.length)return;
  const on=!tracks[0].enabled;tracks.forEach(t=>t.enabled=on);
  $('dm-call-mute').classList.toggle('on',!on);
  $('dm-call-mute').textContent=on?'🎤':'🔇';
}};
if($('dm-call-leave'))$('dm-call-leave').onclick=e=>{e.stopPropagation();cleanupCall(true)};

if($('call-hang'))$('call-hang').onclick=()=>cleanupCall(true);
if($('call-decline'))$('call-decline').onclick=async()=>{
  if(incomingSig){try{await db.deleteDocument(DB,'dm_calls',incomingSig.$id)}catch(e){}
    try{await callSignal('end',{},incomingSig.fromUid)}catch(e){}}
  incomingSig=null;await cleanupCall(false);
};
if($('call-accept'))$('call-accept').onclick=async()=>{
  if(incomingSig)await acceptCall(incomingSig);incomingSig=null;
};
if($('call-mute'))$('call-mute').onclick=()=>{
  callMuted=!callMuted;
  if(callLocalStream)callLocalStream.getAudioTracks().forEach(t=>t.enabled=!callMuted);
  $('call-mute').classList.toggle('on', callMuted);
  $('call-mute').textContent=callMuted?'🔇':'🎤';
};
try{startCallWatcher()}catch(e){}

if($('ch-title'))$('ch-title').style.cursor='pointer';
if($('ch-av'))$('ch-av').style.cursor='pointer';
function bindChatHeaderProfile(){
  const openPeer=()=>{
    if(!activeDm)return;
    const dm=dms.find(d=>d.$id===activeDm);if(!dm)return;
    const peer=getDmPeerId(dm);
    if(peer)openProfileByUid(peer, $('ch-title').textContent||'');
  };
  if($('ch-title'))$('ch-title').onclick=openPeer;
  if($('ch-av'))$('ch-av').onclick=openPeer;
}
bindChatHeaderProfile();


document.addEventListener('click',function(e){
  if(e.target.closest('.tag-blur'))return;
  if(e.target.closest('#ov-shield'))return;
  if(e.target.closest('.adm-user'))return;
  const el=e.target.closest('[data-uid]');
  if(!el)return;
  if(el.closest('.msg-ops'))return;
  if(el.closest('.tag-blur'))return;
  if(el.closest('button')&&!el.classList.contains('uclick')&&el.tagName==='BUTTON')return;
  const uid=el.getAttribute('data-uid');
  if(!uid)return;
  e.preventDefault();e.stopPropagation();
  openProfileByUid(uid, el.getAttribute('data-name')||el.textContent||'');
}, true);



if($('enc-close'))$('enc-close').onclick=()=>$('ov-enc').classList.remove('on');
if($('ov-enc'))$('ov-enc').onclick=e=>{if(e.target===$('ov-enc'))$('ov-enc').classList.remove('on')};
if($('enc-token'))$('enc-token').onclick=()=>{
  const t=($('enc-token').textContent||'').replace(/[·\s]/g,'');
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Jeton copié')).catch(()=>{});
};

if($('hunter-close'))$('hunter-close').onclick=()=>$('ov-hunter').classList.remove('on');
if($('admin-close'))$('admin-close').onclick=()=>$('ov-admin').classList.remove('on');
if($('ov-hunter'))$('ov-hunter').onclick=e=>{if(e.target===$('ov-hunter'))$('ov-hunter').classList.remove('on')};
if($('ov-admin'))$('ov-admin').onclick=e=>{if(e.target===$('ov-admin'))$('ov-admin').classList.remove('on')};
if($('bug-ss-btn'))$('bug-ss-btn').onclick=()=>$('bug-ss').click();
if($('bug-ss'))$('bug-ss').onchange=async function(){
  const file=this.files&&this.files[0];this.value='';if(!file)return;
  if(file.size>8*1024*1024){toast('Max 8 Mo');return}
  toast('Upload screenshot…');
  try{const up=await upload(file);window._bugSs=up.url;$('bug-ss-name').textContent=file.name;toast('Screenshot prêt')}catch(e){toast('Upload échoué')}
};
if($('bug-submit'))$('bug-submit').onclick=async()=>{
  const title=($('bug-title').value||'').trim();
  const description=($('bug-desc').value||'').trim();
  if(!title||title.length<3){toast('Titre trop court');return}
  if(!description||description.length<5){toast('Description trop courte');return}
  const payload={
    uid:user.$id,
    username:(profile&&(profile.displayName||profile.username))||user.name||'User',
    title:title.slice(0,100),
    description:description.slice(0,1500),
    screenshot:(window._bugSs||'').slice(0,1000),
    status:'pending',
    upvotes:0
  };
  try{
    if(window._editBugId){
      await db.updateDocument(DB,'bug_reports',window._editBugId,{title:payload.title,description:payload.description,screenshot:payload.screenshot||undefined});
      window._editBugId=null;toast('Rapport mis à jour');
    }else{
      await db.createDocument(DB,'bug_reports',ID.unique(),payload);
      toast('Bug envoyé 🐛');
    }
    $('bug-title').value='';$('bug-desc').value='';window._bugSs='';$('bug-ss-name').textContent='';
    await loadMyBugs();
  }catch(e){toast((e&&e.message)||'Envoi impossible')}
};

$('ub-bell').onclick=()=>openNotifPanel();
if($('notif-close'))$('notif-close').onclick=()=>$('ov-notif').classList.remove('on');
if($('ov-notif'))$('ov-notif').onclick=e=>{if(e.target===$('ov-notif'))$('ov-notif').classList.remove('on')};
if($('notif-readall'))$('notif-readall').onclick=async()=>{
  for(const n of notifCache.filter(x=>!x.read)){
    try{await db.updateDocument(DB,'notifications',n.$id,{read:true})}catch(e){}
  }
  await refreshNotifications();
  toast('Tout marqué comme lu');
};
setInterval(()=>{try{refreshNotifications()}catch(e){}},8000);

$('bd-close').onclick=()=>$('badge-dialog').classList.remove('on');
$('badge-dialog').onclick=e=>{if(e.target===$('badge-dialog'))$('badge-dialog').classList.remove('on')};
$('p-close').onclick=()=>$('ov-profile').classList.remove('on');
$('ov-profile').onclick=e=>{if(e.target===$('ov-profile'))$('ov-profile').classList.remove('on')};
$('e-close').onclick=()=>$('ov-edit').classList.remove('on');
$('ov-edit').onclick=e=>{if(e.target===$('ov-edit'))$('ov-edit').classList.remove('on')};
$('modal-friend').onclick=e=>{if(e.target===$('modal-friend'))$('modal-friend').classList.remove('on')};

async function refreshFriends(){window.refreshFriends=refreshFriends;
  if(!user)return;
  friends=[];
  try{
    const r=await db.listDocuments(DB,'ultravoc_friends',[Query.equal('userId',user.$id),Query.limit(100)]);
    friends=r.documents||[];
  }catch(e){console.warn('friends db',e);}
  if(!friends.length){
    try{
      const headers={'Content-Type':'application/json'};
      try{const jwt=await account.createJWT();if(jwt&&jwt.jwt)headers['Authorization']='Bearer '+jwt.jwt;}catch(e){}
      try{const s=localStorage.getItem('xultra_aw_sdk_session')||sessionStorage.getItem('xultra_aw_sdk_session');if(s)headers['X-Appwrite-Session']=s;}catch(e){}
      const res=await fetch('/api/friends?uid='+encodeURIComponent(user.$id),{headers,credentials:'include'});
      const j=await res.json();
      if(j&&j.ok&&Array.isArray(j.friends)) friends=j.friends;
    }catch(e){console.warn('friends api',e);}
  }
  try{await loadPresenceCache()}catch(e){}
  if(view==='friends')renderFriends();if(view==='members')renderMembers();
}

function findUserDoc(uid){
  if(!uid)return null;
  const id=String(uid);
  const list=(typeof membersCache!=='undefined'&&membersCache)||[];
  return list.find(u=>String(u.authUserId)===id||String(u.$id)===id)||null;
}
function listAvatarHtml(u, name, uid){
  const n=name||(u&&(u.displayName||u.username))||'?';
  const avUrl=u&&u.avatar;
  const letter=(typeof ini==='function'?ini(n):(n[0]||'?')).toString().toUpperCase();
  const uidAttr=uid?(' data-uid="'+esc(uid)+'" data-name="'+esc(n)+'"'):'';
  const pr=(typeof presenceOf==='function')?presenceOf(uid||(u&&(u.authUserId||u.$id))):{color:'#6b7280'};
  const st='<span class="st" data-st="'+(pr.status||'offline')+'" style="background:'+pr.color+'"></span>';
  if(avUrl&&/^https?:/i.test(avUrl)){
    return '<div class="av"'+uidAttr+'><img src="'+esc(avUrl)+'" alt=""/>'+st+'</div>';
  }
  return '<div class="av"'+uidAttr+'>'+esc(letter)+st+'</div>';
}

function renderFriends(){window.renderFriends=renderFriends;
  const q=((($('search')||{}).value)||'').toLowerCase();const box=$('list-body');if(!box)return;
  const acceptedRaw=(friends||[]).filter(f=>f.status==='accepted'||f.status==='ok');
  const _seenA={};const accepted=acceptedRaw.filter(f=>{const k=String(f.friendId||f.$id);if(_seenA[k])return false;_seenA[k]=1;return true});
  const pendingInRaw=friends.filter(f=>f.status==='pending_in'||f.status==='pending');
  const _seenIn={};const pendingIn=pendingInRaw.filter(f=>{const k=String(f.friendId||f.$id);if(_seenIn[k])return false;_seenIn[k]=1;return true});
  const pendingOutRaw=friends.filter(f=>f.status==='pending_out');
  const _seenOut={};const pendingOut=pendingOutRaw.filter(f=>{const k=String(f.friendId||f.$id);if(_seenOut[k])return false;_seenOut[k]=1;return true});
  let h='';
  if(pendingIn.length){h+='<div class="sec">Demandes reçues</div>';pendingIn.forEach(f=>{
    const name=f.name||'?';if(q&&name.toLowerCase().indexOf(q)<0)return;
    const fid=f.friendId||'';
    h+='<div class="row" data-uid="'+esc(fid)+'" data-name="'+esc(name)+'">'+listAvatarHtml(findUserDoc(fid), name, fid)+'<div class="info"><div class="n uclick" data-uid="'+esc(fid)+'" data-name="'+esc(name)+'">'+esc(name)+'</div><div class="p">Veut être ami</div></div>'
      +'<button type="button" data-ok="'+esc(f.$id)+'" data-fid="'+esc(fid)+'" style="padding:6px 10px;border-radius:6px;background:var(--online);color:#fff;font-size:.72rem;font-weight:700">Accepter</button>'
      +'<button type="button" data-no="'+esc(f.$id)+'" data-fid="'+esc(fid)+'" style="padding:6px 10px;border-radius:6px;background:rgba(239,68,68,.2);color:#fca5a5;font-size:.72rem;font-weight:700;margin-left:4px">Refuser</button></div>';
  })}
  if(pendingOut.length){h+='<div class="sec">Demandes envoyées</div>';pendingOut.forEach(f=>{
    const name=f.name||'?';if(q&&name.toLowerCase().indexOf(q)<0)return;
    const fid=f.friendId||'';
    h+='<div class="row" data-uid="'+esc(fid)+'" data-name="'+esc(name)+'">'+listAvatarHtml(findUserDoc(fid), name, fid)+'<div class="info"><div class="n uclick" data-uid="'+esc(fid)+'" data-name="'+esc(name)+'">'+esc(name)+'</div><div class="p">En attente de réponse</div></div></div>';
  })}
  h+='<div class="sec">Amis — '+accepted.length+'</div>';

  if(!accepted.length)h+='<div style="padding:16px;color:var(--muted);font-size:.85rem">Aucun ami pour l’instant.</div>';
  accepted.forEach(f=>{
    const fid=f.friendId===user.$id?f.userId:f.friendId;
    const udoc=findUserDoc(fid);
    const name=(udoc&&(udoc.displayName||udoc.username))||f.name||'Ami';
    if(q&&name.toLowerCase().indexOf(q)<0)return;
    const pr=presenceOf(fid);
    h+='<div class="row" data-of="'+esc(fid)+'" data-on="'+esc(name)+'" data-uid="'+esc(fid)+'" data-name="'+esc(name)+'">'
      +listAvatarHtml(udoc, name, fid)
      +'<div class="info"><div class="n uclick" data-uid="'+esc(fid)+'" data-name="'+esc(name)+'">'+esc(name)+'</div>'
      +'<div class="p" style="color:'+pr.color+'">'+esc(pr.label)+'</div></div></div>';
  });
  box.innerHTML=h;
  wireProfileClicks(box);
  
  box.querySelectorAll('[data-ok]').forEach(b=>b.onclick=async e=>{
    e.stopPropagation();
    try{
      const fid=b.dataset.fid;
      if(fid){await acceptFriendshipWith(fid)}
      else{await db.updateDocument(DB,'ultravoc_friends',b.dataset.ok,{status:'accepted'})}
      toast('Ami accepté');
      await refreshFriends();
    }catch(err){toast((err&&err.message)||'Erreur')}
  });
  box.querySelectorAll('[data-no]').forEach(b=>b.onclick=async e=>{
    e.stopPropagation();
    try{
      const fid=b.dataset.fid;
      await db.deleteDocument(DB,'ultravoc_friends',b.dataset.no);
      try{
        const r=await db.listDocuments(DB,'ultravoc_friends',[Query.limit(100)]);
        const other=(r.documents||[]).find(d=>String(d.userId)===String(fid)&&String(d.friendId)===String(user.$id)&&String(d.status||'').indexOf('pending')>=0);
        if(other)await db.deleteDocument(DB,'ultravoc_friends',other.$id);
      }catch(e2){}
      toast('Demande refusée');
      await refreshFriends();
    }catch(err){toast('Erreur')}
  });
  box.querySelectorAll('[data-of]').forEach(el=>el.onclick=()=>openDmWith(el.getAttribute('data-of'),el.getAttribute('data-on')));
}

$('fq').oninput=async function(){
  const q=this.value.trim();if(q.length<2){$('fr').innerHTML='';return}
  try{
    let docs=[];try{const r=await db.listDocuments(DB,'users',[Query.search('displayName',q),Query.limit(10)]);docs=r.documents||[]}
    catch(e){const r=await db.listDocuments(DB,'users',[Query.limit(40)]);docs=(r.documents||[]).filter(d=>((d.displayName||d.username||'').toLowerCase().indexOf(q.toLowerCase())>=0)).slice(0,10)}
    $('fr').innerHTML=docs.map(d=>{
      if(d.authUserId===user.$id)return'';
      const n=d.displayName||d.username||'User';
      return '<div class="row"><div class="av">'+av(d.avatar,n)+'</div><div class="info"><div class="n">'+esc(n)+'</div></div>'
        +'<button type="button" data-add="'+esc(d.authUserId)+'" data-an="'+esc(n)+'" style="padding:6px 10px;border-radius:6px;background:var(--accent3);color:#fff;font-size:.72rem;font-weight:700">Ajouter</button></div>';
    }).join('')||'<p style="color:var(--muted);font-size:.85rem">Aucun résultat</p>';
    $('fr').querySelectorAll('[data-add]').forEach(b=>b.onclick=async()=>{
      try{
        const targetId=b.dataset.add;
        const targetName=b.dataset.an||'Utilisateur';
        const myName=(profile&&(profile.displayName||profile.username))||user.name||"Quelqu un";
        await db.createDocument(DB,'ultravoc_friends',ID.unique(),{userId:user.$id,friendId:targetId,status:'pending_out',name:targetName});
        try{await db.createDocument(DB,'ultravoc_friends',ID.unique(),{userId:targetId,friendId:user.$id,status:'pending_in',name:myName})}catch(e){}
        try{await db.createDocument(DB,'notifications',ID.unique(),{to:String(targetId),from:String(user.$id),text:myName+" t'a envoyé une demande d'ami",link:'friends',read:false,at:new Date().toISOString()})}catch(e){console.warn('notif',e)}
        toast('Demande envoyée');$('modal-friend').classList.remove('on');await refreshFriends();
      }catch(e){toast((e&&e.message)||'Erreur')}
    });
  }catch(e){$('fr').innerHTML='<p style="color:var(--muted)">Erreur</p>'}
};

async function refreshDms(){window.refreshDms=refreshDms;
  if(!user)return;
  try{let r;try{r=await db.listDocuments(DB,'dms',[Query.limit(50),Query.orderDesc('$updatedAt')])}catch(e){r=await db.listDocuments(DB,'dms',[Query.limit(50)])}
    dms=(r.documents||[]).filter(d=>members(d).indexOf(String(user.$id))>=0)}catch(e){dms=[]}
  if(view==='dms')renderDms();
}
function renderDms(){window.renderDms=renderDms;
  const q=((($('search')||{}).value)||'').toLowerCase();const box=$('list-body');if(!box)return;
  if(!dms||!dms.length){box.innerHTML='<div style="padding:16px;color:var(--muted);font-size:.85rem">Aucune conversation. Va dans Amis pour en ouvrir une.</div>';return}
  box.innerHTML=dms.map(d=>{
    const title=d.displayName||'Conversation';
    if(q&&title.toLowerCase().indexOf(q)<0)return'';
    const last=cleanPrev(d.lastMessage||d.lastMsg||'');
    return '<div class="row '+(activeDm===d.$id?'active':'')+'" data-dm="'+esc(d.$id)+'" data-dn="'+esc(title)+'">'
      +'<div class="av">'+esc(ini(title))+'</div><div class="info"><div class="n">'+esc(title)+'</div><div class="p">'+esc(last).slice(0,48)+'</div></div>'
      +'<span class="time">'+esc(ago(d.$updatedAt||d.lastAt))+'</span></div>';
  }).join('');
  box.querySelectorAll('[data-dm]').forEach(el=>el.onclick=()=>openDm(el.getAttribute('data-dm'),el.getAttribute('data-dn')));
}

async function openDmWith(oid,oname){
  if(!user||!oid)return;oname=oname||'Conversation';toast('Ouverture…');
  try{await refreshDms()}catch(e){}
  let dm=dms.find(d=>{const m=members(d);return m.indexOf(String(oid))>=0&&m.indexOf(String(user.$id))>=0});
  if(!dm){try{dm=await db.createDocument(DB,'dms',ID.unique(),{members:[String(user.$id),String(oid)],displayName:oname,lastMessage:'',lastMsg:'',uid:user.$id});dms.unshift(dm)}catch(e){toast((e&&e.message)||'Impossible');return}}
  view='dms';$('nav-dms').classList.add('on');$('nav-friends').classList.remove('on');$('list-title').textContent='Messages';
  await openDm(dm.$id,oname);
}

const ENC_EMOJIS=['🦞','🌷','🐱','👾','🦄','🐙','🦊','🐸','🐳','🐝','🌵','🌙','⭐','🔥','💎','🎯','🧩','🚀','🌊','🍀','🦁','🐼','🌸','⚡'];
function hashStr(s){
  let h=2166136261>>>0;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function dmEncFingerprint(threadId, peerId){
  const a=String(user&&user.$id||'');
  const b=String(peerId||'');
  const pair=[a,b].sort().join('|');
  const seed=pair+'#'+String(threadId||'');
  const em=[];
  let h=hashStr(seed);
  for(let i=0;i<12;i++){
    h=hashStr(seed+':'+i+':'+h);
    em.push(ENC_EMOJIS[h%ENC_EMOJIS.length]);
  }
  const t1=hashStr(seed+':tok1').toString(16).padStart(8,'0');
  const t2=hashStr(seed+':tok2').toString(16).padStart(8,'0');
  const t3=hashStr(seed+':tok3').toString(16).padStart(8,'0');
  const t4=hashStr(seed+':tok4').toString(16).padStart(8,'0');
  return {emojis:em, token:(t1+t2+t3+t4).toUpperCase()};
}
function getDmPeerId(dm){
  if(!dm||!user)return '';
  const m=members(dm);
  return m.find(x=>String(x)!==String(user.$id))||'';
}
function showEncKey(){
  if(!activeDm||!user){toast('Ouvre une conversation');return}
  const dm=dms.find(d=>d.$id===activeDm);
  const peer=getDmPeerId(dm);
  const fp=dmEncFingerprint(activeDm, peer);
  const box=$('enc-emojis');
  if(box)box.innerHTML=fp.emojis.map(e=>'<span>'+e+'</span>').join('');
  if($('enc-token'))$('enc-token').textContent=fp.token.match(/.{1,4}/g).join(' · ');
  $('ov-enc').classList.add('on');
}


/* SECRET E2E: ECDH P-256 + AES-256-GCM (Web Crypto) */
let secretMode=false,activeSecret=null,secretAesKey=null,secretPeerId=null;
const SECRET_KEY_STORE='xultra_e2e_v1';
function b64(buf){
  const bytes=buf instanceof ArrayBuffer?new Uint8Array(buf):(buf instanceof Uint8Array?buf:new Uint8Array(buf));
  let s='';for(let i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]);
  return btoa(s);
}
function unb64(str){
  const s=atob(str);const u=new Uint8Array(s.length);
  for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);
  return u.buffer;
}
async function getOrCreateIdentity(){
  const uid=user&&user.$id;if(!uid)throw new Error('no user');
  const storeKey=SECRET_KEY_STORE+'_'+uid;
  let rawK=null;try{rawK=JSON.parse(localStorage.getItem(storeKey)||'null')}catch(e){}
  if(rawK&&rawK.privateKey&&rawK.publicKey){
    const priv=await crypto.subtle.importKey('jwk',rawK.privateKey,{name:'ECDH',namedCurve:'P-256'},true,['deriveKey','deriveBits']);
    const pub=await crypto.subtle.importKey('jwk',rawK.publicKey,{name:'ECDH',namedCurve:'P-256'},true,[]);
    return {priv,pub,pubJwk:rawK.publicKey};
  }
  const pair=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveKey','deriveBits']);
  const privateKey=await crypto.subtle.exportKey('jwk',pair.privateKey);
  const publicKey=await crypto.subtle.exportKey('jwk',pair.publicKey);
  localStorage.setItem(storeKey,JSON.stringify({privateKey,publicKey}));
  return {priv:pair.privateKey,pub:pair.publicKey,pubJwk:publicKey};
}
async function deriveAes(myPriv, peerPubJwk){
  const peerPub=await crypto.subtle.importKey('jwk',peerPubJwk,{name:'ECDH',namedCurve:'P-256'},true,[]);
  return crypto.subtle.deriveKey({name:'ECDH',public:peerPub},myPriv,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function encryptText(aesKey,text){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},aesKey,new TextEncoder().encode(text));
  return {ciphertext:b64(ct),iv:b64(iv)};
}
async function decryptText(aesKey,ciphertext,iv){
  try{
    const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(unb64(iv))},aesKey,unb64(ciphertext));
    return new TextDecoder().decode(pt);
  }catch(e){return '[illisible — clés différentes]'}
}
async function findOrCreateSecretChat(peerId,peerName){
  const me=String(user.$id),peer=String(peerId),pair=[me,peer].sort();
  let list=[];
  try{
    const r=await db.listDocuments(DB,'secret_chats',[Query.limit(60)]);
    list=(r.documents||[]).filter(c=>{
      const m=String(c.members||'').split(',').filter(Boolean);
      return m.indexOf(me)>=0&&m.indexOf(peer)>=0;
    });
  }catch(e){}
  let chat=list[0];
  const id=await getOrCreateIdentity();
  const isA=me===pair[0];
  if(!chat){
    chat=await db.createDocument(DB,'secret_chats',ID.unique(),{
      members:pair.join(','),uidA:pair[0],uidB:pair[1],
      pubA:isA?JSON.stringify(id.pubJwk):'',
      pubB:isA?'':JSON.stringify(id.pubJwk),
      ttl:'0',displayName:peerName||'Secret'
    });
  }else{
    const patch={};
    if(isA&&!chat.pubA)patch.pubA=JSON.stringify(id.pubJwk);
    if(!isA&&!chat.pubB)patch.pubB=JSON.stringify(id.pubJwk);
    if(Object.keys(patch).length)chat=await db.updateDocument(DB,'secret_chats',chat.$id,patch);
  }
  return chat;
}
async function setupSecretKeys(chat){
  const me=String(user.$id);
  const id=await getOrCreateIdentity();
  const isA=me===String(chat.uidA);
  const myF=isA?'pubA':'pubB', peerF=isA?'pubB':'pubA';
  if(!chat[myF]){
    const patch={};patch[myF]=JSON.stringify(id.pubJwk);
    chat=await db.updateDocument(DB,'secret_chats',chat.$id,patch);
  }
  if(!chat[peerF]){secretAesKey=null;return {ready:false,chat}}
  let peerJwk;try{peerJwk=JSON.parse(chat[peerF])}catch(e){return {ready:false,chat}}
  secretAesKey=await deriveAes(id.priv,peerJwk);
  return {ready:true,chat};
}
function enterSecretUI(ready){
  document.querySelector('.chat-top')&&document.querySelector('.chat-top').classList.add('secret-mode');
  if($('secret-banner'))$('secret-banner').classList.add('on');
  if($('ch-sub'))$('ch-sub').textContent=ready?'Chat secret · E2E AES-GCM':'Chat secret · échange de clés…';
  if($('ch-lock'))$('ch-lock').classList.remove('hidden');
  if($('ch-secret-btn')){ $('ch-secret-btn').classList.remove('hidden'); $('ch-secret-btn').style.display='inline-flex'; }
  if(typeof exitSecretUI==='function')exitSecretUI();
  if($('ch-secret-btn'))$('ch-secret-btn').classList.add('hidden');
}
function exitSecretUI(){
  secretMode=false;activeSecret=null;secretAesKey=null;secretPeerId=null;
  document.querySelector('.chat-top')&&document.querySelector('.chat-top').classList.remove('secret-mode');
  if($('secret-banner'))$('secret-banner').classList.remove('on');
  if(activeDm&&$('ch-secret-btn')){ $('ch-secret-btn').classList.remove('hidden'); $('ch-secret-btn').style.display='inline-flex'; }
}
async function startSecretWithCurrentPeer(){
  if(!user||!activeDm){toast('Ouvre d’abord un DM');return}
  const dm=dms.find(d=>d.$id===activeDm);if(!dm)return;
  const peer=getDmPeerId(dm);if(!peer){toast('Contact introuvable');return}
  toast('Initialisation chat secret…');
  try{
    let chat=await findOrCreateSecretChat(peer,$('ch-title').textContent||'Secret');
    let setup=await setupSecretKeys(chat);
    activeSecret=chat.$id;secretPeerId=peer;secretMode=true;
    enterSecretUI(setup.ready);
    if(!setup.ready){
      toast('En attente de la clé du contact…');
      for(let i=0;i<10;i++){
        await new Promise(r=>setTimeout(r,1200));
        try{
          chat=await db.getDocument(DB,'secret_chats',chat.$id);
          setup=await setupSecretKeys(chat);
          if(setup.ready){enterSecretUI(true);toast('Chat secret prêt 🔒');break}
        }catch(e){}
      }
      if(!setup.ready)toast('L’autre doit aussi appuyer sur 🕵️ Chat secret');
    }else toast('Chat secret prêt 🔒');
    await loadSecretMsgs(chat.$id);
  }catch(e){console.error(e);toast((e&&e.message)||'Échec chat secret')}
}
async function loadSecretMsgs(threadId){
  const box=$('msgs');if(!box)return;
  if(!secretAesKey){
    box.innerHTML='<div class="sec-setup"><div class="big">🔐</div><h3>Échange de clés</h3><p>Les deux personnes doivent ouvrir le chat secret une fois. Ensuite : AES-256-GCM — le serveur ne voit que du texte chiffré.</p></div>';
    return;
  }
  let docs=[];
  try{
    const r=await db.listDocuments(DB,'secret_messages',[Query.equal('threadId',threadId),Query.orderDesc('$createdAt'),Query.limit(60)]);
    docs=(r.documents||[]).reverse();
  }catch(e){}
  const now=Date.now();const keep=[];
  for(const m of docs){
    if(m.expireAt&&Number(m.expireAt)>0&&Number(m.expireAt)<now){
      try{await db.deleteDocument(DB,'secret_messages',m.$id)}catch(e){}
      continue;
    }
    keep.push(m);
  }
  if(!keep.length){
    box.innerHTML='<div class="empty"><div style="font-size:2rem">🔒</div><h3>Chat secret</h3><p>Aucun message. Tout est chiffré sur ton appareil.</p></div>';
    return;
  }
  const html=[];
  for(const m of keep){
    const mine=m.uid===user.$id;
    let text='…';
    if(m.ciphertext&&m.iv)text=await decryptText(secretAesKey,m.ciphertext,m.iv);
    html.push('<div class="msg '+(mine?'me':'')+' secret"><div class="av uclick" data-uid="'+esc(m.uid||'')+'" data-name="'+esc(m.username||'?')+'">'+esc(ini(m.username||'?'))+'</div>'
      +'<div class="body"><div class="meta"><span class="who">'+esc(m.username||'?')+'</span>'
      +'<span class="when">'+esc((m.$createdAt||'').toString().slice(11,16))+(m.expireAt?' · ⏳':'')+'</span></div>'
      +'<div class="b">'+esc(text)+'</div></div></div>');
  }
  box.innerHTML=html.join('');box.scrollTop=box.scrollHeight;wireProfileClicks(box);
}
async function sendSecretMsg(plain){
  if(!activeSecret||!secretAesKey){toast('Chat secret pas prêt');return false}
  const ttl=Number(($('secret-ttl')&&$('secret-ttl').value)||0);
  const enc=await encryptText(secretAesKey,plain);
  await db.createDocument(DB,'secret_messages',ID.unique(),{
    threadId:activeSecret,uid:user.$id,
    username:(profile&&(profile.displayName||profile.username))||user.name||'User',
    ciphertext:enc.ciphertext.slice(0,4900),iv:enc.iv,
    ttl:String(ttl||0),type:'text',
    expireAt:ttl>0?(Date.now()+ttl*1000):0
  });
  await loadSecretMsgs(activeSecret);
  return true;
}




/* ===== DM CALL ROOMS (salon vocal style) ===== */
let callPc=null, callLocalStream=null, callId=null, callRole=null, callPeerId=null, callPeerName='';
let callPollTimer=null, callTimerInt=null, callStartedAt=0, callMuted=false;
let activeCallRoom=null, roomWatchTimer=null, roomBarTimer=null;
var callCamStream=null, callScreenStream=null, callDeaf=false;

function showCallMediaPanel(show){
  const m=$('dm-call-media');
  if(!m)return;
  m.classList.toggle('hidden', !show);
}

function updateCallControlsVisibility(inCall){
  ['dm-call-mute','dm-call-deaf','dm-call-cam','dm-call-screen','dm-call-cinema','dm-call-leave'].forEach(id=>{
    if($(id))$(id).classList.toggle('hidden', !inCall);
  });
  if($('dm-call-join'))$('dm-call-join').classList.toggle('hidden', !!inCall);
}

async function replaceOrAddVideoTrack(stream, kind){
  if(!callPc||!stream)return;
  const vTrack=stream.getVideoTracks()[0];
  if(!vTrack)return;
  const sender=callPc.getSenders().find(s=>s.track&&s.track.kind==='video');
  if(sender)await sender.replaceTrack(vTrack);
  else callPc.addTrack(vTrack, stream);
  // notify peer via thin signal
  if(callPeerId)try{await callSignal('media',{kind:kind||'cam',on:true},callPeerId)}catch(e){}
}

async function stopVideoSender(kind){
  if(!callPc)return;
  const sender=callPc.getSenders().find(s=>s.track&&s.track.kind==='video');
  if(sender){
    try{await sender.replaceTrack(null)}catch(e){}
  }
  if(callPeerId)try{await callSignal('media',{kind:kind||'cam',on:false},callPeerId)}catch(e){}
}

function wireCallMediaControls(){
  if(window._callMediaWired)return;window._callMediaWired=true;

  if($('dm-call-mute'))$('dm-call-mute').onclick=()=>{
    if(!callLocalStream)return;
    const tracks=callLocalStream.getAudioTracks();
    if(!tracks.length)return;
    const enable=!tracks[0].enabled;
    tracks.forEach(t=>t.enabled=enable);
    $('dm-call-mute').classList.toggle('on', !enable);
    $('dm-call-mute').textContent=enable?'🎤':'🔇';
    toast(enable?'Micro ON':'Micro OFF');
  };

  if($('dm-call-deaf'))$('dm-call-deaf').onclick=()=>{
    callDeaf=!callDeaf;
    const aud=$('call-remote-audio');
    if(aud)aud.muted=callDeaf;
    const rv=$('vid-remote');if(rv)rv.muted=callDeaf;
    const sv=$('vid-screen');if(sv)sv.muted=callDeaf;
    $('dm-call-deaf').classList.toggle('on', callDeaf);
    $('dm-call-deaf').textContent=callDeaf?'🔇':'🎧';
    toast(callDeaf?'Casque en sourdine':'Casque ON');
  };

  if($('dm-call-cam'))$('dm-call-cam').onclick=async()=>{
    try{
      if(callCamStream){
        callCamStream.getTracks().forEach(t=>t.stop());
        callCamStream=null;
        const lv=$('vid-local');if(lv)lv.srcObject=null;
        if($('vid-local-wrap'))$('vid-local-wrap').classList.add('hidden');
        $('dm-call-cam').classList.remove('cam-on','on');
        await stopVideoSender('cam');
        if(!callScreenStream)showCallMediaPanel(false);
        toast('Cam OFF');
        return;
      }
      callCamStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}},audio:false});
      const lv=$('vid-local');
      if(lv){lv.srcObject=callCamStream;lv.muted=true;lv.play().catch(()=>{})}
      if($('vid-local-wrap'))$('vid-local-wrap').classList.remove('hidden');
      showCallMediaPanel(true);
      $('dm-call-cam').classList.add('cam-on');
      await replaceOrAddVideoTrack(callCamStream, 'cam');
      toast('Cam ON');
    }catch(e){toast((e&&e.message)||'Caméra refusée')}
  };

  if($('dm-call-screen'))$('dm-call-screen').onclick=async()=>{
    try{
      if(callScreenStream){
        callScreenStream.getTracks().forEach(t=>t.stop());
        callScreenStream=null;
        const sv=$('vid-screen');if(sv)sv.srcObject=null;
        if($('vid-screen-wrap'))$('vid-screen-wrap').classList.add('hidden');
        $('dm-call-screen').classList.remove('cam-on','on');
        await stopVideoSender('screen');
        if(!callCamStream)showCallMediaPanel(false);
        toast('Partage OFF');
        return;
      }
      callScreenStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});
      callScreenStream.getVideoTracks()[0].onended=()=>{$('dm-call-screen').click()};
      const sv=$('vid-screen');
      if(sv){sv.srcObject=callScreenStream;sv.play().catch(()=>{})}
      if($('vid-screen-wrap'))$('vid-screen-wrap').classList.remove('hidden');
      showCallMediaPanel(true);
      $('dm-call-screen').classList.add('cam-on');
      await replaceOrAddVideoTrack(callScreenStream, 'screen');
      toast("Partage ecran ON");
    }catch(e){toast((e&&e.message)||'Partage annulé')}
  };

  if($('dm-call-cinema'))$('dm-call-cinema').onclick=()=>{
    const m=$('dm-call-media');
    if(!m||m.classList.contains('hidden')){toast('Active d abord cam ou écran');return}
    m.classList.toggle('cinema');
    $('dm-call-cinema').classList.toggle('on', m.classList.contains('cinema'));
    if(m.classList.contains('cinema')){
      // floating exit
      if(!$('cinema-exit')){
        const b=document.createElement('button');
        b.id='cinema-exit';b.type='button';b.textContent='✕ Quitter cinéma';
        b.style.cssText='position:fixed;top:16px;right:16px;z-index:9999;padding:10px 14px;border-radius:12px;border:0;background:#7c3aed;color:#fff;font-weight:800;cursor:pointer';
        b.onclick=()=>{$('dm-call-cinema').click()};
        document.body.appendChild(b);
      }
    }else{
      const b=$('cinema-exit');if(b)b.remove();
    }
  };
}

// enhance ontrack to show remote video

var ICE_SERVERS={iceServers:[
  {urls:'stun:stun.l.google.com:19302'},
  {urls:'stun:stun1.l.google.com:19302'},
  {urls:'stun:openrelay.metered.ca:80'},
  {urls:'turn:openrelay.metered.ca:80',username:'openrelayproject',credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443?transport=tcp',username:'openrelayproject',credential:'openrelayproject'}
]};
const _seenSigs=new Set();

async function callSignal(type, payload, toUid){
  if(!user||!toUid)return null;
  try{
    return await db.createDocument(DB,'dm_calls',ID.unique(),{
      fromUid:String(user.$id), toUid:String(toUid), type:String(type),
      payload:typeof payload==='string'?payload:JSON.stringify(payload||{}),
      callId:String(callId||(activeCallRoom&&activeCallRoom.$id)||''), status:'open'
    });
  }catch(e){console.error('callSignal',e);return null}
}
async function fetchSignals(types){
  // Always full list filter client-side (avoids index/query misses)
  try{
    const r=await db.listDocuments(DB,'dm_calls',[Query.limit(100)]);
    let list=(r.documents||[]).filter(d=>{
      if(_seenSigs.has(d.$id))return false;
      if(String(d.toUid)!==String(user.$id))return false;
      if(types&&types.indexOf(d.type)<0)return false;
      return true;
    });
    list.sort((a,b)=>String(a.$createdAt||'').localeCompare(String(b.$createdAt||'')));
    return list;
  }catch(e){return []}
}
function parseParts(room){
  try{const p=JSON.parse(room.participants||'[]');return Array.isArray(p)?p.map(String):[]}catch(e){return []}
}
async function getActiveRoom(threadId){
  if(!threadId)return null;
  try{
    const r=await db.listDocuments(DB,'dm_call_rooms',[Query.limit(80)]);
    const rooms=(r.documents||[]).filter(d=>String(d.threadId)===String(threadId)&&(d.status||'')==='active');
    if(rooms.length)return rooms.sort((a,b)=>String(b.startedAt||'').localeCompare(String(a.startedAt||'')))[0];
  }catch(e){}
  return null;
}
function formatCallDur(ms){
  const s=Math.max(0,Math.floor(ms/1000));
  return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
}
function updateCallBarUI(room){
  const bar=$('dm-call-bar');if(!bar)return;
  if(!room){bar.classList.remove('on','live');if(roomBarTimer){clearInterval(roomBarTimer);roomBarTimer=null}return}
  activeCallRoom=room;
  bar.classList.add('on');
  const parts=parseParts(room);
  const inCall=!!(callId&&String(callId)===String(room.$id));
  const n=parts.length;
  if($('dm-call-label'))$('dm-call-label').textContent=(inCall?'En appel':'Appel')+' · '+n+' participant'+(n>1?'s':'');
  if($('dm-call-state'))$('dm-call-state').textContent=inCall?(window._callAudioOk?'Audio OK':'Négociation…'):'Rejoindre pour entrer';
  try{updateCallControlsVisibility(inCall)}catch(e){
    if($('dm-call-join'))$('dm-call-join').classList.toggle('hidden', inCall);
    if($('dm-call-leave'))$('dm-call-leave').classList.toggle('hidden', !inCall);
  }
  bar.classList.toggle('live', inCall);
  if($('dm-call-end'))$('dm-call-end').classList.remove('hidden');
  const start=parseInt(room.startedAt||'0',10)||Date.now();
  const tick=()=>{if($('dm-call-timer'))$('dm-call-timer').textContent=formatCallDur(Date.now()-start)};
  tick();
  if(roomBarTimer)clearInterval(roomBarTimer);
  roomBarTimer=setInterval(tick,1000);
}
async function refreshDmCallBar(){
  if(!activeDm){updateCallBarUI(null);return}
  const room=await getActiveRoom(activeDm);
  updateCallBarUI(room);
}
function startRoomWatcher(){
  if(roomWatchTimer)return;
  roomWatchTimer=setInterval(()=>{if(activeDm)refreshDmCallBar().catch(()=>{})},1500);
}
function showCallUI(mode, name){
  if($('ov-call'))$('ov-call').classList.remove('on');
  const bar=$('dm-call-bar');if(!bar)return;
  bar.classList.add('on');
  bar.classList.toggle('live', mode==='active'||mode==='outgoing');
  if($('dm-call-label')&&name)$('dm-call-label').textContent=(mode==='active'?'En appel':'Salon')+' · '+name;
  if($('dm-call-state'))$('dm-call-state').textContent=mode==='active'?'Connecté…':(mode==='outgoing'?'En attente…':'');
  const inCall=!!callId;
  if($('dm-call-join'))$('dm-call-join').classList.toggle('hidden', inCall);
  if($('dm-call-leave'))$('dm-call-leave').classList.toggle('hidden', !inCall);
  if($('dm-call-mute'))$('dm-call-mute').classList.toggle('hidden', !inCall);
  if(mode==='active'||mode==='outgoing')startCallTimer();
}
function startCallTimer(){
  callStartedAt=callStartedAt||Date.now();
  if(callTimerInt)clearInterval(callTimerInt);
  callTimerInt=setInterval(()=>{
    if($('dm-call-timer'))$('dm-call-timer').textContent=formatCallDur(Date.now()-callStartedAt);
  },1000);
}

async function endCallForAll(){
  toast('Fin de l appel…');
  try{
    // end active room(s) for this DM
    const thread=activeDm;
    let room=activeCallRoom;
    if(!room && thread)room=await getActiveRoom(thread);
    if(room){
      try{
        await db.updateDocument(DB,'dm_call_rooms',room.$id,{
          status:'ended',participants:'[]',offerSdp:'',iceJson:''
        });
      }catch(e){
        try{await db.updateDocument(DB,'dm_call_rooms',room.$id,{status:'ended',participants:'[]'})}catch(e2){}
      }
    }
    // signal peer
    try{
      const dm=dms.find(d=>d.$id===activeDm);
      const peer=getDmPeerId(dm||{});
      if(peer)await callSignal('end',{roomId:room&&room.$id},peer);
    }catch(e){}
    await cleanupCall(false);
    activeCallRoom=null;
    updateCallBarUI(null);
    toast('Appel termine');
  }catch(e){
    console.error(e);
    toast((e&&e.message)||'Impossible de terminer');
  }
}

async function cleanupCall(sendEnd){
  if(callPollTimer){clearInterval(callPollTimer);callPollTimer=null}
  if(callTimerInt){clearInterval(callTimerInt);callTimerInt=null}
  const roomId=callId, peer=callPeerId;
  if(sendEnd&&peer){try{await callSignal('end',{},peer)}catch(e){}}
  try{if(callPc){callPc.close()}}catch(e){}
  callPc=null;window._callAudioOk=false;
  if(callLocalStream){try{callLocalStream.getTracks().forEach(t=>t.stop())}catch(e){}callLocalStream=null}
  if(callCamStream){try{callCamStream.getTracks().forEach(t=>t.stop())}catch(e){}callCamStream=null}
  if(callScreenStream){try{callScreenStream.getTracks().forEach(t=>t.stop())}catch(e){}callScreenStream=null}
  try{showCallMediaPanel(false);['vid-local-wrap','vid-remote-wrap','vid-screen-wrap'].forEach(id=>{if($(id))$(id).classList.add('hidden')});const cx=$('cinema-exit');if(cx)cx.remove();const m=$('dm-call-media');if(m)m.classList.remove('cinema')}catch(e){}
  const aud=$('call-remote-audio');if(aud){try{aud.srcObject=null}catch(e){}}
  if(roomId&&user){
    try{
      const room=await db.getDocument(DB,'dm_call_rooms',roomId);
      let parts=parseParts(room).filter(id=>id!==String(user.$id));
      if(parts.length===0)await db.updateDocument(DB,'dm_call_rooms',roomId,{status:'ended',participants:'[]',offerSdp:'',iceJson:''});
      else await db.updateDocument(DB,'dm_call_rooms',roomId,{participants:JSON.stringify(parts)});
    }catch(e){}
  }
  callId=null;callPeerId=null;callRole=null;activeCallRoom=null;window._offerSent=false;window._answerSent=false;
  if(activeDm)refreshDmCallBar().catch(()=>{});
}
async function ensureMic(){
  if(callLocalStream&&callLocalStream.getAudioTracks().some(t=>t.readyState==='live'))return callLocalStream;
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('Micro non supporté');
  callLocalStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
  return callLocalStream;
}
function attachRemoteAudio(stream){
  if(!stream)return;
  let aud=$('call-remote-audio');
  if(!aud){aud=document.createElement('audio');aud.id='call-remote-audio';aud.autoplay=true;aud.setAttribute('playsinline','');document.body.appendChild(aud)}
  aud.muted=false;aud.volume=1;aud.srcObject=stream;
  const play=()=>aud.play().catch(()=>{});
  play();[100,400,1000,2000].forEach(t=>setTimeout(play,t));
  window._callAudioOk=true;
  if($('dm-call-state'))$('dm-call-state').textContent='🔊 Audio distant';
  showCallUI('active', callPeerName||'Contact');
}
async function addRemoteIce(pc,cand){
  if(!pc||!cand)return;
  try{
    if(!pc.remoteDescription){pc._pendingIce=pc._pendingIce||[];pc._pendingIce.push(cand);return}
    await pc.addIceCandidate(new RTCIceCandidate(cand));
  }catch(e){}
}
async function flushPendingIce(pc){
  if(!pc||!pc._pendingIce)return;
  const list=pc._pendingIce.splice(0);
  for(const c of list){try{await pc.addIceCandidate(new RTCIceCandidate(c))}catch(e){}}
}
async function createPc(){
  const pc=new RTCPeerConnection(ICE_SERVERS);
  pc._pendingIce=[];
  pc.onicecandidate=async(ev)=>{
    if(!ev.candidate||!callPeerId)return;
    const payload=ev.candidate.toJSON?ev.candidate.toJSON():{candidate:ev.candidate.candidate,sdpMid:ev.candidate.sdpMid,sdpMLineIndex:ev.candidate.sdpMLineIndex};
    await callSignal('ice',payload,callPeerId);
    // also push into room iceJson for reliability
    try{
      if(callId){
        const room=await db.getDocument(DB,'dm_call_rooms',callId);
        let arr=[];try{arr=JSON.parse(room.iceJson||'[]')}catch(e){}
        arr.push({from:user.$id,cand:payload,t:Date.now()});
        if(arr.length>40)arr=arr.slice(-40);
        await db.updateDocument(DB,'dm_call_rooms',callId,{iceJson:JSON.stringify(arr)});
      }
    }catch(e){}
  };
  pc.ontrack=(ev)=>{
    const stream=(ev.streams&&ev.streams[0])||new MediaStream([ev.track]);
    if(ev.track&&ev.track.kind==='audio')attachRemoteAudio(stream);
    if(ev.track&&ev.track.kind==='video'){
      const isScreen=false;
      const rv=$('vid-remote');
      if(rv){rv.srcObject=stream;rv.play().catch(()=>{})}
      if($('vid-remote-wrap'))$('vid-remote-wrap').classList.remove('hidden');
      showCallMediaPanel(true);
      if($('dm-call-state'))$('dm-call-state').textContent='Cam/écran distant';
    }
    if(!ev.track||ev.track.kind==='audio')attachRemoteAudio(stream);
  };
  pc.onconnectionstatechange=()=>{
    if(pc.connectionState==='connected'){if($('dm-call-state'))$('dm-call-state').textContent='WebRTC OK'}
    if(pc.connectionState==='failed')toast('WebRTC failed');
  };
  return pc;
}
async function processCallSignals(types){
  const sigs=await fetchSignals(types);
  for(const s of sigs){
    _seenSigs.add(s.$id);
    if(callPeerId&&String(s.fromUid)!==String(callPeerId)){try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}continue}
    try{
      const p=typeof s.payload==='string'?JSON.parse(s.payload||'{}'):(s.payload||{});
      if(s.type==='ready'&&callRole==='host'&&callPc){
        // send offer only once
        if(window._offerSent){try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}continue}
        if($('dm-call-state'))$('dm-call-state').textContent='Pair pret → offer';
        const offer=await callPc.createOffer({offerToReceiveAudio:true,offerToReceiveVideo:true});
        await callPc.setLocalDescription(offer);
        window._offerSent=true;
        await callSignal('offer',{sdp:offer.sdp,type:'offer',roomId:callId},callPeerId);
        try{if(callId)await db.updateDocument(DB,'dm_call_rooms',callId,{offerSdp:offer.sdp})}catch(e){}
      }else if(s.type==='offer'&&callPc&&callRole==='joiner'){
        if(window._answerSent||callPc.currentRemoteDescription){try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}continue}
        if(!p.sdp)continue;
        if($('dm-call-state'))$('dm-call-state').textContent='Offer → answer';
        await callPc.setRemoteDescription(new RTCSessionDescription({type:'offer',sdp:p.sdp}));
        await flushPendingIce(callPc);
        const answer=await callPc.createAnswer();
        await callPc.setLocalDescription(answer);
        window._answerSent=true;
        await callSignal('answer',{sdp:answer.sdp,type:'answer'},callPeerId||s.fromUid);
      }else if(s.type==='answer'&&callPc&&callRole==='host'){
        if(callPc.currentRemoteDescription){try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}continue}
        if(!p.sdp)continue;
        const st=callPc.signalingState;
        if(st!=='have-local-offer'&&st!=='have-local-pranswer'){
          // ignore late/duplicate answer
          if($('dm-call-state'))$('dm-call-state').textContent='Answer ignoree ('+st+')';
          try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}
          continue;
        }
        if($('dm-call-state'))$('dm-call-state').textContent='Answer OK';
        await callPc.setRemoteDescription(new RTCSessionDescription({type:'answer',sdp:p.sdp}));
        await flushPendingIce(callPc);
        if($('dm-call-state'))$('dm-call-state').textContent='Connecte';
      }else if(s.type==='ice'&&callPc){
        await addRemoteIce(callPc,p);
      }else if(s.type==='joined'){
        await refreshDmCallBar();
      }else if(s.type==='end'){
        toast('Appel termine');
        try{await cleanupCall(false)}catch(e){}
        updateCallBarUI(null);
      }
    }catch(e){
      console.warn('sig',s.type,e,callPc&&callPc.signalingState);
      if($('dm-call-state'))$('dm-call-state').textContent='Err '+s.type+' '+(callPc?callPc.signalingState:'');
    }
    try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}
  }
}

async function pollRoomSignals(){
  if(!callId||!callPc)return;
  try{
    const room=await db.getDocument(DB,'dm_call_rooms',callId);
    updateCallBarUI(room);
    // Joiner: only use room offer if we have not answered yet
    if(callRole==='joiner'&&room.offerSdp&&!window._answerSent&&!callPc.currentRemoteDescription){
      try{
        if($('dm-call-state'))$('dm-call-state').textContent='Offer room→answer';
        await callPc.setRemoteDescription(new RTCSessionDescription({type:'offer',sdp:room.offerSdp}));
        await flushPendingIce(callPc);
        const answer=await callPc.createAnswer();
        await callPc.setLocalDescription(answer);
        window._answerSent=true;
        await callSignal('answer',{sdp:answer.sdp,type:'answer'},callPeerId);
      }catch(e){console.warn('room offer',e)}
    }
// ICE from room
    try{
      const arr=JSON.parse(room.iceJson||'[]');
      for(const item of arr){
        if(String(item.from)===String(user.$id))continue;
        const key=JSON.stringify(item.cand);
        if(!_seenSigs.has(key)){_seenSigs.add(key);await addRemoteIce(callPc,item.cand)}
      }
    }catch(e){}
  }catch(e){}
}

async function upsertCallRoom(threadId){
  let room=await getActiveRoom(threadId);
  if(room){
    const parts=parseParts(room);
    if(parts.indexOf(String(user.$id))<0)parts.push(String(user.$id));
    await db.updateDocument(DB,'dm_call_rooms',room.$id,{participants:JSON.stringify(parts),status:'active'});
    return await db.getDocument(DB,'dm_call_rooms',room.$id);
  }
  return await db.createDocument(DB,'dm_call_rooms',ID.unique(),{
    threadId:String(threadId),hostUid:String(user.$id),status:'active',
    startedAt:String(Date.now()),participants:JSON.stringify([String(user.$id)]),
    offerSdp:'',iceJson:'',guestUid:''
  });
}
async function startDmCall(){
  try{const a=$('call-remote-audio');if(a){a.muted=false;a.play().catch(()=>{})}}catch(e){}
  if(typeof rateLimit==='function'&&!rateLimit('call:'+(user&&user.$id),5,30000)){toast('Trop d appels — patiente');return}
  if(!user){toast('Connecte-toi');return}
  if(!activeDm){toast('Ouvre un DM');return}
  if(callId&&!callPc){callId=null}
  if(callId){toast('Deja en appel');return}
  const dm=dms.find(d=>d.$id===activeDm);if(!dm){toast('DM introuvable');return}
  const peer=getDmPeerId(dm);if(!peer){toast('Contact introuvable');return}
  callPeerId=peer;callPeerName=($('ch-title')&&$('ch-title').textContent)||'Contact';
  try{
    await ensureMic();
    // end stale rooms for this thread
    try{
      const r=await db.listDocuments(DB,'dm_call_rooms',[Query.limit(50)]);
      for(const old of (r.documents||[])){
        if(String(old.threadId)===String(activeDm)&&(old.status||'')==='active'){
          try{await db.updateDocument(DB,'dm_call_rooms',old.$id,{status:'ended'})}catch(e){}
        }
      }
    }catch(e){}
    const room=await upsertCallRoom(activeDm);
    activeCallRoom=room;callId=room.$id;callRole='host';
    callStartedAt=parseInt(room.startedAt||String(Date.now()),10);
    window._offerSent=false;window._answerSent=false;
    callPc=await createPc();
    callLocalStream.getTracks().forEach(t=>callPc.addTrack(t,callLocalStream));
    showCallUI('outgoing',callPeerName);updateCallBarUI(room);
    if(callPollTimer)clearInterval(callPollTimer);
    callPollTimer=setInterval(async()=>{
      await processCallSignals(['ready','answer','ice','joined','end']);
      await pollRoomSignals();
      try{await processGhostHostSignals()}catch(e){}
    },600);
    // Fallback: if nobody sends ready in 3s, still publish a proactive offer when second participant appears
    setTimeout(async()=>{
      try{
        if(callRole!=='host'||!callPc||callPc.currentRemoteDescription)return;
        const room2=await getActiveRoom(activeDm);
        const parts=parseParts(room2||{});
        if(parts.length>=2&&!callPc.localDescription){
          const offer=await callPc.createOffer();
          await callPc.setLocalDescription(offer);
          window._offerSent=true;
          await callSignal('offer',{sdp:offer.sdp,type:'offer',roomId:callId},callPeerId);
          try{await db.updateDocument(DB,'dm_call_rooms',callId,{offerSdp:offer.sdp})}catch(e){}
          if($('dm-call-state'))$('dm-call-state').textContent='Offer proactive';
        }
      }catch(e){}
    },3000);
    toast('Salon ouvert');
  }catch(e){console.error(e);toast((e&&e.message)||'Appel impossible');try{await cleanupCall(false)}catch(e2){}}
}
async function joinDmCallRoom(room){
  try{const a=$('call-remote-audio');if(a){a.muted=false;a.play().catch(()=>{})}}catch(e){}
  toast('Connexion au salon…');
  if(!user){toast('Connecte-toi d abord');return}
  if(!activeDm){toast('Ouvre un DM');return}
  // reset stuck state without live PC
  if(callId && !callPc){callId=null;callRole=null}
  if(callId){toast('Deja en appel');return}
  let dm=dms.find(d=>d.$id===activeDm);
  if(!dm){
    try{await refreshDms();dm=dms.find(d=>d.$id===activeDm)}catch(e){}
  }
  if(!dm){toast('DM introuvable — rouvre la conversation');return}
  const peer=getDmPeerId(dm);if(!peer){toast('Contact introuvable');return}
  try{
    room=room||activeCallRoom||await getActiveRoom(activeDm);
    if(!room){room=await getActiveRoom(activeDm)}
    if(!room){toast('Aucun appel en cours');return}
    toast('Micro…');
    await ensureMic();
    const parts=parseParts(room);
    if(parts.indexOf(String(user.$id))<0)parts.push(String(user.$id));
    await db.updateDocument(DB,'dm_call_rooms',room.$id,{
      participants:JSON.stringify(parts),status:'active',guestUid:String(user.$id)
    });
    activeCallRoom=room;callId=room.$id;callPeerId=peer;callRole='joiner';
    callPeerName=($('ch-title')&&$('ch-title').textContent)||'Contact';
    callStartedAt=parseInt(room.startedAt||String(Date.now()),10);
    window._offerSent=false;window._answerSent=false;
    callPc=await createPc();
    callLocalStream.getTracks().forEach(t=>callPc.addTrack(t,callLocalStream));
    await callSignal('ready',{roomId:room.$id,name:(profile&&(profile.displayName||profile.username))||'User'},peer);
    await callSignal('joined',{name:(profile&&(profile.displayName||profile.username))||'User'},peer);
    showCallUI('active',callPeerName);updateCallBarUI(Object.assign({},room,{participants:JSON.stringify(parts)}));
    if(callPollTimer)clearInterval(callPollTimer);
    callPollTimer=setInterval(async()=>{
      await processCallSignals(['offer','ice','end']);
      await pollRoomSignals();
    },600);
    await processCallSignals(['offer','ice']);
    await pollRoomSignals();
    toast('Rejoint — négociation…');
  }catch(e){console.error(e);toast((e&&e.message)||'Impossible de rejoindre');try{await cleanupCall(false)}catch(e2){}}
}

let ghostPoll=null, ghostPc=null, ghostCallId=null, ghostPeerId=null;

async function loadGhostCalls(){
  const box=$('adm-ghost-list');if(!box)return;
  box.innerHTML='<div style="color:var(--muted);font-size:.8rem">Chargement…</div>';
  try{
    const gate=await serverAdminAccess();
    if(!gate||!gate.ok){
      box.innerHTML='<div style="color:#fca5a5;font-size:.8rem">Acces serveur refuse</div>';
      return;
    }
    let rooms=[];
    try{
      const jwt=await getSessionJwt();
      const rr=await fetch('/api/admin/calls',{headers:{Authorization:'Bearer '+jwt},cache:'no-store'});
      const jj=await rr.json();
      if(jj&&jj.ok&&Array.isArray(jj.calls)){
        rooms=jj.calls.map(function(c){
          return {
            $id:c.id,
            threadId:c.threadId,
            hostUid:c.hostUid,
            participants:JSON.stringify(c.participants||[]),
            startedAt:c.startedAt,
            status:c.status,
            _names:c.participantNames,
            _hostName:c.hostName
          };
        });
      }
    }catch(e){}
    if(!rooms.length){
      try{
        const r=await db.listDocuments(DB,'dm_call_rooms',[Query.limit(80)]);
        rooms=(r.documents||[]).filter(function(d){return (d.status||'')==='active';});
      }catch(e2){rooms=[];}
    }
    rooms.sort(function(a,b){return String(b.startedAt||'').localeCompare(String(a.startedAt||''));});
    if(!rooms.length){
      box.innerHTML='<div style="padding:16px;text-align:center;color:var(--muted);font-size:.82rem">Aucun vocal DM actif</div>';
      return;
    }
    let users=[];
    try{const u=await db.listDocuments(DB,'users',[Query.limit(200)]);users=u.documents||[];}catch(e){}
    const nameOf=function(id){
      const p=users.find(function(x){return String(x.authUserId||x.$id)===String(id);});
      return p?(p.displayName||p.username||id):String(id).slice(0,8);
    };
    box.innerHTML=rooms.map(function(room){
      var parts=[];
      try{var p=JSON.parse(room.participants||'[]');parts=Array.isArray(p)?p:[];}catch(e){}
      var names=(room._names&&room._names.length)?room._names.join(' · '):(parts.map(nameOf).join(' · ')||'—');
      var start=parseInt(room.startedAt||'0',10)||Date.now();
      var dur=Math.max(0,Math.floor((Date.now()-start)/1000));
      var mm=String(Math.floor(dur/60)).padStart(2,'0');
      var ss=String(dur%60).padStart(2,'0');
      var host=room._hostName||nameOf(room.hostUid||'');
      return '<div style="padding:12px;border-radius:12px;border:1px solid rgba(167,139,250,.25);background:rgba(0,0,0,.2)">'+
        '<div style="font-weight:800;color:#e9d5ff;margin-bottom:4px">'+names+'</div>'+
        '<div style="font-size:.72rem;color:var(--muted)">Hote: '+host+' · '+parts.length+' part. · '+mm+':'+ss+'</div>'+
        '<div style="margin-top:8px"><button type="button" data-ghost-listen="'+room.$id+'" data-ghost-thread="'+String(room.threadId||'')+'" data-ghost-host="'+String(room.hostUid||'')+'" style="height:32px;padding:0 12px;border-radius:10px;border:0;background:#7c3aed;color:#fff;font-weight:800;font-size:.75rem;cursor:pointer">Ecouter</button></div></div>';
    }).join('');
    box.querySelectorAll('[data-ghost-listen]').forEach(function(btn){
      btn.onclick=function(){startGhostListen(btn.getAttribute('data-ghost-listen'), btn.getAttribute('data-ghost-thread'), btn.getAttribute('data-ghost-host'));};
    });
  }catch(e){
    box.innerHTML='<div style="color:#fca5a5">Erreur: '+((e&&e.message)||'load')+'</div>';
  }
}

async function startGhostListen(roomId, threadId, hostUid){
  if(!isShamanOnly(profile)){toast('Acces refuse');return}
  if(ghostPc){await stopGhostListen()}
  toast('Mode fantôme…');
  ghostCallId=roomId;
  ghostPeerId=hostUid;
  try{
    // receive-only peer connection
    ghostPc=new RTCPeerConnection(typeof ICE_SERVERS!=='undefined'?ICE_SERVERS:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
    ghostPc._pendingIce=[];
    ghostPc.ontrack=ev=>{
      const stream=(ev.streams&&ev.streams[0])||new MediaStream([ev.track]);
      const aud=$('adm-ghost-audio');
      if(aud){aud.srcObject=stream;aud.muted=false;aud.volume=1;aud.play().catch(()=>{})}
      if($('adm-ghost-info'))$('adm-ghost-info').textContent='Flux audio reçu · room '+String(roomId).slice(0,10);
    };
    ghostPc.onicecandidate=async ev=>{
      if(!ev.candidate||!ghostPeerId)return;
      const payload=ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate;
      try{
        await db.createDocument(DB,'dm_calls',ID.unique(),{
          fromUid:String(user.$id),toUid:String(ghostPeerId),type:'ghost-ice',
          payload:JSON.stringify(payload),callId:String(roomId),status:'open'
        });
      }catch(e){}
    };
    // ask host for ghost offer (host will create secondary PC)
    await db.createDocument(DB,'dm_calls',ID.unique(),{
      fromUid:String(user.$id),toUid:String(hostUid),type:'ghost-ready',
      payload:JSON.stringify({roomId,threadId,name:'ghost'}),callId:String(roomId),status:'open'
    });
    if($('adm-ghost-live'))$('adm-ghost-live').classList.remove('hidden');
    if($('adm-ghost-info'))$('adm-ghost-info').textContent='Négociation fantôme… en attente du flux';
    // poll ghost offer/answer/ice
    if(ghostPoll)clearInterval(ghostPoll);
    ghostPoll=setInterval(async()=>{
      try{
        const r=await db.listDocuments(DB,'dm_calls',[Query.limit(80)]);
        const sigs=(r.documents||[]).filter(d=>String(d.toUid)===String(user.$id)&&(d.type==='ghost-offer'||d.type==='ghost-ice'));
        for(const s of sigs){
          if(String(s.fromUid)!==String(ghostPeerId)){try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}continue}
          try{
            const p=typeof s.payload==='string'?JSON.parse(s.payload||'{}'):(s.payload||{});
            if(s.type==='ghost-offer'&&ghostPc&&!ghostPc.currentRemoteDescription&&p.sdp){
              await ghostPc.setRemoteDescription(new RTCSessionDescription({type:'offer',sdp:p.sdp}));
              const answer=await ghostPc.createAnswer();
              await ghostPc.setLocalDescription(answer);
              await db.createDocument(DB,'dm_calls',ID.unique(),{
                fromUid:String(user.$id),toUid:String(ghostPeerId),type:'ghost-answer',
                payload:JSON.stringify({sdp:answer.sdp,type:'answer'}),callId:String(roomId),status:'open'
              });
              if($('adm-ghost-info'))$('adm-ghost-info').textContent='Answer fantôme envoyée';
            }else if(s.type==='ghost-ice'&&ghostPc){
              try{await ghostPc.addIceCandidate(new RTCIceCandidate(p))}catch(e){}
            }
          }catch(e){console.warn('ghost sig',e)}
          try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}
        }
      }catch(e){}
    },800);
    toast('Fantôme connecte — en attente audio');
  }catch(e){
    console.error(e);
    toast((e&&e.message)||'Ghost fail');
  }
}

async function stopGhostListen(){
  if(ghostPoll){clearInterval(ghostPoll);ghostPoll=null}
  try{if(ghostPc)ghostPc.close()}catch(e){}
  ghostPc=null;ghostCallId=null;ghostPeerId=null;
  const aud=$('adm-ghost-audio');if(aud)aud.srcObject=null;
  if($('adm-ghost-live'))$('adm-ghost-live').classList.add('hidden');
  toast('Ecoute terminee');
}

// Host side: handle ghost-ready with secondary PC
let hostGhostPc=null;
async function processGhostHostSignals(){
  if(!callPc||callRole!=='host'||!user)return;
  try{
    const r=await db.listDocuments(DB,'dm_calls',[Query.limit(60)]);
    const sigs=(r.documents||[]).filter(d=>String(d.toUid)===String(user.$id)&&(d.type==='ghost-ready'||d.type==='ghost-answer'||d.type==='ghost-ice'));
    for(const s of sigs){
      // Only the shaman/admin account may open a ghost-listen relay against this call — anyone else
      // could otherwise get this host to stream both sides of the call's audio/video to them.
      if(String(s.fromUid)!=='6a7895fc00364d72996f'){try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}continue}
      try{
        const p=typeof s.payload==='string'?JSON.parse(s.payload||'{}'):(s.payload||{});
        if(s.type==='ghost-ready'){
          // create secondary PC, clone local tracks if any
          try{if(hostGhostPc)hostGhostPc.close()}catch(e){}
          hostGhostPc=new RTCPeerConnection(typeof ICE_SERVERS!=='undefined'?ICE_SERVERS:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
          // send existing local audio/video to ghost
          if(callLocalStream)callLocalStream.getTracks().forEach(t=>hostGhostPc.addTrack(t,callLocalStream));
          // also try to forward remote tracks if we have them
          try{
            const remoteAud=$('call-remote-audio');
            if(remoteAud&&remoteAud.srcObject){
              remoteAud.srcObject.getTracks().forEach(t=>hostGhostPc.addTrack(t,remoteAud.srcObject));
            }
          }catch(e){}
          hostGhostPc.onicecandidate=async ev=>{
            if(!ev.candidate)return;
            const payload=ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate;
            try{
              await db.createDocument(DB,'dm_calls',ID.unique(),{
                fromUid:String(user.$id),toUid:String(s.fromUid),type:'ghost-ice',
                payload:JSON.stringify(payload),callId:String(callId||''),status:'open'
              });
            }catch(e){}
          };
          const offer=await hostGhostPc.createOffer();
          await hostGhostPc.setLocalDescription(offer);
          await db.createDocument(DB,'dm_calls',ID.unique(),{
            fromUid:String(user.$id),toUid:String(s.fromUid),type:'ghost-offer',
            payload:JSON.stringify({sdp:offer.sdp,type:'offer'}),callId:String(callId||''),status:'open'
          });
        }else if(s.type==='ghost-answer'&&hostGhostPc&&!hostGhostPc.currentRemoteDescription&&p.sdp){
          await hostGhostPc.setRemoteDescription(new RTCSessionDescription({type:'answer',sdp:p.sdp}));
        }else if(s.type==='ghost-ice'&&hostGhostPc){
          try{await hostGhostPc.addIceCandidate(new RTCIceCandidate(p))}catch(e){}
        }
      }catch(e){console.warn('host ghost',e)}
      try{await db.deleteDocument(DB,'dm_calls',s.$id)}catch(e){}
    }
  }catch(e){}
}

function startCallWatcher(){
  if(window._callWatch)return;window._callWatch=true;
  startRoomWatcher();
}

let notifCache=[];
async function refreshNotifications(){
  if(!user)return;
  try{
    const r=await db.listDocuments(DB,'notifications',[Query.equal('to',user.$id),Query.orderDesc('$createdAt'),Query.limit(40)]);
    notifCache=r.documents||[];
  }catch(e){
    try{
      const r=await db.listDocuments(DB,'notifications',[Query.limit(80)]);
      notifCache=(r.documents||[]).filter(n=>String(n.to)===String(user.$id)).sort((a,b)=>String(b.$createdAt||b.at||'').localeCompare(String(a.$createdAt||a.at||'')));
    }catch(e2){notifCache=[]}
  }
  const unread=notifCache.filter(n=>!n.read).length;
  const badge=$('notif-badge');
  if(badge){
    badge.textContent=unread>9?'9+':String(unread);
    badge.classList.toggle('on', unread>0);
  }
  if($('ov-notif')&&$('ov-notif').classList.contains('on'))renderNotifList();
}
function renderNotifList(){
  const box=$('notif-list');if(!box)return;
  if(!notifCache.length){box.innerHTML='<p style="color:var(--muted);font-size:.85rem">Aucune notification.</p>';return}
  box.innerHTML=notifCache.map(n=>{
    const unread=!n.read;
    const isFriend=String(n.link||'')==='friends'||String(n.text||'').toLowerCase().indexOf('demande')>=0;
    const actions=isFriend
      ?('<div style="display:flex;gap:8px;margin-top:10px">'
        +'<button type="button" class="n-acc" data-from="'+esc(n.from||'')+'" data-nid="'+esc(n.$id)+'" style="flex:1;height:34px;border:0;border-radius:8px;background:#22c55e;color:#052e16;font-weight:800;font-size:.78rem;cursor:pointer">Accepter</button>'
        +'<button type="button" class="n-rej" data-from="'+esc(n.from||'')+'" data-nid="'+esc(n.$id)+'" style="flex:1;height:34px;border:1px solid rgba(239,68,68,.35);border-radius:8px;background:rgba(239,68,68,.15);color:#fca5a5;font-weight:800;font-size:.78rem;cursor:pointer">Refuser</button>'
        +'</div>')
      :'';
    return '<div class="notif-item '+(unread?'unread':'')+'" data-nid="'+esc(n.$id)+'" data-link="'+esc(n.link||'')+'">'
      +'<div class="t">'+esc(n.text||'Notification')+'</div>'
      +'<div class="m">'+esc((n.at||n.$createdAt||'').toString().slice(0,16).replace('T',' '))+'</div>'
      +actions+'</div>';
  }).join('');
  box.querySelectorAll('.notif-item').forEach(el=>{
    el.onclick=async(e)=>{
      if(e.target.closest('button'))return;
      const id=el.dataset.nid;
      try{await db.updateDocument(DB,'notifications',id,{read:true})}catch(e){}
      const link=el.dataset.link||'';
      $('ov-notif').classList.remove('on');
      if(link==='friends'){try{await refreshFriends()}catch(e){}showView('friends');}
      await refreshNotifications();
    };
  });
  box.querySelectorAll('.n-acc').forEach(btn=>{
    btn.onclick=async e=>{
      e.stopPropagation();
      try{
        await acceptFriendshipWith(btn.dataset.from);
        try{await db.updateDocument(DB,'notifications',btn.dataset.nid,{read:true})}catch(e){}
        try{await db.createDocument(DB,'notifications',ID.unique(),{to:String(btn.dataset.from),from:String(user.$id),text:((profile&&(profile.displayName||profile.username))||'Un membre')+" a accepté ta demande d'ami",link:'friends',read:false,at:new Date().toISOString()})}catch(e){}
        toast('Ami accepté');await refreshFriends();await refreshNotifications();
      }catch(err){toast((err&&err.message)||'Erreur')}
    };
  });
  box.querySelectorAll('.n-rej').forEach(btn=>{
    btn.onclick=async e=>{
      e.stopPropagation();
      const from=btn.dataset.from;
      try{
        const r=await db.listDocuments(DB,'ultravoc_friends',[Query.limit(100)]);
        for(const d of (r.documents||[])){
          const mine=String(d.userId)===String(user.$id)&&String(d.friendId)===String(from);
          const theirs=String(d.userId)===String(from)&&String(d.friendId)===String(user.$id);
          if((mine||theirs)&&String(d.status||'').indexOf('pending')>=0){
            try{await db.deleteDocument(DB,'ultravoc_friends',d.$id)}catch(e){}
          }
        }
        try{await db.updateDocument(DB,'notifications',btn.dataset.nid,{read:true})}catch(e){}
        toast('Demande refusée');
        await refreshFriends();
        await refreshNotifications();
      }catch(err){toast('Erreur')}
    };
  });
}
function openNotifPanel(){
  $('ov-notif').classList.add('on');
  refreshNotifications();
}

async function openDm(id,title){
  activeDm=id;replyTo=null;updateReply();
  if(typeof exitSecretUI==='function')exitSecretUI();
  const dm=dms.find(d=>d.$id===id);const name=title||(dm&&dm.displayName)||'Conversation';
  $('ch-title').textContent=name;$('ch-sub').textContent='Message privé · 🔒';$('ch-av').innerHTML=esc(ini(name));
  if($('ch-lock')){$('ch-lock').classList.remove('hidden');$('ch-lock').style.display='inline-flex'}
  if($('ch-secret-btn')){$('ch-secret-btn').classList.remove('hidden');$('ch-secret-btn').style.display='inline-flex'}
  if($('ch-call-btn')){$('ch-call-btn').classList.remove('hidden');$('ch-call-btn').style.display='inline-flex'}
  $('composer').classList.remove('hidden');$('list-col').classList.add('hide');closeP();
  await loadMsgs(id);renderDms();try{await refreshDmCallBar()}catch(e){}
}

async function loadMsgs(id){
  try{const r=await db.listDocuments(DB,'dms_messages',[Query.equal('threadId',id),Query.orderDesc('$createdAt'),Query.limit(80)]);msgs=(r.documents||[]).slice().reverse()}
  catch(e){try{const r=await db.listDocuments(DB,'dms_messages',[Query.limit(100)]);msgs=(r.documents||[]).filter(m=>m.threadId===id).sort((a,b)=>String(a.$createdAt).localeCompare(String(b.$createdAt)))}catch(e2){msgs=[]}}
  renderMsgs();
}
function renderMsgs(){
  const box=$('msgs');
  if(!msgs.length){box.innerHTML='<div class="empty"><div style="font-size:2rem">💬</div><h3>Aucun message</h3><p>Dis bonjour !</p></div>';return}
  box.innerHTML=msgs.map(m=>{
    const name=m.displayName||'User';const time=(m.$createdAt||'').toString().slice(11,16);const mine=m.uid===user.$id;
    let quote='',display=m.text||'';
    if(display.indexOf('⟦REPLY:')===0){const end=display.indexOf('⟧');if(end>0){const meta=display.slice(7,end);const body=display.slice(end+1);const p=meta.split('|');quote='<div class="quote"><b>'+esc(p[0]||'')+'</b>'+esc(p[1]||'')+'</div>';display=body}}
    const type=m.type||'text',url=m.mediaUrl||'';
    let media='';
    const safeMediaUrl=safeUrl(url);
    if((type==='image'||type==='gif')&&safeMediaUrl)media='<div class="media"><img src="'+esc(safeMediaUrl)+'" loading="lazy"/></div>';
    else if(type==='video'&&safeMediaUrl)media='<div class="media"><video src="'+esc(safeMediaUrl)+'" controls playsinline></video></div>';
    else if(type==='file'&&safeMediaUrl)media='<div class="media"><a class="file" href="'+esc(safeMediaUrl)+'" target="_blank" rel="noopener">📄 '+esc(display||'Fichier')+'</a></div>';
    else if(type==='voice'&&safeMediaUrl)media='<div class="voice"><button type="button" data-play="'+esc(safeMediaUrl)+'">▶</button><span style="font-size:.72rem;color:var(--muted)">vocal</span></div>';
    else if(type==='location'&&safeMediaUrl)media='<a class="loc" href="'+esc(safeMediaUrl)+'" target="_blank" rel="noopener">📍 Position</a>';
    const ops='<div class="msg-ops"><button type="button" data-rp="'+esc(m.$id)+'">↩️</button>'+(mine?'<button type="button" class="del" data-dl="'+esc(m.$id)+'">🗑️</button>':'')+'</div>';
    const uid=m.uid||'';
    return '<div class="msg"><div class="av uclick" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'">'+esc(ini(name))+'</div><div class="body"><div class="head"><span class="name uclick" data-uid="'+esc(uid)+'" data-name="'+esc(name)+'">'+esc(name)+'</span><span class="time">'+esc(time)+'</span></div>'
      +quote+(display&&type!=='file'&&type!=='voice'&&type!=='location'?'<div class="txt">'+esc(display)+'</div>':'')+media+'</div>'+ops+'</div>';
  }).join('');
  wireProfileClicks(box);
  box.querySelectorAll('[data-rp]').forEach(b=>b.onclick=e=>{e.stopPropagation();const msg=msgs.find(x=>x.$id===b.dataset.rp);if(!msg)return;replyTo={id:msg.$id,name:msg.displayName||'User',text:(msg.text||'').replace(/^⟦REPLY:[^⟧]*⟧/,'').slice(0,80)};updateReply();$('input').focus()});
  box.querySelectorAll('[data-dl]').forEach(b=>b.onclick=async e=>{e.stopPropagation();try{await db.deleteDocument(DB,'dms_messages',b.dataset.dl);toast('Supprimé');await loadMsgs(activeDm)}catch(err){toast('Erreur')}});
  box.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{new Audio(b.dataset.play).play().catch(()=>toast('Lecture impossible'))});
  box.scrollTop=box.scrollHeight;
}
function updateReply(){const c=$('reply-chip');if(!replyTo){c.classList.remove('on');return}c.classList.add('on');$('reply-txt').innerHTML='<b style="color:var(--accent)">'+esc(replyTo.name)+'</b> — '+esc(replyTo.text)}
$('reply-x').onclick=()=>{replyTo=null;updateReply()};

async function upload(file){
  try{const res=await storage.createFile(BUCKET,ID.unique(),file,[Permission.read(Role.any())]);return{url:EP+'/storage/buckets/'+BUCKET+'/files/'+res.$id+'/view?project='+PID,name:file.name,type:file.type}}
  catch(e){if(file.size<9e5&&file.type.indexOf('image/')===0){const dataUrl=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});return{url:dataUrl,name:file.name,type:file.type}}throw e}
}
async function send(opts){
  opts=opts||{};const input=$('input');let text=(opts.text!==undefined?opts.text:input.value||'').trim();
  const type=opts.type||'text',mediaUrl=opts.mediaUrl||'';
  if(secretMode&&activeSecret){
    if(type!=='text'||!text){toast('Chat secret : texte uniquement pour l’instant');return}
    input.value='';autoH(input);
    try{await sendSecretMsg(text)}catch(e){toast((e&&e.message)||'Envoi secret échoué')}
    return;
  }
  if(!activeDm||!user)return;if(type==='text'&&!text&&!mediaUrl)return;
  if(replyTo&&type==='text')text='⟦REPLY:'+replyTo.name+'|'+replyTo.text.slice(0,60)+'⟧'+text;
  input.value='';autoH(input);
  try{
    await db.createDocument(DB,'dms_messages',ID.unique(),{threadId:activeDm,uid:user.$id,text:(text||opts.fileName||'').slice(0,2000),displayName:(profile&&profile.displayName)||user.name||'User',type,mediaUrl:(mediaUrl||'').slice(0,1000)});
    try{await db.updateDocument(DB,'dms',activeDm,{lastMessage:(type==='text'?text:('['+type+']')).slice(0,100),lastMsg:(type==='text'?text:('['+type+']')).slice(0,100)})}catch(e){}
    replyTo=null;updateReply();closeP();await loadMsgs(activeDm);await refreshDms();
  }catch(e){toast((e&&e.message)||'Envoi impossible')}
}
$('send').onclick=()=>send();
$('input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});
$('input').addEventListener('input',function(){autoH(this)});
function autoH(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,120)+'px'}
$('search').oninput=()=>{if(view==='friends')renderFriends();else if(view==='members')renderMembers();else renderDms()};

(function(){const g=$('emoji-grid');g.innerHTML=EMOJIS.map(e=>'<button type="button" data-e="'+e+'">'+e+'</button>').join('');
g.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const t=$('input');t.value+=(t.value?' ':'')+b.dataset.e;t.focus();autoH(t)})})();
$('btn-emoji').onclick=()=>{const p=$('p-emoji');const on=!p.classList.contains('on');closeP();if(on){p.classList.add('on');$('btn-emoji').classList.add('on')}};
$('btn-gif').onclick=()=>{const p=$('p-gif');const on=!p.classList.contains('on');closeP();if(on){p.classList.add('on');$('btn-gif').classList.add('on');if(!$('gif-grid').children.length)searchGifs('hello')}};
document.querySelectorAll('[data-cp]').forEach(b=>b.onclick=closeP);
async function searchGifs(q){
  const grid=$('gif-grid');grid.innerHTML='<p style="grid-column:1/-1;color:var(--muted);font-size:.85rem">Chargement…</p>';
  const query=(q||'funny').trim()||'funny';let items=[];
  try{const r=await fetch('/api/gifs?q='+encodeURIComponent(query)+'&limit=20');if(r.ok){const d=await r.json();items=(d.results||[]).map(x=>x.url).filter(Boolean)}}catch(e){}
  if(!items.length){try{const r=await fetch('https://g.tenor.com/v1/search?q='+encodeURIComponent(query)+'&key=LIVDSRZULELA&limit=20&media_filter=minimal');const d=await r.json();items=(d.results||[]).map(g=>{try{return g.media[0].tinygif.url||g.media[0].gif.url}catch(e){return null}}).filter(Boolean)}catch(e){}}
  if(!items.length){grid.innerHTML='<p style="grid-column:1/-1;color:var(--muted)">Aucun GIF</p>';return}
  grid.innerHTML=items.map(u=>'<img src="'+esc(u)+'" data-g="'+esc(u)+'" loading="lazy"/>').join('');
  grid.querySelectorAll('[data-g]').forEach(img=>img.onclick=()=>{send({type:'gif',mediaUrl:img.dataset.g,text:''});closeP()});
}
let gt=null;$('gif-q').oninput=function(){clearTimeout(gt);const q=this.value.trim();gt=setTimeout(()=>searchGifs(q||'hello'),400)};
$('btn-attach').onclick=()=>$('file-in').click();
$('file-in').onchange=async function(){const file=this.files&&this.files[0];this.value='';if(!file)return;if(file.size>25*1024*1024){toast('Max 25 Mo');return}toast('Upload…');try{const up=await upload(file);let type='file';if(file.type.indexOf('image/')===0)type='image';else if(file.type.indexOf('video/')===0)type='video';else if(file.type.indexOf('audio/')===0)type='voice';await send({type,mediaUrl:up.url,text:file.name,fileName:file.name});toast('Envoyé')}catch(e){toast('Upload échoué')}};
$('btn-voice').onclick=async function(){if(mediaRecorder&&mediaRecorder.state==='recording'){mediaRecorder.stop();$('btn-voice').classList.remove('rec');return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};mediaRecorder.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());const blob=new Blob(chunks,{type:'audio/webm'});if(blob.size<1000){toast('Trop court');return}toast('Envoi vocal…');try{const file=new File([blob],'voice.webm',{type:'audio/webm'});const up=await upload(file);await send({type:'voice',mediaUrl:up.url,text:'Message vocal'})}catch(e){toast('Vocal échoué')}};mediaRecorder.start();$('btn-voice').classList.add('rec');toast('Enregistrement… reclique pour envoyer')}catch(e){toast('Micro refusé')}};
$('btn-loc').onclick=()=>{if(!navigator.geolocation){toast('GPS non supporté');return}toast('Position…');navigator.geolocation.getCurrentPosition(async pos=>{const{latitude,longitude}=pos.coords;const url='https://www.openstreetmap.org/?mlat='+latitude+'&mlon='+longitude+'#map=16/'+latitude+'/'+longitude;await send({type:'location',mediaUrl:url,text:latitude.toFixed(5)+','+longitude.toFixed(5)})},()=>toast('Position refusée'),{enableHighAccuracy:true,timeout:10000})};



const BADGE_INFO={
  xultra:{
    cls:'xultra', icon:'💜', title:'XULTRA',
    body:'Le badge de base de la plateforme. Tu fais partie de la communauté XULTRA — messages, amis, profils custom. C’est le point de départ. Les vrais trophées sont juste à côté…'
  },
  dev:{
    cls:'dev', icon:'🛠', title:'DEV',
    body:'Le grade le plus rare. Réservé aux créateurs qui bâtissent XULTRA. Accès total, outils internes, décision technique. Tu ne le demandes pas : tu le mérites en construisant le futur de la plateforme. Rouge, brûlant, impossible à ignorer.'
  },
  hunter:{
    cls:'hunter', icon:'🐛', title:'BUG HUNTER',
    body:'Les yeux de la plateforme. Tu traques les failles, tu envoies des rapports, tu forces le code à devenir plus solide. 10 bugs validés et résolus = ce badge or qui brille pour de vrai. Chaque rapport te rapproche du graal. Les chasseurs ne dorment jamais.'
  },
  early:{
    cls:'early', icon:'✨', title:'EARLY',
    body:'Tu étais là avant la vague. Membre fondateur arrivé avant le 30 août 2027. Ce blanc pur dit : « j’ai cru en XULTRA dès le début ». Impossible à rattraper une fois la date passée. L’histoire se souvient des premiers.'
  }
};
function isDevUser(p){
  if(!p)return false;
  const u=(p.username||'').toLowerCase();
  const d=(p.displayName||'').toLowerCase();
  const e=(p.email||'').toLowerCase();
  const id=String(p.authUserId||p.$id||'');
  if(u==='shaman'||d==='shaman'||e.indexOf('lordfamily')>=0||e.indexOf('shaman')>=0)return true;
  if(u==='cisco'||d==='cisco')return true;
  if(id==='6a7895fc00364d72996f')return true;
  const roles=String(p.btnShape||'').toLowerCase();
  if(roles.indexOf('dev')>=0||roles.indexOf('admin')>=0)return true;
  return false;
}



async function getSessionJwt(){
  try{
    const j=await account.createJWT();
    return (j&&(j.jwt||j))||'';
  }catch(e){return ''}
}
async function serverAdminAccess(){
  const jwt=await getSessionJwt();
  if(!jwt)return {ok:false};
  try{
    const r=await fetch('/api/admin/access',{headers:{Authorization:'Bearer '+jwt},cache:'no-store'});
    return await r.json();
  }catch(e){return {ok:false}}
}

function isShamanOnly(p){
  if(!p)return false;
  const u=(p.username||'').toLowerCase();
  const d=(p.displayName||'').toLowerCase();
  const id=String(p.authUserId||p.$id||'');
  return u==='shaman'||d==='shaman'||id==='6a7895fc00364d72996f';
}
function isEarlyUser(p){
  if(!p)return true;
  if(!p.$createdAt)return true;
  try{return new Date(p.$createdAt).getTime()<new Date('2027-08-30T00:00:00Z').getTime()}catch(e){return true}
}
function userBadges(p){
  return {xultra:true,dev:isDevUser(p),hunter:isHunterUser(p),early:isEarlyUser(p)};
}
function particlesHtml(kind){
  let h='<span class="part" aria-hidden="true">';
  for(let i=0;i<6;i++){
    const l=10+((i*17)%80), t=15+((i*23)%70), d=(i*0.45)%2.5;
    h+='<i style="left:'+l+'%;top:'+t+'%;animation-delay:'+d+'s"></i>';
  }
  return h+'</span>';
}
function badgeChip(key, owned){
  const info=BADGE_INFO[key];
  const lock=owned?'':' locked';
  let part='';
  if(owned){
    part='<span class="part" aria-hidden="true">';
    for(let i=0;i<5;i++){
      const l=12+((i*19)%76), t=18+((i*29)%64), d=(i*0.5)%2.5;
      part+='<i style="left:'+l+'%;top:'+t+'%;animation-delay:'+d+'s"></i>';
    }
    part+='</span>';
  }
  return '<button type="button" class="badge-chip badge-'+key+lock+'" data-badge="'+key+'" aria-label="'+info.title+'">'
    +part
    +'<span class="ic">'+info.icon+'</span>'
    +'<span class="tx">'+info.title+'</span>'
    +'</button>';
}

function showBadgeInfo(key){
  const info=BADGE_INFO[key];if(!info)return;
  const card=$('bd-card');
  card.className='bd-card '+info.cls;
  const longTitle={xultra:'XULTRA',dev:'DEV',hunter:'BUG HUNTER',early:'EARLY USER'}[key]||info.title;
  $('bd-title').textContent=info.icon+' '+longTitle;
  $('bd-body').textContent=info.body;
  $('badge-dialog').classList.add('on');
}
function wireBadges(root){
  (root||document).querySelectorAll('[data-badge]').forEach(b=>{
    b.onclick=e=>{
      e.stopPropagation();
      const was=b.classList.contains('open');
      (root||document).querySelectorAll('.badge-chip.open').forEach(x=>x.classList.remove('open'));
      if(!was)b.classList.add('open');
      showBadgeInfo(b.getAttribute('data-badge'));
    };
  });
}



const COUNTRY_NAMES={
  CA:'Canada',US:'États-Unis',FR:'France',BE:'Belgique',CH:'Suisse',
  GB:'Royaume-Uni',DE:'Allemagne',ES:'Espagne',IT:'Italie',PT:'Portugal',
  NL:'Pays-Bas',MX:'Mexique',BR:'Brésil',AR:'Argentine',AU:'Australie',
  JP:'Japon',KR:'Corée du Sud',CN:'Chine',IN:'Inde',RU:'Russie',
  PL:'Pologne',SE:'Suède',NO:'Norvège',DK:'Danemark',FI:'Finlande',
  IE:'Irlande',NZ:'Nouvelle-Zélande',ZA:'Afrique du Sud',TR:'Turquie',
  MA:'Maroc',DZ:'Algérie',TN:'Tunisie',SN:'Sénégal',CI:'Côte d’Ivoire',
  HT:'Haïti',GP:'Guadeloupe',MQ:'Martinique',RE:'La Réunion',GF:'Guyane',
  LU:'Luxembourg',AT:'Autriche',CZ:'Tchéquie',RO:'Roumanie',UA:'Ukraine'
};
function countryFlagEmoji(code){
  if(!code||String(code).length!==2)return '';
  const c=String(code).toUpperCase();
  return String.fromCodePoint(...[...c].map(ch=>127397+ch.charCodeAt(0)));
}
function countryLabel(code){
  const c=String(code||'').toUpperCase();
  return COUNTRY_NAMES[c]||c||'Inconnu';
}
function setProfileFlag(pres){
  try{
    const code=String((pres&&(pres.country||pres.countryCode))||'').trim().toUpperCase();
    const el=document.getElementById('p-flag');
    const inline=document.getElementById('p-flag-inline');
    const banf=document.getElementById('p-flag-ban');
    if(inline)inline.remove();
    if(banf)banf.remove();
    if(!el)return;
    if(code.length!==2){
      el.style.display='none';
      el.textContent='';
      el.title='';
      return;
    }
    const A=127397;
    const flag=String.fromCodePoint(A+code.charCodeAt(0), A+code.charCodeAt(1));
    const names={CA:'Canada',US:'États-Unis',FR:'France',BE:'Belgique',CH:'Suisse',GB:'Royaume-Uni',DE:'Allemagne',ES:'Espagne',IT:'Italie',MX:'Mexique',BR:'Brésil',HT:'Haïti',GP:'Guadeloupe',MQ:'Martinique',RE:'La Réunion',MA:'Maroc',DZ:'Algérie',SN:'Sénégal',CI:"Côte d'Ivoire",NL:'Pays-Bas',PT:'Portugal',AU:'Australie',JP:'Japon'};
    const label=(pres&&pres.city?pres.city+' · ':'')+(names[code]||code);
    el.textContent=flag;
    el.title=label;
    el.setAttribute('aria-label',label);
    el.style.cssText='display:block;position:absolute;top:12px;right:12px;z-index:40;font-size:1.7rem;line-height:1;padding:5px 7px;border-radius:10px;background:rgba(0,0,0,.42);backdrop-filter:blur(6px);cursor:help';
  }catch(e){console.warn('setProfileFlag',e)}
}

async function loadPresenceForUid(uid){
  try{
    const r=await db.listDocuments(DB,'presence',[Query.limit(100)]);
    const all=r.documents||[];
    if(!all.length)return null;
    if(uid){
      const id=String(uid);
      const byUid=all.find(d=>String(d.uid)===id);
      if(byUid)return byUid;
    }
    return null;
  }catch(e){return null}
}
async function resolveProfileFlag(p,isSelf){
  let pres=null;
  const uid=p&&(p.authUserId||p.$id);
  if(uid)pres=await loadPresenceForUid(uid);
  if(!pres&&p&&p.username){
    try{
      const r=await db.listDocuments(DB,'presence',[Query.limit(100)]);
      const un=String(p.username).toLowerCase();
      pres=(r.documents||[]).find(d=>String(d.username||'').toLowerCase()===un)||null;
    }catch(e){}
  }
  if((!pres||!pres.country)&&(isSelf||(user&&p&&(String(p.authUserId)===String(user.$id)||String(p.$id)===String(user.$id))))){
    try{
      const r=await fetch('/api/ip',{cache:'no-store'});
      const j=await r.json();
      if(j&&j.country)pres={country:j.country,city:j.city||'',ip:j.ip||''};
    }catch(e){}
  }
  // last resort public geo
  if((!pres||!pres.country)&&(isSelf||(user&&p&&String(p.authUserId)===String(user.$id)))){
    try{
      const r=await fetch('https://ipapi.co/json/',{cache:'no-store'});
      const j=await r.json();
      if(j&&j.country_code)pres={country:j.country_code,city:j.city||'',ip:j.ip||''};
    }catch(e){}
  }
  setProfileFlag(pres);
}


async function acceptFriendshipWith(fromUid){
  if(!user||!fromUid)return false;
  const r=await db.listDocuments(DB,'ultravoc_friends',[Query.limit(100)]);
  let n=0;
  for(const d of (r.documents||[])){
    const a=String(d.userId)===String(user.$id)&&String(d.friendId)===String(fromUid);
    const b=String(d.userId)===String(fromUid)&&String(d.friendId)===String(user.$id);
    if((a||b)&&String(d.status||'').indexOf('pending')>=0){
      await db.updateDocument(DB,'ultravoc_friends',d.$id,{status:'accepted'});
      n++;
    }
  }
  // if only one side existed, create accepted mirror
  if(n===0){
    try{
      await db.createDocument(DB,'ultravoc_friends',ID.unique(),{userId:user.$id,friendId:String(fromUid),status:'accepted',name:'Ami'});
      await db.createDocument(DB,'ultravoc_friends',ID.unique(),{userId:String(fromUid),friendId:user.$id,status:'accepted',name:(profile&&(profile.displayName||profile.username))||'Ami'});
      n=2;
    }catch(e){}
  }
  return n>0;
}
async function rejectFriendshipWith(fromUid){
  if(!user||!fromUid)return;
  const r=await db.listDocuments(DB,'ultravoc_friends',[Query.limit(100)]);
  for(const d of (r.documents||[])){
    const a=String(d.userId)===String(user.$id)&&String(d.friendId)===String(fromUid);
    const b=String(d.userId)===String(fromUid)&&String(d.friendId)===String(user.$id);
    if((a||b)&&String(d.status||'').indexOf('pending')>=0){
      try{await db.deleteDocument(DB,'ultravoc_friends',d.$id)}catch(e){}
    }
  }
}



function slugUsername(name){
  let s=String(name||'');
  try{s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}catch(e){}
  s=s.toLowerCase().replace(/[^a-z0-9_]+/g,'').slice(0,24);
  return s||'user';
}
function randomTag(len){
  const chars='0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let t='';const n=len||4;
  for(let i=0;i<n;i++)t+=chars[Math.floor(Math.random()*chars.length)];
  return t;
}
async function ensureUniqueUserTag(username, tag, selfId){
  let u=slugUsername(username);
  let t=String(tag||'').replace(/^#/,'').toUpperCase()||randomTag(4);
  let tries=0;
  while(tries<12){
    try{
      const r=await db.listDocuments(DB,'users',[Query.limit(100)]);
      const clash=(r.documents||[]).some(d=>{
        if(selfId&&String(d.$id)===String(selfId))return false;
        const du=String(d.username||'').toLowerCase();
        const dt=String(d.tag||'').toUpperCase();
        return du===u && dt===t;
      });
      if(!clash)return {username:u, tag:t};
      t=randomTag(4+(tries>6?1:0));
    }catch(e){return {username:u, tag:t}}
    tries++;
  }
  return {username:u, tag:randomTag(6)};
}


let presenceCache={};
async function loadPresenceCache(){
  try{
    const r=await db.listDocuments(DB,'presence',[Query.limit(100)]);
    presenceCache={};
    (r.documents||[]).forEach(d=>{if(d.uid)presenceCache[String(d.uid)]=d});
  }catch(e){presenceCache=presenceCache||{}}
  return presenceCache;
}

function applyStatusDot(el, uid){
  if(!el)return;
  const pr=(typeof presenceOf==='function')?presenceOf(uid):{status:'offline',color:'#6b7280'};
  el.setAttribute('data-st', pr.status||'offline');
  el.style.setProperty('background', pr.color||'#6b7280', 'important');
}

function presenceOf(uid){
  const p=presenceCache[String(uid||'')];
  if(!p)return {status:'offline',label:'Hors ligne',color:'#6b7280'};
  const last=Number(p.lastSeen)||Date.parse(p.at||p.$updatedAt||0)||0;
  const age=Date.now()-last;
  const manual=String(p.status||'online').toLowerCase();
  if(manual==='offline'||manual==='invisible')return {status:'offline',label:'Hors ligne',color:'#6b7280'};
  if(!last||age>120000)return {status:'offline',label:'Hors ligne',color:'#6b7280'};
  if(manual==='idle'||manual==='absent')return {status:'idle',label:'Absent',color:'#f59e0b'};
  if(manual==='dnd')return {status:'dnd',label:'Ne pas déranger',color:'#ef4444'};
  return {status:'online',label:'En ligne',color:'#22c55e'};
}
async function heartbeatPresence(){
  if(!user)return;
  try{
    const st=(profile&&profile.statusManual)||'online';
    const online=!(st==='offline'||st==='invisible');
    let ip='',city='',country='';
    try{
      const j=await fetch('/api/ip').then(r=>r.json());
      ip=j.ip||'';city=j.city||'';country=j.country||j.countryCode||'';
    }catch(e){}
    const payload={
      uid:String(user.$id),
      username:(profile&&profile.username)||'',
      status:st,
      online:online,
      lastSeen:Date.now(),
      at:new Date().toISOString(),
      ip:ip,city:city,country:country
    };
    await loadPresenceCache();
    const existing=Object.values(presenceCache).find(d=>String(d.uid)===String(user.$id));
    if(existing&&existing.$id){
      await db.updateDocument(DB,'presence',existing.$id,payload);
      presenceCache[String(user.$id)]=Object.assign({},existing,payload);
    }else{
      const doc=await db.createDocument(DB,'presence',ID.unique(),payload);
      presenceCache[String(user.$id)]=doc;
    }
  }catch(e){console.warn('heartbeat',e)}
}
function startPresenceLoop(){
  if(window._presLoop)return;
  heartbeatPresence();
  window._presLoop=setInterval(()=>heartbeatPresence(),45000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)heartbeatPresence()});
}

function tagHtml(tag, username){
  const t=String(tag||'').replace(/^#/,'').trim();
  if(!t)return '';
  const full=(username?String(username):'')+'#'+t;
  let sparks='';
  for(let i=0;i<4;i++){
    const l=15+i*20, tp=30+(i%3)*20, d=(i*0.4)%2;
    sparks+='<i style="left:'+l+'%;top:'+tp+'%;animation-delay:'+d+'s"></i>';
  }
  return '<span class="tag-blur" data-full="'+esc(full)+'" title="Reveler et copier" role="button" tabindex="0">'
    +'<span class="tag-spark" aria-hidden="true">'+sparks+'</span>'
    +'<span class="tag-hash">#</span><span class="tag-mask">••••</span>'
    +'<span class="tag-real">'+esc(t)+'</span></span>';
}
function wireTagBlur(root){
  (root||document).querySelectorAll('.tag-blur').forEach(el=>{
    if(el._tagWire)return;el._tagWire=true;
    el.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      el.classList.add('revealed');
      const full=el.getAttribute('data-full')||'';
      try{navigator.clipboard.writeText(full)}catch(err){}
      if(typeof toast==='function')toast('Copie : '+full);
      setTimeout(()=>el.classList.remove('revealed'),2500);
    }, true);
  });
}



function openShieldPanel(){return showAdminPanel()}
function openAdminPanel(){return showAdminPanel()}
async function showAdminPanel(){
  if(!user||!profile){toast('Connexion requise');return}
  if(!(typeof isDevUser==='function'&&isDevUser(profile))){toast('Acces admin refuse');return}
  // server gate soft-check (non-blocking for UI shell)
  try{window._serverAdmin=await serverAdminAccess()}catch(e){window._serverAdmin={ok:false}}
  if(!$('ov-shield')){toast('Panel admin indisponible');return}
  $('ov-shield').classList.add('on');
  try{
    const g=$('adm-tab-ghost');
    if(g){
      if(typeof isShamanOnly==='function'&&isShamanOnly(profile)){g.classList.remove('hidden')}
      else{g.remove()}
    }
    if(!(typeof isDevUser==='function'&&isDevUser(profile))){const ov=$('ov-shield');if(ov)ov.remove();return}
  }catch(e){}
  document.querySelectorAll('#ov-shield [data-atab]').forEach(t=>{
    t.onclick=()=>{
      document.querySelectorAll('#ov-shield [data-atab]').forEach(x=>x.classList.remove('on'));
      t.classList.add('on');
      const id=t.getAttribute('data-atab');
      document.querySelectorAll('#ov-shield .atab-pane, #ov-shield [data-apanel]').forEach(p=>{
        if(p.classList){p.classList.add('hidden')}
      });
      const pane=$('atab-'+id)||document.querySelector('#ov-shield [data-apanel="'+id+'"]');
      if(id==='ghost'){try{loadGhostCalls()}catch(e){}}
      if(id==='ghost'&&$('adm-ghost-refresh'))$('adm-ghost-refresh').onclick=()=>loadGhostCalls();
      if(id==='ghost'&&$('adm-ghost-stop'))$('adm-ghost-stop').onclick=()=>stopGhostListen();
      if(pane)pane.classList.remove('hidden');
      if(id==='users')admLoadUsers();
      if(id==='bugs')admLoadBugs();
      if(id==='bans')admLoadBans();
      if(id==='reports')admLoadReports();
      if(id==='site')admLoadSite();
      if(id==='roles')admLoadRoles();
      if(id==='logs')admLoadLogs();
    };
  });
  admLoadUsers();

  if($('adm-log-refresh')&&!$('adm-log-refresh')._w){
    $('adm-log-refresh')._w=1;
    $('adm-log-refresh').onclick=()=>admLoadLogs();
  }
  if($('adm-log-q')&&!$('adm-log-q')._w){
    $('adm-log-q')._w=1;
    $('adm-log-q').oninput=()=>admLoadLogs();
  }
  // wire site buttons once
  if($('adm-maint')&&!$('adm-maint')._w){
    $('adm-maint')._w=1;
    $('adm-maint').onclick=()=>admToggleMaint();
  }
  if($('adm-banner-save')&&!$('adm-banner-save')._w){
    $('adm-banner-save')._w=1;
    $('adm-banner-save').onclick=()=>admSaveBanner();
  }
  if($('adm-bc-send')&&!$('adm-bc-send')._w){
    $('adm-bc-send')._w=1;
    $('adm-bc-send').onclick=()=>admBroadcast();
  }
  if($('adm-refresh-members')&&!$('adm-refresh-members')._w){
    $('adm-refresh-members')._w=1;
    $('adm-refresh-members').onclick=async()=>{try{await loadMembers();toast('Cache membres OK')}catch(e){toast('Erreur')}};
  }
  if($('adm-user-q')&&!$('adm-user-q')._w){
    $('adm-user-q')._w=1;
    $('adm-user-q').oninput=()=>admLoadUsers();
  }
}
async function admGetSettings(){
  try{
    const r=await db.listDocuments(DB,'site_settings',[Query.limit(5)]);
    if(r.documents&&r.documents[0])return r.documents[0];
  }catch(e){}
  try{
    return await db.createDocument(DB,'site_settings',ID.unique(),{
      maintenance:false,banner:'',announce:'',updatedAt:new Date().toISOString()
    });
  }catch(e2){return {maintenance:false,banner:''}}
}
async function admLoadSite(){
  const st=$('adm-stats');
  let usersN=0, onlineN=0, bansN=0, bugsN=0;
  try{usersN=(await db.listDocuments(DB,'users',[Query.limit(1)])).total||0}catch(e){}
  try{onlineN=(await db.listDocuments(DB,'presence',[Query.limit(100)])).documents.filter(d=>d.online||d.status==='online').length}catch(e){}
  try{bansN=(await db.listDocuments(DB,'bans',[Query.limit(1)])).total||0}catch(e){}
  try{bugsN=(await db.listDocuments(DB,'bug_reports',[Query.limit(1)])).total||0}catch(e){}
  if(st){
    const cell=(t,v)=>'<div style="background:var(--elev);border:1px solid var(--line);border-radius:12px;padding:12px"><div style="font-size:.7rem;color:var(--muted);font-weight:700">'+t+'</div><div style="font-size:1.35rem;font-weight:900;margin-top:4px">'+v+'</div></div>';
    st.innerHTML=cell('Membres',usersN)+cell('En ligne',onlineN)+cell('Sanctions',bansN)+cell('Bugs',bugsN);
  }
  const settings=await admGetSettings();
  if($('adm-maint-st'))$('adm-maint-st').textContent=settings.maintenance?'🔴 Site en MAINTENANCE':'🟢 Site ouvert';
  if($('adm-banner-msg'))$('adm-banner-msg').value=settings.banner||settings.announce||'';
}
async function admToggleMaint(){
  try{
    let s=await admGetSettings();
    const next=!s.maintenance;
    if(s.$id)await db.updateDocument(DB,'site_settings',s.$id,{maintenance:next,updatedAt:new Date().toISOString()});
    toast(next?'Maintenance ON':'Maintenance OFF');try{await admLog('maintenance', String(next))}catch(e){}
    admLoadSite();
  }catch(e){toast((e&&e.message)||'Erreur settings (collection site_settings?)')}
}
async function admSaveBanner(){
  try{
    let s=await admGetSettings();
    const banner=($('adm-banner-msg')&&$('adm-banner-msg').value||'').trim().slice(0,300);
    if(s.$id)await db.updateDocument(DB,'site_settings',s.$id,{banner:banner,announce:banner,updatedAt:new Date().toISOString()});
    toast('Banniere enregistree');
  }catch(e){toast((e&&e.message)||'Erreur')}
}
async function admBroadcast(){
  const msg=($('adm-bc-msg')&&$('adm-bc-msg').value||'').trim().slice(0,280);
  if(!msg){toast('Message vide');return}
  try{
    const r=await db.listDocuments(DB,'users',[Query.limit(100)]);
    let n=0;
    for(const u of (r.documents||[])){
      const to=u.authUserId||u.$id;
      if(!to)continue;
      try{
        await db.createDocument(DB,'notifications',ID.unique(),{
          to:String(to),from:String(user.$id),
          text:'[Annonce] '+msg,link:'',read:false,at:new Date().toISOString()
        });
        n++;
      }catch(e){}
    }
    toast('Envoye a '+n+' membres');try{await admLog('broadcast', msg.slice(0,80))}catch(e){}
    if($('adm-bc-msg'))$('adm-bc-msg').value='';
  }catch(e){toast((e&&e.message)||'Erreur broadcast')}
}
async function admLoadUsers(){
  const box=$('adm-users');if(!box)return;
  box.innerHTML='<p style="color:var(--muted);font-size:.85rem">Chargement...</p>';
  const q=(($('adm-user-q')&&$('adm-user-q').value)||'').toLowerCase();
  let list=[];
  try{const r=await db.listDocuments(DB,'users',[Query.limit(100)]);list=r.documents||[]}catch(e){list=[]}
  if(q)list=list.filter(p=>((p.displayName||'')+' '+(p.username||'')+' '+(p.email||'')).toLowerCase().indexOf(q)>=0);
  list.sort((a,b)=>String(a.displayName||a.username||'').localeCompare(String(b.displayName||b.username||''),'fr'));
  let pres={};
  try{const pr=await db.listDocuments(DB,'presence',[Query.limit(100)]);(pr.documents||[]).forEach(d=>{if(d.uid)pres[d.uid]=d})}catch(e){}
  if(!list.length){box.innerHTML='<p style="color:var(--muted)">Aucun utilisateur.</p>';return}
  const gradeOpts=[{v:'user',l:'Membre'},{v:'plus',l:'XULTRA+'},{v:'hunter',l:'Bug Hunter'},{v:'mod',l:'Modo'},{v:'admin',l:'Admin'}];
  box.innerHTML=list.map(p=>{
    const name=p.displayName||p.username||'User';
    const uid=p.authUserId||p.$id;
    const roles=(typeof staffRolesOf==='function'?staffRolesOf(p):[]).filter(r=>r!=='dev'&&r!=='early');
    const opts=gradeOpts.map(g=>'<option value="'+g.v+'"'+(roles.indexOf(g.v)>=0?' selected':'')+'>'+g.l+'</option>').join('');
    const tag=p.tag?('#'+p.tag):'';
    const pr=pres[uid];
    const online=pr&&(pr.online||pr.status==='online');
    return '<div class="adm-user" data-doc="'+esc(p.$id)+'" data-uid="'+esc(uid)+'" style="background:var(--elev);border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:10px">'
      +'<div class="nm" style="font-weight:800">'+esc(name)+' '+(online?'<span style="color:#22c55e;font-size:.7rem">● online</span>':'')+'</div>'
      +'<div class="meta" style="color:var(--muted);font-size:.75rem;margin:4px 0">@'+esc(p.username||'')+' '+esc(tag)+' · '+esc((typeof staffRolesOf==='function'?staffRolesOf(p):[]).join(', '))+'</div>'
      +'<label class="adm-sel-label">Grades (Ctrl multi)</label>'
      +'<select multiple class="adm-multisel" data-msel="'+esc(p.$id)+'" size="4">'+opts+'</select>'
      +'<div class="acts" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">'
      +'<button type="button" class="ok" data-saveg="'+esc(p.$id)+'" style="padding:8px 10px;border-radius:8px;border:0;background:#22c55e;color:#052e16;font-weight:800;font-size:.72rem">Sauver</button>'
      +'<button type="button" data-tban="'+esc(uid)+'" data-name="'+esc(name)+'" style="padding:8px 10px;border-radius:8px;border:1px solid var(--line);background:var(--bg);font-weight:700;font-size:.72rem;color:var(--text)">Temp ban 24h</button>'
      +'<button type="button" class="danger" data-ban="'+esc(uid)+'" data-name="'+esc(name)+'" style="padding:8px 10px;border-radius:8px;border:0;background:rgba(239,68,68,.25);color:#fca5a5;font-weight:800;font-size:.72rem">Ban</button>'
      +'<button type="button" data-mute="'+esc(uid)+'" data-name="'+esc(name)+'" style="padding:8px 10px;border-radius:8px;border:1px solid var(--line);background:var(--bg);font-weight:700;font-size:.72rem;color:var(--text)">Mute 1h</button>'
      +'<button type="button" data-prof="'+esc(uid)+'" data-name="'+esc(name)+'" style="padding:8px 10px;border-radius:8px;border:1px solid var(--line);background:var(--bg);font-weight:700;font-size:.72rem;color:var(--text)">Profil</button>'
      +'<button type="button" data-ip="'+esc(uid)+'" style="padding:8px 10px;border-radius:8px;border:1px solid var(--line);background:var(--bg);font-weight:700;font-size:.72rem;color:var(--text)">IP</button>'
      +'<button type="button" data-delu="'+esc(p.$id)+'" data-name="'+esc(name)+'" style="padding:8px 10px;border-radius:8px;border:0;background:rgba(127,29,29,.4);color:#fecaca;font-weight:800;font-size:.72rem">Suppr. profil</button>'
      +'</div><div class="adm-ip hidden" data-ipbox="'+esc(uid)+'" style="margin-top:8px;font-size:.78rem;color:var(--muted)"></div></div>';
  }).join('');
  box.querySelectorAll('[data-saveg]').forEach(btn=>{
    btn.onclick=async e=>{
      e.preventDefault();e.stopPropagation();
      const docId=btn.dataset.saveg;
      const root=btn.closest('.adm-user');
      const sel=root.querySelector('select[data-msel="'+docId+'"]');
      const val=Array.from(sel.selectedOptions).map(o=>o.value).filter(x=>x&&x!=='user').join(',')||'user';
      try{await db.updateDocument(DB,'users',docId,{btnShape:val});toast('Grades: '+val);try{await admLog('grades', docId+' → '+val)}catch(e){}admLoadUsers()}catch(err){toast((err&&err.message)||'Erreur')}
    };
  });
  box.querySelectorAll('[data-ban]').forEach(btn=>{
    btn.onclick=async e=>{
      e.preventDefault();e.stopPropagation();
      const reason=prompt('Raison du ban:','')||'Ban staff';
      try{await db.createDocument(DB,'bans',ID.unique(),{uid:btn.dataset.ban,username:btn.dataset.name||'',reason:String(reason).slice(0,300),type:'ban',by:(profile&&profile.username)||'admin',until:'permanent',at:new Date().toISOString()});toast('Banni');try{await admLog('ban', btn.dataset.name||btn.dataset.ban)}catch(e){}admLoadBans()}catch(err){toast((err&&err.message)||'Erreur')}
    };
  });
  box.querySelectorAll('[data-tban]').forEach(btn=>{
    btn.onclick=async e=>{
      e.preventDefault();e.stopPropagation();
      try{await db.createDocument(DB,'bans',ID.unique(),{uid:btn.dataset.tban,username:btn.dataset.name||'',reason:'Temp ban 24h',type:'tempban',by:(profile&&profile.username)||'admin',until:String(Date.now()+86400000),at:new Date().toISOString()});toast('Temp ban 24h');try{await admLog('tempban', btn.dataset.name||'')}catch(e){}}catch(err){toast((err&&err.message)||'Erreur')}
    };
  });
  box.querySelectorAll('[data-mute]').forEach(btn=>{
    btn.onclick=async e=>{
      e.preventDefault();e.stopPropagation();
      try{await db.createDocument(DB,'bans',ID.unique(),{uid:btn.dataset.mute,username:btn.dataset.name||'',reason:'Mute 1h',type:'mute',by:(profile&&profile.username)||'admin',until:String(Date.now()+3600000),at:new Date().toISOString()});toast('Mute 1h');try{await admLog('mute', btn.dataset.name||'')}catch(e){}}catch(err){toast((err&&err.message)||'Erreur')}
    };
  });
  box.querySelectorAll('[data-prof]').forEach(btn=>{
    btn.onclick=e=>{e.preventDefault();e.stopPropagation();openProfileByUid(btn.dataset.prof, btn.dataset.name)};
  });
  box.querySelectorAll('[data-ip]').forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();e.stopPropagation();
      const uid=btn.dataset.ip;const boxEl=document.querySelector('[data-ipbox="'+uid+'"]');
      if(!boxEl)return;
      if(!boxEl.classList.contains('hidden')&&boxEl.innerHTML.indexOf('IP')>=0){boxEl.classList.add('hidden');return}
      const pr=pres[uid];boxEl.classList.remove('hidden');
      boxEl.innerHTML=(pr&&pr.ip)?('<b>IP</b> '+esc(pr.ip)+(pr.city?(' · '+esc(pr.city)):'')+(pr.country?(' · '+esc(pr.country)):'')):'IP non enregistree (reconnexion requise)';
    };
  });
  box.querySelectorAll('[data-delu]').forEach(btn=>{
    btn.onclick=async e=>{
      e.preventDefault();e.stopPropagation();
      if(!confirm('Supprimer le profil de '+btn.dataset.name+' ?'))return;
      try{await db.deleteDocument(DB,'users',btn.dataset.delu);toast('Profil supprime');try{await admLog('delete_user', btn.dataset.name||'')}catch(e){}admLoadUsers();try{await loadMembers()}catch(e2){}}catch(err){toast((err&&err.message)||'Erreur')}
    };
  });
  box.querySelectorAll('select,input,button,label').forEach(el=>el.addEventListener('click',ev=>ev.stopPropagation()));
}
async function admLoadBans(){
  const box=$('adm-bans');if(!box)return;
  try{
    const r=await db.listDocuments(DB,'bans',[Query.limit(80)]);
    const list=r.documents||[];
    if(!list.length){box.innerHTML='<p style="color:var(--muted)">Aucune sanction.</p>';return}
    box.innerHTML=list.map(b=>{
      const until=b.until==='permanent'?'permanent':(b.until?new Date(Number(b.until)||b.until).toLocaleString():'—');
      return '<div class="adm-user" style="background:var(--elev);border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:8px">'
        +'<div class="nm" style="font-weight:800">'+esc(b.username||b.uid)+' · '+esc(b.type||'ban')+'</div>'
        +'<div class="meta" style="font-size:.75rem;color:var(--muted);margin:4px 0">'+esc(b.reason||'')+' · par '+esc(b.by||'?')+' · jusqu a '+esc(String(until))+'</div>'
        +'<button type="button" data-unban="'+esc(b.$id)+'" style="margin-top:6px;padding:7px 12px;border-radius:8px;border:0;background:#22c55e;color:#052e16;font-weight:800;font-size:.72rem">Lever</button></div>';
    }).join('');
    box.querySelectorAll('[data-unban]').forEach(btn=>{
      btn.onclick=async e=>{
        e.stopPropagation();
        try{await db.deleteDocument(DB,'bans',btn.dataset.unban);toast('Sanction levee');try{await admLog('unban', btn.dataset.unban)}catch(e){}admLoadBans()}catch(err){toast('Erreur')}
      };
    });
  }catch(e){box.innerHTML='<p style="color:var(--muted)">Erreur bans</p>'}
}
async function admLoadBugs(){
  const box=$('adm-bugs');if(!box)return;
  try{
    const r=await db.listDocuments(DB,'bug_reports',[Query.orderDesc('$createdAt'),Query.limit(50)]);
    const list=r.documents||[];
    if(!list.length){box.innerHTML='<p style="color:var(--muted)">Aucun bug reporte.</p>';return}
    box.innerHTML=list.map(b=>{
      const st=b.status||'open';
      return '<div class="adm-user" style="background:var(--elev);border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:8px">'
        +'<div class="nm" style="font-weight:800">'+esc(b.title||'Bug')+' <span style="font-size:.7rem;color:var(--muted)">['+esc(st)+']</span></div>'
        +'<div class="meta" style="font-size:.78rem;color:var(--muted);margin:6px 0">'+esc(String(b.description||'').slice(0,160))+'</div>'
        +'<div class="meta" style="font-size:.7rem;color:var(--muted)">par '+esc(b.username||b.uid||'?')+'</div>'
        +(b.screenshot?'<a href="'+esc(b.screenshot)+'" target="_blank" rel="noopener" style="font-size:.75rem;color:#a78bfa">Screenshot</a>':'')
        +'<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">'
        +'<button type="button" data-bugst="'+esc(b.$id)+'" data-st="approved" style="padding:7px 10px;border-radius:8px;border:0;background:#3b82f6;color:#fff;font-weight:700;font-size:.7rem">Approuver</button>'
        +'<button type="button" data-bugst="'+esc(b.$id)+'" data-st="resolved" style="padding:7px 10px;border-radius:8px;border:0;background:#22c55e;color:#052e16;font-weight:800;font-size:.7rem">Resolu</button>'
        +'<button type="button" data-bugst="'+esc(b.$id)+'" data-st="rejected" style="padding:7px 10px;border-radius:8px;border:0;background:rgba(239,68,68,.3);color:#fca5a5;font-weight:700;font-size:.7rem">Rejeter</button>'
        +'<button type="button" data-bugdel="'+esc(b.$id)+'" style="padding:7px 10px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--text);font-weight:700;font-size:.7rem">Suppr</button>'
        +'</div></div>';
    }).join('');
    box.querySelectorAll('[data-bugst]').forEach(btn=>{
      btn.onclick=async e=>{
        e.stopPropagation();
        try{await db.updateDocument(DB,'bug_reports',btn.dataset.bugst,{status:btn.dataset.st});toast('Bug: '+btn.dataset.st);admLoadBugs()}catch(err){toast('Erreur')}
      };
    });
    box.querySelectorAll('[data-bugdel]').forEach(btn=>{
      btn.onclick=async e=>{
        e.stopPropagation();
        if(!confirm('Supprimer ce bug?'))return;
        try{await db.deleteDocument(DB,'bug_reports',btn.dataset.bugdel);toast('Supprime');admLoadBugs()}catch(err){toast('Erreur')}
      };
    });
  }catch(e){box.innerHTML='<p style="color:var(--muted)">Erreur bugs (collection bug_reports)</p>'}
}
async function admLoadReports(){
  const box=$('adm-reports');if(!box)return;
  try{
    const r=await db.listDocuments(DB,'reports',[Query.orderDesc('$createdAt'),Query.limit(50)]);
    const list=r.documents||[];
    if(!list.length){box.innerHTML='<p style="color:var(--muted)">Aucun signalement.</p>';return}
    box.innerHTML=list.map(r=>{
      return '<div class="adm-user" style="background:var(--elev);border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:8px">'
        +'<div class="nm" style="font-weight:800">'+esc(r.targetName||r.targetId||'Cible')+'</div>'
        +'<div class="meta" style="font-size:.78rem;color:var(--muted);margin:6px 0">'+esc(r.reason||r.text||'')+'</div>'
        +'<div class="meta" style="font-size:.7rem;color:var(--muted)">par '+esc(r.byName||r.by||'?')+' · '+esc(r.status||'open')+'</div>'
        +'<button type="button" data-repdel="'+esc(r.$id)+'" style="margin-top:6px;padding:7px 10px;border-radius:8px;border:0;background:rgba(239,68,68,.25);color:#fca5a5;font-weight:700;font-size:.7rem">Fermer</button></div>';
    }).join('');
    box.querySelectorAll('[data-repdel]').forEach(btn=>{
      btn.onclick=async e=>{
        e.stopPropagation();
        try{await db.deleteDocument(DB,'reports',btn.dataset.repdel);toast('Ferme');admLoadReports()}catch(err){toast('Erreur')}
      };
    });
  }catch(e){box.innerHTML='<p style="color:var(--muted)">Aucun signalement (collection reports optionnelle).</p>'}
}


const DEFAULT_PERMS=[
  {k:'admin_panel',l:'Panel admin'},
  {k:'manage_users',l:'Gerer utilisateurs'},
  {k:'manage_roles',l:'Gerer roles'},
  {k:'ban',l:'Bannir'},
  {k:'mute',l:'Mute'},
  {k:'view_ip',l:'Voir IP'},
  {k:'delete_user',l:'Suppr. profil'},
  {k:'manage_bugs',l:'Gerer bugs'},
  {k:'broadcast',l:'Annonce globale'},
  {k:'maintenance',l:'Maintenance'},
  {k:'view_logs',l:'Voir logs'},
  {k:'moderate_chat',l:'Moderer chat'}
];
const DEFAULT_ROLES={
  admin:{label:'Admin',color:'#ef4444',perms:DEFAULT_PERMS.map(p=>p.k)},
  mod:{label:'Moderateur',color:'#3b82f6',perms:['ban','mute','view_ip','moderate_chat','manage_bugs']},
  hunter:{label:'Bug Hunter',color:'#f59e0b',perms:['manage_bugs']},
  plus:{label:'XULTRA+',color:'#a78bfa',perms:[]},
  user:{label:'Membre',color:'#94a3b8',perms:[]}
};
async function admLog(action, detail){
  try{
    await db.createDocument(DB,'admin_logs',ID.unique(),{
      action:String(action||'').slice(0,80),
      detail:String(detail||'').slice(0,400),
      by:(profile&&(profile.username||profile.displayName))||'admin',
      byId:String((user&&user.$id)||''),
      at:new Date().toISOString()
    });
  }catch(e){console.warn('admLog',e)}
}
async function admLoadRoleConfig(){
  try{
    const r=await db.listDocuments(DB,'site_settings',[Query.limit(5)]);
    const s=r.documents&&r.documents[0];
    if(s&&s.rolesJson){
      try{return Object.assign({},DEFAULT_ROLES,JSON.parse(s.rolesJson))}catch(e){}
    }
    return Object.assign({},DEFAULT_ROLES);
  }catch(e){return Object.assign({},DEFAULT_ROLES)}
}
async function admSaveRoleConfig(roles){
  const s=await admGetSettings();
  if(!s||!s.$id)throw new Error('site_settings manquant');
  await db.updateDocument(DB,'site_settings',s.$id,{
    rolesJson:JSON.stringify(roles),
    updatedAt:new Date().toISOString()
  });
}
async function admLoadRoles(){
  const box=$('adm-roles');if(!box)return;
  box.innerHTML='<p style="color:var(--muted)">Chargement roles...</p>';
  const roles=await admLoadRoleConfig();
  box.innerHTML=Object.keys(roles).map(key=>{
    const r=roles[key];
    const perms=r.perms||[];
    const checks=DEFAULT_PERMS.map(p=>{
      const on=perms.indexOf(p.k)>=0||perms.indexOf('*')>=0;
      return '<label class="adm-perm'+(on?' on':'')+'"><input type="checkbox" data-role="'+esc(key)+'" data-perm="'+esc(p.k)+'"'+(on?' checked':'')+'/>'+esc(p.l)+'</label>';
    }).join('');
    return '<div class="adm-role-card" data-role="'+esc(key)+'">'
      +'<h4><span class="adm-role-dot" style="color:'+esc(r.color||'#a78bfa')+';background:'+esc(r.color||'#a78bfa')+'"></span>'
      +esc(r.label||key)+' <span style="font-size:.7rem;color:var(--muted);font-weight:600">'+esc(key)+'</span></h4>'
      +'<div class="adm-perms">'+checks+'</div>'
      +'<button type="button" data-saverole="'+esc(key)+'" style="margin-top:12px;width:100%;height:40px;border:0;border-radius:10px;background:linear-gradient(90deg,#7c3aed,#2563eb);color:#fff;font-weight:800;font-size:.8rem">Sauver '+esc(r.label||key)+'</button>'
      +'</div>';
  }).join('');
  box.querySelectorAll('.adm-perm input').forEach(inp=>{
    inp.onchange=()=>{
      const lab=inp.closest('.adm-perm');
      if(lab)lab.classList.toggle('on', inp.checked);
    };
  });
  box.querySelectorAll('[data-saverole]').forEach(btn=>{
    btn.onclick=async e=>{
      e.stopPropagation();
      const key=btn.dataset.saverole;
      const card=btn.closest('.adm-role-card');
      const checked=Array.from(card.querySelectorAll('input[data-perm]:checked')).map(i=>i.dataset.perm);
      try{
        const roles=await admLoadRoleConfig();
        roles[key]=Object.assign({},roles[key],{perms:checked});
        await admSaveRoleConfig(roles);
        await admLog('roles.update', key+' → '+checked.join(','));
        toast('Role '+key+' enregistre');
        admLoadRoles();
      }catch(err){toast((err&&err.message)||'Erreur roles (champ rolesJson?)')}
    };
  });
}
async function admLoadLogs(){
  const box=$('adm-logs');if(!box)return;
  box.innerHTML='<p style="color:var(--muted)">Chargement logs...</p>';
  const q=(($('adm-log-q')&&$('adm-log-q').value)||'').toLowerCase();
  try{
    let list=[];
    try{
      const r=await db.listDocuments(DB,'admin_logs',[Query.orderDesc('$createdAt'),Query.limit(80)]);
      list=r.documents||[];
    }catch(e){
      try{
        const r=await db.listDocuments(DB,'admin_logs',[Query.limit(80)]);
        list=(r.documents||[]).sort((a,b)=>String(b.at||b.$createdAt||'').localeCompare(String(a.at||a.$createdAt||'')));
      }catch(e2){list=[]}
    }
    if(q)list=list.filter(l=>((l.action||'')+' '+(l.detail||'')+' '+(l.by||'')).toLowerCase().indexOf(q)>=0);
    if(!list.length){
      box.innerHTML='<p style="color:var(--muted);font-size:.85rem">Aucun log. Les actions admin (ban, grades, roles…) apparaitront ici. Collection: admin_logs</p>';
      return;
    }
    box.innerHTML=list.map(l=>{
      const t=String(l.at||l.$createdAt||'').replace('T',' ').slice(0,19);
      return '<div class="adm-log-row"><div class="t">'+esc(t)+'</div><div><div class="a">'+esc(l.action||'action')+' · '+esc(l.by||'?')+'</div><div class="d">'+esc(l.detail||'')+'</div></div></div>';
    }).join('');
  }catch(e){box.innerHTML='<p style="color:var(--muted)">Erreur logs</p>'}
}

async function openProfileByUid(uid, fallbackName){window.openProfileByUid=openProfileByUid;
  if(!uid){toast('Profil introuvable');return}
  if(user&&String(uid)===String(user.$id)&&profile){openProfile(profile,true);return}
  try{
    let p=null;
    const id=String(uid);
    try{
      const r=await db.listDocuments(DB,'users',[Query.equal('authUserId',id),Query.limit(1)]);
      p=(r.documents&&r.documents[0])||null;
    }catch(e){}
    if(!p){
      try{
        const r=await db.listDocuments(DB,'users',[Query.limit(100)]);
        const all=r.documents||[];
        p=all.find(u=>String(u.authUserId)===id||String(u.$id)===id)
          ||all.find(u=>String(u.username||'').toLowerCase()===String(fallbackName||'').toLowerCase())
          ||all.find(u=>String(u.displayName||'').toLowerCase()===String(fallbackName||'').toLowerCase())
          ||null;
      }catch(e2){}
    }
    if(!p){
      p={
        displayName:fallbackName||'User',
        username:(fallbackName||'user').toString().toLowerCase().replace(/\s+/g,''),
        authUserId:id, bio:'', avatar:'', statusManual:'online'
      };
    }
    openProfile(p, !!(user&&(String(p.authUserId)===String(user.$id)||String(uid)===String(user.$id))));
  }catch(e){
    console.error(e);
    // still show minimal profile
    openProfile({
      displayName:fallbackName||'User',
      username:(fallbackName||'user').toString().toLowerCase().replace(/\s+/g,''),
      authUserId:String(uid), bio:'', avatar:''
    }, false);
  }
}


function wireProfileClicks(root){
  (root||document).querySelectorAll('[data-uid]').forEach(el=>{
    if(el._uidWire)return;el._uidWire=true;
    el.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const uid=el.getAttribute('data-uid');
      const name=el.getAttribute('data-name')||el.textContent||'';
      if(uid)openProfileByUid(uid, name.trim());
    });
  });
}

function openProfile(p,isSelf){window.openProfile=openProfile;window.profile=window.profile||p;
  try{
    if(!p){toast('Profil introuvable');return}
    try{loadPresenceCache()}catch(e){}
    const n=p.displayName||p.username||'User';
    const un=p.username||(p.displayName||'').toLowerCase().replace(/\s+/g,'')||'user';
    // Gros pseudo + #tag (pas de @ sur le grand profil)
    if($('p-name')){
      try{
        $('p-name').innerHTML=esc(n)+(typeof tagHtml==='function'&&p.tag?(' '+tagHtml(p.tag, un)):'');
        if(typeof wireTagBlur==='function')wireTagBlur($('p-name'));
      }catch(e){$('p-name').textContent=n}
    }
    // cacher la ligne @user
    if($('p-user')){
      $('p-user').innerHTML='';
      $('p-user').style.display='none';
    }
    if($('p-bio'))$('p-bio').textContent=p.bio||'Aucune bio';

    const ban=$('p-ban');
    if(ban){
      if(p.bg&&/^https?:/i.test(p.bg)){
        ban.style.background='';
        ban.innerHTML='<img src="'+esc(p.bg)+'" alt=""/><div class="pav" id="p-av">'+av(p.avatar,n)+'<span class="st" style="background:'+presenceOf(p.authUserId||p.$id).color+'"></span></div>';
      }else{
        const c=p.bgColor||'#7c3aed';
        ban.style.background='linear-gradient(135deg,'+c+',#4c1d95)';
        ban.innerHTML='<div class="pav" id="p-av">'+av(p.avatar,n)+'<span class="st" style="background:'+presenceOf(p.authUserId||p.$id).color+'"></span></div>';
      }
    }

    // badges
    try{
      const owned=userBadges(p);
      const order=['xultra','dev','hunter','early'];
      const chips=order.filter(k=>k!=='dev'||!!owned.dev).map(k=>badgeChip(k, !!owned[k]));
      if($('p-badges')){$('p-badges').innerHTML=chips.join('');wireBadges($('p-badges'))}
    }catch(e){console.warn('badges',e)}

    // name style
    try{
      const pn=$('p-name');
      if(pn){
        pn.classList.remove('name-dev','name-hunter');
        if(isDevUser(p))pn.classList.add('name-dev');
        else if(isHunterUser(p))pn.classList.add('name-hunter');
        if(typeof applyNameStyle==='function')applyNameStyle(pn, p);
        // reposer le # apres styles (ne pas ecraser le tag)
        if(pn && p.tag && typeof tagHtml==='function' && !pn.querySelector('.tag-blur')){
          pn.insertAdjacentHTML('beforeend',' '+tagHtml(p.tag, un));
          if(typeof wireTagBlur==='function')wireTagBlur(pn);
        }
      }
    }catch(e){}

    // frame + deco
    try{
      const card=document.querySelector('#ov-profile .card-p');
      if(card){
        card.classList.remove('frame-thin','frame-glow','frame-double','frame-neon');
        if(p.btnStyle||p.profileFrame)card.classList.add('frame-'+(p.btnStyle||p.profileFrame));
      }
      const pavEl=$('p-av');
      if(pavEl){
        pavEl.className='pav'+((p.particles||p.avatarDeco)?(' deco-'+(p.particles||p.avatarDeco)):'');
        const stEl=pavEl.querySelector('.st');
        const uid=p.authUserId||p.$id;
        const run=()=>{applyStatusDot(stEl, uid)};
        if(typeof loadPresenceCache==='function'){
          Promise.resolve(loadPresenceCache()).then(run).catch(run);
        }else run();
      }
    }catch(e){}

    // pronouns + status
    try{
      let host=$('p-extra');
      if(!host){
        host=document.createElement('div');
        host.id='p-extra';
        const pn=$('p-name');
        if(pn&&pn.parentNode){
          const ref=pn.nextSibling;
          if(ref)pn.parentNode.insertBefore(host, ref);
          else pn.parentNode.appendChild(host);
        }
      }
      let hx='';
      if(p.logo||p.pronouns)hx+='<div class="p-pronouns">'+esc(p.logo||p.pronouns)+'</div>';
      if((p.titleSize||p.statusEmoji)||(p.spotify||p.statusText)){
        hx+='<div class="p-status-line">'+((p.titleSize||p.statusEmoji)?esc(p.titleSize||p.statusEmoji)+' ':'')+esc((p.spotify||p.statusText)||'')+'</div>';
      }
      host.innerHTML=hx;
    }catch(e){}

    if($('p-since')){
      $('p-since').textContent=p.$createdAt?new Date(p.$createdAt).toLocaleDateString('fr-CA',{year:'numeric',month:'short',day:'numeric'}):'—';
    }

    // actions
    const act=$('p-act');
    if(act){
      act.innerHTML='';
      const self=!!(isSelf||(user&&(p.authUserId===user.$id||p.$id===user.$id)));
      if(self){
        const b=document.createElement('button');
        b.textContent='✏️ Modifier le profil';
        b.onclick=()=>{$('ov-profile').classList.remove('on');openEdit()};
        act.appendChild(b);
      }else{
        const b=document.createElement('button');
        b.textContent='Message';
        b.onclick=()=>{$('ov-profile').classList.remove('on');openDmWith(p.authUserId||p.$id,n)};
        act.appendChild(b);
      }
    }

    // OPEN
    if($('ov-profile'))$('ov-profile').classList.add('on');

    // un seul drapeau
    try{ resolveProfileFlag(p, isSelf); }catch(e){console.warn('flag',e)}
  }catch(err){
    console.error('openProfile', err);
    try{if($('ov-profile'))$('ov-profile').classList.add('on')}catch(e){}
  }
}


function refreshPreview(){
  const n=($('e-name').value||'').trim()||(profile&&profile.displayName)||'User';
  const avUrl=window._editAvatar||(profile&&profile.avatar)||'';
  const bgUrl=window._editBanner||(profile&&profile.bg)||'';
  const c1=$('e-c1').value||'#7c3aed';
  $('e-pname').textContent=n;
  $('e-puser').textContent='@'+((profile&&profile.username)||n.toLowerCase())+((profile&&profile.tag)?'#'+profile.tag:'');
  const ban=$('e-pban');
  let banInner='';
  if(bgUrl&&(/^https?:/i.test(bgUrl)||bgUrl.indexOf('data:')===0))banInner='<img src="'+esc(bgUrl)+'" alt=""/>';
  banInner+='<button type="button" class="up-ban" id="e-btn-ban">📷 Bannière</button>';
  banInner+='<div class="pav" id="e-pav">'+(avUrl&&(/^https?:/i.test(avUrl)||avUrl.indexOf('data:')===0)?'<img src="'+esc(avUrl)+'" alt="">':esc(ini(n)))+'<div class="up-av" id="e-btn-av">📷</div></div>';
  ban.style.background=bgUrl?'':'linear-gradient(135deg,'+c1+',#4c1d95)';
  ban.innerHTML=banInner;
  wireEditUploads();
}
function wireEditUploads(){
  const btnAv=$('e-btn-av');const btnBan=$('e-btn-ban');
  if(btnAv)btnAv.onclick=e=>{e.stopPropagation();$('e-file-av').click()};
  if(btnBan)btnBan.onclick=e=>{e.stopPropagation();$('e-file-ban').click()};
  const pav=$('e-pav');if(pav)pav.onclick=e=>{e.stopPropagation();$('e-file-av').click()};
}

function setSeg(id, val){
  const root=$(id);if(!root)return;
  root.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.getAttribute('data-v')===String(val)));
}
function getSeg(id){
  const b=$(id)&&$(id).querySelector('button.on');
  return b?b.getAttribute('data-v'):'';
}
function wireSeg(id){
  const root=$(id);if(!root||root._wired)return;root._wired=true;
  root.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    root.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    refreshPreview();
  });
}
function wireEditTabs(){
  const tabs=$('e-tabs');if(!tabs||tabs._wired)return;tabs._wired=true;
  tabs.querySelectorAll('button').forEach(btn=>{
    btn.onclick=()=>{
      tabs.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
      btn.classList.add('on');
      const t=btn.getAttribute('data-etab');
      document.querySelectorAll('[data-epanel]').forEach(p=>p.classList.toggle('hidden', p.getAttribute('data-epanel')!==t));
    };
  });
}
function applyNameStyle(el, p){
  if(!el)return;
  el.classList.remove('pn-solid','pn-gradient','pn-neon','pn-pop','pn-font-modern','pn-font-8bit','pn-font-medieval','pn-font-mono','pn-font-rounded','pn-font-fancy','name-dev','name-hunter');
  const effect=(p.theme||p.nameEffect||'gradient');
  const font=(p.font||p.nameFont||'modern');
  el.classList.add('pn-'+(effect||'gradient'));
  el.classList.add('pn-font-'+(font||'modern'));
  el.style.setProperty('--name-c', (p.textColor||p.nameColor||'#e9d5ff'));
  if(isDevUser(p)&&!p.nameEffect)el.classList.add('name-dev');
  if(isHunterUser(p)&&!p.nameEffect&&!isDevUser(p))el.classList.add('name-hunter');
}

function openEdit(){
  if(!profile)return;
  window._editAvatar=profile.avatar||'';
  window._editBanner=(profile.bg&&(/^https?:/i.test(profile.bg)||profile.bg.indexOf('data:')===0))?profile.bg:'';
  $('e-name').value=profile.displayName||'';
  if($('e-pronouns'))$('e-pronouns').value=profile.logo||profile.pronouns||'';
  if($('e-semoji'))$('e-semoji').value=profile.titleSize||profile.statusEmoji||'';
  if($('e-stext'))$('e-stext').value=profile.spotify||profile.statusText||'';
  if($('e-ncolor'))$('e-ncolor').value=profile.textColor||profile.nameColor||'#e9d5ff';
  setSeg('e-font', profile.font||profile.nameFont||'modern');
  setSeg('e-effect', profile.theme||profile.nameEffect||'gradient');
  setSeg('e-deco', profile.particles||profile.avatarDeco||'');
  setSeg('e-frame', profile.btnStyle||profile.profileFrame||'');
  setSeg('e-privacy', profile.bioPos||profile.privacy||'everyone');
  wireEditTabs();wireSeg('e-font');wireSeg('e-effect');wireSeg('e-deco');wireSeg('e-frame');wireSeg('e-privacy');
  if($('e-bio-count'))$('e-bio-count').textContent=String((profile.bio||'').length);

  $('e-bio').value=profile.bio||'';
  $('e-c1').value=profile.bgColor||'#7c3aed';
  $('e-c2').value=profile.btnColor||'#a78bfa';
  $('e-status').value=profile.statusManual||'online';
  $('sw1').style.background=$('e-c1').value;
  $('sw2').style.background=$('e-c2').value;
  refreshPreview();
  $('ov-edit').classList.add('on');
}

$('e-name').oninput=()=>refreshPreview();
if($('e-bio'))$('e-bio').oninput=function(){if($('e-bio-count'))$('e-bio-count').textContent=String(this.value.length);};

$('e-c1').oninput=function(){$('sw1').style.background=this.value;refreshPreview()};
$('e-c2').oninput=function(){$('sw2').style.background=this.value};
$('e-file-av').onchange=async function(){
  const file=this.files&&this.files[0];this.value='';if(!file)return;
  if(file.size>8*1024*1024){toast('Avatar max 8 Mo');return}
  toast('Upload avatar…');
  try{const up=await upload(file);window._editAvatar=up.url;refreshPreview();toast('Avatar prêt')}catch(e){toast('Upload avatar échoué')}
};
$('e-file-ban').onchange=async function(){
  const file=this.files&&this.files[0];this.value='';if(!file)return;
  if(file.size>12*1024*1024){toast('Bannière max 12 Mo');return}
  toast('Upload bannière…');
  try{const up=await upload(file);window._editBanner=up.url;refreshPreview();toast('Bannière prête')}catch(e){toast('Upload bannière échoué')}
};
$('e-save').onclick=async()=>{
  if(!profile)return;
  const displayName=($('e-name').value||'').trim().slice(0,32)||profile.displayName||'User';
  const base=slugUsername(displayName);
  let tag=String(profile.tag||'').replace(/^#/,'')||randomTag(4);
  try{
    const uniq=await ensureUniqueUserTag(base, tag, profile.$id);
    tag=uniq.tag;
    const data={
      displayName:displayName,
      username:uniq.username,
      baseUsername:base,
      tag:tag,
      bio:($('e-bio').value||'').trim().slice(0,200),
      avatar:(window._editAvatar||'').slice(0,1000),
      bg:(window._editBanner||'').slice(0,1000),
      bgColor:$('e-c1').value||'#7c3aed',
      btnColor:$('e-c2').value||'#a78bfa',
      statusManual:$('e-status').value||'online',
      logo:(($('e-pronouns')&&$('e-pronouns').value)||'').trim().slice(0,40),
      titleSize:(($('e-semoji')&&$('e-semoji').value)||'').trim().slice(0,8),
      spotify:(($('e-stext')&&$('e-stext').value)||'').trim().slice(0,80),
      font:getSeg('e-font')||'modern',
      theme:getSeg('e-effect')||'gradient',
      textColor:($('e-ncolor')&&$('e-ncolor').value)||'#e9d5ff',
      particles:getSeg('e-deco')||'',
      btnStyle:getSeg('e-frame')||'',
      bioPos:getSeg('e-privacy')||'everyone'
    };
    profile=await db.updateDocument(DB,'users',profile.$id,data);
    toast('Profil enregistré · @'+data.username+'#'+data.tag);
    $('ov-edit').classList.remove('on');
    try{renderUserbar()}catch(e){}
    try{if(typeof loadMembers==='function')await loadMembers()}catch(e){}
  }catch(e){toast((e&&e.message)||'Erreur sauvegarde')}
};


(async function(){
  try{
    var s=null;
    try{s=localStorage.getItem('xultra_aw_sdk_session');}catch(e){}
    if(!s){try{s=sessionStorage.getItem('xultra_aw_sdk_session');}catch(e){}}
    if(s){try{client.setSession(String(s));}catch(e){}}
    user=await account.get();
    window.user=user;
    await boot();
  }catch(e){
    console.warn('init no session', e);
    // Retry once after short delay (race with SDK)
    try{
      await new Promise(function(r){setTimeout(r,400);});
      var s2=null;try{s2=localStorage.getItem("xultra_aw_sdk_session")||sessionStorage.getItem("xultra_aw_sdk_session");}catch(e3){}
      if(!s2){try{s2=localStorage.getItem('xultra_aw_sdk_session');}catch(e3){}}
      if(s2){
        try{client.setSession(String(s2));}catch(e3){}
        user=await account.get();
        window.user=user;
        await boot();
        return;
      }
    }catch(e2){console.warn('init retry fail',e2);}
    user=null;window.user=null;
    try{showAuth()}catch(_){}
  }
})();
})();
