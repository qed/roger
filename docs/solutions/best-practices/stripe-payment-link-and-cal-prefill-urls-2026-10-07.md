---
title: Building Stripe Payment Link and Cal.com prefill URLs that don't silently lose data
date: 2026-10-07
category: docs/solutions/best-practices/
module: checkout links (src/lib/checkoutLinks.ts, workshopCode.ts, clientReference.ts)
problem_type: best_practice
component: payments
severity: high
applies_when:
  - Appending prefilled_promo_code, client_reference_id or other params to a Stripe Payment Link
  - Prefilling Cal.com booking questions from URL query params
  - Designing promo or referral code formats that must reach Stripe Checkout
tags: [stripe, payment-links, cal-com, prefill, promo-codes, client-reference-id, url-encoding]
---

# Building Stripe Payment Link and Cal.com prefill URLs that don't silently lose data

## Context
Roger v3 sends visitors to hosted Stripe Payment Links and Cal.com booking pages, carrying the visitor's
picks and a workshop discount code in the URL. Both services **ignore bad params without any error**:
checkout still loads, the booking page still opens, and the discount or attribution is just gone. Nothing
fails loudly, so the rules below have to be designed in up front.

## Guidance
1. **`prefilled_promo_code` is alphanumeric only.** A hyphenated code like `OSSINGTON-WORK` is silently
   ignored, so the attendee pays full price. Use codes like `OSSINGTONWORK` and normalise input to
   `[A-Z0-9]`. Promotion codes must also be enabled on the Payment Link, or the param does nothing.
2. **`client_reference_id` allows `[A-Za-z0-9_-]`, max 200 chars**, and invalid values are dropped. Sanitise
   every part, and truncate the least important part first (we keep the traffic source and cut the picks).
3. **Encode Cal.com prefill values with `encodeURIComponent` (`%20`), not `URLSearchParams` (`+`).**
   Cal.com reads a literal `+` as a space. Cal's own docs call this out for phone numbers. The query param
   name is the booking question's identifier (e.g. `?picks=`).
4. **Replace, don't append, keys the base link may already carry.** A Payment Link pasted with
   `?prefilled_promo_code=EARLY` plus our appended value means two values and undefined behaviour.
5. **Allow-list codes before showing a discount.** Any `?code=` would otherwise show a "code applied" banner
   for a code Stripe will ignore. Accept only codes in config, re-check them on read, and reject over-length
   input rather than truncating it to a prefix that happens to match.
6. **Each suffixed code must exist in Stripe exactly as the site builds it** (`{GROUP}WORK` *and*
   `{GROUP}HOME`). The site can't verify this, so it's an operator checklist item.

## Why This Matters
Every failure here is silent: checkout loads at full price, the booking arrives without picks, or the
attribution column is blank. Tests on the URL builder are the only place these regressions can be caught
before a customer notices.

## When to Apply
- Any site that hands visitors to hosted checkout or booking pages with prefilled data.
- Whenever a new param or code format is introduced for Stripe or Cal.

## Examples
- `appendParams('https://buy.stripe.com/x?prefilled_promo_code=EARLY&locale=en', [['prefilled_promo_code','OSSINGTONWORK']])`
  → `...?locale=en&prefilled_promo_code=OSSINGTONWORK` (existing key replaced, other params kept).
- Cal picks: `picks=Customer%20messages%2C%20Lead%20follow-up`, not `picks=Customer+messages...`.
- `buildClientReference('work', ['work-customers'], 'u'.repeat(500))` → `w-cust__uuu…` (exactly 200 chars,
  separator and source kept).

## Related
- Stripe URL params: https://docs.stripe.com/payment-links/url-parameters
- Cal.com prefill: https://cal.com/help/bookings/prefill-fields
- Plan: docs/plans/2026-10-07-001-feat-roger-v3-site-plan.md (Key Technical Decisions)
- Tests: src/lib/checkoutLinks.test.ts, src/lib/workshopCode.test.ts, src/lib/clientReference.test.ts
