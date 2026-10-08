import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  appendParams,
  fitCallUrl,
  homeCheckoutUrl,
  homeSessionUrl,
  picksTitles,
  workDepositUrl,
  workSessionUrl
} from './checkoutLinks.ts';
import { createPicksStore, readPicks } from './picks.ts';
import { createMemoryStorage } from './storage.ts';
import { findMenuItem, menuItems } from '../data/menu.ts';
import { acceptWorkshopCode, readWorkshopCode, storeWorkshopCode } from './workshopCode.ts';

const STRIPE_WORK = 'https://buy.stripe.com/test_work';
const STRIPE_HOME = 'https://buy.stripe.com/test_home';
const CAL_FIT = 'https://cal.com/peter/fit-call';
const CAL_S1 = 'https://cal.com/peter/session-1';
const CAL_HOME = 'https://cal.com/peter/home';
const PICKS = ['work-customers', 'work-invoices', 'work-leads'];

function params(url: string | null): URLSearchParams {
  assert.ok(url, 'expected a URL');
  return new URL(url).searchParams;
}

describe('appendParams', () => {
  it('returns null for an empty or blank base link', () => {
    assert.equal(appendParams('', [['a', 'b']]), null);
    assert.equal(appendParams('   ', [['a', 'b']]), null);
  });

  it('appends with & when the base already has a query, keeping it and any hash', () => {
    assert.equal(appendParams('https://x.test/p?locale=en', [['a', 'b c']]), 'https://x.test/p?locale=en&a=b%20c');
    assert.equal(appendParams('https://x.test/p?', [['a', 'b']]), 'https://x.test/p?a=b');
    assert.equal(appendParams('https://x.test/p#frag', [['a', 'b']]), 'https://x.test/p?a=b#frag');
  });

  it('returns the base unchanged when there are no params', () => {
    assert.equal(appendParams('https://x.test/p', []), 'https://x.test/p');
  });
});

describe('workDepositUrl', () => {
  it('returns null when the deposit link is empty (Opening soon)', () => {
    assert.equal(workDepositUrl({ picks: PICKS }, ''), null);
  });

  it('defaults to siteConfig.stripe.workDeposit (empty today)', () => {
    assert.equal(workDepositUrl({ picks: PICKS }), null);
  });

  it('carries picks and utm in client_reference_id', () => {
    const p = params(workDepositUrl({ picks: PICKS, utmSource: 'bia-ossington' }, STRIPE_WORK));
    assert.equal(p.get('client_reference_id'), 'w-customers-invoices-leads__bia-ossington');
    assert.equal(p.has('prefilled_promo_code'), false);
  });

  it('uses w-none__direct with no picks and no utm', () => {
    assert.equal(params(workDepositUrl({ picks: [] }, STRIPE_WORK)).get('client_reference_id'), 'w-none__direct');
  });

  it('adds {GROUP}WORK as prefilled_promo_code when a code is present', () => {
    const p = params(workDepositUrl({ picks: [], code: 'OSSINGTON' }, STRIPE_WORK));
    assert.equal(p.get('prefilled_promo_code'), 'OSSINGTONWORK');
  });

  it('never strips NETWORK', () => {
    const p = params(workDepositUrl({ picks: [], code: 'NETWORK' }, STRIPE_WORK));
    assert.equal(p.get('prefilled_promo_code'), 'NETWORKWORK');
  });

  it('keeps an existing query on the base link', () => {
    const url = workDepositUrl({ picks: [] }, `${STRIPE_WORK}?locale=en-CA`);
    assert.ok(url?.startsWith(`${STRIPE_WORK}?locale=en-CA&`), url ?? '');
    assert.equal(params(url).get('locale'), 'en-CA');
    assert.equal(params(url).get('client_reference_id'), 'w-none__direct');
  });

  it('keeps client_reference_id within Stripe limits for a long utm', () => {
    const ref = params(workDepositUrl({ picks: PICKS, utmSource: 'x'.repeat(400) }, STRIPE_WORK)).get(
      'client_reference_id'
    );
    assert.ok(ref);
    assert.match(ref, /^[A-Za-z0-9_-]{1,200}$/);
    assert.ok(ref.includes('__'));
  });
});

describe('homeCheckoutUrl', () => {
  it('returns null when the home link is empty', () => {
    assert.equal(homeCheckoutUrl({ picks: [] }, ''), null);
  });

  it('adds {GROUP}HOME and an h- reference', () => {
    const p = params(homeCheckoutUrl({ picks: ['home-meal-plan'], code: 'OSSINGTON', utmSource: 'qr' }, STRIPE_HOME));
    assert.equal(p.get('prefilled_promo_code'), 'OSSINGTONHOME');
    assert.equal(p.get('client_reference_id'), 'h-meal-plan__qr');
  });
});

describe('workshop code → links', () => {
  it('an un-allow-listed code never reaches a link', () => {
    const code = acceptWorkshopCode('FREE', ['OSSINGTON']);
    assert.equal(code, null);
    assert.equal(params(workDepositUrl({ picks: [], code }, STRIPE_WORK)).has('prefilled_promo_code'), false);
    assert.equal(params(fitCallUrl({ picks: [], code }, CAL_FIT)).has('code'), false);
  });

  it('an empty allow-list means no code is ever applied', () => {
    const code = acceptWorkshopCode('OSSINGTON', []);
    assert.equal(params(homeCheckoutUrl({ picks: [], code }, STRIPE_HOME)).has('prefilled_promo_code'), false);
  });
});

describe('picksTitles', () => {
  it('maps ids to human-readable titles, skipping unknown ids', () => {
    assert.equal(picksTitles(['work-customers', 'nope', 'work-invoices']), 'Customer messages, Invoices and bookkeeping');
    assert.equal(picksTitles([]), '');
  });
});

describe('Cal links', () => {
  it('fit call carries readable picks with %20 encoding', () => {
    const url = fitCallUrl({ picks: PICKS }, CAL_FIT);
    assert.ok(url?.includes('picks=Customer%20messages%2C%20Invoices%20and%20bookkeeping%2C%20Lead%20follow-up'), url ?? '');
    assert.equal(params(url).get('picks'), 'Customer messages, Invoices and bookkeeping, Lead follow-up');
  });

  it('fit call carries the group code when present', () => {
    assert.equal(params(fitCallUrl({ picks: [], code: 'OSSINGTON' }, CAL_FIT)).get('code'), 'OSSINGTON');
  });

  it('omits picks and code when there are none', () => {
    assert.equal(fitCallUrl({ picks: [] }, CAL_FIT), CAL_FIT);
  });

  it('returns null for empty Cal links', () => {
    assert.equal(fitCallUrl({ picks: PICKS }, ''), null);
    assert.equal(workSessionUrl({ picks: PICKS }, ''), null);
    assert.equal(homeSessionUrl({ picks: [] }, ''), null);
    assert.equal(fitCallUrl({ picks: PICKS }), null);
    assert.equal(workSessionUrl({ picks: PICKS }), null);
    assert.equal(homeSessionUrl({ picks: [] }), null);
  });

  it('session links carry picks only, never the code', () => {
    const s1 = params(workSessionUrl({ picks: PICKS }, `${CAL_S1}?month=2026-10`));
    assert.equal(s1.get('month'), '2026-10');
    assert.equal(s1.get('picks'), 'Customer messages, Invoices and bookkeeping, Lead follow-up');
    assert.equal(s1.has('code'), false);
    const home = params(homeSessionUrl({ picks: ['home-meal-plan', 'home-bills'] }, CAL_HOME));
    assert.equal(home.get('picks'), 'Meal plan, Bill check');
  });
});

describe('integration: picks and code flow from / to the thanks pages', () => {
  it('picks written by the store are read back by the session-link builder', () => {
    const storage = createMemoryStorage(); // stands in for sessionStorage across routes
    const store = createPicksStore(storage); // the picker on /
    store.toggle('work', 'work-customers');
    store.toggle('work', 'work-invoices');
    store.toggle('work', 'work-leads');
    assert.equal(store.toggle('work', 'work-numbers'), 'max-reached');

    // /thanks/work, after the Stripe round trip: a fresh read from the same storage.
    const url = workSessionUrl({ picks: readPicks(storage, 'work') }, CAL_S1);
    assert.equal(params(url).get('picks'), 'Customer messages, Invoices and bookkeeping, Lead follow-up');
  });

  it('a stored workshop code reaches the deposit and fit-call links', () => {
    const storage = createMemoryStorage();
    const allow = ['OSSINGTON'];
    storeWorkshopCode(storage, 'Oss-ington!', allow);
    const code = readWorkshopCode(storage, allow);
    assert.equal(params(workDepositUrl({ picks: [], code }, STRIPE_WORK)).get('prefilled_promo_code'), 'OSSINGTONWORK');
    assert.equal(params(homeCheckoutUrl({ picks: [], code }, STRIPE_HOME)).get('prefilled_promo_code'), 'OSSINGTONHOME');
    assert.equal(params(fitCallUrl({ picks: [], code }, CAL_FIT)).get('code'), 'OSSINGTON');
  });
});

describe('review fixes: base links and the home path', () => {
  it('replaces a managed key already on the base link instead of duplicating it', () => {
    const url = workDepositUrl(
      { picks: [], code: 'OSSINGTON' },
      `${STRIPE_WORK}?prefilled_promo_code=EARLY&locale=en&client_reference_id=old`
    );
    const p = params(url);
    assert.deepEqual(p.getAll('prefilled_promo_code'), ['OSSINGTONWORK']);
    assert.deepEqual(p.getAll('client_reference_id'), ['w-none__direct']);
    assert.equal(p.get('locale'), 'en');
  });

  it('keeps unrelated params and the hash when replacing', () => {
    assert.equal(appendParams('https://x.test/p?a=1&b=2#h', [['a', '9']]), 'https://x.test/p?b=2&a=9#h');
  });

  it('home picks flow from the store to the session link and the checkout reference', () => {
    const storage = createMemoryStorage();
    const store = createPicksStore(storage);
    for (const id of ['home-meal-plan', 'home-bills', 'home-trip', 'home-inbox', 'home-errands']) store.toggle('home', id);
    assert.equal(store.toggle('home', 'home-scam-guard'), 'max-reached');
    const picks = readPicks(storage, 'home');
    const expected = picks.map((id) => findMenuItem(id)?.title).join(', ');
    assert.equal(params(homeSessionUrl({ picks }, CAL_HOME)).get('picks'), expected);
    assert.equal(
      params(homeCheckoutUrl({ picks, utmSource: 'qr' }, STRIPE_HOME)).get('client_reference_id'),
      'h-meal-plan-bills-trip-inbox-errands__qr'
    );
  });

  it('no menu title contains the ", " picks separator', () => {
    for (const item of menuItems) assert.ok(!item.title.includes(','), item.id);
  });
});
