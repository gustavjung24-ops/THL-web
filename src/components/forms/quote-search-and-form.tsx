"use client";

import { useState } from "react";
import { ArrowDownCircle, MessageCircle, PhoneCall, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { ProductSearchItem } from "@/lib/product-search";
import { LeadForm } from "@/components/forms/lead-form";
import { MultiBrandProductLookup } from "@/components/forms/multi-brand-product-lookup";
import { Button } from "@/components/ui/button";

export function QuoteSearchAndForm() {
  const [selectedProducts, setSelectedProducts] = useState<ProductSearchItem[]>([]);
  const [zaloHint, setZaloHint] = useState("");
  const [lastZaloMessage, setLastZaloMessage] = useState("");
  const [pendingZaloUrl, setPendingZaloUrl] = useState("");
  const [isZaloGuideOpen, setIsZaloGuideOpen] = useState(false);

  const primarySelectedProduct = selectedProducts[0] ?? null;

  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback below
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }

  function buildQuickZaloMessage(items: ProductSearchItem[]) {
    const codeLines = items.map((item, index) => `${index + 1}. ${item.productCode} | ${item.brand} | ${item.group}`);

    return [
      "THL B2B xin chao,",
      "Em can bao gia nhanh theo danh sach ma sau:",
      ...codeLines,
      "",
      `Tong so ma: ${items.length}`,
      "Nho doi THL tu van va gui bao gia som.",
      `Nguon yeu cau: ${siteConfig.domain}/tra-ma-bao-gia`,
    ].join("\n");
  }

  async function shareViaDevice(message: string): Promise<boolean> {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
      return false;
    }

    try {
      await navigator.share({
        title: "Yêu cầu báo giá THL",
        text: message,
        url: siteConfig.zaloLink,
      });
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return true;
      }
      return false;
    }
  }

  function isMobileLikeDevice(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 767px)").matches || /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
  }

  async function openQuickZalo(items: ProductSearchItem[]) {
    if (items.length === 0) {
      return;
    }

    const base = siteConfig.zaloLink?.trim() || "https://zalo.me/0902964685";
    const message = buildQuickZaloMessage(items);
    const separator = base.includes("?") ? "&" : "?";
    const directUrl = `${base}${separator}text=${encodeURIComponent(message)}`;
    setLastZaloMessage(message);

    if (isMobileLikeDevice()) {
      const shared = await shareViaDevice(message);
      if (shared) {
        setZaloHint("Đã mở menu chia sẻ của máy. Nếu thấy Zalo, chọn Zalo để gửi nhanh nội dung.");
        return;
      }
    }

    const copied = await copyToClipboard(message);
    setPendingZaloUrl(directUrl);
    setIsZaloGuideOpen(true);

    setZaloHint(
      copied
        ? "Đã copy nội dung. Bấm nút lớn để mở Zalo rồi dán vào khung chat."
        : "Chưa copy được tự động. Dùng nút copy lại nội dung trong popup rồi mở Zalo.",
    );
  }

  function openPendingZalo() {
    if (!pendingZaloUrl) {
      return;
    }

    window.open(pendingZaloUrl, "_blank", "noopener,noreferrer");
    setIsZaloGuideOpen(false);
    setZaloHint("Đã mở Zalo. Nếu ô chat chưa có sẵn nội dung, chỉ cần bấm Dán rồi gửi.");
  }

  async function copyLastZaloMessage() {
    if (!lastZaloMessage) {
      return;
    }

    const copied = await copyToClipboard(lastZaloMessage);
    setZaloHint(
      copied
        ? "Đã copy lại nội dung Zalo. Mở khung chat và bấm Dán để gửi."
        : "Chưa copy lại được tự động. Bạn có thể chép nội dung mẫu ngay bên dưới.",
    );
  }

  function handleToggleProduct(item: ProductSearchItem) {
    setSelectedProducts((current) => {
      const exists = current.some((selected) => selected.productCode === item.productCode && selected.brand === item.brand);
      if (exists) {
        return current.filter((selected) => !(selected.productCode === item.productCode && selected.brand === item.brand));
      }
      return [...current, item];
    });
  }

  function handleSetGroupSelection(items: ProductSearchItem[], shouldSelect: boolean) {
    setSelectedProducts((current) => {
      if (!shouldSelect) {
        return current.filter(
          (selected) => !items.some((item) => item.productCode === selected.productCode && item.brand === selected.brand),
        );
      }

      const next = [...current];
      for (const item of items) {
        const exists = next.some((selected) => selected.productCode === item.productCode && selected.brand === item.brand);
        if (!exists) {
          next.push(item);
        }
      }
      return next;
    });
  }

  function removeSelectedProduct(item: ProductSearchItem) {
    setSelectedProducts((current) =>
      current.filter((selected) => !(selected.productCode === item.productCode && selected.brand === item.brand)),
    );
  }

  function clearSelectedProducts() {
    setSelectedProducts([]);
  }

  function scrollToForm() {
    const formAnchor = document.getElementById("lead-form-anchor");
    formAnchor?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <MultiBrandProductLookup
        onToggleProduct={handleToggleProduct}
        onSetGroupSelection={handleSetGroupSelection}
        selectedProducts={selectedProducts}
        onClearSelections={clearSelectedProducts}
      />

      <section className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Bước gửi báo giá</p>
        <h3 className="mt-2 text-lg font-semibold">Tra mã - Chọn mã - Gửi theo 2 cách riêng</h3>
        <p className="mt-1 text-sm text-blue-800">
          Sau khi chọn mã, bạn có thể gửi nhanh qua Zalo hoặc điền form email kỹ thuật ở ngay bên dưới.
        </p>
      </section>

      {selectedProducts.length > 0 ? (
        <div className="sticky top-20 z-20 mt-4 hidden rounded-xl border border-blue-200 bg-white/95 p-3 shadow-sm backdrop-blur md:block">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Mã đang chuẩn bị gửi báo giá</p>
                <p className="text-sm font-semibold text-slate-900">Đã chọn {selectedProducts.length} mã</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={clearSelectedProducts}>
                  <X className="mr-2 size-4" /> Bỏ chọn
                </Button>
                <Button type="button" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => openQuickZalo(selectedProducts)}>
                  <MessageCircle className="mr-2 size-4" /> Copy + mở Zalo
                </Button>
                <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={scrollToForm}>
                  <ArrowDownCircle className="mr-2 size-4" /> Gửi qua email
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedProducts.map((item) => (
                <button
                  key={`${item.brand}-${item.productCode}`}
                  type="button"
                  onClick={() => removeSelectedProduct(item)}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-900 transition hover:bg-blue-100"
                >
                  <span>{item.productCode}</span>
                  <span className="text-blue-600">{item.brand}</span>
                  <X className="size-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {selectedProducts.length > 0 ? (
        <div className="fixed inset-x-2 bottom-20 z-40 rounded-[22px] border border-blue-300 bg-[#0b2f56]/96 p-4 text-white shadow-[0_20px_40px_-20px_rgba(8,37,70,0.92)] backdrop-blur md:hidden">
          <p className="text-[32px] leading-none font-semibold opacity-[0.02] absolute right-4 top-2 select-none">THL</p>
          <p className="relative text-[30px] font-semibold leading-none">Đã chọn {selectedProducts.length} sản phẩm</p>
          <div className="relative mt-3 flex gap-2 overflow-x-auto pb-1 pr-16">
            {selectedProducts.map((item) => (
              <button
                key={`${item.brand}-${item.productCode}`}
                type="button"
                onClick={() => removeSelectedProduct(item)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-200/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50"
              >
                <span>{item.productCode}</span>
                <X className="size-3.5" />
              </button>
            ))}
          </div>
          <div className="relative mt-3 flex flex-col gap-2.5 pr-16">
            <Button type="button" className="h-12 rounded-xl bg-emerald-600 text-base font-semibold hover:bg-emerald-700" onClick={() => openQuickZalo(selectedProducts)}>
              <MessageCircle className="mr-2 size-4" /> Copy + mở Zalo
            </Button>
            <Button type="button" className="h-12 rounded-xl bg-[#1e73c8] text-base font-semibold hover:bg-[#155ea9]" onClick={scrollToForm}>
              <ArrowDownCircle className="mr-2 size-4" /> Gửi qua email
            </Button>
            <Button type="button" variant="outline" className="h-12 rounded-xl border-blue-300 bg-white text-base font-semibold text-slate-500 hover:bg-slate-100" onClick={clearSelectedProducts}>
              <X className="mr-2 size-4" /> Xóa chọn
            </Button>
            <a
              href="tel:0902964685"
              className="absolute -right-2 top-1/2 inline-flex size-16 -translate-y-1/2 items-center justify-center rounded-full bg-[#0d63bf] text-white shadow-[0_10px_28px_-12px_rgba(13,99,191,0.85)]"
              aria-label="Gọi tư vấn"
            >
              <PhoneCall className="size-7" />
            </a>
          </div>
        </div>
      ) : null}

      {isZaloGuideOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-emerald-300 bg-white p-5 shadow-[0_28px_60px_-28px_rgba(2,6,23,0.55)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Bước gửi Zalo</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">Nội dung đã được copy</h3>
                <p className="mt-1 text-sm text-slate-600">Bước tiếp theo là mở Zalo. Khi vào khung chat, bạn chỉ cần bấm Dán rồi gửi.</p>
              </div>
              <Button type="button" variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-100" onClick={() => setIsZaloGuideOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-950">Luồng thao tác</p>
              <ol className="mt-2 space-y-1 text-sm text-emerald-900">
                <li>1. Nội dung báo giá đã được copy sẵn.</li>
                <li>2. Bấm nút bên dưới để mở Zalo.</li>
                <li>3. Trong ô chat Zalo, bấm Dán rồi gửi.</li>
              </ol>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button type="button" className="h-12 flex-1 bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700" onClick={openPendingZalo}>
                <MessageCircle className="mr-2 size-5" /> Đã copy, bấm mở Zalo
              </Button>
              <Button type="button" variant="outline" className="h-12 border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100" onClick={copyLastZaloMessage}>
                Copy lại nội dung
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {zaloHint ? <p className="mt-3 text-xs text-emerald-700">{zaloHint}</p> : null}

      {lastZaloMessage ? (
        <section className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Fallback Zalo</p>
              <p className="text-sm font-semibold">Zalo không hỗ trợ web tự dán sẵn vào ô chat</p>
              <p className="text-xs text-emerald-800">Nội dung đã được chuẩn bị sẵn. Nếu Zalo chưa hiện sẵn tin nhắn, bấm copy lại rồi dán vào khung chat.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100" onClick={copyLastZaloMessage}>
                Copy lại nội dung
              </Button>
              <Button type="button" className="bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => window.open(siteConfig.zaloLink, "_blank", "noopener,noreferrer")}>
                Mở lại Zalo
              </Button>
            </div>
          </div>

          <textarea
            readOnly
            value={lastZaloMessage}
            className="mt-3 min-h-32 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
          />
        </section>
      ) : null}

      <section id="lead-form-anchor" className="scroll-mt-24">
        <LeadForm
          prefillCodes={selectedProducts.map((item) => item.productCode).join(", ")}
          prefillProductGroup={primarySelectedProduct?.brand}
        />
      </section>
    </>
  );
}