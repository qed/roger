// Types and the button style table shared by Cta, the offer CTAs, the sticky bar and form submit buttons.
// Kept out of Cta.tsx so that file only exports components (react-refresh).
import type { AnalyticsEventName } from '../../lib/analyticsEvents';

export type TrackedEvent = { name: AnalyticsEventName; props?: Record<string, string | number | boolean> };

export type CtaVariant = 'primary' | 'secondary' | 'text';
export type CtaTone = 'light' | 'dark'; // dark = placed on an ink background
export type CtaSize = 'sm' | 'md' | 'lg';
// inline → cta_click { cta, location }; sticky → sticky_cta_click { cta } (spec §9.7).
export type CtaSurface = 'inline' | 'sticky';
// Where a CTA sits, for cta_click analytics. The one list of locations.
export type CtaLocation = 'hero' | 'header' | 'picker' | 'pricing' | 'final' | 'library' | 'library-band' | 'workshops' | 'thanks' | 'sticky';

const base =
  'inline-flex items-center justify-center text-center font-medium transition-colors duration-150 disabled:cursor-not-allowed';

const sizes: Record<CtaSize, string> = {
  sm: 'min-h-[40px] rounded-full px-4 py-2 text-sm',
  md: 'min-h-[44px] rounded-full px-5 py-2.5 text-[15px]',
  lg: 'min-h-[52px] rounded-full px-7 py-3 text-base'
};

const variants: Record<CtaTone, Record<CtaVariant, { live: string; off: string }>> = {
  light: {
    primary: { live: 'bg-ink text-cream hover:bg-ink/85', off: 'bg-rule text-ink-soft' },
    secondary: {
      live: 'border border-ink/70 text-ink hover:bg-ink hover:text-cream',
      off: 'border border-rule text-ink-soft'
    },
    text: {
      live: 'text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper',
      off: 'text-ink-soft'
    }
  },
  dark: {
    primary: { live: 'bg-cream text-ink hover:bg-paper', off: 'bg-cream/15 text-cream/80' },
    secondary: {
      live: 'border border-cream/70 text-cream hover:bg-cream hover:text-ink',
      off: 'border border-cream/30 text-cream/80'
    },
    text: {
      live: 'text-cream underline decoration-copper-light underline-offset-4',
      off: 'text-cream/80'
    }
  }
};

export function ctaClassName({
  variant = 'primary',
  tone = 'light',
  size = 'md',
  live,
  fullWidth = false,
  className = ''
}: {
  variant?: CtaVariant;
  tone?: CtaTone;
  size?: CtaSize;
  live: boolean;
  fullWidth?: boolean;
  className?: string;
}): string {
  const style = variants[tone][variant];
  const shape = variant === 'text' ? 'text-[15px]' : sizes[size];
  return [base, shape, fullWidth ? 'w-full' : '', live ? style.live : style.off, className].filter(Boolean).join(' ');
}
