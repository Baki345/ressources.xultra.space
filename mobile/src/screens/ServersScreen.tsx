import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../AuthContext';
import { loadMyServers, type Server } from '../servers';

export default function ServersScreen({ onOpenServer }: { onOpenServer: (server: Server) => void }) {
  const { user } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      setServers(await loadMyServers(user.$id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les serveurs.');
    }
  }, [user]);

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
      <View style={styles.center} testID="servers-loading">
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Serveurs</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={servers}
        keyExtractor={(s) => s.$id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
        ListEmptyComponent={
          <Text style={styles.empty} testID="servers-empty">
            Aucun serveur pour l'instant.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => onOpenServer(item)} testID={`server-row-${item.$id}`}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.name}
              </Text>
              {item.description ? (
                <Text style={styles.rowPreview} numberOfLines={1}>
                  {item.description}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0814' },
  center: { flex: 1, backgroundColor: '#0d0814', alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  headerTitle: { color: '#f2ebff', fontSize: 24, fontWeight: '700' },
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
    borderRadius: 14,
    backgroundColor: '#1a1030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#c4b5fd', fontWeight: '700', fontSize: 16 },
  rowText: { flex: 1 },
  rowTitle: { color: '#f2ebff', fontWeight: '600', fontSize: 15 },
  rowPreview: { color: '#9c8fb0', fontSize: 13, marginTop: 2 },
});
