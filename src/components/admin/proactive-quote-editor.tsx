"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ManualQuotePayload = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  area: string;
  productGroup: string;
  requestedCode: string;
  application: string;
  quantity: string;
  priority: string;
  notes: string;
};

const initialPayload: ManualQuotePayload = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  area: "",
  productGroup: "",
  requestedCode: "",
  application: "",
  quantity: "",
  priority: "Binh thuong theo ke hoach",
  notes: "",
};

export function ProactiveQuoteEditor() {
  const router = useRouter();
  const [payload, setPayload] = useState<ManualQuotePayload>(initialPayload);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField<K extends keyof ManualQuotePayload>(key: K, value: ManualQuotePayload[K]) {
    setPayload((prev) => ({ ...prev, [key]: value }));
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/quotes/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        quote?: { id: string };
      };

      if (!response.ok || !data.ok || !data.quote) {
        setError(data.error ?? "Khong the tao bao gia chu dong.");
        return;
      }

      setMessage(`Da tao ${data.quote.id}. Dang chuyen sang man hinh chi tiet...`);
      router.push(`/admin/bao-gia/${data.quote.id}`);
      router.refresh();
    } catch {
      setError("Khong the tao bao gia chu dong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Nhap thong tin bao gia chu dong</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitForm} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Khach hang</Label>
              <Input id="fullName" value={payload.fullName} onChange={(event) => updateField("fullName", event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Dien thoai</Label>
              <Input id="phone" value={payload.phone} onChange={(event) => updateField("phone", event.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={payload.email} onChange={(event) => updateField("email", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Cong ty</Label>
              <Input id="company" value={payload.company} onChange={(event) => updateField("company", event.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="productGroup">Nhom vat tu</Label>
              <Input id="productGroup" value={payload.productGroup} onChange={(event) => updateField("productGroup", event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestedCode">Ma can bao gia</Label>
              <Input id="requestedCode" value={payload.requestedCode} onChange={(event) => updateField("requestedCode", event.target.value)} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="application">Ung dung / may</Label>
              <Input id="application" value={payload.application} onChange={(event) => updateField("application", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">So luong</Label>
              <Input id="quantity" value={payload.quantity} onChange={(event) => updateField("quantity", event.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">Khu vuc</Label>
              <Input id="area" value={payload.area} onChange={(event) => updateField("area", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Muc do uu tien</Label>
              <select
                id="priority"
                value={payload.priority}
                onChange={(event) => updateField("priority", event.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900"
              >
                <option value="Khan trong ngay">Khan trong ngay</option>
                <option value="Uu tien trong ca">Uu tien trong ca</option>
                <option value="Binh thuong theo ke hoach">Binh thuong theo ke hoach</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chu</Label>
            <Textarea id="notes" rows={4} value={payload.notes} onChange={(event) => updateField("notes", event.target.value)} />
          </div>

          <Button type="submit" className="bg-blue-800 hover:bg-blue-900" disabled={loading}>
            {loading ? "Dang tao..." : "Tao bao gia"}
          </Button>

          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {message ? <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
