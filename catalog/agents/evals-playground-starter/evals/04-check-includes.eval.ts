import { defineEval } from "eve/evals";
import { includes, satisfies } from "eve/evals/expect";

export default defineEval({
  description: "Gate + soft: t.check with includes and satisfies.",
  async test(t) {
    await t.send("What is the weather in Brooklyn? Use get_weather.");
    t.succeeded();
    t.check(t.reply, includes(/sunny/i));
    t.check(
      t.reply,
      satisfies(
        (reply: string) => reply.length < 2000,
        "reply is under 2000 chars"
      )
    ).soft();
  },
});
