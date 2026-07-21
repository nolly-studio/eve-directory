import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Surface =
  | "pricing"
  | "changelog"
  | "blog"
  | "docs"
  | "careers"
  | "traffic"
  | "other";

export type Snapshot = {
  competitor: string;
  surface: Surface;
  url?: string;
  content: string;
  observedAt: string;
};

// Local JSON store so the base agent runs with zero external services.
// Tools execute in the app runtime, so swapping this for a database or
// blob store is an ordinary code change — the tool contracts stay the same.
const STORE_PATH = path.join(process.cwd(), "var", "snapshots.json");

function keyOf(snapshot: Pick<Snapshot, "competitor" | "surface">): string {
  return `${snapshot.competitor.trim().toLowerCase()}::${snapshot.surface}`;
}

export async function readSnapshots(): Promise<Snapshot[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as Snapshot[];
  } catch {
    return [];
  }
}

/**
 * Store the latest state of one competitor surface and return the snapshot it
 * replaced, so the caller can diff current against previous in one step.
 */
export async function saveSnapshot(
  snapshot: Snapshot
): Promise<Snapshot | null> {
  const all = await readSnapshots();
  const key = keyOf(snapshot);
  const previous = all.find((item) => keyOf(item) === key) ?? null;
  const next = all.filter((item) => keyOf(item) !== key);
  next.push(snapshot);

  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf-8");

  return previous;
}
