// Router location state shared by in-app URL rewrites and ScrollToHash. A navigation that only tidies
// the URL (e.g. stripping ?code=) carries this marker so ScrollToHash leaves the scroll position alone.
export const PRESERVE_SCROLL_STATE = { preserveScroll: true } as const;

export function preservesScroll(state: unknown): boolean {
  return typeof state === 'object' && state !== null && (state as { preserveScroll?: unknown }).preserveScroll === true;
}
