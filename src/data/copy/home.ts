// `/home` copy (spec §6A). Peter's first person, Canadian spelling, CAD. The hero headline and subhead
// and the before/after rows are verbatim from the spec; the rest is a draft for Peter to approve.
// Copy says "I set you up", never "Roger does X" (spec §1, decision 1). Amounts are functions of the
// displayed price (offerAmounts in src/lib/offerPrice.ts), so nothing goes stale when founding spots fill.
// The meal-plan steps live in ../homeContent.ts; the job menu in ../menu.ts; the FAQ in ../homeFaqs.ts.
import type { BeforeAfterRow, GatedTimelineStep, TimeMathCopy } from './types';

export const homeMeta = {
  title: 'Roger at home: your first AI assistant, set up for you · Toronto',
  description: (price: string) =>
    `I'll set you up with your first AI assistant, on your own account, doing 5 jobs you hate: the meal plan, the school emails, the bills. One 90-minute session, live the same day. ${price} CAD. Toronto.`
};

// §6A.1 Hero
export const homeHeroCopy = {
  eyebrow: 'Toronto · AI assistants, set up for your home',
  headline: 'Get your Sundays back.',
  subhead:
    "I'm Peter. I'll set you up with your first AI assistant, on your own account, doing 5 jobs you hate: the meal plan, the school emails, the bills. Live the same day.",
  seeJobs: 'See the 12 jobs',
  phone: { title: 'Your assistant', time: 'Sunday 8:12 AM' }
};

// §6A.2 Before and after (rows verbatim)
export const homeBeforeAfterCopy = {
  label: 'An example Sunday',
  heading: 'The jobs that eat your week.',
  rows: [
    { before: '"What\'s for dinner?" asked all week', after: 'Dinners picked in 5 minutes' },
    { before: 'A school email you missed the form in', after: 'Forms and dates pulled out for you' },
    {
      before: 'A Sunday afternoon at the grocery store',
      after: 'Cart built with your brands; you pick a pickup window'
    },
    { before: 'A subscription you forgot to cancel', after: 'Flagged before it renews' }
  ] satisfies BeforeAfterRow[],
  closing: 'Same family. Same week. Five fewer jobs.'
};

// §6A.4 The picker section's id, so the hero's "See the 12 jobs" link can scroll to it.
export const HOME_JOBS_ID = 'jobs';

// §6A.5 Featured example: the weekly meal plan (steps in ../homeContent.ts, then the time-math band).
export const homeMealPlanCopy: {
  label: string;
  heading: string;
  intro: string;
  timeMath: TimeMathCopy;
} = {
  label: 'Featured example',
  heading: 'The weekly meal plan',
  intro: "One of the 12 jobs, the way I'd set it up for you. You stay in charge: nothing is ordered until you've checked the cart.",
  timeMath: {
    heading: 'Time and money back',
    label: 'Meal planning, lists and shopping, every week',
    beforeLabel: 'was', // screen-reader only, before the struck-through time
    before: '2–3 hours',
    arrow: 'becomes', // screen-reader only, in place of the arrow icon
    after: '10 minutes',
    // No `hours` line: there's no sourced yearly figure, and spec §12 allows no invented numbers.
    // TimeMathBand renders the optional line only when it's set (see TimeMathCopy).
    // A sourced statistic, not a price: the copy sweep allows this one figure at this one path.
    statValue: '$1,300+',
    statBody:
      'of edible food thrown out by the average Canadian household each year. The plan uses each ingredient two or three ways, so less of it ends up in the bin.',
    source: 'Source: National Zero Waste Council, 2022'
  }
};

// §6A.6 How it works. The session step's lead time is gated on homeSessionLeadConfirmed (spec §8.4.3).
export const homeTimelineCopy = {
  heading: 'How it works',
  steps: [
    { when: 'Day 0', what: 'Pay, then pick a time for your 90-minute session.' },
    {
      when: 'Your session',
      whenNote: {
        text: 'within 3 business days of payment',
        needs: 'homeSessionLeadConfirmed',
        fallback: 'Pick a time that suits you'
      },
      what: 'By video, or in person in Toronto on request. I set up your assistant on your own account, doing your 5 jobs.',
      emphasis: 'Live the same day.'
    },
    { when: 'Day 7', what: "Check-in. We look at each job together, and it goes into your setup report." },
    { when: 'Day 14', what: "Guarantee window closes. If it isn't doing your 5 jobs, you get a full refund." },
    { when: '30 days', what: 'Email support for questions and tweaks.' }
  ] satisfies GatedTimelineStep[],
  note: 'Days count from your session.'
};
