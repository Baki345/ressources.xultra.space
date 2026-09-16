# Self-héberger Appwrite sur le VPS (remplace Appwrite Cloud)

Ce dossier reconstruit de zéro, sur une instance Appwrite **self-hosted**,
la base `xultra` (81 collections) et les 6 buckets utilisés par
`worker/worker.js` — sans migrer les données existantes (nouvelle base
vide, comme demandé).

**Important** : `appwrite/collections/*.json` et `appwrite/collections_list.json`
à la racine du repo sont **obsolètes** (schéma d'avant un renommage —
`tracks`→`xm_tracks`, `guilds`→`servers`, etc.) et **ne sont pas utilisés**
ici. Ce dossier repart de `schema.json`/`buckets.json`, reconstitués en
analysant chaque appel `awFetch`/`db.createDocument`/`db.updateDocument`
dans `worker/worker.js` (le code réellement en prod aujourd'hui).

C'est une reconstruction **best-effort** : les noms de champs sont fiables
(extraits des sites d'appel réels), mais le type exact (string/integer/
boolean/datetime) est parfois une déduction. Si un champ a un mauvais
type, Appwrite renverra une erreur de validation explicite à l'usage
(nom du champ + type attendu) — facile à corriger un par un dans la
console Appwrite, pas besoin de tout recommencer.

## 0. Pourquoi pas un docker-compose fait main

Appwrite self-hosted, c'est ~15 conteneurs interdépendants (MariaDB, Redis,
la queue, les workers, l'executor de fonctions qui parle au socket Docker,
Traefik...) qui changent à chaque version. L'installeur officiel génère le
docker-compose.yml et le .env corrects pour la version choisie — le
réécrire à la main serait fragile. On l'utilise donc directement.

## 1. Installer Appwrite sur le VPS

Le VPS a déjà nginx sur les ports 80/443 (pour rp.xultra.space via
discord-rp-bot). Le Traefik embarqué d'Appwrite doit donc être mis sur
des ports locaux, avec nginx qui fait le reverse-proxy par domaine —
exactement le montage déjà utilisé pour le dashboard discord-rp-bot.

```bash
mkdir -p ~/appwrite && cd ~/appwrite

docker run -it --rm \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume "$(pwd)":/usr/src/code/appwrite:rw \
  --entrypoint="install" \
  appwrite/appwrite:1.6.1
```

L'installeur pose plusieurs questions. Réponds :

- **HTTP port** → `8081` (au lieu de 80 — évite le conflit avec nginx)
- **HTTPS port** → `8443` (ne sera jamais utilisé directement, nginx gère le TLS, mais l'installeur en veut un)
- **Organisation/hostname** → `appwrite.xultra.space` (le domaine choisi)
- Le reste (secret key, etc.) : valeurs par défaut ou laisse l'installeur générer.

Puis édite `docker-compose.yml` généré : sur le service `traefik`, remplace

```yaml
ports:
  - 8081:80
  - 8443:443
```

par

```yaml
ports:
  - "127.0.0.1:8081:80"
```

(on retire complètement la ligne 8443 — pas besoin, nginx ne parlera qu'en HTTP à Appwrite en interne).

Puis :

```bash
docker compose up -d
```

## 2. nginx : exposer appwrite.xultra.space

Ajoute un sous-domaine DNS `appwrite.xultra.space` → IP du VPS, puis
(voir `nginx-appwrite.conf.example` dans ce dossier) :

```bash
sudo cp nginx-appwrite.conf.example /etc/nginx/sites-available/appwrite.xultra.space
sudo ln -s /etc/nginx/sites-available/appwrite.xultra.space /etc/nginx/sites-enabled/
sudo certbot --nginx -d appwrite.xultra.space
sudo nginx -t && sudo systemctl reload nginx
```

Vérifie que `https://appwrite.xultra.space` affiche bien la console Appwrite.

## 3. Créer le projet + la clé API

1. Console Appwrite → crée un compte admin → crée un projet (nom libre, ex. "xultra").
2. Note le **Project ID** affiché (Project Settings).
3. Project Settings → **API Keys** → New API key → coche au minimum :
   `databases.read`, `databases.write`, `collections.write`, `attributes.write`,
   `indexes.write`, `buckets.write`, `teams.write`.
4. Copie la clé (affichée une seule fois).

## 4. Recréer le schéma

```bash
cd appwrite/self-host   # ce dossier, dans le repo ressources.xultra.space
npm install

APPWRITE_ENDPOINT=https://appwrite.xultra.space/v1 \
APPWRITE_PROJECT_ID=<project id de l'étape 3> \
APPWRITE_API_KEY=<clé API de l'étape 3> \
npm run recreate
```

Ça crée la base `xultra`, les 81 collections avec leurs attributs/index,
l'équipe `admins`, et les 6 buckets. Relançable sans risque (idempotent).

Ensuite dans la console Appwrite : **Auth → Settings**, active les
méthodes de connexion utilisées par l'app (email/password au minimum, et
tout OAuth provider que le code exploite).

## 5. Vérifier les buckets à la main

`buckets.json` documente pour chacun le raisonnement, mais **`xultra_drive`
en particulier est une supposition faible** (permissions vides +
fileSecurity, en supposant que l'app pose les permissions par fichier à
l'upload). Après la mise en route : upload un fichier avec un compte,
vérifie qu'un **autre** compte ne peut pas le lire directement par son
URL si le fichier est censé être privé. Ajuste dans la console si besoin.

## 6. Rebrancher l'app sur la nouvelle instance

Une fois le Project ID en main, dis-le à Claude (ou modifie toi-même) :
- `worker/worker.js` : `AW_EP`/`AW_PID` (2 endroits) + toutes les URLs
  d'icônes en dur (`fra.cloud.appwrite.io` → `appwrite.xultra.space`)
- `mobile/src/appwrite.ts` : `APPWRITE_ENDPOINT`/`APPWRITE_PROJECT_ID`
- La clé API (`AW_ADMIN_KEY`) : `wrangler secret put AW_ADMIN_KEY` côté
  Cloudflare Worker (déjà externalisée, aucun changement de code requis) —
  remets une clé API de la **nouvelle** instance self-hosted (peut être la
  même que celle de l'étape 3, ou une clé dédiée avec un scope plus large
  pour couvrir toutes les opérations `asAdmin` du worker : `databases.*`,
  `users.*`, `storage.*`).
- Redéclare la plateforme mobile (React Native) dans Project Settings →
  Platforms du nouveau projet (l'ancienne déclaration ne vaut que pour le
  projet Cloud).

## 7. Recréer ton propre compte

Base neuve = plus aucun utilisateur. Inscris-toi normalement via l'app une
fois rebranchée. Si tu veux les rôles admin (`team:admins`, badges, etc.),
ajoute-toi à l'équipe `admins` depuis la console Appwrite (Teams → admins
→ Add member) et mets à jour manuellement tes documents `users`/`user_meta`
pour les flags admin (`isMod`, etc. — regarde `appwrite/collections/users.json`
pour la liste des champs, même si ce fichier est obsolète sur le schéma
global, les champs qu'il liste pour `users` restent globalement valides).
