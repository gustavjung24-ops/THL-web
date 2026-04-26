import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MessageCircle, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import { defaultProductVisual, productBenefitBullets, productVisuals } from "@/data/product-visuals";
import { productGroups } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

type ProductDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return productGroups.map((group) => ({ slug: group.slug }));
}

export function generateMetadata({ params }: ProductDetailPageProps) {
  const product = productGroups.find((group) => group.slug === params.slug);

  if (!product) {
    return createPageMetadata({
      title: "Sản phẩm",
      description: "Thông tin nhóm sản phẩm phụ tùng công nghiệp.",
      path: "/san-pham",
    });
  }

  return createPageMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/san-pham/${product.slug}`,
  });
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = productGroups.find((group) => group.slug === params.slug);

  if (!product) {
    notFound();
  }

  const visual = productVisuals[product.slug] ?? defaultProductVisual;

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Image
          src={visual.image}
          alt=""
          fill
          priority
          aria-hidden
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/45" />
        <div className="page-shell relative py-12 sm:py-16">
          <Link href="/san-pham" className="inline-flex items-center text-sm font-semibold text-cyan-100 hover:text-white">
            <ArrowLeft className="mr-1 size-4" />
            Tất cả sản phẩm
          </Link>

          <div className="mt-8 max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">Chi tiết nhóm sản phẩm</p>
            <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
            <p className="text-base leading-relaxed text-slate-100">{product.shortDescription}</p>
            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Button asChild className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                <Link href="/tra-ma-bao-gia">
                  <Search className="mr-2 size-4" />
                  Yêu cầu báo giá
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950">
                <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  Tư vấn kỹ thuật
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="page-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-heading text-xl font-bold text-slate-950">Mô tả ngắn</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{product.detailDescription}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="font-heading text-xl font-bold text-slate-950">Ứng dụng thường gặp</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.popularApplications.map((application) => (
                  <span key={application} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                    {application}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
              <h2 className="font-heading text-xl font-bold text-slate-950">Lợi ích / điểm mạnh</h2>
              <ul className="mt-4 space-y-3">
                {productBenefitBullets.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-700" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-heading text-xl font-bold text-slate-950">Nhóm khách thường cần</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.commonBuyers.map((buyer) => (
                  <span key={buyer} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                    {buyer}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-900 bg-slate-950 p-5 text-white">
              <h2 className="font-heading text-xl font-bold">Cần xác nhận mã hoặc tư vấn thay thế?</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Gửi mã cũ, ảnh tem, kích thước hoặc ảnh vị trí lắp để được đối chiếu trước khi báo giá.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                  <Link href="/tra-ma-bao-gia">
                    <Search className="mr-2 size-4" />
                    Gửi thông tin báo giá
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950">
                  <a href={siteConfig.phoneHref}>Gọi tư vấn kỹ thuật</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
