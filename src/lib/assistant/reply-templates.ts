import type { AssistantStructuredResponse } from "@/lib/assistant/schemas";

export type ReplyOptionStyle = "chips" | "stacked";

export type BuiltReplyMessage = {
  text: string;
  options?: string[];
  optionStyle?: ReplyOptionStyle;
};

type BuildReplyInput = {
  payload: AssistantStructuredResponse;
  latestUserText?: string;
};

const readyReplyVariants = [
  "Em đã đối chiếu được mã {code} ({brand}) phù hợp cho nhu cầu hiện tại.",
  "Phương án sát nhu cầu nhất lúc này là {code} ({brand}).",
  "Mức ưu tiên em đề xuất cho thông tin hiện có là {code} ({brand}).",
  "Theo dữ liệu đang có, mã {code} ({brand}) là lựa chọn hợp lý nhất.",
];

const needMoreInfoVariants = [
  "Em cần thêm 1 dữ kiện để chốt đúng mã: {missing}.",
  "Để tránh nhầm mã, em cần bổ sung: {missing}.",
  "Thông tin hiện tại chưa đủ để kết luận, cần thêm: {missing}.",
  "Em cần bổ sung một điểm kỹ thuật nữa để chốt mã: {missing}.",
  "Em chưa chốt mã ngay để tránh sai cụm, cần thêm: {missing}.",
];

const notFoundReplyVariants = [
  "Mã anh/chị gửi hiện chưa thấy trong dữ liệu tra cứu nội bộ.",
  "Hệ thống chưa có kết quả trùng khớp cho mã này.",
  "Em chưa tìm được mã trùng khớp trong danh mục đang hỗ trợ.",
  "Chưa có bản ghi nội bộ phù hợp trực tiếp với mã vừa gửi.",
];

const symptomReplyVariants = [
  "Để xử lý theo hiện tượng, em cần khoanh đúng cụm trước khi chọn mã.",
  "Với mô tả hiện tại, bước ưu tiên là xác định đúng cụm gây lỗi.",
  "Em cần chốt đúng vị trí phát sinh vấn đề trước khi đối chiếu mã.",
  "Mình nên khoanh vùng đúng cụm máy trước, rồi em mới đối chiếu chính xác.",
  "Em ưu tiên xác minh cụm máy đang gặp triệu chứng để tránh đổi nhầm.",
];

const warningLeadVariants = [
  "Không nên dùng:",
  "Cần tránh phương án:",
  "Lưu ý không nên áp dụng:",
];

const truckClusterOptions = [
  "Bánh xe",
  "Máy phát",
  "Puly tăng",
  "Lốc lạnh",
  "Hộp số",
];

const spindleClusterOptions = [
  "Ổ trước spindle",
  "Ổ sau spindle",
  "Puly truyền",
  "Cụm phớt",
  "Chưa rõ vị trí",
];

const pumpClusterOptions = [
  "Ổ trục bơm",
  "Puly bơm",
  "Cụm phớt",
  "Khớp nối",
  "Chưa rõ vị trí",
];

const genericEvidenceOptions = [
  "Có mã cũ",
  "Có ảnh tem",
  "Chỉ có kích thước",
  "Mô tả theo cụm máy",
];

const fieldLabelMap: Record<string, string> = {
  id: "đường kính trong",
  od: "đường kính ngoài",
  width: "bề rộng",
  thickness: "bề dày",
  shaft_diameter: "kích thước cốt trục",
  shaft: "kích thước cốt trục",
  code: "mã cũ trên tem",
  old_code: "mã cũ",
  shaft_size: "kích thước cốt",
  seal_type: "kiểu chặn",
  housing_type: "kiểu gối đỡ",
  pitch: "bước xích",
  chain_type: "loại xích",
  links: "số mắt xích",
  profile: "profile dây",
  length: "chiều dài",
  lip_type: "kiểu môi phớt",
  seat_size: "kích thước vỏ",
};

const suggestedOptionMap: Record<string, string> = {
  exact_code: "Có mã cũ trên tem",
  old_code: "Có mã cũ trên tem",
  dimensions: "Có kích thước cốt/ngoài/dày",
  application_detail: "Mô tả cụm máy đang dùng",
  machine_subsystem: "Mô tả vị trí cần thay",
  machine_type: "Cho biết hệ máy",
  urgency: "Đang thay gấp",
  equivalent: "Cần phương án tương đương",
};

function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function hashText(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 2147483647;
  }
  return Math.abs(hash);
}

function pickVariant(variants: string[], seed: string): string {
  if (variants.length === 0) {
    return "";
  }

  return variants[hashText(seed) % variants.length];
}

function cleanLine(text: string | null | undefined): string | null {
  if (!text) {
    return null;
  }

  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : null;
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
}

function mapMissingFields(fields: string[]): string[] {
  return dedupeStrings(fields.map((field) => fieldLabelMap[field] ?? field));
}

function mapSuggestedOptions(values: string[]): string[] {
  return dedupeStrings(values.map((value) => suggestedOptionMap[value] ?? value));
}

function formatWarning(warning: string | null, seed: string): string | null {
  const cleaned = cleanLine(warning);
  if (!cleaned) {
    return null;
  }

  if (cleaned.toLowerCase().startsWith("khong nen")) {
    return cleaned;
  }

  return `${pickVariant(warningLeadVariants, seed)} ${cleaned}`;
}

function composeReply(main: string, question?: string | null, warning?: string | null): string {
  const lines: string[] = [];

  const safeMain = cleanLine(main);
  if (safeMain) {
    lines.push(safeMain);
  }

  const safeQuestion = cleanLine(question);
  if (safeQuestion) {
    lines.push(safeQuestion);
  }

  const safeWarning = cleanLine(warning);
  if (safeWarning) {
    lines.push(safeWarning);
  }

  return lines.join("\n");
}

function looksLikeTruckContext(payload: AssistantStructuredResponse, latestUserText: string): boolean {
  const normalized = normalizeText(latestUserText);

  return (
    normalized.includes("hino") ||
    normalized.includes("4hk1") ||
    normalized.includes("xe tai") ||
    payload.machine_type === "truck"
  );
}

function looksLikeSpindleContext(payload: AssistantStructuredResponse, latestUserText: string): boolean {
  const normalized = normalizeText(latestUserText);

  return (
    normalized.includes("spindle") ||
    normalized.includes("cnc") ||
    payload.machine_type === "cnc" ||
    payload.machine_subsystem === "spindle"
  );
}

function looksLikePumpContext(payload: AssistantStructuredResponse, latestUserText: string): boolean {
  const normalized = normalizeText(latestUserText);

  return (
    normalized.includes("may bom") ||
    normalized.includes("bom") ||
    payload.machine_type === "pump" ||
    payload.symptom.length > 0
  );
}

function inferQuestion(
  payload: AssistantStructuredResponse,
  latestUserText: string,
  missingLabels: string[]
): string | null {
  if (looksLikeTruckContext(payload, latestUserText)) {
    return "Anh/chị đang kiểm tra vòng bi ở cụm nào: bánh xe, máy phát, puly tăng, lốc lạnh hay hộp số?";
  }

  if (looksLikeSpindleContext(payload, latestUserText)) {
    return "Anh/chị đang kiểm tra cụm nào trên spindle: ổ trước, ổ sau, puly truyền hay cụm phớt?";
  }

  if (looksLikePumpContext(payload, latestUserText)) {
    return "Em cần khoanh đúng cụm trước. Máy đang nóng ở ổ trục, puly hay vị trí phớt?";
  }

  const nextQuestion = cleanLine(payload.next_question);
  if (nextQuestion) {
    return nextQuestion;
  }

  if (missingLabels.length > 0) {
    return `Anh/chị bổ sung giúp ${missingLabels.slice(0, 2).join(" hoặc ")} để em chốt nhanh nhé?`;
  }

  return "Anh/chị có mã cũ hoặc ảnh tem để em đối chiếu nhanh hơn không?";
}

function inferOptions(payload: AssistantStructuredResponse, latestUserText: string): BuiltReplyMessage | null {
  if (looksLikeTruckContext(payload, latestUserText)) {
    return { options: truckClusterOptions, optionStyle: "chips", text: "" };
  }

  if (looksLikeSpindleContext(payload, latestUserText)) {
    return { options: spindleClusterOptions, optionStyle: "chips", text: "" };
  }

  if (looksLikePumpContext(payload, latestUserText) && payload.final_status !== "ready") {
    return { options: pumpClusterOptions, optionStyle: "chips", text: "" };
  }

  const mappedSuggested = mapSuggestedOptions(payload.suggested_options);
  if (mappedSuggested.length >= 2) {
    return {
      options: mappedSuggested.slice(0, 5),
      optionStyle: mappedSuggested.length > 4 ? "stacked" : "chips",
      text: "",
    };
  }

  if (payload.final_status === "needs_more_info") {
    return {
      options: genericEvidenceOptions,
      optionStyle: "chips",
      text: "",
    };
  }

  return null;
}

export function buildReadyReply(input: BuildReplyInput): BuiltReplyMessage {
  const topItem = input.payload.recommended_items[0];
  const seed = `${input.payload.short_reply}-${topItem?.exact_code ?? "none"}-${input.latestUserText ?? ""}`;
  const mainTemplate = pickVariant(readyReplyVariants, seed);
  const main = mainTemplate
    .replace("{code}", topItem?.exact_code ?? "mã phù hợp")
    .replace("{brand}", topItem?.brand ?? "nhãn phù hợp");

  return {
    text: composeReply(main, cleanLine(input.payload.next_question), formatWarning(input.payload.avoid_recommendation, seed)),
  };
}

export function buildNotFoundReply(input: BuildReplyInput): BuiltReplyMessage {
  const seed = `${input.payload.short_reply}-${input.latestUserText ?? ""}-not-found`;
  const main = pickVariant(notFoundReplyVariants, seed);
  const question = "Anh/chị có mã cũ, ảnh tem hoặc mô tả theo cụm máy để em đối chiếu lại không?";
  const optionPack = inferOptions(
    {
      ...input.payload,
      final_status: "needs_more_info",
    },
    input.latestUserText ?? ""
  );

  return {
    text: composeReply(main, question),
    options: optionPack?.options,
    optionStyle: optionPack?.optionStyle,
  };
}

export function buildSymptomReply(input: BuildReplyInput): BuiltReplyMessage {
  const seed = `${input.payload.short_reply}-${input.latestUserText ?? ""}-symptom`;
  const main = pickVariant(symptomReplyVariants, seed);
  const missingLabels = mapMissingFields(input.payload.missing_fields);
  const question = inferQuestion(input.payload, input.latestUserText ?? "", missingLabels);
  const warning = formatWarning(input.payload.avoid_recommendation, seed);
  const optionPack = inferOptions(input.payload, input.latestUserText ?? "");

  return {
    text: composeReply(main, question, warning),
    options: optionPack?.options,
    optionStyle: optionPack?.optionStyle,
  };
}

export function buildNeedMoreInfoReply(input: BuildReplyInput): BuiltReplyMessage {
  const missingLabels = mapMissingFields(input.payload.missing_fields);
  const missingHint = missingLabels.slice(0, 2).join(" hoặc ") || "mã cũ hoặc ảnh tem";
  const seed = `${input.payload.short_reply}-${input.latestUserText ?? ""}-needs-more-info`;

  const main = pickVariant(needMoreInfoVariants, seed).replace("{missing}", missingHint);
  const question = inferQuestion(input.payload, input.latestUserText ?? "", missingLabels);
  const warning = formatWarning(input.payload.avoid_recommendation, seed);
  const optionPack = inferOptions(input.payload, input.latestUserText ?? "");

  return {
    text: composeReply(main, question, warning),
    options: optionPack?.options,
    optionStyle: optionPack?.optionStyle,
  };
}

export function buildAssistantReplyMessage(input: BuildReplyInput): BuiltReplyMessage {
  if (input.payload.final_status === "ready" && input.payload.recommended_items.length > 0) {
    return buildReadyReply(input);
  }

  if (input.payload.final_status === "not_found_in_system" || input.payload.intent === "not_in_catalog") {
    return buildNotFoundReply(input);
  }

  if (input.payload.intent === "by_application" || input.payload.symptom.length > 0) {
    return buildSymptomReply(input);
  }

  return buildNeedMoreInfoReply(input);
}
