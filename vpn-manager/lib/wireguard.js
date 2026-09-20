'use strict';
const { execFileSync } = require('child_process');
const env = require('./env');

// Toujours via execFile(Sync) avec un tableau d'arguments, jamais une
// chaîne passée à un shell — même prudence que le reste de cette
// infrastructure (awFetch côté worker.js ne construit jamais de commande
// shell non plus). Les clés WireGuard manipulées ici sont toujours soit
// générées par ce process lui-même, soit déjà validées par Appwrite comme
// des clés existantes — jamais du texte libre saisi par un utilisateur.
function run(cmd, args, opts) {
  return execFileSync(cmd, args, Object.assign({ encoding: 'utf8' }, opts || {}));
}

// wg genkey | wg pubkey — deux commandes distinctes plutôt qu'un vrai pipe
// shell, pour la même raison que ci-dessus (jamais de shell intermédiaire).
function generateKeypair() {
  const privateKey = run('wg', ['genkey']).trim();
  const publicKey = run('wg', ['pubkey'], { input: privateKey + '\n' }).trim();
  return { privateKey, publicKey };
}

// `wg show <iface> dump` — première ligne = infos de l'interface elle-même
// (clé privée/publique/port/fwmark), les suivantes une par pair déjà
// configuré : publicKey, presharedKey, endpoint, allowedIPs, ... — seuls
// publicKey et allowedIPs nous intéressent ici (réconciliation).
function listPeers() {
  let out;
  try {
    out = run('wg', ['show', env.WG_INTERFACE, 'dump']);
  } catch (e) {
    // Interface pas encore montée (wg-quick up pas encore lancé) — traité
    // comme "aucun pair", le prochain passage de réconciliation réessaiera.
    return [];
  }
  const lines = out.split('\n').filter(Boolean);
  return lines.slice(1).map(function (line) {
    const parts = line.split('\t');
    return { publicKey: parts[0], allowedIps: parts[3] || '' };
  });
}

function persist() {
  // `wg-quick save` réécrit /etc/wireguard/<iface>.conf à partir de l'état
  // RUNNING de l'interface (pairs inclus) — sans ça, `wg set` ne survivrait
  // pas à un redémarrage du VPS.
  try { run('wg-quick', ['save', env.WG_INTERFACE]); } catch (e) {
    console.error('[vpn-manager] wg-quick save a échoué (les pairs resteront actifs jusqu\'au prochain redémarrage seulement) :', e.message);
  }
}

function addPeer(publicKey, assignedIp) {
  try {
    run('wg', ['set', env.WG_INTERFACE, 'peer', publicKey, 'allowed-ips', assignedIp + '/32']);
    persist();
  } catch (e) {
    console.warn('[vpn-manager] addPeer failed (config still generated):', e.message);
  }
}

function removePeer(publicKey) {
  try {
    run('wg', ['set', env.WG_INTERFACE, 'peer', publicKey, 'remove']);
    persist();
  } catch (e) {
    console.warn('[vpn-manager] removePeer failed:', e.message);
  }
}

// Alloue la prochaine adresse /32 libre dans WG_SUBNET_CIDR — un simple
// compteur d'hôtes suffisant pour un sous-réseau /24 typique, jamais conçu
// comme une bibliothèque CIDR générique (scope volontairement restreint à
// ce dont ce service a besoin).
function nextFreeIp(usedIps) {
  const [base, prefixStr] = env.WG_SUBNET_CIDR.split('/');
  const prefix = parseInt(prefixStr, 10) || 24;
  const hostBits = 32 - prefix;
  const maxHosts = Math.pow(2, hostBits) - 1; // -1 : dernière adresse = broadcast
  const baseParts = base.split('.').map(Number);
  const baseInt = ((baseParts[0] << 24) >>> 0) + (baseParts[1] << 16) + (baseParts[2] << 8) + baseParts[3];
  const used = new Set(usedIps);
  // .0 = réseau, .1 réservée à l'interface serveur elle-même (Address= dans wg0.conf).
  for (let h = 2; h < maxHosts; h++) {
    const ipInt = baseInt + h;
    const ip = [(ipInt >>> 24) & 255, (ipInt >>> 16) & 255, (ipInt >>> 8) & 255, ipInt & 255].join('.');
    if (!used.has(ip)) return ip;
  }
  throw new Error('Sous-réseau VPN plein (' + env.WG_SUBNET_CIDR + ') — agrandis WG_SUBNET_CIDR.');
}

function buildClientConfig(opts) {
  const dnsLine = env.WG_CLIENT_DNS ? ('DNS = ' + env.WG_CLIENT_DNS + '\n') : '';
  return '[Interface]\n'
    + 'PrivateKey = ' + opts.privateKey + '\n'
    + 'Address = ' + opts.assignedIp + '/32\n'
    + dnsLine
    + '\n[Peer]\n'
    + 'PublicKey = ' + env.WG_SERVER_PUBLIC_KEY + '\n'
    + 'Endpoint = ' + env.WG_ENDPOINT + '\n'
    + 'AllowedIPs = 0.0.0.0/0, ::/0\n'
    + 'PersistentKeepalive = 25\n';
}

module.exports = { generateKeypair, listPeers, addPeer, removePeer, nextFreeIp, buildClientConfig };
