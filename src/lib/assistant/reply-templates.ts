import type { AssistantIntentRoute } from "@/lib/assistant/intent-parser";
import { inferInternalConfidenceLabel, isCommercialIntentRoute } from "@/lib/assistant/policies";
import type { AssistantStructuredResponse } from "@/lib/assistant/schemas";

export type ReplyOptionStyle = "chips" | "stacked";

export type ReplyGroup =
  | "preliminary_assessment"
  | "high_confidence_match"
  | "ambiguous_match"
  | "technical_diagnosis"
  | "sales_handoff";

export type BuiltReplyMessage = {
  text: string;
  options?: string[];
  optionStyle?: ReplyOptionStyle;
  group?: ReplyGroup;
  internal_confidence?: "high" | "medium" | "low";
};

type BuildReplyInput = {
  payload: AssistantStructuredResponse;
  latestUserText?: string;
  intentRoute?: AssistantIntentRoute | null;
};

const highConfidenceLeadVariants = [
  "Khả năng cao hướng này đã sát nhu cầu.",
  "Với dữ liệu hiện có, hướng này gần như đúng cụm.",
  "Em đang nghiêng mạnh về phương án này.",
  "Đối chiếu hiện tại cho thấy đây là hướng ưu tiên.",
];

const ambiguousLeadVariants = [
  "Hiện có hơn một hướng khả dĩ, chưa nên chốt ngay.",
  "Dữ kiện hiện tại cho thấy mức phù hợp trung bình.",
  "Em đang khoanh được vài phương án gần nhất.",
  "Có thể chốt nhanh sau khi xác nhận thêm 1-2 điểm.",
];

const diagnosisLeadVariants = [
  "Triệu chứng cho thấy khả năng lỗi nằm ở cụm quay chịu tải.",
  "Theo mô tả, đây là dạng lỗi cần khoanh cụm trước khi chốt mã.",
  "Mẫu lỗi này thường đến từ sai lệch cụm hoặc điều kiện bôi trơn.",
  "Đây là tình huống nên nhận định sơ bộ trước rồi chốt theo điểm đo.",
];

const preliminaryLeadVariants = [
  "Em đã có nhận định sơ bộ để đi đúng hướng.",
  "Có thể chốt nhanh sau khi bổ sung vài dữ kiện kỹ thuật trọng yếu.",
  "Em đang khoanh vùng đúng cụm để tránh đổi sai mã.",
  "Hiện có cơ sở kỹ thuật ban đầu để tiếp tục chốt mã.",
];

const salesLeadVariants = [
  "Em ghi nhận nhu cầu thương mại và chuyển đúng luồng hỗ trợ.",
  "Phần thương mại sẽ được kinh doanh xác nhận riêng.",
  "Em chưa chốt thông tin thương mại tự động để tránh sai cam kết.",
];

const warningLeadVariants = [
  "Lưu ý dễ nhầm:",
  "Điểm cần tránh:",
  "Cảnh báo kỹ thuật:",
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
  "Xác nhận cụm lắp",
  "Có mã cũ hoặc ảnh tem",
  "Có kích thước chính",
  "Mô tả điều kiện vận hành",
];

const salesHandoffOptions = [
  "Gửi mã hoặc ảnh tem",
  "Cho biết số lượng",
  "Cho biết khu vực giao",
  "Để lại thông tin liên hệ",
];

const fieldLabelMap: Record<string, string> = {
  application_detail: "cụm máy đang dùng",
  dimensions: "kích thước cốt/ngoài/dày",
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
  quantity: "số lượng",
  delivery_area: "khu vực giao",
  contact_info: "tên công ty hoặc số điện thoại",
};

const suggestedOptionMap: Record<string, string> = {
  exact_code: "Có mã cũ trên tem",
  image_of_label: "Có ảnh tem hoặc ảnh mẫu cũ",
  old_code: "Có mã cũ trên tem",
  dimensions: "Có kích thước cốt/ngoài/dày",
  application_detail: "Mô tả cụm máy đang dùng",
  machine_subsystem: "Mô tả vị trí cần thay",
  machine_type: "Cho biết hệ máy",
  urgency: "Đang thay gấp",
  equivalent: "Cần phương án tương đương",
  quantity: "Cho biết số lượng",
  delivery_area: "Cho biết khu vực giao",
  contact_info: "Để lại tên công ty hoặc số điện thoại",
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

  const cleaned = text
    .replace(/^[-*•\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
}

function splitIntoLines(value: string | null | undefined): string[] {
  if (!value || value.trim().length === 0) {
    return [];
  }

  const roughLines = value
    .replace(/\r/g, "\n")
    .trim()
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.;])\s+(?=[A-ZÀ-ỹa-zà-ỹ0-9])/))
    .map((line) => cleanLine(line))
    .filter((line): line is string => Boolean(line));

  return Array.from(new Set(roughLines));
}

function mapMissingFields(fields: string[]): string[] {
  return Array.from(new Set(fields.map((field) => fieldLabelMap[field] ?? field)));
}

function mapSuggestedOptions(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => suggestedOptionMap[value] ?? value)));
}

function formatWarning(warning: string | null, seed: string): string[] {
  const cleaned = cleanLine(warning);
  if (!cleaned) {
    return [];
  }

  const normalized = normalizeText(cleaned);
  if (normalized.startsWith("khong nen")) {
    return [cleaned];
  }

  return [`${pickVariant(warningLeadVariants, seed)} ${cleaned}`];
}

function toSection(title: string, lines: string[], maxItems: number): string[] {
  const sectionLines = lines
    .map((line) => cleanLine(line))
    .filter((line): line is string => Boolean(line))
    .slice(0, maxItems);

  if (sectionLines.length === 0) {
    return [];
  }

  return [title + ":", ...sectionLines.map((line) => `- ${line}`)];
}

function composeStructuredReply(input: {
  quick: string[];
  candidate: string[];
  confirm: string[];
  warning?: string[];
}): string {
  const blocks: string[] = [];

  const quickSection = toSection("Nhận định nhanh", input.quick, 2);
  const candidateSection = toSection("Mã / hướng khả dĩ", input.candidate, 3);
  const confirmSection = toSection("Điều cần chốt thêm", [...input.confirm, ...(input.warning ?? [])], 3);

  [quickSection, candidateSection, confirmSection].forEach((section) => {
    if (section.length === 0) {
      return;
    }

    if (blocks.length > 0) {
      blocks.push("");
    }

    blocks.push(...section);
  });

  return blocks.join("\n");
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
): string[] {
  if (looksLikeTruckContext(payload, latestUserText)) {
    return ["Anh/chị xác nhận giúp cụm đang kiểm tra: bánh xe, máy phát, puly tăng, lốc lạnh hay hộp số?"];
  }

  if (looksLikeSpindleContext(payload, latestUserText)) {
    return ["Anh/chị xác nhận vị trí trên spindle: ổ trước, ổ sau, puly truyền hay cụm phớt?"];
  }

  if (looksLikePumpContext(payload, latestUserText)) {
    return ["Anh/chị cho em biết nóng/kêu rõ nhất ở ổ trục, puly hay cụm phớt để em chốt hướng."];
  }

  const nextQuestion = cleanLine(payload.next_question);
  if (nextQuestion) {
    return [nextQuestion];
  }

  if (missingLabels.length >= 2) {
    return [`Anh/chị xác nhận giúp ${missingLabels[0]} và ${missingLabels[1]} để em chốt chính xác.`];
  }

  if (missingLabels.length === 1) {
    return [`Anh/chị bổ sung giúp ${missingLabels[0]} để em chốt mã cuối.`];
  }

  return ["Anh/chị xác nhận thêm vị trí lắp và điều kiện tải để em chốt hướng chắc hơn."];
}

function buildCandidateLines(payload: AssistantStructuredResponse, maxItems = 2): string[] {
  const items = payload.recommended_items.slice(0, maxItems);

  if (items.length === 0) {
    return [];
  }

  return items.map((item) => {
    const confidenceLabel =
      item.confidence === "high" ? "Khả năng cao" : item.confidence === "medium" ? "Khả năng trung bình" : "Khả năng thấp";
    const reason = cleanLine(item.reason);

    return `${confidenceLabel}: ${item.exact_code} (${item.brand})${reason ? `, căn cứ: ${reason}` : ""}.`;
  });
}

function fallbackSalesQuestion(payload: AssistantStructuredResponse): string[] {
  const nextQuestion = cleanLine(payload.next_question);
  if (nextQuestion) {
    return [nextQuestion];
  }

  return ["Anh/chị gửi giúp mã hoặc ảnh tem, số lượng, khu vực giao và tên công ty hoặc số điện thoại để em chuyển kinh doanh."];
}

function inferReplyGroup(input: BuildReplyInput): ReplyGroup {
  const route = input.intentRoute ?? null;
  const normalizedReply = normalizeText(input.payload.short_reply);

  const looksCommercialFromPayload =
    input.payload.final_status === "manual_review" &&
    (input.payload.missing_fields.includes("contact_info") ||
      input.payload.missing_fields.includes("delivery_area") ||
      normalizedReply.includes("kinh doanh") ||
      normalizedReply.includes("bao gia") ||
      normalizedReply.includes("ton kho") ||
      normalizedReply.includes("chiết khấu") ||
      normalizedReply.includes("chiet khau") ||
      normalizedReply.includes("giao hang") ||
      normalizedReply.includes("lead time"));

  if ((route && isCommercialIntentRoute(route)) || looksCommercialFromPayload) {
    return "sales_handoff";
  }

  if (route === "symptom_diagnosis" || input.payload.symptom.length > 0) {
    return "technical_diagnosis";
  }

  const confidence = inferInternalConfidenceLabel(input.payload);

  if (confidence === "high" && input.payload.recommended_items.length > 0) {
    return "high_confidence_match";
  }

  if (
    (confidence === "medium" && input.payload.recommended_items.length > 0) ||
    input.payload.final_status === "not_found_in_system"
  ) {
    return "ambiguous_match";
  }

  return "preliminary_assessment";
}

function inferOptions(
  payload: AssistantStructuredResponse,
  latestUserText: string,
  group: ReplyGroup
): BuiltReplyMessage | null {
  if (group === "sales_handoff") {
    const mappedSuggested = mapSuggestedOptions(payload.suggested_options);
    const options = mappedSuggested.length >= 2 ? mappedSuggested.slice(0, 5) : salesHandoffOptions;

    return {
      options,
      optionStyle: "stacked",
      text: "",
    };
  }

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

  if (payload.final_status === "needs_more_info" || payload.final_status === "not_found_in_system") {
    return {
      options: genericEvidenceOptions,
      optionStyle: "chips",
      text: "",
    };
  }

  return null;
}

function buildSalesHandoffReply(input: BuildReplyInput): BuiltReplyMessage {
  const seed = `${input.payload.short_reply}-${input.latestUserText ?? ""}-sales`;
  const shortReplyLines = splitIntoLines(input.payload.short_reply);
  const quick = shortReplyLines.length > 0 ? shortReplyLines.slice(0, 2) : [pickVariant(salesLeadVariants, seed)];

  const candidate = [
    "Giá, tồn kho, lead time và chiết khấu chỉ được kinh doanh xác nhận sau đối chiếu.",
  ];

  const confirm = fallbackSalesQuestion(input.payload);
  const optionPack = inferOptions(input.payload, input.latestUserText ?? "", "sales_handoff");

  return {
    text: composeStructuredReply({ quick, candidate, confirm }),
    options: optionPack?.options,
    optionStyle: optionPack?.optionStyle,
    group: "sales_handoff",
    internal_confidence: inferInternalConfidenceLabel(input.payload),
  };
}

function buildHighConfidenceMatchReply(input: BuildReplyInput): BuiltReplyMessage {
  const seed = `${input.payload.short_reply}-${input.latestUserText ?? ""}-high`;
  const missingLabels = mapMissingFields(input.payload.missing_fields);

  const shortReplyLines = splitIntoLines(input.payload.short_reply);
  const quick = shortReplyLines.length > 0 ? shortReplyLines.slice(0, 2) : [pickVariant(highConfidenceLeadVariants, seed)];

  const candidateLines = buildCandidateLines(input.payload, 2);
  const candidate = candidateLines.length > 0 ? candidateLines : ["Khả năng cao hướng mã hiện tại đã phù hợp với cụm đang kiểm tra."];

  const confirm = inferQuestion(input.payload, input.latestUserText ?? "", missingLabels);
  const warning = formatWarning(input.payload.avoid_recommendation, seed);
  const optionPack = inferOptions(input.payload, input.latestUserText ?? "", "high_confidence_match");

  return {
    text: composeStructuredReply({ quick, candidate, confirm, warning }),
    options: optionPack?.options,
    optionStyle: optionPack?.optionStyle,
    group: "high_confidence_match",
    internal_confidence: "high",
  };
}

function buildAmbiguousMatchReply(input: BuildReplyInput): BuiltReplyMessage {
  const seed = `${input.payload.short_reply}-${input.latestUserText ?? ""}-ambiguous`;
  const missingLabels = mapMissingFields(input.payload.missing_fields);

  const shortReplyLines = splitIntoLines(input.payload.short_reply);
  const quick = shortReplyLines.length > 0 ? shortReplyLines.slice(0, 2) : [pickVariant(ambiguousLeadVariants, seed)];

  let candidate = buildCandidateLines(input.payload, 2);
  if (candidate.length === 0 && input.payload.final_status === "not_found_in_system") {
    candidate = ["Chưa thấy mã trùng trực tiếp trong danh mục nội bộ, cần đối chiếu theo cụm hoặc kích thước."];
  }

  if (candidate.length === 0) {
    candidate = ["Hiện em đang khoanh vùng theo pattern gần nhất, chưa chốt vội để tránh sai cụm."];
  }

  const confirm = inferQuestion(input.payload, input.latestUserText ?? "", missingLabels);
  const warning = formatWarning(input.payload.avoid_recommendation, seed);
  const optionPack = inferOptions(input.payload, input.latestUserText ?? "", "ambiguous_match");

  return {
    text: composeStructuredReply({ quick, candidate, confirm, warning }),
    options: optionPack?.options,
    optionStyle: optionPack?.optionStyle,
    group: "ambiguous_match",
    internal_confidence: "medium",
  };
}

function buildTechnicalDiagnosisReply(input: BuildReplyInput): BuiltReplyMessage {
  const seed = `${input.payload.short_reply}-${input.latestUserText ?? ""}-diagnosis`;
  const missingLabels = mapMissingFields(input.payload.missing_fields);

  const shortReplyLines = splitIntoLines(input.payload.short_reply);
  const quick = shortReplyLines.length > 0 ? shortReplyLines.slice(0, 2) : [pickVariant(diagnosisLeadVariants, seed)];

  let candidate = buildCandidateLines(input.payload, 2);
  if (candidate.length === 0) {
    candidate = [
      "Ưu tiên kiểm tra tình trạng bôi trơn, độ đồng trục và khe hở cụm quay trước khi đổi mã.",
    ];
  }

  const confirm = inferQuestion(input.payload, input.latestUserText ?? "", missingLabels);
  const warning = formatWarning(input.payload.avoid_recommendation, seed);
  const optionPack = inferOptions(input.payload, input.latestUserText ?? "", "technical_diagnosis");

  return {
    text: composeStructuredReply({ quick, candidate, confirm, warning }),
    options: optionPack?.options,
    optionStyle: optionPack?.optionStyle,
    group: "technical_diagnosis",
    internal_confidence: inferInternalConfidenceLabel(input.payload),
  };
}

function buildPreliminaryAssessmentReply(input: BuildReplyInput): BuiltReplyMessage {
  const seed = `${input.payload.short_reply}-${input.latestUserText ?? ""}-preliminary`;
  const missingLabels = mapMissingFields(input.payload.missing_fields);

  const shortReplyLines = splitIntoLines(input.payload.short_reply);
  const quick = shortReplyLines.length > 0 ? shortReplyLines.slice(0, 2) : [pickVariant(preliminaryLeadVariants, seed)];

  let candidate = buildCandidateLines(input.payload, 2);
  if (candidate.length === 0) {
    candidate = ["Em đang khoanh theo nhóm ứng dụng phù hợp rồi mới chốt mã cuối để giảm rủi ro nhầm."];
  }

  const confirm = inferQuestion(input.payload, input.latestUserText ?? "", missingLabels);
  const warning = formatWarning(input.payload.avoid_recommendation, seed);
  const optionPack = inferOptions(input.payload, input.latestUserText ?? "", "preliminary_assessment");

  return {
    text: composeStructuredReply({ quick, candidate, confirm, warning }),
    options: optionPack?.options,
    optionStyle: optionPack?.optionStyle,
    group: "preliminary_assessment",
    internal_confidence: inferInternalConfidenceLabel(input.payload),
  };
}

export function buildAssistantReplyMessage(input: BuildReplyInput): BuiltReplyMessage {
  const group = inferReplyGroup(input);

  if (group === "sales_handoff") {
    return buildSalesHandoffReply(input);
  }

  if (group === "high_confidence_match") {
    return buildHighConfidenceMatchReply(input);
  }

  if (group === "ambiguous_match") {
    return buildAmbiguousMatchReply(input);
  }

  if (group === "technical_diagnosis") {
    return buildTechnicalDiagnosisReply(input);
  }

  return buildPreliminaryAssessmentReply(input);
}
