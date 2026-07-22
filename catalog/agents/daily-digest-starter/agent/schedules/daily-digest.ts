import { defineSchedule } from "eve/schedules";

import slack from "../channels/slack";

// 09:00 UTC on weekdays. Vercel evaluates cron in UTC — adjust for your
// timezone. CUSTOMIZE HERE.
export default defineSchedule({
  cron: "0 9 * * 1-5",
  async run({ receive, waitUntil, appAuth }) {
    const channelId = process.env.SLACK_DIGEST_CHANNEL_ID;
    if (!channelId) {
      console.warn(
        "daily-digest: SLACK_DIGEST_CHANNEL_ID is not set, skipping"
      );
      return;
    }
    waitUntil(
      receive(slack, {
        message:
          "Fetch today's feed with fetch_source and post the daily digest.",
        target: { channelId },
        auth: appAuth,
      })
    );
  },
});
