import { linearChannel } from "eve/channels/linear";

// Credentials come from env: LINEAR_AGENT_ACCESS_TOKEN and
// LINEAR_WEBHOOK_SECRET. See SETUP.md.
export default linearChannel();
