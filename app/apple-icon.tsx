import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/**
 * Apple touch icon — Eve "E" bars on the warm Geist primary tile.
 * Proportions match `components/logo.tsx` (75.52 / 38.66 / 45.87).
 */
export default function AppleIcon() {
  const tile = "#2a2825";
  const bar = "#faf9f7";

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: tile,
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "50%",
          justifyContent: "space-between",
          width: "56%",
        }}
      >
        <div
          style={{
            background: bar,
            borderRadius: 3,
            height: "18%",
            width: "100%",
          }}
        />
        <div
          style={{
            background: bar,
            borderRadius: 3,
            height: "18%",
            width: "51%",
          }}
        />
        <div
          style={{
            background: bar,
            borderRadius: 3,
            height: "18%",
            width: "61%",
          }}
        />
      </div>
    </div>,
    { ...size }
  );
}
