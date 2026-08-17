# Messagerie privée chiffrée de bout en bout

Petite application de messagerie avec compte/connexion, où **le serveur ne
peut jamais lire le contenu des messages ni les clés privées** des
utilisateurs, même si sa base de données est entièrement compromise.

## Pourquoi pas un algorithme de chiffrement "maison" ?

Ce n'était pas la bonne approche : un chiffrement conçu de zéro par une
seule personne, sans audit ni des années d'analyse publique, est presque
toujours cassable — c'est l'un des constats les plus établis en
cryptographie ("don't roll your own crypto"). Ce qui est "maison" ici,
c'est **toute l'infrastructure** : le protocole d'application, la gestion
des sessions, le schéma de base de données, le relais temps réel, le
frontend — tout est écrit spécifiquement pour ce projet, sans dépendre
d'un service tiers. Mais les *primitives* cryptographiques elles-mêmes
viennent de [libsodium](https://libsodium.org) (implémentation de NaCl),
la bibliothèque standard de facto pour ce genre d'usage, utilisée par des
messageries réelles :

- **X25519** pour l'échange de clés (Diffie-Hellman sur courbe elliptique)
- **XSalsa20-Poly1305** pour le chiffrement authentifié des messages
  (construction `crypto_box` de NaCl)
- **Argon2id** pour dériver, à partir du mot de passe, la clé qui protège
  la clé privée de l'utilisateur

## Architecture / modèle de sécurité

1. À l'inscription, le **navigateur** génère une paire de clés X25519.
   Seule la clé publique part sur le serveur.
2. La clé privée est chiffrée dans le navigateur avec une clé dérivée du
   mot de passe (Argon2id), puis c'est ce blob déjà chiffré qui est
   envoyé au serveur — pour permettre de se reconnecter depuis un autre
   appareil. Le serveur n'a jamais accès à la clé privée en clair.
3. Le mot de passe sert à deux choses distinctes, avec deux sels
   différents : (a) un hash scrypt côté serveur pour l'authentification,
   (b) une dérivation Argon2id côté client pour déverrouiller la clé
   privée. Les deux sont indépendants — le serveur ne peut pas remonter
   de l'un à l'autre.
4. Un message 1:1 est chiffré dans le navigateur de l'expéditeur avec la
   clé publique du destinataire, avant même de quitter la page. Le serveur
   ne stocke et ne relaie que du texte chiffré (`ciphertext` + `nonce`).
5. Un message de **groupe** est chiffré une fois avec une clé symétrique
   aléatoire propre à ce message ; cette clé est ensuite emballée
   individuellement pour chaque membre (`crypto_box`). Un nouveau membre
   n'a pas les clés des messages antérieurs à son arrivée : il ne peut
   pas lire l'historique d'avant son ajout (comportement volontaire, pas
   un bug).
6. Les **pièces jointes** (photos, vidéos, messages vocaux, fichiers) sont
   chiffrées dans le navigateur avec une clé symétrique aléatoire propre
   au fichier ; seul le blob chiffré est envoyé au stockage (Bunny ou
   disque local). Cette clé de fichier est elle-même transmise dans le
   texte du message, donc protégée exactement comme le reste du contenu.
7. La clé privée déchiffrée ne vit qu'en mémoire JavaScript, jamais sur
   disque : à chaque rechargement de page, il faut resaisir le mot de
   passe pour la déverrouiller à nouveau.

**Ce que ça protège :** un serveur compromis, une base de données volée,
un opérateur d'hébergement malveillant ou contraint — aucun ne peut lire
les messages.

**Ce que ça ne protège pas** (aucun système ne le peut) : un appareil
client déjà compromis (keylogger, malware), un mot de passe faible ou
réutilisé, ou un attaquant qui intercepte la clé publique d'un contact
lors du tout premier échange (pas de vérification d'empreinte /
"safety number" façon Signal dans cette version). "Impénétrable" n'existe
pas en absolu — ceci vise le meilleur niveau pratique atteignable avec des
primitives éprouvées, pas une promesse d'invulnérabilité totale.

**Métadonnées visibles par le serveur** (honnêteté totale) : le nom d'un
groupe, la liste de ses membres, qui parle à qui et à quel moment, et la
taille des fichiers échangés ne sont **pas** chiffrés — seul le *contenu*
(texte, fichiers) l'est. C'est le même compromis que la quasi-totalité des
messageries chiffrées grand public (Signal excepté, qui va plus loin sur
ce point précis).

## Fonctionnalités

- Comptes avec connexion, chat 1:1 et **groupes** (ex. "Famille")
- Photos, vidéos, documents et **messages vocaux**, chiffrés avant l'envoi
- Temps réel via WebSocket, historique persistant
- **PWA installable** (icône sur l'écran d'accueil, mobile et bureau)

## Stack

- **Node.js 22** + **Express 5**
- **`node:sqlite`** (module natif de Node, pas de dépendance ni de
  compilation native) — migration vers PostgreSQL prévue si l'usage
  dépasse le cadre familial
- **`ws`** pour le relais temps réel (WebSocket)
- **libsodium** (build "sumo", inclut Argon2) chargé côté navigateur
  depuis `public/vendor/` — aucune dépendance externe au runtime
- **Bunny Storage/CDN** (optionnel) pour les pièces jointes ; sans
  configuration, elles sont stockées localement sur le VPS dans
  `data/attachments/`

## Démarrage

```bash
npm install
npm start
```

Puis ouvrir `http://localhost:3000`.

En production, servez l'application derrière un reverse proxy TLS
(HTTPS obligatoire — sans ça les mots de passe, le cookie de session et
le micro/caméra du navigateur ne fonctionneront pas) et lancez avec
`NODE_ENV=production` (active le cookie de session `Secure`).

### Activer Bunny pour les pièces jointes

Copiez `.env.example` en `.env` sur le VPS et renseignez les 4 variables
`BUNNY_*` (storage zone, clé d'accès, host régional, URL de la pull zone
CDN). Sans ça, tout fonctionne quand même — les fichiers restent
simplement sur le disque du VPS.

## Limites connues / pistes d'amélioration

- Pas de vérification d'identité des clés publiques (TOFU implicite,
  comme la plupart des messageries à leurs débuts) — on pourrait ajouter
  un code de vérification affiché aux deux utilisateurs.
- Pas de rotation de clés ni de "forward secrecy" par message (contrairement
  au double ratchet de Signal) : compromettre une clé privée expose
  l'historique déjà stocké. Suffisant pour un usage personnel, pas pour un
  usage à fort enjeu.
- Limitation de débit basique en mémoire (redémarre à chaque redémarrage
  du serveur) — correct pour un usage personnel, pas pour un service public.
- Groupes limités à un ajout manuel de membres, pas de rôles/permissions
  ni de suppression de membre pour l'instant.
- Nom de l'app encore générique ("Messagerie privée") : pour le
  renommage public en "Private", il suffira de changer `public/manifest.json`
  et le `<title>` de `public/index.html`.
- Avant une ouverture au grand public : migrer SQLite → PostgreSQL,
  ajouter une vraie modération/CGU, et durcir le rate-limiting (actuellement
  en mémoire, pensé pour un usage familial).
