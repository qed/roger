// Workshop codes (plan: Key Technical Decisions). A QR carries /?code={GROUP}; only groups Peter has
// created in Stripe (siteConfig.workshopCodes) are accepted. Stripe's prefilled_promo_code is
// alphanumeric-only, so each link gets {GROUP}WORK or {GROUP}HOME. No suffix is ever stripped.
import { siteConfig } from '../data/config';
import type { MenuKind } from '../data/menu';
import type { StorageLike } from './storage';
import { safeStorage } from './storage';

export const WORKSHOP_CODE_KEY = 'roger.code';
const MAX_LENGTH = 32;

function stripCode(raw: string | null | undefined): string {
  return raw ? raw.toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
}

export function normaliseWorkshopCode(raw: string | null | undefined): string {
  return stripCode(raw).slice(0, MAX_LENGTH);
}

export function acceptWorkshopCode(
  raw: string | null | undefined,
  allowList: readonly string[] = siteConfig.workshopCodes
): string | null {
  const code = stripCode(raw);
  // Reject rather than truncate: a longer string must not match an allowed prefix.
  if (!code || code.length > MAX_LENGTH) return null;
  return allowList.some((allowed) => normaliseWorkshopCode(allowed) === code) ? code : null;
}

const PROMO_SUFFIX: Record<MenuKind, string> = { work: 'WORK', home: 'HOME' };

export function promoCodeFor(group: string, offer: MenuKind): string {
  return `${group}${PROMO_SUFFIX[offer]}`;
}

// Stores an accepted code (a newer one overwrites the old); returns it, or null if not accepted.
export function storeWorkshopCode(
  storage: StorageLike,
  raw: string | null | undefined,
  allowList: readonly string[] = siteConfig.workshopCodes
): string | null {
  const code = acceptWorkshopCode(raw, allowList);
  if (code) safeStorage(storage).setItem(WORKSHOP_CODE_KEY, code);
  return code;
}

// Re-validates on read, so a code removed from the allow-list stops applying.
export function readWorkshopCode(
  storage: StorageLike,
  allowList: readonly string[] = siteConfig.workshopCodes
): string | null {
  return acceptWorkshopCode(safeStorage(storage).getItem(WORKSHOP_CODE_KEY), allowList);
}
