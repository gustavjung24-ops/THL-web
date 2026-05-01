import { NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { buildMailBrandHeaderHtml, sendMail } from "@/lib/forms/mailer";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const auth = await requireAdminApiPermission(request, "mail:send");
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Payload mail admin không hợp lệ." }, { status: 400 });
  }

  const to = typeof body.to === "string" ? body.to.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const replyTo = typeof body.replyTo === "string" ? body.replyTo.trim() : undefined;
  if (!to || !subject || !message) {
    return NextResponse.json({ ok: false, error: "Cần nhập đầy đủ người nhận, tiêu đề và nội dung." }, { status: 400 });
  }

  try {
    await sendMail({
      to,
      subject,
      html: `${buildMailBrandHeaderHtml()}<div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</div>`,
      text: message,
      replyTo,
    });
  } catch (error) {
    await appendAdminAuditLog({
      actorEmail: auth.session.email,
      action: "mail.send_failed",
      message: "Gui mail admin that bai",
      meta: { to },
    });
    console.error("[admin/mail/send] send mail error:", error);
    return NextResponse.json({ ok: false, error: "Không thể gửi mail lúc này." }, { status: 500 });
  }

  await appendAdminAuditLog({
    actorEmail: auth.session.email,
    action: "mail.sent",
    message: "Gui mail admin thanh cong",
    meta: { to },
  });

  return NextResponse.json({ ok: true, message: "Đã gửi mail admin thành công." });
}