import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type MemoryRecord = {
  id: string;
  fact: string;
  createdAt: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  due?: string;
  createdAt: string;
};

type Store = {
  memories: Record<string, MemoryRecord[]>;
  tasks: Record<string, TaskRecord[]>;
};

const STORE_PATH = path.join(process.cwd(), "var", "memory.json");

async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(STORE_PATH, "utf-8")) as Store;
  } catch {
    return { memories: {}, tasks: {} };
  }
}

async function writeStore(store: Store) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf-8");
}

export async function rememberFact(userId: string, fact: string) {
  const store = await readStore();
  const record: MemoryRecord = {
    id: randomUUID(),
    fact,
    createdAt: new Date().toISOString(),
  };
  store.memories[userId] = [...(store.memories[userId] ?? []), record];
  await writeStore(store);
  return record;
}

export async function listFacts(userId: string) {
  const store = await readStore();
  return store.memories[userId] ?? [];
}

export async function forgetFact(userId: string, id: string) {
  const store = await readStore();
  const before = store.memories[userId] ?? [];
  const next = before.filter((item) => item.id !== id);
  store.memories[userId] = next;
  await writeStore(store);
  return before.length !== next.length;
}

export async function captureTask(
  userId: string,
  input: { title: string; due?: string }
) {
  const store = await readStore();
  const task: TaskRecord = {
    id: randomUUID(),
    title: input.title,
    due: input.due,
    createdAt: new Date().toISOString(),
  };
  store.tasks[userId] = [...(store.tasks[userId] ?? []), task];
  await writeStore(store);
  return task;
}
