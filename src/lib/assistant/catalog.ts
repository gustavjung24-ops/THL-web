import brandWhitelistData from "@/data/catalog/brand-whitelist.json";
import equivalentMapData from "@/data/catalog/equivalent-map.json";
import catalogData from "@/data/catalog/master-catalog.json";
import technicalRules from "@/data/catalog/technical-rules.json";

export type CatalogRecord = (typeof catalogData.records)[number];

type DimensionSearchInput = {
  product_group?: string | null;
  id?: number | null;
  od?: number | null;
  width?: number | null;
  thickness?: number | null;
  shaft_diameter?: number | null;
  pitch?: number | null;
  links?: number | null;
  profile?: string | null;
  length?: number | null;
  housing_type?: string | null;
  chain_type?: string | null;
  application?: string | null;
  raw_text?: string | null;
};

const records = catalogData.records;
const allowedBrandSet = new Set(brandWhitelistData.brand_whitelist.map((brand) => brand.toUpperCase()));

const productGroupKeywords: Record<string, string[]> = {
  bearings: ["bearing", "vong bi", "620", "630", "c3", "zz", "2rs"],
  pillow_blocks: ["pillow", "goi do", "ucp", "ucf", "housing"],
  belts: ["belt", "day curoa", "v-belt", "profile a", "profile b", "spa", "spb"],
  industrial_chains: ["chain", "xich", "08b", "40-1", "pitch", "links"],
  oil_seals: ["oil seal", "phot", "seal", "tc", "sc", "chan dau"],
  grease: ["grease", "mo", "ep2", "nlgi"],
};

const missingFieldMap: Record<string, string[]> = {
  bearings: technicalRules.bearing_missing_fields,
  oil_seals: technicalRules.oil_seal_missing_fields,
  industrial_chains: technicalRules.chain_missing_fields,
  pillow_blocks: technicalRules.pillow_block_missing_fields,
  belts: technicalRules.belt_missing_fields,
  grease: [],
};

const numericDimensionKeys = [
  "id",
  "od",
  "width",
  "thickness",
  "shaft_diameter",
  "pitch",
  "links",
  "length",
] as const;

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toStringValue(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function inferProductGroup(input: string): string | null {
  const raw = input.toLowerCase();

  for (const [group, keywords] of Object.entries(productGroupKeywords)) {
    if (keywords.some((keyword) => raw.includes(keyword))) {
      return group;
    }
  }

  return null;
}

export function searchExactCode(input: string): CatalogRecord[] {
  const normalizedInput = normalizeCode(input);

  return records.filter((item) => normalizeCode(item.exact_code) === normalizedInput);
}

export function searchByNormalizedCode(input: string): CatalogRecord[] {
  const normalizedInput = normalizeCode(input);

  if (!normalizedInput) {
    return [];
  }

  return records.filter((item) => {
    const normalizedCatalogCode = normalizeCode(item.normalized_code);
    return (
      normalizedCatalogCode === normalizedInput ||
      normalizedCatalogCode.includes(normalizedInput) ||
      normalizedInput.includes(normalizedCatalogCode)
    );
  });
}

export function searchByDimensions(input: DimensionSearchInput): CatalogRecord[] {
  const inferredGroup =
    toStringValue(input.product_group) ??
    toStringValue(input.raw_text) ??
    toStringValue(input.application) ??
    "";

  const productGroup = inferProductGroup(inferredGroup) ?? toStringValue(input.product_group);

  const providedNumericKeys = numericDimensionKeys.filter((key) => toNumber(input[key]) !== null);
  const profile = toStringValue(input.profile);
  const housingType = toStringValue(input.housing_type);
  const chainType = toStringValue(input.chain_type);

  const hasDimensionSignals =
    providedNumericKeys.length > 0 || profile !== null || housingType !== null || chainType !== null;

  if (!hasDimensionSignals) {
    return [];
  }

  return records.filter((item) => {
    if (productGroup && item.product_group !== productGroup) {
      return false;
    }

    for (const key of providedNumericKeys) {
      const requestValue = toNumber(input[key]);
      const catalogValue = toNumber(item.dimensions[key]);

      if (requestValue === null || catalogValue === null || requestValue !== catalogValue) {
        return false;
      }
    }

    if (profile && normalizeCode(item.dimensions.profile ?? "") !== normalizeCode(profile)) {
      return false;
    }

    if (housingType && normalizeCode(item.dimensions.housing_type ?? "") !== normalizeCode(housingType)) {
      return false;
    }

    if (chainType && normalizeCode(item.dimensions.chain_type ?? "") !== normalizeCode(chainType)) {
      return false;
    }

    return true;
  });
}

export function searchEquivalent(input: string): CatalogRecord[] {
  const normalizedInput = normalizeCode(input);

  const matchedMaps = equivalentMapData.equivalents.filter(
    (mapping) => mapping.normalized_source === normalizedInput || normalizeCode(mapping.source_code) === normalizedInput
  );

  if (matchedMaps.length === 0) {
    return [];
  }

  const codeSet = new Set(
    matchedMaps.flatMap((mapping) => mapping.candidates.map((candidate) => normalizeCode(candidate.exact_code)))
  );

  return records.filter((item) => codeSet.has(normalizeCode(item.exact_code)));
}

export function filterAllowedBrands(items: CatalogRecord[]): CatalogRecord[] {
  return items.filter((item) => item.allowed_to_sell && allowedBrandSet.has(item.brand.toUpperCase()));
}

export function getMissingFieldsForGroup(productGroup: string | null | undefined, providedFields: string[] = []): string[] {
  if (!productGroup) {
    return [];
  }

  const requiredFields = missingFieldMap[productGroup] ?? [];
  if (requiredFields.length === 0) {
    return [];
  }

  const providedSet = new Set(providedFields.map((field) => field.trim().toLowerCase()).filter(Boolean));

  return requiredFields.filter((field) => !providedSet.has(field.toLowerCase()));
}

export function detectHighRiskConfusion(item: CatalogRecord, input: string): boolean {
  const lowerInput = input.toLowerCase();

  if (item.manual_confirmation_required) {
    return true;
  }

  if (technicalRules.if_high_risk_confusion.do_not_finalize_code && item.confusion_note.trim().length > 0) {
    return true;
  }

  return (
    lowerInput.includes("tuong duong") ||
    lowerInput.includes("equivalent") ||
    lowerInput.includes("gan giong") ||
    lowerInput.includes("khong chac")
  );
}
