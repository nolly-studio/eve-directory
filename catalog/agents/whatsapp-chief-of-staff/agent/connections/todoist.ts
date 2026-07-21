import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://ai.todoist.net/mcp",
  description: "Todoist: search, complete, and manage tasks.",
  auth: connect({ connector: "todoist", principalType: "app" }),
});
