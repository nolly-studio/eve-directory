import { defineTool } from "eve/tools";
import { z } from "zod";

import { readSnapshots } from "../lib/snapshot-store";

export default defineTool({
  description:
    "List stored competitor snapshots, optionally filtered by competitor, to establish the diff baseline before reporting changes.",
  inputSchema: z.object({
    competitor: z
      .string()
      .optional()
      .describe("Filter to one competitor. Omit to list every snapshot."),
  }),
  async execute({ competitor }) {
    const all = await readSnapshots();

    if (!competitor) {
      return { snapshots: all };
    }

    const normalized = competitor.trim().toLowerCase();

    return {
      snapshots: all.filter(
        (snapshot) => snapshot.competitor.trim().toLowerCase() === normalized
      ),
    };
  },
});
