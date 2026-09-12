/* Appels au Worker Cloudflare (mêmes routes /api/* que le site — voir
 * worker/worker.js, extractJwt()/resolveSessionUser()) : contrairement aux
 * lectures (dms, dms_messages, e2e_keys), qui passent par le SDK Appwrite
 * directement comme côté web, l'ENVOI d'un message DM est toujours validé
 * côté serveur (appartenance au thread, permissions par document, taille des
 * pièces jointes, notifications push...) — jamais une écriture directe côté
 * client dans dms_messages. Le Worker accepte un JWT Appwrite classique via
 * `Authorization: Bearer <jwt>` (voir extractJwt() dans worker.js), obtenu
 * ici via account.createJWT() plutôt que le cookie de session utilisé par le
 * navigateur. */
import { account } from './appwrite';

export const WORKER_BASE_URL = 'https://xultra.space';

export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const { jwt } = await account.createJWT();
  const res = await fetch(WORKER_BASE_URL + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || (json as any).ok === false) {
    const message = (json && (json as any).error) || 'Requête échouée (' + res.status + ')';
    throw new Error(message);
  }
  return json as T;
}
