import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminCookieName, getVerifiedAdminSession } from "@/lib/admin/auth";

function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login" || pathname === "/api/admin/auth/login";
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (isAdminLoginPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getAdminCookieName())?.value;
  const session = await getVerifiedAdminSession(token);
  if (session) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ ok: false, error: "Chưa đăng nhập admin." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};