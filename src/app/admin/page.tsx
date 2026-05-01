import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FileSpreadsheet, Mail, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminCookieName, getFixedSuperAdminEmail, getVerifiedAdminSession, hasAdminPermission } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const cards = [
  { title: "Báo giá RFQ", description: "Đọc lead từ website, soạn draft và cập nhật trạng thái nội bộ.", href: "/admin/bao-gia", icon: FileSpreadsheet },
  { title: "Phân quyền", description: "Tạo và quản lý tài khoản admin cấp dưới.", href: "/admin/phan-quyen", icon: Users },
  { title: "Mail admin", description: "Gửi mail thủ công theo các luồng nội bộ và chăm sóc khách hàng.", href: "/admin/mail", icon: Mail },
] as const;

export default async function AdminIndexPage() {
  const session = await getVerifiedAdminSession(cookies().get(getAdminCookieName())?.value);
  if (!session) {
    redirect("/admin/login?next=/admin");
  }

  const canManageUsers = session.email === getFixedSuperAdminEmail() || hasAdminPermission(session, "users:manage");
  const canSendMail = hasAdminPermission(session, "mail:send");

  const visibleCards = cards.filter((card) => {
    if (card.href === "/admin/phan-quyen") return canManageUsers;
    if (card.href === "/admin/mail") return canSendMail;
    return true;
  });

  return (
    <AdminShell
      section="tong-quan"
      sessionEmail={session.email}
      title="Admin THL Công Nghiệp"
      description="Điểm vào quản trị cho báo giá, phân quyền và mail nội bộ theo mô hình SKF nhưng dùng dữ liệu THL."
      canManageUsers={canManageUsers}
      canSendMail={canSendMail}
      actions={
        <form action="/api/admin/auth/logout" method="post">
          <Button type="submit" variant="outline">Đăng xuất</Button>
        </form>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {visibleCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
                  <Icon className="size-5" />
                </div>
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-800 text-white hover:bg-blue-900">
                  <Link href={item.href}>Mở mục này</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}