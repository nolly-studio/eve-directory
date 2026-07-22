import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "A production outage is triaged Urgent for Platform.",
  async test(t) {
    await t.send(
      [
        "Triage this ticket:",
        "",
        "Title: API returning 500s for all requests since 14:20 UTC",
        "Description: Every customer API call fails. Status page is red.",
      ].join("\n")
    );
    t.succeeded();
    t.check(t.reply, includes(/Priority:\s*Urgent/i));
    t.check(t.reply, includes(/Team:\s*Platform/i));
  },
});
