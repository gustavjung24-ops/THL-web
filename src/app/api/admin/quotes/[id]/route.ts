import { NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { type QuoteRequestStatus, updateQuoteRequest } from "@/lib/admin/quote-store";

const allowedStatuses: QuoteRequestStatus[] = ["new", "draft", "quoted", "sent", "closed"];

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiPermission(request, "quotes:write");
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Payload cập nhật báo giá không hợp lệ." }, { status: 400 });
  }

  const status =
    typeof body.status === "string" && allowedStatuses.includes(body.status as QuoteRequestStatus)
      ? (body.status as QuoteRequestStatus)
      : undefined;

  const updated = await updateQuoteRequest(params.id, {
    status,
    internalSummary: typeof body.internalSummary === "string" ? body.internalSummary : undefined,
    draftMessage: typeof body.draftMessage === "string" ? body.draftMessage : undefined,
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