# XULTRA (xultra.space) — Pack export complet

**Version worker :** β2.8.10  
**Date export :** 2026-08-21

---

## Architecture

| Couche | Techno |
|--------|--------|
| Frontend | SPA HTML/CSS/JS embarquée dans un **Cloudflare Worker** (fichier unique) |
| Backend | Cloudflare Worker (`handle(request)`) + routes `/api/*` |
| Auth + DB | **Appwrite Cloud** (Frankfurt) |
| Stockage fichiers | Appwrite Storage bucket `ultravoc_media` (+ Bunny/imgbb selon modules) |
| Domaine | `xultra.space` → Worker Cloudflare |

### Workers Cloudflare déployés
- `bitter-violet-3f1a` (principal, route xultra.space)
- `ultravoc` (miroir / alias)
- `xultra-app-preview` (nouvelle base React/TypeScript en cours de migration progressive, voir `app/README.md` — pas encore branchée sur xultra.space)

### Migration en cours vers React/TypeScript

Le monolithe `worker/worker.js` est progressivement remplacé par une base
moderne (React + TypeScript + Vite + Wrangler) dans le dossier `app/`,
section par section, sans jamais interrompre le site en production. Voir
`app/README.md` pour l'architecture, la stratégie de migration et comment
lancer/tester/déployer ce nouveau projet.

### Application mobile native (iOS/Android)

Base React Native + Expo (TypeScript) dans `mobile/`, connectée aux mêmes
Appwrite + routes `/api/*` que le site — aucun changement backend. Auth de
bout en bout, DM 1:1 ET de groupe chiffrés de bout en bout (E2E, compatibles
bit-à-bit avec le chiffrement du site — vérifié dans les deux sens contre le
vrai Web Crypto API), et fiche de profil en lecture. Voir `mobile/README.md`
pour l'architecture, comment lancer/tester, et ce qu'il reste avant un vrai
lancement (amis/notifications, comptes développeur Apple/Google, EAS Build,
notifications push).

### Appwrite
- **Endpoint :** `https://fra.cloud.appwrite.io/v1`
- **Project ID :** `6a73b975002f14dc6b91`
- **Database ID :** `xultra`
- **API Key :** (voir `config/SECRETS.md` — ne pas committer public)

---

## Structure du pack

```
xultra_export/
├── README.md                 ← ce fichier
├── worker/
│   ├── worker.js             ← **fichier à déployer** (Worker complet)
│   ├── worker_v2.8.10.js     ← copie versionnée
│   ├── APP_embedded.html     ← HTML extrait de la constante APP
│   ├── script_0.js …         ← scripts client extraits
│   └── style_0.css           ← CSS extrait
├── appwrite/
│   ├── collections_list.json
│   ├── SCHEMA_SUMMARY.json
│   └── collections/*.json    ← schéma de chaque collection (aucune donnée réelle)
├── config/
│   ├── MAINT_GATE.txt        ← token bypass maintenance
│   └── SECRETS.md            ← secrets / IDs
└── desktop/                  ← application de bureau (Electron), voir desktop/README.md
```

---

## Déploiement Cloudflare Worker

1. Cloudflare Dashboard → Workers → éditer le script `bitter-violet-3f1a`
2. Coller le contenu de `worker/worker.js`
3. Save & Deploy
4. Répéter pour le worker `ultravoc` si utilisé

Ou via API :
```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/workers/scripts/bitter-violet-3f1a" \
  -H "Authorization: Bearer CF_TOKEN" \
  -H "Content-Type: application/javascript" \
  --data-binary @worker/worker.js
```

---

## Maintenance mode

- Variable dans le worker : `MAINTENANCE_MODE = true`
- Page publique de maintenance (statut services + login dev)
- Bypass cookie `xultra_gate` via :
  - Login dev (comptes admin autorisés uniquement, voir `SHAMAN_UIDS` dans le worker), ou
  - URL `https://xultra.space/?gate=<token>` (token stocké en secret Cloudflare, jamais dans ce dépôt)
- Pour rouvrir au public : mettre `MAINTENANCE_MODE = false` et redéployer

---

## Fonctionnalités principales (SPA)

- Auth email/password Appwrite (session persistante + « Rester connecté »)
- Profils custom (avatar, bannière, bio, badges DEV / BUG HUNTER / EARLY USER)
- Liste d’amis + demandes (`ultravoc_friends`)
- DM (messages, réponses, suppressions) + appels DM (WebRTC)
- Liste membres globale
- Notifications
- Panel admin (comptes staff uniquement) + Bug Hunter reports
- Modes maintenance + `/api/maint/status` + `/api/maint/dev-login`
- Proxies : `/api/members`, `/api/friends`, admin calls, etc.

---

## Collections Appwrite importantes

| Collection | Rôle |
|------------|------|
| `users` | Profils (username, avatar, roles via champs) |
| `ultravoc_friends` | Relations d’amitié |
| `dms` / `dms_messages` | Conversations privées |
| `notifications` | Notifs |
| `dm_calls` / `dm_call_rooms` | Présence appels (si présentes) |
| `bug_reports` | Rapports Bug Hunter |
| `admin_logs` | Logs admin |
| `siteConfig` / `settings` | Config site |

Permissions récentes : collections sensibles en `read("users")` (plus de `read("any")` public).

---

## Notes pour Claude / reprise

1. Le site est un **monolithe Worker** : presque tout le front est dans le template string `const APP = \`...\``.
2. Modifier le front = éditer dans `APP`, redéployer le worker.
3. `AW_KEY` et `MAINT_GATE` sont des secrets Cloudflare Worker (`AW_ADMIN_KEY` / `MAINTENANCE_GATE_SECRET`, via `wrangler secret put` ou le dashboard) — jamais de valeur en dur dans `worker.js`, et jamais exposés côté navigateur.
4. Session Appwrite : `localStorage.xultra_aw_sdk_session` + `client.setSession(secret)`.
5. Pendant maintenance, le front app ne charge que si cookie `xultra_gate` présent.
6. Doublons amis : API `/api/friends` déduplique par `friendId`.

