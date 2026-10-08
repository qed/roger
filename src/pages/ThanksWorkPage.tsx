import { usePageMeta } from '../components/layout/usePageMeta';
import { ThanksBooking } from '../components/sections/ThanksBooking';
import { thanksWorkCopy } from '../data/copy/thanks';

// /thanks/work (spec §9.2): Stripe redirects here after the deposit. noindex; picks stay in storage.
export function ThanksWorkPage() {
  usePageMeta({ title: thanksWorkCopy.meta.title, noindex: true });
  return <ThanksBooking kind="work" copy={thanksWorkCopy} />;
}
