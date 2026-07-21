import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description:
    "Propose cancelling or consolidating a subscription. Approval-gated; never executes the cancel itself.",
  inputSchema: z.object({
    vendor: z.string().min(1),
    rationale: z.string().min(1),
  }),
  approval: always(),
  async execute({ vendor, rationale }, ctx) {
    const sandbox = await ctx.getSandbox();
    const slug = vendor.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
    const cancelPath = `cancellations/${slug}.md`;
    await sandbox.writeTextFile({ path: cancelPath, content: rationale });
    return { proposed: true, path: cancelPath };
  },
});
