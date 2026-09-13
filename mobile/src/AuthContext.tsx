import type { Models } from 'react-native-appwrite';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { account } from './appwrite';
import { ensureE2EKeys, getLocalPrivateJwk, type E2EPrivateJwk } from './e2e';
import { registerForPushNotificationsAsync, unregisterPushNotifications } from './pushNotifications';

type XUser = Models.User<Models.Preferences>;

type AuthContextValue = {
  user: XUser | null;
  loading: boolean;
  error: string | null;
  /** Clé privée E2E de cet appareil, garantie disponible dès que `user` est
   * non nul (générée/restaurée par ensureE2EKeys()) — null seulement si la
   * génération elle-même a échoué (ex. Keychain/Keystore inaccessible). */
  e2eJwk: E2EPrivateJwk | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<XUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [e2eJwk, setE2eJwk] = useState<E2EPrivateJwk | null>(null);

  const setupE2E = useCallback(async (uid: string, password?: string) => {
    // Best-effort et jamais bloquant pour l'auth elle-même : une app
    // utilisable sans DM déchiffrables vaut mieux qu'un login qui échoue à
    // cause d'un souci Keychain/Keystore ponctuel.
    await ensureE2EKeys(uid, password).catch(() => null);
    const jwk = await getLocalPrivateJwk();
    setE2eJwk(jwk);
    registerForPushNotificationsAsync().catch(() => {});
  }, []);

  useEffect(() => {
    account
      .get()
      .then(async (me) => {
        setUser(me);
        await setupE2E(me.$id);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [setupE2E]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        await account.createEmailPasswordSession(email, password);
        const me = await account.get();
        setUser(me);
        await setupE2E(me.$id, password);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Connexion impossible.');
        throw e;
      }
    },
    [setupE2E],
  );

  const logout = useCallback(async () => {
    await unregisterPushNotifications();
    try {
      await account.deleteSession('current');
    } catch (e) {
      // Une session déjà expirée/absente côté serveur ne doit jamais bloquer
      // la déconnexion locale — l'utilisateur veut sortir, pas voir une erreur.
    }
    setUser(null);
    setE2eJwk(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, e2eJwk, login, logout }),
    [user, loading, error, e2eJwk, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
