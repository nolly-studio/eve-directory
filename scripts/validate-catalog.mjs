// Static validation for catalog/ content (pnpm catalog:validate).
//
// Fails when the registry and the files on disk disagree, when required
// agent files are missing, or when a real .env could leak into the repo.
// See docs/plans/phase-1/02-catalog-and-agent-spec.md ("Validation").
//
// This is layer 1 of catalog verification: cheap, offline, runs on every
// change. Layer 2 (compile check) is scripts/check-agents.mjs.

import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CATALOG_ROOT = path.join(ROOT, "catalog");

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SUMMARY_MAX_LENGTH = 240;

// Required files for the nested eve-app agent layout, relative to the
// agent directory. Directories are marked with a trailing slash.
const REQUIRED_AGENT_PATHS = [
  "package.json",
  "README.md",
  "SETUP.md",
  ".env.example",
  "agent/",
  "agent/agent.ts",
  "agent/instructions.md",
  "evals/",
  "examples/",
];

// Build artifacts that must never be committed; mirrors the walk
// exclusions in build-registry.mjs and lib/catalog.
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".eve",
  ".output",
  ".cache",
  "var",
  ".git",
  ".next",
]);

const errors = [];

function fail(message) {
  errors.push(message);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf-8"));
}

function isDirectory(filePath) {
  return existsSync(filePath) && statSync(filePath).isDirectory();
}

function isFile(filePath) {
  return existsSync(filePath) && statSync(filePath).isFile();
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

    files.push(rel);
  }

  return files;
}

function isEnvFile(name) {
  return (
    name === ".env" || (name.startsWith(".env.") && name !== ".env.example")
  );
}

function gitIgnores(relPath) {
  try {
    execFileSync("git", ["check-ignore", "-q", relPath], { cwd: ROOT });
    return true;
  } catch {
    return false;
  }
}

function validateListingFields(listing, label) {
  const requiredStrings = [
    "name",
    "slug",
    "path",
    "summary",
    "version",
    "license",
  ];
  for (const field of requiredStrings) {
    if (typeof listing[field] !== "string" || listing[field].length === 0) {
      fail(`${label}: missing or empty "${field}"`);
    }
  }

  if (typeof listing.slug === "string" && !KEBAB_CASE.test(listing.slug)) {
    fail(`${label}: slug "${listing.slug}" is not lowercase kebab-case`);
  }

  if (
    typeof listing.summary === "string" &&
    listing.summary.length > SUMMARY_MAX_LENGTH
  ) {
    fail(
      `${label}: summary is ${listing.summary.length} chars (max ${SUMMARY_MAX_LENGTH})`
    );
  }

  if (!Array.isArray(listing.integrations)) {
    fail(`${label}: "integrations" must be an array`);
  }

  if ("featured" in listing && typeof listing.featured !== "boolean") {
    fail(`${label}: "featured" must be a boolean when present`);
  }

  if (
    "tags" in listing &&
    (!Array.isArray(listing.tags) ||
      listing.tags.some((tag) => typeof tag !== "string"))
  ) {
    fail(`${label}: "tags" must be an array of strings when present`);
  }
}

function validateIntegrations(listing, label, knownIntegrations) {
  if (!Array.isArray(listing.integrations)) return;

  for (const slug of listing.integrations) {
    if (typeof slug !== "string" || !KEBAB_CASE.test(slug)) {
      fail(`${label}: integration "${slug}" is not lowercase kebab-case`);
      continue;
    }
    if (!knownIntegrations.has(slug)) {
      fail(
        `${label}: integration "${slug}" is not listed in catalog/integrations.json`
      );
    }
  }
}

async function validateAgentDirectory(agent, label) {
  const agentDir = path.join(CATALOG_ROOT, agent.path);

  if (!isDirectory(agentDir)) {
    fail(`${label}: path "${agent.path}" does not exist on disk`);
    return;
  }

  const dirName = path.basename(agentDir);
  if (dirName !== agent.slug) {
    fail(`${label}: directory name "${dirName}" does not match slug`);
  }

  for (const requiredPath of REQUIRED_AGENT_PATHS) {
    const target = path.join(agentDir, requiredPath);
    const ok = requiredPath.endsWith("/")
      ? isDirectory(target)
      : isFile(target);
    if (!ok) {
      fail(
        `${label}: missing required ${requiredPath.endsWith("/") ? "directory" : "file"} "${requiredPath}"`
      );
    }
  }

  const evalsDir = path.join(agentDir, "evals");
  if (isDirectory(evalsDir)) {
    const evalFiles = (await readdir(evalsDir)).filter((name) =>
      name.endsWith(".eval.ts")
    );
    if (evalFiles.length === 0) {
      fail(`${label}: evals/ contains no *.eval.ts files`);
    }
  }

  const manifestPath = path.join(agentDir, "package.json");
  if (isFile(manifestPath)) {
    const manifest = await readJson(manifestPath);
    if (!manifest.dependencies?.eve) {
      fail(`${label}: package.json does not declare an "eve" dependency`);
    }
  }
}

async function validateExtensionDirectory(extension, label) {
  const extensionDir = path.join(CATALOG_ROOT, extension.path);

  if (!isDirectory(extensionDir)) {
    fail(`${label}: path "${extension.path}" does not exist on disk`);
    return;
  }

  const directoryJsonPath = path.join(extensionDir, "directory.json");
  if (!isFile(directoryJsonPath)) {
    fail(`${label}: missing required file "directory.json"`);
    return;
  }

  const directoryJson = await readJson(directoryJsonPath);
  if (directoryJson.slug !== extension.slug) {
    fail(
      `${label}: directory.json slug "${directoryJson.slug}" does not match registry slug`
    );
  }
}

async function validateEnvFiles() {
  const files = await walkFiles(CATALOG_ROOT);
  for (const rel of files) {
    if (!isEnvFile(path.basename(rel))) continue;
    const repoRel = `catalog/${rel}`;
    if (!gitIgnores(repoRel)) {
      fail(`${repoRel}: env file with potential secrets is not gitignored`);
    }
  }
}

async function main() {
  const registryPath = path.join(CATALOG_ROOT, "registry.json");
  if (!isFile(registryPath)) {
    fail("catalog/registry.json is missing");
    report();
    return;
  }

  const registry = await readJson(registryPath);

  if (registry.schemaVersion !== 1) {
    fail(`registry: unexpected schemaVersion ${registry.schemaVersion}`);
  }

  const integrationsIndex = await readJson(
    path.join(CATALOG_ROOT, "integrations.json")
  );
  const knownIntegrations = new Set(
    integrationsIndex.integrations.map((integration) => integration.slug)
  );

  const agents = Array.isArray(registry.agents) ? registry.agents : [];
  const extensions = Array.isArray(registry.extensions)
    ? registry.extensions
    : [];

  const seenSlugs = new Map();
  for (const listing of [...agents, ...extensions]) {
    if (typeof listing.slug !== "string") continue;
    if (seenSlugs.has(listing.slug)) {
      fail(`registry: duplicate slug "${listing.slug}"`);
    }
    seenSlugs.set(listing.slug, true);
  }

  for (const agent of agents) {
    const label = `agent "${agent.slug ?? agent.name ?? "(unnamed)"}"`;

    validateListingFields(agent, label);
    validateIntegrations(agent, label, knownIntegrations);

    if (
      typeof agent.category?.name !== "string" ||
      typeof agent.category?.slug !== "string" ||
      !KEBAB_CASE.test(agent.category.slug)
    ) {
      fail(`${label}: category must have a name and a kebab-case slug`);
    }

    if (typeof agent.path === "string") {
      await validateAgentDirectory(agent, label);
    }
  }

  for (const extension of extensions) {
    const label = `extension "${extension.slug ?? extension.name ?? "(unnamed)"}"`;

    validateListingFields(extension, label);
    validateIntegrations(extension, label, knownIntegrations);

    if (typeof extension.path === "string") {
      await validateExtensionDirectory(extension, label);
    }
  }

  // Registry must also cover everything on disk — an agent directory
  // without a registry entry is invisible to the site and the CLI.
  const agentDirs = isDirectory(path.join(CATALOG_ROOT, "agents"))
    ? await readdir(path.join(CATALOG_ROOT, "agents"))
    : [];
  const registeredAgentSlugs = new Set(agents.map((agent) => agent.slug));
  for (const dirName of agentDirs) {
    if (!isDirectory(path.join(CATALOG_ROOT, "agents", dirName))) continue;
    if (!registeredAgentSlugs.has(dirName)) {
      fail(`catalog/agents/${dirName}: directory has no registry.json entry`);
    }
  }

  await validateEnvFiles();

  report(agents.length, extensions.length);
}

function report(agentCount = 0, extensionCount = 0) {
  if (errors.length > 0) {
    console.error(`catalog:validate — ${errors.length} problem(s):\n`);
    for (const message of errors) {
      console.error(`  ✗ ${message}`);
    }
    process.exit(1);
  }

  console.log(
    `catalog:validate — OK (${agentCount} agents, ${extensionCount} extensions)`
  );
}

await main();
