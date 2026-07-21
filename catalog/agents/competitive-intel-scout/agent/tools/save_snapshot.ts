import { defineTool } from "eve/tools";
import { z } from "zod";

import { saveSnapshot } from "../lib/snapshot-store";

export default defineTool({
  description:
    "Store the current state of one watched competitor surface. Returns the previous snapshot for the same competitor and surface so you can diff what changed since the last check.",
  inputSchema: z.object({
    competitor: z.string().min(1).describe("Competitor name, e.g. 'Acme'."),
    surface: z.enum([
      "pricing",
      "changelog",
      "blog",
      "docs",
      "careers",
      "traffic",
      "other",
    ]),
    url: z.url().optional().describe("Source URL the state was observed at."),
    content: z
      .string()
      .min(1)
      .describe(
        "Exact observed wording or a compact factual summary of the surface state."
      ),
  }),
  async execute(input) {
    const previous = await saveSnapshot({
      ...input,
      observedAt: new Date().toISOString(),
    });

    return {
      saved: true,
      previous,
      baseline: previous === null,
    };
  },
});
