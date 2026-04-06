const intentValues = [
  "exact_code",
  "equivalent",
  "by_dimensions",
  "by_application",
  "insufficient_info",
  "not_in_catalog",
] as const;

const confidenceValues = ["high", "medium", "low"] as const;

const finalStatusValues = ["ready", "needs_more_info", "manual_review", "not_found_in_system"] as const;

export type AssistantIntent = (typeof intentValues)[number];
export type AssistantConfidence = (typeof confidenceValues)[number];
export type AssistantFinalStatus = (typeof finalStatusValues)[number];

export type AssistantRecommendedItem = {
  exact_code: string;
  brand: string;
  confidence: AssistantConfidence;
  reason: string;
  caution: string;
};

export type AssistantStructuredResponse = {
  intent: AssistantIntent;
  product_group: string | null;
  recommended_items: AssistantRecommendedItem[];
  missing_fields: string[];
  final_status: AssistantFinalStatus;
  pricing_note: string;
  stock_note: string;
  short_reply: string;
};

export const assistantStructuredOutput = {
  type: "json_schema",
  name: "assistant_structured_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      intent: {
        type: "string",
        enum: intentValues,
      },
      product_group: {
        type: ["string", "null"],
      },
      recommended_items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            exact_code: { type: "string" },
            brand: { type: "string" },
            confidence: {
              type: "string",
              enum: confidenceValues,
            },
            reason: { type: "string" },
            caution: { type: "string" },
          },
          required: ["exact_code", "brand", "confidence", "reason", "caution"],
        },
      },
      missing_fields: {
        type: "array",
        items: { type: "string" },
      },
      final_status: {
        type: "string",
        enum: finalStatusValues,
      },
      pricing_note: { type: "string" },
      stock_note: { type: "string" },
      short_reply: { type: "string" },
    },
    required: [
      "intent",
      "product_group",
      "recommended_items",
      "missing_fields",
      "final_status",
      "pricing_note",
      "stock_note",
      "short_reply",
    ],
  },
} as const;

export const assistantResponseFallback: AssistantStructuredResponse = {
  intent: "insufficient_info",
  product_group: null,
  recommended_items: [],
  missing_fields: [],
  final_status: "needs_more_info",
  pricing_note: "Gia duoc xac nhan rieng.",
  stock_note: "Chua xac nhan ton kho tu dong.",
  short_reply: "Can xac minh them.",
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isIntent(value: unknown): value is AssistantIntent {
  return typeof value === "string" && intentValues.includes(value as AssistantIntent);
}

function isConfidence(value: unknown): value is AssistantConfidence {
  return typeof value === "string" && confidenceValues.includes(value as AssistantConfidence);
}

function isFinalStatus(value: unknown): value is AssistantFinalStatus {
  return typeof value === "string" && finalStatusValues.includes(value as AssistantFinalStatus);
}

export function coerceAssistantResponse(payload: unknown): AssistantStructuredResponse {
  if (!isObject(payload)) {
    return assistantResponseFallback;
  }

  const recommendedItemsRaw = Array.isArray(payload.recommended_items) ? payload.recommended_items : [];
  const recommended_items: AssistantRecommendedItem[] = recommendedItemsRaw
    .filter(isObject)
    .map((item) => {
      const confidence = isConfidence(item.confidence) ? item.confidence : "low";

      return {
        exact_code: typeof item.exact_code === "string" ? item.exact_code : "",
        brand: typeof item.brand === "string" ? item.brand : "",
        confidence,
        reason: typeof item.reason === "string" ? item.reason : "Can xac minh them.",
        caution: typeof item.caution === "string" ? item.caution : "Can xac minh them.",
      };
    })
    .filter((item) => item.exact_code.length > 0 && item.brand.length > 0);

  return {
    intent: isIntent(payload.intent) ? payload.intent : "insufficient_info",
    product_group: typeof payload.product_group === "string" ? payload.product_group : null,
    recommended_items,
    missing_fields: isStringArray(payload.missing_fields) ? payload.missing_fields : [],
    final_status: isFinalStatus(payload.final_status) ? payload.final_status : "needs_more_info",
    pricing_note: typeof payload.pricing_note === "string" ? payload.pricing_note : "Gia duoc xac nhan rieng.",
    stock_note: typeof payload.stock_note === "string" ? payload.stock_note : "Chua xac nhan ton kho tu dong.",
    short_reply:
      typeof payload.short_reply === "string" && payload.short_reply.length > 0
        ? payload.short_reply
        : "Can xac minh them.",
  };
}
