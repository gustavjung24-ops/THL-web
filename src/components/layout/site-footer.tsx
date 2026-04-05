import Link from "next/link";
import { footerMenu, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div className="space-y-3">
          <h3 className="font-heading text-base font-semibold text-slate-900">{siteConfig.brandName}</h3>
          <p className="text-sm text-slate-600">{siteConfig.slogan}</p>
          <p className="text-sm text-slate-600">
            Kênh tư vấn cá nhân tập trung vật tư truyền động cho nhà máy, bộ phận bảo trì, kỹ thuật và mua hàng.
          </p>
          <p className="text-xs text-slate-500">Kênh tư vấn hỗ trợ kỹ thuật thuộc Phòng Kinh Doanh, không phải website chính thức của công ty.</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-base font-semibold text-slate-900">Menu phụ</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {footerMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-amber-800">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-base font-semibold text-slate-900">Thông tin liên hệ</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>{siteConfig.personalName}</li>
            <li>
              <a href={siteConfig.phoneHref} className="hover:text-amber-800">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={siteConfig.zaloLink} className="hover:text-amber-800" target="_blank" rel="noreferrer">
                {siteConfig.zaloLabel}
              </a>
            </li>
            <li>{siteConfig.email}</li>
            <li>{siteConfig.address}</li>
            <li>{siteConfig.supportArea}</li>
            <li>Giờ phản hồi: {siteConfig.responseTime}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-right text-xs text-slate-400 sm:px-6">{siteConfig.footerCredit}</div>
    </footer>
  );
}
