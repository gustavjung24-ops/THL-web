import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminUserManager } from "@/components/admin/admin-user-manager";
import { Button } from "@/components/ui/button";
import { getAdminCookieName, getFixedSuperAdminEmail, getVerifiedAdminSession, hasAdminPermission } from "@/lib/admin/auth";
import { listManagedAdminAccounts } from "@/lib/admin/account-store";

export const dynamic = "force-dynamic";

export default async function AdminPermissionsPage() {
  const session = await getVerifiedAdminSession(cookies().get(getAdminCookieName())?.value);
  if (!session) {
    redirect("/admin/login?next=/admin/phan-quyen");
  }
  const canManageUsers = session.email === getFixedSuperAdminEmail() || hasAdminPermission(session, "users:manage");
  if (!canManageUsers) {
    redirect("/admin");
  }

  const accounts = await listManagedAdminAccounts();

  return (
    <AdminShell
      section="phan-quyen"
      sessionEmail={session.email}
      title="Phân quyền admin"
      description="Tạo tài khoản cấp dưới và bật/tắt quyền vận hành nội bộ cho THL."
      canManageUsers
      canSendMail={hasAdminPermission(session, "mail:send")}
      actions={
        <form action="/api/admin/auth/logout" method="post">
          <Button type="submit" variant="outline">Đăng xuất</Button>
        </form>
      }
    >
      <AdminUserManager accounts={accounts} />
    </AdminShell>
  );
}