import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { account } from '../appwrite';
import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('../appwrite', () => ({
  account: {
    get: jest.fn(),
    createEmailPasswordSession: jest.fn(),
    deleteSession: jest.fn(),
  },
}));

const mockedAccount = account as jest.Mocked<typeof account>;

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('settles to no-user, not-loading when there is no existing session', async () => {
  mockedAccount.get.mockRejectedValueOnce(new Error('no session'));
  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user).toBeNull();
});

test('an existing valid session is picked up automatically on mount (no re-login needed)', async () => {
  mockedAccount.get.mockResolvedValueOnce({ $id: 'u1', name: 'Alice', email: 'alice@example.com' } as any);
  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user?.name).toBe('Alice');
});

test('login() creates a session then loads the fresh user, clearing any previous error', async () => {
  mockedAccount.get
    .mockRejectedValueOnce(new Error('no session')) // initial mount check
    .mockResolvedValueOnce({ $id: 'u2', name: 'Bob', email: 'bob@example.com' } as any); // after login
  mockedAccount.createEmailPasswordSession.mockResolvedValueOnce({} as any);

  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));

  await act(async () => {
    await result.current.login('bob@example.com', 'password123');
  });

  expect(mockedAccount.createEmailPasswordSession).toHaveBeenCalledWith('bob@example.com', 'password123');
  expect(result.current.user?.name).toBe('Bob');
  expect(result.current.error).toBeNull();
});

test('a failed login surfaces a readable error and never sets a user', async () => {
  mockedAccount.get.mockRejectedValueOnce(new Error('no session'));
  mockedAccount.createEmailPasswordSession.mockRejectedValueOnce(new Error('Invalid credentials'));

  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));

  await act(async () => {
    await expect(result.current.login('bob@example.com', 'wrong')).rejects.toThrow();
  });

  expect(result.current.user).toBeNull();
  expect(result.current.error).toBe('Invalid credentials');
});

test('logout() clears the local user even if the server session is already gone', async () => {
  mockedAccount.get.mockResolvedValueOnce({ $id: 'u1', name: 'Alice' } as any);
  mockedAccount.deleteSession.mockRejectedValueOnce(new Error('session already expired'));

  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.user).not.toBeNull());

  await act(async () => {
    await result.current.logout();
  });

  expect(result.current.user).toBeNull();
});
