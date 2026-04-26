import { MessageCircle, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";
import { quoteGuideBullets } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/lead-form";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata({
  title: "Tra mã / Báo giá",
  description:
    "Gửi mã, ảnh hoặc kích thước để được hỗ trợ tra mã và báo giá phụ tùng công nghiệp nhanh hơn.",
  path: "/tra-ma-bao-gia",
});

export default function QuotePage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-24px_rgba(30,64,175,0.45)] sm:p-8">
          <SectionTitle
            eyebrow="Tra mã / Báo giá"
            title="Gửi nhu cầu để hỗ trợ nhanh hơn"
            description="Bạn có thể gửi mã hàng, ảnh tem, ảnh mẫu cũ hoặc kích thước. Thông tin càng rõ thì đối chiếu càng nhanh."
          />

          <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
            {quoteGuideBullets.map((tip) => (
              <li key={tip} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                - {tip}
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
            <Button asChild variant="outline" className="border-blue-300 text-blue-900 hover:bg-blue-50">
              <a href={siteConfig.phoneHref}>
                <PhoneCall className="mr-2 size-4" />
                Gọi ngay
              </a>
            </Button>
          </div>
        </section>

        <section>
          <LeadForm />
        </section>
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
  );
}
