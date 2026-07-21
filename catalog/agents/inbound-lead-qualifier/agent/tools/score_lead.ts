import { defineTool } from "eve/tools";
import { z } from "zod";

import { saveLead } from "../lib/lead-store";

export default defineTool({
  description:
    "Score an inbound lead against the ICP and store the result for handoff.",
  inputSchema: z.object({
    leadId: z.string().min(1),
    fit: z.enum(["strong", "moderate", "weak", "disqualified"]),
    reasons: z.array(z.string().min(1)).min(1),
    company: z.string().optional(),
    role: z.string().optional(),
  }),
  async execute(input) {
    const record = await saveLead({
      ...input,
      scoredAt: new Date().toISOString(),
    });
    return { saved: true, record };
  },
});
