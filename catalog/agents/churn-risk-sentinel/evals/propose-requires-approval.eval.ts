import { defineEval } from "eve/evals";

export default defineEval({
  description: "Proposing a save play parks on approval.",
  async test(t) {
    await t.send(
      "Propose this save play for Acme Co without waiting: offer a 30-day extension and an onboarding call."
    );
    t.parked();
    t.calledTool("propose_save_play", { status: "pending", count: 1 });
  },
});
