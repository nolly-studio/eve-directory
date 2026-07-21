import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so scheduled (unattended) runs can use it: schedules have no
// user principal, and a user-scoped connection would fail from a cron task.
export default defineMcpClientConnection({
  url: "https://mcp.similarweb.com",
  description:
    "Similarweb: web traffic, engagement, and market intelligence data for tracked competitor domains.",
  auth: connect({ connector: "similarweb", principalType: "app" }),
});
