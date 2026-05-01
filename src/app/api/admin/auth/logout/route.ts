import { NextResponse } from "next/server";
import { getAdminCookieName, getAdminCookieOptions, getAdminOtpCookieName } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const redirectUrl = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(getAdminCookieName(), "", { ...getAdminCookieOptions(0), maxAge: 0 });
  response.cookies.set(getAdminOtpCookieName(), "", { ...getAdminCookieOptions(0), maxAge: 0 });
  return response;
}