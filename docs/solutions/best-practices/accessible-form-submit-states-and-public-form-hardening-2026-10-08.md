---
title: Form submit states that keep keyboard focus, and hardening public no-backend forms
date: 2026-10-08
category: docs/solutions/best-practices/
module: forms (src/lib/formPost.ts, src/components/forms/*)
problem_type: best_practice
component: frontend_stimulus
severity: medium
applies_when:
  - A form disables its submit button while posting
  - A static site posts JSON straight from the browser to a form service (Formspree and similar)
tags: [accessibility, forms, focus-management, aria-disabled, honeypot, spam, fetch-timeout, formspree]
---

# Form submit states that keep keyboard focus, and hardening public no-backend forms

## Context
Roger's workshop request and newsletter forms post JSON from the browser to a form service. Review
found two kinds of problem. One was accessibility: keyboard users lost their place on every submit. The
other was robustness: anyone could post megabytes, bots weren't filtered, and a hung endpoint showed
"Sending…" forever.

## Guidance
1. **Don't `disabled` a focused button mid-submit.** Pressing Enter or Space on it disables it, the
   browser blurs it, and focus falls to `<body>`. When the post fails and the button re-enables, focus is
   still lost. Use `aria-disabled="true"` while posting and ignore activation (the submitter already
   guards double posts). Keep real `disabled` only for a form that can't submit at all ("Opening soon").
2. **Announce every state change in one polite live region.** It shows "Sending…" while posting and the
   error after a failure. On failure, move focus to that status element (`tabIndex={-1}`). On success,
   focus the success message.
3. **Mark required fields once.** A visible `*` with `aria-hidden` plus `aria-required` is enough. An
   sr-only "(required)" on top makes screen readers say it twice.
4. **Harden what the browser sends, since there's no server of yours in between.**
   - Set `maxLength` on inputs *and* enforce the same caps in validation. Pasted text and scripts skip
     the attribute.
   - Add a honeypot (`_gotcha`, sr-only, `aria-hidden`, `tabIndex=-1`, `autocomplete=off`). If it's
     filled, show the normal success but don't post or fire analytics.
   - Time out `fetch` with an AbortController (about 15s) and treat it as an error.
   - Validate config-supplied URLs (logos must be same-origin paths, downloads `/…` or `https://…`).
5. **Test the function that actually runs.** Compose the payload (shape, then UTM) in one library
   function that both the hook and the tests call. A test-only copy of the composition proves nothing.

## Why This Matters
These failures are silent in a mouse-driven click-through. They show up as keyboard users giving up, an
inbox full of spam, or a lead stuck on "Sending…".

## When to Apply
Any client-only form, especially one posting to a third-party form endpoint.

## Examples
- `src/lib/formPost.ts`: `submitButtonState`, `liveStatusText`, `honeypotTripped`, `buildPostBody`,
  `postJson` with timeout, and `createSubmitter`. All are unit-tested.
- `src/lib/safeHref.ts`: `sameOriginPath`, `hostPackHref`.

## Related
- docs/solutions/best-practices/spa-url-param-capture-without-scroll-or-attribution-bugs-2026-10-07.md
