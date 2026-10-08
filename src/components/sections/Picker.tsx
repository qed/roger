import { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pickerCopy } from '../../data/copy/shared';
import { exampleHref, helpers, homeJobs } from '../../data/menu';
import type { MenuKind } from '../../data/menu';
import { usePicks } from '../../hooks/usePicks';
import { PICKS_MAX } from '../../lib/picks';
import { trackEvent } from '../../utils/analytics';

const ITEMS = { work: helpers, home: homeJobs };

// Spec §6.5 / §6A.4: chips are aria-pressed toggles with the outcome as headline and the how line
// beneath, plus a "See real examples" link. A tap past the max keeps the current picks and explains
// why in a polite live region. Picks persist per offer and feed every CTA's link.
export function Picker({ kind, className = '' }: { kind: MenuKind; className?: string }) {
  const { picks, toggle } = usePicks(kind);
  const [overMax, setOverMax] = useState(false);
  const max = PICKS_MAX[kind];

  const onToggle = (id: string) => {
    const status = toggle(id);
    if (status === 'max-reached') {
      setOverMax(true);
      return;
    }
    setOverMax(false);
    if (status === 'added' || status === 'removed') {
      const count = status === 'added' ? picks.length + 1 : picks.length - 1;
      trackEvent('picker_change', { offer: kind, count });
    }
  };

  const fill = (text: string) => text.replace('{max}', String(max)).replace('{n}', String(picks.length));

  return (
    <div className={className}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ITEMS[kind].map((item) => {
          const pressed = picks.includes(item.id);
          return (
            <li
              key={item.id}
              className={`flex flex-col rounded-2xl border transition-colors duration-150 ${
                pressed ? 'border-ink bg-paper' : 'border-rule bg-paper/60 hover:border-ink/40'
              }`}>
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => onToggle(item.id)}
                className="flex flex-1 items-start gap-3 rounded-2xl p-4 text-left">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    pressed ? 'border-ink bg-ink text-cream' : 'border-ink-faint'
                  }`}>
                  {pressed && <CheckIcon className="h-3.5 w-3.5" />}
                </span>
                <span>
                  <span className="block font-medium leading-snug text-ink">{item.outcome}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{item.how}</span>
                </span>
              </button>
              <Link
                to={exampleHref(item)}
                className="mx-4 mb-4 ml-12 self-start text-sm text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
                {pickerCopy.examples}
                <span className="sr-only"> for {item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-ink-soft">{fill(pickerCopy.count)}</p>
        <p role="status" aria-live="polite" className="font-medium text-copper">
          {overMax ? fill(pickerCopy.overMax) : ''}
        </p>
      </div>
    </div>
  );
}
