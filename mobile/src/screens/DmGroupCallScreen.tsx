import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AudioSession,
  LiveKitRoom,
  useConnectionState,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/react-native';

import { useAuth } from '../AuthContext';
import {
  fetchGroupCallToken,
  joinGroupCallPresence,
  leaveGroupCallPresence,
  loadGroupCallPresence,
  sendGroupCallHeartbeat,
  type GroupCallPresence,
} from '../dmCalls';
import { dmTitle } from './DmListScreen';
import type { DmThread } from '../dms';

const HEARTBEAT_MS = 60000;
const PRESENCE_POLL_MS = 5000;

interface Props {
  dm: DmThread;
  onBack: () => void;
}

/** Appel vocal de groupe en DM (audio seul, voir src/dmCalls.ts pour la
 * portée exacte) — même architecture LiveKit que les salons vocaux de
 * serveur (src/voice.ts + ServerVoiceScreen.tsx), room `xu-dm-<dmId>` au
 * lieu de `xu-channel-<channelId>`. Nécessite une vraie build de
 * développement EAS, jamais Expo Go (voir mobile/README.md). */
export default function DmGroupCallScreen({ dm, onBack }: Props) {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const docIdRef = useRef<string | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await AudioSession.startAudioSession();
        const res = await fetchGroupCallToken(dm.$id);
        if (cancelled) return;
        setToken(res.token);
        setWsUrl(res.wsUrl);
        try {
          const pres = await joinGroupCallPresence(dm.$id);
          docIdRef.current = pres.docId;
          const displayName = (user && (user.name || user.email)) || 'Membre';
          heartbeatRef.current = setInterval(() => {
            if (docIdRef.current) sendGroupCallHeartbeat(docIdRef.current, displayName).catch(() => {});
          }, HEARTBEAT_MS);
        } catch {
          // Présence best-effort, comme côté web : un échec ne doit pas
          // empêcher de rester connecté à l'appel audio lui-même.
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Impossible de rejoindre l'appel.");
      } finally {
        if (!cancelled) setConnecting(false);
      }
    })();
    return () => {
      cancelled = true;
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (docIdRef.current) leaveGroupCallPresence(docIdRef.current).catch(() => {});
      AudioSession.stopAudioSession().catch(() => {});
    };
  }, [dm.$id, user]);

  // Un seul chemin de retour, que la déconnexion soit volontaire (bouton
  // Quitter -> room.disconnect() dans GroupCallContent) ou subie (perte
  // réseau) : LiveKitRoom émet onDisconnected dans les deux cas.
  const onRoomError = useCallback(
    (e: Error) => {
      Alert.alert('Appel de groupe', e.message || "La connexion a été interrompue.");
      onBack();
    },
    [onBack]
  );

  if (connecting) {
    return (
      <View style={styles.center} testID="dm-call-connecting">
        <ActivityIndicator color="#7c3aed" size="large" />
        <Text style={styles.connectingText}>Connexion à l'appel...</Text>
      </View>
    );
  }

  if (error || !token || !wsUrl) {
    return (
      <View style={styles.center}>
        <Text style={styles.error} testID="dm-call-error">
          {error || "Impossible de rejoindre l'appel."}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack} testID="dm-call-error-back-button">
          <Text style={styles.backButtonText}>‹ Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LiveKitRoom serverUrl={wsUrl} token={token} audio connect onDisconnected={onBack} onError={onRoomError}>
      <GroupCallContent dm={dm} myUid={user!.$id} />
    </LiveKitRoom>
  );
}

function GroupCallContent({ dm, myUid }: { dm: DmThread; myUid: string }) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const [presence, setPresence] = useState<GroupCallPresence[]>([]);

  const refreshPresence = useCallback(async () => {
    try {
      setPresence(await loadGroupCallPresence(dm.$id));
    } catch {
      // best-effort — un raté de lecture n'empêche pas de rester dans l'appel
    }
  }, [dm.$id]);

  useEffect(() => {
    refreshPresence();
    const iv = setInterval(refreshPresence, PRESENCE_POLL_MS);
    return () => clearInterval(iv);
  }, [refreshPresence]);

  const onToggleMic = useCallback(() => {
    localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled).catch(() => {});
  }, [localParticipant, isMicrophoneEnabled]);

  const onLeave = useCallback(() => {
    room.disconnect().catch(() => {});
  }, [room]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          🎙️ {dmTitle(dm, myUid)}
        </Text>
        <Text style={styles.connectionState} testID="dm-call-connection-state">
          {connectionState === 'connected' ? 'Connecté' : connectionState === 'reconnecting' ? 'Reconnexion...' : 'Connexion...'}
        </Text>
      </View>

      <FlatList
        data={presence}
        keyExtractor={(p) => p.$id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty} testID="dm-call-empty">
            Tu es seul(e) dans cet appel pour l'instant.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.participantRow} testID={`call-participant-${item.uid}`}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(item.username || '?').slice(0, 1).toUpperCase()}</Text>
            </View>
            <Text style={styles.participantName} numberOfLines={1}>
              {item.username}
              {item.uid === myUid ? ' (toi)' : ''}
            </Text>
          </View>
        )}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, !isMicrophoneEnabled && styles.controlButtonMuted]}
          onPress={onToggleMic}
          testID="dm-call-mic-button"
        >
          <Text style={styles.controlButtonText}>{isMicrophoneEnabled ? '🎙️ Micro' : '🔇 Coupé'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.leaveButton} onPress={onLeave} testID="dm-call-leave-button">
          <Text style={styles.leaveButtonText}>Quitter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0814' },
  center: { flex: 1, backgroundColor: '#0d0814', alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 24 },
  connectingText: { color: '#9c8fb0', fontSize: 14 },
  error: { color: '#fca5a5', textAlign: 'center', fontSize: 14 },
  backButton: { backgroundColor: '#1a1030', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10 },
  backButtonText: { color: '#c4b5fd', fontWeight: '700' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: { color: '#f2ebff', fontSize: 18, fontWeight: '700' },
  connectionState: { color: '#9c8fb0', fontSize: 12, fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingVertical: 8, gap: 4, flexGrow: 1 },
  empty: { color: '#9c8fb0', textAlign: 'center', marginTop: 48 },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#c4b5fd', fontWeight: '700' },
  participantName: { color: '#f2ebff', fontSize: 15, fontWeight: '600', flex: 1 },
  controls: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1030',
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#1a1030',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  controlButtonMuted: { backgroundColor: 'rgba(252,165,165,.15)' },
  controlButtonText: { color: '#f2ebff', fontWeight: '700' },
  leaveButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  leaveButtonText: { color: '#fff', fontWeight: '700' },
});
