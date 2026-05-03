import {
  getQuoteRequestById,
  listQuoteRequests,
  updateQuoteRequest,
  type QuoteRequestRecord,
  type QuoteRequestStatus,
} from "@/lib/admin/quote-store";
import { RFQ_WORKFLOW_STATUSES } from "@/lib/admin/quote-workflow";

export async function listRfqRequests(): Promise<QuoteRequestRecord[]> {
  const quotes = await listQuoteRequests();
  return quotes.filter((item) => item.sourceType === "rfq");
}

export async function getRfqRequestById(id: string): Promise<QuoteRequestRecord | null> {
  const quote = await getQuoteRequestById(id);
  if (!quote || quote.sourceType !== "rfq") {
    return null;
  }
  return quote;
}

export async function updateRfqStatus(id: string, status: QuoteRequestStatus): Promise<QuoteRequestRecord | null> {
  if (!RFQ_WORKFLOW_STATUSES.includes(status as (typeof RFQ_WORKFLOW_STATUSES)[number])) {
    return null;
  }

  const quote = await getRfqRequestById(id);
  if (!quote) {
    return null;
  }

  return updateQuoteRequest(id, { status });
}
