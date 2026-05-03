import fs from "node:fs/promises";
import path from "node:path";

export type PriceStatus = "active" | "stale" | "manual_review";

export type PriceMasterRecord = {
  brand: string;
  normalized_code: string;
  code: string;
  product_group: string;
  price_vnd: number;
  price_status: PriceStatus;
  source: string;
  source_url: string;
};

type UnknownRecord = Record<string, unknown>;

let cachedPriceRecordsPromise: Promise<PriceMasterRecord[]> | null = null;

function toStr(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function derivePriceStatus(rawStatus: string): PriceStatus {
  const upper = rawStatus.toUpperCase();
  if (upper === "ACTIVE") return "active";
  if (upper === "STALE") return "stale";
  return "manual_review";
}

async function listCandidateFiles(): Promise<string[]> {
  const roots = [
    path.join(process.cwd(), "data_SP", "import"),
    path.join(process.cwd(), "data_SP", "pricing"),
  ];

  const result: string[] = [];
  for (const root of roots) {
    try {
      const names = await fs.readdir(root);
      for (const name of names) {
        if (!name.endsWith(".json")) continue;
        if (!name.toLowerCase().includes("price-master")) continue;
        result.push(path.join(root, name));
      }
    } catch {
      // Ignore missing directory.
    }
  }

  return result;
}

function toPriceRecord(input: UnknownRecord): PriceMasterRecord | null {
  const code =
    toStr(input.code) ||
    toStr(input.product_code) ||
    toStr(input.productCode) ||
    toStr(input.sku);

  const normalizedCode =
    toStr(input.normalized_code) ||
    toStr(input.normalizedCode) ||
    normalizeCode(code);

  const price =
    toNumber(input.price_vnd) ??
    toNumber(input.priceVnd) ??
    toNumber(input.price) ??
    toNumber(input.internal_price);

  if (!code || !normalizedCode || price === null) {
    return null;
  }

  return {
    brand: toStr(input.brand) || "",
    normalized_code: normalizedCode,
    code,
    product_group: toStr(input.product_group) || toStr(input.productGroup) || "",
    price_vnd: Math.max(0, Math.round(price)),
    price_status: derivePriceStatus(toStr(input.price_status) || toStr(input.priceStatus)),
    source: toStr(input.source),
    source_url: toStr(input.source_url) || toStr(input.sourceUrl),
  };
}

async function loadPriceRecords(): Promise<PriceMasterRecord[]> {
  const files = await listCandidateFiles();
  const rows: PriceMasterRecord[] = [];

  for (const filePath of files) {
    try {
      const parsed = JSON.parse(await fs.readFile(filePath, "utf8")) as unknown;
      const records = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === "object" && Array.isArray((parsed as { records?: unknown[] }).records)
          ? (parsed as { records: unknown[] }).records
          : [];

      for (const row of records) {
        if (!row || typeof row !== "object") continue;
        const mapped = toPriceRecord(row as UnknownRecord);
        if (!mapped) continue;
        rows.push(mapped);
      }
    } catch {
      // Skip invalid files.
    }
  }

  return rows;
}

async function getPriceRecords(): Promise<PriceMasterRecord[]> {
  if (!cachedPriceRecordsPromise) {
    cachedPriceRecordsPromise = loadPriceRecords().catch((error) => {
      cachedPriceRecordsPromise = null;
      throw error;
    });
  }

  return cachedPriceRecordsPromise;
}

export async function listPriceMasterRecords(): Promise<PriceMasterRecord[]> {
  return getPriceRecords();
}

export async function findPriceByNormalizedCode(normalizedCode: string): Promise<PriceMasterRecord | null> {
  const safeCode = normalizeCode(normalizedCode);
  if (!safeCode) {
    return null;
  }

  const records = await getPriceRecords();
  return records.find((item) => normalizeCode(item.normalized_code) === safeCode) ?? null;
}
