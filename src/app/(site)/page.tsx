import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Factory,
  Gauge,
  Globe,
  Handshake,
  Landmark,
  Layers3,
  MapPin,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Users,
  Wrench,
  Workflow,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/data/posts";
import { brandLogos, brandDescriptions, productGroupBrandMap } from "@/data/brand-logos";
import { productEntryCards, solutionEntryCards } from "@/data/home-entry-sections";
import {
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
  title: "Hỗ trợ tra mã và báo giá vật tư truyền động cho nhà máy | Truyền Động Công Nghiệp",
  description:
    "Kênh tư vấn vật tư kỹ thuật cho nhà máy và khách công nghiệp. Hỗ trợ tra mã, đối chiếu ứng dụng và báo giá vòng bi, gối đỡ, dây curoa, xích công nghiệp, phớt chặn dầu và mỡ bôi trơn.",
  path: "/",
});

const previewPosts = blogPosts.slice(0, 6);
const brandById = Object.fromEntries(brandLogos.map((brand) => [brand.id, brand]));

const trustBulletIcons = [ShieldCheck, Clock3, Users, Gauge];
const supportCardIcons = [Search, Gauge, Workflow, Handshake, ClipboardCheck, Layers3];
const supportProcessIcons = [MessageCircle, Search, BadgeCheck, ArrowRight];

const contactInfoItems = [
  {
    label: siteConfig.phone,
    Icon: PhoneCall,
  },
  {
    label: siteConfig.zaloLabel,
    Icon: MessageCircle,
  },
  {
    label: siteConfig.supportArea,
    Icon: Globe,
  },
  {
    label: siteConfig.responseTime,
    Icon: Clock3,
  },
];

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
      <section className="relative overflow-hidden border-b border-slate-200/80 pb-12 pt-10 sm:pt-14">
        <Image
          src="/images/backgrounds/he-sinh-thai-home.jpeg"
          alt=""
          fill
          aria-hidden
          className="pointer-events-none absolute inset-0 select-none object-cover object-top opacity-[0.50]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(146,64,14,0.06),_transparent_60%),radial-gradient(circle_at_15%_80%,_rgba(120,53,15,0.04),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-white/38 to-white/55" />
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
              {trustBullets.map((bullet, index) => {
                const Icon = trustBulletIcons[index] ?? CheckCircle2;

                return (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white/90 p-3 text-sm text-slate-700 shadow-[0_8px_20px_-22px_rgba(15,23,42,0.6)]"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-amber-800" />
                    <span>{bullet}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <Card className="border-slate-200 bg-white/95 shadow-[0_16px_30px_-24px_rgba(120,53,15,0.45)]">
            <CardContent className="p-4 sm:p-5">
              <div className="relative h-52 overflow-hidden rounded-lg border border-slate-200 sm:h-60">
                <Image
                  src="/images/backgrounds/chain-drive.jpg"
                  alt="Cụm truyền động xích và vòng bi trong nhà máy"
                  fill
                  className="object-cover"
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

      <section className="section-block border-b border-slate-100/80">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Dịch vụ hỗ trợ"
            title="Những nhu cầu tôi đang hỗ trợ cho khách nhà máy"
            description="Nhiều nhà máy không thiếu nơi bán hàng, mà thiếu đầu mối tiếp nhận đủ nhanh, hiểu đúng ứng dụng và hỗ trợ đối chiếu mã rõ ràng giữa bộ phận kỹ thuật, bảo trì và mua hàng."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {supportCards.map((card, index) => {
              const Icon = supportCardIcons[index] ?? CheckCircle2;

              return (
                <Card
                  key={card.title}
                  className="border-slate-200 bg-white shadow-[0_12px_28px_-24px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-22px_rgba(120,53,15,0.35)]"
                >
                  <CardHeader>
                    <CardTitle className="flex items-start gap-2 text-base text-slate-900">
                      <span className="mt-0.5 inline-flex rounded-md border border-amber-200 bg-amber-50 p-1.5">
                        <Icon className="size-4 text-amber-800" />
                      </span>
                      <span>{card.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-slate-600"><span className="font-medium text-slate-700">Khách gửi:</span> {card.clientSends}</p>
                    <p className="text-sm text-slate-600"><span className="font-medium text-slate-700">Hỗ trợ:</span> {card.weSupport}</p>
                    <p className="text-sm text-slate-600"><span className="font-medium text-amber-800">Kết quả:</span> {card.clientGets}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-block bg-white">
        <div className="page-shell space-y-7">
          <div className="max-w-3xl space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              <BadgeCheck className="size-3.5" />
              Đối chiếu thương hiệu
            </p>
            <h2 className="font-heading text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Thương hiệu đang phân phối và hỗ trợ đối chiếu
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Danh mục dưới đây được dùng để hỗ trợ đối chiếu mã theo ứng dụng thực tế, giúp bộ phận kỹ thuật và mua hàng trao đổi nhanh hơn khi cần thay thế.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {brandLogos.map((brand) => (
              <div
                key={brand.id}
                className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-[0_10px_20px_-22px_rgba(15,23,42,0.6)] transition hover:border-amber-200 hover:bg-white"
              >
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={120}
                  height={44}
                  className="h-auto max-h-9 w-auto object-contain opacity-70 grayscale transition duration-200 group-hover:opacity-100 group-hover:grayscale-0"
                />
                {brandDescriptions[brand.id] ? (
                  <p className="text-center text-[11px] leading-tight text-slate-500">{brandDescriptions[brand.id]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-slate-50/70">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Nhóm sản phẩm chính"
            title="Vật tư phục vụ bảo trì & thay thế trong nhà máy"
            description="Chọn nhóm sản phẩm để xem chi tiết, đối chiếu mã hoặc gửi nhu cầu báo giá."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productEntryCards.map((card) => (
              <Link key={card.slug} href={card.href} className="group">
                <Card className="h-full overflow-hidden border-slate-200 bg-white shadow-[0_10px_26px_-24px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-22px_rgba(120,53,15,0.35)]">
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                    <h3 className="absolute bottom-3 left-4 right-4 text-sm font-bold text-white">{card.title}</h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
                    <p className="mt-3 inline-flex items-center text-sm font-semibold text-amber-800 group-hover:text-amber-900">
                      {card.ctaLabel}
                      <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-0.5" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell space-y-7">
          <SectionTitle
            eyebrow="Theo vai trò"
            title="Anh/chị đang ở vai trò nào trong nhà máy?"
            description="Mỗi vai trò có nhu cầu khác nhau — chọn đúng giải pháp để được hỗ trợ phù hợp."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solutionEntryCards.map((card) => (
              <Link key={card.slug} href={card.href} className="group">
                <Card className="h-full overflow-hidden border-slate-200 bg-white shadow-[0_10px_26px_-24px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-22px_rgba(120,53,15,0.35)]">
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                    <h3 className="absolute bottom-3 left-4 right-4 text-sm font-bold text-white">{card.title}</h3>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
                    <p className="mt-3 inline-flex items-center text-sm font-semibold text-amber-800 group-hover:text-amber-900">
                      {card.ctaLabel}
                      <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-0.5" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
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
            {productGroups.map((group) => {
              const relatedBrands = (productGroupBrandMap[group.slug] ?? [])
                .map((brandId) => brandById[brandId])
                .filter(Boolean);

              return (
                <Card key={group.slug} className="border-slate-200 bg-white shadow-[0_10px_26px_-24px_rgba(15,23,42,0.6)]">
                  <CardHeader>
                    <CardTitle className="text-base text-slate-900">{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-slate-600">{group.shortDescription}</p>
                    {relatedBrands.length > 0 ? (
                      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                        {relatedBrands.map((brand) => (
                          <span
                            key={`${group.slug}-${brand.id}`}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1"
                          >
                            <Image src={brand.src} alt={brand.alt} width={44} height={16} className="h-3.5 w-auto object-contain" />
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Link
                      href={`/san-pham/${group.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-amber-800 hover:text-amber-900"
                    >
                      Xem chi tiết
                      <ArrowRight className="ml-1 size-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
            <Link href="/san-pham">Xem nhóm sản phẩm phù hợp cho nhà máy</Link>
          </Button>
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
              {supportProcess.map((step, index) => {
                const Icon = supportProcessIcons[index] ?? CheckCircle2;

                return (
                  <div key={step} className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.55)]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Bước {index + 1}</p>
                    <p className="mt-2 flex items-start gap-2 text-sm text-slate-700">
                      <Icon className="mt-0.5 size-4 shrink-0 text-amber-800" />
                      <span>{step}</span>
                    </p>
                  </div>
                );
              })}
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
        <div className="page-shell relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_32px_-24px_rgba(120,53,15,0.4)] sm:p-8">
          <Image
            src="/images/backgrounds/final-cta-industrial.png"
            alt=""
            fill
            aria-hidden
            className="pointer-events-none absolute inset-0 object-cover opacity-[0.50]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/42 to-amber-50/20" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <h2 className="font-heading text-2xl font-bold text-slate-900">Cần đối chiếu mã, xác nhận cụm thay thế hoặc báo giá gấp?</h2>
              <p className="text-sm text-slate-600">
                Gửi mã cũ, ảnh tem hoặc mô tả cụm máy – tiếp nhận và phản hồi trong ngày cho các nhu cầu ảnh hưởng tiến độ sản xuất.
              </p>
              <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                {contactInfoItems.map((item) => (
                  <p key={item.label} className="flex items-center gap-2">
                    <item.Icon className="size-4 text-amber-800" />
                    {item.label}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
              <Button asChild className="bg-amber-800 hover:bg-amber-900">
                <a href={siteConfig.phoneHref}>
                  <PhoneCall className="mr-2 size-4" />
                  Gọi ngay để đối chiếu mã
                </a>
              </Button>
              <Button asChild variant="outline" className="border-amber-200 text-amber-800 hover:bg-amber-100">
                <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  Gửi ảnh tem qua Zalo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
