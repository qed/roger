import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HOURS_MAX, HOURS_MIN, weeksToPayBack } from './payback.ts';

describe('weeksToPayBack', () => {
  it('matches the spec examples', () => {
    assert.equal(weeksToPayBack(2000, 3, 50), 14);
    assert.equal(weeksToPayBack(500, 3, 50), 4);
  });

  it('rounds up', () => {
    assert.equal(weeksToPayBack(2000, 10, 50), 4);
    assert.equal(weeksToPayBack(2000, 4, 50), 10);
  });

  it('clamps hours to 1–10', () => {
    assert.equal(HOURS_MIN, 1);
    assert.equal(HOURS_MAX, 10);
    assert.equal(weeksToPayBack(2000, 0, 50), 40);
    assert.equal(weeksToPayBack(2000, -5, 50), 40);
    assert.equal(weeksToPayBack(2000, 99, 50), 4);
  });

  it('never returns Infinity or NaN', () => {
    const cases: [number, number, number][] = [
      [2000, 0, 0],
      [2000, 3, 0],
      [2000, Number.NaN, Number.NaN],
      [2000, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
      [Number.NaN, 3, 50],
      [-100, 3, 50]
    ];
    for (const [price, h, rate] of cases) {
      const weeks = weeksToPayBack(price, h, rate);
      assert.ok(Number.isFinite(weeks), `${price}/${h}/${rate} -> ${weeks}`);
      assert.ok(weeks >= 0);
    }
  });

  it('treats a rate below 1 as 1', () => {
    assert.equal(weeksToPayBack(2000, 3, 0), Math.ceil(2000 / 3));
  });
});

describe('clamping (review)', () => {
  it('clamps infinite hours to the max and NaN hours to the min', () => {
    assert.equal(weeksToPayBack(2000, Number.POSITIVE_INFINITY, 50), 4);
    assert.equal(weeksToPayBack(2000, Number.NaN, 50), 40);
  });
});
