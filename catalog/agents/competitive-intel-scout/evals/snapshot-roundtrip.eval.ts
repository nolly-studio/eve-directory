import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "The agent stores an observed surface state through save_snapshot and reads it back through list_snapshots.",
  async test(t) {
    await t.send(
      'Record this observation: competitor "Acme", pricing page at https://acme.example.com/pricing, current state "Pro plan $49/seat, annual billing only". Then list what we have on file for Acme and summarize it.'
    );
    t.succeeded();
    t.calledTool("save_snapshot", {
      input: { competitor: /acme/i, surface: "pricing" },
    });
    t.calledTool("list_snapshots");
    t.messageIncludes(/49/);
  },
});
