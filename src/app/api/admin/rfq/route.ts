import { NextResponse } from "next/server";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { listRfqRequests } from "@/lib/admin/proactive-quote";

export async function GET(request: Request) {
  const auth = await requireAdminApiPermission(request, "quotes:read");
  if (auth.error) {
    return auth.error;
  }

  const items = await listRfqRequests();
  return NextResponse.json({ ok: true, items });
}
