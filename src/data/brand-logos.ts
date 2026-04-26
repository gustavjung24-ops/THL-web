export type BrandLogo = {
  id: string;
  name: string;
  src: string;
  alt: string;
  role: "core" | "supporting";
};

export const brandLogos: BrandLogo[] = [
  {
    id: "ntn",
    name: "NTN",
    src: "/images/brands/ntn-logo.png",
    alt: "Logo NTN",
    role: "core",
  },
  {
    id: "tsubaki",
    name: "Tsubaki",
    src: "/images/brands/tsubaki-logo.png",
    alt: "Logo Tsubaki",
    role: "core",
  },
  {
    id: "koyo",
    name: "Koyo",
    src: "/images/brands/koyo-logo.png",
    alt: "Logo Koyo",
    role: "supporting",
  },
  {
    id: "nok",
    name: "NOK",
    src: "/images/brands/nok-corporation.png",
    alt: "Logo NOK",
    role: "supporting",
  },
  {
    id: "soho",
    name: "Soho",
    src: "/images/brands/soho-logo-transparent.png",
    alt: "Logo Soho V-Belt",
    role: "supporting",
  },
];

export const brandDescriptions: Record<string, string> = {
  ntn: "Chủ lực Nhật Bản · Vòng bi",
  tsubaki: "Chủ lực Nhật Bản · Xích truyền động",
  koyo: "Bổ trợ · Vòng bi, gối đỡ",
  nok: "Bổ trợ · Phớt làm kín",
  soho: "Bổ trợ · Vật tư truyền động",
};

export const productGroupBrandMap: Record<string, string[]> = {
  ntn: ["ntn"],
  tsubaki: ["tsubaki"],
  koyo: ["koyo"],
  nok: ["nok"],
  soho: ["soho"],
};

export const customerSolutionBrandMap: Record<string, string[]> = {
  "Nhà máy sản xuất": ["ntn", "tsubaki", "koyo", "nok"],
  "Bộ phận bảo trì": ["ntn", "tsubaki", "koyo", "nok"],
  "Bộ phận kỹ thuật": ["ntn", "tsubaki", "koyo", "nok"],
  "Bộ phận mua hàng": ["ntn", "tsubaki", "soho", "nok"],
  "Xưởng cơ khí trong KCN": ["ntn", "tsubaki", "koyo"],
  "Xưởng chế tạo máy": ["ntn", "tsubaki", "koyo"],
  "Nhà thầu cơ điện / lắp đặt công nghiệp": ["tsubaki", "ntn", "soho"],
  "Khách công nghiệp cần thay thế định kỳ": ["ntn", "tsubaki", "koyo", "nok"],
};
