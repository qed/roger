// Browser wrapper over src/lib/utm.ts. Reads are pure (no storage writes during render); the only write
// is captureUtmFromSearch, called from an effect in SiteLayout on every query change.
import { getSessionStorage } from '../lib/browserStorage';
import { captureUtm, currentUtm } from '../lib/utm';
import type { UtmParams } from '../lib/utm';

export type { UtmParams } from '../lib/utm';

function currentSearch(): string {
  return typeof window === 'undefined' ? '' : window.location.search;
}

export function captureUtmFromSearch(search: string): void {
  captureUtm(getSessionStorage(), search);
}

export function getUtmParams(): UtmParams {
  return currentUtm(getSessionStorage(), currentSearch());
}

export function getUtmSource(): string | null {
  return getUtmParams().utm_source ?? null;
}
