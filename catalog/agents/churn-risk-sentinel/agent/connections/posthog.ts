import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.posthog.com/mcp",
  description: "PostHog: insights, events, and feature flags.",
  auth: connect({ connector: "posthog", principalType: "app" }),
});
