// "What you get" + picker section copy, per offer (spec §6.5 work, §6A.4 home). Peter's first person,
// Canadian spelling. The price comes in as the displayed price (founding or regular, spec §3.1).
import type { OfferId } from '../offers';
import type { WhatYouGetCopy } from './types';

export const whatYouGetCopy: Record<OfferId, WhatYouGetCopy> = {
  // §6.5: the Chief of Staff card + pick 3 of 8 helpers.
  work: {
    heading: 'One Chief of Staff. Three helpers. Your accounts.',
    cosLabel: 'Always included',
    pickerHeading: 'Build your setup',
    pickerIntro: 'Pick 3 of 8 helpers. Picking is optional.',
    summaryLabel: 'Your setup',
    summary: (picks, price) => `Chief of Staff + ${picks} · ${price}`,
    summaryNoPicks: '3 helpers',
    toolsLine:
      "Works with the tools you already use: email, calendar, accounting, booking and messaging apps. We'll confirm yours on the fit call."
  },
  // §6A.4: pick 5 of 12 home jobs; no Chief of Staff card. Draft copy (the spec gives only the summary).
  home: {
    heading: 'Five jobs you hate, off your plate.',
    pickerHeading: 'Pick your 5 jobs',
    pickerIntro: 'Pick 5 of 12. Picking is optional; we can choose together in your session.',
    summaryLabel: 'Your 5 jobs',
    summary: (picks, price) => `${picks} · ${price}`,
    summaryNoPicks: 'chosen in your session'
  }
};
