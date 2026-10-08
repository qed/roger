// Legal pages (spec §6.12): /terms, /privacy, /refunds. Peter's first person, plain language, Canadian
// spelling. /refunds is spec §3.5 verbatim (workingDefinition in offers.ts) plus how to claim.
// /terms and /privacy are DRAFTS: they show a "Draft — under review" banner and are noindex until
// signoff.legalReviewed is true. TODO(Peter): have a lawyer review all three, then flip legalReviewed.
// No prices here: the only numbers are §3.5's time commitments (14 days, 10 business days, day 7,
// Session 1). data.test.ts sweeps this file for amounts and stray numbers.
import { workingDefinition } from '../offers';

export type LegalKind = 'terms' | 'privacy' | 'refunds';

export type LegalSection = { heading: string; paragraphs: string[]; link?: { to: string; label: string } };

export const legalMeta: Record<LegalKind, { title: string; description: string }> = {
  terms: {
    title: 'Terms · Roger',
    description: 'The plain-language terms for a Roger setup: what you buy, how payment works, and who is responsible for what.'
  },
  privacy: {
    title: 'Privacy · Roger',
    description: 'What this site collects, who processes it, and how to ask me to see, fix or delete it.'
  },
  refunds: {
    title: 'Refunds and the guarantee · Roger',
    description: 'What "working" means, how long you have, and how to claim a refund for a Roger setup.'
  }
};

export const legalBannerCopy = {
  label: 'Draft — under review',
  text: "This page is a plain-language draft that hasn't been reviewed by a lawyer yet. It may change before launch."
};

export const legalHeadings: Record<LegalKind, string> = {
  terms: 'Terms',
  privacy: 'Privacy',
  refunds: 'Refunds and the guarantee'
};

// The §3.5 claim line, split around its contactEmail placeholder so the page can link the address.
// With no address configured the placeholder becomes "Peter" (never an empty or broken mailto).
const [claimLead, claimRest] = workingDefinition.claim.split('contactEmail');

export const refundsCopy = {
  intro:
    "Every setup comes with a guarantee: if it isn't working, you get your money back. This is exactly what that means.",
  definitionHeading: 'What "working" means',
  // Spec §3.5, verbatim and in order. The claim line is rendered from claimLine below.
  definition: [
    workingDefinition.working,
    workingDefinition.checked,
    workingDefinition.disagree,
    workingDefinition.windows
  ],
  claimLine: { lead: claimLead, rest: claimRest, noEmail: 'Peter' },
  after: [workingDefinition.accounts],
  howHeading: 'How to claim',
  how: {
    lead: 'Send me one email',
    at: 'at',
    rest: "within the window. Say which setup it's for. You don't need to argue your case: if we disagree about whether it's working, you decide."
  }
};

export const termsCopy: { intro: string; sections: LegalSection[] } = {
  intro:
    'These terms cover the setups I sell on this site. I\'ve kept them short and plain. "I" and "me" means Peter, who runs Roger from Toronto, Ontario. "You" means the person or business buying a setup.',
  sections: [
    {
      heading: 'What you are buying',
      paragraphs: [
        'A setup service. I set up an AI assistant on your own accounts and connect it to the tools you choose, as described on the page you bought from. Your receipt and that page together describe what is included.',
        "It's a service, not software I own or host. Once it's set up, the assistant and its accounts are yours."
      ]
    },
    {
      heading: "Your accounts and the assistant's provider",
      paragraphs: [
        "The assistant runs on your own account with a third-party AI provider. You pay that provider directly, under its own terms. I don't control its prices, its uptime or how it changes its product.",
        'You decide what I can access during setup, and you can remove my access at any time.'
      ]
    },
    {
      heading: 'Payment',
      paragraphs: [
        'Prices are in Canadian dollars and paid through Stripe. The work setup is paid in two halves: one to book, the other once it has run for a full week. The home setup is paid in full up front.'
      ]
    },
    {
      heading: 'The guarantee',
      paragraphs: [
        "If your setup isn't working within the guarantee window, you get your money back. The Refunds page sets out exactly what \"working\" means and how to claim. It's the whole policy."
      ],
      link: { to: '/refunds', label: 'Refunds and the guarantee' }
    },
    {
      heading: 'What the assistant does, and what you still check',
      paragraphs: [
        'AI assistants make mistakes. Read anything important before you rely on it or send it, especially anything about money, health, allergies, legal matters or your customers.',
        'You are responsible for what is sent from your accounts and for following the rules that apply to your business, like privacy and anti-spam law.'
      ]
    },
    {
      heading: 'Limits',
      paragraphs: [
        "As far as the law allows, my total responsibility for anything to do with a setup is limited to what you paid me for it. I'm not responsible for losses caused by the AI provider, your other tools, or how the assistant's output is used.",
        'Nothing here takes away rights you have under consumer protection law that cannot be waived.'
      ]
    },
    {
      heading: 'Changes and the law that applies',
      paragraphs: [
        'If I change these terms, the version on this page when you paid applies to your setup.',
        'These terms are governed by the laws of Ontario and the federal laws of Canada that apply there.'
      ]
    }
  ]
};

export type AnalyticsProvider = 'plausible' | 'ga4';

const analyticsLine = (enabled: boolean, provider: AnalyticsProvider) =>
  !enabled
    ? "This site doesn't run analytics right now. If I turn it on, this page will say so first."
    : provider === 'plausible'
      ? 'I use Plausible to count visits and clicks, like which button was pressed and which page it was on. It records no names or email addresses and sets no cookies.'
      : 'I use Google Analytics to count visits and clicks, like which button was pressed and which page it was on. It records no names or email addresses through this site, but Google may set its own cookies.';

export const privacyCopy = {
  intro:
    "I'm Peter, and I run Roger from Toronto. I'm responsible for the personal information this site collects. Here is all of it, in plain language.",
  sections: (analytics: { enabled: boolean; provider: AnalyticsProvider }): LegalSection[] => [
    {
      heading: 'What the forms collect',
      paragraphs: [
        'The newsletter form collects your email address and which page you signed up from (business or home).',
        'The workshop request form collects what you type into it: your organisation, name, email, phone, group type, expected size, preferred month, in person or Zoom, and any notes.',
        'Both forms also send the campaign tags from the link you arrived on, if it had any (like utm_source=newsletter), so I know which link brought you. Forms are delivered to me by a form service, Formspree.'
      ]
    },
    {
      heading: 'Payments and bookings',
      paragraphs: [
        'Payments are handled by Stripe and bookings by Cal.com, each under its own privacy policy. I never see your card number.',
        'From Stripe I receive what you enter at checkout, like your name, email, phone and, for a work setup, your business name. From Cal.com I receive what you enter when you book. The checkout and booking links also carry the helpers or jobs you picked, a workshop code if you have one, and the campaign tag you arrived with.'
      ]
    },
    {
      heading: 'Analytics',
      paragraphs: [analyticsLine(analytics.enabled, analytics.provider)]
    },
    {
      heading: 'What stays in your browser',
      paragraphs: [
        "The site keeps your picks, any workshop code and your campaign tags in your browser's session storage so they carry through to checkout. They stay in that tab only and are cleared when you close it. The site itself sets no cookies."
      ]
    },
    {
      heading: 'What I do with it',
      paragraphs: [
        'I use it to reply to you, run your setup, send the newsletter you asked for, and see which links bring people here. I don\'t sell or rent your personal information, and I share it only with the services named on this page that run the site.',
        'You can unsubscribe from the newsletter at any time. You can ask me what I hold about you, or ask me to correct or delete it, by email.'
      ]
    }
  ]
};

export const legalContactCopy = {
  heading: 'Questions',
  withEmail: 'Email me at',
  withoutEmail: 'Ask me on your next call or reply to any email from me.'
};
