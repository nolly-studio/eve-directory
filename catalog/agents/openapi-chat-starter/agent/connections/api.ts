import { defineOpenAPIConnection } from "eve/connections";

// CUSTOMIZE HERE: set OPENAPI_SPEC_URL (and optionally OPENAPI_BASE_URL /
// OPENAPI_TOKEN) in .env. Ships pointed at the public Swagger Petstore.
const DEFAULT_SPEC = "https://petstore3.swagger.io/api/v3/openapi.json";

const spec = process.env.OPENAPI_SPEC_URL ?? DEFAULT_SPEC;
const token = process.env.OPENAPI_TOKEN;
const isDefaultPetstore = spec === DEFAULT_SPEC;

export default defineOpenAPIConnection({
  spec,
  ...(process.env.OPENAPI_BASE_URL
    ? { baseUrl: process.env.OPENAPI_BASE_URL }
    : {}),
  description:
    process.env.OPENAPI_DESCRIPTION ??
    "HTTP API exposed to the agent as tools (default: Swagger Petstore).",
  ...(token ? { auth: { getToken: async () => ({ token }) } } : {}),
  // Narrow the demo Petstore surface; drop the filter for your own API.
  ...(isDefaultPetstore
    ? {
        operations: {
          allow: [
            "getInventory",
            "getPetById",
            "findPetsByStatus",
            "findPetsByTags",
            "getOrderById",
            "getUserByName",
          ],
        },
      }
    : {}),
});
