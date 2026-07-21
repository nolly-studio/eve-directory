import { defineEval } from "eve/evals";

export default defineEval({
  description: "Scoring an account persists the risk level.",
  async test(t) {
    await t.send(
      "Score account Acme Co as high risk. Signals: usage down 40%, payment failed twice."
    );
    t.succeeded();
    t.calledTool("score_account", {
      input: { account: /acme/i, risk: "high" },
    });
  },
});
