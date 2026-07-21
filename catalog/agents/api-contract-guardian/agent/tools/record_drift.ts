import { defineTool } from "eve/tools";
import { z } from "zod";

import { saveDrift } from "../lib/drift-store";

export default defineTool({
  description:
    "Record one API contract drift finding (breaking, additive, or docs-only) for later reporting.",
  inputSchema: z.object({
    surface: z.string().min(1),
    kind: z.enum(["breaking", "additive", "docs-only"]),
    summary: z.string().min(1),
    evidence: z.string().min(1),
  }),
  async execute(input) {
    const record = await saveDrift({
      ...input,
      observedAt: new Date().toISOString(),
    });
    return { saved: true, record };
  },
});
