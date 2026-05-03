import { randomUUID } from "node:crypto";
import { readJsonFile, writeJsonFile } from "@/lib/admin/storage";
import {
  ADMIN_QUOTE_STATUSES,
  buildProactiveQuoteCopyText,
  calculateProactiveQuote,
  hydrateProactiveQuote,
  normalizeAdminQuoteSourceType,
  normalizeAdminQuoteStatus,
  type AdminProactiveQuoteRecord,
} from "@/lib/admin/proactive-quote";

const QUOTES_FILE = "quote-requests.json";

type RawQuote = Record<string, unknown>;

function normalizeText(value: unknown, fallback = "") {
  return `${value ?? fallback}`.trim();
}

function normalizeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function readCustomer(rawQuote: RawQuote) {
  const customer = rawQuote.customer && typeof rawQuote.customer === "object"
    ? (rawQuote.customer as Record<string, unknown>)
    : {};

  return {
    name: normalizeText(customer.name || customer.fullName),
    phoneOrZalo: normalizeText(customer.phoneOrZalo || customer.phone),
    email: normalizeText(customer.email),
    company: normalizeText(customer.company),
    province: normalizeText(customer.province || customer.area),
    note: normalizeText(customer.note),
  };
}

function fromRawQuote(rawQuote: RawQuote): AdminProactiveQuoteRecord {
  const pricing = rawQuote.pricing && typeof rawQuote.pricing === "object"
    ? (rawQuote.pricing as Record<string, unknown>)
    : {};

  return hydrateProactiveQuote({
    quote_id: rawQuote.id,
    source_type: rawQuote.source_type || rawQuote.sourceTypeDetail || rawQuote.manual_source_type || "manual",
    created_at: rawQuote.createdAt,
    updated_at: rawQuote.updatedAt,
    status: rawQuote.status,
    customer: readCustomer(rawQuote),
    items: Array.isArray(rawQuote.items) ? rawQuote.items : [],
    discountPercent: pricing.totalDiscountPercent,
    vatPercent: pricing.vatPercent,
    shippingFee: pricing.shippingFee,
    subtotal: pricing.subtotal,
    total: pricing.grandTotal,
    note: rawQuote.manual_note || rawQuote.notes || "",
  });
}

function toRawQuote(inputQuote: AdminProactiveQuoteRecord, existing?: RawQuote): RawQuote {
  const calculated = calculateProactiveQuote(inputQuote);
  const timestamp = new Date().toISOString();
  const status = normalizeAdminQuoteStatus(inputQuote.status);
  const firstGroup = inputQuote.items.find((item) => normalizeText(item.productGroup).length > 0)?.productGroup ?? "";

  return {
    ...existing,
    id: inputQuote.quote_id,
    createdAt: normalizeText(existing?.createdAt, inputQuote.created_at || timestamp),
    updatedAt: timestamp,
    source: "admin-manual",
    channel: "admin",
    sourceType: "manual",
    source_type: normalizeAdminQuoteSourceType(inputQuote.source_type),
    sourceTypeDetail: normalizeAdminQuoteSourceType(inputQuote.source_type),
    status: ADMIN_QUOTE_STATUSES.includes(status) ? status : "draft",
    customer: {
      fullName: inputQuote.customer.name,
      email: inputQuote.customer.email,
      phone: inputQuote.customer.phoneOrZalo,
      company: inputQuote.customer.company,
      area: inputQuote.customer.province,
      note: inputQuote.customer.note,
    },
    productGroup: normalizeText((existing?.productGroup as string) || firstGroup),
    application: normalizeText(existing?.application as string),
    priority: normalizeText(existing?.priority as string, "Bình thường theo kế hoạch"),
    notes: inputQuote.note,
    manual_note: inputQuote.note,
    uploadedFiles: Array.isArray(existing?.uploadedFiles) ? existing?.uploadedFiles : [],
    items: calculated.items.map((item) => ({
      brand: item.brand,
      code: item.code,
      normalizedCode: item.normalizedCode,
      normalized_code: item.normalizedCode,
      name: item.name,
      productGroup: item.productGroup,
      productGroupLabel: item.productGroupLabel,
      quantity: String(item.quantity),
      unit: "cái",
      internalPrice: item.internalPrice ?? 0,
      lineDiscountPercent: item.lineDiscountPercent,
      note: item.note,
      source: item.source,
      confidence: item.confidence,
      priceStatus: item.priceStatus,
      sourceUrl: item.sourceUrl,
    })),
    pricing: {
      currency: "VND",
      subtotal: calculated.totals.subtotal,
      totalDiscountPercent: inputQuote.discountPercent,
      vatPercent: inputQuote.vatPercent,
      shippingFee: inputQuote.shippingFee,
      grandTotal: calculated.totals.grandTotal,
    },
    internalSummary: normalizeText(existing?.internalSummary as string),
    draftMessage: normalizeText(existing?.draftMessage as string, buildProactiveQuoteCopyText(inputQuote, "email")),
  };
}

function buildQuoteId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `Q-THL-${datePart}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

async function readAllQuotes() {
  return readJsonFile<RawQuote[]>(QUOTES_FILE, []);
}

async function writeAllQuotes(items: RawQuote[]) {
  await writeJsonFile(QUOTES_FILE, items);
}

export async function listProactiveQuotes() {
  const quotes = await readAllQuotes();
  return quotes
    .filter((quote) => normalizeText(quote.sourceType, "manual").toLowerCase() === "manual")
    .map((quote) => fromRawQuote(quote))
    .sort((first, second) => second.created_at.localeCompare(first.created_at));
}

export async function getProactiveQuoteById(quoteId: string) {
  const safeQuoteId = quoteId.trim().toLowerCase();
  if (!safeQuoteId) {
    return null;
  }

  const quotes = await readAllQuotes();
  const matched = quotes.find((quote) => normalizeText(quote.id).toLowerCase() === safeQuoteId);
  return matched ? fromRawQuote(matched) : null;
}

export async function upsertProactiveQuote(inputQuote: unknown) {
  const normalized = hydrateProactiveQuote(inputQuote);
  const now = new Date().toISOString();
  const quoteId = normalized.quote_id || buildQuoteId();
  const quoteToSave: AdminProactiveQuoteRecord = {
    ...normalized,
    quote_id: quoteId,
    created_at: normalized.created_at || now,
    updated_at: now,
  };

  const quotes = await readAllQuotes();
  const index = quotes.findIndex((quote) => normalizeText(quote.id).toLowerCase() === quoteId.toLowerCase());

  if (index >= 0) {
    quotes[index] = toRawQuote(quoteToSave, quotes[index]);
  } else {
    quotes.unshift(toRawQuote(quoteToSave));
  }

  await writeAllQuotes(quotes);
  return quoteToSave;
}
