import Image from "next/image";
import { Clock3, Mail, MapPin, MessageCircle, PhoneCall, UserRound } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata({
  title: "LiÃªn há»‡",
  description:
    "ThÃ´ng tin liÃªn há»‡ vÃ  form gá»­i nhu cáº§u há»— trá»£ tra mÃ£, tÆ° váº¥n nhÃ³m hÃ ng, bÃ¡o giÃ¡ phá»¥ tÃ¹ng cÃ´ng nghiá»‡p.",
  path: "/lien-he",
});

export default function ContactPage() {
  return (
    <div className="section-block">
      <div className="page-shell space-y-8">
        <SectionTitle
          eyebrow="LiÃªn há»‡"
          title="Trao Ä‘á»•i nhanh qua Ä‘iá»‡n thoáº¡i, Zalo hoáº·c form"
          description="Báº¡n cÃ³ thá»ƒ gá»­i thÃ´ng tin ngay Ä‘á»ƒ Ä‘Æ°á»£c há»— trá»£ tra mÃ£ vÃ  Ä‘á»‹nh hÆ°á»›ng nhÃ³m hÃ ng phÃ¹ há»£p nhu cáº§u thá»±c táº¿."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-22px_rgba(30,64,175,0.45)] sm:p-6">
            <Image
              src="/images/branding/logo-new.png"
              alt="Truyá»n Äá»™ng CÃ´ng Nghiá»‡p"
              width={160}
              height={56}
              className="h-12 w-auto"
            />
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <UserRound className="mt-0.5 size-4 text-blue-800" />
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
                <Mail className="mt-0.5 size-4 text-blue-800" />
                <span>{siteConfig.email}</span>
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
                  Gá»i ngay
                </a>
              </Button>
              <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-100">
                <a href={siteConfig.zaloLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  Chat Zalo
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

