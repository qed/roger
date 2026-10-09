# Roger

The marketing site for Roger: I set up AI assistants for small businesses and families in Toronto.

- `/` sells the **work setup** (an AI Chief of Staff plus 3 helpers, live in 5 days).
- `/home` sells the **home setup** (your first assistant doing 5 jobs, one session).
- `/workshops` takes free-workshop requests from hosts. `/library` is the use-case library.
- `/thanks/work`, `/thanks/home` follow payment. `/terms`, `/privacy`, `/refunds` are the legal pages.

Stack: Vite, React 18, TypeScript, Tailwind 3, React Router. No backend: checkout is Stripe Payment Links,
booking is Cal.com, forms post to Formspree.

## Run, test, build

```sh
npm install
npm run dev            # local dev server (also writes the launch status the preview banner reads)
npm test               # unit tests (node:test via tsx)
npm run typecheck      # app + node-test TypeScript projects
npm run lint
npm run build          # launch check + vite build into dist/
npm run test:bundle    # proves the preview-only banner and /launch never ship in a production build
npm run launch-check   # what's left before launch; add -- --json for machine-readable output
```

Locally, `npm run build` only reports the checklist. On Vercel production it enforces it (see Deploy).

## Launch checklist: the one TODO list

`npm run launch-check` is the single source of truth for what's left. Every TODO lives in
`src/data/launch.ts`; if it isn't there, it isn't tracked. Preview deploys show the same status in a banner
and at `/launch`.

Sign-offs are claims code can't verify (legal review, HST wording, password policy, ...). They live in
`src/data/signoff.ts`. Flip one only when it's true, **one commit per flip**: `signoff: <key>`
(e.g. `signoff: legalReviewed`). Claims gated on a sign-off appear on the site only once it's true.

**Launch is automatic.** The first production build that passes the check goes live on its own. Before
flipping the last sign-off or filling the last config value, deploy a preview of the final config and
check it.

## Deploy

- Vercel, Helix3 org. `main` auto-deploys to production.
- **Production builds fail until `launch-check` passes.** That's intended: a failed build keeps the
  current live site in place. After merge, every config or sign-off commit to `main` produces a failed
  production build until launch.
- Preview `main` with `vercel deploy` (no `--prod`). Branch pushes get preview deploys too, with the
  launch banner.
- The gate runs twice: `npm run build` runs `launch-check` first, and `vite.config.ts` re-runs it with
  `--strict` before bundling on any strict (Vercel production) build, so a bare `vite build` or a changed
  build command can't skip it. `ROGER_BUNDLE_CHECK=1` bypasses that second check; only
  `npm run test:bundle` sets it, for a throwaway build it scans and deletes. Never set it on Vercel.
- **Never** run `vercel deploy --prebuilt --prod` or upload a locally built `dist/`. Both skip the launch
  gate. "Promote to Production" in the dashboard is fine: it rebuilds and is gated.
- Emergency on the live site: use Vercel **Instant Rollback** in the dashboard. It pauses automatic
  assignment of the production domain until you undo it, so later merges won't go live until then.

## Where things live

| What | Where |
|---|---|
| Prices, links, email, proof slots | `src/data/config.ts` (empty values hide their element or show "Opening soon") |
| Sign-offs | `src/data/signoff.ts` |
| Launch checklist | `src/data/launch.ts` |
| Offers, guarantee, "what working means" | `src/data/offers.ts` |
| Helper and home-job menus | `src/data/menu.ts` |
| Page copy | `src/data/copy/*.ts` (one file per page, plus `shared.ts`, `legal.ts`) |
| FAQs | `src/data/faqs.ts` (work), `src/data/homeFaqs.ts` (home) |
| Case studies, library seed | `src/data/caseStudies.ts`, `src/data/library.ts` |

Copy never hard-codes a price: amounts come from `displayedOffer()` so they switch together when founding
spots run out. `src/data/data.test.ts` sweeps all copy for stray amounts and numbers.

## Stripe setup

Payment Links (live mode; `launch-check` rejects `test_` links):

| Link | Where it goes |
|---|---|
| Work, paid in full ($2,000) | `config.stripe.workDeposit` ("Skip the call", and pasted in fit calls) |
| Home | `config.stripe.homeCheckout` (on `/home` only) |
| Work, regular price ($3,000) | `config.stripe.workDepositRegular` (used once founding spots are full) |
| Home, regular price ($750) | `config.stripe.homeCheckoutRegular` (used once founding spots are full) |

On each link:
- **Allow promotion codes.** Without it, workshop codes are silently ignored.
- After payment, redirect to an **absolute** `https://{domain}/thanks/work` (work) or
  `https://{domain}/thanks/home` (home), on the **same origin** that serves checkout, so the visitor's
  picks in sessionStorage survive.
- Statement descriptor `ROGER`. On the work link, collect phone and add a "Business name" field.

**After the founding 10 (the swap).** The CTAs pick the link for the price the site shows: the founding
links while `config.founding.spotsLeft > 0`, the regular links once it's `0`. The founding link is never a
fallback, so an empty regular link shows "Opening soon" (and hides the workshop-code banner) rather than
charging the old price. Create both regular-price links before the last founding spot goes, paste them into
`workDepositRegular` / `homeCheckoutRegular`, then set `spotsLeft: 0` in one commit. `launch-check` lists
them as not blocking while founding spots remain and makes them **blocking** once `spotsLeft` is `0`.

**Workshop codes.** For each group, e.g. `OSSINGTON`:
1. Create two promotion codes, `OSSINGTONWORK` and `OSSINGTONHOME`. Alphanumeric only (Stripe
   ignores `prefilled_promo_code` with a hyphen). Both must exist.
2. Add `OSSINGTON` to `config.workshopCodes`. Codes not in that list are ignored.
3. QR code / link: `https://{domain}/?code=OSSINGTON`.

The site sends `prefilled_promo_code` and a `client_reference_id` (`{w|h}-{picks}__{utm_source}`).
Peter's first test payment is the real check that the link, code and redirect work.

## Cal.com setup

- **Fit call**: 20 min, public, a slot every business day. → `config.cal.fitCall`
- **Work Session 1** and **Home session**: unlisted. → `config.cal.workSession1`, `config.cal.homeSession`
- On each event, add booking questions with identifiers **`picks`** and **`code`** (short text). The
  site prefills them from the URL.
- On a fit call, when you paste the work payment link and they came from a workshop, append
  `?prefilled_promo_code={GROUP}WORK`.

Peter's first test booking is the real check that the prefill works.

## Forms

Workshop requests and the newsletter post JSON to Formspree endpoints in `config.forms`. An empty endpoint
shows "Opening soon". Each form has a `_gotcha` honeypot field; keep Formspree's spam filtering on.

## For agents and scripts

- `npm run launch-check -- --json` prints `{ mode, summary, items: [{ id, label, kind, blocking, optional, done }], done, total, blockingMissing }`.
  Exit code is `0` in report mode. With `--strict` (or on a Vercel production build) it exits `1` while
  `blockingMissing` is non-empty.
- Every value Peter owes goes in `src/data/config.ts` (links, endpoints, email, proof) or `src/data/signoff.ts`
  (yes/no claims, one commit each). Nothing else needs editing to launch.
- `npm test` runs every `*.test.ts`. A registry test fails if a new test file isn't listed in the `test` script.
- Regenerate the share image after editing `scripts/og-source.html`:
  `msedge --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot=public/og.png file:///<repo>/scripts/og-source.html`

## Docs

- `artifacts/`: the briefs and the v3 design spec (`artifacts/rogers-v3-design-spec.md`). Don't move or
  rename files here.
- `docs/brainstorms/`: requirements. `docs/plans/`: implementation plans.
- `docs/solutions/`: a knowledge base of problems already solved here (Stripe and Cal URL params, the
  launch gate, URL-param capture, price copy, form hardening). Read the relevant entry before changing
  checkout links, gating, forms or price copy.
