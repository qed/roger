// Work FAQ (spec §6.10). Copy only; gating and interpolation are applied at render time.
// - `needs`: render the item only when that signoff flag is true (spec §8.4.3).
// - `interpolates`: the answer contains `{key}` filled from siteConfig. When the value is empty,
//   drop `optionalClause` from the answer (R8); if the whole answer is the value, hide the item.

import type { SiteConfig } from './config';
import type { SignoffFlag } from './signoff';

// siteConfig keys whose value is a plain string.
type StringConfigKey = { [K in keyof SiteConfig]: SiteConfig[K] extends string ? K : never }[keyof SiteConfig];
export type FaqInterpolationKey = Extract<StringConfigKey, 'providerCostRange' | 'taxNote'>;

export type Faq = {
  id: string;
  q: string;
  a: string;
  needs?: SignoffFlag;
  interpolates?: FaqInterpolationKey;
  optionalClause?: string; // exact substring of `a` removed when the interpolated value is empty
};

// Guarantee text (spec §6.8), reused by FAQ #6. The password line in §6.8 is gated and not repeated here.
export const workGuaranteeAnswer = [
  "You pay $1,000 to book. The other $1,000 is due only after your Chief of Staff and 3 helpers have run for a full week. If it isn't working within 14 days of Session 1, I refund the $1,000 too.",
  "What \"working\" means: every helper you picked has run on its own at least once and produced something you'd actually use. We check it together, and it's written into your setup report. If we disagree, you decide.",
  'How to claim: one email. No forms, no questions about why.'
].join(' ');

export const faqs: Faq[] = [
  {
    id: 'which-ai',
    q: 'Which AI do you use?',
    a: "Whichever fits your business. I'm not tied to one company. I'll recommend one on the fit call and tell you why."
  },
  {
    id: 'own-it',
    q: 'Do I own it?',
    a: 'Yes. It runs on your accounts. If we stop working together, everything keeps running.'
  },
  {
    id: 'cost-after',
    q: 'What does it cost after setup?',
    a: "Your assistant's own subscription, paid directly to the provider (usually {providerCostRange}/month). Care plans are available if you want me to keep tuning it.",
    interpolates: 'providerCostRange',
    optionalClause: ' (usually {providerCostRange}/month)'
  },
  {
    id: 'passwords',
    q: 'What about my passwords and customer data?',
    a: "You sign in yourself during our session. I don't store passwords, and I remove my access at handover.",
    needs: 'passwordPolicy'
  },
  {
    id: 'sends-without-asking',
    q: 'Does it send things without asking?',
    a: 'Only if you set a rule that it can. By default it drafts, and you approve.'
  },
  {
    id: 'doesnt-work',
    q: "What if it doesn't work?",
    a: workGuaranteeAnswer
  },
  {
    id: 'skip-call',
    q: 'What if I skip the call?',
    a: "The first 15 minutes of Session 1 is the fit check. If I can't help, you get the full $1,000 back."
  },
  {
    id: 'staff',
    q: 'Can my staff use it?',
    a: 'Yes. Helpers can serve your team. We\'ll set out who sees what in Session 1.'
  },
  {
    id: 'remote',
    q: 'Remote or in person?',
    a: 'Remote by default. In person anywhere in Toronto on request.'
  },
  {
    id: 'hst',
    q: 'Do you charge HST?',
    a: '{taxNote}',
    interpolates: 'taxNote'
  }
];
