"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { QuoteRequestRecord } from "@/lib/admin/quote-store";
import { getQuoteSourceLabel, getQuoteStatusLabel } from "@/lib/admin/quote-workflow";

type QuotePrintActionsProps = {
  quote: QuoteRequestRecord;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(value));
}

function itemLineTotal(quantity: string, price: number, discountPercent: number): number {
  const qty = Number(quantity);
  const safeQty = Number.isFinite(qty) ? Math.max(0, qty) : 0;
  const safePrice = Math.max(0, price);
  const safeDiscount = Math.min(100, Math.max(0, discountPercent));
  return safeQty * safePrice * (1 - safeDiscount / 100);
}

function buildPrintHtml(quote: QuoteRequestRecord): string {
  const now = new Date().toLocaleString("vi-VN");
    const isManual = quote.sourceType === "manual";
    const headerTitle = isManual ? "PHIEU BAO GIA CHU DONG" : "PHIEU XU LY RFQ WEBSITE";
    const headerSubTitle = isManual
      ? "Duoc tao chu dong trong admin de phuc vu co hoi ban hang truc tiep."
      : "Duoc tiep nhan tu form tra ma/bao gia tren website. Can doi chieu va xu ly theo SLA RFQ.";
    const infoBlockTitle = isManual ? "Thong tin co hoi" : "Thong tin yeu cau RFQ";
    const noteLine = isManual
      ? "Ghi chu xu ly: day la luong manual quote, uu tien cap nhat follow-up va ket qua won/lost."
      : "Ghi chu xu ly: day la luong RFQ website, can xac nhan trang thai new/draft/quoted/sent/closed.";
  const itemRows = quote.items
    .map((item, index) => {
      const lineTotal = itemLineTotal(item.quantity, item.internalPrice, item.lineDiscountPercent);
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.code)}</td>
          <td>${escapeHtml(item.name || "")}</td>
          <td>${escapeHtml(item.quantity || "")}</td>
          <td>${escapeHtml(item.unit || "")}</td>
          <td>${formatVnd(item.internalPrice)}</td>
          <td>${item.lineDiscountPercent}%</td>
          <td>${formatVnd(lineTotal)}</td>
          <td>${escapeHtml(item.note || "")}</td>
        </tr>
      `;
    })
    .join("");

  const logoPath = siteConfig.defaultOgImage || "/images/branding/og-industrial.svg";
  const companyName = siteConfig.brandName;
  const companyAddress = siteConfig.address;
  const companyPhone = siteConfig.phone;
  const companyDomain = siteConfig.domain;
  const companySupport = siteConfig.supportArea;

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
   <title>${headerTitle} ${escapeHtml(quote.id)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #0f172a; margin: 24px; }
    h1 { margin: 0 0 8px 0; font-size: 24px; }
    .meta { margin-bottom: 12px; font-size: 13px; color: #334155; }
    .letterhead { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; margin-bottom: 12px; display: grid; grid-template-columns: 110px 1fr; gap: 12px; align-items: center; }
    .logo-box { width: 110px; height: 70px; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .logo-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .company-name { margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; }
    .company-line { margin: 2px 0; font-size: 13px; color: #334155; }
    .block { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; }
    .summary { margin-top: 12px; font-size: 13px; }
    .summary p { margin: 4px 0; }
    .total { font-weight: 700; font-size: 15px; }
  </style>
</head>
<body>
  <div class="letterhead">
    <div class="logo-box">
      <img src="${escapeHtml(logoPath)}" alt="Logo doanh nghiep" />
    </div>
    <div>
      <p class="company-name">${escapeHtml(companyName)}</p>
      <p class="company-line">Website: ${escapeHtml(companyDomain)} | Hotline: ${escapeHtml(companyPhone)}</p>
      <p class="company-line">Dia chi: ${escapeHtml(companyAddress)}</p>
      <p class="company-line">Pham vi ho tro: ${escapeHtml(companySupport)}</p>
    </div>
  </div>
   <h1>${headerTitle}</h1>
   <div class="meta">Ma: ${escapeHtml(quote.id)} | Nguon: ${escapeHtml(getQuoteSourceLabel(quote.sourceType))} | In luc: ${now}</div>
   <div class="meta">${headerSubTitle}</div>

  <div class="grid">
    <div class="block">
      <strong>Thong tin khach hang</strong>
      <p>Khach hang: ${escapeHtml(quote.customer.fullName)}</p>
      <p>Email: ${escapeHtml(quote.customer.email || "")}</p>
      <p>Dien thoai: ${escapeHtml(quote.customer.phone || "")}</p>
      <p>Cong ty: ${escapeHtml(quote.customer.company || "")}</p>
      <p>Khu vuc: ${escapeHtml(quote.customer.area || "")}</p>
    </div>
    <div class="block">
       <strong>${infoBlockTitle}</strong>
      <p>Nhom vat tu: ${escapeHtml(quote.productGroup || "")}</p>
      <p>Ung dung: ${escapeHtml(quote.application || "")}</p>
      <p>Uu tien: ${escapeHtml(quote.priority || "")}</p>
      <p>Ghi chu: ${escapeHtml(quote.notes || "")}</p>
       <p>Trang thai: ${escapeHtml(getQuoteStatusLabel(quote.status))}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Ma</th>
        <th>Ten hang</th>
        <th>SL</th>
        <th>DV</th>
        <th>Gia noi bo</th>
        <th>CK dong</th>
        <th>Thanh tien</th>
        <th>Ghi chu</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="summary">
    <p>Tam tinh: ${formatVnd(quote.pricing.subtotal)} VND</p>
    <p>Chiet khau tong: ${quote.pricing.totalDiscountPercent}%</p>
    <p>VAT: ${quote.pricing.vatPercent}%</p>
    <p>Phi van chuyen: ${formatVnd(quote.pricing.shippingFee)} VND</p>
    <p class="total">Tong cong: ${formatVnd(quote.pricing.grandTotal)} VND</p>
     <p>${noteLine}</p>
  </div>
</body>
</html>
`;
}

export function QuotePrintActions({ quote }: QuotePrintActionsProps) {
  function openPrintDialog() {
    const popup = window.open("", "_blank", "noopener,noreferrer,width=1000,height=800");
    if (!popup) {
      return;
    }

    popup.document.open();
    popup.document.write(buildPrintHtml(quote));
    popup.document.close();

    popup.focus();
    popup.print();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={openPrintDialog}>
        In bao gia
      </Button>
      <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={openPrintDialog}>
        Xuat PDF
      </Button>
    </div>
  );
}
