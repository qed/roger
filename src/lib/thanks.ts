// Decisions behind the post-payment pages (spec §9.2, §9.4), kept pure so they're unit-tested.
import type { MenuKind } from '../data/menu';

// Pages after a payment: the header hides its fit-call/checkout button there so a paying customer isn't
// sent back to the start (and no conversion event fires). Expects a pathname without a trailing slash.
export function isThanksPath(pathname: string): boolean {
  return pathname === '/thanks' || pathname.startsWith('/thanks/');
}

export type ThanksBookingModel = {
  href: string | null; // the Cal session link, or null when not configured
  showFallback: boolean; // "We'll email you within 1 business day to book."
  mailto: string | null; // offered with the fallback only when a contact email is set
  showTiming: boolean; // timing copy only makes sense beside a live booking link
};

export function thanksBookingModel(input: {
  kind: MenuKind;
  href: string | null;
  contactEmail: string;
  mailtoSubject: (kind: MenuKind) => string;
  hasTiming: boolean;
}): ThanksBookingModel {
  const email = input.contactEmail.trim();
  const live = input.href !== null;
  return {
    href: input.href,
    showFallback: !live,
    mailto:
      !live && email ? `mailto:${email}?subject=${encodeURIComponent(input.mailtoSubject(input.kind))}` : null,
    showTiming: live && input.hasTiming
  };
}
