// Stripe client_reference_id (spec §9.1): {w|h}-{picks|none}__{utm_source|direct}.
// Stripe allows [A-Za-z0-9_-] up to 200 chars and silently drops anything else, so sanitise and
// truncate the picks part first to keep the traffic source intact.
import type { MenuKind } from '../data/menu';

export const CLIENT_REFERENCE_MAX = 200;
const SEPARATOR = '__';

// Collapses anything outside [A-Za-z0-9] (including _) into single dashes, trimmed.
function slug(value: string): string {
  return value.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function buildClientReference(
  kind: MenuKind,
  picks: readonly string[],
  utmSource: string | null | undefined
): string {
  const prefix = kind === 'work' ? 'w-' : 'h-';
  const source = (utmSource ? slug(utmSource) : '') || 'direct';
  const ids = picks.map((id) => slug(id.replace(/^(work|home)-/, ''))).filter(Boolean);
  let picksPart = ids.join('-') || 'none';

  const room = CLIENT_REFERENCE_MAX - prefix.length - SEPARATOR.length;
  const sourcePart = source.slice(0, Math.max(1, room - 4)); // always leave room for at least "none"
  const picksRoom = room - sourcePart.length;
  if (picksPart.length > picksRoom) {
    picksPart = picksPart.slice(0, picksRoom).replace(/-+$/, '') || 'none';
  }
  return `${prefix}${picksPart}${SEPARATOR}${sourcePart}`;
}
