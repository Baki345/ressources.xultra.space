import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../AuthContext';
import {
  decryptDmMessageText,
  dmIsGroup,
  dmPeerId,
  getUserProfile,
  loadDms,
  loadThreadMessages,
  type DmThread,
} from '../dms';

export function dmTitle(dm: DmThread, myUid: string, profile?: { displayName?: string; username?: string } | null): string {
  if (dmIsGroup(dm)) return dm.displayName || 'Groupe';
  if (profile) return profile.displayName || profile.username || dm.displayName || 'Conversation';
  return dm.displayName || 'Conversation';
}

export default function DmListScreen({ onOpenThread }: { onOpenThread: (dm: DmThread) => void }) {
  const { user, e2eJwk, logout } = useAuth();
  const [threads, setThreads] = useState<DmThread[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const dms = await loadDms(user.$id);
      setThreads(dms);
      // Aperçu + titre par conversation — best-effort, une conversation dont
      // l'un des deux échoue n'empêche pas d'afficher les autres.
      const entries = await Promise.all(
        dms.map(async (dm) => {
          const peerUid = dmPeerId(dm, user.$id);
          const profile = dmIsGroup(dm) || !peerUid ? null : await getUserProfile(peerUid);
          const title = dmTitle(dm, user.$id, profile);
          let preview = '';
          try {
            const [latest] = await loadThreadMessages(dm.$id);
            if (latest) preview = await decryptDmMessageText(user.$id, e2eJwk, latest);
          } catch {
            preview = '';
          }
          return [dm.$id, title, preview] as const;
        }),
      );
      setTitles(Object.fromEntries(entries.map(([id, title]) => [id, title])));
      setPreviews(Object.fromEntries(entries.map(([id, , preview]) => [id, preview])));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les conversations.');
    }
  }, [user, e2eJwk]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  if (loading) {
    return (
      <View style={styles.center} testID="dms-loading">
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={logout} testID="logout-button">
          <Text style={styles.logout}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={threads}
        keyExtractor={(dm) => dm.$id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
        ListEmptyComponent={
          <Text style={styles.empty} testID="dms-empty">
            Aucune conversation pour l'instant.
          </Text>
        }
        renderItem={({ item }) => {
          const title = titles[item.$id] || dmTitle(item, user!.$id);
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => onOpenThread(item)}
              testID={`dm-row-${item.$id}`}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{dmIsGroup(item) ? '👥' : title.slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.rowPreview} numberOfLines={1}>
                  {previews[item.$id] || item.lastMessage || ''}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0814' },
  center: { flex: 1, backgroundColor: '#0d0814', alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitle: { color: '#f2ebff', fontSize: 24, fontWeight: '700' },
  logout: { color: '#fca5a5', fontWeight: '600', fontSize: 13 },
  error: { color: '#fca5a5', paddingHorizontal: 20, paddingBottom: 8 },
  empty: { color: '#9c8fb0', textAlign: 'center', marginTop: 48 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1a1030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#c4b5fd', fontWeight: '700', fontSize: 16 },
  rowText: { flex: 1 },
  rowTitle: { color: '#f2ebff', fontWeight: '600', fontSize: 15 },
  rowPreview: { color: '#9c8fb0', fontSize: 13, marginTop: 2 },
});
