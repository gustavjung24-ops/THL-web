import { NextResponse } from "next/server";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { listProactiveQuotes } from "@/lib/admin/proactive-quote-store";

export async function GET(request: Request) {
  const auth = await requireAdminApiPermission(request, "quotes:read");
  if (auth.error) {
    return auth.error;
  }

  const items = await listProactiveQuotes();
  return NextResponse.json({ ok: true, items });
}
