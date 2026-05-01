import { NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { createManagedAdminAccount } from "@/lib/admin/account-store";

export async function POST(request: Request) {
  const auth = await requireAdminApiPermission(request, "users:create");
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Payload tạo user admin không hợp lệ." }, { status: 400 });
  }

  try {
    const account = await createManagedAdminAccount({
      email: typeof body.email === "string" ? body.email : "",
      displayName: typeof body.displayName === "string" ? body.displayName : "",
      role: (typeof body.role === "string" ? body.role : "staff") as "manager" | "staff",
      permissions: Array.isArray(body.permissions) ? (body.permissions.filter((item): item is string => typeof item === "string") as never) : undefined,
      password: typeof body.password === "string" ? body.password : "",
    });

    await appendAdminAuditLog({
      actorEmail: auth.session.email,
      action: "user.created",
      targetId: account.id,
      message: "Tao user admin moi",
      meta: {
        createdEmail: account.email,
        role: account.role,
      },
    });

    return NextResponse.json({ ok: true, account });
  } catch (error) {
    await appendAdminAuditLog({
      actorEmail: auth.session.email,
      action: "user.update_failed",
      message: "Tao user admin that bai",
    });
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Không thể tạo tài khoản admin." }, { status: 400 });
  }
}