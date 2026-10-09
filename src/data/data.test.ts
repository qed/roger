import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { siteConfig } from './config.ts';
import { SHARED_FAQ_IDS, faqText, faqs, sharedFaq } from './faqs.ts';
import * as sharedCopy from './copy/shared.ts';
import * as pricingCopyModule from './copy/pricing.ts';
import * as workCopy from './copy/work.ts';
import * as whatYouGetCopyModule from './copy/whatYouGet.ts';
import * as thanksCopy from './copy/thanks.ts';
import * as homeCopy from './copy/home.ts';
import * as workshopsCopy from './copy/workshops.ts';
import * as libraryCopyModule from './copy/library.ts';
import * as legalCopy from './copy/legal.ts';
import { homeFaqs } from './homeFaqs.ts';
import { ctaLabels, ctaNotes, guaranteeCopy, workGuaranteeAnswer } from './copy/shared.ts';
import { pricingCopy } from './copy/pricing.ts';
import { faqAnswer, renderLine } from '../lib/claims.ts';
import { displayedOffer, offerAmounts } from '../lib/offerPrice.ts';
import { isUseCaseCategory, library, useCaseCategories } from './library.ts';
import type { UseCaseCategory } from './library.ts';
import { chiefOfStaff, exampleHref, findMenuItem, helpers, homeJobs, menuItems } from './menu.ts';
import * as offersModule from './offers.ts';
import { offers } from './offers.ts';
import type { OfferAmounts, OfferId } from './offers.ts';
import { signoff } from './signoff.ts';
import type { Signoff } from './signoff.ts';

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
    assert.equal(offers.work.deposit, prices.work);
    assert.equal(offers.home.price, prices.home);
    assert.equal(offers.home.regularPrice, prices.regularHome);
    assert.equal(offers.home.deposit, prices.home);
    for (const offer of Object.values(offers)) assert.equal(offer.currency, prices.currency);
  });

  const founding = { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 5 } };
  const full = { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 0 } };
  const amountsIn = (text: string) => text.match(/\$\d{1,3}(?:,\d{3})*/g) ?? [];

  it('states the full price, paid up front: $2,000 while spots remain and $3,000 once full (spec §3.1)', () => {
    const skipCall = faqs.find((f) => f.id === 'skip-call');
    assert.ok(skipCall);
    const f = offerAmounts('work', founding);
    const r = offerAmounts('work', full);
    assert.deepEqual(amountsIn(workGuaranteeAnswer(f)), ['$2,000', '$2,000']);
    assert.deepEqual(amountsIn(workGuaranteeAnswer(r)), ['$3,000', '$3,000']);
    assert.equal(ctaLabels.depositHero(f.deposit), 'Pay $2,000 & book');
    assert.equal(ctaLabels.depositSkip(r.deposit), 'Skip the call: pay $3,000');
    assert.ok(faqText(skipCall, r).endsWith('you get the full $3,000 back.'));
    assert.ok(ctaNotes.depositFitCheck(r.deposit).endsWith('you get the full $3,000 back.'));
    assert.equal(pricingCopy.work.guarantee(r), 'working within 14 days or a full $3,000 refund.');
    assert.deepEqual(amountsIn(guaranteeCopy.home.body(offerAmounts('home', founding)).join(' ')), ['$500']);
    assert.deepEqual(amountsIn(guaranteeCopy.home.body(offerAmounts('home', full)).join(' ')), ['$750']);
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
      ...[...faqs, ...homeFaqs].map((f) => f.needs),
      ...homeCopy.homeTimelineCopy.steps.map((step) => ('whenNote' in step && typeof step.whenNote === 'object' ? step.whenNote.needs : undefined))
    ].filter((n): n is NonNullable<typeof n> => n !== undefined);
    assert.ok(needs.length > 0);
    for (const n of needs) assert.ok(flags.has(n), n);
  });

  it('keeps every optionalClause an exact substring of its answer', () => {
    for (const faq of [...faqs, ...homeFaqs]) {
      if (faq.optionalClause === undefined) continue;
      assert.equal(typeof faq.a, 'string', faq.id);
      assert.ok(String(faq.a).includes(faq.optionalClause), faq.id);
      if (faq.interpolates) assert.ok(faq.optionalClause.includes(`{${faq.interpolates}}`), faq.id);
    }
  });

  it('interpolates only string siteConfig keys that appear in the answer', () => {
    for (const faq of [...faqs, ...homeFaqs]) {
      if (faq.interpolates === undefined) continue;
      assert.equal(typeof siteConfig[faq.interpolates], 'string', faq.id);
      assert.equal(typeof faq.a, 'string', faq.id);
      assert.ok(String(faq.a).includes(`{${faq.interpolates}}`), faq.id);
    }
  });
});

describe('config invariants', () => {
  const { prices } = siteConfig;

  // Both offers are paid in full up front (owner decision, 2026-10-09): nothing is ever "due later".
  it('charges the full price to book, with no balance, in either state', () => {
    for (const spotsLeft of [5, 0]) {
      const state = { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft } };
      for (const offer of ['work', 'home'] as const) {
        const d = displayedOffer(offer, state);
        assert.equal(d.deposit, d.price, `${offer} @ ${spotsLeft}`);
        assert.equal(d.balance, 0, `${offer} @ ${spotsLeft}`);
      }
    }
  });
});

// Every exported string and function in src/data/copy/*.ts, offers.ts and the FAQs, rendered in both
// founding states. Functions are called with the state's amounts for the module's offer (MODULE_OFFER),
// templates are filled the way the components fill them, and the result must state only that state's
// amounts, of that module's offer, and leave no placeholder, "undefined" or "NaN" behind.
describe('copy sweep, founding and full', () => {
  type State = 'founding' | 'full';
  const { prices } = siteConfig;
  const configs: Record<State, Pick<typeof siteConfig, 'prices' | 'founding'>> = {
    founding: { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 5 } },
    full: { prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 0 } }
  };
  const cad = (n: number) => `$${n.toLocaleString('en-CA')}`;
  const amountsIn = (text: string) => text.match(/\$\d[\d,]*\d|\$\d/g) ?? [];

  // The amounts a visitor can see in each state: work price + deposit (= balance), home price, and the
  // "about $X a month" figures. Nothing else; in particular no "$0" and nothing from the other state.
  const STAT_PATH = 'home.homeMealPlanCopy.timeMath.statValue';

  const allowedIn = (state: State, only?: OfferId) => {
    const set = new Set<string>();
    for (const offer of only ? [only] : (['work', 'home'] as const)) {
      const d = displayedOffer(offer, configs[state]);
      [d.price, d.deposit, d.monthly].forEach((n) => set.add(cad(n)));
      if (d.balance > 0) set.add(cad(d.balance));
    }
    return set;
  };

  it('allows exactly the spec amounts in each state', () => {
    assert.deepEqual([...allowedIn('founding')].sort(), ['$167', '$2,000', '$42', '$500'].sort());
    assert.deepEqual([...allowedIn('full')].sort(), ['$250', '$3,000', '$63', '$750'].sort());
    assert.deepEqual([...allowedIn('founding', 'home')].sort(), ['$42', '$500']);
    assert.deepEqual([...allowedIn('full', 'work')].sort(), ['$250', '$3,000']);
  });

  type Found = { path: string; text: string; needs?: string };

  // Which offer's amounts each swept module may state. A module that renders on one page only is strict:
  // home copy may state only home amounts, work copy only work amounts. Modules holding copy for both
  // pages (or cross-offer lines, like the work card's "Home setup, $500 →") may state either. A module
  // on a page that sells neither offer directly ('none': /workshops) may state no amount at all.
  type Scope = OfferId | 'both' | 'none';
  const MODULE_OFFER: Record<string, Scope> = {
    shared: 'both',
    pricing: 'both',
    whatYouGet: 'both',
    thanks: 'both',
    offers: 'both',
    work: 'work',
    faqs: 'work',
    home: 'home',
    homeFaqs: 'home',
    workshops: 'none',
    library: 'none',
    legal: 'none'
  };
  const scopeOf = (path: string): Scope => {
    const scope = MODULE_OFFER[path.split('.')[0]];
    assert.ok(scope, `no MODULE_OFFER entry for ${path}`);
    return scope;
  };
  // The amounts a function is called with: the module's offer, or for a two-offer module the offer its
  // path names (pricingCopy.home.*, homeCheckoutLabels, guaranteeCopy.home, ...).
  // null for a 'none' module: it has no offer, so nothing there may be filled with (or state) an amount.
  const offerFor = (path: string): OfferId | null => {
    const scope = scopeOf(path);
    if (scope === 'none') return null;
    return scope === 'both' ? (/home/i.test(path) ? 'home' : 'work') : scope;
  };

  // Arguments that aren't amounts.
  const SPECIAL_ARGS: Record<string, unknown[]> = {
    'shared.formCopy.submitError': ['peter@example.ca'],
    'shared.workshopBannerCopy.text': ['OSSINGTONWORK'],
    'shared.ctaA11yCopy.disabledPrefix': ['Book a fit call'],
    'shared.foundingCopy.spotsLeft': [5, 10],
    'shared.foundingCopy.badge': ['5 of 10 founding spots left'],
    'shared.phoneMockupCopy.label': ['Your Chief of Staff', 'Monday 6:48 AM', 'work'],
    'thanks.bookingFallbackCopy.mailtoSubject': ['work', 'home'],
    'library.libraryCopy.count': [12, 33],
    'workshops.workshopFormCopy.closedNote': ['peter@example.ca'],
    'legal.privacyCopy.sections': [{ enabled: true, provider: 'plausible' }]
  };

  // A string (so `${x}` reads as an amount) that also carries the OfferAmounts fields.
  const amountArg = (path: string, state: State) => {
    const offer = offerFor(path);
    assert.ok(offer, `${path}: a function in a module that states no amounts needs a SPECIAL_ARGS entry`);
    const a: OfferAmounts = offerAmounts(offer, configs[state]);
    const d = displayedOffer(offer, configs[state]);
    const value = /priceNote/.test(path) ? cad(d.monthly) : /deposit/i.test(path) ? a.deposit : a.price;
    return Object.assign(new String(value), a);
  };

  const collect = (value: unknown, path: string, state: State, out: Found[], needs?: string): void => {
    if (typeof value === 'string') {
      out.push({ path, text: value, needs });
    } else if (typeof value === 'function') {
      const fn = value as (...args: unknown[]) => unknown;
      const args = SPECIAL_ARGS[path] ?? Array.from({ length: Math.max(fn.length, 1) }, () => amountArg(path, state));
      collect(fn(...args), `${path}()`, state, out, needs);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => collect(v, `${path}[${i}]`, state, out, needs));
    } else if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const lineNeeds = typeof obj.needs === 'string' ? obj.needs : needs;
      for (const [k, v] of Object.entries(obj)) collect(v, `${path}.${k}`, state, out, lineNeeds);
    }
  };

  const offerOrFail = (path: string): OfferId => {
    const offer = offerFor(path);
    assert.ok(offer, `${path}: {price} in a module that states no amounts`);
    return offer;
  };

  const TEMPLATE_VALUES: Record<string, string> = {
    max: '3',
    n: '2',
    h: '3',
    weeks: '14',
    hourly: 'HOURLY',
    annual: 'ANNUAL',
    providerCostRange: 'RANGE',
    taxNote: 'Prices in CAD.'
  };
  const fill = (f: Found, state: State) =>
    f.text.replace(/\{(\w+)\}/g, (m, key: string) =>
      key === 'price' ? offerAmounts(offerOrFail(f.path), configs[state]).price : TEMPLATE_VALUES[key] ?? m
    );

  // Shown only while founding spots remain: the future-price lines, the founding bonus and the spots badge.
  const foundingOnly = (f: Found) =>
    /futurePrice/.test(f.path) || f.needs === 'foundingPerkConfirmed' || /foundingCopy\.(spotsLeft|badge)/.test(f.path);
  // Shown only once they're full.
  const fullOnly = (f: Found) => /foundingCopy\.full/.test(f.path);

  const allOn = Object.fromEntries(
    Object.entries(signoff).map(([k, v]) => [k, typeof v === 'boolean' ? true : v])
  ) as Signoff;

  const render = (state: State): Found[] => {
    const out: Found[] = [];
    const modules = {
      shared: sharedCopy,
      pricing: pricingCopyModule,
      work: workCopy,
      whatYouGet: whatYouGetCopyModule,
      thanks: thanksCopy,
      home: homeCopy,
      offers: offersModule,
      workshops: workshopsCopy,
      library: libraryCopyModule,
      legal: legalCopy
    };
    for (const [name, mod] of Object.entries(modules)) collect({ ...mod }, name, state, out);
    for (const [name, list, offer] of [
      ['faqs', faqs, 'work'],
      ['homeFaqs', homeFaqs, 'home']
    ] as const) {
      const amounts = offerAmounts(offer, configs[state]);
      for (const values of [
        { providerCostRange: '', taxNote: '' },
        { providerCostRange: 'RANGE', taxNote: 'Prices in CAD.' }
      ]) {
        for (const faq of list) {
          const text = faqAnswer(faq, { amounts, values, signoff: allOn });
          if (text !== null) out.push({ path: `${name}.${faq.id}`, text });
        }
      }
    }
    return out
      .filter((f) => (state === 'founding' ? !fullOnly(f) : !foundingOnly(f)))
      .map((f) => ({ ...f, text: fill(f, state) }));
  };

  for (const state of ['founding', 'full'] as const) {
    it(`states only ${state}-state amounts of its own offer, with nothing unresolved (${state})`, () => {
      const rendered = render(state);
      assert.ok(rendered.length > 150, `swept only ${rendered.length} strings`);
      let amounts = 0;
      for (const f of rendered) {
        for (const bad of ['{', '}', 'undefined', 'NaN', '[object']) assert.ok(!f.text.includes(bad), `${f.path}: "${f.text}"`);
        const scope = scopeOf(f.path);
        const allowed = scope === 'none' ? new Set<string>() : allowedIn(state, scope === 'both' ? undefined : scope);
        for (const amount of amountsIn(f.text)) {
          amounts++;
          // A future-price line names its own offer's regular price; that line shows only while founding.
          // The one non-price figure: the sourced food-waste statistic on /home (spec §6A.5).
          const regular = offerFor(f.path) === 'home' ? prices.regularHome : prices.regularWork;
          const ok =
            allowed.has(amount) ||
            (f.path === STAT_PATH && amount === '$1,300') ||
            (state === 'founding' && foundingOnly(f) && /futurePrice/.test(f.path) && amount === cad(regular));
          assert.ok(ok, `${state}: ${amount} not allowed at ${f.path}: "${f.text}"`);
        }
      }
      assert.ok(amounts > 20, `only ${amounts} amounts seen`);
    });
  }

  it('says nothing about founding spots or the tune-up once they are full, except the full-state badge', () => {
    for (const f of render('full')) {
      if (fullOnly(f)) continue;
      assert.doesNotMatch(f.text, /founding|tune-up/i, `${f.path}: "${f.text}"`);
    }
  });

  it('reaches every copy file, including copy/work.ts and both offers of whatYouGet', () => {
    const paths = render('full').map((f) => f.path);
    for (const prefix of [
      'shared.',
      'pricing.pricingCopy.home.',
      'work.workHeroCopy.',
      'work.workMeta.description()',
      'work.workTimelineCopy.',
      'whatYouGet.whatYouGetCopy.work.summary()',
      'whatYouGet.whatYouGetCopy.home.summary()',
      'offers.offers.home.payment()',
      'faqs.skip-call',
      'thanks.thanksWorkCopy.',
      'thanks.thanksHomeCopy.timing.',
      'thanks.notFoundCopy.',
      'home.homeMeta.description()',
      'home.homeHeroCopy.',
      'home.homeTimelineCopy.steps',
      'home.homeMealPlanCopy.timeMath.statValue',
      'home.homeSteps',
      'homeFaqs.home-allergies',
      'homeFaqs.home-cost-after',
      'workshops.workshopsHeroCopy.',
      'workshops.workshopsMembersGetCopy.',
      'workshops.workshopFormCopy.closedNote()',
      'legal.refundsCopy.definition',
      'legal.privacyCopy.sections()'
    ]) {
      assert.ok(paths.some((p) => p.startsWith(prefix)), prefix);
    }
  });
});

// Post-payment pages (spec §9.2, §9.4): they follow a payment, so they never restate an amount, and the
// home timing line only promises "3 business days" once signed off.
describe('thanks copy', () => {
  it('states no amounts', () => {
    const text = JSON.stringify(thanksCopy);
    assert.doesNotMatch(text, /\$\d/);
  });

  it('gates the home session timing, with the spec fallback', () => {
    const line = thanksCopy.thanksHomeCopy.timing;
    assert.equal(line.needs, 'homeSessionLeadConfirmed');
    assert.equal(renderLine(line, { ...signoff, homeSessionLeadConfirmed: false }), 'Pick a time that suits you.');
    assert.match(renderLine(line, { ...signoff, homeSessionLeadConfirmed: true }) ?? '', /3 business days/);
  });

  it('lists the spec §9.2 checklist and links NotFound to /, /home and /library', () => {
    const work = thanksCopy.thanksWorkCopy.checklist.join(' ');
    for (const item of [/admin access to your email and calendar/i, /list of your tools/i, /join Session 2/i]) assert.match(work, item);
    assert.deepEqual(thanksCopy.notFoundCopy.links.map((l) => l.to), ['/', '/home', '/library']);
  });
});

// /home copy (spec §6A, R7).
describe('home copy', () => {
  const founding = { prices: siteConfig.prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 5 } };
  const full = { prices: siteConfig.prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 0 } };

  // Pins the owner-approved "we" voice (2026-10-08), which replaced the spec's first-person subhead.
  it('keeps the spec §6A.1 headline and the approved subhead', () => {
    assert.equal(homeCopy.homeHeroCopy.headline, 'Get your Sundays back.');
    assert.equal(
      homeCopy.homeHeroCopy.subhead,
      "We'll set you up with your first AI assistant, on your own account, doing 5 jobs you hate: the meal plan, the school emails, the bills. Live the same day."
    );
    assert.equal(homeCopy.homeMeta.title, 'Roger at home: your first AI assistant, set up for you · Toronto');
  });

  it('states the displayed home price in the meta description and hero CTA', () => {
    assert.match(homeCopy.homeMeta.description(offerAmounts('home', founding).price), /\$500 CAD/);
    assert.match(homeCopy.homeMeta.description(offerAmounts('home', full).price), /\$750 CAD/);
    assert.equal(sharedCopy.homeCheckoutLabels.long(offerAmounts('home', founding).price), 'Pay $500 & book your session');
    assert.equal(sharedCopy.homeCheckoutLabels.long(offerAmounts('home', full).price), 'Pay $750 & book your session');
  });

  it('has the four spec §6A.2 rows', () => {
    assert.equal(homeCopy.homeBeforeAfterCopy.label, 'An example Sunday');
    assert.deepEqual(
      homeCopy.homeBeforeAfterCopy.rows.map((r) => r.before),
      [
        '"What\'s for dinner?" asked all week',
        'A school email you missed the form in',
        'A Sunday afternoon at the grocery store',
        'A subscription you forgot to cancel'
      ]
    );
  });

  it('gates the session lead time with the spec fallback', () => {
    const notes = homeCopy.homeTimelineCopy.steps.flatMap((step) =>
      'whenNote' in step && typeof step.whenNote === 'object' ? [step.whenNote] : []
    );
    assert.equal(notes.length, 1);
    assert.equal(notes[0].needs, 'homeSessionLeadConfirmed');
    assert.equal(notes[0].fallback, 'Pick a time that suits you');
    assert.match(notes[0].text, /within 3 business days/);
    // No other part of the timeline promises the lead time ungated.
    const ungated = JSON.stringify(homeCopy.homeTimelineCopy.steps.map((step) => ({ ...step, whenNote: undefined })));
    assert.doesNotMatch(ungated, /business days/);
  });

  it('keeps the meal-plan facts and never says "Roger does X" (spec §1)', () => {
    const text = JSON.stringify({ homeCopy });
    assert.doesNotMatch(text, /Roger (shops|plans|does|builds|sends|books)/);
    assert.equal(homeCopy.homeSteps.length, 4);
    assert.equal(homeCopy.homeMealPlanCopy.timeMath.before, '2–3 hours');
    assert.equal(homeCopy.homeMealPlanCopy.timeMath.after, '10 minutes');
    assert.equal(homeCopy.homeMealPlanCopy.timeMath.source, 'Source: National Zero Waste Council, 2022');
  });

  it('has the R7 home FAQ items plus ownership and cost, with unique ids', () => {
    const ids = homeFaqs.map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ['home-allergies', 'home-grocery-account', 'home-partner', 'own-it', 'home-cost-after']) {
      assert.ok(ids.includes(id), id);
    }
    const amounts = offerAmounts('home', founding);
    // Home answers don't mention a fit call (there isn't one on /home) or state an amount.
    for (const faq of homeFaqs) assert.doesNotMatch(faqText(faq, amounts), /fit call|\$\d/i, faq.id);
  });

  it('reuses the shared work answers by typed id', () => {
    for (const id of SHARED_FAQ_IDS) assert.deepEqual(faqs.find((f) => f.id === id), sharedFaq(id), id);
    assert.deepEqual(homeFaqs.find((f) => f.id === 'own-it'), sharedFaq('own-it'));
  });

  it('answers the cost question without the work care-plan sentence, dropping the range when unset', () => {
    const cost = homeFaqs.find((f) => f.id === 'home-cost-after');
    assert.ok(cost);
    const amounts = offerAmounts('home', founding);
    const withRange = faqAnswer(cost, { amounts, values: { providerCostRange: '$25–$30', taxNote: '' } });
    const without = faqAnswer(cost, { amounts, values: { providerCostRange: '', taxNote: '' } });
    assert.equal(withRange, "Your assistant's own subscription, paid directly to the provider (usually $25–$30/month).");
    assert.equal(without, "Your assistant's own subscription, paid directly to the provider.");
    for (const text of [withRange, without]) assert.doesNotMatch(text ?? '', /care plan/i);
  });

  it('leads the allergy answer with the disclaimer and keeps "check the labels"', () => {
    const answer = faqText(homeFaqs.find((f) => f.id === 'home-allergies') ?? { a: '' }, offerAmounts('home', founding));
    assert.match(answer, /^We can't guarantee allergy safety\./);
    assert.match(answer, /still check the labels yourself/);
    assert.match(answer, /take that list into account/);
    assert.doesNotMatch(answer, /work from that list/);
  });

  // Spec §12: every number on /home is a price, a time commitment, the cited food-waste stat, or an
  // illustration labelled "example". Each digit-bearing phrase in the home copy must match one of these
  // rules, scoped to the paths where it's allowed; anything left over (like an invented "150 hours a
  // year") fails until it's sourced and added here on purpose.
  it('states no number outside the §12 allow-list', () => {
    type Rule = { path: RegExp; phrase: RegExp; why: string };
    const escape = (s: string) => s.replace(/[$,+.]/g, '\\$&');
    const homePrices = [...new Set([founding, full].map((c) => offerAmounts('home', c).price))].map(escape);
    const RULES: Rule[] = [
      { path: /^home\.homeMeta\.description\(\)$/, phrase: new RegExp(`(${homePrices.join('|')}) CAD`), why: 'the displayed home price' },
      // Offer terms and time commitments (spec §3.2, §6A.6).
      { path: /./, phrase: /\b5 jobs\b|\b12 jobs\b|\b60-minute\b/, why: 'what the home setup includes' },
      { path: /^home\.homeTimelineCopy\./, phrase: /\bDay (0|7|14)\b|\b3 business days\b|\b30 days\b/, why: 'timeline commitments' },
      // The meal-plan time math (spec §6A.5).
      { path: /^home\.homeMealPlanCopy\.timeMath\.before$/, phrase: /^2–3 hours$/, why: 'time math' },
      { path: /^home\.homeMealPlanCopy\.timeMath\.after$/, phrase: /^10 minutes$/, why: 'time math' },
      // The cited food-waste statistic and its source year.
      { path: /^home\.homeMealPlanCopy\.timeMath\.statValue$/, phrase: /^\$1,300\+$/, why: 'cited stat' },
      { path: /^home\.homeMealPlanCopy\.timeMath\.source$/, phrase: /\b2022\b/, why: 'cited stat source' },
      // Illustrations labelled "example": the "An example Sunday" strip, the "Featured example" meal-plan
      // steps, and the phone mockup (badged "Example").
      { path: /^home\.homeBeforeAfterCopy\.rows\[\d+\]\.after$/, phrase: /\b5 minutes\b/, why: 'example Sunday' },
      {
        path: /^home\.homeSteps\[\d+\]\./,
        phrase: /\b15 (ideas|dinners)\b|\bAbout 5 minutes\b|\b5–7\b|\b20-minute\b/,
        why: 'featured example'
      },
      { path: /^home\.homeHeroCopy\.phone\.time$/, phrase: /\b8:12 AM\b/, why: 'example phone' }
    ];
    assert.equal(homeCopy.homeBeforeAfterCopy.label, 'An example Sunday');
    assert.equal(homeCopy.homeMealPlanCopy.label, 'Featured example');

    const found: { path: string; text: string }[] = [];
    const walk = (v: unknown, path: string): void => {
      if (typeof v === 'string') found.push({ path, text: v });
      else if (typeof v === 'function') {
        for (const c of [founding, full]) walk((v as (p: string) => unknown)(offerAmounts('home', c).price), `${path}()`);
      } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
    };
    walk({ ...homeCopy }, 'home');
    const amounts = offerAmounts('home', founding);
    for (const faq of homeFaqs) {
      found.push({ path: `homeFaqs.${faq.id}.q`, text: faq.q });
      const text = faqAnswer(faq, { amounts, values: { providerCostRange: '', taxNote: '' }, signoff });
      if (text) found.push({ path: `homeFaqs.${faq.id}`, text });
    }
    assert.ok(found.length > 40, `walked only ${found.length} strings`);
    let numbered = 0;
    for (const { path, text } of found) {
      if (!/\d/.test(text)) continue;
      numbered++;
      let rest = text;
      for (const rule of RULES) {
        if (rule.path.test(path)) rest = rest.replace(new RegExp(rule.phrase.source, 'g'), '');
      }
      assert.doesNotMatch(rest, /\d/, `${path}: number outside the §12 allow-list in "${text}"`);
    }
    assert.ok(numbered >= 15, `only ${numbered} digit-bearing strings seen`);
  });
});

// /workshops copy (spec §6B, §3.3). No amounts at all (the copy sweep above enforces that), and every
// number is one the spec states: the 60/90-minute formats, 10–40 people, the 14-day member discount, the
// 1-business-day reply, and the form's 1–500 size bound.
describe('workshops copy', () => {
  // Pins the owner-approved "we" voice (2026-10-08) for the subhead and success line; the rest is spec text.
  it('uses the spec title and hero, with the approved subhead and success line', () => {
    assert.equal(workshopsCopy.workshopsMeta.title, 'Free AI assistant workshop for your members · Roger');
    assert.equal(workshopsCopy.workshopsHeroCopy.headline, 'Give your members a free, live AI assistant workshop.');
    assert.equal(
      workshopsCopy.workshopsHeroCopy.subhead,
      'In 60 minutes we set up a real AI assistant live, start to finish, and show your members what it can take off their plate. Free for BIAs, associations and school communities.'
    );
    assert.equal(workshopsCopy.workshopsHeroCopy.cta, 'Request a date');
    assert.equal(workshopsCopy.workshopsHostPackCopy.link, 'Download the one-page host pack (PDF)');
    assert.equal(workshopsCopy.workshopFormCopy.success, "Thanks. We'll reply within 1 business day to find a date.");
  });

  it('states no number outside the §6B allow-list', () => {
    type Rule = { path: RegExp; phrase: RegExp };
    const RULES: Rule[] = [
      { path: /^workshops\.(workshopsMeta|workshopsHeroCopy)\./, phrase: /\b60 minutes\b/ },
      { path: /^workshops\.workshopsFormatsCopy\./, phrase: /^60 or 90 min$/ },
      { path: /^workshops\.workshopsProvideCopy\./, phrase: /\b10–40 people\b/ },
      { path: /^workshops\.workshopsMembersGetCopy\./, phrase: /\b14-day\b/ },
      { path: /^workshops\.workshopFormCopy\.success$/, phrase: /\b1 business day\b/ },
      { path: /^workshops\.workshopFormCopy\.errors\.size$/, phrase: /\bfrom 1 to 500\b/ },
      // The form's length caps (WORKSHOP_MAX_LENGTH; workshopForm.test.ts keeps them in step).
      { path: /^workshops\.workshopFormCopy\.errors\.tooLong\./, phrase: /\b(120|254|2,000) characters\b/ }
    ];
    const found: { path: string; text: string }[] = [];
    const walk = (v: unknown, path: string): void => {
      if (typeof v === 'string') found.push({ path, text: v });
      else if (typeof v === 'function') {
        for (const arg of ['', 'peter@example.ca']) walk((v as (a: string) => unknown)(arg), `${path}()`);
      } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
    };
    walk({ ...workshopsCopy }, 'workshops');
    assert.ok(found.length > 40, `walked only ${found.length} strings`);
    let numbered = 0;
    const used = new Set<Rule>();
    for (const { path, text } of found) {
      if (!/\d/.test(text)) continue;
      numbered++;
      let rest = text;
      for (const rule of RULES) {
        if (!rule.path.test(path)) continue;
        const next = rest.replace(new RegExp(rule.phrase.source, 'g'), '');
        if (next !== rest) used.add(rule);
        rest = next;
      }
      assert.doesNotMatch(rest, /\d|\$/, `${path}: number outside the §6B allow-list in "${text}"`);
    }
    // A rule that never matches is stale (its copy moved or changed); drop or fix it.
    for (const rule of RULES) assert.ok(used.has(rule), `unused §6B rule ${rule.path} ${rule.phrase}`);
    assert.ok(numbered >= 6, `only ${numbered} digit-bearing strings seen`);
  });
});

describe('library copy (spec §7.3)', () => {
  // The card link pins the owner-approved "we" voice (2026-10-08); the rest is spec text verbatim.
  it('keeps the spec header, subhead, card links and honest-miss tag', () => {
    assert.equal(libraryCopyModule.libraryCopy.heading, 'Real-world AI assistant use cases.');
    assert.equal(libraryCopyModule.libraryCopy.subhead, 'Collected weekly from public posts. Not Roger clients. Each one links to the original.');
    assert.equal(libraryCopyModule.libraryCopy.readOriginal, 'Read the original ↗');
    assert.equal(libraryCopyModule.libraryCopy.setUp, 'We can set this up for you →');
    assert.equal(libraryCopyModule.libraryCopy.honestMiss, "Didn't go as planned.");
    assert.equal(libraryCopyModule.libraryMeta.title, 'Real AI assistant use cases · Roger');
  });

  it('labels every category, and states no amount of its own', () => {
    for (const c of useCaseCategories) assert.ok(libraryCopyModule.categoryLabels[c], c);
    const text = JSON.stringify(libraryCopyModule.libraryCopy) + libraryCopyModule.libraryCopy.count(12, 33);
    assert.doesNotMatch(text, /\$\d/);
  });
});

// Legal pages (spec §6.12, §3.5). /refunds is §3.5 in the owner-approved "we" voice (2026-10-08); the drafts state no prices, and the only
// numbers anywhere are §3.5's time commitments.
describe('legal copy', () => {
  it('renders spec §3.5 on /refunds, with the claim line split around the address', () => {
    const r = legalCopy.refundsCopy;
    assert.deepEqual(r.definition, [
      offersModule.workingDefinition.working,
      offersModule.workingDefinition.checked,
      offersModule.workingDefinition.disagree,
      offersModule.workingDefinition.windows
    ]);
    assert.deepEqual(r.after, [offersModule.workingDefinition.accounts]);
    assert.equal(`${r.claimLine.lead}contactEmail${r.claimLine.rest}`, offersModule.workingDefinition.claim);
    assert.equal(r.claimLine.lead, 'Claim: one email to ');
    assert.equal(offersModule.workingDefinition.disagree, 'If we disagree, you decide.');
    assert.equal(offersModule.workingDefinition.accounts, 'When a refund happens, you keep your accounts. We remove our access.');
  });

  it('describes analytics as off or on, by provider', () => {
    const line = (enabled: boolean, provider: 'plausible' | 'ga4') =>
      legalCopy.privacyCopy.sections({ enabled, provider }).find((s) => s.heading === 'Analytics')?.paragraphs.join(' ') ?? '';
    assert.match(line(false, 'plausible'), /doesn't run analytics/);
    assert.match(line(true, 'plausible'), /Plausible/);
    assert.match(line(true, 'ga4'), /Google Analytics/);
  });

  it('states no amount and no number outside the §3.5 time commitments', () => {
    const RULES = [/\b14 days\b/, /\b10 business days\b/, /\bSession 1\b/, /\bday 7\b/];
    const found: { path: string; text: string }[] = [];
    const walk = (v: unknown, path: string): void => {
      if (typeof v === 'string') found.push({ path, text: v });
      else if (typeof v === 'function') {
        for (const enabled of [true, false]) {
          for (const provider of ['plausible', 'ga4'] as const) walk((v as (a: unknown) => unknown)({ enabled, provider }), `${path}()`);
        }
      } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
    };
    walk({ ...legalCopy }, 'legal');
    assert.ok(found.length > 40, `walked only ${found.length} strings`);
    let numbered = 0;
    for (const { path, text } of found) {
      assert.doesNotMatch(text, /\$/, `${path}: amount in legal copy "${text}"`);
      if (!/\d/.test(text)) continue;
      numbered++;
      const rest = RULES.reduce((t, rule) => t.replace(new RegExp(rule.source, 'g'), ''), text);
      assert.doesNotMatch(rest, /\d/, `${path}: number outside §3.5 in "${text}"`);
    }
    assert.ok(numbered >= 3, `only ${numbered} digit-bearing strings seen`);
  });
});

describe('refunds claim placeholder (review)', () => {
  it('the §3.5 claim line holds exactly one contactEmail placeholder for LegalPage to split on', () => {
    assert.equal(offersModule.workingDefinition.claim.split('contactEmail').length, 2);
  });
});
