import { Cta } from './Cta';
import type { CtaProps } from './Cta';
import type { CtaLocation } from './ctaStyles';
import { OFFER_CTAS } from './offerCtaTable';
import type { OfferCtaKind } from './offerCtaTable';

// Everything Cta takes except what the offer table decides (link, tab, analytics names, surface).
export type OfferCtaProps = Omit<CtaProps, 'href' | 'newTab' | 'cta' | 'surface' | 'events' | 'label' | 'location'> & {
  location: CtaLocation;
  label?: string;
};

function OfferCta({ kind, label, variant, ...rest }: OfferCtaProps & { kind: OfferCtaKind }) {
  const entry = OFFER_CTAS[kind];
  const { href, picks } = entry.useLink();
  return (
    <Cta
      href={href}
      label={label ?? entry.label()}
      variant={variant ?? entry.variant}
      newTab={entry.newTab}
      cta={entry.cta}
      surface="inline"
      events={entry.events(picks)}
      {...rest}
    />
  );
}

// Book a free fit call (Cal, new tab) with the work picks and workshop code (spec §9.2, §9.5).
export function FitCallCta(props: OfferCtaProps) {
  return <OfferCta kind="fitcall" {...props} />;
}

// Skip the call: the $1,000 work deposit (Stripe, same tab) (spec §9.1).
export function DepositCta(props: OfferCtaProps) {
  return <OfferCta kind="deposit" {...props} />;
}

// Pay the home price & book (Stripe, same tab) (spec §9.4).
export function HomeCheckoutCta(props: OfferCtaProps) {
  return <OfferCta kind="home" {...props} />;
}
