// Copy for the shared layout, CTAs and sections (spec §6.1, §6.4, §6.8, §6.9, §6.11, §6.12, §8.3, §9).
// Roger's "we" voice (owner decision, 2026-10-08), Canadian spelling. Gated lines carry `needs` (spec §8.4.3) and render through
// renderLine in src/lib/claims.ts. Strings stating a price or refund are functions of the
// displayed amounts (offerAmounts in src/lib/offerPrice.ts), never a hard-coded "$2,000".
import type { OfferAmounts } from '../offers';
import type { Audience, WontDoLine } from './types';

export const ctaLabels = {
  openingSoon: 'Opening soon',
  fitCall: 'Book a fit call',
  fitCallFree: 'Book a free fit call',
  fitCallHero: 'Book a free 20-min fit call',
  deposit: 'Pay & book',
  depositSkip: (price: string) => `Skip the call: pay ${price}`,
  depositHero: (price: string) => `Pay ${price} & book`,
  // Sticky mobile bar (spec §9.6)
  stickyFitCall: 'Book fit call',
  stickyDeposit: 'Pay & book'
};

// Home checkout labels carry the displayed price (founding or regular, see displayedOffer), e.g. "$500".
export const homeCheckoutLabels = {
  short: (price: string) => `Pay ${price} & book`,
  long: (price: string) => `Pay ${price} & book your session`,
  sticky: (price: string) => `Pay ${price} & book`
};

// Screen-reader-only text around a CTA (spec §10 a11y).
export const ctaA11yCopy = {
  newTab: ' (opens in a new tab)',
  disabledPrefix: (label: string) => `${label}: ` // before "Opening soon" on a disabled CTA
};

// Founding badge and capacity text (spec §3.4, §6.7).
export const foundingCopy = {
  spotsLeft: (left: number, total: number) => `${left} of ${total} founding spots left`,
  full: 'Founding spots are full',
  fullWithPrice: (regularPrice: string) => `Founding spots are full. Regular price from here: ${regularPrice}.`,
  badge: (spotsLeft: string) => `${spotsLeft}.`
};

// Form submit failure (R12b): the email clause is dropped when no contact email is configured.
export const formCopy = {
  submitError: (contactEmail: string) =>
    contactEmail ? `Something went wrong. Try again, or email ${contactEmail}.` : 'Something went wrong. Try again.',
  // The spam-trap field's label. Hidden from people (visually and from assistive tech); bots read it.
  honeypotLabel: 'Leave this field empty'
};

// Copy that only makes sense next to a live CTA; it hides with the CTA.
export const ctaNotes = {
  fitCallNext: 'Next available: within 1 business day.',
  depositFitCheck: (deposit: string) =>
    `Your first 15 minutes of Session 1 is the fit check. If we can't help, you get the full ${deposit} back.`
};

export const headerCopy = {
  nav: [
    { id: 'how', label: 'How it works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' }
  ],
  forHome: { label: 'For your home', to: '/home' },
  forBusiness: { label: 'For your business', to: '/' },
  menuOpen: 'Open menu',
  menuClose: 'Close menu'
};

export const footerCopy = {
  links: [
    { to: '/workshops', label: 'Workshops' },
    { to: '/library', label: 'Use-case library' },
    { to: '/home', label: 'For your home' },
    { to: '/terms', label: 'Terms' },
    { to: '/privacy', label: 'Privacy' },
    { to: '/refunds', label: 'Refunds' }
  ],
  madeIn: 'Made in Toronto'
};

// Workshop code banner (spec §9.3). `code` is the promotion code Stripe will apply for this offer.
export const workshopBannerCopy = {
  text: (code: string) => `Workshop code ${code} will be applied at checkout`
};

// Newsletter (spec §8.3, §6.11).
export const newsletterCopy = {
  prompt: 'Not ready? Get 5 real AI-assistant use cases every week.',
  heading: 'Get 5 real AI-assistant use cases every week.',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.ca',
  submit: 'Send me the use cases',
  submitting: 'Sending…',
  success: "You're in. First one lands next week.",
  invalidEmail: 'Enter a valid email address, like name@example.ca.'
};

// Proof section (spec §6.4, R9a).
export const proofCopy: {
  caseStudiesHeading: Record<Audience, string>;
  metricBefore: string;
  metricAfter: string;
  screenshotsHeading: Record<Audience, string>;
  sampleReport: string;
  reviews: string;
  wontDoHeading: string;
  wontDo: WontDoLine[];
} = {
  caseStudiesHeading: { work: 'Set up for real Toronto businesses.', home: 'Set up for real Toronto homes.' },
  metricBefore: 'Before',
  metricAfter: 'After',
  screenshotsHeading: { work: 'We run our own business this way', home: 'We run our own week this way' },
  sampleReport: 'See exactly what you get →',
  reviews: 'Read independent reviews ↗',
  wontDoHeading: "What we won't do",
  wontDo: [
    { text: "We won't set up anything that sends money or messages on its own unless you write the rule." },
    {
      text: "We won't promise a task the assistant can't do reliably yet. If it's shaky, we'll tell you on the fit call.",
      // /home has no fit call (spec §6A): the visitor pays, then books the session.
      home: "We won't promise a job the assistant can't do reliably yet. If one you picked is shaky, we'll tell you before we set it up."
    }
  ]
};

// Work guarantee (spec §6.8), shared by the band and FAQ #6 (src/data/faqs.ts).
export const workGuaranteeBody = (a: OfferAmounts) =>
  `You pay ${a.price} to book. If your Chief of Staff and 3 helpers aren't working within 14 days of Session 1, we refund the full ${a.price}.`;

const workWorking =
  "Every helper you picked has run on its own at least once and produced something you'd actually use. We check it together, and it's written into your setup report. If we disagree, you decide.";

// FAQ #6 is the guarantee text. The password line in §6.8 is gated and not repeated here.
export const workGuaranteeAnswer = (a: OfferAmounts) =>
  [workGuaranteeBody(a), `What "working" means: ${workWorking}`, 'How to claim: one email. No forms, no questions about why.'].join(' ');

// Guarantee band (spec §6.8, §6A.8).
export const guaranteeCopy = {
  heading: 'Working, or you pay nothing.',
  work: {
    body: (a: OfferAmounts) => [workGuaranteeBody(a)],
    workingLabel: 'What "working" means:',
    working: workWorking
  },
  home: {
    body: (a: OfferAmounts) => [
      `If your assistant isn't doing your 5 jobs within 14 days of your session, we'll refund the full ${a.price}. If we disagree on whether it's working, you decide.`
    ],
    workingLabel: '',
    working: ''
  },
  claimLabel: 'How to claim:',
  claim: 'One email. No forms, no questions about why.'
};

// About section (spec §6.9, replaced by Peter's decision on 2026-10-08): the section introduces Roger,
// not a person, so it needs no full name and no bio sign-off. Text approved verbatim by Peter.
export const aboutCopy = {
  eyebrow: 'About',
  heading: 'Roger',
  body: 'Roger is a personal intelligent implementation system. This means that we help you set up agents and bots to help you be more productive, save you time and make you money.'
};

// Final CTA band (spec §6.11, §6A.10).
export const finalCtaCopy = {
  work: { heading: 'Hand it off. Get the hours back.' },
  home: { heading: 'Get your Sundays back.' }
};

// Picker (spec §6.5, §6A.4). {max} is the picker's limit.
export const pickerCopy = {
  overMax: 'Pick up to {max}. Swap one out first.',
  examples: 'See real examples →',
  count: '{n} of {max} picked'
};

// Phone mockup (spec §6.2, §6A.1). Its counts are an illustration, so it carries a visible "Example"
// badge and the accessible label starts with "Example:" (spec §12: numbers are labelled "example").
export const phoneMockupCopy = {
  example: 'Example',
  label: (title: string, time: string, view: 'home' | 'work') =>
    `Example: ${title} · ${time}: ${
      view === 'home' ? 'a Sunday message with dinner ideas for the week' : 'a morning brief with drafted replies and prepped meetings'
    }`
};

// Before/after strip column labels (spec §6.3, §6A.2).
export const beforeAfterCopy = { before: 'Before', after: 'After' };

export const faqCopy = {
  heading: 'Questions'
};
