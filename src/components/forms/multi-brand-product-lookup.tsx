"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, LoaderCircle, Search, X } from "lucide-react";
import type { ProductSearchItem, ProductSearchResponse } from "@/lib/product-search";
import { Button } from "@/components/ui/button";

const brandOptions = [
  { value: "ALL", label: "Tat ca nhan hang" },
  { value: "NTN", label: "NTN" },
  { value: "Koyo", label: "Koyo" },
  { value: "Tsubaki", label: "Tsubaki" },
  { value: "NOK", label: "NOK" },
  { value: "Mitsuba", label: "Mitsuba" },
  { value: "Soho V-Belt", label: "Soho V-Belt" },
];

const groupOptions = [
  { value: "ALL", label: "Tat ca nhom" },
  { value: "Vong bi", label: "Vong bi" },
  { value: "Goi do / vong bi", label: "Goi do / vong bi" },
  { value: "Xich cong nghiep", label: "Xich cong nghiep" },
  { value: "Phot chan dau", label: "Phot chan dau" },
  { value: "Day curoa", label: "Day curoa" },
];

const applicationOptions = [
  { value: "", label: "Chon ung dung" },
  { value: "Bang tai", label: "Bang tai" },
  { value: "Dong co", label: "Dong co" },
  { value: "May bom", label: "May bom" },
  { value: "Quat cong nghiep", label: "Quat cong nghiep" },
  { value: "Hop so", label: "Hop so" },
  { value: "Truc quay", label: "Truc quay" },
];

const quickHints = [
  { label: "Vong bi: 6205", value: "6205" },
  { label: "Vong bi: 6308", value: "6308" },
  { label: "Vong bi: 22212", value: "22212" },
  { label: "Vong bi: NU308", value: "NU308" },
  { label: "Goi do: UCP208", value: "UCP208" },
  { label: "Goi do: UCF207", value: "UCF207" },
  { label: "Phot: 60X90X10", value: "60x90x10" },
  { label: "Phot: 90X100X26", value: "90x100x26" },
];

type MultiBrandProductLookupProps = {
  onPickProduct: (item: ProductSearchItem) => void;
  selectedProduct: ProductSearchItem | null;
  onClearSelection: () => void;
};

export function MultiBrandProductLookup({ onPickProduct, selectedProduct, onClearSelection }: MultiBrandProductLookupProps) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("ALL");
  const [group, setGroup] = useState("ALL");
  const [application, setApplication] = useState("");
  const [dInner, setDInner] = useState("");
  const [dOuter, setDOuter] = useState("");
  const [bThickness, setBThickness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ProductSearchResponse | null>(null);

  const canSearch =
    query.trim().length > 0 ||
    brand !== "ALL" ||
    group !== "ALL" ||
    application.trim().length > 0 ||
    dInner.trim().length > 0 ||
    dOuter.trim().length > 0 ||
    bThickness.trim().length > 0;

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
        application,
        d: dInner,
        D: dOuter,
        BT: bThickness,
        limit: "120",
      });

      const response = await fetch(`/api/products/search?${params.toString()}`);
      const data = (await response.json()) as ProductSearchResponse & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Khong the tra ma luc nay. Vui long thu lai.");
        setResult(null);
        return;
      }

      setResult(data);
    } catch {
      setError("Khong the tra ma luc nay. Vui long thu lai.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function resetAdvancedFilters() {
    setBrand("ALL");
    setGroup("ALL");
    setApplication("");
    setDInner("");
    setDOuter("");
    setBThickness("");
  }

  const totalResults = useMemo(() => {
    if (!result) return 0;
    return result.groups.reduce((acc, current) => acc + current.items.length, 0);
  }, [result]);

  return (
    <section className="space-y-5 rounded-2xl border border-[#2d5f96] bg-[#082546] p-4 text-white shadow-[0_16px_36px_-24px_rgba(8,37,70,0.8)] sm:p-6">
      <div className="rounded-2xl border border-[#2d5f96] bg-[#0b2f56] p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Nhap ma</p>
          <span className="rounded-full border border-[#2d5f96] bg-[#11457f] px-3 py-1 text-xs font-semibold text-blue-100">Cong cu tra ma</span>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label htmlFor="lookup-query" className="text-sm font-semibold text-slate-100">Ma san pham</label>
            <div className="grid gap-2 md:grid-cols-[1fr,auto]">
              <div className="flex items-center gap-2 rounded-xl border border-[#2d5f96] bg-[#082546] px-3 py-2.5">
                <Search className="size-4 text-blue-200" />
                <input
                  id="lookup-query"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="6205, UCP208, 90x100x26..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-blue-200/60"
                />
              </div>
              <Button type="submit" className="h-11 bg-[#1e73c8] px-6 text-white hover:bg-[#155ea9]" disabled={!canSearch || loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin" />
                    Dang tra
                  </span>
                ) : (
                  "Tra ma"
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-[#2d5f96] bg-[#0a2a4d] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">Goi y nhanh</p>
              <button type="button" className="text-xs font-semibold text-blue-200 hover:text-white" onClick={() => setQuery("")}>Xoa ma</button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {quickHints.map((hint) => (
                <button
                  key={hint.label}
                  type="button"
                  onClick={() => setQuery(hint.value)}
                  className="rounded-full border border-[#2d5f96] bg-[#103964] px-3 py-1.5 text-left text-xs font-semibold text-blue-100 transition hover:bg-[#1a4f85]"
                >
                  {hint.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-[#2d5f96] bg-[#0a2a4d] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-100">Loc theo nhom va kich thuoc d/D/B-T</p>
              <Button type="button" variant="outline" className="border-[#2d5f96] bg-transparent text-blue-100 hover:bg-[#103964]" onClick={resetAdvancedFilters}>
                Reset
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">Nhom san pham</span>
                <select
                  value={group}
                  onChange={(event) => setGroup(event.target.value)}
                  className="h-11 w-full rounded-xl border border-[#2d5f96] bg-[#082546] px-3 text-sm text-white outline-none"
                >
                  {groupOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#082546]">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">Ung dung</span>
                <select
                  value={application}
                  onChange={(event) => setApplication(event.target.value)}
                  className="h-11 w-full rounded-xl border border-[#2d5f96] bg-[#082546] px-3 text-sm text-white outline-none"
                >
                  {applicationOptions.map((option) => (
                    <option key={option.label} value={option.value} className="bg-[#082546]">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">d (trong)</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={dInner}
                  onChange={(event) => setDInner(event.target.value)}
                  className="h-11 w-full rounded-xl border border-[#2d5f96] bg-[#082546] px-3 text-sm text-white outline-none"
                  placeholder="20"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">D (ngoai)</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={dOuter}
                  onChange={(event) => setDOuter(event.target.value)}
                  className="h-11 w-full rounded-xl border border-[#2d5f96] bg-[#082546] px-3 text-sm text-white outline-none"
                  placeholder="52"
                />
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">B/T (day)</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={bThickness}
                  onChange={(event) => setBThickness(event.target.value)}
                  className="h-11 w-full rounded-xl border border-[#2d5f96] bg-[#082546] px-3 text-sm text-white outline-none"
                  placeholder="15"
                />
              </label>
            </div>

            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">Nhan hang</span>
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#2d5f96] bg-[#082546] px-3 text-sm text-white outline-none"
              >
                {brandOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#082546]">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>
      </div>

      {selectedProduct ? (
        <div className="flex flex-col gap-2 rounded-xl border border-blue-300 bg-[#0f3968] px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Ma da chon de gui bao gia</p>
            <p className="text-sm font-semibold text-white">{selectedProduct.productCode} | {selectedProduct.brand} | {selectedProduct.group}</p>
          </div>
          <Button type="button" variant="outline" className="border-blue-300 bg-transparent text-blue-100 hover:bg-[#1a4f85]" onClick={onClearSelection}>
            <X className="mr-2 size-4" /> Bo chon
          </Button>
        </div>
      ) : null}

      <section className="space-y-3 rounded-2xl border border-[#2d5f96] bg-[#0b2f56] p-4">
        <h3 className="text-lg font-semibold text-white">Ket qua tra ma</h3>

        {error ? <div className="rounded-md border border-red-300/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div> : null}

        {result ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-blue-100">
              <span className="rounded-full border border-[#2d5f96] bg-[#103964] px-3 py-1">{totalResults} ket qua</span>
              {selectedProduct ? <span className="rounded-full border border-blue-300 bg-blue-500/15 px-3 py-1">Dang chon: {selectedProduct.productCode}</span> : null}
            </div>

            {totalResults === 0 ? (
              <div className="rounded-md border border-[#2d5f96] bg-[#082546] px-3 py-2 text-sm text-blue-100">
                Khong co ket qua phu hop. Thu bo bot dieu kien hoac doi nhom/ung dung.
              </div>
            ) : null}

            {result.groups.map((brandGroup) => (
              <div key={brandGroup.brand} className="space-y-2">
                {brand !== "ALL" ? null : <h4 className="text-sm font-semibold uppercase tracking-wide text-blue-200">{brandGroup.brand}</h4>}

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {brandGroup.items.map((item) => (
                    <article
                      key={`${item.brand}-${item.productCode}`}
                      className={`flex h-full flex-col rounded-xl border p-4 ${
                        selectedProduct?.productCode === item.productCode && selectedProduct?.brand === item.brand
                          ? "border-blue-300 bg-[#14508a]"
                          : "border-[#2d5f96] bg-[#082546]"
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Ma san pham</p>
                        <p className="text-base font-semibold text-white">{item.productCode}</p>
                        <p className="text-sm text-blue-100">{item.displayName}</p>
                      </div>

                      <div className="mt-3 space-y-1 text-sm text-blue-100">
                        <p><span className="font-semibold text-white">Nhan hang:</span> {item.brand}</p>
                        <p><span className="font-semibold text-white">Nhom:</span> {item.group}</p>
                        <p><span className="font-semibold text-white">Kich thuoc:</span> {item.dimensions}</p>
                        <p><span className="font-semibold text-white">Ung dung:</span> {item.application}</p>
                      </div>

                      <p className="mt-2 text-xs text-blue-200">
                        {item.matchedBy}
                        {item.matchedAlias ? `: ${item.matchedAlias}` : ""}
                      </p>

                      <Button type="button" className="mt-4 w-full bg-[#1e73c8] hover:bg-[#155ea9]" onClick={() => onPickProduct(item)}>
                        {selectedProduct?.productCode === item.productCode && selectedProduct?.brand === item.brand ? (
                          <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4" /> Da chon ma nay</span>
                        ) : (
                          "Chon ma de gui bao gia"
                        )}
                      </Button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-blue-100">Nhap ma hoac chon bo loc ky thuat de bat dau.</p>
        )}
      </section>
    </section>
  );
}
