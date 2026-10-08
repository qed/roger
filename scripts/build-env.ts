// Decides how a build treats the launch checklist. Shared by scripts/launch-check.ts (strict or report)
// and vite.config.ts (the __VERCEL_ENV__ define), so the two can never disagree.
//
// Fails closed (deliberate tightening of spec §8.4.5): on Vercel, any build that is not explicitly a
// preview is treated as production. A missing or unexpected VERCEL_ENV must never let an unfinished
// site through, or ship the preview banner and /launch page to production.
// Invariant: mode === 'strict' exactly when define === 'production'.
export type VercelEnvDefine = 'production' | 'preview' | 'development';
export type BuildEnv = { mode: 'strict' | 'report'; define: VercelEnvDefine };

export function resolveBuildEnv(env: Record<string, string | undefined>): BuildEnv {
  const vercelEnv = env.VERCEL_ENV;
  const onVercel = env.VERCEL === '1';
  const strict = vercelEnv === 'production' || (onVercel && vercelEnv !== 'preview');
  if (strict) return { mode: 'strict', define: 'production' };
  return { mode: 'report', define: vercelEnv === 'preview' ? 'preview' : 'development' };
}
