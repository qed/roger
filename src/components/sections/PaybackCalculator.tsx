import { useId, useRef, useState } from 'react';
import { siteConfig } from '../../data/config';
import { calculatorCopy } from '../../data/copy/pricing';
import type { OfferId } from '../../data/offers';
import { displayedOffer } from '../../lib/offerPrice';
import { HOURS_MAX, HOURS_MIN, calculatorResult } from '../../lib/payback';
import { trackEvent } from '../../utils/analytics';

const DEFAULT_HOURS = 3;
const DEFAULT_RATE = 50;

// Payback calculator (spec §6.7): hours saved per week 1–10 (default 3) and the value of an hour
// (default $50). "Your numbers, not a promise." Fires calc_used once per page view. The price is the
// displayed one (regular once founding spots are full). An unusable rate asks for one, never guesses.
export function PaybackCalculator({ offer }: { offer: OfferId }) {
  const { price } = displayedOffer(offer, siteConfig);
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [rateText, setRateText] = useState(String(DEFAULT_RATE));
  const used = useRef(false);
  const id = useId();

  const result = calculatorResult(price, hours, rateText);

  const markUsed = () => {
    if (used.current) return;
    used.current = true;
    trackEvent('calc_used');
  };

  return (
    <div className="rounded-2xl border border-rule bg-paper p-6 md:p-8">
      <h3 className="font-serif text-2xl text-ink">{calculatorCopy.heading}</h3>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-hours`} className="flex items-baseline justify-between text-sm font-medium text-ink">
            <span>{calculatorCopy.hoursLabel}</span>
            <span aria-hidden="true" className="font-serif text-2xl">
              {hours}
            </span>
          </label>
          <input
            id={`${id}-hours`}
            type="range"
            min={HOURS_MIN}
            max={HOURS_MAX}
            step={1}
            value={hours}
            onChange={(event) => {
              setHours(Number(event.target.value));
              markUsed();
            }}
            className="mt-3 h-11 w-full cursor-pointer accent-copper"
          />
        </div>
        <div>
          <label htmlFor={`${id}-rate`} className="block text-sm font-medium text-ink">
            {calculatorCopy.rateLabel}
          </label>
          <div className="mt-3 flex min-h-[44px] items-center rounded-full border border-rule bg-cream px-4 focus-within:border-ink">
            <span aria-hidden="true" className="text-ink-soft">
              $
            </span>
            <input
              id={`${id}-rate`}
              type="number"
              inputMode="decimal"
              min={1}
              step={5}
              value={rateText}
              onChange={(event) => {
                setRateText(event.target.value);
                markUsed();
              }}
              className="w-full bg-transparent px-2 py-2 text-base text-ink focus:outline-none"
            />
          </div>
        </div>
      </div>
      <p aria-live="polite" className="mt-6 font-serif text-xl leading-snug text-ink md:text-2xl">
        {result ?? calculatorCopy.ratePrompt}
      </p>
      <p className="mt-2 text-sm text-ink-soft">{calculatorCopy.label}</p>
    </div>
  );
}
