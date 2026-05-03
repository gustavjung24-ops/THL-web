import { NextResponse } from "next/server";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { searchAdminCatalog, type AdminCatalogBrand, type AdminCatalogGroup } from "@/lib/admin/catalog-search";

function normalizeBrand(value: string): AdminCatalogBrand {
  const input = value.trim().toLowerCase();
  if (!input || input === "all") return "ALL";
  if (input === "ntn") return "NTN";
  if (input === "koyo" || input === "koyo/jtekt" || input === "jtekt") return "Koyo";
  if (input === "tsubaki") return "Tsubaki";
  if (input === "nok") return "NOK";
  if (input === "mitsuba") return "Mitsuba";
  if (input === "soho" || input === "soho v-belt") return "Soho V-Belt";
  return "ALL";
}

function normalizeGroup(value: string): AdminCatalogGroup {
  const input = value.trim().toLowerCase();
  if (!input || input === "all") return "all";
  if (input === "bearings") return "bearings";
  if (input === "housings") return "housings";
  if (input === "chains") return "chains";
  if (input === "seals") return "seals";
  if (input === "vbelts") return "vbelts";
  return "all";
}

export async function GET(request: Request) {
  const auth = await requireAdminApiPermission(request, "quotes:write");
  if (auth.error) {
    return auth.error;
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const brand = normalizeBrand(url.searchParams.get("brand") ?? "ALL");
  const productGroup = normalizeGroup(url.searchParams.get("group") ?? "all");
  const limit = Number(url.searchParams.get("limit") ?? "20");

  if (!q.trim()) {
    return NextResponse.json({ ok: true, items: [] });
  }

  try {
    const items = await searchAdminCatalog({ query: q, brand, productGroup, limit });
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Không tra được mã sản phẩm trong catalog admin.",
      },
      { status: 500 },
    );
  }
}
