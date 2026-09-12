import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import LoginScreen from '../screens/LoginScreen';

jest.mock('../AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test('the submit button stays disabled until both fields look plausible', async () => {
  const login = jest.fn();
  mockedUseAuth.mockReturnValue({ login, error: null });
  const { getByTestId } = await render(<LoginScreen />);

  expect(getByTestId('login-submit').props.accessibilityState?.disabled).toBe(true);

  await fireEvent.changeText(getByTestId('login-email'), 'a@b.co');
  await fireEvent.changeText(getByTestId('login-password'), 'short');
  expect(getByTestId('login-submit').props.accessibilityState?.disabled).toBe(true);

  await fireEvent.changeText(getByTestId('login-password'), 'longenough1');
  expect(getByTestId('login-submit').props.accessibilityState?.disabled).toBe(false);
});

test('submitting valid credentials calls login with the trimmed email and typed password', async () => {
  const login = jest.fn().mockResolvedValue(undefined);
  mockedUseAuth.mockReturnValue({ login, error: null });
  const { getByTestId } = await render(<LoginScreen />);

  await fireEvent.changeText(getByTestId('login-email'), '  a@b.co  ');
  await fireEvent.changeText(getByTestId('login-password'), 'longenough1');
  await fireEvent.press(getByTestId('login-submit'));

  await waitFor(() => expect(login).toHaveBeenCalledWith('a@b.co', 'longenough1'));
});

test('an auth error from the context is shown to the user, not swallowed silently', async () => {
  mockedUseAuth.mockReturnValue({ login: jest.fn(), error: 'Invalid credentials' });
  const { getByTestId } = await render(<LoginScreen />);
  expect(getByTestId('login-error').props.children).toBe('Invalid credentials');
});
