// Checkout and booking links (spec §9). Each builder returns null when its base link is not configured,
// which the UI renders as a disabled "Opening soon" button (spec §8.1). Stripe opens in the same tab so
// sessionStorage survives to /thanks/*; Cal opens in a new tab.
import { siteConfig } from '../data/config';
import { findMenuItem } from '../data/menu';
import type { MenuKind } from '../data/menu';
import { buildClientReference } from './clientReference';
import { promoCodeFor } from './workshopCode';

export type LinkContext = {
  picks: readonly string[];
  code?: string | null; // an accepted workshop group code (see workshopCode.ts)
  utmSource?: string | null;
};

type Param = [string, string];

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
    .filter((pair) => pair && !managed.has(decodeURIComponent(pair.split('=')[0].replace(/\+/g, ' '))));
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

export const workDepositUrl = (ctx: LinkContext, base: string = siteConfig.stripe.workDeposit) =>
  stripeUrl('work', ctx, base);
export const homeCheckoutUrl = (ctx: LinkContext, base: string = siteConfig.stripe.homeCheckout) =>
  stripeUrl('home', ctx, base);
export const fitCallUrl = (ctx: LinkContext, base: string = siteConfig.cal.fitCall) => calUrl(ctx, base, true);
export const workSessionUrl = (ctx: LinkContext, base: string = siteConfig.cal.workSession1) =>
  calUrl(ctx, base, false);
export const homeSessionUrl = (ctx: LinkContext, base: string = siteConfig.cal.homeSession) =>
  calUrl(ctx, base, false);
