// Shapes shared by the page copy files and the section components that render them. They live in
// src/data so copy never imports from src/components (data → components would invert the layering).

// One row of a before/after strip (spec §6.3, §6A.2).
export type BeforeAfterRow = { before: string; after: string };

// One step of a "How it works" timeline (spec §6.6, §6A.6).
export type TimelineStep = {
  when: string; // e.g. "Day 0"
  whenNote?: string; // e.g. "within 1 business day of booking"
  what: string;
  emphasis?: string; // bold sentence after `what`
};

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
