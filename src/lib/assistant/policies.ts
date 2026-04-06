import type { AssistantStructuredResponse } from "@/lib/assistant/schemas";
import { assistantResponseFallback } from "@/lib/assistant/schemas";
import type { AssistantIntentRoute, ParsedIntent } from "@/lib/assistant/intent-parser";

export type AssistantPolicyContext = {
  latestUserMessage: string;
  parsedIntent: ParsedIntent;
  intentRoute: AssistantIntentRoute;
};

const stockClaimPattern = /\b(có|còn|sẵn)\s+hàng\b/i;
const fastDeliveryClaimPattern = /\b(giao nhanh|giao trong ngày|ship nhanh|có thể giao ngay)\b/i;
const priceClaimPattern = /\b(giá|báo giá)\b.{0,18}\b(là|khoảng|tầm|từ|chỉ)\b/i;
const currencyPattern = /\b\d+[\d.,]*\s*(đ|vnd|k\b|nghìn|triệu)\b/i;

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function cleanupLine(value: string): string {
  return value.replace(/^[-*•\s]+/, "").replace(/\s+/g, " ").trim();
}

function splitIntoLines(value: string): string[] {
  const normalized = value.replace(/\r/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  const roughLines = normalized
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.;])\s+(?=[A-ZÀ-ỹa-zà-ỹ0-9])/))
    .map(cleanupLine)
    .filter(Boolean);

  return dedupe(roughLines);
}

function toBulletText(lines: string[], maxItems = 4): string {
  return dedupe(lines)
    .slice(0, maxItems)
    .map((line) => `- ${cleanupLine(line)}`)
    .join("\n");
}

function containsUnsafeCommercialClaim(value: string): boolean {
  return (
    stockClaimPattern.test(value) ||
    fastDeliveryClaimPattern.test(value) ||
    priceClaimPattern.test(value) ||
    currencyPattern.test(value)
  );
}

function removeUnsafeCommercialLines(value: string): string[] {
  return splitIntoLines(value).filter((line) => !containsUnsafeCommercialClaim(line));
}

function formatCompactBulletText(value: string, maxItems = 4): string {
  return toBulletText(splitIntoLines(value), maxItems);
}

function formatCompactQuestion(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const lines = splitIntoLines(value).slice(0, 2);
  if (lines.length === 0) {
    return null;
  }

  return lines.join(" ");
}

function buildCommercialInfoLines(route: AssistantIntentRoute, parsedIntent: ParsedIntent): string[] {
  const scopedCode = parsedIntent.extracted_code ? `cho mã ${parsedIntent.extracted_code}` : "cho nhu cầu này";

  if (route === "pricing_request") {
    return [
      `Em đã ghi nhận nhu cầu báo giá ${scopedCode}.`,
      "Giá được kinh doanh xác nhận riêng sau khi đối chiếu đúng mã và ứng dụng.",
      "Anh/chị gửi giúp mã hoặc ảnh tem, số lượng, khu vực giao và tên công ty hoặc số điện thoại.",
    ];
  }

  return [
    `Em đã ghi nhận nhu cầu kiểm tra khả năng cung ứng ${scopedCode}.`,
    "Em chưa xác nhận tồn kho hoặc thời gian giao tự động.",
    "Anh/chị gửi giúp mã hoặc ảnh tem, số lượng, khu vực giao và tên công ty hoặc số điện thoại.",
  ];
}

export function isCommercialIntentRoute(route: AssistantIntentRoute): boolean {
  return route === "pricing_request" || route === "stock_request";
}

export function shouldUsePublicGrounding(route: AssistantIntentRoute): boolean {
  return route === "code_lookup" || route === "symptom_diagnosis" || route === "replacement_equivalent";
}

export function buildCommercialGuardResponse(context: AssistantPolicyContext): AssistantStructuredResponse {
  const commercialLines = buildCommercialInfoLines(context.intentRoute, context.parsedIntent);

  return {
    ...assistantResponseFallback,
    input_style: context.parsedIntent.input_style,
    machine_type: context.parsedIntent.machine_type,
    machine_subsystem: context.parsedIntent.machine_subsystem,
    symptom: context.parsedIntent.symptom,
    urgency: context.parsedIntent.urgency,
    buying_motive: context.parsedIntent.buying_motive,
    suggested_options: ["exact_code", "image_of_label", "quantity", "delivery_area", "contact_info"],
    missing_fields: ["code", "quantity", "delivery_area", "contact_info"],
    next_question: "Anh/chị gửi giúp mã hoặc ảnh tem, kèm số lượng và khu vực giao để bên em chuyển kinh doanh liên hệ.",
    final_status: "manual_review",
    pricing_note: "Giá được xác nhận riêng.",
    stock_note: "Chưa xác nhận tồn kho tự động.",
    short_reply: toBulletText(commercialLines, 4),
  };
}

export function enforceAssistantResponsePolicy(
  payload: AssistantStructuredResponse,
  context: AssistantPolicyContext
): AssistantStructuredResponse {
  if (isCommercialIntentRoute(context.intentRoute)) {
    return buildCommercialGuardResponse(context);
  }

  const sanitizedLines = removeUnsafeCommercialLines(payload.short_reply);
  const needsCommercialFallback = containsUnsafeCommercialClaim(payload.short_reply);
  const fallbackLine = "Giá và tồn kho được xác nhận riêng khi cần chuyển kinh doanh hỗ trợ.";

  const sanitizedItems = (needsCommercialFallback ? [] : payload.recommended_items).map((item) => ({
    ...item,
    reason: removeUnsafeCommercialLines(item.reason).slice(0, 1).join(" ") || "Cần xác minh thêm.",
    caution: removeUnsafeCommercialLines(item.caution).slice(0, 1).join(" ") || "Cần xác minh thêm.",
  }));

  return {
    ...payload,
    pricing_note: "Giá được xác nhận riêng.",
    stock_note: "Chưa xác nhận tồn kho tự động.",
    final_status: needsCommercialFallback ? "manual_review" : payload.final_status,
    recommended_items: sanitizedItems,
    short_reply: toBulletText(
      needsCommercialFallback ? [...sanitizedLines, fallbackLine] : splitIntoLines(payload.short_reply),
      4
    ),
    next_question: formatCompactQuestion(payload.next_question),
  };
}

export function formatAssistantPreviewText(lines: string[]): string {
  return formatCompactBulletText(lines.join("\n"), 4);
}