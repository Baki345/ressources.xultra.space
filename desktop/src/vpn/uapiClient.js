// Client pour le protocole UAPI de WireGuard (voir wireguard.com/xplatform) —
// un socket Unix (Linux/macOS, /var/run/wireguard/<iface>.sock) ou un named
// pipe Windows (\\.\pipe\WireGuard\<iface>) exposé par wireguard-go une fois
// l'interface créée. Node's net.connect({path}) parle aux deux de la même
// façon, d'où un seul module pour les trois OS.
//
// Format : lignes "clé=valeur" terminées par UNE ligne vide, dans les deux
// sens. Les clés WireGuard elles-mêmes voyagent en hex minuscule ici — le
// .conf (base64) doit déjà avoir été converti par confParser.js avant
// d'appeler setInterface().
'use strict';
const net = require('net');

const UAPI_TIMEOUT_MS = 5000;

function sendUapiCommand(socketPath, requestLines) {
  return new Promise(function (resolve, reject) {
    const sock = net.createConnection({ path: socketPath });
    let buf = '';
    let settled = false;

    const timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      sock.destroy();
      reject(new Error('UAPI : délai dépassé (' + socketPath + ')'));
    }, UAPI_TIMEOUT_MS);

    function finish(err, result) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { sock.end(); } catch (e) {}
      if (err) reject(err); else resolve(result);
    }

    sock.on('connect', function () {
      sock.write(requestLines.join('\n') + '\n\n');
    });
    sock.on('data', function (chunk) {
      buf += chunk.toString('utf8');
      if (buf.indexOf('\n\n') !== -1) finish(null, parseUapiResponse(buf));
    });
    sock.on('error', function (e) { finish(e); });
    // wireguard-go ne ferme pas toujours proactivement après avoir répondu —
    // ce close est un filet de sécurité si data() n'a jamais vu de "\n\n",
    // pas le chemin normal.
    sock.on('close', function () { finish(null, parseUapiResponse(buf)); });
  });
}

// "get=1" peut lister PLUSIEURS pairs (chaque nouveau bloc commence par une
// ligne public_key=) — un simple objet plat écraserait silencieusement les
// clés répétées (public_key, rx_bytes...) d'un pair à l'autre, d'où la
// séparation fields (niveau interface) / peers (un objet par pair). À
// l'intérieur d'un même pair, "allowed_ip=" apparaît lui-même en général
// PLUSIEURS fois (ex. 0.0.0.0/0 ET ::/0) — accumulé en tableau
// (peer.allowed_ips), jamais écrasé comme un champ scalaire classique.
function parseUapiResponse(text) {
  const body = text.split('\n\n')[0] || '';
  const lines = body.split('\n').filter(Boolean);
  const result = { fields: {}, peers: [] };
  let currentPeer = null;
  for (const line of lines) {
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq);
    const value = line.slice(eq + 1);
    if (key === 'public_key') {
      currentPeer = { public_key: value, allowed_ips: [] };
      result.peers.push(currentPeer);
      continue;
    }
    if (currentPeer) {
      if (key === 'allowed_ip') currentPeer.allowed_ips.push(value);
      else currentPeer[key] = value;
    } else {
      result.fields[key] = value;
    }
  }
  return result;
}

// opts: {privateKeyHex, peerPublicKeyHex, endpoint, allowedIps[], persistentKeepalive}
async function setInterface(socketPath, opts) {
  const lines = ['set=1'];
  lines.push('private_key=' + opts.privateKeyHex);
  lines.push('listen_port=0');
  lines.push('replace_peers=true');
  lines.push('public_key=' + opts.peerPublicKeyHex);
  if (opts.endpoint) lines.push('endpoint=' + opts.endpoint);
  lines.push('persistent_keepalive_interval=' + (opts.persistentKeepalive || 25));
  lines.push('replace_allowed_ips=true');
  const allowedIps = (opts.allowedIps && opts.allowedIps.length) ? opts.allowedIps : ['0.0.0.0/0', '::/0'];
  for (const ip of allowedIps) lines.push('allowed_ip=' + ip);

  const res = await sendUapiCommand(socketPath, lines);
  const errno = parseInt(res.fields.errno || '0', 10);
  if (errno !== 0) throw new Error('UAPI set=1 a échoué (errno=' + errno + ')');
  return res;
}

async function getStatus(socketPath) {
  return sendUapiCommand(socketPath, ['get=1']);
}

module.exports = { sendUapiCommand, parseUapiResponse, setInterface, getStatus };
