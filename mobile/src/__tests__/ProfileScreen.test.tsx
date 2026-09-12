import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import * as profile from '../profile';
import ProfileScreen from '../screens/ProfileScreen';

jest.mock('../profile', () => {
  const actual = jest.requireActual('../profile');
  return { ...actual, getProfileDetails: jest.fn() };
});

const mockedProfile = profile as jest.Mocked<typeof profile>;

beforeEach(() => {
  jest.clearAllMocks();
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
