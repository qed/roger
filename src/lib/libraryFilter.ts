// Use-case library filters (spec §7.3). The URL is the state: `for`, `cat` and `q`. Invalid values are
// ignored, and serialising omits defaults, so a canonical query can replace whatever was typed.
import { isUseCaseCategory, useCaseCategories } from '../data/library';
import type { UseCase, UseCaseCategory } from '../data/library';

export type LibraryAudience = 'all' | 'work' | 'home';
export type LibraryParams = { for: LibraryAudience; cat: UseCaseCategory | null; q: string };

export const SEARCH_MAX = 100;
const OWNED_KEYS = ['for', 'cat', 'q'] as const;

export function parseLibraryParams(params: URLSearchParams): LibraryParams {
  const audience = params.get('for');
  const cat = params.get('cat') ?? '';
  return {
    for: audience === 'work' || audience === 'home' ? audience : 'all',
    cat: isUseCaseCategory(cat) ? cat : null,
    q: (params.get('q') ?? '').trim().slice(0, SEARCH_MAX)
  };
}

export function serialiseLibraryParams(p: LibraryParams): string {
  const out = new URLSearchParams();
  if (p.for !== 'all') out.set('for', p.for);
  if (p.cat) out.set('cat', p.cat);
  if (p.q.trim()) out.set('q', p.q.trim());
  return out.toString();
}

function matches(entry: UseCase, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return [entry.title, entry.summary, entry.tool, entry.handle, entry.category.replace(/-/g, ' ')].some((field) =>
    field.toLowerCase().includes(needle)
  );
}

// Featured first, then the newest week, then seed order. Never mutates the input.
export function filterLibrary(entries: readonly UseCase[], p: LibraryParams): UseCase[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => (p.for === 'all' || entry.for === p.for) && (!p.cat || entry.category === p.cat) && matches(entry, p.q))
    .sort(
      (a, b) =>
        Number(Boolean(b.entry.featured)) - Number(Boolean(a.entry.featured)) ||
        b.entry.weekOf.localeCompare(a.entry.weekOf) ||
        a.index - b.index
    )
    .map(({ entry }) => entry);
}

// Category chips for the current audience: only categories that have at least one entry, in spec order.
export function categoriesFor(entries: readonly UseCase[], audience: LibraryAudience): UseCaseCategory[] {
  const present = new Set(entries.filter((e) => audience === 'all' || e.for === audience).map((e) => e.category));
  return useCaseCategories.filter((c) => present.has(c));
}

// A category with no entries for the chosen audience would show an empty list with no chip pressed
// (e.g. a deep link to ?for=work&cat=kids). Treat it like an invalid value.
export function normaliseForAudience(entries: readonly UseCase[], p: LibraryParams): LibraryParams {
  return p.cat && !categoriesFor(entries, p.for).includes(p.cat) ? { ...p, cat: null } : p;
}

// Writes the library's own keys (for, cat, q) over the current query and leaves every other key
// (utm_*, code, ...) where it is, so filtering never drops attribution.
export function applyLibraryParams(current: URLSearchParams, p: LibraryParams): string {
  const out = new URLSearchParams(current);
  for (const key of OWNED_KEYS) out.delete(key);
  for (const [key, value] of new URLSearchParams(serialiseLibraryParams(p))) out.append(key, value);
  return out.toString();
}

// The canonical form of a library URL: invalid or empty library values dropped, other keys untouched.
export function canonicalSearch(current: URLSearchParams, entries: readonly UseCase[]): string {
  return applyLibraryParams(current, normaliseForAudience(entries, parseLibraryParams(current)));
}
