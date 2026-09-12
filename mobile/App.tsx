import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuthProvider, useAuth } from './src/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading} testID="app-loading">
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return user ? <HomeScreen /> : <LoginScreen />;
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
