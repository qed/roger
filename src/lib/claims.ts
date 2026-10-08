// Sign-off gating and clause dropping (spec §8.4.3, R8). No unconfirmed claim renders, and no empty
// config value leaves a gap like "usually  a month" behind.
import { siteConfig } from '../data/config';
import type { Faq, FaqInterpolationKey } from '../data/faqs';
import type { OfferLine } from '../data/offers';
import { signoff as repoSignoff } from '../data/signoff';
import type { Signoff, SignoffFlag } from '../data/signoff';

export { honestyLine } from '../data/offers';

export function isUnlocked(flag: SignoffFlag, signoff: Signoff = repoSignoff): boolean {
  return signoff[flag] === true;
}

// A gated line renders its text once signed off, otherwise its fallback, otherwise nothing.
export function renderLine(line: OfferLine, signoff: Signoff = repoSignoff): string | null {
  if (!line.needs || isUnlocked(line.needs, signoff)) return line.text;
  return line.fallback ?? null;
}

export type ClauseText = {
  text: string;
  interpolates?: FaqInterpolationKey;
  optionalClause?: string; // exact substring of `text`, removed when the value is empty
};

export type ClauseValues = Record<FaqInterpolationKey, string>;

export const configValues = (): ClauseValues => ({
  providerCostRange: siteConfig.providerCostRange,
  taxNote: siteConfig.taxNote
});

// Fills {key}. With an empty value: drop the optional clause if there is one, otherwise hide the text.
export function fillClause(item: ClauseText, values: ClauseValues = configValues()): string | null {
  const key = item.interpolates;
  if (!key) return item.text;
  const value = values[key].trim();
  const placeholder = `{${key}}`;
  if (value) return item.text.split(placeholder).join(value);
  if (item.optionalClause && item.text.includes(item.optionalClause)) {
    const text = item.text.split(item.optionalClause).join('');
    return text.includes(placeholder) ? null : text;
  }
  return null;
}

export function faqAnswer(
  faq: Faq,
  values: ClauseValues = configValues(),
  signoff: Signoff = repoSignoff
): string | null {
  if (faq.needs && !isUnlocked(faq.needs, signoff)) return null;
  return fillClause({ text: faq.a, interpolates: faq.interpolates, optionalClause: faq.optionalClause }, values);
}
