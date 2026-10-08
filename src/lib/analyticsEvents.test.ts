// Spec §9.7 audit: statically scans src/ for every event the site fires, through trackEvent('name', …)
// or a TrackedEvent object ({ name: 'name', props: … }), and checks the set of names and each event's
// prop keys against the spec list. A new, renamed or unfired event fails here.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { ANALYTICS_EVENTS } from './analyticsEvents.ts';

const SPEC_EVENTS: Record<string, string[]> = {
  cta_click: ['cta', 'location'],
  checkout_open: ['offer', 'picks'],
  fitcall_open: ['picks'],
  picker_change: ['count', 'offer'],
  sticky_cta_click: ['cta'],
  workshop_request_submit: [],
  newsletter_submit: ['for'],
  library_filter: ['cat', 'for'],
  library_outbound: ['id'],
  library_to_offer: ['id'],
  calc_used: []
};

const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.ts$/.test(name) ? [path] : [];
  });
}

// The keys of the first object literal in `text` (shorthand or `key:`), e.g. "{ cta, location }".
function objectKeys(text: string): string[] {
  const start = text.indexOf('{');
  const end = text.indexOf('}', start);
  if (start < 0 || end < 0) return [];
  const body = text.slice(start, end + 1);
  return [...body.matchAll(/[{,]\s*(\w+)\s*(?=[:,}])/g)].map((m) => m[1]);
}

type Fired = { name: string; keys: string[]; where: string };

function scan(): Fired[] {
  const fired: Fired[] = [];
  for (const file of sourceFiles(srcDir)) {
    const text = readFileSync(file, 'utf8');
    const where = relative(srcDir, file);
    for (const m of text.matchAll(/\btrackEvent\(\s*["'](\w+)["']\s*([,)])/g)) {
      const rest = text.slice((m.index ?? 0) + m[0].length);
      fired.push({ name: m[1], keys: m[2] === ',' ? objectKeys(rest.slice(0, rest.indexOf(')') + 1)) : [], where });
    }
    if (!text.includes('TrackedEvent')) continue;
    for (const m of text.matchAll(/\bname:\s*["'](\w+)["']\s*(,\s*props:)?/g)) {
      const rest = text.slice((m.index ?? 0) + m[0].length);
      fired.push({ name: m[1], keys: m[2] ? objectKeys(rest) : [], where });
    }
  }
  return fired;
}

describe('analytics events (spec §9.7)', () => {
  const fired = scan();

  it('declares exactly the spec events', () => {
    assert.deepEqual([...ANALYTICS_EVENTS].sort(), Object.keys(SPEC_EVENTS).sort());
  });

  it('fires every spec event somewhere, and nothing else', () => {
    assert.deepEqual([...new Set(fired.map((f) => f.name))].sort(), Object.keys(SPEC_EVENTS).sort());
  });

  it('sends each event with the spec props', () => {
    for (const f of fired) {
      const expected = SPEC_EVENTS[f.name];
      // Every call site must pass exactly the spec's prop keys (cta_click: cta and location).
      const keys = [...new Set(f.keys)].sort();
      assert.deepEqual(keys, expected, `${f.name} at ${f.where}: props ${keys.join(',') || '(none)'}`);
    }
  });
});
