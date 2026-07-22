import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type UrlStatus = "up" | "down" | "unknown";

export type StatusSnapshot = {
  status: UrlStatus;
  checkedAt: string | null;
};

const STORE_PATH = path.join(process.cwd(), "var", "uptime-status.json");

export async function readLastStatus(): Promise<StatusSnapshot> {
  try {
    return JSON.parse(await readFile(STORE_PATH, "utf-8")) as StatusSnapshot;
  } catch {
    return { status: "unknown", checkedAt: null };
  }
}

export async function writeLastStatus(snapshot: StatusSnapshot): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(
    STORE_PATH,
    `${JSON.stringify(snapshot, null, 2)}\n`,
    "utf-8"
  );
}
