import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProactiveQuoteEditor } from "@/components/admin/proactive-quote-editor";
import { Button } from "@/components/ui/button";
import { getAdminCookieName, getFixedSuperAdminEmail, getVerifiedAdminSession, hasAdminPermission } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminManualQuotePage() {
  const session = await getVerifiedAdminSession(cookies().get(getAdminCookieName())?.value);
  if (!session) {
    redirect("/admin/login?next=/admin/bao-gia/tao-moi");
  }
  if (!hasAdminPermission(session, "quotes:write")) {
    redirect("/admin/bao-gia");
  }

  const canManageUsers = session.email === getFixedSuperAdminEmail() || hasAdminPermission(session, "users:manage");
  const canSendMail = hasAdminPermission(session, "mail:send");

  return (
    <AdminShell
      section="bao-gia"
      sessionEmail={session.email}
      title="Tao bao gia chu dong"
      description="Nhap thong tin khach hang va ma vat tu de tao ban ghi bao gia thu cong trong admin."
      canManageUsers={canManageUsers}
      canSendMail={canSendMail}
      actions={
        <form action="/api/admin/auth/logout" method="post">
          <Button type="submit" variant="outline">Dang xuat</Button>
        </form>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-blue-800 hover:bg-blue-900">
            <Link href="/admin/bao-gia">Ve danh sach bao gia</Link>
          </Button>
        </div>
        <ProactiveQuoteEditor />
      </div>
    </AdminShell>
  );
}
