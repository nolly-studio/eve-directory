import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "DELIVER_REMINDER turns reply with only the reminder text.",
  async test(t) {
    await t.send(
      ["DELIVER_REMINDER", "Reminder id: demo", "Text: Call the plumber"].join(
        "\n"
      )
    );
    t.succeeded();
    t.check(t.reply, includes(/Call the plumber/i));
  },
});
