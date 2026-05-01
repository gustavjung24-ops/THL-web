"use client";

import { useState } from "react";
import type { QuoteRequestRecord, QuoteRequestStatus } from "@/lib/admin/quote-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type QuoteRequestEditorProps = {
  quote: QuoteRequestRecord;
};

const statusOptions: QuoteRequestStatus[] = ["new", "draft", "quoted", "sent", "closed"];

export function QuoteRequestEditor({ quote }: QuoteRequestEditorProps) {
  const [status, setStatus] = useState<QuoteRequestStatus>(quote.status);
  const [internalSummary, setInternalSummary] = useState(quote.internalSummary);
  const [draftMessage, setDraftMessage] = useState(quote.draftMessage);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalSummary, draftMessage }),
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
        <CardTitle>Editor báo giá nội bộ</CardTitle>
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
                {item}
              </option>
            ))}
          </select>
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