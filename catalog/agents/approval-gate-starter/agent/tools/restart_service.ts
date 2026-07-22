import { defineTool } from "eve/tools";
import { once } from "eve/tools/approval";
import { z } from "zod";

/**
 * Contrast with issue_refund (always()): once() asks for approval on the
 * first call in a session, then auto-allows later calls of this tool.
 * CUSTOMIZE HERE: replace the log with a real restart / ops action.
 */
export default defineTool({
  description:
    "Restart a named service. Requires approval the first time in a session; later calls auto-allow.",
  inputSchema: z.object({
    service: z.string().min(1),
    reason: z.string().min(1).max(500),
  }),
  approval: once(),
  async execute({ service, reason }) {
    console.log("[restart_service] approved", {
      service,
      reason,
      at: new Date().toISOString(),
    });
    return {
      status: "logged",
      service,
      reason,
      note: "Starter stub — replace execute() with a real restart call.",
    };
  },
});
