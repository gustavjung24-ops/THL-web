import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminCookieName, getVerifiedAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  const session = await getVerifiedAdminSession(cookies().get(getAdminCookieName())?.value);
  if (session) {
    redirect(searchParams?.next || "/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <AdminLoginForm nextPath={searchParams?.next || "/admin"} />
    </div>
  );
}