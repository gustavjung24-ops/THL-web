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

/** Cụm 1: Nhóm thương hiệu chính trên homepage */
export const productEntryCards: HomeEntryCard[] = [
  {
    slug: "ntn",
    title: "NTN",
    description: "Vòng bi Nhật NTN là nhóm chủ đạo cho nhu cầu bảo trì nhà máy.",
    image: "/images/cards/product-vong-bi.webp",
    imagePrompt:
      "Kỹ thuật viên cầm vòng bi tại xưởng công nghiệp, phía sau là máy móc và kệ vật tư, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Kỹ thuật viên cầm vòng bi công nghiệp trong xưởng sản xuất",
    imageStyleTag: "product-hero",
    href: "/san-pham/ntn",
    ctaLabel: "Xem NTN",
  },
  {
    slug: "koyo",
    title: "Koyo",
    description: "Vòng bi và gối đỡ Koyo cho cụm quay, cụm đỡ trục và dây chuyền.",
    image: "/images/cards/product-goi-do.webp",
    imagePrompt:
      "Cụm gối đỡ vòng bi gắn trên trục truyền động trong nhà máy, close-up rõ sản phẩm và bối cảnh ứng dụng thực tế, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Cụm gối đỡ vòng bi lắp trên trục truyền động trong dây chuyền nhà máy",
    imageStyleTag: "product-hero",
    href: "/san-pham/koyo",
    ctaLabel: "Xem Koyo",
  },
  {
    slug: "tsubaki",
    title: "Tsubaki",
    description: "Xích công nghiệp Tsubaki cho băng tải và cơ cấu truyền động.",
    image: "/images/cards/product-xich-cong-nghiep.jpg",
    imagePrompt:
      "Cụm truyền động xích trên dây chuyền công nghiệp, thấy rõ xích và nhông đang lắp thực tế, no oversized logo, realistic industrial B2B photography, clean lighting, professional, no cartoon, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Cụm truyền động xích công nghiệp trên dây chuyền sản xuất",
    imageStyleTag: "product-hero",
    href: "/san-pham/tsubaki",
    ctaLabel: "Xem Tsubaki",
  },
  {
    slug: "soho",
    title: "Soho",
    description: "Nhóm vật tư truyền động Soho cho phương án thay thế phù hợp tiến độ.",
    image: "/images/backgrounds/final-cta-industrial.png",
    imagePrompt:
      "Khu vực bảo trì nhà máy với dây curoa và vật tư truyền động Soho được sắp xếp gọn trên bàn kỹ thuật, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Vật tư truyền động Soho dùng trong khu vực bảo trì nhà máy",
    imageStyleTag: "product-hero",
    href: "/san-pham/soho",
    ctaLabel: "Xem Soho",
  },
  {
    slug: "nok",
    title: "NOK",
    description: "Phớt chặn dầu NOK cho cụm trục, hộp số, bơm và vị trí cần làm kín ổn định.",
    image: "/images/cards/product-phot-chan-dau.webp",
    imagePrompt:
      "Ảnh phớt chặn dầu NOK và vị trí làm kín trên trục máy công nghiệp, technical but realistic, clean background, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Phớt chặn dầu NOK lắp tại vị trí làm kín trên trục máy công nghiệp",
    imageStyleTag: "product-hero",
    href: "/san-pham/nok",
    ctaLabel: "Xem NOK",
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
