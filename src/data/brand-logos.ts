export type BrandLogo = {
  id: string;
  name: string;
  src: string;
  alt: string;
};

export const brandLogos: BrandLogo[] = [
  {
    id: "koyo-jtekt",
    name: "KOYO / JTEKT",
    src: "/images/brands/koyo-jtekt.png",
    alt: "Logo KOYO và JTEKT",
  },
  {
    id: "did",
    name: "DID",
    src: "/images/brands/did.png",
    alt: "Logo DID",
  },
  {
    id: "nok",
    name: "NOK",
    src: "/images/brands/nok.png",
    alt: "Logo NOK",
  },
  {
    id: "mitsuba",
    name: "MITSUBA",
    src: "/images/brands/mitsuba.png",
    alt: "Logo MITSUBA",
  },
  {
    id: "sunrise",
    name: "SUNRISE",
    src: "/images/brands/sunrise.png",
    alt: "Logo SUNRISE",
  },
  {
    id: "dingzing",
    name: "DINGZING",
    src: "/images/brands/dingzing.png",
    alt: "Logo DINGZING",
  },
];

export const brandDescriptions: Record<string, string> = {
  "koyo-jtekt": "Vòng bi · Gối đỡ",
  "did": "Xích công nghiệp",
  "nok": "Phớt chặn dầu",
  "mitsuba": "Dây curoa",
  "sunrise": "Vòng bi · Dây curoa · Mỡ bôi trơn",
  "dingzing": "Phớt chặn dầu",
};

export const productGroupBrandMap: Record<string, string[]> = {
  "vong-bi": ["koyo-jtekt", "sunrise"],
  "goi-do": ["koyo-jtekt"],
  "day-curoa": ["mitsuba", "sunrise"],
  "xich-cong-nghiep": ["did"],
  "phot-chan-dau": ["nok", "dingzing"],
  "mo-boi-tron": ["sunrise"],
};

export const customerSolutionBrandMap: Record<string, string[]> = {
  "Nhà máy sản xuất": ["did", "koyo-jtekt"],
  "Bộ phận bảo trì": ["nok", "koyo-jtekt"],
  "Bộ phận kỹ thuật": ["koyo-jtekt", "mitsuba"],
  "Bộ phận mua hàng": ["nok", "sunrise"],
  "Xưởng cơ khí trong KCN": ["did", "koyo-jtekt"],
  "Xưởng chế tạo máy": ["did", "nok"],
  "Nhà thầu cơ điện / lắp đặt công nghiệp": ["did", "sunrise"],
  "Khách công nghiệp cần thay thế định kỳ": ["nok", "sunrise"],
};
