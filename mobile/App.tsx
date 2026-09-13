import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthProvider, useAuth } from './src/AuthContext';
import type { DmThread } from './src/dms';
import type { Server, ServerChannel, ServerThread } from './src/servers';
import DmConversationScreen from './src/screens/DmConversationScreen';
import DmListScreen from './src/screens/DmListScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import LoginScreen from './src/screens/LoginScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ServerChannelScreen from './src/screens/ServerChannelScreen';
import ServerChannelsScreen from './src/screens/ServerChannelsScreen';
import ServerForumScreen from './src/screens/ServerForumScreen';
import ServersScreen from './src/screens/ServersScreen';

type Tab = 'dms' | 'servers' | 'friends' | 'notifications';

function AuthenticatedApp() {
  const [tab, setTab] = useState<Tab>('dms');
  const [openThread, setOpenThread] = useState<DmThread | null>(null);
  const [openServer, setOpenServer] = useState<Server | null>(null);
  const [openChannel, setOpenChannel] = useState<ServerChannel | null>(null);
  const [openForumChannel, setOpenForumChannel] = useState<ServerChannel | null>(null);
  const [openForumThread, setOpenForumThread] = useState<ServerThread | null>(null);

  if (openThread) {
    return <DmConversationScreen dm={openThread} onBack={() => setOpenThread(null)} />;
  }

  if (openServer && openChannel) {
    return <ServerChannelScreen server={openServer} channel={openChannel} onBack={() => setOpenChannel(null)} />;
  }

  if (openServer && openForumChannel && openForumThread) {
    return (
      <ServerChannelScreen
        server={openServer}
        channel={openForumChannel}
        thread={openForumThread}
        onBack={() => setOpenForumThread(null)}
      />
    );
  }

  if (openServer && openForumChannel) {
    return (
      <ServerForumScreen
        server={openServer}
        channel={openForumChannel}
        onOpenThread={setOpenForumThread}
        onBack={() => setOpenForumChannel(null)}
      />
    );
  }

  if (openServer) {
    return (
      <ServerChannelsScreen
        server={openServer}
        onOpenChannel={setOpenChannel}
        onOpenForum={setOpenForumChannel}
        onBack={() => setOpenServer(null)}
      />
    );
  }

  return (
    <View style={styles.tabRoot}>
      <View style={styles.tabContent}>
        {tab === 'dms' ? (
          <DmListScreen onOpenThread={setOpenThread} />
        ) : tab === 'servers' ? (
          <ServersScreen onOpenServer={setOpenServer} />
        ) : tab === 'friends' ? (
          <FriendsScreen />
        ) : (
          <NotificationsScreen />
        )}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setTab('dms')} testID="tab-dms">
          <Text style={[styles.tabLabel, tab === 'dms' && styles.tabLabelActive]}>💬 Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setTab('servers')} testID="tab-servers">
          <Text style={[styles.tabLabel, tab === 'servers' && styles.tabLabelActive]}>🗂️ Serveurs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setTab('friends')} testID="tab-friends">
          <Text style={[styles.tabLabel, tab === 'friends' && styles.tabLabelActive]}>👥 Amis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setTab('notifications')} testID="tab-notifications">
          <Text style={[styles.tabLabel, tab === 'notifications' && styles.tabLabelActive]}>🔔 Notifs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading} testID="app-loading">
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return user ? <AuthenticatedApp /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
      <StatusBar style="light" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0d0814',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRoot: { flex: 1, backgroundColor: '#0d0814' },
  tabContent: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1a1030',
    paddingBottom: 24,
    paddingTop: 10,
    backgroundColor: '#0d0814',
  },
  tabButton: { flex: 1, alignItems: 'center' },
  tabLabel: { color: '#6b6180', fontSize: 13, fontWeight: '600' },
  tabLabelActive: { color: '#c4b5fd' },
});
