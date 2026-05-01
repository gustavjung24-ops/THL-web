import fs from "node:fs/promises";
import path from "node:path";

const BRAND_PRIORITY_ALL = ["NTN", "Tsubaki", "Soho V-Belt", "NOK"] as const;

const BRAND_MAP: Record<string, string> = {
  ALL: "ALL",
  "TATCANHANHANG": "ALL",
  NTN: "NTN",
  KOYO: "Koyo",
  KOYOJTEKT: "Koyo",
  TSUBAKI: "Tsubaki",
  NOK: "NOK",
  MITSUBA: "Mitsuba",
  SOHO: "Soho V-Belt",
  SOHOVBELT: "Soho V-Belt",
};

const GROUP_MAP: Record<string, ProductGroupFilter> = {
  ALL: "ALL",
  "TATCANHOM": "ALL",
  "VONGBI": "Vòng bi",
  "GOIDOVONGBI": "Gối đỡ / vòng bi",
  "XICHCONGNGHIEP": "Xích công nghiệp",
  "PHOTCHANDAU": "Phớt chặn dầu",
  "DAYCUROA": "Dây curoa",
};

type UnknownRecord = Record<string, unknown>;

export type ProductBrand = "ALL" | "NTN" | "Koyo" | "Tsubaki" | "NOK" | "Mitsuba" | "Soho V-Belt";
export type ProductGroupFilter = "ALL" | "Vòng bi" | "Gối đỡ / vòng bi" | "Xích công nghiệp" | "Phớt chặn dầu" | "Dây curoa";

export type ProductSearchRequest = {
  query: string;
  brand: string;
  group: string;
  application?: string;
  dInner?: string;
  dOuter?: string;
  bThickness?: string;
  limit?: number;
};

export type ProductSearchItem = {
  productCode: string;
  displayName: string;
  brand: ProductBrand;
  group: ProductGroupFilter;
  category: string;
  dimensions: string;
  application: string;
  status: string;
  matchedBy: string;
  matchedAlias: string | null;
};

export type ProductSearchGroup = {
  brand: ProductBrand;
  items: ProductSearchItem[];
};

export type ProductSearchResponse = {
  query: string;
  brand: ProductBrand;
  group: ProductGroupFilter;
  total: number;
  groups: ProductSearchGroup[];
};

type IndexedProduct = {
  productCode: string;
  normalizedCode: string;
  displayName: string;
  brand: ProductBrand;
  group: ProductGroupFilter;
  category: string;
  dimensions: string;
  application: string;
  status: string;
  priorityScore: number;
  aliasOriginals: string[];
  aliasCompacts: Set<string>;
  keywordCompacts: string[];
  dimensionCompacts: string[];
  textSearchPool: string[];
  applicationCompact: string;
  dInnerMm: number | null;
  dOuterMm: number | null;
  bThicknessMm: number | null;
};

type SearchCandidate = {
  item: IndexedProduct;
  matchTier: number;
  matchedBy: string;
  matchedAlias: string | null;
  keywordStrength: number;
  brandOrder: number;
};

type ProductSearchIndex = {
  products: IndexedProduct[];
};

let cachedIndex: ProductSearchIndex | null = null;

function toStr(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stripVietnamese(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function normalizeForSearch(input: string): string {
  return stripVietnamese(input).toUpperCase().replace(/\s+/g, " ").trim();
}

function normalizeCompact(input: string): string {
  return normalizeForSearch(input).replace(/[^A-Z0-9]/g, "");
}

function tokenize(input: string): string[] {
  return normalizeForSearch(input)
    .split(/[^A-Z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

  function extractNumericTokens(tokens: string[]): string[] {
    return tokens
      .map((token) => (token.match(/\d+/g) ?? []).join(""))
      .filter(Boolean);
  }

function parseNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
}

function parsePriority(product: UnknownRecord): number {
  const direct = parseNumber(product.priority_score);
  if (direct > 0) {
    return direct;
  }

  const priority = normalizeForSearch(toStr(product.priority));
  if (priority === "HIGH") return 90;
  if (priority === "MEDIUM") return 70;
  if (priority === "NORMAL") return 60;
  if (priority === "LOW") return 40;
  return 50;
}

function normalizeBrand(input: string): ProductBrand {
  const compact = normalizeCompact(input);
  return (BRAND_MAP[compact] ?? "ALL") as ProductBrand;
}

function normalizeGroup(input: string): ProductGroupFilter {
  const compact = normalizeCompact(input);
  return (GROUP_MAP[compact] ?? "ALL") as ProductGroupFilter;
}

function mapProductBrand(rawBrand: string): ProductBrand {
  const normalized = normalizeForSearch(rawBrand);
  if (normalized.includes("SOHO")) return "Soho V-Belt";
  if (normalized.includes("MITSUBA")) return "Mitsuba";
  if (normalized.includes("TSUBAKI")) return "Tsubaki";
  if (normalized.includes("KOYO")) return "Koyo";
  if (normalized.includes("NOK")) return "NOK";
  return "NTN";
}

function mapProductGroup(product: UnknownRecord, brand: ProductBrand): ProductGroupFilter {
  const clues = normalizeForSearch(
    [
      toStr(product.category),
      toStr(product.product_group),
      toStr(product.type),
      toStr(product.product_family),
      toStr(product.display_type_vi),
      toStr(product.belt_type),
      toStr(product.seal_profile),
      toStr(product.series),
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (clues.includes("XICH") || clues.includes("CHAIN")) return "Xích công nghiệp";
  if (clues.includes("PHOT") || clues.includes("SEAL") || clues.includes("OIL")) return "Phớt chặn dầu";
  if (clues.includes("CUROA") || clues.includes("VBELT") || clues.includes("V BELT") || clues.includes("BELT")) {
    return "Dây curoa";
  }
  if (clues.includes("GOI") || clues.includes("INSERT") || clues.includes("UCP") || clues.includes("UCF") || clues.includes("UCFL")) {
    return "Gối đỡ / vòng bi";
  }

  if (brand === "Koyo") {
    return "Gối đỡ / vòng bi";
  }

  return "Vòng bi";
}

function extractKeywordList(rawValue: unknown): string[] {
  if (Array.isArray(rawValue)) {
    return rawValue.map((item) => toStr(item)).filter(Boolean);
  }

  const rawText = toStr(rawValue);
  if (!rawText) {
    return [];
  }

  return rawText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function collectDimensionTokens(product: UnknownRecord): string[] {
  const rawCandidates = [
    toStr(product.dimensions),
    toStr(product.size_text),
    toStr(product.d_mm),
    toStr(product.D_mm),
    toStr(product.B_mm),
    toStr(product.B_T_mm),
    toStr(product.width_B_mm),
    toStr(product.shaft_d_mm),
    toStr(product.housing_D_mm),
    toStr(product.pitch_mm),
    toStr(product.pitch_inch),
    toStr(product.inner_width_mm),
    toStr(product.length_label),
    toStr(product.length_value),
    toStr(product.top_width_mm),
    toStr(product.height_mm),
  ];

  return rawCandidates.map(normalizeCompact).filter(Boolean);
}

function getAliasText(alias: UnknownRecord): string {
  return (
    toStr(alias.alias) ||
    toStr(alias.alias_code) ||
    toStr(alias.alias_with_space) ||
    toStr(alias.alias_with_hyphen) ||
    toStr(alias.search_text)
  );
}

function getAliasTargetCode(alias: UnknownRecord): string {
  return (
    toStr(alias.target_product_code) ||
    toStr(alias.base_product_code) ||
    toStr(alias.target_code) ||
    toStr(alias.maps_to_display_product)
  );
}

function getBrandOrder(brand: ProductBrand): number {
  const index = BRAND_PRIORITY_ALL.indexOf(brand as (typeof BRAND_PRIORITY_ALL)[number]);
  return index >= 0 ? index : 10;
}

function readStatus(product: UnknownRecord): string {
  const stockStatus = toStr(product.stock_status);
  if (stockStatus) {
    if (normalizeCompact(stockStatus) === "CANQUOTE") {
      return "Có thể báo giá";
    }
    return stockStatus;
  }

  const verification = toStr(product.verification_status);
  return verification || "Cần xác nhận";
}

function readApplication(product: UnknownRecord): string {
  return (
    toStr(product.application_primary) ||
    toStr(product.application) ||
    toStr(product.application_detail) ||
    toStr(product.machine_groups) ||
    "Đối chiếu theo cụm truyền động công nghiệp"
  );
}

function readDimensions(product: UnknownRecord): string {
  const dimensions = toStr(product.dimensions) || toStr(product.size_text);
  if (dimensions) {
    return dimensions;
  }

  const pieces = [toStr(product.d_mm), toStr(product.D_mm), toStr(product.B_mm) || toStr(product.B_T_mm)].filter(Boolean);
  return pieces.length ? pieces.join(" x ") : "Đối chiếu theo mã và thông số";
}

function buildTextPool(product: UnknownRecord, keywords: string[], aliases: string[]): string[] {
  const pool = [
    toStr(product.product_code),
    toStr(product.normalized_code),
    toStr(product.display_name),
    toStr(product.brand),
    toStr(product.category),
    toStr(product.product_group),
    toStr(product.type),
    toStr(product.series),
    toStr(product.application_primary),
    toStr(product.application),
    toStr(product.application_detail),
    toStr(product.dimensions),
    ...keywords,
    ...aliases,
  ];

  return pool.filter(Boolean).map(normalizeCompact).filter(Boolean);
}

async function loadSearchIndex(): Promise<ProductSearchIndex> {
  if (cachedIndex) {
    return cachedIndex;
  }

  const dataDirectory = path.join(process.cwd(), "public", "data", "products");
  const fileNames = (await fs.readdir(dataDirectory)).filter((fileName) => fileName.endsWith("_web_import.json"));

  const products: IndexedProduct[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as UnknownRecord;
    const rawProducts = Array.isArray(parsed.products) ? (parsed.products as UnknownRecord[]) : [];
    const rawAliases = Array.isArray(parsed.aliases)
      ? (parsed.aliases as UnknownRecord[])
      : Array.isArray(parsed.search_aliases)
        ? (parsed.search_aliases as UnknownRecord[])
        : [];

    const aliasesByTarget = new Map<string, Set<string>>();
    for (const aliasRecord of rawAliases) {
      const aliasText = getAliasText(aliasRecord);
      const targetCode = getAliasTargetCode(aliasRecord);
      if (!aliasText || !targetCode) continue;

      const targetKey = normalizeCompact(targetCode);
      if (!targetKey) continue;

      if (!aliasesByTarget.has(targetKey)) {
        aliasesByTarget.set(targetKey, new Set<string>());
      }
      aliasesByTarget.get(targetKey)?.add(aliasText);
    }

    for (const product of rawProducts) {
      const productCode = toStr(product.product_code);
      if (!productCode) continue;

      const brand = mapProductBrand(toStr(product.brand));
      const group = mapProductGroup(product, brand);
      const normalizedCode = toStr(product.normalized_code) || normalizeCompact(productCode);

      const keywordList = extractKeywordList(product.search_keywords);
      const productAliasSet = aliasesByTarget.get(normalizeCompact(productCode)) ?? new Set<string>();

      const variants = toStr(product.variants)
        .split("|")
        .map((variant) => variant.trim())
        .filter(Boolean);

      for (const variant of variants) {
        productAliasSet.add(variant);
      }

      const aliasOriginals = Array.from(productAliasSet);
      const aliasCompacts = new Set(aliasOriginals.map(normalizeCompact).filter(Boolean));
      const keywordCompacts = keywordList.map(normalizeCompact).filter(Boolean);
      const dimensionCompacts = collectDimensionTokens(product);

      const indexedProduct: IndexedProduct = {
        productCode,
        normalizedCode,
        displayName: toStr(product.display_name) || `${brand} ${productCode}`,
        brand,
        group,
        category: toStr(product.category) || group,
        dimensions: readDimensions(product),
        application: readApplication(product),
        status: readStatus(product),
        priorityScore: parsePriority(product),
        aliasOriginals,
        aliasCompacts,
        keywordCompacts,
        dimensionCompacts,
        textSearchPool: buildTextPool(product, keywordList, aliasOriginals),
        applicationCompact: normalizeCompact(readApplication(product)),
        dInnerMm: parseDimensionValue(product.d_mm) ?? parseDimensionValue(product.shaft_d_mm),
        dOuterMm: parseDimensionValue(product.D_mm) ?? parseDimensionValue(product.housing_D_mm),
        bThicknessMm:
          parseDimensionValue(product.B_mm) ?? parseDimensionValue(product.B_T_mm) ?? parseDimensionValue(product.width_B_mm),
      };

      products.push(indexedProduct);
    }
  }

  cachedIndex = { products };
  return cachedIndex;
}

function isDimensionMatch(item: IndexedProduct, queryCompact: string, queryTokens: string[]): boolean {
  const numericTokens = extractNumericTokens(queryTokens);
  if (!queryCompact || numericTokens.length < 2) {
    return false;
  }

  if (item.dimensionCompacts.some((dimension) => dimension.includes(queryCompact))) {
    return true;
  }

  if (numericTokens.length >= 2) {
    return item.dimensionCompacts.some((dimension) => numericTokens.every((token) => dimension.includes(token)));
  }

  return false;
}

function keywordStrength(item: IndexedProduct, queryCompact: string, queryTokens: string[]): number {
  let strength = 0;

  if (item.keywordCompacts.some((keyword) => keyword === queryCompact)) {
    strength += 3;
  }
  if (item.keywordCompacts.some((keyword) => keyword.includes(queryCompact))) {
    strength += 2;
  }
  if (item.textSearchPool.some((part) => part.includes(queryCompact))) {
    strength += 1;
  }

  if (queryTokens.length > 1) {
    const tokenMatches = queryTokens.filter((token) => item.textSearchPool.some((part) => part.includes(token))).length;
    const numericTokens = extractNumericTokens(queryTokens);
    const codeLikeTokens = queryTokens.filter((token) => /[A-Z]/.test(token) && /\d/.test(token));
    const productCodePool = [normalizeCompact(item.productCode), ...Array.from(item.aliasCompacts)];

    if (tokenMatches < 2) {
      return 0;
    }

    const chainLikeQuery = queryTokens.some((token) => token === "XICH" || token === "CHAIN");
    if (chainLikeQuery && numericTokens.length > 0) {
      const seriesToken = numericTokens[0];
      const expectedPrefix = `RS${seriesToken}`;
      const hasChainSeries = productCodePool.some((value) => value.startsWith(expectedPrefix));
      if (!hasChainSeries) {
        return 0;
      }
    }

    if (numericTokens.length > 0) {
      const hasNumericSignal = numericTokens.some((token) => item.textSearchPool.some((part) => part.includes(token)));
      if (!hasNumericSignal) {
        return 0;
      }
    }

    if (codeLikeTokens.length > 0) {
      const normalizedCodeTokens = codeLikeTokens.map(normalizeCompact).filter(Boolean);
      const hasCodeLikeMatch = normalizedCodeTokens.some((token) => productCodePool.some((value) => value.includes(token)));
      if (!hasCodeLikeMatch) {
        return 0;
      }
    }

    strength += tokenMatches;
  }

  return strength;
}

function computeCandidate(item: IndexedProduct, queryCompact: string, queryTokens: string[]): SearchCandidate | null {
  const productCodeCompact = normalizeCompact(item.productCode);
  const normalizedCodeCompact = normalizeCompact(item.normalizedCode);
    const numericTokens = extractNumericTokens(queryTokens);
  const chainLikeQuery = queryTokens.some((token) => token === "XICH" || token === "CHAIN");

  if (queryCompact === productCodeCompact) {
    return {
      item,
      matchTier: 1,
      matchedBy: "Khớp mã chính",
      matchedAlias: null,
      keywordStrength: 0,
      brandOrder: getBrandOrder(item.brand),
    };
  }

  if (queryCompact === normalizedCodeCompact) {
    return {
      item,
      matchTier: 2,
      matchedBy: "Khớp mã chuẩn hóa",
      matchedAlias: null,
      keywordStrength: 0,
      brandOrder: getBrandOrder(item.brand),
    };
  }

  const exactAlias = item.aliasOriginals.find((alias) => normalizeCompact(alias) === queryCompact) ?? null;
  if (exactAlias) {
    if (chainLikeQuery && numericTokens.length > 0) {
      const expectedPrefix = `RS${numericTokens[0]}`;
      const isSameSeries = productCodeCompact.startsWith(expectedPrefix) || normalizedCodeCompact.startsWith(expectedPrefix);
      if (!isSameSeries) {
        return null;
      }
    }

    return {
      item,
      matchTier: 3,
      matchedBy: "Khớp biến thể/alias",
      matchedAlias: exactAlias,
      keywordStrength: 0,
      brandOrder: getBrandOrder(item.brand),
    };
  }

  const strength = keywordStrength(item, queryCompact, queryTokens);
  if (strength > 0) {
    return {
      item,
      matchTier: 4,
      matchedBy: "Khớp từ khóa",
      matchedAlias: null,
      keywordStrength: strength,
      brandOrder: getBrandOrder(item.brand),
    };
  }

  if (isDimensionMatch(item, queryCompact, queryTokens)) {
    return {
      item,
      matchTier: 5,
      matchedBy: "Khớp kích thước/thông số",
      matchedAlias: null,
      keywordStrength: 0,
      brandOrder: getBrandOrder(item.brand),
    };
  }

  return null;
}

function parseFilterNumber(input: string): number | null {
  const parsed = Number(input.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function approximatelyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= 0.25;
}

export async function searchProducts(request: ProductSearchRequest): Promise<ProductSearchResponse> {
  const query = toStr(request.query);
  const brand = normalizeBrand(request.brand);
  const group = normalizeGroup(request.group);
  const application = toStr(request.application ?? "");
  const dInnerFilter = parseFilterNumber(toStr(request.dInner ?? ""));
  const dOuterFilter = parseFilterNumber(toStr(request.dOuter ?? ""));
  const bThicknessFilter = parseFilterNumber(toStr(request.bThickness ?? ""));
  const limit = Math.max(1, Math.min(request.limit ?? 80, 250));

  const hasQuery = query.length > 0;
  const hasAnyFilter =
    brand !== "ALL" ||
    group !== "ALL" ||
    application.length > 0 ||
    dInnerFilter !== null ||
    dOuterFilter !== null ||
    bThicknessFilter !== null;

  if (!hasQuery && !hasAnyFilter) {
    return {
      query,
      brand,
      group,
      total: 0,
      groups: [],
    };
  }

  const queryCompact = normalizeCompact(query);
  const queryTokens = tokenize(query);
  const applicationCompact = normalizeCompact(application);
  const index = await loadSearchIndex();

  const candidates: SearchCandidate[] = [];

  for (const item of index.products) {
    if (brand !== "ALL" && item.brand !== brand) {
      continue;
    }

    if (group !== "ALL" && item.group !== group) {
      continue;
    }

    if (applicationCompact && !item.applicationCompact.includes(applicationCompact)) {
      continue;
    }

    if (dInnerFilter !== null && (item.dInnerMm === null || !approximatelyEqual(item.dInnerMm, dInnerFilter))) {
      continue;
    }

    if (dOuterFilter !== null && (item.dOuterMm === null || !approximatelyEqual(item.dOuterMm, dOuterFilter))) {
      continue;
    }

    if (bThicknessFilter !== null && (item.bThicknessMm === null || !approximatelyEqual(item.bThicknessMm, bThicknessFilter))) {
      continue;
    }

    const candidate = hasQuery
      ? computeCandidate(item, queryCompact, queryTokens)
      : {
          item,
          matchTier: 6,
          matchedBy: "Khớp bộ lọc kỹ thuật",
          matchedAlias: null,
          keywordStrength: 0,
          brandOrder: getBrandOrder(item.brand),
        };
    if (!candidate) continue;
    candidates.push(candidate);
  }

  candidates.sort((left, right) => {
    if (left.matchTier !== right.matchTier) {
      return left.matchTier - right.matchTier;
    }

    if (brand === "ALL" && left.brandOrder !== right.brandOrder) {
      return left.brandOrder - right.brandOrder;
    }

    if (left.keywordStrength !== right.keywordStrength) {
      return right.keywordStrength - left.keywordStrength;
    }

    if (left.item.priorityScore !== right.item.priorityScore) {
      return right.item.priorityScore - left.item.priorityScore;
    }

    return left.item.productCode.localeCompare(right.item.productCode);
  });

  const limited = candidates.slice(0, limit);
  const mapped: ProductSearchItem[] = limited.map((candidate) => ({
    productCode: candidate.item.productCode,
    displayName: candidate.item.displayName,
    brand: candidate.item.brand,
    group: candidate.item.group,
    category: candidate.item.category,
    dimensions: candidate.item.dimensions,
    application: candidate.item.application,
    status: candidate.item.status,
    matchedBy: candidate.matchedBy,
    matchedAlias: candidate.matchedAlias,
  }));

  const grouped = new Map<ProductBrand, ProductSearchItem[]>();
  for (const item of mapped) {
    if (!grouped.has(item.brand)) {
      grouped.set(item.brand, []);
    }
    grouped.get(item.brand)?.push(item);
  }

  const groupOrder = mapped
    .map((item) => item.brand)
    .filter((value, index, values) => values.indexOf(value) === index)
    .sort((left, right) => getBrandOrder(left) - getBrandOrder(right));

  const responseGroups: ProductSearchGroup[] = groupOrder.map((brandName) => ({
    brand: brandName,
    items: grouped.get(brandName) ?? [],
  }));

  return {
    query,
    brand,
    group,
    total: mapped.length,
    groups: responseGroups,
  };
}

function parseDimensionValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
}