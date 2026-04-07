export type IndustryApplication = {
  slug: string;
  name: string;
  description: string;
  commonParts: string[];
  image: string;
};

export const industryApplications: IndustryApplication[] = [
  {
    slug: "may-go",
    name: "Máy gỗ",
    description: "Máy cưa, máy bào, máy chà nhám, máy phay gỗ — các cụm trục, đỡ và truyền động cần thay thế định kỳ do bụi gỗ và tải liên tục.",
    commonParts: ["Vòng bi", "Gối đỡ", "Dây curoa", "Phớt chặn dầu"],
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
  },
  {
    slug: "cnc",
    name: "CNC",
    description: "Máy phay CNC, tiện CNC, trung tâm gia công — yêu cầu vòng bi chính xác cao, ball screw và phớt chặn dầu chịu tốc độ.",
    commonParts: ["Vòng bi chính xác", "Phớt chặn dầu", "Mỡ bôi trơn"],
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
  },
  {
    slug: "ep-nhua",
    name: "Ép nhựa",
    description: "Máy ép nhựa, máy thổi — cụm kẹp, cụm phun và hệ thống thủy lực cần vòng bi chịu tải nặng và phớt giữ kín.",
    commonParts: ["Vòng bi", "Phớt chặn dầu", "Mỡ bôi trơn"],
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
  },
  {
    slug: "bom-quat-dong-co",
    name: "Bơm / Quạt / Động cơ",
    description: "Bơm nước, bơm hóa chất, quạt công nghiệp, motor — vòng bi và phớt chặn dầu là nhóm thay thế thường xuyên nhất.",
    commonParts: ["Vòng bi", "Phớt chặn dầu", "Mỡ bôi trơn", "Dây curoa"],
    image: "/images/backgrounds/he-sinh-thai-home.jpeg",
  },
  {
    slug: "bang-tai-truyen-dong",
    name: "Băng tải / Truyền động",
    description: "Hệ băng tải xích, băng tải con lăn, cơ cấu truyền động — xích, vòng bi, gối đỡ và dây curoa là nhóm vật tư chính.",
    commonParts: ["Xích công nghiệp", "Vòng bi", "Gối đỡ", "Dây curoa"],
    image: "/images/industry/xich-did.jpg",
  },
];
