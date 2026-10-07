import React from 'react';
import { WaitlistForm } from './WaitlistForm';
import { FadeUp } from './FadeUp';

export function FinalCTA() {
  return (
    <section id="waitlist" aria-labelledby="final-heading" className="border-t border-rule">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:items-center">
        <FadeUp className="lg:col-span-6">
          <h2 id="final-heading" className="font-serif text-5xl leading-[1.04] tracking-tight text-ink md:text-6xl">
            Hand it off. Get the hours back.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            We're opening in Toronto first. Tell us where Roger can help and we'll be in touch with early access.
          </p>
        </FadeUp>
        <div className="rounded-sm border border-rule bg-paper p-6 md:p-10 lg:col-span-6">
          <WaitlistForm showAudienceChoice showPostalCode />
        </div>
      </div>
    </section>);

}