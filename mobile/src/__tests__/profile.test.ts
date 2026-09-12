const mockListDocuments = jest.fn();
const mockGetDocument = jest.fn();

jest.mock('../appwrite', () => ({
  APPWRITE_DATABASE_ID: 'xultra',
  databases: {
    listDocuments: (...args: unknown[]) => mockListDocuments(...args),
    getDocument: (...args: unknown[]) => mockGetDocument(...args),
  },
}));

import { getProfileDetails, presenceDotColor, presenceLabel } from '../profile';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getProfileDetails', () => {
  test('returns null when the user document does not exist', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] });
    expect(await getProfileDetails('ghost')).toBeNull();
  });

  test('merges the users doc and user_meta doc, always including the implicit base badge', async () => {
    mockListDocuments.mockResolvedValueOnce({
      documents: [{
        authUserId: 'u2', username: 'shaman', displayName: 'Shaman', tag: '7777', bio: 'Hello',
        '$createdAt': '2026-03-24T00:00:00.000Z', statusManual: 'online', lastSeen: new Date().toISOString(),
      }],
    });
    mockGetDocument.mockResolvedValueOnce({ plan: 'plus', badgesJson: JSON.stringify(['dev', 'early']) });

    const p = await getProfileDetails('u2');
    expect(p).not.toBeNull();
    expect(p!.displayName).toBe('Shaman');
    expect(p!.tag).toBe('7777');
    expect(p!.plan).toBe('plus');
    expect(p!.badges).toEqual(expect.arrayContaining(['base', 'dev', 'early']));
    expect(p!.presence).toBe('online');
  });

  test('a missing user_meta document (never customized) still resolves with the base badge only', async () => {
    mockListDocuments.mockResolvedValueOnce({
      documents: [{ authUserId: 'u3', username: 'newbie', '$createdAt': '2026-01-01T00:00:00.000Z' }],
    });
    mockGetDocument.mockRejectedValueOnce(new Error('not found'));

    const p = await getProfileDetails('u3');
    expect(p).not.toBeNull();
    expect(p!.badges).toEqual(['base']);
    expect(p!.plan).toBeUndefined();
  });

  test('presence falls back to offline once lastSeen is stale, regardless of the manual status', async () => {
    mockListDocuments.mockResolvedValueOnce({
      documents: [{
        authUserId: 'u4', username: 'ghosted', statusManual: 'online',
        lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      }],
    });
    mockGetDocument.mockResolvedValueOnce({});

    const p = await getProfileDetails('u4');
    expect(p!.presence).toBe('offline');
  });

  test('an "invisible" manual status always reads as offline, even with a fresh lastSeen', async () => {
    mockListDocuments.mockResolvedValueOnce({
      documents: [{ authUserId: 'u5', username: 'hiding', statusManual: 'invisible', lastSeen: new Date().toISOString() }],
    });
    mockGetDocument.mockResolvedValueOnce({});

    const p = await getProfileDetails('u5');
    expect(p!.presence).toBe('offline');
  });
});

describe('presence label/color mapping', () => {
  test('every presence state has a distinct label and dot color', () => {
    const states = ['online', 'idle', 'dnd', 'offline'] as const;
    const labels = states.map(presenceLabel);
    const colors = states.map(presenceDotColor);
    expect(new Set(labels).size).toBe(4);
    expect(new Set(colors).size).toBe(4);
    expect(presenceLabel('offline')).toBe('Hors ligne');
  });
});
