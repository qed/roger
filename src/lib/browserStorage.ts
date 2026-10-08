// The only module that touches the real sessionStorage. Everything else receives a StorageLike.
import { safeStorage } from './storage';
import type { StorageLike } from './storage';

const noop: StorageLike = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined
};

export function getSessionStorage(): StorageLike {
  let inner: StorageLike | undefined;
  try {
    // Read via globalThis: this file is type-checked both with DOM types (app) and without them
    // (tsconfig.node-tests.json), where a bare `sessionStorage` identifier does not exist.
    inner = (globalThis as { sessionStorage?: StorageLike }).sessionStorage;
  } catch {
    // Accessing sessionStorage can throw (SecurityError when site data is blocked).
    return noop;
  }
  return inner ? safeStorage(inner) : noop;
}
