import Link from "next/link";
import { zackAgents } from "@/data/zack";

export function CirclesAgents() {
  return (
    <div className="border-t border-night-rule">
      <div className="mx-auto max-w-[1180px] px-4 pb-14 pt-9 text-center sm:px-6">
        <p className="text-meta font-semibold text-night-ink-2">Zack runs on</p>
        <ul className="mt-4 flex flex-wrap justify-center">
          {zackAgents
            .filter((a) => a.available)
            .map((a) => (
              <li
                key={a.slug}
                className="-mb-px -mr-px border border-night-rule px-6 py-3 text-title sm:px-10"
              >
                <Link
                  href={`/zack#${a.slug}`}
                  className="rounded hover:underline"
                >
                  {a.name}
                </Link>
              </li>
            ))}
        </ul>
        <p className="mt-5 text-small text-night-ink-2">
          Coming soon:{" "}
          {zackAgents
            .filter((a) => !a.available)
            .map((a, i) => (
              <span key={a.slug}>
                {i > 0 && " · "}
                <Link
                  href="/zack#coming-soon"
                  className="text-accent-night hover:underline"
                >
                  {a.name}
                </Link>
              </span>
            ))}
        </p>
        <p className="mx-auto mt-3 max-w-[38rem] text-small">
          Circles mix agents. Every playbook tells your own agent to adapt it to
          your setup and install it.
        </p>
      </div>
    </div>
  );
}
