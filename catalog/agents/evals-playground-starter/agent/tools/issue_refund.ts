import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

/** Exists so evals can assert t.parked() + pending tool status. */
export default defineTool({
  description: "Issue a refund. Always requires human approval first.",
  inputSchema: z.object({
    chargeId: z.string().min(1),
    amountCents: z.number().int().positive(),
  }),
  approval: always(),
  async execute({ chargeId, amountCents }) {
    return { status: "refunded", chargeId, amountCents };
  },
});
