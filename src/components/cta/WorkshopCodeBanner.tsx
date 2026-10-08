import { workshopBannerCopy } from '../../data/copy/shared';
import type { MenuKind } from '../../data/menu';
import { useWorkshopCode } from '../../hooks/useWorkshopCode';
import { promoCodeFor } from '../../lib/workshopCode';
import { ToqueMark } from '../ToqueMark';
import { CHECKOUT_CTA, OFFER_CTAS } from './offerCtaTable';

// Spec §9.3. Shown only for an accepted (allow-listed) code AND when the offer's checkout link builds
// (the same builder the CTA uses, so href !== null), so it never promises a discount the visitor can't
// get. Names the exact Stripe promotion code.
export function WorkshopCodeBanner({ offer, className = '' }: { offer: MenuKind; className?: string }) {
  const code = useWorkshopCode();
  const { href } = OFFER_CTAS[CHECKOUT_CTA[offer]].useLink();
  if (!code || href === null) return null;
  return (
    <p
      role="status"
      className={`inline-flex items-center gap-2 rounded-full border border-copper/30 bg-copper-wash px-4 py-2 text-sm text-ink ${className}`}>
      <ToqueMark className="h-4 w-4 shrink-0 text-copper" />
      {workshopBannerCopy.text(promoCodeFor(code, offer))}
    </p>
  );
}
