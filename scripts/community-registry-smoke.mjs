// Smoke-check the community golden-template registry item shape.
import assert from "node:assert/strict";
import process from "node:process";

const agent = {
  id: "test",
  name: "Smoke Test Agent",
  slug: "smoke-test-agent",
  summary: "A short summary for the smoke test agent listing.",
  version: "1.0.0",
  license: "MIT",
  category: { name: "Starters", slug: "starters" },
  integrations: ["slack"],
  handle: "demo",
  authorName: "Demo",
  authorImage: null,
  installCount: 0,
  instructions:
    "# Identity\n\nYou are a smoke test agent.\n\n# Goal\n\nVerify the community registry template emits a valid item.",
  featured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const { buildCommunityRegistryItem } =
  await import("../lib/community/template.ts");

const item = buildCommunityRegistryItem(agent);

assert.equal(item.type, "registry:block");
assert.equal(item.meta.community, true);
assert.equal(item.meta.author, "demo");
assert.ok(item.files.length >= 7);

const targets = new Set(item.files.map((file) => file.target));
for (const required of [
  "package.json",
  "tsconfig.json",
  "README.md",
  "SETUP.md",
  ".env.example",
  "agent/agent.ts",
  "agent/instructions.md",
]) {
  assert.ok(targets.has(required), `missing file target ${required}`);
}

const instructions = item.files.find(
  (file) => file.target === "agent/instructions.md"
);
assert.ok(instructions?.content.includes("smoke test agent"));

const agentTs = item.files.find((file) => file.target === "agent/agent.ts");
assert.ok(agentTs?.content.includes("defineAgent"));

console.log("community-registry-smoke: ok");
process.exit(0);
