import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { siteConfig } from './config.ts';
import { faqs, workGuaranteeAnswer } from './faqs.ts';
import { isUseCaseCategory, library, useCaseCategories } from './library.ts';
import type { UseCaseCategory } from './library.ts';
import { chiefOfStaff, exampleHref, findMenuItem, helpers, homeJobs, menuItems } from './menu.ts';
import { offers } from './offers.ts';
import type { OfferLine } from './offers.ts';
import { signoff } from './signoff.ts';

const HELPER_IDS = [
  'work-customers',
  'work-invoices',
  'work-scheduling',
  'work-leads',
  'work-social',
  'work-staff',
  'work-suppliers',
  'work-numbers'
];

const HOME_JOB_IDS = [
  'home-meal-plan',
  'home-family-brief',
  'home-school-digest',
  'home-inbox',
  'home-bills',
  'home-money-finder',
  'home-maintenance',
  'home-errands',
  'home-trip',
  'home-scam-guard',
  'home-kids-practice',
  'home-big-purchase'
];

describe('library', () => {
  it('has 33 entries with unique ids', () => {
    assert.equal(library.length, 33);
    assert.equal(new Set(library.map((e) => e.id)).size, 33);
  });

  it('links only to menu items that exist', () => {
    for (const entry of library) {
      if (entry.menuItemId === undefined) continue;
      assert.ok(findMenuItem(entry.menuItemId), `${entry.id} → unknown menu item ${entry.menuItemId}`);
    }
  });

  it('uses valid categories', () => {
    for (const entry of library) assert.ok(isUseCaseCategory(entry.category), `${entry.id}: ${entry.category}`);
  });

  it('keeps metadata and the ★ marker out of summaries', () => {
    for (const entry of library) {
      assert.doesNotMatch(entry.summary, /\b(outcome|weekOf|featured|category|menuItemId)\s*:/, entry.id);
      assert.ok(!entry.summary.includes('★'), entry.id);
    }
  });

  it('has unique urls', () => {
    assert.equal(new Set(library.map((e) => e.url)).size, library.length);
  });

  it('dates every entry to one of the two seed weeks', () => {
    for (const entry of library) assert.ok(['2026-09-23', '2026-09-30'].includes(entry.weekOf), `${entry.id}: ${entry.weekOf}`);
  });

  it('keeps titles to 70 chars with no ★', () => {
    for (const entry of library) {
      assert.ok(entry.title.length <= 70, `${entry.id}: ${entry.title.length} chars`);
      assert.ok(!entry.title.includes('★'), entry.id);
    }
  });

  it('features exactly the spec set', () => {
    const featured = library.filter((e) => e.featured).map((e) => e.id).sort();
    assert.deepEqual(
      featured,
      ['kids-worksheets', 'home-meal-plan', 'cos-gmail-clean', 'solo-race', 'money-650', 'care-scam-guard'].sort()
    );
  });

  it("links menu items whose audience matches the entry's", () => {
    for (const entry of library) {
      if (entry.menuItemId === undefined) continue;
      const prefix = entry.menuItemId.split('-')[0];
      assert.equal(prefix, entry.for, `${entry.id} (${entry.for}) → ${entry.menuItemId}`);
    }
  });

  it('has exactly one honest miss: kids-shoes-miss', () => {
    const misses = library.filter((e) => e.outcome === 'honest-miss').map((e) => e.id);
    assert.deepEqual(misses, ['kids-shoes-miss']);
  });

  it('lists every category once', () => {
    assert.equal(new Set(useCaseCategories).size, useCaseCategories.length);
  });
});

describe('menu', () => {
  it('has the Chief of Staff, 8 helpers and 12 home jobs with the spec §4 ids', () => {
    assert.equal(chiefOfStaff.id, 'work-cos');
    assert.deepEqual(
      helpers.map((h) => h.id),
      HELPER_IDS
    );
    assert.deepEqual(
      homeJobs.map((h) => h.id),
      HOME_JOB_IDS
    );
    assert.equal(new Set(menuItems.map((m) => m.id)).size, menuItems.length);
  });

  it('uses valid library categories', () => {
    for (const item of menuItems) assert.ok(isUseCaseCategory(item.libraryCategory), `${item.id}: ${item.libraryCategory}`);
  });
});

describe('exampleHref', () => {
  const hasEntries = (category: UseCaseCategory, audience: 'home' | 'work') =>
    library.some((e) => e.category === category && e.for === audience);

  it('matches the library data for the Chief of Staff and every helper', () => {
    for (const item of [chiefOfStaff, ...helpers]) {
      const c = item.libraryCategory;
      const expected = hasEntries(c, 'work') ? `/library?cat=${c}` : '/library?for=work';
      assert.equal(exampleHref(item), expected, item.id);
    }
  });

  it('carries for=home on every home job and targets a populated category or the home fallback', () => {
    for (const job of homeJobs) {
      const href = exampleHref(job);
      assert.match(href, /[?&]for=home(&|$)/, job.id);
      const cat = new URLSearchParams(href.split('?')[1]).get('cat');
      if (cat === null) {
        assert.equal(href, '/library?for=home', job.id);
        assert.ok(!hasEntries(job.libraryCategory, 'home'), `${job.id} fell back despite home entries`);
      } else {
        assert.equal(cat, job.libraryCategory, job.id);
        assert.ok(hasEntries(job.libraryCategory, 'home'), `${job.id} → empty home category ${cat}`);
      }
    }
  });
});

describe('offers', () => {
  const { prices } = siteConfig;

  it('takes prices from siteConfig.prices', () => {
    assert.equal(offers.work.price, prices.work);
    assert.equal(offers.work.regularPrice, prices.regularWork);
    assert.equal(offers.work.deposit, prices.workDeposit);
    assert.equal(offers.home.price, prices.home);
    assert.equal(offers.home.regularPrice, prices.regularHome);
    assert.equal(offers.home.deposit, prices.home);
    for (const offer of Object.values(offers)) assert.equal(offer.currency, prices.currency);
  });

  it('states only $-amounts that exist in siteConfig.prices', () => {
    const allowed = new Set(
      Object.values(prices)
        .filter((v): v is number => typeof v === 'number')
        .map((v) => `$${v.toLocaleString('en-CA')}`)
    );
    const lineText = (l: OfferLine) => [l.text, l.fallback ?? ''];
    const copy = [
      ...Object.values(offers).flatMap((o) => [
        ...lineText(o.futurePriceLine),
        ...o.whatYouGet.flatMap(lineText),
        ...o.how.flatMap(lineText),
        o.payment,
        o.guarantee,
        ...o.flow
      ]),
      workGuaranteeAnswer,
      ...faqs.map((f) => f.a)
    ];
    let seen = 0;
    for (const text of copy) {
      for (const amount of text.match(/\$\d{1,3}(?:,\d{3})*/g) ?? []) {
        seen++;
        assert.ok(allowed.has(amount), `${amount} not in siteConfig.prices: "${text}"`);
      }
    }
    assert.ok(seen > 0);
  });

  it('gates the future price line on futurePriceCommitted', () => {
    for (const offer of Object.values(offers)) assert.equal(offer.futurePriceLine.needs, 'futurePriceCommitted');
  });
});

describe('gating', () => {
  const flags = new Set(Object.keys(signoff).filter((k) => typeof signoff[k as keyof typeof signoff] === 'boolean'));

  it('uses only boolean signoff keys in `needs`', () => {
    const needs = [
      ...Object.values(offers).flatMap((o) => [o.futurePriceLine, ...o.whatYouGet, ...o.how]).map((l) => l.needs),
      ...faqs.map((f) => f.needs)
    ].filter((n): n is NonNullable<typeof n> => n !== undefined);
    assert.ok(needs.length > 0);
    for (const n of needs) assert.ok(flags.has(n), n);
  });

  it('keeps every optionalClause an exact substring of its answer', () => {
    for (const faq of faqs) {
      if (faq.optionalClause === undefined) continue;
      assert.ok(faq.a.includes(faq.optionalClause), faq.id);
      if (faq.interpolates) assert.ok(faq.optionalClause.includes(`{${faq.interpolates}}`), faq.id);
    }
  });

  it('interpolates only string siteConfig keys that appear in the answer', () => {
    for (const faq of faqs) {
      if (faq.interpolates === undefined) continue;
      assert.equal(typeof siteConfig[faq.interpolates], 'string', faq.id);
      assert.ok(faq.a.includes(`{${faq.interpolates}}`), faq.id);
    }
  });
});
