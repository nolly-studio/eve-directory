import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

/**
 * Fake-dangerous action gated on human approval.
 * CUSTOMIZE HERE: replace the log with your real refund / ops call.
 */
export default defineTool({
  description:
    "Issue a refund for a charge. Always requires human approval in Slack before running.",
  inputSchema: z.object({
    chargeId: z.string().min(1),
    amountCents: z.number().int().positive(),
    reason: z.string().min(1).max(500),
  }),
  approval: always(),
  async execute({ chargeId, amountCents, reason }) {
    // Starter body: log only. Swap this for your payment provider call.
    console.log("[issue_refund] approved", {
      chargeId,
      amountCents,
      reason,
      at: new Date().toISOString(),
    });
    return {
      status: "logged",
      chargeId,
      amountCents,
      reason,
      note: "Starter stub — replace execute() with a real refund API call.",
    };
  },
});
