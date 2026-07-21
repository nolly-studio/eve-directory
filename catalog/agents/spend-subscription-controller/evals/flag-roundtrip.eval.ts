import { defineEval } from "eve/evals";

export default defineEval({
  description: "Flagging a spend anomaly persists the finding.",
  async test(t) {
    await t.send("Flag Acme SaaS as a renewal for $1,200 due in 12 days.");
    t.succeeded();
    t.calledTool("flag_anomaly", {
      input: { vendor: /acme/i, kind: "renewal" },
    });
  },
});
