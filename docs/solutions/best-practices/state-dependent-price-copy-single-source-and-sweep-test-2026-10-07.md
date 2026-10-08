---
title: Price copy that changes at a threshold — one source of amounts and a per-state sweep test
date: 2026-10-07
category: docs/solutions/best-practices/
module: pricing copy (src/lib/offerPrice.ts, src/data/copy/*.ts, src/data/data.test.ts)
problem_type: best_practice
component: payments
severity: high
applies_when:
  - Displayed prices switch at a threshold (founding/early-bird → regular, sale → full price)
  - Many strings across the site state an amount (CTAs, guarantees, FAQs, meta descriptions)
  - Showing a stale or mixed price would be misleading (consumer-protection rules on reference prices)
tags: [pricing, copy, founding-price, testing, sweep-test, consumer-protection, single-source-of-truth, invented-numbers]
last_updated: 2026-10-07
---

# Price copy that changes at a threshold — one source of amounts and a per-state sweep test

## Context
Roger's work setup is $2,000 (paid $1,000 / $1,000) for the first 10 clients, then $3,000 ($1,500 /
$1,500). Amounts appear in about 20 places. A review of the first page build found that once founding spots
ran out, the card said "$3,000" while the badge, the guarantee band and two FAQs still said "$1,000". A
data test that allowed "any configured price" passed, because $1,000 *is* a configured price — just not in
that state.

## Guidance
1. **One function decides what's shown.** `displayedOffer(offer, config)` returns the price, deposit,
   balance, monthly figure and whether founding pricing applies. `offerAmounts()` formats them. Every
   amount-bearing string is a function of those amounts, and nothing hard-codes "$1,000".
2. **Enforce the relationships the copy relies on.** "Half up front, half once it runs" needs
   `deposit * 2 === price` in both tiers. Test that as a config invariant instead of silently clamping.
3. **Sweep all copy in each state with a state-specific allow-list.** Render every exported copy string and
   function (including FAQs through the real `faqAnswer`) for the founding state and the full state.
   Allow *only that state's* amounts, and fail on leftover `{`, `undefined`, `NaN` or `[object`. In the full
   state, also fail on founding-only words ("founding", "tune-up") outside the one sentence that announces
   the change.
4. **Make the sweep offer-strict, not just state-strict.** Map each copy module to the offer it renders
   on (an explicit table, not a `/home/i` path regex). Home-only modules may state only home amounts, and
   work-only modules only work amounts. Only modules shown on both pages get the union.
5. **Ban unsourced numbers outright.** Marketing copy attracts plausible extrapolations ("Up to 150 hours a
   year back"). A second sweep strips the allowed number phrases per path (prices, time commitments,
   the cited stat, "example"-labelled illustrations) and fails on any digit left over.
6. **The checkout link must switch tier with the copy.** A Stripe Payment Link has a fixed price. If
   the page flips to "Pay $1,500" while the button still points at the $1,000 link, customers are charged
   less than the page states and the guarantee refunds the wrong amount. Keep separate founding and regular
   link slots and choose by the same `isFounding` the copy uses. If the regular link isn't set, show
   "Opening soon", never the founding link. The launch checklist makes the regular links blocking once
   spots run out. (A whole-branch review caught this at the seam between the copy unit and the checkout
   unit; neither unit's own review could have.)
7. **Mutation-test the sweeps once.** Plant a stale `$1,000`, a "founding" and a `{oops}` in a copy file
   and confirm all three fail. Otherwise the sweep may be passing vacuously.

## Why This Matters
Mixed prices on one page look like bait-and-switch, and can be one under consumer-protection rules on
reference pricing. The bug only appears on the day the threshold is crossed, long after anyone last
looked at the page.

## When to Apply
Any site whose prices change by count, date or campaign.

## Examples
- `src/lib/offerPrice.ts` (`displayedOffer`, `offerAmounts`), `src/data/data.test.ts` (invariants + sweep).
- Full state renders only $3,000 / $1,500 / $750 / $250 / $63. Founding state renders only
  $2,000 / $1,000 / $500 / $167 / $42 (plus the gated "becomes $3,000" future-price line).

## Related
- docs/solutions/best-practices/stripe-payment-link-and-cal-prefill-urls-2026-10-07.md
- Spec: artifacts/rogers-v3-design-spec.md §3.4 (no struck-through reference prices)
