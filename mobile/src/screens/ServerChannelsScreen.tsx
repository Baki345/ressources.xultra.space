import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { loadServerChannels, type Server, type ServerChannel } from '../servers';

export default function ServerChannelsScreen({
  server,
  onOpenChannel,
  onOpenForum,
  onBack,
}: {
  server: Server;
  onOpenChannel: (channel: ServerChannel) => void;
  onOpenForum: (channel: ServerChannel) => void;
  onBack: () => void;
}) {
  const [channels, setChannels] = useState<ServerChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setChannels(await loadServerChannels(server.$id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les salons.');
    }
  }, [server.$id]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} testID="server-channels-back-button">
          <Text style={styles.back}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {server.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <View style={styles.center} testID="server-channels-loading">
          <ActivityIndicator color="#7c3aed" size="large" />
        </View>
      ) : (
        <FlatList
          data={channels}
          keyExtractor={(c) => c.$id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
          ListEmptyComponent={
            <Text style={styles.empty} testID="server-channels-empty">
              Aucun salon visible sur ce serveur.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => (item.type === 'forum' ? onOpenForum(item) : onOpenChannel(item))}
              testID={`channel-row-${item.$id}`}
            >
              <Text style={styles.hash}>{item.type === 'announcement' ? '📣' : item.type === 'forum' ? '📋' : '#'}</Text>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.name}
              </Text>
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
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  back: { color: '#c4b5fd', fontSize: 15, fontWeight: '600' },
  headerTitle: { color: '#f2ebff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 50 },
  error: { color: '#fca5a5', paddingHorizontal: 20, paddingBottom: 8 },
  empty: { color: '#9c8fb0', textAlign: 'center', marginTop: 48 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  hash: { color: '#6b6180', fontSize: 16, fontWeight: '700', width: 20, textAlign: 'center' },
  rowTitle: { color: '#f2ebff', fontWeight: '600', fontSize: 15 },
});
