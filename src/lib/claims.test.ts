import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { faqAnswer, fillClause, isUnlocked, renderLine } from './claims.ts';
import { honestyLine } from '../data/offers.ts';
import { faqs } from '../data/faqs.ts';
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
  assert.ok(costFaq);

  it('interpolates the value when present', () => {
    const text = fillClause(
      { text: costFaq.a, interpolates: costFaq.interpolates, optionalClause: costFaq.optionalClause },
      { providerCostRange: '$20–$40', taxNote: 'Prices in CAD.' }
    );
    assert.equal(
      text,
      "Your assistant's own subscription, paid directly to the provider (usually $20–$40/month). Care plans are available if you want me to keep tuning it."
    );
  });

  it('drops the optional clause when providerCostRange is empty (FAQ #3)', () => {
    const text = fillClause(
      { text: costFaq.a, interpolates: costFaq.interpolates, optionalClause: costFaq.optionalClause },
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
      { text: costFaq.a, interpolates: costFaq.interpolates, optionalClause: costFaq.optionalClause },
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

describe('faqAnswer', () => {
  it('gates on signoff and applies clause dropping', () => {
    const values = { providerCostRange: '', taxNote: '' };
    const byId = (id: string) => {
      const faq = faqs.find((f) => f.id === id);
      assert.ok(faq);
      return faq;
    };
    assert.equal(faqAnswer(byId('passwords'), values, allOff), null);
    assert.ok(faqAnswer(byId('passwords'), values, allOn));
    assert.ok(!faqAnswer(byId('cost-after'), values, allOff)?.includes('usually'));
    assert.equal(faqAnswer(byId('hst'), values, allOff), null);
  });

  it('never renders a doubled space or a leftover placeholder for any FAQ', () => {
    for (const values of [
      { providerCostRange: '', taxNote: '' },
      { providerCostRange: '$20–$40', taxNote: 'Prices in CAD.' }
    ]) {
      for (const faq of faqs) {
        const text = faqAnswer(faq, values, allOn);
        if (text === null) continue;
        assert.ok(!text.includes('  '), faq.id);
        assert.ok(!/\{\w+\}/.test(text), faq.id);
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
