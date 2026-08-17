(() => {
  'use strict';

  // ---- etat en memoire uniquement : la cle privee ne quitte jamais ce tableau,
  // n'est jamais ecrite sur disque, et disparait a chaque rechargement de page. ----
  const state = {
    user: null,
    privateKey: null,
    contacts: new Map(), // id -> {id, username, publicKey}
    activeContactId: null,
    ws: null,
  };

  const $ = (sel) => document.querySelector(sel);

  async function api(pathname, { method = 'GET', body } = {}) {
    const res = await fetch(pathname, {
      method,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'xultra-messaging',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch { /* pas de corps (ex: 204) */ }
    if (!res.ok) {
      throw new Error((data && data.error) || `Erreur ${res.status}`);
    }
    return data;
  }

  function setStatus(message, ok = false) {
    const el = $('#auth-status');
    el.textContent = message || '';
    el.classList.toggle('ok', ok);
  }

  function showView(name) {
    $('#auth-view').classList.toggle('hidden', name !== 'auth');
    $('#chat-view').classList.toggle('hidden', name !== 'chat');
  }

  // ---------------- Auth : onglets ----------------
  $('#tab-login').addEventListener('click', () => {
    $('#tab-login').classList.add('active');
    $('#tab-register').classList.remove('active');
    $('#login-form').classList.remove('hidden');
    $('#register-form').classList.add('hidden');
    setStatus('');
  });
  $('#tab-register').addEventListener('click', () => {
    $('#tab-register').classList.add('active');
    $('#tab-login').classList.remove('active');
    $('#register-form').classList.remove('hidden');
    $('#login-form').classList.add('hidden');
    setStatus('');
  });

  // ---------------- Inscription ----------------
  $('#register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button');
    const username = $('#register-username').value.trim();
    const password = $('#register-password').value;

    submitBtn.disabled = true;
    setStatus('Génération de vos clés de chiffrement…');
    try {
      const keyPair = await E2E.generateKeyPair();
      const { key: passwordKey, saltB64: kdfSalt } = await E2E.deriveKeyFromPassword(password);
      const { encryptedPrivateKeyB64, nonceB64 } = await E2E.wrapPrivateKey(keyPair.privateKey, passwordKey);

      setStatus('Création du compte…');
      const data = await api('/api/register', {
        method: 'POST',
        body: {
          username,
          password,
          publicKey: keyPair.publicKeyB64,
          encryptedPrivateKey: encryptedPrivateKeyB64,
          privateKeyNonce: nonceB64,
          kdfSalt,
        },
      });

      state.user = data.user;
      state.privateKey = keyPair.privateKey;
      await enterChat();
    } catch (err) {
      setStatus(err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ---------------- Connexion ----------------
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button');
    const username = $('#login-username').value.trim();
    const password = $('#login-password').value;

    submitBtn.disabled = true;
    setStatus('Connexion…');
    try {
      const data = await api('/api/login', { method: 'POST', body: { username, password } });

      setStatus('Déverrouillage de votre clé privée…');
      const { key: passwordKey } = await E2E.deriveKeyFromPassword(password, data.kdfSalt);
      const privateKey = await E2E.unwrapPrivateKey(data.encryptedPrivateKey, data.privateKeyNonce, passwordKey);

      state.user = data.user;
      state.privateKey = privateKey;
      await enterChat();
    } catch (err) {
      setStatus(err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ---------------- Déconnexion ----------------
  $('#logout-btn').addEventListener('click', async () => {
    try { await api('/api/logout', { method: 'POST' }); } catch { /* ignore */ }
    if (state.ws) state.ws.close();
    state.user = null;
    state.privateKey = null;
    state.contacts.clear();
    state.activeContactId = null;
    $('#login-password').value = '';
    showView('auth');
  });

  // ---------------- Chat ----------------
  async function enterChat() {
    $('#me-username').textContent = state.user.username;
    showView('chat');
    await loadContacts();
    connectWebSocket();
  }

  async function loadContacts() {
    const { users } = await api('/api/users');
    state.contacts.clear();
    for (const u of users) state.contacts.set(u.id, u);

    const list = $('#contact-list');
    list.innerHTML = '';
    for (const u of users) {
      const li = document.createElement('li');
      li.textContent = u.username;
      li.dataset.id = String(u.id);
      li.addEventListener('click', () => selectContact(u.id));
      list.appendChild(li);
    }
  }

  async function selectContact(id) {
    state.activeContactId = id;
    for (const li of $('#contact-list').children) {
      li.classList.toggle('active', Number(li.dataset.id) === id);
    }
    const contact = state.contacts.get(id);
    $('#chat-header').textContent = contact.username;
    $('#send-form').classList.remove('hidden');

    const { messages } = await api(`/api/messages/${id}`);
    const list = $('#message-list');
    list.innerHTML = '';
    for (const m of messages) {
      const plaintext = await E2E.decryptMessage(m.ciphertext, m.nonce, contact.publicKey, state.privateKey);
      appendBubble(plaintext, m.senderId === state.user.id, m.createdAt);
    }
    list.scrollTop = list.scrollHeight;
  }

  function appendBubble(text, isMe, createdAt) {
    const li = document.createElement('li');
    li.className = `bubble ${isMe ? 'me' : 'them'}`;
    const textNode = document.createElement('div');
    textNode.textContent = text;
    li.appendChild(textNode);
    const time = document.createElement('time');
    time.textContent = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    li.appendChild(time);
    $('#message-list').appendChild(li);
    return li;
  }

  $('#send-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('#message-input');
    const text = input.value;
    if (!text.trim() || !state.activeContactId) return;
    input.value = '';

    const contact = state.contacts.get(state.activeContactId);
    const { ciphertext, nonce } = await E2E.encryptMessage(text, contact.publicKey, state.privateKey);

    appendBubble(text, true, Date.now());
    $('#message-list').scrollTop = $('#message-list').scrollHeight;

    try {
      await api('/api/messages', {
        method: 'POST',
        body: { recipientId: state.activeContactId, ciphertext, nonce },
      });
    } catch (err) {
      appendBubble(`⚠️ Échec de l'envoi : ${err.message}`, true, Date.now());
    }
  });

  function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    state.ws = socket;

    socket.addEventListener('message', async (event) => {
      let payload;
      try { payload = JSON.parse(event.data); } catch { return; }
      if (payload.type !== 'message') return;

      if (payload.senderId === state.activeContactId) {
        const contact = state.contacts.get(payload.senderId);
        const plaintext = await E2E.decryptMessage(payload.ciphertext, payload.nonce, contact.publicKey, state.privateKey);
        appendBubble(plaintext, false, payload.createdAt);
        $('#message-list').scrollTop = $('#message-list').scrollHeight;
      } else {
        const li = $(`#contact-list li[data-id="${payload.senderId}"]`);
        if (li) li.style.fontWeight = '700';
      }
    });

    socket.addEventListener('close', () => {
      if (state.user) setTimeout(connectWebSocket, 2000);
    });
  }
})();
