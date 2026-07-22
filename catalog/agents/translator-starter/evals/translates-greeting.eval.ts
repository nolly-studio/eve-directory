import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "Translates a greeting into the target language (default Spanish).",
  async test(t) {
    await t.send("Good morning, how are you?");
    t.succeeded();
    // Default TARGET_LANGUAGE is Spanish — expect a common greeting form.
    t.check(t.reply, includes(/buen[oa]s|cómo|como|estás|estas/i)).soft();
  },
});
