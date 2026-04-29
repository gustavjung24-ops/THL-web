import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { MessageCircle, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";
import {
  recruitmentApplyGuide,
  recruitmentEnvironment,
  recruitmentHero,
  recruitmentJobs,
} from "@/data/recruitment-content";
import { createPageMetadata } from "@/lib/seo";
import { RecruitmentForm } from "@/components/forms/recruitment-form";
import { RecruitmentJobsPanel } from "@/components/recruitment/recruitment-jobs-panel";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata({
  title: "Tuyển dụng THL | Gia nhập đội ngũ B2B vật tư truyền động",
  description:
    "THL tuyển dụng các vị trí kinh doanh, kế toán, logistics, kho và giao nhận trong lĩnh vực vật tư truyền động công nghiệp. Xem vị trí đang tuyển và ứng tuyển trực tiếp.",
  path: "/tuyen-dung",
});

export default function RecruitmentPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-10">
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 px-6 py-8 text-slate-100 shadow-[0_24px_58px_-42px_rgba(15,23,42,0.95)] sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <p className="inline-flex rounded-full border border-blue-200/40 bg-blue-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100">
                Tuyển dụng THL
              </p>
              <h1 className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.15rem]">
                {recruitmentHero.title}
              </h1>
              <p className="text-sm leading-7 text-slate-200 sm:text-base">{recruitmentHero.subTitle}</p>
              <p className="text-sm leading-7 text-slate-300">{recruitmentHero.description}</p>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button asChild className="h-10 bg-amber-300 px-4 text-slate-900 hover:bg-amber-200">
                  <Link href="#vi-tri-tuyen-dung">Xem vị trí đang tuyển</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 border-slate-300/70 bg-transparent px-4 text-white hover:bg-slate-50/10 hover:text-white"
                >
                  <Link href="#ung-tuyen">Ứng tuyển ngay</Link>
                </Button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[560px]">
              <div className="overflow-hidden rounded-xl border border-slate-200/30 bg-white/5 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.9)]">
                <Image
                  src={recruitmentHero.image}
                  alt={recruitmentHero.imageAlt}
                  width={1200}
                  height={800}
                  priority
                  className="h-auto max-h-[340px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle
            eyebrow="Vị trí tuyển dụng"
            title="Các vị trí đang tuyển tại THL"
            description={`Chọn theo nhóm để xem nhanh công việc phù hợp. Hiện có ${recruitmentJobs.length} vị trí đang tuyển.`}
          />
          <RecruitmentJobsPanel />
        </section>

        <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.5)] sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <SectionTitle
              eyebrow="Môi trường làm việc"
              title={recruitmentEnvironment.title}
              description={recruitmentEnvironment.content[0]}
            />
            <p className="text-sm leading-relaxed text-slate-700">{recruitmentEnvironment.content[1]}</p>
            <p className="text-sm leading-relaxed text-slate-700">{recruitmentEnvironment.content[2]}</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
            <Image
              src={recruitmentEnvironment.image}
              alt={recruitmentEnvironment.imageAlt}
              width={1200}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <SectionTitle
              eyebrow="Thông tin ứng tuyển"
              title={recruitmentApplyGuide.title}
              description={recruitmentApplyGuide.intro}
            />
            <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
              {recruitmentApplyGuide.checklist.map((item) => (
                <li key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-700">{recruitmentApplyGuide.outro}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50">
                <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  Liên hệ bộ phận tuyển dụng
                </a>
              </Button>
              <Button asChild variant="outline" className="border-slate-300 text-slate-900 hover:bg-slate-100">
                <a href={siteConfig.phoneHref}>
                  <PhoneCall className="mr-2 size-4" />
                  Gọi tuyển dụng
                </a>
              </Button>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.45)] sm:p-6">
                Đang tải form ứng tuyển...
              </div>
            }
          >
            <RecruitmentForm />
          </Suspense>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] sm:p-6">
          <h2 className="font-heading text-2xl font-semibold text-slate-900">
            Cùng THL phát triển sự nghiệp trong ngành vật tư công nghiệp
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Gia nhập đội ngũ làm việc với khách hàng nhà máy, bảo trì, kỹ thuật và mua hàng B2B.
            THL tìm kiếm những người nghiêm túc, chịu học, có trách nhiệm và muốn gắn bó lâu dài.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50">
              <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                Trao đổi với bộ phận tuyển dụng
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
