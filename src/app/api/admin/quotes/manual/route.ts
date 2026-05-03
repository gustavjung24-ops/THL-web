import { NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { createEmptyProactiveQuote } from "@/lib/admin/proactive-quote";
import { getProactiveQuoteById, listProactiveQuotes, upsertProactiveQuote } from "@/lib/admin/proactive-quote-store";

function str(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

export async function GET(request: Request) {
  const auth = await requireAdminApiPermission(request, "quotes:read");
  if (auth.error) {
    return auth.error;
  }

  const url = new URL(request.url);
  const quoteId = str(url.searchParams.get("id"));
  if (quoteId) {
    const quote = await getProactiveQuoteById(quoteId);
    if (!quote) {
      return NextResponse.json({ ok: false, error: "Không tìm thấy báo giá chủ động." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, quote });
  }

  const quotes = await listProactiveQuotes();
  return NextResponse.json({ ok: true, quotes });
}

export async function POST(request: Request) {
  const auth = await requireAdminApiPermission(request, "quotes:write");
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Payload báo giá không hợp lệ." }, { status: 400 });
  }

  let quoteInput: unknown = body.quote;

  if (!quoteInput) {
    const fallback = createEmptyProactiveQuote();
    quoteInput = {
      ...fallback,
      customer: {
        ...fallback.customer,
        name: str(body.fullName),
        email: str(body.email),
        phoneOrZalo: str(body.phone),
        company: str(body.company),
        province: str(body.area),
      },
      source_type: "manual",
      note: str(body.notes),
      items: [
        {
          brand: "",
          code: str(body.requestedCode),
          normalizedCode: str(body.requestedCode),
          name: "",
          productGroup: str(body.productGroup),
          productGroupLabel: str(body.productGroup),
          quantity: Number(str(body.quantity) || "1") || 1,
          internalPrice: null,
          lineDiscountPercent: 0,
          note: str(body.notes),
          source: "manual_admin",
          confidence: "manual_review",
          priceStatus: "manual_review",
          sourceUrl: "",
        },
      ],
    };
  }

  try {
    const quote = await upsertProactiveQuote(quoteInput);

    await appendAdminAuditLog({
      actorEmail: auth.session.email,
      action: "quote.updated",
      targetId: quote.quote_id,
      message: "Upsert bao gia chu dong",
      meta: {
        sourceType: quote.source_type,
        status: quote.status,
        items: quote.items.length,
      },
    });

    return NextResponse.json({ ok: true, quote });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Không lưu được báo giá chủ động.",
      },
      { status: 500 },
    );
  }
}
