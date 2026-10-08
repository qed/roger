// npm run test:bundle — proves the preview-only launch tools never ship to production (spec §12).
// Builds twice into temp folders, calling Vite directly (with ROGER_BUNDLE_CHECK=1, the escape hatch the
// vite.config.ts launch gate honours) so the gate doesn't block the production-mode build: once as
// production (must contain none of the markers) and once as a preview (must contain them, so the check
// can't pass vacuously).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const viteBin = join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const MARKERS = ['Launch check', 'blockingMissing', 'launch-status'];

function buildAndScan(vercelEnv: 'production' | 'preview'): string[] {
  const outDir = mkdtempSync(join(tmpdir(), `roger-${vercelEnv}-`));
  try {
    // ROGER_BUNDLE_CHECK=1 lets the production-mode build past vite.config.ts's launch gate: this output
    // goes to a temp folder, is scanned and deleted, never deployed.
    const env = { ...process.env, VERCEL: '1', VERCEL_ENV: vercelEnv, ROGER_BUNDLE_CHECK: '1' };
    const result = spawnSync(process.execPath, [viteBin, 'build', '--outDir', outDir, '--emptyOutDir'], {
      cwd: root,
      env,
      encoding: 'utf8'
    });
    if (result.status !== 0) throw new Error(`vite build (${vercelEnv}) failed:\n${result.stderr}`);
    const assets = join(outDir, 'assets');
    const text = readdirSync(assets)
      .filter((f) => f.endsWith('.js'))
      .map((f) => readFileSync(join(assets, f), 'utf8'))
      .join('\n');
    return MARKERS.filter((m) => text.includes(m));
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
}

const inProduction = buildAndScan('production');
const inPreview = buildAndScan('preview');
let failed = false;
if (inProduction.length) {
  console.error(`FAIL: production bundle contains launch tooling: ${inProduction.join(', ')}`);
  failed = true;
}
if (inPreview.length === 0) {
  console.error('FAIL: preview bundle has no launch tooling; the markers are stale, so this check proves nothing.');
  failed = true;
}
if (failed) process.exit(1);
console.log(`bundle-check: production clean; preview has ${inPreview.join(', ')}`);
