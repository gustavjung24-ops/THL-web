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

  async function openQuickZalo(items: ProductSearchItem[]) {
    if (items.length === 0) {
      return;
    }

    const base = siteConfig.zaloLink?.trim() || "https://zalo.me/0902964685";
    const message = buildQuickZaloMessage(items);
    const separator = base.includes("?") ? "&" : "?";
    const directUrl = `${base}${separator}text=${encodeURIComponent(message)}`;
    const copied = await copyToClipboard(message);

    window.open(directUrl, "_blank", "noopener,noreferrer");
    setZaloHint(
      copied
        ? "Da sao chep noi dung va mo Zalo. Neu app khong tu dien, chi can dan va bam Gui."
        : "Da mo Zalo. Neu app khong tu dien, vui long sao chep noi dung mau va dan vao khung chat.",
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

    const formAnchor = document.getElementById("lead-form-anchor");
    formAnchor?.scrollIntoView({ behavior: "smooth", block: "start" });
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
                  <MessageCircle className="mr-2 size-4" /> Gửi nhanh Zalo
                </Button>
                <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={scrollToForm}>
                  <ArrowDownCircle className="mr-2 size-4" /> Điền form ngay
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
              <MessageCircle className="mr-2 size-4" /> Gửi nhanh Zalo
            </Button>
            <Button type="button" className="h-12 rounded-xl bg-[#1e73c8] text-base font-semibold hover:bg-[#155ea9]" onClick={scrollToForm}>
              <ArrowDownCircle className="mr-2 size-4" /> Chọn cách gửi báo giá
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

      {zaloHint ? <p className="mt-3 text-xs text-emerald-700">{zaloHint}</p> : null}

      <section id="lead-form-anchor" className="scroll-mt-24">
        <LeadForm
          prefillCodes={selectedProducts.map((item) => item.productCode).join(", ")}
          prefillProductGroup={primarySelectedProduct?.brand}
        />
      </section>
    </>
  );
}