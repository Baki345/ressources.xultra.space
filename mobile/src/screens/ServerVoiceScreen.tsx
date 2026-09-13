import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AudioSession,
  LiveKitRoom,
  useConnectionState,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/react-native';

import { useAuth } from '../AuthContext';
import type { Server, ServerChannel } from '../servers';
import {
  addStageSpeaker,
  cancelSpeakRequest,
  declineSpeakRequest,
  fetchStageState,
  removeStageSpeaker,
  requestToSpeak,
  setStageTopic,
  type StageState,
} from '../stage';
import {
  fetchVoiceToken,
  joinVoicePresence,
  leaveVoicePresence,
  loadVoicePresence,
  sendVoiceHeartbeat,
  type VoicePresence,
} from '../voice';

const HEARTBEAT_MS = 60000;
const PRESENCE_POLL_MS = 5000;
const STAGE_POLL_MS = 5000;

interface Props {
  server: Server;
  channel: ServerChannel;
  onBack: () => void;
}

/** Salon vocal OU de scène de serveur (audio seul, voir src/voice.ts et
 * src/stage.ts pour la portée exacte) — connexion réelle via LiveKit
 * (@livekit/react-native), qui embarque du code natif WebRTC : ne
 * fonctionne QUE dans une vraie build de développement EAS, jamais sous
 * Expo Go (voir mobile/README.md et index.ts, registerGlobals()).
 *
 * Ce composant possède le cycle de connexion (jeton, présence, heartbeat,
 * audio session) — y compris sa RECONNEXION complète quand une scène me
 * fait passer public <-> orateur en cours d'appel (voir connectRoom() et le
 * commentaire de src/stage.ts : le droit de publier son micro est figé dans
 * le jeton LiveKit, l'obtenir/le perdre exige donc un nouveau jeton, donc une
 * reconnexion — exactement comme loadStageChannel() côté worker.js). Tout ce
 * qui touche à LiveKit lui-même (micro, déconnexion) vit dans
 * VoiceRoomContent, monté SEULEMENT dans le contexte <LiveKitRoom>. */
export default function ServerVoiceScreen({ server, channel, onBack }: Props) {
  const { user } = useAuth();
  const isStage = channel.type === 'stage';
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [canPublish, setCanPublish] = useState(true);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<StageState | null>(null);
  const docIdRef = useRef<string | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioStartedRef = useRef(false);
  const amSpeakerRef = useRef<boolean | null>(null);
  const suppressNextDisconnectRef = useRef(false);

  const connectRoom = useCallback(
    async (opts?: { isReconnect?: boolean }) => {
      if (opts?.isReconnect) suppressNextDisconnectRef.current = true;
      setConnecting(true);
      setError(null);
      try {
        if (!audioStartedRef.current) {
          await AudioSession.startAudioSession();
          audioStartedRef.current = true;
        }
        const [voiceRes, stageRes] = await Promise.all([
          fetchVoiceToken(server.$id, channel.$id),
          isStage ? fetchStageState(server.$id, channel.$id) : Promise.resolve(null),
        ]);
        setToken(voiceRes.token);
        setWsUrl(voiceRes.wsUrl);
        setCanPublish(voiceRes.canPublish);
        if (stageRes) {
          setStage(stageRes);
          amSpeakerRef.current = stageRes.amSpeaker;
        }
        if (!docIdRef.current) {
          try {
            const pres = await joinVoicePresence(server.$id, channel.$id);
            docIdRef.current = pres.docId;
            const displayName = (user && (user.name || user.email)) || 'Membre';
            heartbeatRef.current = setInterval(() => {
              if (docIdRef.current) sendVoiceHeartbeat(docIdRef.current, displayName).catch(() => {});
            }, HEARTBEAT_MS);
          } catch {
            // Présence best-effort, comme côté web : un échec ne doit pas
            // empêcher de rester connecté au salon audio lui-même.
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Impossible de rejoindre le salon vocal.');
      } finally {
        setConnecting(false);
      }
    },
    [server.$id, channel.$id, isStage, user]
  );

  useEffect(() => {
    connectRoom();
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (docIdRef.current) leaveVoicePresence(docIdRef.current).catch(() => {});
      if (audioStartedRef.current) AudioSession.stopAudioSession().catch(() => {});
    };
    // Volontairement lancé une seule fois au montage (server/channel sont
    // fixes pour la durée de vie de cet écran, voir App.tsx) — connectRoom
    // est rappelée pour une reconnexion de scène par l'effet de sondage
    // ci-dessous, jamais par un changement de dépendance ici.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sondage de l'état de scène (voir src/stage.ts) : reconnecte entièrement
  // dès que mon statut orateur change (approuvé ou renvoyé dans le public),
  // pour obtenir un jeton dont canPublish reflète enfin ce nouveau statut —
  // identique à loadStageChannel() côté worker.js (abonnement temps réel là
  // où mobile sonde, mais même déclencheur et même remède : un aller-retour
  // complet de connexion). Les autres changements (sujet, liste des
  // orateurs/demandes) mettent juste `stage` à jour sans reconnecter.
  useEffect(() => {
    if (!isStage || connecting || error) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const s = await fetchStageState(server.$id, channel.$id);
        if (cancelled) return;
        setStage(s);
        if (amSpeakerRef.current !== null && amSpeakerRef.current !== s.amSpeaker) {
          amSpeakerRef.current = s.amSpeaker;
          connectRoom({ isReconnect: true });
        } else {
          amSpeakerRef.current = s.amSpeaker;
        }
      } catch {
        // best-effort
      }
    };
    const iv = setInterval(poll, STAGE_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, [isStage, connecting, error, server.$id, channel.$id, connectRoom]);

  // Un seul chemin de retour pour une déconnexion RÉELLE, que ce soit
  // volontaire (bouton Quitter -> room.disconnect() dans VoiceRoomContent)
  // ou subie (perte réseau, salon fermé) : LiveKitRoom émet onDisconnected
  // dans les deux cas. Une reconnexion de scène démonte aussi l'ancienne
  // <LiveKitRoom> (voir le rendu plus bas, gardé par `connecting`) — le
  // ref ci-dessus permet de distinguer ce démontage volontaire d'un vrai
  // abandon, pour ne jamais renvoyer par erreur à la liste des salons au
  // moment précis où quelqu'un vient d'être promu orateur.
  const handleDisconnected = useCallback(() => {
    if (suppressNextDisconnectRef.current) {
      suppressNextDisconnectRef.current = false;
      return;
    }
    onBack();
  }, [onBack]);

  const onRoomError = useCallback(
    (e: Error) => {
      Alert.alert('Salon vocal', e.message || 'La connexion a été interrompue.');
      onBack();
    },
    [onBack]
  );

  if (connecting) {
    return (
      <View style={styles.center} testID="server-voice-connecting">
        <ActivityIndicator color="#7c3aed" size="large" />
        <Text style={styles.connectingText}>Connexion au salon vocal...</Text>
      </View>
    );
  }

  if (error || !token || !wsUrl) {
    return (
      <View style={styles.center}>
        <Text style={styles.error} testID="server-voice-error">
          {error || 'Impossible de rejoindre le salon vocal.'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack} testID="server-voice-error-back-button">
          <Text style={styles.backButtonText}>‹ Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LiveKitRoom
      key={token}
      serverUrl={wsUrl}
      token={token}
      audio={canPublish}
      connect
      onDisconnected={handleDisconnected}
      onError={onRoomError}
    >
      <VoiceRoomContent
        server={server}
        channel={channel}
        myUid={user!.$id}
        isStage={isStage}
        stage={stage}
        onStageChange={setStage}
      />
    </LiveKitRoom>
  );
}

function VoiceRoomContent({
  server,
  channel,
  myUid,
  isStage,
  stage,
  onStageChange,
}: {
  server: Server;
  channel: ServerChannel;
  myUid: string;
  isStage: boolean;
  stage: StageState | null;
  onStageChange: (s: StageState) => void;
}) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const [presence, setPresence] = useState<VoicePresence[]>([]);
  const [stageBusy, setStageBusy] = useState(false);
  const [topicDraft, setTopicDraft] = useState('');
  const [editingTopic, setEditingTopic] = useState(false);

  const refreshPresence = useCallback(async () => {
    try {
      setPresence(await loadVoicePresence(channel.$id));
    } catch {
      // best-effort — un raté de lecture n'empêche pas de rester dans l'appel
    }
  }, [channel.$id]);

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

  const runStageAction = useCallback(
    async (action: () => Promise<void>, failureMessage: string) => {
      if (stageBusy) return;
      setStageBusy(true);
      try {
        await action();
        onStageChange(await fetchStageState(server.$id, channel.$id));
      } catch (e) {
        Alert.alert('Scène', e instanceof Error ? e.message : failureMessage);
      } finally {
        setStageBusy(false);
      }
    },
    [stageBusy, server.$id, channel.$id, onStageChange]
  );

  const onRequestSpeak = useCallback(
    () => runStageAction(() => requestToSpeak(server.$id, channel.$id), "Impossible d'envoyer la demande."),
    [runStageAction, server.$id, channel.$id]
  );
  const onCancelRequest = useCallback(
    () => runStageAction(() => cancelSpeakRequest(server.$id, channel.$id), "Impossible d'annuler la demande."),
    [runStageAction, server.$id, channel.$id]
  );
  const onStepDown = useCallback(
    () => runStageAction(() => removeStageSpeaker(server.$id, channel.$id), 'Impossible de descendre de scène.'),
    [runStageAction, server.$id, channel.$id]
  );
  const onApprove = useCallback(
    (uid: string) => runStageAction(() => addStageSpeaker(server.$id, channel.$id, uid), "Impossible d'inviter ce membre."),
    [runStageAction, server.$id, channel.$id]
  );
  const onDecline = useCallback(
    (uid: string) => runStageAction(() => declineSpeakRequest(server.$id, channel.$id, uid), 'Impossible de refuser la demande.'),
    [runStageAction, server.$id, channel.$id]
  );
  const onRemoveSpeaker = useCallback(
    (uid: string) => runStageAction(() => removeStageSpeaker(server.$id, channel.$id, uid), 'Impossible de retirer ce membre.'),
    [runStageAction, server.$id, channel.$id]
  );
  const onSaveTopic = useCallback(() => {
    runStageAction(async () => {
      await setStageTopic(server.$id, channel.$id, topicDraft);
    }, 'Impossible de modifier le sujet.').then(() => setEditingTopic(false));
  }, [runStageAction, server.$id, channel.$id, topicDraft]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isStage ? '🎙️ ' : '🔊 '}
          {channel.name}
        </Text>
        <Text style={styles.connectionState} testID="server-voice-connection-state">
          {connectionState === 'connected' ? 'Connecté' : connectionState === 'reconnecting' ? 'Reconnexion...' : 'Connexion...'}
        </Text>
      </View>

      {isStage && stage ? (
        <View style={styles.stagePanel}>
          {editingTopic ? (
            <View style={styles.topicEditRow}>
              <TextInput
                style={styles.topicInput}
                value={topicDraft}
                onChangeText={setTopicDraft}
                placeholder="Sujet de la scène"
                placeholderTextColor="#6b6180"
                testID="server-stage-topic-input"
              />
              <TouchableOpacity onPress={onSaveTopic} testID="server-stage-topic-save-button">
                <Text style={styles.topicSave}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.topicRow}
              onPress={stage.isMod ? () => { setTopicDraft(stage.topic); setEditingTopic(true); } : undefined}
              disabled={!stage.isMod}
              testID="server-stage-topic-row"
            >
              <Text style={styles.topicText} numberOfLines={1}>
                🎤 {stage.topic || "Aucun sujet défini"}
              </Text>
              {stage.isMod ? <Text style={styles.topicEdit}>✏️</Text> : null}
            </TouchableOpacity>
          )}

          {stage.isMod && stage.requests.length > 0 ? (
            <View style={styles.stageSection}>
              <Text style={styles.stageSectionLabel}>🖐️ Demandes de parole ({stage.requests.length})</Text>
              {stage.requests.map((r) => (
                <View key={r.uid} style={styles.stageRow} testID={`server-stage-request-${r.uid}`}>
                  <Text style={styles.stageRowName} numberOfLines={1}>
                    {r.name}
                  </Text>
                  <TouchableOpacity onPress={() => onApprove(r.uid)} disabled={stageBusy} testID={`server-stage-approve-${r.uid}`}>
                    <Text style={styles.stageApprove}>✅ Inviter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDecline(r.uid)} disabled={stageBusy} testID={`server-stage-decline-${r.uid}`}>
                    <Text style={styles.stageDecline}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.stageSection}>
            <Text style={styles.stageSectionLabel}>Sur scène ({stage.speakers.length})</Text>
            {stage.speakers.length ? (
              stage.speakers.map((s) => {
                const isSelf = s.uid === myUid;
                const canRemove = stage.isMod || isSelf;
                return (
                  <View key={s.uid} style={styles.stageRow} testID={`server-stage-speaker-${s.uid}`}>
                    <Text style={styles.stageRowName} numberOfLines={1}>
                      🎤 {s.name}
                    </Text>
                    {canRemove ? (
                      <TouchableOpacity
                        onPress={() => (isSelf ? onStepDown() : onRemoveSpeaker(s.uid))}
                        disabled={stageBusy}
                        testID={`server-stage-remove-${s.uid}`}
                      >
                        <Text style={styles.stageDecline}>{isSelf ? 'Descendre' : 'Retirer'}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })
            ) : (
              <Text style={styles.stageEmpty}>Personne sur scène pour l'instant.</Text>
            )}
          </View>

          {!stage.amSpeaker ? (
            <TouchableOpacity
              style={styles.stageActionButton}
              onPress={stage.myRequestPending ? onCancelRequest : onRequestSpeak}
              disabled={stageBusy}
              testID={stage.myRequestPending ? 'server-stage-cancel-request-button' : 'server-stage-request-button'}
            >
              <Text style={styles.stageActionButtonText}>
                {stage.myRequestPending ? '✋ Annuler ma demande de parole' : '🖐️ Demander la parole'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={presence}
          keyExtractor={(p) => p.$id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty} testID="server-voice-empty">
              Tu es seul(e) dans ce salon pour l'instant.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.participantRow} testID={`voice-participant-${item.uid}`}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(item.username || '?').slice(0, 1).toUpperCase()}</Text>
              </View>
              <Text style={styles.participantName} numberOfLines={1}>
                {item.username}
                {item.uid === myUid ? ' (toi)' : ''}
              </Text>
              {item.handRaised ? <Text style={styles.handIcon}>✋</Text> : null}
            </View>
          )}
        />
      )}

      <View style={styles.controls}>
        {!isStage || (stage && stage.amSpeaker) ? (
          <TouchableOpacity
            style={[styles.controlButton, !isMicrophoneEnabled && styles.controlButtonMuted]}
            onPress={onToggleMic}
            testID="server-voice-mic-button"
          >
            <Text style={styles.controlButtonText}>{isMicrophoneEnabled ? '🎙️ Micro' : '🔇 Coupé'}</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.leaveButton} onPress={onLeave} testID="server-voice-leave-button">
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
  handIcon: { fontSize: 16 },
  stagePanel: { flex: 1, paddingHorizontal: 20, paddingTop: 4 },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  topicText: { color: '#f2ebff', fontSize: 15, fontWeight: '600', flex: 1 },
  topicEdit: { fontSize: 14 },
  topicEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  topicInput: {
    flex: 1,
    backgroundColor: '#1a1030',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#f2ebff',
  },
  topicSave: { color: '#c4b5fd', fontWeight: '700' },
  stageSection: { marginTop: 14 },
  stageSectionLabel: { color: '#9c8fb0', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  stageEmpty: { color: '#9c8fb0', fontSize: 13 },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  stageRowName: { color: '#f2ebff', fontSize: 14, fontWeight: '600', flex: 1 },
  stageApprove: { color: '#22c55e', fontWeight: '700', fontSize: 13 },
  stageDecline: { color: '#fca5a5', fontWeight: '700', fontSize: 13 },
  stageActionButton: {
    marginTop: 16,
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  stageActionButtonText: { color: '#f2ebff', fontWeight: '700' },
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
