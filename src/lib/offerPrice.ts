// The price the site shows right now (spec §3.4). While founding spots remain it's the founding price;
// once siteConfig.founding.spotsLeft hits 0 the regular price is the current price, stated as such.
// Every price-derived string (monthly note, DIY row, admin anchor, calculator, home labels) uses this.
// Framework-free and tested.
import type { SiteConfig } from '../data/config';
import type { OfferId } from '../data/offers';
import { foundingIsFull, monthlyOverFirstYear } from './proofLines';

export type DisplayedOffer = {
  price: number;
  isFounding: boolean; // false once founding spots are full: no future-price line, no founding bonus
  monthly: number; // "About $X a month over your first year"
};

type PriceConfig = Pick<SiteConfig, 'prices' | 'founding'>;

const FOUNDING_PRICE: Record<OfferId, (p: SiteConfig['prices']) => number> = { work: (p) => p.work, home: (p) => p.home };
const REGULAR_PRICE: Record<OfferId, (p: SiteConfig['prices']) => number> = {
  work: (p) => p.regularWork,
  home: (p) => p.regularHome
};

export function displayedOffer(offerId: OfferId, config: PriceConfig): DisplayedOffer {
  const isFounding = !foundingIsFull(config.founding);
  const price = isFounding ? FOUNDING_PRICE[offerId](config.prices) : REGULAR_PRICE[offerId](config.prices);
  return { price, isFounding, monthly: monthlyOverFirstYear(price) };
}
