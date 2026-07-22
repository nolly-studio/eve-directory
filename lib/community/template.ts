import type {
  CommunityAgentFile,
  CommunityAgentListing,
  FileTreeNode,
} from "@/lib/catalog/types";

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

/** Starter path for an authored file — names are validated kebab-case. */
export function communityFilePath(authored: CommunityAgentFile): string {
  const folder = authored.kind === "skill" ? "skills" : "examples";
  return `agent/${folder}/${authored.name}.md`;
}

/**
 * Frontmatter is assembled here, never typed by users — descriptions are
 * plain text collected in the form, so YAML injection is not possible
 * beyond what the quoted string escapes.
 */
export function communityFileContent(authored: CommunityAgentFile): string {
  const body = `${authored.content}\n`;

  if (authored.kind !== "skill") {
    return body;
  }

  const description = authored.description.replaceAll('"', '\\"');
  return `---\ndescription: "${description}"\n---\n\n${body}`;
}

function authoredPaths(agent: CommunityAgentListing): string[] {
  return [
    "agent/instructions.md",
    ...agent.files.map((authored) => communityFilePath(authored)),
  ];
}

function readme(agent: CommunityAgentListing): string {
  const authored = authoredPaths(agent)
    .map((path) => `\`${path}\``)
    .join(", ");

  return `# ${agent.name}

${agent.summary}

Community agent by [@${agent.handle}](https://www.evedirectory.com/u/${agent.handle}) on [Eve Directory](https://www.evedirectory.com).

Generated from the standard Eve starter template. Authored content: ${authored}.

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

  const skills = agent.files.filter((authored) => authored.kind === "skill");
  const examples = agent.files.filter(
    (authored) => authored.kind === "example"
  );
  const knowledgeSection =
    skills.length > 0 || examples.length > 0
      ? `\n## Authored knowledge\n\n${[
          skills.length > 0
            ? `Skills under \`agent/skills/\` load on demand:\n\n${skills
                .map(
                  (authored) =>
                    `- \`${authored.name}.md\` — ${authored.description}`
                )
                .join("\n")}`
            : "",
          examples.length > 0
            ? `Examples under \`agent/examples/\` show expected behavior:\n\n${examples
                .map((authored) => `- \`${authored.name}.md\``)
                .join("\n")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n")}\n`
      : "";

  return `# Set up ${agent.name}

## 1. Install and run

\`\`\`bash
npm install
npm run dev
\`\`\`

## 2. Review instructions

Edit \`agent/instructions.md\` to tailor the agent. The rest of the project is the standard Eve starter scaffold.
${knowledgeSection}
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

/**
 * Explorer inputs for the detail page — the same authored files the starter
 * installs, browsable with the official-agent FileExplorer.
 */
export function communityAgentExplorer(agent: CommunityAgentListing): {
  tree: FileTreeNode[];
  inlineFiles: Record<string, string>;
} {
  const inlineFiles: Record<string, string> = {
    "agent/instructions.md": `${agent.instructions}\n`,
  };

  const tree: FileTreeNode[] = [
    {
      name: "instructions.md",
      path: "agent/instructions.md",
      type: "file",
    },
  ];

  for (const kind of ["skill", "example"] as const) {
    const ofKind = agent.files.filter((authored) => authored.kind === kind);
    if (ofKind.length === 0) {
      continue;
    }

    const folder = kind === "skill" ? "skills" : "examples";
    const children: FileTreeNode[] = [];

    for (const authored of ofKind) {
      const path = communityFilePath(authored);
      inlineFiles[path] = communityFileContent(authored);
      children.push({ name: `${authored.name}.md`, path, type: "file" });
    }

    tree.push({
      name: folder,
      path: `agent/${folder}`,
      type: "directory",
      children,
    });
  }

  return { inlineFiles, tree };
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
      ...agent.files.map((authored) =>
        file(
          registryName,
          communityFilePath(authored),
          communityFileContent(authored)
        )
      ),
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
