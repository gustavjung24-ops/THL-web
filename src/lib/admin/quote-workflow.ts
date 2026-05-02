export type QuoteRequestSourceType = "rfq" | "manual";
export type RfqQuoteStatus = "new" | "draft" | "quoted" | "sent" | "closed";
export type ManualQuoteStatus = "draft" | "sent" | "follow_up" | "won" | "lost" | "cancelled";
export type QuoteRequestStatus = RfqQuoteStatus | ManualQuoteStatus;

export const RFQ_WORKFLOW_STATUSES: RfqQuoteStatus[] = ["new", "draft", "quoted", "sent", "closed"];
export const MANUAL_WORKFLOW_STATUSES: ManualQuoteStatus[] = ["draft", "sent", "follow_up", "won", "lost", "cancelled"];

export const QUOTE_SOURCE_LABELS: Record<QuoteRequestSourceType, string> = {
  rfq: "Yêu cầu RFQ website",
  manual: "Báo giá chủ động admin",
};

export const QUOTE_STATUS_LABELS: Record<QuoteRequestStatus, string> = {
  new: "Mới tiếp nhận",
  draft: "Đang soạn",
  quoted: "Đã lên giá",
  sent: "Đã gửi khách",
  closed: "Đã đóng",
  follow_up: "Đang theo dõi",
  won: "Thắng đơn",
  lost: "Trượt đơn",
  cancelled: "Đã hủy",
};

export function getQuoteStatusLabel(status: QuoteRequestStatus): string {
  return QUOTE_STATUS_LABELS[status] ?? status;
}

export function getQuoteSourceLabel(sourceType: QuoteRequestSourceType): string {
  return QUOTE_SOURCE_LABELS[sourceType] ?? sourceType;
}

export function getWorkflowStatusesForSourceType(sourceType: QuoteRequestSourceType): QuoteRequestStatus[] {
  return sourceType === "manual" ? MANUAL_WORKFLOW_STATUSES : RFQ_WORKFLOW_STATUSES;
}
