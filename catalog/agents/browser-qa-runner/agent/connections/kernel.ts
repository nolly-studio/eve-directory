import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.onkernel.com/mcp",
  description:
    "Kernel: launch and automate cloud browsers, run Playwright, and inspect replays.",
  auth: connect({ connector: "mcp.onkernel.com/kernel", principalType: "app" }),
});
