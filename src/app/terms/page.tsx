import { siteConfig } from "@/data/config";
import { circlesTerms } from "@/data/circles-legal";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { terms } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms",
  description: siteConfig.flags.circlesMode ? "Draft terms and the 45-day guarantee for Roger Circles." : "The plain-language terms for Roger setups.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return siteConfig.flags.circlesMode ? <LegalPage doc={circlesTerms} reviewed={false} /> : <LegalPage doc={terms} />;
}
