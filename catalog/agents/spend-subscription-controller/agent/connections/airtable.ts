import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.airtable.com/mcp",
  description: "Airtable: bases, tables, and records.",
  auth: connect({ connector: "airtable", principalType: "app" }),
});
