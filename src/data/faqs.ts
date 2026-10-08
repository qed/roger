// Work FAQ (spec §6.10). Copy only; gating and interpolation are applied at render time.
// - `needs`: render the item only when that signoff flag is true (spec §8.4.3).
// - `a` is a function of OfferAmounts when it states a deposit or refund amount, so it follows the
//   founding → regular switch (spec §3.1). Resolve it with faqText().
// - `interpolates`: the answer contains `{key}` filled from siteConfig. When the value is empty,
//   drop `optionalClause` from the answer (R8); if the whole answer is the value, hide the item.

import type { SiteConfig } from './config';
import type { OfferAmounts } from './offers';
import type { SignoffFlag } from './signoff';
import { workGuaranteeAnswer } from './copy/shared';

// siteConfig keys whose value is a plain string.
type StringConfigKey = { [K in keyof SiteConfig]: SiteConfig[K] extends string ? K : never }[keyof SiteConfig];
export type FaqInterpolationKey = Extract<StringConfigKey, 'providerCostRange' | 'taxNote'>;

export type Faq = {
  id: string;
  q: string;
  a: string | ((amounts: OfferAmounts) => string);
  needs?: SignoffFlag;
  interpolates?: FaqInterpolationKey;
  optionalClause?: string; // exact substring of `a` removed when the interpolated value is empty
};

export function faqText(faq: Pick<Faq, 'a'>, amounts: OfferAmounts): string {
  return typeof faq.a === 'function' ? faq.a(amounts) : faq.a;
}

// Work FAQ items that /home reuses (src/data/homeFaqs.ts). The ids are a typed tuple, so renaming one
// here is a compile error at every use instead of a runtime "no FAQ" throw.
export const SHARED_FAQ_IDS = ['own-it', 'passwords'] as const;
export type SharedFaqId = (typeof SHARED_FAQ_IDS)[number];

const sharedFaqBodies: Record<SharedFaqId, Omit<Faq, 'id'>> = {
  'own-it': {
    q: 'Do I own it?',
    a: 'Yes. It runs on your accounts. If we stop working together, everything keeps running.'
  },
  passwords: {
    q: 'What about my passwords and customer data?',
    a: "You sign in yourself during our session. We don't store passwords, and we remove our access at handover.",
    needs: 'passwordPolicy'
  }
};

export function sharedFaq(id: SharedFaqId): Faq {
  return { id, ...sharedFaqBodies[id] };
}

export const faqs: Faq[] = [
  {
    id: 'which-ai',
    q: 'Which AI do you use?',
    a: "Whichever fits your business. We're not tied to one company. We'll recommend one on the fit call and tell you why."
  },
  sharedFaq('own-it'),
  {
    id: 'cost-after',
    q: 'What does it cost after setup?',
    a: "Your assistant's own subscription, paid directly to the provider (usually {providerCostRange}/month). Care plans are available if you want us to keep tuning it.",
    interpolates: 'providerCostRange',
    optionalClause: ' (usually {providerCostRange}/month)'
  },
  sharedFaq('passwords'),
  {
    id: 'sends-without-asking',
    q: 'Does it send things without asking?',
    a: 'Only if you set a rule that it can. By default it drafts, and you approve.'
  },
  {
    id: 'doesnt-work',
    q: "What if it doesn't work?",
    a: workGuaranteeAnswer // the guarantee text (spec §6.8), from copy/shared.ts
  },
  {
    id: 'skip-call',
    q: 'What if I skip the call?',
    a: (a) => `The first 15 minutes of Session 1 is the fit check. If we can't help, you get the full ${a.deposit} back.`
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
