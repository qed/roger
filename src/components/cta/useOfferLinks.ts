import type { MenuKind } from '../../data/menu';
import { usePicks } from '../../hooks/usePicks';
import { useWorkshopCode } from '../../hooks/useWorkshopCode';
import { fitCallUrl, homeCheckoutUrl, workDepositUrl } from '../../lib/checkoutLinks';
import { getUtmSource } from '../../utils/utm';

export type OfferLink = { href: string | null; picks: readonly string[] };

// Links are rebuilt on every render from the current picks, code and UTM source, so a CTA never sends
// stale picks (spec §9.5). null means the base link isn't configured yet ("Opening soon").
function useLinkContext(kind: MenuKind) {
  const { picks } = usePicks(kind);
  const code = useWorkshopCode();
  return { picks, code, utmSource: getUtmSource() };
}

export function useFitCallLink(): OfferLink {
  const ctx = useLinkContext('work');
  return { href: fitCallUrl(ctx), picks: ctx.picks };
}

export function useDepositLink(): OfferLink {
  const ctx = useLinkContext('work');
  return { href: workDepositUrl(ctx), picks: ctx.picks };
}

export function useHomeCheckoutLink(): OfferLink {
  const ctx = useLinkContext('home');
  return { href: homeCheckoutUrl(ctx), picks: ctx.picks };
}
