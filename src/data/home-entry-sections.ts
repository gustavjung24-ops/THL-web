export type HomeEntryCard = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imagePrompt: string;
  imageAlt: string;
  imageStyleTag: string;
  href: string;
  ctaLabel: string;
};

/** Cụm 1: Nhóm sản phẩm chính trên homepage */
export const productEntryCards: HomeEntryCard[] = [
  {
    slug: "vong-bi",
    title: "Vòng bi công nghiệp",
    description: "Đối chiếu mã theo cụm máy, tải và môi trường vận hành thực tế.",
    image: "/images/cards/product-vong-bi.webp",
    imagePrompt:
      "Kỹ thuật viên cầm vòng bi tại xưởng công nghiệp, phía sau là máy móc và kệ vật tư, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Kỹ thuật viên cầm vòng bi công nghiệp trong xưởng sản xuất",
    imageStyleTag: "product-hero",
    href: "/san-pham/vong-bi",
    ctaLabel: "Xem vòng bi",
  },
  {
    slug: "goi-do",
    title: "Gối đỡ vòng bi",
    description: "Chọn gối đỡ theo kiểu lắp, đường kính trục và vị trí đỡ trong dây chuyền.",
    image: "/images/cards/product-goi-do.webp",
    imagePrompt:
      "Cụm gối đỡ vòng bi gắn trên trục truyền động trong nhà máy, close-up rõ sản phẩm và bối cảnh ứng dụng thực tế, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Cụm gối đỡ vòng bi lắp trên trục truyền động trong dây chuyền nhà máy",
    imageStyleTag: "product-hero",
    href: "/san-pham/goi-do",
    ctaLabel: "Xem gối đỡ",
  },
  {
    slug: "xich-cong-nghiep",
    title: "Xích công nghiệp DID",
    description: "Đối chiếu bước xích, số mắt và tải cho băng tải, dây chuyền sản xuất.",
    image: "/images/cards/product-xich-cong-nghiep.jpg",
    imagePrompt:
      "Cụm truyền động xích trên dây chuyền công nghiệp, thấy rõ xích và nhông đang lắp thực tế, no oversized logo, realistic industrial B2B photography, clean lighting, professional, no cartoon, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Cụm truyền động xích công nghiệp trên dây chuyền sản xuất",
    imageStyleTag: "product-hero",
    href: "/san-pham/xich-cong-nghiep",
    ctaLabel: "Xem xích công nghiệp",
  },
  {
    slug: "phot-chan-dau",
    title: "Phớt chặn dầu NOK",
    description: "Tư vấn theo kích thước trục-vỏ và yêu cầu giữ kín trong cụm quay.",
    image: "/images/cards/product-phot-chan-dau.webp",
    imagePrompt:
      "Ảnh phớt chặn dầu và vị trí làm kín trên trục máy công nghiệp, technical but realistic, clean background, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Phớt chặn dầu NOK lắp tại vị trí làm kín trên trục máy công nghiệp",
    imageStyleTag: "product-hero",
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
    image: "/images/cards/solution-bao-tri.webp",
    imagePrompt:
      "Nhân sự bảo trì kiểm tra cụm máy, cầm mẫu linh kiện thay thế trong xưởng công nghiệp, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Nhân viên bảo trì nhà máy kiểm tra cụm máy và linh kiện thay thế",
    imageStyleTag: "solution-role",
    href: "/giai-phap-theo-khach-hang/bao-tri",
    ctaLabel: "Xem giải pháp bảo trì",
  },
  {
    slug: "ky-thuat",
    title: "Kỹ thuật thiết bị",
    description: "Xác nhận thông số theo tải, tốc độ và điều kiện vận hành thực tế.",
    image: "/images/cards/solution-ky-thuat.webp",
    imagePrompt:
      "Kỹ thuật viên đo kích thước trục và kiểm tra cụm ổ trục bằng thước kẹp, realistic factory environment, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Kỹ thuật viên đo kích thước trục và kiểm tra cụm ổ trục trong nhà máy",
    imageStyleTag: "solution-role",
    href: "/giai-phap-theo-khach-hang/ky-thuat",
    ctaLabel: "Xem giải pháp kỹ thuật",
  },
  {
    slug: "mua-hang",
    title: "Mua hàng kỹ thuật",
    description: "Tách rõ thông tin kỹ thuật và đặt hàng để xử lý đề nghị mua nhanh.",
    image: "/images/cards/solution-mua-hang.webp",
    imagePrompt:
      "Nhân sự mua hàng kỹ thuật đối chiếu mã, catalog, tem hàng và danh sách vật tư trên bàn làm việc công nghiệp, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Nhân viên mua hàng kỹ thuật đối chiếu mã và catalog vật tư tại bàn làm việc",
    imageStyleTag: "solution-role",
    href: "/giai-phap-theo-khach-hang/mua-hang",
    ctaLabel: "Xem giải pháp mua hàng",
  },
  {
    slug: "chu-xuong",
    title: "Chủ xưởng / Cơ điện",
    description: "Định hướng nhóm hàng theo vị trí máy, mức tải và vận hành dài hạn.",
    image: "/images/cards/solution-chu-xuong.webp",
    imagePrompt:
      "Chủ xưởng và kỹ thuật trao đổi nhanh trước cụm máy sản xuất, industrial realistic, professional, realistic industrial B2B photography, clean lighting, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Chủ xưởng và kỹ thuật viên trao đổi trước cụm máy sản xuất",
    imageStyleTag: "solution-role",
    href: "/giai-phap-theo-khach-hang/chu-xuong",
    ctaLabel: "Xem giải pháp xưởng",
  },
];
