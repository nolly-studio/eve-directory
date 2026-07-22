import { ImageResponse } from "next/og";

import { EVE_DIRECTORY_SLASH_PATH, EVE_ICON_PATHS } from "@/components/logo";
import { loadGeistOgFonts } from "@/lib/og/fonts";
import {
  OG_HAIRLINE,
  OG_INK,
  OG_MUTED,
  OG_PAPER,
  OG_SIZE,
} from "@/lib/og/tokens";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.description}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadGeistOgFonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: OG_PAPER,
        color: OG_INK,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: `
            linear-gradient(to right, ${OG_HAIRLINE} 1px, transparent 1px),
            linear-gradient(to bottom, ${OG_HAIRLINE} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 42%, rgba(255,255,255,0.72) 0%, transparent 70%)",
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
        <path d={EVE_DIRECTORY_SLASH_PATH} fill={OG_INK} />
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
            color: OG_MUTED,
          }}
        >
          <span>www.{SITE.domain}</span>
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
              <path key={d} d={d} fill={OG_INK} />
            ))}
            <path d={EVE_DIRECTORY_SLASH_PATH} fill={OG_INK} opacity={0.48} />
          </svg>

          <div
            style={{
              display: "flex",
              maxWidth: 720,
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              color: OG_INK,
            }}
          >
            {SITE.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${OG_HAIRLINE}`,
            paddingTop: 28,
            fontSize: 22,
            fontWeight: 500,
            color: OG_MUTED,
          }}
        >
          <span>Inspect. Compose. Export.</span>
          <span style={{ color: OG_INK, fontWeight: 600 }}>eve/</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts,
    }
  );
}
