"use client";

import { useState } from "react";
import { MANUAL_WORKFLOW_STATUSES, RFQ_WORKFLOW_STATUSES, getQuoteStatusLabel, type QuoteRequestStatus } from "@/lib/admin/quote-workflow";
import type { QuoteRequestRecord } from "@/lib/admin/quote-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type QuoteRequestEditorProps = {
  quote: QuoteRequestRecord;
};

function toNumber(input: string): number {
  const parsed = Number(input);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(value));
}

export function QuoteRequestEditor({ quote }: QuoteRequestEditorProps) {
  const statusOptions: QuoteRequestStatus[] = quote.sourceType === "manual" ? MANUAL_WORKFLOW_STATUSES : RFQ_WORKFLOW_STATUSES;
  const [status, setStatus] = useState<QuoteRequestStatus>(statusOptions.includes(quote.status) ? quote.status : statusOptions[0]);
  const [internalSummary, setInternalSummary] = useState(quote.internalSummary);
  const [draftMessage, setDraftMessage] = useState(quote.draftMessage);
  const [items, setItems] = useState(quote.items);
  const [totalDiscountPercent, setTotalDiscountPercent] = useState(String(quote.pricing.totalDiscountPercent));
  const [vatPercent, setVatPercent] = useState(String(quote.pricing.vatPercent));
  const [shippingFee, setShippingFee] = useState(String(quote.pricing.shippingFee));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const subtotal = items.reduce((acc, item) => {
    const quantity = Math.max(0, toNumber(item.quantity));
    const unitPrice = Math.max(0, item.internalPrice);
    const discount = Math.min(100, Math.max(0, item.lineDiscountPercent));
    return acc + quantity * unitPrice * (1 - discount / 100);
  }, 0);
  const totalDiscount = Math.min(100, Math.max(0, toNumber(totalDiscountPercent)));
  const vat = Math.min(100, Math.max(0, toNumber(vatPercent)));
  const shipping = Math.max(0, toNumber(shippingFee));
  const discountedSubtotal = subtotal * (1 - totalDiscount / 100);
  const grandTotal = discountedSubtotal + discountedSubtotal * (vat / 100) + shipping;

  function updateItem(index: number, patch: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  }

  function addLineItem() {
    setItems((prev) => [
      ...prev,
      {
        code: "",
        name: "",
        quantity: "1",
        unit: "cái",
        internalPrice: 0,
        lineDiscountPercent: 0,
        note: "",
      },
    ]);
  }

  function removeLineItem(index: number) {
    setItems((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((_, idx) => idx !== index);
    });
  }

  async function save() {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const validItems = items
        .map((item) => ({
          ...item,
          code: item.code.trim(),
          name: item.name.trim(),
          unit: item.unit.trim() || "cái",
          note: item.note.trim(),
        }))
        .filter((item) => item.code.length > 0);

      if (validItems.length === 0) {
        setError("Cần ít nhất 1 line-item có mã sản phẩm.");
        setLoading(false);
        return;
      }

      const invalidQuantityIndex = validItems.findIndex((item) => toNumber(item.quantity) <= 0);
      if (invalidQuantityIndex >= 0) {
        setError(`Dòng ${invalidQuantityIndex + 1}: số lượng phải lớn hơn 0.`);
        setLoading(false);
        return;
      }

      const invalidPriceIndex = validItems.findIndex((item) => item.internalPrice < 0);
      if (invalidPriceIndex >= 0) {
        setError(`Dòng ${invalidPriceIndex + 1}: giá nội bộ phải lớn hơn hoặc bằng 0.`);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          internalSummary,
          draftMessage,
          items: validItems,
          totalDiscountPercent: totalDiscount,
          vatPercent: vat,
          shippingFee: shipping,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Không thể lưu draft báo giá.");
        return;
      }
      setMessage(data.message ?? "Đã cập nhật quote request.");
    } catch {
      setError("Không thể lưu draft báo giá.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Editor báo giá nội bộ ({quote.sourceType === "manual" ? "Manual" : "RFQ"})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quote-status">Trạng thái</Label>
          <select
            id="quote-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as QuoteRequestStatus)}
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900"
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {getQuoteStatusLabel(item)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <Label>Line-item báo giá</Label>
            <Button type="button" variant="outline" onClick={addLineItem}>Thêm dòng</Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={`${index}-${item.code}`} className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Mã sản phẩm</Label>
                    <Input value={item.code} onChange={(event) => updateItem(index, { code: event.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Tên hàng</Label>
                    <Input value={item.name} onChange={(event) => updateItem(index, { name: event.target.value })} />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div className="space-y-1">
                    <Label>Số lượng</Label>
                    <Input
                      type="number"
                      min="0.0001"
                      step="any"
                      value={item.quantity}
                      onChange={(event) => updateItem(index, { quantity: event.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Đơn vị</Label>
                    <Input value={item.unit} onChange={(event) => updateItem(index, { unit: event.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Giá nội bộ (VND)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={item.internalPrice}
                      onChange={(event) => updateItem(index, { internalPrice: Math.max(0, toNumber(event.target.value)) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Chiết khấu dòng (%)</Label>
                    <Input
                      type="number"
                      value={item.lineDiscountPercent}
                      onChange={(event) => updateItem(index, { lineDiscountPercent: Math.min(100, Math.max(0, toNumber(event.target.value))) })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Ghi chú dòng</Label>
                  <Textarea rows={2} value={item.note} onChange={(event) => updateItem(index, { note: event.target.value })} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <p>
                    Thành tiền dòng: {formatVnd(Math.max(0, toNumber(item.quantity)) * Math.max(0, item.internalPrice) * (1 - Math.min(100, Math.max(0, item.lineDiscountPercent)) / 100))} VND
                  </p>
                  <Button type="button" variant="outline" onClick={() => removeLineItem(index)} disabled={items.length <= 1}>
                    Xóa dòng
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <Label>Thông số tổng hợp</Label>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Chiết khấu tổng (%)</Label>
              <Input type="number" value={totalDiscountPercent} onChange={(event) => setTotalDiscountPercent(event.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>VAT (%)</Label>
              <Input type="number" value={vatPercent} onChange={(event) => setVatPercent(event.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Phí vận chuyển (VND)</Label>
              <Input type="number" value={shippingFee} onChange={(event) => setShippingFee(event.target.value)} />
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <p>Tạm tính: {formatVnd(subtotal)} VND</p>
            <p>Sau chiết khấu tổng: {formatVnd(discountedSubtotal)} VND</p>
            <p>VAT: {vat}%</p>
            <p className="font-semibold text-slate-900">Tổng cộng: {formatVnd(grandTotal)} VND</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="internal-summary">Tóm tắt nội bộ</Label>
          <Textarea id="internal-summary" rows={4} value={internalSummary} onChange={(event) => setInternalSummary(event.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="draft-message">Nội dung draft gửi khách</Label>
          <Textarea id="draft-message" rows={10} value={draftMessage} onChange={(event) => setDraftMessage(event.target.value)} />
        </div>

        <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={save} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu draft"}
        </Button>

        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p> : null}
      </CardContent>
    </Card>
  );
}