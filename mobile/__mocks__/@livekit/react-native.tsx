// Mock manuel automatique (voir https://jestjs.io/docs/manual-mocks#mocking-node-modules) :
// @livekit/react-native embarque du code natif WebRTC absent sous Jest (Node),
// donc TOUT fichier qui l'importe — même transitivement, comme App.tsx via
// ServerVoiceScreen.tsx — doit passer par ce mock plutôt que le vrai module.
// Un test qui a réellement besoin de contrôler ce module (ServerVoiceScreen.test.tsx)
// pose son propre jest.mock('@livekit/react-native', ...), qui prend le pas
// sur celui-ci pour ce fichier précis.
import React from 'react';

export function registerGlobals() {}

export const AudioSession = {
  startAudioSession: jest.fn().mockResolvedValue(undefined),
  stopAudioSession: jest.fn().mockResolvedValue(undefined),
};

export function LiveKitRoom({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function useLocalParticipant() {
  return {
    isMicrophoneEnabled: true,
    isScreenShareEnabled: false,
    isCameraEnabled: false,
    microphoneTrack: undefined,
    cameraTrack: undefined,
    lastMicrophoneError: undefined,
    lastCameraError: undefined,
    localParticipant: { setMicrophoneEnabled: jest.fn().mockResolvedValue(undefined) },
  };
}

export function useParticipants() {
  return [];
}

export function useConnectionState() {
  return 'connected';
}

export function useRoomContext() {
  return { disconnect: jest.fn().mockResolvedValue(undefined) };
}
