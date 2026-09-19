'use strict';
const fs = require('fs');
const path = require('path');

// Mini chargeur de .env (même logique que bot-voice/lib/env.js — pas de
// dépendance dotenv, pour rester facile à auditer/héberger).
function loadEnvFile(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    raw.split('\n').forEach(function (line) {
      const trimmed = line.trim();
      if (!trimmed || trimmed[0] === '#') return;
      const eq = trimmed.indexOf('=');
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val[0] === '"' && val[val.length - 1] === '"') || (val[0] === "'" && val[val.length - 1] === "'")) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    });
  } catch (e) { /* pas de .env, tant pis : on retombe sur l'environnement système */ }
}
loadEnvFile(path.join(__dirname, '..', '.env'));

const VPN_MANAGER_SECRET = process.env.VPN_MANAGER_SECRET || '';
if (!VPN_MANAGER_SECRET) {
  console.error('[vpn-manager] VPN_MANAGER_SECRET manquant. Copie .env.example vers .env et renseigne-le (même valeur que le secret Cloudflare Worker VPN_MANAGER_SECRET côté IXin).');
  process.exit(1);
}
const WG_SERVER_PUBLIC_KEY = process.env.WG_SERVER_PUBLIC_KEY || '';
if (!WG_SERVER_PUBLIC_KEY) {
  console.error('[vpn-manager] WG_SERVER_PUBLIC_KEY manquant — contenu de /etc/wireguard/server_public.key généré à l\'installation de WireGuard (voir README).');
  process.exit(1);
}

module.exports = {
  VPN_MANAGER_SECRET: VPN_MANAGER_SECRET,
  PORT: parseInt(process.env.PORT || '3100', 10),
  // Base de l'API IXin à interroger pour la liste des abonnements actifs et
  // pour déposer la config une fois une clé provisionnée.
  IXIN_BASE_URL: process.env.IXIN_BASE_URL || 'https://xultra.space',
  // Interface WireGuard gérée par ce service (wg-quick up <WG_INTERFACE>
  // doit déjà tourner sur ce VPS — voir README, ce service ne l'installe pas).
  WG_INTERFACE: process.env.WG_INTERFACE || 'wg0',
  // Sous-réseau dans lequel piocher une adresse /32 par abonné — DOIT être
  // le même que Address= dans wg0.conf, et ne doit RIEN chevaucher d'autre
  // sur ce VPS (vérifier `ip a`/`docker network ls` avant de choisir, voir
  // README) : conflit sinon avec le réseau Docker d'Appwrite déjà en place.
  WG_SUBNET_CIDR: process.env.WG_SUBNET_CIDR || '10.66.0.0/24',
  WG_SERVER_PUBLIC_KEY: WG_SERVER_PUBLIC_KEY,
  // host:port public que les clients WireGuard doivent joindre — le VPS lui-
  // même, PAS forcément vpn.xultra.space (ce nom peut n'exister que pour une
  // page de statut humaine, voir README).
  WG_ENDPOINT: process.env.WG_ENDPOINT || '',
  // Serveur(s) DNS pour les clients — 1.1.1.1 par défaut (Cloudflare, déjà
  // utilisé ailleurs sur cette infra), remplaçable si besoin.
  WG_CLIENT_DNS: process.env.WG_CLIENT_DNS || '1.1.1.1',
  // Fréquence de la ronde de réconciliation périodique (voir lib/reconcile.js) —
  // 15 min par défaut, en plus du "sync maintenant" déclenché par le webhook
  // Stripe d'IXin juste après un achat.
  RECONCILE_INTERVAL_MS: parseInt(process.env.RECONCILE_INTERVAL_MS || String(15 * 60 * 1000), 10)
};
