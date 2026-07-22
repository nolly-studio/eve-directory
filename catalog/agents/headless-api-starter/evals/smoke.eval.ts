import { defineEval } from "eve/evals";

export default defineEval({
  description: "Agent answers over the default eve HTTP session protocol.",
  async test(t) {
    await t.send("In one short sentence, what can you do?");
    t.succeeded();
  },
});
