import { defineEval } from "eve/evals";

export default defineEval({
  description: "Recording a contract drift persists the finding.",
  async test(t) {
    await t.send(
      "Record a breaking drift on Public REST v1: removed field customer.taxId. Evidence: openapi vs live 200 body."
    );
    t.succeeded();
    t.calledTool("record_drift", { input: { kind: "breaking" } });
  },
});
