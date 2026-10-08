// The price the site shows right now (spec §3.1, §3.4). While founding spots remain it's the founding price;
// once siteConfig.founding.spotsLeft hits 0 the regular price is the current price, stated as such.
// Every price-derived string (monthly note, DIY row, admin anchor, calculator, home labels, the deposit
// and balance amounts in CTAs, the guarantee and the FAQ) uses this. Framework-free and tested.
import type { SiteConfig } from '../data/config';
import type { OfferAmounts, OfferId } from '../data/offers';
import { formatCad, foundingIsFull, monthlyOverFirstYear } from './proofLines';

export type DisplayedOffer = {
  price: number;
  isFounding: boolean; // false once founding spots are full: no future-price line, no founding bonus
  monthly: number; // "About $X a month over your first year"
  deposit: number; // paid to book (work: $1,000 founding, $1,500 after; home: the full price)
  balance: number; // due once it runs (work: price − deposit; home: 0)
};

type PriceConfig = Pick<SiteConfig, 'prices' | 'founding'>;
type Prices = SiteConfig['prices'];

const PRICE: Record<OfferId, { founding: (p: Prices) => number; regular: (p: Prices) => number }> = {
  work: { founding: (p) => p.work, regular: (p) => p.regularWork },
  home: { founding: (p) => p.home, regular: (p) => p.regularHome }
};

// Home is paid in full up front, so its deposit is its price.
const DEPOSIT: Record<OfferId, { founding: (p: Prices, price: number) => number; regular: (p: Prices, price: number) => number }> = {
  work: { founding: (p) => p.workDeposit, regular: (p) => p.regularWorkDeposit },
  home: { founding: (_p, price) => price, regular: (_p, price) => price }
};

export function displayedOffer(offerId: OfferId, config: PriceConfig): DisplayedOffer {
  const isFounding = !foundingIsFull(config.founding);
  const tier = isFounding ? 'founding' : 'regular';
  const price = PRICE[offerId][tier](config.prices);
  // No clamp: data.test.ts asserts deposit ≤ price (and work deposit = half) for the repo config.
  const deposit = DEPOSIT[offerId][tier](config.prices, price);
  return { price, isFounding, monthly: monthlyOverFirstYear(price), deposit, balance: price - deposit };
}

// The same amounts, formatted for copy ("$1,000"). Copy functions take this (see OfferAmounts).
export function offerAmounts(offerId: OfferId, config: PriceConfig): OfferAmounts {
  const { price, deposit, balance } = displayedOffer(offerId, config);
  return { price: formatCad(price), deposit: formatCad(deposit), balance: formatCad(balance) };
}
