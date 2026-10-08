import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { siteConfig } from '../data/config.ts';
import { buildJsonLd, serializeJsonLd } from './jsonLd.ts';

const base = {
  ...siteConfig,
  prices: { ...siteConfig.prices, work: 2000, workDeposit: 1000, home: 500, regularWork: 3000, regularWorkDeposit: 1500, regularHome: 750 }
};
const founding = { ...base, founding: { ...base.founding, total: 10, spotsLeft: 4 } };
const full = { ...base, founding: { ...base.founding, total: 10, spotsLeft: 0 } };

type Offer = { name: string; price: string; priceCurrency: string; url?: string };
const offersOf = (ld: Record<string, unknown>) => ld.makesOffer as Offer[];

describe('buildJsonLd', () => {
  it('is a Toronto ProfessionalService named Roger', () => {
    const ld = buildJsonLd(founding);
    assert.equal(ld['@context'], 'https://schema.org');
    assert.equal(ld['@type'], 'ProfessionalService');
    assert.equal(ld.name, 'Roger');
    assert.deepEqual(ld.areaServed, { '@type': 'City', name: 'Toronto' });
  });

  it('offers work and home at the founding prices in CAD while founding spots remain', () => {
    const ld = buildJsonLd(founding);
    assert.deepEqual(
      offersOf(ld).map((o) => [o.name, o.price, o.priceCurrency]),
      [
        ['Work setup', '2000', 'CAD'],
        ['Home setup', '500', 'CAD']
      ]
    );
    assert.equal(ld.priceRange, '$500–$2,000 CAD');
  });

  it('switches to the regular prices once founding spots are full', () => {
    const ld = buildJsonLd(full);
    assert.deepEqual(offersOf(ld).map((o) => o.price), ['3000', '750']);
    assert.equal(ld.priceRange, '$750–$3,000 CAD');
  });

  it('has no url anywhere while the domain is empty or not a https origin', () => {
    for (const domain of ['', '  ', 'meetroger.ai', 'http://meetroger.ai']) {
      const text = JSON.stringify(buildJsonLd({ ...founding, domain }));
      assert.doesNotMatch(text, /"url"/, domain);
    }
  });

  it('adds the site and offer urls once the domain is set', () => {
    const ld = buildJsonLd({ ...founding, domain: 'https://meetroger.ai/' });
    assert.equal(ld.url, 'https://meetroger.ai');
    assert.deepEqual(offersOf(ld).map((o) => o.url), ['https://meetroger.ai/', 'https://meetroger.ai/home']);
  });

  it('includes the email only when set', () => {
    assert.equal(buildJsonLd({ ...founding, contactEmail: '' }).email, undefined);
    assert.equal(buildJsonLd({ ...founding, contactEmail: 'peter@meetroger.ca' }).email, 'peter@meetroger.ca');
  });

  it('serializes without a raw "<" so nothing can close the script tag', () => {
    const text = serializeJsonLd({ name: '</script><script>x' });
    assert.ok(!text.includes('<'));
    assert.deepEqual(JSON.parse(text), { name: '</script><script>x' });
  });
});

describe('serializeJsonLd escaping (review)', () => {
  it('escapes "<" and the U+2028/U+2029 separators', () => {
    const ls = String.fromCharCode(0x2028);
    const ps = String.fromCharCode(0x2029);
    const out = serializeJsonLd({ name: `a</script>b${ls}c${ps}d` });
    assert.ok(!out.includes('<'));
    assert.ok(!out.includes(ls) && !out.includes(ps));
    const bs = String.fromCharCode(92);
    assert.ok(out.includes(`${bs}u003c/script>`));
    assert.ok(out.includes(`${bs}u2028`) && out.includes(`${bs}u2029`));
    assert.deepEqual(JSON.parse(out), { name: `a</script>b${ls}c${ps}d` });
  });
});
