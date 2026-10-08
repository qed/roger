import { useCallback, useSyncExternalStore } from 'react';
import type { MenuKind } from '../data/menu';
import { getSessionStorage } from '../lib/browserStorage';
import { createPicksStore } from '../lib/picks';
import type { ToggleStatus } from '../lib/picks';

// One store for the whole app, so the picker, pricing card, sticky bar and header CTA always read the
// same picks and every link is built from the current selection (plan: Key Technical Decisions).
const store = createPicksStore(getSessionStorage());
const EMPTY: readonly string[] = [];
const getServerSnapshot = () => EMPTY;

export function usePicks(kind: MenuKind): { picks: readonly string[]; toggle: (id: string) => ToggleStatus } {
  const subscribe = useCallback((listener: () => void) => store.subscribe(kind, listener), [kind]);
  const getSnapshot = useCallback(() => store.getSnapshot(kind), [kind]);
  const picks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback((id: string) => store.toggle(kind, id), [kind]);
  return { picks, toggle };
}
