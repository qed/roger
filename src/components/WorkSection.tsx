import React, { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { workGroups, workTools } from '../data/workGroups';
import { WaitlistForm } from './WaitlistForm';
import { FadeUp } from './FadeUp';

export function WorkSection() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = workGroups[active];

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % workGroups.length;else
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + workGroups.length) % workGroups.length;else
    return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <FadeUp className="max-w-3xl">
          <p className="text-sm font-medium text-copper">Roger at work · Chief of Staff</p>
          <h2 id="work-heading" className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-ink md:text-5xl">
            A Chief of Staff who runs the day before you do, and a specialist for every lane of your work.
          </h2>
        </FadeUp>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="What Roger handles at work"
            className="flex flex-col lg:col-span-4">
            
            {workGroups.map((g, i) => {
              const selected = i === active;
              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${g.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${g.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`flex items-baseline gap-4 border-l-2 py-3.5 pl-5 text-left transition-colors duration-150 ${
                  selected ? 'border-copper text-ink' : 'border-rule text-ink-soft hover:text-ink'}`
                  }>
                  
                  <span className="font-serif text-xl">{g.summary}</span>
                </button>);

            })}
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={group.id}
                role="tabpanel"
                id={`panel-${group.id}`}
                aria-labelledby={`tab-${group.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="rounded-sm border border-rule bg-paper p-6 md:p-10">
                
                <h3 className="font-serif text-3xl text-ink">{group.summary}</h3>
                <ul className="mt-8 divide-y divide-rule">
                  {group.items.map((item) =>
                  <li key={item.n} className="grid grid-cols-[2.5rem_1fr] gap-3 py-5 first:pt-0 last:pb-0">
                      <span className="pt-0.5 font-serif text-lg text-copper" aria-hidden="true">
                        {item.n}
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-ink">{item.title}</h4>
                        <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-12 border-y border-rule py-5 text-center text-[15px] text-ink-soft">
          Works with {workTools}
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:items-center">
          <p className="font-serif text-3xl text-ink lg:col-span-5">Start the day already handled.</p>
          <WaitlistForm audienceOverride="work" className="lg:col-span-7" />
        </div>
      </div>
    </section>);

}