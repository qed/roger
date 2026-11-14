import { siteConfig } from "@/data/config";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = siteConfig.flags.circlesMode ? "Roger Circles: Stop figuring out AI agents alone." : "Roger: what people’s AI agents do. Real use cases from Muse, Grok Bot, Hark and more, read every morning in Toronto.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card people see when the library is shared: Toronto at sunrise, and what the library is. */
export default async function Image() {
  const [semibold, regular, photo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/MonaSans-600.ttf")),
    readFile(join(process.cwd(), "src/assets/MonaSans-400.ttf")),
    readFile(join(process.cwd(), "src/assets/img/toronto-dawn.jpg")),
  ]);
  if (siteConfig.flags.circlesMode) return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 72px", background: "#0c0c0e", color: "#f5f5f7", fontFamily: "Mona Sans" }}>
      <div style={{ display: "flex", fontSize: 30, color: "#e8a97f" }}>Roger Circles</div>
      <div style={{ display: "flex", maxWidth: 930, fontSize: 88, fontWeight: 600, lineHeight: 1.04, letterSpacing: -4 }}>Stop figuring out AI agents alone.</div>
      <div style={{ display: "flex", fontSize: 26, color: "#a3a3aa" }}>Eight people. Any agents. A better week of work.</div>
    </div>,
    { ...size, fonts: [
      { name: "Mona Sans", data: semibold, style: "normal", weight: 600 },
      { name: "Mona Sans", data: regular, style: "normal", weight: 400 },
    ] },
  );
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: "#0f0d0c", fontFamily: "Mona Sans", color: "#f5f5f7" }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={src} width={1200} height={729} style={{ position: "absolute", left: 0, top: -40, objectFit: "cover" }} />
        <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 1200, height: 630, /* taste-skill-ignore: neutral scrim over a photo */ backgroundImage: "linear-gradient(90deg, rgba(12,10,9,0.96) 0%, rgba(12,10,9,0.86) 50%, rgba(12,10,9,0.1) 80%)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", padding: "60px 0 58px 72px", width: 760 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>Roger</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 600, lineHeight: 1.0, letterSpacing: -3.6 }}>
              <span>What people’s</span>
              <span>AI agents do</span>
            </div>
            <div style={{ marginTop: 26, fontSize: 28, color: "#f5f5f7", fontWeight: 400 }}>Real use cases, read every morning in Toronto</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Mona Sans", data: semibold, style: "normal", weight: 600 },
        { name: "Mona Sans", data: regular, style: "normal", weight: 400 },
      ],
    },
  );
}
