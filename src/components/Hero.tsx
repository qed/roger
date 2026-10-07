import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon } from 'lucide-react';
import { siteConfig } from '../data/config';
import type { TaglineKey } from '../data/config';
import { useAudience } from '../contexts/AudienceContext';
import { PhoneMockup } from './PhoneMockup';
import { WaitlistForm } from './WaitlistForm';

type HeroProps = {
  headline: TaglineKey;
};

const subheads = {
  home: "Roger plans the week's dinners around your family's calendar, builds the grocery order with the brands you actually buy, and sends the recipes. You approve in about 10 minutes.",
  work: 'Roger runs your day before you do: every email starts as a draft, meetings arrive prepped, and decisions land in the tools where work happens.'
};

const views = ['home', 'work'] as const;

export function Hero({ headline }: HeroProps) {
  const { audience, setAudience } = useAudience();
  const view = audience === 'work' ? 'work' : 'home';

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 md:px-8 md:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-28">
        <div className="lg:col-span-6">
          <div role="group" aria-label="Show Roger for" className="inline-flex rounded-full border border-rule bg-paper p-1">
            {views.map((v) =>
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setAudience(v)}
              className={`relative h-9 rounded-full px-5 text-sm transition-colors duration-150 ${
              view === v ? 'text-cream' : 'text-ink-soft hover:text-ink'}`
              }>
              
                {view === v &&
              <motion.span
                layoutId="hero-toggle"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} />

              }
                <span className="relative">For {v}</span>
              </button>
            )}
          </div>

          <h1
            id="hero-heading"
            className="mt-8 font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-6xl lg:text-[4.4rem]">
            
            {siteConfig.taglines[headline]}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{subheads[view]}</p>

          <WaitlistForm className="mt-9 max-w-lg" />
          <p className="mt-3 text-sm text-ink-faint">Launching in Toronto first. Waitlist members get early access.</p>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6">
            <a href="#home" className="group inline-flex items-center gap-2 text-sm font-medium text-ink">
              <ArrowDownIcon className="h-4 w-4 text-copper transition-transform duration-150 group-hover:translate-y-0.5" aria-hidden="true" />
              {siteConfig.cta.seeHome}
            </a>
            <a href="#work" className="group inline-flex items-center gap-2 text-sm font-medium text-ink">
              <ArrowDownIcon className="h-4 w-4 text-copper transition-transform duration-150 group-hover:translate-y-0.5" aria-hidden="true" />
              {siteConfig.cta.seeWork}
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative ml-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-sm">
            <img
              src="/6d5fd2d3-8e70-4118-807e-065a939abc60.jpg"
              alt="A tidy mise en place: small bowls of diced onion, garlic, herbs, tomatoes and lemon on a wooden board"
              className="h-full w-full object-cover" />
            
          </div>
          <div className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 xl:-left-6">
            <PhoneMockup view={view} />
          </div>
        </div>
      </div>
    </section>);

}