import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Answers a FAQ question by loading the knowledge skill.",
  async test(t) {
    await t.send("What are your support hours?");
    t.succeeded();
    t.calledTool("load_skill");
    t.check(t.reply, includes(/9\s*am|9:00/i)).soft();
  },
});
