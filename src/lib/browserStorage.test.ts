import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { getSessionStorage } from './browserStorage.ts';
import { createMemoryStorage, createThrowingStorage } from './storage.ts';

type Global = { sessionStorage?: unknown };
const g = globalThis as Global;
const original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');

afterEach(() => {
  if (original) Object.defineProperty(globalThis, 'sessionStorage', original);
  else delete g.sessionStorage;
});

describe('getSessionStorage', () => {
  it('returns a working no-op adapter when sessionStorage is unavailable (Node)', () => {
    delete g.sessionStorage;
    const s = getSessionStorage();
    assert.doesNotThrow(() => s.setItem('k', 'v'));
    assert.equal(s.getItem('k'), null);
    assert.doesNotThrow(() => s.removeItem('k'));
  });

  it('wraps a real storage', () => {
    g.sessionStorage = createMemoryStorage();
    const s = getSessionStorage();
    s.setItem('k', 'v');
    assert.equal(s.getItem('k'), 'v');
    s.removeItem('k');
    assert.equal(s.getItem('k'), null);
  });

  it('never throws when every storage method throws (private mode, quota)', () => {
    g.sessionStorage = createThrowingStorage();
    const s = getSessionStorage();
    assert.doesNotThrow(() => s.setItem('k', 'v'));
    assert.equal(s.getItem('k'), null);
    assert.doesNotThrow(() => s.removeItem('k'));
  });

  it('never throws when merely accessing sessionStorage throws (SecurityError)', () => {
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError');
      }
    });
    const s = getSessionStorage();
    assert.equal(s.getItem('k'), null);
    assert.doesNotThrow(() => s.setItem('k', 'v'));
  });
});
