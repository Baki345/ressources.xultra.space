'use strict';
// Dashboard web minimal : configurer l'auto-mod et le message de bienvenue
// depuis une page plutôt que par commande. Authentification via "Se
// connecter avec X1" (OAuth2, voir le portail développeur) — jamais de mot
// de passe géré par ce bot. Optionnel : si OAUTH_CLIENT_ID/SECRET ne sont
// pas renseignés, le dashboard répond juste "non configuré" et le reste du
// bot fonctionne normalement (commandes uniquement).
const crypto = require('crypto');
const querystring = require('querystring');
const env = require('./env');
const api = require('./api');
const store = require('./serverStore');

const COOKIE_NAME = 'x1_dash_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

function configured() {
  return !!(env.OAUTH_CLIENT_ID && env.OAUTH_CLIENT_SECRET && env.PUBLIC_URL);
}

function callbackUrl() {
  return env.PUBLIC_URL.replace(/\/$/, '') + '/oauth/callback';
}

// ===== Cookie de session, signé (HMAC) — pas de magasin de sessions côté
// serveur, tout tient dans le cookie lui-même, comme un JWT fait main. =====
function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', env.DASHBOARD_SECRET).update(body).digest('base64url');
  return body + '.' + sig;
}

function verifySession(cookieValue) {
  if (!cookieValue) return null;
  const parts = String(cookieValue).split('.');
  if (parts.length !== 2) return null;
  const expected = crypto.createHmac('sha256', env.DASHBOARD_SECRET).update(parts[0]).digest('base64url');
  const a = Buffer.from(expected);
  const b = Buffer.from(parts[1]);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch (e) { return null; }
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach(function (part) {
    const i = part.indexOf('=');
    if (i < 0) return;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

// ===== Flux OAuth "Se connecter avec X1" =====
function buildAuthorizeUrl(serverId) {
  const params = querystring.stringify({
    client_id: env.OAUTH_CLIENT_ID,
    redirect_uri: callbackUrl(),
    response_type: 'code',
    scope: 'identify',
    state: serverId
  });
  return env.X1_BASE_URL + '/oauth/authorize?' + params;
}

async function exchangeCodeForToken(code) {
  const res = await fetch(env.X1_BASE_URL + '/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      redirect_uri: callbackUrl()
    })
  });
  const json = await res.json().catch(function () { return {}; });
  if (!res.ok || !json.access_token) throw new Error(json.error || 'Échange du code OAuth échoué');
  return json.access_token;
}

async function fetchUserInfo(accessToken) {
  const res = await fetch(env.X1_BASE_URL + '/api/oauth/userinfo', {
    headers: { Authorization: 'Bearer ' + accessToken }
  });
  const json = await res.json().catch(function () { return {}; });
  if (!res.ok || !json.id) throw new Error('Identité introuvable');
  return json;
}

// ===== Rendu HTML (une seule feuille de style inline, pas de dépendance) =====
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function page(title, body) {
  return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + escapeHtml(title) + '</title>'
    + '<style>'
    + 'body{font-family:-apple-system,system-ui,sans-serif;background:#0f0f14;color:#e5e5ea;max-width:640px;margin:0 auto;padding:24px 16px}'
    + 'h1{font-size:20px}h2{font-size:16px;margin-top:32px;border-bottom:1px solid #2a2a35;padding-bottom:6px}'
    + '.card{background:#181820;border:1px solid #2a2a35;border-radius:10px;padding:16px;margin:12px 0}'
    + 'label{display:block;margin:10px 0 4px;font-size:13px;color:#a0a0b0}'
    + 'input[type=text],textarea{width:100%;box-sizing:border-box;background:#0f0f14;border:1px solid #33333f;border-radius:6px;color:#e5e5ea;padding:8px;font-size:14px}'
    + 'textarea{min-height:80px;font-family:monospace}'
    + '.row{display:flex;align-items:center;gap:8px;margin:8px 0}'
    + 'button{background:#7c3aed;color:#fff;border:0;border-radius:6px;padding:10px 16px;font-size:14px;cursor:pointer}'
    + 'a.btn{display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;border-radius:6px;padding:10px 16px;font-size:14px}'
    + '.muted{color:#a0a0b0;font-size:13px}'
    + '.ok{color:#22c55e}.err{color:#ef4444}'
    + 'ol{padding-left:20px}'
    + '</style></head><body>' + body + '</body></html>';
}

function renderLogin(serverId, error) {
  return page('Connexion — Dashboard', '<h1>⚙️ Dashboard du bot</h1>'
    + (error ? '<p class="err">' + escapeHtml(error) + '</p>' : '')
    + '<p class="muted">Connecte-toi avec ton compte X1 pour configurer le bot sur ce serveur.</p>'
    + '<a class="btn" href="' + escapeHtml(buildAuthorizeUrl(serverId)) + '">Se connecter avec X1</a>');
}

function renderNoAccess(username) {
  return page('Accès refusé — Dashboard', '<h1>⚙️ Dashboard du bot</h1>'
    + '<p class="err">' + escapeHtml(username) + ', tu n\'as pas la permission "manage_server" sur ce serveur — seuls les administrateurs peuvent configurer le bot ici.</p>');
}

function renderDashboard(serverId, session, saved) {
  const cfg = store.load(serverId);
  const top = store.leaderboard(serverId, 'xp', 5);
  const leaderboardHtml = top.length
    ? '<ol>' + top.map(function (p) { return '<li>' + escapeHtml(p.username || p.uid) + ' — niveau ' + p.level + ' (' + p.xp + ' XP)</li>'; }).join('') + '</ol>'
    : '<p class="muted">Personne n\'a encore gagné d\'XP.</p>';
  return page('Dashboard — Bot Vocal', '<h1>⚙️ Dashboard du bot</h1>'
    + '<p class="muted">Connecté en tant que ' + escapeHtml(session.username) + '.</p>'
    + (saved ? '<p class="ok">✅ Configuration enregistrée.</p>' : '')
    + '<form method="POST" action="/dashboard/save">'
    + '<input type="hidden" name="serverId" value="' + escapeHtml(serverId) + '">'
    + '<h2>🧹 Auto-mod</h2>'
    + '<div class="card">'
    + '<div class="row"><input type="checkbox" id="automodEnabled" name="automodEnabled" ' + (cfg.automod.enabled ? 'checked' : '') + '><label for="automodEnabled" style="margin:0">Activer l\'auto-mod</label></div>'
    + '<div class="row"><input type="checkbox" id="antiLinks" name="antiLinks" ' + (cfg.automod.antiLinks ? 'checked' : '') + '><label for="antiLinks" style="margin:0">Bloquer les liens non autorisés</label></div>'
    + '<label>Mots filtrés (un par ligne)</label>'
    + '<textarea name="words">' + escapeHtml(cfg.automod.words.join('\n')) + '</textarea>'
    + '</div>'
    + '<h2>👋 Message de bienvenue</h2>'
    + '<div class="card">'
    + '<div class="row"><input type="checkbox" id="welcomeEnabled" name="welcomeEnabled" ' + (cfg.welcome.enabled ? 'checked' : '') + '><label for="welcomeEnabled" style="margin:0">Activer</label></div>'
    + '<label>Texte (utilise {membre} pour le pseudo)</label>'
    + '<input type="text" name="welcomeText" value="' + escapeHtml(cfg.welcome.template) + '">'
    + '<p class="muted">Salon de destination : ' + (cfg.welcome.channelId ? 'déjà défini (tape <code>/bienvenue</code> à nouveau dans un autre salon texte pour le changer)' : 'non défini — tape <code>/bienvenue action:set texte:"..."</code> dans le salon texte voulu au moins une fois') + '.</p>'
    + '</div>'
    + '<h2>📋 Modération</h2>'
    + '<div class="card"><p class="muted">Salon de logs : ' + (cfg.modlogsChannelId ? 'défini (via <code>/modlogs</code>)' : 'non défini') + '</p></div>'
    + '<h2>🏆 Classement XP (top 5)</h2>'
    + '<div class="card">' + leaderboardHtml + '</div>'
    + '<button type="submit">Enregistrer</button>'
    + '</form>');
}

// ===== Handlers HTTP =====
async function handleDashboard(req, res, query) {
  if (!configured()) { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Dashboard non configuré (OAUTH_CLIENT_ID/SECRET/PUBLIC_URL manquants dans .env).'); return; }
  const serverId = String(query.serverId || '').trim();
  if (!serverId) { res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('?serverId=... requis'); return; }
  const session = verifySession(parseCookies(req)[COOKIE_NAME]);
  const html = session
    ? await (async function () {
      let perms;
      try { perms = await api.memberPermissions(serverId, session.uid); }
      catch (e) { return renderLogin(serverId, 'Erreur de vérification des permissions : ' + e.message); }
      if (perms.indexOf('manage_server') < 0 && perms.indexOf('administrator') < 0) return renderNoAccess(session.username);
      return renderDashboard(serverId, session, query.saved === '1');
    })()
    : renderLogin(serverId, null);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

async function handleOauthCallback(req, res, query) {
  if (!configured()) { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Dashboard non configuré.'); return; }
  const code = String(query.code || '');
  const serverId = String(query.state || '');
  if (!code) { res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('code manquant'); return; }
  try {
    const accessToken = await exchangeCodeForToken(code);
    const user = await fetchUserInfo(accessToken);
    const cookieValue = signSession({ uid: user.id, username: user.displayName || user.username, exp: Date.now() + SESSION_TTL_MS });
    res.writeHead(302, {
      'Set-Cookie': COOKIE_NAME + '=' + encodeURIComponent(cookieValue) + '; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=' + Math.floor(SESSION_TTL_MS / 1000),
      Location: '/dashboard?serverId=' + encodeURIComponent(serverId)
    });
    res.end();
  } catch (e) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page('Erreur — Dashboard', '<h1>⚙️ Dashboard du bot</h1><p class="err">Connexion échouée : ' + escapeHtml(e.message) + '</p>'));
  }
}

async function handleSave(req, res, body) {
  if (!configured()) { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Dashboard non configuré.'); return; }
  const form = querystring.parse(body);
  const serverId = String(form.serverId || '').trim();
  const session = verifySession(parseCookies(req)[COOKIE_NAME]);
  if (!session || !serverId) { res.writeHead(401, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Session invalide'); return; }
  let perms;
  try { perms = await api.memberPermissions(serverId, session.uid); }
  catch (e) { res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Erreur : ' + e.message); return; }
  if (perms.indexOf('manage_server') < 0 && perms.indexOf('administrator') < 0) { res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Accès refusé'); return; }

  const words = String(form.words || '').split('\n').map(function (w) { return w.trim().toLowerCase(); }).filter(Boolean);
  store.setAutomod(serverId, { enabled: !!form.automodEnabled, antiLinks: !!form.antiLinks, words: words });
  store.setWelcome(serverId, { enabled: !!form.welcomeEnabled, template: String(form.welcomeText || '').trim() || 'Bienvenue {membre} !' });

  res.writeHead(302, { Location: '/dashboard?serverId=' + encodeURIComponent(serverId) + '&saved=1' });
  res.end();
}

module.exports = { configured: configured, handleDashboard: handleDashboard, handleOauthCallback: handleOauthCallback, handleSave: handleSave };
