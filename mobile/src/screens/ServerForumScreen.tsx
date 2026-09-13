import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { createForumPost, loadForumPosts, type Server, type ServerChannel, type ServerThread } from '../servers';

export default function ServerForumScreen({
  server,
  channel,
  onOpenThread,
  onBack,
}: {
  server: Server;
  channel: ServerChannel;
  onOpenThread: (thread: ServerThread) => void;
  onBack: () => void;
}) {
  const [posts, setPosts] = useState<ServerThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setPosts(await loadForumPosts(server.$id, channel.$id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les posts.');
    }
  }, [server.$id, channel.$id]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const onPublish = useCallback(async () => {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b || posting) return;
    setPosting(true);
    setError(null);
    try {
      await createForumPost(server.$id, channel.$id, t, b);
      setTitle('');
      setBody('');
      setComposing(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec de la publication.');
    } finally {
      setPosting(false);
    }
  }, [title, body, posting, server.$id, channel.$id, refresh]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} testID="server-forum-back-button">
          <Text style={styles.back}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          📋 {channel.name}
        </Text>
        <TouchableOpacity onPress={() => setComposing((v) => !v)} testID="server-forum-new-post-button">
          <Text style={styles.newPost}>{composing ? 'Annuler' : '+ Post'}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {composing ? (
        <View style={styles.composer}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Titre du post"
            placeholderTextColor="#6b6180"
            testID="server-forum-title-input"
          />
          <TextInput
            style={styles.bodyInput}
            value={body}
            onChangeText={setBody}
            placeholder="Que veux-tu partager ?"
            placeholderTextColor="#6b6180"
            testID="server-forum-body-input"
            multiline
          />
          <TouchableOpacity
            style={[styles.publishButton, (!title.trim() || !body.trim() || posting) && styles.publishButtonDisabled]}
            onPress={onPublish}
            disabled={!title.trim() || !body.trim() || posting}
            testID="server-forum-publish-button"
          >
            <Text style={styles.publishButtonText}>{posting ? '…' : 'Publier'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.center} testID="server-forum-loading">
          <ActivityIndicator color="#7c3aed" size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(t) => t.$id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
          ListEmptyComponent={
            <Text style={styles.empty} testID="server-forum-empty">
              Aucun post pour l'instant. Sois le premier à publier !
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => onOpenThread(item)} testID={`forum-post-${item.$id}`}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.name}
              </Text>
              {item.archived ? <Text style={styles.archivedTag}>Clos</Text> : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
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
    paddingBottom: 16,
    gap: 8,
  },
  back: { color: '#c4b5fd', fontSize: 15, fontWeight: '600', width: 60 },
  headerTitle: { color: '#f2ebff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  newPost: { color: '#c4b5fd', fontSize: 14, fontWeight: '700', width: 60, textAlign: 'right' },
  error: { color: '#fca5a5', paddingHorizontal: 20, paddingBottom: 8 },
  composer: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1a1030',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  titleInput: {
    backgroundColor: 'rgba(255,255,255,.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f2ebff',
    fontWeight: '700',
  },
  bodyInput: {
    backgroundColor: 'rgba(255,255,255,.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f2ebff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  publishButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  publishButtonDisabled: { opacity: 0.4 },
  publishButtonText: { color: '#f2ebff', fontWeight: '700' },
  empty: { color: '#9c8fb0', textAlign: 'center', marginTop: 48, paddingHorizontal: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,.05)',
  },
  rowTitle: { color: '#f2ebff', fontWeight: '600', fontSize: 15, flex: 1 },
  archivedTag: {
    color: '#9c8fb0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(255,255,255,.05)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
