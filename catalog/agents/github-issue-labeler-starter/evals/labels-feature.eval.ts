import { defineEval } from "eve/evals";
import { includes, satisfies } from "eve/evals/expect";

export default defineEval({
  description: "A feature request gets the feature label and no repro request.",
  async test(t) {
    await t.send(
      [
        "A new issue (#43) was just opened. Triage it now.",
        "",
        "Title: Add dark mode",
        "",
        "Body:\nWould love a dark theme option in settings.",
      ].join("\n")
    );
    t.succeeded();
    t.check(t.reply, includes(/^LABEL:[ \t]*feature\s*$/m));
    t.check(
      t.reply,
      satisfies(
        (reply: string) => !/steps to reproduce/i.test(reply),
        "does not ask feature requests for repro steps"
      )
    ).soft();
  },
});
