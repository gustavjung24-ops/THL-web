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
  step?: "otp" | "done";
  nextPath?: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function requestOtp() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_otp", email, password, nextPath }),
      });
      const data = (await response.json()) as LoginResponse;
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Không thể yêu cầu OTP.");
        return;
      }
      setStep("otp");
      setMessage(data.message ?? "OTP đã được gửi.");
    } catch {
      setError("Không thể yêu cầu OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_otp", email, otp, nextPath }),
      });
      const data = (await response.json()) as LoginResponse;
      if (!response.ok || !data.ok) {
        setError(data.error ?? "OTP không hợp lệ.");
        return;
      }
      window.location.href = data.nextPath || "/admin";
    } catch {
      setError("Không thể xác thực OTP.");
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
        <CardDescription>Email + mật khẩu + OTP theo mô hình vận hành nội bộ.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "credentials" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email admin</Label>
              <Input id="admin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} onBlur={(event) => setEmail(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Mật khẩu</Label>
              <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} onBlur={(event) => setPassword(event.target.value)} />
            </div>
            <Button type="button" className="w-full bg-blue-800 hover:bg-blue-900" onClick={requestOtp} disabled={loading || !email || !password}>
              {loading ? "Đang xử lý..." : "Nhận OTP"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-otp">Mã OTP</Label>
              <Input id="admin-otp" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="6 chữ số" />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("credentials")} disabled={loading}>
                Quay lại
              </Button>
              <Button type="button" className="flex-1 bg-blue-800 hover:bg-blue-900" onClick={verifyOtp} disabled={loading || otp.length < 6}>
                {loading ? "Đang xác thực..." : "Đăng nhập"}
              </Button>
            </div>
          </div>
        )}

        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p> : null}
      </CardContent>
    </Card>
  );
}