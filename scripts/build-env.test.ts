import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveBuildEnv } from './build-env.ts';

describe('resolveBuildEnv', () => {
  const rows: [string, Record<string, string | undefined>, 'strict' | 'report', string][] = [
    ['local, nothing set', {}, 'report', 'development'],
    ['local, explicit production', { VERCEL_ENV: 'production' }, 'strict', 'production'],
    ['local, explicit preview', { VERCEL_ENV: 'preview' }, 'report', 'preview'],
    ['Vercel preview', { VERCEL: '1', VERCEL_ENV: 'preview' }, 'report', 'preview'],
    ['Vercel production', { VERCEL: '1', VERCEL_ENV: 'production' }, 'strict', 'production'],
    ['Vercel with VERCEL_ENV missing (fails closed)', { VERCEL: '1' }, 'strict', 'production'],
    ['Vercel with VERCEL_ENV development', { VERCEL: '1', VERCEL_ENV: 'development' }, 'strict', 'production'],
    ['Vercel with an unknown VERCEL_ENV', { VERCEL: '1', VERCEL_ENV: 'staging' }, 'strict', 'production'],
    ['Vercel with an empty VERCEL_ENV', { VERCEL: '1', VERCEL_ENV: '' }, 'strict', 'production']
  ];

  for (const [name, env, mode, define] of rows) {
    it(name, () => {
      assert.deepEqual(resolveBuildEnv(env), { mode, define });
    });
  }

  it('upholds the invariant: strict ⇔ the bundle is built as production', () => {
    for (const [, env] of rows) {
      const result = resolveBuildEnv(env);
      assert.equal(result.mode === 'strict', result.define === 'production', JSON.stringify(env));
    }
  });
});
