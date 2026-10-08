import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  WORKSHOP_CODE_KEY,
  acceptWorkshopCode,
  captureCodeFromSearch,
  createWorkshopCodeStore,
  normaliseWorkshopCode,
  promoCodeFor,
  readWorkshopCode,
  storeWorkshopCode
} from './workshopCode.ts';
import { createMemoryStorage, createThrowingStorage } from './storage.ts';

const ALLOW = ['OSSINGTON', 'NETWORK'];

describe('normaliseWorkshopCode', () => {
  it('uppercases and strips non-alphanumerics', () => {
    assert.equal(normaliseWorkshopCode('ossington'), 'OSSINGTON');
    assert.equal(normaliseWorkshopCode('Oss-ington!'), 'OSSINGTON');
    assert.equal(normaliseWorkshopCode('  bia ossington 2 '), 'BIAOSSINGTON2');
  });

  it('never strips a WORK/HOME-looking suffix', () => {
    assert.equal(normaliseWorkshopCode('network'), 'NETWORK');
    assert.equal(normaliseWorkshopCode('OSSINGTONWORK'), 'OSSINGTONWORK');
    assert.equal(normaliseWorkshopCode('OSSINGTON-HOME'), 'OSSINGTONHOME');
  });

  it('caps the length at 32 after normalising', () => {
    const raw = 'a-'.repeat(40); // 80 chars raw, 40 after normalising
    assert.equal(normaliseWorkshopCode(raw), 'A'.repeat(32));
    assert.equal(normaliseWorkshopCode('-'.repeat(50) + 'abc'), 'ABC');
  });

  it('returns empty for missing or junk input', () => {
    assert.equal(normaliseWorkshopCode(null), '');
    assert.equal(normaliseWorkshopCode(undefined), '');
    assert.equal(normaliseWorkshopCode('!!!'), '');
    assert.equal(normaliseWorkshopCode('élan'), 'LAN');
  });
});

describe('acceptWorkshopCode', () => {
  it('accepts allow-listed codes after normalising', () => {
    assert.equal(acceptWorkshopCode('ossington', ALLOW), 'OSSINGTON');
    assert.equal(acceptWorkshopCode('Oss-ington!', ALLOW), 'OSSINGTON');
    assert.equal(acceptWorkshopCode('NETWORK', ALLOW), 'NETWORK');
  });

  it('ignores codes that are not allow-listed', () => {
    assert.equal(acceptWorkshopCode('FREE', ALLOW), null);
    assert.equal(acceptWorkshopCode('', ALLOW), null);
    assert.equal(acceptWorkshopCode(null, ALLOW), null);
  });

  it('never applies a code when the allow-list is empty', () => {
    assert.equal(acceptWorkshopCode('OSSINGTON', []), null);
  });

  it('normalises the allow-list entries too', () => {
    assert.equal(acceptWorkshopCode('OSSINGTON', ['ossington']), 'OSSINGTON');
  });

  it('defaults to siteConfig.workshopCodes (empty today)', () => {
    assert.equal(acceptWorkshopCode('OSSINGTON'), null);
  });
});

describe('promoCodeFor', () => {
  it('builds {GROUP}WORK and {GROUP}HOME', () => {
    assert.equal(promoCodeFor('OSSINGTON', 'work'), 'OSSINGTONWORK');
    assert.equal(promoCodeFor('OSSINGTON', 'home'), 'OSSINGTONHOME');
    assert.equal(promoCodeFor('NETWORK', 'work'), 'NETWORKWORK');
    assert.equal(promoCodeFor('NETWORK', 'home'), 'NETWORKHOME');
  });
});

describe('stored workshop code', () => {
  it('stores an accepted code and reads it back', () => {
    const storage = createMemoryStorage();
    assert.equal(storeWorkshopCode(storage, 'ossington', ALLOW), 'OSSINGTON');
    assert.equal(storage.getItem(WORKSHOP_CODE_KEY), 'OSSINGTON');
    assert.equal(readWorkshopCode(storage, ALLOW), 'OSSINGTON');
  });

  it('does not store an unknown code and keeps the previous one', () => {
    const storage = createMemoryStorage();
    storeWorkshopCode(storage, 'OSSINGTON', ALLOW);
    assert.equal(storeWorkshopCode(storage, 'FREE', ALLOW), null);
    assert.equal(readWorkshopCode(storage, ALLOW), 'OSSINGTON');
  });

  it('a newer valid code overwrites the old one', () => {
    const storage = createMemoryStorage();
    storeWorkshopCode(storage, 'OSSINGTON', ALLOW);
    storeWorkshopCode(storage, 'network', ALLOW);
    assert.equal(readWorkshopCode(storage, ALLOW), 'NETWORK');
  });

  it('re-validates on read: a stored code no longer allow-listed is ignored', () => {
    const storage = createMemoryStorage();
    storage.setItem(WORKSHOP_CODE_KEY, 'FREE');
    assert.equal(readWorkshopCode(storage, ALLOW), null);
    assert.equal(readWorkshopCode(createMemoryStorage(), ALLOW), null);
  });

  it('never throws when storage throws', () => {
    const storage = createThrowingStorage();
    assert.equal(storeWorkshopCode(storage, 'OSSINGTON', ALLOW), 'OSSINGTON');
    assert.equal(readWorkshopCode(storage, ALLOW), null);
  });
});

describe('over-length codes (review)', () => {
  it('rejects input longer than 32 characters instead of matching a prefix', () => {
    const allowed = 'A'.repeat(32);
    assert.equal(acceptWorkshopCode(allowed, [allowed]), allowed);
    assert.equal(acceptWorkshopCode(`${allowed}ZZZ`, [allowed]), null);
  });
});

describe('captureCodeFromSearch', () => {
  it('returns null when there is no code param', () => {
    assert.equal(captureCodeFromSearch('', ALLOW), null);
    assert.equal(captureCodeFromSearch('?utm_source=bia', ALLOW), null);
  });

  it('accepts a valid code and strips it; nextSearch is empty when nothing remains', () => {
    assert.deepEqual(captureCodeFromSearch('?code=ossington', ALLOW), { code: 'OSSINGTON', nextSearch: '' });
    assert.deepEqual(captureCodeFromSearch('code=OSSINGTON', ALLOW), { code: 'OSSINGTON', nextSearch: '' });
  });

  it('strips an invalid code but reports no accepted code', () => {
    assert.deepEqual(captureCodeFromSearch('?code=FREE', ALLOW), { code: null, nextSearch: '' });
  });

  it('keeps every other param in order', () => {
    assert.deepEqual(captureCodeFromSearch('?utm_source=bia&code=OSSINGTON&utm_medium=qr', ALLOW), {
      code: 'OSSINGTON',
      nextSearch: '?utm_source=bia&utm_medium=qr'
    });
  });

  it('never strips a WORK-looking suffix from the code', () => {
    assert.deepEqual(captureCodeFromSearch('?code=network', ALLOW), { code: 'NETWORK', nextSearch: '' });
  });
});

describe('createWorkshopCodeStore', () => {
  it('starts from the stored code and notifies on a new accepted code', () => {
    const storage = createMemoryStorage();
    storeWorkshopCode(storage, 'OSSINGTON', ALLOW);
    const store = createWorkshopCodeStore(storage, ALLOW);
    assert.equal(store.getSnapshot(), 'OSSINGTON');
    let calls = 0;
    const off = store.subscribe(() => calls++);
    assert.equal(store.set('network'), 'NETWORK');
    assert.equal(store.getSnapshot(), 'NETWORK');
    assert.equal(storage.getItem(WORKSHOP_CODE_KEY), 'NETWORK');
    assert.equal(calls, 1);
    off();
    store.set('OSSINGTON');
    assert.equal(calls, 1);
  });

  it('an invalid code keeps the previously stored code and does not notify', () => {
    const storage = createMemoryStorage();
    const store = createWorkshopCodeStore(storage, ALLOW);
    store.set(captureCodeFromSearch('?code=OSSINGTON', ALLOW)?.code);
    let calls = 0;
    store.subscribe(() => calls++);
    const captured = captureCodeFromSearch('?code=FREE', ALLOW);
    assert.equal(store.set(captured?.code), null);
    assert.equal(store.getSnapshot(), 'OSSINGTON');
    assert.equal(readWorkshopCode(storage, ALLOW), 'OSSINGTON');
    assert.equal(calls, 0);
  });

  it('setting the same code again does not notify', () => {
    const store = createWorkshopCodeStore(createMemoryStorage(), ALLOW);
    store.set('OSSINGTON');
    let calls = 0;
    store.subscribe(() => calls++);
    store.set('ossington');
    assert.equal(calls, 0);
  });
});
