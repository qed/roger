import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/config';
import { footerCopy } from '../../data/copy/shared';
import { ToqueMark } from '../ToqueMark';

// Spec §6.12: toque mark, © year · Workshops · Use-case library · For your home · Terms · Privacy ·
// Refunds · contactEmail (only when set) · "Made in Toronto".
export function Footer() {
  const year = new Date().getFullYear();
  const email = siteConfig.contactEmail.trim();
  const linkClass = 'transition-colors duration-150 hover:text-ink';
  return (
    <footer className="border-t border-rule bg-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-ink-soft md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-2 text-ink">
          <ToqueMark className="h-6 w-6 text-copper" />
          <span className="font-serif text-xl">{siteConfig.productName}</span>
          <span className="ml-3 text-sm text-ink-soft">© {year}</span>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {footerCopy.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            {email && (
              <li>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </li>
            )}
            <li>{footerCopy.madeIn}</li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
