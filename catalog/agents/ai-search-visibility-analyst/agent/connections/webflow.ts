import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.webflow.com/mcp",
  description: "Webflow: CMS items, pages, assets, and sites.",
  auth: connect({ connector: "webflow", principalType: "app" }),
});
