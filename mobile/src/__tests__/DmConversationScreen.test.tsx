import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import * as dms from '../dms';
import DmConversationScreen from '../screens/DmConversationScreen';

jest.mock('../AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../dms', () => {
  const actual = jest.requireActual('../dms');
  return {
    ...actual,
    loadThreadMessages: jest.fn(),
    decryptDmMessageText: jest.fn(),
    getUserProfile: jest.fn(),
    sendDmText: jest.fn(),
  };
});
jest.mock('../profile', () => {
  const actual = jest.requireActual('../profile');
  return { ...actual, getProfileDetails: jest.fn() };
});

const mockedUseAuth = useAuth as jest.Mock;
const mockedDms = dms as jest.Mocked<typeof dms>;
const mockedProfile = jest.requireMock('../profile') as { getProfileDetails: jest.Mock };

const DM: dms.DmThread = { $id: 'dm1', members: ['u1', 'u2'], $updatedAt: '2026-01-01T00:00:00.000Z' };

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'u1', name: 'Alice' }, e2eJwk: null });
  mockedDms.getUserProfile.mockResolvedValue({ authUserId: 'u2', displayName: 'Bob' });
  mockedDms.loadThreadMessages.mockResolvedValue([]);
});

test('renders decrypted messages, distinguishing mine from theirs', async () => {
  const messages: dms.DmMessage[] = [
    { $id: 'm1', threadId: 'dm1', uid: 'u2', displayName: 'Bob', type: 'text', text: 'ct1', mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:00:00.000Z' },
    { $id: 'm2', threadId: 'dm1', uid: 'u1', displayName: 'Alice', type: 'text', text: 'ct2', mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:01:00.000Z' },
  ];
  mockedDms.loadThreadMessages.mockResolvedValueOnce(messages);
  mockedDms.decryptDmMessageText.mockResolvedValueOnce('Salut !').mockResolvedValueOnce('Yo !');

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
  mockedDms.decryptDmMessageText.mockResolvedValueOnce('Salut !');
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
