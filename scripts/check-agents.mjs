// Compile check for catalog agents (pnpm agents:check).
//
// For each nested eve-app under catalog/agents/, stages a fresh copy
// outside the repo (see scripts/lib/stage-agent.mjs), runs `npm install`
// and the locally pinned `eve info`, and requires a clean compile
// ("0 errors, 0 warnings"). This catches the failures a schema check
// cannot: modules that throw at import, invalid channel/connection/
// schedule definitions, broken tool wiring.
//
// Always install before invoking eve: `npx eve` without a local install
// downloads the latest release, which may not match the version each agent
// pins in its package.json.
//
// Usage:
//   pnpm agents:check                # all agents
//   pnpm agents:check <slug> [slug]  # specific agents only

import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  CLEAN_DIAGNOSTICS,
  resolveTargets,
  run,
  stageAgent,
} from "./lib/stage-agent.mjs";

const INSTALL_TIMEOUT_MS = 300_000;
const INFO_TIMEOUT_MS = 120_000;

async function checkAgent(slug) {
  const stagedDir = await stageAgent(slug);

  if (!existsSync(path.join(stagedDir, "package.json"))) {
    return {
      slug,
      ok: false,
      detail: "no package.json (not a nested eve app)",
    };
  }

  const install = await run(
    "npm",
    ["install", "--no-fund", "--no-audit"],
    stagedDir,
    INSTALL_TIMEOUT_MS
  );
  if (!install.ok) {
    return {
      slug,
      ok: false,
      detail: `npm install failed:\n${install.output}`,
    };
  }

  const info = await run("npx", ["eve", "info"], stagedDir, INFO_TIMEOUT_MS);
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

  return { slug, ok: true, detail: "0 errors, 0 warnings" };
}

async function main() {
  const targets = await resolveTargets(process.argv.slice(2));
  console.log(`Checking ${targets.length} agent(s) in staged copies...\n`);

  const results = [];
  for (const slug of targets) {
    process.stdout.write(`  ${slug} ... `);
    const result = await checkAgent(slug);
    results.push(result);
    console.log(result.ok ? "ok" : "FAIL");
  }

  const failures = results.filter((result) => !result.ok);

  console.log();
  if (failures.length > 0) {
    console.error(
      `agents:check — ${failures.length}/${results.length} failed:\n`
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

  console.log(`agents:check — OK (${results.length} agents compile clean)`);
}

await main();
