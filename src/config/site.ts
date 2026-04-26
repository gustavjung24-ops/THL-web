export const siteConfig = {
  brandName: "Truyền Động Công Nghiệp",
  domain: "luanphutung.vn",
  slogan: "NTN chủ đạo - Koyo, Tsubaki, Soho - tra mã nhanh cho nhà máy",
  personalName: "Khương Bình",
  phone: "0902 964 685",
  phoneHref: "tel:0902964685",
  zaloLabel: "Zalo hỗ trợ",
  zaloLink: "https://zalo.me/0902964685",
  email: "khuongbinh.info@gmail.com",
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
