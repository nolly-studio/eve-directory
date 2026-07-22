import { defineSchedule } from "eve/schedules";

import telegram from "../channels/telegram";

// Every 5 minutes. CUSTOMIZE HERE if you want a different cadence.
export default defineSchedule({
  cron: "*/5 * * * *",
  async run({ receive, waitUntil, appAuth }) {
    const chatId = process.env.TELEGRAM_ALERT_CHAT_ID;
    if (!chatId) {
      console.warn("uptime-watch: TELEGRAM_ALERT_CHAT_ID is not set, skipping");
      return;
    }
    waitUntil(
      receive(telegram, {
        message:
          "Run an uptime check with check_url. Alert only if status changed.",
        target: { chatId },
        auth: appAuth,
      })
    );
  },
});
