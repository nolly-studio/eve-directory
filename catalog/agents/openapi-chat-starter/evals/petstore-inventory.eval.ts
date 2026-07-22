import { defineEval } from "eve/evals";

export default defineEval({
  description: "Asks Petstore inventory via the OpenAPI connection tool.",
  async test(t) {
    await t.send(
      "What is in the petstore inventory? Use the api tools — do not guess."
    );
    t.succeeded();
    t.calledTool("api__getInventory");
  },
});
