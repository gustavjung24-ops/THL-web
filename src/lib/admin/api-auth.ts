import { NextResponse } from "next/server";
import { type AdminPermission, getAdminCookieName, getVerifiedAdminSession, hasAdminPermission } from "@/lib/admin/auth";

export async function requireAdminApiPermission(request: Request, permission?: AdminPermission) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${getAdminCookieName()}=`));

  const token = sessionCookie ? decodeURIComponent(sessionCookie.split("=").slice(1).join("=")) : null;
  const session = await getVerifiedAdminSession(token);
  if (!session) {
    return { session: null, error: NextResponse.json({ ok: false, error: "Chưa đăng nhập admin." }, { status: 401 }) };
  }

  if (permission && !hasAdminPermission(session, permission)) {
    return { session: null, error: NextResponse.json({ ok: false, error: "Không đủ quyền thực hiện thao tác này." }, { status: 403 }) };
  }

  return { session, error: null };
}