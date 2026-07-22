import type { CommunityAgentListing } from "@/lib/catalog/types";

export interface RegistryFile {
  path: string;
  content: string;
  type: "registry:file";
  target: string;
}

export interface CommunityRegistryItem {
  $schema: string;
  name: string;
  title: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  files: RegistryFile[];
  meta: {
    runtime: "eve";
    layout: "eve-app";
    version: string;
    license: string;
    category: string;
    integrations: string[];
    community: true;
    author: string;
  };
  categories: string[];
  type: "registry:block";
}

const AGENT_TS = `import { defineAgent } from "eve";

export default defineAgent({
  model: "openai/gpt-5.4-mini",
});
`;

const TSCONFIG = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "types": ["node"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["agent/**/*.ts", "evals/**/*.ts"]
}
`;

const GITIGNORE = `node_modules/
.eve/
var/
.env
.env.local
*.tsbuildinfo
`;

function packageJson(slug: string): string {
  return `${JSON.stringify(
    {
      name: slug,
      version: "1.0.0",
      private: true,
      type: "module",
      scripts: {
        dev: "eve dev",
        build: "eve build",
        start: "eve start",
        eval: "eve eval",
        typecheck: "tsc",
      },
      dependencies: {
        eve: "^0.24.6",
        zod: "^4.4.3",
      },
      devDependencies: {
        "@types/node": "24.x",
        typescript: "^5.9.3",
      },
      engines: {
        node: "24.x",
      },
    },
    null,
    2
  )}\n`;
}

function readme(agent: CommunityAgentListing): string {
  return `# ${agent.name}

${agent.summary}

Community agent by [@${agent.handle}](https://www.evedirectory.com/u/${agent.handle}) on [Eve Directory](https://www.evedirectory.com).

Generated from the standard Eve starter template. The authored content is \`agent/instructions.md\`.

## Run

\`\`\`bash
npm install
npm run dev
\`\`\`

See \`SETUP.md\` for next steps.

## License

MIT
`;
}

function setup(agent: CommunityAgentListing): string {
  const integrationLines =
    agent.integrations.length > 0
      ? agent.integrations.map((slug) => `- \`${slug}\``).join("\n")
      : "- None selected — add channels/connections as needed.";

  return `# Set up ${agent.name}

## 1. Install and run

\`\`\`bash
npm install
npm run dev
\`\`\`

## 2. Review instructions

Edit \`agent/instructions.md\` to tailor the agent. The rest of the project is the standard Eve starter scaffold.

## 3. Integrations

Suggested integrations from the listing:

${integrationLines}

Wire channels/connections under \`agent/channels\` and \`agent/connections\` when you're ready.

## Model access

Model access follows your eve setup (Vercel AI Gateway or a provider key).
`;
}

function envExample(agent: CommunityAgentListing): string {
  const hints =
    agent.integrations.length > 0
      ? agent.integrations.map((slug) => `# ${slug}`).join("\n")
      : "# Add provider/channel secrets as needed.";

  return `# Community agent scaffold — no secrets required to start.
#
# Integrations noted on the listing:
${hints}
#
# Model access follows your eve setup (Vercel AI Gateway or a provider key).
`;
}

function file(
  slug: string,
  relativePath: string,
  content: string
): RegistryFile {
  return {
    path: `community/${slug}/${relativePath}`,
    content,
    type: "registry:file",
    target: relativePath,
  };
}

/** Build a shadcn registry item from a community prompt agent + golden template. */
export function buildCommunityRegistryItem(
  agent: CommunityAgentListing
): CommunityRegistryItem {
  const registryName = `${agent.handle}--${agent.slug}`;

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: registryName,
    title: agent.name,
    description: agent.summary,
    dependencies: ["eve@^0.24.6", "zod@^4.4.3"],
    devDependencies: ["@types/node@24.x", "typescript@^5.9.3"],
    files: [
      file(registryName, "package.json", packageJson(agent.slug)),
      file(registryName, "tsconfig.json", TSCONFIG),
      file(registryName, ".gitignore", GITIGNORE),
      file(registryName, "README.md", readme(agent)),
      file(registryName, "SETUP.md", setup(agent)),
      file(registryName, ".env.example", envExample(agent)),
      file(registryName, "agent/agent.ts", AGENT_TS),
      file(registryName, "agent/instructions.md", `${agent.instructions}\n`),
    ],
    meta: {
      runtime: "eve",
      layout: "eve-app",
      version: agent.version,
      license: agent.license,
      category: agent.category.slug,
      integrations: agent.integrations,
      community: true,
      author: agent.handle,
    },
    categories: [agent.category.slug],
    type: "registry:block",
  };
}
