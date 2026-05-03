import fs from "node:fs/promises";
import path from "node:path";
import { resolveInternalPriceByNormalizedCode } from "@/lib/admin/price-master";

export type AdminCatalogBrand = "ALL" | "NTN" | "Koyo" | "Tsubaki" | "NOK" | "Mitsuba" | "Soho V-Belt";
export type AdminCatalogGroup = "all" | "bearings" | "housings" | "chains" | "seals" | "vbelts";

export type AdminCatalogSearchResult = {
  brand: Exclude<AdminCatalogBrand, "ALL">;
  code: string;
  normalizedCode: string;
  name: string;
  productGroup: string;
  productGroupLabel: string;
  internalPrice: number | null;
  priceStatus: "ok" | "active" | "stale" | "contact" | "price_master_unavailable" | "price_not_found_for_code" | "price_status_contact";
  source: string;
  sourceUrl: string;
  confidence: "high" | "medium";
};

type CatalogRecord = {
  brand: Exclude<AdminCatalogBrand, "ALL">;
  code: string;
  normalizedCode: string;
  name: string;
  productGroup: string;
  productGroupLabel: string;
  category: string;
  source: string;
  sourceUrl: string;
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

function mapBrand(rawBrand: string): Exclude<AdminCatalogBrand, "ALL"> {
  const text = normalizeText(rawBrand);
  if (text.includes("SOHO")) return "Soho V-Belt";
  if (text.includes("MITSUBA")) return "Mitsuba";
  if (text.includes("NOK")) return "NOK";
  if (text.includes("TSUBAKI")) return "Tsubaki";
  if (text.includes("KOYO") || text.includes("JTEKT")) return "Koyo";
  return "NTN";
}

function toGroupLabel(category: string, productGroup: string): string {
  const searchable = `${category} ${productGroup}`.toLowerCase();
  if (searchable.includes("xích") || searchable.includes("xich") || searchable.includes("chain")) return "Xích công nghiệp";
  if (searchable.includes("phớt") || searchable.includes("phot") || searchable.includes("seal")) return "Phớt chặn dầu";
  if (searchable.includes("dây") || searchable.includes("curoa") || searchable.includes("belt")) return "Dây curoa";
  if (searchable.includes("gối") || searchable.includes("goi") || searchable.includes("housing")) return "Gối đỡ / vòng bi";
  return "Vòng bi";
}

function toGroupValue(category: string, productGroup: string): AdminCatalogGroup {
  const label = toGroupLabel(category, productGroup);
  if (label === "Xích công nghiệp") return "chains";
  if (label === "Phớt chặn dầu") return "seals";
  if (label === "Dây curoa") return "vbelts";
  if (label === "Gối đỡ / vòng bi") return "housings";
  return "bearings";
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
      const name = toStr(item.display_name) || code;
      const brand = mapBrand(toStr(item.brand));
      const category = toStr(item.category);
      const productGroup = toStr(item.product_group) || toStr(item.product_family) || toStr(item.type) || "";
      const productGroupLabel = toGroupLabel(category, productGroup);
      const source = toStr(item.source);
      const sourceUrl = toStr(item.source_url);

      rows.push({
        brand,
        code,
        normalizedCode,
        name,
        productGroup: toGroupValue(category, productGroup),
        productGroupLabel,
        category,
        source,
        sourceUrl,
        searchable: [
          normalizeText(code),
          normalizeText(normalizedCode),
          normalizeText(name),
          normalizeText(productGroup),
          normalizeText(productGroupLabel),
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
  productGroup?: AdminCatalogGroup;
  limit?: number;
}): Promise<AdminCatalogSearchResult[]> {
  const query = toStr(input.query);
  if (!query) {
    return [];
  }

  const normalizedQuery = normalizeText(query);
  const normalizedCodeQuery = normalizeCode(query);
  const brand = input.brand && input.brand !== "ALL" ? input.brand : null;
  const productGroup = input.productGroup && input.productGroup !== "all" ? input.productGroup : null;
  const limit = Math.max(1, Math.min(input.limit ?? 20, 100));
  const catalog = await getCatalog();

  const scored = catalog
    .filter((item) => (brand ? item.brand === brand : true))
    .filter((item) => (productGroup ? item.productGroup === productGroup : true))
    .map((item) => {
      let score = 0;
      if (normalizedCodeQuery && item.normalizedCode === normalizedCodeQuery) score += 140;
      if (normalizedCodeQuery && item.normalizedCode.startsWith(normalizedCodeQuery)) score += 90;
      if (item.searchable.some((part) => part.includes(normalizedQuery))) score += 55;
      if (item.code.toUpperCase().includes(normalizedQuery)) score += 30;
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score || left.item.normalizedCode.localeCompare(right.item.normalizedCode))
    .slice(0, limit);

  const pricedRows = await Promise.all(
    scored.map(async ({ item, score }) => {
      const priceLookup = await resolveInternalPriceByNormalizedCode(item.normalizedCode);
      return {
        brand: item.brand,
        code: item.code,
        normalizedCode: item.normalizedCode,
        name: item.name,
        productGroup: item.productGroup,
        productGroupLabel: item.productGroupLabel,
        internalPrice: priceLookup.internalPrice,
        priceStatus: priceLookup.status === "ok" ? (priceLookup.record?.price_status ?? "ok") : priceLookup.status,
        source: item.source,
        sourceUrl: item.sourceUrl,
        confidence: score >= 140 ? "high" : "medium",
      } satisfies AdminCatalogSearchResult;
    }),
  );

  return pricedRows;
}
