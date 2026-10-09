// Launch checklist (spec §8.4.2): every TODO(Peter) and launch gate as one line item.
// If a TODO isn't in this file, it isn't tracked. `npm run launch-check` prints it; production builds
// fail while any blocking item is undone (scripts/launch-check.ts).
// Framework-free: evaluated in Node, where assetExists checks /public on disk.
import { foundingIsFull } from '../lib/proofLines';
import type { CaseStudy } from './caseStudies';
import type { SiteConfig } from './config';
import type { Signoff } from './signoff';

export type LaunchCtx = {
  config: SiteConfig;
  signoff: Signoff;
  caseStudies: readonly CaseStudy[];
  assetExists: (publicPath: string) => boolean;
};

export type LaunchKind = 'config' | 'asset' | 'gate' | 'signoff';

export type LaunchItem = {
  id: string;
  label: string;
  kind: LaunchKind;
  blocking: boolean; // true = production deploy fails until done
  // Becomes blocking when this returns true (evaluateLaunch). The regular-price Payment Links are not
  // needed while founding spots remain, but once founding.spotsLeft is 0 every Work/Home CTA depends on
  // them, so a production build must not ship without them.
  blockingWhen?: (ctx: LaunchCtx) => boolean;
  optional?: boolean; // shown separately, not counted in the total
  check: (ctx: LaunchCtx) => boolean;
};

const EMAIL = /^[^\s@:]+@[^\s@]+\.[^\s@]{2,}$/;
const PLACEHOLDER = /\b(todo|tbd|example|placeholder)\b/i;
const filled = (value: string) => value.trim().length > 0;
// A real https URL that isn't a leftover placeholder.
const isHttpsUrl = (value: string) => {
  if (PLACEHOLDER.test(value)) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && url.hostname.includes('.');
  } catch {
    return false;
  }
};
// A live-mode Payment Link: test-mode links (buy.stripe.com/test_…) would take no real money.
const isPaymentLink = (value: string) => /^https:\/\/buy\.stripe\.com\/(?!test_)[A-Za-z0-9_-]+$/.test(value.trim());
const assetSet = (path: string, ctx: LaunchCtx) => filled(path) && ctx.assetExists(path);

// Same rule as the displayed price (offerPrice.ts), so the gate and the CTAs switch together.
const foundingFull = (c: LaunchCtx) => foundingIsFull(c.config.founding);

const usable = (s: CaseStudy) => s.permission === true && s.metrics.length >= 1;

export const launchChecklist: readonly LaunchItem[] = [
  // Blocking
  { id: 'contact-email', label: 'Public contact email', kind: 'config', blocking: true, check: (c) => EMAIL.test(c.config.contactEmail.trim()) && !PLACEHOLDER.test(c.config.contactEmail) },
  { id: 'domain', label: 'Domain confirmed', kind: 'config', blocking: true, check: (c) => isHttpsUrl(c.config.domain) },
  { id: 'founder-photo', label: 'Photo of Peter', kind: 'asset', blocking: true, check: (c) => assetSet(c.config.founder.photo, c) },
  { id: 'stripe-deposit', label: 'Work deposit Payment Link', kind: 'config', blocking: true, check: (c) => isPaymentLink(c.config.stripe.workDeposit) },
  { id: 'stripe-home', label: 'Home Payment Link', kind: 'config', blocking: true, check: (c) => isPaymentLink(c.config.stripe.homeCheckout) },
  { id: 'cal-fit', label: 'Fit-call booking link', kind: 'config', blocking: true, check: (c) => isHttpsUrl(c.config.cal.fitCall) },
  { id: 'cal-session1', label: 'Work Session 1 booking link', kind: 'config', blocking: true, check: (c) => isHttpsUrl(c.config.cal.workSession1) },
  { id: 'cal-home', label: 'Home session booking link', kind: 'config', blocking: true, check: (c) => isHttpsUrl(c.config.cal.homeSession) },
  { id: 'form-workshop', label: 'Workshop form endpoint', kind: 'config', blocking: true, check: (c) => isHttpsUrl(c.config.forms.workshopEndpoint) },
  { id: 'form-newsletter', label: 'Newsletter form endpoint', kind: 'config', blocking: true, check: (c) => isHttpsUrl(c.config.forms.newsletterEndpoint) },
  { id: 'provider-cost', label: 'Monthly provider cost range in the FAQs (optional)', kind: 'config', blocking: false, check: (c) => filled(c.config.providerCostRange) && !PLACEHOLDER.test(c.config.providerCostRange) },
  {
    id: 'case-studies',
    label: '3 pilot case studies (≥ 2 business)',
    kind: 'gate',
    blocking: true,
    check: (c) => {
      const ok = c.caseStudies.filter(usable);
      return ok.length >= 3 && ok.filter((s) => s.for === 'work').length >= 2;
    }
  },
  { id: 'workshops-booked', label: '2 workshops booked', kind: 'gate', blocking: true, check: (c) => c.signoff.workshopsBooked >= 2 },
  { id: 'legal', label: 'Terms, Privacy, Refunds reviewed', kind: 'signoff', blocking: true, check: (c) => c.signoff.legalReviewed },
  { id: 'hst', label: 'HST wording confirmed', kind: 'signoff', blocking: true, check: (c) => c.signoff.hstConfirmed },
  { id: 'passwords', label: 'Password/access claim is true', kind: 'signoff', blocking: true, check: (c) => c.signoff.passwordPolicy },
  { id: 'future-price', label: 'Will honour the post-founding prices', kind: 'signoff', blocking: true, check: (c) => c.signoff.futurePriceCommitted },
  // Not blocking
  { id: 'founding-perk', label: 'Founding perk confirmed', kind: 'signoff', blocking: false, check: (c) => c.signoff.foundingPerkConfirmed },
  { id: 'home-lead', label: 'Home session lead time confirmed', kind: 'signoff', blocking: false, check: (c) => c.signoff.homeSessionLeadConfirmed },
  {
    id: 'anchor',
    label: 'Sourced admin hourly rate',
    kind: 'config',
    blocking: false,
    check: (c) => c.config.anchor.adminHourly > 0 && filled(c.config.anchor.source)
  },
  {
    id: 'screenshots',
    label: '3 redacted Chief of Staff screenshots',
    kind: 'asset',
    blocking: false,
    check: (c) => c.config.proof.screenshots.length >= 3 && c.config.proof.screenshots.every((s) => assetSet(s.src, c))
  },
  { id: 'sample-report', label: 'Sample setup report PDF', kind: 'asset', blocking: false, check: (c) => assetSet(c.config.proof.sampleReport, c) },
  { id: 'host-pack', label: 'Workshop host pack PDF', kind: 'asset', blocking: false, check: (c) => assetSet(c.config.workshopHostPack, c) },
  { id: 'founder-links', label: 'X / LinkedIn links', kind: 'config', blocking: false, check: (c) => c.config.founder.links.length >= 1 },
  {
    id: 'stripe-deposit-regular',
    label: 'Regular-price work deposit Payment Link ready for after the founding 10',
    kind: 'config',
    blocking: false,
    blockingWhen: foundingFull,
    check: (c) => isPaymentLink(c.config.stripe.workDepositRegular)
  },
  {
    id: 'stripe-home-regular',
    label: 'Regular-price home Payment Link ready for after the founding 10',
    kind: 'config',
    blocking: false,
    blockingWhen: foundingFull,
    check: (c) => isPaymentLink(c.config.stripe.homeCheckoutRegular)
  },
  { id: 'library-links', label: 'Library URLs verified', kind: 'signoff', blocking: false, check: (c) => c.signoff.libraryVerified },
  // Optional: later proof, not counted in the total
  { id: 'endorsements', label: 'Endorsements', kind: 'config', blocking: false, optional: true, check: (c) => c.config.proof.endorsements.length > 0 },
  { id: 'videos', label: 'Videos', kind: 'config', blocking: false, optional: true, check: (c) => c.config.proof.videos.length > 0 },
  { id: 'reviews', label: 'Independent reviews link', kind: 'config', blocking: false, optional: true, check: (c) => isHttpsUrl(c.config.proof.reviewsUrl) }
];

export type LaunchItemStatus = Omit<LaunchItem, 'check' | 'blockingWhen'> & { done: boolean };

export type LaunchStatus = {
  items: LaunchItemStatus[];
  done: number; // non-optional items done
  total: number; // non-optional items
  blockingMissing: string[]; // ids
};

export function evaluateLaunch(ctx: LaunchCtx): LaunchStatus {
  const items = launchChecklist.map(({ check, blockingWhen, ...item }) => ({
    ...item,
    blocking: item.blocking || Boolean(blockingWhen?.(ctx)),
    done: check(ctx)
  }));
  const counted = items.filter((i) => !i.optional);
  return {
    items,
    done: counted.filter((i) => i.done).length,
    total: counted.length,
    blockingMissing: items.filter((i) => i.blocking && !i.done).map((i) => i.id)
  };
}

export type LaunchGroup = { title: 'Blocking' | 'Not blocking' | 'Optional'; items: LaunchItemStatus[] };

// One grouping for the CLI, the /launch page and anything else that lists the checklist.
export function groupLaunchItems(items: readonly LaunchItemStatus[]): LaunchGroup[] {
  return [
    { title: 'Blocking', items: items.filter((i) => i.blocking) },
    { title: 'Not blocking', items: items.filter((i) => !i.blocking && !i.optional) },
    { title: 'Optional', items: items.filter((i) => i.optional) }
  ];
}

// Preview banner wording (spec §8.4.6): "Launch check: 14/27 · 6 blocking".
export function formatBanner(status: Pick<LaunchStatus, 'done' | 'total' | 'blockingMissing'>): string {
  return `Launch check: ${status.done}/${status.total} · ${status.blockingMissing.length} blocking`;
}

export function formatSummary(status: Pick<LaunchStatus, 'done' | 'total' | 'blockingMissing'>): string {
  return `Launch check: ${status.done}/${status.total} done · ${status.blockingMissing.length} blocking`;
}
