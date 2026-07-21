import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.sentry.dev/mcp",
  description: "Sentry: search, query, and debug errors and issues.",
  auth: connect({ connector: "sentry", principalType: "app" }),
});
