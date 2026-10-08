import { ChevronDownIcon } from 'lucide-react';
import { siteConfig } from '../../data/config';
import { faqCopy } from '../../data/copy/shared';
import type { Faq } from '../../data/faqs';
import type { OfferId } from '../../data/offers';
import { faqAnswer } from '../../lib/claims';
import { offerAmounts } from '../../lib/offerPrice';

// Spec §6.10. Native <details>/<summary> disclosures: keyboard and screen-reader accessible with no
// script. Answers go through faqAnswer, so gated items and empty interpolations are omitted (R8).
type FaqListProps = { items: Faq[]; offer: OfferId; heading?: string; id?: string };

// `offer` (required, so /home can't silently get work amounts) picks the amounts that fill deposit and
// refund answers: the displayed price, spec §3.1.
export function FaqList({ items, offer, heading = faqCopy.heading, id = 'faq' }: FaqListProps) {
  const amounts = offerAmounts(offer, siteConfig);
  const visible = items
    .map((faq) => ({ faq, answer: faqAnswer(faq, { amounts }) }))
    .filter((entry): entry is { faq: Faq; answer: string } => entry.answer !== null);
  if (!visible.length) return null;
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-rule">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <h2 id={`${id}-heading`} className="font-serif text-3xl leading-tight md:text-4xl">
          {heading}
        </h2>
        <div className="mt-10 divide-y divide-rule border-y border-rule">
          {visible.map(({ faq, answer }) => (
            <details key={faq.id} className="group">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                <h3 className="text-left">{faq.q}</h3>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-copper transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="pb-6 pr-8 text-base leading-relaxed text-ink-soft">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
