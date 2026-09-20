import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Version minimale pour tester
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0b0710', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 20 }}>App chargée ✓</Text>
      <StatusBar style="light" />
    </View>
  );
}
