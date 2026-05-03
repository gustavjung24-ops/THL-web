import { NextResponse } from "next/server";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { searchAdminCatalog, type AdminCatalogBrand } from "@/lib/admin/catalog-search";

function normalizeBrand(value: string): AdminCatalogBrand {
  const input = value.trim();
  if (!input || input.toUpperCase() === "ALL") return "ALL";
  if (input === "NTN") return "NTN";
  if (input === "Koyo" || input === "Koyo/JTEKT" || input === "KOYO/JTEKT" || input === "JTEKT") return "Koyo/JTEKT";
  if (input === "Tsubaki") return "Tsubaki";
  if (input === "NOK") return "NOK";
  if (input === "Mitsuba") return "Mitsuba";
  if (input === "Soho" || input === "Soho V-Belt") return "Soho V-Belt";
  return "ALL";
}

export async function GET(request: Request) {
  const auth = await requireAdminApiPermission(request, "quotes:read");
  if (auth.error) {
    return auth.error;
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const brand = normalizeBrand(url.searchParams.get("brand") ?? "ALL");
  const limit = Number(url.searchParams.get("limit") ?? "20");

  if (!q.trim()) {
    return NextResponse.json({ ok: true, items: [] });
  }

  const items = await searchAdminCatalog({ query: q, brand, limit });
  return NextResponse.json({ ok: true, items });
}
