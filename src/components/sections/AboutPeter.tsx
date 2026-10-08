import { siteConfig } from '../../data/config';
import { aboutCopy } from '../../data/copy/shared';
import { renderLine } from '../../lib/claims';
import { FadeUp } from '../FadeUp';

// Spec §6.9 (R10). The photo renders only when config.founder.photo is set (never a stock stand-in);
// the bio only once signoff.bioApproved is true; links only when present. No placeholder quotes.
export function AboutPeter({ id = 'about' }: { id?: string }) {
  const { founder } = siteConfig;
  const photo = founder.photo.trim();
  const links = founder.links.filter((link) => link.href.trim() && link.label.trim());
  const bio = renderLine(aboutCopy.bio);
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-rule">
      <FadeUp className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-[auto,1fr] md:items-center md:px-8 md:py-24">
        {photo && (
          <img
            src={photo}
            alt={founder.name}
            width={240}
            height={240}
            loading="lazy"
            className="h-40 w-40 rounded-full object-cover md:h-60 md:w-60"
          />
        )}
        <div>
          <p className="text-sm uppercase tracking-[0.14em] text-copper">{aboutCopy.eyebrow}</p>
          <h2 id={`${id}-heading`} className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
            {founder.name}
          </h2>
          <p className="mt-1 text-ink-soft">{founder.city}</p>
          {bio && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">{bio}</p>}
          {links.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => {
                const isX = /(^|\.)(x|twitter)\.com$/i.test(safeHost(link.href));
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel={isX ? 'noopener noreferrer nofollow' : 'noopener noreferrer'}
                      className="text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
                      {link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </FadeUp>
    </section>
  );
}

function safeHost(href: string): string {
  try {
    return new URL(href).hostname;
  } catch {
    return '';
  }
}
