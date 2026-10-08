// The subset of the Web Storage API the app uses. Injected everywhere so logic stays testable in Node.
export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export function createMemoryStorage(): StorageLike {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, String(value));
    },
    removeItem: (key) => {
      data.delete(key);
    }
  };
}

// Simulates private mode or a full quota: every call throws.
export function createThrowingStorage(): StorageLike {
  const fail = (): never => {
    throw new Error('Storage unavailable');
  };
  return { getItem: fail, setItem: fail, removeItem: fail };
}

// Wraps a storage so no call ever throws: reads fall back to null, writes become no-ops.
export function safeStorage(inner: StorageLike): StorageLike {
  return {
    getItem(key) {
      try {
        return inner.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        inner.setItem(key, value);
      } catch {
        // Ignore: persistence is a convenience, never a requirement.
      }
    },
    removeItem(key) {
      try {
        inner.removeItem(key);
      } catch {
        // Ignore.
      }
    }
  };
}
