import { randomUUID } from "node:crypto";
import { readJsonFile, writeJsonFile } from "@/lib/admin/storage";
import {
  getWorkflowStatusesForSourceType,
  type QuoteRequestSourceType,
  type QuoteRequestStatus,
} from "@/lib/admin/quote-workflow";

export {
  MANUAL_WORKFLOW_STATUSES,
  RFQ_WORKFLOW_STATUSES,
  getWorkflowStatusesForSourceType,
} from "@/lib/admin/quote-workflow";
export type {
  ManualQuoteStatus,
  RfqQuoteStatus,
  QuoteRequestSourceType,
  QuoteRequestStatus,
} from "@/lib/admin/quote-workflow";

export type QuoteRequestCustomer = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  area: string;
};

export type QuoteRequestItem = {
  code: string;
  name: string;
  quantity: string;
  unit: string;
  internalPrice: number;
  lineDiscountPercent: number;
  note: string;
};

export type QuotePricing = {
  currency: "VND";
  subtotal: number;
  totalDiscountPercent: number;
  vatPercent: number;
  shippingFee: number;
  grandTotal: number;
};

export type QuoteRequestRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: "website-lead" | "admin-manual";
  channel: "website" | "admin";
  sourceType: QuoteRequestSourceType;
  status: QuoteRequestStatus;
  customer: QuoteRequestCustomer;
  productGroup: string;
  application: string;
  priority: string;
  notes: string;
  uploadedFiles: string[];
  items: QuoteRequestItem[];
  pricing: QuotePricing;
  internalSummary: string;
  draftMessage: string;
};

const QUOTES_FILE = "quote-requests.json";

function toNumber(input: unknown, fallback = 0): number {
  if (typeof input === "number" && Number.isFinite(input)) {
    return input;
  }
  if (typeof input === "string") {
    const parsed = Number(input.trim());
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function normalizeQuoteItem(item: Partial<QuoteRequestItem>): QuoteRequestItem {
  return {
    code: item.code?.trim() || "",
    name: item.name?.trim() || "",
    quantity: item.quantity?.trim() || "",
    unit: item.unit?.trim() || "cái",
    internalPrice: Math.max(0, toNumber(item.internalPrice, 0)),
    lineDiscountPercent: Math.min(100, Math.max(0, toNumber(item.lineDiscountPercent, 0))),
    note: item.note?.trim() || "",
  };
}

function calculatePricing(
  items: QuoteRequestItem[],
  options?: Partial<Pick<QuotePricing, "totalDiscountPercent" | "vatPercent" | "shippingFee">>,
): QuotePricing {
  const subtotal = items.reduce((acc, item) => {
    const quantity = Math.max(0, toNumber(item.quantity, 0));
    const unitPrice = Math.max(0, toNumber(item.internalPrice, 0));
    const lineDiscountPercent = Math.min(100, Math.max(0, toNumber(item.lineDiscountPercent, 0)));
    const lineTotal = quantity * unitPrice * (1 - lineDiscountPercent / 100);
    return acc + lineTotal;
  }, 0);

  const totalDiscountPercent = Math.min(100, Math.max(0, toNumber(options?.totalDiscountPercent, 0)));
  const vatPercent = Math.min(100, Math.max(0, toNumber(options?.vatPercent, 10)));
  const shippingFee = Math.max(0, toNumber(options?.shippingFee, 0));

  const discountedSubtotal = subtotal * (1 - totalDiscountPercent / 100);
  const vatAmount = discountedSubtotal * (vatPercent / 100);

  return {
    currency: "VND",
    subtotal,
    totalDiscountPercent,
    vatPercent,
    shippingFee,
    grandTotal: discountedSubtotal + vatAmount + shippingFee,
  };
}

function normalizeQuoteRecord(quote: QuoteRequestRecord): QuoteRequestRecord {
  const sourceType: QuoteRequestSourceType = quote.sourceType === "manual" ? "manual" : "rfq";
  const items = (quote.items ?? []).map((item) => normalizeQuoteItem(item));
  const fallbackItems = items.length > 0 ? items : [normalizeQuoteItem({})];
  const allowedStatuses = getWorkflowStatusesForSourceType(sourceType);
  const status = allowedStatuses.includes(quote.status) ? quote.status : allowedStatuses[0];

  return {
    ...quote,
    sourceType,
    status,
    items: fallbackItems,
    pricing: calculatePricing(fallbackItems, quote.pricing),
  };
}

async function readQuotes() {
  const quotes = await readJsonFile<QuoteRequestRecord[]>(QUOTES_FILE, []);
  return quotes.map(normalizeQuoteRecord);
}

async function writeQuotes(quotes: QuoteRequestRecord[]) {
  await writeJsonFile(QUOTES_FILE, quotes);
}

export async function listQuoteRequests() {
  const quotes = await readQuotes();
  return quotes.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getQuoteRequestById(id: string) {
  const quotes = await readQuotes();
  return quotes.find((quote) => quote.id === id) ?? null;
}

export async function createQuoteRequestFromLead(payload: {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  area: string;
  productGroup: string;
  requestedCode: string;
  application?: string;
  quantity?: string;
  priority: string;
  notes?: string;
  uploadedFiles?: string[];
}) {
  const quotes = await readQuotes();
  const timestamp = new Date().toISOString();
  const record: QuoteRequestRecord = {
    id: `RFQ-THL-${timestamp.slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    source: "website-lead",
    channel: "website",
    sourceType: "rfq",
    status: "new",
    customer: {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      area: payload.area,
    },
    productGroup: payload.productGroup,
    application: payload.application?.trim() || "",
    priority: payload.priority,
    notes: payload.notes?.trim() || "",
    uploadedFiles: payload.uploadedFiles ?? [],
    items: [
      {
        code: payload.requestedCode,
        name: "",
        quantity: payload.quantity?.trim() || "",
        unit: "cái",
        internalPrice: 0,
        lineDiscountPercent: 0,
        note: payload.notes?.trim() || "",
      },
    ],
    pricing: calculatePricing([
      {
        code: payload.requestedCode,
        name: "",
        quantity: payload.quantity?.trim() || "",
        unit: "cái",
        internalPrice: 0,
        lineDiscountPercent: 0,
        note: payload.notes?.trim() || "",
      },
    ]),
    internalSummary: "",
    draftMessage: "",
  };

  await writeQuotes([record, ...quotes]);
  return record;
}

export async function createManualQuoteRequest(payload: {
  fullName: string;
  email?: string;
  phone?: string;
  company?: string;
  area?: string;
  productGroup: string;
  requestedCode: string;
  application?: string;
  quantity?: string;
  priority?: string;
  notes?: string;
}) {
  const quotes = await readQuotes();
  const timestamp = new Date().toISOString();
  const record: QuoteRequestRecord = {
    id: `Q-THL-${timestamp.slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    source: "admin-manual",
    channel: "admin",
    sourceType: "manual",
    status: "draft",
    customer: {
      fullName: payload.fullName,
      email: payload.email?.trim() || "",
      phone: payload.phone?.trim() || "",
      company: payload.company?.trim() || "",
      area: payload.area?.trim() || "",
    },
    productGroup: payload.productGroup,
    application: payload.application?.trim() || "",
    priority: payload.priority?.trim() || "Bình thường theo kế hoạch",
    notes: payload.notes?.trim() || "",
    uploadedFiles: [],
    items: [
      {
        code: payload.requestedCode,
        name: "",
        quantity: payload.quantity?.trim() || "",
        unit: "cái",
        internalPrice: 0,
        lineDiscountPercent: 0,
        note: payload.notes?.trim() || "",
      },
    ],
    pricing: calculatePricing([
      {
        code: payload.requestedCode,
        name: "",
        quantity: payload.quantity?.trim() || "",
        unit: "cái",
        internalPrice: 0,
        lineDiscountPercent: 0,
        note: payload.notes?.trim() || "",
      },
    ]),
    internalSummary: "",
    draftMessage: "",
  };

  await writeQuotes([record, ...quotes]);
  return record;
}

export async function updateQuoteRequest(
  id: string,
  input: Partial<Pick<QuoteRequestRecord, "status" | "internalSummary" | "draftMessage" | "items">> & {
    pricing?: Partial<Pick<QuotePricing, "totalDiscountPercent" | "vatPercent" | "shippingFee">>;
  },
): Promise<QuoteRequestRecord | null> {
  const quotes = await readQuotes();
  let updated: QuoteRequestRecord | null = null;

  const nextQuotes: QuoteRequestRecord[] = quotes.map((quote) => {
    if (quote.id !== id) {
      return quote;
    }

    const nextItems = input.items?.map((item) => normalizeQuoteItem(item)) ?? quote.items;
    const safeItems = nextItems.length > 0 ? nextItems : quote.items;
    const allowedStatuses = getWorkflowStatusesForSourceType(quote.sourceType);
    const nextStatus = input.status && allowedStatuses.includes(input.status) ? input.status : quote.status;

    const nextQuote: QuoteRequestRecord = {
      ...quote,
      status: nextStatus,
      items: safeItems,
      pricing: calculatePricing(safeItems, {
        totalDiscountPercent: input.pricing?.totalDiscountPercent ?? quote.pricing.totalDiscountPercent,
        vatPercent: input.pricing?.vatPercent ?? quote.pricing.vatPercent,
        shippingFee: input.pricing?.shippingFee ?? quote.pricing.shippingFee,
      }),
      internalSummary: input.internalSummary ?? quote.internalSummary,
      draftMessage: input.draftMessage ?? quote.draftMessage,
      updatedAt: new Date().toISOString(),
    };
    updated = nextQuote;
    return nextQuote;
  });

  await writeQuotes(nextQuotes);
  return updated;
}