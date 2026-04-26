export type IndustryApplication = {
  slug: string;
  name: string;
  description: string;
  commonParts: string[];
  image: string;
  imagePrompt: string;
  imageAlt: string;
  imageStyleTag: string;
};

export const industryApplications: IndustryApplication[] = [
  {
    slug: "may-go",
    name: "Máy gỗ",
    description: "Máy cưa, máy bào, máy chà nhám, máy phay gỗ — các cụm trục, đỡ và truyền động cần thay thế định kỳ do bụi gỗ và tải liên tục.",
    commonParts: ["Vòng bi", "Gối đỡ", "Dây curoa", "Phớt chặn dầu"],
    image: "/images/cards/industry-may-go.webp",
    imagePrompt:
      "Máy cưa gỗ công nghiệp đang vận hành trong xưởng gỗ, thấy rõ trục quay và hệ truyền động, bụi gỗ nhẹ trong không khí, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Máy cưa gỗ công nghiệp đang vận hành với trục quay và hệ truyền động",
    imageStyleTag: "industry-app",
  },
  {
    slug: "cnc",
    name: "CNC",
    description: "Máy phay CNC, tiện CNC, trung tâm gia công — yêu cầu vòng bi chính xác cao, ball screw và phớt chặn dầu chịu tốc độ.",
    commonParts: ["Vòng bi chính xác", "Phớt chặn dầu", "Mỡ bôi trơn"],
    image: "/images/cards/industry-cnc.webp",
    imagePrompt:
      "Máy phay CNC đang gia công kim loại, close-up trục chính quay tốc độ cao với phoi kim loại, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Máy phay CNC đang gia công kim loại, trục chính quay tốc độ cao",
    imageStyleTag: "industry-app",
  },
  {
    slug: "ep-nhua",
    name: "Ép nhựa",
    description: "Máy ép nhựa, máy thổi — cụm kẹp, cụm phun và hệ thống thủy lực cần vòng bi chịu tải nặng và phớt giữ kín.",
    commonParts: ["Vòng bi", "Phớt chặn dầu", "Mỡ bôi trơn"],
    image: "/images/cards/industry-ep-nhua.webp",
    imagePrompt:
      "Máy ép nhựa công nghiệp trong nhà máy, thấy rõ cụm kẹp và hệ thống thủy lực đang vận hành, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Máy ép nhựa công nghiệp với cụm kẹp và hệ thống thủy lực",
    imageStyleTag: "industry-app",
  },
  {
    slug: "bom-quat-dong-co",
    name: "Bơm / Quạt / Động cơ",
    description: "Bơm nước, bơm hóa chất, quạt công nghiệp, motor — vòng bi và phớt chặn dầu là nhóm thay thế thường xuyên nhất.",
    commonParts: ["Vòng bi", "Phớt chặn dầu", "Mỡ bôi trơn", "Dây curoa"],
    image: "/images/cards/industry-bom-quat.webp",
    imagePrompt:
      "Cụm bơm nước công nghiệp và quạt hút gió trong nhà máy, thấy rõ motor điện và cụm truyền động dây curoa, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Cụm bơm nước và quạt công nghiệp với motor và truyền động dây curoa",
    imageStyleTag: "industry-app",
  },
  {
    slug: "bang-tai-truyen-dong",
    name: "Băng tải / Truyền động",
    description: "Hệ băng tải xích, băng tải con lăn, cơ cấu truyền động — xích, vòng bi, gối đỡ và dây curoa là nhóm vật tư chính.",
    commonParts: ["Xích công nghiệp", "Vòng bi", "Gối đỡ", "Dây curoa"],
    image: "/images/cards/industry-bang-tai.webp",
    imagePrompt:
      "Hệ băng tải xích và con lăn trong dây chuyền sản xuất, thấy rõ nhông xích và gối đỡ trục, realistic industrial B2B photography, clean lighting, professional, no cartoon, no oversized logos, no poster-style collage, 16:9 aspect ratio",
    imageAlt: "Hệ băng tải xích và con lăn trong dây chuyền sản xuất công nghiệp",
    imageStyleTag: "industry-app",
  },
];
