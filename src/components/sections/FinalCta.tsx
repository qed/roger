import { siteConfig } from '../../data/config';
import { finalCtaCopy, homeCheckoutLabels, newsletterCopy } from '../../data/copy/shared';
import type { MenuKind } from '../../data/menu';
import { displayedOffer } from '../../lib/offerPrice';
import { formatCad } from '../../lib/proofLines';
import { DepositCta, FitCallCta, HomeCheckoutCta } from '../cta/OfferCtas';
import { FINAL_CTA_ID } from '../cta/StickyCtaBar';
import { NewsletterForm } from '../forms/NewsletterForm';
import { HeroProofLine } from './HeroProofLine';

// Spec §6.11 (work) and §6A.10 (home): the CTAs, the capacity line, then the newsletter. Carries the
// id the sticky bar watches, so the bar hides while this band is on screen.
export function FinalCta({ offer }: { offer: MenuKind }) {
  const homePrice = formatCad(displayedOffer('home', siteConfig).price);
  return (
    <section id={FINAL_CTA_ID} aria-labelledby={`${FINAL_CTA_ID}-heading`} className="surface-dark bg-ink text-cream">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8 md:py-24">
        <h2 id={`${FINAL_CTA_ID}-heading`} className="font-serif text-4xl leading-tight md:text-6xl">
          {finalCtaCopy[offer].heading}
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {offer === 'work' ? (
            <>
              <FitCallCta location="final" tone="dark" size="lg" />
              <DepositCta location="final" tone="dark" size="lg" />
            </>
          ) : (
            <HomeCheckoutCta location="final" label={homeCheckoutLabels.long(homePrice)} tone="dark" size="lg" />
          )}
        </div>
        <HeroProofLine variant="capacity" tone="dark" className="mt-6" />
        <div className="mx-auto mt-14 max-w-md border-t border-cream/15 pt-10 text-left">
          <p className="text-sm text-cream/90">{newsletterCopy.prompt}</p>
          <NewsletterForm audience={offer} tone="dark" className="mt-4" />
        </div>
      </div>
    </section>
  );
}
