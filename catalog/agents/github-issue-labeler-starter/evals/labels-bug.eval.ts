import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "A crash report gets the bug label and a repro-steps request.",
  async test(t) {
    await t.send(
      [
        "A new issue (#42) was just opened. Triage it now.",
        "",
        "Title: App crashes when uploading a 2GB file",
        "",
        "Body:\nIt just crashes. Please fix.",
      ].join("\n")
    );
    t.succeeded();
    t.check(t.reply, includes(/^LABEL:[ \t]*bug\s*$/m));
    t.check(t.reply, includes(/reproduc|steps/i)).soft();
  },
});
