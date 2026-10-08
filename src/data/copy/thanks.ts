// Copy for the post-payment pages and the catch-all (spec §9.2, §9.4; plan: Open Questions → Resolved
// During Planning). Roger's "we" voice, Canadian spelling. No amounts: these pages follow a payment
// that already happened, so they never restate a price. Gated lines render through renderLine.
import type { MenuKind } from '../menu';
import type { OfferLine } from '../offers';

// Shown when the Cal session link isn't configured (instead of "Opening soon": they've already paid).
// The email sentence appears, with a mailto link, only when siteConfig.contactEmail is set.
export const bookingFallbackCopy = {
  text: "We'll email you within 1 business day to book.",
  emailLead: 'Or email us at',
  mailtoSubject: (kind: MenuKind) => (kind === 'work' ? 'Booking Session 1' : 'Booking my home session')
};

export const thanksWorkCopy = {
  meta: { title: 'Deposit received · Book Session 1 · Roger' },
  eyebrow: 'Thank you',
  heading: 'Deposit received.',
  receipt: 'Your receipt is on its way from Stripe.',
  book: 'Book Session 1',
  bookNote: 'Times are in the next 2 business days.',
  picksLabel: 'Your helpers:',
  checklistHeading: 'Before Session 1',
  checklist: [
    'Admin access to your email and calendar.',
    'A list of your tools: the apps and accounts you use to run the business.',
    'Who on the team should join Session 2.'
  ]
};

export const thanksHomeCopy = {
  meta: { title: 'Payment received · Book your session · Roger' },
  eyebrow: 'Thank you',
  heading: 'Payment received.',
  receipt: 'Your receipt is on its way from Stripe.',
  book: 'Pick your 90-min session',
  // Spec §6A.6 timing, gated by sign-off (spec §8.4.3).
  timing: {
    text: 'Sessions are within 3 business days of payment.',
    needs: 'homeSessionLeadConfirmed',
    fallback: 'Pick a time that suits you.'
  } satisfies OfferLine,
  picksLabel: 'Your jobs:',
  checklistHeading: 'Before your session',
  checklist: [
    'Your phone and laptop, charged.',
    'The sign-ins for the email and calendar you want your assistant to use.',
    'The jobs you picked. Bring a recent example of each if you have one, like a school email or a bill.',
    '90 minutes somewhere you can talk.'
  ]
};

export const notFoundCopy = {
  meta: { title: 'Page not found · Roger' },
  eyebrow: '404',
  heading: "That page isn't here.",
  body: 'The link may be old, or mistyped. Try one of these:',
  links: [
    { to: '/', label: 'For your business' },
    { to: '/home', label: 'For your home' },
    { to: '/library', label: 'Use-case library' }
  ]
};
