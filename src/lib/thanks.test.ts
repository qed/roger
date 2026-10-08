import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bookingFallbackCopy } from '../data/copy/thanks.ts';
import { isThanksPath, thanksBookingModel } from './thanks.ts';

describe('isThanksPath', () => {
  it('matches the thanks routes (paths arrive without a trailing slash)', () => {
    for (const p of ['/thanks/work', '/thanks/home', '/thanks']) assert.equal(isThanksPath(p), true, p);
    for (const p of ['/', '/home', '/library', '/thanksgiving', '/workshops']) assert.equal(isThanksPath(p), false, p);
  });
});

describe('thanksBookingModel', () => {
  const base = { mailtoSubject: bookingFallbackCopy.mailtoSubject, hasTiming: true };

  it('with a live Cal link: no fallback, no mailto, timing shown', () => {
    const m = thanksBookingModel({ ...base, kind: 'work', href: 'https://cal.com/p/s1', contactEmail: 'peter@meetroger.ca' });
    assert.deepEqual(m, { href: 'https://cal.com/p/s1', showFallback: false, mailto: null, showTiming: true });
  });

  it('without a Cal link but with an email: fallback plus an encoded mailto per offer', () => {
    const work = thanksBookingModel({ ...base, kind: 'work', href: null, contactEmail: ' peter@meetroger.ca ' });
    assert.equal(work.showFallback, true);
    assert.equal(work.mailto, 'mailto:peter@meetroger.ca?subject=Booking%20Session%201');
    assert.equal(work.showTiming, false);
    const home = thanksBookingModel({ ...base, kind: 'home', href: null, contactEmail: 'peter@meetroger.ca' });
    assert.equal(home.mailto, 'mailto:peter@meetroger.ca?subject=Booking%20my%20home%20session');
  });

  it('without a Cal link or an email: fallback only, never a broken mailto', () => {
    const m = thanksBookingModel({ ...base, kind: 'home', href: null, contactEmail: '   ' });
    assert.deepEqual(m, { href: null, showFallback: true, mailto: null, showTiming: false });
  });

  it('no timing line when the page has none', () => {
    const m = thanksBookingModel({ ...base, kind: 'work', href: 'https://cal.com/p/s1', contactEmail: '', hasTiming: false });
    assert.equal(m.showTiming, false);
  });
});
