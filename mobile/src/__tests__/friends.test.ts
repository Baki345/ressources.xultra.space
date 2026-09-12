const mockListDocuments = jest.fn();
const mockCreateDocument = jest.fn();
const mockUpdateDocument = jest.fn();
const mockDeleteDocument = jest.fn();
const mockApiPost = jest.fn();

jest.mock('../appwrite', () => ({
  APPWRITE_DATABASE_ID: 'xultra',
  databases: {
    listDocuments: (...args: unknown[]) => mockListDocuments(...args),
    createDocument: (...args: unknown[]) => mockCreateDocument(...args),
    updateDocument: (...args: unknown[]) => mockUpdateDocument(...args),
    deleteDocument: (...args: unknown[]) => mockDeleteDocument(...args),
  },
}));
jest.mock('../api', () => ({ apiPost: (...args: unknown[]) => mockApiPost(...args) }));

import {
  acceptFriendRequest,
  blockUser,
  loadFriends,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  sendFriendRequest,
  unblockUser,
  type FriendRelation,
} from '../friends';

const ME = 'me1';
const OTHER = 'other1';

beforeEach(() => {
  jest.clearAllMocks();
  mockApiPost.mockResolvedValue({ ok: true });
  mockCreateDocument.mockResolvedValue({ $id: 'new' });
  mockUpdateDocument.mockResolvedValue({});
  mockDeleteDocument.mockResolvedValue({});
});

describe('loadFriends', () => {
  test('lists my relations', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [{ $id: 'f1', userId: ME, friendId: OTHER, status: 'accepted' }] });
    const rels = await loadFriends(ME);
    expect(rels).toHaveLength(1);
    expect(mockListDocuments).toHaveBeenCalledWith('xultra', 'ultravoc_friends', expect.any(Array));
  });
});

describe('searchUsers', () => {
  test('returns nothing for a query shorter than 2 characters', async () => {
    expect(await searchUsers('a', ME)).toEqual([]);
    expect(mockListDocuments).not.toHaveBeenCalled();
  });

  test('matches by username or displayName, excludes myself, caps at 10', async () => {
    mockListDocuments.mockResolvedValueOnce({
      documents: [
        { authUserId: ME, username: 'shaman', displayName: 'Shaman' },
        { authUserId: 'u2', username: 'shaman2', displayName: 'Someone' },
        { authUserId: 'u3', username: 'bob', displayName: 'Shamanic Bob' },
        { authUserId: 'u4', username: 'carol', displayName: 'Carol' },
      ],
    });
    const results = await searchUsers('sham', ME);
    expect(results.map((r) => r.authUserId).sort()).toEqual(['u2', 'u3']);
  });
});

describe('sendFriendRequest', () => {
  test('creates a pending_out (mine) and pending_in (theirs) relation, then notifies', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] }); // loadFriends: no existing relation
    mockCreateDocument.mockResolvedValue({ $id: 'new' });

    const result = await sendFriendRequest(ME, 'Me', OTHER, 'Other');
    expect(result).toBe('sent');
    expect(mockCreateDocument).toHaveBeenCalledTimes(2);
    expect(mockCreateDocument.mock.calls[0][3]).toMatchObject({ userId: ME, friendId: OTHER, status: 'pending_out' });
    expect(mockCreateDocument.mock.calls[1][3]).toMatchObject({ userId: OTHER, friendId: ME, status: 'pending_in' });
    expect(mockApiPost).toHaveBeenCalledWith('/api/notifications/send', expect.objectContaining({ uid: OTHER, type: 'friend_request' }));
  });

  test('is a no-op (short-circuits) when already friends', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [{ $id: 'f1', userId: ME, friendId: OTHER, status: 'accepted' }] });
    const result = await sendFriendRequest(ME, 'Me', OTHER, 'Other');
    expect(result).toBe('already_friends');
    expect(mockCreateDocument).not.toHaveBeenCalled();
  });

  test('is a no-op when a request is already pending', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [{ $id: 'f1', userId: ME, friendId: OTHER, status: 'pending_out' }] });
    const result = await sendFriendRequest(ME, 'Me', OTHER, 'Other');
    expect(result).toBe('already_pending');
    expect(mockCreateDocument).not.toHaveBeenCalled();
  });

  test('accepts immediately when they had already sent me a request (mutual request race)', async () => {
    mockListDocuments
      .mockResolvedValueOnce({ documents: [{ $id: 'f1', userId: ME, friendId: OTHER, status: 'pending_in' }] }) // loadFriends inside sendFriendRequest
      .mockResolvedValueOnce({ documents: [] }); // their-side lookup inside acceptFriendRequest
    mockCreateDocument.mockResolvedValue({ $id: 'new' });

    const result = await sendFriendRequest(ME, 'Me', OTHER, 'Other');
    expect(result).toBe('accepted');
    expect(mockUpdateDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 'f1', { status: 'accepted' });
  });
});

describe('acceptFriendRequest', () => {
  test('accepts my copy and creates the missing accepted copy on their side', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] }); // their side: none exist yet
    await acceptFriendRequest(ME, 'Me', 'f1', OTHER);

    expect(mockUpdateDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 'f1', { status: 'accepted' });
    expect(mockCreateDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', expect.any(String), {
      userId: OTHER, friendId: ME, status: 'accepted', name: 'Me',
    });
    expect(mockApiPost).toHaveBeenCalledWith('/api/notifications/send', expect.objectContaining({ uid: OTHER, type: 'friend_accepted' }));
  });

  test('deduplicates when their side already has multiple stale rows', async () => {
    const theirDocs: FriendRelation[] = [
      { $id: 't1', userId: OTHER, friendId: ME, status: 'pending_out' },
      { $id: 't2', userId: OTHER, friendId: ME, status: 'pending_in' },
    ];
    mockListDocuments.mockResolvedValueOnce({ documents: theirDocs });
    await acceptFriendRequest(ME, 'Me', 'f1', OTHER);

    // Keeps the first row (t1), upgrades it to accepted, deletes the duplicate (t2).
    expect(mockUpdateDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 't1', { status: 'accepted' });
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 't2');
    expect(mockCreateDocument).not.toHaveBeenCalled();
  });
});

describe('rejectFriendRequest', () => {
  test('deletes my copy and their pending_out copy', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [{ $id: 't1' }] });
    await rejectFriendRequest(ME, 'f1', OTHER);
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 'f1');
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 't1');
  });
});

describe('removeFriend', () => {
  test('deletes both sides of an accepted friendship and notifies', async () => {
    mockListDocuments
      .mockResolvedValueOnce({ documents: [{ $id: 'f1', userId: ME, friendId: OTHER, status: 'accepted' }] })
      .mockResolvedValueOnce({ documents: [{ $id: 't1' }] });
    await removeFriend(ME, 'Me', OTHER);
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 'f1');
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 't1');
    expect(mockApiPost).toHaveBeenCalledWith('/api/notifications/send', expect.objectContaining({ uid: OTHER, type: 'friend_removed' }));
  });
});

describe('blockUser / unblockUser', () => {
  test('blockUser updates an existing relation to blocked', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [{ $id: 'f1', userId: ME, friendId: OTHER, status: 'accepted' }] });
    await blockUser(ME, OTHER);
    expect(mockUpdateDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 'f1', { status: 'blocked' });
  });

  test('blockUser creates a fresh blocked relation when none existed (e.g. blocking a stranger)', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [] });
    await blockUser(ME, OTHER);
    expect(mockCreateDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', expect.any(String), {
      userId: ME, friendId: OTHER, status: 'blocked', name: '—',
    });
  });

  test('unblockUser deletes the relation entirely, never guessing a restored status', async () => {
    mockListDocuments.mockResolvedValueOnce({ documents: [{ $id: 'f1', userId: ME, friendId: OTHER, status: 'blocked' }] });
    await unblockUser(ME, OTHER);
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'ultravoc_friends', 'f1');
  });
});
