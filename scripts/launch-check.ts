// npm run launch-check — prints the launch checklist (spec §8.4.4).
//   --write   writes src/generated/launch-status.json (read by the preview banner and /launch)
//   --strict  exits 1 if any blocking item is undone
//   --json    prints the status as JSON instead of the table (for scripts and agents)
// The build runs this with --write; strictness then follows resolveBuildEnv (fails closed on Vercel).
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { caseStudies } from '../src/data/caseStudies.ts';
import { siteConfig } from '../src/data/config.ts';
import { evaluateLaunch, formatSummary, groupLaunchItems } from '../src/data/launch.ts';
import { signoff } from '../src/data/signoff.ts';
import { resolveBuildEnv } from './build-env.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const args = new Set(process.argv.slice(2));
const env = resolveBuildEnv(process.env);
const strict = args.has('--strict') || env.mode === 'strict';

// A config path like '/peter.jpg' counts only if it is a real file inside public/ ('..' can't escape).
function assetExists(publicPath: string): boolean {
  const file = resolve(publicDir, publicPath.replace(/^\/+/, ''));
  const rel = relative(publicDir, file);
  if (!rel || rel.startsWith('..') || rel.includes(`..${sep}`)) return false;
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

const status = evaluateLaunch({ config: siteConfig, signoff, caseStudies, assetExists });
const summary = formatSummary(status);
const header = `launch-check: VERCEL_ENV=${process.env.VERCEL_ENV ?? 'unset'} VERCEL=${process.env.VERCEL ?? '0'} mode=${strict ? 'strict' : 'report'}`;

if (args.has('--json')) {
  console.log(JSON.stringify({ mode: strict ? 'strict' : 'report', summary, ...status }, null, 2));
} else {
  console.log(header);
  for (const group of groupLaunchItems(status.items)) {
    console.log(`\n${group.title}`);
    for (const item of group.items) console.log(`  ${item.done ? '✅' : '❌'} ${item.label} (${item.kind})`);
  }
  console.log(`\n${summary}`);
}

if (args.has('--write')) {
  const file = join(root, 'src', 'generated', 'launch-status.json');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify({ summary, ...status }, null, 2)}\n`);
}

if (strict && status.blockingMissing.length) {
  const labels = status.items.filter((i) => status.blockingMissing.includes(i.id)).map((i) => `  - ${i.label}`);
  console.error(`\nProduction build blocked. Missing blocking launch items:\n${labels.join('\n')}`);
  process.exit(1);
}
