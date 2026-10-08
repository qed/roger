import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { library } from '../data/library.ts';
import type { UseCase } from '../data/library.ts';
import {
  applyLibraryParams,
  canonicalSearch,
  categoriesFor,
  filterLibrary,
  normaliseForAudience,
  parseLibraryParams,
  serialiseLibraryParams
} from './libraryFilter.ts';

const parse = (q: string) => parseLibraryParams(new URLSearchParams(q));
const ids = (q: string) => filterLibrary(library, parse(q)).map((e) => e.id);

describe('parseLibraryParams', () => {
  it('defaults to everything', () => {
    assert.deepEqual(parse(''), { for: 'all', cat: null, q: '' });
  });

  it('reads valid values and trims the search', () => {
    assert.deepEqual(parse('for=home&cat=money&q=%20gift%20'), { for: 'home', cat: 'money', q: 'gift' });
  });

  it('ignores invalid values (normalised to all)', () => {
    assert.deepEqual(parse('cat=bogus&for=x'), { for: 'all', cat: null, q: '' });
  });

  it('caps a very long search', () => {
    assert.equal(parse(`q=${'a'.repeat(300)}`).q.length, 100);
  });
});

describe('serialiseLibraryParams', () => {
  it('omits defaults and round-trips canonically', () => {
    assert.equal(serialiseLibraryParams({ for: 'all', cat: null, q: '' }), '');
    for (const q of ['for=work', 'cat=money', 'for=home&cat=kids&q=sheet', 'q=gift+cards']) {
      const once = serialiseLibraryParams(parse(q));
      assert.equal(serialiseLibraryParams(parse(once)), once, q);
    }
  });

  it('drops invalid values when re-serialised', () => {
    assert.equal(serialiseLibraryParams(parse('cat=bogus&for=x&q=')), '');
  });
});

describe('filterLibrary', () => {
  it('for=work returns only work entries', () => {
    const r = filterLibrary(library, parse('for=work'));
    assert.ok(r.length > 0);
    assert.ok(r.every((e) => e.for === 'work'));
  });

  it('cat=money returns the 7 money entries', () => {
    assert.equal(ids('cat=money').length, 7);
  });

  it('search finds gift cards, case-insensitively', () => {
    assert.deepEqual(ids('q=GIFT'), ['money-gift-cards']);
  });

  it('a valid combination can match nothing (zero-results state)', () => {
    assert.deepEqual(ids('cat=kids&for=work'), []);
  });

  it('sorts featured first, then newest week, then seed order', () => {
    const r = filterLibrary(library, parse(''));
    assert.equal(r.length, library.length);
    const firstNonFeatured = r.findIndex((e) => !e.featured);
    assert.ok(r.slice(0, firstNonFeatured).every((e) => e.featured));
    assert.ok(r.slice(firstNonFeatured).every((e) => !e.featured));
    const rest = r.slice(firstNonFeatured);
    for (let i = 1; i < rest.length; i++) assert.ok(rest[i - 1].weekOf >= rest[i].weekOf, rest[i].id);
  });

  it('does not mutate the library', () => {
    const before = library.map((e) => e.id).join();
    filterLibrary(library, parse('q=a'));
    assert.equal(library.map((e) => e.id).join(), before);
  });
});

describe('categoriesFor', () => {
  it('lists only categories that have entries for the current audience', () => {
    assert.ok(!categoriesFor(library, 'work').includes('kids'));
    assert.ok(categoriesFor(library, 'home').includes('kids'));
    assert.ok(!categoriesFor(library, 'all').includes('marketing'));
  });
});

describe('review fixes', () => {
  const entry = (id: string, extra: Partial<UseCase> = {}): UseCase => ({
    id,
    title: id,
    summary: 'A summary.',
    category: 'money',
    for: 'home',
    tool: '',
    handle: '@x',
    url: `https://x.com/x/${id}`,
    weekOf: '2026-09-23',
    ...extra
  });

  it('sorts featured, then newest week, then seed order (fixture)', () => {
    const fixture = [
      entry('a'),
      entry('b', { weekOf: '2026-09-30' }),
      entry('c', { featured: true }),
      entry('d'),
      entry('e', { featured: true, weekOf: '2026-09-30' })
    ];
    assert.deepEqual(
      filterLibrary(fixture, { for: 'all', cat: null, q: '' }).map((e) => e.id),
      ['e', 'c', 'b', 'a', 'd']
    );
  });

  it('searches the tool, handle and every hyphen of a category', () => {
    const fixture = [entry('t', { tool: 'Muse' }), entry('h', { handle: '@Peter' }), entry('s', { category: 'shop-ops' })];
    assert.deepEqual(filterLibrary(fixture, { for: 'all', cat: null, q: 'muse' }).map((e) => e.id), ['t']);
    assert.deepEqual(filterLibrary(fixture, { for: 'all', cat: null, q: 'peter' }).map((e) => e.id), ['h']);
    assert.deepEqual(filterLibrary(fixture, { for: 'all', cat: null, q: 'shop ops' }).map((e) => e.id), ['s']);
  });

  it('drops a category that has no entries for the chosen audience', () => {
    assert.deepEqual(normaliseForAudience(library, { for: 'work', cat: 'kids', q: '' }), { for: 'work', cat: null, q: '' });
    assert.deepEqual(normaliseForAudience(library, { for: 'home', cat: 'kids', q: 'x' }), { for: 'home', cat: 'kids', q: 'x' });
  });

  it('canonicalises only the library keys and keeps everything else', () => {
    const next = canonicalSearch(new URLSearchParams('utm_source=bia&cat=bogus&for=x&q=%20gift%20'), library);
    assert.equal(next, 'utm_source=bia&q=gift');
    assert.equal(canonicalSearch(new URLSearchParams('for=work&cat=kids&code=OSS'), library), 'code=OSS&for=work');
    assert.equal(canonicalSearch(new URLSearchParams(''), library), '');
  });

  it('applies library params over the current query without touching other keys', () => {
    const current = new URLSearchParams('utm_source=bia&for=home');
    assert.equal(applyLibraryParams(current, { for: 'work', cat: 'customers', q: 'tax' }), 'utm_source=bia&for=work&cat=customers&q=tax');
    assert.equal(applyLibraryParams(current, { for: 'all', cat: null, q: '' }), 'utm_source=bia');
  });
});
