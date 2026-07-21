import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type AnomalyRecord = {
  vendor: string;
  kind: "anomaly" | "renewal" | "duplicate";
  amount?: number;
  summary: string;
  flaggedAt: string;
};

const STORE_PATH = path.join(process.cwd(), "var", "spend.json");

export async function saveAnomaly(
  record: AnomalyRecord
): Promise<AnomalyRecord> {
  let all: AnomalyRecord[] = [];
  try {
    all = JSON.parse(await readFile(STORE_PATH, "utf-8")) as AnomalyRecord[];
  } catch {
    all = [];
  }
  all.push(record);
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(all, null, 2)}\n`, "utf-8");
  return record;
}
