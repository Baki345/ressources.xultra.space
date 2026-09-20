import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import * as IxinVpn from 'ixin-vpn';
import type { VpnStatus as NativeVpnStatus } from 'ixin-vpn';
import { useAuth } from '../AuthContext';
import { claimVpnConfig, createVpnCheckout, getVpnServers, getVpnStatus, type VpnServer } from '../api';

function fmtBytes(n: number): string {
  if (n < 1024) return n + ' o';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' Ko';
  if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + ' Mo';
  return (n / 1024 / 1024 / 1024).toFixed(2) + ' Go';
}

export default function ConnectScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [servers, setServers] = useState<VpnServer[]>([]);
  const [serverId, setServerId] = useState('');
  const [killSwitch, setKillSwitch] = useState(false);
  const [status, setStatus] = useState<NativeVpnStatus>({ state: 'disconnected', rxBytes: 0, txBytes: 0, lastHandshakeSec: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingConfigRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statusRes, serverList] = await Promise.all([getVpnStatus(), getVpnServers()]);
        if (cancelled) return;
        setActive(statusRes.active);
        setServers(serverList);
        setServerId(statusRes.serverId || serverList[0]?.id || '');
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur de chargement.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    const sub = IxinVpn.onStatusChange(setStatus);
    IxinVpn.getStatus().then(setStatus).catch(() => {});
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  const onSubscribe = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const { url } = await createVpnCheckout(serverId);
      await Linking.openURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur.');
    } finally {
      setBusy(false);
    }
  }, [serverId]);

  // Même logique de nouvelle tentative que vpnTryClaimConfig côté web/desktop
  // (worker.js) : la config n'est pas toujours prête immédiatement après un
  // achat (le temps que vpn-manager provisionne), un léger délai + une
  // seconde tentative couvre ce cas sans avoir besoin d'un vrai sondage.
  const claimWithRetry = useCallback(async (attempt = 0): Promise<string> => {
    try {
      const { config } = await claimVpnConfig(serverId);
      return config;
    } catch (e) {
      if (attempt < 1) {
        await new Promise((r) => setTimeout(r, 4000));
        return claimWithRetry(attempt + 1);
      }
      throw e;
    }
  }, [serverId]);

  const onConnect = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const granted = await IxinVpn.requestPermission();
      if (!granted) {
        setError("Permission VPN refusée — Android ne peut pas établir le tunnel sans elle.");
        return;
      }
      const confText = pendingConfigRef.current || (await claimWithRetry());
      pendingConfigRef.current = null;
      await IxinVpn.connect(confText, killSwitch);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion VPN impossible.');
    } finally {
      setBusy(false);
    }
  }, [claimWithRetry, killSwitch]);

  const onDisconnect = useCallback(async () => {
    setBusy(true);
    try {
      await IxinVpn.disconnect();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Déconnexion impossible.');
    } finally {
      setBusy(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!active) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔒 IXin VPN</Text>
        <Text style={styles.subtitle}>Pas d'abonnement actif — débloque l'accès pour 30 jours.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onSubscribe} disabled={busy}>
          {busy ? <ActivityIndicator color="#0b0710" /> : <Text style={styles.buttonText}>S'abonner</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.link}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const connected = status.state === 'connected';
  const connecting = status.state === 'connecting' || busy;
  const locked = connected || connecting;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🔒 IXin VPN</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.link}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.statusLabel}>
          {connected ? '🟢 Connecté' : status.state === 'error' ? '🔴 Erreur' : '⚪ Déconnecté'}
        </Text>
        {connected ? (
          <Text style={styles.statusSub}>
            ⬇️ {fmtBytes(status.rxBytes)} · ⬆️ {fmtBytes(status.txBytes)}
          </Text>
        ) : null}
        {status.error ? <Text style={styles.error}>{status.error}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, connected ? styles.buttonDanger : null]}
          onPress={connected ? onDisconnect : onConnect}
          disabled={connecting && !connected}
        >
          {connecting && !connected ? (
            <ActivityIndicator color="#0b0710" />
          ) : (
            <Text style={connected ? styles.buttonDangerText : styles.buttonText}>
              {connected ? 'Déconnecter' : 'Connecter'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {servers.length > 1 ? (
        <View style={[styles.card, locked ? styles.disabled : null]}>
          <Text style={styles.cardLabel}>🌍 Serveur</Text>
          {servers.map((s) => (
            <TouchableOpacity key={s.id} disabled={locked} onPress={() => setServerId(s.id)} style={styles.row}>
              <Text style={styles.rowText}>
                {s.flagEmoji} {s.label} {s.id === serverId ? '✓' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <View style={[styles.card, locked ? styles.disabled : null]}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>🛑 Kill switch</Text>
            <Text style={styles.cardSub}>
              Android n'autorise pas cette appli à l'activer elle-même — utilise "Bloquer les connexions sans VPN"
              dans les réglages système pour un vrai kill switch garanti.
            </Text>
          </View>
          <Switch value={killSwitch} onValueChange={setKillSwitch} disabled={locked} />
        </View>
        <TouchableOpacity onPress={() => Linking.sendIntent('android.settings.VPN_SETTINGS').catch(() => Linking.openSettings())}>
          <Text style={styles.link}>Ouvrir les réglages VPN Android →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0710', padding: 20, gap: 16 },
  center: { flex: 1, backgroundColor: '#0b0710', justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#9ca3af' },
  card: { backgroundColor: 'rgba(255,255,255,.05)', borderColor: 'rgba(255,255,255,.1)', borderWidth: 1, borderRadius: 12, padding: 16, gap: 10 },
  disabled: { opacity: 0.5 },
  cardLabel: { color: '#fff', fontWeight: '600' },
  cardSub: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  statusLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
  statusSub: { color: '#9ca3af' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  rowText: { color: '#fff' },
  error: { color: '#f87171' },
  button: { backgroundColor: '#f5f5f7', borderRadius: 10, padding: 12, alignItems: 'center' },
  buttonText: { color: '#0b0710', fontWeight: '700' },
  buttonDanger: { backgroundColor: 'rgba(248,113,113,.15)', borderColor: '#f87171', borderWidth: 1 },
  buttonDangerText: { color: '#f87171', fontWeight: '700' },
  link: { color: '#9ca3af', textDecorationLine: 'underline' },
});
