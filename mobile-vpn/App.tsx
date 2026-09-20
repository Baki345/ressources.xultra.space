import React from 'react';
import { ActivityIndicator, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import ConnectScreen from './src/screens/ConnectScreen';

function ErrorDisplay({ error }: { error: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0b0710', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ color: '#ff4444', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Erreur au démarrage</Text>
      <ScrollView>
        <Text style={{ color: '#ccc', fontSize: 12 }}>{error}</Text>
      </ScrollView>
    </View>
  );
}

function Root() {
  const { user, loading, error: authError } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0710', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (authError) {
    return <ErrorDisplay error={authError} />;
  }

  return user ? <ConnectScreen /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Root />
    </AuthProvider>
  );
}
