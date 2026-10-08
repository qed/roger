import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/config';
import { pricingCopy } from '../../data/copy/pricing';
import { honestyLine } from '../../data/offers';
import type { OfferId } from '../../data/offers';
import { fillClause } from '../../lib/claims';
import { displayedOffer } from '../../lib/offerPrice';
import { formatCad } from '../../lib/proofLines';
import { DiyTable } from './DiyTable';
import { PaybackCalculator } from './PaybackCalculator';
import { PricingCard } from './PricingCard';

// The id="pricing" section (spec §6.7 work, §6A.7 home): the card, the lines under it, then the DIY table
// (with the admin anchor, work only, inside DiyTable) and the payback calculator. Per offer:
// - honesty line: both
// - care plans line and the cross-offer "Setting up your home instead?" line: work only (pricingCopy)
// - taxNote: both, hidden when empty
export function PricingSection({ offer, id = 'pricing' }: { offer: OfferId; id?: string }) {
  const copy = pricingCopy[offer];
  const honesty = fillClause(honestyLine);
  const taxNote = siteConfig.taxNote.trim();
  const homePrice = formatCad(displayedOffer('home', siteConfig).price);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-rule">
      <h2 id={`${id}-heading`} className="sr-only">
        {copy.heading}
      </h2>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <PricingCard offer={offer} />
          <div className="mt-6 space-y-2 text-sm leading-relaxed text-ink-soft">
            {honesty && <p>{honesty}</p>}
            {copy.carePlans && <p>{copy.carePlans}</p>}
            {taxNote && <p>{taxNote}</p>}
            {copy.homeLine && (
              <p className="pt-2 text-base text-ink">
                {copy.homeLine.text}{' '}
                <Link to={copy.homeLine.to} className="underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
                  {copy.homeLine.linkText(homePrice)}
                </Link>
              </p>
            )}
          </div>
        </div>
        <div className="space-y-12">
          <DiyTable offer={offer} />
          <PaybackCalculator offer={offer} />
        </div>
      </div>
    </section>
  );
}
