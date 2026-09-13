import { bytesToB64, generateKeyPair, invalidateE2EPeerCache } from '../e2e';

const mockListDocuments = jest.fn();
const mockApiPost = jest.fn();
const mockCreateFile = jest.fn();
const mockGetFileViewURL = jest.fn();
const mockFileWrite = jest.fn();
const mockFileDelete = jest.fn();

jest.mock('../appwrite', () => ({
  APPWRITE_DATABASE_ID: 'xultra',
  APPWRITE_BUCKET_ID: 'ultravoc_media',
  databases: { listDocuments: (...args: unknown[]) => mockListDocuments(...args) },
  storage: {
    createFile: (...args: unknown[]) => mockCreateFile(...args),
    getFileViewURL: (...args: unknown[]) => mockGetFileViewURL(...args),
  },
}));
jest.mock('../api', () => ({ apiPost: (...args: unknown[]) => mockApiPost(...args) }));
// L'API File/Paths (expo-file-system, SDK 57) est utilisée pour écrire les
// octets chiffrés dans un fichier temporaire avant upload (le SDK Appwrite
// React Native lit par URI, jamais par Blob) — une fausse implémentation
// minimale suffit ici : write()/delete() enregistrent juste leurs appels.
jest.mock('expo-file-system', () => {
  class MockFile {
    uri: string;
    constructor(...parts: unknown[]) {
      this.uri = 'file:///mock-cache/' + parts.filter((p) => typeof p === 'string').join('/');
    }
    write(bytes: Uint8Array) {
      mockFileWrite(this.uri, bytes);
    }
    delete() {
      mockFileDelete(this.uri);
    }
  }
  return { File: MockFile, Paths: { cache: 'MOCK_CACHE_DIR' } };
});

import {
  decryptDmAttachmentToFile,
  decryptDmMessageForDisplay,
  decryptDmMessageText,
  dmIsGroup,
  dmPeerId,
  loadDms,
  sendDmAttachment,
  sendDmText,
  type DmMessage,
  type DmThread,
} from '../dms';

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

// Simule le fetch() de l'octet chiffré uploadé — reproduit exactement ce que
// le vrai bucket Appwrite renverrait pour l'URL renvoyée par getFileViewURL.
function mockFetchReturning(bytes: Uint8Array) {
  const copy = bytes.slice();
  (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
    arrayBuffer: async () => copy.buffer,
  });
}

describe('sendDmAttachment — DM 1:1', () => {
  test('encrypts the image bytes and caption with the pairwise key, uploads the ciphertext via a temp file, and the recipient decrypts both back', async () => {
    mockCreateFile.mockResolvedValueOnce({ $id: 'file1' });
    mockGetFileViewURL.mockReturnValueOnce('https://cdn.example/file1');
    mockApiPost.mockResolvedValueOnce({ ok: true });

    const dm = dmThread([ME, PEER]);
    const original = new TextEncoder().encode('donnees-image-de-test');
    await sendDmAttachment(ME, alice.jwk, 'Alice', dm, {
      kind: 'image', bytes: original, mime: 'image/png', caption: 'Regarde !',
    });

    expect(mockCreateFile).toHaveBeenCalledTimes(1);
    const uploadedFile = mockCreateFile.mock.calls[0][0].file;
    expect(uploadedFile.type).toBe('application/octet-stream');
    const [, ciphertext] = mockFileWrite.mock.calls.find(([uri]) => uri === uploadedFile.uri)!;
    expect(ciphertext).not.toEqual(original); // jamais les octets en clair sur le disque local
    expect(mockFileDelete).toHaveBeenCalledWith(uploadedFile.uri); // le fichier temporaire est nettoyé

    expect(mockApiPost).toHaveBeenCalledTimes(1);
    const [path, body] = mockApiPost.mock.calls[0];
    expect(path).toBe('/api/dms/messages/send');
    expect(body).toMatchObject({ type: 'image', enc: true, mediaUrl: 'https://cdn.example/file1', mime: 'image/png', keysJson: '' });
    expect(body.text).not.toBe('Regarde !');

    mockFetchReturning(ciphertext);
    const storedMessage: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: ME, displayName: 'Alice', type: 'image',
      text: body.text, mediaUrl: body.mediaUrl, mime: body.mime, enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    const decorated = await decryptDmMessageForDisplay(PEER, bob.jwk, storedMessage);
    expect(decorated.plainText).toBe('Regarde !');
    expect(decorated.mediaFailed).toBeUndefined();
    const expectedB64 = bytesToB64(original);
    expect(decorated.mediaUri).toBe('data:image/png;base64,' + expectedB64);
  });

  test('sends a generic file attachment with its name/size/mime encrypted as the message text', async () => {
    mockCreateFile.mockResolvedValueOnce({ $id: 'file2' });
    mockGetFileViewURL.mockReturnValueOnce('https://cdn.example/file2');
    mockApiPost.mockResolvedValueOnce({ ok: true });

    const dm = dmThread([ME, PEER]);
    const original = new TextEncoder().encode('%PDF-1.4 contenu factice');
    await sendDmAttachment(ME, alice.jwk, 'Alice', dm, {
      kind: 'file', bytes: original, mime: 'application/pdf', fileName: 'facture.pdf', fileSize: original.byteLength,
    });

    const [, body] = mockApiPost.mock.calls[0];
    expect(body.type).toBe('file');
    expect(body.text).not.toContain('facture.pdf'); // jamais le nom de fichier en clair sur le fil

    const storedMessage: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: ME, displayName: 'Alice', type: 'file',
      text: body.text, mediaUrl: body.mediaUrl, mime: body.mime, enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    const decorated = await decryptDmMessageForDisplay(PEER, bob.jwk, storedMessage);
    expect(decorated.fileMeta).toEqual({ name: 'facture.pdf', size: original.byteLength, mime: 'application/pdf' });
  });

  test('falls back to an unencrypted upload when no local E2E key is available, without failing the send', async () => {
    mockCreateFile.mockResolvedValueOnce({ $id: 'file3' });
    mockGetFileViewURL.mockReturnValueOnce('https://cdn.example/file3');
    mockApiPost.mockResolvedValueOnce({ ok: true });

    const dm = dmThread([ME, PEER]);
    const original = new TextEncoder().encode('sans-e2e');
    await sendDmAttachment(ME, null, 'Alice', dm, { kind: 'image', bytes: original, mime: 'image/png' });

    const uploadedFile = mockCreateFile.mock.calls[0][0].file;
    const [, uploadedBytes] = mockFileWrite.mock.calls.find(([uri]) => uri === uploadedFile.uri)!;
    expect(uploadedBytes).toEqual(original); // pas de clé -> pas de chiffrement, comme côté web

    const [, body] = mockApiPost.mock.calls[0];
    expect(body.enc).toBe(false);
  });
});

describe('sendDmAttachment — DM de groupe', () => {
  test('wraps a fresh message key per member and every recipient can decrypt the same attachment', async () => {
    mockCreateFile.mockResolvedValueOnce({ $id: 'file4' });
    mockGetFileViewURL.mockReturnValueOnce('https://cdn.example/file4');
    mockApiPost.mockResolvedValueOnce({ ok: true });

    const dm = dmThread([ME, PEER, THIRD]);
    const original = new TextEncoder().encode('photo-de-groupe');
    await sendDmAttachment(ME, alice.jwk, 'Alice', dm, { kind: 'image', bytes: original, mime: 'image/jpeg', caption: 'Le groupe !' });

    const [, body] = mockApiPost.mock.calls[0];
    const keysObj = JSON.parse(body.keysJson);
    expect(Object.keys(keysObj).sort()).toEqual([PEER, THIRD].sort());

    const uploadedFile = mockCreateFile.mock.calls[0][0].file;
    const [, ciphertext] = mockFileWrite.mock.calls.find(([uri]) => uri === uploadedFile.uri)!;
    mockFetchReturning(ciphertext);

    const storedMessage: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: ME, displayName: 'Alice', type: 'image',
      text: body.text, mediaUrl: body.mediaUrl, mime: body.mime, enc: true, keysJson: body.keysJson, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    const forBob = await decryptDmMessageForDisplay(PEER, bob.jwk, storedMessage);
    const forCarol = await decryptDmMessageForDisplay(THIRD, carol.jwk, storedMessage);
    expect(forBob.plainText).toBe('Le groupe !');
    expect(forCarol.plainText).toBe('Le groupe !');
    expect(forBob.mediaUri).toBe(forCarol.mediaUri);
  });
});

describe('decryptDmMessageForDisplay — messages non chiffrés', () => {
  test('returns a usable data URI for an unencrypted image (enc:false)', async () => {
    const original = new TextEncoder().encode('image-en-clair');
    mockFetchReturning(original);
    const m: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: PEER, displayName: 'Bob', type: 'image',
      text: '', mediaUrl: 'https://cdn.example/plain.png', mime: 'image/png', enc: false, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    const decorated = await decryptDmMessageForDisplay(ME, alice.jwk, m);
    expect(decorated.mediaUri).toBe('data:image/png;base64,' + bytesToB64(original));
  });

  test('reports a failed decrypt instead of throwing when there is no local key for an encrypted image', async () => {
    mockFetchReturning(new TextEncoder().encode('peu importe'));
    const m: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: PEER, displayName: 'Bob', type: 'image',
      text: '', mediaUrl: 'https://cdn.example/enc.png', mime: 'image/png', enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    const decorated = await decryptDmMessageForDisplay(ME, null, m);
    expect(decorated.mediaFailed).toBe(true);
    expect(decorated.mediaUri).toBeUndefined();
  });
});

describe('decryptDmAttachmentToFile', () => {
  test('writes the decrypted bytes to a local file and returns its URI', async () => {
    mockCreateFile.mockResolvedValueOnce({ $id: 'file5' });
    mockGetFileViewURL.mockReturnValueOnce('https://cdn.example/file5');
    mockApiPost.mockResolvedValueOnce({ ok: true });

    const dm = dmThread([ME, PEER]);
    const original = new TextEncoder().encode('%PDF-1.4 contenu factice');
    await sendDmAttachment(ME, alice.jwk, 'Alice', dm, {
      kind: 'file', bytes: original, mime: 'application/pdf', fileName: 'facture.pdf',
    });
    const [, body] = mockApiPost.mock.calls[0];
    const uploadedFile = mockCreateFile.mock.calls[0][0].file;
    const [, ciphertext] = mockFileWrite.mock.calls.find(([uri]) => uri === uploadedFile.uri)!;
    mockFetchReturning(ciphertext);

    const storedMessage: DmMessage = {
      $id: 'm1', threadId: 'dm1', uid: ME, displayName: 'Alice', type: 'file',
      text: body.text, mediaUrl: body.mediaUrl, mime: body.mime, enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
    };
    const uri = await decryptDmAttachmentToFile(PEER, bob.jwk, storedMessage, 'facture.pdf');
    expect(uri).toBe('file:///mock-cache/MOCK_CACHE_DIR/facture.pdf');
    const [, writtenBytes] = mockFileWrite.mock.calls.find(([u]) => u === uri)!;
    expect(writtenBytes).toEqual(original);
  });
});
