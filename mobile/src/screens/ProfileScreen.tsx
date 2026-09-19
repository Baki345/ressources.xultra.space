import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../AuthContext';
import { acceptFriendRequest, blockUser, loadFriends, sendFriendRequest, unblockUser, type FriendRelation } from '../friends';
import { BADGE_DEFS, getProfileDetails, presenceDotColor, presenceLabel, type ProfileDetails } from '../profile';

interface Props {
  uid: string;
  onBack: () => void;
}

function initials(name: string): string {
  return (name || '?').trim().slice(0, 1).toUpperCase();
}

export default function ProfileScreen({ uid, onBack }: Props) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relation, setRelation] = useState<FriendRelation | null>(null);
  const [friendActionBusy, setFriendActionBusy] = useState(false);
  const [blockActionBusy, setBlockActionBusy] = useState(false);
  const isSelf = user?.$id === uid;
  const isBlocked = relation?.status === 'blocked';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProfileDetails(uid)
      .then((p) => {
        if (cancelled) return;
        if (!p) setError('Profil introuvable.');
        setProfile(p);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Impossible de charger ce profil.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  useEffect(() => {
    if (!user || isSelf) return;
    let cancelled = false;
    loadFriends(user.$id)
      .then((rels) => {
        if (cancelled) return;
        setRelation(rels.find((r) => String(r.friendId) === String(uid)) || null);
      })
      .catch(() => {
        // best-effort : sans relation connue, le bouton retombe sur "Ajouter
        // en ami" plutôt que de bloquer l'affichage du reste du profil.
      });
    return () => {
      cancelled = true;
    };
  }, [user, uid, isSelf]);

  const onFriendAction = useCallback(async () => {
    if (!user || friendActionBusy) return;
    const myName = user.name || user.email || 'Moi';
    const name = profile?.displayName || profile?.username || 'Membre';
    setFriendActionBusy(true);
    try {
      if (relation?.status === 'pending_in') {
        await acceptFriendRequest(user.$id, myName, relation.$id, uid);
      } else if (!relation) {
        await sendFriendRequest(user.$id, myName, uid, name);
      }
      const rels = await loadFriends(user.$id);
      setRelation(rels.find((r) => String(r.friendId) === String(uid)) || null);
    } finally {
      setFriendActionBusy(false);
    }
  }, [user, relation, uid, profile, friendActionBusy]);

  const doBlockAction = useCallback(async () => {
    if (!user || blockActionBusy) return;
    setBlockActionBusy(true);
    try {
      if (isBlocked) await unblockUser(user.$id, uid);
      else await blockUser(user.$id, uid);
      const rels = await loadFriends(user.$id);
      setRelation(rels.find((r) => String(r.friendId) === String(uid)) || null);
    } finally {
      setBlockActionBusy(false);
    }
  }, [user, uid, isBlocked, blockActionBusy]);

  const onBlockPress = useCallback(() => {
    if (blockActionBusy) return;
    if (isBlocked) {
      doBlockAction();
      return;
    }
    const name = profile?.displayName || profile?.username || 'cet utilisateur';
    Alert.alert('Bloquer ' + name + ' ?', 'Tu ne recevras plus ses messages.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Bloquer', style: 'destructive', onPress: doBlockAction },
    ]);
  }, [isBlocked, blockActionBusy, profile, doBlockAction]);

  const name = profile?.displayName || profile?.username || 'Membre';

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={onBack} testID="profile-back-button">
          <Text style={styles.back}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.eyebrow}>Profil IXin</Text>
        <View style={styles.backSpacer} />
      </View>

      {loading ? (
        <View style={styles.center} testID="profile-loading">
          <ActivityIndicator color="#7c3aed" size="large" />
        </View>
      ) : error || !profile ? (
        <View style={styles.center}>
          <Text style={styles.error} testID="profile-error">
            {error || 'Profil introuvable.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.banner} />
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(name)}</Text>
              <View style={[styles.presenceDot, { backgroundColor: presenceDotColor(profile.presence) }]} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.memberEyebrow}>Membre IXin</Text>
              <Text style={styles.name} testID="profile-name">
                {name}
              </Text>
              <Text style={styles.tag}>#{profile.tag}</Text>
            </View>
          </View>
          <View style={styles.presencePill}>
            <View style={[styles.presenceDotSmall, { backgroundColor: presenceDotColor(profile.presence) }]} />
            <Text style={styles.presenceLabel}>{presenceLabel(profile.presence)}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>À PROPOS</Text>
              {profile.plan === 'plus' ? (
                <View style={styles.xplusPill}>
                  <Text style={styles.xplusPillText}>★ IXin+ à vie</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.bio}>{profile.bio || 'Pas encore de bio.'}</Text>

            <View style={styles.badgesHead}>
              <Text style={styles.cardTitleSm}>BADGES</Text>
              <Text style={styles.badgesCount}>
                {profile.badges.length} distinction{profile.badges.length > 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.badgesRow}>
              {profile.badges.map((key) => {
                const def = BADGE_DEFS[key];
                if (!def) return null;
                return (
                  <View key={key} style={[styles.badgeChip, { borderColor: def.color }]} testID={`profile-badge-${key}`}>
                    <Text style={styles.badgeChipIcon}>{def.icon}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>MEMBRE DEPUIS</Text>
              <Text style={styles.statValue}>
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                  : '—'}
              </Text>
            </View>
          </View>

          {!isSelf ? (
            <TouchableOpacity
              style={[styles.friendButton, relation?.status === 'accepted' || relation?.status === 'pending_out' ? styles.friendButtonDisabled : null]}
              onPress={onFriendAction}
              disabled={friendActionBusy || relation?.status === 'accepted' || relation?.status === 'pending_out'}
              testID="profile-friend-button"
            >
              <Text style={styles.friendButtonText}>
                {relation?.status === 'accepted'
                  ? '✅ Ami'
                  : relation?.status === 'pending_out'
                    ? '📨 Demande envoyée'
                    : relation?.status === 'pending_in'
                      ? '✅ Accepter sa demande'
                      : friendActionBusy
                        ? '…'
                        : '➕ Ajouter en ami'}
              </Text>
            </TouchableOpacity>
          ) : null}

          {!isSelf ? (
            <TouchableOpacity
              style={styles.blockButton}
              onPress={onBlockPress}
              disabled={blockActionBusy}
              testID="profile-block-button"
            >
              <Text style={styles.blockButtonText}>
                {blockActionBusy ? '…' : isBlocked ? '✅ Débloquer' : '⛔ Bloquer'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0814' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 8,
  },
  back: { color: '#c4b5fd', fontSize: 15, fontWeight: '600', width: 70 },
  eyebrow: { flex: 1, textAlign: 'center', color: '#9c8fb0', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  backSpacer: { width: 70 },
  error: { color: '#fca5a5', textAlign: 'center', paddingHorizontal: 24 },
  scroll: { paddingBottom: 32 },
  banner: { height: 120, backgroundColor: '#5b21b6' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, paddingHorizontal: 20, marginTop: -36 },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: '#1a1030',
    borderWidth: 3,
    borderColor: '#0d0814',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#c4b5fd', fontWeight: '800', fontSize: 26 },
  presenceDot: { position: 'absolute', right: -2, bottom: -2, width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: '#0d0814' },
  headerText: { flex: 1, paddingBottom: 2 },
  memberEyebrow: { color: '#c4b5fd', fontSize: 10, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  name: { color: '#f2ebff', fontSize: 20, fontWeight: '800', marginTop: 2 },
  tag: { color: '#9c8fb0', fontSize: 12, marginTop: 1 },
  presencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.08)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  presenceDotSmall: { width: 8, height: 8, borderRadius: 4 },
  presenceLabel: { color: '#f2ebff', fontSize: 12, fontWeight: '700' },
  card: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.06)',
    borderRadius: 14,
    padding: 16,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: '#9c8fb0', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cardTitleSm: { color: '#9c8fb0', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  xplusPill: {
    backgroundColor: '#facc15',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  xplusPillText: { color: '#1a1005', fontSize: 10, fontWeight: '900' },
  bio: { color: '#f2ebff', fontSize: 14, lineHeight: 20, marginTop: 10, opacity: 0.92 },
  badgesHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  badgesCount: { color: '#9c8fb0', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  badgeChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,.04)',
  },
  badgeChipIcon: { fontSize: 16 },
  statsRow: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.06)' },
  statLabel: { color: '#9c8fb0', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  statValue: { color: '#f2ebff', fontSize: 14, fontWeight: '700', marginTop: 2 },
  friendButton: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  friendButtonDisabled: { backgroundColor: 'rgba(255,255,255,.06)' },
  friendButtonText: { color: '#f2ebff', fontWeight: '700', fontSize: 14 },
  blockButton: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,.04)',
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,.25)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  blockButtonText: { color: '#fca5a5', fontWeight: '700', fontSize: 14 },
});
