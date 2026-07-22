import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "An on-demand check calls check_url and reports status.",
  async test(t) {
    await t.send(
      "Run an uptime check with check_url and tell me the current status."
    );
    t.succeeded();
    t.calledTool("check_url");
    t.check(t.reply, includes(/up|down|status/i)).soft();
  },
});
