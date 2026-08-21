
(function(){
  function showErr(m){
    var e=document.getElementById('auth-err');
    if(e){e.textContent=m||'';e.style.display='block';e.style.color='#fca5a5';e.style.marginTop='10px';e.style.fontSize='.85rem';}
  }
  





async function ensureAw(){
  if(window.account && window.client) return {account:window.account, client:window.client};
  for(var w=0;w<40;w++){
    if(window.account && window.client) return {account:window.account, client:window.client};
    if(typeof Appwrite!=='undefined')break;
    await new Promise(function(r){setTimeout(r,100);});
  }
  if(typeof Appwrite==='undefined'){
    await new Promise(function(res){
      var s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/appwrite@15.0.0';
      s.onload=function(){res();};
      s.onerror=function(){
        var s2=document.createElement('script');
        s2.src='https://unpkg.com/appwrite@15.0.0';
        s2.onload=function(){res();};
        s2.onerror=function(){res();};
        document.head.appendChild(s2);
      };
      document.head.appendChild(s);
      setTimeout(res,6000);
    });
  }
  if(typeof Appwrite==='undefined')throw new Error('CDN Appwrite bloque — autorise cdn.jsdelivr.net');
  var EP='https://fra.cloud.appwrite.io/v1';
  var PID='6a73b975002f14dc6b91';
  var client=new Appwrite.Client().setEndpoint(EP).setProject(PID);
  var account=new Appwrite.Account(client);
  // Restore persisted session (never wipe here)
  try{
    var s=localStorage.getItem('xultra_aw_sdk_session')||sessionStorage.getItem('xultra_aw_sdk_session');
    if(s) client.setSession(String(s));
  }catch(e){}
  window.client=client;
  window.account=account;
  return {account:account, client:client};
}
function saveSessionSecret(secret, remember){window.saveSessionSecret=saveSessionSecret;
  if(!secret)return;
  try{
    if(remember!==false){
      localStorage.setItem('xultra_aw_sdk_session', String(secret));
      localStorage.setItem('xultra_remember','1');
      try{sessionStorage.removeItem('xultra_aw_sdk_session');}catch(e){}
    }else{
      sessionStorage.setItem('xultra_aw_sdk_session', String(secret));
      localStorage.removeItem('xultra_aw_sdk_session');
      localStorage.setItem('xultra_remember','0');
    }
  }catch(e){}
}
function readSessionSecret(){
  try{
    var s=localStorage.getItem('xultra_aw_sdk_session');
    if(s)return s;
  }catch(e){}
  try{return sessionStorage.getItem('xultra_aw_sdk_session');}catch(e){}
  return null;
}
function clearSessionSecret(){
  try{localStorage.removeItem('xultra_aw_sdk_session');}catch(e){}
  try{sessionStorage.removeItem('xultra_aw_sdk_session');}catch(e){}
}


async function standaloneLogin(){
  var emailEl=document.getElementById('in-email');
  var passEl=document.getElementById('in-pass');
  var btn=document.getElementById('btn-login');
  var email=((emailEl&&emailEl.value)||'').trim();
  var pass=(passEl&&passEl.value)||'';
  showErr('');
  if(btn){btn.disabled=true;btn.textContent='Connexion…';}
  try{
    if(!email||!pass)throw new Error('Email et mot de passe requis');
    var aw=await ensureAw();
    var account=aw.account, client=aw.client;

    var session=null;
    try{
      session=await account.createEmailPasswordSession(email, pass);
    }catch(e1){
      try{await account.deleteSessions();try{localStorage.removeItem("xultra_aw_sdk_session");sessionStorage.removeItem("xultra_aw_sdk_session");}catch(_c){};}catch(e){}
      try{
        session=await account.createEmailPasswordSession(email, pass);
      }catch(e2){
        throw new Error((e2&&e2.message)||(e1&&e1.message)||'Identifiants invalides');
      }
    }
    var remember=true;
    try{var cb=document.getElementById('in-remember');if(cb)remember=!!cb.checked;}catch(e){}
    // Extract secret from response OR Appwrite internal storage
    var secret=(session && (session.secret||session.secret))||null;
    if(!secret){
      try{
        // Appwrite cookieFallback format
        var cf=localStorage.getItem('cookieFallback');
        if(cf){
          var arr=JSON.parse(cf);
          if(arr && arr.length){
            var last=String(arr[arr.length-1]||'');
            var m=last.match(/a_session_[^=]+=([^;]+)/);
            if(m)secret=decodeURIComponent(m[1]);
          }
        }
      }catch(e){}
    }
    if(!secret){
      try{
        // Scan localStorage for a_session keys
        for(var ki=0;ki<localStorage.length;ki++){
          var k=localStorage.key(ki)||'';
          if(k.indexOf('a_session')>=0 || k.indexOf('cookieFallback')>=0){
            var val=localStorage.getItem(k);
            if(val && val.length>20 && val.indexOf('eyJ')!==0){
              // might be raw secret
              if(k.indexOf('a_session')>=0) secret=val;
            }
          }
        }
      }catch(e){}
    }
    if(secret){
      saveSessionSecret(secret, remember);
      try{client.setSession(String(secret));}catch(e){}
    }else{
      console.warn('No session secret in response — relying on SDK cookieFallback');
      // Still mark remember preference
      try{localStorage.setItem('xultra_remember', remember?'1':'0');}catch(e){}
    }
    window.user=await account.get();

    var authEl=document.getElementById('auth');
    var appEl=document.getElementById('app');
    if(authEl){authEl.style.display='none';authEl.setAttribute('hidden','');authEl.style.pointerEvents='none';}
    if(appEl)appEl.classList.add('on');

    try{
      var nm=(window.user&&(window.user.name||window.user.email))||'Compte';
      var un=document.getElementById('ub-name'); if(un)un.textContent=nm;
      var uav=document.getElementById('ub-av');
      if(uav)if(!(uav.querySelector&&uav.querySelector('img'))){uav.innerHTML=(nm.charAt(0)||'?').toUpperCase()+'<span class="st" data-st="online" style="background:#22c55e"></span>';}
    }catch(e){}

    // Try main boot (may use different client - re-set session on window.client if main created one)
    if(window.client && secret){try{window.client.setSession(String(secret));}catch(e){}}
    if(window.account && secret){try{/* same */}catch(e){}}
    if(typeof window.boot==='function'){
      try{await window.boot();}catch(e){console.error('boot',e);}
    }
    try{if(typeof forcePaintApp==='function')forcePaintApp();}catch(e){}
    try{history.replaceState({},'','/');}catch(e){}
    showErr('');
    return;
  }catch(e){
    console.error(e);
    showErr((e&&e.message)||'Connexion impossible');
  }
  if(btn){btn.disabled=false;btn.textContent='Entrer';}
}

window.__nav=function(v){
    try{
      var box=document.getElementById('list-body');
      var title=document.getElementById('list-title');
      function on(id){['nav-dms','nav-friends','nav-members'].forEach(function(n){var el=document.getElementById(n);if(el)el.classList.toggle('on',n===id);});}
      if(v==='dms'){
        on('nav-dms');if(title)title.textContent='Messages';
        if(window.showView){try{window.showView('dms');return;}catch(e){}}
        if(window.refreshDms){try{window.refreshDms();}catch(e){}}
        if(box&&(!box.innerHTML||box.innerHTML.indexOf('conversation')>=0||box.innerHTML.length<30))
          box.innerHTML='<div style="padding:18px 16px;color:#e9d5ff">Aucune conversation.<br><span style="color:#a78bfa">Va dans Amis pour ouvrir un DM.</span></div>';
        return;
      }
      if(v==='friends'){
        on('nav-friends');if(title)title.textContent='Amis';
        if(box)box.innerHTML='<div style="padding:16px;color:#c4b5fd">Chargement des amis…</div>';
        function paintFriends(list){
          if(!box)return;
          if(!list||!list.length){
            box.innerHTML='<div style="padding:16px;color:#e9d5ff">Aucun ami pour le moment.<br><span style="color:#a78bfa">Utilise + Amis pour en ajouter.</span></div>';
            return;
          }
          box.innerHTML=list.map(function(f){
            var n=f.displayName||f.name||f.username||'User';
            var uid=f.friendId||f.$id||'';
            var av=(f.avatar&&/^https?:/i.test(f.avatar))?'<img src="'+f.avatar+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%" referrerpolicy="no-referrer">':(n.charAt(0)||'?').toUpperCase();
            return '<div class="row" data-uid="'+uid+'" style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-radius:12px"><div class="av" style="width:40px;height:40px;border-radius:50%;overflow:hidden;background:#2a1f3d;display:grid;place-items:center;flex-shrink:0">'+av+'</div><div style="min-width:0"><div style="font-weight:700;color:#f3e8ff">'+n+'</div><div style="font-size:.75rem;color:#a78bfa">@'+(f.username||'')+'</div></div></div>';
          }).join('');
          box.querySelectorAll('[data-uid]').forEach(function(el){
            el.onclick=function(){
              var id=el.getAttribute('data-uid');
              if(window.openProfileByUid)window.openProfileByUid(id);
              else if(window.openDmWith)window.openDmWith(id);
            };
          });
        }
        if(window.showView){try{window.showView('friends');}catch(e){}}
        function loadF(){
          if(window.refreshFriends){
            return Promise.resolve(window.refreshFriends()).then(function(){
              if(window.renderFriends){try{window.renderFriends();return;}catch(e){}}
              paintFriends(window.friends||[]);
            });
          }
          return fetch('/api/friends',{credentials:'include'}).then(function(r){return r.json()}).then(function(j){paintFriends(j&&j.friends||[])});
        }
        loadF().catch(function(){
          fetch('/api/friends',{credentials:'include'}).then(function(r){return r.json()}).then(function(j){paintFriends(j&&j.friends||[])}).catch(function(){
            if(box)box.innerHTML='<div style="padding:16px;color:#e9d5ff">Impossible de charger les amis.</div>';
          });
        });
        return;
      }
      if(v==='members'){
        on('nav-members');if(title)title.textContent='Membres';
        if(box)box.innerHTML='<div style="padding:16px;color:#c4b5fd">Chargement des membres…</div>';
        function paintMembers(list){
          if(!box)return;
          if(!list||!list.length){box.innerHTML='<div style="padding:16px;color:#e9d5ff">Aucun membre.</div>';return;}
          box.innerHTML=list.map(function(m){
            var n=m.displayName||m.username||'User';
            var uid=m.authUserId||m.$id||'';
            var av=(m.avatar&&/^https?:/i.test(m.avatar))?'<img src="'+m.avatar+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%" referrerpolicy="no-referrer">':(n.charAt(0)||'?').toUpperCase();
            return '<div class="row" data-uid="'+uid+'" style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-radius:12px"><div class="av" style="width:40px;height:40px;border-radius:50%;overflow:hidden;background:#2a1f3d;display:grid;place-items:center;flex-shrink:0">'+av+'</div><div style="min-width:0"><div style="font-weight:700;color:#f3e8ff">'+n+'</div><div style="font-size:.75rem;color:#a78bfa">@'+(m.username||'')+(m.tag?('#'+m.tag):'')+'</div></div></div>';
          }).join('');
          box.querySelectorAll('[data-uid]').forEach(function(el){
            el.onclick=function(){
              var id=el.getAttribute('data-uid');
              if(window.openProfileByUid)window.openProfileByUid(id);
              else if(window.__openMe&&window.user&&String(id)===String(window.user.$id))window.__openMe();
            };
          });
        }
        if(window.showView){try{window.showView('members');}catch(e){}}
        if(window.loadMembers){
          Promise.resolve(window.loadMembers()).then(function(list){
            if(window.renderMembers){try{window.renderMembers();return;}catch(e){}}
            paintMembers(list||window.membersCache||[]);
          }).catch(function(){
            fetch('/api/members',{credentials:'include'}).then(function(r){return r.json()}).then(function(j){paintMembers(j&&j.members||[])}).catch(function(){if(box)box.innerHTML='<div style="padding:16px;color:#e9d5ff">Impossible de charger les membres.</div>';});
          });
          return;
        }
        fetch('/api/members',{credentials:'include'}).then(function(r){return r.json()}).then(function(j){paintMembers(j&&j.members||[])}).catch(function(){if(box)box.innerHTML='<div style="padding:16px;color:#e9d5ff">Impossible de charger les membres.</div>';});
        return;
      }
      if(v==='status'){
        if(window.openServiceStatus)try{window.openServiceStatus();return;}catch(e){}
        alert('XULTRA\\nAppwrite: OK\\nCloudflare Worker: OK\\nVersion: β2.8.10');
        return;
      }
      if(v==='addfriend'){
        if(window.openAddFriend){try{window.openAddFriend();return;}catch(e){}}
        var q=prompt("Nom utilisateur ou @ a ajouter en ami :");
        if(!q)return;
        if(window.sendFriendRequest){try{window.sendFriendRequest(q);return;}catch(e){}}
        alert('Recherche ami: '+q+'\\n(module amis en reconnexion)');
        return;
      }
      if(v==='settings'){
        if(window.openSettings){try{window.openSettings();return;}catch(e){}}
        alert('Paramètres — module en reconnexion. Recharge la page.');
        return;
      }
      if(v==='notifs'){
        if(window.openNotifications){try{window.openNotifications();return;}catch(e){}}
        alert('Pas de nouvelle notification');
        return;
      }
    }catch(e){console.error('__nav',e);alert('Nav error: '+(e&&e.message));}
  };

  
  window.__openMe=function(){
    try{
      if(typeof window.openProfile==='function' && window.profile){
        window.openProfile(window.profile, true);
        return;
      }
      if(typeof window.openProfileByUid==='function' && window.user && window.user.$id){
        window.openProfileByUid(window.user.$id, (window.user.name||window.user.email||'Moi'));
        return;
      }
      // Fallback: show simple profile card
      var n=(window.user&&(window.user.name||window.user.email))||'Compte';
      var ov=document.getElementById('ov-profile');
      if(ov){
        ov.classList.add('on');
        var pn=document.getElementById('p-name');
        if(pn)pn.textContent=n;
        var close=document.getElementById('p-close');
        if(close)close.onclick=function(){ov.classList.remove('on');};
      }else{
        alert('Profil: '+n);
      }
    }catch(e){console.error('openMe',e);alert('Profil indisponible');}
  };

  window.__xLogin=standaloneLogin;

  try{
    var pref=localStorage.getItem('xultra_remember');
    var cb=document.getElementById('in-remember');
    if(cb && pref==='0')cb.checked=false;
    if(cb && pref==='1')cb.checked=true;
  }catch(e){}



  (async function autoResume(){
    try{
      var s=null;
      try{s=localStorage.getItem('xultra_aw_sdk_session');}catch(e){}
      if(!s){try{s=sessionStorage.getItem('xultra_aw_sdk_session');}catch(e){}}
      if(!s)return;
      var aw=await ensureAw();
      aw.client.setSession(String(s));
      var u=await aw.account.get();
      window.user=u;
      var authEl=document.getElementById('auth');
      var appEl=document.getElementById('app');
      if(authEl){authEl.style.display='none';authEl.setAttribute('hidden','');}
      if(appEl)appEl.classList.add('on');
      try{
        var nm=(u.name||u.email||'Compte');
        var un=document.getElementById('ub-name'); if(un)un.textContent=nm;
        var uav=document.getElementById('ub-av');
        if(uav)if(!(uav.querySelector&&uav.querySelector('img'))){uav.innerHTML=(nm.charAt(0)||'?').toUpperCase()+'<span class="st" data-st="online" style="background:#22c55e"></span>';}
      }catch(e){}
      // wait for main boot
      for(var i=0;i<50;i++){
        if(typeof window.boot==='function'){
          try{await window.boot();}catch(e){}
          break;
        }
        await new Promise(function(r){setTimeout(r,100);});
      }
      try{if(typeof forcePaintApp==='function')forcePaintApp();}catch(e){}
    }catch(e){
      console.warn('autoResume',e);
      // Ne PAS effacer la session ici — peut etre un race condition
    }
  })();


  function bind(){
    var btn=document.getElementById('btn-login');
    if(btn){
      btn.onclick=function(ev){if(ev){ev.preventDefault();ev.stopPropagation();}standaloneLogin();return false;};
    }
    ['in-email','in-pass'].forEach(function(id){
      var el=document.getElementById(id);
      if(!el)return;
      el.addEventListener('keydown',function(ev){
        if(ev.key==='Enter'||ev.keyCode===13){
          ev.preventDefault();
          standaloneLogin();
        }
      });
    });
    var form=document.getElementById('form-login');
    if(form){
      form.addEventListener('submit',function(ev){ev.preventDefault();standaloneLogin();return false;},true);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);
  else bind();
  setTimeout(bind,0);
  setTimeout(bind,500);
})();
