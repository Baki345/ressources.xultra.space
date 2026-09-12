'use strict';
const { Room, RoomEvent, AudioSource, LocalAudioTrack, TrackSource } = require('@livekit/rtc-node');
const { LIVEKIT_WS_URL } = require('./env');

const SAMPLE_RATE = 48000;
const CHANNELS = 2; // stereo — la musique en profite, la voix des humains suit le même flux LiveKit indépendamment

// Rejoint le salon LiveKit désigné par le jeton et publie tout de suite une
// piste audio locale (silencieuse tant que rien n'est joué) : c'est ce flux
// que player.js remplit avec la musique. Retourne tout ce dont le reste du
// bot a besoin pour ce salon (room pour s'abonner aux autres participants,
// source pour y pousser de l'audio, disconnect pour repartir proprement).
async function joinVoice(token) {
  const room = new Room();
  await room.connect(LIVEKIT_WS_URL, token, { autoSubscribe: true, dynacast: true });
  const source = new AudioSource(SAMPLE_RATE, CHANNELS);
  const track = LocalAudioTrack.createAudioTrack('musique', source);
  await room.localParticipant.publishTrack(track, { source: TrackSource.SOURCE_MICROPHONE });
  return { room: room, source: source };
}

async function leaveVoice(room) {
  try { await room.disconnect(); } catch (e) { /* déjà déconnecté, tant pis */ }
}

module.exports = { joinVoice, leaveVoice, RoomEvent, SAMPLE_RATE, CHANNELS };
