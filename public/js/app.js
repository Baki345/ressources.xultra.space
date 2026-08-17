(() => {
  'use strict';

  // ---- etat en memoire uniquement : la cle privee ne quitte jamais ce tableau,
  // n'est jamais ecrite sur disque, et disparait a chaque rechargement de page. ----
  const state = {
    user: null,
    privateKey: null,
    contacts: new Map(), // id -> {id, username, publicKey}
    groups: new Map(), // id -> {id, name, members: [{id, username, publicKey}]}
    active: null, // { type: 'dm' | 'group', id }
    ws: null,
    recorder: null,
    recordedChunks: [],
  };

  const $ = (sel) => document.querySelector(sel);
  const MAX_ATTACHMENT_BYTES = 75 * 1024 * 1024;

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

  async function uploadAttachment(bytes) {
    const res = await fetch('/api/attachments', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Requested-With': 'xultra-messaging',
      },
      body: bytes,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
    return data; // { objectKey, url }
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
    state.groups.clear();
    state.active = null;
    $('#login-password').value = '';
    showView('auth');
  });

  // ---------------- Chat : chargement ----------------
  async function enterChat() {
    $('#me-username').textContent = state.user.username;
    showView('chat');
    await Promise.all([loadContacts(), loadGroups()]);
    renderSidebar();
    connectWebSocket();
  }

  async function loadContacts() {
    const { users } = await api('/api/users');
    state.contacts.clear();
    for (const u of users) state.contacts.set(u.id, u);
  }

  async function loadGroups() {
    const { groups } = await api('/api/groups');
    state.groups.clear();
    for (const g of groups) state.groups.set(g.id, g);
  }

  function renderSidebar() {
    const list = $('#contact-list');
    list.innerHTML = '';

    for (const g of state.groups.values()) {
      const li = document.createElement('li');
      li.dataset.type = 'group';
      li.dataset.id = String(g.id);
      li.innerHTML = `<span>${escapeHtml(g.name)}</span><span class="badge">groupe</span>`;
      li.addEventListener('click', () => selectConversation('group', g.id));
      list.appendChild(li);
    }
    for (const u of state.contacts.values()) {
      const li = document.createElement('li');
      li.dataset.type = 'dm';
      li.dataset.id = String(u.id);
      li.textContent = u.username;
      li.addEventListener('click', () => selectConversation('dm', u.id));
      list.appendChild(li);
    }

    renderGroupMemberCheckboxes();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------- Création de groupe ----------------
  function renderGroupMemberCheckboxes() {
    const container = $('#new-group-members');
    container.innerHTML = '';
    for (const u of state.contacts.values()) {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = String(u.id);
      label.appendChild(checkbox);
      label.append(u.username);
      container.appendChild(label);
    }
  }

  $('#new-group-btn').addEventListener('click', () => {
    $('#new-group-form').classList.toggle('hidden');
  });

  $('#new-group-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#new-group-name').value.trim();
    const memberIds = [...document.querySelectorAll('#new-group-members input:checked')].map((el) => Number(el.value));
    if (!name || memberIds.length === 0) return;

    try {
      const { group } = await api('/api/groups', { method: 'POST', body: { name, memberIds } });
      state.groups.set(group.id, group);
      renderSidebar();
      $('#new-group-form').classList.add('hidden');
      $('#new-group-name').value = '';
      selectConversation('group', group.id);
    } catch (err) {
      alert(err.message);
    }
  });

  // ---------------- Sélection d'une conversation ----------------
  async function selectConversation(type, id) {
    state.active = { type, id };
    for (const li of $('#contact-list').children) {
      li.classList.toggle('active', li.dataset.type === type && Number(li.dataset.id) === id);
      li.style.fontWeight = '';
    }

    const list = $('#message-list');
    list.innerHTML = '';
    $('#send-form').classList.remove('hidden');

    if (type === 'dm') {
      const contact = state.contacts.get(id);
      $('#chat-header').textContent = contact.username;
      const { messages } = await api(`/api/messages/${id}`);
      for (const m of messages) {
        const plaintext = await E2E.decryptMessage(m.ciphertext, m.nonce, contact.publicKey, state.privateKey);
        await appendMessage(plaintext, m.senderId === state.user.id, m.createdAt);
      }
    } else {
      const group = state.groups.get(id);
      $('#chat-header').textContent = group.name;
      const membersById = new Map(group.members.map((m) => [m.id, m]));
      const { messages } = await api(`/api/groups/${id}/messages`);
      for (const m of messages) {
        const sender = membersById.get(m.senderId);
        const plaintext = await E2E.decryptGroupMessage(
          m.ciphertext, m.nonce, m.keyCiphertext, m.keyNonce, sender.publicKey, state.privateKey
        );
        await appendMessage(plaintext, m.senderId === state.user.id, m.createdAt, sender.username);
      }
    }
    list.scrollTop = list.scrollHeight;
  }

  // ---------------- Rendu des messages (texte ou pièce jointe) ----------------
  async function appendMessage(rawText, isMe, createdAt, senderName) {
    const li = document.createElement('li');
    li.className = `bubble ${isMe ? 'me' : 'them'}`;

    if (senderName && !isMe) {
      const sender = document.createElement('span');
      sender.className = 'sender';
      sender.textContent = senderName;
      li.appendChild(sender);
    }

    let envelope = null;
    try {
      const parsed = JSON.parse(rawText);
      if (parsed && parsed.type === 'attachment') envelope = parsed;
    } catch { /* message texte normal */ }

    if (envelope) {
      const content = document.createElement('div');
      content.textContent = 'Chargement de la pièce jointe…';
      li.appendChild(content);
      renderAttachment(envelope, content);
    } else {
      const textNode = document.createElement('div');
      textNode.textContent = rawText;
      li.appendChild(textNode);
    }

    const time = document.createElement('time');
    time.textContent = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    li.appendChild(time);

    $('#message-list').appendChild(li);
    return li;
  }

  async function renderAttachment(envelope, container) {
    try {
      const res = await fetch(envelope.url, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Téléchargement impossible.');
      const cipherBytes = new Uint8Array(await res.arrayBuffer());
      const plainBytes = await E2E.decryptFile(cipherBytes, envelope.keyB64, envelope.nonceB64);
      const blob = new Blob([plainBytes], { type: envelope.mimeType || 'application/octet-stream' });
      const objectUrl = URL.createObjectURL(blob);

      container.innerHTML = '';
      if (envelope.kind === 'voice' || (envelope.mimeType || '').startsWith('audio/')) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = objectUrl;
        container.appendChild(audio);
      } else if ((envelope.mimeType || '').startsWith('image/')) {
        const img = document.createElement('img');
        img.src = objectUrl;
        img.alt = envelope.filename || 'image';
        container.appendChild(img);
      } else if ((envelope.mimeType || '').startsWith('video/')) {
        const video = document.createElement('video');
        video.controls = true;
        video.src = objectUrl;
        container.appendChild(video);
      } else {
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = envelope.filename || 'fichier';
        link.textContent = `📄 ${envelope.filename || 'Télécharger le fichier'}`;
        link.className = 'file-link';
        container.appendChild(link);
      }
    } catch (err) {
      container.textContent = `⚠️ Pièce jointe illisible (${err.message})`;
    }
  }

  // ---------------- Envoi : texte ----------------
  async function sendContent(plaintext) {
    if (!state.active) return;

    if (state.active.type === 'dm') {
      const contact = state.contacts.get(state.active.id);
      const { ciphertext, nonce } = await E2E.encryptMessage(plaintext, contact.publicKey, state.privateKey);
      await api('/api/messages', { method: 'POST', body: { recipientId: state.active.id, ciphertext, nonce } });
    } else {
      const group = state.groups.get(state.active.id);
      const { ciphertext, nonce, wrappedKeys } = await E2E.encryptGroupMessage(plaintext, group.members, state.privateKey);
      await api(`/api/groups/${state.active.id}/messages`, { method: 'POST', body: { ciphertext, nonce, wrappedKeys } });
    }
  }

  $('#send-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('#message-input');
    const text = input.value;
    if (!text.trim() || !state.active) return;
    input.value = '';

    await appendMessage(text, true, Date.now());
    $('#message-list').scrollTop = $('#message-list').scrollHeight;

    try {
      await sendContent(text);
    } catch (err) {
      await appendMessage(`⚠️ Échec de l'envoi : ${err.message}`, true, Date.now());
    }
  });

  // ---------------- Envoi : pièces jointes ----------------
  async function sendFile(file) {
    if (!state.active) return;
    if (file.size > MAX_ATTACHMENT_BYTES) {
      alert('Fichier trop volumineux (max 75 Mo).');
      return;
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const { ciphertextBytes, keyB64, nonceB64 } = await E2E.encryptFile(bytes);
    const { url } = await uploadAttachment(ciphertextBytes);

    const envelope = {
      type: 'attachment',
      kind: file.type.startsWith('audio/') ? 'voice' : 'file',
      url,
      keyB64,
      nonceB64,
      mimeType: file.type || 'application/octet-stream',
      filename: file.name || 'fichier',
      size: file.size,
    };
    const payload = JSON.stringify(envelope);

    await appendMessage(payload, true, Date.now());
    $('#message-list').scrollTop = $('#message-list').scrollHeight;

    try {
      await sendContent(payload);
    } catch (err) {
      await appendMessage(`⚠️ Échec de l'envoi : ${err.message}`, true, Date.now());
    }
  }

  $('#attach-btn').addEventListener('click', () => $('#file-input').click());
  $('#file-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file || !state.active) return;
    try {
      await sendFile(file);
    } catch (err) {
      alert(`Échec de l'envoi du fichier : ${err.message}`);
    }
  });

  // ---------------- Messages vocaux ----------------
  $('#voice-btn').addEventListener('click', async () => {
    const btn = $('#voice-btn');
    if (state.recorder && state.recorder.state === 'recording') {
      state.recorder.stop();
      return;
    }
    if (!state.active) {
      alert('Sélectionnez une conversation avant de vous enregistrer.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      state.recorder = recorder;
      state.recordedChunks = [];

      recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) state.recordedChunks.push(e.data);
      });
      recorder.addEventListener('stop', async () => {
        btn.classList.remove('recording');
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(state.recordedChunks, { type: recorder.mimeType || 'audio/webm' });
        const file = new File([blob], 'vocal.webm', { type: blob.type });
        try {
          await sendFile(file);
        } catch (err) {
          alert(`Échec de l'envoi du message vocal : ${err.message}`);
        }
      });

      recorder.start();
      btn.classList.add('recording');
    } catch (err) {
      alert(`Micro indisponible : ${err.message}`);
    }
  });

  // ---------------- WebSocket temps réel ----------------
  function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    state.ws = socket;

    socket.addEventListener('message', async (event) => {
      let payload;
      try { payload = JSON.parse(event.data); } catch { return; }

      if (payload.type === 'message') {
        const isActive = state.active && state.active.type === 'dm' && state.active.id === payload.senderId;
        if (isActive) {
          const contact = state.contacts.get(payload.senderId);
          const plaintext = await E2E.decryptMessage(payload.ciphertext, payload.nonce, contact.publicKey, state.privateKey);
          await appendMessage(plaintext, false, payload.createdAt);
          $('#message-list').scrollTop = $('#message-list').scrollHeight;
        } else {
          markUnread('dm', payload.senderId);
        }
      } else if (payload.type === 'group-message') {
        const isActive = state.active && state.active.type === 'group' && state.active.id === payload.groupId;
        if (isActive) {
          const group = state.groups.get(payload.groupId);
          const sender = group.members.find((m) => m.id === payload.senderId);
          const plaintext = await E2E.decryptGroupMessage(
            payload.ciphertext, payload.nonce, payload.keyCiphertext, payload.keyNonce, sender.publicKey, state.privateKey
          );
          await appendMessage(plaintext, false, payload.createdAt, sender.username);
          $('#message-list').scrollTop = $('#message-list').scrollHeight;
        } else {
          markUnread('group', payload.groupId);
        }
      }
    });

    socket.addEventListener('close', () => {
      if (state.user) setTimeout(connectWebSocket, 2000);
    });
  }

  function markUnread(type, id) {
    const li = document.querySelector(`#contact-list li[data-type="${type}"][data-id="${id}"]`);
    if (li) li.style.fontWeight = '700';
  }

  // ---------------- PWA ----------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* pas grave si indisponible */ });
    });
  }
})();
