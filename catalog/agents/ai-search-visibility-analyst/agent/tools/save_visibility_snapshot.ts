import { defineTool } from "eve/tools";
import { z } from "zod";

import { saveSnapshot } from "../lib/visibility-store";

export default defineTool({
  description:
    "Store a visibility observation for one query (AI answer or search SERP). Returns the previous snapshot for diffing.",
  inputSchema: z.object({
    query: z.string().min(1),
    channel: z.enum(["ai-answer", "search", "local"]),
    content: z.string().min(1),
    cited: z.boolean().optional(),
  }),
  async execute(input) {
    const previous = await saveSnapshot({
      ...input,
      observedAt: new Date().toISOString(),
    });
    return { saved: true, previous, baseline: previous === null };
  },
});
