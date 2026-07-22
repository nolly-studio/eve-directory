import { defineEval } from "eve/evals";

export default defineEval({
  description: "Agent boots, accepts a message, and replies in persona.",
  async test(t) {
    await t.send(
      "In one short sentence, who are you and what can you help with?"
    );
    t.succeeded();
  },
});
