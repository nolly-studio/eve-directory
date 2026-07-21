import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description:
    "Propose a customer save play (outreach, offer, or escalation). Approval-gated before it is written to plays/.",
  inputSchema: z.object({
    account: z.string().min(1),
    play: z.string().min(1),
  }),
  approval: always(),
  async execute({ account, play }, ctx) {
    const sandbox = await ctx.getSandbox();
    const slug = account.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
    const playPath = `plays/${slug}.md`;
    await sandbox.writeTextFile({ path: playPath, content: play });
    return { proposed: true, path: playPath };
  },
});
