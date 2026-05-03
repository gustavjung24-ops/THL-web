export const ADMIN_QUOTE_SOURCE_TYPES = ["manual", "zalo", "phone", "repeat_customer"] as const;
export const ADMIN_QUOTE_STATUSES = ["draft", "sent", "follow_up", "won", "lost", "cancelled"] as const;

export type AdminQuoteSourceType = (typeof ADMIN_QUOTE_SOURCE_TYPES)[number];
export type AdminQuoteStatus = (typeof ADMIN_QUOTE_STATUSES)[number];
export type AdminQuoteConfidence = "high" | "medium" | "manual_review";
export type AdminQuoteItemSource = "catalog" | "manual_admin";

export type AdminProactiveQuoteCustomer = {
  name: string;
  phoneOrZalo: string;
  email: string;
  company: string;
  province: string;
  note: string;
};

export type AdminProactiveQuoteItem = {
  brand: string;
  code: string;
  normalizedCode: string;
  name: string;
  productGroup: string;
  productGroupLabel: string;
  quantity: number;
  internalPrice: number | null;
  lineDiscountPercent: number;
  note: string;
  source: AdminQuoteItemSource;
  confidence: AdminQuoteConfidence;
  priceStatus: string;
  sourceUrl: string;
};

export type AdminProactiveQuoteRecord = {
  quote_id: string;
  source_type: AdminQuoteSourceType;
  created_at: string;
  updated_at: string;
  status: AdminQuoteStatus;
  customer: AdminProactiveQuoteCustomer;
  items: AdminProactiveQuoteItem[];
  discountPercent: number;
  vatPercent: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  note: string;
};

export type AdminProactiveCalculatedItem = AdminProactiveQuoteItem & {
  unitPriceAfterDiscount: number;
  lineTotal: number;
};

export type AdminProactiveCalculatedTotals = {
  subtotal: number;
  totalDiscountAmount: number;
  discountedSubtotal: number;
  vatAmount: number;
  grandTotal: number;
};

const SOURCE_LABELS: Record<AdminQuoteSourceType, string> = {
  manual: "Chủ động",
  zalo: "Zalo",
  phone: "Điện thoại",
  repeat_customer: "Khách cũ",
};

const STATUS_LABELS: Record<AdminQuoteStatus, string> = {
  draft: "Nháp",
  sent: "Đã gửi",
  follow_up: "Theo dõi",
  won: "Thắng",
  lost: "Thua",
  cancelled: "Đã hủy",
};

function normalizeText(value: unknown, fallback = "") {
  return `${value ?? fallback}`.trim();
}

function normalizeCode(input: string) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
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

function clampPercent(value: unknown) {
  return Math.max(0, Math.min(100, normalizeNumber(value, 0)));
}

export function formatCurrencyVnd(value: number | null | undefined) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value ?? 0)));
}

export function normalizeAdminQuoteSourceType(value: unknown): AdminQuoteSourceType {
  const normalized = normalizeText(value).toLowerCase();
  if (ADMIN_QUOTE_SOURCE_TYPES.includes(normalized as AdminQuoteSourceType)) {
    return normalized as AdminQuoteSourceType;
  }
  return "manual";
}

export function normalizeAdminQuoteStatus(value: unknown): AdminQuoteStatus {
  const normalized = normalizeText(value).toLowerCase();
  if (ADMIN_QUOTE_STATUSES.includes(normalized as AdminQuoteStatus)) {
    return normalized as AdminQuoteStatus;
  }
  return "draft";
}

function normalizeItemSource(value: unknown): AdminQuoteItemSource {
  const normalized = normalizeText(value).toLowerCase();
  return normalized === "manual_admin" ? "manual_admin" : "catalog";
}

function normalizeConfidence(value: unknown, itemSource: AdminQuoteItemSource): AdminQuoteConfidence {
  const normalized = normalizeText(value).toLowerCase();
  if (normalized === "high" || normalized === "medium" || normalized === "manual_review") {
    return normalized;
  }
  return itemSource === "manual_admin" ? "manual_review" : "medium";
}

export function getAdminQuoteSourceLabel(sourceType: unknown) {
  return SOURCE_LABELS[normalizeAdminQuoteSourceType(sourceType)];
}

export function getAdminQuoteStatusLabel(status: unknown) {
  return STATUS_LABELS[normalizeAdminQuoteStatus(status)];
}

export function createEmptyProactiveQuote(): AdminProactiveQuoteRecord {
  const now = new Date().toISOString();
  return {
    quote_id: "",
    source_type: "manual",
    created_at: now,
    updated_at: now,
    status: "draft",
    customer: {
      name: "",
      phoneOrZalo: "",
      email: "",
      company: "",
      province: "",
      note: "",
    },
    items: [],
    discountPercent: 0,
    vatPercent: 8,
    shippingFee: 0,
    subtotal: 0,
    total: 0,
    note: "",
  };
}

export function normalizeProactiveQuoteItem(rawItem: unknown): AdminProactiveQuoteItem {
  const safeRaw = rawItem && typeof rawItem === "object" ? (rawItem as Record<string, unknown>) : {};
  const code = normalizeText(safeRaw.code);
  const itemSource = normalizeItemSource(safeRaw.source);

  return {
    brand: normalizeText(safeRaw.brand),
    code,
    normalizedCode: normalizeCode(normalizeText(safeRaw.normalizedCode || safeRaw.normalized_code || code)),
    name: normalizeText(safeRaw.name, code),
    productGroup: normalizeText(safeRaw.productGroup || safeRaw.product_group),
    productGroupLabel: normalizeText(safeRaw.productGroupLabel || safeRaw.product_group_label),
    quantity: Math.max(1, Math.round(normalizeNumber(safeRaw.quantity, 1))),
    internalPrice:
      safeRaw.internalPrice == null
        ? null
        : Math.max(0, Math.round(normalizeNumber(safeRaw.internalPrice, 0))) || null,
    lineDiscountPercent: clampPercent(safeRaw.lineDiscountPercent),
    note: normalizeText(safeRaw.note),
    source: itemSource,
    confidence: normalizeConfidence(safeRaw.confidence, itemSource),
    priceStatus: normalizeText(safeRaw.priceStatus, itemSource === "manual_admin" ? "manual_review" : "price_not_found_for_code"),
    sourceUrl: normalizeText(safeRaw.sourceUrl || safeRaw.source_url),
  };
}

export function calculateProactiveQuote(record: AdminProactiveQuoteRecord) {
  const items: AdminProactiveCalculatedItem[] = record.items.map((item) => {
    const quantity = Math.max(1, Math.round(normalizeNumber(item.quantity, 1)));
    const unitPrice = Math.max(0, Math.round(normalizeNumber(item.internalPrice, 0)));
    const lineDiscountPercent = clampPercent(item.lineDiscountPercent);
    const unitPriceAfterDiscount = Math.round(unitPrice * (1 - lineDiscountPercent / 100));
    const lineTotal = unitPriceAfterDiscount * quantity;

    return {
      ...item,
      quantity,
      internalPrice: item.internalPrice == null ? null : unitPrice,
      lineDiscountPercent,
      unitPriceAfterDiscount,
      lineTotal,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const discountPercent = clampPercent(record.discountPercent);
  const totalDiscountAmount = Math.round(subtotal * (discountPercent / 100));
  const discountedSubtotal = Math.max(0, subtotal - totalDiscountAmount);
  const vatPercent = clampPercent(record.vatPercent);
  const vatAmount = Math.round(discountedSubtotal * (vatPercent / 100));
  const shippingFee = Math.max(0, Math.round(normalizeNumber(record.shippingFee, 0)));

  return {
    items,
    totals: {
      subtotal,
      totalDiscountAmount,
      discountedSubtotal,
      vatAmount,
      grandTotal: discountedSubtotal + vatAmount + shippingFee,
    } satisfies AdminProactiveCalculatedTotals,
  };
}

export function hydrateProactiveQuote(rawRecord: unknown): AdminProactiveQuoteRecord {
  const base = createEmptyProactiveQuote();
  const safeRaw = rawRecord && typeof rawRecord === "object" ? (rawRecord as Record<string, unknown>) : {};
  const customer = safeRaw.customer && typeof safeRaw.customer === "object"
    ? (safeRaw.customer as Record<string, unknown>)
    : {};

  const normalized: AdminProactiveQuoteRecord = {
    quote_id: normalizeText(safeRaw.quote_id || safeRaw.quoteId),
    source_type: normalizeAdminQuoteSourceType(safeRaw.source_type || safeRaw.sourceType),
    created_at: normalizeText(safeRaw.created_at || safeRaw.createdAt, base.created_at),
    updated_at: normalizeText(safeRaw.updated_at || safeRaw.updatedAt, base.updated_at),
    status: normalizeAdminQuoteStatus(safeRaw.status),
    customer: {
      name: normalizeText(customer.name || customer.fullName),
      phoneOrZalo: normalizeText(customer.phoneOrZalo || customer.phone),
      email: normalizeText(customer.email),
      company: normalizeText(customer.company),
      province: normalizeText(customer.province || customer.area),
      note: normalizeText(customer.note),
    },
    items: Array.isArray(safeRaw.items) ? safeRaw.items.map((item) => normalizeProactiveQuoteItem(item)) : [],
    discountPercent: clampPercent(safeRaw.discountPercent),
    vatPercent: clampPercent(safeRaw.vatPercent || 8),
    shippingFee: Math.max(0, Math.round(normalizeNumber(safeRaw.shippingFee, 0))),
    subtotal: Math.max(0, Math.round(normalizeNumber(safeRaw.subtotal, 0))),
    total: Math.max(0, Math.round(normalizeNumber(safeRaw.total, 0))),
    note: normalizeText(safeRaw.note),
  };

  const calculated = calculateProactiveQuote(normalized);
  return {
    ...normalized,
    subtotal: calculated.totals.subtotal,
    total: calculated.totals.grandTotal,
  };
}

export function buildProactiveQuoteCopyText(record: AdminProactiveQuoteRecord, mode: "zalo" | "email") {
  const calculated = calculateProactiveQuote(record);
  const titlePrefix = mode === "email" ? "BAO GIA THL" : "BÁO GIÁ THL";

  const lines = calculated.items.map((item, index) => {
    const priceText = item.unitPriceAfterDiscount > 0 ? formatCurrencyVnd(item.unitPriceAfterDiscount) : "Lien he";
    return `${index + 1}. ${item.code} | ${item.name} | SL: ${item.quantity} | Don gia: ${priceText} | Thanh tien: ${formatCurrencyVnd(item.lineTotal)}${item.note ? ` | Ghi chu: ${item.note}` : ""}`;
  });

  return [
    `${titlePrefix}: ${record.quote_id || "(chua luu)"}`,
    `Nguon: ${getAdminQuoteSourceLabel(record.source_type)}`,
    `Khach hang: ${record.customer.name || "Khach le"}`,
    `SDT/Zalo: ${record.customer.phoneOrZalo || ""}`,
    record.customer.email ? `Email: ${record.customer.email}` : "",
    record.customer.company ? `Cong ty: ${record.customer.company}` : "",
    record.customer.province ? `Tinh/Thanh: ${record.customer.province}` : "",
    "",
    "Danh sach san pham:",
    ...lines,
    "",
    `Tam tinh: ${formatCurrencyVnd(calculated.totals.subtotal)}`,
    `CK tong: ${record.discountPercent}% (-${formatCurrencyVnd(calculated.totals.totalDiscountAmount)})`,
    `VAT: ${record.vatPercent}% (+${formatCurrencyVnd(calculated.totals.vatAmount)})`,
    `Phi giao hang: ${formatCurrencyVnd(record.shippingFee)}`,
    `Tong cong: ${formatCurrencyVnd(calculated.totals.grandTotal)}`,
    record.note ? `Ghi chu giao hang/thanh toan: ${record.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

