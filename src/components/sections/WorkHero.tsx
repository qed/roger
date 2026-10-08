import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/config';
import { ctaLabels, ctaNotes } from '../../data/copy/shared';
import { workHeroCopy } from '../../data/copy/work';
import { offerAmounts } from '../../lib/offerPrice';
import { useDepositLink } from '../cta/useOfferLinks';
import { DepositCta, FitCallCta } from '../cta/OfferCtas';
import { HERO_CTA_ID } from '../cta/StickyCtaBar';
import { WorkshopCodeBanner } from '../cta/WorkshopCodeBanner';
import { PhoneMockup } from '../PhoneMockup';
import { HeroProofLine } from './HeroProofLine';

// The `/` hero only (spec §6.2, R9b, R10). /home's hero differs in almost every part (spec §6A.1), so it
// gets its own HomeHero rather than parameters here. The headline variant comes from config.headline. The
// whole CTA row carries the id the sticky bar watches; "Next available" hides with the fit-call CTA when
// the Cal link is empty. The visual is the phone mockup on a neutral copper-wash panel: no photo stands
// in for Peter, and there is no toggle.
export function WorkHero() {
  const amounts = offerAmounts('work', siteConfig);
  const deposit = useDepositLink();
  const headline = workHeroCopy.headlines[siteConfig.headline];

  return (
    <section aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 md:px-8 md:pt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:pb-20">
        <div>
          <WorkshopCodeBanner offer="work" className="mb-6" />
          <p className="text-sm uppercase tracking-[0.14em] text-copper">{workHeroCopy.eyebrow}</p>
          <h1 id="hero-heading" className="mt-4 font-serif text-[2.6rem] leading-[1.05] text-ink sm:text-5xl lg:text-[4rem]">
            {headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{workHeroCopy.subhead}</p>

          {/* Always rendered, so the sticky bar's sentinel exists whichever CTAs are live (only the
              deposit link, only the fit call, or neither). */}
          <div id={HERO_CTA_ID} className="mt-8 flex flex-col gap-4">
            <FitCallCta
              location="hero"
              size="lg"
              label={ctaLabels.fitCallHero}
              className="self-start"
              note={<p className="text-sm text-ink-soft">{ctaNotes.fitCallNext}</p>}
            />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {deposit.href !== null && <span className="text-sm text-ink-soft">{workHeroCopy.depositLead}</span>}
              <DepositCta location="hero" variant="secondary" label={ctaLabels.depositHero(amounts.deposit)} />
            </div>
            <Link
              to={{ pathname: '/', hash: '#pricing' }}
              className="self-start text-[15px] text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
              {workHeroCopy.included(amounts.price)}
            </Link>
          </div>

          <HeroProofLine className="mt-8" />
        </div>

        <div className="flex justify-center rounded-[2rem] bg-copper-wash px-4 py-10 sm:py-12">
          <PhoneMockup view="work" title={workHeroCopy.phone.title} time={workHeroCopy.phone.time} />
        </div>
      </div>
    </section>
  );
}
