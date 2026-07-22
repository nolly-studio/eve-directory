import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Reminder = {
  id: string;
  phoneNumber: string;
  text: string;
  runAt: string;
  status: "pending" | "claimed" | "done";
  leaseUntil: string | null;
};

const STORE_PATH = path.join(process.cwd(), "var", "reminders.json");

async function load(): Promise<Reminder[]> {
  try {
    return JSON.parse(await readFile(STORE_PATH, "utf-8")) as Reminder[];
  } catch {
    return [];
  }
}

async function save(reminders: Reminder[]): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(
    STORE_PATH,
    `${JSON.stringify(reminders, null, 2)}\n`,
    "utf-8"
  );
}

export async function createReminder(input: {
  phoneNumber: string;
  text: string;
  runAt: Date;
}): Promise<Reminder> {
  const reminders = await load();
  const reminder: Reminder = {
    id: randomUUID(),
    phoneNumber: input.phoneNumber,
    text: input.text,
    runAt: input.runAt.toISOString(),
    status: "pending",
    leaseUntil: null,
  };
  reminders.push(reminder);
  await save(reminders);
  return reminder;
}

/** Atomically claim due reminders so overlapping minute ticks do not double-send. */
export async function claimDue(options: {
  now: Date;
  limit: number;
  leaseForMs: number;
}): Promise<Reminder[]> {
  const reminders = await load();
  const nowMs = options.now.getTime();
  const leaseUntil = new Date(nowMs + options.leaseForMs).toISOString();
  const claimed: Reminder[] = [];

  for (const reminder of reminders) {
    if (claimed.length >= options.limit) break;
    if (reminder.status === "done") continue;
    if (new Date(reminder.runAt).getTime() > nowMs) continue;
    if (
      reminder.status === "claimed" &&
      reminder.leaseUntil &&
      new Date(reminder.leaseUntil).getTime() > nowMs
    ) {
      continue;
    }
    reminder.status = "claimed";
    reminder.leaseUntil = leaseUntil;
    claimed.push(reminder);
  }

  if (claimed.length > 0) await save(reminders);
  return claimed;
}

export async function completeReminder(id: string): Promise<void> {
  const reminders = await load();
  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return;
  reminder.status = "done";
  reminder.leaseUntil = null;
  await save(reminders);
}

export async function releaseReminder(
  id: string,
  retryAt: Date
): Promise<void> {
  const reminders = await load();
  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return;
  reminder.status = "pending";
  reminder.leaseUntil = null;
  reminder.runAt = retryAt.toISOString();
  await save(reminders);
}
