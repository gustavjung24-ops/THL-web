import { randomUUID } from "node:crypto";
import { readJsonFile, writeJsonFile } from "@/lib/admin/storage";

export type QuoteRequestStatus = "new" | "draft" | "quoted" | "sent" | "closed";

export type QuoteRequestCustomer = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  area: string;
};

export type QuoteRequestItem = {
  code: string;
  quantity: string;
  note: string;
};

export type QuoteRequestRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: "website-lead";
  channel: "website";
  status: QuoteRequestStatus;
  customer: QuoteRequestCustomer;
  productGroup: string;
  application: string;
  priority: string;
  notes: string;
  uploadedFiles: string[];
  items: QuoteRequestItem[];
  internalSummary: string;
  draftMessage: string;
};

const QUOTES_FILE = "quote-requests.json";

async function readQuotes() {
  return readJsonFile<QuoteRequestRecord[]>(QUOTES_FILE, []);
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
        quantity: payload.quantity?.trim() || "",
        note: payload.notes?.trim() || "",
      },
    ],
    internalSummary: "",
    draftMessage: "",
  };

  await writeQuotes([record, ...quotes]);
  return record;
}

export async function updateQuoteRequest(
  id: string,
  input: Partial<Pick<QuoteRequestRecord, "status" | "internalSummary" | "draftMessage">>,
): Promise<QuoteRequestRecord | null> {
  const quotes = await readQuotes();
  let updated: QuoteRequestRecord | null = null;

  const nextQuotes: QuoteRequestRecord[] = quotes.map((quote) => {
    if (quote.id !== id) {
      return quote;
    }

    const nextQuote: QuoteRequestRecord = {
      ...quote,
      status: input.status ?? quote.status,
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