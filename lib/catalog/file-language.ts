const EXTENSION_LANGUAGES: Record<string, string> = {
  bash: "bash",
  css: "css",
  env: "dotenv",
  js: "javascript",
  json: "json",
  md: "markdown",
  mdx: "mdx",
  mjs: "javascript",
  sh: "bash",
  ts: "typescript",
  tsx: "tsx",
  yaml: "yaml",
  yml: "yaml",
};

export function languageForFile(path: string): string {
  const name = path.split("/").pop() ?? path;

  if (name.startsWith(".env")) {
    return "dotenv";
  }

  const ext = name.includes(".") ? (name.split(".").pop() ?? "") : "";
  return EXTENSION_LANGUAGES[ext] ?? "plaintext";
}
