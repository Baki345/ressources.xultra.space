'use strict';

const express = require('express');
const db = require('../db');
const { requireAuth, requireFetchHeader } = require('../auth');
const storage = require('../storage');

module.exports = function attachmentsRouter() {
  const router = express.Router();

  router.post(
    '/api/attachments',
    requireAuth,
    requireFetchHeader,
    express.raw({ limit: '80mb', type: '*/*' }),
    async (req, res) => {
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'Corps de requete vide.' });
      }
      try {
        const { objectKey, url } = await storage.store(req.body);
        db.prepare('INSERT INTO attachments (object_key, size_bytes, uploaded_by, created_at) VALUES (?, ?, ?, ?)')
          .run(objectKey, req.body.length, req.user.id, Date.now());
        res.status(201).json({ objectKey, url });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  );

  // Fallback local (pas de Bunny configure) : sert les octets chiffres tels quels.
  // En production avec Bunny, les fichiers sont servis directement par le CDN.
  router.get('/attachments/:key', requireAuth, (req, res) => {
    const filePath = storage.localFilePath(req.params.key);
    if (!filePath) return res.status(400).end();
    res.sendFile(filePath, (err) => {
      if (err) res.status(404).end();
    });
  });

  return router;
};
