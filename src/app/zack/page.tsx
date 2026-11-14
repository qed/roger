import { siteConfig } from "@/data/config";
import { CirclesZackPage } from "@/components/circles/zack-page";
import type { Metadata } from "next";
import HamptonPage, { metadata as hampton } from "../hampton/page";

// The same Zack instructions as /hampton, at a link for anyone running Zack
export const metadata: Metadata = siteConfig.flags.circlesMode ? { title: "Run Zack on yourself", description: "Review your past week with your agent and turn your best plays into playbooks. Zack runs in your own account.", alternates: { canonical: "/zack" }, openGraph: { url: "/zack" } } : {
  ...hampton,
  alternates: { canonical: "/zack" },
  openGraph: { ...hampton.openGraph, url: "/zack" },
};

export default function ZackPage() { return siteConfig.flags.circlesMode ? <CirclesZackPage /> : <HamptonPage />; }
