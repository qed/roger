// Payback calculator (spec §6.7): weeks = ceil(price / (hours × rate)). "Your numbers, not a promise."
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
