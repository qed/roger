import { useEffect, useSyncExternalStore } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSessionStorage } from '../lib/browserStorage';
import { captureCodeFromSearch, createWorkshopCodeStore } from '../lib/workshopCode';
import { PRESERVE_SCROLL_STATE } from '../components/layout/navigationState';

// The accepted workshop group code (spec §9.3; plan: allow-listed, alphanumeric). One store for the
// whole app, so every CTA link updates the moment a code is captured.
const store = createWorkshopCodeStore(getSessionStorage());
const getServerSnapshot = () => null;

// Pure read: the accepted code or null. Safe to call from any number of components.
export function useWorkshopCode(): string | null {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
}

// Mounted ONCE, in SiteLayout. Captures `?code=`: an allow-listed code is stored (a newer one overwrites
// the old; an unknown one is ignored), then `code` is removed with a history replace that keeps every
// other param and the hash. The replace carries PRESERVE_SCROLL_STATE so ScrollToHash doesn't re-scroll.
export function useCaptureWorkshopCode(): void {
  const { pathname, search, hash, state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const captured = captureCodeFromSearch(search);
    if (!captured) return;
    store.set(captured.code);
    const base = state && typeof state === 'object' ? (state as Record<string, unknown>) : {};
    navigate({ pathname, search: captured.nextSearch, hash }, { replace: true, state: { ...base, ...PRESERVE_SCROLL_STATE } });
  }, [pathname, search, hash, state, navigate]);
}
