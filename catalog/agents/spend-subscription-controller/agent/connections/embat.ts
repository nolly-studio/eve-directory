import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://tellme.embat.io/mcp",
  description: "Embat: cash, debt, payments, and accounting.",
  auth: connect({ connector: "embat", principalType: "app" }),
});
