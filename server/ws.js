'use strict';

const { WebSocketServer } = require('ws');
const { getUserBySession, SESSION_COOKIE } = require('./auth');

function parseCookieHeader(header) {
  const cookies = {};
  if (!header) return cookies;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) cookies[name] = decodeURIComponent(value);
  }
  return cookies;
}

function attach(httpServer) {
  const wss = new WebSocketServer({ noServer: true });
  const connectionsByUser = new Map(); // userId -> Set<ws>

  httpServer.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname !== '/ws') {
      socket.destroy();
      return;
    }
    const cookies = parseCookieHeader(req.headers.cookie);
    const user = getUserBySession(cookies[SESSION_COOKIE]);
    if (!user) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.userId = user.id;
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', (ws) => {
    if (!connectionsByUser.has(ws.userId)) connectionsByUser.set(ws.userId, new Set());
    connectionsByUser.get(ws.userId).add(ws);

    ws.on('close', () => {
      const set = connectionsByUser.get(ws.userId);
      if (set) {
        set.delete(ws);
        if (set.size === 0) connectionsByUser.delete(ws.userId);
      }
    });

    ws.on('error', () => ws.close());
  });

  function pushToUser(userId, payload) {
    const set = connectionsByUser.get(userId);
    if (!set) return false;
    const data = JSON.stringify(payload);
    let delivered = false;
    for (const ws of set) {
      if (ws.readyState === ws.OPEN) {
        ws.send(data);
        delivered = true;
      }
    }
    return delivered;
  }

  function isOnline(userId) {
    return connectionsByUser.has(userId);
  }

  return { pushToUser, isOnline };
}

module.exports = { attach };
