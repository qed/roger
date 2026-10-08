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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), absoluteOgImagePlugin()],
  define: {
    __VERCEL_ENV__: JSON.stringify(vercelEnv)
  }
});
