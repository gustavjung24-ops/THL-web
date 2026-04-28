"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Search, X } from "lucide-react";

type NtnSearchProduct = {
  code: string;
  name: string;
  application: string;
  application_detail: string;
  size_text: string;
  d_mm: number;
  D_mm: number;
  B_T_mm: number;
  group: string;
  search_text: string;
};

type NtnSearchPayload = {
  meta?: {
    dataset?: string;
    total?: number;
    generated_at?: string;
  };
  products?: NtnSearchProduct[];
};

type LoadState = "idle" | "loading" | "ready" | "error";

function parseNumericFilter(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function getCodeMatchScore(product: NtnSearchProduct, query: string): number {
  if (!query) {
    return 0;
  }

  const exactCode = normalizeCode(product.code);
  const queryCode = normalizeCode(query);
  const looseQuery = normalizeText(query);
  const productName = normalizeText(product.name);
  const haystack = normalizeText(product.search_text);

  if (queryCode && exactCode === queryCode) {
    return 0;
  }

  if (queryCode && exactCode.startsWith(queryCode)) {
    return 1;
  }

  if (queryCode && exactCode.includes(queryCode)) {
    return 2;
  }

  if (productName.includes(looseQuery)) {
    return 3;
  }

  if (haystack.includes(looseQuery)) {
    return 4;
  }

  return 5;
}

function buildApplicationLabel(product: NtnSearchProduct): string {
  const application = product.application.trim();
  const detail = product.application_detail.trim();

  if (!detail || detail === application) {
    return application;
  }

  return `${application} - ${detail}`;
}

export function AssistantBubble() {
  const [open, setOpen] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [products, setProducts] = useState<NtnSearchProduct[]>([]);
  const [datasetTotal, setDatasetTotal] = useState(0);
  const [codeFilter, setCodeFilter] = useState("");
  const [innerDiameterFilter, setInnerDiameterFilter] = useState("");
  const [outerDiameterFilter, setOuterDiameterFilter] = useState("");
  const [thicknessFilter, setThicknessFilter] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current) {
        return;
      }

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open || loadState !== "idle") {
      return;
    }

    let isActive = true;

    const loadProducts = async () => {
      setLoadState("loading");

      try {
        const response = await fetch("/ntn-product-search.json");
        const payload = (await response.json()) as NtnSearchPayload;

        if (!response.ok) {
          throw new Error("Cannot load NTN product search data.");
        }

        if (!isActive) {
          return;
        }

        const nextProducts = Array.isArray(payload.products) ? payload.products : [];
        setProducts(nextProducts);
        setDatasetTotal(payload.meta?.total ?? nextProducts.length);
        setLoadState("ready");
      } catch {
        if (!isActive) {
          return;
        }

        setLoadState("error");
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [open, loadState]);

  const codeQuery = codeFilter.trim();
  const innerDiameter = parseNumericFilter(innerDiameterFilter);
  const outerDiameter = parseNumericFilter(outerDiameterFilter);
  const thickness = parseNumericFilter(thicknessFilter);
  const hasFilters =
    codeQuery.length > 0 ||
    innerDiameter !== null ||
    outerDiameter !== null ||
    thickness !== null;

  const matchedProducts = products
    .filter((product) => {
      if (codeQuery.length > 0 && getCodeMatchScore(product, codeQuery) >= 5) {
        return false;
      }

      if (innerDiameter !== null && product.d_mm !== innerDiameter) {
        return false;
      }

      if (outerDiameter !== null && product.D_mm !== outerDiameter) {
        return false;
      }

      if (thickness !== null && product.B_T_mm !== thickness) {
        return false;
      }

      return true;
    })
    .sort((left, right) => {
      const scoreDifference = getCodeMatchScore(left, codeQuery) - getCodeMatchScore(right, codeQuery);
      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      if (left.d_mm !== right.d_mm) {
        return left.d_mm - right.d_mm;
      }

      if (left.D_mm !== right.D_mm) {
        return left.D_mm - right.D_mm;
      }

      if (left.B_T_mm !== right.B_T_mm) {
        return left.B_T_mm - right.B_T_mm;
      }

      return left.code.localeCompare(right.code);
    });

  const visibleProducts = matchedProducts.slice(0, 20);

  function clearFilters() {
    setCodeFilter("");
    setInnerDiameterFilter("");
    setOuterDiameterFilter("");
    setThicknessFilter("");
  }

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-[calc(6.2rem+env(safe-area-inset-bottom))] right-4 z-50 lg:bottom-6 lg:right-5"
    >
      {open ? (
        <div className="mb-3 w-[min(92vw,420px)] overflow-hidden rounded-xl border border-[#008fd3]/30 bg-white shadow-[0_24px_52px_-28px_rgba(15,23,42,0.45)]">
          <div className="flex items-start justify-between gap-3 border-b border-[#008fd3]/20 bg-gradient-to-r from-[#e7f7ff] to-white px-3 py-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#00699f]">Tra ma san pham NTN</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Loc theo ma SP, vong trong, vong ngoai va do day.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Dong bang tra ma"
              title="Dong"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-3 p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">Ma SP cu the</span>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Search className="size-4 text-slate-500" />
                  <input
                    id="quick-lookup-keyword"
                    type="text"
                    value={codeFilter}
                    onChange={(event) => setCodeFilter(event.target.value)}
                    placeholder="VD: 6204-2RS"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">Vong trong (d)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={innerDiameterFilter}
                  onChange={(event) => setInnerDiameterFilter(event.target.value)}
                  placeholder="VD: 20"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">Vong ngoai (D)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={outerDiameterFilter}
                  onChange={(event) => setOuterDiameterFilter(event.target.value)}
                  placeholder="VD: 47"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">Do day (B/T)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={thicknessFilter}
                  onChange={(event) => setThicknessFilter(event.target.value)}
                  placeholder="VD: 14"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#008fd3]/25 bg-[#e7f7ff] px-2.5 py-1 text-[11px] font-medium text-[#00699f]">
                  {datasetTotal || products.length} ma NTN
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  Ket qua: {hasFilters ? matchedProducts.length : 0}
                </span>
              </div>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[11px] font-semibold text-[#00699f] transition hover:text-[#00527d]"
                >
                  Xoa loc
                </button>
              ) : null}
            </div>

            {loadState === "loading" ? (
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                <LoaderCircle className="size-4 animate-spin text-[#00699f]" />
                Dang tai du lieu NTN...
              </div>
            ) : null}

            {loadState === "error" ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
                Khong tai duoc du lieu tra ma NTN. Vui long thu tai lai trang.
              </div>
            ) : null}

            {loadState === "ready" && !hasFilters ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-[11px] leading-relaxed text-slate-600">
                Nhap ma SP hoac dien them d / D / B-T de loc nhanh. Ket qua uu tien hien ma san pham va ung dung may
                theo dung cot trong file NTN.
              </div>
            ) : null}

            {loadState === "ready" && hasFilters && visibleProducts.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                Chua tim thay ma phu hop. Thu doi ma SP hoac giam bot dieu kien kich thuoc.
              </div>
            ) : null}

            {loadState === "ready" && hasFilters && visibleProducts.length > 0 ? (
              <div className="space-y-2">
                {matchedProducts.length > visibleProducts.length ? (
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Dang hien {visibleProducts.length}/{matchedProducts.length} ket qua gan nhat. Them ma SP hoac kich thuoc
                    de thu hep nhanh hon.
                  </p>
                ) : null}

                <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                  {visibleProducts.map((product) => (
                    <div
                      key={`${product.code}-${product.d_mm}-${product.D_mm}-${product.B_T_mm}`}
                      className="rounded-lg border border-slate-200 bg-white p-3 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.35)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Ma SP</p>
                          <p className="truncate text-sm font-semibold text-slate-900">{product.code}</p>
                        </div>
                        <span className="rounded-full border border-[#008fd3]/20 bg-[#e7f7ff] px-2 py-1 text-[10px] font-medium text-[#00699f]">
                          d {product.d_mm} | D {product.D_mm} | B/T {product.B_T_mm}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1 text-sm text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">Ung dung may:</span> {buildApplicationLabel(product)}
                        </p>
                        <p className="text-xs text-slate-500">Kich thuoc goc: {product.size_text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#008fd3]/35 bg-[#008fd3] text-white shadow-[0_14px_34px_-20px_rgba(0,143,211,0.85)] transition hover:-translate-y-0.5 hover:bg-[#007db8] sm:w-auto sm:gap-1.5 sm:px-3"
        aria-label={open ? "Dong pop tra ma" : "Mo pop tra ma"}
        title="Tra ma san pham"
      >
        <span className="hidden text-xs font-semibold uppercase tracking-wide sm:inline">Tim san pham</span>
        {open ? <X className="size-4" /> : <Search className="size-4" />}
      </button>
    </div>
  );
}
