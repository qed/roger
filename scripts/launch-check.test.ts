// Runs the real launch-check script the way the build does, under each environment that matters.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { caseStudies } from '../src/data/caseStudies.ts';
import { siteConfig } from '../src/data/config.ts';
import { evaluateLaunch } from '../src/data/launch.ts';
import { signoff } from '../src/data/signoff.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// How many blocking items the live config still misses (asset checks treated as missing, like a fresh clone).
const missing = evaluateLaunch({ config: siteConfig, signoff, caseStudies, assetExists: () => true }).blockingMissing.length;

function run(env: Record<string, string>, ...args: string[]) {
  const clean = { ...process.env };
  delete clean.VERCEL;
  delete clean.VERCEL_ENV;
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/launch-check.ts', ...args], {
    cwd: root,
    env: { ...clean, ...env },
    encoding: 'utf8'
  });
  return { status: result.status, out: result.stdout, err: result.stderr };
}

describe('launch-check CLI with the live config (blocking items still missing)', () => {
  it('reports without failing locally', () => {
    const r = run({});
    assert.equal(r.status, 0, r.err);
    assert.match(r.out, /mode=report/);
    assert.match(r.out, /Launch check: \d+\/\d+ done · \d+ blocking/);
  });

  it('reports without failing on a Vercel preview', () => {
    const r = run({ VERCEL: '1', VERCEL_ENV: 'preview' });
    assert.equal(r.status, 0, r.err);
    assert.match(r.out, /mode=report/);
  });

  it('fails a Vercel production build and lists what is missing', () => {
    const r = run({ VERCEL: '1', VERCEL_ENV: 'production' });
    assert.equal(r.status, 1);
    assert.match(r.out, /mode=strict/);
    assert.match(r.err, /Production build blocked/);
    assert.match(r.err, /\n {2}- \S/);
  });

  it('fails closed when Vercel sets no VERCEL_ENV', () => {
    const r = run({ VERCEL: '1' });
    assert.equal(r.status, 1);
    assert.match(r.out, /VERCEL_ENV=unset VERCEL=1 mode=strict/);
  });

  it('--strict fails even locally', () => {
    assert.equal(run({}, '--strict').status, 1);
  });

  it('--json prints machine-readable status', () => {
    const r = run({}, '--json');
    assert.equal(r.status, 0, r.err);
    const status = JSON.parse(r.out) as { mode: string; blockingMissing: string[]; items: unknown[] };
    assert.equal(status.mode, 'report');
    assert.ok(status.blockingMissing.length >= missing);
    assert.ok(status.items.length > 20);
  });
});
