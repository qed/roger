// Picker selections (spec §9.5), one sessionStorage key per offer so work and home picks never collide.
// Values are sanitised on every read and write: unknown or foreign ids are dropped, the always-included
// Chief of Staff is never a pick, duplicates collapse and the list is cut to the picker's max.
import { homeJobs, helpers } from '../data/menu';
import type { MenuKind } from '../data/menu';
import type { StorageLike } from './storage';
import { safeStorage } from './storage';

export const PICKS_KEYS: Record<MenuKind, string> = { work: 'roger.picks.work', home: 'roger.picks.home' };
export const PICKS_MAX: Record<MenuKind, number> = { work: 3, home: 5 };

const VALID_IDS: Record<MenuKind, ReadonlySet<string>> = {
  work: new Set(helpers.map((item) => item.id)),
  home: new Set(homeJobs.map((item) => item.id))
};

export function sanitisePicks(kind: MenuKind, value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const picks: string[] = [];
  for (const id of value) {
    if (typeof id !== 'string' || !VALID_IDS[kind].has(id) || picks.includes(id)) continue;
    picks.push(id);
    if (picks.length === PICKS_MAX[kind]) break;
  }
  return picks;
}

export function readPicks(storage: StorageLike, kind: MenuKind): string[] {
  const raw = safeStorage(storage).getItem(PICKS_KEYS[kind]);
  if (!raw) return [];
  try {
    return sanitisePicks(kind, JSON.parse(raw));
  } catch {
    return [];
  }
}

export function writePicks(storage: StorageLike, kind: MenuKind, picks: readonly string[]): string[] {
  const clean = sanitisePicks(kind, picks);
  const safe = safeStorage(storage);
  if (clean.length) safe.setItem(PICKS_KEYS[kind], JSON.stringify(clean));
  else safe.removeItem(PICKS_KEYS[kind]);
  return clean;
}

// Analytics value for picks (spec §9.7): ids without their leading offer prefix, comma-joined, or 'none'.
export function picksAnalyticsValue(picks: readonly string[]): string {
  return picks.map((id) => id.replace(/^(work|home)-/, '')).join(',') || 'none';
}

export type ToggleStatus = 'added' | 'removed' | 'max-reached' | 'invalid';

export function togglePick(
  kind: MenuKind,
  picks: readonly string[],
  id: string
): { status: ToggleStatus; picks: string[] } {
  const current = sanitisePicks(kind, picks);
  if (!VALID_IDS[kind].has(id)) return { status: 'invalid', picks: current };
  if (current.includes(id)) return { status: 'removed', picks: current.filter((p) => p !== id) };
  if (current.length >= PICKS_MAX[kind]) return { status: 'max-reached', picks: current };
  return { status: 'added', picks: [...current, id] };
}

// A tiny external store for React's useSyncExternalStore. Snapshots keep their reference until they
// change, and only subscribers of the changed kind are notified. State stays in memory if storage fails.
export type PicksStore = {
  getSnapshot(kind: MenuKind): readonly string[];
  subscribe(kind: MenuKind, listener: () => void): () => void;
  toggle(kind: MenuKind, id: string): ToggleStatus;
  set(kind: MenuKind, picks: readonly string[]): void;
  clear(kind: MenuKind): void;
};

export function createPicksStore(storage: StorageLike): PicksStore {
  const state: Record<MenuKind, readonly string[]> = {
    work: readPicks(storage, 'work'),
    home: readPicks(storage, 'home')
  };
  const listeners: Record<MenuKind, Set<() => void>> = { work: new Set(), home: new Set() };

  function commit(kind: MenuKind, picks: readonly string[]) {
    const next = writePicks(storage, kind, picks);
    const prev = state[kind];
    if (next.length === prev.length && next.every((id, i) => id === prev[i])) return;
    state[kind] = next;
    listeners[kind].forEach((listener) => listener());
  }

  return {
    getSnapshot: (kind) => state[kind],
    subscribe(kind, listener) {
      listeners[kind].add(listener);
      return () => {
        listeners[kind].delete(listener);
      };
    },
    toggle(kind, id) {
      const result = togglePick(kind, state[kind], id);
      if (result.status === 'added' || result.status === 'removed') commit(kind, result.picks);
      return result.status;
    },
    set: (kind, picks) => commit(kind, picks),
    clear: (kind) => commit(kind, [])
  };
}
