// Checkout and booking links (spec §9). Each builder returns null when its base link is not configured,
// which the UI renders as a disabled "Opening soon" button (spec §8.1). Stripe opens in the same tab so
// sessionStorage survives to /thanks/*; Cal opens in a new tab.
import { siteConfig } from '../data/config';
import type { SiteConfig } from '../data/config';
import { findMenuItem } from '../data/menu';
import type { MenuKind } from '../data/menu';
import { buildClientReference } from './clientReference';
import { displayedOffer } from './offerPrice';
import { promoCodeFor } from './workshopCode';

export type LinkContext = {
  picks: readonly string[];
  code?: string | null; // an accepted workshop group code (see workshopCode.ts)
  utmSource?: string | null;
};

type Param = [string, string];

// A malformed escape (e.g. "%zz") makes decodeURIComponent throw; compare the raw key instead.
function decodeKey(raw: string): string {
  const spaced = raw.replace(/\+/g, ' ');
  try {
    return decodeURIComponent(spaced);
  } catch {
    return spaced;
  }
}

// Appends params with encodeURIComponent (spaces as %20: Cal reads a literal "+" as a space).
// Keeps the rest of any existing query and the hash; a key we set replaces the same key on the base,
// so a pasted Payment Link never carries two prefilled_promo_code or client_reference_id values.
export function appendParams(base: string, params: readonly Param[]): string | null {
  const trimmed = base.trim();
  if (!trimmed) return null;
  if (!params.length) return trimmed;
  const hashAt = trimmed.indexOf('#');
  const hash = hashAt === -1 ? '' : trimmed.slice(hashAt);
  const beforeHash = hashAt === -1 ? trimmed : trimmed.slice(0, hashAt);
  const queryAt = beforeHash.indexOf('?');
  const path = queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt);
  const managed = new Set(params.map(([key]) => key));
  const kept = (queryAt === -1 ? '' : beforeHash.slice(queryAt + 1))
    .split('&')
    .filter((pair) => pair && !managed.has(decodeKey(pair.split('=')[0])));
  const added = params.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  return `${path}?${[...kept, ...added].join('&')}${hash}`;
}

export function picksTitles(picks: readonly string[]): string {
  return picks
    .map((id) => findMenuItem(id)?.title)
    .filter((title): title is string => Boolean(title))
    .join(', ');
}

function stripeUrl(kind: MenuKind, ctx: LinkContext, base: string): string | null {
  const params: Param[] = [];
  if (ctx.code) params.push(['prefilled_promo_code', promoCodeFor(ctx.code, kind)]);
  params.push(['client_reference_id', buildClientReference(kind, ctx.picks, ctx.utmSource)]);
  return appendParams(base, params);
}

function calUrl(ctx: LinkContext, base: string, withCode: boolean): string | null {
  const params: Param[] = [];
  const titles = picksTitles(ctx.picks);
  if (titles) params.push(['picks', titles]);
  if (withCode && ctx.code) params.push(['code', ctx.code]);
  return appendParams(base, params);
}

export type StripeTierConfig = Pick<SiteConfig, 'stripe' | 'prices' | 'founding'>;

// The Payment Link for the price the site shows right now (spec §3.4): the founding link while founding
// spots remain, the regular link once they're full. The founding link is never a fallback: an empty
// regular link means "Opening soon", not a checkout at the old price.
export function stripeBase(kind: MenuKind, config: StripeTierConfig = siteConfig): string {
  const { isFounding } = displayedOffer(kind, config);
  if (kind === 'work') return isFounding ? config.stripe.workDeposit : config.stripe.workDepositRegular;
  return isFounding ? config.stripe.homeCheckout : config.stripe.homeCheckoutRegular;
}

// `base` is injectable for tests; by default it follows the current tier (stripeBase).
export const workDepositUrl = (ctx: LinkContext, base: string = stripeBase('work')) => stripeUrl('work', ctx, base);
export const homeCheckoutUrl = (ctx: LinkContext, base: string = stripeBase('home')) => stripeUrl('home', ctx, base);
export const fitCallUrl = (ctx: LinkContext, base: string = siteConfig.cal.fitCall) => calUrl(ctx, base, true);
export const workSessionUrl = (ctx: LinkContext, base: string = siteConfig.cal.workSession1) =>
  calUrl(ctx, base, false);
export const homeSessionUrl = (ctx: LinkContext, base: string = siteConfig.cal.homeSession) =>
  calUrl(ctx, base, false);
