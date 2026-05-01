import { NextResponse } from "next/server";
import { appendAdminAuditLog } from "@/lib/admin/audit-log";
import { requireAdminApiPermission } from "@/lib/admin/api-auth";
import { updateManagedAdminAccount } from "@/lib/admin/account-store";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiPermission(request, "users:manage");
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Payload cập nhật user không hợp lệ." }, { status: 400 });
  }

  const account = await updateManagedAdminAccount(params.id, {
    displayName: typeof body.displayName === "string" ? body.displayName : undefined,
    role: typeof body.role === "string" ? (body.role as never) : undefined,
    permissions: Array.isArray(body.permissions) ? (body.permissions.filter((item): item is string => typeof item === "string") as never) : undefined,
    active: typeof body.active === "boolean" ? body.active : undefined,
    password: typeof body.password === "string" ? body.password : undefined,
  });

  if (!account) {
    await appendAdminAuditLog({
      actorEmail: auth.session.email,
      action: "user.update_failed",
      targetId: params.id,
      message: "Khong tim thay user admin",
    });
    return NextResponse.json({ ok: false, error: "Không tìm thấy user admin." }, { status: 404 });
  }

  await appendAdminAuditLog({
    actorEmail: auth.session.email,
    action: "user.updated",
    targetId: account.id,
    message: "Cap nhat user admin",
    meta: {
      active: account.active,
      role: account.role,
    },
  });

  return NextResponse.json({ ok: true, account });
}