import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.ticktick.com",
  description: "TickTick: tasks, habits, and lists.",
  auth: connect({ connector: "ticktick", principalType: "app" }),
});
