import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminCookieName, getFixedSuperAdminEmail, getVerifiedAdminSession, hasAdminPermission } from "@/lib/admin/auth";
import { type QuoteRequestStatus, listQuoteRequests } from "@/lib/admin/quote-store";

export const dynamic = "force-dynamic";

const statuses: Array<{ value: "ALL" | QuoteRequestStatus; label: string }> = [
  { value: "ALL", label: "Tất cả" },
  { value: "new", label: "new" },
  { value: "draft", label: "draft" },
  { value: "quoted", label: "quoted" },
  { value: "sent", label: "sent" },
  { value: "closed", label: "closed" },
];

function buildFilterUrl(status: string, q: string) {
  const params = new URLSearchParams();
  if (status && status !== "ALL") {
    params.set("status", status);
  }
  if (q.trim().length > 0) {
    params.set("q", q.trim());
  }
  const query = params.toString();
  return query ? `/admin/bao-gia?${query}` : "/admin/bao-gia";
}

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams?: { status?: string; q?: string };
}) {
  const session = await getVerifiedAdminSession(cookies().get(getAdminCookieName())?.value);
  if (!session) {
    redirect("/admin/login?next=/admin/bao-gia");
  }
  if (!hasAdminPermission(session, "quotes:read")) {
    redirect("/admin");
  }

  const allQuotes = await listQuoteRequests();
  const status = searchParams?.status && statuses.some((item) => item.value === searchParams.status)
    ? searchParams.status
    : "ALL";
  const q = searchParams?.q?.trim() ?? "";

  const counters = allQuotes.reduce(
    (acc, quote) => {
      acc.ALL += 1;
      acc[quote.status] += 1;
      return acc;
    },
    {
      ALL: 0,
      new: 0,
      draft: 0,
      quoted: 0,
      sent: 0,
      closed: 0,
    } as Record<"ALL" | QuoteRequestStatus, number>,
  );

  const quotes = allQuotes.filter((quote) => {
    const passStatus = status === "ALL" || quote.status === status;
    if (!passStatus) {
      return false;
    }
    if (!q) {
      return true;
    }

    const haystack = [
      quote.id,
      quote.customer.fullName,
      quote.customer.phone,
      quote.customer.email,
      quote.customer.company,
      quote.productGroup,
      quote.items.map((item) => item.code).join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q.toLowerCase());
  });
  const canManageUsers = session.email === getFixedSuperAdminEmail() || hasAdminPermission(session, "users:manage");
  const canSendMail = hasAdminPermission(session, "mail:send");

  return (
    <AdminShell
      section="bao-gia"
      sessionEmail={session.email}
      title="Báo giá RFQ"
      description="Đọc yêu cầu sinh ra từ website THL và xử lý nội bộ theo trạng thái báo giá."
      canManageUsers={canManageUsers}
      canSendMail={canSendMail}
      actions={
        <form action="/api/admin/auth/logout" method="post">
          <Button type="submit" variant="outline">Đăng xuất</Button>
        </form>
      }
    >
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Danh sách RFQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2">
              {statuses.map((item) => (
                <Link
                  key={item.value}
                  href={buildFilterUrl(item.value, q)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    status === item.value
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {item.label} ({counters[item.value]})
                </Link>
              ))}
            </div>

            <form method="get" action="/admin/bao-gia" className="grid gap-2 md:grid-cols-[1fr,auto]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Tìm theo mã RFQ, khách hàng, SĐT, email, mã vật tư"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900"
                />
                <input type="hidden" name="status" value={status} />
              </div>
              <Button type="submit" className="bg-blue-800 hover:bg-blue-900">Lọc danh sách</Button>
            </form>
          </div>

          {quotes.length === 0 ? <p className="text-sm text-slate-600">Chưa có quote request nào được tạo từ website.</p> : null}
          {quotes.map((quote) => (
            <div key={quote.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{quote.id}</p>
                <p className="text-sm text-slate-600">{quote.customer.fullName} | {quote.customer.phone} | {quote.productGroup}</p>
                <p className="text-xs text-slate-500">{quote.status} | {new Date(quote.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              <Button asChild className="bg-blue-800 hover:bg-blue-900">
                <Link href={`/admin/bao-gia/${quote.id}`}>Mở chi tiết</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminShell>
  );
}