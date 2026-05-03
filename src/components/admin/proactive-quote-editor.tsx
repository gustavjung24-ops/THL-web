"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_QUOTE_SOURCE_TYPES,
  ADMIN_QUOTE_STATUSES,
  buildProactiveQuoteCopyText,
  calculateProactiveQuote,
  createEmptyProactiveQuote,
  formatCurrencyVnd,
  getAdminQuoteSourceLabel,
  getAdminQuoteStatusLabel,
  normalizeAdminQuoteSourceType,
  normalizeAdminQuoteStatus,
  normalizeProactiveQuoteItem,
  type AdminProactiveQuoteItem,
  type AdminProactiveQuoteRecord,
} from "@/lib/admin/proactive-quote";
import type { AdminCatalogBrand, AdminCatalogGroup, AdminCatalogSearchResult } from "@/lib/admin/catalog-search";

const BRAND_OPTIONS: Array<{ value: AdminCatalogBrand; label: string }> = [
  { value: "ALL", label: "Tất cả brand" },
  { value: "NTN", label: "NTN" },
  { value: "Koyo", label: "Koyo" },
  { value: "Tsubaki", label: "Tsubaki" },
  { value: "NOK", label: "NOK" },
  { value: "Mitsuba", label: "Mitsuba" },
  { value: "Soho V-Belt", label: "Soho V-Belt" },
];

const GROUP_OPTIONS: Array<{ value: AdminCatalogGroup; label: string }> = [
  { value: "all", label: "Tất cả nhóm" },
  { value: "bearings", label: "Vòng bi" },
  { value: "housings", label: "Gối đỡ / vòng bi" },
  { value: "chains", label: "Xích công nghiệp" },
  { value: "seals", label: "Phớt chặn dầu" },
  { value: "vbelts", label: "Dây curoa" },
];

type Props = {
  initialQuote?: AdminProactiveQuoteRecord;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toNumber(value: string) {
  const parsed = Number(value.replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildPrintHtml(quote: AdminProactiveQuoteRecord) {
  const calculated = calculateProactiveQuote(quote);
  const rows = calculated.items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.code)}</td>
          <td>${escapeHtml(item.brand || "")}</td>
          <td>${escapeHtml(item.name)}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrencyVnd(item.unitPriceAfterDiscount)}</td>
          <td>${formatCurrencyVnd(item.lineTotal)}</td>
          <td>${escapeHtml(item.note || "")}</td>
        </tr>
      `,
    )
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Bao gia ${escapeHtml(quote.quote_id || "THL")}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
      h1 { margin: 0 0 12px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 13px; text-align: left; }
      th { background: #f1f5f9; }
      .meta { font-size: 13px; margin-bottom: 10px; color: #334155; }
      .summary { margin-top: 14px; font-size: 14px; }
      .summary p { margin: 4px 0; }
      .total { font-size: 16px; font-weight: 700; }
    </style>
  </head>
  <body>
    <h1>BÁO GIÁ THL</h1>
    <div class="meta">Mã: ${escapeHtml(quote.quote_id || "(chưa lưu)")} | Nguồn: ${escapeHtml(getAdminQuoteSourceLabel(quote.source_type))} | Trạng thái: ${escapeHtml(getAdminQuoteStatusLabel(quote.status))}</div>
    <div class="meta">Khách hàng: ${escapeHtml(quote.customer.name || "Khách lẻ")} | SĐT/Zalo: ${escapeHtml(quote.customer.phoneOrZalo || "")}</div>
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Mã</th>
          <th>Brand</th>
          <th>Tên</th>
          <th>SL</th>
          <th>Đơn giá</th>
          <th>Thành tiền</th>
          <th>Ghi chú</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="summary">
      <p>Tạm tính: ${formatCurrencyVnd(calculated.totals.subtotal)}</p>
      <p>CK tổng: ${quote.discountPercent}% (-${formatCurrencyVnd(calculated.totals.totalDiscountAmount)})</p>
      <p>VAT: ${quote.vatPercent}% (+${formatCurrencyVnd(calculated.totals.vatAmount)})</p>
      <p>Phí giao hàng: ${formatCurrencyVnd(quote.shippingFee)}</p>
      <p class="total">Tổng cộng: ${formatCurrencyVnd(calculated.totals.grandTotal)}</p>
      <p>Ghi chú: ${escapeHtml(quote.note || "")}</p>
    </div>
  </body>
</html>`;
}

export function ProactiveQuoteEditor({ initialQuote }: Props) {
  const [quote, setQuote] = useState<AdminProactiveQuoteRecord>(initialQuote ?? createEmptyProactiveQuote());
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<AdminCatalogBrand>("ALL");
  const [selectedGroup, setSelectedGroup] = useState<AdminCatalogGroup>("all");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AdminCatalogSearchResult[]>([]);
  const [selectedSearchCodes, setSelectedSearchCodes] = useState<string[]>([]);

  const [manualBrand, setManualBrand] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualQuantity, setManualQuantity] = useState("1");
  const [manualPrice, setManualPrice] = useState("");
  const [manualNote, setManualNote] = useState("");

  const calculated = useMemo(() => calculateProactiveQuote(quote), [quote]);
  const existingQuoteCodeSet = useMemo(() => new Set(quote.items.map((item) => item.normalizedCode)), [quote.items]);
  const selectableFilteredResults = useMemo(
    () => searchResults.filter((item) => !existingQuoteCodeSet.has(item.normalizedCode)),
    [searchResults, existingQuoteCodeSet],
  );

  useEffect(() => {
    const query = searchInput.trim();
    if (!query) {
      setSearchResults([]);
      setSelectedSearchCodes([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(
          `/api/admin/quotes/catalog-search?q=${encodeURIComponent(query)}&brand=${encodeURIComponent(selectedBrand)}&group=${encodeURIComponent(selectedGroup)}`,
          { method: "GET", cache: "no-store" },
        );

        const payload = (await response.json()) as { ok?: boolean; items?: AdminCatalogSearchResult[]; error?: string };
        if (!response.ok || !payload.ok) {
          setSearchResults([]);
          setFeedback(payload.error ?? "Không tra được mã sản phẩm.");
          return;
        }

        setSearchResults(payload.items ?? []);
      } catch {
        setSearchResults([]);
        setFeedback("Không tra được mã sản phẩm.");
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput, selectedBrand, selectedGroup]);

  function updateCustomer<K extends keyof AdminProactiveQuoteRecord["customer"]>(
    key: K,
    value: AdminProactiveQuoteRecord["customer"][K],
  ) {
    setQuote((current) => ({
      ...current,
      customer: {
        ...current.customer,
        [key]: value,
      },
    }));
  }

  function updateItem(index: number, patch: Partial<AdminProactiveQuoteItem>) {
    setQuote((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? normalizeProactiveQuoteItem({ ...item, ...patch }) : item,
      ),
    }));
  }

  function removeItem(index: number) {
    setQuote((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function addItemFromCatalog(item: AdminCatalogSearchResult) {
    setQuote((current) => {
      const exists = current.items.some((line) => line.normalizedCode === item.normalizedCode);
      if (exists) {
        return current;
      }

      return {
        ...current,
        items: [
          ...current.items,
          {
            brand: item.brand,
            code: item.code,
            normalizedCode: item.normalizedCode,
            name: item.name,
            productGroup: item.productGroup,
            productGroupLabel: item.productGroupLabel,
            quantity: 1,
            internalPrice: item.internalPrice,
            lineDiscountPercent: 0,
            note: "",
            source: "catalog",
            confidence: item.confidence,
            priceStatus: item.priceStatus,
            sourceUrl: item.sourceUrl,
          },
        ],
      };
    });
  }

  function toggleSearchSelection(normalizedCode: string, checked: boolean) {
    setSelectedSearchCodes((current) => {
      if (checked) {
        return current.includes(normalizedCode) ? current : [...current, normalizedCode];
      }
      return current.filter((code) => code !== normalizedCode);
    });
  }

  function addSelectedItemsFromCatalog() {
    if (selectedSearchCodes.length === 0) {
      return;
    }

    const selectedSet = new Set(selectedSearchCodes);
    for (const item of searchResults) {
      if (selectedSet.has(item.normalizedCode)) {
        addItemFromCatalog(item);
      }
    }

    setSelectedSearchCodes([]);
  }

  function addManualItem() {
    const code = manualCode.trim();
    if (!code) {
      setFeedback("Dòng thủ công cần có mã sản phẩm.");
      return;
    }

    const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (existingQuoteCodeSet.has(normalizedCode)) {
      setFeedback("Mã này đã có trong báo giá.");
      return;
    }

    setQuote((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          brand: manualBrand.trim(),
          code,
          normalizedCode,
          name: manualName.trim() || code,
          productGroup: selectedGroup,
          productGroupLabel: GROUP_OPTIONS.find((item) => item.value === selectedGroup)?.label || "",
          quantity: Math.max(1, Math.round(toNumber(manualQuantity) || 1)),
          internalPrice: toNumber(manualPrice) > 0 ? Math.round(toNumber(manualPrice)) : null,
          lineDiscountPercent: 0,
          note: manualNote.trim(),
          source: "manual_admin",
          confidence: "manual_review",
          priceStatus: "manual_review",
          sourceUrl: "",
        },
      ],
    }));

    setManualBrand("");
    setManualCode("");
    setManualName("");
    setManualQuantity("1");
    setManualPrice("");
    setManualNote("");
    setFeedback("Đã thêm dòng thủ công để báo giá tạm.");
  }

  function copyQuote(mode: "zalo" | "email") {
    if (quote.items.length === 0) {
      setFeedback("Vui lòng thêm ít nhất 1 sản phẩm trước khi copy báo giá.");
      return;
    }

    const text = buildProactiveQuoteCopyText(
      {
        ...quote,
        subtotal: calculated.totals.subtotal,
        total: calculated.totals.grandTotal,
      },
      mode,
    );

    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(text);
        setFeedback(mode === "zalo" ? "Đã copy báo giá Zalo." : "Đã copy báo giá Email.");
      } catch {
        setFeedback("Không copy được tự động. Vui lòng copy thủ công từ bản in HTML.");
      }
    });
  }

  function saveQuote() {
    if (quote.items.length === 0) {
      setFeedback("Vui lòng thêm ít nhất 1 sản phẩm.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/admin/quotes/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quote: {
            ...quote,
            subtotal: calculated.totals.subtotal,
            total: calculated.totals.grandTotal,
          },
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; quote?: AdminProactiveQuoteRecord; error?: string };
      if (!response.ok || !payload.ok || !payload.quote) {
        setFeedback(payload.error ?? "Không lưu được báo giá chủ động.");
        return;
      }

      setQuote(payload.quote);
      setFeedback("Đã lưu báo giá chủ động.");
    });
  }

  function openHtmlPrint() {
    if (quote.items.length === 0) {
      setFeedback("Vui lòng thêm ít nhất 1 sản phẩm trước khi in.");
      return null;
    }

    const popup = window.open("", "_blank", "noopener,noreferrer,width=1080,height=860");
    if (!popup) {
      setFeedback("Trình duyệt đang chặn popup in.");
      return null;
    }

    popup.document.open();
    popup.document.write(buildPrintHtml({
      ...quote,
      subtotal: calculated.totals.subtotal,
      total: calculated.totals.grandTotal,
    }));
    popup.document.close();
    popup.focus();
    return popup;
  }

  function printPdf() {
    if (quote.items.length === 0) {
      setFeedback("Vui lòng thêm ít nhất 1 sản phẩm trước khi in.");
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";

    const printableHtml = buildPrintHtml({
      ...quote,
      subtotal: calculated.totals.subtotal,
      total: calculated.totals.grandTotal,
    });

    iframe.onload = () => {
      const frameWindow = iframe.contentWindow;
      if (!frameWindow) {
        setFeedback("Không thể mở trình in PDF.");
        document.body.removeChild(iframe);
        return;
      }

      frameWindow.focus();
      frameWindow.print();

      window.setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    };

    document.body.appendChild(iframe);
    iframe.srcdoc = printableHtml;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bao gia chu dong</p>
            <h1 className="text-2xl font-bold text-slate-950">Tạo báo giá chủ động</h1>
            <p className="text-sm text-slate-600">Tra mã multi-brand, thêm dòng thủ công khi thiếu dữ liệu và giữ toàn bộ thao tác trong một màn hình.</p>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:justify-end">
            <Button type="button" variant="outline" onClick={() => copyQuote("zalo")} disabled={isPending}>Copy báo giá Zalo</Button>
            <Button type="button" variant="outline" onClick={() => copyQuote("email")} disabled={isPending}>Copy báo giá Email</Button>
            <Button type="button" variant="outline" onClick={openHtmlPrint} disabled={isPending}>HTML in/print</Button>
            <Button type="button" variant="outline" onClick={printPdf} disabled={isPending}>Xuất PDF/print</Button>
            <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={saveQuote} disabled={isPending}>Lưu báo giá</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Thông tin khách</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-1"><Label>Tên khách</Label><Input value={quote.customer.name} onChange={(event) => updateCustomer("name", event.target.value)} /></div>
              <div className="space-y-1"><Label>SĐT/Zalo</Label><Input value={quote.customer.phoneOrZalo} onChange={(event) => updateCustomer("phoneOrZalo", event.target.value)} /></div>
              <div className="space-y-1"><Label>Email</Label><Input value={quote.customer.email} onChange={(event) => updateCustomer("email", event.target.value)} /></div>
              <div className="space-y-1"><Label>Công ty</Label><Input value={quote.customer.company} onChange={(event) => updateCustomer("company", event.target.value)} /></div>
              <div className="space-y-1"><Label>Tỉnh/Thành</Label><Input value={quote.customer.province} onChange={(event) => updateCustomer("province", event.target.value)} /></div>
              <div className="space-y-1.5">
                <Label>Nguồn quote</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={quote.source_type}
                  onChange={(event) => setQuote((current) => ({ ...current, source_type: normalizeAdminQuoteSourceType(event.target.value) }))}
                >
                  {ADMIN_QUOTE_SOURCE_TYPES.map((source) => (
                    <option key={source} value={source}>{getAdminQuoteSourceLabel(source)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 md:col-span-2 xl:col-span-3"><Label>Ghi chú khách</Label><Textarea rows={2} value={quote.customer.note} onChange={(event) => updateCustomer("note", event.target.value)} /></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Thêm sản phẩm</h2>
                <p className="mt-1 text-sm text-slate-600">Tra mã nhanh theo catalog admin. Không tự suy diễn mã biến thể.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
              <div className="space-y-1.5"><Label>Ô tìm mã</Label><Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Nhập code hoặc normalized code" /></div>
              <div className="space-y-1.5">
                <Label>Bộ lọc nhãn hàng</Label>
                <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value as AdminCatalogBrand)}>
                  {BRAND_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Bộ lọc nhóm</Label>
                <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value as AdminCatalogGroup)}>
                  {GROUP_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1">Kết quả: {searchResults.length}</span>
              <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1">Đã tích: {selectedSearchCodes.length}</span>
            </div>

            {searchLoading ? <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">Đang tra mã...</p> : null}

            {searchResults.length > 0 ? (
              <div className="mt-3 space-y-3">
                <Button type="button" size="sm" onClick={addSelectedItemsFromCatalog} disabled={selectedSearchCodes.length === 0}>Thêm mã đã chọn ({selectedSearchCodes.length})</Button>
                <div className="max-h-72 overflow-auto rounded-xl border border-slate-200">
                  <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-slate-50 text-left text-slate-700">
                      <tr>
                        <th className="px-3 py-2">Tích</th>
                        <th className="px-3 py-2">Brand</th>
                        <th className="px-3 py-2">Code</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Group</th>
                        <th className="px-3 py-2">Internal price / status</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((item) => (
                        <tr key={item.normalizedCode} className="border-t border-slate-200 align-top">
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedSearchCodes.includes(item.normalizedCode)}
                              disabled={existingQuoteCodeSet.has(item.normalizedCode)}
                              onChange={(event) => toggleSearchSelection(item.normalizedCode, event.target.checked)}
                            />
                          </td>
                          <td className="px-3 py-2">{item.brand}</td>
                          <td className="px-3 py-2 font-semibold">{item.code}</td>
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">{item.productGroupLabel}</td>
                          <td className="px-3 py-2">{item.internalPrice != null ? formatCurrencyVnd(item.internalPrice) : "Chưa có"} ({item.priceStatus})</td>
                          <td className="px-3 py-2 text-right"><Button type="button" size="sm" variant="outline" onClick={() => addItemFromCatalog(item)} disabled={existingQuoteCodeSet.has(item.normalizedCode)}>{existingQuoteCodeSet.has(item.normalizedCode) ? "Đã thêm" : "Thêm nhanh"}</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {searchInput.trim().length > 0 && !searchLoading && searchResults.length === 0 ? (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">Không tìm thấy mã trong catalog hiện có. Có thể nhập mã thủ công để báo giá tạm.</p>
            ) : null}

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="font-semibold text-slate-900">Thêm dòng thủ công</h3>
              <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-1"><Label>Brand</Label><Input value={manualBrand} onChange={(event) => setManualBrand(event.target.value)} /></div>
                <div className="space-y-1"><Label>Code</Label><Input value={manualCode} onChange={(event) => setManualCode(event.target.value)} /></div>
                <div className="space-y-1"><Label>Name</Label><Input value={manualName} onChange={(event) => setManualName(event.target.value)} /></div>
                <div className="space-y-1"><Label>Quantity</Label><Input value={manualQuantity} onChange={(event) => setManualQuantity(event.target.value)} inputMode="numeric" /></div>
                <div className="space-y-1"><Label>Unit price</Label><Input value={manualPrice} onChange={(event) => setManualPrice(event.target.value)} inputMode="numeric" /></div>
                <div className="space-y-1 md:col-span-2 xl:col-span-3"><Label>Note</Label><Textarea rows={2} value={manualNote} onChange={(event) => setManualNote(event.target.value)} /></div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-xs text-slate-600">Dòng thủ công sẽ gắn source = manual_admin, confidence = manual_review.</p>
                <Button type="button" onClick={addManualItem}>Thêm dòng thủ công</Button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-slate-50 text-left text-slate-700">
                  <tr>
                    <th className="px-3 py-2">Code</th>
                    <th className="px-3 py-2">Brand</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Unit price / internal price</th>
                    <th className="px-3 py-2">Discount line %</th>
                    <th className="px-3 py-2">Final unit price</th>
                    <th className="px-3 py-2">Line total</th>
                    <th className="px-3 py-2">Note</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, index) => {
                    const calculatedItem = calculated.items[index];
                    return (
                      <tr key={`${item.normalizedCode}-${index}`} className="border-t border-slate-200 align-top">
                        <td className="px-3 py-2 font-semibold">{item.code}</td>
                        <td className="px-3 py-2">{item.brand || "-"}</td>
                        <td className="px-3 py-2"><Input value={item.name} onChange={(event) => updateItem(index, { name: event.target.value })} /></td>
                        <td className="px-3 py-2"><Input inputMode="numeric" value={`${item.quantity}`} onChange={(event) => updateItem(index, { quantity: toNumber(event.target.value) || 1 })} /></td>
                        <td className="px-3 py-2"><Input inputMode="numeric" value={item.internalPrice ? `${item.internalPrice}` : ""} placeholder="Chưa có" onChange={(event) => updateItem(index, { internalPrice: toNumber(event.target.value) > 0 ? Math.round(toNumber(event.target.value)) : null })} /></td>
                        <td className="px-3 py-2"><Input inputMode="decimal" value={`${item.lineDiscountPercent}`} onChange={(event) => updateItem(index, { lineDiscountPercent: Math.max(0, Math.min(100, toNumber(event.target.value))) })} /></td>
                        <td className="px-3 py-2 font-medium">{formatCurrencyVnd(calculatedItem?.unitPriceAfterDiscount ?? 0)}</td>
                        <td className="px-3 py-2 font-semibold">{formatCurrencyVnd(calculatedItem?.lineTotal ?? 0)}</td>
                        <td className="px-3 py-2"><Textarea rows={2} value={item.note} onChange={(event) => updateItem(index, { note: event.target.value })} /></td>
                        <td className="px-3 py-2 text-right"><Button type="button" size="sm" variant="outline" onClick={() => removeItem(index)}>Remove</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {quote.items.length === 0 ? <p className="px-3 py-4 text-sm text-slate-600">Chưa có sản phẩm nào trong báo giá.</p> : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Tổng</h2>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5"><Label>Chiết khấu tổng %</Label><Input inputMode="decimal" value={`${quote.discountPercent}`} onChange={(event) => setQuote((current) => ({ ...current, discountPercent: Math.max(0, Math.min(100, toNumber(event.target.value))) }))} /></div>
              <div className="space-y-1.5"><Label>VAT %</Label><Input inputMode="decimal" value={`${quote.vatPercent}`} onChange={(event) => setQuote((current) => ({ ...current, vatPercent: Math.max(0, Math.min(100, toNumber(event.target.value))) }))} /></div>
              <div className="space-y-1.5"><Label>Shipping fee</Label><Input inputMode="numeric" value={`${quote.shippingFee}`} onChange={(event) => setQuote((current) => ({ ...current, shippingFee: Math.max(0, Math.round(toNumber(event.target.value))) }))} /></div>
              <div className="space-y-1.5"><Label>Ghi chú nội bộ</Label><Textarea rows={4} value={quote.note} onChange={(event) => setQuote((current) => ({ ...current, note: event.target.value }))} /></div>
            </div>

            <div className="mt-5 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-semibold">{formatCurrencyVnd(calculated.totals.subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Discount tổng</span><span className="font-semibold">-{formatCurrencyVnd(calculated.totals.totalDiscountAmount)}</span></div>
              <div className="flex items-center justify-between"><span>VAT</span><span className="font-semibold">+{formatCurrencyVnd(calculated.totals.vatAmount)}</span></div>
              <div className="flex items-center justify-between"><span>Shipping fee</span><span className="font-semibold">+{formatCurrencyVnd(quote.shippingFee)}</span></div>
              <div className="flex items-center justify-between border-t border-slate-300 pt-2 text-base"><span className="font-semibold">Grand total</span><span className="font-bold">{formatCurrencyVnd(calculated.totals.grandTotal)}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Trạng thái báo giá</h2>
            <div className="mt-4 space-y-3">
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                value={quote.status}
                onChange={(event) => setQuote((current) => ({ ...current, status: normalizeAdminQuoteStatus(event.target.value) }))}
              >
                {ADMIN_QUOTE_STATUSES.map((status) => (
                  <option key={status} value={status}>{getAdminQuoteStatusLabel(status)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {feedback ? <p className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">{feedback}</p> : null}
    </div>
  );
}
