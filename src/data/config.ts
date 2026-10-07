// Single source of truth for brand name, copy, and integrations.
// "Roger" is a code name — change productName here to rename everywhere.
export const siteConfig = {
  productName: 'Roger',
  seo: {
    title: 'Roger: Personal intelligence for home and work',
    description:
    'Roger prepares your week like a chef preps a kitchen: dinners planned and groceries ordered at home, inbox drafted and meetings followed up at work.'
  },
  taglines: {
    mastery: 'Mastery, in everything you hand off.',
    miseEnPlace: 'Mise en place for your life.',
    prepared: 'Everything prepared. Nothing dropped.',
    sunday: "Dinner's planned. Groceries are ordered. You've got your Sunday back."
  },
  cta: {
    primary: 'Join the waitlist',
    success: "You're on the list. We'll be in touch.",
    seeHome: 'See a week at home',
    seeWork: 'See a day at work'
  },
  // POST target for signups (WAITLIST_ENDPOINT). Leave empty to simulate success locally.
  waitlistEndpoint: '',
  analytics: {
    enabled: false,
    provider: 'plausible' as 'plausible' | 'ga4'
  },
  contactEmail: 'hello@example.com',
  accentColour: '#9A5226'
};

export type TaglineKey = keyof typeof siteConfig.taglines;