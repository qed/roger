import React from 'react';
import { homeFeatures, homeSteps } from '../data/homeContent';
import { FadeUp } from './FadeUp';

export function HomeSection() {
  return (
    <section id="home" aria-labelledby="home-heading" className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <FadeUp className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-sm font-medium text-copper">Roger at home · Weekly meal planning</p>
            <h2 id="home-heading" className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight text-ink md:text-6xl">
              Dinner's planned. Groceries are ordered. You've got your Sunday back.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-ink-soft lg:col-span-4">
            For the parent who's always the household's planner. One short check-in on Sunday, and the week's dinners
            are handled.
          </p>
        </FadeUp>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {homeSteps.map((step, i) =>
          <li key={step.title} className="flex flex-col border-t border-ink pt-5">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl text-copper" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="text-sm text-ink-faint">{step.when}</span>
              </div>
              <h3 className="mt-4 font-serif text-2xl text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          )}
        </ol>

        <div className="mt-24 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <figure className="lg:col-span-5">
            <img
              src="/0e58101f-f31b-4e8c-90d5-9d0a21e5ec59.jpg"
              alt="A family passing dishes around a weeknight dinner table"
              className="aspect-[4/5] w-full rounded-sm object-cover lg:aspect-auto lg:h-full" />
            
          </figure>
          <div className="lg:col-span-7">
            <h3 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
              It shops and cooks the way your family already does.
            </h3>
            <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {homeFeatures.map((f) =>
              <li key={f.title} className="border-t border-rule py-6">
                  <h4 className="text-base font-semibold text-ink">{f.title}</h4>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{f.body}</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);

}