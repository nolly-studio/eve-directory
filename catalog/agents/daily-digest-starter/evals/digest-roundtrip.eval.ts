import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "An on-demand digest fetches the feed and lists numbered items.",
  async test(t) {
    await t.send(
      "Fetch today's feed with fetch_source and post the daily digest."
    );
    t.succeeded();
    t.calledTool("fetch_source");
    t.check(t.reply, includes(/1\./)).soft();
  },
});
