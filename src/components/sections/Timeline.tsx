import type { TimelineStep } from '../../data/copy/types';
import { FadeUp } from '../FadeUp';

type TimelineProps = {
  heading: string;
  steps: TimelineStep[];
  note?: string; // the small italic line (spec §6.6)
  id?: string;
};

// Spec §6.6 / §6A.6: horizontal on desktop, vertical on mobile. An ordered list either way.
export function Timeline({ heading, steps, note, id = 'how' }: TimelineProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h2 id={`${id}-heading`} className="font-serif text-3xl leading-tight md:text-5xl">
          {heading}
        </h2>
        <ol className="mt-12 grid gap-0 lg:grid-flow-col lg:auto-cols-fr lg:gap-6">
          {steps.map((step, i) => (
            <li key={step.when} className="relative border-l border-rule pb-10 pl-8 last:pb-0 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pt-8">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-copper lg:-top-[5px] lg:left-0"
              />
              <FadeUp delay={Math.min(i, 4) * 0.04}>
                <p className="font-serif text-2xl text-ink">{step.when}</p>
                {step.whenNote && <p className="mt-1 text-sm text-ink-soft">{step.whenNote}</p>}
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  {step.what}
                  {step.emphasis && (
                    <>
                      {' '}
                      <strong className="font-medium text-ink">{step.emphasis}</strong>
                    </>
                  )}
                </p>
              </FadeUp>
            </li>
          ))}
        </ol>
        {note && <p className="mt-12 font-serif text-xl italic text-ink-soft">{note}</p>}
      </div>
    </section>
  );
}
