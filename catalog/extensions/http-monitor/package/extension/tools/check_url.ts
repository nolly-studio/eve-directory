import { defineTool } from "eve/tools";
import { z } from "zod";

import extension from "../extension";
import { performCheck } from "../lib/check";
import { lastStatuses } from "../lib/status-store";

export default defineTool({
  description:
    "Check whether an HTTP(S) URL is up and report status, latency, and whether the status changed since the last check of that URL in this session.",
  inputSchema: z.object({
    url: z.url({ protocol: /^https?$/ }),
  }),
  async execute({ url }, ctx) {
    const { timeoutMs } = extension.config;

    const previous = lastStatuses.get()[url] ?? null;
    const outcome = await performCheck(url, timeoutMs, ctx.abortSignal);
    const checkedAt = new Date().toISOString();

    lastStatuses.update((statuses) => ({
      ...statuses,
      [url]: { status: outcome.status, checkedAt },
    }));

    return {
      url,
      status: outcome.status,
      statusCode: outcome.statusCode,
      latencyMs: outcome.latencyMs,
      error: outcome.error,
      previousStatus: previous?.status ?? null,
      changed: previous !== null && previous.status !== outcome.status,
      checkedAt,
    };
  },
});
