# vpn-manager — service compagnon du VPN IXin

Petit service Node qui gère le vrai serveur WireGuard, pour le compte de
IXin (`worker/worker.js`). Achat/statut/facturation vivent entièrement
dans IXin (Stripe, collection Appwrite `vpn_subscriptions`) — ce service
ne s'occupe que d'une chose : faire correspondre les pairs WireGuard
réellement configurés sur ce VPS à la liste des abonnements actifs.

## Pourquoi ça ne peut pas tourner "dans IXin"

`worker/worker.js` est un Cloudflare Worker : il tourne à la périphérie
du réseau Cloudflare, sans le moindre accès shell ou système de fichiers.
Impossible d'y exécuter `wg`, d'y garder une interface réseau WireGuard
ouverte, ni d'y lire `/etc/wireguard`. Ce service tourne ici, sur le VPS
qui exécute déjà le vrai serveur WireGuard (et, séparément, l'instance
Appwrite auto-hébergée — voir `appwrite/self-host/README.md`), et
communique avec IXin par HTTP signé (même principe que `bot-voice/`, qui
est un compagnon similaire pour la voix Discord-like de la plateforme).

## Prérequis sur le VPS

- Node.js 18+ (ce service utilise `fetch` global, sans dépendance).
- `wireguard-tools` (fournit les commandes `wg` et `wg-quick`).
- Une interface WireGuard déjà installée et montée (`wg-quick up wg0`) —
  **ce service ne l'installe pas**, voir la checklist d'installation
  WireGuard fournie séparément (demande-la si tu ne l'as pas déjà).
- Root, ou au minimum `CAP_NET_ADMIN` pour l'utilisateur qui lance ce
  service — les commandes `wg set`/`wg-quick save` en ont besoin.

## Installation

```bash
# sur le VPS, dans le dossier où tu as copié vpn-manager/
npm install
cp .env.example .env
nano .env   # renseigne VPN_MANAGER_SECRET, WG_SERVER_PUBLIC_KEY, WG_ENDPOINT, VPN_SERVER_ID au minimum
```

`VPN_SERVER_ID` doit correspondre au `slug` du document que ce VPS
représente dans la collection Appwrite `vpn_servers` (`"main"` pour le
VPS de lancement — voir § Multi-serveur plus bas). Sans cette variable,
ce service refuse de démarrer.

`VPN_MANAGER_SECRET` doit être **exactement** la même valeur que le
secret Cloudflare Worker `VPN_MANAGER_SECRET` (Workers → le worker IXin →
Settings → Variables — à ajouter là-bas aussi, ainsi que `VPN_MANAGER_URL`
pointant vers ce service). Sans ces deux variables côté Worker, IXin
n'enverra jamais de "sync maintenant" et la ronde périodique de ce
service (voir plus bas) reste le seul mécanisme actif.

## Lancer avec pm2 (24/7)

```bash
npm install -g pm2   # si pas déjà fait
pm2 start server.js --name vpn-manager
pm2 save
pm2 startup   # relance automatique au redémarrage du VPS
```

## Fonctionnement

Un seul endpoint HTTP, `POST /sync`, protégé par la même signature
`X-IXin-Signature` que le reste de cette infrastructure (HMAC-SHA256 du
corps brut, `VPN_MANAGER_SECRET` comme clé). Aucune route publique non
authentifiée — ce service peut exécuter de vraies commandes `wg`.

À chaque passage de réconciliation (déclenché par `/sync`, ou toutes les
`RECONCILE_INTERVAL_MS` — 15 min par défaut) :
1. Demande à IXin la liste des abonnements actuellement actifs
   (`GET /api/internal/vpn/entitlements`, signé).
2. Compare à l'état réel de l'interface WireGuard (`wg show wg0 dump`).
3. Pour un abonnement sans clé encore générée : crée une paire de clés,
   ajoute le pair, construit le fichier `.conf` client, et le dépose une
   seule fois côté IXin (`POST /api/internal/vpn/provision-result`) — la
   clé privée quitte ce process exactement une fois, à cet instant, signée.
3. Pour un pair présent chez IXin mais absent localement (ce service a
   été réinstallé, ou le pair a été retiré à la main) : le rattache avec
   sa clé et son IP déjà connues, sans jamais en régénérer.
4. Pour un pair local dont l'abonnement n'est plus actif : le retire.

Ce sont les deux seuls sens de correction — jamais d'état intermédiaire
propre à ce service qui pourrait diverger de ce que dit IXin.

## ⚠️ Compromis important : IP partagée avec Appwrite

Tout le trafic sortant des abonnés VPN passera par la NAT de ce VPS,
donc par **la même adresse IP publique** qui sert déjà
`appwrite.xultra.space` et un autre projet (`rp.xultra.space`). Un abus
par un seul abonné VPN (spam, scan, torrent signalé) risque de faire
blacklister cette IP partagée, dégradant potentiellement les deux autres
services au passage.

C'est un compromis assumé (réutiliser ce VPS plutôt qu'un VPS dédié était
un choix délibéré). À garder en tête : vérifier de temps en temps la
réputation de cette IP, et avoir "migrer le VPN vers un second petit VPS"
comme plan de repli si elle finit par être signalée.

## Multi-serveur

`GET /api/internal/vpn/entitlements` est maintenant scopé par
`?serverId=<VPN_SERVER_ID>` — chaque VPS ne voit et ne gère jamais que
ses propres abonnés. Le principe retenu : **un process vpn-manager par
VPS**, jamais un vpn-manager unique multi-serveur — `lib/reconcile.js`
reste inchangé ("un wg0, une boucle"), seul `ixinClient.js` transmet
maintenant `VPN_SERVER_ID` dans l'appel.

### Ajouter un 2e serveur (procédure sans nouveau code)

1. Provisionner un nouveau VPS, y refaire exactement cette installation
   (WireGuard + ce service + wstunnel/nginx si Stealth voulu sur ce
   serveur aussi).
2. `.env` de ce nouveau VPS : ses propres `WG_SERVER_PUBLIC_KEY`/
   `WG_ENDPOINT`, un `VPN_SERVER_ID` DIFFÉRENT du premier (ex. `"eu2"`),
   et — voir risque ci-dessous — idéalement son propre
   `VPN_MANAGER_SECRET`.
3. Insérer **un seul document** dans la collection Appwrite
   `vpn_servers` (même `slug` que `VPN_SERVER_ID`) — via le panel admin
   IXin ou directement l'API Appwrite. Aucun redéploiement de
   `worker.js` n'est nécessaire.
4. `pm2 start server.js --name vpn-manager-<slug>` sur le nouveau VPS.

### ⚠️ Risque à traiter avant d'ajouter un vrai 2e serveur

Aujourd'hui, un seul `VPN_MANAGER_SECRET` existe (partagé avec le
Worker). Le réutiliser tel quel sur un 2e VPS permettrait à ce serveur
(s'il était compromis) de forger des requêtes signées valides pour les
abonnés d'un AUTRE serveur — la signature prouve "un vpn-manager
légitime", pas "lequel". Pas bloquant tant qu'il n'y a qu'un serveur ;
avant d'en ajouter un second, passer à un secret par serveur
(`VPN_MANAGER_SECRET_<slug>` côté Worker, vérifié en cross-référençant
le `serverId` de la requête avec le secret qui l'a signée).

## Structure

```
vpn-manager/
  server.js          # point d'entrée : serveur HTTP, minuteur périodique
  lib/
    env.js            # chargement .env + valeurs par défaut
    signature.js       # HMAC sign/verify (X-IXin-Signature)
    wireguard.js        # tout ce qui exécute réellement `wg`/`wg-quick`
    ixinClient.js        # appels signés vers /api/internal/vpn/* côté IXin
    reconcile.js          # la passe de réconciliation elle-même
  .env.example
  package.json
```
