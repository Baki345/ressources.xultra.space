// Parse le texte .conf WireGuard renvoyé une seule fois par
// /api/vpn/config/claim (voir vpn-manager/lib/wireguard.js buildClientConfig
// côté serveur pour le format exact généré) en un objet exploitable par
// uapiClient.js, et fournit la conversion de clé base64 (format WireGuard
// standard, utilisé dans le .conf) <-> hex minuscule (format attendu par le
// protocole UAPI, voir wireguard.com/xplatform) — l'erreur la plus courante
// en implémentant un client UAPI à la main est d'oublier cette conversion,
// ce qui produit un errno=22 (EINVAL) sans autre diagnostic côté wireguard-go.
'use strict';

function base64KeyToHex(b64) {
  const buf = Buffer.from(String(b64 || '').trim(), 'base64');
  if (buf.length !== 32) throw new Error('Clé WireGuard invalide (attendu 32 octets, reçu ' + buf.length + ')');
  return buf.toString('hex');
}

function hexKeyToBase64(hex) {
  const buf = Buffer.from(String(hex || '').trim(), 'hex');
  if (buf.length !== 32) throw new Error('Clé WireGuard invalide (attendu 32 octets, reçu ' + buf.length + ')');
  return buf.toString('base64');
}

// Découpe une section .conf ("[Interface]" ou "[Peer]") en paires clé/valeur,
// insensible à la casse sur les clés (WireGuard tolère "PrivateKey"/"privatekey").
function parseSection(lines) {
  const out = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim().toLowerCase();
    const value = trimmed.slice(eq + 1).trim();
    out[key] = value;
  }
  return out;
}

function parseConf(confText) {
  const text = String(confText || '');
  const lines = text.split(/\r?\n/);
  const sections = { interface: [], peer: [] };
  let current = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^\[interface\]$/i.test(trimmed)) { current = 'interface'; continue; }
    if (/^\[peer\]$/i.test(trimmed)) { current = 'peer'; continue; }
    if (current) sections[current].push(line);
  }
  const iface = parseSection(sections.interface);
  const peer = parseSection(sections.peer);

  if (!iface.privatekey) throw new Error('.conf invalide : PrivateKey manquante dans [Interface]');
  if (!iface.address) throw new Error('.conf invalide : Address manquante dans [Interface]');
  if (!peer.publickey) throw new Error('.conf invalide : PublicKey manquante dans [Peer]');
  if (!peer.endpoint) throw new Error('.conf invalide : Endpoint manquant dans [Peer]');

  const addressCidr = iface.address; // ex. "10.66.0.2/32"
  const [addressIp, addressPrefix] = addressCidr.split('/');
  if (!addressIp || !addressPrefix) throw new Error('.conf invalide : Address doit être au format ip/préfixe');

  const allowedIps = (peer.allowedips || '0.0.0.0/0, ::/0')
    .split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

  return {
    privateKeyB64: iface.privatekey,
    privateKeyHex: base64KeyToHex(iface.privatekey),
    addressCidr: addressCidr,
    addressIp: addressIp,
    addressPrefix: addressPrefix,
    dns: iface.dns || '',
    peerPublicKeyB64: peer.publickey,
    peerPublicKeyHex: base64KeyToHex(peer.publickey),
    endpoint: peer.endpoint,
    allowedIps: allowedIps,
    persistentKeepalive: parseInt(peer.persistentkeepalive || '25', 10) || 25
  };
}

module.exports = { parseConf, base64KeyToHex, hexKeyToBase64 };
