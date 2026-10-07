import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { WaitlistForm } from './WaitlistForm';
import { FadeUp } from './FadeUp';

export function TimeMathBand() {
  return (
    <section aria-labelledby="time-heading" className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <h2 id="time-heading" className="sr-only">
          Time and money back
        </h2>
        <div className="grid gap-14 lg:grid-cols-12">
          <FadeUp className="lg:col-span-7">
            <p className="text-sm text-cream/70">Meal planning, lists and shopping, every week</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-serif text-5xl leading-none md:text-7xl">
              <span className="text-cream/60 line-through decoration-1">2–3 hours</span>
              <ArrowRightIcon className="h-8 w-8 text-copper-light md:h-10 md:w-10" aria-label="becomes" />
              <span>10 minutes</span>
            </p>
            <p className="mt-8 max-w-lg text-xl leading-relaxed text-cream/85">
              Up to 150 hours a year back with your family.
            </p>
          </FadeUp>
          <FadeUp className="border-t border-white/15 pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0" delay={0.05}>
            <p className="font-serif text-5xl text-copper-light">$1,300+</p>
            <p className="mt-4 text-lg leading-relaxed text-cream/85">
              of edible food thrown out by the average Canadian household each year. Roger plans each ingredient two or
              three ways, so less of it ends up in the bin.
            </p>
            <p className="mt-4 text-sm text-cream/60">Source: National Zero Waste Council, 2022</p>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/15 pt-10 lg:grid-cols-12 lg:items-center">
          <p className="font-serif text-3xl lg:col-span-5">Get your Sundays back.</p>
          <WaitlistForm tone="dark" audienceOverride="home" showPostalCode className="lg:col-span-7" />
        </div>
      </div>
    </section>);

}