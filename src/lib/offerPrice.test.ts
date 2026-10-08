import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { siteConfig } from '../data/config.ts';
import { displayedOffer } from './offerPrice.ts';

const prices = { ...siteConfig.prices, work: 2000, regularWork: 3000, home: 500, regularHome: 750 };
const open = { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 3 } };
const full = { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 0 } };

describe('displayedOffer', () => {
  it('shows the founding price while spots remain', () => {
    assert.deepEqual(displayedOffer('work', open), { price: 2000, isFounding: true, monthly: 167 });
    assert.deepEqual(displayedOffer('home', open), { price: 500, isFounding: true, monthly: 42 });
  });

  it('shows the regular price once founding spots are full', () => {
    assert.deepEqual(displayedOffer('work', full), { price: 3000, isFounding: false, monthly: 250 });
    assert.deepEqual(displayedOffer('home', full), { price: 750, isFounding: false, monthly: 63 });
  });

  it('treats a negative spotsLeft as full', () => {
    assert.equal(displayedOffer('work', { prices, founding: { ...full.founding, spotsLeft: -1 } }).isFounding, false);
  });

  it('matches the repo config today (founding open)', () => {
    assert.equal(displayedOffer('work', siteConfig).price, siteConfig.prices.work);
  });
});
