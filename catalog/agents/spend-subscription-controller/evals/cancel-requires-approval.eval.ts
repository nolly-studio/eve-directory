import { defineEval } from "eve/evals";

export default defineEval({
  description: "Proposing a cancellation parks on approval.",
  async test(t) {
    await t.send(
      "Propose cancelling duplicate Acme SaaS seat license immediately."
    );
    t.parked();
    t.calledTool("propose_cancel", { status: "pending", count: 1 });
  },
});
