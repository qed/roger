import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Apply for a founding Circle",
  description: "The entry bar for Roger's founding Circles.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/apply" },
};

// Deliberately no form, report box, fake submit or email side effect in this pass.
// The launch version needs the complete two-step persistence and token flow.
export default function ApplyPage() {
  if (!siteConfig.flags.circlesMode) notFound();
  return (
    <section className="mx-auto max-w-[760px] px-4 py-20 sm:px-6 lg:py-28">
      <p className="text-meta font-semibold uppercase tracking-wider text-accent">
        Founding Roger Circles
      </p>
      <h1 className="mt-5 text-h2">First, are we a fit?</h1>
      <p className="mt-6 text-lead text-ink-2">
        A Circle is for people who already use AI agents heavily for work.
      </p>
      <ul className="mt-10 space-y-4 border-y border-rule py-8 text-title">
        <li>You use AI agents for work every day.</li>
        <li>You run three or more agents, bots or scheduled routines.</li>
        <li>
          You&apos;ve run Zack and can show real plays from the past week.
        </li>
      </ul>
      <div
        role="note"
        className="mt-10 rounded-[8px] border border-rule bg-ground-2 p-6"
      >
        <h2 className="text-title">
          Applications aren&apos;t open on this preview.
        </h2>
        <p className="mt-3 text-ink-2">
          The two-step application is still being built. Nothing is submitted or
          saved here. You can run Zack in your own account now. Keep your report
          with you until applications open.
        </p>
      </div>
      <p className="mt-8">
        <Link href="/zack" className="btn">
          Run Zack on yourself
        </Link>
      </p>
      <p className="mt-6 text-small text-ink-2">
        Nothing is charged to apply. Membership is US$200 or CA$280 a month,
        starting when your Circle kicks off.
      </p>
      <p className="mt-8">
        <Link href="/#how" className="tlink">
          Back to how a Circle works
        </Link>
      </p>
    </section>
  );
}
