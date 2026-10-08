# Roger v3: verification record (Unit 12)

Branch `feat/roger-v3`, verified 2026-10-08 against `artifacts/rogers-v3-design-spec.md` §12 and the plan's
R1–R14. Config is the launch-time empty state (no links, no proof, all sign-offs false).

## Automated checks

| Check | Result |
|---|---|
| `npm test` | 361 tests, 0 failures (node:test via tsx; registry test proves every test file runs) |
| `npm run typecheck`, `tsc -p tsconfig.node.json`, `npm run lint` | clean |
| `npm run build` (local, report mode) | passes; `Launch check: 0/28 done · 20 blocking` |
| `VERCEL=1 VERCEL_ENV=production npm run build` | **fails**, lists the 20 blocking items |
| `VERCEL=1` with `VERCEL_ENV` missing | **fails** (fail-closed) |
| `VERCEL=1 VERCEL_ENV=production npx vite build` (bare Vite) | **fails** in the Vite launch-gate plugin |
| `VERCEL=1 VERCEL_ENV=preview npm run build` | passes (report mode) |
| `npm run test:bundle` | production bundle contains no launch tooling; preview bundle does |
| Real Vercel preview build of the branch | completed successfully (GitHub deployment status), so report mode works on Vercel |

## Spec §12 acceptance

| Item | Status |
|---|---|
| `/` sells only the work setup (one card; home only in header link, pricing line and footer) | met |
| No "waitlist" string in `src/` | met (grep: 0) |
| No invented numbers, testimonials, names or logos | met; enforced by the per-state price sweep and the §12 number allow-list tests; mockups labelled "Example" |
| No struck-through prices | met (only the "2–3 hours" time strikethrough, which is allowed) |
| Every library card credits a handle, links the original, uses our words, routes to an offer | met (browser-checked) |
| Stripe or Cal reachable in ≤ 2 clicks from any section | met by structure (header CTA + sticky bar + section CTAs); links empty until Peter fills config |
| Picks reach Cal (prefilled) and Stripe `client_reference_id` | met (unit-tested; browser-checked with temporary links) |
| `grep buy.stripe.com dist/` only work-deposit and home links | met (0 today; the balance link is never in config) |
| Every proof slot hides cleanly when empty | met (tested; browser-checked) |
| Every TODO(Peter) has a line in `src/data/launch.ts` | met (17 spec TODOs → 33 checklist items) |
| `launch-check` runs; production build fails, normal build passes | met (above) |
| Claim lines don't render while their sign-off is false | met (tested) |
| Banner and `/launch` absent from the production bundle | met (`test:bundle`) |

## Lighthouse (mobile emulation, `vite preview`, report-mode build)

| Route | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/` | 92 | 97 | 100 | 91 |
| `/home` | 97 | 96 | 100 | 91 |
| `/library` | 93 | 100 | 100 | 91 |
| `/workshops` | 99 | 100 | — | — |

All meet the spec's ≥ 90 for performance and accessibility. Scores vary ±5 between runs.

## Browser QA (Chrome, 375–1280 px)

Every route renders with no horizontal scroll and no console errors. Behaviours checked across Units 6–11:
- picker limits
- `?code=` capture and stripping
- UTM merge
- sticky bar show/hide
- form error/success/focus states
- library URL sync and the debounce race
- zero-results state
- deep links to lazy pages (`/home#faq`)
- meta restore between routes
- thanks pages with and without picks
- `/launch` → not-found in production builds

## Not yet done (needs Peter)

- **R4c(2):** a staged production build on real Vercel (`vercel deploy --prod --skip-domain`) failing with the blocker list. The Vercel CLI here is logged out.
- **R4c(3):** confirm in the Vercel dashboard that the production branch is `main` and the Build Command isn't overridden. `vercel.json` pins it either way.
- **Library URLs:** the 33 x.com links couldn't be reached from this machine, so the `libraryVerified` sign-off stays false.
- **Real Stripe and Cal flows:** need Peter's links; the README covers the first test payment and booking.

## Self-grade (spec §2 rubric, strict, as the site stands with today's empty config)

| Criterion | Grade now | Evidence | What lifts it |
|---|---|---|---|
| Dream outcome | **A-** | Hero "Start every day with nothing waiting."; "An example Monday" before/after; every helper and home job has an outcome headline; `/home` "Get your Sundays back." | — |
| Believability | **C+** | Only "What I won't do" renders; no case studies, no photo, bio hidden until signed off; Peter's name and Toronto show | B+ once the 3 pilot case studies, photo and bio land (launch gates); A- to A as endorsements, screenshots, sample report and reviews fill |
| Speed | **A-** | "Within 1 business day" / "live within 5 days" in hero, timeline and pricing; first brief within the hour | — |
| Ease | **A** (built) | One primary CTA plus "Skip the call"; picker carries picks to Cal and Stripe; sticky mobile bar; ≤ 2 clicks; every CTA reads "Opening soon" until links are set | Live once Stripe and Cal links are configured |
| Price & value | **B+** | One card, $167/month framing, DIY table, payback calculator, setup report in includes; provider-cost line and admin anchor hidden until configured | A- once `providerCostRange` and the sourced anchor are set; A with case-study numbers |
| Risk reversal | **A-** | "Working, or you pay nothing" band, written definition where the client decides, second half due only once it runs, one-email claim; password line gated | A once the password sign-off lands; A+ with a refunds counter track record |
| Path to $10K | **B** | One product, one page, one action; the gate holds the launch until pilots and workshops exist | A when the launch gates pass (3 pilots, 2 workshops booked); A+ after the first 2 paid work sales |

Believability is graded strictly per §12 ("no grade above B+ without the 3 case studies").
