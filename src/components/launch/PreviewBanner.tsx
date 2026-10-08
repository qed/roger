import { Link } from 'react-router-dom';
import { formatBanner } from '../../data/launch';
import { launchStatus } from './launchStatus';

// Preview-only strip (spec §8.4.6). Never in production builds: App.tsx lazy-loads it inside an
// `__VERCEL_ENV__ !== 'production'` branch.
export default function PreviewBanner() {
  const text = launchStatus ? formatBanner(launchStatus) : 'Launch check: run npm run launch-check';
  return (
    <div className="bg-ink px-4 py-1.5 text-center text-xs text-cream">
      <Link to="/launch" className="underline-offset-2 hover:underline">
        {text} →
      </Link>
    </div>
  );
}
