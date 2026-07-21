import JSZip from "jszip";
import { NextResponse } from "next/server";

import { getAgent, getExtension, readAllAgentFiles } from "@/lib/catalog";

interface ExportBody {
  agents: string[];
  extensions: string[];
}

export async function POST(request: Request) {
  const body = (await request.json()) as ExportBody;
  const zip = new JSZip();
  const notes: string[] = [];

  if (body.agents.length === 0) {
    return NextResponse.json(
      { error: "Select at least one agent" },
      { status: 400 }
    );
  }

  const [primarySlug] = body.agents;
  const primary = await getAgent(primarySlug);

  if (!primary) {
    return NextResponse.json(
      { error: "Primary agent not found" },
      { status: 404 }
    );
  }

  const files = await readAllAgentFiles(primarySlug);
  // Nested eve apps (with an agent/ directory) are complete projects and land
  // at the archive root; legacy flat agents are wrapped under agent/.
  const nested = files.some((file) => file.path.startsWith("agent/"));
  const rootFolder = nested ? zip : zip.folder("agent");

  if (!rootFolder) {
    return NextResponse.json(
      { error: "Failed to create archive" },
      { status: 500 }
    );
  }

  for (const file of files) {
    rootFolder.file(file.path, file.content);
  }

  const envExample = files.find((file) => file.path.endsWith(".env.example"));
  const secrets = envExample
    ? envExample.content
        .split("\n")
        .filter((line) => line.includes("=") && !line.startsWith("#"))
        .map((line) => line.split("=")[0]?.trim())
        .filter(Boolean)
    : [];

  if (body.extensions.length > 0) {
    const extensionsFolder = rootFolder.folder(
      nested ? "agent/extensions" : "extensions"
    );

    for (const extensionSlug of body.extensions) {
      const extension = await getExtension(extensionSlug);

      if (!extension) {
        notes.push(`Skipped missing extension: ${extensionSlug}`);
        continue;
      }

      const mountFile = `import ${extension.slug.replaceAll("-", "_")} from "${extension.npm ?? extension.slug}";\n\nexport default ${extension.slug.replaceAll("-", "_")}({});\n`;
      extensionsFolder?.file(`${extension.slug}.ts`, mountFile);
      notes.push(
        `Mounted extension ${extension.name} at agent/extensions/${extension.slug}.ts`
      );
    }
  }

  if (body.agents.length > 1) {
    notes.push(
      `Additional agents selected for reference: ${body.agents.slice(1).join(", ")}`
    );
  }

  const extensionEntries =
    body.extensions.length > 0
      ? await Promise.all(
          body.extensions.map(async (slug) => {
            const extension = await getExtension(slug);
            return extension?.npm ? ([extension.npm, "latest"] as const) : null;
          })
        )
      : [];
  const extensionDependencies = Object.fromEntries(
    extensionEntries.filter(Boolean) as [string, string][]
  );

  // Nested apps ship their own package.json; only synthesize one for flat
  // legacy agents.
  if (nested) {
    const extensionNames = Object.keys(extensionDependencies);
    if (extensionNames.length > 0) {
      notes.push(
        `Add extension dependencies to package.json: ${extensionNames.join(", ")}`
      );
    }
  } else {
    zip.file(
      "package.json",
      JSON.stringify(
        {
          dependencies: {
            ai: "latest",
            eve: "latest",
            zod: "latest",
            ...extensionDependencies,
          },
          name: `${primary.slug}-starter`,
          private: true,
          scripts: {
            dev: "eve dev",
          },
          type: "module",
        },
        null,
        2
      )
    );
  }

  zip.file(
    "COMPOSER-NOTES.md",
    [
      "# Composer export",
      "",
      `Primary agent: ${primary.name} (${primary.slug})`,
      "",
      "## Required secrets",
      ...(secrets.length > 0
        ? secrets.map((secret) => `- ${secret}`)
        : ["- None detected in .env.example"]),
      "",
      "## Notes",
      ...notes.map((note) => `- ${note}`),
      "",
      "## Run",
      "",
      "```bash",
      ...(nested
        ? ["npm install", "npm run dev"]
        : ["npm install eve ai zod", "npx eve@latest"]),
      "```",
    ].join("\n")
  );

  const archive = await zip.generateAsync({ type: "uint8array" });

  return new NextResponse(Buffer.from(archive), {
    headers: {
      "Content-Disposition": `attachment; filename="${primary.slug}-starter.zip"`,
      "Content-Type": "application/zip",
    },
  });
}
