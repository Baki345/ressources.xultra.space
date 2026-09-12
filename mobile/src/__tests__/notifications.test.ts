const mockListDocuments = jest.fn();
const mockUpdateDocument = jest.fn();
const mockDeleteDocument = jest.fn();

jest.mock('../appwrite', () => ({
  APPWRITE_DATABASE_ID: 'xultra',
  databases: {
    listDocuments: (...args: unknown[]) => mockListDocuments(...args),
    updateDocument: (...args: unknown[]) => mockUpdateDocument(...args),
    deleteDocument: (...args: unknown[]) => mockDeleteDocument(...args),
  },
}));

import { clearAllNotifications, deleteNotification, loadNotifications, markAllRead, type NotificationDoc } from '../notifications';

beforeEach(() => {
  jest.clearAllMocks();
  mockUpdateDocument.mockResolvedValue({});
  mockDeleteDocument.mockResolvedValue({});
});

describe('loadNotifications', () => {
  test('excludes friend_request entries — those live in FriendsScreen instead', async () => {
    mockListDocuments.mockResolvedValueOnce({
      documents: [
        { $id: 'n1', uid: 'me1', type: 'friend_request', fromUid: 'u2', fromName: 'Bob', text: '...', read: false, $createdAt: '2026-01-01T00:00:00.000Z' },
        { $id: 'n2', uid: 'me1', type: 'friend_accepted', fromUid: 'u2', fromName: 'Bob', text: 'Bob a accepté', read: false, $createdAt: '2026-01-01T00:00:00.000Z' },
      ],
    });
    const notifs = await loadNotifications('me1');
    expect(notifs.map((n) => n.$id)).toEqual(['n2']);
  });
});

describe('markAllRead', () => {
  test('only updates the ones that are actually unread', async () => {
    const notifs: NotificationDoc[] = [
      { $id: 'n1', uid: 'me1', type: 'friend_accepted', fromUid: 'u2', fromName: 'Bob', text: '', read: false, $createdAt: '2026-01-01T00:00:00.000Z' },
      { $id: 'n2', uid: 'me1', type: 'friend_accepted', fromUid: 'u3', fromName: 'Carol', text: '', read: true, $createdAt: '2026-01-01T00:00:00.000Z' },
    ];
    await markAllRead(notifs);
    expect(mockUpdateDocument).toHaveBeenCalledTimes(1);
    expect(mockUpdateDocument).toHaveBeenCalledWith('xultra', 'notifications', 'n1', { read: true });
  });
});

describe('deleteNotification / clearAllNotifications', () => {
  test('deleteNotification removes exactly one document', async () => {
    await deleteNotification('n1');
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'notifications', 'n1');
  });

  test('clearAllNotifications removes every given document', async () => {
    const notifs: NotificationDoc[] = [
      { $id: 'n1', uid: 'me1', type: 'friend_accepted', fromUid: '', fromName: '', text: '', read: true, $createdAt: '2026-01-01T00:00:00.000Z' },
      { $id: 'n2', uid: 'me1', type: 'badge_granted', fromUid: '', fromName: '', text: '', read: true, $createdAt: '2026-01-01T00:00:00.000Z' },
    ];
    await clearAllNotifications(notifs);
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'notifications', 'n1');
    expect(mockDeleteDocument).toHaveBeenCalledWith('xultra', 'notifications', 'n2');
  });
});
