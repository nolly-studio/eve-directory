import JSZip from "jszip";
import { NextResponse } from "next/server";

import { getAgent, getExtension, readAllAgentFiles } from "@/lib/catalog";
import { getPostHogClient } from "@/lib/posthog-server";

interface ExportBody {
  agents: string[];
  extensions: string[];
}

interface AgentFile {
  content: string;
  path: string;
}

function extractSecrets(files: AgentFile[]): string[] {
  const envExample = files.find((file) => file.path.endsWith(".env.example"));
  if (!envExample) {
    return [];
  }

  return envExample.content
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => line.split("=")[0]?.trim())
    .filter((secret): secret is string => Boolean(secret));
}

async function mountExtensions(
  rootFolder: JSZip,
  extensionSlugs: string[],
  nested: boolean,
  notes: string[]
): Promise<void> {
  if (extensionSlugs.length === 0) {
    return;
  }

  const extensionsFolder = rootFolder.folder(
    nested ? "agent/extensions" : "extensions"
  );

  for (const extensionSlug of extensionSlugs) {
    const extension = await getExtension(extensionSlug);

    if (!extension) {
      notes.push(`Skipped missing extension: ${extensionSlug}`);
      continue;
    }

    const importName = extension.slug.replaceAll("-", "_");
    const packageName = extension.npm ?? extension.slug;
    const mountFile = `import ${importName} from "${packageName}";\n\nexport default ${importName}({});\n`;
    extensionsFolder?.file(`${extension.slug}.ts`, mountFile);
    notes.push(
      `Mounted extension ${extension.name} at agent/extensions/${extension.slug}.ts`
    );
  }
}

async function resolveExtensionDependencies(
  extensionSlugs: string[]
): Promise<Record<string, string>> {
  if (extensionSlugs.length === 0) {
    return {};
  }

  const extensionEntries = await Promise.all(
    extensionSlugs.map(async (slug) => {
      const extension = await getExtension(slug);
      return extension?.npm ? ([extension.npm, "latest"] as const) : null;
    })
  );

  return Object.fromEntries(
    extensionEntries.filter(Boolean) as [string, string][]
  );
}

function writePackageAndNotes(
  zip: JSZip,
  options: {
    extensionDependencies: Record<string, string>;
    nested: boolean;
    notes: string[];
    primaryName: string;
    primarySlug: string;
    secrets: string[];
  }
): void {
  const {
    extensionDependencies,
    nested,
    notes,
    primaryName,
    primarySlug,
    secrets,
  } = options;

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
          name: `${primarySlug}-starter`,
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
      `Primary agent: ${primaryName} (${primarySlug})`,
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

  const secrets = extractSecrets(files);
  await mountExtensions(rootFolder, body.extensions, nested, notes);

  if (body.agents.length > 1) {
    notes.push(
      `Additional agents selected for reference: ${body.agents.slice(1).join(", ")}`
    );
  }

  const extensionDependencies = await resolveExtensionDependencies(
    body.extensions
  );
  writePackageAndNotes(zip, {
    extensionDependencies,
    nested,
    notes,
    primaryName: primary.name,
    primarySlug: primary.slug,
    secrets,
  });

  const archive = await zip.generateAsync({ type: "uint8array" });
  const posthog = getPostHogClient();
  const distinctId =
    request.headers.get("X-PostHog-Distinct-Id") ?? crypto.randomUUID();

  posthog.capture({
    distinctId,
    event: "composer_export_completed",
    properties: {
      $session_id: request.headers.get("X-PostHog-Session-Id") ?? undefined,
      agent_count: body.agents.length,
      extension_count: body.extensions.length,
      nested_project: nested,
    },
  });
  await posthog.flush();

  return new NextResponse(Buffer.from(archive), {
    headers: {
      "Content-Disposition": `attachment; filename="${primary.slug}-starter.zip"`,
      "Content-Type": "application/zip",
    },
  });
}
