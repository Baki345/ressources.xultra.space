const mockApiPost = jest.fn();
const mockIsDevice = { value: true };
const mockGetPermissionsAsync = jest.fn();
const mockRequestPermissionsAsync = jest.fn();
const mockSetNotificationChannelAsync = jest.fn();
const mockGetExpoPushTokenAsync = jest.fn();
let mockProjectId: string | undefined = 'eas-project-123';
let mockPlatformOS: 'ios' | 'android' = 'ios';

jest.mock('../api', () => ({ apiPost: (...args: unknown[]) => mockApiPost(...args) }));
jest.mock('react-native', () => ({ Platform: { get OS() { return mockPlatformOS; } } }));
jest.mock('expo-device', () => ({ get isDevice() { return mockIsDevice.value; } }));
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { get expoConfig() { return { extra: { eas: { projectId: mockProjectId } } }; } },
}));
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: (...args: unknown[]) => mockGetPermissionsAsync(...args),
  requestPermissionsAsync: (...args: unknown[]) => mockRequestPermissionsAsync(...args),
  setNotificationChannelAsync: (...args: unknown[]) => mockSetNotificationChannelAsync(...args),
  getExpoPushTokenAsync: (...args: unknown[]) => mockGetExpoPushTokenAsync(...args),
  AndroidImportance: { HIGH: 6 },
}));

import type { registerForPushNotificationsAsync as RegisterFn, unregisterPushNotifications as UnregisterFn } from '../pushNotifications';

let registerForPushNotificationsAsync: typeof RegisterFn;
let unregisterPushNotifications: typeof UnregisterFn;

beforeEach(() => {
  jest.clearAllMocks();
  // lastRegisteredToken vit dans le module — on le repart à zéro à chaque
  // test (comme une vraie installation au démarrage) plutôt que de laisser
  // fuiter l'état d'un test "register" vers le suivant.
  jest.resetModules();
  ({ registerForPushNotificationsAsync, unregisterPushNotifications } = require('../pushNotifications'));
  mockIsDevice.value = true;
  mockProjectId = 'eas-project-123';
  mockPlatformOS = 'ios';
  mockGetPermissionsAsync.mockResolvedValue({ status: 'granted' });
  mockRequestPermissionsAsync.mockResolvedValue({ status: 'granted' });
  mockSetNotificationChannelAsync.mockResolvedValue(null);
  mockGetExpoPushTokenAsync.mockResolvedValue({ type: 'expo', data: 'ExponentPushToken[abc]' });
  mockApiPost.mockResolvedValue({ ok: true });
});

describe('registerForPushNotificationsAsync', () => {
  test('does nothing on a simulator/emulator (no real push token there)', async () => {
    mockIsDevice.value = false;
    await registerForPushNotificationsAsync();
    expect(mockGetPermissionsAsync).not.toHaveBeenCalled();
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  test('requests permission when not already granted, and stops if it is refused', async () => {
    mockGetPermissionsAsync.mockResolvedValueOnce({ status: 'undetermined' });
    mockRequestPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
    await registerForPushNotificationsAsync();
    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(mockGetExpoPushTokenAsync).not.toHaveBeenCalled();
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  test('does not prompt again when permission is already granted', async () => {
    await registerForPushNotificationsAsync();
    expect(mockRequestPermissionsAsync).not.toHaveBeenCalled();
  });

  test('stops without fetching a token when no EAS project is configured yet', async () => {
    mockProjectId = undefined;
    await registerForPushNotificationsAsync();
    expect(mockGetExpoPushTokenAsync).not.toHaveBeenCalled();
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  test('sets up the Android notification channel only on Android', async () => {
    mockPlatformOS = 'android';
    await registerForPushNotificationsAsync();
    expect(mockSetNotificationChannelAsync).toHaveBeenCalledWith('default', expect.objectContaining({ importance: 6 }));

    mockSetNotificationChannelAsync.mockClear();
    mockPlatformOS = 'ios';
    await registerForPushNotificationsAsync();
    expect(mockSetNotificationChannelAsync).not.toHaveBeenCalled();
  });

  test('fetches an Expo push token scoped to the EAS project and registers it with the Worker', async () => {
    await registerForPushNotificationsAsync();
    expect(mockGetExpoPushTokenAsync).toHaveBeenCalledWith({ projectId: 'eas-project-123' });
    expect(mockApiPost).toHaveBeenCalledWith('/api/push/expo/register', {
      token: 'ExponentPushToken[abc]',
      platform: 'ios',
    });
  });

  test('never throws, even if the Worker call fails', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('network down'));
    await expect(registerForPushNotificationsAsync()).resolves.toBeUndefined();
  });
});

describe('unregisterPushNotifications', () => {
  test('does nothing if no token was registered this session', async () => {
    await unregisterPushNotifications();
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  test('removes the token this installation registered', async () => {
    await registerForPushNotificationsAsync();
    mockApiPost.mockClear();
    await unregisterPushNotifications();
    expect(mockApiPost).toHaveBeenCalledWith('/api/push/expo/unregister', { token: 'ExponentPushToken[abc]' });
  });

  test('only unregisters once even if called twice in a row', async () => {
    await registerForPushNotificationsAsync();
    mockApiPost.mockClear();
    await unregisterPushNotifications();
    await unregisterPushNotifications();
    expect(mockApiPost).toHaveBeenCalledTimes(1);
  });

  test('never throws, even if the Worker call fails', async () => {
    await registerForPushNotificationsAsync();
    mockApiPost.mockRejectedValueOnce(new Error('network down'));
    await expect(unregisterPushNotifications()).resolves.toBeUndefined();
  });
});
