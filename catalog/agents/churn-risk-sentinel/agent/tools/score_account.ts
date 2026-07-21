import { defineTool } from "eve/tools";
import { z } from "zod";

import { saveScore } from "../lib/score-store";

export default defineTool({
  description:
    "Score a customer account's churn risk from observed usage and billing signals. Returns the prior score when one exists.",
  inputSchema: z.object({
    account: z.string().min(1),
    risk: z.enum(["low", "medium", "high", "critical"]),
    signals: z.array(z.string().min(1)).min(1),
    notes: z.string().optional(),
  }),
  async execute(input) {
    const previous = await saveScore({
      ...input,
      scoredAt: new Date().toISOString(),
    });
    return { saved: true, previous };
  },
});
