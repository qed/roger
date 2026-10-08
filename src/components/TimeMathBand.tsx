import { ArrowRightIcon } from 'lucide-react';
import { homeMealPlanCopy } from '../data/copy/home';
import { FadeUp } from './FadeUp';

// The meal plan's time and money band (spec §6A.5): the 2–3 hours → 10 minutes strikethrough and the
// sourced food-waste figure. Screen readers hear "was 2–3 hours becomes 10 minutes" from sr-only text;
// the arrow icon is decorative. The `hours` line is optional. Copy in src/data/copy/home.ts.
export function TimeMathBand() {
  const copy = homeMealPlanCopy.timeMath;
  return (
    <section aria-labelledby="time-heading" className="surface-dark bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h2 id="time-heading" className="sr-only">
          {copy.heading}
        </h2>
        <div className="grid gap-14 lg:grid-cols-12">
          <FadeUp className="lg:col-span-7">
            <p className="text-sm text-cream/80">{copy.label}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-serif text-5xl leading-none md:text-7xl">
              <span className="text-cream/70 line-through decoration-1">
                <span className="sr-only">{copy.beforeLabel} </span>
                {copy.before}
              </span>
              <ArrowRightIcon className="h-8 w-8 text-copper-light md:h-10 md:w-10" aria-hidden="true" />
              <span>
                <span className="sr-only">{copy.arrow} </span>
                {copy.after}
              </span>
            </p>
            {copy.hours?.trim() && <p className="mt-8 max-w-lg text-xl leading-relaxed text-cream/90">{copy.hours}</p>}
          </FadeUp>
          <FadeUp className="border-t border-white/15 pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0" delay={0.05}>
            <p className="font-serif text-5xl text-copper-light">{copy.statValue}</p>
            <p className="mt-4 text-lg leading-relaxed text-cream/90">{copy.statBody}</p>
            <p className="mt-4 text-sm text-cream/80">{copy.source}</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
