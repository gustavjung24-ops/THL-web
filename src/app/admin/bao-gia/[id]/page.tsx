import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { QuoteRequestEditor } from "@/components/admin/quote-request-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminCookieName, getFixedSuperAdminEmail, getVerifiedAdminSession, hasAdminPermission } from "@/lib/admin/auth";
import { getQuoteRequestById } from "@/lib/admin/quote-store";

export const dynamic = "force-dynamic";

export default async function AdminQuoteDetailPage({ params }: { params: { id: string } }) {
  const session = await getVerifiedAdminSession(cookies().get(getAdminCookieName())?.value);
  if (!session) {
    redirect(`/admin/login?next=/admin/bao-gia/${params.id}`);
  }
  if (!hasAdminPermission(session, "quotes:read")) {
    redirect("/admin");
  }

  const quote = await getQuoteRequestById(params.id);
  if (!quote) {
    notFound();
  }

  const canManageUsers = session.email === getFixedSuperAdminEmail() || hasAdminPermission(session, "users:manage");
  const canSendMail = hasAdminPermission(session, "mail:send");

  return (
    <AdminShell
      section="bao-gia"
      sessionEmail={session.email}
      title={quote.id}
      description="Chi tiết quote request và editor draft báo giá nội bộ."
      canManageUsers={canManageUsers}
      canSendMail={canSendMail}
      actions={
        <form action="/api/admin/auth/logout" method="post">
          <Button type="submit" variant="outline">Đăng xuất</Button>
        </form>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Thông tin yêu cầu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div>
              <p><span className="font-semibold text-slate-900">Khách hàng:</span> {quote.customer.fullName}</p>
              <p><span className="font-semibold text-slate-900">Email:</span> {quote.customer.email}</p>
              <p><span className="font-semibold text-slate-900">Điện thoại:</span> {quote.customer.phone}</p>
              <p><span className="font-semibold text-slate-900">Công ty:</span> {quote.customer.company}</p>
              <p><span className="font-semibold text-slate-900">Khu vực:</span> {quote.customer.area}</p>
            </div>
            <div>
              <p><span className="font-semibold text-slate-900">Nhóm vật tư:</span> {quote.productGroup}</p>
              <p><span className="font-semibold text-slate-900">Thiết bị / ứng dụng:</span> {quote.application || "Không cung cấp"}</p>
              <p><span className="font-semibold text-slate-900">Ưu tiên:</span> {quote.priority}</p>
              <p><span className="font-semibold text-slate-900">Ghi chú:</span> {quote.notes || "Không cung cấp"}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-900">Danh sách mã</p>
              {quote.items.map((item, index) => (
                <div key={`${item.code}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p><span className="font-semibold">Mã:</span> {item.code}</p>
                  <p><span className="font-semibold">Số lượng:</span> {item.quantity || "Chưa ghi"}</p>
                  <p><span className="font-semibold">Ghi chú item:</span> {item.note || "Không có"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <QuoteRequestEditor quote={quote} />
      </div>
    </AdminShell>
  );
}