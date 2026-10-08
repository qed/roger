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

// How long to wait for a hash target on a lazily loaded page (its chunk, then its content) before giving up.
const TARGET_WAIT_MS = 2000;

// Calls onFound once an element with the hash's id is in the DOM, watching body mutations for up to
// TARGET_WAIT_MS. Returns a cancel function.
function waitForTarget(hash: string, onFound: (target: HTMLElement) => void): () => void {
  let timer = 0;
  const observer = new MutationObserver(() => {
    const target = findTarget(hash);
    if (!target) return;
    stop();
    onFound(target);
  });
  function stop() {
    observer.disconnect();
    window.clearTimeout(timer);
  }
  observer.observe(document.body, { childList: true, subtree: true });
  timer = window.setTimeout(stop, TARGET_WAIT_MS);
  return stop;
}

function cancelPending(pending: { current: (() => void) | null }) {
  pending.current?.();
  pending.current = null;
}

// React Router doesn't scroll on navigation (plan: Key Technical Decisions). On a pathname or hash
// change, scroll to the hash target or to the top. Pages are lazy-loaded, so a target that isn't there
// yet is waited for (up to TARGET_WAIT_MS) and scrolled to when it mounts; meanwhile a new page starts at
// the top. A repeat click on the same anchor scrolls again (new `key`). Query-only changes (library
// filters) never scroll, and neither does a URL tidy-up that carries the preserve-scroll marker
// (?code= strip).
export function ScrollToHash() {
  const { pathname, hash, key, state } = useLocation();
  const prev = useRef<{ pathname: string; hash: string } | null>(null);
  // The pending wait lives outside the effect cleanup, so a marker navigation right after landing
  // (the ?code= strip) doesn't cancel a pending scroll to a late-mounting target. Any real navigation
  // cancels it.
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelPending(pending), []);

  useEffect(() => {
    const last = prev.current;
    prev.current = { pathname, hash };
    if (last !== null && preservesScroll(state)) return;
    cancelPending(pending);
    const samePlace = last !== null && last.pathname === pathname && last.hash === hash;
    if (samePlace && !hash) return;

    // Landing on /#pricing jumps straight there, like a native hash load; in-app moves glide.
    const behavior: ScrollBehavior = last === null || reducedMotion() ? 'instant' : 'smooth';
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (!hash) {
      // A new page starts at the top, instantly.
      toTop();
      return;
    }
    const target = findTarget(hash);
    if (target) {
      target.scrollIntoView({ behavior, block: 'start' });
      return;
    }
    // Not mounted yet (lazy page): start a new page at the top, then glide to the target when it lands.
    // A missing anchor on the current page leaves the scroll alone, like the browser does.
    if (last === null || last.pathname !== pathname) toTop();
    pending.current = waitForTarget(hash, (found) => {
      pending.current = null;
      found.scrollIntoView({ behavior, block: 'start' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `state` is read only alongside `key`, which changes on every navigation
  }, [pathname, hash, key]);

  return null;
}
