const mockApiPost = jest.fn();

jest.mock('../api', () => ({ apiPost: (...args: unknown[]) => mockApiPost(...args) }));

import {
  addStageSpeaker,
  cancelSpeakRequest,
  declineSpeakRequest,
  fetchStageState,
  removeStageSpeaker,
  requestToSpeak,
  setStageTopic,
} from '../stage';

beforeEach(() => {
  jest.clearAllMocks();
});

test('fetchStageState posts to the Worker state route and returns it as-is', async () => {
  const state = { topic: 'AMA', speakers: [], requests: [], isMod: false, amSpeaker: false, myRequestPending: false };
  mockApiPost.mockResolvedValueOnce(state);
  const result = await fetchStageState('s1', 'c1');
  expect(mockApiPost).toHaveBeenCalledWith('/api/servers/stage/state', { serverId: 's1', channelId: 'c1' });
  expect(result).toEqual(state);
});

test('requestToSpeak posts to the request-speak route', async () => {
  mockApiPost.mockResolvedValueOnce({ ok: true });
  await requestToSpeak('s1', 'c1');
  expect(mockApiPost).toHaveBeenCalledWith('/api/servers/stage/request-speak', { serverId: 's1', channelId: 'c1' });
});

test('cancelSpeakRequest posts to the cancel-request route', async () => {
  mockApiPost.mockResolvedValueOnce({ ok: true });
  await cancelSpeakRequest('s1', 'c1');
  expect(mockApiPost).toHaveBeenCalledWith('/api/servers/stage/cancel-request', { serverId: 's1', channelId: 'c1' });
});

test('declineSpeakRequest posts the target uid to the decline-request route', async () => {
  mockApiPost.mockResolvedValueOnce({ ok: true });
  await declineSpeakRequest('s1', 'c1', 'u2');
  expect(mockApiPost).toHaveBeenCalledWith('/api/servers/stage/decline-request', { serverId: 's1', channelId: 'c1', uid: 'u2' });
});

test('addStageSpeaker posts the target uid to the add-speaker route', async () => {
  mockApiPost.mockResolvedValueOnce({ ok: true });
  await addStageSpeaker('s1', 'c1', 'u2');
  expect(mockApiPost).toHaveBeenCalledWith('/api/servers/stage/add-speaker', { serverId: 's1', channelId: 'c1', uid: 'u2' });
});

describe('removeStageSpeaker', () => {
  test('sends an empty uid to remove myself when none is given', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });
    await removeStageSpeaker('s1', 'c1');
    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/stage/remove-speaker', { serverId: 's1', channelId: 'c1', uid: '' });
  });

  test('sends the target uid when removing someone else (moderation)', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });
    await removeStageSpeaker('s1', 'c1', 'u2');
    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/stage/remove-speaker', { serverId: 's1', channelId: 'c1', uid: 'u2' });
  });
});

test('setStageTopic posts the new topic and returns it', async () => {
  mockApiPost.mockResolvedValueOnce({ topic: 'Nouveau sujet' });
  const topic = await setStageTopic('s1', 'c1', 'Nouveau sujet');
  expect(mockApiPost).toHaveBeenCalledWith('/api/servers/stage/set-topic', { serverId: 's1', channelId: 'c1', topic: 'Nouveau sujet' });
  expect(topic).toBe('Nouveau sujet');
});
