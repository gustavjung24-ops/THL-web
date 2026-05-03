import { NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { RFQ_WORKFLOW_STATUSES, type QuoteRequestStatus } from "@/lib/admin/quote-workflow";
import { updateRfqStatus } from "@/lib/admin/proactive-quote";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiPermission(request, "quotes:status");
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const status = typeof body?.status === "string" ? (body.status as QuoteRequestStatus) : null;

  if (!status || !RFQ_WORKFLOW_STATUSES.includes(status as (typeof RFQ_WORKFLOW_STATUSES)[number])) {
    return NextResponse.json({ ok: false, error: "Invalid RFQ status." }, { status: 400 });
  }

  const updated = await updateRfqStatus(params.id, status);
  if (!updated) {
    return NextResponse.json({ ok: false, error: "RFQ not found or status invalid." }, { status: 404 });
  }

  await appendAdminAuditLog({
    actorEmail: auth.session.email,
    action: "quote.updated",
    targetId: updated.id,
    message: "Update RFQ status",
    meta: {
      sourceType: updated.sourceType,
      status: updated.status,
    },
  });

  return NextResponse.json({ ok: true, item: updated });
}
