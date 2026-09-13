import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { useAuth } from '../AuthContext';
import * as dms from '../dms';
import DmConversationScreen from '../screens/DmConversationScreen';

jest.mock('../AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../dms', () => {
  const actual = jest.requireActual('../dms');
  return {
    ...actual,
    loadThreadMessages: jest.fn(),
    decryptDmMessageForDisplay: jest.fn(),
    getUserProfile: jest.fn(),
    sendDmText: jest.fn(),
    sendDmAttachment: jest.fn(),
    decryptDmAttachmentToFile: jest.fn(),
  };
});
jest.mock('../profile', () => {
  const actual = jest.requireActual('../profile');
  return { ...actual, getProfileDetails: jest.fn() };
});
jest.mock('../friends', () => {
  const actual = jest.requireActual('../friends');
  return { ...actual, loadFriends: jest.fn() };
});
// Sélecteur de photo (permission + choix depuis la galerie) : une fausse
// implémentation minimale suffit, le test ne vérifie que le câblage
// écran -> sendDmAttachment(), pas le comportement réel du picker natif.
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));
// Sélecteur de fichier générique + lecture d'octets locaux : idem, mocké au
// niveau du module plutôt que de dépendre du vrai module natif en test.
jest.mock('expo-file-system', () => ({
  File: Object.assign(
    jest.fn().mockImplementation((uri: string) => ({ uri, bytes: jest.fn() })),
    { pickFileAsync: jest.fn() }
  ),
  Paths: { cache: 'CACHE_DIR' },
}));
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn() }));

const mockedUseAuth = useAuth as jest.Mock;
const mockedDms = dms as jest.Mocked<typeof dms>;
const mockedProfile = jest.requireMock('../profile') as { getProfileDetails: jest.Mock };
const mockedFriends = jest.requireMock('../friends') as { loadFriends: jest.Mock };
const mockedImagePicker = jest.requireMock('expo-image-picker') as {
  requestMediaLibraryPermissionsAsync: jest.Mock;
  launchImageLibraryAsync: jest.Mock;
};
const mockedFileSystem = jest.requireMock('expo-file-system') as {
  File: jest.Mock & { pickFileAsync: jest.Mock };
};
const mockedSharing = jest.requireMock('expo-sharing') as { shareAsync: jest.Mock };

const DM: dms.DmThread = { $id: 'dm1', members: ['u1', 'u2'], $updatedAt: '2026-01-01T00:00:00.000Z' };

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'u1', name: 'Alice' }, e2eJwk: null });
  mockedDms.getUserProfile.mockResolvedValue({ authUserId: 'u2', displayName: 'Bob' });
  mockedDms.loadThreadMessages.mockResolvedValue([]);
  mockedFriends.loadFriends.mockResolvedValue([]);
});

test('renders decrypted messages, distinguishing mine from theirs', async () => {
  const messages: dms.DmMessage[] = [
    { $id: 'm1', threadId: 'dm1', uid: 'u2', displayName: 'Bob', type: 'text', text: 'ct1', mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:00:00.000Z' },
    { $id: 'm2', threadId: 'dm1', uid: 'u1', displayName: 'Alice', type: 'text', text: 'ct2', mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:01:00.000Z' },
  ];
  mockedDms.loadThreadMessages.mockResolvedValueOnce(messages);
  mockedDms.decryptDmMessageForDisplay
    .mockImplementationOnce(async (_u, _k, m) => ({ ...m, plainText: 'Salut !' }))
    .mockImplementationOnce(async (_u, _k, m) => ({ ...m, plainText: 'Yo !' }));

  const { getByText, getByTestId } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);

  await waitFor(() => expect(getByTestId('dm-message-m1')).toBeTruthy());
  expect(getByText('Salut !')).toBeTruthy();
  expect(getByText('Yo !')).toBeTruthy();
});

test('sending a message clears the draft and refreshes the thread', async () => {
  mockedDms.sendDmText.mockResolvedValueOnce(undefined);
  const { getByTestId } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);

  await waitFor(() => expect(getByTestId('dm-input')).toBeTruthy());
  await fireEvent.changeText(getByTestId('dm-input'), 'Salut !');
  await fireEvent.press(getByTestId('dm-send-button'));

  await waitFor(() => expect(mockedDms.sendDmText).toHaveBeenCalledWith('u1', null, 'Alice', DM, 'Salut !'));
  await waitFor(() => expect(getByTestId('dm-input').props.value).toBe(''));
});

test('a failed send surfaces an error and keeps the draft so the user can retry', async () => {
  mockedDms.sendDmText.mockRejectedValueOnce(new Error('threadId requis'));
  const { getByTestId, getByText } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);

  await waitFor(() => expect(getByTestId('dm-input')).toBeTruthy());
  await fireEvent.changeText(getByTestId('dm-input'), 'Salut !');
  await fireEvent.press(getByTestId('dm-send-button'));

  await waitFor(() => expect(getByText('threadId requis')).toBeTruthy());
  expect(getByTestId('dm-input').props.value).toBe('Salut !');
});

test('going back calls onBack', async () => {
  const onBack = jest.fn();
  const { getByTestId } = await render(<DmConversationScreen dm={DM} onBack={onBack} />);
  await fireEvent.press(getByTestId('dm-back-button'));
  expect(onBack).toHaveBeenCalled();
});

test('a group thread has a fully working composer, and shows the sender name above messages that are not mine', async () => {
  const groupDm: dms.DmThread = { $id: 'dm2', members: ['u1', 'u2', 'u3'], $updatedAt: '2026-01-01T00:00:00.000Z' };
  const messages: dms.DmMessage[] = [
    { $id: 'm1', threadId: 'dm2', uid: 'u3', displayName: 'Carol', type: 'text', text: 'ct1', mediaUrl: '', enc: true, keysJson: '{}', $createdAt: '2026-01-01T00:00:00.000Z' },
  ];
  mockedDms.loadThreadMessages.mockResolvedValueOnce(messages);
  mockedDms.decryptDmMessageForDisplay.mockImplementationOnce(async (_u, _k, m) => ({ ...m, plainText: 'Salut !' }));
  mockedDms.sendDmText.mockResolvedValueOnce(undefined);

  const { getByText, getByTestId } = await render(<DmConversationScreen dm={groupDm} onBack={jest.fn()} />);

  await waitFor(() => expect(getByTestId('dm-message-m1')).toBeTruthy());
  expect(getByText('Carol')).toBeTruthy();
  expect(getByText('Salut !')).toBeTruthy();

  await fireEvent.changeText(getByTestId('dm-input'), 'Salut le groupe !');
  await fireEvent.press(getByTestId('dm-send-button'));
  await waitFor(() => expect(mockedDms.sendDmText).toHaveBeenCalledWith('u1', null, 'Alice', groupDm, 'Salut le groupe !'));
});

test('tapping the header title opens the peer\'s profile, and going back returns to the conversation', async () => {
  mockedProfile.getProfileDetails.mockResolvedValueOnce({
    uid: 'u2', username: 'bob', displayName: 'Bob', tag: '4242', bio: '', presence: 'online', badges: ['base'],
  });
  const { getByTestId, queryByTestId } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);

  await waitFor(() => expect(getByTestId('dm-header-title')).toBeTruthy());
  await fireEvent.press(getByTestId('dm-header-title'));
  await waitFor(() => expect(getByTestId('profile-name')).toBeTruthy());
  expect(queryByTestId('dm-input')).toBeNull();

  await fireEvent.press(getByTestId('profile-back-button'));
  await waitFor(() => expect(getByTestId('dm-input')).toBeTruthy());
});

test('the header title is not tappable for a group thread (no single peer to show)', async () => {
  const groupDm: dms.DmThread = { $id: 'dm2', members: ['u1', 'u2', 'u3'], $updatedAt: '2026-01-01T00:00:00.000Z' };
  const { getByTestId } = await render(<DmConversationScreen dm={groupDm} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('dm-header-title')).toBeTruthy());
  expect(getByTestId('dm-header-title').props.accessibilityState?.disabled).toBe(true);
});

describe('pièces jointes', () => {
  let alertSpy: jest.SpiedFunction<typeof Alert.alert>;

  beforeEach(() => {
    // Doit être posé AVANT que l'écran n'appelle Alert.alert (donc avant
    // fireEvent.press sur le bouton 📎), sans quoi l'appel réel n'est jamais
    // enregistré par le spy créé après coup.
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  function pressAttachOption(label: string) {
    // onAttachPress ne fait qu'ouvrir Alert.alert avec les 3 options —
    // on simule directement l'appui sur l'option choisie par l'utilisateur.
    const button = alertSpy.mock.calls[0]?.[2]?.find((b) => b.text === label);
    button?.onPress?.();
  }

  test('picking a photo reads its bytes, sends it as an image attachment with the typed draft as caption, and clears the draft', async () => {
    mockedImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ granted: true });
    const bytes = new Uint8Array([1, 2, 3]);
    mockedImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file:///photo.jpg', mimeType: 'image/jpeg', fileSize: 3, width: 10, height: 10 }],
    });
    mockedFileSystem.File.mockImplementationOnce((uri: string) => ({ uri, bytes: jest.fn().mockResolvedValue(bytes) }));
    mockedDms.sendDmAttachment.mockResolvedValueOnce(undefined);

    const { getByTestId } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);
    await waitFor(() => expect(getByTestId('dm-attach-button')).toBeTruthy());
    await fireEvent.changeText(getByTestId('dm-input'), 'Regarde ça');
    await fireEvent.press(getByTestId('dm-attach-button'));
    pressAttachOption('📷 Photo');

    await waitFor(() => expect(mockedDms.sendDmAttachment).toHaveBeenCalledTimes(1));
    expect(mockedDms.sendDmAttachment).toHaveBeenCalledWith('u1', null, 'Alice', DM, {
      kind: 'image', bytes, mime: 'image/jpeg', caption: 'Regarde ça',
    });
    await waitFor(() => expect(getByTestId('dm-input').props.value).toBe(''));
  });

  test('does not attempt to send a photo when the user cancels the picker', async () => {
    mockedImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ granted: true });
    mockedImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({ canceled: true, assets: null });

    const { getByTestId } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);
    await waitFor(() => expect(getByTestId('dm-attach-button')).toBeTruthy());
    await fireEvent.press(getByTestId('dm-attach-button'));
    pressAttachOption('📷 Photo');

    await waitFor(() => expect(mockedImagePicker.launchImageLibraryAsync).toHaveBeenCalledTimes(1));
    expect(mockedDms.sendDmAttachment).not.toHaveBeenCalled();
  });

  test('shows an error and never uploads when photo permission is refused', async () => {
    mockedImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ granted: false });

    const { getByTestId, getByText } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);
    await waitFor(() => expect(getByTestId('dm-attach-button')).toBeTruthy());
    await fireEvent.press(getByTestId('dm-attach-button'));
    pressAttachOption('📷 Photo');

    await waitFor(() => expect(getByText("Permission d'accès aux photos refusée.")).toBeTruthy());
    expect(mockedDms.sendDmAttachment).not.toHaveBeenCalled();
  });

  test('picking a generic file reads its bytes and sends it with its name/size/mime, without touching the draft', async () => {
    const bytes = new Uint8Array([9, 9, 9]);
    mockedFileSystem.File.pickFileAsync.mockResolvedValueOnce({
      canceled: false,
      result: { uri: 'file:///doc.pdf', name: 'facture.pdf', type: 'application/pdf', size: 3, bytes: jest.fn().mockResolvedValue(bytes) },
    });
    mockedDms.sendDmAttachment.mockResolvedValueOnce(undefined);

    const { getByTestId } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);
    await waitFor(() => expect(getByTestId('dm-attach-button')).toBeTruthy());
    await fireEvent.press(getByTestId('dm-attach-button'));
    pressAttachOption('📄 Fichier');

    await waitFor(() => expect(mockedDms.sendDmAttachment).toHaveBeenCalledTimes(1));
    expect(mockedDms.sendDmAttachment).toHaveBeenCalledWith('u1', null, 'Alice', DM, {
      kind: 'file', bytes, mime: 'application/pdf', fileName: 'facture.pdf', fileSize: 3,
    });
  });

  test('renders an image message and a file message, and tapping a file message shares the decrypted file', async () => {
    const messages: dms.DmMessage[] = [
      { $id: 'm1', threadId: 'dm1', uid: 'u2', displayName: 'Bob', type: 'image', text: '', mediaUrl: 'https://cdn.example/1', mime: 'image/png', enc: true, $createdAt: '2026-01-01T00:00:00.000Z' },
      { $id: 'm2', threadId: 'dm1', uid: 'u2', displayName: 'Bob', type: 'file', text: 'ct', mediaUrl: 'https://cdn.example/2', mime: 'application/pdf', enc: true, $createdAt: '2026-01-01T00:01:00.000Z' },
    ];
    mockedDms.loadThreadMessages.mockResolvedValueOnce(messages);
    mockedDms.decryptDmMessageForDisplay
      .mockImplementationOnce(async (_u, _k, m) => ({ ...m, plainText: '', mediaUri: 'data:image/png;base64,AAA' }))
      .mockImplementationOnce(async (_u, _k, m) => ({ ...m, plainText: '', fileMeta: { name: 'facture.pdf', size: 2048, mime: 'application/pdf' } }));
    mockedDms.decryptDmAttachmentToFile.mockResolvedValueOnce('file:///cache/facture.pdf');

    const { getByTestId, getByText } = await render(<DmConversationScreen dm={DM} onBack={jest.fn()} />);
    await waitFor(() => expect(getByTestId('dm-message-m1')).toBeTruthy());
    expect(getByTestId('dm-message-m2')).toBeTruthy();
    expect(getByText('📄 facture.pdf')).toBeTruthy();
    expect(getByText('2.0 Ko')).toBeTruthy();

    await fireEvent.press(getByTestId('dm-file-m2'));
    await waitFor(() =>
      expect(mockedDms.decryptDmAttachmentToFile).toHaveBeenCalledWith(
        'u1',
        null,
        expect.objectContaining(messages[1]),
        'facture.pdf',
      ),
    );
    expect(mockedSharing.shareAsync).toHaveBeenCalledWith('file:///cache/facture.pdf', { mimeType: 'application/pdf' });
  });
});
