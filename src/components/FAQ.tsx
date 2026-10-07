import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { faqs } from '../data/faqs';

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-t border-rule bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12">
        <h2 id="faq-heading" className="font-serif text-4xl leading-tight text-ink lg:col-span-4">
          Questions, answered plainly.
        </h2>
        <ul className="border-t border-rule lg:col-span-8">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg text-ink">
                    
                    {item.q}
                    <PlusIcon
                      className={`h-5 w-5 shrink-0 text-copper transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                      aria-hidden="true" />
                    
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen &&
                  <motion.div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden">
                    
                      <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
                    </motion.div>
                  }
                </AnimatePresence>
              </li>);

          })}
        </ul>
      </div>
    </section>);

}