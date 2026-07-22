import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { EVE_DIRECTORY_SLASH_PATH } from "@/components/logo";
import { getCommunityAgent } from "@/lib/community/queries";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} community agent`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const ink = "#1A1917";
const paper = "#F5F4F0";
const muted = "#6E6B64";
const hairline = "rgba(32, 28, 20, 0.08)";

function loadGeist(weight: "Medium" | "SemiBold") {
  return readFile(
    path.join(
      process.cwd(),
      `node_modules/geist/dist/fonts/geist-sans/Geist-${weight}.ttf`
    )
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; communitySlug: string }>;
}) {
  const { slug: rawHandle, communitySlug } = await params;
  const handle = decodeURIComponent(rawHandle).replace(/^@/, "");
  const agent = await getCommunityAgent(handle, communitySlug);

  const title = agent?.name ?? "Community agent";
  const summary = agent?.summary ?? SITE.description;
  const author = agent ? `@${agent.handle}` : "@community";

  const [geistMedium, geistSemiBold] = await Promise.all([
    loadGeist("Medium"),
    loadGeist("SemiBold"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: paper,
        color: ink,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: `
            linear-gradient(to right, ${hairline} 1px, transparent 1px),
            linear-gradient(to bottom, ${hairline} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <svg
        aria-hidden="true"
        width="520"
        height="1160"
        viewBox="0 0 237 53"
        style={{
          position: "absolute",
          right: "-40px",
          top: "-180px",
          opacity: 0.09,
        }}
      >
        <path d={EVE_DIRECTORY_SLASH_PATH} fill={ink} />
      </svg>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: muted,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Community · {author}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              maxWidth: 920,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: muted,
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            {summary.length > 160 ? `${summary.slice(0, 157)}…` : summary}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: muted }}>
          www.{SITE.domain}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistMedium, style: "normal", weight: 500 },
        { name: "Geist", data: geistSemiBold, style: "normal", weight: 600 },
      ],
    }
  );
}
