import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { hasScrolledPast, isTextField, stickyBarVisible } from '../../lib/stickyBar';
import { Cta } from './Cta';
import { OFFER_CTAS } from './offerCtaTable';
import type { OfferCtaKind } from './offerCtaTable';

export type StickyCta = OfferCtaKind;

export const HERO_CTA_ID = 'hero-cta';
export const FINAL_CTA_ID = 'final-cta';

type StickyCtaBarProps = {
  ctas: StickyCta[]; // page-specific (spec §9.6): / fit call + deposit, /home pay, /library fit call
  heroSentinelId?: string; // element around (or on) the page's hero CTA
  finalBandId?: string; // the final CTA band
};

// One child per requested kind, so only the link hooks the page needs run. Reports whether its link
// is configured; renders nothing when it isn't.
function StickyItem({
  kind,
  primary,
  onLive
}: {
  kind: OfferCtaKind;
  primary: boolean;
  onLive: (kind: OfferCtaKind, live: boolean) => void;
}) {
  const entry = OFFER_CTAS[kind];
  const { href, picks } = entry.useLink();
  const live = href !== null;
  useEffect(() => {
    onLive(kind, live);
    return () => onLive(kind, false);
  }, [kind, live, onLive]);
  if (!live) return null;
  return (
    <Cta
      href={href}
      label={entry.stickyLabel()}
      tone="dark"
      size="sm"
      variant={primary ? 'primary' : 'secondary'}
      newTab={entry.newTab}
      cta={entry.cta}
      surface="sticky"
      events={entry.events(picks)}
      className="flex-1"
    />
  );
}

// Below 768px only. Appears once the hero CTA has scrolled up out of view; hides while a text field
// has focus or the final CTA band is on screen; never shows when none of its CTAs has a link.
export function StickyCtaBar({ ctas, heroSentinelId = HERO_CTA_ID, finalBandId = FINAL_CTA_ID }: StickyCtaBarProps) {
  const { pathname } = useLocation();
  const [heroCtaPassed, setHeroCtaPassed] = useState(false);
  const [finalBandVisible, setFinalBandVisible] = useState(false);
  const [fieldFocused, setFieldFocused] = useState(false);
  const [liveKinds, setLiveKinds] = useState<ReadonlySet<OfferCtaKind>>(() => new Set());

  const onLive = useCallback((kind: OfferCtaKind, live: boolean) => {
    setLiveKinds((prev) => {
      if (prev.has(kind) === live) return prev;
      const next = new Set(prev);
      if (live) next.add(kind);
      else next.delete(kind);
      return next;
    });
  }, []);

  // Re-attached on every page change: the sentinels belong to the page, not the layout.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observers: IntersectionObserver[] = [];
    const hero = document.getElementById(heroSentinelId);
    if (hero) {
      const io = new IntersectionObserver(([entry]) => setHeroCtaPassed(hasScrolledPast(entry)));
      io.observe(hero);
      observers.push(io);
    } else if (import.meta.env.DEV) {
      console.warn(`[StickyCtaBar] no #${heroSentinelId} on ${pathname}; the bar stays hidden.`);
    }
    const final = document.getElementById(finalBandId);
    if (final) {
      const io = new IntersectionObserver(([entry]) => setFinalBandVisible(entry.isIntersecting));
      io.observe(final);
      observers.push(io);
    } else if (import.meta.env.DEV) {
      console.warn(`[StickyCtaBar] no #${finalBandId} on ${pathname}; the bar won't hide over the final CTA band.`);
    }
    return () => {
      observers.forEach((io) => io.disconnect());
      setHeroCtaPassed(false);
      setFinalBandVisible(false);
    };
  }, [pathname, heroSentinelId, finalBandId]);

  useEffect(() => {
    const update = () => setFieldFocused(isTextField(document.activeElement));
    // On focusout, activeElement is still the old field; check once focus has settled.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onFocusOut = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 0);
    };
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  const firstLive = ctas.find((kind) => liveKinds.has(kind));
  const visible = stickyBarVisible({ heroCtaPassed, finalBandVisible, fieldFocused, liveCtaCount: liveKinds.size });

  return (
    <>
      {/* Keeps the footer reachable above the bar on small screens, only while the bar is showing. */}
      {visible && <div aria-hidden="true" className="h-[calc(56px+env(safe-area-inset-bottom))] md:hidden" />}
      <div
        hidden={liveKinds.size === 0}
        className={`surface-dark fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-ink pb-[env(safe-area-inset-bottom)] transition-transform duration-200 motion-reduce:transition-none md:hidden ${
          visible ? 'translate-y-0' : 'invisible translate-y-full'
        }`}>
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
          {ctas.map((kind) => (
            <StickyItem key={kind} kind={kind} primary={kind === firstLive} onLive={onLive} />
          ))}
        </div>
      </div>
    </>
  );
}
