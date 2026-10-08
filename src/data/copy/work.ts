// Main page `/` copy (spec §6.2, §6.3, §6.6, §10). Peter's first person, Canadian spelling, CAD.
// Verbatim from the spec. Amounts are functions of the displayed price (offerAmounts in
// src/lib/offerPrice.ts), so nothing here goes stale when founding spots fill (spec §3.1, §3.4).
// The "What you get" + picker copy is per offer, in ./whatYouGet.ts; pricing copy is in ./pricing.ts.
import type { SiteConfig } from '../config';
import type { BeforeAfterRow, TimelineStep } from './types';

export const workMeta = {
  title: 'Roger: an AI Chief of Staff for your business, set up in 5 days · Toronto',
  description: (price: string) =>
    `I set your business up with an AI Chief of Staff and 3 helpers that answer customers, chase invoices and draft every email, on your own accounts, live within 5 days. ${price} CAD, half only once it's running. Toronto.`
};

// §6.2 Hero (work only; /home has its own hero, spec §6A.1)
export const workHeroCopy = {
  eyebrow: 'Toronto · AI assistants, set up for your business',
  headlines: {
    A: 'Start every day with nothing waiting.',
    B: 'Close the laptop at six. Your business keeps answering.',
    C: 'Stop being the bottleneck in your own business.'
  } satisfies Record<SiteConfig['headline'], string>,
  subhead:
    "I'm Peter. I set your business up with an AI Chief of Staff and 3 helpers that answer customers, chase invoices and draft every email, on your own accounts, live within 5 days. Half up front, half only once it's running.",
  depositLead: 'Know you want it?',
  included: (price: string) => `What's included · ${price}`,
  phone: { title: 'Your Chief of Staff', time: 'Monday 6:48 AM' }
};

// §6.3 Before and after
export const workBeforeAfterCopy = {
  label: 'An example Monday',
  heading: "You're the bottleneck in your own business.",
  rows: [
    { before: '6:30 AM, catching up before you open', after: '6:48 AM, your brief is ready' },
    {
      before: 'Customer messages from Saturday, across email and Instagram, unanswered',
      after: 'Every customer message flagged, with a reply drafted'
    },
    { before: 'Two invoices overdue; you\'ll chase them "later"', after: 'Overdue invoices chased Friday; one already paid' },
    { before: 'Forty-odd unread emails', after: 'Every email that needs you already has a draft' },
    {
      before: 'You start the day behind',
      after: 'You approve over coffee in about 10 minutes and open with nothing waiting'
    }
  ] satisfies BeforeAfterRow[],
  closing: 'Same business. Same tools. One less job: yours.'
};

// §6.6 How it works
export const workTimelineCopy = {
  heading: 'How it works',
  steps: [
    {
      when: 'Day 0',
      whenNote: 'within 1 business day of booking',
      what: 'Fit call. Deposit paid and Session 1 booked before you hang up.'
    },
    {
      when: 'Day 1–2',
      what: 'Session 1: accounts connected, Chief of Staff live.',
      emphasis: 'First brief and drafts within the hour.'
    },
    { when: 'Day 3–5', what: 'Session 2: your 3 helpers live.', emphasis: 'Fully live by day 5.' },
    { when: 'Day 5–12', what: "A full week of running. We check it's working together. Balance due." },
    { when: '30 days', what: 'Email support. Setup report in your inbox.' }
  ] satisfies TimelineStep[],
  note: 'Everything set up before you need it.'
};
