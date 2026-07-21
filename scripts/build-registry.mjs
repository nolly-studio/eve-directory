// Generate the shadcn registry source from catalog/ agent directories.
//
// Emits .registry/registry.json (a shadcn `registry.json` source file whose
// item file paths point straight at catalog/), then `pnpm registry:build`
// runs `shadcn build` on it to produce the served artifacts in public/r/.
//
// Two catalog layouts are supported:
// - Nested eve app (has an agent/ subdirectory): files install verbatim,
//   mirroring the catalog paths (package.json, agent/**, evals/**, ...).
// - Legacy flat layout (agent.ts at the directory root): every file installs
//   under agent/ so nothing lands at the consumer's project root.

import { existsSync } from "node:fs";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CATALOG_ROOT = path.join(ROOT, "catalog");
const OUTPUT_DIR = path.join(ROOT, ".registry");

const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".eve",
  ".output",
  "var",
  ".git",
  ".next",
]);

const EXCLUDED_FILES = new Set([
  ".DS_Store",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "skills-lock.json",
]);

/** Never publish secrets; .env.example is the only env file allowed out. */
function isExcludedFile(name) {
  if (EXCLUDED_FILES.has(name)) return true;
  if (name === ".env" || (name.startsWith(".env.") && name !== ".env.example"))
    return true;
  if (name.endsWith(".pem") || name.endsWith(".tsbuildinfo")) return true;
  return false;
}

async function walkFiles(dir, relative = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const rel = relative ? `${relative}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      files.push(...(await walkFiles(path.join(dir, entry.name), rel)));
      continue;
    }

    if (isExcludedFile(entry.name)) continue;
    files.push(rel);
  }

  return files.sort();
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf-8"));
}

function toDependencyList(record = {}) {
  return Object.entries(record).map(([name, version]) => `${name}@${version}`);
}

async function buildAgentItem(agent) {
  const agentDir = path.join(CATALOG_ROOT, agent.path);
  const nested = existsSync(path.join(agentDir, "agent"));
  const relativeFiles = await walkFiles(agentDir);

  const files = relativeFiles.map((rel) => ({
    path: `catalog/${agent.path}/${rel}`,
    type: "registry:file",
    // Nested apps install verbatim; flat legacy agents mirror under agent/.
    target: nested ? rel : `agent/${rel}`,
  }));

  const manifestPath = path.join(agentDir, "package.json");
  const manifest = existsSync(manifestPath)
    ? await readJson(manifestPath)
    : null;

  return {
    name: agent.slug,
    type: "registry:block",
    title: agent.name,
    description: agent.summary,
    dependencies: manifest ? toDependencyList(manifest.dependencies) : ["eve"],
    devDependencies: manifest ? toDependencyList(manifest.devDependencies) : [],
    files,
    categories: [agent.category.slug],
    meta: {
      runtime: "eve",
      layout: nested ? "eve-app" : "eve-agent-flat",
      version: agent.version,
      license: agent.license,
      category: agent.category.slug,
      integrations: agent.integrations,
    },
  };
}

async function main() {
  const catalog = await readJson(path.join(CATALOG_ROOT, "registry.json"));
  const items = [];

  for (const agent of catalog.agents) {
    items.push(await buildAgentItem(agent));
  }

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "evedirectory",
    homepage: "https://evedirectory.com",
    items,
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(
    path.join(OUTPUT_DIR, "registry.json"),
    `${JSON.stringify(registry, null, 2)}\n`,
    "utf-8"
  );

  const fileCount = items.reduce((sum, item) => sum + item.files.length, 0);
  console.log(
    `Wrote .registry/registry.json — ${items.length} items, ${fileCount} files`
  );
}

await main();
