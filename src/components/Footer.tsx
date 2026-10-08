import React from 'react';
import { siteConfig } from '../data/config';
import { ToqueMark } from './ToqueMark';

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
            <li>
              <a href="#privacy" className="transition-colors duration-150 hover:text-ink">Privacy</a>
            </li>
            <li>
              <a href="#terms" className="transition-colors duration-150 hover:text-ink">Terms</a>
            </li>
            {siteConfig.contactEmail &&
            <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="transition-colors duration-150 hover:text-ink">
                  {siteConfig.contactEmail}
                </a>
              </li>
            }
          </ul>
        </nav>
      </div>
    </footer>);

}