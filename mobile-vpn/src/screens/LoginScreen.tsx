import React, { useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../AuthContext';

export default function LoginScreen() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email || !password || submitting) return;
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (e) {
      // L'erreur est déjà exposée via useAuth().error, rien de plus à faire ici.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔒 IXin VPN</Text>
      <Text style={styles.subtitle}>Connecte-toi avec ton compte IXin — le même que sur xultra.space.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6b7280"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#6b7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#0b0710" /> : <Text style={styles.buttonText}>Se connecter</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://xultra.space/')}>
        <Text style={styles.link}>Pas encore de compte ? Crée-le sur xultra.space</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0710', justifyContent: 'center', padding: 24, gap: 12 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  subtitle: { color: '#9ca3af', textAlign: 'center', marginBottom: 16 },
  input: {
    backgroundColor: 'rgba(255,255,255,.06)',
    borderColor: 'rgba(255,255,255,.12)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    color: '#fff',
  },
  error: { color: '#f87171', textAlign: 'center' },
  button: { backgroundColor: '#f5f5f7', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#0b0710', fontWeight: '700' },
  link: { color: '#9ca3af', textAlign: 'center', marginTop: 16, textDecorationLine: 'underline' },
});
