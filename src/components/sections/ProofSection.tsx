import { caseStudies } from '../../data/caseStudies';
import type { CaseStudy } from '../../data/caseStudies';
import { siteConfig } from '../../data/config';
import { proofCopy } from '../../data/copy/shared';
import { findMenuItem } from '../../data/menu';
import type { Audience } from '../../data/copy/types';
import { counterLine, publishedEndorsements } from '../../lib/proofLines';
import { headingFor, resolveWontDo } from '../../lib/proofSection';
import { FadeUp } from '../FadeUp';
import { Endorsements } from './Endorsements';

function publishable(study: CaseStudy, audience: Audience): boolean {
  return study.for === audience && study.permission === true && study.metrics.length > 0;
}

// Spec §6.4 (R9a). Slots in order: case studies, counter, endorsements, videos, Peter's own setup,
// sample report, reviews. Each hides when empty; the case-study heading belongs to the case studies.
// "What we won't do" always renders under its own heading, with its gated lines (spec §8.4.3).
export function ProofSection({ for: audience, id = 'proof' }: { for: Audience; id?: string }) {
  const { proof } = siteConfig;
  const studies = caseStudies.filter((study) => publishable(study, audience));
  const counter = counterLine(proof.counter);
  const endorsements = publishedEndorsements(proof.endorsements);
  const videos = proof.videos.filter((v) => v.src.trim());
  const screenshots = proof.screenshots.filter((s) => s.src.trim());
  const stats = proof.stats.filter((s) => s.value.trim() && s.label.trim());
  const wontDo = resolveWontDo(proofCopy.wontDo, audience);

  return (
    <section id={id} aria-label="Proof" className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 md:px-8 md:py-24">
        {studies.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">{headingFor(proofCopy.caseStudiesHeading, audience)}</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study) => (
                <li key={study.id}>
                  <CaseStudyCard study={study} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {counter && <p className="font-serif text-2xl text-ink md:text-3xl">{counter}</p>}

        <Endorsements items={endorsements} />

        {videos.length > 0 && (
          <ul className="grid gap-6 md:grid-cols-2">
            {videos.map((v) => (
              <li key={v.src}>
                <figure>
                  <video controls preload="none" poster={v.poster || undefined} className="aspect-video w-full rounded-2xl bg-ink">
                    <source src={v.src} type="video/mp4" />
                    {v.captionsVtt && <track kind="captions" src={v.captionsVtt} srcLang="en" label="English" default />}
                  </video>
                  {v.caption && <figcaption className="mt-3 text-sm text-ink-soft">{v.caption}</figcaption>}
                </figure>
              </li>
            ))}
          </ul>
        )}

        {(screenshots.length > 0 || stats.length > 0) && (
          <div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">{headingFor(proofCopy.screenshotsHeading, audience)}</h2>
            {screenshots.length > 0 && (
              <ul className="mt-8 grid gap-6 md:grid-cols-3">
                {screenshots.map((s) => (
                  <li key={s.src}>
                    <figure>
                      <img src={s.src} alt={s.caption} loading="lazy" className="w-full rounded-2xl border border-rule" />
                      <figcaption className="mt-3 text-sm text-ink-soft">{s.caption}</figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            )}
            {stats.length > 0 && (
              <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="text-sm text-ink-soft">{s.label}</dt>
                    <dd className="font-serif text-3xl text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}

        {(proof.sampleReport.trim() || proof.reviewsUrl.trim()) && (
          <p className="flex flex-wrap gap-x-8 gap-y-3 text-base">
            {proof.sampleReport.trim() && (
              <a href={proof.sampleReport} className="text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
                {proofCopy.sampleReport}
              </a>
            )}
            {proof.reviewsUrl.trim() && (
              <a
                href={proof.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline decoration-copper/60 underline-offset-4 hover:decoration-copper">
                {proofCopy.reviews}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </p>
        )}

        <FadeUp>
          <h2 className="font-serif text-2xl leading-tight md:text-3xl">{proofCopy.wontDoHeading}</h2>
          <ul className="mt-6 max-w-3xl space-y-3 text-base leading-relaxed text-ink-soft md:text-lg">
            {wontDo.map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-copper" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const image = study.photo || study.logo;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-rule bg-cream p-6">
      <div className="flex items-center gap-3">
        {image && (
          <img
            src={image}
            alt={study.photo ? study.name : `${study.business} logo`}
            loading="lazy"
            className={`h-12 w-12 shrink-0 ${study.photo ? 'rounded-full object-cover' : 'object-contain'}`}
          />
        )}
        <div>
          <h3 className="font-medium text-ink">
            {study.name}, {study.role}
          </h3>
          <p className="text-sm text-ink-soft">
            {study.business} · {study.businessType}
          </p>
        </div>
      </div>
      <dl className="mt-6 space-y-4">
        {study.metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-sm text-ink-soft">{metric.label}</dt>
            <dd className="mt-1 flex flex-wrap items-baseline gap-x-3 font-serif text-3xl text-ink">
              <span>
                <span className="sr-only">{proofCopy.metricBefore}: </span>
                {metric.before}
              </span>
              <span aria-hidden="true" className="text-copper">
                →
              </span>
              <span>
                <span className="sr-only">{proofCopy.metricAfter}: </span>
                {metric.after}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      {study.setUp.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Set up">
          {study.setUp.map((id) => {
            const item = findMenuItem(id);
            return item ? (
              <li key={id} className="rounded-full bg-copper-wash px-3 py-1 text-xs text-ink">
                {item.title}
              </li>
            ) : null;
          })}
        </ul>
      )}
      <blockquote className="mt-6 border-t border-rule pt-4 font-serif text-lg leading-snug text-ink">“{study.quote}”</blockquote>
    </article>
  );
}
