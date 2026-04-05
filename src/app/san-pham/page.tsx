import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { productGroups } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Sản phẩm",
  description:
    "Tổng hợp 6 nhóm sản phẩm phụ tùng công nghiệp: mô tả, ứng dụng phổ biến và nhóm khách hay mua.",
  path: "/san-pham",
});

export default function ProductsPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <SectionTitle
          eyebrow="Sản phẩm"
          title="6 nhóm sản phẩm chính đang hỗ trợ"
          description="Mỗi nhóm hàng có mô tả, ứng dụng phổ biến và nhóm khách hay mua để bạn dễ chọn hướng xử lý trước khi gửi báo giá."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {productGroups.map((group) => (
            <Card key={group.slug} id={group.slug} className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">{group.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-slate-700">{group.detailDescription}</p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ứng dụng phổ biến</p>
                  <ul className="mt-2 flex flex-wrap gap-2 text-sm text-slate-700">
                    {group.popularApplications.map((application) => (
                      <li key={application} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs sm:text-sm">
                        {application}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nhóm khách hay mua</p>
                  <ul className="mt-2 flex flex-wrap gap-2 text-sm text-slate-700">
                    {group.commonBuyers.map((buyer) => (
                      <li key={buyer} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs sm:text-sm">
                        {buyer}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button asChild className="bg-amber-800 hover:bg-amber-900">
                    <Link href="/tra-ma-bao-gia">
                      <Search className="mr-2 size-4" />
                      Gửi mã cần tìm
                    </Link>
                  </Button>
                  <Link href={`/san-pham/${group.slug}`} className="inline-flex items-center text-sm font-semibold text-amber-800 hover:text-amber-900">
                    Xem trang chi tiết
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
