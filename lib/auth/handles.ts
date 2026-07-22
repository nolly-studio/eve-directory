export const RESERVED_HANDLES = new Set([
  "admin",
  "api",
  "eve",
  "evedirectory",
  "official",
  "r",
  "submit",
  "account",
  "u",
  "docs",
  "composer",
  "agents",
  "extensions",
  "integrations",
  "categories",
]);

const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/;

export function normalizeHandle(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9-]/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "")
    .slice(0, 39);
}

export function isValidHandle(handle: string): boolean {
  return HANDLE_PATTERN.test(handle) && !RESERVED_HANDLES.has(handle);
}

export function withHandleSuffix(base: string, attempt: number): string {
  if (attempt === 0) {
    return base;
  }

  const suffix = `-${attempt}`;
  const truncated = base.slice(0, Math.max(1, 39 - suffix.length));
  return `${truncated}${suffix}`;
}
