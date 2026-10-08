import { beforeAfterCopy } from '../../data/copy/shared';
import { FadeUp } from '../FadeUp';

export type BeforeAfterRow = { before: string; after: string };

type BeforeAfterProps = {
  heading: string;
  label: string; // e.g. "An example Monday." It's an illustration, not a client result (spec §6.3).
  rows: BeforeAfterRow[];
  closing?: string;
  id?: string;
};

// Spec §6.3 / §6A.2: two columns, clearly labelled as an example.
export function BeforeAfter({ heading, label, rows, closing, id = 'before-after' }: BeforeAfterProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <p className="text-sm uppercase tracking-[0.14em] text-copper">{label}</p>
        <h2 id={`${id}-heading`} className="mt-3 max-w-3xl font-serif text-3xl leading-tight md:text-5xl">
          {heading}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FadeUp className="rounded-2xl border border-rule bg-paper p-6 md:p-8">
            <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-soft">{beforeAfterCopy.before}</h3>
            <ul className="mt-5 space-y-4">
              {rows.map((row) => (
                <li key={row.before} className="border-t border-rule pt-4 text-base leading-relaxed text-ink-soft first:border-t-0 first:pt-0">
                  {row.before}
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp className="rounded-2xl bg-ink p-6 text-cream md:p-8" delay={0.05}>
            <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-copper-light">{beforeAfterCopy.after}</h3>
            <ul className="mt-5 space-y-4">
              {rows.map((row) => (
                <li key={row.after} className="border-t border-cream/15 pt-4 text-base leading-relaxed first:border-t-0 first:pt-0">
                  {row.after}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
        {closing && <p className="mt-10 font-serif text-2xl italic text-ink md:text-3xl">{closing}</p>}
      </div>
    </section>
  );
}
