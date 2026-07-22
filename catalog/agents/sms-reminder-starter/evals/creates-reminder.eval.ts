import { defineEval } from "eve/evals";

export default defineEval({
  description: "Schedules a one-time reminder via create_reminder.",
  async test(t) {
    await t.send(
      [
        "Schedule a reminder for +15551234567 at 2099-01-15T09:00:00Z",
        'with the text "Call the plumber".',
        "Call create_reminder now — do not ask clarifying questions.",
      ].join(" ")
    );
    t.succeeded();
    t.calledTool("create_reminder", {
      input: {
        text: /plumber/i,
        phoneNumber: "+15551234567",
      },
    });
  },
});
