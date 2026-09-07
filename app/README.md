# xultra-app — nouvelle base React/TypeScript (migration en cours)

**Statut : squelette technique validé, aucune section migrée pour l'instant.**

Ce dossier est la nouvelle base de code de X1 (xultra.space), pensée pour
remplacer progressivement le monolithe historique `worker/worker.js`
(un seul fichier de 3 Mo+, HTML/CSS/JS générés à coups de concaténation de
chaînes de caractères, sans build, sans types, sans tests automatisés
persistés). Rien ici ne tourne encore sur xultra.space — voir "Stratégie de
migration" plus bas.

## Stack

| Couche | Techno | Pourquoi |
|---|---|---|
| Frontend | React + TypeScript | Sécurité de type à la compilation, composants au lieu de `innerHTML='...'+...` |
| Build | Vite | Dev server rapide, HMR, bundling optimisé |
| Backend | Cloudflare Worker (`worker/index.ts`) | Même plateforme d'hébergement que l'existant, mais en TypeScript et modulaire au lieu d'un fichier unique |
| Déploiement | Wrangler | Remplace les scripts curl ad hoc utilisés jusqu'ici pour déployer `worker.js` |
| Tests frontend | Vitest + Testing Library (jsdom) | Tests de composants React |
| Tests backend | Vitest + `@cloudflare/vitest-pool-workers` | Fait tourner les tests **dans le vrai runtime Workers** (Miniflare/workerd), pas une simulation — bien plus fiable que les scripts jsdom ad hoc dans `/tmp` utilisés pour `worker.js` |

## Démarrer

```bash
npm install
npm run dev          # serveur de dev local (Vite + Worker simulé)
npm test             # tests React (jsdom)
npx vitest run --config vitest.workers.config.ts   # tests du Worker (vrai runtime Workers)
npm run build         # build de prod (typecheck + bundle client + bundle worker)
npm run deploy         # build + déploiement Cloudflare (nécessite CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID en variables d'env)
```

## Déploiement actuel : preview isolée, PAS la production

`wrangler.jsonc` déploie sous le nom **`xultra-app-preview`**
(https://xultra-app-preview.<compte>.workers.dev), volontairement différent
du Worker de production `bitter-violet-3f1a` (route `xultra.space`). Tant
qu'une section n'a pas été migrée, testée et vérifiée bout en bout, ce
projet ne touche jamais le domaine live — c'est le principe même de la
migration progressive demandée : le site existant continue de tourner sans
interruption pendant qu'on construit la suite à côté.

## Stratégie de migration (section par section)

1. Choisir une section autonome de `worker/worker.js` (peu de dépendances
   croisées avec le reste — XBin, par exemple, est un bon candidat : c'est
   une modale avec ses propres routes API, sans interaction profonde avec
   le chat ou les appels).
2. Réécrire son UI en composants React typés dans `src/`, et ses routes
   `/api/*` en handlers TypeScript typés dans `worker/`.
3. Écrire les tests (composants + Worker) AVANT de considérer la section
   migrée — voir la config à deux niveaux ci-dessus.
4. Déployer et vérifier sur `xultra-app-preview` (jamais directement en
   prod).
5. Une fois la section prouvée fiable, la faire basculer sur le domaine
   live — soit via une route Cloudflare dédiée à ce chemin, soit en faisant
   pointer temporairement `worker.js` vers le nouveau bundle pour cette
   seule fonctionnalité (pont progressif, à affiner section par section).
6. Répéter jusqu'à ce que `worker/worker.js` puisse être retiré.

## Secrets

Aucun secret n'est encore câblé dans ce projet (le Worker `xultra-app-preview`
n'a aucun binding). Quand une section réelle nécessitant Appwrite sera
migrée, le secret `AW_ADMIN_KEY` (voir `../config/SECRETS.md`, jamais commité)
devra être ajouté via `wrangler secret put AW_ADMIN_KEY --name xultra-app-preview`
puis déclaré dans l'interface `Env` de `worker/index.ts` — jamais en dur dans
le code, comme pour `worker.js`.
