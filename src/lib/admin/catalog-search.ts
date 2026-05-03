import fs from "node:fs/promises";
import path from "node:path";

export type AdminCatalogBrand = "ALL" | "NTN" | "Koyo/JTEKT" | "Tsubaki" | "NOK" | "Mitsuba" | "Soho V-Belt";

export type AdminCatalogSearchItem = {
  code: string;
  normalized_code: string;
  brand: AdminCatalogBrand;
  product_group: string;
  category: string;
  display_name: string;
  source: string;
  source_url: string;
};

type CatalogRecord = AdminCatalogSearchItem & {
  searchable: string[];
};

type UnknownRecord = Record<string, unknown>;

let cachedCatalogPromise: Promise<CatalogRecord[]> | null = null;

function toStr(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizeText(value: string): string {
  return value.toUpperCase().replace(/\s+/g, " ").trim();
}

function mapBrand(rawBrand: string): AdminCatalogBrand {
  const text = normalizeText(rawBrand);
  if (text.includes("SOHO")) return "Soho V-Belt";
  if (text.includes("MITSUBA")) return "Mitsuba";
  if (text.includes("NOK")) return "NOK";
  if (text.includes("TSUBAKI")) return "Tsubaki";
  if (text.includes("KOYO") || text.includes("JTEKT")) return "Koyo/JTEKT";
  return "NTN";
}

async function loadCatalog(): Promise<CatalogRecord[]> {
  const baseDir = path.join(process.cwd(), "public", "data", "products");
  const fileNames = (await fs.readdir(baseDir)).filter((fileName) => fileName.endsWith("_web_import.json"));
  const rows: CatalogRecord[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(baseDir, fileName);
    const parsed = JSON.parse(await fs.readFile(filePath, "utf8")) as UnknownRecord;
    const products = Array.isArray(parsed.products) ? (parsed.products as UnknownRecord[]) : [];

    for (const item of products) {
      const code = toStr(item.product_code);
      if (!code) {
        continue;
      }

      const normalizedCode = toStr(item.normalized_code) || normalizeCode(code);
      const displayName = toStr(item.display_name) || code;
      const brand = mapBrand(toStr(item.brand));
      const productGroup = toStr(item.product_group) || toStr(item.product_family) || toStr(item.type) || "";
      const category = toStr(item.category) || "";
      const source = toStr(item.source);
      const sourceUrl = toStr(item.source_url);

      rows.push({
        code,
        normalized_code: normalizedCode,
        brand,
        product_group: productGroup,
        category,
        display_name: displayName,
        source,
        source_url: sourceUrl,
        searchable: [
          normalizeText(code),
          normalizeText(normalizedCode),
          normalizeText(displayName),
          normalizeText(productGroup),
          normalizeText(category),
          normalizeText(brand),
        ].filter(Boolean),
      });
    }
  }

  return rows;
}

async function getCatalog(): Promise<CatalogRecord[]> {
  if (!cachedCatalogPromise) {
    cachedCatalogPromise = loadCatalog().catch((error) => {
      cachedCatalogPromise = null;
      throw error;
    });
  }

  return cachedCatalogPromise;
}

export async function searchAdminCatalog(input: {
  query: string;
  brand?: AdminCatalogBrand;
  limit?: number;
}): Promise<AdminCatalogSearchItem[]> {
  const query = toStr(input.query);
  if (!query) {
    return [];
  }

  const normalizedQuery = normalizeText(query);
  const normalizedCodeQuery = normalizeCode(query);
  const brand = input.brand && input.brand !== "ALL" ? input.brand : null;
  const limit = Math.max(1, Math.min(input.limit ?? 20, 100));
  const catalog = await getCatalog();

  const scored = catalog
    .filter((item) => (brand ? item.brand === brand : true))
    .map((item) => {
      let score = 0;
      if (item.normalized_code === normalizedCodeQuery) score += 100;
      if (item.normalized_code.startsWith(normalizedCodeQuery)) score += 75;
      if (item.searchable.some((part) => part.includes(normalizedQuery))) score += 40;
      if (item.code.toUpperCase().includes(normalizedQuery)) score += 30;
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score || left.item.normalized_code.localeCompare(right.item.normalized_code))
    .slice(0, limit)
    .map(({ item }) => ({
      code: item.code,
      normalized_code: item.normalized_code,
      brand: item.brand,
      product_group: item.product_group,
      category: item.category,
      display_name: item.display_name,
      source: item.source,
      source_url: item.source_url,
    }));

  return scored;
}
