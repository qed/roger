// Proof and capacity lines (spec §1.12, §3.4, §6.2, §6.4, §6.7; R9b). Framework-free and tested.
// The setups/refunds counter only shows once there are 3 real setups; spots left and the capacity
// line always show.
import { foundingCopy } from '../data/copy/shared';

export type ProofCounter = { setups: number; workshops: number; refunds: number };
export type Founding = { total: number; spotsLeft: number };

export const COUNTER_MIN_SETUPS = 3;

const cad = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

// "$2,000". Prices are whole dollars everywhere on the site.
export function formatCad(amount: number): string {
  return `$${cad.format(Math.round(amount))}`;
}

function count(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function counterVisible(counter: ProofCounter): boolean {
  return count(counter.setups) >= COUNTER_MIN_SETUPS;
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

// §6.4 slot 2: "{setups} setups · {workshops} workshops · {refunds} refunds", or null below 3 setups.
// Refunds always show once the counter does, including 0.
export function counterLine(counter: ProofCounter): string | null {
  if (!counterVisible(counter)) return null;
  return [
    plural(count(counter.setups), 'setup', 'setups'),
    plural(count(counter.workshops), 'workshop', 'workshops'),
    plural(count(counter.refunds), 'refund', 'refunds')
  ].join(' · ');
}

// /workshops proof (spec §6B.6): hosts care how many workshops have run, so this line has its own rule.
// "{workshops} workshops" once at least one has run; independent of the setups threshold above.
export const WORKSHOP_COUNTER_MIN = 1;

export function workshopCounterLine(counter: Pick<ProofCounter, 'workshops'>): string | null {
  const n = count(counter.workshops);
  return n >= WORKSHOP_COUNTER_MIN ? plural(n, 'workshop', 'workshops') : null;
}

export type Endorsement = { org: string; person: string; title: string; quote: string; logo?: string };

// Endorsements with a quote and a person; the rest are placeholders and stay hidden (spec §8.1).
export function publishedEndorsements<E extends Endorsement>(list: readonly E[]): E[] {
  return list.filter((e) => e.quote.trim() !== '' && e.person.trim() !== '');
}

export function spotsLeftText(founding: Founding): string {
  const left = Math.min(count(founding.spotsLeft), count(founding.total));
  if (left === 0) return foundingCopy.full;
  return foundingCopy.spotsLeft(left, count(founding.total));
}

// §3.4: once spotsLeft hits 0 the regular price is the current price, stated as such.
export function foundingFullText(regularPrice: number): string {
  return foundingCopy.fullWithPrice(formatCad(regularPrice));
}

// The pricing card badge: spots left as a sentence, or the full-state line with the regular price.
export function pricingBadgeText(founding: Founding, regularPrice: number): string {
  return foundingIsFull(founding) ? foundingFullText(regularPrice) : foundingCopy.badge(spotsLeftText(founding));
}

export function foundingIsFull(founding: Founding): boolean {
  return Math.min(count(founding.spotsLeft), count(founding.total)) === 0;
}

// Capacity line (§1.12): "{spotsLeft} of 10 founding spots left · We take 3 setups a week".
export function capacityParts(founding: Founding, capacityLine: string): string[] {
  return [spotsLeftText(founding), capacityLine.trim()].filter(Boolean);
}

// Hero proof line (§6.2, R9b): setups and refunds only once setups ≥ 3.
export function heroProofParts(counter: ProofCounter, founding: Founding, capacityLine: string): string[] {
  const parts: string[] = [];
  if (counterVisible(counter)) {
    parts.push(plural(count(counter.setups), 'setup', 'setups'));
    parts.push(plural(count(counter.refunds), 'refund', 'refunds'));
  }
  return [...parts, ...capacityParts(founding, capacityLine)];
}

// "About $167 a month over your first year." (2000 / 12, rounded).
export function monthlyOverFirstYear(price: number): number {
  return Math.round(Math.max(0, price) / 12);
}

// Admin anchor (§6.7): hourly × 10 hours × 52 weeks, or null when no sourced rate is set.
export function adminAnnualCost(adminHourly: number): number | null {
  if (!Number.isFinite(adminHourly) || adminHourly <= 0) return null;
  return adminHourly * 10 * 52;
}
