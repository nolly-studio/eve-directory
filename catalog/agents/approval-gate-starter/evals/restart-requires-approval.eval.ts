import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "First restart_service call parks (once() still needs approval).",
  async test(t) {
    await t.send(
      "Restart the api service immediately because of a memory leak."
    );
    t.parked();
    t.calledTool("restart_service", { status: "pending", count: 1 });
  },
});
