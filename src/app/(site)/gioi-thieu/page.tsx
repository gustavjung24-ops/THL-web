import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { customerSegments, productGroups } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { PrimaryCtaGroup } from "@/components/shared/primary-cta-group";
import { SectionTitle } from "@/components/shared/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Giới thiệu",
  description:
    "Giới thiệu kênh tư vấn cá nhân Truyền Động Công Nghiệp, tập trung hỗ trợ tra mã, chọn hàng và báo giá vật tư truyền động.",
  path: "/gioi-thieu",
});

export default function AboutPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-10">
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_-24px_rgba(30,64,175,0.45)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <SectionTitle
                eyebrow="Giới thiệu"
                title="Kênh tư vấn cá nhân về phụ tùng công nghiệp"
                description="Website này được xây dựng để hỗ trợ tra mã, tư vấn nhóm hàng và tiếp nhận nhu cầu báo giá nhanh. Đây là kênh làm việc cá nhân, không phải website chính thức của công ty."
              />
              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                Cách làm việc tập trung vào nhu cầu thực tế ngoài thị trường: nhận thông tin rõ, đối chiếu mã nhanh,
                gợi ý phương án phù hợp ứng dụng và dễ trao đổi qua điện thoại hoặc Zalo.
              </p>
              <PrimaryCtaGroup />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image
                src="/images/industry/industry-support.svg"
                alt="Placeholder khu vực tư vấn phụ tùng công nghiệp"
                width={1200}
                height={720}
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle
            eyebrow="Nhóm sản phẩm"
            title="Các nhóm hàng đang hỗ trợ"
            description="Tập trung 6 nhóm sản phẩm phổ biến, đủ để xử lý phần lớn nhu cầu thay thế và bảo trì."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productGroups.map((group) => (
              <Card key={group.slug} className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-base text-slate-900">{group.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-slate-600">{group.shortDescription}</p>
                  <Link href={`/san-pham/${group.slug}`} className="inline-flex items-center text-sm font-semibold text-blue-800 hover:text-blue-900">
                    Xem chi tiết
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle
            eyebrow="Nhóm khách"
            title="Những nhóm khách phù hợp"
            description="Phù hợp cho khách cần xử lý nhu cầu nhanh, trao đổi rõ ràng và dễ đối chiếu theo thông tin thực tế."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customerSegments.map((segment) => (
              <div key={segment.name} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{segment.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{segment.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
