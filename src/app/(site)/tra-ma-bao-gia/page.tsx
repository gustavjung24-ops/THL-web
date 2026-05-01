import { MessageCircle, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";
import { quoteGuideBullets } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { QuoteSearchAndForm } from "@/components/forms/quote-search-and-form";
import { StructuredData } from "@/components/shared/structured-data";
import { createBreadcrumbSchema, createWebPageSchema } from "@/lib/schema";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata({
  title: "Tra mã & gửi yêu cầu kỹ thuật / báo giá",
  description:
    "Tra mã đa thương hiệu theo mã, biến thể, kích thước và từ khóa; sau đó gửi yêu cầu kỹ thuật/báo giá ngay trên cùng trang.",
  path: "/tra-ma-bao-gia",
});

export default function QuotePage() {
  const pageSchema = createWebPageSchema({
    title: "Tra mã & gửi yêu cầu kỹ thuật / báo giá",
    description:
      "Tra mã đa thương hiệu theo mã, biến thể, kích thước và từ khóa; sau đó gửi yêu cầu kỹ thuật/báo giá ngay trên cùng trang.",
    path: "/tra-ma-bao-gia",
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Tra mã & báo giá", path: "/tra-ma-bao-gia" },
  ]);

  return (
    <>
      <StructuredData data={[pageSchema, breadcrumbSchema]} />
      <div className="section-block">
        <div className="page-shell space-y-8">
        <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.45)] sm:p-8">
          <SectionTitle
            eyebrow="Tra mã đa thương hiệu"
            title="Tra mã theo nhãn hàng hoặc tra ngẫu nhiên rồi gửi báo giá"
            description="Hỗ trợ tra mã NTN, Koyo, Tsubaki, NOK, Mitsuba, Soho V-Belt theo mã chính, biến thể alias, kích thước và từ khóa; kết quả hiển thị gọn theo thương hiệu để chọn gửi báo giá nhanh."
          />

          <ul className="grid gap-2 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
            {quoteGuideBullets.map((tip) => (
              <li key={tip} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                {tip}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-100">
              <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 size-4" />
                Zalo kinh doanh
              </a>
            </Button>
            <Button asChild variant="outline" className="border-slate-300 text-slate-900 hover:bg-slate-50">
              <a href={siteConfig.phoneHref}>
                <PhoneCall className="mr-2 size-4" />
                Liên hệ B2B
              </a>
            </Button>
          </div>
        </section>

        <QuoteSearchAndForm />
        </div>

        <a
        href={siteConfig.zaloLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-4 z-30 hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-900 md:flex lg:bottom-6"
      >
        <MessageCircle className="size-4" />
        Zalo kinh doanh
        </a>
      </div>
    </>
  );
}
