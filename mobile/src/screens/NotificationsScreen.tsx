import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../AuthContext';
import { clearAllNotifications, deleteNotification, loadNotifications, markAllRead, NOTIF_ICONS, type NotificationDoc } from '../notifications';
import { fmtRelTime } from '../time';
import ProfileScreen from './ProfileScreen';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<NotificationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openProfileUid, setOpenProfileUid] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const fresh = await loadNotifications(user.$id);
      setNotifs(fresh);
      markAllRead(fresh).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les notifications.');
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const onDelete = useCallback(async (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.$id !== id));
    try {
      await deleteNotification(id);
    } catch {
      // best-effort ; un refresh manuel la referait apparaître si la
      // suppression a réellement échoué, plutôt que de bloquer l'UI ici.
    }
  }, []);

  const onClearAll = useCallback(async () => {
    const current = notifs;
    setNotifs([]);
    try {
      await clearAllNotifications(current);
    } catch {
      // best-effort
    }
  }, [notifs]);

  if (openProfileUid) {
    return <ProfileScreen uid={openProfileUid} onBack={() => setOpenProfileUid(null)} />;
  }

  if (loading) {
    return (
      <View style={styles.center} testID="notifications-loading">
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifs.length > 0 ? (
          <TouchableOpacity onPress={onClearAll} testID="notifications-clear-all">
            <Text style={styles.clearAll}>Tout effacer</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={notifs}
        keyExtractor={(n) => n.$id}
        ListEmptyComponent={
          <Text style={styles.empty} testID="notifications-empty">
            Aucune notification pour l'instant.
          </Text>
        }
        renderItem={({ item }) => {
          const clickable = !!item.fromUid;
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => clickable && setOpenProfileUid(item.fromUid)}
              disabled={!clickable}
              testID={`notification-${item.$id}`}
            >
              <Text style={styles.icon}>{NOTIF_ICONS[item.type] || '🔔'}</Text>
              <View style={styles.body}>
                <Text style={styles.text}>{item.text}</Text>
                <Text style={styles.time}>{fmtRelTime(item.$createdAt)}</Text>
              </View>
              <TouchableOpacity onPress={() => onDelete(item.$id)} testID={`notification-delete-${item.$id}`}>
                <Text style={styles.deleteText}>🗑</Text>
              </TouchableOpacity>
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
    paddingBottom: 12,
  },
  headerTitle: { color: '#f2ebff', fontSize: 24, fontWeight: '700' },
  clearAll: { color: '#c4b5fd', fontSize: 13, fontWeight: '600' },
  error: { color: '#fca5a5', paddingHorizontal: 20, paddingBottom: 8, fontSize: 12 },
  empty: { color: '#9c8fb0', textAlign: 'center', marginTop: 48, paddingHorizontal: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  icon: { fontSize: 20 },
  body: { flex: 1 },
  text: { color: '#f2ebff', fontSize: 14, lineHeight: 19 },
  time: { color: '#9c8fb0', fontSize: 11, marginTop: 2 },
  deleteText: { fontSize: 16, padding: 4 },
});
