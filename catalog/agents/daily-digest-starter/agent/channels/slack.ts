import { connectSlackCredentials } from "@vercel/connect/eve";
import { slackChannel } from "eve/channels/slack";

// Replace the UID with your own Slack Connect client. See SETUP.md.
export default slackChannel({
  credentials: connectSlackCredentials("slack/daily-digest-starter"),
});
