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
const THIRD = 'u3';
const alice = generateKeyPair();
const bob = generateKeyPair();
const carol = generateKeyPair();
const PUBKEYS: Record<string, string> = { [ME]: alice.pubKeyB64, [PEER]: bob.pubKeyB64, [THIRD]: carol.pubKeyB64 };

function dmThread(members: string[]): DmThread {
  return { $id: 'dm1', members, $updatedAt: '2026-01-01T00:00:00.000Z' };
}

// Une fausse collection e2e_keys qui répond pour N'IMPORTE quel uid connu de
// PUBKEYS (nécessaire pour un groupe : sendDmText doit chercher la clé
// publique de CHAQUE membre, pas d'un seul correspondant fixe).
function mockE2eKeysLookup() {
  mockListDocuments.mockImplementation((_db: string, collection: string, queries: string[]) => {
    if (collection === 'e2e_keys') {
      const parsed = (queries || []).map((q) => {
        try {
          return JSON.parse(q);
        } catch {
          return null;
        }
      });
      const equalUid = parsed.find((q) => q?.method === 'equal' && q?.attribute === 'uid');
      const uid = equalUid?.values?.[0];
      const pubKey = uid ? PUBKEYS[uid] : undefined;
      return Promise.resolve({ documents: pubKey ? [{ uid, pubKey }] : [] });
    }
    return Promise.resolve({ documents: [] });
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  invalidateE2EPeerCache(PEER);
  invalidateE2EPeerCache(ME);
  invalidateE2EPeerCache(THIRD);
  mockE2eKeysLookup();
});

describe('dmIsGroup / dmPeerId', () => {
  test('a 2-member thread is not a group, and the peer is whichever member is not me', () => {
    const dm = dmThread([ME, PEER]);
    expect(dmIsGroup(dm)).toBe(false);
    expect(dmPeerId(dm, ME)).toBe(PEER);
  });

  test('a 3+ member thread is a group', () => {
    expect(dmIsGroup(dmThread([ME, PEER, THIRD]))).toBe(true);
  });
});

describe('loadDms', () => {
  test('keeps only threads I am a member of, even if the server returns others', async () => {
    mockListDocuments.mockImplementation((_db: string, collection: string) => {
      if (collection === 'dms') {
        return Promise.resolve({
          documents: [dmThread([ME, PEER]), dmThread(['u4', 'u5'])],
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
    const msg: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: PEER, displayName: 'Bob', type: 'text',
      text: 'hello', mediaUrl: '', enc: false, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    expect(await decryptDmMessageText(ME, alice.jwk, msg)).toBe('hello');
  });

  test('falls back to the "unreadable" placeholder when there is no local private key', async () => {
    const msg: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: PEER, displayName: 'Bob', type: 'text',
      text: 'garbage', mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    expect(await decryptDmMessageText(ME, null, msg)).toBe('🔒 Message illisible sur cet appareil');
  });

  test('falls back to the placeholder when my share of a group message is missing from keysJson', async () => {
    const msg: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: PEER, displayName: 'Bob', type: 'text',
      text: 'garbage', mediaUrl: '', enc: true, keysJson: JSON.stringify({ [THIRD]: 'not-for-me' }),
      $createdAt: '2026-01-01T00:00:00.000Z',
    };
    expect(await decryptDmMessageText(ME, alice.jwk, msg)).toBe('🔒 Message illisible sur cet appareil');
  });
});

describe('sendDmText — DM 1:1', () => {
  test('encrypts the message with the pairwise session key and posts it via the Worker API', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });
    const dm = dmThread([ME, PEER]);
    await sendDmText(ME, alice.jwk, 'Alice', dm, 'Salut !');

    expect(mockApiPost).toHaveBeenCalledTimes(1);
    const [path, body] = mockApiPost.mock.calls[0];
    expect(path).toBe('/api/dms/messages/send');
    expect(body).toMatchObject({ threadId: 'dm1', displayName: 'Alice', type: 'text', enc: true, keysJson: '' });
    expect(body.text).toMatch(/^[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+$/);
    expect(body.text).not.toBe('Salut !');

    // Bob decrypts it with his own key and gets the original text back.
    const messageAsStoredForBob: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: ME, displayName: 'Alice', type: 'text',
      text: body.text, mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    const decrypted = await decryptDmMessageText(PEER, bob.jwk, messageAsStoredForBob);
    expect(decrypted).toBe('Salut !');
  });
});

describe('sendDmText — DM de groupe', () => {
  test('wraps a fresh message key per member and never sends the plaintext key or text', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });
    const dm = dmThread([ME, PEER, THIRD]);
    await sendDmText(ME, alice.jwk, 'Alice', dm, 'Salut le groupe !');

    const [, body] = mockApiPost.mock.calls[0];
    expect(body.enc).toBe(true);
    expect(body.text).not.toBe('Salut le groupe !');

    const keysObj = JSON.parse(body.keysJson);
    expect(Object.keys(keysObj).sort()).toEqual([PEER, THIRD].sort());
    // The sender never wraps a key for themselves — they already hold it in memory.
    expect(keysObj[ME]).toBeUndefined();
  });

  test('every recipient can independently decrypt the same group message', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });
    const dm = dmThread([ME, PEER, THIRD]);
    await sendDmText(ME, alice.jwk, 'Alice', dm, 'Salut le groupe !');
    const [, body] = mockApiPost.mock.calls[0];

    const storedMessage: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: ME, displayName: 'Alice', type: 'text',
      text: body.text, mediaUrl: '', enc: true, keysJson: body.keysJson, $createdAt: '2026-01-01T00:00:00.000Z',
    };

    expect(await decryptDmMessageText(PEER, bob.jwk, storedMessage)).toBe('Salut le groupe !');
    expect(await decryptDmMessageText(THIRD, carol.jwk, storedMessage)).toBe('Salut le groupe !');
  });

  test('a stranger not in keysJson cannot decrypt the message', async () => {
    mockApiPost.mockResolvedValueOnce({ ok: true });
    const dm = dmThread([ME, PEER, THIRD]);
    await sendDmText(ME, alice.jwk, 'Alice', dm, 'Salut le groupe !');
    const [, body] = mockApiPost.mock.calls[0];

    const stranger = generateKeyPair();
    const storedMessage: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: ME, displayName: 'Alice', type: 'text',
      text: body.text, mediaUrl: '', enc: true, keysJson: body.keysJson, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    expect(await decryptDmMessageText('stranger', stranger.jwk, storedMessage)).toBe('🔒 Message illisible sur cet appareil');
  });
});
