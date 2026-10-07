import React from 'react';
import { siteConfig } from '../data/config';
import { ToqueMark } from './ToqueMark';

const navLinks = [
{ href: '#home', label: 'At home' },
{ href: '#work', label: 'At work' },
{ href: '#how', label: 'How it works' },
{ href: '#faq', label: 'FAQ' }];


export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/80 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-2 text-ink" aria-label={`${siteConfig.productName} home`}>
          <ToqueMark className="h-7 w-7 text-copper" />
          <span className="font-serif text-2xl leading-none">{siteConfig.productName}</span>
        </a>
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
        <a
          href="#waitlist"
          className="inline-flex h-10 items-center whitespace-nowrap rounded-md bg-ink px-4 text-sm font-medium text-cream transition-colors duration-150 hover:bg-ink/90">
          
          {siteConfig.cta.primary}
        </a>
      </div>
    </header>);

}