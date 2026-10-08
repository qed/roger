// UTM attribution (spec §9.1, §9.7). Framework-free and tested; src/utils/utm.ts is the browser wrapper.
// The landing URL's params are remembered for the tab, and a later URL with UTM params overrides only
// the keys it carries, so /?utm_source=bia then /home?utm_medium=x still credits bia.
import type { StorageLike } from './storage';
import { safeStorage } from './storage';

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
export const UTM_STORAGE_KEY = 'roger.utm';
export const UTM_VALUE_MAX = 100;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const SAFE_VALUE = /^[A-Za-z0-9 ._~+-]+$/;

// Trimmed value, or null when empty, too long or carrying anything outside [A-Za-z0-9 ._~+-].
export function cleanUtmValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > UTM_VALUE_MAX || !SAFE_VALUE.test(trimmed)) return null;
  return trimmed;
}

function pick(get: (key: UtmKey) => unknown): UtmParams {
  const out: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = cleanUtmValue(get(key));
    if (value !== null) out[key] = value;
  }
  return out;
}

export function parseUtmSearch(search: string): UtmParams {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  return pick((key) => params.get(key));
}

// Stored JSON → params. Corrupt or non-object JSON reads as {}.
export function parseStoredUtm(raw: string | null): UtmParams {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return pick((key) => (parsed as Record<string, unknown>)[key]);
  } catch {
    return {};
  }
}

// Per key: a URL value overrides the stored one; stored keys the URL doesn't carry are kept.
export function mergeUtm(stored: UtmParams, fromUrl: UtmParams): UtmParams {
  return pick((key) => fromUrl[key] ?? stored[key]);
}

export function readStoredUtm(storage: StorageLike): UtmParams {
  return parseStoredUtm(safeStorage(storage).getItem(UTM_STORAGE_KEY));
}

// Pure read for render: what's stored, overlaid with the current URL. Never writes, so links are right
// on the very first render, before the capture effect has run.
export function currentUtm(storage: StorageLike, search: string): UtmParams {
  return mergeUtm(readStoredUtm(storage), parseUtmSearch(search));
}

// Called from an effect on navigation: remembers the merged params when the URL carries any.
export function captureUtm(storage: StorageLike, search: string): UtmParams {
  const fromUrl = parseUtmSearch(search);
  const merged = mergeUtm(readStoredUtm(storage), fromUrl);
  if (Object.keys(fromUrl).length) safeStorage(storage).setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
  return merged;
}
