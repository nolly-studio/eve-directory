import { defineTool } from "eve/tools";
import { z } from "zod";

import { saveSignal } from "../lib/signal-store";

export default defineTool({
  description: "Log a recurring community pain point as roadmap signal.",
  inputSchema: z.object({
    theme: z.string().min(1),
    evidence: z.string().min(1),
    frequency: z.enum(["once", "recurring", "widespread"]),
  }),
  async execute(input) {
    const record = await saveSignal({
      ...input,
      loggedAt: new Date().toISOString(),
    });
    return { saved: true, record };
  },
});
