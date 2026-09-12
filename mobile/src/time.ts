/** Identique à fmtRelTime() côté worker.js — même échelle et mêmes seuils,
 * pour un temps relatif cohérent entre le site et l'app mobile. */
export function fmtRelTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  const diff = Math.max(0, (Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return Math.floor(diff) + 's';
  if (diff < 3600) return Math.floor(diff / 60) + 'min';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h';
  if (diff < 604800) return Math.floor(diff / 86400) + 'j';
  if (diff < 2629800) return Math.floor(diff / 604800) + 'sem';
  if (diff < 31557600) return Math.floor(diff / 2629800) + 'mois';
  return Math.floor(diff / 31557600) + 'an';
}
