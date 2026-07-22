import { defineEval } from "eve/evals";

export default defineEval({
  description: "Schedule prompt causes write_briefing to be called.",
  async test(t) {
    await t.send(
      [
        "Write this week's briefing.",
        "Call write_briefing with a short status line, then confirm it was saved.",
      ].join(" ")
    );
    t.succeeded();
    t.calledTool("write_briefing");
  },
});
