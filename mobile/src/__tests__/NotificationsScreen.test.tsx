import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import * as notifications from '../notifications';
import NotificationsScreen from '../screens/NotificationsScreen';

jest.mock('../AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../notifications', () => {
  const actual = jest.requireActual('../notifications');
  return {
    ...actual,
    loadNotifications: jest.fn(),
    markAllRead: jest.fn(),
    deleteNotification: jest.fn(),
    clearAllNotifications: jest.fn(),
  };
});
jest.mock('../screens/ProfileScreen', () => {
  const { Text } = require('react-native');
  return function FakeProfileScreen() {
    return <Text testID="fake-profile-screen">profile</Text>;
  };
});

const mockedUseAuth = useAuth as jest.Mock;
const mockedNotifications = notifications as jest.Mocked<typeof notifications>;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'me1', name: 'Me' } });
  mockedNotifications.loadNotifications.mockResolvedValue([]);
  mockedNotifications.markAllRead.mockResolvedValue(undefined);
  mockedNotifications.deleteNotification.mockResolvedValue(undefined);
  mockedNotifications.clearAllNotifications.mockResolvedValue(undefined);
});

test('shows an empty state when there are none', async () => {
  const { getByTestId } = await render(<NotificationsScreen />);
  await waitFor(() => expect(getByTestId('notifications-empty')).toBeTruthy());
});

test('lists notifications and marks them all read on open', async () => {
  const fresh = [
    { $id: 'n1', uid: 'me1', type: 'friend_accepted', fromUid: 'u2', fromName: 'Bob', text: 'Bob a accepté ta demande', read: false, $createdAt: '2026-01-01T00:00:00.000Z' },
  ];
  mockedNotifications.loadNotifications.mockResolvedValueOnce(fresh);

  const { getByText, getByTestId } = await render(<NotificationsScreen />);
  await waitFor(() => expect(getByTestId('notification-n1')).toBeTruthy());
  expect(getByText('Bob a accepté ta demande')).toBeTruthy();
  await waitFor(() => expect(mockedNotifications.markAllRead).toHaveBeenCalledWith(fresh));
});

test('tapping a notification with a fromUid opens that profile', async () => {
  mockedNotifications.loadNotifications.mockResolvedValueOnce([
    { $id: 'n1', uid: 'me1', type: 'friend_accepted', fromUid: 'u2', fromName: 'Bob', text: 'Bob a accepté ta demande', read: false, $createdAt: '2026-01-01T00:00:00.000Z' },
  ]);
  const { getByTestId } = await render(<NotificationsScreen />);
  await waitFor(() => expect(getByTestId('notification-n1')).toBeTruthy());
  await fireEvent.press(getByTestId('notification-n1'));
  await waitFor(() => expect(getByTestId('fake-profile-screen')).toBeTruthy());
});

test('a notification with no fromUid is not tappable', async () => {
  mockedNotifications.loadNotifications.mockResolvedValueOnce([
    { $id: 'n1', uid: 'me1', type: 'announcement', fromUid: '', fromName: '', text: 'Maintenance ce soir', read: false, $createdAt: '2026-01-01T00:00:00.000Z' },
  ]);
  const { getByTestId } = await render(<NotificationsScreen />);
  await waitFor(() => expect(getByTestId('notification-n1')).toBeTruthy());
  expect(getByTestId('notification-n1').props.accessibilityState?.disabled).toBe(true);
});

test('deleting one notification removes it from the list', async () => {
  mockedNotifications.loadNotifications.mockResolvedValueOnce([
    { $id: 'n1', uid: 'me1', type: 'friend_accepted', fromUid: 'u2', fromName: 'Bob', text: 'Bob a accepté ta demande', read: false, $createdAt: '2026-01-01T00:00:00.000Z' },
  ]);
  const { getByTestId, queryByTestId } = await render(<NotificationsScreen />);
  await waitFor(() => expect(getByTestId('notification-n1')).toBeTruthy());
  await fireEvent.press(getByTestId('notification-delete-n1'));
  await waitFor(() => expect(mockedNotifications.deleteNotification).toHaveBeenCalledWith('n1'));
  expect(queryByTestId('notification-n1')).toBeNull();
});

test('"Tout effacer" clears every notification', async () => {
  const fresh = [
    { $id: 'n1', uid: 'me1', type: 'friend_accepted', fromUid: 'u2', fromName: 'Bob', text: 'x', read: false, $createdAt: '2026-01-01T00:00:00.000Z' },
  ];
  mockedNotifications.loadNotifications.mockResolvedValueOnce(fresh);
  const { getByTestId, queryByTestId } = await render(<NotificationsScreen />);
  await waitFor(() => expect(getByTestId('notifications-clear-all')).toBeTruthy());
  await fireEvent.press(getByTestId('notifications-clear-all'));
  await waitFor(() => expect(mockedNotifications.clearAllNotifications).toHaveBeenCalledWith(fresh));
  expect(queryByTestId('notification-n1')).toBeNull();
});
