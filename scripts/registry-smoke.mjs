// Install-path smoke test for the shadcn registry (pnpm registry:smoke).
//
// Rebuilds public/r/, then per agent mirrors the documented consumer
// install path (content/docs/install-with-shadcn.mdx) as closely as a
// local run allows:
//
//   1. fresh scratch project in <stage root>/consumers/<slug>/ — npm init,
//      its own package-lock.json (forces shadcn to npm; the nearest
//      lockfile decides the package manager), minimal components.json
//   2. `npx shadcn@latest add <abs path>/public/r/<slug>.json`
//      (docs use @evedirectory/<slug>; the abs path serves the identical
//      built artifact without needing the site deployed)
//   3. assert every files[].target from the registry item landed and
//      nothing stray hit the project root
//   4. `npm install && npx eve info` — must report 0 errors, 0 warnings
//
// Consumers must live OUTSIDE the repo: a parent pnpm-lock.yaml would
// flip shadcn's package-manager detection and break the install.
//
// Usage:
//   pnpm registry:smoke                # all agents
//   pnpm registry:smoke <slug> [slug]  # specific agents only

import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  CLEAN_DIAGNOSTICS,
  REPO_ROOT,
  freshConsumerDir,
  resolveTargets,
  run,
} from "./lib/stage-agent.mjs";

const REGISTRY_BUILD_TIMEOUT_MS = 120_000;
const SHADCN_ADD_TIMEOUT_MS = 600_000;
const INSTALL_TIMEOUT_MS = 300_000;
const INFO_TIMEOUT_MS = 120_000;

// Files the scaffold itself creates (plus what shadcn/npm write while
// installing); everything else in the consumer root must come from the
// registry item's files[].target list.
const SCAFFOLD_FILES = new Set([
  "package.json",
  "package-lock.json",
  "components.json",
  "tsconfig.json",
]);
const SCAFFOLD_DIRS = new Set(["node_modules"]);

// Minimal components.json: enough for `shadcn add` to accept the project.
// Agents install as registry:file entries with explicit targets, so none
// of the tailwind/alias values influence where files land.
const COMPONENTS_JSON = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "new-york",
  rsc: false,
  tsx: true,
  tailwind: {
    config: "",
    css: "app/globals.css",
    baseColor: "neutral",
    cssVariables: true,
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
};

async function walkFiles(dir, relative = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!relative && SCAFFOLD_DIRS.has(entry.name)) continue;
      files.push(...(await walkFiles(path.join(dir, entry.name), rel)));
      continue;
    }
    files.push(rel);
  }
  return files;
}

async function scaffoldConsumer(slug) {
  const consumerDir = await freshConsumerDir(slug);

  const init = await run("npm", ["init", "-y"], consumerDir, 30_000);
  if (!init.ok) throw new Error(`npm init failed:\n${init.output}`);

  // An own package-lock.json is what makes shadcn pick npm.
  const lock = await run(
    "npm",
    ["install", "--package-lock-only", "--no-fund", "--no-audit"],
    consumerDir,
    60_000
  );
  if (!lock.ok) throw new Error(`lockfile creation failed:\n${lock.output}`);

  await writeFile(
    path.join(consumerDir, "components.json"),
    `${JSON.stringify(COMPONENTS_JSON, null, 2)}\n`,
    "utf-8"
  );

  // shadcn requires a tsconfig.json to resolve the project; nested
  // eve-app items ship their own and overwrite this stub on install.
  await writeFile(
    path.join(consumerDir, "tsconfig.json"),
    `${JSON.stringify({ compilerOptions: {} }, null, 2)}\n`,
    "utf-8"
  );

  return consumerDir;
}

async function smokeAgent(slug) {
  const itemPath = path.join(REPO_ROOT, "public", "r", `${slug}.json`);
  if (!existsSync(itemPath)) {
    return {
      slug,
      ok: false,
      detail: `public/r/${slug}.json missing after registry:build`,
    };
  }
  const item = JSON.parse(await readFile(itemPath, "utf-8"));
  const expectedTargets = item.files.map((file) => file.target);

  let consumerDir;
  try {
    consumerDir = await scaffoldConsumer(slug);
  } catch (error) {
    return { slug, ok: false, detail: error.message };
  }

  const add = await run(
    "npx",
    ["shadcn@latest", "add", "--yes", "--overwrite", itemPath],
    consumerDir,
    SHADCN_ADD_TIMEOUT_MS
  );
  if (!add.ok) {
    return { slug, ok: false, detail: `shadcn add failed:\n${add.output}` };
  }

  const missing = expectedTargets.filter(
    (target) => !existsSync(path.join(consumerDir, target))
  );
  if (missing.length > 0) {
    return {
      slug,
      ok: false,
      detail: `targets missing after install: ${missing.join(", ")}`,
    };
  }

  const expected = new Set(expectedTargets);
  const stray = (await walkFiles(consumerDir)).filter(
    (rel) => !(expected.has(rel) || SCAFFOLD_FILES.has(rel))
  );
  if (stray.length > 0) {
    return {
      slug,
      ok: false,
      detail: `stray files not in registry targets: ${stray.join(", ")}`,
    };
  }

  const install = await run(
    "npm",
    ["install", "--no-fund", "--no-audit"],
    consumerDir,
    INSTALL_TIMEOUT_MS
  );
  if (!install.ok) {
    return {
      slug,
      ok: false,
      detail: `npm install failed:\n${install.output}`,
    };
  }

  const info = await run("npx", ["eve", "info"], consumerDir, INFO_TIMEOUT_MS);
  if (!info.ok) {
    return { slug, ok: false, detail: `eve info failed:\n${info.output}` };
  }
  if (!CLEAN_DIAGNOSTICS.test(info.output)) {
    const diagnosticsLine =
      info.output.split("\n").find((line) => line.includes("Diagnostics")) ??
      "diagnostics line not found in eve info output";
    return {
      slug,
      ok: false,
      detail: `compile not clean: ${diagnosticsLine.trim()}`,
    };
  }

  return {
    slug,
    ok: true,
    detail: `${expectedTargets.length} files installed, 0 errors, 0 warnings`,
  };
}

async function main() {
  const targets = await resolveTargets(process.argv.slice(2));

  console.log("Rebuilding registry artifacts (pnpm registry:build)...");
  const build = await run(
    "pnpm",
    ["registry:build"],
    REPO_ROOT,
    REGISTRY_BUILD_TIMEOUT_MS
  );
  if (!build.ok) {
    console.error(`registry:build failed:\n${build.output}`);
    process.exit(1);
  }

  console.log(`Smoke-testing ${targets.length} agent(s)...\n`);

  const results = [];
  for (const slug of targets) {
    process.stdout.write(`  ${slug} ... `);
    const result = await smokeAgent(slug);
    results.push(result);
    console.log(result.ok ? `ok (${result.detail})` : "FAIL");
  }

  const failures = results.filter((result) => !result.ok);

  console.log();
  if (failures.length > 0) {
    console.error(
      `registry:smoke — ${failures.length}/${results.length} failed:\n`
    );
    for (const failure of failures) {
      console.error(`✗ ${failure.slug}`);
      console.error(
        failure.detail
          .split("\n")
          .map((line) => `    ${line}`)
          .join("\n")
      );
      console.error();
    }
    process.exit(1);
  }

  console.log(
    `registry:smoke — OK (${results.length} agents install and compile clean)`
  );
}

await main();
