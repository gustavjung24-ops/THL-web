import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import { defaultProductVisual, productBenefitBullets, productVisuals } from "@/data/product-visuals";
import { productGroups } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Danh mục NTN & Tsubaki chính hãng",
  description:
    "Danh mục vật tư truyền động công nghiệp của THL với hai thương hiệu chủ lực NTN, Tsubaki và các nhóm bổ trợ Koyo, NOK, Soho.",
  path: "/san-pham",
});

export default function ProductsPage() {
  return (
    <div className="bg-white">
      <section className="section-block border-b border-slate-100">
        <div className="page-shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionTitle
            eyebrow="Danh mục sản phẩm"
            title="NTN và Tsubaki là hai thương hiệu chủ lực"
            description="THL tổ chức danh mục theo hệ vật tư truyền động Nhật Bản chính hãng: NTN cho vòng bi và cụm quay, Tsubaki cho xích và cơ cấu truyền động; Koyo, NOK, Soho bổ trợ theo ứng dụng."
          />
          <Button asChild className="w-fit bg-blue-800 hover:bg-blue-900">
            <Link href="/tra-ma-bao-gia">
              <Search className="mr-2 size-4" />
              Gửi yêu cầu kỹ thuật
            </Link>
          </Button>
        </div>
      </section>

      <section className="section-block bg-slate-50">
        <div className="page-shell grid gap-5 lg:grid-cols-2">
          {productGroups.map((group) => {
            const visual = productVisuals[group.slug] ?? defaultProductVisual;
            const isCore = group.slug === "ntn" || group.slug === "tsubaki";

            return (
              <Card key={group.slug} id={group.slug} className="rounded-lg border-slate-200 bg-white py-0">
                <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                  <div className="relative min-h-52 overflow-hidden md:min-h-full">
                    <Image
                      src={visual.image}
                      alt={visual.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent md:bg-slate-950/10" />
                    <span className="absolute left-3 top-3 rounded-md border border-white/30 bg-white/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                      {isCore ? "Chủ lực" : "Bổ trợ"}
                    </span>
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <div className="space-y-2">
                      <h2 className="font-heading text-xl font-bold text-slate-950">{group.name}</h2>
                      <p className="text-sm leading-relaxed text-slate-600">{group.detailDescription}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ứng dụng phổ biến</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {group.popularApplications.slice(0, 5).map((application) => (
                          <span key={application} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                            {application}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      {productBenefitBullets.slice(0, 2).map((benefit) => (
                        <p key={benefit} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-800" />
                          {benefit}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50">
                        <Link href="/tra-ma-bao-gia">
                          <Search className="mr-2 size-4" />
                          Gửi mã cần tìm
                        </Link>
                      </Button>
                      <Link href={`/san-pham/${group.slug}`} className="inline-flex items-center text-sm font-semibold text-blue-800 hover:text-blue-900">
                        Xem chi tiết
                        <ArrowRight className="ml-1 size-4" />
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
