import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { industryApplications } from "@/data/industry-applications";
import { createPageMetadata } from "@/lib/seo";
import { PrimaryCtaGroup } from "@/components/shared/primary-cta-group";
import { SectionTitle } from "@/components/shared/section-title";

export function generateStaticParams() {
  return industryApplications.map((app) => ({ slug: app.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const app = industryApplications.find((a) => a.slug === params.slug);
  if (!app) return {};
  return createPageMetadata({
    title: `Vật tư cho ${app.name}`,
    description: app.description,
    path: `/ung-dung/${params.slug}`,
  });
}

export default function IndustryApplicationDetail({ params }: { params: { slug: string } }) {
  const app = industryApplications.find((a) => a.slug === params.slug);
  if (!app) notFound();

  return (
    <div className="section-block">
      <div className="page-shell max-w-3xl space-y-8">
        <Link href="/ung-dung" className="inline-flex items-center text-sm text-amber-800 hover:text-amber-900">
          <ArrowLeft className="mr-1 size-4" />
          Tất cả ngành máy
        </Link>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={app.image} alt={app.imageAlt} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          <h1 className="absolute bottom-4 left-5 text-2xl font-bold text-white">{app.name}</h1>
        </div>

        <SectionTitle
          eyebrow="Ứng dụng"
          title={`Vật tư truyền động cho ${app.name}`}
          description={app.description}
        />

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900">Nhóm vật tư thường dùng</h3>
          <ul className="mt-3 space-y-2">
            {app.commonParts.map((part) => (
              <li key={part} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="size-1.5 rounded-full bg-amber-800" />
                {part}
              </li>
            ))}
          </ul>
        </div>

        <PrimaryCtaGroup />
      </div>
    </div>
  );
}
