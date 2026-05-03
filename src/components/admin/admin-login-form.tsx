"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminLoginFormProps = {
  nextPath: string;
};

type LoginResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  step?: "done";
  nextPath?: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submitLogin() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password, nextPath }),
      });
      const data = (await response.json()) as LoginResponse;
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Không thể đăng nhập admin.");
        return;
      }
      window.location.href = data.nextPath || "/admin";
    } catch {
      setError("Không thể đăng nhập admin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="mb-2 inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Image src="/images/brands/ntn-logo.png" alt="NTN" width={90} height={28} className="h-7 w-auto" priority />
        </div>
        <CardTitle>Đăng nhập admin</CardTitle>
        <CardDescription>Email + mật khẩu theo mô hình vận hành nội bộ.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email admin</Label>
            <Input id="admin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} onBlur={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Mật khẩu</Label>
            <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} onBlur={(event) => setPassword(event.target.value)} />
          </div>
          <Button type="button" className="w-full bg-blue-800 hover:bg-blue-900" onClick={submitLogin} disabled={loading || !email || !password}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </div>

        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p> : null}
      </CardContent>
    </Card>
  );
}