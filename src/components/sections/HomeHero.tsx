import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/config';
import { homeCheckoutLabels } from '../../data/copy/shared';
import { HOME_JOBS_ID, homeHeroCopy } from '../../data/copy/home';
import { offerAmounts } from '../../lib/offerPrice';
import { HomeCheckoutCta } from '../cta/OfferCtas';
import { HERO_CTA_ID } from '../cta/StickyCtaBar';
import { WorkshopCodeBanner } from '../cta/WorkshopCodeBanner';
import { PhoneMockup } from '../PhoneMockup';
import { HeroProofLine } from './HeroProofLine';

// The `/home` hero (spec §6A.1, R10): headline, subhead, "Pay $500 & book your session" (price from the
// displayed offer), the "See the 12 jobs" scroll link, the capacity line, and the Sunday meal view of the
// phone mockup on a copper-wash panel. No photo stands in for Peter or a client. The whole CTA row
// carries the id the sticky bar watches.
export function HomeHero() {
  const { price } = offerAmounts('home', siteConfig);

  return (
    <section aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 md:px-8 md:pt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:pb-20">
        <div>
          <WorkshopCodeBanner offer="home" className="mb-6" />
          <p className="text-sm uppercase tracking-[0.14em] text-copper">{homeHeroCopy.eyebrow}</p>
          <h1 id="hero-heading" className="mt-4 font-serif text-[2.6rem] leading-[1.05] text-ink sm:text-5xl lg:text-[4rem]">
            {homeHeroCopy.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{homeHeroCopy.subhead}</p>

          <div id={HERO_CTA_ID} className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <HomeCheckoutCta location="hero" size="lg" label={homeCheckoutLabels.long(price)} className="self-start" />
            <Link
              to={{ pathname: '/home', hash: `#${HOME_JOBS_ID}` }}
              className="self-start text-[15px] text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper sm:self-center">
              {homeHeroCopy.seeJobs}
            </Link>
          </div>

          <HeroProofLine variant="capacity" className="mt-8" />
        </div>

        <div className="flex justify-center rounded-[2rem] bg-copper-wash px-4 py-10 sm:py-12">
          <PhoneMockup view="home" title={homeHeroCopy.phone.title} time={homeHeroCopy.phone.time} />
        </div>
      </div>
    </section>
  );
}
