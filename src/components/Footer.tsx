import { Link } from 'react-router-dom';
import { siteConfig } from '../data/config';
import { ToqueMark } from './ToqueMark';

// Minimal shell footer. The full rewrite (spec §6.12) lands in Unit 5.
const footerLinks = [
{ to: '/workshops', label: 'Workshops' },
{ to: '/library', label: 'Use-case library' },
{ to: '/home', label: 'For your home' },
{ to: '/terms', label: 'Terms' },
{ to: '/privacy', label: 'Privacy' },
{ to: '/refunds', label: 'Refunds' }];


export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-rule bg-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-ink-soft md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-2 text-ink">
          <ToqueMark className="h-6 w-6 text-copper" />
          <span className="font-serif text-xl">{siteConfig.productName}</span>
          <span className="ml-3 text-sm text-ink-faint">© {year}</span>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) =>
            <li key={link.to}>
                <Link to={link.to} className="transition-colors duration-150 hover:text-ink">
                  {link.label}
                </Link>
              </li>
            )}
            {siteConfig.contactEmail &&
            <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="transition-colors duration-150 hover:text-ink">
                  {siteConfig.contactEmail}
                </a>
              </li>
            }
            <li>Made in Toronto</li>
          </ul>
        </nav>
      </div>
    </footer>);

}
