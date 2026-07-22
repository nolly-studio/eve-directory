import { defineEval } from "eve/evals";

export default defineEval({
  description: "Gate: the run completed successfully (t.succeeded).",
  async test(t) {
    await t.send("Say hi in three words.");
    t.succeeded();
  },
});
