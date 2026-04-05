import Link from "next/link";
import { mainMenu, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900">{siteConfig.brandName}</h3>
          <p className="text-sm text-slate-600">{siteConfig.slogan}</p>
          <p className="text-sm text-slate-600">Kenh tu van ca nhan ve phu tung cong nghiep, tap trung xu ly nhu cau thuc te.</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900">Menu</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {mainMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-blue-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900">Lien he</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>{siteConfig.personalName}</li>
            <li>
              <a href={siteConfig.phoneHref} className="hover:text-blue-700">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={siteConfig.zaloLink} className="hover:text-blue-700" target="_blank" rel="noreferrer">
                {siteConfig.zaloLabel}
              </a>
            </li>
            <li>{siteConfig.email}</li>
            <li>{siteConfig.supportArea}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-right text-xs text-slate-400 sm:px-6">By Khuong Binh</div>
    </footer>
  );
}
