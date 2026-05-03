import { loadEnvConfig } from "@next/env";
import { NextRequest, NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { getAdminAccountByCredentialsFromStore } from "@/lib/admin/account-store";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminCookieOptions,
  getAdminSessionMaxAgeSeconds,
} from "@/lib/admin/auth";

// Force Node.js runtime and ensure env is loaded
export const runtime = "nodejs";
loadEnvConfig(process.cwd());

function normalizeNextPath(value: unknown) {
  return typeof value === "string" && value.startsWith("/") ? value : "/admin";
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    await appendAdminAuditLog({
      actorEmail: "anonymous",
      action: "auth.payload_invalid",
      message: "Payload login khong hop le",
    });
    return NextResponse.json({ ok: false, error: "Dữ liệu đăng nhập không hợp lệ." }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action : "login";
  const nextPath = normalizeNextPath(body.nextPath);
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (action !== "login") {
    return NextResponse.json(
      {
        ok: false,
        error: "OTP hiện đã tắt cho luồng admin nội bộ. Vui lòng đăng nhập bằng email + mật khẩu.",
      },
      { status: 400 },
    );
  }

  try {
    const account = await getAdminAccountByCredentialsFromStore(email, password);
    if (!account) {
      await appendAdminAuditLog({
        actorEmail: email.trim().toLowerCase() || "anonymous",
        action: "auth.otp_failed",
        message: "Sai thong tin dang nhap",
      });
      return NextResponse.json({ ok: false, error: "Email hoặc mật khẩu admin không đúng." }, { status: 401 });
    }

    const sessionToken = await createAdminSessionToken({
      email: account.email,
      role: account.role,
      permissions: account.permissions,
    });

    await appendAdminAuditLog({
      actorEmail: account.email,
      action: "auth.otp_verified",
      message: "Dang nhap admin thanh cong",
    });

    const response = NextResponse.json({ ok: true, step: "done", nextPath });
    response.cookies.set(getAdminCookieName(), sessionToken, getAdminCookieOptions(getAdminSessionMaxAgeSeconds()));
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("required")) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Thiếu cấu hình admin. Cần khai báo ADMIN_SECRET, ADMIN_OWNER_EMAIL và ADMIN_OWNER_PASSWORD trong môi trường chạy.",
        },
        { status: 500 },
      );
    }

    console.error("[admin/auth/login] unexpected error:", error);
    return NextResponse.json({ ok: false, error: "Không thể đăng nhập admin lúc này." }, { status: 500 });
  }
}