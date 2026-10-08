import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/config';
import { ctaLabels, homeCheckoutLabels, pickerCopy } from '../../data/copy/shared';
import { whatYouGetCopy } from '../../data/copy/whatYouGet';
import { chiefOfStaff, exampleHref, findMenuItem } from '../../data/menu';
import type { OfferId } from '../../data/offers';
import { usePicks } from '../../hooks/usePicks';
import { offerAmounts } from '../../lib/offerPrice';
import { DepositCta, FitCallCta, HomeCheckoutCta } from '../cta/OfferCtas';
import { FadeUp } from '../FadeUp';
import { Picker } from './Picker';

// Spec §6.5 (work): the Chief of Staff card on the left, the 3-of-8 helper picker on the right.
// Spec §6A.4 (home): the 5-of-12 job picker alone; there is no Chief of Staff on /home.
// The summary panel sits inline right after the picker at every width. (A sticky summary covered the
// last row of chips and their focus rings while tabbing, so it stays in the flow.) Every button builds
// its link from the same picks store, so the picks travel with it (spec §9.5).
export function WhatYouGet({ offer, id = 'what-you-get' }: { offer: OfferId; id?: string }) {
  const copy = whatYouGetCopy[offer];
  const picker = (
    <div>
      <h3 className="font-serif text-2xl text-ink md:text-3xl">{copy.pickerHeading}</h3>
      <p className="mt-2 text-base text-ink-soft">{copy.pickerIntro}</p>
      <Picker kind={offer} className="mt-6" />
      <SetupSummary offer={offer} />
      {copy.toolsLine && <p className="mt-6 text-sm leading-relaxed text-ink-soft">{copy.toolsLine}</p>}
    </div>
  );
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h2 id={`${id}-heading`} className="max-w-3xl font-serif text-3xl leading-tight md:text-5xl">
          {copy.heading}
        </h2>
        {offer === 'work' ? (
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
            <ChiefOfStaffCard label={copy.cosLabel ?? ''} />
            {picker}
          </div>
        ) : (
          <div className="mt-12 max-w-4xl">{picker}</div>
        )}
      </div>
    </section>
  );
}

// Sticky only on tall desktop viewports, where the whole card fits below the header with room to spare;
// on shorter screens it scrolls with the page so its link is never cut off. (FadeUp animates a transform
// on this element itself, which doesn't affect sticky positioning.)
function ChiefOfStaffCard({ label }: { label: string }) {
  return (
    <FadeUp className="self-start rounded-3xl bg-ink p-6 text-cream surface-dark sm:p-8 [@media(min-height:800px)]:lg:sticky [@media(min-height:800px)]:lg:top-24">
      {label && <p className="text-sm uppercase tracking-[0.14em] text-copper-light">{label}</p>}
      <h3 className="mt-3 text-lg font-medium text-cream/90">{chiefOfStaff.title}</h3>
      <p className="mt-1 font-serif text-3xl leading-tight md:text-4xl">{chiefOfStaff.outcome}</p>
      <ul className="mt-6 space-y-3">
        {chiefOfStaff.points.map((point) => (
          <li key={point} className="flex gap-3 text-base leading-relaxed">
            <CheckIcon aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-copper-light" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <Link
        to={exampleHref(chiefOfStaff)}
        className="mt-6 inline-block text-sm text-cream underline decoration-copper-light underline-offset-4">
        {pickerCopy.examples}
        <span className="sr-only"> for {chiefOfStaff.title}</span>
      </Link>
    </FadeUp>
  );
}

function SetupSummary({ offer }: { offer: OfferId }) {
  const copy = whatYouGetCopy[offer];
  const { picks } = usePicks(offer);
  const { price } = offerAmounts(offer, siteConfig);
  const titles = picks.map((pickId) => findMenuItem(pickId)?.title).filter((t): t is string => Boolean(t));
  const picked = titles.length ? titles.join(', ') : copy.summaryNoPicks;
  return (
    <div className="mt-6 rounded-2xl border border-ink/15 bg-paper p-5">
      <p aria-live="polite" className="text-base leading-snug text-ink">
        <span className="font-medium">{copy.summaryLabel}:</span> {copy.summary(picked, price)}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {offer === 'work' ? (
          <>
            <FitCallCta location="picker" />
            <DepositCta location="picker" label={ctaLabels.deposit} />
          </>
        ) : (
          <HomeCheckoutCta location="picker" label={homeCheckoutLabels.short(price)} />
        )}
      </div>
    </div>
  );
}
