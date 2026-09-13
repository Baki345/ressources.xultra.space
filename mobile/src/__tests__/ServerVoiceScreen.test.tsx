import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuth } from '../AuthContext';
import * as voice from '../voice';
import ServerVoiceScreen from '../screens/ServerVoiceScreen';
import type { Server, ServerChannel } from '../servers';

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
jest.mock('../voice', () => ({
  fetchVoiceToken: jest.fn(),
  joinVoicePresence: jest.fn(),
  leaveVoicePresence: jest.fn(),
  loadVoicePresence: jest.fn(),
  sendVoiceHeartbeat: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedVoice = voice as jest.Mocked<typeof voice>;

const SERVER: Server = { $id: 's1', name: 'The Cave', ownerId: 'u1' };
const CHANNEL: ServerChannel = { $id: 'c1', serverId: 's1', name: 'discussion-vocale', type: 'voice', position: 0 };
const TOKEN = { token: 'jwt', wsUrl: 'wss://voice.xultra.space', room: 'xu-channel-c1', canPublish: true, audioQualityKey: 'standard' };

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAuth.mockReturnValue({ user: { $id: 'u1', name: 'Alice' } });
  mockedVoice.fetchVoiceToken.mockResolvedValue(TOKEN);
  mockedVoice.joinVoicePresence.mockResolvedValue({ docId: 'vp_abc' });
  mockedVoice.loadVoicePresence.mockResolvedValue([]);
  mockedVoice.leaveVoicePresence.mockResolvedValue(undefined);
  mockedVoice.sendVoiceHeartbeat.mockResolvedValue(undefined);
  mockStartAudioSession.mockResolvedValue(undefined);
  mockStopAudioSession.mockResolvedValue(undefined);
  mockSetMicrophoneEnabled.mockResolvedValue(undefined);
  mockDisconnect.mockResolvedValue(undefined);
});

test('joins on mount: starts the audio session, fetches a token, then joins presence', async () => {
  const { getByTestId } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('server-voice-mic-button')).toBeTruthy());

  expect(mockStartAudioSession).toHaveBeenCalledTimes(1);
  expect(mockedVoice.fetchVoiceToken).toHaveBeenCalledWith('s1', 'c1');
  expect(mockedVoice.joinVoicePresence).toHaveBeenCalledWith('s1', 'c1');

  const roomProps = mockOnLiveKitRoomRender.mock.calls[mockOnLiveKitRoomRender.mock.calls.length - 1][0];
  expect(roomProps.serverUrl).toBe(TOKEN.wsUrl);
  expect(roomProps.token).toBe(TOKEN.token);
});

test('sends a heartbeat every 60s while connected, using my presence doc id', async () => {
  jest.useFakeTimers();
  const { getByTestId } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('server-voice-mic-button')).toBeTruthy());

  await act(async () => {
    jest.advanceTimersByTime(60000);
  });
  expect(mockedVoice.sendVoiceHeartbeat).toHaveBeenCalledWith('vp_abc', 'Alice');
  jest.useRealTimers();
});

test('does not start a heartbeat when joining presence fails, but still connects to the room', async () => {
  jest.useFakeTimers();
  mockedVoice.joinVoicePresence.mockRejectedValueOnce(new Error('boom'));
  const { getByTestId } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('server-voice-mic-button')).toBeTruthy());

  await act(async () => {
    jest.advanceTimersByTime(120000);
  });
  expect(mockedVoice.sendVoiceHeartbeat).not.toHaveBeenCalled();
  jest.useRealTimers();
});

test('leaving (unmount) stops the audio session and deletes my presence doc', async () => {
  const { getByTestId, unmount } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('server-voice-mic-button')).toBeTruthy());

  unmount();
  await waitFor(() => expect(mockStopAudioSession).toHaveBeenCalledTimes(1));
  expect(mockedVoice.leaveVoicePresence).toHaveBeenCalledWith('vp_abc');
});

test('shows an error screen when the token request fails, and the back button calls onBack', async () => {
  mockedVoice.fetchVoiceToken.mockRejectedValueOnce(new Error("Tu es en timeout, tu ne peux pas rejoindre le vocal pour le moment"));
  const onBack = jest.fn();
  const { getByTestId, getByText } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={onBack} />);

  await waitFor(() => expect(getByText('Tu es en timeout, tu ne peux pas rejoindre le vocal pour le moment')).toBeTruthy());
  await fireEvent.press(getByTestId('server-voice-error-back-button'));
  expect(onBack).toHaveBeenCalled();
  expect(mockOnLiveKitRoomRender).not.toHaveBeenCalled(); // jamais de connexion LiveKit sans jeton valide
});

test('wires onDisconnected to onBack, so any disconnection (voluntary or not) returns to the channel list', async () => {
  const onBack = jest.fn();
  const { getByTestId } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={onBack} />);
  await waitFor(() => expect(getByTestId('server-voice-mic-button')).toBeTruthy());

  const roomProps = mockOnLiveKitRoomRender.mock.calls[mockOnLiveKitRoomRender.mock.calls.length - 1][0];
  expect(roomProps.onDisconnected).toBe(onBack);
});

test('toggling the mic calls setMicrophoneEnabled', async () => {
  const { getByTestId } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('server-voice-mic-button')).toBeTruthy());

  await fireEvent.press(getByTestId('server-voice-mic-button'));
  expect(mockSetMicrophoneEnabled).toHaveBeenCalledWith(false); // isMicrophoneEnabled mocké à true -> on coupe
});

test('the Quitter button disconnects the room', async () => {
  const { getByTestId } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('server-voice-leave-button')).toBeTruthy());

  await fireEvent.press(getByTestId('server-voice-leave-button'));
  expect(mockDisconnect).toHaveBeenCalledTimes(1);
});

test('shows the presence list, marking my own row', async () => {
  mockedVoice.loadVoicePresence.mockResolvedValueOnce([
    { $id: 'vp1', serverId: 's1', channelId: 'c1', uid: 'u1', username: 'Alice', cameraOn: false, speaking: false, handRaised: false, $updatedAt: '2026-01-01T00:00:00.000Z' },
    { $id: 'vp2', serverId: 's1', channelId: 'c1', uid: 'u2', username: 'Bob', cameraOn: false, speaking: false, handRaised: true, $updatedAt: '2026-01-01T00:00:00.000Z' },
  ]);
  const { getByText, getByTestId } = await render(<ServerVoiceScreen server={SERVER} channel={CHANNEL} onBack={jest.fn()} />);
  await waitFor(() => expect(getByTestId('voice-participant-u1')).toBeTruthy());
  expect(getByText('Alice (toi)')).toBeTruthy();
  expect(getByText('Bob')).toBeTruthy();
});
