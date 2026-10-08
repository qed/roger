---
title: Capturing URL params (promo codes, UTMs) in a React Router SPA without scroll jumps or lost attribution
date: 2026-10-07
category: docs/solutions/best-practices/
module: layout and CTA hooks (src/components/layout, src/hooks, src/lib/utm.ts, src/lib/workshopCode.ts)
problem_type: best_practice
component: frontend_stimulus
severity: medium
applies_when:
  - A landing URL carries params the app must remember and then remove (?code=, utm_*)
  - The app also scrolls to #hash targets on navigation
  - Several components on a page need the same captured value
tags: [react-router, spa, utm, attribution, scroll-restoration, url-params, session-storage, use-sync-external-store]
---

# Capturing URL params (promo codes, UTMs) in a React Router SPA without scroll jumps or lost attribution

## Context
Roger's workshop QR codes land on `/?code=OSSINGTON&utm_source=bia#pricing`. The code must be stored and
stripped from the URL (so shared links don't spread it). The UTM source must survive to checkout on any
page. The first version did this inside a hook that every CTA mounted, and reviews found three
bugs that appeared together.

## Guidance
1. **Capture once, in the layout, never in leaf components.** A `useCaptureX()` effect in `SiteLayout`
   reads the URL and writes storage. Every CTA uses a *pure read* hook over a small external store
   (`createWorkshopCodeStore(storage)` + `useSyncExternalStore`). With N components running the capture,
   there were N navigations, and only the first saw the param.
2. **Mark the strip navigation so scroll effects ignore it.** `navigate({ search: rest, hash }, { replace: true })`
   creates a new `location.key`. A ScrollToHash effect keyed on `key` (needed so repeat anchor clicks
   work) then *smooth-scrolls to the hash a second time* and pulls back a visitor who had already scrolled.
   Pass `state: { preserveScroll: true }` and skip it in the scroll effect. Don't read
   `history.state.usr` (a router internal).
3. **Merge UTMs per key, validate, and never write during render.** Replacing the stored object whenever
   the URL had any `utm_*` meant a later `?utm_medium=x` link erased `utm_source`. Merge per key (URL
   wins, other stored keys stay), allow only `[A-Za-z0-9 ._~+-]` up to 100 chars, and persist in the
   layout effect. Reads overlay the current URL on stored values so links are right on first render.
4. **Keep the decisions pure and tested.** `captureCodeFromSearch(search, allowList)` returns
   `{ code, nextSearch }` or `null`, and `mergeUtm(stored, fromUrl)` lives in `src/lib/utm.ts`. Both are
   unit-tested without a DOM. The hooks only wire them up.

## Why This Matters
Each bug is invisible in a quick click-through. Scroll jumps only happen when landing with both a param
and a hash, and attribution loss only shows up in Stripe's `client_reference_id` days later.

## When to Apply
Any SPA that consumes and removes tracking or promo params, especially alongside hash navigation.

## Examples
- `/?code=OSSINGTON&utm_source=bia#pricing` → one scroll to pricing, URL becomes `/?utm_source=bia#pricing`.
- A later visit to `/home?utm_medium=x` → stored `{utm_source:'bia', utm_medium:'x'}` → `client_reference_id=h-none__bia`.

## Related
- docs/solutions/best-practices/stripe-payment-link-and-cal-prefill-urls-2026-10-07.md
- Tests: src/lib/utm.test.ts, src/lib/workshopCode.test.ts
