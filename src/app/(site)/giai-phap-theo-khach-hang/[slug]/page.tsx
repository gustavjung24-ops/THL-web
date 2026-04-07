import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { customerRoles } from "@/data/site-content";
import { createPageMetadata } from "@/lib/seo";
import { PrimaryCtaGroup } from "@/components/shared/primary-cta-group";
import { SectionTitle } from "@/components/shared/section-title";

const roleSlugMap: Record<string, string> = {
  "bao-tri": "Bảo trì nhà máy",
  "ky-thuat": "Kỹ thuật thiết bị",
  "mua-hang": "Mua hàng kỹ thuật",
  "chu-xuong": "Chủ xưởng / Cơ điện",
};

export function generateStaticParams() {
  return Object.keys(roleSlugMap).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const roleName = roleSlugMap[params.slug];
  if (!roleName) return {};
  return createPageMetadata({
    title: `Giải pháp cho ${roleName}`,
    description: `Hỗ trợ vật tư truyền động dành cho ${roleName} trong nhà máy và khu công nghiệp.`,
    path: `/giai-phap-theo-khach-hang/${params.slug}`,
  });
}

export default function CustomerSolutionDetail({ params }: { params: { slug: string } }) {
  const roleName = roleSlugMap[params.slug];
  if (!roleName) notFound();

  const role = customerRoles.find((r) => r.role === roleName);
  if (!role) notFound();

  return (
    <div className="section-block">
      <div className="page-shell max-w-3xl space-y-8">
        <Link href="/giai-phap-theo-khach-hang" className="inline-flex items-center text-sm text-amber-800 hover:text-amber-900">
          <ArrowLeft className="mr-1 size-4" />
          Tất cả giải pháp
        </Link>

        <SectionTitle
          eyebrow="Giải pháp theo vai trò"
          title={role.role}
          description={role.problems}
        />

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Vấn đề thường gặp</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{role.problems}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-6">
            <h3 className="text-sm font-semibold text-amber-900">Hỗ trợ từ bên mình</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{role.support}</p>
          </div>
        </div>

        <PrimaryCtaGroup />
      </div>
    </div>
  );
}
