import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { solutionByCustomer } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Giải pháp theo khách hàng",
  description:
    "Giải pháp hỗ trợ theo từng nhóm khách: vấn đề thường gặp, cách hỗ trợ và nhóm sản phẩm phù hợp.",
  path: "/giai-phap-theo-khach-hang",
});

export default function SolutionsPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <SectionTitle
          eyebrow="Giải pháp theo khách hàng"
          title="Mỗi nhóm khách có một cách hỗ trợ khác nhau"
          description="Bám tình huống thực tế để gợi ý mã, nhóm hàng và hướng xử lý phù hợp tiến độ công việc."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {solutionByCustomer.map((item) => (
            <Card key={item.customer} className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">{item.customer}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">Thường gặp vấn đề gì?</p>
                  <p>{item.problems}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Tôi hỗ trợ gì?</p>
                  <p>{item.support}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Sản phẩm phù hợp</p>
                  <p>{item.products}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">Bạn có thể gửi mã cũ, ảnh hoặc kích thước để nhận hướng xử lý nhanh.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="bg-amber-800 hover:bg-amber-900">
                <Link href="/tra-ma-bao-gia">
                  <Search className="mr-2 size-4" />
                  Gửi mã cần tìm
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
                <Link href="/lien-he">
                  Liên hệ nhanh
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
