/* Appels au Worker Cloudflare (mêmes routes /api/vpn/* que le web/desktop —
 * voir worker/worker.js) : même JWT Appwrite via Authorization: Bearer,
 * même pattern que mobile/src/api.ts. */
import { account } from './appwrite';

export const WORKER_BASE_URL = 'https://xultra.space';

async function authedFetch<T = unknown>(path: string, method: string, body?: unknown): Promise<T> {
  const { jwt } = await account.createJWT();
  const res = await fetch(WORKER_BASE_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || (json as { ok?: boolean }).ok === false) {
    const message = (json && (json as { error?: string }).error) || 'Requête échouée (' + res.status + ')';
    throw new Error(message);
  }
  return json as T;
}

export function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  return authedFetch<T>(path, 'POST', body);
}

export function apiGet<T = unknown>(path: string): Promise<T> {
  return authedFetch<T>(path, 'GET');
}

export type VpnServer = { id: string; label: string; flagEmoji: string; stealthSupported: boolean };

// Publique, sans session requise — même route que le sélecteur de serveur
// web/desktop (voir GET /api/vpn/servers côté worker.js).
export async function getVpnServers(): Promise<VpnServer[]> {
  const res = await fetch(WORKER_BASE_URL + '/api/vpn/servers');
  const json = (await res.json().catch(() => null)) as { ok?: boolean; servers?: VpnServer[] } | null;
  if (!json || !json.ok) throw new Error('Impossible de charger la liste des serveurs.');
  return json.servers || [];
}

export type VpnStatus = { active: boolean; expiresAt: string; serverId: string };

export function getVpnStatus(): Promise<VpnStatus> {
  return apiGet<VpnStatus>('/api/vpn/status');
}

export type VpnClaimResult = { config: string };

export function claimVpnConfig(serverId: string): Promise<VpnClaimResult> {
  return apiPost<VpnClaimResult>('/api/vpn/config/claim', { serverId });
}

export function revokeVpnConfig(): Promise<void> {
  return apiPost<void>('/api/vpn/revoke', {});
}

export type CheckoutResult = { url: string };

export function createVpnCheckout(serverId: string): Promise<CheckoutResult> {
  return apiPost<CheckoutResult>('/api/payments/checkout', { kind: 'vpn', serverId });
}
