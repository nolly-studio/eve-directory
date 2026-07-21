import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description:
    "Hand a scored lead to sales by writing a context-rich brief. Approval-gated.",
  inputSchema: z.object({
    leadId: z.string().min(1),
    markdown: z.string().min(1),
  }),
  approval: always(),
  async execute({ leadId, markdown }, ctx) {
    const sandbox = await ctx.getSandbox();
    const handoffPath = `handoffs/${leadId}.md`;
    await sandbox.writeTextFile({ path: handoffPath, content: markdown });
    return { handedOff: true, path: handoffPath };
  },
});
