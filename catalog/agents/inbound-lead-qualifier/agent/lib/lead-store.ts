import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type LeadRecord = {
  leadId: string;
  fit: "strong" | "moderate" | "weak" | "disqualified";
  reasons: string[];
  company?: string;
  role?: string;
  scoredAt: string;
};

const STORE_PATH = path.join(process.cwd(), "var", "leads.json");

export async function saveLead(record: LeadRecord): Promise<LeadRecord> {
  let all: LeadRecord[] = [];
  try {
    all = JSON.parse(await readFile(STORE_PATH, "utf-8")) as LeadRecord[];
  } catch {
    all = [];
  }
  const next = all.filter((item) => item.leadId !== record.leadId);
  next.push(record);
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
  return record;
}
