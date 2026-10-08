import { siteConfig } from '../../data/config';
import { bookingFallbackCopy } from '../../data/copy/thanks';
import type { MenuKind } from '../../data/menu';
import { usePicks } from '../../hooks/usePicks';
import { homeSessionUrl, picksTitles, workSessionUrl } from '../../lib/checkoutLinks';
import { thanksBookingModel } from '../../lib/thanks';
import { Cta } from '../cta/Cta';

export type ThanksBookingCopy = {
  eyebrow: string;
  heading: string;
  receipt: string;
  book: string;
  bookNote?: string;
  timing?: string | null; // already rendered through renderLine; shown only beside a live booking link
  picksLabel: string;
  checklistHeading: string;
  checklist: readonly string[];
};

// Body of /thanks/work and /thanks/home (spec §9.2, §9.4). Reads the picks (never clears them), builds
// the Cal session link with the picks prefilled, and fires no analytics: no `cta` prop on the Cta.
// A missing Cal link shows the "I'll email you" fallback instead of "Opening soon", since they've paid.
export function ThanksBooking({ kind, copy }: { kind: MenuKind; copy: ThanksBookingCopy }) {
  const { picks } = usePicks(kind);
  const titles = picksTitles(picks);
  const email = siteConfig.contactEmail.trim();
  const model = thanksBookingModel({
    kind,
    href: (kind === 'work' ? workSessionUrl : homeSessionUrl)({ picks }),
    contactEmail: siteConfig.contactEmail,
    mailtoSubject: bookingFallbackCopy.mailtoSubject,
    hasTiming: Boolean(copy.timing)
  });

  return (
    <section aria-labelledby="thanks-heading" className="mx-auto max-w-2xl px-4 py-16 md:px-8 md:py-24">
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-copper">{copy.eyebrow}</p>
      <h1 id="thanks-heading" className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
        {copy.heading}
      </h1>
      <p className="mt-3 text-lg text-ink-soft">{copy.receipt}</p>

      <div className="mt-10">
        {model.href !== null ? (
          <Cta href={model.href} label={copy.book} size="lg" newTab note={copy.bookNote && <p className="text-sm text-ink-soft">{copy.bookNote}</p>} />
        ) : (
          <div role="status" className="rounded-2xl border border-rule bg-paper p-5">
            <p className="font-medium">{bookingFallbackCopy.text}</p>
            {model.mailto && (
              <p className="mt-2 text-ink-soft">
                {bookingFallbackCopy.emailLead}{' '}
                <a
                  href={model.mailto}
                  className="break-all text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
                  {email}
                </a>
                .
              </p>
            )}
          </div>
        )}
        {model.showTiming && <p className="mt-4 text-ink-soft">{copy.timing}</p>}
      </div>

      {titles && (
        <p className="mt-8">
          <span className="font-medium">{copy.picksLabel}</span> {titles}
        </p>
      )}

      <h2 className="mt-12 font-serif text-2xl">{copy.checklistHeading}</h2>
      <ul className="mt-4 space-y-3">
        {copy.checklist.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
