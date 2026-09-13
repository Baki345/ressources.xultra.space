const mockListDocuments = jest.fn();
const mockUpdateDocument = jest.fn();
const mockDeleteDocument = jest.fn();
const mockApiPost = jest.fn();

jest.mock('../appwrite', () => ({
  APPWRITE_DATABASE_ID: 'xultra',
  databases: {
    listDocuments: (...args: unknown[]) => mockListDocuments(...args),
    updateDocument: (...args: unknown[]) => mockUpdateDocument(...args),
    deleteDocument: (...args: unknown[]) => mockDeleteDocument(...args),
  },
}));
jest.mock('../api', () => ({ apiPost: (...args: unknown[]) => mockApiPost(...args) }));

import { fetchVoiceToken, joinVoicePresence, leaveVoicePresence, loadVoicePresence, sendVoiceHeartbeat, type VoicePresence } from '../voice';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchVoiceToken', () => {
  test('posts to the Worker voice-token route and returns the LiveKit connection info', async () => {
    const token = { token: 'jwt', wsUrl: 'wss://voice.xultra.space', room: 'xu-channel-c1', canPublish: true, audioQualityKey: 'standard' };
    mockApiPost.mockResolvedValueOnce(token);

    const result = await fetchVoiceToken('s1', 'c1');

    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/voice-token', { serverId: 's1', channelId: 'c1' });
    expect(result).toEqual(token);
  });
});

describe('joinVoicePresence', () => {
  test('posts to the Worker join route and returns the presence doc id', async () => {
    mockApiPost.mockResolvedValueOnce({ docId: 'vp_abc' });

    const result = await joinVoicePresence('s1', 'c1');

    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/channels/voice-presence/join', { serverId: 's1', channelId: 'c1' });
    expect(result).toEqual({ docId: 'vp_abc' });
  });
});

describe('loadVoicePresence', () => {
  test('filters out presences not refreshed in the last 2 minutes', async () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    const fresh: VoicePresence = {
      $id: 'vp1', serverId: 's1', channelId: 'c1', uid: 'u1', username: 'Alice',
      cameraOn: false, speaking: false, handRaised: false, $updatedAt: new Date(now - 1000).toISOString(),
    };
    const stale: VoicePresence = {
      $id: 'vp2', serverId: 's1', channelId: 'c1', uid: 'u2', username: 'Bob',
      cameraOn: false, speaking: false, handRaised: false, $updatedAt: new Date(now - 121000).toISOString(),
    };
    mockListDocuments.mockResolvedValueOnce({ documents: [fresh, stale] });

    const result = await loadVoicePresence('c1');

    expect(mockListDocuments).toHaveBeenCalledWith('xultra', 'server_voice_presence', expect.any(Array));
    expect(result.map((p) => p.$id)).toEqual(['vp1']);
  });
});

describe('sendVoiceHeartbeat', () => {
  test('touches the username field on my presence doc to refresh $updatedAt', async () => {
    mockUpdateDocument.mockResolvedValueOnce({});
    await sendVoiceHeartbeat('vp_abc', 'Alice');
    expect(mockUpdateDocument).toHaveBeenCalledWith('xultra', 'server_voice_presence', 'vp_abc', { username: 'Alice' });
  });
});

describe('leaveVoicePresence', () => {
  test('deletes my presence doc', async () => {
    mockDeleteDocument.mockResolvedValueOnce({});
    await leaveVoicePresence('vp_abc');
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'server_voice_presence', 'vp_abc');
  });
});
