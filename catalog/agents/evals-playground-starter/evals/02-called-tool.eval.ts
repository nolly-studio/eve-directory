import { defineEval } from "eve/evals";

export default defineEval({
  description: "Gate: the right tool ran with matching input (t.calledTool).",
  async test(t) {
    await t.send("What is the weather in Brooklyn? Use get_weather.");
    t.succeeded();
    t.calledTool("get_weather", {
      input: { city: /brooklyn/i },
    });
  },
});
