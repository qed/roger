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

// Reads `?code=` out of a query string. Returns null when there is no `code` param (nothing to do);
// otherwise the accepted code (null if not allow-listed) and the query without `code`, every other
// param kept in order ('' when nothing remains, else with a leading '?').
export function captureCodeFromSearch(
  search: string,
  allowList: readonly string[] = siteConfig.workshopCodes
): { code: string | null; nextSearch: string } | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if (!params.has('code')) return null;
  const code = acceptWorkshopCode(params.get('code'), allowList);
  params.delete('code');
  const rest = params.toString();
  return { code, nextSearch: rest ? `?${rest}` : '' };
}

// A tiny external store for useSyncExternalStore, like createPicksStore. `set` stores an accepted code
// (a newer one overwrites the old) and notifies; an unaccepted code leaves the current one untouched.
export type WorkshopCodeStore = {
  getSnapshot(): string | null;
  subscribe(listener: () => void): () => void;
  set(raw: string | null | undefined): string | null;
};

export function createWorkshopCodeStore(
  storage: StorageLike,
  allowList: readonly string[] = siteConfig.workshopCodes
): WorkshopCodeStore {
  let current = readWorkshopCode(storage, allowList);
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => current,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set(raw) {
      const accepted = storeWorkshopCode(storage, raw, allowList);
      if (accepted && accepted !== current) {
        current = accepted;
        listeners.forEach((listener) => listener());
      }
      return accepted;
    }
  };
}
