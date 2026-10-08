import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createMemoryStorage, createThrowingStorage } from './storage.ts';
import {
  UTM_STORAGE_KEY,
  captureUtm,
  cleanUtmValue,
  currentUtm,
  mergeUtm,
  parseStoredUtm,
  parseUtmSearch
} from './utm.ts';

describe('parseUtmSearch', () => {
  it('reads the five UTM keys and ignores others', () => {
    assert.deepEqual(parseUtmSearch('?utm_source=bia&utm_medium=qr&code=X&foo=1'), { utm_source: 'bia', utm_medium: 'qr' });
    assert.deepEqual(parseUtmSearch('utm_campaign=fall-2026'), { utm_campaign: 'fall-2026' });
  });

  it('ignores empty and whitespace-only values', () => {
    assert.deepEqual(parseUtmSearch('?utm_source=&utm_medium=%20%20'), {});
  });

  it('trims values and decodes + as a space', () => {
    assert.deepEqual(parseUtmSearch('?utm_source=%20bia%20&utm_campaign=open+house'), {
      utm_source: 'bia',
      utm_campaign: 'open house'
    });
  });

  it('drops values with characters outside the safe set or over 100 chars', () => {
    assert.deepEqual(parseUtmSearch('?utm_source=%3Cscript%3E&utm_medium=a%2Fb&utm_term=caf%C3%A9'), {});
    assert.deepEqual(parseUtmSearch(`?utm_source=${'a'.repeat(101)}`), {});
    assert.deepEqual(parseUtmSearch(`?utm_source=${'a'.repeat(100)}`), { utm_source: 'a'.repeat(100) });
  });
});

describe('cleanUtmValue', () => {
  it('allows letters, digits, space and . _ ~ + -', () => {
    assert.equal(cleanUtmValue('A-z_0.9~+ x'), 'A-z_0.9~+ x');
    assert.equal(cleanUtmValue('a&b'), null);
    assert.equal(cleanUtmValue(42), null);
  });
});

describe('parseStoredUtm', () => {
  it('reads {} from corrupt or non-object JSON', () => {
    for (const raw of [null, '', '{', 'null', '42', '"bia"', '[1,2]', 'true']) {
      assert.deepEqual(parseStoredUtm(raw), {}, String(raw));
    }
  });

  it('keeps only valid known keys', () => {
    assert.deepEqual(parseStoredUtm(JSON.stringify({ utm_source: 'bia', utm_medium: 7, other: 'x', utm_term: '<b>' })), {
      utm_source: 'bia'
    });
  });
});

describe('mergeUtm', () => {
  it('URL values override per key; other stored keys are kept', () => {
    assert.deepEqual(mergeUtm({ utm_source: 'bia', utm_campaign: 'fall' }, { utm_medium: 'x', utm_campaign: 'spring' }), {
      utm_source: 'bia',
      utm_medium: 'x',
      utm_campaign: 'spring'
    });
  });

  it('keeps the stored params when the URL has none', () => {
    assert.deepEqual(mergeUtm({ utm_source: 'bia' }, {}), { utm_source: 'bia' });
  });
});

describe('captureUtm and currentUtm', () => {
  it('remembers the landing params and merges a later visit', () => {
    const storage = createMemoryStorage();
    captureUtm(storage, '?code=OSSINGTON&utm_source=bia');
    assert.deepEqual(currentUtm(storage, ''), { utm_source: 'bia' });
    captureUtm(storage, '?utm_medium=x');
    assert.deepEqual(JSON.parse(storage.getItem(UTM_STORAGE_KEY) ?? ''), { utm_source: 'bia', utm_medium: 'x' });
  });

  it('does not write when the URL carries no UTM params', () => {
    const storage = createMemoryStorage();
    captureUtm(storage, '?foo=1&utm_source=');
    assert.equal(storage.getItem(UTM_STORAGE_KEY), null);
  });

  it('currentUtm overlays the URL without writing', () => {
    const storage = createMemoryStorage();
    storage.setItem(UTM_STORAGE_KEY, JSON.stringify({ utm_source: 'bia' }));
    assert.deepEqual(currentUtm(storage, '?utm_source=news'), { utm_source: 'news' });
    assert.deepEqual(JSON.parse(storage.getItem(UTM_STORAGE_KEY) ?? ''), { utm_source: 'bia' });
  });

  it('reads corrupt storage as empty', () => {
    const storage = createMemoryStorage();
    storage.setItem(UTM_STORAGE_KEY, '{not json');
    assert.deepEqual(currentUtm(storage, ''), {});
  });

  it('never throws when storage throws', () => {
    assert.deepEqual(captureUtm(createThrowingStorage(), '?utm_source=bia'), { utm_source: 'bia' });
    assert.deepEqual(currentUtm(createThrowingStorage(), ''), {});
  });
});
