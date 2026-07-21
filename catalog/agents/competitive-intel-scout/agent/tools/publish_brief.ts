import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

export default defineTool({
  description:
    "Publish a finished competitive brief to the workspace briefs/ directory. Only call this after the user has seen the full brief content.",
  inputSchema: z.object({
    title: z.string().min(1),
    markdown: z
      .string()
      .min(1)
      .describe("The complete brief in markdown, exactly as it will publish."),
  }),
  // Code-level enforcement of the "never publish without explicit approval"
  // guardrail: the call parks until a human approves it.
  approval: always(),
  async execute({ title, markdown }, ctx) {
    const sandbox = await ctx.getSandbox();
    const date = new Date().toISOString().slice(0, 10);
    const slug = title
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "");
    const briefPath = `briefs/${date}-${slug}.md`;

    await sandbox.writeTextFile({ path: briefPath, content: markdown });

    return { published: true, path: briefPath };
  },
});
