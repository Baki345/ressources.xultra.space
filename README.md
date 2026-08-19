# XULTRA.space export — α0.2.36

Export live Cloudflare Worker **ultravoc** (xultra.space / app).

## Structure

| Fichier | Description |
|---------|-------------|
| `worker.js` | Worker Cloudflare complet (source de vérité) |
| `app.html` | SPA Ultravoc (`/app`) — HTML+CSS+JS inline décodé |
| `app-script.js` | JS extrait de la SPA |
| `app-style.css` | CSS extrait de la SPA |
| `home.html` | Page d'accueil / login |
| `worker-fetch-handler.js` | Handler `fetch` (routing) |

## Stack

- **Front** : SPA vanilla (HTML/CSS/JS) servie par Cloudflare Worker
- **Auth / DB** : Appwrite (collections `users`, `ultravoc_messages`, `ultravoc_reports`, `ultravoc_modlog`, `ultravoc_platform`, voice, etc.)
- **Images** : ImgBB API
- **Workers** : `ultravoc` + alias `bitter-violet-3f1a`
- **Domain** : xultra.space → worker routes `/` et `/app`

## Déploiement

```bash
# Cloudflare Workers
npx wrangler deploy worker.js --name ultravoc
```

Ou coller `worker.js` dans le dashboard Cloudflare → Workers → ultravoc.

## Notes pour Claude

1. **Ne pas casser** le template literal `const APP=\`...\`` dans worker.js : les `${` client doivent rester échappés `\${` côté worker.
2. Version affichée : `α0.2.36` dans l'UI.
3. Profil overlay z-index max ; members panel se ferme à l'ouverture d'un profil.
4. Badges : DEV (shaman), Hunter (Ryu), BUG-H, Early, Plus, Event.
5. Bug Hunter : reports dans `ultravoc_reports` + `ultravoc_modlog`.
6. Chat : collection `ultravoc_messages`.
7. `ressources.xultra.space` est **hors scope** (autre projet).

## Secrets / config (à NE PAS committer en clair)

- Appwrite endpoint + project + API keys
- ImgBB key (dans le JS client actuellement)
- Cloudflare API token

Relire le worker pour les constantes `IMGBB`, `DB`, client Appwrite.
