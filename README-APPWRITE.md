# Ressources — setup Appwrite + DNS

## 1. Collections (database `xultra`)

### Collection `ressources`
| Attribut     | Type   | Taille | Requis |
|-------------|--------|--------|--------|
| title       | string | 120    | oui    |
| slug        | string | 80     | oui    | (unique recommandé)
| category    | string | 60     | non    |
| description | string | 2000   | non    |
| videoUrl    | string | 2000   | oui    |
| thumbUrl    | string | 2000   | non    |
| likes       | integer| —      | non    | default 0
| dislikes    | integer| —      | non    | default 0

**Permissions collection :**
- Read : `Any` (pour scan QR sans compte)
- Create / Update / Delete : `Users` ou rôle admin seulement (à restreindre côté console)

Pour les votes anonymes, option simple :
- Update : `Any` **uniquement** si tu acceptes le risque (sinon un endpoint Cloud Function plus tard)
- Ou laisse Update refusé : le like reste local sur le téléphone (déjà géré dans le JS)

### Collection `ressource_comments`
| Attribut     | Type   | Taille | Requis |
|-------------|--------|--------|--------|
| ressourceId | string | 64     | oui    |
| name        | string | 40     | oui    |
| text        | string | 500    | oui    |

**Permissions :**
- Read : `Any`
- Create : `Any` (commentaire avec prénom, sans login)
- Update / Delete : admin only

Index recommandé : `ressourceId`

## 2. Document exemple

```
title: Ouverture caisse
slug: ouverture-caisse
category: Caisse
description: Étapes pour ouvrir la caisse le matin.
videoUrl: https://xultra.b-cdn.net/...
likes: 0
dislikes: 0
```

Lien QR : `https://ressources.xultra.space/?v=ouverture-caisse`

## 3. DNS Cloudflare

1. DNS → enregistrement **CNAME**  
   `ressources` → ton worker / pages / même origin que xultra.space  
2. Ou dossier `/ressources/` sur le même hébergement que le site principal.

## 4. Fichiers à déployer

- `index.html`
- `ressources.css`
- `ressources.js`

Dans le dossier servi par `ressources.xultra.space` (ou `xultra.space/ressources/`).
