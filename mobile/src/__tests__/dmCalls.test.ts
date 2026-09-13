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

import {
  fetchGroupCallToken,
  joinGroupCallPresence,
  leaveGroupCallPresence,
  loadGroupCallPresence,
  sendGroupCallHeartbeat,
  type GroupCallPresence,
} from '../dmCalls';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchGroupCallToken', () => {
  test('posts to the Worker group-token route and returns the LiveKit connection info', async () => {
    const token = { token: 'jwt', wsUrl: 'wss://voice.xultra.space', room: 'xu-dm-d1' };
    mockApiPost.mockResolvedValueOnce(token);
    const result = await fetchGroupCallToken('d1');
    expect(mockApiPost).toHaveBeenCalledWith('/api/call/group-token', { dmId: 'd1' });
    expect(result).toEqual(token);
  });
});

describe('joinGroupCallPresence', () => {
  test('posts to the Worker join route and returns the presence doc id', async () => {
    mockApiPost.mockResolvedValueOnce({ docId: 'gcp_abc' });
    const result = await joinGroupCallPresence('d1');
    expect(mockApiPost).toHaveBeenCalledWith('/api/call/group-presence/join', { dmId: 'd1' });
    expect(result).toEqual({ docId: 'gcp_abc' });
  });
});

describe('loadGroupCallPresence', () => {
  test('filters out presences not refreshed in the last 2 minutes', async () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    const fresh: GroupCallPresence = { $id: 'gcp1', dmId: 'd1', uid: 'u1', username: 'Alice', $updatedAt: new Date(now - 1000).toISOString() };
    const stale: GroupCallPresence = { $id: 'gcp2', dmId: 'd1', uid: 'u2', username: 'Bob', $updatedAt: new Date(now - 121000).toISOString() };
    mockListDocuments.mockResolvedValueOnce({ documents: [fresh, stale] });

    const result = await loadGroupCallPresence('d1');

    expect(mockListDocuments).toHaveBeenCalledWith('xultra', 'group_call_presence', expect.any(Array));
    expect(result.map((p) => p.$id)).toEqual(['gcp1']);
  });
});

describe('sendGroupCallHeartbeat', () => {
  test('touches the username field on my presence doc', async () => {
    mockUpdateDocument.mockResolvedValueOnce({});
    await sendGroupCallHeartbeat('gcp_abc', 'Alice');
    expect(mockUpdateDocument).toHaveBeenCalledWith('xultra', 'group_call_presence', 'gcp_abc', { username: 'Alice' });
  });
});

describe('leaveGroupCallPresence', () => {
  test('deletes my presence doc', async () => {
    mockDeleteDocument.mockResolvedValueOnce({});
    await leaveGroupCallPresence('gcp_abc');
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'group_call_presence', 'gcp_abc');
  });
});
