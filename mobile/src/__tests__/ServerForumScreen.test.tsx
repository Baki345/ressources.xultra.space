import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import * as servers from '../servers';
import ServerForumScreen from '../screens/ServerForumScreen';

jest.mock('../servers', () => {
  const actual = jest.requireActual('../servers');
  return { ...actual, loadForumPosts: jest.fn(), createForumPost: jest.fn() };
});

const mockedServers = servers as jest.Mocked<typeof servers>;

const SERVER: servers.Server = { $id: 's1', name: 'The Cave', ownerId: 'u1' };
const CHANNEL: servers.ServerChannel = { $id: 'c1', serverId: 's1', name: 'discussions', type: 'forum', position: 0 };

beforeEach(() => {
  jest.clearAllMocks();
});

test('shows an empty state when the forum has no post yet', async () => {
  mockedServers.loadForumPosts.mockResolvedValueOnce([]);
  const { getByTestId } = await render(
    <ServerForumScreen server={SERVER} channel={CHANNEL} onOpenThread={jest.fn()} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByTestId('server-forum-empty')).toBeTruthy());
});

test('lists posts, marking an archived one as closed', async () => {
  mockedServers.loadForumPosts.mockResolvedValueOnce([
    { $id: 't1', serverId: 's1', channelId: 'c1', name: 'Bienvenue', creatorUid: 'u1', private: false, archived: false, originMessageId: 'm1', $createdAt: '2026-01-01T00:00:00.000Z' },
    { $id: 't2', serverId: 's1', channelId: 'c1', name: 'Ancien débat', creatorUid: 'u1', private: false, archived: true, originMessageId: 'm2', $createdAt: '2026-01-01T00:00:00.000Z' },
  ]);
  const { getByTestId, getByText } = await render(
    <ServerForumScreen server={SERVER} channel={CHANNEL} onOpenThread={jest.fn()} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByTestId('forum-post-t1')).toBeTruthy());
  expect(getByText('Bienvenue')).toBeTruthy();
  expect(getByText('Ancien débat')).toBeTruthy();
  expect(getByText('Clos')).toBeTruthy();
});

test('tapping a post calls onOpenThread with it', async () => {
  const thread: servers.ServerThread = { $id: 't1', serverId: 's1', channelId: 'c1', name: 'Bienvenue', creatorUid: 'u1', private: false, archived: false, originMessageId: 'm1', $createdAt: '2026-01-01T00:00:00.000Z' };
  mockedServers.loadForumPosts.mockResolvedValueOnce([thread]);
  const onOpenThread = jest.fn();
  const { getByTestId } = await render(
    <ServerForumScreen server={SERVER} channel={CHANNEL} onOpenThread={onOpenThread} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByTestId('forum-post-t1')).toBeTruthy());
  await fireEvent.press(getByTestId('forum-post-t1'));
  expect(onOpenThread).toHaveBeenCalledWith(thread);
});

test('publishing a new post requires both a title and a body, then refreshes the list', async () => {
  mockedServers.loadForumPosts.mockResolvedValueOnce([]).mockResolvedValueOnce([
    { $id: 't1', serverId: 's1', channelId: 'c1', name: 'Mon post', creatorUid: 'u1', private: false, archived: false, originMessageId: 'm1', $createdAt: '2026-01-01T00:00:00.000Z' },
  ]);
  mockedServers.createForumPost.mockResolvedValueOnce({
    thread: { $id: 't1', serverId: 's1', channelId: 'c1', name: 'Mon post', creatorUid: 'u1', private: false, archived: false, originMessageId: 'm1', $createdAt: '2026-01-01T00:00:00.000Z' },
    message: { $id: 'm1', channelId: 'c1', serverId: 's1', uid: 'u1', username: 'Alice', text: 'Corps', threadId: 't1', $createdAt: '2026-01-01T00:00:00.000Z' },
  });

  const { getByTestId, getByText } = await render(
    <ServerForumScreen server={SERVER} channel={CHANNEL} onOpenThread={jest.fn()} onBack={jest.fn()} />,
  );
  await waitFor(() => expect(getByTestId('server-forum-new-post-button')).toBeTruthy());
  await fireEvent.press(getByTestId('server-forum-new-post-button'));

  expect(getByTestId('server-forum-publish-button').props.accessibilityState?.disabled).toBe(true);
  await fireEvent.changeText(getByTestId('server-forum-title-input'), 'Mon post');
  expect(getByTestId('server-forum-publish-button').props.accessibilityState?.disabled).toBe(true); // pas de corps

  await fireEvent.changeText(getByTestId('server-forum-body-input'), 'Corps');
  expect(getByTestId('server-forum-publish-button').props.accessibilityState?.disabled).toBe(false);

  await fireEvent.press(getByTestId('server-forum-publish-button'));
  await waitFor(() => expect(mockedServers.createForumPost).toHaveBeenCalledWith('s1', 'c1', 'Mon post', 'Corps'));
  await waitFor(() => expect(getByText('Mon post')).toBeTruthy());
});

test('a failed publish surfaces an error', async () => {
  mockedServers.loadForumPosts.mockResolvedValue([]);
  mockedServers.createForumPost.mockRejectedValueOnce(new Error('Post bloqué : contient un terme interdit sur ce serveur'));

  const { getByTestId, getByText } = await render(
    <ServerForumScreen server={SERVER} channel={CHANNEL} onOpenThread={jest.fn()} onBack={jest.fn()} />,
  );
  await fireEvent.press(getByTestId('server-forum-new-post-button'));
  await fireEvent.changeText(getByTestId('server-forum-title-input'), 'Titre');
  await fireEvent.changeText(getByTestId('server-forum-body-input'), 'gros mot');
  await fireEvent.press(getByTestId('server-forum-publish-button'));

  await waitFor(() => expect(getByText('Post bloqué : contient un terme interdit sur ce serveur')).toBeTruthy());
});

test('the back button calls onBack', async () => {
  mockedServers.loadForumPosts.mockResolvedValueOnce([]);
  const onBack = jest.fn();
  const { getByTestId } = await render(
    <ServerForumScreen server={SERVER} channel={CHANNEL} onOpenThread={jest.fn()} onBack={onBack} />,
  );
  await fireEvent.press(getByTestId('server-forum-back-button'));
  expect(onBack).toHaveBeenCalled();
});
