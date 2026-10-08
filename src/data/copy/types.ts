// Shapes shared by the page copy files and the section components that render them. They live in
// src/data so copy never imports from src/components (data → components would invert the layering).
import type { OfferId, OfferLine } from '../offers';

// One row of a before/after strip (spec §6.3, §6A.2).
export type BeforeAfterRow = { before: string; after: string };

// One step of a "How it works" timeline (spec §6.6, §6A.6).
export type TimelineStep = {
  when: string; // e.g. "Day 0"
  whenNote?: string; // e.g. "within 1 business day of booking"
  what: string;
  emphasis?: string; // bold sentence after `what`
};

// A timeline step whose `whenNote` may be a sign-off-gated claim (spec §8.4.3), e.g. the home session's
// "within 3 business days of payment". Resolve with resolveTimelineSteps in src/lib/claims.ts.
export type GatedTimelineStep = Omit<TimelineStep, 'whenNote'> & { whenNote?: string | OfferLine };

// The "What you get" + picker section (spec §6.5 work, §6A.4 home).
export type WhatYouGetCopy = {
  heading: string;
  cosLabel?: string; // work only: the Chief of Staff card's label (home has no Chief of Staff card)
  pickerHeading: string;
  pickerIntro: string;
  summaryLabel: string;
  summary: (picks: string, price: string) => string; // `price` is the displayed price, e.g. "$2,000"
  summaryNoPicks: string;
  toolsLine?: string;
};

// The meal plan's time and money band (spec §6A.5). `hours` is an optional line under the time math;
// leave it unset unless it states only allowed numbers (spec §12) or none.
export type TimeMathCopy = {
  heading: string;
  label: string;
  beforeLabel: string; // screen-reader only, before the struck-through value
  before: string;
  arrow: string; // screen-reader only, in place of the arrow icon
  after: string;
  hours?: string;
  statValue: string;
  statBody: string;
  source: string;
};

// Which page a shared section is rendering for (spec §6 work, §6A home).
export type Audience = OfferId;

// A "What I won't do" line (spec §6.4): a gated line, with optional /home wording when the work wording
// doesn't fit (e.g. it mentions the fit call, which /home doesn't have). Resolve with resolveWontDo.
export type WontDoLine = OfferLine & { home?: string };
