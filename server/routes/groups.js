'use strict';

const express = require('express');
const db = require('../db');
const { requireAuth, requireFetchHeader } = require('../auth');

function publicUser(row) {
  return { id: row.id, username: row.username, publicKey: row.public_key };
}

module.exports = function groupsRouter(ws) {
  const router = express.Router();

  function getGroup(groupId) {
    const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(groupId);
    if (!group) return null;
    const members = db.prepare(
      `SELECT u.* FROM group_members gm JOIN users u ON u.id = gm.user_id
       WHERE gm.group_id = ? ORDER BY u.username`
    ).all(groupId);
    return { id: group.id, name: group.name, members: members.map(publicUser) };
  }

  router.post('/api/groups', requireAuth, requireFetchHeader, (req, res) => {
    const { name, memberIds } = req.body || {};
    if (typeof name !== 'string' || !name.trim() || name.length > 80) {
      return res.status(400).json({ error: 'Nom de groupe invalide.' });
    }
    const ids = Array.isArray(memberIds)
      ? memberIds.map((n) => Number.parseInt(n, 10)).filter(Number.isInteger)
      : [];
    const uniqueIds = [...new Set([...ids, req.user.id])];
    if (uniqueIds.length < 2) {
      return res.status(400).json({ error: 'Choisissez au moins un membre.' });
    }
    const placeholders = uniqueIds.map(() => '?').join(',');
    const found = db.prepare(`SELECT id FROM users WHERE id IN (${placeholders})`).all(...uniqueIds);
    if (found.length !== uniqueIds.length) {
      return res.status(400).json({ error: 'Un des membres est introuvable.' });
    }

    const now = Date.now();
    const info = db.prepare('INSERT INTO groups (name, created_by, created_at) VALUES (?, ?, ?)')
      .run(name.trim(), req.user.id, now);
    const groupId = info.lastInsertRowid;
    const insertMember = db.prepare('INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, ?)');
    for (const uid of uniqueIds) insertMember.run(groupId, uid, now);

    res.status(201).json({ group: getGroup(groupId) });
  });

  router.get('/api/groups', requireAuth, (req, res) => {
    const rows = db.prepare(
      `SELECT g.id FROM groups g
       JOIN group_members gm ON gm.group_id = g.id
       WHERE gm.user_id = ?
       ORDER BY g.created_at DESC`
    ).all(req.user.id);
    res.json({ groups: rows.map((r) => getGroup(r.id)) });
  });

  router.post('/api/groups/:id/members', requireAuth, requireFetchHeader, (req, res) => {
    const groupId = Number.parseInt(req.params.id, 10);
    const userId = Number.parseInt((req.body || {}).userId, 10);
    if (!Number.isInteger(groupId) || !Number.isInteger(userId)) {
      return res.status(400).json({ error: 'Requete invalide.' });
    }
    const membership = db.prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?')
      .get(groupId, req.user.id);
    if (!membership) return res.status(403).json({ error: "Vous n'etes pas membre de ce groupe." });
    const target = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!target) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, ?)')
      .run(groupId, userId, Date.now());
    res.status(201).json({ group: getGroup(groupId) });
  });

  router.get('/api/groups/:id/messages', requireAuth, (req, res) => {
    const groupId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(groupId)) return res.status(400).json({ error: 'groupId invalide.' });
    const membership = db.prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?')
      .get(groupId, req.user.id);
    if (!membership) return res.status(403).json({ error: "Vous n'etes pas membre de ce groupe." });

    const rows = db.prepare(
      `SELECT m.id, m.sender_id AS senderId, m.ciphertext, m.nonce, m.created_at AS createdAt,
              k.ciphertext AS keyCiphertext, k.nonce AS keyNonce
       FROM messages m
       JOIN group_message_keys k ON k.message_id = m.id AND k.member_id = ?
       WHERE m.group_id = ?
       ORDER BY m.created_at ASC`
    ).all(req.user.id, groupId);

    res.json({ messages: rows });
  });

  // Le client chiffre le corps du message une seule fois avec une cle symetrique
  // aleatoire, puis emballe cette cle individuellement pour chaque membre avec
  // crypto_box (sa cle privee + la cle publique du membre). Le serveur stocke
  // les deux sans jamais pouvoir les relier a un contenu en clair.
  router.post('/api/groups/:id/messages', requireAuth, requireFetchHeader, (req, res) => {
    const groupId = Number.parseInt(req.params.id, 10);
    const { ciphertext, nonce, wrappedKeys } = req.body || {};
    if (!Number.isInteger(groupId)) return res.status(400).json({ error: 'groupId invalide.' });
    if (typeof ciphertext !== 'string' || typeof nonce !== 'string' || !ciphertext || !nonce) {
      return res.status(400).json({ error: 'Message chiffre invalide.' });
    }
    if (!Array.isArray(wrappedKeys) || wrappedKeys.length === 0) {
      return res.status(400).json({ error: 'Cles de message manquantes.' });
    }

    const membership = db.prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?')
      .get(groupId, req.user.id);
    if (!membership) return res.status(403).json({ error: "Vous n'etes pas membre de ce groupe." });

    const memberIds = new Set(
      db.prepare('SELECT user_id FROM group_members WHERE group_id = ?').all(groupId).map((r) => r.user_id)
    );
    for (const wk of wrappedKeys) {
      const mid = Number.parseInt(wk.memberId, 10);
      if (!memberIds.has(mid) || typeof wk.ciphertext !== 'string' || typeof wk.nonce !== 'string') {
        return res.status(400).json({ error: 'Cle de membre invalide.' });
      }
    }

    const now = Date.now();
    const info = db.prepare(
      'INSERT INTO messages (sender_id, group_id, ciphertext, nonce, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(req.user.id, groupId, ciphertext, nonce, now);
    const messageId = info.lastInsertRowid;

    const insertKey = db.prepare(
      'INSERT INTO group_message_keys (message_id, member_id, ciphertext, nonce) VALUES (?, ?, ?, ?)'
    );
    const wrappedByMember = new Map();
    for (const wk of wrappedKeys) {
      const mid = Number.parseInt(wk.memberId, 10);
      insertKey.run(messageId, mid, wk.ciphertext, wk.nonce);
      wrappedByMember.set(mid, wk);
    }

    for (const mid of memberIds) {
      if (mid === req.user.id) continue;
      const wk = wrappedByMember.get(mid);
      if (!wk) continue;
      ws.pushToUser(mid, {
        type: 'group-message',
        id: messageId,
        groupId,
        senderId: req.user.id,
        ciphertext,
        nonce,
        keyCiphertext: wk.ciphertext,
        keyNonce: wk.nonce,
        createdAt: now,
      });
    }

    res.status(201).json({ messageId, createdAt: now });
  });

  return router;
};
