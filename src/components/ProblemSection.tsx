import React from 'react';
import { problems } from '../data/pageContent';
import { FadeUp } from './FadeUp';

export function ProblemSection() {
  return (
    <section aria-labelledby="problem-heading" className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <FadeUp>
          <h2 id="problem-heading" className="max-w-2xl font-serif text-3xl leading-tight text-ink md:text-4xl">
            The routine work never ends. Someone always carries it.
          </h2>
        </FadeUp>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-rule">
          {problems.map((p) =>
          <li key={p.quote} className="flex flex-col md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="text-sm text-copper">{p.door}</p>
              <p className="mt-3 font-serif text-2xl leading-snug text-ink">{p.quote}</p>
              <p className="mt-auto pt-4 text-[15px] leading-relaxed text-ink-soft">{p.note}</p>
            </li>
          )}
        </ul>
      </div>
    </section>);

}