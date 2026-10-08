import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FitCallCta } from '../components/cta/OfferCtas';
import { FINAL_CTA_ID, HERO_CTA_ID, StickyCtaBar } from '../components/cta/StickyCtaBar';
import { NewsletterForm } from '../components/forms/NewsletterForm';
import { PRESERVE_SCROLL_STATE } from '../components/layout/navigationState';
import { usePageMeta } from '../components/layout/usePageMeta';
import { UseCaseCard } from '../components/library/UseCaseCard';
import { categoryLabels, libraryCopy, libraryMeta } from '../data/copy/library';
import { library } from '../data/library';
import type { UseCase } from '../data/library';
import {
  SEARCH_MAX,
  applyLibraryParams,
  canonicalSearch,
  categoriesFor,
  filterLibrary,
  normaliseForAudience,
  parseLibraryParams,
  serialiseLibraryParams
} from '../lib/libraryFilter';
import type { LibraryParams } from '../lib/libraryFilter';
import { trackEvent } from '../utils/analytics';

const SEARCH_DEBOUNCE_MS = 400;

// `/library` (spec §7): free, browsable, and every card routes back to an offer. Filters live in the URL
// (for, cat, q). They change it with replace, so filtering never adds history entries or scrolls, and they
// only touch their own keys, so utm_* and other params survive.
export function LibraryPage() {
  usePageMeta({ title: libraryMeta.title, description: libraryMeta.description });
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = normaliseForAudience(library, parseLibraryParams(searchParams));

  const go = (search: string) =>
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '', hash: location.hash }, { replace: true, state: PRESERVE_SCROLL_STATE });

  // Drop invalid or default library values from a deep link (e.g. ?cat=bogus) without a history entry.
  const canonical = canonicalSearch(searchParams, library);
  useEffect(() => {
    if (searchParams.toString() !== canonical) go(canonical);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `go` is rebuilt each render; the query is what matters
  }, [searchParams, canonical]);

  // The search box updates the URL after a short pause. The timer reads the latest URL state when it
  // fires (latest ref), and any filter click cancels it and carries the typed text along, so a chip
  // clicked mid-pause is never reverted.
  const [query, setQuery] = useState(params.q);
  const latest = useRef({ params, searchParams });
  latest.current = { params, searchParams };
  const timer = useRef<number | null>(null);
  const cancelTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const update = (next: LibraryParams) => {
    cancelTimer();
    const { params: current, searchParams: currentSearch } = latest.current;
    if (serialiseLibraryParams(next) === serialiseLibraryParams(current)) return;
    go(applyLibraryParams(currentSearch, next));
    trackEvent('library_filter', { cat: next.cat ?? 'all', for: next.for });
  };

  const onType = (value: string) => {
    setQuery(value);
    cancelTimer();
    timer.current = window.setTimeout(() => {
      timer.current = null;
      update({ ...latest.current.params, q: value });
    }, SEARCH_DEBOUNCE_MS);
  };

  // A URL change from elsewhere (back/forward, a link to /library) resets the box unless text is pending.
  useEffect(() => {
    if (timer.current === null) setQuery(params.q);
  }, [params.q, location.key]);
  useEffect(() => cancelTimer, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `params` is a new object each render; its three fields are the real inputs
  const results = useMemo(() => filterLibrary(library, params), [params.for, params.cat, params.q]);
  const categories = categoriesFor(library, params.for);
  const half = Math.ceil(results.length / 2);
  const searchRef = useRef<HTMLInputElement>(null);
  const clear = () => {
    setQuery('');
    update({ for: 'all', cat: null, q: '' });
    searchRef.current?.focus(); // the button that was clicked disappears with the empty state
  };

  return (
    <>
      <section aria-labelledby="library-heading">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 md:px-8 md:pt-14">
          <h1 id="library-heading" className="max-w-3xl font-serif text-[2.4rem] leading-[1.05] text-ink sm:text-5xl">
            {libraryCopy.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{libraryCopy.subhead}</p>
          <div id={HERO_CTA_ID} className="mt-7">
            <FitCallCta location="library" />
          </div>
        </div>
      </section>

      <section aria-label={libraryCopy.filtersLabel} className="border-t border-rule">
        <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 md:px-8">
          <div role="group" aria-label={libraryCopy.audienceLabel} className="flex flex-wrap gap-2">
            {libraryCopy.audiences.map((a) => (
              <FilterChip
                key={a.value}
                pressed={params.for === a.value}
                onClick={() => update(normaliseForAudience(library, { ...params, for: a.value, q: query }))}>
                {a.label}
              </FilterChip>
            ))}
          </div>
          <div role="group" aria-label={libraryCopy.categoryLabel} className="flex flex-wrap gap-2">
            <FilterChip pressed={params.cat === null} onClick={() => update({ ...params, cat: null, q: query })}>
              {libraryCopy.allCategories}
            </FilterChip>
            {categories.map((c) => (
              <FilterChip key={c} pressed={params.cat === c} onClick={() => update({ ...params, cat: params.cat === c ? null : c, q: query })}>
                {categoryLabels[c]}
              </FilterChip>
            ))}
          </div>
          <div className="max-w-md">
            <label htmlFor="library-search" className="block text-sm font-medium text-ink">
              {libraryCopy.searchLabel}
            </label>
            <input
              ref={searchRef}
              id="library-search"
              type="search"
              value={query}
              maxLength={SEARCH_MAX}
              onChange={(e) => onType(e.target.value)}
              placeholder={libraryCopy.searchPlaceholder}
              className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-4 text-base text-ink placeholder:text-ink-faint"
            />
          </div>
          <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-ink-faint">
            {libraryCopy.count(results.length, library.length)}
          </p>
        </div>
      </section>

      <section aria-labelledby="results-heading" className="border-t border-rule bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <h2 id="results-heading" className="sr-only">
            {libraryCopy.resultsHeading}
          </h2>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-rule bg-paper p-8 text-center">
              <p className="font-serif text-2xl text-ink">{libraryCopy.empty}</p>
              <button type="button" onClick={clear} className="mt-4 text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
                {libraryCopy.clear}
              </button>
            </div>
          ) : (
            <>
              <CardGrid entries={results.slice(0, half)} />
              {results.length > half && (
                <>
                  <FitCallBand />
                  <CardGrid entries={results.slice(half)} />
                </>
              )}
            </>
          )}
        </div>
      </section>

      <section id={FINAL_CTA_ID} aria-labelledby="library-final-heading" className="surface-dark border-t border-rule bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-8">
          <div>
            <h2 id="library-final-heading" className="font-serif text-3xl leading-tight">
              {libraryCopy.bandHeading}
            </h2>
            <p className="mt-3 text-cream/85">{libraryCopy.bandBody}</p>
            <div className="mt-6">
              <FitCallCta location="final" tone="dark" />
            </div>
          </div>
          <div>
            <p className="font-serif text-xl">{libraryCopy.newsletterHeading}</p>
            {/* Newsletter audience follows the filter; "All" defaults to the work list (the main offer). */}
            <NewsletterForm audience={params.for === 'home' ? 'home' : 'work'} tone="dark" className="mt-4" />
          </div>
        </div>
      </section>

      <StickyCtaBar ctas={['fitcall']} />
    </>
  );
}

function FilterChip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-150 ${
        pressed ? 'border-ink bg-ink text-cream' : 'border-rule bg-paper text-ink-soft hover:border-ink hover:text-ink'
      }`}>
      {children}
    </button>
  );
}

function CardGrid({ entries }: { entries: readonly UseCase[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((e) => (
        <li key={e.id} className="h-full">
          <UseCaseCard entry={e} />
        </li>
      ))}
    </ul>
  );
}

function FitCallBand() {
  return (
    <div className="my-8 flex flex-col items-start gap-4 rounded-2xl border border-rule bg-copper-wash p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-serif text-2xl text-ink">{libraryCopy.bandHeading}</h3>
        <p className="mt-1 text-ink-soft">{libraryCopy.bandBody}</p>
      </div>
      <FitCallCta location="library-band" />
    </div>
  );
}
