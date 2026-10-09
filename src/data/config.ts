// Single source of truth for brand, prices, links and proof slots (spec §8).
// Framework-free: the Node launch-check script imports this file, so no import.meta, JSX or asset imports.
// Every empty value hides its element or shows "Opening soon" (spec §8.1). Track TODOs in src/data/launch.ts.
export const siteConfig = {
  productName: 'Roger',
  domain: 'https://meetroger.ai',
  founder: {
    name: 'Peter',
    photo: '', // optional (owner dropped it from launch, 2026-10-09); hidden when empty
    city: 'Toronto',
    links: [] as { label: string; href: string }[] // e.g. X, LinkedIn
  },
  contactEmail: 'hello@meetroger.ai',
  headline: 'A' as 'A' | 'B' | 'C',
  // After the founding 10 (spec §3.1): $3,000 work and $750 home. Both are paid in full up front
  // (owner decision, 2026-10-09), so there is no deposit or balance.
  prices: {
    work: 2000,
    home: 500,
    regularWork: 3000,
    regularHome: 750,
    currency: 'CAD' as const
  },
  anchor: { adminHourly: 0, source: '' }, // TODO(Peter): sourced Toronto admin hourly rate; hidden if 0
  founding: { total: 10, spotsLeft: 10, perk: 'a free 60-day tune-up session' },
  capacityLine: 'We take 3 setups a week',
  speed: { fitCallDays: 1, session1Days: 2, liveDays: 5, homeSessionLeadDays: 3 },
  providerCostRange: '', // optional: e.g. "$20–$40", shown only in the "cost after setup" FAQs; hidden if empty
  taxNote: 'Prices in CAD. No HST is charged.', // HST wording (owner: small supplier, confirmed 2026-10-09)
  stripe: {
    workDeposit: 'https://buy.stripe.com/eVq28keXBgxScuT8Zx8g00n', // $2,000 work Payment Link (paid in full): "Skip the call" + pasted on fit calls
    homeCheckout: 'https://buy.stripe.com/14AcMY8zda9u1Qf3Fd8g00o', // $500 Payment Link (on /home only)
    // Regular prices (spec §3.4): once founding.spotsLeft hits 0 the CTAs switch to these. Empty → "Opening soon".
    workDepositRegular: '', // $3,000 work Payment Link used once founding spots are full
    homeCheckoutRegular: '' // $750 home Payment Link used once founding spots are full
  },
  cal: {
    fitCall: 'https://cal.com/peter.k/roger-fit-call', // 20-min, public, slots every business day
    workSession1: 'https://cal.com/peter.k/roger-session-1-90-minutes', // 90 min; shown only on /thanks/work, next 2 business days
    homeSession: 'https://cal.com/peter.k/roger-session-1-60-minutes' // 60 min; shown only on /thanks/home
  },
  forms: { workshopEndpoint: '', newsletterEndpoint: '' },
  // Workshop group codes Peter has created in Stripe (as {GROUP}WORK / {GROUP}HOME promotion codes).
  // Alphanumeric, uppercase, e.g. 'OSSINGTON'. A ?code= not in this list is ignored.
  workshopCodes: [] as string[],
  proof: {
    counter: { setups: 0, workshops: 0, refunds: 0 },
    endorsements: [] as { org: string; person: string; title: string; quote: string; logo?: string }[],
    videos: [] as { src: string; poster: string; caption: string; captionsVtt: string; kind: 'demo' | 'testimonial' }[],
    screenshots: [] as { src: string; caption: string }[],
    stats: [] as { value: string; label: string }[],
    sampleReport: '', // '/sample-setup-report.pdf'
    reviewsUrl: ''
  },
  workshopHostPack: '', // '/workshop-host-pack.pdf'
  analytics: { enabled: false, provider: 'plausible' as 'plausible' | 'ga4' },
  accentColour: '#9A5226'
};

export type SiteConfig = typeof siteConfig;
