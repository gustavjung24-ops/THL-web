export const siteConfig = {
  brandName: "Luan Phu Tung",
  domain: "luanphutung.vn",
  slogan: "Tra dung ma - tu van dung hang - ho tro nhanh",
  personalName: "[Ten ca nhan]",
  phone: "[So dien thoai]",
  phoneHref: "tel:[So dien thoai]",
  zaloLabel: "[Zalo Placeholder]",
  zaloLink: "https://zalo.me/[zalo-id]",
  email: "[Email Placeholder]",
  supportArea: "[Khu vuc ho tro]",
  responseTime: "07:30 - 21:00 moi ngay",
  defaultOgImage: "/images/og-industrial.jpg",
};

export const mainMenu = [
  { label: "Trang chu", href: "/" },
  { label: "Gioi thieu", href: "/gioi-thieu" },
  { label: "San pham", href: "/san-pham" },
  { label: "Giai phap theo khach hang", href: "/giai-phap-theo-khach-hang" },
  { label: "Tra ma / Bao gia", href: "/tra-ma-bao-gia" },
  { label: "Kien thuc", href: "/kien-thuc" },
  { label: "Lien he", href: "/lien-he" },
] as const;

export const quickActions = [
  { label: "Gui ma can tim", href: "/tra-ma-bao-gia" },
  { label: "Chat Zalo", href: siteConfig.zaloLink, external: true },
  { label: "Goi ngay", href: siteConfig.phoneHref },
] as const;
