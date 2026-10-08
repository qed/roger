import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { preservesScroll } from './navigationState';

function reducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function findTarget(hash: string): HTMLElement | null {
  if (!hash || hash === '#') return null;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // Keep the raw id.
  }
  return document.getElementById(id);
}

// React Router doesn't scroll on navigation (plan: Key Technical Decisions). On a pathname or hash
// change, scroll to the hash target (retrying one frame for content that mounts late) or to the top.
// A repeat click on the same anchor scrolls again (new `key`). Query-only changes (library filters)
// never scroll, and neither does a URL tidy-up that carries the preserve-scroll marker (?code= strip).
export function ScrollToHash() {
  const { pathname, hash, key, state } = useLocation();
  const prev = useRef<{ pathname: string; hash: string } | null>(null);
  // The one-frame retry lives outside the effect cleanup, so a marker navigation right after landing
  // (the ?code= strip) doesn't cancel a pending scroll to a late-mounting target.
  const frame = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    []
  );

  useEffect(() => {
    const last = prev.current;
    prev.current = { pathname, hash };
    if (last !== null && preservesScroll(state)) return;
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    const samePlace = last !== null && last.pathname === pathname && last.hash === hash;
    if (samePlace && !hash) return;

    // Landing on /#pricing jumps straight there, like a native hash load; in-app moves glide.
    const behavior: ScrollBehavior = last === null || reducedMotion() ? 'instant' : 'smooth';
    if (!hash) {
      // A new page starts at the top, instantly.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    const scroll = () => {
      const target = findTarget(hash);
      if (!target) return false;
      target.scrollIntoView({ behavior, block: 'start' });
      return true;
    };
    if (scroll()) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      if (!scroll()) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
    // `state` is read only alongside `key`, which changes on every navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash, key]);

  return null;
}
