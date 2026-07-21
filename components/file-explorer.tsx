"use client";

import {
  ArrowRight01Icon,
  Calendar03Icon,
  File01Icon,
  Message01Icon,
  Note01Icon,
  PackageIcon,
  Plug01Icon,
  RobotIcon,
  Settings01Icon,
  SourceCodeIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useMemo, useState } from "react";

import { languageForFile } from "@/lib/catalog/file-language";
import { flattenFileTree } from "@/lib/catalog/tree";
import type { FileTreeNode } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface CategoryStyle {
  icon: IconSvgElement;
}

const categoryStyles: Record<string, CategoryStyle> = {
  "agent.ts": { icon: Settings01Icon },
  "instructions.md": { icon: File01Icon },
  channels: { icon: Message01Icon },
  connections: { icon: Plug01Icon },
  skills: { icon: Note01Icon },
  tools: { icon: Wrench01Icon },
  subagents: { icon: RobotIcon },
  lib: { icon: SourceCodeIcon },
  sandbox: { icon: PackageIcon },
  schedules: { icon: Calendar03Icon },
};

const defaultStyle: CategoryStyle = { icon: File01Icon };

const agentCategoryOrder = [
  "agent.ts",
  "instructions.md",
  "channels",
  "connections",
  "skills",
  "tools",
  "subagents",
  "lib",
  "sandbox",
  "schedules",
];

interface ExplorerFile {
  path: string;
}

interface FileEntry {
  file: ExplorerFile;
  label: string;
}

interface FolderNode {
  entries: FileEntry[];
  key: string;
  kind: "folder";
  style: CategoryStyle;
}

interface LeafNode {
  file: ExplorerFile;
  key: string;
  kind: "leaf";
  style: CategoryStyle;
}

type TreeNode = FolderNode | LeafNode;

interface TreeSection {
  label: string;
  nodes: TreeNode[];
}

function orderedNodes(
  order: string[],
  leaves: Map<string, ExplorerFile>,
  folders: Map<string, FileEntry[]>
): TreeNode[] {
  const keys = new Set([...order, ...leaves.keys(), ...folders.keys()]);

  return [...keys].flatMap<TreeNode>((key) => {
    const style = categoryStyles[key] ?? defaultStyle;
    const leaf = leaves.get(key);

    if (leaf) {
      return [{ file: leaf, key, kind: "leaf", style }];
    }

    const entries = folders.get(key);

    if (!entries) {
      return [];
    }

    entries.sort((a, b) => a.label.localeCompare(b.label));
    return [{ entries, key, kind: "folder", style }];
  });
}

function pushFolderEntry(
  folders: Map<string, FileEntry[]>,
  directory: string,
  file: ExplorerFile,
  label: string
) {
  const entries = folders.get(directory) ?? [];
  entries.push({ file, label });
  folders.set(directory, entries);
}

function classifyPath(
  filePath: string,
  agentLeaves: Map<string, ExplorerFile>,
  agentFolders: Map<string, FileEntry[]>
) {
  const parts = filePath.split("/");
  const [first = "", second = ""] = parts;
  const file = { path: filePath };

  if (first === "agent") {
    if (parts.length === 2 && second) {
      agentLeaves.set(second, file);
      return;
    }

    if (parts.length >= 3 && second) {
      pushFolderEntry(agentFolders, second, file, parts.slice(2).join("/"));
    }

    return;
  }

  // Flat legacy layouts: promote known agent slots into the agent/ section.
  if (
    parts.length === 1 &&
    (first === "agent.ts" || first === "instructions.md")
  ) {
    agentLeaves.set(first, file);
    return;
  }

  if (
    parts.length >= 2 &&
    agentCategoryOrder.includes(first) &&
    first !== "agent.ts" &&
    first !== "instructions.md"
  ) {
    pushFolderEntry(agentFolders, first, file, parts.slice(1).join("/"));
  }
}

/**
 * Eve-style agent/ tree only — evals/ and root project files stay out of the
 * browser. Nested apps use agent/<slot>; flat legacy layouts fall back to
 * root slots.
 */
function buildSections(paths: string[]): TreeSection[] {
  const agentLeaves = new Map<string, ExplorerFile>();
  const agentFolders = new Map<string, FileEntry[]>();

  for (const filePath of paths) {
    classifyPath(filePath, agentLeaves, agentFolders);
  }

  const agentNodes = orderedNodes(
    agentCategoryOrder,
    agentLeaves,
    agentFolders
  );

  if (agentNodes.length === 0) {
    return [];
  }

  return [{ label: "agent/", nodes: agentNodes }];
}

function rowClassName(selected: boolean) {
  return cn(
    "flex min-h-11 w-full touch-manipulation items-center gap-2 rounded-md px-2 text-left font-mono text-[13px] leading-none outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none md:min-h-7",
    selected
      ? "bg-muted font-medium text-gray-1000"
      : "text-gray-900 hover:bg-muted/70 hover:text-gray-1000"
  );
}

export function FileExplorer({
  tree,
  initialContent,
  initialPath,
  slug,
}: {
  tree: FileTreeNode[];
  initialContent: string;
  initialPath: string;
  slug: string;
}) {
  const paths = useMemo(() => flattenFileTree(tree), [tree]);
  const sections = useMemo(() => buildSections(paths), [paths]);

  const [selectedPath, setSelectedPath] = useState(initialPath);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [openFolders, setOpenFolders] = useState<ReadonlySet<string>>(() => {
    const initial = new Set<string>();
    const [first = "", second = ""] = initialPath.split("/");

    if (first === "agent" && second && initialPath.split("/").length >= 3) {
      initial.add(second);
    } else if (
      initialPath.split("/").length >= 2 &&
      agentCategoryOrder.includes(first)
    ) {
      initial.add(first);
    }

    return initial;
  });

  async function loadFile(path: string) {
    setSelectedPath(path);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/agents/${slug}/file?path=${encodeURIComponent(path)}`
      );

      if (!response.ok) {
        throw new Error("Failed to load file");
      }

      const data = (await response.json()) as { content: string };
      setContent(data.content);
    } catch {
      setContent("// Failed to load file");
    } finally {
      setLoading(false);
    }
  }

  function selectFolder(folder: FolderNode) {
    setOpenFolders((current) => new Set(current).add(folder.key));
    const firstFile = folder.entries[0]?.file;

    if (firstFile) {
      void loadFile(firstFile.path);
    }
  }

  function toggleFolder(key: string) {
    setOpenFolders((current) => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  const language = languageForFile(selectedPath);

  return (
    <div className="shadow-surface grid overflow-hidden rounded-xl bg-card md:grid-cols-[200px_minmax(0,1fr)]">
      <nav
        aria-label="Agent source files"
        className="border-b border-border p-3 md:border-r md:border-b-0"
      >
        {sections.map((section) => (
          <div key={section.label} className="mb-3 last:mb-0">
            <p className="px-2 pb-2 text-label-13-mono text-gray-700">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.nodes.map((node) => {
                if (node.kind === "leaf") {
                  const isSelected = node.file.path === selectedPath;

                  return (
                    <li key={node.key}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        className={rowClassName(isSelected)}
                        onClick={() => {
                          void loadFile(node.file.path);
                        }}
                      >
                        <HugeiconsIcon
                          icon={node.style.icon}
                          strokeWidth={1.5}
                          className="size-3.5 shrink-0 text-gray-900"
                          aria-hidden
                        />
                        <span className="truncate">{node.key}</span>
                      </button>
                    </li>
                  );
                }

                const isOpen = openFolders.has(node.key);
                const containsSelected = node.entries.some(
                  (entry) => entry.file.path === selectedPath
                );

                return (
                  <li key={node.key}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className={cn(
                        rowClassName(containsSelected),
                        !containsSelected && "font-normal"
                      )}
                      onClick={() =>
                        isOpen ? toggleFolder(node.key) : selectFolder(node)
                      }
                    >
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        strokeWidth={1.5}
                        className={cn(
                          "size-3 shrink-0 text-gray-700 transition-transform duration-150 motion-reduce:transition-none",
                          isOpen && "rotate-90"
                        )}
                        aria-hidden
                      />
                      <HugeiconsIcon
                        icon={node.style.icon}
                        strokeWidth={1.5}
                        className="size-3.5 shrink-0 text-gray-900"
                        aria-hidden
                      />
                      <span className="truncate">{node.key}/</span>
                    </button>
                    {isOpen ? (
                      <ul className="mt-0.5 ml-4.5 space-y-0.5 border-l border-border pl-3">
                        {node.entries.map((entry) => {
                          const isSelected = entry.file.path === selectedPath;

                          return (
                            <li key={entry.file.path}>
                              <button
                                type="button"
                                aria-pressed={isSelected}
                                className={cn(
                                  "min-h-11 w-full touch-manipulation truncate rounded-md px-2 text-left font-mono text-[13px] leading-none outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none md:min-h-7",
                                  isSelected
                                    ? "bg-muted font-medium text-gray-1000"
                                    : "text-gray-800 hover:bg-muted/70 hover:text-gray-1000"
                                )}
                                onClick={() => {
                                  void loadFile(entry.file.path);
                                }}
                              >
                                {entry.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex min-w-0 flex-col">
        <div className="flex min-h-11 items-center justify-between gap-4 border-b border-border px-4">
          <code className="truncate text-label-13-mono text-gray-1000">
            {selectedPath}
          </code>
          <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-label-12-mono text-gray-900">
            {language}
          </span>
        </div>
        <div className="max-h-140 min-h-80 overflow-auto bg-muted/20 md:min-h-105">
          {loading ? (
            <pre className="p-4 text-copy-14-mono leading-relaxed whitespace-pre-wrap text-gray-700">
              Loading…
            </pre>
          ) : (
            <DynamicCodeBlock
              lang={language}
              code={content}
              codeblock={{
                allowCopy: true,
                className:
                  "my-0 max-w-full rounded-none border-0 bg-transparent shadow-none [&_pre]:w-full [&_pre]:max-w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words",
                viewportProps: {
                  className:
                    "max-h-none overflow-visible p-4 text-copy-14-mono leading-relaxed",
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
