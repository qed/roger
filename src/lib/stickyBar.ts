// Sticky mobile CTA bar visibility (spec §9.6). The breakpoint itself is CSS (md:hidden); this decides
// everything else. Framework-free and tested.

export type StickyBarState = {
  heroCtaPassed: boolean; // the hero CTA has scrolled up out of view (not merely below the fold)
  finalBandVisible: boolean; // the final CTA band is on screen
  fieldFocused: boolean; // an input, textarea or select has focus
  liveCtaCount: number; // CTAs with a configured link
};

export function stickyBarVisible(state: StickyBarState): boolean {
  return state.liveCtaCount > 0 && state.heroCtaPassed && !state.finalBandVisible && !state.fieldFocused;
}

const FIELD_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

// Buttons, checkboxes and radios don't raise the on-screen keyboard, so they don't hide the bar.
const NON_TEXT_INPUTS = new Set(['button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color', 'file', 'image']);

// Accepts any element-like value (document.activeElement is an Element, which has no `type`).
export function isTextField(el: { tagName?: string; type?: unknown } | null | undefined): boolean {
  if (!el?.tagName) return false;
  const tag = el.tagName.toUpperCase();
  if (!FIELD_TAGS.has(tag)) return false;
  if (tag !== 'INPUT') return true;
  return !NON_TEXT_INPUTS.has((typeof el.type === 'string' ? el.type : 'text').toLowerCase());
}

// The hero CTA counts as passed only when it has left through the top of the viewport.
export function hasScrolledPast(entry: { isIntersecting: boolean; boundingClientRect: { bottom: number } }): boolean {
  return !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
}
