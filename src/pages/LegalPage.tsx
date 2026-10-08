import { Link } from 'react-router-dom';
import { usePageMeta } from '../components/layout/usePageMeta';
import { siteConfig } from '../data/config';
import {
  legalBannerCopy,
  legalContactCopy,
  legalHeadings,
  legalMeta,
  privacyCopy,
  refundsCopy,
  termsCopy
} from '../data/copy/legal';
import type { LegalKind, LegalSection } from '../data/copy/legal';
import { signoff } from '../data/signoff';

export type { LegalKind };

const linkClass = 'text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper';

function EmailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className={linkClass}>
      {email}
    </a>
  );
}

function Sections({ sections }: { sections: LegalSection[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <section key={`${i}-${s.heading}`} className="mt-10">
          <h2 className="font-serif text-2xl">{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p} className="mt-3">
              {p}
            </p>
          ))}
          {s.link && (
            <p className="mt-3">
              <Link to={s.link.to} className={linkClass}>
                {s.link.label}
              </Link>
            </p>
          )}
        </section>
      ))}
    </>
  );
}

function Refunds({ email }: { email: string }) {
  const { claimLine, how } = refundsCopy;
  return (
    <>
      <p className="mt-4 text-lg">{refundsCopy.intro}</p>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">{refundsCopy.definitionHeading}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {refundsCopy.definition.map((line) => (
            <li key={line}>{line}</li>
          ))}
          <li>
            {claimLine.lead}
            {email ? <EmailLink email={email} /> : claimLine.noEmail}
            {claimLine.rest}
          </li>
          {refundsCopy.after.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">{refundsCopy.howHeading}</h2>
        <p className="mt-3">
          {how.lead}
          {email && (
            <>
              {' '}
              {how.at} <EmailLink email={email} />
            </>
          )}{' '}
          {how.rest}
        </p>
      </section>
    </>
  );
}

// /terms, /privacy and /refunds (spec §6.12). One component; the copy lives in src/data/copy/legal.ts.
// Until signoff.legalReviewed is true each page shows the draft banner and is noindex.
export function LegalPage({ kind }: { kind: LegalKind }) {
  const reviewed = signoff.legalReviewed;
  usePageMeta({ title: legalMeta[kind].title, description: legalMeta[kind].description, noindex: !reviewed });
  const email = siteConfig.contactEmail.trim();

  return (
    <article aria-labelledby="legal-heading" className="mx-auto max-w-2xl px-4 py-16 text-ink-soft md:px-8 md:py-24">
      {!reviewed && (
        <div role="note" className="mb-8 rounded-lg border border-copper/40 bg-copper-wash px-4 py-3 text-sm text-ink">
          <strong className="font-semibold">{legalBannerCopy.label}.</strong> {legalBannerCopy.text}
        </div>
      )}
      <h1 id="legal-heading" className="font-serif text-4xl leading-tight text-ink md:text-5xl">
        {legalHeadings[kind]}
      </h1>
      {kind === 'refunds' && <Refunds email={email} />}
      {kind === 'terms' && (
        <>
          <p className="mt-4 text-lg">{termsCopy.intro}</p>
          <Sections sections={termsCopy.sections} />
        </>
      )}
      {kind === 'privacy' && (
        <>
          <p className="mt-4 text-lg">{privacyCopy.intro}</p>
          <Sections sections={privacyCopy.sections(siteConfig.analytics)} />
        </>
      )}
      <section className="mt-10">
        <h2 className="font-serif text-2xl">{legalContactCopy.heading}</h2>
        <p className="mt-3">
          {email ? (
            <>
              {legalContactCopy.withEmail} <EmailLink email={email} />.
            </>
          ) : (
            legalContactCopy.withoutEmail
          )}
        </p>
      </section>
    </article>
  );
}
