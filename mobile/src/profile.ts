/* Fiche de profil en lecture — port mobile simplifié de la carte de profil
 * du site (voir buildProfileCardHtml/buildProfileDashboardHtml dans
 * worker.js) : même mise en page (bannière + en-tête, puis à propos/badges/
 * membre depuis), mais en lecture seule pour l'instant — pas encore de
 * bouton "Ami" (le système de demandes d'ami n'est pas encore porté sur
 * mobile, voir mobile/README.md "Stratégie de portage"), pas de widgets
 * "En ce moment" / "XBin épinglé" (prochaine itération).
 */
import { Query } from 'react-native-appwrite';

import { APPWRITE_DATABASE_ID, databases } from './appwrite';
import { BADGE_DEFS, parseBadges } from './badges';

const PRESENCE_STALE_MS = 3 * 60 * 1000;

export interface ProfileDetails {
  uid: string;
  username?: string;
  displayName?: string;
  tag?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  presence: 'online' | 'idle' | 'dnd' | 'offline';
  plan?: string;
  badges: string[];
}

const PRESENCE_LABELS: Record<ProfileDetails['presence'], string> = {
  online: 'En ligne',
  idle: 'Absent',
  dnd: 'Ne pas déranger',
  offline: 'Hors ligne',
};
const PRESENCE_DOTS: Record<ProfileDetails['presence'], string> = {
  online: '#22c55e',
  idle: '#f59e0b',
  dnd: '#ef4444',
  offline: '#6b7280',
};

export function presenceLabel(p: ProfileDetails['presence']): string {
  return PRESENCE_LABELS[p];
}
export function presenceDotColor(p: ProfileDetails['presence']): string {
  return PRESENCE_DOTS[p];
}

/** Identique à computePresence() côté worker.js : un statut manuel "en ligne"
 * jamais rafraîchi (lastSeen trop ancien) retombe sur "offline", peu importe
 * ce que la personne a choisi comme statut. */
function computePresence(statusManual: string | undefined, lastSeen: string | undefined): ProfileDetails['presence'] {
  const manual = statusManual || 'online';
  if (manual === 'invisible') return 'offline';
  const last = lastSeen ? new Date(lastSeen).getTime() : 0;
  if (!last || Date.now() - last > PRESENCE_STALE_MS) return 'offline';
  return manual === 'idle' || manual === 'dnd' ? manual : 'online';
}

export async function getProfileDetails(uid: string): Promise<ProfileDetails | null> {
  let userDoc: Record<string, unknown> | null = null;
  try {
    const r = await databases.listDocuments(APPWRITE_DATABASE_ID, 'users', [
      Query.equal('authUserId', uid),
      Query.limit(1),
    ]);
    userDoc = (r.documents[0] as unknown as Record<string, unknown>) || null;
  } catch {
    userDoc = null;
  }
  if (!userDoc) return null;

  let metaDoc: Record<string, unknown> | null = null;
  try {
    metaDoc = (await databases.getDocument(APPWRITE_DATABASE_ID, 'user_meta', uid)) as unknown as Record<string, unknown>;
  } catch {
    metaDoc = null;
  }

  const badges = parseBadges((metaDoc?.badgesJson as string) || undefined);
  return {
    uid,
    username: userDoc.username as string | undefined,
    displayName: userDoc.displayName as string | undefined,
    tag: (userDoc.tag as string) || '0000',
    avatar: userDoc.avatar as string | undefined,
    bio: (userDoc.bio as string) || '',
    createdAt: (userDoc.createdAt as string) || (userDoc['$createdAt'] as string),
    presence: computePresence(userDoc.statusManual as string | undefined, userDoc.lastSeen as string | undefined),
    plan: metaDoc?.plan as string | undefined,
    badges,
  };
}

export { BADGE_DEFS };
