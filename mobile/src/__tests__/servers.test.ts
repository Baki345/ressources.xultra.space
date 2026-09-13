const mockListDocuments = jest.fn();
const mockGetDocument = jest.fn();
const mockApiPost = jest.fn();

jest.mock('../appwrite', () => ({
  APPWRITE_DATABASE_ID: 'xultra',
  databases: {
    listDocuments: (...args: unknown[]) => mockListDocuments(...args),
    getDocument: (...args: unknown[]) => mockGetDocument(...args),
  },
}));
jest.mock('../api', () => ({ apiPost: (...args: unknown[]) => mockApiPost(...args) }));

import {
  createForumPost,
  loadChannelMessages,
  loadForumPosts,
  loadMyServers,
  loadServerChannels,
  sendChannelText,
  type Server,
  type ServerChannel,
  type ServerChannelMessage,
  type ServerThread,
} from '../servers';

const ME = 'u1';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('loadMyServers', () => {
  test('resolves each membership to its server document', async () => {
    mockListDocuments.mockResolvedValueOnce({
      documents: [{ serverId: 's1' }, { serverId: 's2' }],
    });
    mockGetDocument.mockImplementation((_db: string, _collection: string, id: string) =>
      Promise.resolve({ $id: id, name: `Serveur ${id}`, ownerId: ME } as Server),
    );

    const servers = await loadMyServers(ME);

    expect(mockListDocuments).toHaveBeenCalledWith('xultra', 'server_members', expect.any(Array));
    expect(servers).toHaveLength(2);
    expect(servers.map((s) => s.$id)).toEqual(['s1', 's2']);
  });

  test('skips a membership whose server document is gone, without failing the whole list', async () => {
    mockListDocuments.mockResolvedValueOnce({
      documents: [{ serverId: 's1' }, { serverId: 'deleted' }, { serverId: 's3' }],
    });
    mockGetDocument.mockImplementation((_db: string, _collection: string, id: string) => {
      if (id === 'deleted') return Promise.reject(new Error('not found'));
      return Promise.resolve({ $id: id, name: `Serveur ${id}`, ownerId: ME } as Server);
    });

    const servers = await loadMyServers(ME);

    expect(servers.map((s) => s.$id)).toEqual(['s1', 's3']);
  });
});

describe('loadServerChannels', () => {
  test('keeps every known channel type, sorted by position', async () => {
    const channels: ServerChannel[] = [
      { $id: 'c1', serverId: 's1', name: 'annonces', type: 'announcement', position: 2 },
      { $id: 'c2', serverId: 's1', name: 'général', type: 'text', position: 0 },
      { $id: 'c3', serverId: 's1', name: 'vocal', type: 'voice', position: 1 },
      { $id: 'c4', serverId: 's1', name: 'aide', type: 'forum', position: 3 },
      { $id: 'c5', serverId: 's1', name: 'off-topic', type: 'text', position: 1 },
      { $id: 'c6', serverId: 's1', name: 'scène', type: 'stage', position: 4 },
    ];
    mockApiPost.mockResolvedValueOnce({ channels });

    const result = await loadServerChannels('s1');

    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/channels/list', { serverId: 's1' });
    expect(result.map((c: ServerChannel) => c.$id)).toEqual(['c2', 'c3', 'c5', 'c1', 'c4', 'c6']);
  });
});

describe('loadChannelMessages', () => {
  test('reverses the oldest-first Worker response back to newest-first, matching the DM/inverted-FlatList convention', async () => {
    const messages: ServerChannelMessage[] = [
      { $id: 'm1', channelId: 'c1', serverId: 's1', uid: ME, username: 'Moi', text: 'premier', $createdAt: '2026-01-01T00:00:00.000Z' },
      { $id: 'm2', channelId: 'c1', serverId: 's1', uid: ME, username: 'Moi', text: 'deuxième', $createdAt: '2026-01-01T00:01:00.000Z' },
      { $id: 'm3', channelId: 'c1', serverId: 's1', uid: ME, username: 'Moi', text: 'dernier', $createdAt: '2026-01-01T00:02:00.000Z' },
    ];
    mockApiPost.mockResolvedValueOnce({ messages });

    const result = await loadChannelMessages('s1', 'c1');

    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/channels/messages/list', {
      serverId: 's1',
      channelId: 'c1',
      threadId: '',
    });
    expect(result.map((m) => m.$id)).toEqual(['m3', 'm2', 'm1']);
  });

  test('passes a threadId through, to read a single forum post', async () => {
    mockApiPost.mockResolvedValueOnce({ messages: [] });

    await loadChannelMessages('s1', 'c1', 't1');

    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/channels/messages/list', {
      serverId: 's1',
      channelId: 'c1',
      threadId: 't1',
    });
  });
});

describe('sendChannelText', () => {
  test('posts to the Worker send route with no direct write and no encryption fields', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });

    await sendChannelText('s1', 'c1', 'salut le salon');

    expect(mockApiPost).toHaveBeenCalledTimes(1);
    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/channels/messages/send', {
      serverId: 's1',
      channelId: 'c1',
      text: 'salut le salon',
      threadId: '',
    });
  });

  test('passes a threadId through, to reply inside an existing forum post', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });

    await sendChannelText('s1', 'c1', 'je suis d\'accord', 't1');

    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/channels/messages/send', {
      serverId: 's1',
      channelId: 'c1',
      text: 'je suis d\'accord',
      threadId: 't1',
    });
  });
});

describe('loadForumPosts', () => {
  test('lists the posts (threads) of a forum channel', async () => {
    const threads: ServerThread[] = [
      { $id: 't1', serverId: 's1', channelId: 'c1', name: 'Bienvenue', creatorUid: ME, private: false, archived: false, originMessageId: 'm1', $createdAt: '2026-01-01T00:00:00.000Z' },
    ];
    mockApiPost.mockResolvedValueOnce({ threads });

    const result = await loadForumPosts('s1', 'c1');

    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/threads/list', { serverId: 's1', channelId: 'c1' });
    expect(result).toEqual(threads);
  });
});

describe('createForumPost', () => {
  test('publishes a new post and returns the created thread and its first message', async () => {
    const thread: ServerThread = { $id: 't1', serverId: 's1', channelId: 'c1', name: 'Titre', creatorUid: ME, private: false, archived: false, originMessageId: 'm1', $createdAt: '2026-01-01T00:00:00.000Z' };
    const message: ServerChannelMessage = { $id: 'm1', channelId: 'c1', serverId: 's1', uid: ME, username: 'Moi', text: 'Corps du post', threadId: 't1', $createdAt: '2026-01-01T00:00:00.000Z' };
    mockApiPost.mockResolvedValueOnce({ thread, message });

    const result = await createForumPost('s1', 'c1', 'Titre', 'Corps du post');

    expect(mockApiPost).toHaveBeenCalledWith('/api/servers/forum/post/create', {
      serverId: 's1',
      channelId: 'c1',
      title: 'Titre',
      text: 'Corps du post',
    });
    expect(result).toEqual({ thread, message });
  });
});
