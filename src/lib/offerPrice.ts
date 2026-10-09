// The price the site shows right now (spec §3.1, §3.4). While founding spots remain it's the founding price;
// once siteConfig.founding.spotsLeft hits 0 the regular price is the current price, stated as such.
// Every price-derived string (monthly note, DIY row, admin anchor, calculator, home labels, the amounts
// in CTAs, the guarantee and the FAQ) uses this. Framework-free and tested.
import type { SiteConfig } from '../data/config';
import type { OfferAmounts, OfferId } from '../data/offers';
import { formatCad, foundingIsFull, monthlyOverFirstYear } from './proofLines';

export type DisplayedOffer = {
  price: number;
  isFounding: boolean; // false once founding spots are full: no future-price line, no founding bonus
  monthly: number; // "About $X a month over your first year"
  deposit: number; // paid to book: the full price for both offers (owner decision, 2026-10-09)
  balance: number; // always 0 while both offers are paid in full up front
};

type PriceConfig = Pick<SiteConfig, 'prices' | 'founding'>;
type Prices = SiteConfig['prices'];

const PRICE: Record<OfferId, { founding: (p: Prices) => number; regular: (p: Prices) => number }> = {
  work: { founding: (p) => p.work, regular: (p) => p.regularWork },
  home: { founding: (p) => p.home, regular: (p) => p.regularHome }
};


export function displayedOffer(offerId: OfferId, config: PriceConfig): DisplayedOffer {
  const isFounding = !foundingIsFull(config.founding);
  const tier = isFounding ? 'founding' : 'regular';
  const price = PRICE[offerId][tier](config.prices);
  // Both offers are paid in full up front, so what's paid to book is the price.
  return { price, isFounding, monthly: monthlyOverFirstYear(price), deposit: price, balance: 0 };
}

// The same amounts, formatted for copy ("$2,000"). Copy functions take this (see OfferAmounts).
export function offerAmounts(offerId: OfferId, config: PriceConfig): OfferAmounts {
  const { price, deposit, balance } = displayedOffer(offerId, config);
  return { price: formatCad(price), deposit: formatCad(deposit), balance: formatCad(balance) };
}
