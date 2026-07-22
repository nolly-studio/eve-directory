import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "A vague ticket still gets the full structured triage output.",
  async test(t) {
    await t.send(
      [
        "Triage this ticket:",
        "",
        "Title: thing looks weird",
        "Description: idk it's just off on my phone",
      ].join("\n")
    );
    t.succeeded();
    t.check(t.reply, includes(/Priority:\s*(Urgent|High|Medium|Low)/i));
    t.check(t.reply, includes(/Team:\s*(Platform|Web|Mobile|Growth)/i));
    t.check(t.reply, includes(/Missing info:/i));
  },
});
