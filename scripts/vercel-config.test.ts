// vercel.json is deploy config with no other test: a typo here silently drops the launch gate, the SPA
// rewrite or the security headers on the live site.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

type Header = { key: string; value: string };
type VercelConfig = {
  buildCommand?: string;
  rewrites?: { source: string; destination: string }[];
  headers?: { source: string; headers: Header[] }[];
};

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')) as VercelConfig;

function headersFor(source: string): Record<string, string> {
  const block = vercel.headers?.find((h) => h.source === source);
  assert.ok(block, `no headers block for ${source}`);
  return Object.fromEntries(block.headers.map((h) => [h.key, h.value]));
}

describe('vercel.json', () => {
  it('builds through npm run build, so the launch gate runs', () => {
    assert.equal(vercel.buildCommand, 'npm run build');
  });

  it('rewrites app routes to / but not assets or files', () => {
    const rewrite = vercel.rewrites?.find((r) => r.destination === '/');
    assert.ok(rewrite, 'SPA rewrite missing');
    const re = new RegExp(`^${rewrite.source}$`);
    for (const path of ['/work', '/home', '/thanks/work', '/library']) assert.ok(re.test(path), path);
    for (const path of ['/assets/index-abc.js', '/og.png', '/robots.txt']) assert.ok(!re.test(path), path);
  });

  it('sends the security headers on every path (no enforced CSP)', () => {
    const all = headersFor('/(.*)');
    assert.equal(all['X-Content-Type-Options'], 'nosniff');
    assert.equal(all['Referrer-Policy'], 'strict-origin-when-cross-origin');
    assert.equal(all['X-Frame-Options'], 'DENY');
    assert.equal(all['Permissions-Policy'], 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
    assert.equal(all['Content-Security-Policy'], undefined);
  });

  it('keeps /thanks and everything under it out of search', () => {
    assert.equal(headersFor('/thanks')['X-Robots-Tag'], 'noindex, nofollow');
    assert.equal(headersFor('/thanks/(.*)')['X-Robots-Tag'], 'noindex, nofollow');
  });
});
