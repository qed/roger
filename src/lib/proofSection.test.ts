import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { headingFor, resolveWontDo } from './proofSection.ts';
import type { WontDoLine } from '../data/copy/types.ts';
import { proofCopy } from '../data/copy/shared.ts';
import { signoff } from '../data/signoff.ts';
import type { Signoff } from '../data/signoff.ts';

const off: Signoff = { ...signoff, passwordPolicy: false, noReferralFees: false };
const on: Signoff = { ...signoff, passwordPolicy: true, noReferralFees: true };

const LINES: WontDoLine[] = [
  { text: 'plain' },
  { text: 'work wording', home: 'home wording' },
  { text: 'gated', needs: 'passwordPolicy' },
  { text: 'gated work', home: 'gated home', needs: 'noReferralFees' },
  { text: 'gated with fallback', needs: 'passwordPolicy', fallback: 'fallback' },
  { text: 'blank home', home: '  ' }
];

describe('resolveWontDo', () => {
  it('uses the work wording on /', () => {
    assert.deepEqual(resolveWontDo(LINES, 'work', on), ['plain', 'work wording', 'gated', 'gated work', 'gated with fallback', 'blank home']);
  });

  it('uses the /home wording on /home when a line has one, and the shared wording otherwise', () => {
    assert.deepEqual(resolveWontDo(LINES, 'home', on), ['plain', 'home wording', 'gated', 'gated home', 'gated with fallback', 'blank home']);
  });

  it('gates both wordings on the same sign-off, with the fallback when there is one', () => {
    assert.deepEqual(resolveWontDo(LINES, 'work', off), ['plain', 'work wording', 'fallback', 'blank home']);
    assert.deepEqual(resolveWontDo(LINES, 'home', off), ['plain', 'home wording', 'fallback', 'blank home']);
  });

  it('never mentions the fit call on /home (there is none, spec §6A)', () => {
    for (const s of [on, off]) {
      for (const line of resolveWontDo(proofCopy.wontDo, 'home', s)) assert.doesNotMatch(line, /fit call/i, line);
    }
    assert.ok(resolveWontDo(proofCopy.wontDo, 'work', on).some((line) => /fit call/.test(line)));
  });

  it('hides the gated repo lines until signed off', () => {
    const repoOff = resolveWontDo(proofCopy.wontDo, 'home', off);
    const repoOn = resolveWontDo(proofCopy.wontDo, 'home', on);
    assert.equal(repoOn.length - repoOff.length, proofCopy.wontDo.filter((l) => l.needs && !l.fallback).length);
  });
});

describe('headingFor', () => {
  it('picks each page its own heading', () => {
    assert.equal(headingFor(proofCopy.screenshotsHeading, 'work'), 'I run my own business this way');
    assert.equal(headingFor(proofCopy.screenshotsHeading, 'home'), 'I run my own week this way');
    assert.equal(headingFor(proofCopy.caseStudiesHeading, 'home'), 'Set up for real Toronto homes.');
    assert.notEqual(headingFor(proofCopy.caseStudiesHeading, 'work'), headingFor(proofCopy.caseStudiesHeading, 'home'));
  });
});
