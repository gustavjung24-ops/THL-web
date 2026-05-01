import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/product-search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const brand = url.searchParams.get("brand") ?? "ALL";
  const group = url.searchParams.get("group") ?? "ALL";
  const application = url.searchParams.get("application") ?? "";
  const dInner = url.searchParams.get("d") ?? "";
  const dOuter = url.searchParams.get("D") ?? "";
  const bThickness = url.searchParams.get("BT") ?? "";
  const limit = Number(url.searchParams.get("limit") ?? "80");

  try {
    const result = await searchProducts({
      query,
      brand,
      group,
      application,
      dInner,
      dOuter,
      bThickness,
      limit,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: "Không thể tải dữ liệu tra mã lúc này. Vui lòng thử lại.",
      },
      { status: 500 },
    );
  }
}