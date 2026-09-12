import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import * as friends from '../friends';
import * as profile from '../profile';
import ProfileScreen from '../screens/ProfileScreen';

jest.mock('../AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../profile', () => {
  const actual = jest.requireActual('../profile');
  return { ...actual, getProfileDetails: jest.fn() };
});
jest.mock('../friends', () => {
  const actual = jest.requireActual('../friends');
  return { ...actual, loadFriends: jest.fn(), sendFriendRequest: jest.fn(), acceptFriendRequest: jest.fn() };
});

const mockedUseAuth = useAuth as jest.Mock;
const mockedProfile = profile as jest.Mocked<typeof profile>;
const mockedFriends = friends as jest.Mocked<typeof friends>;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'me1', name: 'Me' } });
  mockedFriends.loadFriends.mockResolvedValue([]);
});

test('renders name, tag, presence, badges and bio once loaded', async () => {
  mockedProfile.getProfileDetails.mockResolvedValueOnce({
    uid: 'u2', username: 'shaman', displayName: 'Shaman', tag: '7777', bio: 'Hello there',
    createdAt: '2026-03-24T00:00:00.000Z', presence: 'offline', plan: 'plus', badges: ['base', 'dev'],
  });

  const { getByTestId, getByText } = await render(<ProfileScreen uid="u2" onBack={jest.fn()} />);

  await waitFor(() => expect(getByTestId('profile-name')).toBeTruthy());
  expect(getByText('Shaman')).toBeTruthy();
  expect(getByText('#7777')).toBeTruthy();
  expect(getByText('Hello there')).toBeTruthy();
  expect(getByText('Hors ligne')).toBeTruthy();
  expect(getByText('★ X1+ à vie')).toBeTruthy();
  expect(getByTestId('profile-badge-base')).toBeTruthy();
  expect(getByTestId('profile-badge-dev')).toBeTruthy();
  expect(getByText('2 distinctions')).toBeTruthy();
});

test('an empty bio shows the placeholder text', async () => {
  mockedProfile.getProfileDetails.mockResolvedValueOnce({
    uid: 'u3', username: 'newbie', tag: '0001', bio: '', presence: 'online', badges: ['base'],
  });
  const { getByText } = await render(<ProfileScreen uid="u3" onBack={jest.fn()} />);
  await waitFor(() => expect(getByText('Pas encore de bio.')).toBeTruthy());
  expect(getByText('1 distinction')).toBeTruthy();
});

test('a profile that fails to load shows an error, not a blank screen', async () => {
  mockedProfile.getProfileDetails.mockResolvedValueOnce(null);
  const { getByTestId } = await render(<ProfileScreen uid="ghost" onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('profile-error')).toBeTruthy());
});

test('the back button calls onBack', async () => {
  mockedProfile.getProfileDetails.mockResolvedValueOnce({
    uid: 'u2', username: 'shaman', tag: '7777', bio: '', presence: 'online', badges: ['base'],
  });
  const onBack = jest.fn();
  const { getByTestId } = await render(<ProfileScreen uid="u2" onBack={onBack} />);
  await fireEvent.press(getByTestId('profile-back-button'));
  expect(onBack).toHaveBeenCalled();
});

describe('the "Ami" button', () => {
  test('is hidden when viewing my own profile', async () => {
    mockedUseAuth.mockReturnValue({ user: { $id: 'u2', name: 'Me' } });
    mockedProfile.getProfileDetails.mockResolvedValueOnce({
      uid: 'u2', username: 'me', tag: '1111', bio: '', presence: 'online', badges: ['base'],
    });
    const { getByTestId, queryByTestId } = await render(<ProfileScreen uid="u2" onBack={jest.fn()} />);
    await waitFor(() => expect(getByTestId('profile-name')).toBeTruthy());
    expect(queryByTestId('profile-friend-button')).toBeNull();
  });

  test('shows "Ajouter en ami" when there is no relation yet, and sends a request on tap', async () => {
    mockedProfile.getProfileDetails.mockResolvedValueOnce({
      uid: 'u2', username: 'shaman', displayName: 'Shaman', tag: '7777', bio: '', presence: 'online', badges: ['base'],
    });
    mockedFriends.sendFriendRequest.mockResolvedValueOnce('sent');
    mockedFriends.loadFriends
      .mockResolvedValueOnce([]) // initial relation lookup
      .mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u2', status: 'pending_out', name: 'Shaman' }]);

    const { getByTestId, getByText } = await render(<ProfileScreen uid="u2" onBack={jest.fn()} />);
    await waitFor(() => expect(getByText('➕ Ajouter en ami')).toBeTruthy());

    await fireEvent.press(getByTestId('profile-friend-button'));
    await waitFor(() => expect(mockedFriends.sendFriendRequest).toHaveBeenCalledWith('me1', 'Me', 'u2', 'Shaman'));
    await waitFor(() => expect(getByText('📨 Demande envoyée')).toBeTruthy());
  });

  test('shows "Accepter sa demande" for an incoming request, and accepts it on tap', async () => {
    mockedProfile.getProfileDetails.mockResolvedValueOnce({
      uid: 'u2', username: 'shaman', displayName: 'Shaman', tag: '7777', bio: '', presence: 'online', badges: ['base'],
    });
    mockedFriends.loadFriends
      .mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u2', status: 'pending_in', name: 'Shaman' }])
      .mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u2', status: 'accepted', name: 'Shaman' }]);

    const { getByTestId, getByText } = await render(<ProfileScreen uid="u2" onBack={jest.fn()} />);
    await waitFor(() => expect(getByText('✅ Accepter sa demande')).toBeTruthy());

    await fireEvent.press(getByTestId('profile-friend-button'));
    await waitFor(() => expect(mockedFriends.acceptFriendRequest).toHaveBeenCalledWith('me1', 'Me', 'f1', 'u2'));
    await waitFor(() => expect(getByText('✅ Ami')).toBeTruthy());
  });

  test('shows a disabled "Ami" state when already friends', async () => {
    mockedProfile.getProfileDetails.mockResolvedValueOnce({
      uid: 'u2', username: 'shaman', tag: '7777', bio: '', presence: 'online', badges: ['base'],
    });
    mockedFriends.loadFriends.mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u2', status: 'accepted' }]);

    const { getByTestId, getByText } = await render(<ProfileScreen uid="u2" onBack={jest.fn()} />);
    await waitFor(() => expect(getByText('✅ Ami')).toBeTruthy());
    expect(getByTestId('profile-friend-button').props.accessibilityState?.disabled).toBe(true);
  });
});
