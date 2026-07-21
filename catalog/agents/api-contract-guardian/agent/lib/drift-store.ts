import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type DriftRecord = {
  surface: string;
  kind: "breaking" | "additive" | "docs-only";
  summary: string;
  evidence: string;
  observedAt: string;
};

const STORE_PATH = path.join(process.cwd(), "var", "drifts.json");

export async function saveDrift(record: DriftRecord): Promise<DriftRecord> {
  let all: DriftRecord[] = [];
  try {
    all = JSON.parse(await readFile(STORE_PATH, "utf-8")) as DriftRecord[];
  } catch {
    all = [];
  }
  all.push(record);
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(all, null, 2)}\n`, "utf-8");
  return record;
}
