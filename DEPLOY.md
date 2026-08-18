# Déployer Ressources sur XULTRA (stack actuelle)

Compatible avec le code GitHub actuel :
- Appwrite `https://fra.cloud.appwrite.io/v1` / project `6a73b975002f14dc6b91` / DB `xultra`
- Sous-domaines déjà prévus : `vocal`, `scl`, `wave`, `bin`, `nsfw`
- Uploads Bunny via `https://xultra-upload.lordfamily1.workers.dev`

## A. Appwrite (obligatoire pour vrais tutos)

### Collection `ressources`
Attributs :
- title (string, 120)
- slug (string, 80) — unique
- category (string, 60)
- description (string, 2000)
- videoUrl (string, 2000)
- thumbUrl (string, 2000) optionnel
- likes (integer, default 0)
- dislikes (integer, default 0)

Permissions (réglages collection) :
- Read : **Any**
- Create / Update / Delete : **Users** (ou seulement ton user admin)

Pour que les 👍/👎 anonymes se synchronisent serveur, il faudrait Update: Any (risqué)  
→ sinon le vote reste local sur le téléphone (déjà géré dans ressources.js).

### Collection `ressource_comments`
- ressourceId (string, 64)
- name (string, 40)
- text (string, 500)

Permissions :
- Read : **Any**
- Create : **Any**
- Update/Delete : admin seulement

Index : `ressourceId`

### Document test
```
title: Ouverture caisse
slug: ouverture-caisse
category: Caisse
description: Étapes pour ouvrir la caisse.
videoUrl: https://xultra.b-cdn.net/....mp4
likes: 0
dislikes: 0
```

URL QR : `https://ressources.xultra.space/?v=ouverture-caisse`

## B. Fichiers à uploader

Dans un dossier dédié (ex. `/ressources/` sur ton hébergement, ou projet Cloudflare Pages séparé) :

- index.html
- ressources.css
- ressources.js

## C. DNS Cloudflare

1. DNS → **CNAME**  
   Nom : `ressources`  
   Cible : même origine que xultra.space (Pages / Worker / R2 public)

2. SSL/TLS : Full

Si tout passe par **un seul Worker** qui sert le SPA principal, ajoute une règle :
- si `Host = ressources.xultra.space` → servir le dossier ressources (pas index.html du hub)

Sinon le plus simple : **Cloudflare Pages** projet `xultra-ressources` branché sur ces 3 fichiers, domaine custom `ressources.xultra.space`.

## D. Lien depuis le hub XULTRA (optionnel)

Dans `script.js` (ton fichier GitHub), la table existe déjà :

```js
const SUBDOMAIN_ROUTES = {
  vocal: () => { try { openVoiceHub(); } catch (e) {} },
  scl:   () => { try { showHome(); } catch (e) {} },
  wave:  () => { try { openWaveHub(); } catch (e) {} },
  bin:   () => { try { openPasteHub(); } catch (e) {} },
  nsfw:  () => { try { openNsfwHub(); } catch (e) {} }
};
```

**Ne force pas** `ressources` dans cette table si le sous-domaine sert **un autre site** (la page visionnage).  
Pour un bouton Hub → ouvre le sous-domaine :

```js
function openRessourcesHub() {
  location.href = "https://ressources.xultra.space/";
}
```

Tuile HTML (hub) :
```html
<button type="button" class="hub-tile" onclick="openRessourcesHub()">
  <span class="ht-ico">📋</span>
  <span class="ht-lab">Ressources</span>
  <span class="ht-sub">Tutos procédures</span>
</button>
```

## E. Générer un QR

Texte du QR = URL complète :
```
https://ressources.xultra.space/?v=ouverture-caisse
```

Outils : qr-code-generator.com, ou extension navigateur.

## F. Checklist test téléphone

1. Ouvre le lien sur mobile
2. Vidéo démarre (muet) + bouton son
3. Like / dislike
4. Commentaire avec prénom sans compte
5. Retour liste catégories

## G. Panel admin upload (plus tard)

Quand tu voudras uploader depuis le panel XULTRA :
1. `uploadFileXultra(file, "ressources")` → URL Bunny
2. `db.collection("ressources").add({ title, slug, category, description, videoUrl, likes:0, dislikes:0 })`

Pas inclus dans ce lot pour ne pas toucher au gros `script.js` tant que le visionnage QR n’est pas en prod.
