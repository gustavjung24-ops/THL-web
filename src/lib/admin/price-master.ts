import fs from "node:fs/promises";
import path from "node:path";

export type PriceMasterStatus = "active" | "stale" | "contact";
export type AdminPriceLookupStatus = "ok" | "price_master_unavailable" | "price_not_found_for_code" | "price_status_contact";

export type PriceMasterRecord = {
  brand: string;
  normalized_code: string;
  code: string;
  product_group: string;
  price_vnd: number | null;
  price_status: PriceMasterStatus;
  source: string;
  source_url: string;
  updated_at: string;
  note: string;
};

export type AdminPriceLookup = {
  status: AdminPriceLookupStatus;
  internalPrice: number | null;
  record: PriceMasterRecord | null;
};

type UnknownRecord = Record<string, unknown>;

let cachedPriceRecordsPromise: Promise<PriceMasterRecord[]> | null = null;
let cachedPriceMasterFilesPromise: Promise<string[]> | null = null;

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

function derivePriceStatus(rawStatus: string): PriceMasterStatus {
  const upper = rawStatus.toUpperCase();
  if (upper === "ACTIVE" || upper === "LISTED") return "active";
  if (upper === "STALE") return "stale";
  return "contact";
}

async function listCandidateFiles(): Promise<string[]> {
  if (!cachedPriceMasterFilesPromise) {
    cachedPriceMasterFilesPromise = (async () => {
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
    })();
  }

  return cachedPriceMasterFilesPromise;
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

  if (!code || !normalizedCode) {
    return null;
  }

  const priceStatus = derivePriceStatus(toStr(input.price_status) || toStr(input.priceStatus));

  return {
    brand: toStr(input.brand) || "",
    normalized_code: normalizedCode,
    code,
    product_group: toStr(input.product_group) || toStr(input.productGroup) || "",
    price_vnd: price === null ? null : Math.max(0, Math.round(price)),
    price_status: priceStatus,
    source: toStr(input.source),
    source_url: toStr(input.source_url) || toStr(input.sourceUrl),
    updated_at: toStr(input.updated_at) || toStr(input.updatedAt),
    note: toStr(input.note),
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

export async function isPriceMasterAvailable() {
  const files = await listCandidateFiles();
  return files.length > 0;
}

export async function findPriceByNormalizedCode(normalizedCode: string): Promise<PriceMasterRecord | null> {
  const safeCode = normalizeCode(normalizedCode);
  if (!safeCode) {
    return null;
  }

  const records = await getPriceRecords();
  return records.find((item) => normalizeCode(item.normalized_code) === safeCode) ?? null;
}

export async function resolveInternalPriceByNormalizedCode(normalizedCode: string): Promise<AdminPriceLookup> {
  const safeCode = normalizeCode(normalizedCode);
  if (!safeCode) {
    return { status: "price_not_found_for_code", internalPrice: null, record: null };
  }

  const available = await isPriceMasterAvailable();
  if (!available) {
    return { status: "price_master_unavailable", internalPrice: null, record: null };
  }

  const record = await findPriceByNormalizedCode(safeCode);
  if (!record) {
    return { status: "price_not_found_for_code", internalPrice: null, record: null };
  }

  if (record.price_status === "contact" || record.price_vnd == null || record.price_vnd <= 0) {
    return { status: "price_status_contact", internalPrice: null, record };
  }

  return { status: "ok", internalPrice: record.price_vnd, record };
}
