import { defineEval } from "eve/evals";
import { satisfies } from "eve/evals/expect";

export default defineEval({
  description: "Replies stay short, matching the persona's brevity rule.",
  async test(t) {
    await t.send("Give me three ideas for a Saturday afternoon.");
    t.succeeded();
    t.check(
      t.reply,
      satisfies(
        (reply: string) => reply.split(/\s+/).length < 200,
        "reply is under 200 words"
      )
    ).soft();
  },
});
