import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

// App-scoped so schedules can use this connection without a user principal.
export default defineMcpClientConnection({
  url: "https://mcp.stripe.com",
  description:
    "Stripe: payments, customers, billing, and financial infrastructure.",
  auth: connect({ connector: "stripe", principalType: "app" }),
});
