import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import * as friends from '../friends';
import FriendsScreen from '../screens/FriendsScreen';

jest.mock('../AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../friends', () => {
  const actual = jest.requireActual('../friends');
  return {
    ...actual,
    loadFriends: jest.fn(),
    searchUsers: jest.fn(),
    sendFriendRequest: jest.fn(),
    acceptFriendRequest: jest.fn(),
    rejectFriendRequest: jest.fn(),
    removeFriend: jest.fn(),
    unblockUser: jest.fn(),
  };
});
// ProfileScreen is reachable from a friend row tap — stub it out so this
// suite stays focused on FriendsScreen's own behavior.
jest.mock('../screens/ProfileScreen', () => {
  const { Text } = require('react-native');
  return function FakeProfileScreen() {
    return <Text testID="fake-profile-screen">profile</Text>;
  };
});

const mockedUseAuth = useAuth as jest.Mock;
const mockedFriends = friends as jest.Mocked<typeof friends>;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'me1', name: 'Me' } });
  mockedFriends.loadFriends.mockResolvedValue([]);
  mockedFriends.searchUsers.mockResolvedValue([]);
});

test('shows an empty state when there are no friends or requests', async () => {
  const { getByTestId } = await render(<FriendsScreen />);
  await waitFor(() => expect(getByTestId('friends-empty')).toBeTruthy());
});

test('lists incoming requests and accepted friends in separate sections', async () => {
  mockedFriends.loadFriends.mockResolvedValueOnce([
    { $id: 'f1', userId: 'me1', friendId: 'u2', status: 'pending_in', name: 'Bob' },
    { $id: 'f2', userId: 'me1', friendId: 'u3', status: 'accepted', name: 'Carol' },
  ]);
  const { getByText, getByTestId } = await render(<FriendsScreen />);
  await waitFor(() => expect(getByText('Demandes reçues')).toBeTruthy());
  expect(getByText('Bob')).toBeTruthy();
  expect(getByText('Carol')).toBeTruthy();
  expect(getByTestId('friend-incoming-u2')).toBeTruthy();
  expect(getByTestId('friend-accepted-u3')).toBeTruthy();
});

test('accepting an incoming request calls acceptFriendRequest and refreshes the list', async () => {
  mockedFriends.loadFriends
    .mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u2', status: 'pending_in', name: 'Bob' }])
    .mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u2', status: 'accepted', name: 'Bob' }]);

  const { getByTestId, getByText } = await render(<FriendsScreen />);
  await waitFor(() => expect(getByTestId('friend-accept-u2')).toBeTruthy());
  await fireEvent.press(getByTestId('friend-accept-u2'));

  await waitFor(() => expect(mockedFriends.acceptFriendRequest).toHaveBeenCalledWith('me1', 'Me', 'f1', 'u2'));
  await waitFor(() => expect(getByTestId('friend-accepted-u2')).toBeTruthy());
});

test('rejecting an incoming request calls rejectFriendRequest', async () => {
  mockedFriends.loadFriends.mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u2', status: 'pending_in', name: 'Bob' }]);
  const { getByTestId } = await render(<FriendsScreen />);
  await waitFor(() => expect(getByTestId('friend-reject-u2')).toBeTruthy());
  await fireEvent.press(getByTestId('friend-reject-u2'));
  await waitFor(() => expect(mockedFriends.rejectFriendRequest).toHaveBeenCalledWith('me1', 'f1', 'u2'));
});

test('removing a friend calls removeFriend', async () => {
  mockedFriends.loadFriends.mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u3', status: 'accepted', name: 'Carol' }]);
  const { getByTestId } = await render(<FriendsScreen />);
  await waitFor(() => expect(getByTestId('friend-remove-u3')).toBeTruthy());
  await fireEvent.press(getByTestId('friend-remove-u3'));
  await waitFor(() => expect(mockedFriends.removeFriend).toHaveBeenCalledWith('me1', 'Me', 'u3'));
});

test('searching shows results and sending a request marks it as sent', async () => {
  mockedFriends.searchUsers.mockResolvedValueOnce([{ authUserId: 'u4', username: 'dave', displayName: 'Dave' }]);
  mockedFriends.sendFriendRequest.mockResolvedValueOnce('sent');

  const { getByTestId, getByText } = await render(<FriendsScreen />);
  await fireEvent.changeText(getByTestId('friend-search-input'), 'dave');
  await waitFor(() => expect(getByText('Dave')).toBeTruthy());

  await fireEvent.press(getByTestId('friend-add-u4'));
  await waitFor(() => expect(mockedFriends.sendFriendRequest).toHaveBeenCalledWith('me1', 'Me', 'u4', 'Dave'));
  await waitFor(() => expect(getByText('Envoyé')).toBeTruthy());
});

test('a query shorter than 2 characters does not trigger a search', async () => {
  const { getByTestId } = await render(<FriendsScreen />);
  await fireEvent.changeText(getByTestId('friend-search-input'), 'd');
  expect(mockedFriends.searchUsers).not.toHaveBeenCalled();
});

test('tapping a friend row opens their profile', async () => {
  mockedFriends.loadFriends.mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u3', status: 'accepted', name: 'Carol' }]);
  const { getByText, getByTestId } = await render(<FriendsScreen />);
  await waitFor(() => expect(getByText('Carol')).toBeTruthy());
  await fireEvent.press(getByText('Carol'));
  await waitFor(() => expect(getByTestId('fake-profile-screen')).toBeTruthy());
});

test('lists blocked users in their own section, and unblocking calls unblockUser and refreshes the list', async () => {
  mockedFriends.loadFriends
    .mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u5', status: 'blocked', name: 'Troll' }])
    .mockResolvedValueOnce([]);
  mockedFriends.unblockUser.mockResolvedValueOnce(undefined);

  const { getByText, getByTestId, queryByTestId } = await render(<FriendsScreen />);
  await waitFor(() => expect(getByText('Utilisateurs bloqués')).toBeTruthy());
  expect(getByText('Troll')).toBeTruthy();
  expect(getByTestId('friend-blocked-u5')).toBeTruthy();

  await fireEvent.press(getByTestId('friend-unblock-u5'));
  await waitFor(() => expect(mockedFriends.unblockUser).toHaveBeenCalledWith('me1', 'u5'));
  await waitFor(() => expect(queryByTestId('friend-blocked-u5')).toBeNull());
});

test('a blocked row is not tappable to open a profile (unlike an accepted friend)', async () => {
  mockedFriends.loadFriends.mockResolvedValueOnce([{ $id: 'f1', userId: 'me1', friendId: 'u5', status: 'blocked', name: 'Troll' }]);
  const { getByText, queryByTestId } = await render(<FriendsScreen />);
  await waitFor(() => expect(getByText('Troll')).toBeTruthy());
  await fireEvent.press(getByText('Troll'));
  expect(queryByTestId('fake-profile-screen')).toBeNull();
});
