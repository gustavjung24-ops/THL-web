import fs from "node:fs/promises";
import path from "node:path";

async function ensureFile(filePath: string, fallback: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, fallback, "utf8");
  }
}

export function resolveAdminDataPath(fileName: string) {
  return path.join(process.cwd(), "data", "admin", fileName);
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  const filePath = resolveAdminDataPath(fileName);
  await ensureFile(filePath, JSON.stringify(fallback, null, 2));
  const raw = await fs.readFile(filePath, "utf8");
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(fileName: string, payload: T) {
  const filePath = resolveAdminDataPath(fileName);
  await ensureFile(filePath, JSON.stringify(payload, null, 2));
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}