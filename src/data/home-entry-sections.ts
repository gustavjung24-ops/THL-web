export type HomeEntryCard = {
  slug: string;
  title: string;
  description: string;
  image: string;
  href: string;
  ctaLabel: string;
};

/** Cụm 1: Nhóm sản phẩm chính trên homepage */
export const productEntryCards: HomeEntryCard[] = [
  {
    slug: "vong-bi",
    title: "Vòng bi công nghiệp",
    description: "Đối chiếu mã theo cụm máy, tải và môi trường vận hành thực tế.",
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
    href: "/san-pham/vong-bi",
    ctaLabel: "Xem vòng bi",
  },
  {
    slug: "goi-do",
    title: "Gối đỡ vòng bi",
    description: "Chọn gối đỡ theo kiểu lắp, đường kính trục và vị trí đỡ trong dây chuyền.",
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
    href: "/san-pham/goi-do",
    ctaLabel: "Xem gối đỡ",
  },
  {
    slug: "xich-cong-nghiep",
    title: "Xích công nghiệp DID",
    description: "Đối chiếu bước xích, số mắt và tải cho băng tải, dây chuyền sản xuất.",
    image: "/images/industry/xich-did.jpg",
    href: "/san-pham/xich-cong-nghiep",
    ctaLabel: "Xem xích công nghiệp",
  },
  {
    slug: "phot-chan-dau",
    title: "Phớt chặn dầu NOK",
    description: "Tư vấn theo kích thước trục-vỏ và yêu cầu giữ kín trong cụm quay.",
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
    href: "/san-pham/phot-chan-dau",
    ctaLabel: "Xem phớt chặn dầu",
  },
];

/** Cụm 2: Giải pháp theo vai trò / ngành máy */
export const solutionEntryCards: HomeEntryCard[] = [
  {
    slug: "bao-tri",
    title: "Bảo trì nhà máy",
    description: "Đối chiếu mã gấp, xử lý thay thế khi máy dừng đột xuất.",
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
    href: "/giai-phap-theo-khach-hang",
    ctaLabel: "Xem giải pháp bảo trì",
  },
  {
    slug: "ky-thuat",
    title: "Kỹ thuật thiết bị",
    description: "Xác nhận thông số theo tải, tốc độ và điều kiện vận hành thực tế.",
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
    href: "/giai-phap-theo-khach-hang",
    ctaLabel: "Xem giải pháp kỹ thuật",
  },
  {
    slug: "mua-hang",
    title: "Mua hàng kỹ thuật",
    description: "Tách rõ thông tin kỹ thuật và đặt hàng để xử lý đề nghị mua nhanh.",
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
    href: "/giai-phap-theo-khach-hang",
    ctaLabel: "Xem giải pháp mua hàng",
  },
  {
    slug: "chu-xuong",
    title: "Chủ xưởng / Cơ điện",
    description: "Định hướng nhóm hàng theo vị trí máy, mức tải và vận hành dài hạn.",
    image: "/images/industry/xich-did.jpg",
    href: "/giai-phap-theo-khach-hang",
    ctaLabel: "Xem giải pháp xưởng",
  },
];
