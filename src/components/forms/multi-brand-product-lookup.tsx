"use client";

import { FormEvent, useMemo, useState } from "react";
import { LoaderCircle, Search } from "lucide-react";
import type { ProductSearchItem, ProductSearchResponse } from "@/lib/product-search";
import { Button } from "@/components/ui/button";

const brandOptions = [
  { value: "ALL", label: "Tất cả nhãn hàng" },
  { value: "NTN", label: "NTN" },
  { value: "Koyo", label: "Koyo" },
  { value: "Tsubaki", label: "Tsubaki" },
  { value: "NOK", label: "NOK" },
  { value: "Mitsuba", label: "Mitsuba" },
  { value: "Soho V-Belt", label: "Soho V-Belt" },
];

const groupOptions = [
  { value: "ALL", label: "Tất cả nhóm" },
  { value: "Vòng bi", label: "Vòng bi" },
  { value: "Gối đỡ / vòng bi", label: "Gối đỡ / vòng bi" },
  { value: "Xích công nghiệp", label: "Xích công nghiệp" },
  { value: "Phớt chặn dầu", label: "Phớt chặn dầu" },
  { value: "Dây curoa", label: "Dây curoa" },
];

type MultiBrandProductLookupProps = {
  onPickProduct: (item: ProductSearchItem) => void;
};

export function MultiBrandProductLookup({ onPickProduct }: MultiBrandProductLookupProps) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("ALL");
  const [group, setGroup] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ProductSearchResponse | null>(null);

  const canSearch = query.trim().length > 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSearch) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        q: query,
        brand,
        group,
        limit: "120",
      });

      const response = await fetch(`/api/products/search?${params.toString()}`);
      const data = (await response.json()) as ProductSearchResponse & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Không thể tra mã lúc này. Vui lòng thử lại.");
        setResult(null);
        return;
      }

      setResult(data);
    } catch {
      setError("Không thể tra mã lúc này. Vui lòng thử lại.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const totalResults = useMemo(() => {
    if (!result) return 0;
    return result.groups.reduce((acc, current) => acc + current.items.length, 0);
  }, [result]);

  return (
    <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.45)] sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#00699f]">Tra mã đa thương hiệu</p>
        <h2 className="text-2xl font-semibold text-slate-900">Tìm mã nhanh theo nhãn hàng hoặc tra ngẫu nhiên</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Nhập mã, kích thước hoặc từ khóa như 6205ZZ, RS40, TC 30x47x7, UCP205, A50, SPA1000 để tra nhanh.
        </p>
      </div>

      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="grid gap-3 md:grid-cols-[2fr,1fr,1fr,auto]">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Mã / kích thước / từ khóa</span>
            <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2">
              <Search className="size-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="VD: 6205, 6205ZZ, RS40-2, TC 30x47x7, UCP205, A50"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Nhãn hàng</span>
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none"
            >
              {brandOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Nhóm sản phẩm</span>
            <select
              value={group}
              onChange={(event) => setGroup(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none"
            >
              {groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <Button type="submit" className="h-10 w-full bg-blue-800 px-5 hover:bg-blue-900 md:w-auto" disabled={!canSearch || loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Đang tra
                </span>
              ) : (
                "Tra mã"
              )}
            </Button>
          </div>
        </div>
      </form>

      {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

      {result ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{totalResults} kết quả</span>
            {brand === "ALL" ? <span>Tra ngẫu nhiên ưu tiên: NTN, Tsubaki, Soho, NOK.</span> : null}
          </div>

          {totalResults === 0 ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Không tìm thấy kết quả phù hợp. Hãy thử thay đổi mã, bỏ bớt điều kiện hoặc chọn lại nhãn hàng.
            </div>
          ) : null}

          {result.groups.map((brandGroup) => (
            <div key={brandGroup.brand} className="space-y-2">
              {brand === "ALL" ? (
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{brandGroup.brand}</h3>
              ) : null}

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {brandGroup.items.map((item) => (
                  <article
                    key={`${item.brand}-${item.productCode}`}
                    className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.45)]"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mã sản phẩm chính</p>
                      <p className="text-base font-semibold text-slate-900">{item.productCode}</p>
                      <p className="text-sm text-slate-600">{item.displayName}</p>
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-900">Nhãn hàng:</span> {item.brand}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Nhóm sản phẩm:</span> {item.group}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Kích thước / thông số:</span> {item.dimensions}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Ứng dụng:</span> {item.application}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Trạng thái:</span> {item.status}
                      </p>
                      <p className="text-xs text-[#00699f]">
                        {item.matchedBy}
                        {item.matchedAlias ? `: ${item.matchedAlias}` : ""}
                      </p>
                    </div>

                    <Button
                      type="button"
                      className="mt-4 w-full bg-blue-800 hover:bg-blue-900"
                      onClick={() => onPickProduct(item)}
                    >
                      Gửi mã này để báo giá
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}