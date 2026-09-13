import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

import { useAuth } from '../AuthContext';
import {
  decryptDmAttachmentToFile,
  decryptDmMessageForDisplay,
  dmIsGroup,
  dmPeerId,
  fmtFileSize,
  getUserProfile,
  loadThreadMessages,
  sendDmAttachment,
  sendDmText,
  type DecryptedDmMessage,
  type DmThread,
} from '../dms';
import { dmTitle } from './DmListScreen';
import ProfileScreen from './ProfileScreen';

interface Props {
  dm: DmThread;
  onBack: () => void;
}

// Palier gratuit uniquement (X1+ n'est pas encore branché côté mobile, voir
// mobile/README.md) — le Worker revalide de toute façon la taille réelle
// côté serveur, ce garde-fou côté client n'existe que pour éviter un envoi
// voué à l'échec après un long upload.
const MAX_ATTACH_BYTES = 10 * 1024 * 1024;

export default function DmConversationScreen({ dm, onBack }: Props) {
  const { user, e2eJwk } = useAuth();
  const [messages, setMessages] = useState<DecryptedDmMessage[]>([]);
  const [title, setTitle] = useState(dmTitle(dm, user!.$id));
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const isGroup = dmIsGroup(dm);
  const peerUid = user ? dmPeerId(dm, user.$id) : '';

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const raw = await loadThreadMessages(dm.$id);
      const decrypted = await Promise.all(raw.map((m) => decryptDmMessageForDisplay(user.$id, e2eJwk, m)));
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
    if (!user || isGroup || !peerUid) return;
    getUserProfile(peerUid).then((profile) => setTitle(dmTitle(dm, user.$id, profile)));
  }, [dm, user, isGroup, peerUid]);

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

  const onPickImage = useCallback(async () => {
    if (!user || attaching) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError("Permission d'accès aux photos refusée.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    const asset = result.canceled ? null : result.assets[0];
    if (!asset) return;
    if ((asset.fileSize || 0) > MAX_ATTACH_BYTES) {
      setError(`Photo trop volumineuse (${fmtFileSize(MAX_ATTACH_BYTES)} max).`);
      return;
    }
    setAttaching(true);
    setError(null);
    try {
      const bytes = await new File(asset.uri).bytes();
      const displayName = user.name || user.email || 'Moi';
      const caption = draft.trim();
      await sendDmAttachment(user.$id, e2eJwk, displayName, dm, {
        kind: 'image',
        bytes,
        mime: asset.mimeType || 'image/jpeg',
        caption: caption || undefined,
      });
      setDraft('');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi de la photo.");
    } finally {
      setAttaching(false);
    }
  }, [user, e2eJwk, dm, draft, attaching, refresh]);

  const onPickFile = useCallback(async () => {
    if (!user || attaching) return;
    let picked;
    try {
      picked = await File.pickFileAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible d'ouvrir le sélecteur de fichier.");
      return;
    }
    if (picked.canceled || !picked.result) return;
    const file = picked.result;
    if (file.size > MAX_ATTACH_BYTES) {
      setError(`Fichier trop volumineux (${fmtFileSize(MAX_ATTACH_BYTES)} max).`);
      return;
    }
    setAttaching(true);
    setError(null);
    try {
      const bytes = await file.bytes();
      const displayName = user.name || user.email || 'Moi';
      await sendDmAttachment(user.$id, e2eJwk, displayName, dm, {
        kind: 'file',
        bytes,
        mime: file.type || 'application/octet-stream',
        fileName: file.name,
        fileSize: file.size,
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi du fichier.");
    } finally {
      setAttaching(false);
    }
  }, [user, e2eJwk, dm, attaching, refresh]);

  const onAttachPress = useCallback(() => {
    if (attaching) return;
    Alert.alert('Joindre', undefined, [
      { text: '📷 Photo', onPress: onPickImage },
      { text: '📄 Fichier', onPress: onPickFile },
      { text: 'Annuler', style: 'cancel' },
    ]);
  }, [attaching, onPickImage, onPickFile]);

  const onOpenFile = useCallback(
    async (m: DecryptedDmMessage) => {
      if (!user || !m.fileMeta) return;
      setError(null);
      try {
        const uri = await decryptDmAttachmentToFile(user.$id, e2eJwk, m, m.fileMeta.name);
        if (!uri) {
          setError('🔒 Fichier illisible sur cet appareil.');
          return;
        }
        await Sharing.shareAsync(uri, { mimeType: m.fileMeta.mime });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Impossible d'ouvrir le fichier.");
      }
    },
    [user, e2eJwk]
  );

  if (showProfile && peerUid) {
    return <ProfileScreen uid={peerUid} onBack={() => setShowProfile(false)} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} testID="dm-back-button">
          <Text style={styles.back}>‹ Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerTitleTouch}
          onPress={() => setShowProfile(true)}
          disabled={isGroup || !peerUid}
          testID="dm-header-title"
        >
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

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
              <View style={mine ? styles.bubbleRowMine : styles.bubbleRowTheirs}>
                {isGroup && !mine ? <Text style={styles.senderName}>{item.displayName}</Text> : null}
                <View
                  style={[
                    styles.bubble,
                    mine ? styles.bubbleMine : styles.bubbleTheirs,
                    item.type === 'image' && styles.bubbleImage,
                  ]}
                  testID={`dm-message-${item.$id}`}
                >
                  {item.type === 'image' ? (
                    item.mediaUri ? (
                      <>
                        <Image source={{ uri: item.mediaUri }} style={styles.attachedImage} resizeMode="cover" />
                        {item.plainText ? <Text style={[styles.bubbleText, styles.captionText]}>{item.plainText}</Text> : null}
                      </>
                    ) : (
                      <Text style={styles.bubbleText}>🔒 Photo illisible sur cet appareil</Text>
                    )
                  ) : item.type === 'file' ? (
                    item.fileMeta ? (
                      <TouchableOpacity onPress={() => onOpenFile(item)} testID={`dm-file-${item.$id}`}>
                        <Text style={styles.bubbleText}>📄 {item.fileMeta.name}</Text>
                        <Text style={styles.fileSize}>{fmtFileSize(item.fileMeta.size)}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.bubbleText}>🔒 Fichier illisible sur cet appareil</Text>
                    )
                  ) : (
                    <Text style={styles.bubbleText}>{item.plainText}</Text>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={styles.composer}>
        <TouchableOpacity
          style={[styles.attachButton, attaching && styles.sendButtonDisabled]}
          onPress={onAttachPress}
          disabled={attaching}
          testID="dm-attach-button"
        >
          <Text style={styles.attachButtonText}>{attaching ? '…' : '📎'}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Écrire un message..."
          placeholderTextColor="#6b6180"
          testID="dm-input"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, (!draft.trim() || sending) && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!draft.trim() || sending}
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
  headerTitleTouch: { flex: 1 },
  headerTitle: { color: '#f2ebff', fontSize: 17, fontWeight: '700', textAlign: 'center' },
  headerSpacer: { width: 64 },
  error: { color: '#fca5a5', textAlign: 'center', paddingHorizontal: 16, paddingBottom: 8, fontSize: 12 },
  list: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  bubbleRowMine: { alignItems: 'flex-end', marginVertical: 4 },
  bubbleRowTheirs: { alignItems: 'flex-start', marginVertical: 4 },
  senderName: { color: '#c4b5fd', fontSize: 11, fontWeight: '700', marginBottom: 2, marginLeft: 4 },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { backgroundColor: '#7c3aed', alignSelf: 'flex-end' },
  bubbleTheirs: { backgroundColor: '#1a1030', alignSelf: 'flex-start' },
  bubbleImage: { padding: 4, overflow: 'hidden' },
  bubbleText: { color: '#f2ebff', fontSize: 15 },
  attachedImage: { width: 220, height: 220, borderRadius: 12, backgroundColor: '#0d0814' },
  captionText: { marginTop: 6, paddingHorizontal: 6 },
  fileSize: { color: '#c4b5fd', fontSize: 12, marginTop: 2 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a1030',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: '#1a1030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonText: { fontSize: 20 },
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
