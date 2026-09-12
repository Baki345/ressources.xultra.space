import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import HomeScreen from '../screens/HomeScreen';

jest.mock('../AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

test('greets the logged-in user by name', async () => {
  mockedUseAuth.mockReturnValue({ user: { name: 'Alice', email: 'alice@example.com' }, logout: jest.fn() });
  const { getByText } = await render(<HomeScreen />);
  expect(getByText(/Alice/)).toBeTruthy();
});

test('falls back to the email when no display name is set', async () => {
  mockedUseAuth.mockReturnValue({ user: { name: '', email: 'noname@example.com' }, logout: jest.fn() });
  const { getByText } = await render(<HomeScreen />);
  expect(getByText(/noname@example.com/)).toBeTruthy();
});

test('tapping "Se déconnecter" calls logout', async () => {
  const logout = jest.fn();
  mockedUseAuth.mockReturnValue({ user: { name: 'Alice' }, logout });
  const { getByTestId } = await render(<HomeScreen />);
  await fireEvent.press(getByTestId('logout-button'));
  expect(logout).toHaveBeenCalledTimes(1);
});
