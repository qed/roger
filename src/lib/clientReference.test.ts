import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CLIENT_REFERENCE_MAX, buildClientReference } from './clientReference.ts';

const VALID = /^[A-Za-z0-9_-]{1,200}$/;

describe('buildClientReference', () => {
  it('builds w-{ids}__{utm} for work picks', () => {
    assert.equal(
      buildClientReference('work', ['work-customers', 'work-invoices', 'work-leads'], 'bia-ossington'),
      'w-customers-invoices-leads__bia-ossington'
    );
  });

  it('uses none and direct when there are no picks and no utm', () => {
    assert.equal(buildClientReference('work', [], null), 'w-none__direct');
    assert.equal(buildClientReference('work', [], ''), 'w-none__direct');
    assert.equal(buildClientReference('home', [], undefined), 'h-none__direct');
  });

  it('strips the home- prefix for home picks', () => {
    assert.equal(
      buildClientReference('home', ['home-meal-plan', 'home-bills'], 'newsletter'),
      'h-meal-plan-bills__newsletter'
    );
  });

  it('sanitises the utm source to [A-Za-z0-9_-]', () => {
    const ref = buildClientReference('work', [], 'BIA Ossington!!');
    assert.equal(ref, 'w-none__BIA-Ossington');
    assert.match(ref, VALID);
  });

  it('falls back to direct when the utm sanitises to nothing', () => {
    assert.equal(buildClientReference('work', [], '!!!'), 'w-none__direct');
  });

  it('sanitises odd pick ids so the __ separator stays unique', () => {
    const ref = buildClientReference('work', ['work-a_b', 'work-c d'], 'x');
    assert.equal(ref, 'w-a-b-c-d__x');
    assert.match(ref, VALID);
  });

  it('caps a very long utm at 200 total and keeps the __ separator', () => {
    const ref = buildClientReference('work', ['work-customers', 'work-invoices', 'work-leads'], 'u'.repeat(500));
    assert.ok(ref.length <= CLIENT_REFERENCE_MAX, `length ${ref.length}`);
    assert.match(ref, VALID);
    assert.ok(ref.includes('__'));
    assert.ok(ref.startsWith('w-'));
  });

  it('truncates the picks part first so the source survives', () => {
    const picks = Array.from({ length: 60 }, (_, i) => `work-helper${i}`);
    const ref = buildClientReference('work', picks, 'bia-ossington');
    assert.ok(ref.length <= CLIENT_REFERENCE_MAX);
    assert.match(ref, VALID);
    assert.ok(ref.endsWith('__bia-ossington'), ref);
    assert.ok(!ref.includes('-__'), 'no dangling dash before the separator');
  });
});

describe('extreme utm (review)', () => {
  it('keeps a non-empty picks part and fills the rest with the source', () => {
    const ref = buildClientReference('work', ['work-customers'], 'u'.repeat(500));
    assert.equal(ref.length, CLIENT_REFERENCE_MAX);
    assert.match(ref, /^w-[A-Za-z0-9-]+__u+$/);
    assert.equal(ref, `w-cust__${'u'.repeat(192)}`);
  });
});
