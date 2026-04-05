export const siteConfig = {
  brandName: "Luan Phu Tung",
  domain: "luanphutung.vn",
  slogan: "Tra đúng mã - tư vấn đúng hàng - hỗ trợ nhanh",
  personalName: "[Tên cá nhân]",
  phone: "[Số điện thoại]",
  phoneHref: "tel:[so-dien-thoai]",
  zaloLabel: "[Zalo cá nhân]",
  zaloLink: "https://zalo.me/[zalo-id]",
  email: "[Email liên hệ]",
  supportArea: "[Khu vực hỗ trợ]",
  responseTime: "07:30 - 21:00 mỗi ngày",
  address: "[Địa chỉ hoặc điểm hỗ trợ]",
  defaultOgImage: "/images/og-industrial.svg",
  footerCredit: "By Khương Bình",
};

export const mainMenu = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Giải pháp theo khách hàng", href: "/giai-phap-theo-khach-hang" },
  { label: "Tra mã / Báo giá", href: "/tra-ma-bao-gia" },
  { label: "Kiến thức", href: "/kien-thuc" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

export const footerMenu = [
  { label: "Tra mã / Báo giá", href: "/tra-ma-bao-gia" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Giải pháp theo khách hàng", href: "/giai-phap-theo-khach-hang" },
  { label: "Kiến thức", href: "/kien-thuc" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

export const quickActions = [
  { label: "Gửi mã cần tìm", href: "/tra-ma-bao-gia" },
  { label: "Chat Zalo", href: siteConfig.zaloLink, external: true },
  { label: "Gọi ngay", href: siteConfig.phoneHref },
] as const;
