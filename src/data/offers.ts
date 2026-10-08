// The offers (spec §3): source of truth for what each setup includes, how fast it runs and the guarantee.
// Framework-free. Numbers come from siteConfig.prices; the copy strings state them as written in the spec
// (data.test.ts checks every $-amount in the copy matches a siteConfig.prices value).
// Sign-off-gated lines (founding perk, future price, home lead time) carry `needs`; render them only when
// the matching signoff flag is true, otherwise render `fallback` if present, else nothing (spec §8.4.3).
import { siteConfig } from './config';
import type { SignoffFlag } from './signoff';

export type OfferId = 'work' | 'home';

export type OfferLine = {
  text: string;
  emphasis?: boolean; // bold in the spec
  needs?: SignoffFlag;
  fallback?: string; // shown instead of `text` when `needs` is not signed off
};

export type Offer = {
  id: OfferId;
  name: string;
  price: number;
  regularPrice: number;
  deposit: number; // paid to book (home is paid in full up front, so deposit = price)
  currency: typeof siteConfig.prices.currency;
  futurePriceLine: OfferLine;
  whatYouGet: OfferLine[];
  how: OfferLine[];
  payment: string;
  guarantee: string;
  flow: string[];
};

const { prices } = siteConfig;

const workOffer: Offer = {
  id: 'work',
  name: 'Work setup',
  price: prices.work,
  regularPrice: prices.regularWork,
  deposit: prices.workDeposit,
  currency: prices.currency,
  futurePriceLine: {
    text: 'Founding price: $2,000. Becomes $3,000 after the first 10 clients.',
    needs: 'futurePriceCommitted'
  },
  whatYouGet: [
    { text: 'a Chief of Staff assistant for the owner plus 3 helper assistants picked from the menu', emphasis: true },
    { text: "set up on the business's own accounts and connected to its email, calendar and tools" },
    { text: 'a setup report with before/after numbers', emphasis: true },
    { text: '30 days of email support' },
    { text: 'Founding bonus: a 60-day tune-up session', needs: 'foundingPerkConfirmed' }
  ],
  how: [
    { text: 'free 20-min fit call within 1 business day' },
    { text: "if it's a fit, the deposit is paid and Session 1 booked during the call" },
    { text: 'Session 1 within 2 business days: the first brief and drafts within 1 hour' },
    { text: 'Session 2: helpers live' },
    { text: 'fully live within 5 days', emphasis: true },
    { text: 'remote by default; in person in Toronto on request' }
  ],
  payment: '$1,000 to book; $1,000 after a full week of running.',
  guarantee:
    "If your setup isn't working within 14 days of Session 1, I refund the $1,000 too. You pay nothing. The second half is only due once it runs.",
  flow: [
    'Book a free fit call → deposit link pasted in the call chat → /thanks/work → Session 1 booked before hanging up.',
    "Skip the call → $1,000 deposit Payment Link → /thanks/work → book Session 1. The fit check is the first 15 min of Session 1; full refund if it's not a fit."
  ]
};

const homeOffer: Offer = {
  id: 'home',
  name: 'Home setup',
  price: prices.home,
  regularPrice: prices.regularHome,
  deposit: prices.home,
  currency: prices.currency,
  futurePriceLine: {
    text: 'Founding price: $500. Becomes $750 after the first 10 clients.',
    needs: 'futurePriceCommitted'
  },
  whatYouGet: [
    { text: 'your first assistant, chosen for you and set up on your own account, doing 5 jobs you pick', emphasis: true },
    { text: 'a setup report' },
    { text: 'a day-7 check-in' },
    { text: '30 days of email support' },
    { text: 'Founding bonus: a 60-day tune-up session', needs: 'foundingPerkConfirmed' }
  ],
  how: [
    { text: 'one 90-min video session (in person in Toronto on request)' },
    {
      text: 'within 3 business days of payment',
      emphasis: true,
      needs: 'homeSessionLeadConfirmed',
      fallback: 'Pick a time that suits you'
    },
    { text: 'live the same day' }
  ],
  payment: '$500, paid up front.',
  guarantee: "Full $500 refund if it's not working within 14 days of the session.",
  flow: ['Pay $500 & book (Payment Link) → /thanks/home → book the session (picks prefilled).']
};

// What "working" means (spec §3.5). /refunds uses this verbatim.
export const workingDefinition = {
  working:
    'Working = every helper/job the client picked has run on its own at least once and produced output the client would use.',
  checked:
    "It's checked together at the end of the week of running (work) or at day 7 (home), and recorded in the setup report.",
  disagree: 'If Peter and the client disagree, the client decides.',
  windows: 'Windows: 14 days from Session 1 (work) or from the session (home).',
  claim: 'Claim: one email to contactEmail. Refund to the original card through Stripe within 10 business days.',
  accounts: 'When a refund happens, the client keeps their accounts. Peter removes his access.'
};

export const offers: Record<OfferId, Offer> = { work: workOffer, home: homeOffer };
