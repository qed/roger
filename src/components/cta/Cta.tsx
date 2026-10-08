import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { ctaA11yCopy, ctaLabels } from '../../data/copy/shared';
import { trackEvent } from '../../utils/analytics';
import { ctaClassName } from './ctaStyles';
import type { CtaLocation, CtaSize, CtaSurface, CtaTone, CtaVariant, TrackedEvent } from './ctaStyles';

export type CtaProps = {
  href: string | null;
  label: string;
  variant?: CtaVariant;
  tone?: CtaTone;
  size?: CtaSize;
  newTab?: boolean; // Cal links: true. Stripe: false, so sessionStorage survives to /thanks/*.
  cta?: string; // analytics name ('fitcall', 'deposit', 'home_checkout'); no click event without it
  location?: CtaLocation; // analytics: where the CTA sits (inline surface only)
  surface?: CtaSurface; // inline → cta_click; sticky → sticky_cta_click
  events?: TrackedEvent[]; // extra events fired on click, after the click event
  note?: ReactNode; // copy that only makes sense beside a live CTA; hidden with it
  id?: string; // e.g. 'hero-cta', the element the sticky bar watches
  className?: string;
  fullWidth?: boolean;
};

function clickEvent(cta: string | undefined, surface: CtaSurface, location: CtaLocation | undefined): TrackedEvent[] {
  if (!cta) return [];
  if (surface === 'sticky') return [{ name: 'sticky_cta_click', props: { cta } }];
  return [{ name: 'cta_click', props: location ? { cta, location } : { cta } }];
}

// One primitive for every checkout and booking CTA (spec §8.1). A null href renders a disabled
// "Opening soon" button: not a link, not focusable, never tracked, with a console warning in dev.
export function Cta({
  href,
  label,
  variant = 'primary',
  tone = 'light',
  size = 'md',
  newTab = false,
  cta,
  location,
  surface = 'inline',
  events = [],
  note,
  id,
  className = '',
  fullWidth = false
}: CtaProps) {
  useEffect(() => {
    if (import.meta.env.DEV && href === null) {
      console.warn(`[Cta] "${label}" has no link configured; showing "Opening soon".`);
    }
  }, [href, label]);

  const classes = ctaClassName({ variant, tone, size, live: href !== null, fullWidth, className });
  const controlId = note ? undefined : id;

  const control =
    href === null ? (
      <button id={controlId} type="button" disabled className={classes}>
        <span className="sr-only">{ctaA11yCopy.disabledPrefix(label)}</span>
        {ctaLabels.openingSoon}
      </button>
    ) : (
      <a
        id={controlId}
        href={href}
        className={classes}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={() => [...clickEvent(cta, surface, location), ...events].forEach((e) => trackEvent(e.name, e.props))}>
        {label}
        {newTab && <span className="sr-only">{ctaA11yCopy.newTab}</span>}
      </a>
    );

  if (!note) return control;
  return (
    <div id={id} className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
      {control}
      {href !== null && note}
    </div>
  );
}
