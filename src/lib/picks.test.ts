import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  PICKS_KEYS,
  PICKS_MAX,
  createPicksStore,
  readPicks,
  sanitisePicks,
  togglePick,
  writePicks
} from './picks.ts';
import { createMemoryStorage, createThrowingStorage } from './storage.ts';

const WORK4 = ['work-customers', 'work-invoices', 'work-leads', 'work-numbers'];
const HOME6 = ['home-meal-plan', 'home-bills', 'home-trip', 'home-inbox', 'home-errands', 'home-scam-guard'];

describe('picks constants', () => {
  it('uses separate keys per kind and the picker maxima', () => {
    assert.equal(PICKS_KEYS.work, 'roger.picks.work');
    assert.equal(PICKS_KEYS.home, 'roger.picks.home');
    assert.equal(PICKS_MAX.work, 3);
    assert.equal(PICKS_MAX.home, 5);
  });
});

describe('sanitisePicks', () => {
  it('drops foreign-kind and unknown ids', () => {
    assert.deepEqual(sanitisePicks('work', ['work-customers', 'home-bills', 'work-nope', 'work-leads']), [
      'work-customers',
      'work-leads'
    ]);
    assert.deepEqual(sanitisePicks('home', ['work-customers', 'home-bills']), ['home-bills']);
  });

  it('never accepts the always-included Chief of Staff as a pick', () => {
    assert.deepEqual(sanitisePicks('work', ['work-cos', 'work-leads']), ['work-leads']);
  });

  it('de-duplicates and keeps first-seen order', () => {
    assert.deepEqual(sanitisePicks('work', ['work-leads', 'work-customers', 'work-leads']), [
      'work-leads',
      'work-customers'
    ]);
  });

  it('cuts to the max: 4 work ids -> 3, 6 home ids -> 5', () => {
    assert.deepEqual(sanitisePicks('work', WORK4), WORK4.slice(0, 3));
    assert.deepEqual(sanitisePicks('home', HOME6), HOME6.slice(0, 5));
  });

  it('returns [] for non-arrays and ignores non-string entries', () => {
    assert.deepEqual(sanitisePicks('work', null), []);
    assert.deepEqual(sanitisePicks('work', { 0: 'work-leads' }), []);
    assert.deepEqual(sanitisePicks('work', 'work-leads'), []);
    assert.deepEqual(sanitisePicks('work', [1, null, 'work-leads']), ['work-leads']);
  });
});

describe('readPicks / writePicks', () => {
  it('round-trips through storage under the per-kind key', () => {
    const storage = createMemoryStorage();
    writePicks(storage, 'work', ['work-customers', 'work-invoices']);
    assert.equal(storage.getItem('roger.picks.work'), JSON.stringify(['work-customers', 'work-invoices']));
    assert.deepEqual(readPicks(storage, 'work'), ['work-customers', 'work-invoices']);
    assert.deepEqual(readPicks(storage, 'home'), []);
  });

  it('sanitises on write and on read', () => {
    const storage = createMemoryStorage();
    assert.deepEqual(writePicks(storage, 'work', [...WORK4, 'home-bills']), WORK4.slice(0, 3));
    storage.setItem(PICKS_KEYS.work, JSON.stringify(['home-bills', 'work-zzz', ...WORK4]));
    assert.deepEqual(readPicks(storage, 'work'), WORK4.slice(0, 3));
  });

  it('removes the key when writing an empty list', () => {
    const storage = createMemoryStorage();
    writePicks(storage, 'home', ['home-bills']);
    writePicks(storage, 'home', []);
    assert.equal(storage.getItem(PICKS_KEYS.home), null);
  });

  it('returns [] for corrupt JSON', () => {
    const storage = createMemoryStorage();
    storage.setItem(PICKS_KEYS.work, '{not json');
    assert.deepEqual(readPicks(storage, 'work'), []);
    storage.setItem(PICKS_KEYS.work, '"work-leads"');
    assert.deepEqual(readPicks(storage, 'work'), []);
  });

  it('returns [] and never throws when storage throws', () => {
    const storage = createThrowingStorage();
    assert.deepEqual(readPicks(storage, 'work'), []);
    assert.doesNotThrow(() => writePicks(storage, 'work', ['work-leads']));
  });
});

describe('togglePick', () => {
  it('adds and removes', () => {
    const added = togglePick('work', ['work-leads'], 'work-customers');
    assert.deepEqual(added, { status: 'added', picks: ['work-leads', 'work-customers'] });
    const removed = togglePick('work', added.picks, 'work-leads');
    assert.deepEqual(removed, { status: 'removed', picks: ['work-customers'] });
  });

  it('refuses to go over the max and leaves picks unchanged', () => {
    const full = WORK4.slice(0, 3);
    const result = togglePick('work', full, 'work-numbers');
    assert.equal(result.status, 'max-reached');
    assert.deepEqual(result.picks, full);
  });

  it('still allows removing when at the max', () => {
    assert.equal(togglePick('work', WORK4.slice(0, 3), 'work-customers').status, 'removed');
  });

  it('rejects unknown or foreign ids', () => {
    assert.equal(togglePick('work', [], 'home-bills').status, 'invalid');
    assert.equal(togglePick('home', [], 'nope').status, 'invalid');
  });
});

describe('createPicksStore', () => {
  it('reads the initial snapshot from storage', () => {
    const storage = createMemoryStorage();
    writePicks(storage, 'work', ['work-leads']);
    const store = createPicksStore(storage);
    assert.deepEqual(store.getSnapshot('work'), ['work-leads']);
    assert.deepEqual(store.getSnapshot('home'), []);
  });

  it('returns a stable snapshot reference until it changes', () => {
    const store = createPicksStore(createMemoryStorage());
    const a = store.getSnapshot('work');
    assert.equal(store.getSnapshot('work'), a);
    store.toggle('work', 'work-leads');
    const b = store.getSnapshot('work');
    assert.notEqual(b, a);
    assert.equal(store.getSnapshot('work'), b);
  });

  it('notifies only subscribers of the changed kind, and unsubscribes', () => {
    const store = createPicksStore(createMemoryStorage());
    let work = 0;
    let home = 0;
    const unsubWork = store.subscribe('work', () => work++);
    store.subscribe('home', () => home++);
    store.toggle('work', 'work-leads');
    assert.equal(work, 1);
    assert.equal(home, 0);
    unsubWork();
    store.toggle('work', 'work-customers');
    assert.equal(work, 1);
  });

  it('does not notify when a toggle is refused', () => {
    const store = createPicksStore(createMemoryStorage());
    store.set('work', WORK4.slice(0, 3));
    let calls = 0;
    store.subscribe('work', () => calls++);
    assert.equal(store.toggle('work', 'work-numbers'), 'max-reached');
    assert.equal(calls, 0);
  });

  it('keeps working in memory when storage throws', () => {
    const store = createPicksStore(createThrowingStorage());
    assert.equal(store.toggle('home', 'home-bills'), 'added');
    assert.deepEqual(store.getSnapshot('home'), ['home-bills']);
  });

  it('persists set/clear to storage', () => {
    const storage = createMemoryStorage();
    const store = createPicksStore(storage);
    store.set('home', HOME6);
    assert.deepEqual(readPicks(storage, 'home'), HOME6.slice(0, 5));
    store.clear('home');
    assert.deepEqual(readPicks(storage, 'home'), []);
    assert.deepEqual(store.getSnapshot('home'), []);
  });
});

describe('store no-op commits (review)', () => {
  it('keeps the snapshot and stays silent when set/clear change nothing', () => {
    const store = createPicksStore(createMemoryStorage());
    const empty = store.getSnapshot('work');
    let calls = 0;
    store.subscribe('work', () => calls++);
    store.clear('work');
    store.set('work', ['home-bills']);
    assert.equal(store.getSnapshot('work'), empty);
    store.set('work', ['work-leads']);
    const one = store.getSnapshot('work');
    store.set('work', ['work-leads']);
    assert.equal(store.getSnapshot('work'), one);
    assert.equal(calls, 1);
  });
});
