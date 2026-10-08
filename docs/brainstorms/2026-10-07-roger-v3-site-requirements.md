---
date: 2026-10-07
topic: roger-v3-site
---

# Roger v3 Site

## Problem Frame

The live site (meetroger.vercel.app) is a waitlist for a software product. Roger is actually a service: Peter sets businesses up with AI assistants on their own accounts. v3 turns the site into one that sells one product, the **$2,000 work setup**, with a $500 home setup on `/home`, a host-facing `/workshops` page and a `/library` of real use cases.

**Source of truth:** `artifacts/rogers-v3-design-spec.md` (874 lines, including §8.4 launch checklist). This document does not restate the spec. It records the decisions made in brainstorming, fills the gaps the spec leaves, and defines what "done" means for this build cycle. Where this doc and the spec disagree, this doc wins (it is newer); everywhere else, follow the spec.

## Requirements

**Spec conformance**
- R1. Build everything in spec §5–§10 and §8.4, in the §11 build order (chunks 1–8), including all routes, data files, checkout wiring, launch checklist, preview banner and `/launch` page.
- R2. Every acceptance item in spec §12 passes, and the final hand-back includes the §2 self-grade table citing the page element behind each grade.

**Deploy and launch safety**
- R3. Work happens on a feature branch and is merged to `main` once built and reviewed, even with empty config (user decision).
- R3a. **Before v3 merges**, ship a minimal patch to the current live site via `main`: the waitlist form stops faking success when its endpoint is empty and instead shows an honest message (signups not open yet, with a contact route). This is the last change the old site gets. After the merge, the gate freezes production until launch.
- R3b. After merge, Peter previews `main` with a Vercel preview deploy (`vercel deploy` without `--prod`), and the README documents this. If the old live site needs emergency action during the freeze, use Vercel Instant Rollback / the dashboard. Note that this pauses auto-assignment of the production domain until it's undone.
- R4. Merging to `main` must not replace the live site with a non-functional v3: the §8.4.5 strict prebuild gate fails the Vercel production build while any blocking item is ❌, so the current production deploy stays live. This must be verified (a local `VERCEL_ENV=production npm run build` fails and lists blockers) before merging.
- R5. Preview deploys of the branch build and show the launch-check banner, so Peter can review v3 at any time.
- R4a. The gate **fails closed** (deliberate tightening of spec §8.4.5/§8.4.6). On Vercel (`VERCEL === '1'`), any build whose `VERCEL_ENV` is not exactly `'preview'` runs strict, including a missing `VERCEL_ENV`. `__VERCEL_ENV__` defaults to `'production'` when building on Vercel. A strict run prints the env it saw, so the Vercel build log shows which mode ran.
- R4b. The gate cannot be skipped silently. The launch check runs inside the `build` script itself (`tsx scripts/launch-check.ts --write && vite build`), not only as an npm `prebuild` lifecycle hook, and `vercel.json` pins `buildCommand: "npm run build"` so a dashboard override can't bypass it. The `launch-status.json` fallback applies to `vite dev` only; a production build with the file missing fails.
- R4c. Pre-merge verification of R4 covers the real environment: (1) a local strict build fails and lists blockers, run in a form that works in the user's shell (Git Bash `VERCEL_ENV=production npm run build`, or PowerShell `$env:VERCEL_ENV='production'; npm run build`); (2) a real Vercel production-environment build that isn't assigned to the domain (`vercel deploy --prod --skip-domain` or equivalent) fails with the blocker list; (3) the Vercel dashboard confirms the production branch is `main`.
- R4d. `domain` ships empty (consistent with "all TODO(Peter) values ship empty"), so the `domain` launch item starts as ❌ instead of passing on an unconfirmed `meetroger.ai`.

**Gap-fills the spec leaves open**
- R6. Header CTA is page-aware: `/` and `/library` show **Book a fit call**; `/home` shows **Pay $500 & book**. Nav anchors (How it works · Pricing · FAQ) point at the current page's sections; on pages without those sections, they link to `/` sections.
- R7. Home FAQ answers (allergies and picky eaters, grocery delivery account, partner use) are drafted conservatively. They promise nothing beyond what the menu already says, and any password/ownership answer follows the same sign-off gating as the work FAQ.
- R8. Copy that interpolates an empty config value omits the clause rather than rendering a blank. For example, FAQ #3 drops the "(usually … /month)" parenthetical when `providerCostRange` is empty.
- R9. *(Dropped in review.)* The time-math band keeps its existing "2–3 hours" strikethrough. §12's rule covers prices, not time.
- R9a. Proof section empty state: the "Set up for real Toronto businesses." heading belongs to the case studies and hides with them. When all 7 proof slots are empty, the section renders only "What I won't do" under its own heading, never a bare heading over nothing.
- R9b. Hero proof line: the setups and refunds parts follow the §6.4 counter rule and appear only once `setups ≥ 3`. Spots left and the capacity line always show.
- R10. The founder photo and the hero visual hide when `/peter.jpg` doesn't exist. The existing stock photos are not presented as Peter or as a client. The hero may use a neutral image or no image.
- R11. `/og.png` exists: a simple brand image (toque mark, "Roger", cream/ink palette), so the Open Graph tags don't point at a 404.
- R12a. Library zero-results state: when the filters and search match nothing, show "No use cases match yet." with a "See every example" control that clears the filters. The fit-call band and newsletter form stay visible.
- R12b. Workshop and newsletter forms have loading and error states. The submit button is disabled while posting. On failure, an inline message reads "Something went wrong. Try again, or email {contactEmail}" (the email clause is omitted if it's empty), entered values are kept, and submit is re-enabled. If the endpoint is empty, the form renders "Opening soon" and never fakes success.
- R12c. On `/home`, the header's "For your home" link becomes "For your business" (→ `/`).
- R12. Legal pages (`/terms`, `/privacy`, `/refunds`) are drafted by the agent in plain language, with the "Draft — under review" banner. `/refunds` uses §3.5 verbatim.

**Verification**
- R13. The pure logic (Stripe/Cal URL building, `client_reference_id` sanitising, picks storage, workshop-code handling, launch checklist evaluation, payback calculation) has automated tests. They use only Node's built-in test runner via `tsx`, so the spec's "no new dependencies beyond `react-router-dom` and `tsx`" holds.
- R14. Every route is checked in a real browser at 360px and desktop widths before merge, along with Lighthouse ≥ 90 for performance and accessibility on `/`, `/home` and `/library`.

## Success Criteria
- A stranger on a preview URL can say within 5 seconds what's sold, the price and what to click (`/` for business, `/home` for a parent).
- `npm run launch-check` reports exactly what Peter still owes. Filling config and flipping sign-offs is the only work left before launch, with no further code changes.
- After merge, meetroger.vercel.app still serves the current site until launch-check passes; then v3 goes live automatically on the next push.
- No invented numbers, testimonials, names or logos anywhere; no "waitlist" string in `src/`.

## Scope Boundaries
- Everything in spec §13 (care plans, add-ons, referrals, paid workshops, Stripe webhook / single-use links, library pipeline, prerendered library pages).
- Peter's own work (spec §11 table): pilots, Stripe/Cal setup, PDFs, screenshots, legal and HST review. The build only provides the slots and the checklist entries for them.
- Verifying the 33 library URLs is a non-blocking `libraryVerified` sign-off. The agent may attempt it, but X often blocks unauthenticated fetches, so an inconclusive result is fine.

## Key Decisions
- **Merge to main when built:** rely on the §8.4.5 production gate, not on branch discipline, to keep the incomplete v3 off production. Simpler for Peter: one branch, and launch happens by editing config.
- **No real inputs yet:** all TODO(Peter) values ship empty; CTAs show "Opening soon" on previews.
- **Patch the live site, then merge:** chosen over a separate `live` branch. The fake-success waitlist is the only urgent defect in the old site; with it fixed, a frozen production is acceptable until launch.
- **Auto-launch, no `launchApproved` sign-off:** the commit that clears the last blocker deploys v3. Peter accepts the risk of a mistyped link going live unreviewed, and should check a preview of the final config before pushing the last sign-off.
- **Tests without new deps:** use `node:test` via `tsx` to respect the spec's dependency limit.

## Dependencies / Assumptions
- Vercel exposes `VERCEL_ENV` at build time (standard), but R4a/R4b mean safety no longer depends on that assumption.
- `src/generated/launch-status.json` is gitignored. A `predev` hook regenerates it so a fresh clone runs `npm run dev`, and the build script writes it before `vite build`.
- `src/package.json` (a Magic Patterns leftover, verified present with mismatched versions and no `"type": "module"`) is deleted in chunk 1, so tsx doesn't load `src/` modules as CommonJS. Modules that launch-check and the tests import stay free of framework code: no `import.meta`, JSX or asset imports.

## Outstanding Questions

### Deferred to Planning
- [Affects R1][Needs research] The exact Cal.com URL format for prefilling a booking question with identifier `picks` (spec §9.5).
- [Affects R4b][Technical] Confirm the Vercel dashboard Build Command is unset or `npm run build`. The committed `vercel.json` `buildCommand` pins it either way.
- [Affects R13][Technical] Picks storage takes an injectable Storage-like interface so `node:test` can pass an in-memory map. The test script lists its files explicitly rather than relying on tsx's discovery defaults.
- [Affects R5][Technical] Whether "Promote to Production" of a preview reuses the preview artifact, which would ship the banner. If so, document "never promote previews"; production must come from a fresh build on `main`.
- [Affects R1][Technical] How the `/launch` route and banner are excluded from the production bundle (a `__VERCEL_ENV__` define plus a dead-code-eliminated lazy import).

## Next Steps
→ `/ce:plan` for structured implementation planning
