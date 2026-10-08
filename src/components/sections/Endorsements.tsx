import type { Endorsement } from '../../lib/proofLines';
import { endorsementLogoSrc } from '../../lib/safeHref';

// Spec §6.4 slot 3 (also on /workshops, §6B.6): quote cards. Renders nothing when the list is empty.
// A logo shows only from this site's own files; its alt is the org (empty when there's no org name).
export function Endorsements({ items }: { items: readonly Endorsement[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {items.map((e, i) => {
        const logo = endorsementLogoSrc(e.logo);
        return (
          <li key={`${i}-${e.org}-${e.person}`}>
            <figure className="h-full rounded-2xl border border-rule bg-cream p-6">
              {logo && <img src={logo} alt={e.org.trim()} className="mb-4 h-8 w-auto" loading="lazy" />}
              <blockquote className="font-serif text-xl leading-snug text-ink">“{e.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-ink-soft">
                {e.person}
                {e.title && `, ${e.title}`}
                {e.org && ` · ${e.org}`}
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
