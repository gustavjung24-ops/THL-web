import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  Factory,
  Gauge,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { brandDescriptions, brandLogos } from "@/data/brand-logos";
import { industryApplications } from "@/data/industry-applications";
import { defaultProductVisual, productBenefitBullets, productVisuals } from "@/data/product-visuals";
import { productGroups, supportProcess, trustBullets } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "NTN chủ đạo | 5 thương hiệu vật tư truyền động",
  description:
    "Tập trung NTN, Koyo, Tsubaki, Soho và NOK cho nhu cầu bảo trì, thay thế vật tư truyền động trong nhà máy.",
  path: "/",
});

const featuredProducts = productGroups.slice(0, 5);

const heroStats = [
  { value: "5", label: "thương hiệu chính" },
  { value: "5", label: "nhóm hàng trọng tâm" },
  { value: "24h", label: "phản hồi ưu tiên" },
];

const heroFlowCards = [
  { label: "Chủ đạo", value: "NTN", helper: "vòng bi và cụm quay" },
  { label: "Bổ sung", value: "Koyo / Tsubaki", helper: "gối đỡ, xích truyền động" },
  { label: "Hoàn thiện", value: "Soho / NOK", helper: "vật tư phụ và phớt làm kín" },
];

const brandLogoById = new Map(brandLogos.map((brand) => [brand.id, brand]));

const brandThemes: Record<
  string,
  {
    accent: string;
    border: string;
    glow: string;
    logoSurface: string;
    text: string;
    chip: string;
  }
> = {
  ntn: {
    accent: "bg-[#008fd3]",
    border: "border-[#008fd3]/30",
    glow: "shadow-[0_22px_48px_-36px_rgba(0,143,211,0.9)]",
    logoSurface: "bg-[#e7f7ff]",
    text: "text-[#0078b8]",
    chip: "border-[#008fd3]/20 bg-[#e7f7ff] text-[#00699f]",
  },
  koyo: {
    accent: "bg-[#d71920]",
    border: "border-[#d71920]/25",
    glow: "shadow-[0_22px_48px_-36px_rgba(215,25,32,0.75)]",
    logoSurface: "bg-[#fff1f2]",
    text: "text-[#b6151b]",
    chip: "border-[#d71920]/20 bg-[#fff1f2] text-[#991b1b]",
  },
  tsubaki: {
    accent: "bg-[#00a0df]",
    border: "border-[#00a0df]/30",
    glow: "shadow-[0_22px_48px_-36px_rgba(0,160,223,0.78)]",
    logoSurface: "bg-[#e8f8ff]",
    text: "text-[#0078a8]",
    chip: "border-[#00a0df]/20 bg-[#e8f8ff] text-[#075985]",
  },
  soho: {
    accent: "bg-[#39a935]",
    border: "border-[#39a935]/25",
    glow: "shadow-[0_22px_48px_-36px_rgba(57,169,53,0.78)]",
    logoSurface: "bg-[#effbf0]",
    text: "text-[#237a2a]",
    chip: "border-[#39a935]/20 bg-[#effbf0] text-[#166534]",
  },
  nok: {
    accent: "bg-[#005bac]",
    border: "border-[#005bac]/30",
    glow: "shadow-[0_22px_48px_-36px_rgba(0,91,172,0.78)]",
    logoSurface: "bg-[#edf5ff]",
    text: "text-[#00519a]",
    chip: "border-[#005bac]/20 bg-[#edf5ff] text-[#1d4ed8]",
  },
};

const defaultBrandTheme = brandThemes.ntn;

function getBrandTheme(brandId: string) {
  return brandThemes[brandId] ?? defaultBrandTheme;
}

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
    title: "Soho / NOK theo mã thực tế",
    description: "Soho và NOK được tư vấn theo mã, vị trí lắp và nhu cầu thay thế cụ thể.",
    Icon: Factory,
  },
];

const processCards = [
  {
    title: "Gửi thông tin",
    description: "Mã cũ, ảnh tem, kích thước hoặc mô tả cụm máy đang cần thay.",
    Icon: MessageCircle,
  },
  {
    title: "Đối chiếu kỹ thuật",
    description: "Khoanh đúng nhóm NTN, Koyo, Tsubaki, Soho hoặc NOK theo điều kiện vận hành.",
    Icon: Search,
  },
  {
    title: "Chốt hướng báo giá",
    description: "Tách rõ mã, ứng dụng và ghi chú cần xác nhận để mua hàng xử lý nhanh.",
    Icon: ClipboardCheck,
  },
];

export default function Home() {
  const primaryProduct = featuredProducts[0];
  const secondaryProducts = featuredProducts.slice(1);
  const primaryBrandLogo = primaryProduct ? brandLogoById.get(primaryProduct.slug) : undefined;
  const primaryTheme = primaryProduct ? getBrandTheme(primaryProduct.slug) : defaultBrandTheme;

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
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/58" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/78 to-slate-950/25" />

        <div className="page-shell relative grid min-h-[620px] items-center gap-10 py-20 sm:min-h-[660px] lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100 backdrop-blur">
              5 thương hiệu trọng tâm cho nhà máy
            </p>
            <h1 className="font-heading text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.35rem]">
              NTN chủ đạo trong truyền động nhà máy
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-100 sm:text-lg">
              Cùng Koyo, Tsubaki, Soho và NOK cho bảo trì, thay thế và vận hành ổn định.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild className="h-11 bg-cyan-500 px-5 text-slate-950 hover:bg-cyan-400">
                <Link href="/san-pham">
                  <BadgeCheck className="mr-2 size-4" />
                  Xem danh mục
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

          <div className="space-y-4 lg:max-w-xl lg:justify-self-end">
            <div className="grid max-w-3xl gap-3 sm:grid-cols-3 lg:max-w-xl">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-[0_18px_40px_-32px_rgba(255,255,255,0.55)] backdrop-blur">
                  <p className="font-heading text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-sm leading-snug text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-lg border border-white/15 bg-white/12 p-5 shadow-[0_24px_70px_-38px_rgba(8,145,178,0.9)] backdrop-blur-md lg:block">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100">Danh mục thương hiệu</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-white">NTN chủ đạo, đủ 5 thương hiệu</h2>
                </div>
                <div className="rounded-md bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">5 brand</div>
              </div>

              <div className="mt-5 grid gap-3">
                {heroFlowCards.map((item) => (
                  <div key={item.label} className="grid grid-cols-[104px_1fr] gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">{item.label}</p>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.value}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{item.helper}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-white/15 bg-white p-3 shadow-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">5 thương hiệu chính</p>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {brandLogos.map((brand) => {
                    const theme = getBrandTheme(brand.id);

                    return (
                      <div key={brand.id} className={`relative flex h-14 items-center justify-center overflow-hidden rounded-md border ${theme.border} bg-white p-2`}>
                        <span className={`absolute inset-x-0 top-0 h-1 ${theme.accent}`} />
                        <Image
                          src={brand.src}
                          alt={brand.alt}
                          width={brand.id === "soho" ? 110 : 86}
                          height={brand.id === "soho" ? 46 : 34}
                          className={brand.id === "soho" ? "h-auto max-h-10 w-auto max-w-full object-contain" : "h-auto max-h-8 w-auto max-w-full object-contain"}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block bg-white">
        <div className="page-shell space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow="Danh mục trọng tâm"
              title="Năm thương hiệu chính cho bảo trì nhà máy"
              description="Tập trung vào các nhóm hàng thường cần đối chiếu khi thay thế: NTN cho vòng bi chủ đạo, Koyo cho cụm đỡ trục, Tsubaki cho xích truyền động, Soho cho vật tư bổ sung và NOK cho phớt làm kín."
            />
            <Button asChild variant="outline" className="w-fit border-cyan-200 text-slate-800 hover:bg-cyan-50">
              <Link href="/san-pham">
                Xem toàn bộ danh mục
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            {primaryProduct ? (
              <Link href={`/san-pham/${primaryProduct.slug}`} className="group">
                <Card className={`h-full overflow-hidden rounded-lg border bg-slate-950 py-0 text-white ${primaryTheme.border} ${primaryTheme.glow} transition hover:-translate-y-0.5`}>
                  <div className="grid min-h-full md:grid-cols-[1.05fr_0.95fr]">
                    <div className="relative min-h-72 overflow-hidden">
                      <Image
                        src={(productVisuals[primaryProduct.slug] ?? defaultProductVisual).image}
                        alt={(productVisuals[primaryProduct.slug] ?? defaultProductVisual).imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 560px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full border border-cyan-300/40 bg-cyan-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-50 backdrop-blur">
                        Chủ đạo
                      </span>
                      {primaryBrandLogo ? (
                        <div className="absolute bottom-4 left-4 flex h-16 w-36 items-center justify-center rounded-md border border-white/20 bg-white p-3 shadow-2xl">
                          <Image
                            src={primaryBrandLogo.src}
                            alt={primaryBrandLogo.alt}
                            width={128}
                            height={52}
                            className="h-auto max-h-11 w-auto max-w-full object-contain"
                          />
                        </div>
                      ) : null}
                    </div>
                    <CardContent className="flex flex-col justify-between gap-6 p-6">
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                          {brandDescriptions[primaryProduct.slug] ?? "Thương hiệu chủ đạo"}
                        </p>
                        <h3 className="font-heading text-3xl font-bold text-white">{primaryProduct.name}</h3>
                        <p className="text-sm leading-relaxed text-slate-300">{primaryProduct.detailDescription}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {primaryProduct.popularApplications.slice(0, 4).map((item) => (
                          <span key={item} className="rounded-md border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-slate-100">
                            {item}
                          </span>
                        ))}
                      </div>
                      <p className="inline-flex items-center text-sm font-semibold text-cyan-200 group-hover:text-cyan-100">
                        Xem {primaryProduct.name}
                        <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-0.5" />
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {secondaryProducts.map((group) => {
                const brand = brandLogoById.get(group.slug);
                const theme = getBrandTheme(group.slug);

                return (
                  <Link key={group.slug} href={`/san-pham/${group.slug}`} className="group">
                    <Card className={`h-full overflow-hidden rounded-lg border bg-white py-0 ${theme.border} ${theme.glow} transition hover:-translate-y-0.5`}>
                      <div className="grid min-h-full sm:grid-rows-[132px_1fr] lg:grid-cols-[156px_1fr] lg:grid-rows-none">
                        <div className={`relative flex min-h-36 items-center justify-center overflow-hidden ${theme.logoSurface} p-5`}>
                          <span className={`absolute inset-y-0 left-0 w-1.5 ${theme.accent}`} />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.9),transparent_42%)]" />
                          {brand ? (
                            <Image
                              src={brand.src}
                              alt={brand.alt}
                              width={group.slug === "soho" ? 160 : 132}
                              height={group.slug === "soho" ? 70 : 52}
                              className="relative h-auto max-h-16 w-auto max-w-full object-contain transition duration-300 group-hover:scale-105"
                            />
                          ) : null}
                        </div>
                        <CardContent className="space-y-3 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className={`text-[11px] font-semibold uppercase tracking-wide ${theme.text}`}>
                                {brandDescriptions[group.slug] ?? "Nhóm thương hiệu"}
                              </p>
                              <h3 className="mt-1 font-heading text-lg font-bold text-slate-950">{group.name}</h3>
                            </div>
                            <span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${theme.logoSurface} ${theme.text}`}>
                              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-slate-600">{group.shortDescription}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {group.popularApplications.slice(0, 2).map((item) => (
                              <span key={item} className={`rounded-md border px-2 py-1 text-xs ${theme.chip}`}>
                                {item}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block bg-slate-50">
        <div className="page-shell space-y-8">
          <SectionTitle
            eyebrow="Quy trình tra mã"
            title="Ba bước rõ để ra phương án thay thế"
            description="Từ mã cũ, ảnh tem hoặc mô tả cụm máy, thông tin được tách thành phần kỹ thuật và phần báo giá để bộ phận mua hàng xử lý nhanh."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {processCards.map((item, index) => (
              <div key={item.title} className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.65)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-md bg-blue-50 text-blue-800">
                    <item.Icon className="size-5" />
                  </div>
                  <span className="font-heading text-3xl font-bold text-slate-200">{index + 1}</span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                {index < processCards.length - 1 ? (
                  <ArrowRight className="absolute -right-5 top-1/2 hidden size-6 -translate-y-1/2 text-slate-300 lg:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block bg-white">
        <div className="page-shell space-y-8">
          <SectionTitle
            eyebrow="Ứng dụng theo ngành"
            title="Khoanh vùng vật tư theo loại máy và điều kiện vận hành"
            description="Các trang ứng dụng giúp xác định nhóm vật tư thường dùng cho máy gỗ, CNC, ép nhựa, bơm quạt, động cơ và băng tải trước khi chốt mã thay thế."
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
                          <span key={part} className="rounded-md bg-cyan-50 px-2 py-1 text-xs text-cyan-800">
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
            title="Đúng mã, đúng ứng dụng, đúng tiến độ bảo trì"
            description="Mỗi yêu cầu được xử lý theo mã, vị trí lắp và điều kiện vận hành để giảm rủi ro đặt sai vật tư."
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
        <div className="page-shell space-y-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100">
                  Năng lực hỗ trợ thương hiệu
                </p>
                <h2 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">
                  Một đầu mối cho NTN, Koyo, Tsubaki, Soho và NOK khi nhà máy cần thay thế
                </h2>
                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                  Tư vấn dựa trên mã cũ, hình ảnh tem, kích thước và điều kiện vận hành để xác định phương án phù hợp trước khi báo giá.
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
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {brandLogos.map((brand) => {
                  const theme = getBrandTheme(brand.id);

                  return (
                    <div key={brand.id} className={`relative flex min-h-20 items-center justify-center overflow-hidden rounded-lg border ${theme.border} bg-white p-3`}>
                      <span className={`absolute inset-x-0 top-0 h-1 ${theme.accent}`} />
                      <Image
                        src={brand.src}
                        alt={brand.alt}
                        width={brand.id === "soho" ? 180 : 130}
                        height={brand.id === "soho" ? 82 : 46}
                        className={brand.id === "soho" ? "h-auto max-h-14 w-auto max-w-full object-contain sm:max-h-16" : "h-auto max-h-10 w-auto max-w-full object-contain"}
                      />
                    </div>
                  );
                })}
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

          <div className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_46px_-34px_rgba(34,211,238,0.7)] sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl space-y-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                <CheckCircle2 className="size-4" />
                Ưu tiên tư vấn nhanh trước khi đặt hàng
              </p>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                Gửi mã, ảnh tem hoặc mô tả cụm máy để nhận phương án rõ
              </h2>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                Đội ngũ tiếp nhận sẽ đối chiếu mã, xác nhận nhóm sản phẩm phù hợp và chuyển hướng báo giá theo nhu cầu thực tế của nhà máy.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {productBenefitBullets.map((item) => (
                  <span key={item} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button asChild className="h-11 bg-cyan-400 px-5 text-slate-950 hover:bg-cyan-300">
                <Link href="/tra-ma-bao-gia">
                  <Search className="mr-2 size-4" />
                  Tra mã nhanh
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-cyan-300/40 bg-white/5 px-5 text-cyan-100 hover:bg-white hover:text-slate-950">
                <a href={siteConfig.phoneHref}>
                  <PhoneCall className="mr-2 size-4" />
                  Liên hệ tư vấn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
