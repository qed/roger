import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { zackAgents } from "@/data/zack";
import { CopyButton } from "@/app/hampton/copy-button";

async function liveAgents() {
  "use cache";
  return Promise.all(
    zackAgents
      .filter((a) => a.available)
      .map(async (a) => ({
        ...a,
        text: await readFile(
          path.join(process.cwd(), "public/zack", a.file),
          "utf8",
        ),
      })),
  );
}

export async function CirclesZackPage() {
  const agents = await liveAgents();
  return (
    <>
      <section className="on-night bg-night text-night-ink">
        <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-meta font-semibold uppercase tracking-wider text-night-ink-2">
            Zack the Collector
          </p>
          <h1 className="mt-5 max-w-[13ch] text-display">
            Find out what your agent did this week.
          </h1>
          <p className="mt-8 max-w-[42rem] text-lead text-night-ink-2">
            Zack reviews your past week with your agent, picks your best plays
            and estimates the time each saved. It runs in your own account.
            Nothing reaches Roger unless you choose to share it.
          </p>
          <ol className="mt-10 grid gap-6 border-t border-night-rule pt-7 md:grid-cols-3">
            <li>
              <span className="text-meta text-night-ink-2">01</span>
              <p className="mt-2 text-title">
                Download the file for your agent.
              </p>
            </li>
            <li>
              <span className="text-meta text-night-ink-2">02</span>
              <p className="mt-2 text-title">
                Attach it in your account and run the prompt.
              </p>
            </li>
            <li>
              <span className="text-meta text-night-ink-2">03</span>
              <p className="mt-2 text-title">
                Read your report. Remove private details.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section
        aria-labelledby="choose-title"
        className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:py-24"
      >
        <h2 id="choose-title" className="text-h2">
          Pick your agent.
        </h2>
        <p className="mt-5 max-w-[42rem] text-ink-2">
          These are the current Zack files. No account connection or report
          upload is needed for this preview.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {agents.map((a) => (
            <article
              key={a.slug}
              id={a.slug}
              className="scroll-mt-24 rounded-[8px] border border-rule bg-surface p-6 sm:p-8"
            >
              <h3 className="text-h3">{a.name}</h3>
              <p className="mt-2 text-small text-ink-2">
                Zack the Collector · current repo file
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  className="btn btn-m"
                  href={`/zack/${a.file}`}
                  download={`Zack The Collector (for ${a.name}).md`}
                >
                  Download .md
                </a>
                <CopyButton
                  className="btn btn-m border border-rule-strong bg-ground text-ink hover:bg-ground-2"
                  text={a.text}
                  label="Copy Zack"
                />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-[8px] bg-ground-2 p-6 sm:p-8">
          <h3 className="text-title">Then attach the file and ask:</h3>
          <p className="mt-4 max-w-[45rem] break-words rounded-[8px] border border-rule bg-surface p-5 font-mono text-small">
            Run Zack the Collector now from the attached file and create a .md
            output file.
          </p>
          <div className="mt-4">
            <CopyButton
              className="btn btn-m border border-rule-strong bg-ground text-ink hover:bg-ground-2"
              text="Run Zack the Collector now from the attached file and create a .md output file."
              label="Copy prompt"
            />
          </div>
          <p className="mt-6 text-small text-ink-2">
            Check your report for client names or private details. Keep it in
            your account for now. Application intake is not enabled on this
            preview.
          </p>
        </div>
        <div
          id="coming-soon"
          className="mt-12 scroll-mt-24 border-t border-rule pt-8"
        >
          <h3 className="text-title">Coming soon</h3>
          <p className="mt-3 text-ink-2">
            {zackAgents
              .filter((a) => !a.available)
              .map((a) => a.name)
              .join(" · ")}
          </p>
          <p className="mt-3 text-small text-ink-2">
            Interest sign-up will open with the application flow. No email
            addresses are collected here yet.
          </p>
        </div>
        <p className="mt-10">
          <Link href="/apply" className="tlink chev">
            See the Circle entry bar
          </Link>
        </p>
      </section>
    </>
  );
}
