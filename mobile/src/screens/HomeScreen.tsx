import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../AuthContext';

// Premier écran authentifié — volontairement minimal (preuve que la
// connexion Appwrite fonctionne de bout en bout). Les vraies fonctionnalités
// (DM, serveurs, appels...) viendront section par section, comme pour la
// migration web (voir app/README.md) : jamais tout reconstruire d'un coup.
export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Salut, {user?.name || user?.email} 👋</Text>
      <Text style={styles.hint}>
        Connecté à ton compte X1 — les premières vraies fonctionnalités
        arriveront ici section par section.
      </Text>
      <TouchableOpacity style={styles.button} onPress={logout} testID="logout-button">
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0814',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  greeting: {
    color: '#f2ebff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  hint: {
    color: '#9c8fb0',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1a1030',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  buttonText: {
    color: '#fca5a5',
    fontWeight: '700',
  },
});
