/* Notifications push mobiles (Expo Push Service) — équivalent mobile du
 * Web Push (VAPID) déjà utilisé côté site (voir worker.js, pushToUid() et
 * /api/push/subscribe). Ici pas de VAPID ni d'abonnement navigateur : Expo
 * fournit un jeton unique par installation ("ExponentPushToken[...]") que
 * le Worker stocke dans une collection dédiée (`expo_push_tokens`, séparée
 * de `push_subs`) et utilise pour relayer via https://exp.host — voir
 * worker.js, /api/push/expo/register et pushToUidExpo().
 *
 * Best-effort partout : une installation qui refuse la permission, tourne
 * sur un simulateur (pas de vrai jeton push), ou n'a pas encore de build
 * EAS configurée (pas de projectId dans app.json → voir mobile/README.md)
 * doit simplement ne pas recevoir de push, jamais bloquer l'app.
 */
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { apiPost } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Le jeton de CETTE installation, gardé en mémoire le temps de la session
// pour pouvoir le désenregistrer proprement à la déconnexion (§
// unregisterPushNotifications) — jamais persisté, Expo peut de toute façon
// le régénérer à tout moment (réinstallation, restauration d'un backup...).
let lastRegisteredToken: string | null = null;

/** À appeler une fois connecté (voir AuthContext) : demande la permission
 * si besoin, récupère le jeton Expo Push de cet appareil et l'enregistre
 * côté Worker pour cet utilisateur. Ne fait rien (silencieusement) sur un
 * simulateur/émulateur, si la permission est refusée, ou si l'app n'a pas
 * encore de projet EAS configuré. */
export async function registerForPushNotificationsAsync(): Promise<void> {
  try {
    if (!Device.isDevice) return;

    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'XULTRA',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return;

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await apiPost('/api/push/expo/register', { token, platform: Platform.OS });
    lastRegisteredToken = token;
  } catch {
    // best-effort — voir en-tête de fichier
  }
}

/** À appeler à la déconnexion : retire le jeton de cet appareil côté
 * Worker, pour que cette installation arrête de recevoir des push destinés
 * au compte qui vient de se déconnecter. Sans effet si aucun jeton n'avait
 * été enregistré durant cette session (permission refusée, simulateur...). */
export async function unregisterPushNotifications(): Promise<void> {
  const token = lastRegisteredToken;
  lastRegisteredToken = null;
  if (!token) return;
  try {
    await apiPost('/api/push/expo/unregister', { token });
  } catch {
    // best-effort — une session déjà expirée ne doit pas bloquer la déconnexion
  }
}
