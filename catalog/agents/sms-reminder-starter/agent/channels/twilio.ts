import { twilioChannel } from "eve/channels/twilio";

// Credentials come from env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN.
// TWILIO_FROM_NUMBER is the outbound sender. TWILIO_ALLOW_FROM gates who
// can text the agent ("*" only for local demos). See SETUP.md.
const allowFrom = process.env.TWILIO_ALLOW_FROM ?? "*";

export default twilioChannel({
  allowFrom:
    allowFrom === "*" ? "*" : allowFrom.split(",").map((n) => n.trim()),
  messaging: {
    from: process.env.TWILIO_FROM_NUMBER!,
  },
});
