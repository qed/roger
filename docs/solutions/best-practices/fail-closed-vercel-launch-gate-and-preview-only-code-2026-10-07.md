---
title: A fail-closed launch gate on Vercel, and keeping preview-only code out of production bundles
date: 2026-10-07
category: docs/solutions/best-practices/
module: build and deploy (scripts/build-env.ts, scripts/launch-check.ts, vite.config.ts, src/App.tsx)
problem_type: best_practice
component: tooling
severity: high
applies_when:
  - main auto-deploys to production but the site must not go live until a checklist passes
  - Some UI (debug banners, checklist pages) must exist on previews and never in production
  - Using Vite `define` plus React.lazy to strip code per environment
tags: [vercel, vite, deploy-gate, fail-closed, dead-code-elimination, react-lazy, launch-checklist]
---

# A fail-closed launch gate on Vercel, and keeping preview-only code out of production bundles

## Context
Roger v3 merges to `main`, which Vercel deploys to production straight away, long before Peter's inputs
(Stripe links, case studies, legal sign-off) exist. A failed production build keeps the previous
deployment live, so a build-time gate can hold the old site in place. The risk is a gate that passes by
accident.

## Guidance
1. **Decide strictness in one pure function and fail closed.** `resolveBuildEnv(env)` returns
   `{ mode, define }`. On Vercel (`VERCEL=1`), anything that isn't explicitly `VERCEL_ENV=preview` is
   strict, *including a missing VERCEL_ENV*. Keep the invariant `strict ⇔ define === 'production'` and
   test it for every row, so a build that passed the gate is always built as production.
2. **Run the gate inside `build`, not as an npm `prebuild` hook**, and pin `buildCommand` in
   `vercel.json`. A dashboard override or a package manager that skips lifecycle scripts would otherwise
   bypass it without any warning.
3. **Validate values, not just presence.** "Non-empty" passed `TODO` Cal links and Stripe *test-mode* links.
   Check for real https URLs, live `buy.stripe.com/<id>` links (no `test_`), and real asset files inside
   `public/` (`statSync().isFile()`, with no `..` escape).
4. **Put `lazy()` itself inside the build-time condition.** Vite replaces `__VERCEL_ENV__` with a constant
   and Rollup drops the dead branch. A top-level `lazy(() => import(...))` keeps the chunk in production
   even if it's never rendered. A `const flag = __VERCEL_ENV__ !== 'production'` plus a ternary works.
5. **Prove exclusion with a bundle check, not a comment.** `npm run test:bundle` builds once as production
   and once as preview (calling Vite directly, so the gate doesn't block it) and greps the JS for markers.
   The preview build *must* contain them, so the check can't pass with stale markers.
6. **Know the bypasses.** "Promote to Production" rebuilds with production env (gated). `vercel deploy
   --prebuilt --prod` and uploading a locally built `dist/` do not run the gate, so don't use them.

## Why This Matters
Every failure in this area is silent: an empty, unpaid-for site goes live, or a debug checklist ships to
customers. The gate is only trustworthy once each assumption has an automated test.

## When to Apply
- Any "merge early, launch later" project on an auto-deploying host.
- Any environment-specific UI in a Vite or React SPA.

## Examples
- Gate truth table: `scripts/build-env.test.ts`. CLI behaviour per env: `scripts/launch-check.test.ts`.
- Bundle exclusion: `scripts/bundle-check.ts` →
  `bundle-check: production clean; preview has Launch check, blockingMissing, launch-status`.

## Related
- docs/solutions/best-practices/stripe-payment-link-and-cal-prefill-urls-2026-10-07.md
- Vercel: promoting deployments rebuilds — https://vercel.com/docs/deployments/promoting-a-deployment
- Plan: docs/plans/2026-10-07-001-feat-roger-v3-site-plan.md (R4a–R4c, Unit 4)
