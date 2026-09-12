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

const mockedUseAuth = useAuth as jest.Mock;
const mockedDms = dms as jest.Mocked<typeof dms>;

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

test('a group thread disables the composer with an explanatory notice', async () => {
  const groupDm: dms.DmThread = { $id: 'dm2', members: ['u1', 'u2', 'u3'], $updatedAt: '2026-01-01T00:00:00.000Z' };
  const { getByText, getByTestId } = await render(<DmConversationScreen dm={groupDm} onBack={jest.fn()} />);
  await waitFor(() => expect(getByText(/pas encore pris en charge/)).toBeTruthy());
  expect(getByTestId('dm-send-button').props.accessibilityState?.disabled).toBe(true);
});
