import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Factory,
  Gauge,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { brandLogos } from "@/data/brand-logos";
import { industryApplications } from "@/data/industry-applications";
import { defaultProductVisual, productBenefitBullets, productVisuals } from "@/data/product-visuals";
import { heroContent, productGroups, supportProcess, trustBullets } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "NTN chủ đạo | Catalog vật tư công nghiệp cho nhà máy",
  description:
    "Catalog vật tư công nghiệp tập trung NTN, Koyo, Tsubaki và Soho. Hỗ trợ tra mã nhanh, đối chiếu ứng dụng và báo giá cho nhà máy.",
  path: "/",
});

const featuredProducts = productGroups.slice(0, 4);

const heroStats = [
  { value: "4", label: "thương hiệu chủ đạo" },
  { value: "5", label: "nhóm ứng dụng nhà máy" },
  { value: "24h", label: "ưu tiên phản hồi nhu cầu gấp" },
];

const whyChooseItems = [
  {
    title: "Tra mã theo cụm máy",
    description: trustBullets[0],
    Icon: Search,
  },
  {
    title: "Phản hồi rõ để mua hàng xử lý",
    description: trustBullets[1],
    Icon: Clock3,
  },
  {
    title: "Tư vấn theo vận hành thực tế",
    description: trustBullets[3],
    Icon: Gauge,
  },
  {
    title: "Giảm rủi ro đặt sai vật tư",
    description: "Tách rõ mã, kích thước, ứng dụng và phương án tương đương trước khi báo giá.",
    Icon: ShieldCheck,
  },
];

const capabilityItems = [
  {
    title: "NTN là trục chính",
    description: "Ưu tiên vòng bi Nhật NTN cho nhu cầu bảo trì cần mã rõ và độ ổn định cao.",
    Icon: Wrench,
  },
  {
    title: "Koyo và Tsubaki bổ sung",
    description: "Koyo cho vòng bi, gối đỡ; Tsubaki cho xích và cơ cấu truyền động.",
    Icon: BadgeCheck,
  },
  {
    title: "Soho theo mã thực tế",
    description: "Soho được tư vấn theo mã, vị trí lắp và nhu cầu thay thế cụ thể.",
    Icon: Factory,
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/backgrounds/he-sinh-thai-home.jpeg"
          aria-label="Không gian nhà máy và vật tư công nghiệp"
        >
          <source src="/videos/hero-industrial.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/58" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/78 to-slate-950/25" />

        <div className="page-shell relative flex min-h-[620px] flex-col justify-center gap-8 py-20 sm:min-h-[660px] lg:py-24">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100 backdrop-blur">
              {heroContent.eyebrow}
            </p>
            <h1 className="font-heading text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.5rem]">
              NTN chủ đạo cho nhu cầu bảo trì nhà máy
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-100 sm:text-lg">
              Tập trung NTN, Koyo, Tsubaki và Soho. Tra mã, đối chiếu ứng dụng và nhận tư vấn báo giá theo cụm máy thực tế.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild className="h-11 bg-cyan-500 px-5 text-slate-950 hover:bg-cyan-400">
                <Link href="/tra-ma-bao-gia">
                  <Search className="mr-2 size-4" />
                  Tra mã nhanh
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-white/30 bg-white/10 px-5 text-white hover:bg-white hover:text-slate-950">
                <Link href="/lien-he">
                  <MessageCircle className="mr-2 size-4" />
                  Liên hệ tư vấn
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
            {heroStats.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="font-heading text-2xl font-bold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-white">
        <div className="page-shell space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow="Nhóm sản phẩm chính"
              title="Nhóm sản phẩm chính theo thương hiệu"
              description="Phase này chỉ tập trung NTN, Koyo, Tsubaki và Soho. Các thương hiệu chưa có trong danh sách tạm thời không hiển thị trên web."
            />
            <Button asChild variant="outline" className="w-fit border-cyan-200 text-slate-800 hover:bg-cyan-50">
              <Link href="/san-pham">
                Xem toàn bộ danh mục
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((group) => {
              const visual = productVisuals[group.slug] ?? defaultProductVisual;

              return (
                <Link key={group.slug} href={`/san-pham/${group.slug}`} className="group">
                  <Card className="h-full rounded-lg border-slate-200 bg-white py-0 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-24px_rgba(8,47,73,0.35)]">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={visual.image}
                        alt={visual.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      <h3 className="absolute bottom-3 left-4 right-4 text-base font-bold text-white">{group.name}</h3>
                    </div>
                    <CardContent className="space-y-4 p-4">
                      <p className="text-sm leading-relaxed text-slate-600">{group.shortDescription}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.popularApplications.slice(0, 3).map((item) => (
                          <span key={item} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                            {item}
                          </span>
                        ))}
                      </div>
                      <p className="inline-flex items-center text-sm font-semibold text-cyan-700 group-hover:text-cyan-800">
                        Xem chi tiết
                        <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-0.5" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-block bg-slate-50">
        <div className="page-shell space-y-8">
          <SectionTitle
            eyebrow="Ứng dụng theo ngành"
            title="Chọn vật tư theo loại máy và điều kiện vận hành"
            description="Các trang ứng dụng giúp khoanh vùng nhóm vật tư thường dùng theo máy gỗ, CNC, ép nhựa, bơm quạt, động cơ và băng tải."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industryApplications.map((app) => (
              <Link key={app.slug} href={`/ung-dung/${app.slug}`} className="group">
                <Card className="h-full rounded-lg border-slate-200 bg-white py-0 transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-24px_rgba(15,23,42,0.55)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={app.image}
                      alt={app.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                    <h3 className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white">{app.name}</h3>
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <p className="text-sm leading-relaxed text-slate-600">{app.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {app.commonParts.slice(0, 3).map((part) => (
                        <span key={part} className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
                          {part}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-white">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionTitle
            eyebrow="Vì sao chọn chúng tôi"
              title="Tập trung vào đúng mã, đúng ứng dụng, đúng tiến độ"
            description="Không làm e-commerce dàn trải ở phase này. Website ưu tiên catalog theo thương hiệu, form tra mã nhanh và tuyến liên hệ tư vấn cho nhu cầu công nghiệp."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {whyChooseItems.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.6)]">
                <div className="mb-4 inline-flex rounded-md bg-cyan-50 p-2 text-cyan-700">
                  <item.Icon className="size-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-slate-950 text-white">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100">
                Thương hiệu / cam kết / năng lực
              </p>
              <h2 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">
                Hỗ trợ NTN, Koyo, Tsubaki, Soho cho tình huống thay thế trong nhà máy
              </h2>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                Tư vấn dựa trên mã cũ, hình ảnh tem, kích thước và điều kiện vận hành. Những thương hiệu ngoài danh sách sẽ được để lại cho phase sau.
              </p>
            </div>

            <div className="space-y-3">
              {supportProcess.slice(0, 4).map((step, index) => (
                <div key={step} className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-cyan-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {brandLogos.map((brand) => (
                <div key={brand.id} className="flex min-h-20 items-center justify-center rounded-lg border border-white/10 bg-white p-3">
                  <Image src={brand.src} alt={brand.alt} width={130} height={46} className="h-auto max-h-10 w-auto object-contain" />
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {capabilityItems.map((item) => (
                <div key={item.title} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <item.Icon className="size-5 text-cyan-300" />
                  <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white">
        <Image
          src="/images/backgrounds/final-cta-industrial.png"
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="pointer-events-none object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/70" />
        <div className="page-shell relative grid gap-6 py-14 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-800">
              <CheckCircle2 className="size-4" />
              Không cần đặt hàng online đầy đủ ở phase này
            </p>
            <h2 className="font-heading text-2xl font-bold text-slate-950 sm:text-3xl">
              Gửi mã, ảnh tem hoặc mô tả cụm máy để được tư vấn nhanh
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Đội ngũ tiếp nhận sẽ đối chiếu mã, xác nhận nhóm sản phẩm phù hợp và chuyển hướng báo giá theo nhu cầu thực tế của nhà máy.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {productBenefitBullets.map((item) => (
                <span key={item} className="rounded-md border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Button asChild className="h-11 bg-slate-950 px-5 hover:bg-slate-800">
              <Link href="/tra-ma-bao-gia">
                <Search className="mr-2 size-4" />
                Tra mã nhanh
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 border-cyan-200 bg-white text-cyan-800 hover:bg-cyan-50">
              <a href={siteConfig.phoneHref}>
                <PhoneCall className="mr-2 size-4" />
                Liên hệ tư vấn
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
