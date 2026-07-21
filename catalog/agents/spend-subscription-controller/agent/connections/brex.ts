import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://api.brex.com/mcp",
  description: "Brex: expenses, cards, budgets, and cash.",
  auth: connect({ connector: "brex", principalType: "app" }),
});
