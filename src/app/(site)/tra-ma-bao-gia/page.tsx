import { MessageCircle, Search } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
import { QuoteSearchAndForm } from "@/components/forms/quote-search-and-form";
import { StructuredData } from "@/components/shared/structured-data";
import { createBreadcrumbSchema, createWebPageSchema } from "@/lib/schema";
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
        <section className="space-y-4 rounded-2xl border border-blue-300 bg-gradient-to-r from-[#0e4f96] via-[#135ea9] to-[#0f4f95] p-6 text-white shadow-[0_18px_40px_-22px_rgba(15,52,95,0.75)] sm:p-8">
          <span className="inline-flex rounded-full border border-blue-200/40 bg-blue-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            THL B2B Tool
          </span>
          <h1 className="text-3xl font-bold leading-tight">Tra Mã và Báo Giá</h1>
          <p className="max-w-2xl text-sm text-blue-100 sm:text-base">Tra mã theo mã hoặc kích thước, sau đó chọn cách gửi báo giá theo kênh phù hợp.</p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="bg-white/10 text-white hover:bg-white/20">
              <a href="#lookup-tool">
                <Search className="mr-2 size-4" />
                Tra mã ngay
              </a>
            </Button>
            <Button asChild className="bg-red-600 text-white hover:bg-red-700">
              <a href="#lead-form-anchor">
                <MessageCircle className="mr-2 size-4" />
                Gửi báo giá
              </a>
            </Button>
          </div>
        </section>

        <section id="lookup-tool">
          <QuoteSearchAndForm />
        </section>
        </div>
      </div>
    </>
  );
}
