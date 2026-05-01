"use client";

import { useState } from "react";
import { ArrowDownCircle, X } from "lucide-react";
import type { ProductSearchItem } from "@/lib/product-search";
import { LeadForm } from "@/components/forms/lead-form";
import { MultiBrandProductLookup } from "@/components/forms/multi-brand-product-lookup";
import { Button } from "@/components/ui/button";

export function QuoteSearchAndForm() {
  const [selectedProduct, setSelectedProduct] = useState<ProductSearchItem | null>(null);

  function handlePickProduct(item: ProductSearchItem) {
    setSelectedProduct(item);

    const formAnchor = document.getElementById("lead-form-anchor");
    formAnchor?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearSelectedProduct() {
    setSelectedProduct(null);
  }

  function scrollToForm() {
    const formAnchor = document.getElementById("lead-form-anchor");
    formAnchor?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <MultiBrandProductLookup
        onPickProduct={handlePickProduct}
        selectedProduct={selectedProduct}
        onClearSelection={clearSelectedProduct}
      />

      {selectedProduct ? (
        <div className="sticky top-20 z-20 mt-4 rounded-xl border border-blue-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Mã đang chuẩn bị gửi báo giá</p>
              <p className="text-sm font-semibold text-slate-900">{selectedProduct.productCode} | {selectedProduct.brand} | {selectedProduct.group}</p>
              <p className="text-xs text-slate-600">{selectedProduct.displayName}</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={clearSelectedProduct}>
                <X className="mr-2 size-4" /> Bỏ chọn
              </Button>
              <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={scrollToForm}>
                <ArrowDownCircle className="mr-2 size-4" /> Điền form ngay
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <section id="lead-form-anchor" className="scroll-mt-24">
        <LeadForm
          prefillCode={selectedProduct?.productCode}
          prefillProductGroup={selectedProduct?.brand}
        />
      </section>
    </>
  );
}