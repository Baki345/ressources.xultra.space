import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import App from '../../App';
import { account } from '../appwrite';

jest.mock('../appwrite', () => ({
  account: {
    get: jest.fn(),
    createEmailPasswordSession: jest.fn(),
    deleteSession: jest.fn(),
  },
}));

const mockedAccount = account as jest.Mocked<typeof account>;

test('shows a loading indicator while the initial session check is still pending', async () => {
  let resolveGet: (value: any) => void = () => {};
  mockedAccount.get.mockImplementation(() => new Promise((resolve) => { resolveGet = resolve; }));
  const { getByTestId } = await render(<App />);
  expect(getByTestId('app-loading')).toBeTruthy();
  resolveGet({ $id: 'u1', name: 'Alice' });
  await waitFor(() => expect(getByTestId('logout-button')).toBeTruthy());
});

test('shows the login screen once there is no session to restore', async () => {
  mockedAccount.get.mockRejectedValueOnce(new Error('no session'));
  const { getByTestId } = await render(<App />);
  await waitFor(() => expect(getByTestId('login-email')).toBeTruthy());
});

test('goes straight to the home screen when a session already exists (no forced re-login)', async () => {
  mockedAccount.get.mockResolvedValueOnce({ $id: 'u1', name: 'Alice' } as any);
  const { getByText } = await render(<App />);
  await waitFor(() => expect(getByText(/Alice/)).toBeTruthy());
});
