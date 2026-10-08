// Payback calculator (spec §6.7): weeks = ceil(price / (hours × rate)). "Your numbers, not a promise."
import { calculatorCopy } from '../data/copy/pricing';

export const HOURS_MIN = 1;
export const HOURS_MAX = 10;

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function weeksToPayBack(price: number, hoursPerWeek: number, hourlyRate: number): number {
  const safePrice = Math.max(0, finiteOr(price, 0));
  const hours = Number.isNaN(hoursPerWeek) ? HOURS_MIN : Math.min(HOURS_MAX, Math.max(HOURS_MIN, hoursPerWeek));
  const rate = Math.max(1, finiteOr(hourlyRate, 1));
  return Math.ceil(safePrice / (hours * rate));
}

// The value-of-an-hour field as typed: a positive finite number, or null (empty, junk, 0 or negative).
export function parseRate(rateText: string): number | null {
  const trimmed = rateText.trim();
  if (!trimmed) return null;
  const rate = Number(trimmed);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

// The result sentence, or null when the rate isn't usable (the UI then asks for it instead of guessing).
export function calculatorResult(price: number, hours: number, rateText: string): string | null {
  const rate = parseRate(rateText);
  if (rate === null) return null;
  const h = Number.isNaN(hours) ? HOURS_MIN : Math.min(HOURS_MAX, Math.max(HOURS_MIN, Math.round(hours)));
  const weeks = weeksToPayBack(price, h, rate);
  const oneHour = h === 1;
  const oneWeek = weeks === 1;
  const template = oneHour
    ? oneWeek
      ? calculatorCopy.resultOneHourOneWeek
      : calculatorCopy.resultOneHour
    : oneWeek
      ? calculatorCopy.resultOneWeek
      : calculatorCopy.result;
  return template.replace('{h}', String(h)).replace('{weeks}', String(weeks));
}
