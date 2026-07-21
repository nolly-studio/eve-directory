import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description:
    "Post a finished pull-request review to the workspace reviews/ directory. Only call after the user has seen the full review content.",
  inputSchema: z.object({
    prRef: z.string().min(1).describe("PR reference, e.g. org/repo#123."),
    markdown: z.string().min(1).describe("The complete review in markdown."),
  }),
  approval: always(),
  async execute({ prRef, markdown }, ctx) {
    const sandbox = await ctx.getSandbox();
    const slug = prRef.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
    const reviewPath = `reviews/${slug}.md`;
    await sandbox.writeTextFile({ path: reviewPath, content: markdown });
    return { posted: true, path: reviewPath };
  },
});
