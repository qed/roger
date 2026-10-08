import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { faqAnswer, fillClause, isUnlocked, renderLine, resolveTimelineSteps } from './claims.ts';
import { homeTimelineCopy } from '../data/copy/home.ts';
import { honestyLine } from '../data/offers.ts';
import { faqs } from '../data/faqs.ts';
import type { Faq } from '../data/faqs.ts';
import { siteConfig } from '../data/config.ts';
import { guaranteeCopy, homeCheckoutLabels } from '../data/copy/shared.ts';
import { pricingCopy } from '../data/copy/pricing.ts';
import { whatYouGetCopy } from '../data/copy/whatYouGet.ts';
import { offers } from '../data/offers.ts';
import { displayedOffer, offerAmounts } from './offerPrice.ts';
import { signoff } from '../data/signoff.ts';
import type { Signoff } from '../data/signoff.ts';

const allOff: Signoff = { ...signoff };
const allOn: Signoff = {
  ...signoff,
  legalReviewed: true,
  hstConfirmed: true,
  noReferralFees: true,
  passwordPolicy: true,
  futurePriceCommitted: true,
  bioApproved: true,
  foundingPerkConfirmed: true,
  homeSessionLeadConfirmed: true,
  libraryVerified: true
};

describe('isUnlocked', () => {
  it('reads the signoff flag', () => {
    assert.equal(isUnlocked('passwordPolicy', allOff), false);
    assert.equal(isUnlocked('passwordPolicy', allOn), true);
  });

  it('defaults to the repo signoff', () => {
    assert.equal(isUnlocked('futurePriceCommitted'), signoff.futurePriceCommitted);
  });
});

describe('renderLine', () => {
  it('renders ungated lines', () => {
    assert.equal(renderLine({ text: 'a setup report' }, allOff), 'a setup report');
  });

  it('hides a gated line with no fallback until signed off', () => {
    const line = { text: 'Founding bonus', needs: 'foundingPerkConfirmed' as const };
    assert.equal(renderLine(line, allOff), null);
    assert.equal(renderLine(line, allOn), 'Founding bonus');
  });

  it('renders the fallback when not signed off', () => {
    const line = {
      text: 'within 3 business days of payment',
      needs: 'homeSessionLeadConfirmed' as const,
      fallback: 'Pick a time that suits you'
    };
    assert.equal(renderLine(line, allOff), 'Pick a time that suits you');
    assert.equal(renderLine(line, allOn), 'within 3 business days of payment');
  });
});

describe('fillClause', () => {
  const costFaq = faqs.find((f) => f.id === 'cost-after');
  assert.ok(costFaq && typeof costFaq.a === 'string');
  const costText = costFaq.a as string;

  it('interpolates the value when present', () => {
    const text = fillClause(
      { text: costText, interpolates: costFaq.interpolates, optionalClause: costFaq.optionalClause },
      { providerCostRange: '$20–$40', taxNote: 'Prices in CAD.' }
    );
    assert.equal(
      text,
      "Your assistant's own subscription, paid directly to the provider (usually $20–$40/month). Care plans are available if you want me to keep tuning it."
    );
  });

  it('drops the optional clause when providerCostRange is empty (FAQ #3)', () => {
    const text = fillClause(
      { text: costText, interpolates: costFaq.interpolates, optionalClause: costFaq.optionalClause },
      { providerCostRange: '', taxNote: '' }
    );
    assert.equal(
      text,
      "Your assistant's own subscription, paid directly to the provider. Care plans are available if you want me to keep tuning it."
    );
    assert.ok(!text?.includes('usually'));
    assert.ok(!text?.includes('{'));
  });

  it('treats a whitespace-only value as empty', () => {
    const text = fillClause(
      { text: costText, interpolates: costFaq.interpolates, optionalClause: costFaq.optionalClause },
      { providerCostRange: '   ', taxNote: '' }
    );
    assert.ok(!text?.includes('usually'));
  });

  it('hides text that is only the value when the value is empty', () => {
    assert.equal(fillClause({ text: '{taxNote}', interpolates: 'taxNote' }, { providerCostRange: '', taxNote: '' }), null);
    assert.equal(
      fillClause({ text: '{taxNote}', interpolates: 'taxNote' }, { providerCostRange: '', taxNote: 'Prices in CAD.' }),
      'Prices in CAD.'
    );
  });

  it('hides text whose value is empty and that has no optional clause to drop', () => {
    assert.equal(
      fillClause({ text: 'About {providerCostRange} a month.', interpolates: 'providerCostRange' }, { providerCostRange: '', taxNote: '' }),
      null
    );
  });

  it('passes through text with nothing to interpolate', () => {
    assert.equal(fillClause({ text: 'Plain.' }, { providerCostRange: '', taxNote: '' }), 'Plain.');
  });
});

describe('honestyLine (pricing, spec §6.7)', () => {
  it('drops the clause when providerCostRange is empty, with no "usually  a month"', () => {
    const text = fillClause(honestyLine, { providerCostRange: '', taxNote: '' });
    assert.ok(text);
    assert.ok(!text.includes('usually'));
    assert.ok(!text.includes('  '));
    assert.ok(!text.includes('{'));
    assert.match(text, /directly to the provider\. I'll recommend/);
  });

  it('includes the range when set', () => {
    const text = fillClause(honestyLine, { providerCostRange: '$20–$40', taxNote: '' });
    assert.match(text ?? '', /usually \$20–\$40 a month\./);
  });
});

const foundingState = { prices: siteConfig.prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 4 } };
const fullState = { prices: siteConfig.prices, founding: { ...siteConfig.founding, total: 10, spotsLeft: 0 } };
const workAmounts = offerAmounts('work', foundingState);
const faqById = (id: string): Faq => {
  const faq = faqs.find((f) => f.id === id);
  assert.ok(faq, id);
  return faq;
};

describe('faqAnswer', () => {
  it('gates on signoff and applies clause dropping', () => {
    const values = { providerCostRange: '', taxNote: '' };
    const opts = (signoff: Signoff) => ({ amounts: workAmounts, values, signoff });
    assert.equal(faqAnswer(faqById('passwords'), opts(allOff)), null);
    assert.ok(faqAnswer(faqById('passwords'), opts(allOn)));
    assert.ok(!faqAnswer(faqById('cost-after'), opts(allOff))?.includes('usually'));
    assert.equal(faqAnswer(faqById('hst'), opts(allOff)), null);
  });

  it('never renders a doubled space or a leftover placeholder for any FAQ', () => {
    for (const values of [
      { providerCostRange: '', taxNote: '' },
      { providerCostRange: '$20–$40', taxNote: 'Prices in CAD.' }
    ]) {
      for (const faq of faqs) {
        const text = faqAnswer(faq, { amounts: workAmounts, values, signoff: allOn });
        if (text === null) continue;
        assert.ok(!text.includes('  '), faq.id);
        assert.ok(!/\{\w+\}/.test(text), faq.id);
      }
    }
  });
});

describe('faqAnswer end to end, founding and full (work)', () => {
  const values = { providerCostRange: '', taxNote: '' };
  const answer = (id: string, state: typeof foundingState) =>
    faqAnswer(faqById(id), { amounts: offerAmounts('work', state), values, signoff: allOff });

  it('states the displayed deposit in "What if I skip the call?"', () => {
    assert.equal(
      answer('skip-call', foundingState),
      "The first 15 minutes of Session 1 is the fit check. If I can't help, you get the full $1,000 back."
    );
    assert.equal(
      answer('skip-call', fullState),
      "The first 15 minutes of Session 1 is the fit check. If I can't help, you get the full $1,500 back."
    );
  });

  it('renders the guarantee FAQ with the displayed deposit and balance', () => {
    const founding = answer('doesnt-work', foundingState);
    const full = answer('doesnt-work', fullState);
    assert.ok(founding?.startsWith('You pay $1,000 to book. The other $1,000 is due only after'), founding ?? '');
    assert.ok(full?.startsWith('You pay $1,500 to book. The other $1,500 is due only after'), full ?? '');
    assert.ok(full?.includes('I refund the $1,500 too.'));
    for (const text of [founding, full]) {
      assert.ok(text?.includes('What "working" means:'));
      assert.ok(text?.endsWith('How to claim: one email. No forms, no questions about why.'));
      assert.ok(!text?.includes('$2,000') && !text?.includes('$3,000'));
    }
    assert.ok(!full?.includes('$1,000'));
  });
});

describe('home amounts (paid in full)', () => {
  it('makes the home deposit the price, with a $0 balance', () => {
    for (const state of [foundingState, fullState]) {
      const d = displayedOffer('home', state);
      assert.equal(d.deposit, d.price);
      assert.equal(d.balance, 0);
    }
  });

  it('never words a "$0" balance in any home copy', () => {
    for (const state of [foundingState, fullState]) {
      const a = offerAmounts('home', state);
      const copy = [
        ...guaranteeCopy.home.body(a),
        pricingCopy.home.guarantee(a),
        offers.home.payment(a),
        offers.home.guarantee(a),
        ...offers.home.flow(a),
        homeCheckoutLabels.short(a.price),
        homeCheckoutLabels.long(a.price),
        homeCheckoutLabels.sticky(a.price),
        whatYouGetCopy.home.summary('Meal plan', a.price)
      ];
      for (const text of copy) {
        assert.ok(!text.includes('$0'), text);
        assert.ok(text.includes(a.price), text);
      }
    }
  });
});

describe('fillClause fallbacks (review)', () => {
  const empty = { providerCostRange: '', taxNote: '' };

  it('hides the text when the optional clause is not actually in it', () => {
    assert.equal(
      fillClause({ text: 'A {providerCostRange}.', interpolates: 'providerCostRange', optionalClause: 'zzz' }, empty),
      null
    );
  });

  it('hides the text when the placeholder survives removing the clause', () => {
    assert.equal(
      fillClause(
        {
          text: 'From {providerCostRange}, usually {providerCostRange} a month.',
          interpolates: 'providerCostRange',
          optionalClause: ', usually {providerCostRange} a month'
        },
        empty
      ),
      null
    );
  });

  it('removes every occurrence of the optional clause', () => {
    assert.equal(
      fillClause({ text: 'A (x {taxNote}). B (x {taxNote}).', interpolates: 'taxNote', optionalClause: ' (x {taxNote})' }, empty),
      'A. B.'
    );
  });

  it('inserts values literally, even ones with $& or braces', () => {
    assert.equal(
      fillClause({ text: 'Cost {providerCostRange}.', interpolates: 'providerCostRange' }, { providerCostRange: '$& {x}', taxNote: '' }),
      'Cost $& {x}.'
    );
  });
});

describe('resolveTimelineSteps', () => {
  it('keeps plain notes, renders a gated note once signed off, else its fallback', () => {
    const steps = [
      { when: 'A', what: 'a', whenNote: 'plain' },
      { when: 'B', what: 'b', whenNote: { text: 'claim', needs: 'homeSessionLeadConfirmed' as const, fallback: 'fallback' } },
      { when: 'C', what: 'c' }
    ];
    assert.deepEqual(resolveTimelineSteps(steps, allOn).map((s) => s.whenNote), ['plain', 'claim', undefined]);
    assert.deepEqual(resolveTimelineSteps(steps, allOff).map((s) => s.whenNote), ['plain', 'fallback', undefined]);
  });

  it('drops a gated note with no fallback, keeping the step', () => {
    const [step] = resolveTimelineSteps([{ when: 'X', what: 'x', whenNote: { text: 'claim', needs: 'passwordPolicy' } }], allOff);
    assert.deepEqual(step, { when: 'X', what: 'x' });
  });

  it('renders the /home session step per homeSessionLeadConfirmed (spec §8.4.3)', () => {
    const notes = (s: Signoff) => resolveTimelineSteps(homeTimelineCopy.steps, s).map((step) => step.whenNote ?? '').join(' | ');
    assert.match(notes(allOff), /Pick a time that suits you/);
    assert.doesNotMatch(notes(allOff), /3 business days/);
    assert.match(notes(allOn), /within 3 business days of payment/);
  });
});
