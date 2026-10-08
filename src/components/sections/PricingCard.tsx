import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/config';
import { ctaNotes, homeCheckoutLabels } from '../../data/copy/shared';
import { pricingCopy, pricingFootnotes } from '../../data/copy/pricing';
import { honestyLine, offers } from '../../data/offers';
import type { OfferId } from '../../data/offers';
import { fillClause, renderLine } from '../../lib/claims';
import { displayedOffer } from '../../lib/offerPrice';
import { formatCad, pricingBadgeText } from '../../lib/proofLines';
import { DepositCta, FitCallCta, HomeCheckoutCta } from '../cta/OfferCtas';

// Spec §6.7 (work) and §6A.7 (home): one large ink card with cream text (AA: muted text no lower than
// cream/80 on ink), then the lines under it. Gated claims go through renderLine (spec §8.4.3), and the
// provider-cost clause drops when empty (R8). The page wraps this in its id="pricing" section.
// Once founding spots are full (spec §3.4) the regular price is the price: no future-price line, no
// founding bonus, and every amount below follows the displayed price.
export function PricingCard({ offer }: { offer: OfferId }) {
  const copy = pricingCopy[offer];
  const { regularPrice } = offers[offer];
  const { price, isFounding, monthly } = displayedOffer(offer, siteConfig);
  const homePrice = formatCad(displayedOffer('home', siteConfig).price);
  const futurePrice = isFounding ? renderLine(copy.futurePrice) : null;
  const includes = copy.includes
    .filter((line) => isFounding || line.needs !== 'foundingPerkConfirmed')
    .map((line) => ({ line, text: renderLine(line) }))
    .filter((entry): entry is { line: typeof entry.line; text: string } => entry.text !== null);
  const speed = copy.speed.map((line) => renderLine(line)).filter((text): text is string => text !== null);
  const badge = pricingBadgeText(siteConfig.founding, regularPrice);
  const honesty = fillClause(honestyLine);
  const taxNote = siteConfig.taxNote.trim();

  return (
    <div>
      <article aria-label={`${offers[offer].name} pricing`} className="surface-dark rounded-3xl bg-ink p-6 text-cream shadow-[0_30px_60px_-30px_rgba(26,33,48,0.6)] sm:p-10">
        <p className="inline-flex rounded-full border border-copper-light/60 px-3 py-1 text-sm text-copper-light">{badge}</p>
        <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
          <span className="font-serif text-6xl leading-none md:text-7xl">{formatCad(price)}</span>
          <span className="text-lg text-cream/80">{siteConfig.prices.currency}</span>
        </p>
        <p className="mt-3 text-base text-cream/90">{copy.priceNote(formatCad(monthly))}</p>
        {futurePrice && <p className="mt-1 text-sm text-cream/80">{futurePrice}</p>}

        <h3 className="mt-8 text-sm font-medium uppercase tracking-[0.14em] text-copper-light">{copy.includesHeading}</h3>
        <ul className="mt-4 space-y-3">
          {includes.map(({ line, text }) => (
            <li key={text} className="flex gap-3 text-base">
              <CheckIcon aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-copper-light" />
              <span className={line.emphasis ? 'font-medium' : line.needs === 'foundingPerkConfirmed' ? 'italic' : ''}>{text}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-8 space-y-3 border-t border-cream/15 pt-6 text-base">
          {speed.length > 0 && (
            <div>
              <dt className="inline font-medium">{copy.speedLabel}: </dt>
              <dd className="inline text-cream/90">{speed.join(' · ')}.</dd>
            </div>
          )}
          <div>
            <dt className="inline font-medium">{copy.guaranteeLabel}: </dt>
            <dd className="inline text-cream/90">{copy.guarantee(formatCad(price))}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
          {offer === 'work' ? (
            <>
              <FitCallCta location="pricing" tone="dark" size="lg" />
              <DepositCta
                location="pricing"
                tone="dark"
                size="lg"
                note={<p className="max-w-sm text-sm text-cream/80">{ctaNotes.depositFitCheck}</p>}
              />
            </>
          ) : (
            <HomeCheckoutCta location="pricing" label={homeCheckoutLabels.long(homePrice)} tone="dark" size="lg" />
          )}
        </div>
      </article>

      <div className="mt-6 space-y-2 text-sm leading-relaxed text-ink-soft">
        {honesty && <p>{honesty}</p>}
        <p>{pricingFootnotes.carePlans}</p>
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
  );
}
