import { Account, Client } from 'react-native-appwrite';

// Même backend Appwrite que xultra.space et l'appli mobile IXin (mobile/) —
// c'est tout le principe : le même compte IXin fonctionne ici, "relié" comme
// demandé, pas un second système d'identité à maintenir.
export const APPWRITE_ENDPOINT = 'https://appwrite.xultra.space/v1';
export const APPWRITE_PROJECT_ID = '6aab2f4a00243807fa77';
// Platform Appwrite dédiée à CETTE appli (bundle id space.xultra.vpn) — à
// déclarer côté Appwrite (project settings → Platforms) avant que les
// requêtes ne soient acceptées, exactement comme space.xultra.mobile pour
// l'appli IXin existante.
export const APPWRITE_PLATFORM = 'space.xultra.vpn';

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform(APPWRITE_PLATFORM);

export const account = new Account(client);
