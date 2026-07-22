import { defineTool } from "eve/tools";
import { z } from "zod";

import { createReminder } from "../lib/reminder-store";

export default defineTool({
  description:
    "Schedule a one-time SMS reminder. Convert local time to ISO 8601 with an explicit offset before calling. On SMS, the recipient is the texter; elsewhere, pass phoneNumber in E.164.",
  inputSchema: z.object({
    text: z.string().min(1).max(1000),
    runAt: z
      .string()
      .datetime({ offset: true })
      .describe("When to send the reminder, ISO 8601 with offset"),
    phoneNumber: z
      .string()
      .regex(/^\+[1-9]\d{6,14}$/)
      .optional()
      .describe("E.164 phone; required when not called from an inbound SMS"),
  }),
  async execute({ text, runAt, phoneNumber }, ctx) {
    const auth = ctx.session.auth.current;
    const fromSms =
      auth?.principalType === "user" && auth.authenticator === "twilio"
        ? auth.principalId
        : null;
    const recipient = fromSms ?? phoneNumber ?? null;
    if (!recipient) {
      throw new Error(
        "phoneNumber is required when the session is not an inbound SMS."
      );
    }

    const when = new Date(runAt);
    if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
      throw new Error(
        "runAt must be a future timestamp with a timezone offset."
      );
    }

    const reminder = await createReminder({
      phoneNumber: recipient,
      text,
      runAt: when,
    });

    return {
      id: reminder.id,
      runAt: reminder.runAt,
      text: reminder.text,
      phoneNumber: reminder.phoneNumber,
    };
  },
});
