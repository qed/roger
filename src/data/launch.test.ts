import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { caseStudies } from './caseStudies.ts';
import type { CaseStudy } from './caseStudies.ts';
import { siteConfig } from './config.ts';
import type { SiteConfig } from './config.ts';
import { evaluateLaunch, formatBanner, formatSummary, groupLaunchItems, launchChecklist } from './launch.ts';
import type { LaunchCtx } from './launch.ts';
import { signoff } from './signoff.ts';

const noFiles = () => false;
const allFiles = () => true;

function ctx(overrides: Partial<LaunchCtx> = {}): LaunchCtx {
  return { config: siteConfig, signoff, caseStudies, assetExists: noFiles, ...overrides };
}

function config(patch: (c: SiteConfig) => void): SiteConfig {
  const c = structuredClone(siteConfig);
  patch(c);
  return c;
}

function study(id: string, kind: 'work' | 'home', extra: Partial<CaseStudy> = {}): CaseStudy {
  return {
    id,
    name: 'A Person',
    role: 'Owner',
    business: 'A Business',
    businessType: 'Café',
    for: kind,
    before: 'Before.',
    setUp: ['work-customers'],
    metrics: [{ label: 'Reply time', before: '2 days', after: '2 hours' }],
    quote: 'Quote.',
    permission: true,
    date: '2026-10-01',
    ...extra
  };
}

const done = (c: LaunchCtx, id: string) => {
  const item = evaluateLaunch(c).items.find((i) => i.id === id);
  assert.ok(item, id);
  return item.done;
};

describe('launch checklist shape (spec §8.4.2)', () => {
  it('has unique ids and the exact blocking set from the spec', () => {
    const ids = launchChecklist.map((i) => i.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.deepEqual(
      launchChecklist.filter((i) => i.blocking).map((i) => i.id),
      [
        'contact-email', 'domain', 'founder-name', 'founder-photo', 'stripe-deposit', 'stripe-home', 'cal-fit',
        'cal-session1', 'cal-home', 'form-workshop', 'form-newsletter', 'provider-cost', 'case-studies',
        'workshops-booked', 'legal', 'hst', 'no-referral', 'passwords', 'future-price', 'bio'
      ]
    );
  });

  it('marks endorsements, videos and reviews as optional and never blocking', () => {
    const optional = launchChecklist.filter((i) => i.optional);
    assert.deepEqual(optional.map((i) => i.id), ['endorsements', 'videos', 'reviews']);
    assert.ok(optional.every((i) => !i.blocking));
  });
});

describe('evaluateLaunch with today’s empty config', () => {
  const result = evaluateLaunch(ctx());

  it('has every blocking item undone', () => {
    assert.equal(result.blockingMissing.length, 20);
  });

  it('counts only non-optional items in the total', () => {
    assert.equal(result.total, launchChecklist.filter((i) => !i.optional).length);
    assert.equal(result.done, 0);
  });

  it('formats the summary line like the spec', () => {
    assert.equal(formatSummary(result), `Launch check: 0/${result.total} done · 20 blocking`);
  });
});

describe('individual checks', () => {
  it('founder name needs a first and last name', () => {
    assert.equal(done(ctx({ config: config((c) => (c.founder.name = 'Peter')) }), 'founder-name'), false);
    assert.equal(done(ctx({ config: config((c) => (c.founder.name = 'Peter Kuperman')) }), 'founder-name'), true);
  });

  it('founder photo needs the config path set and the file present', () => {
    const withPath = config((c) => (c.founder.photo = '/peter.jpg'));
    assert.equal(done(ctx({ config: withPath }), 'founder-photo'), false);
    assert.equal(done(ctx({ config: withPath, assetExists: allFiles }), 'founder-photo'), true);
    assert.equal(done(ctx({ assetExists: allFiles }), 'founder-photo'), false);
  });

  it('contact email must be valid', () => {
    assert.equal(done(ctx({ config: config((c) => (c.contactEmail = 'nope')) }), 'contact-email'), false);
    assert.equal(done(ctx({ config: config((c) => (c.contactEmail = 'peter@meetroger.ca')) }), 'contact-email'), true);
  });

  it('Stripe links must be buy.stripe.com Payment Links', () => {
    assert.equal(done(ctx({ config: config((c) => (c.stripe.workDeposit = 'https://example.com/pay')) }), 'stripe-deposit'), false);
    assert.equal(done(ctx({ config: config((c) => (c.stripe.workDeposit = 'https://buy.stripe.com/abc')) }), 'stripe-deposit'), true);
    assert.equal(done(ctx({ config: config((c) => (c.stripe.homeCheckout = 'https://buy.stripe.com/xyz')) }), 'stripe-home'), true);
  });

  it('case studies need ≥3 permissioned entries with a metric, ≥2 of them work', () => {
    const three = [study('a', 'work'), study('b', 'work'), study('c', 'home')];
    assert.equal(done(ctx({ caseStudies: three }), 'case-studies'), true);
    assert.equal(done(ctx({ caseStudies: [study('a', 'work'), study('b', 'home'), study('c', 'home')] }), 'case-studies'), false);
    assert.equal(
      done(ctx({ caseStudies: [study('a', 'work'), study('b', 'work'), study('c', 'home', { metrics: [] })] }), 'case-studies'),
      false
    );
  });

  it('workshops booked needs at least 2', () => {
    assert.equal(done(ctx({ signoff: { ...signoff, workshopsBooked: 1 } }), 'workshops-booked'), false);
    assert.equal(done(ctx({ signoff: { ...signoff, workshopsBooked: 2 } }), 'workshops-booked'), true);
  });

  it('screenshots need three entries whose files all exist', () => {
    const shots = config((c) => {
      c.proof.screenshots = [1, 2, 3].map((n) => ({ src: `/fitz-${n}.png`, caption: 'x' }));
    });
    assert.equal(done(ctx({ config: shots }), 'screenshots'), false);
    assert.equal(done(ctx({ config: shots, assetExists: allFiles }), 'screenshots'), true);
  });

  it('anchor needs a rate and a source', () => {
    assert.equal(done(ctx({ config: config((c) => (c.anchor = { adminHourly: 30, source: '' })) }), 'anchor'), false);
    assert.equal(done(ctx({ config: config((c) => (c.anchor = { adminHourly: 30, source: 'StatCan' })) }), 'anchor'), true);
  });
});

describe('a fully prepared launch', () => {
  it('has no blocking items missing', () => {
    const ready = config((c) => {
      c.contactEmail = 'peter@meetroger.ca';
      c.domain = 'https://meetroger.ai';
      c.founder.name = 'Peter Kuperman';
      c.founder.photo = '/peter.jpg';
      c.stripe.workDeposit = 'https://buy.stripe.com/a';
      c.stripe.homeCheckout = 'https://buy.stripe.com/b';
      c.cal.fitCall = 'https://cal.com/p/fit';
      c.cal.workSession1 = 'https://cal.com/p/s1';
      c.cal.homeSession = 'https://cal.com/p/home';
      c.forms.workshopEndpoint = 'https://formspree.io/f/a';
      c.forms.newsletterEndpoint = 'https://formspree.io/f/b';
      c.providerCostRange = '$20–$40';
    });
    const allSigned = {
      ...signoff,
      legalReviewed: true,
      hstConfirmed: true,
      noReferralFees: true,
      passwordPolicy: true,
      futurePriceCommitted: true,
      bioApproved: true,
      workshopsBooked: 2
    };
    const result = evaluateLaunch({
      config: ready,
      signoff: allSigned,
      caseStudies: [study('a', 'work'), study('b', 'work'), study('c', 'home')],
      assetExists: allFiles
    });
    assert.deepEqual(result.blockingMissing, []);
  });
});

describe('validators reject placeholders and look-alikes (review)', () => {
  const check = (patch: (c: SiteConfig) => void, id: string) => done(ctx({ config: config(patch) }), id);

  it('email: no mailto:, no placeholder, no spaces', () => {
    for (const bad of ['mailto:a@b.co', 'you@example.com', 'a b@c.ca', 'a@b', 'a@b.c']) {
      assert.equal(check((c) => (c.contactEmail = bad), 'contact-email'), false, bad);
    }
    assert.equal(check((c) => (c.contactEmail = ' peter@meetroger.ca '), 'contact-email'), true);
  });

  it('Stripe: live Payment Links only', () => {
    for (const bad of ['https://buy.stripe.com/', 'https://buy.stripe.com/test_abc', 'buy.stripe.com/abc', 'https://buy.stripe.com/a b']) {
      assert.equal(check((c) => (c.stripe.workDeposit = bad), 'stripe-deposit'), false, bad);
    }
  });

  it('Cal links, form endpoints and domain must be real https URLs', () => {
    for (const bad of ['TODO', '   ', 'cal.com/peter', 'http://cal.com/peter', 'https://example.com/x', 'https://localhost/x']) {
      assert.equal(check((c) => (c.cal.fitCall = bad), 'cal-fit'), false, bad);
      assert.equal(check((c) => (c.forms.workshopEndpoint = bad), 'form-workshop'), false, bad);
      assert.equal(check((c) => (c.domain = bad), 'domain'), false, bad);
    }
    assert.equal(check((c) => (c.cal.fitCall = 'https://cal.com/peter/fit-call'), 'cal-fit'), true);
  });

  it('founder name needs two real words', () => {
    for (const bad of ['Peter ', 'A B', 'Peter K']) {
      assert.equal(check((c) => (c.founder.name = bad), 'founder-name'), false, bad);
    }
  });

  it('provider cost rejects a placeholder', () => {
    assert.equal(check((c) => (c.providerCostRange = 'TBD'), 'provider-cost'), false);
    assert.equal(check((c) => (c.providerCostRange = '$20–$40'), 'provider-cost'), true);
  });

  it('each sign-off flips exactly its own item', () => {
    const pairs: [keyof typeof signoff, string][] = [
      ['legalReviewed', 'legal'], ['hstConfirmed', 'hst'], ['noReferralFees', 'no-referral'],
      ['passwordPolicy', 'passwords'], ['futurePriceCommitted', 'future-price'], ['bioApproved', 'bio'],
      ['foundingPerkConfirmed', 'founding-perk'], ['homeSessionLeadConfirmed', 'home-lead'], ['libraryVerified', 'library-links']
    ];
    for (const [flag, id] of pairs) {
      const result = evaluateLaunch(ctx({ signoff: { ...signoff, [flag]: true } }));
      assert.deepEqual(result.items.filter((i) => i.done).map((i) => i.id), [id], flag);
    }
  });

  it('non-blocking items are undone with today’s config', () => {
    const result = evaluateLaunch(ctx());
    const undone = result.items.filter((i) => !i.blocking && !i.optional && !i.done).map((i) => i.id);
    assert.ok(undone.includes('founding-perk') && undone.includes('home-lead'));
  });
});

describe('groupLaunchItems and formatBanner', () => {
  it('groups in spec order and formats the banner without "done"', () => {
    const result = evaluateLaunch(ctx());
    assert.deepEqual(groupLaunchItems(result.items).map((g) => g.title), ['Blocking', 'Not blocking', 'Optional']);
    assert.equal(formatBanner(result), `Launch check: 0/${result.total} · 20 blocking`);
  });
});
