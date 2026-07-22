import { defineTool } from "eve/tools";
import { z } from "zod";

import {
  readLastStatus,
  writeLastStatus,
  type UrlStatus,
} from "../lib/status-store";

// CUSTOMIZE HERE: set UPTIME_WATCH_URL to the URL you want monitored.
const DEFAULT_URL = "https://example.com";
const TIMEOUT_MS = 10_000;

function classify(statusCode: number | null, ok: boolean): UrlStatus {
  if (!ok || statusCode === null) return "down";
  if (statusCode >= 200 && statusCode < 400) return "up";
  return "down";
}

export default defineTool({
  description:
    "Check the configured URL and return its current status plus whether it changed since the last check. Call this on every watch tick.",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const url = process.env.UPTIME_WATCH_URL ?? DEFAULT_URL;
    const previous = await readLastStatus();
    const started = Date.now();

    let statusCode: number | null = null;
    let ok = false;
    let error: string | null = null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const onAbort = () => controller.abort();
    ctx.abortSignal.addEventListener("abort", onAbort);

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
      statusCode = response.status;
      ok = response.ok;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      ok = false;
    } finally {
      clearTimeout(timer);
      ctx.abortSignal.removeEventListener("abort", onAbort);
    }

    const status = classify(statusCode, ok);
    const changed = previous.status !== "unknown" && previous.status !== status;
    const checkedAt = new Date().toISOString();

    await writeLastStatus({ status, checkedAt });

    return {
      url,
      status,
      previousStatus: previous.status,
      changed,
      statusCode,
      latencyMs: Date.now() - started,
      error,
      checkedAt,
    };
  },
});
