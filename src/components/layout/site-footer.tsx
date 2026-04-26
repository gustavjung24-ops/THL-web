import Image from "next/image";
import Link from "next/link";
import { Clock3, Globe, MessageCircle, PhoneCall } from "lucide-react";
import { footerMenu, siteConfig } from "@/config/site";

const footerContactItems = [
  { label: siteConfig.phone, href: siteConfig.phoneHref, Icon: PhoneCall },
  { label: siteConfig.zaloLabel, href: siteConfig.zaloLink, Icon: MessageCircle, external: true },
  { label: siteConfig.supportArea, Icon: Globe },
  { label: `Giờ phản hồi: ${siteConfig.responseTime}`, Icon: Clock3 },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-50">
      <Image
        src="/images/branding/hero-industrial.svg"
        alt=""
        width={800}
        height={520}
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-24 h-auto w-[50%] max-w-none select-none opacity-[0.04] blur-[2px] sm:opacity-[0.055]"
      />
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:py-7">
        <div className="space-y-2.5">
          <Link href="/" className="inline-block">
            <Image
              src="/images/brands/ntn-logo.png"
              alt="Logo NTN"
              width={132}
              height={44}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <p className="text-sm leading-relaxed text-slate-600">{siteConfig.slogan}</p>
          <p className="text-sm leading-relaxed text-slate-600">
            Kênh tư vấn cá nhân tập trung vật tư truyền động cho nhà máy, bộ phận bảo trì, kỹ thuật và mua hàng.
          </p>
          <p className="text-xs leading-relaxed text-slate-500">Kênh tư vấn thuộc Phòng Kinh Doanh của Công Ty TNHH Tân Hòa Lợi.</p>
        </div>

        <div className="space-y-2.5">
          <h3 className="font-heading text-base font-semibold text-slate-900">Menu phụ</h3>
          <ul className="space-y-1.5 text-sm text-slate-600">
            {footerMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-blue-800">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="font-heading text-base font-semibold text-slate-900">Thông tin liên hệ</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {footerContactItems.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5">
                <item.Icon className="size-4 shrink-0 text-blue-800" />
                {"href" in item && item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-blue-800"
                    {...("external" in item && item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-2 text-right text-xs text-slate-400 sm:px-6">{siteConfig.footerCredit}</div>
    </footer>
  );
}
