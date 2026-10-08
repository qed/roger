import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveBuildEnv } from './scripts/build-env';

// __VERCEL_ENV__ comes from the same function that decides whether the launch gate is strict, so a
// build that passed the strict gate is always built as production (no banner, no /launch).
const { define: vercelEnv } = resolveBuildEnv(process.env);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __VERCEL_ENV__: JSON.stringify(vercelEnv)
  }
});
