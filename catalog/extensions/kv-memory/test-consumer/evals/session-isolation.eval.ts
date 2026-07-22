import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "Memory is session-scoped: a key stored in one session is not visible from a fresh session.",
  async test(t) {
    (await t.send("remember secret hunter2")).expectOk();

    const other = t.newSession();
    const recalled = await other.send("recall secret");
    recalled.expectOk();
    t.check(recalled.message, includes('"found":false'));

    t.succeeded();
  },
});
