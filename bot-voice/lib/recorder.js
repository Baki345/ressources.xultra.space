'use strict';
// Enregistrement du vocal : un fichier .wav séparé par personne (pas de
// mixage — plus simple, plus fiable, et ça laisse le montage à qui en a
// besoin). IXin ne fournit aucune brique d'enregistrement (pas d'Egress
// LiveKit exposé) : ce module s'abonne lui-même aux pistes audio des autres
// participants du salon et les écrit sur disque au fil de l'eau.
const fs = require('fs');
const path = require('path');
const { AudioStream, RoomEvent, TrackKind } = require('@livekit/rtc-node');

const REC_SAMPLE_RATE = 48000;
const REC_CHANNELS = 1; // une voix = mono, suffisant et 2x plus léger que stéréo
const BITS_PER_SAMPLE = 16;

function safeName(s) {
  return String(s || 'inconnu').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
}

class WavWriter {
  constructor(filePath) {
    this.filePath = filePath;
    this.fd = fs.openSync(filePath, 'w');
    this.dataBytes = 0;
    this._writeHeader();
  }
  _writeHeader() {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(0, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM
    header.writeUInt16LE(REC_CHANNELS, 22);
    header.writeUInt32LE(REC_SAMPLE_RATE, 24);
    const byteRate = REC_SAMPLE_RATE * REC_CHANNELS * (BITS_PER_SAMPLE / 8);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(REC_CHANNELS * (BITS_PER_SAMPLE / 8), 32);
    header.writeUInt16LE(BITS_PER_SAMPLE, 34);
    header.write('data', 36);
    header.writeUInt32LE(0, 40);
    fs.writeSync(this.fd, header, 0, 44, 0);
  }
  write(buf) {
    fs.writeSync(this.fd, buf);
    this.dataBytes += buf.length;
  }
  close() {
    const riffSize = Buffer.alloc(4); riffSize.writeUInt32LE(36 + this.dataBytes, 0);
    fs.writeSync(this.fd, riffSize, 0, 4, 4);
    const dataSize = Buffer.alloc(4); dataSize.writeUInt32LE(this.dataBytes, 0);
    fs.writeSync(this.fd, dataSize, 0, 4, 40);
    fs.closeSync(this.fd);
  }
}

class Recorder {
  constructor(room, baseDir) {
    this.room = room;
    this.baseDir = baseDir;
    this.active = false;
    this.entries = new Map(); // identity -> { writer, reader, path }
    this._onSub = this._onSub.bind(this);
    this._onUnsub = this._onUnsub.bind(this);
  }

  start() {
    if (this.active) return this.sessionDir;
    this.active = true;
    this.sessionDir = path.join(this.baseDir, new Date().toISOString().replace(/[:.]/g, '-'));
    fs.mkdirSync(this.sessionDir, { recursive: true });
    // Les participants déjà connectés au moment du /record start ont leurs
    // pistes déjà souscrites (autoSubscribe:true) — on les rattrape ici.
    for (const rp of this.room.remoteParticipants.values()) {
      for (const pub of rp.trackPublications.values()) {
        if (pub.kind === TrackKind.KIND_AUDIO && pub.track) this._attach(rp, pub.track);
      }
    }
    this.room.on(RoomEvent.TrackSubscribed, this._onSub);
    this.room.on(RoomEvent.TrackUnsubscribed, this._onUnsub);
    return this.sessionDir;
  }

  _onSub(track, publication, participant) {
    if (!this.active || publication.kind !== TrackKind.KIND_AUDIO) return;
    this._attach(participant, track);
  }

  _onUnsub(track, publication, participant) {
    this._detach(participant.identity);
  }

  _attach(participant, track) {
    const identity = participant.identity;
    if (this.entries.has(identity)) return; // déjà en cours pour cette personne
    const filePath = path.join(this.sessionDir, safeName(participant.name || identity) + '.wav');
    const writer = new WavWriter(filePath);
    const stream = new AudioStream(track, REC_SAMPLE_RATE, REC_CHANNELS);
    const reader = stream.getReader();
    const entry = { writer: writer, reader: reader, path: filePath, stopped: false };
    this.entries.set(identity, entry);
    (async function pump() {
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done || entry.stopped) break;
          writer.write(Buffer.from(value.data.buffer, value.data.byteOffset, value.data.byteLength));
        }
      } catch (e) { /* piste coupée (départ du salon) — on finalise juste le fichier */ }
    })();
  }

  _detach(identity) {
    const entry = this.entries.get(identity);
    if (!entry) return;
    entry.stopped = true;
    try { entry.reader.cancel(); } catch (e) {}
    try { entry.writer.close(); } catch (e) {}
    this.entries.delete(identity);
  }

  stop() {
    if (!this.active) return { dir: null, files: [] };
    this.active = false;
    this.room.off(RoomEvent.TrackSubscribed, this._onSub);
    this.room.off(RoomEvent.TrackUnsubscribed, this._onUnsub);
    const files = [];
    for (const identity of Array.from(this.entries.keys())) {
      const entry = this.entries.get(identity);
      files.push(entry.path);
      this._detach(identity);
    }
    return { dir: this.sessionDir, files: files };
  }
}

module.exports = { Recorder };
