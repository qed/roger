import { existsSync } from "node:fs";
import path from "node:path";

// Keep the existing public v1.9 files as the single source of live availability.
// Missing files automatically move an agent to the coming-soon group.
export const zackAgents = [
  { slug: "claude", name: "Claude" },
  { slug: "grok-bot", name: "Grok Bot" },
  { slug: "duet", name: "Duet" },
  { slug: "hark", name: "Hark" },
  { slug: "instinct", name: "Instinct" },
  { slug: "muse", name: "Muse" },
  { slug: "dots", name: "Dots" },
  { slug: "viktor", name: "Viktor" },
].map((agent) => {
  const file = `zack-the-collector-${agent.slug}.md`;
  return {
    ...agent,
    file,
    available: existsSync(path.join(process.cwd(), "public/zack", file)),
  };
});
