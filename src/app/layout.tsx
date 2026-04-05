import type { Metadata } from "next";
import { Be_Vietnam_Pro, Exo_2 } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { MobileQuickActions } from "@/components/layout/mobile-quick-actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

const bodyFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const headingFont = Exo_2({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: `${siteConfig.brandName} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Kênh tư vấn cá nhân hỗ trợ tra mã, chọn hàng và báo giá phụ tùng công nghiệp cho cửa hàng, gara, xưởng và khách công nghiệp nhỏ.",
  openGraph: {
    title: `${siteConfig.brandName} | ${siteConfig.slogan}`,
    description:
      "Hỗ trợ tra mã, tư vấn đúng nhóm hàng và tiếp nhận nhu cầu báo giá nhanh qua điện thoại, Zalo và form.",
    type: "website",
    locale: "vi_VN",
    siteName: siteConfig.brandName,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.brandName} - ${siteConfig.slogan}`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("theme", bodyFont.variable, headingFont.variable)}>
      <body className={cn(bodyFont.className, "min-h-screen bg-background text-foreground antialiased")}> 
        <SiteHeader />
        <main className="pb-24 lg:pb-0">{children}</main>
        <SiteFooter />
        <MobileQuickActions />
      </body>
    </html>
  );
}
