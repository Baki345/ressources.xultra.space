import { Account, Client, Databases, Storage } from 'react-native-appwrite';

// Mêmes AW_EP/AW_PID que worker/worker.js (constantes publiques, jamais des
// secrets — l'endpoint et l'ID de projet Appwrite sont déjà visibles dans le
// JS servi au navigateur) : une seule et même base Appwrite pour le web, le
// desktop (qui charge le site tel quel) et ce client mobile.
export const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '6a73b975002f14dc6b91';
// Doit correspondre à un Platform "React Native" (Android/iOS) déclaré côté
// Appwrite (project settings), sans quoi les requêtes sont rejetées.
export const APPWRITE_PLATFORM = 'space.xultra.mobile';
// Même base de données que worker.js (constante DB='xultra' dans worker.js).
export const APPWRITE_DATABASE_ID = 'xultra';
// Même bucket que worker.js (constante BUCKET='ultravoc_media') — les
// pièces jointes DM y sont stockées (chiffrées AES-GCM avant upload quand
// l'E2E est disponible), en lecture publique (Permission.read(Role.any()))
// exactement comme côté web : c'est le chiffrement, pas une permission
// Appwrite restreinte, qui protège le contenu.
export const APPWRITE_BUCKET_ID = 'ultravoc_media';

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform(APPWRITE_PLATFORM);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
