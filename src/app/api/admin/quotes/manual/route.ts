import { NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { createManualQuoteRequest } from "@/lib/admin/quote-store";

function str(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

export async function POST(request: Request) {
  const auth = await requireAdminApiPermission(request, "quotes:write");
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Payload tao bao gia khong hop le." }, { status: 400 });
  }

  const fullName = str(body.fullName);
  const requestedCode = str(body.requestedCode);
  const productGroup = str(body.productGroup);

  if (!fullName || !requestedCode || !productGroup) {
    return NextResponse.json(
      { ok: false, error: "Can nhap ten khach hang, nhom vat tu va ma can bao gia." },
      { status: 400 },
    );
  }

  const quote = await createManualQuoteRequest({
    fullName,
    email: str(body.email),
    phone: str(body.phone),
    company: str(body.company),
    area: str(body.area),
    productGroup,
    requestedCode,
    application: str(body.application),
    quantity: str(body.quantity),
    priority: str(body.priority),
    notes: str(body.notes),
  });

  await appendAdminAuditLog({
    actorEmail: auth.session.email,
    action: "quote.updated",
    targetId: quote.id,
    message: "Tao bao gia chu dong",
    meta: {
      sourceType: quote.sourceType,
      status: quote.status,
    },
  });

  return NextResponse.json({ ok: true, quote });
}
