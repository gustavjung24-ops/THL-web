"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AdminMailComposer() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function send() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message: messageBody, replyTo }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Không thể gửi mail admin.");
        return;
      }
      setMessage(data.message ?? "Đã gửi mail admin.");
      setSubject("");
      setMessageBody("");
    } catch {
      setError("Không thể gửi mail admin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Mail admin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mail-to">Người nhận</Label>
            <Input id="mail-to" value={to} onChange={(event) => setTo(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mail-reply-to">Reply-to</Label>
            <Input id="mail-reply-to" value={replyTo} onChange={(event) => setReplyTo(event.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mail-subject">Tiêu đề</Label>
          <Input id="mail-subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mail-message">Nội dung</Label>
          <Textarea id="mail-message" rows={10} value={messageBody} onChange={(event) => setMessageBody(event.target.value)} />
        </div>
        <Button type="button" className="bg-blue-800 hover:bg-blue-900" onClick={send} disabled={loading || !to || !subject || !messageBody}>
          {loading ? "Đang gửi..." : "Gửi mail"}
        </Button>
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p> : null}
      </CardContent>
    </Card>
  );
}