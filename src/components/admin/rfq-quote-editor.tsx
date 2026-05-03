"use client";

import type { QuoteRequestRecord } from "@/lib/admin/quote-store";
import { QuoteRequestEditor } from "@/components/admin/quote-request-editor";

type RfqQuoteEditorProps = {
  quote: QuoteRequestRecord;
};

export function RfqQuoteEditor({ quote }: RfqQuoteEditorProps) {
  return <QuoteRequestEditor quote={quote} />;
}
