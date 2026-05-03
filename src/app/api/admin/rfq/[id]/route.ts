import { NextResponse } from "next/server";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { getRfqRequestById } from "@/lib/admin/rfq-requests";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiPermission(request, "quotes:read");
  if (auth.error) {
    return auth.error;
  }

  const item = await getRfqRequestById(params.id);
  if (!item) {
    return NextResponse.json({ ok: false, error: "RFQ not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item });
}
