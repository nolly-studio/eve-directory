import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Extracts fields from a pasted receipt transcript.",
  async test(t) {
    await t.send(
      [
        "Here is a receipt (transcribed from a photo):",
        "WHOLE FOODS MARKET",
        "2026-07-10",
        "Organic Bananas  2.49",
        "Oat Milk         4.99",
        "TOTAL            7.48 USD",
        "",
        "Extract it in the required format.",
      ].join("\n")
    );
    t.succeeded();
    t.check(t.reply, includes(/Merchant:/i));
    t.check(t.reply, includes(/Total:/i));
    t.check(t.reply, includes(/7\.48|7,48/)).soft();
  },
});
