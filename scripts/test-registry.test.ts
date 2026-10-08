// Every *.test.ts must be listed in package.json's `test` script, or it silently never runs.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function testFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === 'node_modules' ? [] : testFiles(full);
    return name.endsWith('.test.ts') ? [relative(root, full).split(sep).join('/')] : [];
  });
}

describe('test registry', () => {
  it('runs every test file', () => {
    const script: string = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts.test;
    const listed = new Set(script.split(/\s+/).filter((s) => s.endsWith('.test.ts')));
    const missing = [...testFiles(join(root, 'src')), ...testFiles(join(root, 'scripts'))].filter((f) => !listed.has(f));
    assert.deepEqual(missing, []);
  });
});
