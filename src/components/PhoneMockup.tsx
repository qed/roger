import { ClockIcon } from 'lucide-react';
import { phoneMockupCopy } from '../data/copy/shared';
import { sampleBrief, sampleMeals } from '../data/homeContent';
import { ToqueMark } from './ToqueMark';

type PhoneMockupProps = {
  view: 'home' | 'work'; // one fixed view per page; there is no toggle
  title: string; // e.g. "Your Chief of Staff"
  time: string; // e.g. "Monday 6:48 AM"
};

// An illustrative phone screen (spec §6.2, §6A.1). Its counts are made up, so it always carries a visible
// "Example" badge above the phone (on the page's panel, outside the spec's title line) and an accessible
// label that starts with "Example:" (spec §12). Decorative content is aria-hidden; the label describes it.
export function PhoneMockup({ view, title, time }: PhoneMockupProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p
        aria-hidden="true"
        className="rounded-full border border-copper/40 bg-paper/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-copper">
        {phoneMockupCopy.example}
      </p>
      <div
        className="w-[280px] rounded-[2.4rem] border border-ink/10 bg-ink p-2.5 shadow-[0_30px_60px_-20px_rgba(26,33,48,0.45)]"
        role="img"
        aria-label={phoneMockupCopy.label(title, time, view)}>
        <div className="relative h-[520px] overflow-hidden rounded-[1.9rem] bg-paper">
          <div className="flex items-center gap-2 border-b border-rule px-5 pb-3 pt-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-copper-wash">
              <ToqueMark className="h-5 w-5 text-copper" />
            </span>
            <div>
              <p className="text-sm font-medium text-ink">{title}</p>
              <p className="text-[11px] text-ink-faint">{time}</p>
            </div>
          </div>

          <div className="space-y-3 px-4 py-4" aria-hidden="true">
            {view === 'home' ? <SundayMessage /> : <MorningBrief />}
          </div>
        </div>
      </div>
    </div>);

}

function SundayMessage() {
  return (
    <>
      <p className="rounded-2xl rounded-tl-sm bg-cream px-3.5 py-3 text-[13px] leading-snug text-ink">
        Morning. This week's 15 dinner ideas are ready, built around Thursday's sales and what's in the pantry.
      </p>
      <p className="rounded-2xl rounded-tl-sm bg-cream px-3.5 py-3 text-[13px] leading-snug text-ink">
        Tuesday is soccer, so I've kept that one to 20 minutes.
      </p>
      <ul className="divide-y divide-rule rounded-xl border border-rule bg-white">
        {sampleMeals.map((meal) =>
        <li key={meal.day} className="flex items-center gap-3 px-3 py-2.5">
            <span className="w-7 text-[11px] font-medium text-copper">{meal.day}</span>
            <span className="flex-1 text-[12.5px] leading-tight text-ink">{meal.name}</span>
            <span className="flex items-center gap-1 text-[11px] text-ink-faint">
              <ClockIcon className="h-3 w-3" />
              {meal.minutes}m
            </span>
          </li>
        )}
      </ul>
      <p className="text-center text-[11px] text-ink-faint">+ 12 more ideas</p>
      <span className="flex h-10 items-center justify-center rounded-lg bg-ink text-[13px] font-medium text-cream">
        Pick your 5–7
      </span>
    </>);

}

function MorningBrief() {
  return (
    <>
      <p className="rounded-2xl rounded-tl-sm bg-cream px-3.5 py-3 text-[13px] leading-snug text-ink">
        Good morning. Here's your day, prepared.
      </p>
      <ul className="divide-y divide-rule rounded-xl border border-rule bg-white">
        {sampleBrief.map((item) =>
        <li key={item.label} className="px-3 py-2.5">
            <p className="text-[13px] font-medium text-ink">{item.label}</p>
            <p className="text-[11.5px] text-ink-faint">{item.detail}</p>
          </li>
        )}
      </ul>
      <p className="rounded-2xl rounded-tl-sm bg-cream px-3.5 py-3 text-[13px] leading-snug text-ink">
        I can clear 9 of the replies before your 9:30. Want me to?
      </p>
      <span className="flex h-10 items-center justify-center rounded-lg bg-ink text-[13px] font-medium text-cream">
        Review drafts
      </span>
    </>);

}