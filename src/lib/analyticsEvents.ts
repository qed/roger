// The analytics events the site may fire (spec §9.7), and nothing else. trackEvent and TrackedEvent
// accept only these names, and analyticsEvents.test.ts scans src/ to prove each one is fired somewhere.
// Props per event: cta_click {cta, location}, checkout_open {offer, picks}, fitcall_open {picks},
// picker_change {offer, count}, sticky_cta_click {cta}, newsletter_submit {for}, library_filter {cat, for},
// library_outbound {id}, library_to_offer {id}; workshop_request_submit and calc_used take none.
export const ANALYTICS_EVENTS = [
  'cta_click',
  'checkout_open',
  'fitcall_open',
  'picker_change',
  'sticky_cta_click',
  'workshop_request_submit',
  'newsletter_submit',
  'library_filter',
  'library_outbound',
  'library_to_offer',
  'calc_used'
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];
