import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type VisibilitySnapshot = {
  query: string;
  channel: "ai-answer" | "search" | "local";
  content: string;
  cited?: boolean;
  observedAt: string;
};

const STORE_PATH = path.join(process.cwd(), "var", "visibility.json");

function keyOf(s: Pick<VisibilitySnapshot, "query" | "channel">) {
  return `${s.query.trim().toLowerCase()}::${s.channel}`;
}

export async function saveSnapshot(
  snapshot: VisibilitySnapshot
): Promise<VisibilitySnapshot | null> {
  let all: VisibilitySnapshot[] = [];
  try {
    all = JSON.parse(
      await readFile(STORE_PATH, "utf-8")
    ) as VisibilitySnapshot[];
  } catch {
    all = [];
  }
  const key = keyOf(snapshot);
  const previous = all.find((item) => keyOf(item) === key) ?? null;
  const next = all.filter((item) => keyOf(item) !== key);
  next.push(snapshot);
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
  return previous;
}
