import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/config";

const UPDATED = "2026-10-19";

export default function sitemap(): MetadataRoute.Sitemap {
  const d = siteConfig.domain;
  if (siteConfig.flags.circlesMode) return ["/", "/zack", "/library", "/privacy", "/terms"].map((path) => ({ url: `${d}${path}`, lastModified: "2026-11-14", changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.6 }));
  return [
    { url: `${d}/`, lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${d}/business`, lastModified: UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${d}/families`, lastModified: UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${d}/library`, lastModified: UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${d}/workshops`, lastModified: UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${d}/refunds`, lastModified: UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${d}/terms`, lastModified: UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${d}/privacy`, lastModified: UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
