import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type GeistOgWeight = "Medium" | "SemiBold";

/**
 * Fonts for `next/og` ImageResponse.
 *
 * Prefer `import.meta.url` (Turbopack/webpack asset path). Fall back to
 * `process.cwd()/lib/og/fonts` so Vercel file tracing can ship the `.ttf`
 * files even when the compiled chunk URL no longer sits next to them.
 * Do not read from `node_modules/geist/...` — that path 500s on Vercel/pnpm.
 */
async function loadFont(weight: GeistOgWeight) {
  const filename = `Geist-${weight}.ttf`;
  const candidates = [
    fileURLToPath(new URL(`fonts/${filename}`, import.meta.url)),
    path.join(process.cwd(), "lib/og/fonts", filename),
  ];

  const errors: string[] = [];
  for (const candidate of candidates) {
    try {
      return await readFile(candidate);
    } catch (error) {
      errors.push(
        `${candidate}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  throw new Error(
    `Failed to load OG font ${filename}. Tried:\n${errors.join("\n")}`
  );
}

export async function loadGeistOgFonts() {
  const [medium, semiBold] = await Promise.all([
    loadFont("Medium"),
    loadFont("SemiBold"),
  ]);

  return [
    {
      name: "Geist" as const,
      data: medium,
      style: "normal" as const,
      weight: 500 as const,
    },
    {
      name: "Geist" as const,
      data: semiBold,
      style: "normal" as const,
      weight: 600 as const,
    },
  ];
}
