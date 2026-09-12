import { generateKeyPair, invalidateE2EPeerCache } from '../e2e';

const mockListDocuments = jest.fn();
const mockApiPost = jest.fn();

jest.mock('../appwrite', () => ({
  APPWRITE_DATABASE_ID: 'xultra',
  databases: { listDocuments: (...args: unknown[]) => mockListDocuments(...args) },
}));
jest.mock('../api', () => ({ apiPost: (...args: unknown[]) => mockApiPost(...args) }));

import { decryptDmMessageText, dmIsGroup, dmPeerId, loadDms, sendDmText, type DmMessage, type DmThread } from '../dms';

const ME = 'u1';
const PEER = 'u2';
const alice = generateKeyPair();
const bob = generateKeyPair();

function dmThread(members: string[]): DmThread {
  return { $id: 'dm1', members, $updatedAt: '2026-01-01T00:00:00.000Z' };
}

beforeEach(() => {
  jest.clearAllMocks();
  invalidateE2EPeerCache(PEER);
  mockListDocuments.mockImplementation((_db: string, collection: string) => {
    if (collection === 'e2e_keys') return Promise.resolve({ documents: [{ uid: PEER, pubKey: bob.pubKeyB64 }] });
    return Promise.resolve({ documents: [] });
  });
});

describe('dmIsGroup / dmPeerId', () => {
  test('a 2-member thread is not a group, and the peer is whichever member is not me', () => {
    const dm = dmThread([ME, PEER]);
    expect(dmIsGroup(dm)).toBe(false);
    expect(dmPeerId(dm, ME)).toBe(PEER);
  });

  test('a 3+ member thread is a group', () => {
    expect(dmIsGroup(dmThread([ME, PEER, 'u3']))).toBe(true);
  });
});

describe('loadDms', () => {
  test('keeps only threads I am a member of, even if the server returns others', async () => {
    mockListDocuments.mockImplementation((_db: string, collection: string) => {
      if (collection === 'dms') {
        return Promise.resolve({
          documents: [dmThread([ME, PEER]), dmThread(['u3', 'u4'])],
        });
      }
      return Promise.resolve({ documents: [] });
    });
    const threads = await loadDms(ME);
    expect(threads).toHaveLength(1);
    expect(threads[0].members).toContain(ME);
  });
});

describe('decryptDmMessageText', () => {
  test('returns plaintext unchanged for a message that was never encrypted', async () => {
    const dm = dmThread([ME, PEER]);
    const msg: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: PEER, displayName: 'Bob', type: 'text',
      text: 'hello', mediaUrl: '', enc: false, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    expect(await decryptDmMessageText(ME, alice.jwk, dm, msg)).toBe('hello');
  });

  test('falls back to the "unreadable" placeholder when there is no local private key', async () => {
    const dm = dmThread([ME, PEER]);
    const msg: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: PEER, displayName: 'Bob', type: 'text',
      text: 'garbage', mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    expect(await decryptDmMessageText(ME, null, dm, msg)).toBe('🔒 Message illisible sur cet appareil');
  });

  test('falls back to the placeholder for a group thread (group E2E not ported yet)', async () => {
    const dm = dmThread([ME, PEER, 'u3']);
    const msg: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: PEER, displayName: 'Bob', type: 'text',
      text: 'garbage', mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    expect(await decryptDmMessageText(ME, alice.jwk, dm, msg)).toBe('🔒 Message illisible sur cet appareil');
  });
});

describe('sendDmText', () => {
  test('encrypts the message with the pairwise session key and posts it via the Worker API', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });
    const dm = dmThread([ME, PEER]);
    await sendDmText(ME, alice.jwk, 'Alice', dm, 'Salut !');

    expect(mockApiPost).toHaveBeenCalledTimes(1);
    const [path, body] = mockApiPost.mock.calls[0];
    expect(path).toBe('/api/dms/messages/send');
    expect(body).toMatchObject({ threadId: 'dm1', displayName: 'Alice', type: 'text', enc: true });
    expect(body.text).toMatch(/^[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+$/);
    expect(body.text).not.toBe('Salut !');

    // Bob decrypts it with his own key and gets the original text back.
    const dmFromBobSide: DmThread = dmThread([PEER, ME]);
    const messageAsStoredForBob: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: ME, displayName: 'Alice', type: 'text',
      text: body.text, mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    invalidateE2EPeerCache(ME);
    mockListDocuments.mockImplementation((_db: string, collection: string) => {
      if (collection === 'e2e_keys') return Promise.resolve({ documents: [{ uid: ME, pubKey: alice.pubKeyB64 }] });
      return Promise.resolve({ documents: [] });
    });
    const decrypted = await decryptDmMessageText(PEER, bob.jwk, dmFromBobSide, messageAsStoredForBob);
    expect(decrypted).toBe('Salut !');
  });

  test('refuses to send into a group thread (not yet ported)', async () => {
    const dm = dmThread([ME, PEER, 'u3']);
    await expect(sendDmText(ME, alice.jwk, 'Alice', dm, 'Salut !')).rejects.toThrow();
    expect(mockApiPost).not.toHaveBeenCalled();
  });
});
