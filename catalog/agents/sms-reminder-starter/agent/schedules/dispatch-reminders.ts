import { defineSchedule } from "eve/schedules";

import twilio from "../channels/twilio";
import {
  claimDue,
  completeReminder,
  releaseReminder,
} from "../lib/reminder-store";

// One-minute dispatcher for application-managed reminders.
// Demos: dynamic scheduling (CRUD row + cron claim + receive).
export default defineSchedule({
  cron: "* * * * *",
  run({ receive, waitUntil, appAuth }) {
    waitUntil(
      (async () => {
        const jobs = await claimDue({
          now: new Date(),
          limit: 25,
          leaseForMs: 5 * 60_000,
        });

        await Promise.all(
          jobs.map(async (job) => {
            try {
              await receive(twilio, {
                message: [
                  "DELIVER_REMINDER",
                  `Reminder id: ${job.id}`,
                  `Text: ${job.text}`,
                ].join("\n"),
                target: { phoneNumber: job.phoneNumber },
                auth: appAuth,
              });
              await completeReminder(job.id);
            } catch (error) {
              console.error("sms-reminder: deliver failed", job.id, error);
              await releaseReminder(job.id, new Date(Date.now() + 60_000));
            }
          })
        );
      })()
    );
  },
});
