// Pricing card, DIY comparison and payback calculator copy (spec §6.7, §6A.7).
// Gated lines carry `needs` (spec §8.4.3) and render through renderLine.
import type { OfferId, OfferLine } from '../offers';

// Price-derived strings are functions of the displayed price (founding or regular; see displayedOffer in
// src/lib/offerPrice.ts), so nothing here hard-codes an amount that changes when founding spots fill.
export type PricingCopy = {
  priceNote: (monthly: string) => string; // after "{price} CAD"

  futurePrice: OfferLine; // small print under the price
  includesHeading: string;
  includes: OfferLine[];
  speedLabel: string;
  speed: OfferLine[]; // joined with " · "
  guaranteeLabel: string;
  guarantee: (price: string) => string; // home states its own price; work's amounts are the deposit
  homeLine?: { text: string; linkText: (homePrice: string) => string; to: string };
};

export const pricingCopy: Record<OfferId, PricingCopy> = {
  work: {
    priceNote: (monthly) => `one-time · About ${monthly} a month over your first year.`,
    futurePrice: {
      text: 'Founding price · becomes $3,000 after the first 10 clients.',
      needs: 'futurePriceCommitted',
      fallback: 'Founding price'
    },
    includesHeading: 'Includes',
    includes: [
      { text: 'Fit call' },
      { text: '2 sessions' },
      { text: 'Chief of Staff + 3 helpers' },
      { text: 'Setup report with your before/after numbers', emphasis: true },
      { text: '30 days support' },
      { text: 'Founding bonus: 60-day tune-up', needs: 'foundingPerkConfirmed' }
    ],
    speedLabel: 'Speed',
    speed: [{ text: 'fit call within 1 business day' }, { text: 'live within 5 days' }],
    guaranteeLabel: 'Guarantee',
    guarantee: () => 'working within 14 days or a full refund · second $1,000 due only once it runs.',
    homeLine: { text: 'Setting up your home instead?', linkText: (homePrice) => `Home setup, ${homePrice} →`, to: '/home' }
  },
  home: {
    priceNote: (monthly) => `one-time · about ${monthly} a month over your first year.`,
    futurePrice: {
      text: 'Founding price · becomes $750 after the first 10 clients.',
      needs: 'futurePriceCommitted',
      fallback: 'Founding price'
    },
    includesHeading: 'Includes',
    includes: [
      { text: '90-min session' },
      { text: '5 jobs you pick' },
      { text: 'Setup report', emphasis: true },
      { text: 'Day-7 check-in' },
      { text: '30 days support' },
      { text: 'Founding bonus: 60-day tune-up', needs: 'foundingPerkConfirmed' }
    ],
    speedLabel: 'Speed',
    speed: [
      {
        text: 'session within 3 business days of payment',
        needs: 'homeSessionLeadConfirmed',
        fallback: 'Pick a time that suits you'
      },
      { text: 'live the same day' }
    ],
    guaranteeLabel: 'Guarantee',
    guarantee: (price) => `working within 14 days or a full ${price} refund.`
  }
};

export const pricingFootnotes = {
  carePlans: 'Ongoing care plans available after setup.'
};

// "Do it yourself vs. Roger" (spec §6.7). The home table mirrors the work one with the home terms.
type DiyRow = { label: string; diy: string; roger: string | ((price: string) => string) };

export const diyCopy: Record<OfferId, { caption: string; rows: DiyRow[] }> = {
  work: {
    caption: 'Do it yourself vs. Roger',
    rows: [
      { label: 'Cost', diy: "Your assistant's subscription", roger: (price) => `${price} once + the same subscription` },
      { label: 'Choosing an assistant', diy: 'You compare them', roger: 'I pick, and tell you why' },
      { label: 'Connecting email, calendar, tools', diy: 'Your evenings, trial and error', roger: 'Done in Session 1' },
      { label: 'Time to live', diy: 'Usually weeks', roger: '5 days' },
      { label: 'When something breaks in week 1', diy: 'Forums', roger: 'Me, for 30 days' },
      { label: "If it doesn't work", diy: 'Your time is gone', roger: 'You pay nothing' }
    ]
  },
  home: {
    caption: 'Do it yourself vs. Roger',
    rows: [
      { label: 'Cost', diy: "Your assistant's subscription", roger: (price) => `${price} once + the same subscription` },
      { label: 'Choosing an assistant', diy: 'You compare them', roger: 'I pick, and tell you why' },
      { label: 'Connecting email and calendar', diy: 'Your evenings, trial and error', roger: 'Done in your session' },
      { label: 'Time to live', diy: 'Usually weeks', roger: 'The same day' },
      { label: 'When something breaks in week 1', diy: 'Forums', roger: 'Me, for 30 days' },
      { label: "If it doesn't work", diy: 'Your time is gone', roger: 'You pay nothing' }
    ]
  }
};

export const diyColumns = { diy: 'Do it yourself' };

// Admin anchor (spec §6.7): renders only when siteConfig.anchor.adminHourly > 0.
export const adminAnchorCopy = {
  text: 'A part-time admin at {hourly}/hour for 10 hours a week costs about {annual} a year. This is {price} once.',
  sourcePrefix: 'Source: '
};

// Payback calculator (spec §6.7).
export const calculatorCopy = {
  heading: 'When does it pay for itself?',
  hoursLabel: 'Hours saved per week',
  rateLabel: 'Value of your hour (CAD)',
  result: 'At {h} hours a week, this pays for itself in about {weeks} weeks.',
  resultOneHour: 'At 1 hour a week, this pays for itself in about {weeks} weeks.',
  resultOneWeek: 'At {h} hours a week, this pays for itself in about 1 week.',
  resultOneHourOneWeek: 'At 1 hour a week, this pays for itself in about 1 week.',
  ratePrompt: 'Enter the value of your hour.',
  label: 'Your numbers, not a promise.'
};
