import { Link, useLocation } from 'react-router-dom';
import { ctaClassName } from '../components/cta/ctaStyles';
import { FadeUp } from '../components/FadeUp';
import { WorkshopRequestForm } from '../components/forms/WorkshopRequestForm';
import { usePageMeta } from '../components/layout/usePageMeta';
import { Endorsements } from '../components/sections/Endorsements';
import { siteConfig } from '../data/config';
import {
  WORKSHOP_REQUEST_ID,
  workshopFormCopy,
  workshopsFormatsCopy,
  workshopsHeroCopy,
  workshopsHostPackCopy,
  workshopsMembersGetCopy,
  workshopsMeta,
  workshopsProofCopy,
  workshopsProvideCopy
} from '../data/copy/workshops';
import { publishedEndorsements, workshopCounterLine } from '../lib/proofLines';
import { hostPackHref } from '../lib/safeHref';
import { trackEvent } from '../utils/analytics';

const sectionClass = 'border-t border-rule';
const innerClass = 'mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20';
const headingClass = 'font-serif text-3xl leading-tight md:text-4xl';

// `/workshops` (spec §6B): for hosts. Not in the main nav (it's linked from the footer). Exactly these
// sections in this order; the numbers in the comments are the spec's §6B items. Any slot whose config
// is empty hides itself (spec §8.1).
export function WorkshopsPage() {
  usePageMeta({ title: workshopsMeta.title, description: workshopsMeta.description });
  const { search } = useLocation(); // keep the query (UTM) when the CTA adds #request

  const hostPack = hostPackHref(siteConfig.workshopHostPack); // null (section hidden) unless "/…" or "https://…"
  const endorsements = publishedEndorsements(siteConfig.proof.endorsements);
  const counter = workshopCounterLine(siteConfig.proof.counter);

  return (
    <>
      {/* 1 */}
      <section aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-8 md:pb-20 md:pt-14">
          <p className="text-sm uppercase tracking-[0.14em] text-copper">{workshopsHeroCopy.eyebrow}</p>
          <h1 id="hero-heading" className="mt-4 max-w-4xl font-serif text-[2.4rem] leading-[1.05] text-ink sm:text-5xl lg:text-[3.6rem]">
            {workshopsHeroCopy.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{workshopsHeroCopy.subhead}</p>
          <Link
            to={{ search, hash: `#${WORKSHOP_REQUEST_ID}` }}
            onClick={() => trackEvent('cta_click', { cta: 'workshop_request', location: 'workshops' })}
            className={ctaClassName({ variant: 'primary', size: 'lg', live: true, className: 'mt-8' })}>
            {workshopsHeroCopy.cta}
          </Link>
        </div>
      </section>

      {/* 2 */}
      <section aria-labelledby="members-get-heading" className={`${sectionClass} bg-paper`}>
        <div className={innerClass}>
          <h2 id="members-get-heading" className={headingClass}>
            {workshopsMembersGetCopy.heading}
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {workshopsMembersGetCopy.items.map((item, i) => (
              <li key={item.title}>
                <FadeUp delay={i * 0.04} className="h-full rounded-2xl border border-rule bg-cream p-6">
                  <h3 className="font-serif text-xl leading-snug text-ink">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">{item.body}</p>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 and 4 */}
      <section className={sectionClass}>
        <div className={`${innerClass} grid gap-12 md:grid-cols-2`}>
          <div>
            <h2 className={headingClass}>{workshopsProvideCopy.heading}</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">{workshopsProvideCopy.body}</p>
          </div>
          <div>
            <h2 className={headingClass}>{workshopsFormatsCopy.heading}</h2>
            <ul className="mt-6 space-y-3 text-lg text-ink-soft">
              {workshopsFormatsCopy.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.75em] h-px w-4 shrink-0 bg-copper" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5: only when the PDF is configured as a same-origin path or an https URL */}
      {hostPack && (
        <section aria-labelledby="host-pack-heading" className={`${sectionClass} bg-copper-wash`}>
          <div className={`${innerClass} md:py-14`}>
            <h2 id="host-pack-heading" className="font-serif text-2xl leading-tight md:text-3xl">
              {workshopsHostPackCopy.heading}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">{workshopsHostPackCopy.body}</p>
            <a
              href={hostPack}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-[15px] text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
              {workshopsHostPackCopy.link}
              <span className="sr-only">{workshopsHostPackCopy.newTab}</span>
            </a>
          </div>
        </section>
      )}

      {/* 6: hidden until there's an endorsement or a workshop to count */}
      {(endorsements.length > 0 || counter) && (
        <section aria-labelledby="workshops-proof-heading" className={`${sectionClass} bg-paper`}>
          <div className={`${innerClass} space-y-10`}>
            <h2 id="workshops-proof-heading" className={headingClass}>
              {workshopsProofCopy.heading}
            </h2>
            {counter && <p className="font-serif text-2xl text-ink md:text-3xl">{counter}</p>}
            <Endorsements items={endorsements} />
          </div>
        </section>
      )}

      {/* 7: the hero CTA scrolls here */}
      <section id={WORKSHOP_REQUEST_ID} aria-labelledby="request-heading" className={sectionClass}>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <h2 id="request-heading" className={headingClass}>
            {workshopFormCopy.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{workshopFormCopy.intro}</p>
          <div className="mt-8 max-w-3xl">
            <WorkshopRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
