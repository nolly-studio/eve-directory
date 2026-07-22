import { defineEval } from "eve/evals";

export default defineEval({
  description: "Gate: approval parks the session (t.parked + pending tool).",
  async test(t) {
    await t.send(
      "Issue a refund for charge ch_eval_1 amounting to 1000 cents now."
    );
    t.parked();
    t.calledTool("issue_refund", { status: "pending", count: 1 });
  },
});
