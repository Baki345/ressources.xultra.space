/* Port mobile de BADGE_DEFS (worker.js) — icône/libellé/couleur uniquement,
 * pas les longues descriptions (pas encore d'écran "détail du badge" côté
 * mobile). Les badges créés depuis le studio admin (CUSTOM_BADGES, chargés
 * via /api/badges/custom côté site) ne sont pas encore portés : un badge
 * custom inconnu ici est simplement ignoré plutôt que de casser l'affichage
 * — même filtre que parseBadges() côté web (un badge sans définition connue
 * est retiré de la liste).
 */
export interface BadgeDef {
  icon: string;
  label: string;
  color: string;
}

export const BADGE_DEFS: Record<string, BadgeDef> = {
  base: { icon: '💜', label: 'MEMBRE', color: '#a78bfa' },
  dev: { icon: '🛠️', label: 'DEV', color: '#ef4444' },
  hunter1: { icon: '🔍', label: 'CHASSEUR NOVICE', color: '#94a3b8' },
  hunter2: { icon: '🐛', label: 'CHASSEUR CONFIRMÉ', color: '#22c55e' },
  hunter3: { icon: '🕷️', label: 'CHASSEUR EXPERT', color: '#f59e0b' },
  hunter4: { icon: '⚔️', label: 'EXTERMINATEUR', color: '#ef4444' },
  hunter5: { icon: '👑', label: 'LÉGENDE DU BUG', color: '#facc15' },
  early: { icon: '✨', label: 'EARLY USER', color: '#facc15' },
  creator: { icon: '🎬', label: 'CRÉATEUR DE CONTENU', color: '#ec4899' },
  chainsmoker: { icon: '🚬', label: 'CHAINSMOKER', color: '#f97316' },
  elite: { icon: '💎', label: 'ÉLITE X1', color: '#f0abfc' },
  botdev: { icon: '🤖', label: 'DÉVELOPPEUR DE BOT', color: '#38bdf8' },
  xplus: { icon: '⭐', label: 'X1+', color: '#fbbf24' },
  bap: { icon: '🛡️', label: 'BRIGADE ANTI-PRÉDATEURS', color: '#1d4ed8' },
  support: { icon: '🎧', label: 'SUPPORT X1', color: '#f59e0b' },
  adult18: { icon: '🔞', label: '18+ VÉRIFIÉ', color: '#dc2626' },
};

/** Identique à parseBadges() côté worker.js : le badge 'base' est toujours
 * présent, et un badge sans définition connue est filtré silencieusement. */
export function parseBadges(badgesJson: string | undefined | null): string[] {
  let arr: unknown = [];
  try {
    arr = JSON.parse(badgesJson || '[]');
  } catch {
    return ['base'];
  }
  const set = Array.isArray(arr) ? arr.filter((b) => typeof b === 'string' && BADGE_DEFS[b]) : [];
  if (!set.includes('base')) set.unshift('base');
  return set as string[];
}
