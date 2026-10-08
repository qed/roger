// The one table of offer CTAs (spec §9.1, §9.2, §9.4, §9.6, §9.7), used by both the inline offer CTAs
// (OfferCtas.tsx) and the sticky mobile bar, so link, tab behaviour and analytics never drift apart.
// The only difference between surfaces is the click event, which Cta derives from `surface`.
import { siteConfig } from '../../data/config';
import { ctaLabels, homeCheckoutLabels } from '../../data/copy/shared';
import type { MenuKind } from '../../data/menu';
import { displayedOffer, offerAmounts } from '../../lib/offerPrice';
import { picksAnalyticsValue } from '../../lib/picks';
import { formatCad } from '../../lib/proofLines';
import type { CtaVariant, TrackedEvent } from './ctaStyles';
import { useDepositLink, useFitCallLink, useHomeCheckoutLink } from './useOfferLinks';
import type { OfferLink } from './useOfferLinks';

export type OfferCtaKind = 'fitcall' | 'deposit' | 'home';

export type OfferCtaEntry = {
  useLink: () => OfferLink; // a hook: call it unconditionally at the top of a component
  offer: MenuKind; // whose Payment Link / picks it uses
  newTab: boolean; // Cal: new tab. Stripe: same tab, so sessionStorage survives to /thanks/*
  cta: string; // analytics name
  variant: CtaVariant; // default inline variant
  label: () => string; // default inline label
  stickyLabel: () => string;
  events: (picks: readonly string[]) => TrackedEvent[]; // fired after the click event
};

const homePrice = () => formatCad(displayedOffer('home', siteConfig).price);
const workDeposit = () => offerAmounts('work', siteConfig).deposit;

export const OFFER_CTAS: Record<OfferCtaKind, OfferCtaEntry> = {
  fitcall: {
    useLink: useFitCallLink,
    offer: 'work',
    newTab: true,
    cta: 'fitcall',
    variant: 'primary',
    label: () => ctaLabels.fitCallFree,
    stickyLabel: () => ctaLabels.stickyFitCall,
    events: (picks) => [{ name: 'fitcall_open', props: { picks: picksAnalyticsValue(picks) } }]
  },
  deposit: {
    useLink: useDepositLink,
    offer: 'work',
    newTab: false,
    cta: 'deposit',
    variant: 'secondary',
    label: () => ctaLabels.depositSkip(workDeposit()),
    stickyLabel: () => ctaLabels.stickyDeposit,
    events: (picks) => [{ name: 'checkout_open', props: { offer: 'work_deposit', picks: picksAnalyticsValue(picks) } }]
  },
  home: {
    useLink: useHomeCheckoutLink,
    offer: 'home',
    newTab: false,
    cta: 'home_checkout',
    variant: 'primary',
    label: () => homeCheckoutLabels.short(homePrice()),
    stickyLabel: () => homeCheckoutLabels.sticky(homePrice()),
    events: (picks) => [{ name: 'checkout_open', props: { offer: 'home', picks: picksAnalyticsValue(picks) } }]
  }
};

// The checkout CTA whose Payment Link decides whether an offer can take a workshop code.
export const CHECKOUT_CTA: Record<MenuKind, OfferCtaKind> = { work: 'deposit', home: 'home' };
