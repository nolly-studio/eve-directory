// Behavior check for catalog agents (pnpm agents:eval).
//
// For each agent, stages a fresh copy outside the repo, installs its
// pinned dependencies, and runs `eve eval --strict --junit`. eve eval
// boots a real local dev server and drives real sessions, so it needs
// model access: AI_GATEWAY_API_KEY, read from <stage root>/.env.local
// (or the process env). All catalog evals are hermetic — local tools and
// guardrails only, no connection credentials — keep that invariant.
//
// Exit codes from eve eval: 0 pass, 1 any failure, 2 config error.
// Artifacts land in <staged>/<slug>/.eve/evals/<timestamp>/.
//
// Evals drive a live model and are non-deterministic (an approval-gate
// eval can fail one run and pass the next with identical code), so a
// failed agent gets exactly one retry. Deterministic breakage still
// fails both attempts.
//
// Usage:
//   pnpm agents:eval                # all agents
//   pnpm agents:eval <slug> [slug]  # specific agents only

import { existsSync } from "node:fs";
import { readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  resolveTargets,
  run,
  stageAgent,
  stageEnv,
  stageRoot,
} from "./lib/stage-agent.mjs";

const INSTALL_TIMEOUT_MS = 300_000;
const EVAL_TIMEOUT_MS = 900_000;

const JUNIT_PATH = ".eve/junit.xml";

// eve eval prints a summary like "3 passed, 1 failed, 1 skipped".
const SUMMARY_LINE = /\d+\s+(passed|failed|skipped)/;

/**
 * The run's summary.json is the source of truth for verdicts. The process
 * exit code can be poisoned by teardown noise (quarantined workflow state,
 * queue "socket hang up" errors) after every eval already passed, so we
 * read the artifact written after `startedAt` and fall back to the exit
 * code only when no artifact exists (e.g. exit 2 config errors).
 */
async function readRunSummary(stagedDir, startedAt) {
  const evalsDir = path.join(stagedDir, ".eve", "evals");
  if (!existsSync(evalsDir)) return null;

  let newest = null;
  for (const entry of await readdir(evalsDir)) {
    const summaryPath = path.join(evalsDir, entry, "summary.json");
    if (!existsSync(summaryPath)) continue;
    const { mtimeMs } = await stat(summaryPath);
    if (mtimeMs < startedAt) continue;
    if (!newest || mtimeMs > newest.mtimeMs) {
      newest = { summaryPath, mtimeMs };
    }
  }
  if (!newest) return null;

  return JSON.parse(await readFile(newest.summaryPath, "utf-8"));
}

async function evalAgent(slug, extraEnv) {
  const stagedDir = await stageAgent(slug);

  // Interrupted runs leave active local Workflow runs behind; eve
  // quarantines their deliveries and warns on the next boot. Staged
  // copies are disposable, so discard that state up front.
  await rm(path.join(stagedDir, ".eve", ".workflow-data"), {
    recursive: true,
    force: true,
  });

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
      summary: "npm install failed",
      detail: install.output,
      stagedDir,
    };
  }

  const startedAt = Date.now();
  const evalRun = await run(
    "npx",
    ["eve", "eval", "--strict", "--junit", JUNIT_PATH],
    stagedDir,
    EVAL_TIMEOUT_MS,
    extraEnv
  );

  const runSummary = await readRunSummary(stagedDir, startedAt);
  const ok = runSummary
    ? runSummary.failed === 0 &&
      runSummary.errored === 0 &&
      runSummary.totalEvals > 0
    : evalRun.ok;

  const summary = runSummary
    ? `${runSummary.passed} passed, ${runSummary.failed} failed` +
      (runSummary.skipped > 0 ? `, ${runSummary.skipped} skipped` : "")
    : (evalRun.output
        .split("\n")
        .reverse()
        .find((line) => SUMMARY_LINE.test(line))
        ?.trim() ?? (evalRun.ok ? "passed" : "failed (no summary line)"));

  return {
    slug,
    ok,
    summary,
    detail: ok ? "" : evalRun.output,
    stagedDir,
  };
}

async function main() {
  const targets = await resolveTargets(process.argv.slice(2));

  const extraEnv = await stageEnv();
  if (!(extraEnv.AI_GATEWAY_API_KEY || process.env.AI_GATEWAY_API_KEY)) {
    console.error(
      "agents:eval — AI_GATEWAY_API_KEY not found in the environment or " +
        `${path.join(stageRoot(), ".env.local")}; evals run against a live ` +
        "model and cannot start without it."
    );
    process.exit(2);
  }

  console.log(`Evaluating ${targets.length} agent(s) in staged copies...\n`);

  const results = [];
  for (const slug of targets) {
    process.stdout.write(`  ${slug} ... `);
    let result = await evalAgent(slug, extraEnv);
    if (!result.ok) {
      process.stdout.write("retrying ... ");
      result = { ...(await evalAgent(slug, extraEnv)), retried: true };
    }
    results.push(result);
    console.log(
      result.ok
        ? `ok (${result.summary}${result.retried ? ", on retry" : ""})`
        : "FAIL"
    );
  }

  const failures = results.filter((result) => !result.ok);

  console.log("\nArtifacts:");
  for (const result of results) {
    console.log(
      `  ${result.slug}: ${path.join(result.stagedDir, ".eve", "evals")} ` +
        `(junit: ${path.join(result.stagedDir, JUNIT_PATH)})`
    );
  }

  console.log();
  if (failures.length > 0) {
    console.error(
      `agents:eval — ${failures.length}/${results.length} failed:\n`
    );
    for (const failure of failures) {
      console.error(`✗ ${failure.slug} — ${failure.summary}`);
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

  console.log(`agents:eval — OK (${results.length} agents passed evals)`);
}

await main();
