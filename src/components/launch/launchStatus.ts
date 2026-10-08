// Reads src/generated/launch-status.json (written by `npm run launch-check -- --write`).
// Imported only by the preview-only banner and /launch page, which are lazily loaded inside an
// `__VERCEL_ENV__ !== 'production'` branch, so this JSON never reaches the production bundle.
// import.meta.glob returns {} when the file is missing (fresh clone before `npm run dev`).
import type { LaunchStatus } from '../../data/launch';

type GeneratedStatus = LaunchStatus & { summary: string };

const files = import.meta.glob('../../generated/launch-status.json', { eager: true, import: 'default' });

// The file is gitignored and can be left over from an older schema; trust it only if it has the shape we use.
function isStatus(value: unknown): value is GeneratedStatus {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<GeneratedStatus>;
  return (
    typeof v.summary === 'string' &&
    Array.isArray(v.items) &&
    Array.isArray(v.blockingMissing) &&
    typeof v.done === 'number' &&
    typeof v.total === 'number'
  );
}

const loaded = Object.values(files)[0];
export const launchStatus: GeneratedStatus | null = isStatus(loaded) ? loaded : null;
