import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.postman.com/minimal",
  description: "Postman: APIs, collections, and workspaces.",
  auth: connect({ connector: "postman", principalType: "app" }),
});
