import Link from "next/link";
import { getUseCases, getVerifiedUseCaseCount } from "@/lib/library-source";
import { UseCaseCard } from "@/components/use-case-card";

export async function CirclesProof() {
  const [cases, total] = await Promise.all([
    getUseCases(),
    getVerifiedUseCaseCount(),
  ]);
  const recent = [...cases]
    .sort((a, b) =>
      (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf),
    )
    .slice(0, 6);
  // getUseCases can fall back to seed data. Do not turn that into a live-count claim.
  return (
    <section id="proof" aria-labelledby="proof-title" className="bg-ground">
      <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 lg:py-28">
        <div
          aria-hidden="true"
          className="mx-auto mb-8 h-14 w-0 border-l border-dashed border-rule-strong"
        />
        <p className="text-center text-meta font-semibold text-ink-2">
          The public use-case library
        </p>
        <h2
          id="proof-title"
          className="mx-auto mt-4 max-w-[46rem] text-center text-h2"
        >
          {total === null
            ? "Real uses collected from public posts."
            : `${total.toLocaleString("en-CA")} real uses collected from public posts.`}
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((u) => (
            <UseCaseCard key={u.id} u={u} />
          ))}
        </div>
        <p className="mt-10 text-center text-lead">
          This is what people post. A Circle gets what they don&apos;t.
        </p>
        <p className="mt-5 text-center">
          <Link href="/library" className="tlink chev">
            Browse the library
          </Link>
        </p>
      </div>
    </section>
  );
}
