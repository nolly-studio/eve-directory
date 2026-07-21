import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  url: "https://mcp.notion.com/mcp",
  description:
    "Notion workspace where approved competitive briefs are filed and the team keeps its competitor watchlist source of truth.",
  auth: connect({ connector: "notion", principalType: "app" }),
});
