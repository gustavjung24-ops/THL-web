import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/data/posts";
import {
  customerSegments,
  heroContent,
  heroHighlights,
  leadFormIntro,
  productGroups,
  supportCards,
  supportProcess,
  supportProcessNote,
  trustBullets,
  whyContactDescription,
  whyContactBullets,
} from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/lead-form";
import { PrimaryCtaGroup } from "@/components/shared/primary-cta-group";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Hỗ trợ tra mã và báo giá vật tư truyền động cho nhà máy | Luan Phu Tung",
  description:
    "Kênh tư vấn vật tư kỹ thuật cho nhà máy và khách công nghiệp. Hỗ trợ tra mã, đối chiếu ứng dụng và báo giá vòng bi, gối đỡ, dây curoa, xích công nghiệp, phớt chặn dầu và mỡ bôi trơn.",
  path: "/",
});

const previewPosts = blogPosts.slice(0, 6);

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative border-b border-slate-200/80 pb-12 pt-10 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(146,64,14,0.12),_transparent_40%),radial-gradient(circle_at_15%_80%,_rgba(120,53,15,0.09),_transparent_35%)]" />
        <div className="page-shell relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              {heroContent.eyebrow}
            </p>
            <h1 className="font-heading text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[2.45rem]">
              {heroContent.heading}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{heroContent.subheading}</p>

            <PrimaryCtaGroup />

            <ul className="grid gap-3 pt-1 sm:grid-cols-2">
              {trustBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white/80 p-3 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-800" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="border-slate-200 bg-white/95 shadow-[0_16px_30px_-24px_rgba(120,53,15,0.45)]">
            <CardContent className="p-4 sm:p-5">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <Image
                  src="/images/hero-industrial.svg"
                  alt="Mô phỏng cụm truyền động trong nhà máy"
                  width={640}
                  height={420}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="mt-4 grid gap-3">
                {heroHighlights.map((highlight) => (
                  <div key={highlight} className="rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                    <p className="text-sm font-semibold text-slate-900">{highlight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Dịch vụ hỗ trợ"
            title="Những nhu cầu tôi đang hỗ trợ cho khách nhà máy"
            description="Nhiều nhà máy không thiếu nơi bán hàng, mà thiếu đầu mối tiếp nhận đủ nhanh, hiểu đúng ứng dụng và hỗ trợ đối chiếu mã rõ ràng giữa bộ phận kỹ thuật, bảo trì và mua hàng."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {supportCards.map((card) => (
              <Card key={card.title} className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-base text-slate-900">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-slate-50/70">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Nhóm sản phẩm"
            title="Nhóm vật tư đang hỗ trợ tư vấn cho nhà máy"
            description="Tập trung các nhóm vật tư truyền động và làm kín, phục vụ trực tiếp nhu cầu bảo trì, thay thế và vận hành thiết bị trong nhà máy."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productGroups.map((group) => (
              <Card key={group.slug} className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-base text-slate-900">{group.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-slate-600">{group.shortDescription}</p>
                  <Link
                    href={`/san-pham/${group.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-amber-800 hover:text-amber-900"
                  >
                    Xem chi tiết
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
            <Link href="/san-pham">Xem nhóm sản phẩm phù hợp cho nhà máy</Link>
          </Button>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Nhóm khách phù hợp"
            title="Phù hợp với những nhóm khách nào trong khu công nghiệp?"
            description="Ưu tiên các nhóm khách cần đầu mối tư vấn kỹ thuật rõ ràng, phản hồi nhanh và bám sát tiến độ vận hành thiết bị."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customerSegments.map((segment) => (
              <div key={segment.name} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{segment.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{segment.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-slate-50/70">
        <div className="page-shell grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionTitle
              eyebrow="Lý do liên hệ"
              title="Vì sao khách nhà máy thường cần một đầu mối tư vấn rõ ràng?"
              description="Các nhu cầu thay thế trong nhà máy thường đòi hỏi đối chiếu nhanh, đúng ứng dụng và phối hợp tốt giữa nhiều bộ phận nội bộ."
            />
            <ul className="space-y-3">
              {whyContactBullets.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-800" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
              {whyContactDescription}
            </p>
          </div>

          <div className="space-y-6">
            <SectionTitle
              eyebrow="Quy trình"
              title="Quy trình hỗ trợ nhanh cho nhu cầu thay thế và bảo trì"
              description="Quy trình ngắn gọn, bám kỹ thuật thực tế để giảm thời gian chờ đối chiếu và xử lý báo giá."
            />
            <div className="space-y-3">
              {supportProcess.map((step, index) => (
                <div key={step} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Bước {index + 1}</p>
                  <p className="mt-1 text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
              {supportProcessNote}
            </p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Tra mã / Báo giá"
            title="Gửi nhu cầu cần hỗ trợ"
            description={leadFormIntro}
          />
          <LeadForm />
        </div>
      </section>

      <section className="section-block bg-slate-50/70">
        <div className="page-shell space-y-7">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Kiến thức"
              title="Nội dung thực tế cho bảo trì, kỹ thuật và mua hàng"
              description="Tập trung các tình huống thường gặp khi đối chiếu mã, chọn phương án thay thế và xử lý báo giá trong môi trường công nghiệp."
            />
            <Button asChild variant="outline" className="hidden border-amber-200 text-amber-800 hover:bg-amber-100 sm:inline-flex">
              <Link href="/kien-thuc">Xem toàn bộ nội dung kỹ thuật</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewPosts.map((post) => (
              <Card key={post.slug} className="border-slate-200 bg-white">
                <CardContent className="space-y-3 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{post.category}</p>
                  <h3 className="text-base font-semibold leading-snug text-slate-900">{post.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                  <p className="text-xs text-slate-500">{formatDate(post.publishedAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button asChild variant="outline" className="w-full border-amber-200 text-amber-800 hover:bg-amber-100 sm:hidden">
            <Link href="/kien-thuc">Xem toàn bộ nội dung kỹ thuật</Link>
          </Button>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_32px_-24px_rgba(120,53,15,0.4)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <h2 className="font-heading text-2xl font-bold text-slate-900">Liên hệ nhanh để hỗ trợ tra mã và nhu cầu thay thế</h2>
              <p className="text-sm text-slate-600">
                Phù hợp cho các nhu cầu cần đối chiếu mã, xác nhận nhóm vật tư hoặc tiếp nhận báo giá theo tình huống thực tế trong nhà máy.
              </p>
              <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <PhoneCall className="size-4 text-amber-800" />
                  {siteConfig.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-amber-800" />
                  {siteConfig.zaloLabel}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-amber-800" />
                  {siteConfig.address}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-amber-800" />
                  {siteConfig.supportArea}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="size-4 text-amber-800" />
                  {siteConfig.responseTime}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
              <Button asChild className="bg-amber-800 hover:bg-amber-900">
                <a href={siteConfig.phoneHref}>
                  <PhoneCall className="mr-2 size-4" />
                  Gọi nhanh
                </a>
              </Button>
              <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
                <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  Chat Zalo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
