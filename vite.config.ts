import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveBuildEnv } from './scripts/build-env';
import { absoluteOgImage } from './scripts/og-image';

// __VERCEL_ENV__ comes from the same function that decides whether the launch gate is strict, so a
// build that passed the strict gate is always built as production (no banner, no /launch).
const { define: vercelEnv } = resolveBuildEnv(process.env);

// Production builds on Vercel make the og:image / twitter:image URLs absolute (see scripts/og-image.ts).
function absoluteOgImagePlugin(): Plugin {
  const host = vercelEnv === 'production' ? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? '') : '';
  return {
    name: 'roger-absolute-og-image',
    transformIndexHtml(html) {
      if (!host) return html;
      const result = absoluteOgImage(html, host);
      if (result.replaced === 0) console.warn('[og-image] no og:image tags rewritten; check index.html');
      return result.html;
    }
  };
}

// Defence in depth for the launch gate: `npm run build` runs launch-check first, but a bare `vite build`
// (a changed Vercel build command, a dashboard override) would skip it. So a strict build (Vercel
// production, see resolveBuildEnv) re-runs the check here and fails before anything is bundled.
// ROGER_BUNDLE_CHECK=1 is the one escape hatch: scripts/bundle-check.ts builds a production-mode bundle
// into a temp folder only to scan it for preview tooling; that output is never deployed.
function launchGatePlugin(): Plugin {
  return {
    name: 'roger-launch-gate',
    apply: 'build',
    buildStart() {
      if (resolveBuildEnv(process.env).mode !== 'strict') return;
      if (process.env.ROGER_BUNDLE_CHECK === '1') return;
      const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/launch-check.ts', '--strict'], {
        cwd: fileURLToPath(new URL('.', import.meta.url)),
        encoding: 'utf8'
      });
      if (result.status !== 0) {
        const detail = result.stderr || result.error?.message || '';
        throw new Error(`Launch check failed; production build blocked.\n${detail}`);
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [launchGatePlugin(), react(), absoluteOgImagePlugin()],
  define: {
    __VERCEL_ENV__: JSON.stringify(vercelEnv)
  }
});
