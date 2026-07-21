import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ScoreRecord = {
  account: string;
  risk: "low" | "medium" | "high" | "critical";
  signals: string[];
  notes?: string;
  scoredAt: string;
};

const STORE_PATH = path.join(process.cwd(), "var", "scores.json");

export async function saveScore(
  record: ScoreRecord
): Promise<ScoreRecord | null> {
  let all: ScoreRecord[] = [];
  try {
    all = JSON.parse(await readFile(STORE_PATH, "utf-8")) as ScoreRecord[];
  } catch {
    all = [];
  }
  const key = record.account.trim().toLowerCase();
  const previous =
    all.find((item) => item.account.trim().toLowerCase() === key) ?? null;
  const next = all.filter((item) => item.account.trim().toLowerCase() !== key);
  next.push(record);
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
  return previous;
}
