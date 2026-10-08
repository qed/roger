import { useEffect, useId, useRef, useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { siteConfig } from '../../data/config';
import { ctaLabels, headerCopy } from '../../data/copy/shared';
import { FitCallCta, HomeCheckoutCta } from '../cta/OfferCtas';
import { ToqueMark } from '../ToqueMark';

// Pages that carry their own #how, #pricing and #faq sections; elsewhere the nav points at / (R6).
const OFFER_PAGES = new Set(['/', '/home']);

// "/home/" and "/home" are the same page.
function normalisePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

// Spec §6.1 with R6 and R12c: page-aware nav and CTA; on /home the audience link flips to business.
export function Header() {
  const { pathname: rawPathname, key } = useLocation();
  const pathname = normalisePath(rawPathname);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const onOfferPage = OFFER_PAGES.has(pathname);
  const audienceLink = pathname === '/home' ? headerCopy.forBusiness : headerCopy.forHome;
  const navTarget = (id: string) => ({ pathname: onOfferPage ? pathname : '/', hash: `#${id}` });

  // Close the mobile menu on any navigation (including same-page anchors).
  useEffect(() => {
    setOpen(false);
  }, [key]);

  // Close it when the viewport grows past the mobile breakpoint (the menu is md:hidden).
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(min-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const navLinkClass = 'text-sm text-ink-soft transition-colors duration-150 hover:text-ink';

  return (
    <header className="border-b border-rule/80 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
        <Link to="/" className="mr-auto flex shrink-0 items-center gap-2 text-ink" aria-label={`${siteConfig.productName}, home page`}>
          <ToqueMark className="h-7 w-7 text-copper" />
          <span className="font-serif text-2xl leading-none">{siteConfig.productName}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {headerCopy.nav.map((item) => (
              <li key={item.id}>
                <Link to={navTarget(item.id)} className={navLinkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:ml-8 md:gap-6">
          <Link to={audienceLink.to} className={`hidden md:inline ${navLinkClass}`}>
            {audienceLink.label}
          </Link>
          {pathname === '/home' ? (
            <HomeCheckoutCta location="header" size="sm" />
          ) : (
            <FitCallCta location="header" label={ctaLabels.fitCall} size="sm" />
          )}
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? headerCopy.menuClose : headerCopy.menuOpen}
            onClick={() => setOpen((value) => !value)}>
            {open ? <XIcon className="h-5 w-5" aria-hidden="true" /> : <MenuIcon className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav id={menuId} aria-label="Mobile" hidden={!open} className="border-t border-rule/80 md:hidden">
        <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2">
          {headerCopy.nav.map((item) => (
            <li key={item.id}>
              <Link to={navTarget(item.id)} className="block py-3 text-base text-ink" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
          <li className="border-t border-rule/80">
            <Link to={audienceLink.to} className="block py-3 text-base text-ink" onClick={() => setOpen(false)}>
              {audienceLink.label}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
