import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import * as dms from '../dms';
import DmListScreen from '../screens/DmListScreen';

jest.mock('../AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../dms', () => {
  const actual = jest.requireActual('../dms');
  return {
    ...actual,
    loadDms: jest.fn(),
    loadThreadMessages: jest.fn(),
    decryptDmMessageText: jest.fn(),
    getUserProfile: jest.fn(),
  };
});

const mockedUseAuth = useAuth as jest.Mock;
const mockedDms = dms as jest.Mocked<typeof dms>;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'u1' }, e2eJwk: null, logout: jest.fn() });
});

test('shows an empty state when there are no conversations yet', async () => {
  mockedDms.loadDms.mockResolvedValueOnce([]);
  const { getByTestId } = await render(<DmListScreen onOpenThread={jest.fn()} />);
  await waitFor(() => expect(getByTestId('dms-empty')).toBeTruthy());
});

test('lists conversations with the peer name and last-message preview, and opens one on tap', async () => {
  const dm: dms.DmThread = { $id: 'dm1', members: ['u1', 'u2'], $updatedAt: '2026-01-01T00:00:00.000Z' };
  const message: dms.DmMessage = {
    $id: 'm1', threadId: 'dm1', uid: 'u2', displayName: 'Bob', type: 'text',
    text: 'ciphertext', mediaUrl: '', enc: true, $createdAt: '2026-01-01T00:00:00.000Z',
  };
  mockedDms.loadDms.mockResolvedValueOnce([dm]);
  mockedDms.loadThreadMessages.mockResolvedValueOnce([message]);
  mockedDms.decryptDmMessageText.mockResolvedValueOnce('Salut !');
  mockedDms.getUserProfile.mockResolvedValueOnce({ authUserId: 'u2', displayName: 'Bob' });

  const onOpenThread = jest.fn();
  const { getByTestId, getByText } = await render(<DmListScreen onOpenThread={onOpenThread} />);

  await waitFor(() => expect(getByText('Bob')).toBeTruthy());
  expect(getByText('Salut !')).toBeTruthy();

  await fireEvent.press(getByTestId('dm-row-dm1'));
  expect(onOpenThread).toHaveBeenCalledWith(dm);
});

test('a failure to load conversations shows an error instead of leaving a silent blank screen', async () => {
  mockedDms.loadDms.mockRejectedValueOnce(new Error('network down'));
  const { getByText } = await render(<DmListScreen onOpenThread={jest.fn()} />);
  await waitFor(() => expect(getByText('network down')).toBeTruthy());
});
