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
import {
  decryptDmMessageText,
  dmIsGroup,
  dmPeerId,
  getUserProfile,
  loadThreadMessages,
  sendDmText,
  type DmMessage,
  type DmThread,
} from '../dms';
import { dmTitle } from './DmListScreen';

interface Props {
  dm: DmThread;
  onBack: () => void;
}

export default function DmConversationScreen({ dm, onBack }: Props) {
  const { user, e2eJwk } = useAuth();
  const [messages, setMessages] = useState<Array<DmMessage & { plainText: string }>>([]);
  const [title, setTitle] = useState(dmTitle(dm, user!.$id));
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isGroup = dmIsGroup(dm);

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const raw = await loadThreadMessages(dm.$id);
      const decrypted = await Promise.all(
        raw.map(async (m) => ({ ...m, plainText: await decryptDmMessageText(user.$id, e2eJwk, dm, m) })),
      );
      setMessages(decrypted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les messages.');
    }
  }, [user, e2eJwk, dm]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    if (!user || isGroup) return;
    const peerUid = dmPeerId(dm, user.$id);
    if (!peerUid) return;
    getUserProfile(peerUid).then((profile) => setTitle(dmTitle(dm, user.$id, profile)));
  }, [dm, user, isGroup]);

  const onSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || !user || sending) return;
    setSending(true);
    setError(null);
    try {
      const displayName = user.name || user.email || 'Moi';
      await sendDmText(user.$id, e2eJwk, displayName, dm, text);
      setDraft('');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi.");
    } finally {
      setSending(false);
    }
  }, [draft, user, e2eJwk, dm, sending, refresh]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} testID="dm-back-button">
          <Text style={styles.back}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {isGroup ? (
        <Text style={styles.notice}>Les DM de groupe ne sont pas encore pris en charge sur mobile.</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.center} testID="dm-messages-loading">
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
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]} testID={`dm-message-${item.$id}`}>
                <Text style={styles.bubbleText}>{item.plainText}</Text>
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
          placeholder="Écrire un message..."
          placeholderTextColor="#6b6180"
          editable={!isGroup}
          testID="dm-input"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, (!draft.trim() || sending || isGroup) && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!draft.trim() || sending || isGroup}
          testID="dm-send-button"
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
  headerTitle: { color: '#f2ebff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 64 },
  notice: { color: '#fbbf24', textAlign: 'center', paddingHorizontal: 16, paddingBottom: 8, fontSize: 12 },
  error: { color: '#fca5a5', textAlign: 'center', paddingHorizontal: 16, paddingBottom: 8, fontSize: 12 },
  list: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, marginVertical: 4 },
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
