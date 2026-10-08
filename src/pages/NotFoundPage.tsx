import { Link } from 'react-router-dom';
import { ctaClassName } from '../components/cta/ctaStyles';
import { usePageMeta } from '../components/layout/usePageMeta';
import { notFoundCopy } from '../data/copy/thanks';

// Catch-all for unknown routes, including /launch on production builds. noindex.
export function NotFoundPage() {
  usePageMeta({ title: notFoundCopy.meta.title, noindex: true });
  return (
    <section aria-labelledby="not-found-heading" className="mx-auto max-w-2xl px-4 py-24 md:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-copper">{notFoundCopy.eyebrow}</p>
      <h1 id="not-found-heading" className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
        {notFoundCopy.heading}
      </h1>
      <p className="mt-4 text-lg text-ink-soft">{notFoundCopy.body}</p>
      <ul className="mt-8 flex flex-col gap-3 sm:flex-row">
        {notFoundCopy.links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className={ctaClassName({ variant: 'secondary', live: true, fullWidth: true })}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
