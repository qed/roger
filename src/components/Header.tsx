import { Link } from 'react-router-dom';
import { siteConfig } from '../data/config';
import { ToqueMark } from './ToqueMark';

// Minimal shell header. The page-aware rewrite (CTA, hamburger) lands in Unit 5.
const navLinks = [
{ href: '/#how', label: 'How it works' },
{ href: '/#pricing', label: 'Pricing' },
{ href: '/#faq', label: 'FAQ' }];


export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/80 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-ink" aria-label={`${siteConfig.productName} home`}>
          <ToqueMark className="h-7 w-7 text-copper" />
          <span className="font-serif text-2xl leading-none">{siteConfig.productName}</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) =>
            <li key={link.href}>
                <a href={link.href} className="text-sm text-ink-soft transition-colors duration-150 hover:text-ink">
                  {link.label}
                </a>
              </li>
            )}
          </ul>
        </nav>
        <Link to="/home" className="text-sm text-ink-soft transition-colors duration-150 hover:text-ink">
          For your home
        </Link>
      </div>
    </header>);

}
