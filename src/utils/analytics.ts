import { siteConfig } from '../data/config';

type EventProps = Record<string, string | number | boolean>;

// Analytics hook placeholder. Off by default — enable in siteConfig.analytics.
export function trackEvent(name: string, props: EventProps = {}): void {
  if (!siteConfig.analytics.enabled || typeof window === 'undefined') return;
  const w = window as unknown as {
    plausible?: (event: string, options?: {props: EventProps;}) => void;
    gtag?: (command: string, event: string, params?: EventProps) => void;
  };
  if (siteConfig.analytics.provider === 'plausible') w.plausible?.(name, { props });else
  w.gtag?.('event', name, props);
}