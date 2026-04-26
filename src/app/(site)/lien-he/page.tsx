import Image from "next/image";
import { Building2, Clock3, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata({
  title: "Liên hệ phòng kinh doanh",
  description:
    "Liên hệ Công Ty TNHH Tân Hòa Lợi để gửi nhu cầu vật tư truyền động công nghiệp NTN, Tsubaki và nhóm thương hiệu bổ trợ cho nhà máy.",
  path: "/lien-he",
});

export default function ContactPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <SectionTitle
          eyebrow="Liên hệ THL"
          title="Gửi nhu cầu vật tư truyền động cho Phòng Kinh Doanh"
          description="THL tiếp nhận mã hàng, ảnh tem, thông tin cụm máy hoặc yêu cầu đặt hàng để đối chiếu nhóm NTN, Tsubaki và vật tư bổ trợ phù hợp."
        />

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.45)] sm:p-6">
            <div className="inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Image src="/images/brands/ntn-logo.png" alt="Logo NTN" width={116} height={40} className="h-8 w-auto object-contain" />
              <span className="h-8 w-px bg-slate-200" aria-hidden />
              <Image src="/images/brands/tsubaki-logo.png" alt="Logo Tsubaki" width={132} height={40} className="h-7 w-auto object-contain" />
            </div>

            <div>
              <p className="font-semibold text-slate-950">Công Ty TNHH Tân Hòa Lợi</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Nhà phân phối chính thức NTN & Tsubaki cho vật tư truyền động công nghiệp.
              </p>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <Building2 className="mt-0.5 size-4 text-blue-800" />
                <span>{siteConfig.personalName}</span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="mt-0.5 size-4 text-blue-800" />
                <a href={siteConfig.phoneHref} className="hover:text-blue-800">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 size-4 text-blue-800" />
                <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer" className="hover:text-blue-800">
                  {siteConfig.zaloLabel}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-blue-800" />
                <span>{siteConfig.supportArea}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock3 className="mt-0.5 size-4 text-blue-800" />
                <span>{siteConfig.responseTime}</span>
              </li>
            </ul>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild className="bg-blue-800 hover:bg-blue-900">
                <a href={siteConfig.phoneHref}>
                  <PhoneCall className="mr-2 size-4" />
                  Liên hệ B2B
                </a>
              </Button>
              <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-100">
                <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  Zalo kinh doanh
                </a>
              </Button>
            </div>
          </section>

          <section>
            <ContactForm />
          </section>
        </div>
      </div>
    </div>
  );
}
