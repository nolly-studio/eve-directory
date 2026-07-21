import { defineEval } from "eve/evals";

export default defineEval({
  description: "Handing a lead to sales parks on approval.",
  async test(t) {
    await t.send(
      "Hand lead-1 to sales now: markdown brief with ICP fit and next steps."
    );
    t.parked();
    t.calledTool("handoff_to_sales", { status: "pending", count: 1 });
  },
});
