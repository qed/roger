import React from 'react';
import { FadeUp } from './FadeUp';

export function StorySection() {
  return (
    <section aria-labelledby="story-heading" className="border-t border-rule">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12">
        <img
          src="/4381c8fd-ed32-400b-b2bd-e045953fef30.jpg"
          alt="A cook's hands slicing green onions on a wooden board"
          className="aspect-[3/2] w-full rounded-sm object-cover lg:col-span-5" />
        
        <FadeUp className="lg:col-span-7 lg:pl-6">
          <h2 id="story-heading" className="sr-only">
            Why we're building Roger
          </h2>
          <figure>
            <blockquote className="font-serif text-3xl leading-snug text-ink md:text-4xl">
              “My wife told her friends how we handle meal planning now. They all leaned in: ‘I want that. How do I
              get it?’”
            </blockquote>
            <figcaption className="mt-8 text-[15px] text-ink-soft">
              The founder <span className="text-ink-faint">· Placeholder quote</span>
            </figcaption>
          </figure>
          <p className="mt-10 border-t border-rule pt-6 text-sm text-ink-faint">
            Stories from our first Toronto households will appear here once they've lived with Roger for a few
            Sundays.
          </p>
        </FadeUp>
      </div>
    </section>);

}