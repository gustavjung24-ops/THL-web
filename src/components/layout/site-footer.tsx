import Image from "next/image";
import Link from "next/link";
import { Clock3, Globe, MessageCircle, PhoneCall } from "lucide-react";
import { footerMenu, siteConfig } from "@/config/site";

const footerContactItems = [
  { label: siteConfig.phone, href: siteConfig.phoneHref, Icon: PhoneCall },
  { label: siteConfig.zaloLabel, href: siteConfig.zaloLink, Icon: MessageCircle, external: true },
  { label: siteConfig.supportArea, Icon: Globe },
  { label: `Giá» pháº£n há»“i: ${siteConfig.responseTime}`, Icon: Clock3 },
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
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div className="space-y-3">
          <Link href="/" className="inline-block">
            <Image
              src="/images/branding/logo-new.png"
              alt={siteConfig.brandName}
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-slate-600">{siteConfig.slogan}</p>
          <p className="text-sm text-slate-600">
            KÃªnh tÆ° váº¥n cÃ¡ nhÃ¢n táº­p trung váº­t tÆ° truyá»n Ä‘á»™ng cho nhÃ  mÃ¡y, bá»™ pháº­n báº£o trÃ¬, ká»¹ thuáº­t vÃ  mua hÃ ng.
          </p>
          <p className="text-xs text-slate-500">KÃªnh tÆ° váº¥n há»— trá»£ ká»¹ thuáº­t thuá»™c PhÃ²ng Kinh Doanh, khÃ´ng pháº£i website chÃ­nh thá»©c cá»§a cÃ´ng ty.</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-base font-semibold text-slate-900">Menu phá»¥</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {footerMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-blue-800">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-base font-semibold text-slate-900">ThÃ´ng tin liÃªn há»‡</h3>
          <ul className="space-y-3 text-sm text-slate-600">
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
      <div className="border-t border-slate-200 px-4 py-4 text-right text-xs text-slate-400 sm:px-6">{siteConfig.footerCredit}</div>
    </footer>
  );
}

