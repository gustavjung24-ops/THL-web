export type BrandLogo = {
  id: string;
  name: string;
  src: string;
  alt: string;
};

export const brandLogos: BrandLogo[] = [
  {
    id: "ntn",
    name: "NTN",
    src: "/images/brands/ntn-logo.png",
    alt: "Logo NTN",
  },
  {
    id: "koyo",
    name: "Koyo",
    src: "/images/brands/koyo-logo.png",
    alt: "Logo Koyo",
  },
  {
    id: "tsubaki",
    name: "Tsubaki",
    src: "/images/brands/tsubaki-logo.png",
    alt: "Logo Tsubaki",
  },
  {
    id: "soho",
    name: "Soho",
    src: "/images/brands/soho-logo.png",
    alt: "Logo Soho",
  },
];

export const brandDescriptions: Record<string, string> = {
  ntn: "Vòng bi Nhật NTN",
  koyo: "Vòng bi · Gối đỡ",
  tsubaki: "Xích công nghiệp",
  soho: "Vật tư truyền động",
};

export const productGroupBrandMap: Record<string, string[]> = {
  ntn: ["ntn"],
  koyo: ["koyo"],
  tsubaki: ["tsubaki"],
  soho: ["soho"],
};

export const customerSolutionBrandMap: Record<string, string[]> = {
  "Nhà máy sản xuất": ["ntn", "koyo"],
  "Bộ phận bảo trì": ["ntn", "koyo"],
  "Bộ phận kỹ thuật": ["ntn", "tsubaki"],
  "Bộ phận mua hàng": ["ntn", "soho"],
  "Xưởng cơ khí trong KCN": ["koyo", "tsubaki"],
  "Xưởng chế tạo máy": ["ntn", "koyo"],
  "Nhà thầu cơ điện / lắp đặt công nghiệp": ["tsubaki", "soho"],
  "Khách công nghiệp cần thay thế định kỳ": ["ntn", "koyo"],
};
