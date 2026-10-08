// JSON-LD for / and /home (spec §10 SEO): one ProfessionalService with the work and home offers.
// Prices come from displayedOffer, so they follow the founding → regular switch like the rest of the copy.
// `url` is included only once siteConfig.domain is set (an empty or relative url would be invalid).
// Framework-free and tested (jsonLd.test.ts).
import type { SiteConfig } from '../data/config';
import { offers } from '../data/offers';
import { displayedOffer } from './offerPrice';
import { formatCad } from './proofLines';

type JsonLdConfig = Pick<SiteConfig, 'productName' | 'domain' | 'prices' | 'founding' | 'founder' | 'contactEmail'>;

export const JSON_LD_DESCRIPTION = 'I set up AI assistants for small businesses and families in Toronto, on their own accounts.';

export function buildJsonLd(config: JsonLdConfig): Record<string, unknown> {
  const domain = config.domain.trim().replace(/\/+$/, '');
  const url = /^https:\/\/[^/\s]+\.[^/\s]+$/.test(domain) ? domain : '';
  const offer = (id: 'work' | 'home', path: string) => {
    const { price } = displayedOffer(id, config);
    return {
      '@type': 'Offer',
      name: offers[id].name,
      price: String(price),
      priceCurrency: config.prices.currency,
      ...(url ? { url: `${url}${path}` } : {})
    };
  };
  const work = displayedOffer('work', config).price;
  const home = displayedOffer('home', config).price;
  const email = config.contactEmail.trim();
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: config.productName,
    description: JSON_LD_DESCRIPTION,
    ...(url ? { url } : {}),
    ...(email ? { email } : {}),
    areaServed: { '@type': 'City', name: config.founder.city },
    priceRange: `${formatCad(Math.min(work, home))}–${formatCad(Math.max(work, home))} ${config.prices.currency}`,
    makesOffer: [offer('work', '/'), offer('home', '/home')]
  };
}

// The escapes are built from char codes on purpose: written as string escapes, editing tools tend to
// turn them back into the literal characters, which would silently disable the escaping.
const BACKSLASH = String.fromCharCode(92);
const LINE_SEPARATOR = new RegExp(String.fromCharCode(0x2028), 'g');
const PARAGRAPH_SEPARATOR = new RegExp(String.fromCharCode(0x2029), 'g');

// For a <script type="application/ld+json">: escapes "<" so no string can close the script tag, and the
// U+2028/U+2029 separators, which some parsers treat as line breaks.
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, `${BACKSLASH}u003c`)
    .replace(LINE_SEPARATOR, `${BACKSLASH}u2028`)
    .replace(PARAGRAPH_SEPARATOR, `${BACKSLASH}u2029`);
}
