# Tests de sécurité E2E

Régressions pour les failles trouvées et corrigées lors de l'audit sécurité
de septembre 2026 (voir le CHANGELOG dans `worker/worker.js`, versions
4.55.32 à 4.55.36). Chaque test reproduit l'exploit d'origine et vérifie
qu'il échoue désormais, puis vérifie que le chemin légitime fonctionne
toujours.

## ⚠️ Ces tests tournent contre la production

Il n'existe pas d'environnement Appwrite/Worker séparé pour X1 : ces tests
appellent directement `https://xultra.space` et la base Appwrite réelle.
Ils sont sans danger pour les vrais utilisateurs :

- Ils ne créent et ne manipulent que des comptes **jetables** (email
  `x1test.*@example.com`, mot de passe aléatoire), jamais de vrais comptes
  (sauf lecture/JWT du compte owner-tier `1leeway` dans
  `ismod-privesc.test.mjs`, nécessaire pour tester le chemin légitime
  d'octroi de mod — aucune donnée de ce compte n'est modifiée).
- Chaque test nettoie tout ce qu'il a créé dans un bloc `finally`-style
  (`doCleanup()`), même en cas de crash.
- Aucun test ne touche aux données d'un vrai utilisateur.

## Prérequis

Une clé API Appwrite avec accès admin (celle listée dans
`config/SECRETS.md`, jamais committée) :

```bash
export AW_ADMIN_KEY="standard_..."
```

## Lancer les tests

```bash
# Tous les tests
node tests/run-all.mjs

# Un seul test
node tests/security/ismod-privesc.test.mjs
```

Chaque fichier est autonome (`node tests/security/<nom>.test.mjs`) et sort
avec le code 0 si tout passe, 1 sinon.

## Suites

| Fichier | Faille couverte | Version du correctif |
|---|---|---|
| `ismod-privesc.test.mjs` | Élévation de privilèges via `users.isMod` écrivable par le client | 4.55.32 |
| `attachment-size.test.mjs` | Taille des pièces jointes de salon non vérifiée côté serveur | 4.55.33 |
| `dm-permissions.test.mjs` | Permissions DM (threads/messages) mal posées à la création | 4.55.34 |
| `notifications.test.mjs` | Permissions notifications accordées au créateur au lieu du destinataire | 4.55.35 |
| `server-quality-bypass.test.mjs` | Qualité audio/vidéo X1+ d'un serveur contournable par PATCH direct | 4.55.36 |
| `upload-size-limits.test.mjs` | Taille des imports musique/story/post créateur non vérifiée côté serveur | 4.55.36 |

## Quand les relancer

- Avant tout déploiement touchant les routes `/api/admin/mod`,
  `/api/dms/*`, `/api/notifications/*`, `/api/servers/*`,
  `/api/music/*`, `/api/stories/*`, `/api/creators/*`, ou les permissions
  des collections Appwrite correspondantes (`users`, `user_meta`, `dms`,
  `dms_messages`, `notifications`, `servers`).
- Périodiquement, pour détecter une régression (ex: une future
  modification qui rouvre un droit `update()` trop large sur une
  collection).

## Limite connue

`upload-size-limits.test.mjs` ne peut pas déclencher un vrai rejet
serveur >50MB en conditions réelles : l'upload multipart en un seul POST
échoue côté infrastructure Appwrite Cloud au-delà d'environ 50MB (503,
indépendant de cet environnement). Le chemin de rejet est donc validé par
lecture de code + le test `attachment-size.test.mjs` (même pattern exact,
11MB > 10MB, déclenché avec succès en conditions réelles).
