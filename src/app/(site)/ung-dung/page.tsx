import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industryApplications } from "@/data/industry-applications";
import { createPageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/shared/section-title";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createPageMetadata({
  title: "Ứng dụng theo ngành máy",
  description: "Nhóm vật tư truyền động phù hợp theo từng loại máy và ngành công nghiệp: máy gỗ, CNC, ép nhựa, bơm quạt, băng tải.",
  path: "/ung-dung",
});

export default function IndustryApplicationsPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <SectionTitle
          eyebrow="Ứng dụng"
          title="Vật tư truyền động theo ngành máy"
          description="Chọn ngành máy để xem nhóm vật tư thường dùng và nhu cầu thay thế phổ biến."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industryApplications.map((app) => (
            <Link key={app.slug} href={`/ung-dung/${app.slug}`} className="group">
              <Card className="h-full overflow-hidden border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={app.image}
                    alt={app.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 text-base font-bold text-white drop-shadow-sm">{app.name}</h3>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed text-slate-600">{app.description}</p>
                  <p className="mt-3 inline-flex items-center text-sm font-semibold text-amber-800 group-hover:text-amber-900">
                    Xem chi tiết
                    <ArrowRight className="ml-1 size-4" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
