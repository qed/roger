# Circles marketing first pass

November 14, 2026. Feature-branch preview, not a production launch.

## Included

- Homepage adapted from the Circles canvas: hero and cycle diagram, live-agent strip, benefits, weekly-flow diagram, rules, entry bar, vetting, six recent library cards, founder letter fallbacks, USD/CAD price control, FAQ and closing CTA.
- `siteConfig.flags.circlesMode` restores the old homepage, navigation, footer, cards, metadata and legal pages when disabled.
- Agent availability comes from the existing current `public/zack` files (v1.9). Downloads and copy actions use those files unchanged. Existing group instruction routes remain intact.
- Circles navigation and footer, no old-offer links on the homepage/library, noindex on hidden old offers, updated sitemap/robots, and Circles social card.
- No fabricated pilot data or seats-left count. Library count appears only after a successful database query, never from seed fallback.
- `/apply` is an explicit closed-intake preview with no form or report collection. Terms/privacy are marked draft and accurately describe this preview.

## Not complete v1a

The two-step application, database schema, tokens, email gate, rate limits, report submission, save-for-later, deletion flow, admin application records, and delivery emails remain to be built and tested. Supporting deep pages currently use homepage anchors. The weekly automatic cycle and admin/Circle management are v2, not part of this pass.

Do not merge as a launch-ready application. No payment links were added. No production deployment was performed.

## Peter inputs before launch

- Letter edits/approval; optional headshot and signature.
- Confirm report retention. The Circles handoff leaves it undecided, while the newer collector file describes a 12-month shared collection policy. Resolve the scope and wording rather than assuming these are identical.
- Confidentiality agreement that explicitly covers AI processing of weekly runs.
- Review privacy and guarantee terms, processor terms and deletion/retention rules.
- Pilot data plus reviewed animation before showing the pilot section.
- Confirm the current collector's v1.9 member-controlled sharing rules against the older Circles attendance/weekly-delivery rules. No auto-sharing is implemented here.

## Verification

- `npm run build`: passed, Next.js 16.4.1.
- `npm run lint`: no errors, one existing unused `_p` warning in `src/app/admin/actions.ts`.
- Production browser checks: 320, 390, 768, 1024 and 1440px, no horizontal overflow; mobile menu and Escape; FAQ expansion; USD/CAD toggle, tab persistence and Canadian request default; four downloads return 200; 14 current/new routes return 200; hidden old routes carry noindex; no old-offer links on homepage, library or Circles Zack page; no runtime page errors.
- Local visual inspection: desktop/mobile homepage, weekly-flow diagram, price panel and closed-intake page. No external deployment was used for these checks.
- Dependencies were not changed. Existing npm audit output reports eight moderate vulnerabilities; dependency upgrades are outside this UI pass.
