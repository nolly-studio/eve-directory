import type { FileTreeNode } from "./types";

/** Pure tree helpers — safe to import from client components. */

export function flattenFileTree(nodes: FileTreeNode[]): string[] {
  const files: string[] = [];

  for (const node of nodes) {
    if (node.type === "file") {
      files.push(node.path);
      continue;
    }

    if (node.children) {
      files.push(...flattenFileTree(node.children));
    }
  }

  return files;
}

export function countAuthoredFiles(tree: FileTreeNode[]): number {
  return flattenFileTree(tree).length;
}
