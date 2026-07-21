import { defineEval } from "eve/evals";

export default defineEval({
  description: "Scoring a lead persists fit and reasons.",
  async test(t) {
    await t.send(
      "Score lead lead-1 as strong fit. Company Acme, role Head of Eng. Reasons: 80 employees, shipping agents in prod."
    );
    t.succeeded();
    t.calledTool("score_lead", { input: { leadId: "lead-1", fit: "strong" } });
  },
});
