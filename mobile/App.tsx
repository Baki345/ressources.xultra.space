import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuthProvider, useAuth } from './src/AuthContext';
import type { DmThread } from './src/dms';
import DmConversationScreen from './src/screens/DmConversationScreen';
import DmListScreen from './src/screens/DmListScreen';
import LoginScreen from './src/screens/LoginScreen';

function AuthenticatedApp() {
  const [openThread, setOpenThread] = useState<DmThread | null>(null);

  if (openThread) {
    return <DmConversationScreen dm={openThread} onBack={() => setOpenThread(null)} />;
  }
  return <DmListScreen onOpenThread={setOpenThread} />;
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
});
