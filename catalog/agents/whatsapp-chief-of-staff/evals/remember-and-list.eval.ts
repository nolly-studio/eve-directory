import { defineEval } from "eve/evals";

export default defineEval({
  description: "Remember and list memories round-trip.",
  async test(t) {
    await t.send(
      "Remember that I prefer brief bullet updates in the morning. Then list what you remember about me."
    );
    t.succeeded();
    t.calledTool("remember");
    t.calledTool("list_memories");
    t.messageIncludes(/brief|bullet|morning/i);
  },
});
