import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "A value stored with memory__remember round-trips through memory__recall in the same session.",
  async test(t) {
    const stored = await t.send("remember color marigold");
    stored.expectOk();
    t.calledTool("memory__remember");
    t.check(stored.message, includes('"stored":true'));

    await t.send("recall color");
    t.succeeded();
    t.calledTool("memory__recall");
    t.check(t.reply, includes('"found":true'));
    t.check(t.reply, includes('"value":"marigold"'));
  },
});
