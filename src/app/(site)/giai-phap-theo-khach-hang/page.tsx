import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { brandLogos, customerSolutionBrandMap } from "@/data/brand-logos";
import { solutionByCustomer } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const brandById = Object.fromEntries(brandLogos.map((brand) => [brand.id, brand]));

export const metadata = createPageMetadata({
  title: "Giải pháp theo khách hàng",
  description:
    "Giải pháp vật tư truyền động theo từng vai trò trong nhà máy: bảo trì, kỹ thuật, mua hàng và chủ xưởng, ưu tiên NTN và Tsubaki.",
  path: "/giai-phap-theo-khach-hang",
});

export default function SolutionsPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <SectionTitle
          eyebrow="Giải pháp theo khách hàng"
          title="Một quy trình rõ cho từng bộ phận trong nhà máy"
          description="THL tiếp nhận bối cảnh vận hành, tách thông tin kỹ thuật và đề xuất nhóm vật tư phù hợp để bảo trì, kỹ thuật và mua hàng cùng kiểm tra nhanh."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {solutionByCustomer.map((item) => {
            const relatedBrands = (customerSolutionBrandMap[item.customer] ?? [])
              .map((brandId) => brandById[brandId])
              .filter(Boolean);

            return (
              <Card key={item.customer} className="rounded-lg border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">{item.customer}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-relaxed text-slate-700">
                  <div>
                    <p className="font-semibold text-slate-900">Tình huống thường gặp</p>
                    <p>{item.problems}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">THL hỗ trợ</p>
                    <p>{item.support}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Nhóm vật tư phù hợp</p>
                    <p>{item.products}</p>
                  </div>
                  {relatedBrands.length > 0 ? (
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Thương hiệu liên quan
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedBrands.map((brand) => (
                          <span key={`${item.customer}-${brand.id}`} className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                            <Image src={brand.src} alt={brand.alt} width={52} height={18} className="h-3.5 w-auto object-contain" />
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">
              Gửi mã cũ, ảnh tem, kích thước hoặc mô tả cụm máy để THL khoanh nhóm NTN, Tsubaki hoặc vật tư bổ trợ phù hợp.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="bg-blue-800 hover:bg-blue-900">
                <Link href="/tra-ma-bao-gia">
                  <ClipboardCheck className="mr-2 size-4" />
                  Gửi yêu cầu kỹ thuật
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-100">
                <Link href="/lien-he">
                  Liên hệ THL B2B
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
