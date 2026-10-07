import React from 'react';
import { prepSteps } from '../data/pageContent';
import { FadeUp } from './FadeUp';

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-heading" className="border-t border-rule">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12">
        <FadeUp className="lg:col-span-5">
          <p className="font-serif text-lg italic text-copper">Mise en place</p>
          <h2 id="how-heading" className="mt-2 font-serif text-4xl leading-tight text-ink md:text-5xl">
            Everything in its place, before you need it.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            A chef preps every station before service. Roger does the same for your week, then brings you the plan
            to approve.
          </p>
        </FadeUp>

        <FadeUp className="lg:col-span-7" delay={0.05}>
          <div className="rounded-sm border border-rule bg-paper">
            <div className="flex items-baseline justify-between border-b border-rule px-6 py-4 md:px-8">
              <h3 className="font-serif text-xl italic text-ink">Method</h3>
              <p className="text-sm text-ink-faint">Same at home and at work</p>
            </div>
            <ol>
              {prepSteps.map((step, i) =>
              <li
                key={step.title}
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-dashed border-rule px-6 py-7 last:border-b-0 md:grid-cols-[4rem_1fr] md:px-8">
                
                  <span className="font-serif text-4xl leading-none text-copper" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="font-serif text-2xl text-ink">{step.title}</h4>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                  </div>
                </li>
              )}
            </ol>
          </div>
        </FadeUp>
      </div>
    </section>);

}