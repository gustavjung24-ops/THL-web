"use client";

import { useState } from "react";
import type { ProductSearchItem } from "@/lib/product-search";
import { LeadForm } from "@/components/forms/lead-form";
import { MultiBrandProductLookup } from "@/components/forms/multi-brand-product-lookup";

export function QuoteSearchAndForm() {
  const [prefillCode, setPrefillCode] = useState("");
  const [prefillProductGroup, setPrefillProductGroup] = useState("");

  function handlePickProduct(item: ProductSearchItem) {
    setPrefillCode(item.productCode);
    setPrefillProductGroup(item.brand);

    const formAnchor = document.getElementById("lead-form-anchor");
    formAnchor?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <MultiBrandProductLookup onPickProduct={handlePickProduct} />
      <section id="lead-form-anchor" className="scroll-mt-24">
        <LeadForm prefillCode={prefillCode} prefillProductGroup={prefillProductGroup} />
      </section>
    </>
  );
}