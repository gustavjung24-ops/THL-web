export const siteConfig = {
  brandName: "Truyền Động Công Nghiệp",
  domain: "luanphutung.vn",
  slogan: "Tra mã đúng cụm máy - tư vấn đúng ứng dụng - phản hồi nhanh",
  personalName: "Khương Bình",
  phone: "0934 581 487",
  phoneHref: "tel:0934581487",
  zaloLabel: "Zalo hỗ trợ",
  zaloLink: "https://zalo.me/0934581487",
  email: "khuongbinh@tanhoaloi.net",
  supportArea: "Hỗ trợ: Toàn quốc",
  responseTime: "Phản hồi trong giờ hành chính hoặc theo nhu cầu xử lý nhanh",
  address: "Dĩ An Bình Dương / Phú Thạnh Tân Phú HCM",
  defaultOgImage: "/images/branding/og-industrial.svg",
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
  { label: "Gửi mã cần hỗ trợ", href: "/tra-ma-bao-gia" },
  { label: "Chat Zalo", href: siteConfig.zaloLink, external: true },
  { label: "Gọi nhanh bộ phận tư vấn", href: siteConfig.phoneHref },
] as const;
