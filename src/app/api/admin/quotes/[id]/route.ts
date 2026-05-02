import { NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { getQuoteRequestById, getWorkflowStatusesForSourceType, type QuoteRequestItem, type QuoteRequestStatus, updateQuoteRequest } from "@/lib/admin/quote-store";

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

function parseQuoteItems(input: unknown): QuoteRequestItem[] | undefined {
  if (!Array.isArray(input)) {
    return undefined;
  }

  const parsed = input
    .map((row) => {
      if (!row || typeof row !== "object") {
        return null;
      }
      const item = row as Record<string, unknown>;
      const code = typeof item.code === "string" ? item.code.trim() : "";
      if (!code) {
        return null;
      }

      return {
        code,
        name: typeof item.name === "string" ? item.name : "",
        quantity: typeof item.quantity === "string" ? item.quantity : String(toNumber(item.quantity, 0)),
        unit: typeof item.unit === "string" && item.unit.trim().length > 0 ? item.unit : "cái",
        internalPrice: Math.max(0, toNumber(item.internalPrice, 0)),
        lineDiscountPercent: Math.min(100, Math.max(0, toNumber(item.lineDiscountPercent, 0))),
        note: typeof item.note === "string" ? item.note : "",
      } satisfies QuoteRequestItem;
    })
    .filter((item): item is QuoteRequestItem => item !== null);

  return parsed;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiPermission(request, "quotes:write");
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Payload cập nhật báo giá không hợp lệ." }, { status: 400 });
  }

  const quote = await getQuoteRequestById(params.id);
  if (!quote) {
    await appendAdminAuditLog({
      actorEmail: auth.session.email,
      action: "quote.not_found",
      targetId: params.id,
      message: "Khong tim thay quote de cap nhat",
    });
    return NextResponse.json({ ok: false, error: "Không tìm thấy quote request." }, { status: 404 });
  }

  const allowedStatuses = getWorkflowStatusesForSourceType(quote.sourceType);

  const status =
    typeof body.status === "string" && allowedStatuses.includes(body.status as QuoteRequestStatus)
      ? (body.status as QuoteRequestStatus)
      : undefined;

  const items = parseQuoteItems(body.items);

  const updated = await updateQuoteRequest(params.id, {
    status,
    internalSummary: typeof body.internalSummary === "string" ? body.internalSummary : undefined,
    draftMessage: typeof body.draftMessage === "string" ? body.draftMessage : undefined,
    items,
    pricing: {
      totalDiscountPercent: toNumber(body.totalDiscountPercent, quote.pricing.totalDiscountPercent),
      vatPercent: toNumber(body.vatPercent, quote.pricing.vatPercent),
      shippingFee: toNumber(body.shippingFee, quote.pricing.shippingFee),
    },
  });

  if (!updated) {
    await appendAdminAuditLog({
      actorEmail: auth.session.email,
      action: "quote.not_found",
      targetId: params.id,
      message: "Khong tim thay quote de cap nhat",
    });
    return NextResponse.json({ ok: false, error: "Không tìm thấy quote request." }, { status: 404 });
  }

  await appendAdminAuditLog({
    actorEmail: auth.session.email,
    action: "quote.updated",
    targetId: params.id,
    message: "Cap nhat quote request",
    meta: {
      status: updated.status,
    },
  });

  return NextResponse.json({ ok: true, message: "Đã cập nhật draft báo giá.", quote: updated });
}