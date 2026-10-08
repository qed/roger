import { usePageMeta } from '../components/layout/usePageMeta';
import { ThanksBooking } from '../components/sections/ThanksBooking';
import { thanksHomeCopy } from '../data/copy/thanks';
import { renderLine } from '../lib/claims';

// /thanks/home (spec §9.4): Stripe redirects here after the home payment. noindex; picks stay in storage.
// The session timing line is gated by signoff.homeSessionLeadConfirmed (spec §6A.6, §8.4.3).
export function ThanksHomePage() {
  usePageMeta({ title: thanksHomeCopy.meta.title, noindex: true });
  return <ThanksBooking kind="home" copy={{ ...thanksHomeCopy, timing: renderLine(thanksHomeCopy.timing) }} />;
}
