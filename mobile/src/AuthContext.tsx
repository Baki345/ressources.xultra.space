import type { Models } from 'react-native-appwrite';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { account } from './appwrite';

type XUser = Models.User<Models.Preferences>;

type AuthContextValue = {
  user: XUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<XUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    account
      .get()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      const me = await account.get();
      setUser(me);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible.');
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession('current');
    } catch (e) {
      // Une session déjà expirée/absente côté serveur ne doit jamais bloquer
      // la déconnexion locale — l'utilisateur veut sortir, pas voir une erreur.
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, logout }),
    [user, loading, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
