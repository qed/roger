import { siteConfig } from '../../data/config';
import { capacityParts, heroProofParts } from '../../lib/proofLines';

type Variant = 'hero' | 'capacity';

// Hero proof line (spec §6.2, R9b): setups and refunds appear only once setups ≥ 3; spots left and the
// capacity line always show. `capacity` renders only the spots-left · capacity line (spec §6.11, §6A.1).
type HeroProofLineProps = { variant?: Variant; tone?: 'light' | 'dark'; className?: string };

export function HeroProofLine({ variant = 'hero', tone = 'light', className = '' }: HeroProofLineProps) {
  const parts =
    variant === 'hero'
      ? heroProofParts(siteConfig.proof.counter, siteConfig.founding, siteConfig.capacityLine)
      : capacityParts(siteConfig.founding, siteConfig.capacityLine);
  if (!parts.length) return null;
  return (
    <p className={`text-sm ${tone === 'dark' ? 'text-cream/80' : 'text-ink-soft'} ${className}`}>
      {parts.map((part, i) => (
        <span key={part}>
          {i > 0 && (
            <span aria-hidden="true" className="px-1.5">
              ·
            </span>
          )}
          {part}
        </span>
      ))}
    </p>
  );
}
