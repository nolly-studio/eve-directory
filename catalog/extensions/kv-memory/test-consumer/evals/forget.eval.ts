import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "memory__forget removes a stored key, and a later recall reports found=false.",
  async test(t) {
    (await t.send("remember token abc123")).expectOk();

    const forgotten = await t.send("forget token");
    forgotten.expectOk();
    t.calledTool("memory__forget");
    t.check(forgotten.message, includes('"removed":true'));

    await t.send("recall token");
    t.succeeded();
    t.check(t.reply, includes('"found":false'));
    t.check(t.reply, includes('"value":null'));
  },
});
