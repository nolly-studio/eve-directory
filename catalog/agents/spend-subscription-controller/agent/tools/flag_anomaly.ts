import { defineTool } from "eve/tools";
import { z } from "zod";

import { saveAnomaly } from "../lib/spend-store";

export default defineTool({
  description:
    "Flag a spend anomaly, upcoming renewal, or duplicate subscription for the owner digest.",
  inputSchema: z.object({
    vendor: z.string().min(1),
    kind: z.enum(["anomaly", "renewal", "duplicate"]),
    amount: z.number().optional(),
    summary: z.string().min(1),
  }),
  async execute(input) {
    const record = await saveAnomaly({
      ...input,
      flaggedAt: new Date().toISOString(),
    });
    return { saved: true, record };
  },
});
