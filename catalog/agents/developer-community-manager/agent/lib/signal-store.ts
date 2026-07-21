import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type SignalRecord = {
  theme: string;
  evidence: string;
  frequency: "once" | "recurring" | "widespread";
  loggedAt: string;
};

const STORE_PATH = path.join(process.cwd(), "var", "signals.json");

export async function saveSignal(record: SignalRecord): Promise<SignalRecord> {
  let all: SignalRecord[] = [];
  try {
    all = JSON.parse(await readFile(STORE_PATH, "utf-8")) as SignalRecord[];
  } catch {
    all = [];
  }
  all.push(record);
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(all, null, 2)}\n`, "utf-8");
  return record;
}
