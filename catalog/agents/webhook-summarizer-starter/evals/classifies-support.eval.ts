import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Classifies a support ticket into the required summary format.",
  async test(t) {
    await t.send(
      [
        "Summarize and classify this inbound submission.",
        "Source: contact-form",
        "",
        "Hi — I cannot log in after resetting my password. Error says",
        '"invalid credentials" even though I just set a new one. Urgent!',
      ].join("\n")
    );
    t.succeeded();
    t.check(t.reply, includes(/Intake/i));
    t.check(t.reply, includes(/Priority:/i));
    t.check(t.reply, includes(/support|bug/i)).soft();
  },
});
