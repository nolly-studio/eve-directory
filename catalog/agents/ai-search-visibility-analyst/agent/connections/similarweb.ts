import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.similarweb.com",
  description: "Similarweb: web traffic, app, and market intelligence data.",
  auth: connect({ connector: "similarweb", principalType: "app" }),
});
