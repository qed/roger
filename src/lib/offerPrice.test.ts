import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { siteConfig } from '../data/config.ts';
import { displayedOffer, offerAmounts } from './offerPrice.ts';

const prices = {
  ...siteConfig.prices,
  work: 2000,
  regularWork: 3000,
  home: 500,
  regularHome: 750
};
const open = { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 3 } };
const full = { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 0 } };

describe('displayedOffer', () => {
  it('shows the founding price, paid in full, while spots remain', () => {
    assert.deepEqual(displayedOffer('work', open), { price: 2000, isFounding: true, monthly: 167, deposit: 2000, balance: 0 });
    assert.deepEqual(displayedOffer('home', open), { price: 500, isFounding: true, monthly: 42, deposit: 500, balance: 0 });
  });

  it('shows the regular price, $3,000 work and $750 home, once founding spots are full (spec §3.1)', () => {
    assert.deepEqual(displayedOffer('work', full), { price: 3000, isFounding: false, monthly: 250, deposit: 3000, balance: 0 });
    assert.deepEqual(displayedOffer('home', full), { price: 750, isFounding: false, monthly: 63, deposit: 750, balance: 0 });
  });

  it('treats a negative spotsLeft as full', () => {
    assert.equal(displayedOffer('work', { prices, founding: { ...full.founding, spotsLeft: -1 } }).isFounding, false);
  });

  it('matches the repo config today (founding open)', () => {
    const work = displayedOffer('work', siteConfig);
    assert.equal(work.price, siteConfig.prices.work);
    assert.equal(work.deposit, siteConfig.prices.work);
  });
});

describe('offerAmounts', () => {
  it('formats the founding amounts', () => {
    assert.deepEqual(offerAmounts('work', open), { price: '$2,000', deposit: '$2,000', balance: '$0' });
    assert.deepEqual(offerAmounts('home', open), { price: '$500', deposit: '$500', balance: '$0' });
  });

  it('formats the post-founding amounts', () => {
    assert.deepEqual(offerAmounts('work', full), { price: '$3,000', deposit: '$3,000', balance: '$0' });
    assert.deepEqual(offerAmounts('home', full), { price: '$750', deposit: '$750', balance: '$0' });
  });
});
