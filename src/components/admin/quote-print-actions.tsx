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

function buildPrintHtml(quote: QuoteRequestRecord, origin: string): string {
  const now = new Date().toLocaleString("vi-VN");
  const isManual = quote.sourceType === "manual";
  const headerTitle = isManual ? "PHIẾU BÁO GIÁ CHỦ ĐỘNG" : "PHIẾU XỬ LÝ RFQ WEBSITE";
  const headerSubTitle = isManual
    ? "Được tạo chủ động trong admin để phục vụ cơ hội bán hàng trực tiếp."
    : "Được tiếp nhận từ form tra mã/báo giá trên website. Cần đối chiếu và xử lý theo SLA RFQ.";
  const infoBlockTitle = isManual ? "Thông tin cơ hội" : "Thông tin yêu cầu RFQ";
  const noteLine = isManual
    ? "Ghi chú xử lý: đây là luồng báo giá chủ động, ưu tiên cập nhật theo dõi và kết quả thắng/trượt."
    : "Ghi chú xử lý: đây là luồng RFQ website, cần xác nhận trạng thái mới tiếp nhận/soạn báo giá/đã gửi/đã đóng.";
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
  const logoUrl = logoPath.startsWith("http") ? logoPath : `${origin}${logoPath}`;
  const companyName = siteConfig.brandName;
  const companyAddress = siteConfig.address;
  const companyPhone = siteConfig.phone;
  const companyDomain = siteConfig.domain;
  const companySupport = siteConfig.supportArea;
  const companyWebsiteUrl = companyDomain.startsWith("http") ? companyDomain : `https://${companyDomain}`;

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
      <img src="${escapeHtml(logoUrl)}" alt="Logo doanh nghiệp" />
    </div>
    <div>
      <p class="company-name">${escapeHtml(companyName)}</p>
      <p class="company-line">Website: ${escapeHtml(companyWebsiteUrl)} | Hotline: ${escapeHtml(companyPhone)}</p>
      <p class="company-line">Địa chỉ: ${escapeHtml(companyAddress)}</p>
      <p class="company-line">Phạm vi hỗ trợ: ${escapeHtml(companySupport)}</p>
    </div>
  </div>
  <h1>${headerTitle}</h1>
  <div class="meta">Mã: ${escapeHtml(quote.id)} | Nguồn: ${escapeHtml(getQuoteSourceLabel(quote.sourceType))} | In lúc: ${now}</div>
  <div class="meta">${headerSubTitle}</div>

  <div class="grid">
    <div class="block">
      <strong>Thông tin khách hàng</strong>
      <p>Khách hàng: ${escapeHtml(quote.customer.fullName)}</p>
      <p>Email: ${escapeHtml(quote.customer.email || "")}</p>
      <p>Điện thoại: ${escapeHtml(quote.customer.phone || "")}</p>
      <p>Công ty: ${escapeHtml(quote.customer.company || "")}</p>
      <p>Khu vực: ${escapeHtml(quote.customer.area || "")}</p>
    </div>
    <div class="block">
       <strong>${infoBlockTitle}</strong>
      <p>Nhóm vật tư: ${escapeHtml(quote.productGroup || "")}</p>
      <p>Ứng dụng: ${escapeHtml(quote.application || "")}</p>
      <p>Ưu tiên: ${escapeHtml(quote.priority || "")}</p>
      <p>Ghi chú: ${escapeHtml(quote.notes || "")}</p>
      <p>Trạng thái: ${escapeHtml(getQuoteStatusLabel(quote.status))}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Mã</th>
        <th>Tên hàng</th>
        <th>SL</th>
        <th>DV</th>
        <th>Giá nội bộ</th>
        <th>CK dòng</th>
        <th>Thành tiền</th>
        <th>Ghi chú</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="summary">
    <p>Tạm tính: ${formatVnd(quote.pricing.subtotal)} VND</p>
    <p>Chiết khấu tổng: ${quote.pricing.totalDiscountPercent}%</p>
    <p>VAT: ${quote.pricing.vatPercent}%</p>
    <p>Phí vận chuyển: ${formatVnd(quote.pricing.shippingFee)} VND</p>
    <p class="total">Tổng cộng: ${formatVnd(quote.pricing.grandTotal)} VND</p>
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
    popup.document.write(buildPrintHtml(quote, window.location.origin));
    popup.document.close();

    popup.focus();
    popup.print();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={openPrintDialog}>
        In báo giá
      </Button>
      <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={openPrintDialog}>
        Xuất PDF
      </Button>
    </div>
  );
}
