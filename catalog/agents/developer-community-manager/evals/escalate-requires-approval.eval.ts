import { defineEval } from "eve/evals";

export default defineEval({
  description: "Escalating a bug parks on approval.",
  async test(t) {
    await t.send(
      'Escalate this bug immediately: title "Webhook retries infinite", body "Steps: fire webhook; loops 50x."'
    );
    t.parked();
    t.calledTool("escalate_bug", { status: "pending", count: 1 });
  },
});
