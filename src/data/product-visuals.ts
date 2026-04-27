import { resolveProductCardImage } from "@/lib/image-resolver";

type ProductVisual = {
  image: string;
  imageAlt: string;
};

const productVisualMeta: Record<string, { fallback: string; imageAlt: string }> = {
  ntn: {
    fallback: "/images/cards/product-vong-bi.webp",
    imageAlt: "Kỹ thuật viên kiểm tra vòng bi NTN trong xưởng công nghiệp",
  },
  tsubaki: {
    fallback: "/images/cards/product-xich-cong-nghiep.jpg",
    imageAlt: "Xích công nghiệp Tsubaki dùng cho truyền động và băng tải",
  },
  koyo: {
    fallback: "/images/cards/product-goi-do.webp",
    imageAlt: "Cụm vòng bi và gối đỡ Koyo trong dây chuyền công nghiệp",
  },
  nok: {
    fallback: "/images/cards/product-phot-chan-dau.webp",
    imageAlt: "Phớt chặn dầu NOK dùng cho cụm trục và hộp số công nghiệp",
  },
  soho: {
    fallback: "/images/backgrounds/final-cta-industrial.png",
    imageAlt: "Khu vực bảo trì nhà máy dùng vật tư truyền động Soho",
  },
};

export const productVisuals: Record<string, ProductVisual> = Object.fromEntries(
  Object.entries(productVisualMeta).map(([slug, meta]) => [
    slug,
    {
      image: resolveProductCardImage(slug, meta.fallback),
      imageAlt: meta.imageAlt,
    },
  ]),
);

export const defaultProductVisual: ProductVisual = {
  image: "/images/backgrounds/he-sinh-thai-home.jpeg",
  imageAlt: "Vật tư truyền động công nghiệp trong nhà máy",
};

export function getProductVisual(slug: string) {
  return productVisuals[slug] ?? defaultProductVisual;
}

export const productBenefitBullets = [
  "Đối chiếu theo mã cũ, kích thước và vị trí lắp thực tế",
  "Ưu tiên NTN và Tsubaki, đồng thời mở rộng sang Koyo/NOK/Soho đúng điều kiện ứng dụng",
  "Hỗ trợ phương án thay thế chính thức khi cần đảm bảo tiến độ nhà máy",
];
