import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import * as dmCalls from '../dmCalls';
import DmGroupCallScreen from '../screens/DmGroupCallScreen';
import type { DmThread } from '../dms';

const mockStartAudioSession = jest.fn();
const mockStopAudioSession = jest.fn();
const mockSetMicrophoneEnabled = jest.fn();
const mockDisconnect = jest.fn();
const mockOnLiveKitRoomRender = jest.fn();

jest.mock('@livekit/react-native', () => ({
  registerGlobals: jest.fn(),
  AudioSession: {
    startAudioSession: (...args: unknown[]) => mockStartAudioSession(...args),
    stopAudioSession: (...args: unknown[]) => mockStopAudioSession(...args),
  },
  LiveKitRoom: (props: { children?: React.ReactNode }) => {
    mockOnLiveKitRoomRender(props);
    return props.children;
  },
  useLocalParticipant: () => ({
    isMicrophoneEnabled: true,
    localParticipant: { setMicrophoneEnabled: (...args: unknown[]) => mockSetMicrophoneEnabled(...args) },
  }),
  useRoomContext: () => ({ disconnect: (...args: unknown[]) => mockDisconnect(...args) }),
  useConnectionState: () => 'connected',
}));

jest.mock('../AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../dmCalls', () => ({
  fetchGroupCallToken: jest.fn(),
  joinGroupCallPresence: jest.fn(),
  leaveGroupCallPresence: jest.fn(),
  loadGroupCallPresence: jest.fn(),
  sendGroupCallHeartbeat: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedDmCalls = dmCalls as jest.Mocked<typeof dmCalls>;

const GROUP_DM: DmThread = { $id: 'd1', members: ['u1', 'u2', 'u3'], displayName: 'Le trio', $updatedAt: '2026-01-01T00:00:00.000Z' };
const TOKEN = { token: 'jwt', wsUrl: 'wss://voice.xultra.space', room: 'xu-dm-d1' };

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'u1', name: 'Alice' } });
  mockedDmCalls.fetchGroupCallToken.mockResolvedValue(TOKEN);
  mockedDmCalls.joinGroupCallPresence.mockResolvedValue({ docId: 'gcp_abc' });
  mockedDmCalls.loadGroupCallPresence.mockResolvedValue([]);
  mockedDmCalls.leaveGroupCallPresence.mockResolvedValue(undefined);
  mockedDmCalls.sendGroupCallHeartbeat.mockResolvedValue(undefined);
  mockStartAudioSession.mockResolvedValue(undefined);
  mockStopAudioSession.mockResolvedValue(undefined);
  mockSetMicrophoneEnabled.mockResolvedValue(undefined);
  mockDisconnect.mockResolvedValue(undefined);
});

test('joins on mount: starts the audio session, fetches a token, then joins presence', async () => {
  const { getByTestId } = await render(<DmGroupCallScreen dm={GROUP_DM} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('dm-call-mic-button')).toBeTruthy());

  expect(mockStartAudioSession).toHaveBeenCalledTimes(1);
  expect(mockedDmCalls.fetchGroupCallToken).toHaveBeenCalledWith('d1');
  expect(mockedDmCalls.joinGroupCallPresence).toHaveBeenCalledWith('d1');

  const roomProps = mockOnLiveKitRoomRender.mock.calls[mockOnLiveKitRoomRender.mock.calls.length - 1][0];
  expect(roomProps.serverUrl).toBe(TOKEN.wsUrl);
  expect(roomProps.token).toBe(TOKEN.token);
});

test('sends a heartbeat every 60s while connected, using my presence doc id', async () => {
  jest.useFakeTimers();
  const { getByTestId } = await render(<DmGroupCallScreen dm={GROUP_DM} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('dm-call-mic-button')).toBeTruthy());

  await act(async () => {
    jest.advanceTimersByTime(60000);
  });
  expect(mockedDmCalls.sendGroupCallHeartbeat).toHaveBeenCalledWith('gcp_abc', 'Alice');
  jest.useRealTimers();
});

test('leaving (unmount) stops the audio session and deletes my presence doc', async () => {
  const { getByTestId, unmount } = await render(<DmGroupCallScreen dm={GROUP_DM} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('dm-call-mic-button')).toBeTruthy());

  unmount();
  await waitFor(() => expect(mockStopAudioSession).toHaveBeenCalledTimes(1));
  expect(mockedDmCalls.leaveGroupCallPresence).toHaveBeenCalledWith('gcp_abc');
});

test('shows an error screen when the token request fails, and the back button calls onBack', async () => {
  mockedDmCalls.fetchGroupCallToken.mockRejectedValueOnce(new Error("Tu n'es pas membre de ce groupe"));
  const onBack = jest.fn();
  const { getByTestId, getByText } = await render(<DmGroupCallScreen dm={GROUP_DM} onBack={onBack} />);

  await waitFor(() => expect(getByText("Tu n'es pas membre de ce groupe")).toBeTruthy());
  await fireEvent.press(getByTestId('dm-call-error-back-button'));
  expect(onBack).toHaveBeenCalled();
  expect(mockOnLiveKitRoomRender).not.toHaveBeenCalled();
});

test('wires onDisconnected to onBack', async () => {
  const onBack = jest.fn();
  const { getByTestId } = await render(<DmGroupCallScreen dm={GROUP_DM} onBack={onBack} />);
  await waitFor(() => expect(getByTestId('dm-call-mic-button')).toBeTruthy());

  const roomProps = mockOnLiveKitRoomRender.mock.calls[mockOnLiveKitRoomRender.mock.calls.length - 1][0];
  roomProps.onDisconnected();
  expect(onBack).toHaveBeenCalledTimes(1);
});

test('toggling the mic calls setMicrophoneEnabled', async () => {
  const { getByTestId } = await render(<DmGroupCallScreen dm={GROUP_DM} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('dm-call-mic-button')).toBeTruthy());

  await fireEvent.press(getByTestId('dm-call-mic-button'));
  expect(mockSetMicrophoneEnabled).toHaveBeenCalledWith(false);
});

test('the Quitter button disconnects the room', async () => {
  const { getByTestId } = await render(<DmGroupCallScreen dm={GROUP_DM} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('dm-call-leave-button')).toBeTruthy());

  await fireEvent.press(getByTestId('dm-call-leave-button'));
  expect(mockDisconnect).toHaveBeenCalledTimes(1);
});

test('shows the presence list, marking my own row', async () => {
  mockedDmCalls.loadGroupCallPresence.mockResolvedValueOnce([
    { $id: 'gcp1', dmId: 'd1', uid: 'u1', username: 'Alice', $updatedAt: '2026-01-01T00:00:00.000Z' },
    { $id: 'gcp2', dmId: 'd1', uid: 'u2', username: 'Bob', $updatedAt: '2026-01-01T00:00:00.000Z' },
  ]);
  const { getByText, getByTestId } = await render(<DmGroupCallScreen dm={GROUP_DM} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('call-participant-u1')).toBeTruthy());
  expect(getByText('Alice (toi)')).toBeTruthy();
  expect(getByText('Bob')).toBeTruthy();
});
