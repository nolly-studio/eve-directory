import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.mixpanel.com/mcp",
  description: "Mixpanel: analyze, query, and manage analytics data.",
  auth: connect({ connector: "mixpanel", principalType: "app" }),
});
