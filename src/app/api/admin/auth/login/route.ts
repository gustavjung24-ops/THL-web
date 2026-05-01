import { NextRequest, NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { buildMailBrandHeaderHtml, sendMail } from "@/lib/forms/mailer";
import { getAdminAccountByCredentialsFromStore } from "@/lib/admin/account-store";
import {
  createAdminOtpStateToken,
  createAdminSessionToken,
  generateOtpCode,
  getAdminCookieName,
  getAdminCookieOptions,
  getAdminOtpCookieName,
  getAdminOtpMaxAgeSeconds,
  getAdminSessionMaxAgeSeconds,
  getVerifiedAdminOtpState,
} from "@/lib/admin/auth";

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

  const action = typeof body.action === "string" ? body.action : "";
  const nextPath = normalizeNextPath(body.nextPath);

  if (action === "request_otp") {
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const account = await getAdminAccountByCredentialsFromStore(email, password);
    if (!account) {
      await appendAdminAuditLog({
        actorEmail: email.trim().toLowerCase() || "anonymous",
        action: "auth.otp_failed",
        message: "Sai thong tin dang nhap",
      });
      return NextResponse.json({ ok: false, error: "Email hoặc mật khẩu admin không đúng." }, { status: 401 });
    }

    const code = generateOtpCode();
    const otpToken = await createAdminOtpStateToken({
      email: account.email,
      role: account.role,
      permissions: account.permissions,
      code,
    });

    try {
      await sendMail({
        to: account.email,
        subject: "Mã OTP đăng nhập admin THL",
        html: `${buildMailBrandHeaderHtml()}<p>Mã OTP đăng nhập admin của anh/chị là <strong style="font-size:20px;letter-spacing:0.3em;">${code}</strong>.</p><p>Mã có hiệu lực trong 5 phút.</p>`,
        text: `Ma OTP dang nhap admin THL: ${code}. Ma co hieu luc trong 5 phut.`,
      });
    } catch (error) {
      await appendAdminAuditLog({
        actorEmail: account.email,
        action: "auth.otp_mail_failed",
        message: "Gui OTP that bai",
      });
      console.error("[admin/auth/login] send otp error:", error);
      return NextResponse.json({ ok: false, error: "Không thể gửi OTP lúc này." }, { status: 500 });
    }

    await appendAdminAuditLog({
      actorEmail: account.email,
      action: "auth.otp_requested",
      message: "Da gui OTP dang nhap",
    });

    const response = NextResponse.json({
      ok: true,
      step: "otp",
      nextPath,
      message: "Đã tạo OTP cho tài khoản admin.",
    });
    response.cookies.set(getAdminOtpCookieName(), otpToken, getAdminCookieOptions(getAdminOtpMaxAgeSeconds()));
    return response;
  }

  if (action === "verify_otp") {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";
    const otpState = await getVerifiedAdminOtpState(request.cookies.get(getAdminOtpCookieName())?.value);
    if (!otpState || otpState.email !== email || otpState.code !== otp) {
      await appendAdminAuditLog({
        actorEmail: email || "anonymous",
        action: "auth.otp_failed",
        message: "OTP sai hoac het han",
      });
      return NextResponse.json({ ok: false, error: "OTP không hợp lệ hoặc đã hết hạn." }, { status: 401 });
    }

    const sessionToken = await createAdminSessionToken({
      email: otpState.email,
      role: otpState.role,
      permissions: otpState.permissions,
    });

    await appendAdminAuditLog({
      actorEmail: otpState.email,
      action: "auth.otp_verified",
      message: "Dang nhap admin thanh cong",
    });

    const response = NextResponse.json({ ok: true, step: "done", nextPath });
    response.cookies.set(getAdminCookieName(), sessionToken, getAdminCookieOptions(getAdminSessionMaxAgeSeconds()));
    response.cookies.set(getAdminOtpCookieName(), "", { ...getAdminCookieOptions(0), maxAge: 0 });
    return response;
  }

  await appendAdminAuditLog({
    actorEmail: "anonymous",
    action: "auth.unsupported_action",
    message: "Action login khong duoc ho tro",
  });
  return NextResponse.json({ ok: false, error: "Action đăng nhập không hỗ trợ." }, { status: 400 });
}