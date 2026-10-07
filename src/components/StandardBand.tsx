import React from 'react';
import { standards } from '../data/pageContent';
import { ToqueMark } from './ToqueMark';
import { FadeUp } from './FadeUp';

export function StandardBand() {
  return (
    <section aria-labelledby="standard-heading" className="border-t border-rule bg-copper-wash">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <FadeUp className="flex flex-col items-center text-center">
          <ToqueMark className="h-12 w-12 text-copper" />
          <h2 id="standard-heading" className="mt-4 font-serif text-xl italic text-ink">
            The standard
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            Legend says the toque's hundred pleats stand for a hundred ways to cook an egg. Range and mastery, never
            gimmicks.
          </p>
        </FadeUp>
        <ul className="mt-14 grid border-y border-copper/30 md:grid-cols-3 md:divide-x md:divide-copper/30">
          {standards.map((line) =>
          <li
            key={line}
            className="border-b border-copper/30 px-6 py-10 text-center font-serif text-3xl leading-tight text-ink last:border-b-0 md:border-b-0 lg:text-4xl">
            
              {line}
            </li>
          )}
        </ul>
      </div>
    </section>);

}