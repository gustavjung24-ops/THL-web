import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminMailComposer } from "@/components/admin/admin-mail-composer";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { getAdminCookieName, getFixedSuperAdminEmail, getVerifiedAdminSession, hasAdminPermission } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminMailPage() {
  const session = await getVerifiedAdminSession(cookies().get(getAdminCookieName())?.value);
  if (!session) {
    redirect("/admin/login?next=/admin/mail");
  }
  if (!hasAdminPermission(session, "mail:send")) {
    redirect("/admin");
  }

  const canManageUsers = session.email === getFixedSuperAdminEmail() || hasAdminPermission(session, "users:manage");

  return (
    <AdminShell
      section="mail"
      sessionEmail={session.email}
      title="Mail admin"
      description="Gửi mail thủ công theo luồng nội bộ hoặc follow-up khách hàng từ đội THL B2B."
      canManageUsers={canManageUsers}
      canSendMail
      actions={
        <form action="/api/admin/auth/logout" method="post">
          <Button type="submit" variant="outline">Đăng xuất</Button>
        </form>
      }
    >
      <AdminMailComposer />
    </AdminShell>
  );
}