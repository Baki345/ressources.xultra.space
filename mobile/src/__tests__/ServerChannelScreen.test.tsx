import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import * as servers from '../servers';
import ServerChannelScreen from '../screens/ServerChannelScreen';

jest.mock('../AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../servers', () => {
  const actual = jest.requireActual('../servers');
  return { ...actual, loadChannelMessages: jest.fn(), sendChannelText: jest.fn() };
});

const mockedUseAuth = useAuth as jest.Mock;
const mockedServers = servers as jest.Mocked<typeof servers>;

const SERVER: servers.Server = { $id: 's1', name: 'The Cave', ownerId: 'u1' };
const CHANNEL: servers.ServerChannel = { $id: 'c1', serverId: 's1', name: 'général', type: 'text', position: 0 };
const THREAD: servers.ServerThread = {
  $id: 't1', serverId: 's1', channelId: 'c1', name: 'Bienvenue sur le forum',
  creatorUid: 'u2', private: false, archived: false, originMessageId: 'm1', $createdAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'u1', name: 'Alice' } });
  mockedServers.loadChannelMessages.mockResolvedValue([]);
});

test('shows the channel name in the header and loads without a threadId for a text channel', async () => {
  const { getByText } = await render(
    <ServerChannelScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByText('# général')).toBeTruthy());
  expect(mockedServers.loadChannelMessages).toHaveBeenCalledWith('s1', 'c1', undefined);
});

test('shows the post title in the header and scopes load/send to the thread, for a forum post', async () => {
  mockedServers.sendChannelText.mockResolvedValueOnce(undefined);
  const forumChannel: servers.ServerChannel = { $id: 'c2', serverId: 's1', name: 'discussions', type: 'forum', position: 0 };
  const { getByText, getByTestId } = await render(
    <ServerChannelScreen server={SERVER} channel={forumChannel} thread={THREAD} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByText('📋 Bienvenue sur le forum')).toBeTruthy());
  expect(mockedServers.loadChannelMessages).toHaveBeenCalledWith('s1', 'c2', 't1');

  await fireEvent.changeText(getByTestId('server-channel-input'), 'Je suis d\'accord !');
  await fireEvent.press(getByTestId('server-channel-send-button'));
  await waitFor(() => expect(mockedServers.sendChannelText).toHaveBeenCalledWith('s1', 'c2', 'Je suis d\'accord !', 't1'));
});

test('renders messages, distinguishing mine from theirs', async () => {
  mockedServers.loadChannelMessages.mockResolvedValueOnce([
    { $id: 'm1', channelId: 'c1', serverId: 's1', uid: 'u2', username: 'Bob', text: 'Salut !', $createdAt: '2026-01-01T00:00:00.000Z' },
    { $id: 'm2', channelId: 'c1', serverId: 's1', uid: 'u1', username: 'Alice', text: 'Coucou', $createdAt: '2026-01-01T00:01:00.000Z' },
  ]);
  const { getByTestId, getByText } = await render(
    <ServerChannelScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByTestId('server-channel-message-m1')).toBeTruthy());
  expect(getByText('Bob')).toBeTruthy();
  expect(getByText('Salut !')).toBeTruthy();
  expect(getByText('Coucou')).toBeTruthy();
});

test('sending a text message clears the draft and refreshes', async () => {
  mockedServers.sendChannelText.mockResolvedValueOnce(undefined);
  const { getByTestId } = await render(
    <ServerChannelScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByTestId('server-channel-input')).toBeTruthy());
  await fireEvent.changeText(getByTestId('server-channel-input'), 'Salut le salon');
  await fireEvent.press(getByTestId('server-channel-send-button'));
  await waitFor(() => expect(mockedServers.sendChannelText).toHaveBeenCalledWith('s1', 'c1', 'Salut le salon', undefined));
  await waitFor(() => expect(getByTestId('server-channel-input').props.value).toBe(''));
});

test('a failed send surfaces an error and keeps the draft', async () => {
  mockedServers.sendChannelText.mockRejectedValueOnce(new Error('Tu es en timeout'));
  const { getByTestId, getByText } = await render(
    <ServerChannelScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByTestId('server-channel-input')).toBeTruthy());
  await fireEvent.changeText(getByTestId('server-channel-input'), 'Salut');
  await fireEvent.press(getByTestId('server-channel-send-button'));
  await waitFor(() => expect(getByText('Tu es en timeout')).toBeTruthy());
  expect(getByTestId('server-channel-input').props.value).toBe('Salut');
});

test('going back calls onBack', async () => {
  const onBack = jest.fn();
  const { getByTestId } = await render(
    <ServerChannelScreen server={SERVER} channel={CHANNEL} onBack={onBack} />,
  );
  await fireEvent.press(getByTestId('server-channel-back-button'));
  expect(onBack).toHaveBeenCalled();
});
