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
  { title: "Báo giá RFQ", description: "Xử lý RFQ, soạn báo giá và cập nhật trạng thái đơn nội bộ.", href: "/admin/bao-gia", icon: FileSpreadsheet },
  { title: "Phân quyền", description: "Quản lý tài khoản cấp dưới và phân quyền vận hành trực tiếp trong admin.", href: "/admin/phan-quyen", icon: Users },
  { title: "Mail admin", description: "Gửi mail thủ công từ các sender đã cấu hình và theo dõi luồng phản hồi nội bộ.", href: "/admin/mail", icon: Mail },
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
      description="Điểm vào quản trị cho báo giá, phân quyền và mail nội bộ."
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

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Trạng thái hệ thống</CardTitle>
          <CardDescription>Những phần đã có và những phần đang được mở rộng trong admin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-base font-semibold text-slate-900">Đã có</p>
              <p className="mt-1 text-sm text-slate-600">Đăng nhập email + mật khẩu + OTP</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-base font-semibold text-slate-900">Đã có</p>
              <p className="mt-1 text-sm text-slate-600">Xử lý RFQ và báo giá nội bộ qua web admin</p>
            </div>
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <p className="text-base font-semibold text-amber-900">Cần hạ tầng bổ sung</p>
              <p className="mt-1 text-sm text-amber-800">Đọc inbox thật cần tích hợp Gmail API, IMAP hoặc webhook inbound riêng.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}