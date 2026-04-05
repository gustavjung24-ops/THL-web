import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/data/posts";
import {
  customerSegments,
  heroContent,
  productGroups,
  supportCards,
  supportProcess,
  trustBullets,
  whyContactBullets,
} from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/lead-form";
import { PrimaryCtaGroup } from "@/components/shared/primary-cta-group";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Trang chủ",
  description:
    "Hỗ trợ tra mã, tư vấn và báo giá phụ tùng công nghiệp cho cửa hàng, gara, xưởng và khách công nghiệp nhỏ.",
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_40%),radial-gradient(circle_at_15%_80%,_rgba(239,68,68,0.11),_transparent_35%)]" />
        <div className="page-shell relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Kênh tư vấn cá nhân về phụ tùng công nghiệp
            </p>
            <h1 className="font-heading text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[2.45rem]">
              {heroContent.heading}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{heroContent.subheading}</p>

            <PrimaryCtaGroup />

            <ul className="grid gap-3 pt-1 sm:grid-cols-2">
              {trustBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white/80 p-3 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-700" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="border-slate-200 bg-white/95 shadow-[0_16px_30px_-24px_rgba(30,64,175,0.55)]">
            <CardContent className="p-4 sm:p-5">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <Image
                  src="/images/hero-industrial.svg"
                  alt="Placeholder phụ tùng công nghiệp"
                  width={640}
                  height={420}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-blue-50/70 p-3">
                  <p className="text-xs font-medium text-slate-600">Hướng xử lý nhanh</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Tiếp nhận nhu cầu trong ngày</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-red-50/70 p-3">
                  <p className="text-xs font-medium text-slate-600">Ưu tiên thực tế</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Bám mã, bám ứng dụng, bám tiến độ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Dịch vụ hỗ trợ"
            title="Tôi đang hỗ trợ những gì?"
            description="Tập trung vào xử lý nhu cầu thật ngoài thị trường: tra mã đúng, gợi ý đúng nhóm hàng và phản hồi nhanh để tránh chậm tiến độ."
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
            title="Nhóm sản phẩm đang hỗ trợ tư vấn"
            description="6 nhóm hàng tập trung theo nhu cầu thực tế của cửa hàng, gara, xưởng và khách công nghiệp nhỏ."
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
                    className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Xem chi tiết
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Nhóm khách phù hợp"
            title="Phù hợp với những nhóm khách nào?"
            description="Website tập trung hỗ trợ các nhóm khách cần xử lý nhu cầu nhanh và rõ mã hàng."
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
              title="Vì sao nên liên hệ tôi"
              description="Mục tiêu là giúp khách giảm sai mã, xử lý nhanh và dễ trao đổi theo tình huống thực tế."
            />
            <ul className="space-y-3">
              {whyContactBullets.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <SectionTitle
              eyebrow="Quy trình"
              title="Quy trình hỗ trợ đơn giản"
              description="Làm rõ thông tin từ đầu để tiết kiệm thời gian đối chiếu và báo giá."
            />
            <div className="space-y-3">
              {supportProcess.map((step, index) => (
                <div key={step} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Bước {index + 1}</p>
                  <p className="mt-1 text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Tra mã / Báo giá"
            title="Gửi nhu cầu cần hỗ trợ"
            description="Điền thông tin càng rõ thì tốc độ phản hồi và độ chính xác khi đối chiếu mã càng tốt."
          />
          <LeadForm />
        </div>
      </section>

      <section className="section-block bg-slate-50/70">
        <div className="page-shell space-y-7">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Kiến thức"
              title="Bài viết thực tế cho người mới và người đang làm"
              description="Nội dung ngắn gọn, dễ tra cứu nhanh trước khi gửi mã hoặc lên phương án thay thế."
            />
            <Button asChild variant="outline" className="hidden border-blue-200 text-blue-700 hover:bg-blue-50 sm:inline-flex">
              <Link href="/kien-thuc">Xem tất cả bài viết</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewPosts.map((post) => (
              <Card key={post.slug} className="border-slate-200 bg-white">
                <CardContent className="space-y-3 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{post.category}</p>
                  <h3 className="text-base font-semibold leading-snug text-slate-900">{post.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                  <p className="text-xs text-slate-500">{formatDate(post.publishedAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button asChild variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 sm:hidden">
            <Link href="/kien-thuc">Xem tất cả bài viết</Link>
          </Button>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_32px_-24px_rgba(30,64,175,0.55)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <h2 className="font-heading text-2xl font-bold text-slate-900">Thông tin liên hệ nhanh</h2>
              <p className="text-sm text-slate-600">Tra mã, tư vấn chọn nhóm hàng hoặc tiếp nhận nhu cầu báo giá theo tình huống thực tế.</p>
              <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <PhoneCall className="size-4 text-blue-700" />
                  {siteConfig.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-blue-700" />
                  {siteConfig.zaloLabel}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-blue-700" />
                  {siteConfig.supportArea}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="size-4 text-blue-700" />
                  {siteConfig.responseTime}
                </p>
              </div>
            </div>

            <PrimaryCtaGroup className="lg:flex-col lg:items-end" />
          </div>
        </div>
      </section>
    </div>
  );
}
