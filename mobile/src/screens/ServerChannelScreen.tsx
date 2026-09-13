import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../AuthContext';
import { loadChannelMessages, sendChannelText, type Server, type ServerChannel, type ServerChannelMessage } from '../servers';

interface Props {
  server: Server;
  channel: ServerChannel;
  onBack: () => void;
}

export default function ServerChannelScreen({ server, channel, onBack }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ServerChannelMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setMessages(await loadChannelMessages(server.$id, channel.$id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les messages.');
    }
  }, [server.$id, channel.$id]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const onSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || !user || sending) return;
    setSending(true);
    setError(null);
    try {
      await sendChannelText(server.$id, channel.$id, text);
      setDraft('');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi.");
    } finally {
      setSending(false);
    }
  }, [draft, user, sending, server.$id, channel.$id, refresh]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} testID="server-channel-back-button">
          <Text style={styles.back}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {channel.type === 'announcement' ? '📣 ' : '# '}
          {channel.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.center} testID="server-channel-messages-loading">
          <ActivityIndicator color="#7c3aed" size="large" />
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(m) => m.$id}
          inverted
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const mine = item.uid === user!.$id;
            return (
              <View style={mine ? styles.bubbleRowMine : styles.bubbleRowTheirs}>
                {!mine ? <Text style={styles.senderName}>{item.username}</Text> : null}
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]} testID={`server-channel-message-${item.$id}`}>
                  <Text style={styles.bubbleText}>{item.text}</Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder={`Écrire dans #${channel.name}...`}
          placeholderTextColor="#6b6180"
          testID="server-channel-input"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, (!draft.trim() || sending) && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!draft.trim() || sending}
          testID="server-channel-send-button"
        >
          <Text style={styles.sendButtonText}>{sending ? '…' : 'Envoyer'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0814' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    gap: 8,
  },
  back: { color: '#c4b5fd', fontSize: 15, fontWeight: '600', width: 64 },
  headerTitle: { color: '#f2ebff', fontSize: 17, fontWeight: '700', textAlign: 'center', flex: 1 },
  headerSpacer: { width: 64 },
  error: { color: '#fca5a5', textAlign: 'center', paddingHorizontal: 16, paddingBottom: 8, fontSize: 12 },
  list: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  bubbleRowMine: { alignItems: 'flex-end', marginVertical: 4 },
  bubbleRowTheirs: { alignItems: 'flex-start', marginVertical: 4 },
  senderName: { color: '#c4b5fd', fontSize: 11, fontWeight: '700', marginBottom: 2, marginLeft: 4 },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { backgroundColor: '#7c3aed', alignSelf: 'flex-end' },
  bubbleTheirs: { backgroundColor: '#1a1030', alignSelf: 'flex-start' },
  bubbleText: { color: '#f2ebff', fontSize: 15 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a1030',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1030',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#f2ebff',
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonText: { color: '#f2ebff', fontWeight: '700' },
});
