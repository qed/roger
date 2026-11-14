"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/data/config";

type Currency = "USD" | "CAD";
const storageKey = "roger-circles-currency";

function readCurrency(initial: Currency): Currency {
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved === "USD" || saved === "CAD") return saved;
  } catch {
    /* Private browsing may disable storage. */
  }
  return initial;
}
function subscribeCurrency(listener: () => void) {
  window.addEventListener("roger-currency", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("roger-currency", listener);
    window.removeEventListener("storage", listener);
  };
}

export function CirclesPrice({
  initialCurrency = "USD",
}: {
  initialCurrency?: Currency;
}) {
  const [choice, setChoice] = useState<Currency>();
  const storedCurrency = useSyncExternalStore(
    subscribeCurrency,
    () => readCurrency(initialCurrency),
    () => initialCurrency,
  );
  function pick(value: Currency) {
    setChoice(value);
    try {
      sessionStorage.setItem(storageKey, value);
    } catch {
      /* Optional persistence. */
    }
    window.dispatchEvent(new Event("roger-currency"));
  }
  const currency = choice ?? storedCurrency;
  const price =
    currency === "CAD"
      ? siteConfig.circles.priceCad
      : siteConfig.circles.priceUsd;
  return (
    <section
      id="apply"
      aria-labelledby="price-title"
      className="on-night bg-night text-night-ink"
    >
      <div className="mx-auto max-w-[760px] px-4 py-24 text-center sm:px-6 lg:py-32">
        <div
          role="group"
          aria-label="Show price in"
          className="inline-flex rounded-full border border-night-rule bg-night-2 p-1"
        >
          {(["USD", "CAD"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={currency === value}
              onClick={() => pick(value)}
              className={`min-h-11 min-w-16 cursor-pointer rounded-full px-4 text-meta font-semibold ${currency === value ? "bg-night-ink text-night" : "text-night-ink-2 hover:text-night-ink"}`}
            >
              {value}
            </button>
          ))}
        </div>
        <h2
          id="price-title"
          aria-live="polite"
          className="mt-7 text-[clamp(48px,7vw,96px)] font-[650] leading-none tracking-[-0.045em] tabular-nums"
        >
          {currency === "CAD" ? "CA" : "US"}${price}{" "}
          <span className="text-[clamp(19px,2vw,28px)] font-medium tracking-[-0.02em] text-night-ink-2">
            / month {currency}
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-[34rem] text-lead">
          Billing starts the day your Circle starts, and each Circle starts when
          its eight seats are filled. Leave any time.
        </p>
        <div className="mx-auto mt-8 max-w-[34rem] rounded-[8px] border border-night-rule px-6 py-5">
          <p className="text-title">
            {siteConfig.circles.guaranteeDays}-day money-back guarantee
          </p>
          <p className="mt-2 text-small text-night-ink-2">
            If a Circle isn&apos;t for you, tell us within 45 days of kickoff
            and we refund what you&apos;ve paid.{" "}
            <Link
              className="text-accent-night hover:underline"
              href="/terms#circles-guarantee"
            >
              Guarantee terms ›
            </Link>
          </p>
        </div>
        <Link href="/apply" className="btn mt-10">
          Apply for a founding Circle
        </Link>
        <p className="mt-7 text-meta text-night-ink-2">
          Three founding Circles · {siteConfig.circles.totalSeats} seats
        </p>
      </div>
    </section>
  );
}
