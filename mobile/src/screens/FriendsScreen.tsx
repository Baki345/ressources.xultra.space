import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../AuthContext';
import type { UserProfile } from '../dms';
import {
  acceptFriendRequest,
  loadFriends,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  sendFriendRequest,
  type FriendRelation,
} from '../friends';
import ProfileScreen from './ProfileScreen';

export default function FriendsScreen() {
  const { user } = useAuth();
  const [relations, setRelations] = useState<FriendRelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [sentTo, setSentTo] = useState<Record<string, boolean>>({});
  const [openProfileUid, setOpenProfileUid] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      setRelations(await loadFriends(user.$id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger tes amis.');
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    searchUsers(q, user.$id).then((r) => {
      if (!cancelled) setResults(r);
    });
    return () => {
      cancelled = true;
    };
  }, [query, user]);

  const onAdd = useCallback(
    async (target: UserProfile) => {
      if (!user) return;
      const targetUid = target.authUserId;
      const name = target.displayName || target.username || 'Ami';
      const myName = user.name || user.email || 'Moi';
      try {
        await sendFriendRequest(user.$id, myName, targetUid, name);
        setSentTo((prev) => ({ ...prev, [targetUid]: true }));
        await refresh();
      } catch {
        setError("Impossible d'envoyer la demande.");
      }
    },
    [user, refresh],
  );

  const onAccept = useCallback(
    async (rel: FriendRelation) => {
      if (!user) return;
      const myName = user.name || user.email || 'Moi';
      try {
        await acceptFriendRequest(user.$id, myName, rel.$id, rel.friendId);
        await refresh();
      } catch {
        setError("Impossible d'accepter la demande.");
      }
    },
    [user, refresh],
  );

  const onReject = useCallback(
    async (rel: FriendRelation) => {
      if (!user) return;
      try {
        await rejectFriendRequest(user.$id, rel.$id, rel.friendId);
        await refresh();
      } catch {
        setError('Impossible de refuser la demande.');
      }
    },
    [user, refresh],
  );

  const onRemove = useCallback(
    async (rel: FriendRelation) => {
      if (!user) return;
      const myName = user.name || user.email || 'Moi';
      try {
        await removeFriend(user.$id, myName, rel.friendId);
        await refresh();
      } catch {
        setError("Impossible de retirer cet ami.");
      }
    },
    [user, refresh],
  );

  if (openProfileUid) {
    return <ProfileScreen uid={openProfileUid} onBack={() => setOpenProfileUid(null)} />;
  }

  const incoming = relations.filter((f) => f.status === 'pending_in');
  const accepted = relations.filter((f) => f.status === 'accepted');

  if (loading) {
    return (
      <View style={styles.center} testID="friends-loading">
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Amis</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Ajouter un ami (pseudo)..."
        placeholderTextColor="#6b6180"
        testID="friend-search-input"
      />
      {results.length > 0 ? (
        <View style={styles.searchResults} testID="friend-search-results">
          {results.map((r) => (
            <View key={r.authUserId} style={styles.searchRow}>
              <Text style={styles.searchName} numberOfLines={1}>
                {r.displayName || r.username}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAdd(r)}
                disabled={!!sentTo[r.authUserId]}
                testID={`friend-add-${r.authUserId}`}
              >
                <Text style={styles.addButtonText}>{sentTo[r.authUserId] ? 'Envoyé' : 'Ajouter'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}

      <FlatList
        data={[
          ...(incoming.length ? [{ kind: 'section' as const, label: 'Demandes reçues' }] : []),
          ...incoming.map((f) => ({ kind: 'incoming' as const, rel: f })),
          ...(accepted.length ? [{ kind: 'section' as const, label: 'Amis' }] : []),
          ...accepted.map((f) => ({ kind: 'accepted' as const, rel: f })),
        ]}
        keyExtractor={(item, i) => (item.kind === 'section' ? 'section-' + item.label : item.rel.$id) + i}
        ListEmptyComponent={
          <Text style={styles.empty} testID="friends-empty">
            Aucun ami pour l'instant. Cherche un pseudo ci-dessus pour en ajouter.
          </Text>
        }
        renderItem={({ item }) => {
          if (item.kind === 'section') {
            return <Text style={styles.sectionLabel}>{item.label}</Text>;
          }
          if (item.kind === 'incoming') {
            return (
              <View style={styles.row} testID={`friend-incoming-${item.rel.friendId}`}>
                <TouchableOpacity style={styles.rowInfo} onPress={() => setOpenProfileUid(item.rel.friendId)}>
                  <Text style={styles.rowName}>{item.rel.name || 'Ami'}</Text>
                </TouchableOpacity>
                <View style={styles.rowActions}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(item.rel)} testID={`friend-accept-${item.rel.friendId}`}>
                    <Text style={styles.acceptButtonText}>Accepter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={() => onReject(item.rel)} testID={`friend-reject-${item.rel.friendId}`}>
                    <Text style={styles.rejectButtonText}>Refuser</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
          return (
            <View style={styles.row} testID={`friend-accepted-${item.rel.friendId}`}>
              <TouchableOpacity style={styles.rowInfo} onPress={() => setOpenProfileUid(item.rel.friendId)}>
                <Text style={styles.rowName}>{item.rel.name || 'Ami'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onRemove(item.rel)} testID={`friend-remove-${item.rel.friendId}`}>
                <Text style={styles.removeText}>🗑</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0814' },
  center: { flex: 1, backgroundColor: '#0d0814', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#f2ebff', fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  error: { color: '#fca5a5', paddingHorizontal: 20, paddingBottom: 8, fontSize: 12 },
  searchInput: {
    marginHorizontal: 20,
    backgroundColor: '#1a1030',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f2ebff',
    marginBottom: 8,
  },
  searchResults: { marginHorizontal: 20, marginBottom: 8, backgroundColor: 'rgba(255,255,255,.03)', borderRadius: 12, padding: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  searchName: { color: '#f2ebff', fontSize: 14, flex: 1 },
  addButton: { backgroundColor: '#7c3aed', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  addButtonText: { color: '#f2ebff', fontWeight: '700', fontSize: 12 },
  empty: { color: '#9c8fb0', textAlign: 'center', marginTop: 32, paddingHorizontal: 24 },
  sectionLabel: { color: '#9c8fb0', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  rowInfo: { flex: 1 },
  rowName: { color: '#f2ebff', fontSize: 15, fontWeight: '600' },
  rowActions: { flexDirection: 'row', gap: 8 },
  acceptButton: { backgroundColor: '#22c55e', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  acceptButtonText: { color: '#0d1a0f', fontWeight: '700', fontSize: 12 },
  rejectButton: { backgroundColor: 'rgba(255,255,255,.06)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  rejectButtonText: { color: '#fca5a5', fontWeight: '700', fontSize: 12 },
  removeText: { fontSize: 16 },
});
