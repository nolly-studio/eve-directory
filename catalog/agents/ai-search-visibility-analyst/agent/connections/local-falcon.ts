import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.localfalcon.com",
  description: "Local Falcon: local search rankings and AI visibility reports.",
  auth: connect({ connector: "local-falcon", principalType: "app" }),
});
