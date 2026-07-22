import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { EVE_DIRECTORY_SLASH_PATH, EVE_ICON_PATHS } from "@/components/logo";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.description}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/** Warm-paper tokens mirrored from globals.css (Satori has no oklch). */
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

export default async function Image() {
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
      {/* Surface grid — same 48px rhythm as --surface-grid-size */}
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

      {/* Soft radial wash so the wordmark sits on a quiet field */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 42%, rgba(255,255,255,0.72) 0%, transparent 70%)",
        }}
      />

      {/* Oversized directory slash — atmosphere from the logo itself */}
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
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: muted,
          }}
        >
          <span>{SITE.domain}</span>
          <span>Agents & extensions</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 36,
            marginTop: 24,
          }}
        >
          <svg
            aria-hidden="true"
            width="560"
            height="125"
            viewBox="0 0 237 53"
            fill="none"
            style={{ display: "flex" }}
          >
            {EVE_ICON_PATHS.map((d) => (
              <path key={d} d={d} fill={ink} />
            ))}
            <path d={EVE_DIRECTORY_SLASH_PATH} fill={ink} opacity={0.48} />
          </svg>

          <div
            style={{
              display: "flex",
              maxWidth: 720,
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              color: ink,
            }}
          >
            Open registry for Eve agents and extensions
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${hairline}`,
            paddingTop: 28,
            fontSize: 22,
            fontWeight: 500,
            color: muted,
          }}
        >
          <span>Inspect · Compose · Export</span>
          <span style={{ color: ink, fontWeight: 600 }}>eve/</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistMedium,
          style: "normal",
          weight: 500,
        },
        {
          name: "Geist",
          data: geistSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
