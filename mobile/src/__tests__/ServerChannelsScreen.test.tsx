import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import * as servers from '../servers';
import ServerChannelsScreen from '../screens/ServerChannelsScreen';

jest.mock('../servers', () => {
  const actual = jest.requireActual('../servers');
  return { ...actual, loadServerChannels: jest.fn() };
});

const mockedServers = servers as jest.Mocked<typeof servers>;

const SERVER: servers.Server = { $id: 's1', name: 'The Cave', ownerId: 'u1' };

function renderScreen(overrides: Partial<React.ComponentProps<typeof ServerChannelsScreen>> = {}) {
  return render(
    <ServerChannelsScreen
      server={SERVER}
      onOpenChannel={jest.fn()}
      onOpenForum={jest.fn()}
      onOpenVoice={jest.fn()}
      onBack={jest.fn()}
      {...overrides}
    />,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('shows an empty state when the server has no visible channel', async () => {
  mockedServers.loadServerChannels.mockResolvedValueOnce([]);
  const { getByTestId } = await renderScreen();
  await waitFor(() => expect(getByTestId('server-channels-empty')).toBeTruthy());
});

test('tapping a text or announcement channel calls onOpenChannel only', async () => {
  mockedServers.loadServerChannels.mockResolvedValueOnce([
    { $id: 'c1', serverId: 's1', name: 'général', type: 'text', position: 0 },
  ]);
  const onOpenChannel = jest.fn();
  const onOpenForum = jest.fn();
  const onOpenVoice = jest.fn();
  const { getByTestId } = await renderScreen({ onOpenChannel, onOpenForum, onOpenVoice });
  await waitFor(() => expect(getByTestId('channel-row-c1')).toBeTruthy());
  await fireEvent.press(getByTestId('channel-row-c1'));
  expect(onOpenChannel).toHaveBeenCalledWith(expect.objectContaining({ $id: 'c1' }));
  expect(onOpenForum).not.toHaveBeenCalled();
  expect(onOpenVoice).not.toHaveBeenCalled();
});

test('tapping a forum channel calls onOpenForum only', async () => {
  mockedServers.loadServerChannels.mockResolvedValueOnce([
    { $id: 'c2', serverId: 's1', name: 'annonces-forum', type: 'forum', position: 0 },
  ]);
  const onOpenChannel = jest.fn();
  const onOpenForum = jest.fn();
  const onOpenVoice = jest.fn();
  const { getByTestId, getByText } = await renderScreen({ onOpenChannel, onOpenForum, onOpenVoice });
  await waitFor(() => expect(getByTestId('channel-row-c2')).toBeTruthy());
  expect(getByText('📋')).toBeTruthy();
  await fireEvent.press(getByTestId('channel-row-c2'));
  expect(onOpenForum).toHaveBeenCalledWith(expect.objectContaining({ $id: 'c2' }));
  expect(onOpenChannel).not.toHaveBeenCalled();
  expect(onOpenVoice).not.toHaveBeenCalled();
});

test('tapping a voice channel calls onOpenVoice only', async () => {
  mockedServers.loadServerChannels.mockResolvedValueOnce([
    { $id: 'c3', serverId: 's1', name: 'discussion vocale', type: 'voice', position: 0 },
  ]);
  const onOpenChannel = jest.fn();
  const onOpenForum = jest.fn();
  const onOpenVoice = jest.fn();
  const { getByTestId, getByText } = await renderScreen({ onOpenChannel, onOpenForum, onOpenVoice });
  await waitFor(() => expect(getByTestId('channel-row-c3')).toBeTruthy());
  expect(getByText('🔊')).toBeTruthy();
  await fireEvent.press(getByTestId('channel-row-c3'));
  expect(onOpenVoice).toHaveBeenCalledWith(expect.objectContaining({ $id: 'c3' }));
  expect(onOpenChannel).not.toHaveBeenCalled();
  expect(onOpenForum).not.toHaveBeenCalled();
});

test('the back button calls onBack', async () => {
  mockedServers.loadServerChannels.mockResolvedValueOnce([]);
  const onBack = jest.fn();
  const { getByTestId } = await renderScreen({ onBack });
  await fireEvent.press(getByTestId('server-channels-back-button'));
  expect(onBack).toHaveBeenCalled();
});
