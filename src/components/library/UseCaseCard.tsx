import { Link } from 'react-router-dom';
import { categoryLabels, libraryCopy } from '../../data/copy/library';
import type { UseCase } from '../../data/library';
import { trackEvent } from '../../utils/analytics';

// Split a spec label like "Read the original ↗" into its words and the decorative arrow, so screen
// readers hear the words only.
function withArrow(label: string) {
  const match = /^(.*?)\s*([↗→])$/.exec(label);
  if (!match) return label;
  return (
    <>
      {match[1]}
      <span aria-hidden="true"> {match[2]}</span>
    </>
  );
}

const audienceLabel = (kind: UseCase['for']) => libraryCopy.audiences.find((a) => a.value === kind)?.label ?? kind;

// One library entry (spec §7.3): text only — no embeds, no profile images. Credits the handle, links the
// original (new tab, nofollow) and routes back to the matching offer. Both links are described by the
// card's title, so a list of links isn't dozens of identical names.
export function UseCaseCard({ entry }: { entry: UseCase }) {
  const offerHref = entry.for === 'work' ? '/#pricing' : '/home';
  const titleId = `use-case-${entry.id}`;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-rule bg-paper p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-faint">
        {categoryLabels[entry.category]} · {audienceLabel(entry.for)}
      </p>
      <h3 id={titleId} className="mt-3 font-serif text-xl leading-snug text-ink">
        {entry.title}
      </h3>
      {entry.outcome === 'honest-miss' && (
        <p className="mt-2 inline-block self-start rounded-full bg-copper-wash px-3 py-1 text-xs font-medium text-ink">
          {libraryCopy.honestMiss}
        </p>
      )}
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{entry.summary}</p>
      <p className="mt-4 text-sm text-ink-faint">
        {entry.tool ? `${entry.tool} · ` : ''}
        {libraryCopy.via} {entry.handle}
      </p>
      <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-5 text-[15px]">
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-describedby={titleId}
          onClick={() => trackEvent('library_outbound', { id: entry.id })}
          className="text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
          {withArrow(libraryCopy.readOriginal)}
          <span className="sr-only">{libraryCopy.newTab}</span>
        </a>
        <Link
          to={offerHref}
          aria-describedby={titleId}
          onClick={() => trackEvent('library_to_offer', { id: entry.id })}
          className="font-medium text-copper underline-offset-4 hover:underline">
          {withArrow(libraryCopy.setUp)}
        </Link>
      </div>
    </article>
  );
}
