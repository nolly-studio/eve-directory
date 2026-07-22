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
  files: [
    {
      kind: "skill",
      name: "release-notes",
      description: 'Load when drafting release notes with "quoted" criteria',
      content: "# Release notes\n\nAlways group changes by area.",
    },
    {
      kind: "example",
      name: "weekly-sync",
      description: "",
      content: "# Scenario\n\nUser: summarize the week.\n\nAgent: ...",
    },
  ],
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

const skill = item.files.find(
  (file) => file.target === "agent/skills/release-notes.md"
);
assert.ok(skill, "missing authored skill file");
assert.ok(
  skill.content.startsWith(
    '---\ndescription: "Load when drafting release notes with \\"quoted\\" criteria"\n---\n\n'
  ),
  "skill frontmatter malformed"
);

const example = item.files.find(
  (file) => file.target === "agent/examples/weekly-sync.md"
);
assert.ok(example, "missing authored example file");
assert.ok(
  !example.content.startsWith("---"),
  "examples must not carry frontmatter"
);

console.log("community-registry-smoke: ok");
process.exit(0);
