import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  adminAnnualCost,
  capacityParts,
  counterLine,
  formatCad,
  foundingFullText,
  foundingIsFull,
  heroProofParts,
  monthlyOverFirstYear,
  pricingBadgeText,
  spotsLeftText
} from './proofLines.ts';

const EMPTY = { setups: 0, workshops: 0, refunds: 0 };
const FOUNDING = { total: 10, spotsLeft: 10 };
const CAPACITY = 'I take 3 setups a week';

describe('formatCad', () => {
  it('formats whole dollars with a thousands separator', () => {
    assert.equal(formatCad(2000), '$2,000');
    assert.equal(formatCad(500), '$500');
    assert.equal(formatCad(26000), '$26,000');
  });
});

describe('counterLine', () => {
  it('is hidden below 3 setups', () => {
    assert.equal(counterLine(EMPTY), null);
    assert.equal(counterLine({ setups: 2, workshops: 4, refunds: 0 }), null);
  });

  it('shows all three parts from 3 setups, including 0 refunds', () => {
    assert.equal(counterLine({ setups: 3, workshops: 2, refunds: 0 }), '3 setups · 2 workshops · 0 refunds');
    assert.equal(counterLine({ setups: 4, workshops: 1, refunds: 1 }), '4 setups · 1 workshop · 1 refund');
  });
});

describe('spots and capacity', () => {
  it('states spots left out of the total', () => {
    assert.equal(spotsLeftText(FOUNDING), '10 of 10 founding spots left');
    assert.equal(spotsLeftText({ total: 10, spotsLeft: 3 }), '3 of 10 founding spots left');
  });

  it('switches to the full text at 0 and never shows a negative or over-total count', () => {
    assert.equal(spotsLeftText({ total: 10, spotsLeft: 0 }), 'Founding spots are full');
    assert.equal(spotsLeftText({ total: 10, spotsLeft: -2 }), 'Founding spots are full');
    assert.equal(spotsLeftText({ total: 10, spotsLeft: 12 }), '10 of 10 founding spots left');
    assert.equal(foundingIsFull({ total: 10, spotsLeft: 0 }), true);
    assert.equal(foundingIsFull(FOUNDING), false);
  });

  it('states the regular price as the current price once full', () => {
    assert.equal(foundingFullText(3000), 'Founding spots are full. Regular price from here: $3,000.');
  });

  it('drops an empty capacity line', () => {
    assert.deepEqual(capacityParts(FOUNDING, '  '), ['10 of 10 founding spots left']);
  });
});

describe('heroProofParts (R9b)', () => {
  it('shows only spots left and capacity before 3 setups', () => {
    assert.deepEqual(heroProofParts(EMPTY, FOUNDING, CAPACITY), ['10 of 10 founding spots left', CAPACITY]);
    assert.deepEqual(heroProofParts({ setups: 2, workshops: 0, refunds: 1 }, FOUNDING, CAPACITY), [
      '10 of 10 founding spots left',
      CAPACITY
    ]);
  });

  it('adds setups and refunds (even 0) from 3 setups', () => {
    assert.deepEqual(heroProofParts({ setups: 3, workshops: 2, refunds: 0 }, { total: 10, spotsLeft: 7 }, CAPACITY), [
      '3 setups',
      '0 refunds',
      '7 of 10 founding spots left',
      CAPACITY
    ]);
  });
});

describe('pricing maths', () => {
  it('frames the price per month over the first year', () => {
    assert.equal(monthlyOverFirstYear(2000), 167);
    assert.equal(monthlyOverFirstYear(500), 42);
  });

  it('computes the admin anchor only for a positive rate', () => {
    assert.equal(adminAnnualCost(0), null);
    assert.equal(adminAnnualCost(-5), null);
    assert.equal(adminAnnualCost(Number.NaN), null);
    assert.equal(adminAnnualCost(25), 13000);
  });
});

describe('pricingBadgeText', () => {
  it('states spots left as a sentence while founding spots remain', () => {
    assert.equal(pricingBadgeText({ total: 10, spotsLeft: 4 }, 3000), '4 of 10 founding spots left.');
  });

  it('states the regular price once founding spots are full', () => {
    assert.equal(pricingBadgeText({ total: 10, spotsLeft: 0 }, 3000), 'Founding spots are full. Regular price from here: $3,000.');
  });
});
